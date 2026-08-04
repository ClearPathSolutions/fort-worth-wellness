import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import PageHero from '@/components/PageHero';
import LeadForm from '@/components/LeadForm';
import InsuranceBand from '@/components/InsuranceBand';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Clock, Mail, Phone, Pin, Star } from '@/components/icons';

export const metadata: Metadata = pageMeta({
  title: 'Contact Our Admissions Team',
  description:
    'Call or message the Fort Worth Wellness Center team for admissions guidance, insurance help, and 24/7 support starting mental health care.',
  path: '/contact/',
});

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
    sub: site.distanceFromFortWorth,
    value: site.address.full,
    href: site.address.mapUrl,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Professional Support Is Only a Call Away"
        title="Contact Fort Worth Wellness Center"
        subtitle="Our admissions team is available 24/7 to provide immediate, confidential guidance and help you begin your journey at our Fort Worth center."
        image="/images/facility/lounge-vaulted-ceiling-armchairs.jpg"
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
            {/* The form card used to sit inside a `bg-cream-deep p-2` box, which drew an 8px
                frame in a third tone around it and made it visibly narrower than the panel
                beside it — the pair read as mismatched rather than as two equal columns. The
                two cards are within ~6px of each other in height on their own, so the wrapper
                was buying nothing. */}
            <Reveal>
              <LeadForm
                variant="card"
                title="Send us a message"
                subtitle="Tell us how we can help and our team will reach out quickly — day or night."
                formKey="contact"
                submitLabel="Send my message"
              />
            </Reveal>
            <Reveal delay={100}>
              <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06]">
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

                {/* Location panel — decorative "map" backdrop + live directions.
                    A styled panel is used instead of a Google embed because Google
                    blocks framing (X-Frame-Options) and the rural address isn't in
                    open map data. The button opens live turn-by-turn routing. */}
                <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-ink-900 p-8 text-center">
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-[0.18]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 50% 45%, rgba(74,122,164,0.9) 0, transparent 42%), linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
                      backgroundSize: '100% 100%, 34px 34px, 34px 34px',
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="block h-24 w-24 animate-ping rounded-full bg-steel/20" />
                  </span>
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-steel text-white shadow-lift ring-8 ring-steel/20">
                    <Pin width={30} height={30} />
                  </span>
                  <p className="relative mt-6 font-serif text-2xl text-white">
                    {site.address.city}, {site.address.state}
                  </p>
                  <p className="relative mt-1 text-sm text-white/60">
                    A private wooded property, {site.distanceFromFortWorth}
                  </p>
                  <div className="relative mt-6 flex flex-col items-center gap-3 sm:flex-row">
                    <a
                      href={site.address.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-white"
                    >
                      Get directions <ArrowRight width={16} height={16} />
                    </a>
                    <a
                      href={site.reviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-light"
                    >
                      <Star width={16} height={16} /> Leave a review
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <InsuranceBand />
      {/*
        Contact was the only page that ended on the insurance band, which is `bg-ink` and sits
        directly on the `bg-ink-900` footer — two near-identical navies meeting with no seam, so
        the page trailed off instead of closing. Every other page ends on this band.
        The copy is deliberately not the default "contact our admissions team" — that would be
        telling someone on the contact page to make contact. It points at the one thing the form
        above cannot do: reach a person immediately.
      */}
      <CTABand
        eyebrow="No Wait, No Voicemail"
        title="Want an answer right now?"
        body="The form above reaches our admissions team quickly — but if you would rather not wait, the line below is answered by a person around the clock. No script, no pressure, and nothing you say is shared."
        image="/images/facility/great-room-seating-open-to-kitchen.jpg"
      />
    </>
  );
}
