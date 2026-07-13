import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import FAQ from '@/components/FAQ';
import LeadForm from '@/components/LeadForm';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Phone, Pin, Plane } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Admissions — Start Mental Health Treatment in Fort Worth',
  description:
    'Our Fort Worth admissions team makes starting mental health care simple — same-day placement, clear insurance guidance, and 24/7 confidential support.',
};

const steps = [
  { n: '01', title: 'Reach Out Anytime', body: 'Call or complete our secure form to connect with an admissions specialist. Every conversation is confidential, and our team is available 24/7 to listen and guide you.' },
  { n: '02', title: 'Clinical Assessment', body: 'During a brief intake call, we learn about your current challenges, emotional health, and treatment history so our clinicians can recommend the right care.' },
  { n: '03', title: 'Insurance Clarity', body: 'We verify your benefits, explain coverage in plain terms, and review any financial responsibilities — handling the logistics so you can move forward with confidence.' },
  { n: '04', title: 'Admission & Arrival', body: 'We coordinate your arrival and ensure a smooth transition. From the moment you arrive, you are welcomed into a safe, supportive environment built to help you heal.' },
];

const faqs = [
  { q: 'How quickly can I be admitted?', a: `Many individuals can be admitted the same day or within 24 hours. Our team works quickly to assess your needs, verify insurance, and coordinate arrival. Call us at ${site.phone.display} to get started.` },
  { q: 'Will my job be protected if I take time off for treatment?', a: 'Many employees qualify for protection under the Family and Medical Leave Act (FMLA), which may allow leave for medical treatment without losing your job. Our team can help you understand the process and provide documentation if needed.' },
  { q: 'Is treatment confidential?', a: 'Yes. Your privacy is protected by federal confidentiality laws and HIPAA regulations. We do not share your information without your written permission.' },
  { q: 'What types of insurance do you accept?', a: 'We accept most major private insurance providers. Since coverage varies, we recommend using our verification form or calling our admissions team to confirm your specific benefits.' },
  { q: 'Can my family be involved in my treatment?', a: 'Yes. With your permission, family involvement can be an important part of recovery. We offer family communication and therapy options to strengthen support systems and improve long-term outcomes.' },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="A Clear Path to Mental Wellness"
        title="Begin your journey at Fort Worth Wellness"
        subtitle="When your mind feels heavy, the right support makes all the difference. We offer personalized care and 24/7 guidance to help you regain balance and peace — and we make getting started simple."
        image="/images/facility/dsc09517.jpg"
        crumbs={[{ label: 'Admissions' }]}
      />

      {/* Process */}
      <section className="section bg-cream">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Support Starts the Moment You Reach Out"
            title="Your path to care in four steps"
            intro="Seeking help can feel like a big step, but getting started shouldn't be complicated. Our admissions team makes the process clear and stress-free."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="relative flex h-full flex-col rounded-xl2 bg-white p-7 shadow-card ring-1 ring-ink/[0.06]">
                  <span className="font-serif text-4xl text-steel/25">{s.n}</span>
                  <h3 className="mt-3 text-lg">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Verify insurance — form */}
      <section id="verify" className="section bg-ink text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pt-4">
            <SectionHeading
              tone="light"
              align="left"
              eyebrow="Simple, Private, and Always Free"
              title="Check your insurance benefits"
              intro="Submit your information securely and our admissions specialists will review your benefits and contact you promptly. We explain coverage clearly, outline any potential costs, and help you take the next step with confidence."
            />
            <Reveal className="mt-8" delay={80}>
              <div className="flex items-center gap-4 rounded-xl2 bg-white/[0.06] p-5 ring-1 ring-white/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/20 text-sand-light">
                  <Phone width={22} height={22} />
                </span>
                <div>
                  <p className="text-sm text-white/60">Rather talk it through?</p>
                  <a href={site.phone.href} className="font-serif text-2xl !text-white hover:text-sand-light">
                    {site.phone.display}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <LeadForm
              title="Verify your benefits"
              subtitle="Confidential and free — no obligation. We'll get right back to you."
              requireDob
            />
          </Reveal>
        </div>
      </section>

      {/* What to expect */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading
            eyebrow="What to Expect"
            title="The Fort Worth Wellness experience"
            intro="When you arrive, our team welcomes you and helps you get settled. Your safety and emotional stability come first."
          />
          <Reveal className="mx-auto mt-10 max-w-3xl prose-fw space-y-5" delay={80}>
            <p>
              During your first day, our clinicians complete a mental health evaluation and explain
              what to expect so you feel prepared and supported. Our residential program provides a
              calm, structured setting where you can stabilize symptoms and focus on healing, with
              staff available 24/7.
            </p>
            <p>
              Treatment includes individual therapy, group therapy, and evidence-based approaches that
              improve emotional regulation and build healthy coping skills — with holistic and
              experiential therapies to support your overall well-being. We focus on practical
              progress: real tools to handle stress and maintain stability after you leave.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Travel + find us */}
      <section className="section bg-cream-deep">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-steel-50 text-steel">
                <Plane width={24} height={24} />
              </span>
              <h3 className="mt-5 text-2xl">Travel support made simple</h3>
              <p className="mt-3 text-ink/65">
                Distance shouldn't prevent you from getting the care you need. If you're traveling to
                us, we help coordinate your trip — airport pickups from DFW or Love Field, local
                transportation, and arrival planning — so you can focus on getting better.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex h-full flex-col rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-steel-50 text-steel">
                <Pin width={24} height={24} />
              </span>
              <h3 className="mt-5 text-2xl">How to find us</h3>
              <p className="mt-3 text-ink/65">{site.address.full}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={site.address.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Get directions <ArrowRight width={16} height={16} />
                </a>
                <Link href="/contact-us" className="btn-ghost">
                  Contact us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-cream">
        <div className="container-fw">
          <SectionHeading eyebrow="Questions & Answers" title="Frequently asked questions" />
          <div className="mt-12">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      <CTABand image="/images/facility/dji0591.jpg" />
    </>
  );
}
