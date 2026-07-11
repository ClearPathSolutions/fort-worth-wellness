import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import SplitFeature from '@/components/blocks/SplitFeature';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import FAQ from '@/components/FAQ';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { Brain, Check, Compass, Heart, Home as HomeIcon, Leaf, Sparkle } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Residential Mental Health Treatment in Fort Worth, TX',
  description:
    'Luxury residential mental health care in Fort Worth with 24/7 psychiatric support, evidence-based therapy, and a restorative home-like setting for lasting stability.',
};

const glance = [
  'Dedicated 24/7 residential support',
  'Psychiatric medication management',
  'Trauma-informed therapy',
  'Expert tracks for PTSD, depression & anxiety',
  'Private, boutique sanctuary setting',
  'Same-day admissions available',
];

const rightForYou = [
  { icon: Heart, title: 'You feel unsafe', body: 'Struggling with severe depression, anxiety, or PTSD and need constant professional support.' },
  { icon: Compass, title: "You're stuck", body: "You've tried outpatient therapy, but your symptoms simply aren't getting better." },
  { icon: Leaf, title: 'You need a break', body: 'You need to step away from daily stress to focus entirely on your mental health.' },
  { icon: HomeIcon, title: 'You want privacy', body: 'You want a quiet, comfortable, home-like setting — not the feel of a hospital.' },
];

const pathToPeace = [
  { icon: Brain, title: 'Dedicated Psychiatry', body: 'Direct, daily support from mental health experts who specialize in complex psychiatric care.' },
  { icon: Heart, title: 'Heal the Root Cause', body: "We don't just treat symptoms — we help you work through the underlying trauma or anxiety at your own pace." },
  { icon: Leaf, title: 'A Calm Daily Rhythm', body: 'Your days are balanced with therapy, rest, and wellness activities in a peaceful, home-like setting.' },
  { icon: Compass, title: 'Wellness Planning', body: 'You leave with a clear, personalized plan for maintaining your mental health long after your stay.' },
];

const modalities = [
  'Individual Psychotherapy',
  'Cognitive Behavioral Therapy (CBT)',
  'Dialectical Behavior Therapy (DBT)',
  'Collaborative Group Therapy',
  'Family Healing Sessions',
  'Equine-Assisted Therapy',
];

const amenities = [
  'Private & Semi-Private Suites',
  'Chef-Prepared Nutrition',
  'Serene Outdoor Gardens',
  'Mindfulness & Yoga Space',
  'Modern, Home-Like Living Spaces',
  'Housekeeping & Laundry Service',
  'High-Speed Fiber Wi-Fi',
  'Outdoor Fire Pit Lounge',
  'Expansive Windows & Natural Light',
];

const conditions = [
  'Anxiety Disorders',
  'Bipolar Disorders',
  'Depression',
  'OCD & ADHD',
  'PTSD & Trauma',
  'Personality Disorders',
  'Mood Disorders',
  'Co-Occurring Disorders',
];

const faqs = [
  { q: 'What is residential mental health treatment?', a: 'It is a 24/7, live-in program where you receive intensive psychiatric care and therapy in a safe, structured environment.' },
  { q: 'How long is a typical stay?', a: 'Stay lengths are personalized to your needs, typically ranging from 30 to 90 days to ensure deep, lasting restoration.' },
  { q: 'Will I see a psychiatrist?', a: 'Yes. You will have regular sessions with our psychiatric team for medication management and clinical oversight of your care plan.' },
  { q: 'What conditions do you focus on?', a: 'We focus on complex cases of depression, anxiety, PTSD, bipolar disorder, and personality disorders.' },
  { q: 'Is the setting private?', a: 'Absolutely. We are a boutique, low-capacity facility in a quiet neighborhood to ensure maximum privacy and discretion.' },
  { q: 'Can my family be involved?', a: 'Yes — we encourage family therapy and education sessions to help your loved ones support your long-term wellness.' },
];

