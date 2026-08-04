import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Link from 'next/link';
import Image from 'next/image';
import PostImage from '@/components/PostImage';
import { team, teamScopeNote } from '@/lib/site';
import { roster, initials } from '@/lib/staff-feed';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Compass, Heart, Home as HomeIcon, Leaf, Shield, Sparkle, Users } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Our Mission & Approach to Care',
  description:
    'Learn about Fort Worth Wellness Center — our mission, values, and commitment to compassionate, personalized mental health and dual diagnosis treatment in Texas.',
  path: '/about/',
});

const values = [
  { icon: Users, title: 'Real Relationships', body: 'We get to know the person, not just the diagnosis.' },
  { icon: Compass, title: 'Open Connection', body: 'We keep things honest and transparent with you and your family.' },
  { icon: Leaf, title: 'Lasting Stability', body: "We don't look for a quick fix — we look for long-term health." },
  { icon: HomeIcon, title: 'Safe Sanctuary', body: 'A private, comfortable retreat from daily stress.' },
];

const whyChoose = [
  { icon: Compass, title: 'Care Designed for You', body: "We don't do one-size-fits-all. Your plan is built for your goals, history, and needs." },
  { icon: HomeIcon, title: 'Home Away From Home', body: 'Our facility sits on private acres — a quiet, home-like space to relax and focus on getting better.' },
  { icon: Sparkle, title: 'Modern Therapy Options', body: 'We blend traditional talk therapy with hands-on approaches like art and equine therapy.' },
  { icon: Users, title: 'Experienced, Kind Staff', body: 'Our team has decades of experience and provides a judgment-free environment from day one.' },
  { icon: Heart, title: 'Comfortable Amenities', body: 'Semi-private rooms, modern living areas, and plenty of space to breathe.' },
  { icon: Shield, title: 'Support for the Long Haul', body: "When your program ends, we don't say goodbye — ongoing aftercare keeps you steady at home." },
];

