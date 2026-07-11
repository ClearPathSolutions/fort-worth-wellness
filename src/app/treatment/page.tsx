import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FeatureGrid from '@/components/blocks/FeatureGrid';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Brain, Compass, Heart, Leaf } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Mental Health & Dual Diagnosis Programs in Fort Worth, TX',
  description:
    'Explore residential mental health, dual diagnosis, detox, and aftercare programs at Fort Worth Wellness Center — therapy and 24/7 clinical support in a private setting.',
};

const differentiators = [
  { icon: Heart, title: 'Your Peace is Our Priority', body: 'Everything we do is designed to lower stress and help you feel safe enough to focus entirely on your mental well-being.' },
  { icon: Compass, title: 'Clarity & Inner Balance', body: 'We treat the whole person — looking at how your thoughts and habits connect, not just a checklist of symptoms.' },
  { icon: Brain, title: 'A Plan as Unique as Your Story', body: 'We listen to your history and goals, then build a therapy plan that feels right for your specific needs.' },
  { icon: Leaf, title: 'Support for the Life Ahead', body: 'We give you real-world tools and a community of support to stay steady and confident once you return home.' },
];

export default function TreatmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Expert Care, Built Around You"
        title="Specialized mental health & dual diagnosis treatment"
        subtitle="A private, supportive space for those needing residential mental health care and integrated support for co-occurring addiction — focused on treating the whole person."
        image="/images/facility/dsc09517.jpg"
        crumbs={[{ label: 'Treatment' }]}
      />

      {/* Intro */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading
            eyebrow="The Fort Worth Wellness Difference"
            title="A mental health–first center"
            intro="Whether you're seeking help for a standalone condition like anxiety or depression, or dealing with a complex dual diagnosis where substance use has become a coping mechanism, our team is here to help you find your way back to yourself."
          />
          <Reveal className="mx-auto mt-6 max-w-3xl text-center text-ink/65" delay={80}>
            <p>
              We don't just treat symptoms — we treat the whole person. Mental health exists on a
              spectrum: for many, a struggle stands alone and requires deep, focused clinical work;
              for others, mind and body are intertwined. Because we treat the root cause, we're
              uniquely equipped to help you find stability, whatever your journey involves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Programs */}
      <section className="section bg-cream-deep">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Our Programs"
            title="A continuum of care"
            intro="Four connected levels of support that move with you through every stage of recovery."
          />
          <div className="mt-14 grid gap-8">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link
                  href={s.href}
                  className="group grid overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:shadow-lift md:grid-cols-[minmax(0,300px)_1fr]"
                >
                  <div className="relative aspect-[16/10] md:aspect-auto">
                    <Image src={s.image} alt={s.title} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105" />
                  </div>
                  <div className="flex flex-col justify-center p-7 sm:p-9">
                    <span className="text-xs font-semibold uppercase tracking-widest text-sand">
                      0{i + 1}
                    </span>
                    <h3 className="mt-2 text-2xl">{s.title}</h3>
                    <p className="mt-3 max-w-xl text-ink/65">{s.blurb}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
                      Learn more
                      <ArrowRight width={15} height={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid
        eyebrow="A Specialized Approach"
        heading="What makes our care different"
        features={differentiators}
        columns={4}
        bg="cream"
      />

      <InsuranceBand />
      <CTABand image="/images/facility/dsc09533.jpg" />
    </>
  );
}
