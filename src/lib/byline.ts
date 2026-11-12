import type { Post } from './posts';
import { medicalOversight, site } from './site';

/** Someone a post can credit by name. `bioPath` is null only for a CMS-supplied author name. */
export type BylinePerson = {
  name: string;
  credentials: string | null;
  bioPath: string | null;
};

/**
 * People a local post may name in `written_by` / `reviewed_by`. (A post that names no reviewer
 * still gets one: see DEFAULT_REVIEWER below.)
 *
 * Only people with a bio page on this site belong here: the policy promises that every credited
 * name links to one. Today that is Dr. Tambini alone (/team/pamela-tambini/, which already emits
 * her Person schema). Add a person here only after their bio page exists — the content team
 * supplies names, credentials and copy. Listing someone here does not by itself credit them.
 */
export const bylinePeople: Record<string, Omit<BylinePerson, 'bioPath'> & { bioPath: string }> = {
  [medicalOversight.slug]: {
    // "Dr." dropped because the credential follows the name ("Pamela Tambini, MD").
    name: medicalOversight.name.replace(/^Dr\.\s+/, ''),
    credentials: medicalOversight.credential,
    bioPath: `/team/${medicalOversight.slug}/`,
  },
};

function person(key: string, slug: string, field: string): BylinePerson {
  const p = bylinePeople[key];
  // Fail the build: a byline naming someone without a bio page is exactly what the policy
  // promises never to publish.
  if (!p) throw new Error(`blog/${slug}: ${field} "${key}" is not in bylinePeople (lib/byline.ts)`);
  return p;
}

/**
 * The medical reviewer as shown on a post. `href` is an internal path (same-tab `<Link>`) when
 * the profile is on this site, otherwise the absolute URL; `schemaUrl` is always absolute and,
 * for an on-site profile, built on `site.url`'s host so it matches the bio page's Person @id.
 */
export type Reviewer = {
  name: string;
  credentials: string | null;
  href: string | null;
  internal: boolean;
  schemaUrl: string | null;
};

/**
 * Site-wide default reviewer. The client has asked that every blog post, from every source and
 * including future ones, credit Dr. Tambini as medical reviewer. Each field Clarion leaves empty
 * is filled from here individually; local posts always get it in full.
 */
export const DEFAULT_REVIEWER = {
  name: medicalOversight.name, // "Dr. Pamela Tambini"
  credentials: 'M.D.',
  url: `${site.url}/team/${medicalOversight.slug}/`,
};

/**
 * Turns a reviewer URL into a link target. A URL on this site's host (www or not) becomes an
 * internal path in the slash-canonical form (`trailingSlash: true`), so the link doesn't 308.
 */
function resolveReviewerUrl(raw: string): Pick<Reviewer, 'href' | 'internal' | 'schemaUrl'> {
  let abs: URL;
  try {
    abs = new URL(raw, site.url);
  } catch {
    return { href: null, internal: false, schemaUrl: null };
  }
  const host = (h: string) => h.replace(/^www\./, '');
  if (host(abs.hostname) === host(new URL(site.url).hostname)) {
    const path = `${abs.pathname.replace(/\/+$/, '')}/`;
    return { href: path, internal: true, schemaUrl: `${site.url}${path}` };
  }
  return { href: abs.href, internal: false, schemaUrl: abs.href };
}

export type Byline = {
  author: BylinePerson | null;
  /** Always set: the post's own reviewer fields, each missing one filled from DEFAULT_REVIEWER. */
  reviewer: Reviewer;
  /** Only when the post carries a real review date; never invented. */
  lastReviewed: string | null;
};

export function getByline(post: Post): Byline {
  if (post.last_reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(post.last_reviewed)) {
    throw new Error(`blog/${post.slug}: last_reviewed must be YYYY-MM-DD, got "${post.last_reviewed}"`);
  }
  const lastReviewed = post.last_reviewed || null;
  // A local post may still name a reviewer by key; a typo'd key fails the build.
  const named = post.reviewed_by ? person(post.reviewed_by, post.slug, 'reviewed_by') : null;
  const name = post.reviewer_name?.trim() || DEFAULT_REVIEWER.name;
  const credentials = post.reviewer_credentials?.trim() || named?.credentials || DEFAULT_REVIEWER.credentials;
  const url =
    post.reviewer_url?.trim() || (named ? `${site.url}${named.bioPath}` : DEFAULT_REVIEWER.url);
  const reviewer: Reviewer = { name, credentials, ...resolveReviewerUrl(url) };
  const author = post.written_by
    ? person(post.written_by, post.slug, 'written_by')
    : post.author_name
      ? { name: post.author_name, credentials: null, bioPath: null }
      : null;
  return { author, reviewer, lastReviewed };
}

const orgRef = { '@id': `${site.url}/#organization` };
const personRef = (bioPath: string) => ({ '@id': `${site.url}${bioPath}#person` });

/**
 * schema/clinical-article.jsonld — MedicalWebPage + BlogPosting. `reviewedBy` on every post (the
 * reviewer always resolves, see getByline); `lastReviewed` only when the post has a real date. The author is a Person reference only when they have a bio
 * page; otherwise it stays the Organization, as it was before (a CMS author name such as
 * Clarion's "… Editorial Team" is not a verifiable Person).
 */
export function articleSchema(post: Post, byline: Byline) {
  const url = `${site.url}/blog/${post.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: post.title,
        ...(byline.lastReviewed ? { lastReviewed: byline.lastReviewed } : {}),
        reviewedBy: {
          '@type': 'Person',
          ...(byline.reviewer.schemaUrl
            ? { '@id': `${byline.reviewer.schemaUrl}#person`, url: byline.reviewer.schemaUrl }
            : {}),
          name: byline.reviewer.name,
          ...(byline.reviewer.credentials ? { honorificSuffix: byline.reviewer.credentials } : {}),
        },
        publisher: orgRef,
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        ...(post.date ? { datePublished: post.date } : {}),
        image: post.image.startsWith('/') ? `${site.url}${post.image}` : post.image,
        description: post.excerpt,
        author: byline.author?.bioPath ? personRef(byline.author.bioPath) : orgRef,
        publisher: orgRef,
      },
    ],
  };
}
