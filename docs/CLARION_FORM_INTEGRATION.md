# Routing website form submissions into ClarionLabs

A portable guide to make any site's contact / insurance-verification forms land
in ClarionLabs as conversations (the same inbox the live chat uses). This is the
exact approach used on the Fort Worth Wellness site, verified in production.

There is **no dedicated "lead/form" API** in Clarion. Leads flow in through the
**public webchat flow**: create a visitor session, then post the form data as a
message. A human agent sees the conversation with all the lead's details.

---

## Requirements (per site)

1. **A Clarion site + site key.** In Clarion → **Settings → Website Integrations
   → New site**. Copy the `cpx_…` **site key** (public by design — origin-pinned
   + rate-limited, like an Intercom app id).
2. **Allowlisted origin(s).** Clarion pins to an **exact-origin allowlist (no
   wildcards)**. Add every production origin the form will POST from, verbatim:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`
   - the Vercel alias if used, e.g. `https://your-project.vercel.app`
   > Vercel **preview/branch URLs** (`…-git-…`, `…-<hash>-…`) are different
   > origins and **will 403** — only the allowlisted production origin(s) work.
3. **A server-side endpoint** (don't call Clarion from the browser for form
   posts — do it server-side so you control the Origin header and can log a
   fallback). Runtime: Node (not Edge).
