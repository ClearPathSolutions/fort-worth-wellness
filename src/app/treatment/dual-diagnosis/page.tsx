import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { faqGroup } from '@/lib/faqs';
import { site } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import SplitFeature from '@/components/blocks/SplitFeature';
import FAQ from '@/components/FAQ';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { Check } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Dual Diagnosis Treatment',
  description:
    'Integrated dual diagnosis care in Fort Worth — treating mental health and co-occurring substance use together, addressing the root cause for lasting stability.',
  path: '/treatment/dual-diagnosis/',
});

const glance = [
  'Mental health as the driver of care',
  'Simultaneous, integrated healing',
  'Physician-led psychiatric oversight',
  'Advanced therapeutic tools',
  'Dual-diagnosis relapse prevention',
];

const therapies = [
  'Cognitive Behavioral Therapy (CBT)',
  'Dialectical Behavior Therapy (DBT)',
  'EMDR & Trauma Support',
  'Relapse Prevention Support',
  'Individual Therapy',
  'Group Therapy',
  'Family Therapy',
  'Equine Therapy',
];

const whyChoose = [
  'No-obligation consultation',
  'Completely confidential support',
  'Expert clinical team',
  'Boutique, individualized planning',
  'Specialized psychiatric oversight',
];


export default function DualDiagnosisPage() {
  return (
    <>
      <PageHero
        eyebrow="Advanced Care for Complex Mental Health"
        title="Integrated dual diagnosis treatment"
        subtitle="A dual-pathway approach for those struggling with primary mental health disorders and co-occurring substance use — treated together, never in isolation."
        image="/images/facility/lounge-barn-upstairs-open.jpg"
        crumbs={[{ label: 'Treatment', href: '/treatment' }, { label: 'Dual Diagnosis' }]}
      />

      <section className="section bg-cream">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="At a Glance"
            title="Treating the mind and the habit as one"
            intro="Our dual diagnosis program bridges the gap between mental health care and self-medication to provide a complete path to wellness."
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

      <SplitFeature
        bg="cream-deep"
        eyebrow="Understanding Dual Diagnosis"
        title="Two challenges, deeply intertwined"
        imageSide="left"
        image="/images/facility/bedroom-semi-private-two-queens.jpg"
        imageAlt="A private, restful resident suite at Fort Worth Wellness Center"
        body={
          <>
            <p>
              Dual diagnosis is the clinical term for when a mental health condition — such as
              depression, anxiety, or bipolar disorder — occurs alongside a struggle with substance
              use. We recognize these challenges are deeply intertwined, as many people begin using
              substances to self-medicate the weight of untreated psychiatric pain.
            </p>
            {/*
              FW-17. The removed sentence credited the National Alliance on Mental Illness with
              "roughly 50% of individuals with a severe mental health disorder are also affected by
              substance use." NAMI's published figure is 34.5% of U.S. adults with any mental
              illness also having a substance use disorder; it says severity raises the likelihood
              but does not publish the ~50% number this claimed. Unsubstantiable as written, so the
              statistic and the attribution are gone and the qualitative point stands on its own.
              (Note for the tracker: NAMI is a nonprofit, not a federal agency as FW-17 describes.)
            */}
            <p>
              Co-occurring mental health and substance use conditions are common, and each one tends
              to reinforce the other. We treat the whole person — addressing the root emotional
              causes and the resulting habits at the same time, so one never hinders the healing of
              the other.
            </p>
          </>
        }
      />

      {/* Therapies */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading
            eyebrow="A Multi-Dimensional Framework"
            title="Clinically proven therapies"
            intro="True wellness requires a targeted rewiring of how the mind processes stress and memory. We use an integrated framework of advanced behavioral therapies designed to calm the nervous system."
          />
          <Reveal className="mx-auto mt-12 max-w-3xl" delay={80}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {therapies.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-card ring-1 ring-ink/[0.05]">
                  <Check width={16} height={16} className="mt-1 shrink-0 text-steel" />
                  <span className="text-ink/80">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <SplitFeature
        bg="cream-deep"
        eyebrow="Why Choose Our Sanctuary"
        title="A private setting for comprehensive psychiatric wellness"
        image="/images/facility/pool-tanning-ledge-winter.jpg"
        imageAlt="A light-filled common area at Fort Worth Wellness Center"
        body={
          <p>
            Choosing our Fort Worth location means entering a world where mental health is the primary
            focus of recovery. Psychiatric stabilization and behavioral health are seamlessly
            integrated, with a high staff-to-client ratio that ensures your journey is never treated
            as a number — but as a clinical priority.
          </p>
        }
        bullets={whyChoose}
      />

      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading eyebrow="Questions & Answers" title="Frequently asked questions" />
          <div className="mt-12">
            <FAQ items={faqGroup('dual-diagnosis')} />
          </div>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/exterior-front-elevation-winter.jpg" />
    </>
  );
}
