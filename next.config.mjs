/**
 * Content-Security-Policy (FW-47).
 *
 * Added so Clarion-hosted blog images have an explicit, cacheable home in `img-src` rather than
 * depending on the site having no policy at all.
 *
 * ⚠️ Read this before editing. A CSP here is not a lint rule — it is a kill switch for the two
 * things on this site that convert. The chat launcher and the lead form are both third-party
 * JavaScript that inject their own markup, stylesheets and network calls, and an origin missing
 * from the list below does not warn: it silently stops working. That is why the repo shipped
 * without a policy for so long.
 *
 * Every origin below was OBSERVED on the deployed site, not guessed — a crawl of /, /blog/, a
 * Clarion post, /admissions/ and /contact/, recording every request by resource type. If you
 * add a tag, re-run that crawl and extend the list, or the tag will half-load.
 *
 * ‼️ Note what the crawl found, because it is not in this repo: the GTM container
 * (GTM-TC7PQ4LR) has since loaded GA4, Google Ads, DoubleClick and **Microsoft Clarity**, a
 * session-recording and heatmap tool. Clarity can capture interaction with the intake form on a
 * behavioural-health site. Nobody has to touch this repo to add more. See the note beside
 * `analytics` in `lib/site.ts`.
 *
 * MODE. Defaults to `Content-Security-Policy-Report-Only`, which reports violations without
 * enforcing them, so a missed origin costs a console warning instead of an admissions enquiry.
 * Set `CSP_ENFORCE=true` in the environment to switch to the enforcing header once a deploy has
 * gone by with no violations reported.
 */
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'self'"],
  // Forms submit via fetch (see LeadForm), never a native POST, so 'self' is not restrictive.
  'form-action': ["'self'"],
  // 'unsafe-inline' and 'unsafe-eval' are required by Google Tag Manager, which also injects 13
  // inline scripts on this page. They blunt what a script-src can defend against; the policy is
  // still worth having for the other directives, but do not read this as XSS-proof.
  //
  // Expect `script-src-elem` violations for `http://264810.tctm.co/...` when running the dev
  // server over http, and do not "fix" them by adding a bare host here. CTM's t.js injects a
  // second, protocol-relative copy of itself (`//264810.tctm.co/t.js`), which resolves to http on
  // an http page and https on the deployed site — so the https entry below is correct in
  // production and the local violations are an artifact of the dev server's scheme.
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://264810.tctm.co',
    'https://www.clarionlabs.ai',
    'https://www.googletagmanager.com',
    'https://googleads.g.doubleclick.net',
    'https://www.googleadservices.com',
    'https://scripts.clarity.ms',
    'https://www.clarity.ms',
  ],
  // Clarion's widget injects its own stylesheet at runtime, hence 'unsafe-inline'.
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  // next/font self-hosts the Google fonts at build time, so no external font origin is needed.
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    // The reason this policy exists: Clarion-hosted post covers and inline blog images.
    'https://api.clarionlabs.ai',
    // Today's actual cover host — an author-supplied Unsplash URL. Post covers can point at any
    // host the author uploaded to, so this list is the ceiling on what a post can display.
    'https://images.unsplash.com',
    'https://264810.tctm.co',
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://www.google-analytics.com',
    'https://googleads.g.doubleclick.net',
    'https://stats.g.doubleclick.net',
    'https://c.clarity.ms',
    'https://c.bing.com',
  ],
  'connect-src': [
    "'self'",
    'https://api.clarionlabs.ai',
    'https://www.clarionlabs.ai',
    'https://264810.tctm.co',
    'https://www.googletagmanager.com',
    'https://analytics.google.com',
    'https://www.google-analytics.com',
    'https://stats.g.doubleclick.net',
    'https://ad.doubleclick.net',
    'https://www.google.com',
    'https://l.clarity.ms',
    'https://*.clarity.ms',
  ],
  // CTM can embed a FormReactor and GTM uses a noscript iframe; both need a home here.
  'frame-src': [
    "'self'",
    'https://www.googletagmanager.com',
    'https://td.doubleclick.net',
    'https://264810.tctm.co',
    'https://*.clarionlabs.ai',
  ],
  'worker-src': ["'self'", 'blob:'],
  'upgrade-insecure-requests': [],
};

const CSP_VALUE = Object.entries(CSP_DIRECTIVES)
  .map(([directive, values]) => (values.length ? `${directive} ${values.join(' ')}` : directive))
  .join('; ');

