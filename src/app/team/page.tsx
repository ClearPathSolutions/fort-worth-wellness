import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { medicalOversight, team, teamScopeNote } from '@/lib/site';
import { roster, bioParagraphs, initials } from '@/lib/staff-feed';
import PageHero from '@/components/PageHero';
import PostImage from '@/components/PostImage';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Our Team & Leadership',
  description:
    'Meet the leadership and clinical team at Fort Worth Wellness Center — the people responsible for your care, their credentials, and their approach.',
  path: '/team/',
});

// Matches the portal feed's revalidation window, so a bio edited in the portal appears
// here within five minutes without a redeploy.
export const revalidate = 300;

export default async function TeamPage() {
  const staff = await roster('fort-worth-wellness', team);

  return (
    <>
      <PageHero
        eyebrow="The People Behind the Care"
        title="Our team"
        subtitle="The clinicians and directors responsible for your care — who they are, what they have done, and how they approach the work."
        image="/images/facility/great-room-seating-open-to-kitchen.jpg"
        crumbs={[{ label: 'Who We Are', href: '/about' }, { label: 'Our Team' }]}
      />

      <section className="section bg-cream">
        <div className="container-wide">
          {/*
            Capped at `max-w-4xl` rather than run to the page frame. With a 160px portrait
            column this leaves the prose at roughly 68 characters per line — the measure the
            rest of the site's long-form copy uses. At full frame width these bios would set
            120+ characters to the line, which is where the eye starts losing its place.
          */}
          <div className="mx-auto max-w-4xl divide-y divide-ink/10">
            {staff.map((m, i) => {
              const paragraphs = m.bio ? bioParagraphs(m.bio) : [];
              return (
                <Reveal key={m.name} delay={Math.min(i, 4) * 60}>
                  <article className="grid gap-6 py-12 first:pt-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-10">
                    <div className="relative aspect-[4/5] w-40 overflow-hidden rounded-xl2 shadow-card ring-1 ring-ink/[0.06] sm:w-full">
                      {m.image ? (
                        /* PostImage: portal headshots are remote URLs on hosts that are not in
                           `remotePatterns`, and next/image throws on those rather than degrading. */
                        <PostImage
                          src={m.image}
                          alt={m.name}
                          sizes="160px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="relative flex h-full items-center justify-center bg-steel-50">
                          <div
                            aria-hidden
                            className="absolute inset-0 opacity-[0.5]"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle at 50% 42%, rgba(74,122,164,0.35) 0, transparent 60%), linear-gradient(rgba(32,48,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(32,48,60,0.05) 1px, transparent 1px)',
                              backgroundSize: '100% 100%, 22px 22px, 22px 22px',
                            }}
                          />
                          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-steel/85 font-serif text-xl text-white ring-8 ring-steel/10">
                            {initials(m.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-2xl leading-tight">
                        {m.name}
                        {m.credential && (
                          <span className="font-sans text-base font-normal text-ink/50">
                            , {m.credential}
                          </span>
                        )}
                      </h2>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-sand">
                        {m.role}
                      </p>

                      {paragraphs.length > 0 ? (
                        <div className="mt-5 space-y-4 leading-relaxed text-ink/75">
                          {paragraphs.map((p, n) => (
                            <p key={n}>{p}</p>
                          ))}
                        </div>
                      ) : (
                        /*
                          A stated gap, not invented copy. Two bios are withheld because the
                          source document breaks them — see BIO_HELD in lib/staff-feed for which
                          and why — and writing a stand-in biography for a named clinician would
                          be far worse than admitting the gap. This line goes away on its own
                          once the portal entries are corrected.
                        */
                        <p className="mt-5 text-sm italic text-ink/40">Full bio coming soon.</p>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/*
            Dr. Tambini sits below the roster in her own block rather than inside it, and the
            block says what she is before it says who she is. She provides medical oversight
            across Quadrant's facilities and is not based at this campus; dropping a physician
            into a list of Weatherford staff would let a family infer an on-site doctor that
            this building does not have. Placement is the claim here, so the placement is
            separate and the relationship is spelled out.
          */}
          <Reveal className="mx-auto mt-12 max-w-4xl" delay={100}>
            <div className="rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
              <p className="eyebrow">
                <span className="h-px w-6 bg-steel" /> Medical Oversight
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8">
                <div className="relative aspect-[4/5] w-28 overflow-hidden rounded-xl2 ring-1 ring-ink/[0.06] sm:w-full">
                  <Image
                    src={medicalOversight.image}
                    alt={medicalOversight.name}
                    fill
                    sizes="120px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="text-xl leading-tight">{medicalOversight.name}</h2>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-sand">
                    {medicalOversight.role} &middot; Quadrant Health Group
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70">
                    {medicalOversight.scopeNote}
                  </p>
                  <Link
                    href={`/team/${medicalOversight.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-steel hover:gap-2"
                  >
                    Read Dr. Tambini&rsquo;s full biography <ArrowRight width={15} height={15} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="mx-auto mt-12 max-w-4xl" delay={120}>
            <p className="border-t border-ink/10 pt-8 text-sm text-ink/55">{teamScopeNote}</p>
            <Link href="/about" className="btn-ghost mt-6">
              More about Fort Worth Wellness Center <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTABand image="/images/facility/dining-room-long-table-and-fireplace.jpg" />
    </>
  );
}
