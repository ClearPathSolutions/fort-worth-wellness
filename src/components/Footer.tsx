import Image from 'next/image';
import Link from 'next/link';
import { services, site } from '@/lib/site';
import { Mail, Phone, Pin } from '@/components/icons';

const explore = [
  { label: 'Who We Are', href: '/about-us' },
  { label: 'Who We Help', href: '/who-we-help' },
  { label: 'Tour the Facility', href: '/tour' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function Footer() {
  const year = 2026;
  return (
    <footer className="bg-ink-900 text-white/70">
      <div className="container-wide grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        {/* Brand + blurb */}
        <div className="max-w-sm">
          <Image
            src="/brand/logo-white.png"
            alt={site.name}
            width={1804}
            height={461}
            className="h-11 w-auto"
          />
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            {site.name} is a premier mental health center in {site.address.city}, Texas — offering
            expert psychiatric care, dual diagnosis, and detox in a supportive residential setting
            built for lasting stability.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Image
              src="/images/gold-seal.png"
              alt="The Joint Commission — National Quality Approval Gold Seal"
              width={80}
              height={80}
              className="h-16 w-16 rounded-full bg-white/95 p-1"
            />
            <p className="text-xs leading-snug text-white/50">
              Accredited by
              <br />
              The Joint Commission
            </p>
          </div>
        </div>

        {/* Treatment */}
        <nav aria-label="Treatment">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Treatment</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/treatment" className="hover:text-white">
                Overview
              </Link>
            </li>
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Explore */}
        <nav aria-label="Explore">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {explore.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="hover:text-white">
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={site.phone.href} className="flex items-start gap-3 hover:text-white">
                <Phone width={18} height={18} className="mt-0.5 shrink-0 text-steel-light" />
                <span>
                  <span className="block font-semibold text-white">{site.phone.display}</span>
                  <span className="text-xs text-white/50">{site.hours}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-start gap-3 hover:text-white">
                <Mail width={18} height={18} className="mt-0.5 shrink-0 text-steel-light" />
                <span>{site.email}</span>
              </a>
            </li>
            <li>
              <a
                href={site.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-white"
              >
                <Pin width={18} height={18} className="mt-0.5 shrink-0 text-steel-light" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}, {site.address.state} {site.address.zip}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <span className="text-white/25">
              If you are in crisis, call or text <span className="font-semibold text-white/70">988</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
