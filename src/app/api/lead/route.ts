import { NextResponse } from 'next/server';
import { clarion, site } from '@/lib/site';

export const runtime = 'nodejs';
// Worst case is 3 upstream attempts at 5s plus backoff; give the function room so a retry
// sequence is never cut short by the platform timeout.
export const maxDuration = 25;

/**
 * Lead intake endpoint.
 *
 * Website form submissions ("Request a callback" / "Verify Insurance") are
 * delivered to ClarionLabs' public forms API (`/forms/public/submit`), which
 * records them as form submissions tied to this site's `site_key` and feeds
 * BEN (Clarion's insurance Verification-of-Benefits engine — the reason Date of
 * Birth is required). This is distinct from the chat widget, which uses the
 * separate webchat API.
 *
 * FW-02 — delivery contract. **Clarion is the only destination for a lead.** There is no
 * secondary inbox, queue or database by decision, which has a direct consequence: if Clarion
 * will not accept a submission, the lead is not captured anywhere. So this route must never
 * claim success it did not achieve.
 *
 * It used to return `{ok: true}` unconditionally and merely `console.error` the lead on
 * failure. Ten test submissions were verified failing with `403 origin not allowed` while all
 * ten showed the visitor a thank-you screen — the lead existed only in short-retention runtime
 * logs, with no alert. Now:
 *
 * - transient failures (network, timeout, 5xx, 429) are retried with backoff;
 * - a genuine rejection returns a non-2xx, and the form tells the visitor to call instead;
 * - **4xx from Clarion is never retried.** A 403 means this origin is not on Clarion's
 *   allowlist, and no amount of retrying fixes a configuration problem.
 *
 * Operational note: every origin that will POST must be allowlisted in Clarion → Website
 * Integrations — the apex, `www`, and each `.vercel.app` alias. Miss one and every submission
 * from that host 403s, which now surfaces as a visible error rather than silence.
 *
 * Clarion's edge also blocks non-browser User-Agents, hence the browser-like UA below.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/**
 * Rate limit (FW-03). A genuine admissions enquiry is a once-in-a-lifetime action, so the
 * ceiling can be low without ever inconveniencing a real visitor.
 *
 * Caveat worth knowing: this counter lives in the memory of a single serverless instance,
 * so a distributed flood spread across instances still gets through. It stops the trivial
 * case — one script hammering one endpoint — which is what the honeypot alone did not.
 * A shared store (Vercel KV / Upstash) or a CAPTCHA is the durable version; see FW-43.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Returns true when this caller has exceeded the window. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  // Opportunistic sweep so the map cannot grow without bound on a warm instance.
  for (const [key, times] of hits) {
    const kept = times.filter((t) => t > cutoff);
    if (kept.length === 0) hits.delete(key);
    else hits.set(key, kept);
  }

  const recent = (hits.get(ip) ?? []).filter((t) => t > cutoff);
  if (recent.length >= RATE_LIMIT_MAX) return true;

  recent.push(now);
  hits.set(ip, recent);
  return false;
}

type ClarionResult =
  | { ok: true; id?: string }
  | { ok: false; status?: number; body?: string; error?: string };

/** A failure worth retrying: nothing reached Clarion, or Clarion itself was unwell. */
function isTransient(r: ClarionResult): boolean {
  if (r.ok) return false;
  // No status at all means the request never completed — network error or our own timeout.
  if (r.status === undefined) return true;
  return r.status >= 500 || r.status === 429;
}

async function submitOnce(
  formKey: string,
  data: Record<string, string>,
  ctx: { origin: string; userAgent: string; pageUrl: string },
): Promise<ClarionResult> {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 5000);
  try {
    const res = await fetch(`${clarion.api}/forms/public/submit`, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Origin: ctx.origin, 'User-Agent': ctx.userAgent },
      body: JSON.stringify({
        site_key: clarion.siteKey,
        form_key: formKey,
        data,
        page_url: ctx.pageUrl,
        referrer: null,
        user_agent: ctx.userAgent,
        utm: null,
        gclid: null,
      }),
    });
    const body = await res.text().catch(() => '');
    if (!res.ok) return { ok: false, status: res.status, body: body.slice(0, 300) };
    let id: string | undefined;
    try {
      id = JSON.parse(body).id;
    } catch {
      /* ignore */
    }
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: String(err) };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Alert a human when a lead is rejected (FW-43).
 *
 * The gap this closes: since FW-02, a rejected submission tells the visitor to call — but nothing
 * told *us*. If an origin drops off Clarion's allowlist, every form lead fails and the only signal
 * is a visitor who may or may not phone. Analytics shows the conversion rate fall days later.
 *
 * Deliberately a plain webhook rather than an email provider: Slack, Discord and Teams incoming
 * webhooks all accept this payload unchanged, so it adds no dependency and no vendor decision. Set
 * `LEAD_ALERT_WEBHOOK_URL` in Vercel to switch it on; unset, it no-ops and says so once.
 *
 * Contains **no lead data** — the whole point of a failed lead is that we could not deliver the
 * PII, so putting it in a chat channel would be the wrong fix for the wrong problem. Diagnostics
 * only, same as the log line.
 *
 * Never throws and is capped at 2s: the visitor's error response must not wait on, or be broken
 * by, an alerting endpoint being slow or misconfigured.
 */
