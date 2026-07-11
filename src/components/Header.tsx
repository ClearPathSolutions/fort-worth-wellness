'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, site } from '@/lib/site';
import { ArrowRight, ChevronDown, Menu, Phone, X } from '@/components/icons';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [openGroup, setOpenGroup] = useState<string | null>(null); // mobile submenu

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Utility bar — slim, useful contact strip (hidden on phones to save height) */}
      <div className="hidden bg-ink text-white/85 md:block">
        <div className="container-wide flex h-9 items-center justify-between text-[13px]">
          <p className="tracking-wide">{site.hours} · {site.address.city}, {site.address.state}</p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} className="link-underline hover:text-white">
              {site.email}
            </a>
            <a href={site.phone.href} className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Phone width={15} height={15} /> {site.phone.display}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ease-smooth ${
          scrolled
            ? 'bg-cream/90 shadow-[0_6px_30px_-18px_rgba(32,48,60,0.5)] backdrop-blur-md'
            : 'bg-cream/70 backdrop-blur-sm'
        }`}
      >
        <div className="container-wide flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="relative z-10 shrink-0" aria-label={`${site.name} — home`}>
            <Image
              src="/brand/logo.png"
              alt={site.name}
              width={1804}
              height={461}
              priority
              className="h-9 w-auto sm:h-10"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {nav.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                      isActive(item.href) ? 'text-steel' : 'text-ink/80 hover:text-steel'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      width={15}
                      height={15}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  </Link>
                  {/* Dropdown */}
                  <div className="invisible absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="card overflow-hidden p-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block rounded-lg px-4 py-3 transition-colors hover:bg-steel-50"
                        >
                          <span className="block text-sm font-semibold text-ink">{c.label}</span>
                          {c.blurb && (
                            <span className="mt-0.5 block text-[13px] leading-snug text-ink/55">
                              {c.blurb}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    isActive(item.href) ? 'text-steel' : 'text-ink/80 hover:text-steel'
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            <Link href="/admissions" className="btn-primary hidden h-11 xl:inline-flex">
              Verify Insurance
            </Link>
            <a href={site.phone.href} className="btn-gold hidden h-11 sm:inline-flex xl:hidden">
              <Phone width={16} height={16} /> Call Now
            </a>

            {/* Mobile call button — always one tap away */}
            <a
              href={site.phone.href}
              className="btn-gold h-11 w-11 !px-0 sm:hidden"
              aria-label={`Call ${site.phone.display}`}
            >
              <Phone width={18} height={18} />
            </a>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-steel hover:text-steel xl:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X width={22} height={22} /> : <Menu width={22} height={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 xl:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Scrim */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Panel */}
        <nav
          aria-label="Mobile"
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-cream shadow-lift transition-transform duration-300 ease-smooth ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-ink/10 px-5">
            <Image src="/brand/logo.png" alt={site.name} width={1804} height={461} className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink"
              aria-label="Close menu"
            >
              <X width={20} height={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <ul className="flex flex-col gap-0.5">
              {nav.map((item) =>
                item.children ? (
                  <li key={item.href} className="border-b border-ink/5">
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`flex-1 py-3.5 pl-2 text-lg font-medium ${
                          isActive(item.href) ? 'text-steel' : 'text-ink'
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenGroup((g) => (g === item.href ? null : item.href))}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink/60"
                        aria-label={`Toggle ${item.label} submenu`}
                        aria-expanded={openGroup === item.href}
                      >
                        <ChevronDown
                          width={20}
                          height={20}
                          className={`transition-transform duration-300 ${
                            openGroup === item.href ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <div
                      className="grid overflow-hidden transition-all duration-300 ease-smooth"
                      style={{ gridTemplateRows: openGroup === item.href ? '1fr' : '0fr' }}
                    >
                      <ul className="min-h-0 pb-2 pl-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="flex items-center gap-2 rounded-lg py-2.5 pl-3 text-[15px] text-ink/70 hover:text-steel"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-sand" />
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.href} className="border-b border-ink/5">
                    <Link
                      href={item.href}
                      className={`block py-3.5 pl-2 text-lg font-medium ${
                        isActive(item.href) ? 'text-steel' : 'text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Sticky footer CTAs */}
          <div className="shrink-0 space-y-3 border-t border-ink/10 bg-white/60 px-5 py-4">
            <Link href="/admissions" className="btn-primary w-full">
              Verify Insurance <ArrowRight width={16} height={16} />
            </Link>
            <a href={site.phone.href} className="btn-gold w-full">
              <Phone width={16} height={16} /> Call {site.phone.display}
            </a>
            <p className="text-center text-[13px] text-ink/55">{site.hours}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
