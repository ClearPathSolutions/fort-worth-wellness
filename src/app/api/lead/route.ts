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

/**
 * CallTrackingMetrics' visitor session id: 24 hex characters, no dashes (FW-46).
 *
 * Worth being strict about, because the failure is silent. A value of the wrong shape — most
 * likely some other store's UUID, which has dashes — is accepted by Clarion, returns 200, and
 * attaches the lead to no visit at all. An absent id is the honest outcome and `null` is the
 * correct thing to send; a plausible-looking wrong one is worse than nothing, because it looks
 * like the attribution is working.
 */
const CTM_ID = /^[0-9a-f]{24}$/i;

/**
 * The CTM id for this lead, preferring the browser's own read and falling back to the cookie.
 *
 * The fallback is the point of this function. `__ctmid` is a first-party cookie, so it is sent
 * on the request to this route automatically — which means a client-side regression (t.js
 * blocked by an extension, our own reader broken by a refactor) cannot silently un-attribute
 * every lead on the site. It is the difference between one bad deploy costing a day of
 * attribution and costing it until somebody notices, which on this fault means never.
 */
function ctmVisitorSid(body: Record<string, unknown>, req: Request): string | null {
  const fromClient = typeof body.ctm_visitor_sid === 'string' ? body.ctm_visitor_sid : null;
  if (fromClient && CTM_ID.test(fromClient)) return fromClient;

  const raw = req.headers.get('cookie')?.match(/(?:^|;\s*)__ctmid=([^;]*)/)?.[1];
  const fromCookie = raw ? decodeURIComponent(raw) : null;
  if (fromCookie && CTM_ID.test(fromCookie)) {
    if (fromClient) {
      // eslint-disable-next-line no-console
      console.warn('[lead] browser sent a non-CTM-shaped sid; using the __ctmid cookie instead');
    }
    return fromCookie;
  }

  if (fromClient) {
    // eslint-disable-next-line no-console
    console.warn('[lead] sid is not CTM-shaped and no __ctmid cookie — no visit will attach');
    return null;
  }
  // eslint-disable-next-line no-console
  console.warn('[lead] no CTM session id — t.js was likely blocked or had not loaded');
  return null;
}

/*
 * Attribution arrives from the browser, and this endpoint is public and unauthenticated, so
 * every value is caller-controlled and gets capped before being forwarded. Nothing here trusts
 * a length, a key count or a type.
 */
const MAX_VALUE_LEN = 512;
const MAX_UTM_KEYS = 12;

/**
 * Keys that must never be copied onto a plain object, whatever the caller calls them.
 *
 * A key regex is not enough: `JSON.parse('{"__proto__":{…}}')` produces a real *own* property,
 * so it survives `Object.entries` and `out['__proto__'] = {…}` would then reset the prototype
 * of the object being built. Assigning a string there is a silent no-op, but `session` carries
 * nested objects, so the vector is live and worth closing by name.
 */
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/* `session` is a nested object from an untrusted client; every dimension of it gets a ceiling. */
const SESSION_MAX_DEPTH = 4;
const SESSION_MAX_KEYS = 24;
const SESSION_MAX_ARRAY = 20;
const SESSION_MAX_BYTES = 4096;

/** A single caller-supplied string, or null. Never an object, never unbounded. */
function cappedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX_VALUE_LEN) : null;
}

/** `utm` as a flat string map, rebuilt key by key rather than passed through. */
function cappedUtm(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const out: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (Object.keys(out).length >= MAX_UTM_KEYS) break;
    // Rebuilt on a fresh object literal and key-filtered, so `__proto__` and friends cannot
    // ride in from a hostile payload.
    if (FORBIDDEN_KEYS.has(key)) continue;
    if (!/^[a-z0-9_]{1,32}$/i.test(key)) continue;
    const str = cappedString(raw);
    if (str) out[key] = str;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Rebuild an arbitrary caller-supplied value within fixed bounds.
 *
 * Rebuilt, never passed through: the object is shaped entirely by the client and this endpoint
 * is public and unauthenticated, so the only safe assumption is that any of it may be hostile
 * or enormous.
 */
function sanitizeValue(value: unknown, depth: number): unknown {
  if (value === null) return null;
  const type = typeof value;
  if (type === 'string') return cappedString(value);
  if (type === 'number') return Number.isFinite(value) ? value : null;
  if (type === 'boolean') return value;
  if (depth >= SESSION_MAX_DEPTH) return null;

  if (Array.isArray(value)) {
    const items = value
      .slice(0, SESSION_MAX_ARRAY)
      .map((item) => sanitizeValue(item, depth + 1))
      .filter((item) => item !== null);
    return items.length > 0 ? items : null;
  }

  if (type === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      if (Object.keys(out).length >= SESSION_MAX_KEYS) break;
      if (FORBIDDEN_KEYS.has(key)) continue;
      if (!/^[a-z0-9_]{1,40}$/i.test(key)) continue;
      const clean = sanitizeValue(raw, depth + 1);
      if (clean !== null) out[key] = clean;
    }
    return Object.keys(out).length > 0 ? out : null;
  }

  // Functions, symbols, undefined — nothing that should survive a JSON round trip anyway.
  return null;
}

/**
 * The `session` object, rebuilt and bounded, or null.
 *
 * The per-field caps above bound each value; this also bounds the whole, by dropping whole
 * top-level keys until it fits rather than truncating a string into invalid JSON.
 */
