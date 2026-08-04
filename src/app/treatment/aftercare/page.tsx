import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import SplitFeature from '@/components/blocks/SplitFeature';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Compass, Home as HomeIcon, Shield, Star, Users } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Aftercare & Alumni Support',
  description:
    'Stay connected after treatment with Fort Worth Wellness aftercare and alumni support — a structured step-down plan and lifelong community for continued growth.',
  path: '/treatment/aftercare/',
});

const framework = [
  { icon: Compass, title: 'Integrated Discharge Blueprint', body: 'Every resident departs with a personalized roadmap: local psychiatric referrals, medication schedules, and specific wellness goals.' },
  { icon: Users, title: 'Real-World Reintegration', body: 'Dedicated guidance on navigating professional stressors and social dynamics during the critical first thirty days.' },
  { icon: HomeIcon, title: 'Environmental Optimization', body: 'We help identify potential triggers in your home environment and build proactive strategies to maintain a calm, restorative space.' },
  { icon: Shield, title: 'Crisis Management Tools', body: 'You leave with a toolkit of proven behavioral techniques to manage acute anxiety or emotional shifts in real time.' },
];

export default function AftercarePage() {
  return (
    <>
      <PageHero
        eyebrow="Your Journey Continues Here"
        title="Aftercare & alumni support"
        subtitle="Transitioning from residential care back to daily life is a vital step. We provide a lifelong support network designed to help you carry the tools you've learned into the life you're building."
        image="/images/facility/barn-exterior-and-gravel-court-summer.jpg"
        crumbs={[{ label: 'Treatment', href: '/treatment' }, { label: 'Aftercare & Alumni' }]}
      />

      <FeatureGrid
        bg="cream"
        eyebrow="The Transition Framework"
        heading="A roadmap to integration"
        intro="Leaving a residential setting is a significant milestone. We provide a structured step-down philosophy focused on practical integration — helping you move back into your routine with confidence."
        features={framework}
        columns={4}
      />

      <SplitFeature
        bg="cream-deep"
        eyebrow="Strength in Shared Experience"
        title="The alumni network: lifelong community"
        imageSide="left"
        image="/images/facility/pool-tanning-ledge-winter.jpg"
        imageAlt="A welcoming common space at Fort Worth Wellness Center"
        body={
          <>
            <p>
              Isolation is one of the biggest barriers to long-term wellness, which is why our alumni
              network is designed to foster deep, lasting connections that extend far beyond your
              stay. Once you complete your program, you gain lifetime access to a private community of
              peers equally committed to emotional resilience and psychiatric health.
            </p>
            {/*
              FW-17. The removed sentence attributed to the National Institutes of Health a
              "40–60% increase in their ability to maintain lasting stability" from aftercare and
              peer support. NIDA's actual 40–60% figure is the *relapse rate* for substance use
              disorder — cited to show addiction behaves like other chronic illnesses — and
              separately that treatment reduces drug use by 40–60%. Neither is a statement about
              aftercare improving stability by that amount, so the number was a real statistic
              repurposed into a claim its source does not make.

              Deleted rather than re-cited: on a YMYL page, a federal-agency attribution the agency
              does not support is worse than no statistic. If a cited figure is wanted here, the
              honest options are NIDA's relapse-rate framing or a specific study — an owner call,
              not a rewrite.
            */}
            <p>
              Aftercare is where progress gets protected. Through clinician-led sessions, community
              events, and digital connection, you're never alone in your journey.
            </p>
          </>
        }
        cta={{ label: 'Talk to our team', href: '/contact' }}
      />

      {/* Closing statement */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading
            eyebrow="Recovery Evolves"
            title="Recovery doesn't end at discharge"
            intro="Ongoing support provides the structure and accountability needed to maintain progress and navigate life's challenges with confidence. We're here to help you build a bridge from residential care to long-term flourishing."
          />

          {/* Alumni review ask — the natural point to invite one, after care. */}
          <Reveal className="mx-auto mt-12 max-w-2xl" delay={80}>
            <div className="flex flex-col items-center gap-5 rounded-xl2 bg-white p-8 text-center shadow-card ring-1 ring-ink/[0.06]">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand/15 text-sand">
                <Star width={26} height={26} />
              </span>
              <div>
                <h3 className="text-xl">Are you one of our alumni?</h3>
                <p className="mx-auto mt-3 max-w-lg text-ink/65">
                  Your story helps someone still deciding whether to reach out. If {site.shortName}{' '}
                  was part of your recovery, we&apos;d be grateful if you shared your experience.
                </p>
              </div>
              <a
                href={site.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Share your experience <ArrowRight width={16} height={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/dining-room-communal-tables.jpg" />
    </>
  );
}
