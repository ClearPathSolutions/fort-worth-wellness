import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { Brain, Compass, Heart, Home as HomeIcon, Leaf, Shield, Sparkle, Users } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Who We Help — Specialized Mental Health Tracks',
  description:
    'Specialized residential mental health tracks in Fort Worth for professionals, veterans, first responders, women, men, young adults, and college students.',
};

const tracks = [
  { icon: Compass, title: 'Professionals', body: 'Discreet psychiatric support for leaders navigating burnout and high-functioning anxiety.' },
  { icon: Shield, title: 'Veterans', body: 'Specialized trauma-informed care for PTSD, trauma, and the transition to civilian life.' },
  { icon: Heart, title: 'First Responders', body: 'Intensive clinical pathways to process occupational trauma and restore internal peace.' },
  { icon: Sparkle, title: 'Women', body: "A private sanctuary addressing the unique biological and social drivers of women's mental health." },
  { icon: Users, title: 'Men', body: 'Focused emotional restoration and resilience training in a supportive, male-centric environment.' },
  { icon: Leaf, title: 'Young Adults', body: 'Dedicated guidance for identity formation and emotional regulation during critical life stages.' },
  { icon: Brain, title: 'College Students', body: 'Targeted support for academic pressure, social anxiety, and major life transitions.' },
];

export default function WhoWeHelpPage() {
  return (
    <>
      <PageHero
        eyebrow="Dedicated Pathways for Complex Needs"
        title="Specialized mental health programs"
        subtitle="Mental health challenges don't look the same for everyone. We provide highly specialized residential tracks designed around the unique pressures, traumas, and responsibilities of who you are."
        image="/images/facility/dsc09539.jpg"
        crumbs={[{ label: 'Who We Help' }]}
      />

      {/* Tracks */}
      <section className="section bg-cream">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Clinical Tracks for Your Journey"
            title="Care tailored to your world"
            intro="True emotional clarity requires a clinical environment that understands the specific life you're living. Each track moves beyond general therapy to a mental health–first experience built around your history and role."
          />
          <div className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-6">
            {tracks.map((t, i) => (
              <Reveal
                key={t.title}
                delay={i * 60}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="group flex h-full flex-col rounded-xl2 bg-white p-7 shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-steel-50 text-steel transition-colors group-hover:bg-steel group-hover:text-white">
                    <t.icon width={26} height={26} />
                  </div>
                  <h3 className="mt-5 text-xl">{t.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Environment */}
      <section className="section bg-cream-deep">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 shadow-soft">
              <Image
                src="/images/facility/dji0580.jpg"
                alt="Aerial view of the private wooded grounds at Fort Worth Wellness Center"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="A Private Sanctuary"
              title="Premier psychiatric & behavioral care in Fort Worth"
              intro="We believe the environment is as vital as the treatment itself. Our luxury property is intentionally designed to be a quiet, restorative space where you can disconnect from external pressures and focus entirely on your mental wellness."
            />
            <Reveal className="prose-fw mt-6" delay={80}>
              <p>
                You're never just a number here. Our expert medical and psychiatric staff work with
                you around the clock to ensure you feel safe, understood, and clinically supported
                through every phase — with hand-crafted plans that adapt to exactly who you are and
                what you need to achieve lasting peace.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <InsuranceBand />
      <CTABand
        eyebrow="Available 24/7"
        title="Your private path to peace begins here"
        body="Whether you're a professional, a veteran, a first responder, or a student, our team is here to help you find the right pathway. Reach out for a confidential consultation and verify your insurance coverage."
        image="/images/facility/dji0577.jpg"
      />
    </>
  );
}