4. **A browser-like `User-Agent` header.** Clarion's edge **blocks non-browser
   UAs** (Node/undici's default UA gets a connection reset / `000`). Always set
   a real browser UA on the server-to-Clarion calls.

---

## The Clarion API contract (public webchat)

Base: `https://api.clarionlabs.ai`

### 1) Create session
```
POST /webchat/public/session
Headers:
  Content-Type: application/json
  Origin: https://<allowlisted-origin>
  User-Agent: <browser UA>
Body:
  {
    "site_key": "cpx_…",
    "visitor_session_id": "v-<unique>",
    "page_url": "https://…",
    "referrer": null,
    "user_agent": "<browser UA>",
    "utm": null,
    "gclid": null
  }
→ 200 { "conversation_id": "...", "visitor_token": "<JWT>", ... }
```

### 2) Post the lead as a message
```
POST /webchat/public/messages
Headers:
  Content-Type: application/json
  Origin: https://<allowlisted-origin>
  User-Agent: <browser UA>
  Authorization: Bearer <visitor_token>
Body:
  { "client_msg_id": "c-<unique>", "text": "<formatted lead details>" }
→ 200 (message stored on the conversation)
```

(For reference, the chat widget's quick-reply buttons post
`{ "client_msg_id": "...", "choice": { "node_id": "...", "choice_id": "..." } }`
instead of `text` — you don't need that for form ingestion.)

---

## Steps to add to another Next.js (App Router) site

1. **Clarion:** create the site, copy the `cpx_` key, add the production
   origin(s) to the allowlist.
2. **Env:** set `CLARION_SITE_KEY=cpx_…` (and optionally
   `NEXT_PUBLIC_CLARION_SITE_KEY` if you also add the chat widget).
3. **Add the route** `src/app/api/lead/route.ts` (drop-in below).
4. **Point forms at it:** each form does
   `fetch('/api/lead', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })`.
5. **(Optional) chat widget:** in `app/layout.tsx`, after `{children}`:
   ```tsx
   <Script src="https://www.clarionlabs.ai/widget.v1.js"
     data-site-key={process.env.NEXT_PUBLIC_CLARION_SITE_KEY}
     data-api="https://api.clarionlabs.ai"
     data-color="#RRGGBB"            /* optional brand accent */
     strategy="afterInteractive" />
   ```
6. **Deploy & verify** on the production origin (see checklist below).

---

## Drop-in route (`src/app/api/lead/route.ts`)

```ts
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

const CLARION_API = 'https://api.clarionlabs.ai';
const SITE_KEY = process.env.CLARION_SITE_KEY || 'cpx_REPLACE_ME';
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const sid = (p: string) => `${p}-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;

async function toClarion(lead: Record<string, string>, ctx: { origin: string; ua: string; pageUrl: string }) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 9000);
  try {
    const s = await fetch(`${CLARION_API}/webchat/public/session`, {
      method: 'POST', signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Origin: ctx.origin, 'User-Agent': ctx.ua },
      body: JSON.stringify({ site_key: SITE_KEY, visitor_session_id: sid('v'), page_url: ctx.pageUrl, referrer: null, user_agent: ctx.ua, utm: null, gclid: null }),
    });
    if (!s.ok) return { ok: false, stage: 'session', status: s.status, body: (await s.text().catch(() => '')).slice(0, 300) };
    const { visitor_token, conversation_id } = await s.json();
    if (!visitor_token) return { ok: false, stage: 'session', body: 'no visitor_token' };

    const text = [
      '🔔 New website form submission',
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      lead.dob ? `Date of birth: ${lead.dob}` : null,     // include only the fields your form has
      lead.email ? `Email: ${lead.email}` : null,
      lead.who ? `Seeking treatment for: ${lead.who}` : null,
      lead.message ? `Message: ${lead.message}` : null,
      `Source: ${ctx.pageUrl}`,
    ].filter(Boolean).join('\n');

    const m = await fetch(`${CLARION_API}/webchat/public/messages`, {
      method: 'POST', signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Origin: ctx.origin, 'User-Agent': ctx.ua, Authorization: `Bearer ${visitor_token}` },
      body: JSON.stringify({ client_msg_id: sid('c'), text }),
    });
    if (!m.ok) return { ok: false, stage: 'message', status: m.status, body: (await m.text().catch(() => '')).slice(0, 300) };
    return { ok: true, conversationId: conversation_id };
  } catch (e) { return { ok: false, stage: 'network', error: String(e) }; }
  finally { clearTimeout(t); }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  if (typeof body.company === 'string' && body.company.trim()) return NextResponse.json({ ok: true }); // honeypot

  const name = String(body.name ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  if (!name || !phone) return NextResponse.json({ ok: false, error: 'Name and phone are required.' }, { status: 400 });

  const lead = {
    name, phone,
    dob: String(body.dob ?? '').trim(),
    email: String(body.email ?? '').trim(),
    who: String(body.who ?? '').trim(),
    message: String(body.message ?? '').trim(),
  };

  const host = req.headers.get('host') || '';
  const origin = process.env.CLARION_ORIGIN || req.headers.get('origin') || (host ? `https://${host}` : '');

  const result = await toClarion(lead, {
    origin,
    ua: req.headers.get('user-agent') || BROWSER_UA,
    pageUrl: req.headers.get('referer') || origin,
  });

  if (!result.ok) console.error('[lead] Clarion delivery FAILED — lead logged for recovery:', { lead, result });
  else console.log('[lead] delivered to Clarion:', result.conversationId);

  return NextResponse.json({ ok: true }); // never block the visitor on a third-party hiccup
}
```

---

## Verification checklist (run on the PRODUCTION origin)

1. Submit the form (or `curl -X POST https://yourdomain/api/lead …`) → `200`.
2. Confirm delivery, either:
   - Runtime logs show `[lead] delivered to Clarion: <conversation_id>`, **or**
   - Reproduce the two calls with `curl` (Origin = your production origin, a
     browser `-A` UA) and confirm **both return 200** and the message echoes back.
   - A **403 "origin not allowed"** means that exact origin isn't in Clarion's
     allowlist. A **000 / connection reset** means the `User-Agent` was missing.
3. The lead appears as a conversation in the Clarion inbox.

## Design notes / gotchas
- **Always return `{ ok: true }`** to the visitor; log the full lead if Clarion
  fails so nothing is lost.
- **Server-side only** — keep the Origin controllable and avoid CORS surprises.
- **Add every production origin** (apex + www + any alias) to the allowlist; when
  you attach a custom domain later, add it too or delivery (and chat) will 403.
- Include only the fields your form actually collects in the message text.
