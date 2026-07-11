import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Lead intake endpoint.
 *
 * By default this validates the submission and logs it (visible in your Vercel
 * function logs). To actually deliver leads, wire up an email/CRM provider below
 * — e.g. Resend, SendGrid, or a webhook. Set the relevant env vars in Vercel.
 */
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
    email: String(body.email ?? '').trim(),
    who: String(body.who ?? '').trim(),
    message: String(body.message ?? '').trim(),
    receivedAt: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.log('[lead] new admissions inquiry:', lead);

  // --- Optional: deliver via Resend if configured -------------------------
  // const key = process.env.RESEND_API_KEY;
  // const to = process.env.LEAD_NOTIFY_EMAIL;
  // if (key && to) {
  //   await fetch('https://api.resend.com/emails', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       from: 'Fort Worth Wellness <admissions@fortworthwellness.org>',
  //       to,
  //       subject: `New inquiry — ${lead.name}`,
  //       text: Object.entries(lead).map(([k, v]) => `${k}: ${v}`).join('\n'),
  //     }),
  //   });
  // }

  return NextResponse.json({ ok: true });
}
