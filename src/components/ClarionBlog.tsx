'use client';

import Script from 'next/script';
import { clarion } from '@/lib/site';

/**
 * ClarionLabs blog embed. Clarion is the source of truth for posts; this renders
 * the site's published posts into the [data-clarion-blog] container client-side.
 * Styling for the injected `.clarion-blog-*` class hooks lives in globals.css.
 */
export default function ClarionBlog() {
  return (
    <>
      <div data-clarion-blog />
      <Script
        src={clarion.blogSrc}
        data-site-key={clarion.siteKey}
        data-api={clarion.api}
        strategy="afterInteractive"
      />
    </>
  );
}
