# Routing website form submissions into ClarionLabs

A portable guide to make a site's contact / insurance-verification forms land in
ClarionLabs as **form submissions** (which feed BEN, the insurance
Verification-of-Benefits engine). Based on the Fort Worth Wellness integration,
verified in production.

> ⚠️ Use the **forms API** (`/forms/public/submit`) for form submissions — NOT
> the webchat API. The chat widget uses `/webchat/public/*`; posting form leads
> there makes them show up as anonymous *chat conversations*, not *form
> submissions/leads*. (This was the original bug.)

---

## Requirements (per site)

1. **A Clarion site + site key.** Clarion → **Settings → Website Integrations →
   New site**. Copy the `cpx_…` **site key** (public by design).
2. **A `form_key`** for each form (e.g. `insurance-verification`, `callback`,
   `contact`). Confirm the exact keys with whoever configured the Clarion site —
   BEN / CRM routing may key off specific values.
3. **Allowlisted origin(s).** Clarion pins to an **exact-origin allowlist (no
   wildcards)**. Add every production origin verbatim (apex + `www` + any
   `.vercel.app` alias). Preview/branch URLs will 403.
4. **Server-side endpoint** (Node runtime), so you control the `Origin` header
   and can log a fallback.
5. **Browser-like `User-Agent`** on the server→Clarion call — Clarion's edge
   blocks non-browser UAs (Node's default gets a `000` connection reset).

---

## The endpoint

```
POST https://api.clarionlabs.ai/forms/public/submit
Headers:
  Content-Type: application/json
  Origin: https://<allowlisted-origin>
  User-Agent: <browser UA>
Body:
  {
    "site_key": "cpx_…",
    "form_key": "insurance-verification",   // which form on this site
    "data": {                                // free-form; use BEN field names
      "name": "Jane Doe",
      "first_name": "Jane",
      "last_name": "Doe",
      "date_of_birth": "1990-05-14",         // BEN requires this for VOB
      "phone": "817-555-0100",
      "email": "jane@example.com",
      "seeking_for": "Myself",
      "message": "…"
    },
    "page_url": "https://…",
    "referrer": null, "utm": null, "gclid": null,
    "user_agent": "<browser UA>"
  }
→ 200 { "success": true, "id": "<submission uuid>" }
```

**BEN (insurance verification)** expects `first_name`, `last_name`,
`date_of_birth` (+ optional `member_id`, `payer_name`, `gender`, `state`), so
put those keys in `data`. Split the visitor's full name into first/last.

Related endpoints (reference): `POST /ben/forms/verify` runs a VOB check for a
submission; `GET /forms/submissions` (authenticated) lists submissions in the
Clarion dashboard.

---

## Drop-in route (`src/app/api/lead/route.ts`)

```ts
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

const API = 'https://api.clarionlabs.ai';
const SITE_KEY = process.env.CLARION_SITE_KEY || 'cpx_REPLACE_ME';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export async function POST(req: Request) {
  let b: any; try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (typeof b.company === 'string' && b.company.trim()) return NextResponse.json({ ok: true }); // honeypot

  const name = String(b.name ?? '').trim();
  const phone = String(b.phone ?? '').trim();
  if (!name || !phone) return NextResponse.json({ ok: false, error: 'Name and phone are required.' }, { status: 400 });

  const [firstName, ...rest] = name.split(/\s+/);
  const data = {
    name, first_name: firstName, last_name: rest.join(' ') || firstName,
    date_of_birth: String(b.dob ?? '').trim(),
    phone, email: String(b.email ?? '').trim(),
    seeking_for: String(b.who ?? '').trim(), message: String(b.message ?? '').trim(),
  };

  const host = req.headers.get('host') || '';
  const origin = process.env.CLARION_ORIGIN || req.headers.get('origin') || (host ? `https://${host}` : '');
  const ua = req.headers.get('user-agent') || UA;

  const ac = new AbortController(); const t = setTimeout(() => ac.abort(), 9000);
  let result: any;
  try {
    const res = await fetch(`${API}/forms/public/submit`, {
      method: 'POST', signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Origin: origin, 'User-Agent': ua },
      body: JSON.stringify({
        site_key: SITE_KEY, form_key: String(b.formKey ?? 'website-form'),
        data, page_url: req.headers.get('referer') || origin, referrer: null, utm: null, gclid: null, user_agent: ua,
      }),
    });
    const txt = await res.text().catch(() => '');
    result = res.ok ? { ok: true, id: (() => { try { return JSON.parse(txt).id; } catch { return undefined; } })() }
                    : { ok: false, status: res.status, body: txt.slice(0, 300) };
  } catch (e) { result = { ok: false, error: String(e) }; }
  finally { clearTimeout(t); }

  if (!result.ok) console.error('[lead] Clarion form submit FAILED — logged for recovery:', { data, result });
  else console.log('[lead] submitted to Clarion:', result.id);

  return NextResponse.json({ ok: true }); // never block the visitor
}
```

Have each form POST `{ name, phone, dob?, email?, who?, message?, formKey }` to
`/api/lead`.

---

## Verification checklist (on the PRODUCTION origin)

1. Submit the form (or `curl -X POST …/api/lead …`) → `200`.
2. `POST /forms/public/submit` returns `{ "success": true, "id": "…" }` — confirm
   via runtime logs (`[lead] submitted to Clarion: <id>`) or by reproducing the
   call with `curl` (Origin = prod origin, browser `-A` UA).
3. The submission appears in the Clarion dashboard under the site's form
   submissions / leads (and BEN can run a VOB check with the DOB).
   - **403** = origin not allowlisted. **000/reset** = missing User-Agent.
   - Landing as an anonymous *chat* instead of a form submission = you posted to
     `/webchat/*` instead of `/forms/public/submit`.

## Gotchas
- Always return `{ ok: true }` to the visitor; log the full lead if Clarion fails.
- Add every production origin (apex + www + alias) to the allowlist; add the
  custom domain when you attach it, or delivery (and chat) will 403.
- Confirm the real `form_key`(s) with the Clarion site owner so BEN/CRM routing
  matches.