export default async function AboutPage() {
  // Curated entries own the headshots; the portal supplies the bios and any extra people.
  const staff = await roster('fort-worth-wellness', team);
  return (
    <>
      <PageHero
        eyebrow="We Are Your Partners in Healing"
        title="Get to know us"
        subtitle="We built Fort Worth Wellness to be a place where people can finally find peace — providing the expert medical and emotional support you need in a comfortable setting, so you can get back to the life you love."
        image="/images/facility/entry-foyer-arched-doors-branded.jpg"
        crumbs={[{ label: 'Who We Are' }]}
      />

      {/* The FW Way + Why We Started */}
      <section className="section bg-cream">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 shadow-soft">
              <Image
                src="/images/facility/living-room-green-sofas-white-oak.jpg"
                alt="A warm, home-like living space at Fort Worth Wellness Center"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="The Fort Worth Wellness Way"
              title="A different kind of care"
              intro="Most people picture treatment as a cold, clinical hospital stay. We do things differently — a space that feels like home, where you can actually relax and focus on getting better."
            />
            <Reveal className="prose-fw mt-6 space-y-5" delay={80}>
              <p>
                Whether you're dealing with deep depression, constant anxiety, or a struggle with
                substances, our goal is to help you find your feet again in a place where you feel
                respected and heard.
              </p>
              <div>
                <h3 className="mb-2 text-lg">Why we started</h3>
                <p>
                  We opened our doors in Fort Worth because we saw too many people in our community
                  struggling to find care that looked at the whole picture. We didn't just want to
                  treat symptoms — we wanted to help people rebuild their lives. Our team is made up
                  of experts passionate about mental wellness, dedicated to staying by your side
                  through every up and down of healing.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core values */}
      <FeatureGrid
        bg="cream-deep"
        eyebrow="Our Core Values"
        heading="What we stand for"
        features={values}
        columns={4}
      />

      {/* Why FW is your top choice */}
      <FeatureGrid
        bg="cream"
        eyebrow="Trusted & Experienced"
        heading="Why Fort Worth Wellness is your top choice"
        intro="Six reasons families across Texas trust us with the people they love."
        features={whyChoose}
        columns={3}
      />

      {/* Team */}
      <section className="section bg-ink text-white">
        <div className="container-wide">
          <SectionHeading
            tone="light"
            eyebrow="Decades of Experience"
            title="Meet our team"
            intro="A dedicated, compassionate leadership team guiding every part of your care."
          />
          {/*
            Four across, and still `flex-wrap justify-center` rather than a grid.

            Three columns left the fourth leader stranded on her own centred row under a
            full row of three — the clearest "hanging off" moment on the page. Four columns
            fills the curated row exactly and matches the four-up values grid above it, and
            dropping `max-w-5xl` puts it on the same frame as every other section.

            A plain `grid` would have been the obvious fix, and it is the wrong one here: the
            roster is no longer a fixed four. `extraStaff` appends whatever the portal returns,
            so the count is decided at request time. `justify-center` is what keeps a partial
            trailing row centred under the one above it instead of hanging off the left edge —
            the same reason /who-we-help uses this pattern for its seven tracks.
            The width maths is exact: 4 x (25% - 18px) + 3 x 24px gap = 100%.
          */}
          <div className="mt-14 flex flex-wrap justify-center gap-6">
            {staff.map((m, i) => (
              <Reveal
                key={m.name}
                delay={i * 70}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
              >
                <div className="h-full overflow-hidden rounded-xl2 bg-white/[0.04] ring-1 ring-white/10">
                  <div className="relative aspect-[4/3] bg-steel-dark/40">
                    {m.image ? (
                      /* PostImage, not next/image: `roster` now includes portal-managed
                         staff whose `photoUrl` is a remote URL on a host that is not in
                         `remotePatterns`. next/image throws on those rather than degrading,
                         so a single portal headshot would have taken the whole page down.
                         `object-top` is passed through so faces are not cropped. */
                      <PostImage
                        src={m.image}
                        alt={m.name}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      /*
                        Monogram tile for a leader whose headshot we do not have. The old
                        fallback was a flat block with a plain circle on it, which beside three
                        real photographs read as an image that had failed to load rather than as
                        a choice. Same treatment as the location panel on /contact — a soft
                        radial wash over a fine grid, with the initials ringed the way the map
                        pin is — so the tile looks designed while it waits for a photo.
                        This is a stand-in, not a fix: the real fix is a headshot for Deborah
                        Wade, at which point add `image:` to her entry in `src/lib/site.ts` and
                        this branch stops rendering.
                      */
                      <div className="relative flex h-full items-center justify-center overflow-hidden">
                        <div
                          aria-hidden
                          className="absolute inset-0 opacity-[0.35]"
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at 50% 42%, rgba(74,122,164,0.85) 0, transparent 55%), linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
                            backgroundSize: '100% 100%, 26px 26px, 26px 26px',
                          }}
                        />
                        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-steel/60 font-serif text-2xl text-white shadow-lift ring-8 ring-steel/15">
                          {initials(m.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="!text-white text-lg">
                      {m.name}
                      {m.credential && (
                        <span className="font-sans text-sm font-normal text-white/55">
                          , {m.credential}
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-sand-light">{m.role}</p>

                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center" delay={100}>
            <Link href="/team" className="btn-outline-light">
              Read full bios <ArrowRight width={16} height={16} />
            </Link>
          </Reveal>

          {/*
            FW-36. Every leader listed above holds a role shared across the Texas facilities — the
            bios document states it plainly ("for Dallas Detox Center and Fort Worth Wellness
            Center", "the Texas facilities"). Presenting them without that context implied a
            Fort Worth-exclusive team, which is not what they are.
          */}
          <Reveal className="mt-10 text-center" delay={120}>
            <p className="mx-auto max-w-xl text-sm text-white/55">{teamScopeNote}</p>
          </Reveal>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/exterior-front-entrance-winter.jpg" />
    </>
  );
}
