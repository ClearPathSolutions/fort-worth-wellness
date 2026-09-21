import type { Metadata } from 'next';
import { medicalOversight, services, site, social } from './site';

/**
 * Builds a page's `metadata` so canonical and Open Graph can never drift apart.
 *
 * Two bugs made this worth centralising:
 *
 * - **V0039** — no page had a canonical, so the fully-indexable preview deployment competed
 *   with its production twin as a near-duplicate.
 * - **V0040** — `openGraph` was declared once in `layout.tsx` with `url: site.url`. Next
 *   *replaces* rather than deep-merges `openGraph`, so the 12 pages that inherited it all
 *   claimed the bare domain root, and the 42 blog posts that declared their own `openGraph`
 *   dropped `og:url` entirely. Every page now passes its own `path` through one function.
 *
 * `path` is root-relative ('/', '/treatment/detox'); `metadataBase` in `layout.tsx` resolves
 * it to the production domain, so preview builds still canonicalise to production.
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  /** Omit to inherit the site-wide `opengraph-image` card. */
  image?: string;
  /** 'article' for blog posts, which also sets `publishedTime`. */
  type?: 'website' | 'article';
  publishedTime?: string;
  /** Skip the layout's `%s | Fort Worth Wellness Center` template (the homepage leads with the brand). */
  absoluteTitle?: boolean;
}): Metadata {
  const { title, description, path, image, type = 'website', publishedTime, absoluteTitle } = opts;

  // The `opengraph-image.tsx` file convention only attaches to the segment it lives in, and
  // every page here declares its own `openGraph` — so nested routes got no `og:image` at all.
  // Referencing the generated route by path makes the default card apply everywhere.
  // Trailing slash matters here: `trailingSlash: true` 308s `/opengraph-image` to the slashed
  // form, so the slashless URL would hand every social crawler a redirect instead of the PNG.
  // Most follow it, but there is no reason to rely on that when the final URL is free.
  const ogImage = image
    ? { url: image, alt: title }
    : { url: '/opengraph-image/', width: 1200, height: 630, alt: title };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      title,
      description,
      url: path,
      images: [ogImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
  };
}

// ============================================================================
// Structured data
// ============================================================================

export type Crumb = { label: string; href?: string };

/**
 * Absolute, slash-canonical URL for a root-relative path.
 *
 * Every URL emitted into structured data has to match the form the site actually serves, or the
 * schema cites a redirect. `trailingSlash: true` makes the slashed form canonical, and paths in
 * `site.ts` (`nav`, `services[].href`) are stored without one — so they need normalising on the way
 * out. Extracted because `breadcrumbSchema` was doing this inline while `organizationSchema` was
 * not, and the two had drifted.
 */
function absUrl(path: string) {
  return `${site.url}${path === '/' ? '/' : path.replace(/\/?$/, '/')}`;
}

/**
 * `BreadcrumbList` for a page that renders visible breadcrumbs (FW-27). Ten pages showed a
 * breadcrumb trail with no corresponding schema.
 *
 * The trail always starts at Home, so callers pass only the crumbs after it. The final entry
 * deliberately omits `item`: Google treats a trailing `name`-only element as the current page,
 * which means this needs no knowledge of the page's own URL.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  const items = [{ label: 'Home', href: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href && i < items.length - 1 ? { item: absUrl(c.href) } : {}),
    })),
  };
}

/** `FAQPage` for the four pages carrying FAQ accordions (FW-26). */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * Site-wide `MedicalBusiness` (FW-28).
 *
 * Added: `areaServed`, `hasOfferCatalog` (from the real `services` list), `hasMap`, and
 * `openingHoursSpecification` in place of the looser `openingHours` string.
 *
 * `sameAs` now carries the three official social profiles (see `social` in `site.ts`, which is
 * also what the footer renders — one list, so the markup and the structured data cannot drift).
 * `site.reviewUrl` is still excluded: it is a review-submission deep link, not a profile URL.
 *
 * Deliberately still absent, because each would mean inventing a fact:
 * - **`geo`** — needs verified coordinates for 101 Mariah Drive. A wrong lat/long on a healthcare
 *   NAP propagates into directories and Google Business Profile, and note that question 6 in
 *   `issues.md` has the street number itself unresolved (101 here vs 100 on the Dallas site).
 * - **`priceRange`** — no published pricing.
 */
/**
 * `Person` schema for the physician providing medical oversight.
 *
 * This is the machine-readable half of the medical-authority claim the page makes in prose.
 * `sameAs` points at the Quadrant profile the bio is copied from, so the two are linked rather
 * than being two unattributed copies of the same text.
 *
 * `worksFor` is The Sober Connection and NOT this facility, matching what the source states and
 * what `medicalOversight.scopeNote` tells the reader. A Person schema that named her an employee
 * of Fort Worth Wellness Center would be asserting something untrue in the one format that gets
 * consumed without a human reading it.
 */
export function personSchema() {
  const m = medicalOversight;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.url}/team/${m.slug}/#person`,
    name: m.name,
    honorificPrefix: 'Dr.',
    jobTitle: m.role,
    image: `${site.url}${m.image}`,
    url: `${site.url}/team/${m.slug}/`,
    sameAs: [m.sourceUrl],
    description: m.bio[0],
    worksFor: {
      '@type': 'Organization',
      name: 'The Sober Connection',
    },
    knowsAbout: m.boardCertifications,
    hasCredential: m.boardCertifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Board Certification',
      about: { '@type': 'MedicalSpecialty', name: c },
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    telephone: site.phone.display,
    email: site.email,
    image: `${site.url}/brand/logo.png`,
    logo: `${site.url}/brand/logo.png`,
    foundingDate: String(site.founded),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: 'TX',
      postalCode: site.address.zip,
      addressCountry: 'US',
    },
    hasMap: site.address.mapUrl,
    sameAs: social.map((s) => s.href),
    medicalSpecialty: ['Psychiatric', 'Addiction Medicine'],
    areaServed: [
      { '@type': 'City', name: 'Fort Worth' },
      { '@type': 'City', name: 'Weatherford' },
      { '@type': 'AdministrativeArea', name: 'Parker County, Texas' },
      { '@type': 'AdministrativeArea', name: 'Tarrant County, Texas' },
      { '@type': 'State', name: 'Texas' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Treatment programs',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalTherapy',
          name: s.title,
          description: s.blurb,
          url: absUrl(s.href),
        },
      })),
    },
  };
}
