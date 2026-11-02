import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { familyServicesSchema, pageMeta } from '@/lib/seo';
import { familyServices, site } from '@/lib/site';
import PageHero from '@/components/PageHero';
import JsonLd from '@/components/JsonLd';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Shield } from '@/components/icons';

const doc = familyServices;

export const metadata: Metadata = pageMeta({
  title: `${doc.name} — Director of Family Services`,
  description:
    'Casey Hyatt is Director of Family Services at Quadrant Health Group, with 15 years of experience in the behavioral health field and 18 years in recovery.',
  path: `/team/${doc.slug}/`,
});

export default function FamilyServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Family Services"
        title={doc.name}
        subtitle="Director of Family Services at Quadrant Health Group, supporting families navigating addiction and mental health."
        image="/images/facility/great-room-seating-open-to-kitchen.jpg"
        crumbs={[{ label: 'Our Team', href: '/team' }, { label: doc.name }]}
        showActions={false}
      />

      <section className="section bg-cream">
        {/* Same `max-w-4xl` + 160px portrait column as /team, so the two pages set the same
            measure and a reader moving between them is not re-adjusting to a new line length. */}
        <div className="container-wide">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="grid gap-8 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-12">
                <div>
                  <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-xl2 shadow-card ring-1 ring-ink/[0.06] sm:w-full">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      priority
                      sizes="200px"
                      className="object-cover object-top"
                    />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-sand">
                    {doc.role}
                  </p>
                </div>

                <div>
                  {/*
                    The scope statement leads, before a word of the biography, so the page does not
                    read as a description of the Weatherford staff. Stating the relationship first
                    is what stops that.
                  */}
                  <div className="flex items-start gap-3 rounded-xl2 bg-steel-50 p-5 ring-1 ring-steel/10">
                    <Shield width={20} height={20} className="mt-0.5 shrink-0 text-steel" />
                    <p className="text-sm leading-relaxed text-ink/75">{doc.scopeNote}</p>
                  </div>

                  <div className="mt-8 space-y-5 leading-relaxed text-ink/75">
                    {doc.bio.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {/* Attribution, because the text is reproduced rather than written here. */}
                  <p className="mt-8 border-t border-ink/10 pt-6 text-sm text-ink/50">
                    Biography reproduced from{' '}
                    <a
                      href={doc.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-steel underline decoration-steel/30 underline-offset-2 hover:decoration-steel"
                    >
                      Casey Hyatt&rsquo;s profile at Quadrant Health Group
                    </a>
                    .
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="/team" className="btn-primary">
                      Meet the {site.name} team <ArrowRight width={16} height={16} />
                    </Link>
                    <Link href="/blog" className="btn-ghost">
                      Read our articles
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand image="/images/facility/lounge-green-sofas-and-macrame.jpg" />

      {/* Person schema — the machine-readable half of the authority claim. `worksFor` is Quadrant Health Group, not this facility. */}
      <JsonLd data={familyServicesSchema()} />
    </>
  );
}
