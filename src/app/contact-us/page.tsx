import type { Metadata } from 'next';
import { site } from '@/lib/site';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import LeadForm from '@/components/LeadForm';
import InsuranceBand from '@/components/InsuranceBand';
import Reveal from '@/components/ui/Reveal';
import { Clock, Mail, Phone, Pin } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Contact Us — Expert-Led Mental Health Care in Fort Worth',
  description:
    'Call or message the Fort Worth Wellness Center team for admissions guidance, insurance help, and 24/7 support starting mental health care.',
};

const cards = [
  {
    icon: Phone,
    label: 'Call Us',
    sub: '24/7 Admissions Line',
    value: site.phone.display,
    href: site.phone.href,
  },
  {
    icon: Mail,
    label: 'Email Us',
    sub: 'We reply within 24 hours',
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: Pin,
    label: 'Find Us',
    sub: `Minutes from Fort Worth, TX`,
    value: site.address.full,
    href: site.address.mapUrl,
  },
];

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Professional Support Is Only a Call Away"
        title="Contact Fort Worth Wellness Center"
        subtitle="Our admissions team is available 24/7 to provide immediate, confidential guidance and help you begin your journey at our Fort Worth center."
        image="/images/facility/dsc09533.jpg"
        crumbs={[{ label: 'Contact' }]}
        showActions={false}
      />

      {/* Contact cards */}
      <section className="section bg-cream">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <a
                  href={c.href}
                  target={c.icon === Pin ? '_blank' : undefined}
                  rel={c.icon === Pin ? 'noopener noreferrer' : undefined}
                  className="group flex h-full flex-col items-start rounded-xl2 bg-white p-7 shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-steel-50 p-3 text-steel transition-colors group-hover:bg-steel group-hover:text-white">
                    <c.icon width={24} height={24} />
                  </span>
                  <h2 className="mt-5 text-xl">{c.label}</h2>
                  <p className="mt-1 text-sm text-ink/50">{c.sub}</p>
                  <p className="mt-3 font-medium text-steel">{c.value}</p>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Form + map */}
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full items-center rounded-xl2 bg-cream-deep p-2">
                <div className="w-full">
                  <LeadForm
                    variant="card"
                    title="Send us a message"
                    subtitle="Tell us how we can help and our team will reach out quickly — day or night."
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06]">
                <div className="border-b border-ink/10 p-6">
                  <p className="eyebrow">
                    <span className="h-px w-6 bg-steel" /> Get in touch
                  </p>
                  <h2 className="mt-3 text-2xl">Visit our campus</h2>
                  <div className="mt-4 space-y-3 text-sm text-ink/70">
                    <p className="flex items-start gap-3">
                      <Pin width={18} height={18} className="mt-0.5 shrink-0 text-steel" />
                      {site.address.full}
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock width={18} height={18} className="shrink-0 text-steel" />
                      {site.hours}
                    </p>
                  </div>
                </div>
                <iframe
                  title={`Map to ${site.name}`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[320px] w-full flex-1 border-0"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <InsuranceBand />
    </>
  );
}
