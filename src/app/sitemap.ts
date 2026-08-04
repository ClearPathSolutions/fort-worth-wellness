import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  // V0102: the build is slash-canonical, so the homepage entry must be '/' — a bare
  // `https://fortworthwellness.org` here would disagree with its own canonical tag.
  const routes = [
    '/',
    '/about/',
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
  ];
  // Static routes have no per-page content date, so they carry the build timestamp —
  // an honest "last time this page could have changed" rather than no signal at all.
  const builtAt = new Date();

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: builtAt,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/treatment') ? 0.8 : 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${site.url}/blog/${p.slug}/`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
