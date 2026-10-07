import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import {
  editorial,
  editorialPolicyReady,
  editorialPolicyServed,
  EDITORIAL_POLICY_PATH,
  EDITORIAL_POLICY_URL,
} from '@/lib/editorial';
import { editorialPolicyBody } from '@/lib/editorial-policy-body';

/*
 * Why an optional catch-all for a single page: on Next 14, a statically rendered page that calls
 * `notFound()` is written out as the 404 *markup* but served with HTTP 200 (and the page's own
 * <title>) — a soft 404. Gating through `generateStaticParams` + `dynamicParams = false` instead
 * means production simply has no /editorial-policy/ path until the policy is signed off, so it
 * gets a real 404. Served builds prerender exactly one path (`slug` empty = /editorial-policy/);
 * anything deeper (/editorial-policy/x/) 404s. Static either way: the body is read from disk at
 * build time.
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string[] }[] {
  return editorialPolicyServed ? [{ slug: [] }] : [];
}

const title = `Editorial Policy | ${editorial.facilityName}`;
// The template's meta description, with its two merge fields filled.
const description = `How ${editorial.facilityName} researches, writes, clinically reviews and updates the health information on ${editorial.domain}.`;

export const metadata: Metadata = {
  // Absolute: the package specifies this exact title.
  ...pageMeta({ title, description, path: EDITORIAL_POLICY_PATH, absoluteTitle: true }),
  // Indexable only once signed off; preview and local builds render it for review only.
  ...(editorialPolicyReady ? {} : { robots: { index: false, follow: false } }),
};

export default function EditorialPolicyPage({ params }: { params: { slug?: string[] } }) {
  // Belt and braces: generateStaticParams already yields no path when withheld.
  if (!editorialPolicyServed || (params.slug?.length ?? 0) > 0) notFound();
  const html = editorialPolicyBody();

  return (
    <>
      {/* Same page frame as /privacy-policy, the site's other policy page. */}
      <section className="bg-ink-900 pt-16">
        <div className="container-fw pb-14 pt-6">
          <JsonLd data={breadcrumbSchema([{ label: 'Editorial Policy' }])} />
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/85">Editorial Policy</span>
          </nav>
          <h1 className="text-4xl !text-white sm:text-5xl">Editorial Policy</h1>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-fw">
          {/* suppressHydrationWarning: CallTrackingMetrics rewrites the phone link inside. */}
          <div
            className="article-body mx-auto max-w-prose"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>

      {/* schema/editorial-policy-page.jsonld */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${EDITORIAL_POLICY_URL}#webpage`,
          url: EDITORIAL_POLICY_URL,
          name: 'Editorial Policy',
          description,
          // The template's `isPartOf: #website` is omitted: this site emits no WebSite node,
          // and a reference to one would dangle.
          about: { '@id': `${site.url}/#organization` },
          ...(editorial.lastReviewed ? { lastReviewed: editorial.lastReviewed } : {}),
          inLanguage: 'en-US',
        }}
      />
    </>
  );
}
