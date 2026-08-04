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
   * Deliberately NOT a Content-Security-Policy. Three third-party scripts are injected at
   * runtime (Clarion's widget, form capture and blog embed) and they inject their own
   * stylesheets and markup; a CSP written without knowing their exact origins and inline
   * hashes would silently break the chat launcher and the lead form — the two things on
   * this site that actually convert. That needs Clarion's origin list, so it is an owner
   * task, not a guess.
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
