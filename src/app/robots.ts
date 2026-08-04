import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // No `host` directive — it is a Yandex-only extension that Google and Bing ignore,
    // and the canonical host is already declared per page via `alternates.canonical`.
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
