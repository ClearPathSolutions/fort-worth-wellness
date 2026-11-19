import { clarion, site } from './site';
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
  cover_image_alt?: string | null;
  author_name?: string;
  published_at?: string;
  seo_meta?: { title?: string; description?: string };
  medically_reviewed_by?: string | null;
  medically_reviewed_by_credentials?: string | null;
  medically_reviewed_by_url?: string | null;
};

type ClarionFullPost = ClarionFeedPost & { body_html?: string };

/**
 * Blog images on this site's own domain. Clarion hands out
 * `https://api.clarionlabs.ai/blog/public/image/<key>` (or, once it is told this site proxies
 * images, `<this site>/blog-images/<key>`). Both become `/blog-images/<key>`, which
 * next.config.mjs rewrites to Clarion's bytes route, so the address a visitor, Google Images or a
 * social card sees is this site's. Relative, so next/image treats it as a local image.
 */
const CLARION_IMAGE = `${clarion.api.replace(/\/$/, '')}/blog/public/image/`;
const OWN_HOST = new URL(site.url).hostname.replace(/^www\./, '').replace(/\./g, '\\.');
const OWN_IMAGE = new RegExp(`^https://(?:www\\.)?${OWN_HOST}(?=/blog-images/)`);

export function onSiteImage(src: string): string {
  if (src.startsWith(CLARION_IMAGE)) return `/blog-images/${src.slice(CLARION_IMAGE.length)}`;
  return src.replace(OWN_IMAGE, '');
}

function onSiteImages(html: string): string {
  return html.split(CLARION_IMAGE).join('/blog-images/');
}

const altOf = (alt: string | null | undefined) => (typeof alt === 'string' && alt.trim() ? alt.trim() : undefined);

// A placeholder cover for Clarion posts that ship without one, so cards/heroes
// don't render a broken image. Uses an existing local facility photo.
const FALLBACK_COVER = '/images/facility/great-room-seating-open-to-kitchen.jpg';

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
      image: p.cover_image_url ? onSiteImage(p.cover_image_url) : FALLBACK_COVER,
      ...(altOf(p.cover_image_alt) ? { imageAlt: altOf(p.cover_image_alt) } : {}),
      readingMin: 0, // unknown from the feed; the full post computes a real value
      html: '', // body is only on the single-post endpoint
    }));
}

/**
 * Clarion's reviewer fields, each kept only where populated. getByline() fills the rest from the
 * site default, so every post shows a reviewer without any per-post action in Clarion.
 */
export function clarionReviewer(
  p: ClarionFeedPost,
): Pick<Post, 'reviewer_name' | 'reviewer_credentials' | 'reviewer_url'> {
  const v = (x?: string | null) => (typeof x === 'string' && x.trim() ? x.trim() : undefined);
  const out: Pick<Post, 'reviewer_name' | 'reviewer_credentials' | 'reviewer_url'> = {};
  const name = v(p.medically_reviewed_by);
  const credentials = v(p.medically_reviewed_by_credentials);
  const url = v(p.medically_reviewed_by_url);
  if (name) out.reviewer_name = name;
  if (credentials) out.reviewer_credentials = credentials;
  if (url) out.reviewer_url = url;
  return out;
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
  const html = onSiteImages(p.body_html || '');
  return {
    slug: p.slug,
    title: p.title,
    date: p.published_at || '',
    excerpt: p.excerpt || p.seo_meta?.description || '',
    image: p.cover_image_url ? onSiteImage(p.cover_image_url) : FALLBACK_COVER,
    ...(altOf(p.cover_image_alt) ? { imageAlt: altOf(p.cover_image_alt) } : {}),
    readingMin: estimateReadingMin(html),
    html,
    // Shown as "Written by" when Clarion supplies it; never defaulted.
    ...(p.author_name?.trim() ? { author_name: p.author_name.trim() } : {}),
    ...clarionReviewer(p),
  };
}
