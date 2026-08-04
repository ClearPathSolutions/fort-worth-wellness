import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import MobileCallBar from '@/components/MobileCallBar';
import { organizationSchema } from '@/lib/seo';
import { clarion, site } from '@/lib/site';

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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-steel focus:px-5 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
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

        {/* ClarionLabs form capture — exposes window.ClarionForms.submit() used by LeadForm */}
        <Script
          src={clarion.formsSrc}
          data-site-key={clarion.siteKey}
          data-api={clarion.api}
          strategy="afterInteractive"
        />

        {/*
          FW-45. The site had no measurement of any kind — no GA4, no GTM, no pixel — so nothing
          about it could be evaluated: which pages produce calls, where people abandon the form,
          whether any paid spend returns anything.

          Vercel Analytics specifically, and the reason is compliance rather than convenience. This
          is a behavioural-health site where the page path itself is sensitive: a request for
          `/treatment/dual-diagnosis` is a health inference about the person making it. GA4 storing
          that against a persistent `_ga` client id is the pattern that has drawn regulatory
          attention at healthcare providers. Vercel Analytics is cookieless and stores no visitor
          identifier, so there is no profile to associate a diagnosis-shaped URL with — and no
          consent banner is required.

          Both components render nothing and only load in production.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
