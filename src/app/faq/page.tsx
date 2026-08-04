import type { Metadata } from 'next';
import Link from 'next/link';
import { allFaqs, faqGroup, faqGroups } from '@/lib/faqs';
import { faqSchema, pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Phone } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Frequently Asked Questions',
  description:
    'Answers about admissions, insurance, medical detox, residential mental health care, and dual diagnosis treatment at Fort Worth Wellness Center.',
  path: '/faq/',
});

/**
 * The consolidated FAQ hub (V0099).
 *
 * Every question here is imported from `src/lib/faqs.ts` — the same source the four service pages
 * render from — so the hub and the pages can never disagree.
 *
 * This page is the **single home for the `FAQPage` markup**. The service pages keep their visible
 * accordions (that is where someone deciding on detox is actually reading) but no longer emit
 * their own `FAQPage` blocks, because marking the same Q&A up at five URLs is the one thing
 * Google's guidance on this is explicit about.
 */
export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Answers, Plainly"
        title="Frequently asked questions"
        subtitle="The questions people ask us most, gathered in one place — about getting started, what insurance covers, and what each level of care actually involves. If yours isn't here, call us; we answer around the clock."
        image="/images/facility/dining-room-long-table-and-fireplace.jpg"
        crumbs={[{ label: 'FAQ' }]}
      />

      {/* Jump nav — 21 questions is a lot to scroll blindly. */}
      <section className="section bg-cream pb-0">
        <div className="container-fw">
          <Reveal>
            <nav aria-label="Jump to a topic" className="flex flex-wrap justify-center gap-3">
              {faqGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink/80 shadow-sm transition-colors hover:border-steel hover:text-steel"
                >
                  {g.title}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {faqGroups.map((g, i) => (
        <section
          key={g.id}
          id={g.id}
          className={`section ${i % 2 === 0 ? 'bg-cream' : 'bg-cream-deep'}`}
        >
          <div className="container-fw">
            {/* Centred, not left-aligned: the accordion below is `mx-auto max-w-3xl` and the
                "More about…" link below that is centred too, so a left-aligned heading was the
                only element on its own axis — it read as nudged out of place rather than as a
                deliberate left column. */}
            <SectionHeading eyebrow={`0${i + 1}`} title={g.title} />
            <div className="mt-8">
              <FAQ items={faqGroup(g.id)} />
            </div>
            <Reveal className="mt-8 text-center" delay={80}>
              <Link
                href={g.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel hover:underline"
              >
                More about {g.hrefLabel} <ArrowRight width={15} height={15} />
              </Link>
            </Reveal>
          </div>
        </section>
      ))}

      {/* Didn't find it */}
      <section className="section bg-ink text-white">
        <div className="container-fw">
          <SectionHeading
            tone="light"
            eyebrow="Still Have a Question?"
            title="Ask us directly"
            intro="Some questions are too specific for a page like this — about your medication, your coverage, or someone you're worried about. Those are the ones worth a conversation."
          />
          <Reveal className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" delay={80}>
            <a href={site.phone.href} className="btn-white">
              <Phone width={17} height={17} /> Call {site.phone.display}
            </a>
            <Link href="/contact" className="btn-outline-light">
              Send us a message <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/exterior-front-elevation-through-oaks.jpg" />

      {/* The one FAQPage block on the site — see the note above.
          No BreadcrumbList here: PageHero already emits it from the `crumbs` it renders. */}
      <JsonLd data={faqSchema(allFaqs)} />
    </>
  );
}