export default function MentalHealthResidentialPage() {
  return (
    <>
      <PageHero
        eyebrow="Find Stability. Reclaim Wellness."
        title="Residential mental health treatment in Fort Worth"
        subtitle="Advanced psychiatric care in a private, restorative environment — where clinical excellence meets personal restoration, away from the triggers of daily life."
        image="/images/facility/dsc09517.jpg"
        crumbs={[{ label: 'Treatment', href: '/treatment' }, { label: 'Mental Health Residential' }]}
      />

      {/* At a glance */}
      <section className="section bg-cream">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="At a Glance"
            title="The Fort Worth sanctuary"
            intro="When outpatient therapy is no longer enough, our facility offers a safe sanctuary for healing — intensive, evidence-based residential programs for adults struggling with depression, anxiety, trauma, and co-occurring disorders."
          />
          <Reveal delay={80}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {glance.map((g) => (
                <li key={g} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-card ring-1 ring-ink/[0.05]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-steel-50 text-steel">
                    <Check width={14} height={14} />
                  </span>
                  <span className="text-sm text-ink/80">{g}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <FeatureGrid
        bg="cream-deep"
        eyebrow="Is This the Right Path?"
        heading="Residential care may be right if…"
        intro="Choosing a residential program is a significant step toward reclaiming your life. Our 24/7 live-in program lets you fully immerse in healing."
        features={rightForYou}
        columns={4}
      />

      <FeatureGrid
        bg="cream"
        eyebrow="Your Path to Peace"
        heading="What you can expect"
        intro="In our Fort Worth home, we focus on one thing: helping you feel like yourself again."
        features={pathToPeace}
        columns={4}
      />

      {/* Modalities + amenities */}
      <section className="section bg-ink text-white">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-xl2 bg-white/[0.04] p-8 ring-1 ring-white/10">
              <p className="eyebrow !text-sand-light">
                <span className="h-px w-6 bg-sand-light" /> Evidence-Based Care
              </p>
              <h3 className="mt-4 !text-white text-2xl">Advanced therapeutic modalities</h3>
              <p className="mt-3 text-white/65">
                Care designed to heal the brain and regulate the nervous system — tailored to your
                specific needs, moving beyond standard talk therapy toward real breakthroughs.
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {modalities.map((m) => (
                  <li key={m} className="flex items-center gap-2.5 text-white/80">
                    <Check width={16} height={16} className="shrink-0 text-steel-light" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-xl2 bg-white/[0.04] p-8 ring-1 ring-white/10">
              <p className="eyebrow !text-sand-light">
                <span className="h-px w-6 bg-sand-light" /> Elevated Comfort
              </p>
              <h3 className="mt-4 !text-white text-2xl">A luxury, home-like atmosphere</h3>
              <p className="mt-3 text-white/65">
                Our facility is designed to feel like a high-end private residence, removing the cold,
                institutional feel of traditional clinics.
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {amenities.map((m) => (
                  <li key={m} className="flex items-center gap-2.5 text-white/80">
                    <Sparkle width={15} height={15} className="shrink-0 text-sand-light" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <SplitFeature
        bg="cream"
        eyebrow="Conditions We Treat"
        title="Evidence-based support for complex challenges"
        imageSide="left"
        image="/images/facility/dsc05013.jpg"
        imageAlt="A restful living space at Fort Worth Wellness Center"
        body={
          <p>
            We provide a safe, supportive environment for those managing a range of psychiatric
            conditions — helping individuals find relief when traditional outpatient care hasn't been
            enough.
          </p>
        }
        bullets={conditions}
        cta={{ label: 'Take the virtual tour', href: '/tour' }}
      />

      <section className="section bg-cream-deep">
        <div className="container-fw">
          <SectionHeading eyebrow="Questions & Answers" title="Frequently asked questions" />
          <div className="mt-12">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/dsc09533.jpg" />
    </>
  );
}
