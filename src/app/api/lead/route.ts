import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { clarion } from '@/lib/site';

export const runtime = 'nodejs';

/**
 * Lead intake endpoint.
 *
 * Website form submissions ("Request a callback" / "Verify Insurance") are
 * delivered into ClarionLabs as a webchat conversation — the same inbox the
 * live-chat leads land in. We replicate Clarion's public webchat flow:
 *   1) POST /webchat/public/session  -> { conversation_id, visitor_token }
 *   2) POST /webchat/public/messages -> posts the lead as a text message
 *
 * Clarion pins requests to an exact origin allowlist, so we forward the
 * deployment's own origin (which must be allowlisted in Clarion → Website
 * Integrations). If Clarion is unreachable, the full lead is logged as a
 * fallback and the visitor still sees success.
 */
function shortId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
}

async function deliverToClarion(lead: Record<string, string>, ctx: { origin: string; userAgent: string; pageUrl: string }) {
  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 9000);
  try {
    // 1) Create a visitor session
    const sessionRes = await fetch(`${clarion.api}/webchat/public/session`, {
      method: 'POST',
      signal: ac.signal,
      // A browser-like User-Agent is required — Clarion's edge blocks the
      // default Node/undici UA (connection reset).
      headers: { 'Content-Type': 'application/json', Origin: ctx.origin, 'User-Agent': ctx.userAgent },
      body: JSON.stringify({
        site_key: clarion.siteKey,
        visitor_session_id: shortId('v'),
        page_url: ctx.pageUrl,
        referrer: null,
        user_agent: ctx.userAgent,
        utm: null,
        gclid: null,
      }),
    });
    if (!sessionRes.ok) {
      const body = await sessionRes.text().catch(() => '');
      return { ok: false, stage: 'session', status: sessionRes.status, body: body.slice(0, 300) };
    }
    const session = (await sessionRes.json()) as { conversation_id?: string; visitor_token?: string };
    if (!session.visitor_token) return { ok: false, stage: 'session', status: sessionRes.status, body: 'no visitor_token' };

    // 2) Post the lead details as a message on that conversation
    const text = [
      '🔔 New website form submission',
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      lead.dob ? `Date of birth: ${lead.dob}` : null,
      lead.email ? `Email: ${lead.email}` : null,
      lead.who ? `Seeking treatment for: ${lead.who}` : null,
      lead.message ? `Message: ${lead.message}` : null,
      `Source: Fort Worth Wellness website (${ctx.pageUrl})`,
    ]
      .filter(Boolean)
      .join('\n');

    const msgRes = await fetch(`${clarion.api}/webchat/public/messages`, {
      method: 'POST',
      signal: ac.signal,
      headers: {
        'Content-Type': 'application/json',
        Origin: ctx.origin,
        'User-Agent': ctx.userAgent,
        Authorization: `Bearer ${session.visitor_token}`,
      },
      body: JSON.stringify({ client_msg_id: shortId('c'), text }),
    });
    if (!msgRes.ok) {
      const body = await msgRes.text().catch(() => '');
      return { ok: false, stage: 'message', status: msgRes.status, body: body.slice(0, 300) };
    }
    return { ok: true, conversationId: session.conversation_id };
  } catch (err) {
    return { ok: false, stage: 'network', error: String(err) };
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

  const lead = {
    name,
    phone,
    dob: String(body.dob ?? '').trim(),
    email: String(body.email ?? '').trim(),
    who: String(body.who ?? '').trim(),
    message: String(body.message ?? '').trim(),
  };

  // Origin that Clarion must have allowlisted (the deployment's own origin).
  const host = req.headers.get('host') || '';
  const origin =
    process.env.CLARION_ORIGIN ||
    req.headers.get('origin') ||
    (host ? `https://${host}` : 'https://fort-worth-wellness.vercel.app');

  // Clarion's edge blocks non-browser UAs, so fall back to a browser-like string.
  const browserUA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
  const result = await deliverToClarion(lead, {
    origin,
    userAgent: req.headers.get('user-agent') || browserUA,
    pageUrl: req.headers.get('referer') || origin,
  });

  if (!result.ok) {
    // Fallback: never lose a lead — log the full submission for recovery.
    // eslint-disable-next-line no-console
    console.error('[lead] Clarion delivery FAILED — lead logged for recovery:', { lead, result });
  } else {
    // eslint-disable-next-line no-console
    console.log('[lead] delivered to Clarion:', result.conversationId);
  }

  // Always succeed for the visitor — a third-party hiccup shouldn't block them.
  return NextResponse.json({ ok: true });
}
