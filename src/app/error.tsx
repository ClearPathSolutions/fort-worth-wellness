'use client';

import Link from 'next/link';
import { site } from '@/lib/site';
import { ArrowRight, Phone } from '@/components/icons';

/**
 * Route-level error boundary (FW-34). Without this, an unhandled render error showed Next's
 * default screen — no phone number, no way forward. On a site whose visitors may be in
 * crisis, the fallback has to keep the 24/7 line reachable.
 */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section bg-cream">
      <div className="container-fw flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="eyebrow justify-center">
          <span className="h-px w-6 bg-steel" /> Something went wrong
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl">This page didn't load</h1>
        <p className="mt-4 max-w-md text-ink/65">
          Sorry — something on our end failed. You can try again, or call us and we'll help right
          away. We answer around the clock.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.phone.href} className="btn-primary">
            <Phone width={16} height={16} /> Call {site.phone.display}
          </a>
          <button type="button" onClick={reset} className="btn-ghost">
            Try again
          </button>
        </div>
        <Link href="/" className="mt-6 text-sm font-semibold text-steel hover:underline">
          Back to home <ArrowRight width={14} height={14} className="inline" />
        </Link>
      </div>
    </section>
  );
}
