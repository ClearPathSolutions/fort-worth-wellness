import postsData from './posts.json';

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  image: string;
  readingMin: number;
  html: string;
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
