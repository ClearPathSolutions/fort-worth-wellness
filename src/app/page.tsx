import Image from 'next/image';
import Link from 'next/link';
import { services, site } from '@/lib/site';
import CTABand from '@/components/CTABand';
import InsuranceBand from '@/components/InsuranceBand';
import LeadForm from '@/components/LeadForm';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import {
  ArrowRight,
  Brain,
  Check,
  Clock,
  Compass,
  Heart,
  Home as HomeIcon,
  Leaf,
  Phone,
  Shield,
  Sparkle,
  Users,
} from '@/components/icons';

const trustBadges = [
  { icon: Shield, label: 'Joint Commission Accredited' },
  { icon: Clock, label: '24/7 Admissions & Support' },
  { icon: Sparkle, label: 'Same-Day Intake Available' },
  { icon: Heart, label: 'Most Insurance Accepted' },
];

const approach = [
  {
    icon: Compass,
    title: 'Person-Centered Therapy',
    body: 'We treat the human being behind the diagnosis. Your recovery roadmap is built around your emotional needs — never a one-size-fits-all template.',
  },
  {
    icon: Users,
    title: 'Connection & Continuity',
    body: "Healing shouldn't mean being cut off. We encourage healthy connection so you can integrate your wellness tools into real life, in a safe, monitored setting.",
  },
  {
    icon: Brain,
    title: 'Comprehensive Dual-Support',
    body: 'Mental health and substance use are often intertwined. Our protocols treat both at once, so neither side of your wellness is ever left behind.',
  },
];

const mhConditions = ['Anxiety & Panic', 'Depression', 'Bipolar & Mood Disorders', 'PTSD & Trauma', 'OCD & ADHD', 'Personality Disorders'];
const substances = ['Alcohol', 'Opioids & Fentanyl', 'Benzodiazepines', 'Prescription Drugs', 'Cocaine & Stimulants'];

const clinicalTherapies = ['One-on-One Therapy', 'Group Therapy', 'Cognitive Behavioral Therapy (CBT)', 'Dialectical Behavior Therapy (DBT)', 'Medication Management'];
const holisticTherapies = ['Family Therapy', 'Equine Therapy', 'Art & Music Therapy', 'Exercise & Wellness Activities', 'Trauma-Informed Care'];

const whoWeHelp = ['Professionals', 'Veterans', 'First Responders', 'Women', 'Men', 'Young Adults', 'College Students'];

