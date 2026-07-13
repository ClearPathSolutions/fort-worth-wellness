import { NextResponse } from 'next/server';
import { clarion } from '@/lib/site';

export const runtime = 'nodejs';

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
 * Notes:
 * - Clarion pins to an exact-origin allowlist, so we forward the deployment's
 *   own origin (must be allowlisted in Clarion → Website Integrations).
 * - Clarion's edge blocks non-browser User-Agents, so we send a browser-like UA.
 * - If Clarion is unreachable, the full lead is logged as a fallback and the
 *   visitor still sees success.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function submitToClarion(
  formKey: string,
  data: Record<string, string>,
  ctx: { origin: string; userAgent: string; pageUrl: string },
) {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 9000);
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

export async function POST(req: Request) {
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
  const host = req.headers.get('host') || '';
  const origin =
    process.env.CLARION_ORIGIN ||
    req.headers.get('origin') ||
    (host ? `https://${host}` : 'https://fort-worth-wellness.vercel.app');

  const result = await submitToClarion(formKey, data, {
    origin,
    userAgent: req.headers.get('user-agent') || BROWSER_UA,
    pageUrl: req.headers.get('referer') || origin,
  });

  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error('[lead] Clarion form submit FAILED — lead logged for recovery:', {
      formKey,
      data,
      result,
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(`[lead] submitted to Clarion (form_key=${formKey}):`, result.id);
  }

  // Always succeed for the visitor — a third-party hiccup shouldn't block them.
  return NextResponse.json({ ok: true });
}
