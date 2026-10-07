import postsData from './posts.json';

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  image: string;
  readingMin: number;
  html: string;
  /**
   * Editorial-policy per-post fields (legacy posts in posts.json). All optional and all unset
   * today. `written_by` / `reviewed_by` are keys in `bylinePeople` (`lib/byline.ts`), so every
   * credited name links to a real bio page; an unknown key fails the build. A missing value
   * means no line — there is never a site-wide default author or reviewer.
   */
  written_by?: string;
  reviewed_by?: string;
  /** YYYY-MM-DD. The reviewer line shows only when both this and `reviewed_by` are set. */
  last_reviewed?: string;
  /** Clarion posts only: the feed's `author_name`, verbatim. Clarion has no bio or reviewer field. */
  author_name?: string;
};

const posts = postsData as Post[];

// Newest first (already sorted at build, but guarantee it)
const sorted = [...posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

export function getAllPosts(): Post[] {
  return sorted;
}

export function getPost(slug: string): Post | undefined {
  return sorted.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): Post[] {
  return sorted.filter((p) => p.slug !== slug).slice(0, count);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Unified list: legacy JSON articles + live Clarion posts, merged into one
// newest-first list. Clarion is the source of truth, so on a slug collision the
// Clarion post wins. Imported lazily to avoid a circular import (clarion.ts
// imports the Post type from here).
// ---------------------------------------------------------------------------
export async function getUnifiedPosts(): Promise<Post[]> {
  const { getClarionPosts } = await import('./clarion');
  const clarionPosts = await getClarionPosts();
  const clarionSlugs = new Set(clarionPosts.map((p) => p.slug));
  const legacy = sorted.filter((p) => !clarionSlugs.has(p.slug));
  return [...clarionPosts, ...legacy].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
