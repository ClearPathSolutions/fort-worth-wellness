import type { Post } from './posts';
import { medicalOversight, site } from './site';

/** Someone a post can credit by name. `bioPath` is null only for a CMS-supplied author name. */
export type BylinePerson = {
  name: string;
  credentials: string | null;
  bioPath: string | null;
};

/**
 * People a local post may name in `written_by` / `reviewed_by`.
 *
 * Only people with a bio page on this site belong here: the policy promises that every credited
 * name links to one. Today that is Dr. Tambini alone (/team/pamela-tambini/, which already emits
 * her Person schema). Add a person here only after their bio page exists — the content team
 * supplies names, credentials and copy. Listing someone here does not credit them on any post.
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

export type Byline = {
  author: BylinePerson | null;
  /** Set only when the post has both a reviewer and a review date. */
  reviewer: BylinePerson | null;
  lastReviewed: string | null;
};

export function getByline(post: Post): Byline {
  if (post.last_reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(post.last_reviewed)) {
    throw new Error(`blog/${post.slug}: last_reviewed must be YYYY-MM-DD, got "${post.last_reviewed}"`);
  }
  const lastReviewed = post.last_reviewed || null;
  // Resolved even when undated, so a typo'd key still fails the build.
  const reviewer = post.reviewed_by ? person(post.reviewed_by, post.slug, 'reviewed_by') : null;
  const author = post.written_by
    ? person(post.written_by, post.slug, 'written_by')
    : post.author_name
      ? { name: post.author_name, credentials: null, bioPath: null }
      : null;
  return { author, reviewer: lastReviewed ? reviewer : null, lastReviewed };
}

const orgRef = { '@id': `${site.url}/#organization` };
const personRef = (bioPath: string) => ({ '@id': `${site.url}${bioPath}#person` });

/**
 * schema/clinical-article.jsonld — MedicalWebPage + BlogPosting. `reviewedBy` / `lastReviewed`
 * only when the post is reviewed. The author is a Person reference only when they have a bio
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
        ...(byline.reviewer?.bioPath && byline.lastReviewed
          ? { lastReviewed: byline.lastReviewed, reviewedBy: personRef(byline.reviewer.bioPath) }
          : {}),
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