const CSP_HEADER_NAME =
  process.env.CSP_ENFORCE === 'true'
    ? 'Content-Security-Policy'
    : 'Content-Security-Policy-Report-Only';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * V0102 — match production's slash-canonical convention.
   *
   * `fortworthwellness.org/about-us/` is the canonical form on the live site, and the slashless
   * form 301s to it. Next defaults to the opposite, which meant every inbound link, citation and
   * directory listing using the existing convention would have hit a redirect on cutover day.
   * Redirects resolve, but a chain on every inbound URL is where link equity leaks.
   *
   * This has to stay in step with four other things — canonical/`og:url` paths in `pageMeta()`,
   * the sitemap route list, `breadcrumbSchema()` item URLs, and the in-body blog links. Change one
   * and you must change all five.
   */
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  /**
   * Baseline security headers. The site sent none, which on a behavioural-health site is
   * worth correcting before launch: the pages a visitor requests are themselves a health
   * inference about them, and the forms carry intake data.
   *
   * A Content-Security-Policy is now included — see `CSP_DIRECTIVES` above for the origin list,
   * why it ships in Report-Only first, and how to enforce it. The concern that used to live in
   * this comment (a guessed policy silently breaking the chat launcher and the lead form) is
   * answered by deriving every origin from a crawl of the deployed site rather than guessing,
   * and by not enforcing until a deploy has proven the list.
   *
   * HSTS is absent for the same reason it should be: Vercel already sets it at the edge
   * (verified `max-age=63072000; includeSubDomains; preload` on the current deployment),
   * and duplicating it here risks the two disagreeing.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: CSP_HEADER_NAME, value: CSP_VALUE },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // No page uses any of these; denying them stops a third-party script from asking.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // ----------------------------------------------------------------------
      // 1. Old WordPress URL structure, so existing links and SEO keep working.
      // ----------------------------------------------------------------------
      { source: '/treatment-services/detox', destination: '/treatment/detox/', permanent: true },
      { source: '/treatment-services/mental-health-residential', destination: '/treatment/mental-health-residential/', permanent: true },
      { source: '/treatment-services/dual-diagnosis', destination: '/treatment/dual-diagnosis/', permanent: true },
      // Retargeted, not chained: this used to point at /treatment/aftercare-planning, which is
      // now itself a redirect. Sending it straight to the final URL keeps it one hop.
      { source: '/treatment-services/aftercare-planning', destination: '/treatment/aftercare/', permanent: true },
      { source: '/treatment-services', destination: '/treatment/', permanent: true },

      // ----------------------------------------------------------------------
      // 2. Slug standardisation — V0095 / V0097 / V0098.
      //    The pages now live at the portfolio-standard paths. These 301s exist for anything
      //    already pointing at the old `-us` forms (external links, the owner's own material).
      //    Nothing internal relies on them: every in-repo reference and in-body blog link was
      //    rewritten to the new paths, so these are a safety net rather than a load-bearing hop.
      // ----------------------------------------------------------------------
      { source: '/about-us', destination: '/about/', permanent: true },
      { source: '/contact-us', destination: '/contact/', permanent: true },
      { source: '/treatment/aftercare-planning', destination: '/treatment/aftercare/', permanent: true },

      // ----------------------------------------------------------------------
      // 3. B1 — broken in-body blog links inherited from the Dallas clone (V0024–V0036).
      //
      //    Only three rules are needed rather than five: renaming the slugs above turned
      //    /contact (9 links) and /about (1 link) into real pages, so those resolve natively
      //    instead of needing a redirect at all.
      // ----------------------------------------------------------------------
      { source: '/treatment-services/aftercare', destination: '/treatment/aftercare/', permanent: true },
      { source: '/treatment-services/texas-dual-diagnosis', destination: '/treatment/dual-diagnosis/', permanent: true },
      { source: '/home', destination: '/', permanent: true },

      // ----------------------------------------------------------------------
      // 4. Blog slugs renamed under V0106 — they named a city their own content
      //    does not mention. Body copy had been find-and-replaced to Fort Worth
      //    while the slugs kept saying Dallas.
      //
      //    Only these four moved. `addiction-rehab-near-irving-texas` and
      //    `how-to-find-alcohol-rehab-near-garland-texas` were deliberately left
      //    alone: their content really is about those cities, so the slug is not
      //    wrong — the geo-targeting is. That needs a content decision, not a rename.
      // ----------------------------------------------------------------------
      {
        source: '/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas',
        destination: '/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-fort-worth/',
        permanent: true,
      },
      {
        source: '/blog/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year',
        destination: '/blog/alcohol-drug-detox-in-fort-worth-what-to-expect-when-starting-recovery-in-the-new-year/',
        permanent: true,
      },
      {
        source: '/blog/dallas-detox-center-a-guiding-light-on-your-path-to-recovery',
        destination: '/blog/fort-worth-wellness-center-a-guiding-light-on-your-path-to-recovery/',
        permanent: true,
      },
      {
        source: '/blog/the-vital-role-of-aftercare-in-sustaining-long-term-recovery-insights-from-dallas-detox-center',
        destination: '/blog/the-vital-role-of-aftercare-in-sustaining-long-term-recovery-insights-from-fort-worth-wellness-center/',
        permanent: true,
      },

      // ----------------------------------------------------------------------
      // 5. V0105 — two posts deleted. They geo-targeted Dallas suburbs (Irving ~45mi,
      //    Garland ~55mi) that this facility does not serve, and competed with the
      //    sister Dallas site for its own catchment. Sent to the blog index rather
      //    than left to 404, since both had inbound history.
      // ----------------------------------------------------------------------
      { source: '/blog/addiction-rehab-near-irving-texas', destination: '/blog/', permanent: true },
      { source: '/blog/how-to-find-alcohol-rehab-near-garland-texas', destination: '/blog/', permanent: true },

      // ----------------------------------------------------------------------
      // 6. The live WordPress permalinks. THIS is the set that decides whether the
      //    cutover keeps its blog traffic.
      //
      //    Everything above rewrites URLs this rebuild invented. The 42 posts on the
      //    site today do not live at /blog/<slug> at all — WordPress serves them
      //    date-based, /2021/12/15/is-xanax-addictive/, and all 42 return 200 right
      //    now. Verified against `scrape/blog_urls.txt`, which is the crawl of the
      //    live site. Without these rules every one of them 404s the moment DNS moves,
      //    which is the single largest piece of SEO equity this domain has.
      //
      //    Ordering is load-bearing. Next matches in array order, so the six posts
      //    that did not survive as-is are listed FIRST — the catch-all below would
      //    otherwise send them to slugs that do not exist (the four renamed ones) or
      //    to deleted pages (the two dropped ones).
      // ----------------------------------------------------------------------
      { source: '/2022/05/05/how-to-find-alcohol-rehab-near-garland-texas', destination: '/blog/', permanent: true },
      { source: '/2022/05/09/addiction-rehab-near-irving-texas', destination: '/blog/', permanent: true },
      {
        source: '/2024/04/04/dallas-detox-center-a-guiding-light-on-your-path-to-recovery',
        destination: '/blog/fort-worth-wellness-center-a-guiding-light-on-your-path-to-recovery/',
        permanent: true,
      },
      {
        source: '/2025/12/29/alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year',
        destination: '/blog/alcohol-drug-detox-in-fort-worth-what-to-expect-when-starting-recovery-in-the-new-year/',
        permanent: true,
      },
      {
        source: '/2024/02/23/the-vital-role-of-aftercare-in-sustaining-long-term-recovery-insights-from-dallas-detox-center',
        destination: '/blog/the-vital-role-of-aftercare-in-sustaining-long-term-recovery-insights-from-fort-worth-wellness-center/',
        permanent: true,
      },
      {
        source: '/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas',
        destination: '/blog/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-fort-worth/',
        permanent: true,
      },

      //    The other 36 old permalinks keep their slug exactly, so one pattern covers
      //    them — and covers any date-based post the crawl happened to miss. The four
      //    segments are all constrained to digits/slug, so nothing in this app can
      //    collide with it: no real route is /nnnn/nn/nn/anything.
      { source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug', destination: '/blog/:slug/', permanent: true },

      // ----------------------------------------------------------------------
      // 7. WordPress author archives — /author/kris/ and three others are live and
      //    indexed today. They have no equivalent here (posts are bylined to the
      //    clinical team, not individuals), so they go to the blog index rather than
      //    404. Not the post feeds: /…/slug/feed/ is left to 404 on purpose, since
      //    redirecting an RSS URL to an HTML page just moves the error.
      // ----------------------------------------------------------------------
      { source: '/author/:slug', destination: '/blog/', permanent: true },
    ];
  },
};

export default nextConfig;
