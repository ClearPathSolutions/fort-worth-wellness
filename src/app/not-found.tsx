import Link from 'next/link';
import { site } from '@/lib/site';
import { ArrowRight, Phone } from '@/components/icons';

export default function NotFound() {
  return (
    <section className="section bg-cream">
      <div className="container-fw flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="eyebrow justify-center">
          <span className="h-px w-6 bg-steel" /> Page not found
        </p>
        <h1 className="mt-4 text-5xl sm:text-6xl">404</h1>
        <p className="mt-4 max-w-md text-ink/65">
          We couldn't find the page you were looking for. Let's get you back on the path — or reach
          out and we'll help right away.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to home <ArrowRight width={16} height={16} />
          </Link>
          <a href={site.phone.href} className="btn-ghost">
            <Phone width={16} height={16} /> Call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
