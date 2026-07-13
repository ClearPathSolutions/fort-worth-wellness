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
| Blog posts (42 articles) | `src/lib/posts.json` |
| Page copy | `src/app/**/page.tsx` |
| Colors, fonts, shadows | `tailwind.config.ts` |
| Global styles & buttons | `src/app/globals.css` |
| Images | `public/images/**`, logos in `public/brand/**` |

## Lead / contact form

Form submissions POST to `src/app/api/lead/route.ts`, which delivers each inquiry into
**ClarionLabs** as a webchat conversation — the same inbox the live-chat leads land in. It creates a
public webchat session and posts the lead's details as a message. If Clarion is ever unreachable, the
full submission is logged to the Vercel function logs so no lead is lost.

Notes:
- Clarion pins to an **exact-origin allowlist**. The handler forwards the deployment's own origin, so
  when you add a custom domain you must also allowlist it in Clarion → Website Integrations
  (otherwise delivery 403s even though the page loads).
- Clarion's edge blocks non-browser User-Agents, so the handler sends a browser-like UA.
- `CLARION_ORIGIN` env var can override the forwarded origin if needed.

## Notes on content

- **Phone number:** the original site used two numbers (817-612-6807 and 817-904-2197). This build
  standardizes on **817-612-6807** everywhere for consistency. Change it in one place —
  `src/lib/site.ts` — if you prefer the other.
- Legacy "Dallas Detox Center" template text and the stray `fortworthwellnesscenter.com` email were
  cleaned up. Sister-facility references were removed in favor of a single, unified brand voice.
- **Blog:** all 42 articles from the old site were imported (`src/lib/posts.json`) with featured
  images. They were the network's shared Dallas blog, so the brand name and location references were
  auto-normalized to Fort Worth (real "Dallas–Fort Worth" metro mentions were preserved). A few
  articles still contain Dallas-area external resource links and one Dallas map graphic — worth a
  skim before launch. Post URL slugs keep their original wording.
- **Reviews:** the old site's testimonials came from a TrustIndex widget that is **empty** (no
  reviews configured), so there was nothing to import. Add real reviews when you have them.
- The **Privacy Policy** is a general template — have counsel review it before launch.

## Tech

- Next.js 14 App Router · React 18 · TypeScript
- Tailwind CSS 3.4 · `next/font` (Fraunces + Inter)
- `next/image` for automatic AVIF/WebP optimization
- Accessible: skip link, keyboard-navigable menu/FAQ/gallery, reduced-motion support, JSON-LD schema