async function alertLeadFailure(detail: {
  formKey: string;
  origin: string;
  attempts: number;
  status?: number;
  upstream?: string;
}) {
  const url = process.env.LEAD_ALERT_WEBHOOK_URL;
  if (!url) return;

  const isAllowlist = detail.status === 403;
  const lines = [
    '🔴 *Fort Worth Wellness — a website lead was REJECTED and is not captured.*',
    `• form: \`${detail.formKey}\``,
    `• origin sent: \`${detail.origin}\``,
    `• upstream status: \`${detail.status ?? 'no response'}\` after ${detail.attempts} attempt(s)`,
    detail.upstream ? `• upstream said: \`${detail.upstream}\`` : '',
    isAllowlist
      ? `• *Likely cause:* \`${detail.origin}\` is not allowlisted in Clarion → Website Integrations. Every submission from this host will fail until it is added.`
      : '',
    'The visitor was told to call instead. No lead details are included in this alert.',
  ].filter(Boolean);

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 2000);
  try {
    await fetch(url, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lines.join('\n') }),
    });
  } catch {
    // eslint-disable-next-line no-console
    console.error('[lead] alert webhook failed — the rejection above went unannounced');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Submit, retrying only what retrying can actually fix.
 *
 * A 403 (origin not allowlisted) or 400 (bad payload) will fail identically every time, so
 * retrying those just makes the visitor wait before seeing the same error.
 */
async function submitToClarion(
  formKey: string,
  data: Record<string, string>,
  ctx: { origin: string; userAgent: string; pageUrl: string },
): Promise<{ result: ClarionResult; attempts: number }> {
  const backoffMs = [500, 1500];
  let result = await submitOnce(formKey, data, ctx);
  let attempts = 1;

  while (!result.ok && isTransient(result) && attempts <= backoffMs.length) {
    await new Promise((r) => setTimeout(r, backoffMs[attempts - 1]));
    result = await submitOnce(formKey, data, ctx);
    attempts += 1;
  }
  return { result, attempts };
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many requests. Please call us directly — we answer 24/7.`,
      },
      { status: 429, headers: { 'Retry-After': String(RATE_LIMIT_WINDOW_MS / 1000) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot — silently accept bots without doing anything
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: 'Name and phone are required.' }, { status: 400 });
  }

  const dob = String(body.dob ?? '').trim();
  const email = String(body.email ?? '').trim();
  const who = String(body.who ?? '').trim();
  const message = String(body.message ?? '').trim();
  const formKey = String(body.formKey ?? 'website-form').trim() || 'website-form';

  // Split full name for BEN (Verification of Benefits) which expects first/last.
  const parts = name.split(/\s+/);
  const firstName = parts[0] || name;
  const lastName = parts.slice(1).join(' ');

  // Field keys BEN / the CRM recognize, plus friendly copies.
  const data: Record<string, string> = {
    name,
    first_name: firstName,
    last_name: lastName || firstName,
    phone,
    email,
    date_of_birth: dob,
    seeking_for: who,
    message,
  };

  // Origin that Clarion must have allowlisted (the deployment's own origin).
  //
  // Deliberately NOT derived from the request's `Origin` header (FW-04): that header is
  // caller-controlled, so honouring it turned this route into an origin-laundering relay —
  // anyone could POST here with `Origin: https://whatever` and have us vouch for it against
  // Clarion's allowlist. `host` is set by the platform, so it reflects the real deployment.
  const host = req.headers.get('host') || '';
  const origin =
    process.env.CLARION_ORIGIN || (host ? `https://${host}` : site.url);

  const { result, attempts } = await submitToClarion(formKey, data, {
    origin,
    userAgent: req.headers.get('user-agent') || BROWSER_UA,
    pageUrl: req.headers.get('referer') || origin,
  });

  if (result.ok) {
    // eslint-disable-next-line no-console
    console.log(`[lead] accepted by Clarion (form_key=${formKey}, attempts=${attempts}):`, result.id);
    return NextResponse.json({ ok: true });
  }

  /*
   * Diagnostics only — deliberately no lead fields.
   *
   * This used to log the whole `data` object: name, phone, email and date of birth. Vercel
   * runtime logs are not a controlled store, and that is intake data for someone seeking
   * mental-health or substance-use treatment, so it does not belong there.
   *
   * The trade-off is explicit and follows from Clarion being the only destination: a rejected
   * lead is now genuinely unrecoverable rather than sitting in a log. That is why the visitor
   * is told the truth below instead of being shown a thank-you screen. What is logged is
   * everything needed to diagnose the cause — and a 403 here means an origin is missing from
   * Clarion's allowlist.
   */
  // eslint-disable-next-line no-console
  console.error('[lead] REJECTED by Clarion — lead NOT captured:', {
    formKey,
    origin,
    attempts,
    status: 'status' in result ? result.status : undefined,
    upstream: 'body' in result ? result.body : undefined,
    networkError: 'error' in result ? result.error : undefined,
    hint:
      'status' in result && result.status === 403
        ? `Origin ${origin} is not allowlisted in Clarion → Website Integrations.`
        : undefined,
  });

  // FW-43. Awaited rather than fired-and-forgotten: a serverless function can be frozen the moment
  // it responds, so a detached promise is not reliably delivered. Capped at 2s and cannot throw.
  await alertLeadFailure({
    formKey,
    origin,
    attempts,
    status: 'status' in result ? result.status : undefined,
    upstream: 'body' in result ? result.body : undefined,
  });

  return NextResponse.json(
    {
      ok: false,
      error: `We couldn't submit your request just now. Please call us at ${site.phone.display} — we answer 24/7 — and we'll take your details directly.`,
    },
    { status: 502 },
  );
}