function sanitizeSession(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const clean = sanitizeValue(value, 0);
  if (!clean || typeof clean !== 'object' || Array.isArray(clean)) return null;

  const entries = Object.entries(clean as Record<string, unknown>);
  if (JSON.stringify(clean).length <= SESSION_MAX_BYTES) {
    return clean as Record<string, unknown>;
  }
  const trimmed: Record<string, unknown> = {};
  for (const [key, item] of entries) {
    if (JSON.stringify({ ...trimmed, [key]: item }).length > SESSION_MAX_BYTES) break;
    trimmed[key] = item;
  }
  return Object.keys(trimmed).length > 0 ? trimmed : null;
}

/** Everything the lead needs beyond the person's own answers. */
type Attribution = {
  pageUrl: string;
  landingPageUrl: string | null;
  referrer: string | null;
  utm: Record<string, string> | null;
  gclid: string | null;
  ctmVisitorSid: string | null;
  session: Record<string, unknown> | null;
};

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
  ctx: { origin: string; userAgent: string; attribution: Attribution },
  includeSession = true,
): Promise<ClarionResult> {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 5000);
  const { attribution } = ctx;
  try {
    const res = await fetch(`${clarion.api}/forms/public/submit`, {
      method: 'POST',
      signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Origin: ctx.origin, 'User-Agent': ctx.userAgent },
      body: JSON.stringify({
        site_key: clarion.siteKey,
        form_key: formKey,
        data,
        page_url: attribution.pageUrl,
        // FW-46. These four were hardcoded `null`, so every lead that fell back to this route
        // was unattributable by construction — no campaign, no landing page, no referrer, and
        // no CTM visit to file it against. They are now whatever the browser actually saw.
        landing_page_url: attribution.landingPageUrl,
        referrer: attribution.referrer,
        utm: attribution.utm,
        gclid: attribution.gclid,
        // Flat and top-level, which is the whole trick — Clarion's parser looks nowhere else.
        ctm_visitor_sid: attribution.ctmVisitorSid,
        user_agent: ctx.userAgent,
        ...(includeSession && attribution.session ? { session: attribution.session } : {}),
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
    '🔴 *Fort Worth Wellness Center — a website lead was REJECTED and is not captured.*',
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
  ctx: { origin: string; userAgent: string; attribution: Attribution },
): Promise<{ result: ClarionResult; attempts: number }> {
  const backoffMs = [500, 1500];
  let result = await submitOnce(formKey, data, ctx);
  let attempts = 1;

  while (!result.ok && isTransient(result) && attempts <= backoffMs.length) {
    await new Promise((r) => setTimeout(r, backoffMs[attempts - 1]));
    result = await submitOnce(formKey, data, ctx);
    attempts += 1;
  }

  /*
   * One exception to "never retry a 4xx" (FW-46).
   *
   * `session` is the one key in the payload that Clarion has not been asked to accept, so if
   * their validation rejects unknown fields it would turn *every* lead into an error. A 4xx
   * means nothing was recorded, so this cannot double-send — and dropping the attribution is
   * strictly better than dropping the admissions enquiry.
   *
   * Scoped tightly on purpose: only when a session was actually sent, and only once.
   *
   * It deliberately covers 403 too, even though a 403 here is almost always the allowlist rather
   * than the schema. Guessing which 4xx means what is not worth it: the asymmetry is that a
   * wasted round trip on an already-doomed lead costs nothing, while wrongly excluding a status
   * Clarion happens to use for an unknown field would lose real enquiries. Bounded at one extra
   * ~5s attempt, and only on the non-transient branch, so `maxDuration` is not at risk.
   */
  if (!result.ok && !isTransient(result) && ctx.attribution.session) {
    // eslint-disable-next-line no-console
    console.warn(
      `[lead] Clarion rejected the payload with ${'status' in result ? result.status : '?'}; retrying once without \`session\``,
    );
    result = await submitOnce(formKey, data, ctx, false);
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
    // Meta / Microsoft click ids, folded in with the lead's own fields rather than into `utm`,
    // which Clarion only accepts the five canonical keys in (FW-46).
    ...(cappedUtm(body.click_ids) ?? {}),
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

  /*
   * FW-46. Attribution as the browser observed it, capped and rebuilt rather than passed
   * through. `page_url` still falls back to the `Referer` header — that is this route's only
   * independent read of where the visitor was — but the campaign and landing page can only come
   * from the client, because by submit time they exist nowhere else.
   */
  const attribution: Attribution = {
    pageUrl: cappedString(body.page_url) || req.headers.get('referer') || origin,
    landingPageUrl: cappedString(body.landing_page_url),
    referrer: cappedString(body.referrer),
    utm: cappedUtm(body.utm),
    gclid: cappedString(body.gclid),
    ctmVisitorSid: ctmVisitorSid(body, req),
    session: sanitizeSession(body.session),
  };

  const { result, attempts } = await submitToClarion(formKey, data, {
    origin,
    userAgent: req.headers.get('user-agent') || BROWSER_UA,
    attribution,
  });

  if (result.ok) {
    // eslint-disable-next-line no-console
    // `ctm` is logged as a boolean, not the id: it is enough to spot the fault this route was
    // silently failing at (a lead accepted with no visit attached) without putting a visitor
    // identifier into runtime logs.
    console.log(
      `[lead] accepted by Clarion (form_key=${formKey}, attempts=${attempts}, ctm=${!!attribution.ctmVisitorSid}, campaign=${!!attribution.utm || !!attribution.gclid}):`,
      result.id,
    );
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
