import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import SplitFeature from '@/components/blocks/SplitFeature';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import { Compass, Home as HomeIcon, Shield, Users } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Aftercare & Alumni Support in Fort Worth, TX',
  description:
    'Stay connected after treatment with Fort Worth Wellness aftercare and alumni support — a structured step-down plan and lifelong community for continued growth.',
};

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
        image="/images/facility/dsc05075.jpg"
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
        image="/images/facility/dsc09536.jpg"
        imageAlt="A welcoming common space at Fort Worth Wellness Center"
        body={
          <>
            <p>
              Isolation is one of the biggest barriers to long-term wellness, which is why our alumni
              network is designed to foster deep, lasting connections that extend far beyond your
              stay. Once you complete your program, you gain lifetime access to a private community of
              peers equally committed to emotional resilience and psychiatric health.
            </p>
            <p>
              Research from the National Institutes of Health indicates that people who participate in
              long-term aftercare and peer support see a 40–60% increase in their ability to maintain
              lasting stability. Through clinician-led sessions, community events, and digital
              connection, you're never alone in your journey.
            </p>
          </>
        }
        cta={{ label: 'Talk to our team', href: '/contact-us' }}
      />

      {/* Closing statement */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading
            eyebrow="Recovery Evolves"
            title="Recovery doesn't end at discharge"
            intro="Ongoing support provides the structure and accountability needed to maintain progress and navigate life's challenges with confidence. We're here to help you build a bridge from residential care to long-term flourishing."
          />
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/dji0587.jpg" />
    </>
  );
}
