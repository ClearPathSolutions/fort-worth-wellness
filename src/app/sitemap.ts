import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

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
    '/contact-us',
    '/privacy-policy',
  ];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/treatment') ? 0.8 : 0.6,
  }));
}
