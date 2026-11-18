import type { MetadataRoute } from 'next';
import { canonicalOrigin } from '@/lib/site';
import { getUnifiedPosts } from '@/lib/posts';
import { editorialPolicyReady, EDITORIAL_POLICY_PATH } from '@/lib/editorial';

// Render per request. A static sitemap is frozen at each deploy on Vercel, so Clarion
// posts published after a deploy never reached it (13 were missing on 2026-11-18). The
// Clarion feed fetch keeps its own 5-minute data cache (lib/clarion.ts), so this costs
// no extra Clarion calls.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // V0102: the build is slash-canonical, so the homepage entry must be '/' — a bare
  // `https://www.fortworthwellness.org` here would disagree with its own canonical tag.
  const routes = [
    '/',
    '/about/',
    '/team/',
    '/team/pamela-tambini/',
    '/team/casey-hyatt/',
    '/treatment/',
    '/treatment/detox/',
    '/treatment/mental-health-residential/',
    '/treatment/dual-diagnosis/',
    '/treatment/aftercare/',
    '/who-we-help/',
    '/tour/',
    '/admissions/',
    '/blog/',
    '/faq/',
    '/contact/',
    '/privacy-policy/',
    '/notice-of-privacy-practices/',
    '/sms-terms/',
    '/terms-of-service/',
    // Listed only once the policy may be indexed (see `lib/editorial.ts`).
    ...(editorialPolicyReady ? [EDITORIAL_POLICY_PATH] : []),
  ];
  // Static routes have no per-page content date, so they carry the build timestamp —
  // an honest "last time this page could have changed" rather than no signal at all.
  const builtAt = new Date();
  const origin = canonicalOrigin();

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${origin}${path}`,
    lastModified: builtAt,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/treatment') ? 0.8 : 0.6,
  }));

  // Same merged list /blog renders: live Clarion posts plus the legacy articles. If
  // Clarion is down the feed returns [] and the legacy posts and pages still list.
  const postEntries: MetadataRoute.Sitemap = (await getUnifiedPosts()).map((p) => ({
    url: `${origin}/blog/${p.slug}/`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
