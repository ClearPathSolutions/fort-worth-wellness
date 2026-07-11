import type { Metadata } from 'next';
import Image from 'next/image';
import { team } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { Compass, Heart, Home as HomeIcon, Leaf, Shield, Sparkle, Users } from '@/components/icons';

export const metadata: Metadata = {
  title: 'About Us — Our Mission & Approach to Care',
  description:
    'Learn about Fort Worth Wellness Center — our mission, values, and commitment to compassionate, personalized mental health and dual diagnosis treatment in Texas.',
};

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
  { icon: Heart, title: 'High-End Amenities', body: 'Semi-private rooms, modern living areas, and plenty of space to breathe.' },
  { icon: Shield, title: 'Support for the Long Haul', body: "When your program ends, we don't say goodbye — ongoing aftercare keeps you steady at home." },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="We Are Your Partners in Healing"
        title="Get to know us"
        subtitle="We built Fort Worth Wellness to be a place where people can finally find peace — providing the expert medical and emotional support you need in a comfortable setting, so you can get back to the life you love."
        image="/images/facility/dsc09523.jpg"
        crumbs={[{ label: 'Who We Are' }]}
      />

      {/* The FW Way + Why We Started */}
      <section className="section bg-cream">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl2 shadow-soft">
              <Image
                src="/images/facility/dsc05013.jpg"
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
          <div className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-6">
            {team.map((m, i) => (
              <Reveal
                key={m.name}
                delay={i * 70}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="h-full overflow-hidden rounded-xl2 bg-white/[0.04] ring-1 ring-white/10">
                  <div className="relative aspect-[4/3] bg-steel-dark/40">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-steel/25 font-serif text-3xl text-white">
                          {initials(m.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="!text-white text-lg">{m.name}</h3>
                    <p className="mt-1 text-sm text-sand-light">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/dji0584.jpg" />
    </>
  );
}
