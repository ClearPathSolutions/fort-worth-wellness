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
import { Check, Shield } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Medical Detox & Stabilization',
  description:
    'Safe, medically supervised drug & alcohol detox with 24/7 clinical support and a smooth transition into residential mental health treatment.',
  path: '/treatment/detox/',
});

const glance = [
  '24/7 clinical supervision',
  'Medication-Assisted Treatment (MAT)',
  'Most insurance accepted',
  'Specialized dual diagnosis tracks',
  'Comfort-first withdrawal management',
  'Seamless step-down into residential care',
];

const substances = [
  'Alcohol & Benzodiazepines',
  'Opioids, Heroin & Fentanyl',
  'Cocaine & Methamphetamine',
  'Prescription Medications',
];


export default function DetoxPage() {
  return (
    <>
      <PageHero
        eyebrow="Safe, Clinical Stabilization"
        title="Medically supervised drug & alcohol detox"
        subtitle="Comfort-first withdrawal management and 24/7 clinical support in a private residential setting — the safe foundation for everything that follows."
        image="/images/facility/bedroom-semi-private-two-queens.jpg"
        crumbs={[{ label: 'Treatment', href: '/treatment' }, { label: 'Medical Detox' }]}
      />

      {/* At a glance */}
      <section className="section bg-cream">
        <div className="container-wide grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="At a Glance"
            title="Accredited detox care in Fort Worth"
            intro="If you or a loved one is ready to take the first step, we provide the professional support needed to navigate withdrawal safely — with specialized protocols for alcohol, opioids, and prescription drugs."
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
        eyebrow="The First Step Toward Recovery"
        title="What is medical detoxification?"
        imageSide="left"
        image="/images/facility/nurses-station-staff-desks.jpg"
        imageAlt="A calm clinical care space at Fort Worth Wellness Center"
        body={
          <>
            <p>
              Medical detox is the managed process of allowing the body to safely eliminate addictive
              substances while mitigating the physical and psychological symptoms of withdrawal.
              Unlike a cold-turkey approach, a clinical detox involves 24/7 medical supervision to
              keep you comfortable, stable, and safe throughout the transition.
            </p>
            <p>
              Specialized protocols stabilize brain chemistry and address physical dependency —
              creating a clean slate for the psychological work that follows in our residential
              mental health and dual diagnosis programs.
            </p>
          </>
        }
      />

      {/* Risks */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading
            eyebrow="Why Supervision Matters"
            title="Understanding the risks of unsupervised withdrawal"
            intro="Stopping alcohol, opioids, or benzodiazepines without medical intervention can lead to severe, life-threatening complications. Professional detox provides access to medication-assisted treatments that prevent these emergencies — while sparing you the trauma of withdrawal."
          />
          <Reveal className="mx-auto mt-12 max-w-3xl" delay={80}>
            <div className="rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-steel-50 text-steel">
                  <Shield width={22} height={22} />
                </span>
                <h3 className="text-xl">Clinical stabilization for all substances</h3>
              </div>
              <p className="mt-4 text-ink/65">
                We provide 24/7 care and priority medical stabilization for those needing to
                safely withdraw from:
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {substances.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-ink/80">
                    <Check width={16} height={16} className="mt-1 shrink-0 text-steel" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-cream-deep">
        <div className="container-fw">
          <SectionHeading eyebrow="Questions & Answers" title="Frequently asked questions" />
          <div className="mt-12">
            <FAQ items={faqGroup('detox')} />
          </div>
        </div>
      </section>

      <InsuranceBand />
      <CTABand image="/images/facility/bedroom-private-single-queen.jpg" />
    </>
  );
}
