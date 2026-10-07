import { site } from './site';

/**
 * Editorial policy — the portfolio-wide page from the editorial-policy dev package.
 *
 * The copy is shared by every site and must not be reworded here; only the five merge fields
 * below differ per site (this is SITE_ID 4 in the package's facilities.csv).
 *
 * GOING LIVE: fill `lastReviewed` and `contentSignoff` below. That is the whole change.
 *
 * Until every field is filled, production withholds the policy: the route 404s, nothing links
 * to it (footer, /about, article bylines), it is left out of the sitemap, and the Organization
 * schema does not point at it. Every other build (local, Vercel preview) still renders it with
 * noindex so it can be reviewed. Once ready, the build fails if any `{{` placeholder survives.
 *
 * No `server-only` imports here: the footer and the byline read the flags below.
 */
export const editorial = {
  /**
   * Brand name as the site footer shows it (`site.name`). The package's CSV row says "Fort Worth
   * Wellness", but the README defines this field as the footer brand name, which carries
   * "Center".
   */
  facilityName: site.name,
  domain: new URL(site.url).hostname,
  /** Monitored corrections inbox. */
  editorialEmail: 'info@fortworthwellness.org',
  /** As shown on the site; the tel: form is digits only, prefixed +1. */
  phone: site.phone.display,
  phoneTel: site.phone.href.replace(/^tel:/, ''),
  /** YYYY-MM-DD — the date the content team last reviewed the policy. Blank until supplied. */
  lastReviewed: '',
  /** Copy of the CSV's CONTENT_SIGNOFF cell. Blank until the content team signs off. */
  contentSignoff: '',
};

/** Slash-canonical, matching `trailingSlash: true` in next.config.mjs. */
export const EDITORIAL_POLICY_PATH = '/editorial-policy/';
export const EDITORIAL_POLICY_URL = `${site.url}${EDITORIAL_POLICY_PATH}`;
export const CORRECTIONS_ANCHOR = 'content-updates-and-corrections';

export const editorialMissing: string[] = [
  !editorial.editorialEmail && 'EDITORIAL_EMAIL',
  !/^\d{4}-\d{2}-\d{2}$/.test(editorial.lastReviewed) && 'LAST_REVIEWED',
  !editorial.contentSignoff && 'CONTENT_SIGNOFF',
].filter((f): f is string => Boolean(f));

/** Every field filled and signed off: the policy may be public, indexed and in the sitemap. */
export const editorialPolicyReady = editorialMissing.length === 0;

/** Whether this build serves the page at all (preview and local do, noindex, for review). */
export const editorialPolicyServed =
  editorialPolicyReady || process.env.VERCEL_ENV !== 'production';
