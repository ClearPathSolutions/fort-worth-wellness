import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import AttributionTracker from '@/components/AttributionTracker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import MobileCallBar from '@/components/MobileCallBar';
import { organizationSchema } from '@/lib/seo';
import { analytics, clarion, site } from '@/lib/site';

const serif = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Both stay inside ~60 chars so nothing truncates in SERPs (FW-29). The template adds
  // exactly 29 characters (' | Fort Worth Wellness Center'), so a page's own title has 36
  // to work with, not the ~41 this used to claim — 41 + 29 is 70, already past the limit
  // the note exists to enforce. Nine page titles had been written against the wrong number
  // and rendered at 68–76 characters; they are back under 65 now. Measure before adding.
  title: {
    default: `${site.name} | Mental Health & Detox Care`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'mental health treatment Fort Worth',
    'residential mental health Texas',
    'dual diagnosis treatment',
    'medical detox Fort Worth',
    'psychiatric residential care DFW',
  ],
  // No `openGraph` here on purpose (V0040). Next replaces this object wholesale rather than
  // deep-merging it, so a single layout-level `url` was inherited verbatim by 12 pages as the
  // bare domain root and dropped entirely by the 42 posts that declared their own. Every page
  // builds its own via `pageMeta()` in `src/lib/seo.ts`.
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/brand/icon.png',
    apple: '/brand/icon.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#faf7f2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <head>
        {/*
          FW-33. `Reveal` server-renders its children at `opacity: 0` and only reveals them
          from an IntersectionObserver callback, so without JavaScript most of the site's body
          copy never appeared. This forces every reveal-wrapped block visible when scripting is
          off — including for crawlers and readers that do not execute JS.
        */}
        <noscript>
          {/* eslint-disable-next-line react/no-danger */}
          <style
            dangerouslySetInnerHTML={{
              __html: '[data-reveal]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
      </head>
      <body className="min-h-screen">
        {/*
          GTM's <noscript> fallback. It has to be the first thing inside <body> per Google's
          snippet, and it cannot go through next/script — Script renders nothing without JS,
          which is the one case this exists to cover.
        */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${analytics.gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-steel focus:px-5 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {/*
          FW-46. Persists the campaign that brought this visitor here, on every pageview. It has
          to live in the root layout: an ad lands on whatever page it points at — usually not one
          with a form — and the query string is gone by the time they reach one. Renders nothing.
        */}
        <AttributionTracker />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/*
          Clearance for the fixed MobileCallBar (FW-05). This has to sit *after* the footer,
          not as padding on <main>: the footer is main's sibling, so padding on main left the
          footer's last row — the copyright, the privacy link and the 988 crisis line — under
          the bar on every phone. Height mirrors MobileCallBar's own box: 1px border + 20px
          padding + 44px button, plus the safe-area inset it also honours.
        */}
        <div className="h-[calc(65px_+_env(safe-area-inset-bottom))] md:hidden" aria-hidden="true" />
        <MobileCallBar />
        {/* Enriched in FW-28; see `organizationSchema()` for what is deliberately still absent. */}
        <JsonLd data={organizationSchema()} />

        {/* ClarionLabs live-chat widget — reads config from its own data-* attrs */}
        <Script
          src={clarion.widgetSrc}
          data-site-key={clarion.siteKey}
          data-api={clarion.api}
          data-color={clarion.color}
          strategy="afterInteractive"
        />

        {/*
          ClarionLabs form capture. `LeadForm` no longer calls its `window.ClarionForms.submit()`
          helper — that helper reads the campaign from the live URL, which is empty by submit
          time (FW-46) — so this is kept only as the vendor's install signal, which is what makes
          the forms integration show as present on Clarion's side.

          ⚠️ Do NOT put `data-clarion-form` on a form on this site. The script auto-binds a
          submit listener to any form carrying that attribute and does not check
          `defaultPrevented`, so it would POST the lead a second time alongside `LeadForm`'s own
          submit — one enquiry, two records, and a phone call from admissions each way.
        */}
        <Script
          src={clarion.formsSrc}
          data-site-key={clarion.siteKey}
          data-api={clarion.api}
          strategy="afterInteractive"
        />

        {/*
          Google Tag Manager. `afterInteractive` rather than `beforeInteractive`: GTM is not
          needed to render anything, and beforeInteractive would block hydration behind a
          third-party fetch on a site whose Core Web Vitals are its own ranking factor.

          The container is a loaded gun pointed at the note below — whatever is added inside it
          later (GA4, Meta pixel, an ad-platform remarketing tag) ships without touching this
          repo and without any of the reasoning below being re-read. If a pixel goes in, the
          cookieless argument for Vercel Analytics stops being true of the site as a whole.
        */}
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${analytics.gtmId}');`}
        </Script>

        {/*
          CallTrackingMetrics. `t.js` swaps the numbers rendered from `site.phone` for tracking
          numbers so calls can be attributed to a source.

          Two consequences worth knowing. The swap is client-side, so a visitor with JS disabled,
          or one who taps before the script lands, gets the real number — which is correct
          behaviour on a 24/7 crisis line and should not be "fixed" by hiding the number until
          CTM is ready. And the number in `organizationSchema()` stays the real one on purpose:
          structured data is read by crawlers, and feeding a rotating tracking number to Google's
          knowledge panel is how a business ends up with a dead number in search results.
        */}
        <Script src={analytics.callTrackingSrc} strategy="afterInteractive" />

        {/*
          FW-45, amended. The site had no measurement of any kind — no GA4, no GTM, no pixel — so nothing
          about it could be evaluated: which pages produce calls, where people abandon the form,
          whether any paid spend returns anything.

          Vercel Analytics was chosen for compliance rather than convenience: this is a
          behavioural-health site where the page path itself is sensitive — a request for
          `/treatment/dual-diagnosis` is a health inference about the person making it — and
          Vercel Analytics is cookieless, storing no visitor identifier to associate one with.

          That argument no longer covers the site as a whole. GTM and CallTrackingMetrics were
          added above at the owner's instruction, and both set first-party cookies and both can
          tie a visitor to the URL they are on. This paragraph is kept because it still explains
          why THIS component is here and why it is worth keeping, but do not read it as a
          statement that the site is tracker-free — it is not, and it has not been since the two
          tags above landed. What follows from that is a matter for the owner and their counsel:
          a HIPAA business associate agreement with Google and with CTM, or a consent gate, or
          both. See the note on `analytics` in `lib/site.ts`.

          Both components render nothing and only load in production.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
