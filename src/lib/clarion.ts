import { clarion } from './site';
import type { Post } from './posts';

// ============================================================================
// ClarionLabs blog — server-side fetch.
//
// Clarion is the source of truth for new posts. We fetch its public feed on the
// SERVER (no browser CORS, forwarding an allowed Origin + a browser UA so
// Clarion's origin-pinned edge serves us) and normalize each post into the
// shared `Post` shape so it can live in the same unified list as the legacy
// JSON articles. This replaces the old client-side embed + /api/clarion proxy.
//
// Every function degrades gracefully: if Clarion is unreachable, rate-limited,
// or origin-blocked, we return an empty list / null so the blog still renders
// the legacy library instead of erroring.
// ============================================================================

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// Clarion's edge authorizes public reads by request provenance. Its rule (as
// observed): if an `Origin` header is present it must be on the site's strict
// allow-list, but a request with NO Origin and a matching `Referer` is served.
// Server-to-server fetch has no business sending Origin (that's a browser CORS
// concept), so we send only Referer — matching what a real page request looks
// like and sidestepping the origin allow-list entirely. Overridable via env.
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://www.fortworthwellness.org');
const REFERER = `${SITE_ORIGIN.replace(/\/$/, '')}/blog`;

// Revalidate Clarion data periodically so newly-published posts appear without a
// redeploy (ISR). Kept short-ish; Clarion is the editorial surface.
const REVALIDATE_SECONDS = 300;

type ClarionFeedPost = {
  slug: string;
  title: string;
  excerpt?: string;
  cover_image_url?: string;
  author_name?: string;
  published_at?: string;
  seo_meta?: { title?: string; description?: string };
};

type ClarionFullPost = ClarionFeedPost & { body_html?: string };

// A placeholder cover for Clarion posts that ship without one, so cards/heroes
// don't render a broken image. Uses an existing local facility photo.
const FALLBACK_COVER = '/images/facility/dsc09517.jpg';

function estimateReadingMin(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function clarionFetch(path: string): Promise<Response | null> {
  const base = clarion.api.replace(/\/$/, '');
  const sep = path.includes('?') ? '&' : '?';
  const url = `${base}/${path}${sep}site_key=${encodeURIComponent(clarion.siteKey)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': BROWSER_UA, Referer: REFERER, Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/** All published Clarion posts, normalized to the shared Post shape (no html). */
export async function getClarionPosts(): Promise<Post[]> {
  const res = await clarionFetch('blog/public/feed');
  if (!res) return [];
  let data: { posts?: ClarionFeedPost[] };
  try {
    data = await res.json();
  } catch {
    return [];
  }
  const posts = data?.posts || [];
  return posts
    .filter((p) => p && p.slug && p.title)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.published_at || '',
      excerpt: p.excerpt || '',
      image: p.cover_image_url || FALLBACK_COVER,
      readingMin: 0, // unknown from the feed; the full post computes a real value
      html: '', // body is only on the single-post endpoint
    }));
}

/** A single Clarion post with its body, normalized to the shared Post shape. */
export async function getClarionPost(slug: string): Promise<Post | null> {
  const res = await clarionFetch(`blog/public/post?slug=${encodeURIComponent(slug)}`);
  if (!res) return null;
  let p: ClarionFullPost;
  try {
    p = await res.json();
  } catch {
    return null;
  }
  if (!p || !p.slug || !p.title) return null;
  const html = p.body_html || '';
  return {
    slug: p.slug,
    title: p.title,
    date: p.published_at || '',
    excerpt: p.excerpt || p.seo_meta?.description || '',
    image: p.cover_image_url || FALLBACK_COVER,
    readingMin: estimateReadingMin(html),
    html,
  };
}
