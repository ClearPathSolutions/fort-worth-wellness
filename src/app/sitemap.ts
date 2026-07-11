import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getAllPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about-us',
    '/treatment',
    '/treatment/detox',
    '/treatment/mental-health-residential',
    '/treatment/dual-diagnosis',
    '/treatment/aftercare-planning',
    '/who-we-help',
    '/tour',
    '/admissions',
    '/blog',
    '/contact-us',
    '/privacy-policy',
  ];
  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/treatment') ? 0.8 : 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : undefined,
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
