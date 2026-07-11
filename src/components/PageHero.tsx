import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import { ArrowRight, Phone } from '@/components/icons';

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  crumbs?: Crumb[];
  showActions?: boolean;
};

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  crumbs = [],
  showActions = true,
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/75 to-ink-900/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/70 to-transparent" />

      <div className="container-fw relative">
        <div className="max-w-2xl pb-14 pt-16 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              {crumbs.map((c) => (
                <span key={c.label} className="flex items-center gap-2">
                  <span className="text-white/30">/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/85">{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {eyebrow && (
            <p className="eyebrow !text-sand-light">
              <span className="h-px w-6 bg-sand-light" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-4 text-4xl leading-[1.08] !text-white sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">{subtitle}</p>
          )}

          {showActions && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={site.phone.href} className="btn-white">
                <Phone width={17} height={17} /> Call {site.phone.display}
              </a>
              <Link href="/admissions" className="btn-outline-light">
                Verify Insurance <ArrowRight width={16} height={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
