# Fort Worth Wellness Center

A modern, mobile-first marketing site for **Fort Worth Wellness Center** — a residential
mental health, dual diagnosis, and detox treatment center in Weatherford, Texas.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**, and optimized for
deployment on **Vercel**.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build locally
```

## Deploy to Vercel

This project is zero-config on Vercel.

1. Push this folder to a GitHub/GitLab repo.
2. In Vercel, **Add New → Project**, import the repo. Framework preset auto-detects **Next.js**.
3. Click **Deploy**. That's it.

Or from the CLI: `npm i -g vercel && vercel`.

### Custom domain
After deploying, add `fortworthwellness.org` under **Project → Settings → Domains** and point your
DNS to Vercel. `next.config.mjs` holds three groups of permanent redirects so inbound links survive:
the old WordPress `/treatment-services/*` paths, the pre-standardisation `/about-us`, `/contact-us`
and `/treatment/aftercare-planning` slugs, and the broken in-body blog links inherited from the
Dallas clone.

> ⚠️ **Two things must happen at cutover, or leads break.**
>
> 1. **Allowlist the domain in Clarion → Website Integrations** — apex *and* `www`, plus any
>    `.vercel.app` alias that will serve the form. A missing origin means every submission from that
>    host fails, and since FW-02 that failure is now visible to the visitor.
> 2. **42 old blog permalinks are still unmapped.** The live WordPress uses date-based URLs
>    (`/2021/12/15/is-xanax-addictive/`); this build uses `/blog/<slug>`. Nothing redirects them yet,
>    so the entire indexed blog would 404. Gated on `V0108`, since the slugs themselves may change.

## Where to edit things

| What | File |
| --- | --- |
| Phone, email, address, hours | `src/lib/site.ts` |
| Navigation & dropdown menu | `src/lib/site.ts` (`nav`) |
| Services, team, insurers, gallery | `src/lib/site.ts` |
| Blog posts (42 articles) | `src/lib/posts.json` |
| Page copy | `src/app/**/page.tsx` |
| Colors, fonts, shadows | `tailwind.config.ts` |
| Global styles & buttons | `src/app/globals.css` |
| Images | `public/images/**`, logos in `public/brand/**` |

## Lead / contact form

`LeadForm` submits in two stages. First it tries ClarionLabs' official client-side capture,
`window.ClarionForms.submit()`, loaded in `layout.tsx`. If that script did not load or does not
confirm delivery, it falls back to `src/app/api/lead/route.ts`, which POSTs the same payload to
Clarion's **forms API** (`/forms/public/submit`). Submissions are recorded as form submissions
against this site's `site_key` and feed BEN, Clarion's insurance verification-of-benefits engine —
which is why the insurance form requires a date of birth.

This is **not** the webchat API. An earlier version of this route created a public webchat session
and posted the lead as a chat message; that was a bug, and `docs/CLARION_FORM_INTEGRATION.md`
records the correction.

Notes:
- Clarion pins to an **exact-origin allowlist**. The handler forwards the origin derived from the
  request's `host`, so when you add a custom domain you must also allowlist it in Clarion → Website
  Integrations — apex, `www`, and any `.vercel.app` alias you expect to submit from. Otherwise
  delivery 403s even though the page loads.
- The forwarded origin is deliberately **not** taken from the request's `Origin` header; that header
  is caller-controlled, and honouring it let this route be used to launder an arbitrary origin past
  Clarion's allowlist.
- Clarion's edge blocks non-browser User-Agents, so the handler sends a browser-like UA.
- `CLARION_ORIGIN` env var overrides the forwarded origin if needed.
- The route is rate-limited to 5 submissions per IP per 10 minutes, in the memory of a single
  serverless instance. It stops a single script hammering the endpoint, not a distributed flood.

### If Clarion rejects a submission

**Clarion is the only destination for a lead** — there is no secondary inbox, queue or database, by
decision. The consequence is deliberate and worth understanding: if Clarion will not accept a
submission, the lead is *not captured anywhere*. So the route never claims success it did not
achieve.

- Transient failures (network, timeout, 5xx, 429) retry with backoff. **4xx never retries** — a 403
  means this origin is not allowlisted, and retrying cannot fix configuration.
- A genuine rejection returns `502`, and the form tells the visitor to call instead.
- Set **`LEAD_ALERT_WEBHOOK_URL`** to get notified when that happens. Any incoming-webhook URL works
  — Slack, Discord, Teams. The alert carries diagnostics only (form key, origin, upstream status,
  and an explicit hint when it is the allowlist); it deliberately contains **no lead details**,
  since the failure means we never delivered them.
- Runtime logs likewise carry diagnostics only. They used to log the full submission including date
  of birth; Vercel logs are not a controlled store and that is treatment intake data.

## Notes on content

- **Phone number:** the original site used two numbers (817-612-6807 and 817-904-2197). This build
  standardizes on **817-612-6807** everywhere for consistency. Change it in one place —
  `src/lib/site.ts` — if you prefer the other.
- Legacy "Dallas Detox Center" template text and the stray `fortworthwellnesscenter.com` email were
  cleaned up. Sister-facility references were removed in favor of a single, unified brand voice.
- **Blog:** all 42 articles from the old site were imported (`src/lib/posts.json`) with featured
  images. They were the network's shared Dallas blog, so the brand name and location references were
  auto-normalized to Fort Worth (real "Dallas–Fort Worth" metro mentions were preserved).
  The six mislabelled outbound links are fixed — anchor text had been rewritten but the URLs still
  pointed at Dallas institutions, so "Fort Worth Area AA Intergroup" went to `aadallas.org`.
  **Still outstanding in the blog:** post slugs keep their original wording, six of them naming the
  wrong city; three posts carry the old `817-904-2197` number; and twelve still say "luxury". All of
  it is gated on the clinical-scope decision (`V0108`) because path B would rewrite or drop these
  posts anyway.
- **Reviews:** the old site's testimonials came from a TrustIndex widget that is **empty** (no
  reviews configured), so there was nothing to import. Add real reviews when you have them.
- The **Privacy Policy** is a general template — have counsel review it before launch.

## Tech

- Next.js 14 App Router · React 18 · TypeScript
- Tailwind CSS 3.4 · `next/font` (Fraunces + Inter)
- `next/image` for automatic AVIF/WebP optimization
- Accessibility: skip link, reduced-motion support, self-referencing canonicals, and JSON-LD
  (`MedicalBusiness`, `BreadcrumbList`, `FAQPage`, `BlogPosting`). Keyboard navigation was fixed in
  full — the desktop dropdown opens on focus, the closed mobile menu is out of the tab order, and the
  gallery lightbox is a real dialog with a focus trap and focus restore. `FW-07`/`FW-08`/`FW-09` in
  `issues.md` are closed.
  **Still open:** several low-opacity text colours fall below 4.5:1, and some footer links and the
  consent checkbox are under the 24px touch-target minimum. Do not claim WCAG AA conformance yet.
- Analytics: Vercel Analytics + Speed Insights, chosen for being cookieless — on this site the URL
  itself is a health inference, so there is deliberately no persistent visitor id. A
  `lead_submitted` event fires on accepted submissions only and carries the form key, never a field
  value. Custom events need Vercel Web Analytics on a paid plan.
