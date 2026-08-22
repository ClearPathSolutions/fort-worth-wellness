'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordPageview } from '@/lib/attribution';

/**
 * Persists the campaign that brought a visitor here, on every pageview (FW-46).
 *
 * Mounted in the root layout, which is the load-bearing part: a campaign lands on whatever page
 * the ad points at — often `/treatment/detox` or `/admissions`, not a page with a form — and the
 * query string is gone by the time the visitor reaches one. Capture has to happen where they
 * land, not where they convert. See `lib/attribution.ts` for what is stored and why it is not
 * written back into the URL.
 *
 * Keyed on `usePathname`, deliberately **not** `useSearchParams`: reading search params in a
 * component this high forces a Suspense boundary and opts every otherwise-static page in the
 * site into dynamic rendering. `recordPageview` reads `location.search` directly instead, which
 * is the same information without the rendering cost.
 *
 * Renders nothing.
 */
export default function AttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    recordPageview();
  }, [pathname]);

  return null;
}
