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
DNS to Vercel. The old WordPress `/treatment-services/*` URLs are automatically **301-redirected**
to the new `/treatment/*` paths (see `next.config.mjs`) so existing links and SEO carry over.

## Where to edit things

| What | File |
| --- | --- |
| Phone, email, address, hours | `src/lib/site.ts` |
| Navigation & dropdown menu | `src/lib/site.ts` (`nav`) |
| Services, team, insurers, gallery | `src/lib/site.ts` |
| Page copy | `src/app/**/page.tsx` |
| Colors, fonts, shadows | `tailwind.config.ts` |
| Global styles & buttons | `src/app/globals.css` |
| Images | `public/images/**`, logos in `public/brand/**` |

## Lead / contact form

Form submissions POST to `src/app/api/lead/route.ts`. Out of the box it **validates and logs** each
inquiry (visible in your Vercel function logs). To actually deliver leads by email, uncomment the
Resend block in that file and set these environment variables in Vercel:

```
RESEND_API_KEY=...
LEAD_NOTIFY_EMAIL=admissions@fortworthwellness.org
```

Any provider works (Resend, SendGrid, a CRM webhook) — the handler already parses and validates the
payload for you.

## Notes on content

- **Phone number:** the original site used two numbers (817-612-6807 and 817-904-2197). This build
  standardizes on **817-612-6807** everywhere for consistency. Change it in one place —
  `src/lib/site.ts` — if you prefer the other.
- Legacy "Dallas Detox Center" template text and the stray `fortworthwellnesscenter.com` email were
  cleaned up. Sister-facility references were removed in favor of a single, unified brand voice.
- Testimonial widgets from the old site were not carried over (no source content). Add real reviews
  when you have them.
- The **Privacy Policy** is a general template — have counsel review it before launch.

## Tech

- Next.js 14 App Router · React 18 · TypeScript
- Tailwind CSS 3.4 · `next/font` (Fraunces + Inter)
- `next/image` for automatic AVIF/WebP optimization
- Accessible: skip link, keyboard-navigable menu/FAQ/gallery, reduced-motion support, JSON-LD schema