const leadBullets = [
  'No pressure or obligation when you call',
  'Your information stays strictly confidential',
  'Talk to caring people who know how to help',
  'We treat mental health and addiction together',
  'We build a treatment path that fits your life',
];

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Image
          src="/images/facility/dji0577.jpg"
          alt="Fort Worth Wellness Center's private wooded estate in Weatherford, Texas"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="container-fw relative">
          <div className="max-w-2xl pb-16 pt-20 [text-shadow:0_1px_3px_rgba(9,15,21,0.92),0_3px_22px_rgba(9,15,21,0.75)] sm:pb-24 sm:pt-28 lg:pb-32 lg:pt-32">
            <Reveal>
              <p className="eyebrow !text-sand-light">
                <span className="h-px w-6 bg-sand-light" />
                A Private Sanctuary for Wellness in Texas
              </p>
              <h1 className="mt-5 text-4xl leading-[1.06] !text-white sm:text-5xl lg:text-[3.6rem]">
                Premier Mental Health &amp; Wellness Care in Fort Worth
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                Expert psychiatric care, private residential support, and integrated dual diagnosis
                treatment — combined to help you find lasting stability on a tranquil Texas campus.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={site.phone.href} className="btn-white">
                  <Phone width={17} height={17} /> Call {site.phone.display}
                </a>
                <Link href="/admissions" className="btn-gold">
                  Verify Insurance <ArrowRight width={16} height={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Trust strip anchored to hero base */}
        <div className="relative border-t border-white/10 bg-ink-900/70 backdrop-blur-sm">
          <div className="container-fw grid grid-cols-2 gap-x-6 gap-y-4 py-5 lg:grid-cols-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="flex items-center gap-3 text-white/85">
                <b.icon width={20} height={20} className="shrink-0 text-sand-light" />
                <span className="text-sm font-medium leading-snug">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="section bg-cream">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[5/6] overflow-hidden rounded-xl2 shadow-soft sm:aspect-[4/3] lg:aspect-[5/6]">
              <Image
                src="/images/facility/dsc05028.jpg"
                alt="A calm, home-like private resident suite at Fort Worth Wellness Center"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Floating accolade card */}
            <div className="absolute -bottom-6 -right-2 hidden max-w-[220px] items-center gap-3 rounded-xl2 bg-white p-4 shadow-lift ring-1 ring-ink/[0.06] sm:flex lg:-right-6">
              <Image
                src="/images/gold-seal.png"
                alt="The Joint Commission Gold Seal of Approval"
                width={56}
                height={56}
                className="h-14 w-14"
              />
              <p className="text-sm font-medium leading-snug text-ink">
                Accredited by The Joint Commission
              </p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="Setting a new standard for mental health excellence in Texas"
              intro="Fort Worth Wellness was founded on a simple belief: everyone deserves a life defined by peace, not their diagnosis. We've moved away from cold, clinical, one-size-fits-all care toward deeply personalized strategies that help you regain control and find lasting emotional stability."
            />
            <Reveal className="mt-6" delay={80}>
              <p className="prose-fw">
                By blending time-tested clinical methods with modern holistic therapies, we create a
                recovery experience that is as restorative as it is effective — more than treatment,
                a total wellness transformation.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { n: 'Boutique', l: 'Low-capacity, high staff-to-client ratio' },
                  { n: '24/7', l: 'On-site clinical & psychiatric care' },
                  { n: 'Acres', l: 'Private, wooded residential campus' },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl2 bg-white p-4 text-center shadow-card ring-1 ring-ink/[0.05]">
                    <p className="font-serif text-xl text-steel">{s.n}</p>
                    <p className="mt-1 text-xs leading-snug text-ink/60">{s.l}</p>
                  </div>
                ))}
              </div>
              <Link href="/about-us" className="btn-ghost mt-8">
                More about us <ArrowRight width={16} height={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="section bg-cream-deep">
        <div className="container-wide">
          <SectionHeading
            eyebrow="How We Treat"
            title="A full continuum of care, under one roof"
            intro="From medical stabilization to residential psychiatric care and lifelong support, our programs meet you exactly where you are."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <Link
                  href={s.href}
                  className="group flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">{s.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
                      Learn more
                      <ArrowRight
                        width={15}
                        height={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APPROACH ================= */}
      <section className="section bg-cream">
        <div className="container-wide">
          <SectionHeading
            eyebrow="A Modern Approach to Mental Wellness"
            title="Healing built for the whole person"
            intro="We move beyond surface-level symptoms to treat the mind, body, and emotions all at once."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {approach.map((a, i) => (
              <Reveal key={a.title} delay={i * 90}>
                <div className="flex h-full flex-col rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-steel-50 text-steel">
                    <a.icon width={26} height={26} />
                  </div>
                  <h3 className="mt-6 text-xl">{a.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink/65">{a.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONDITIONS + THERAPIES ================= */}
      <section className="section bg-ink text-white">
        <div className="container-wide">
          <SectionHeading
            tone="light"
            eyebrow="What We Treat & How"
            title="Comprehensive, evidence-based care"
            intro="We provide stabilizing care for a diverse range of mental health conditions and co-occurring substance use — treating the entire person, not a list of symptoms."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-xl2 bg-white/[0.04] p-8 ring-1 ring-white/10">
                <h3 className="!text-white text-xl">Conditions We Treat</h3>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sand-light">
                      Mental Health
                    </p>
                    <ul className="space-y-2.5">
                      {mhConditions.map((c) => (
                        <li key={c} className="flex items-center gap-2.5 text-white/80">
                          <Check width={16} height={16} className="shrink-0 text-steel-light" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sand-light">
                      Substance Use
                    </p>
                    <ul className="space-y-2.5">
                      {substances.map((c) => (
                        <li key={c} className="flex items-center gap-2.5 text-white/80">
                          <Check width={16} height={16} className="shrink-0 text-steel-light" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-xl2 bg-white/[0.04] p-8 ring-1 ring-white/10">
                <h3 className="!text-white text-xl">Our Therapies</h3>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sand-light">
                      Clinical
                    </p>
                    <ul className="space-y-2.5">
                      {clinicalTherapies.map((c) => (
                        <li key={c} className="flex items-center gap-2.5 text-white/80">
                          <Check width={16} height={16} className="shrink-0 text-steel-light" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sand-light">
                      Holistic
                    </p>
                    <ul className="space-y-2.5">
                      {holisticTherapies.map((c) => (
                        <li key={c} className="flex items-center gap-2.5 text-white/80">
                          <Check width={16} height={16} className="shrink-0 text-steel-light" /> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= WHO WE HELP ================= */}
      <section className="section bg-cream">
        <div className="container-wide">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <SectionHeading
              align="left"
              eyebrow="Who We Help"
              title="Specialized tracks for your specific journey"
              intro="Every path to wellness is personal. We tailor treatment to the pressures, traumas, and responsibilities unique to who you are."
            />
            <Reveal delay={80}>
              <div className="flex flex-wrap gap-3">
                {whoWeHelp.map((w) => (
                  <span
                    key={w}
                    className="rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink/80 shadow-sm"
                  >
                    {w}
                  </span>
                ))}
              </div>
              <Link href="/who-we-help" className="btn-primary mt-8">
                Explore who we help <ArrowRight width={16} height={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= FACILITY PREVIEW ================= */}
      <section className="section bg-cream-deep">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Reveal className="col-span-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl2 shadow-card">
                  <Image src="/images/facility/dsc09533.jpg" alt="Resort-style pool and patio" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="relative aspect-square overflow-hidden rounded-xl2 shadow-card">
                  <Image src="/images/facility/dsc04980.jpg" alt="Chef's kitchen and dining" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={140}>
                <div className="relative aspect-square overflow-hidden rounded-xl2 shadow-card">
                  <Image src="/images/facility/dsc05075.jpg" alt="The Cedar Creek Barn" fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
                </div>
              </Reveal>
            </div>
            <div>
              <SectionHeading
                align="left"
                eyebrow="A Modern, Private Setting"
                title="Explore our facility"
                intro="Our campus in North Texas offers a quiet, safe place to focus entirely on your mental health — from comfortable private suites to beautiful outdoor grounds, chef-prepared nutrition, and serene spaces designed to help you heal."
              />
              <Reveal className="mt-8" delay={80}>
                <Link href="/tour" className="btn-primary">
                  Take the tour <ArrowRight width={16} height={16} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INSURANCE ================= */}
      <InsuranceBand />

      {/* ================= LEAD FORM ================= */}
      <section className="section bg-cream">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pt-4">
            <SectionHeading
              align="left"
              eyebrow="Request a Callback"
              title="Let us help you find your path to wellness"
              intro="If you're looking for help for yourself or someone you care about, our team is here 24/7 to listen and help you figure out the next steps."
            />
            <Reveal className="mt-8" delay={80}>
              <ul className="space-y-3.5">
                {leadBullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-steel-50 text-steel">
                      <Check width={14} height={14} />
                    </span>
                    <span className="text-ink/75">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-card ring-1 ring-ink/[0.06]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand/15 text-sand">
                  <Phone width={22} height={22} />
                </span>
                <div>
                  <p className="text-sm text-ink/55">Prefer to talk now?</p>
                  <a href={site.phone.href} className="font-serif text-2xl text-ink hover:text-steel">
                    {site.phone.display}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <LeadForm formKey="callback" />
          </Reveal>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <CTABand />
    </>
  );
}
