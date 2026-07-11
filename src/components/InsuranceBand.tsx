import Image from 'next/image';
import Link from 'next/link';
import { insurers, site } from '@/lib/site';
import { ArrowRight, Shield } from '@/components/icons';
import SectionHeading from '@/components/SectionHeading';

export default function InsuranceBand() {
  return (
    <section className="section bg-ink text-white">
      <div className="container-fw">
        <SectionHeading
          tone="light"
          eyebrow="Don't let finances stop you"
          title="We work with most major insurance"
          intro="Verification is free, private, and takes just a few minutes. Our team confirms your benefits and explains your coverage in plain language — before you ever arrive."
        />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {insurers.map((ins) => (
            <div key={ins.name} className="flex items-center justify-center">
              <Image
                src={`/images/insurance/${ins.file}`}
                alt={`${ins.name} insurance accepted`}
                width={160}
                height={64}
                className="h-9 w-auto max-w-[150px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/admissions" className="btn-primary">
            <Shield width={17} height={17} /> Verify Your Benefits <ArrowRight width={16} height={16} />
          </Link>
          <a href={site.phone.href} className="btn-outline-light">
            Or call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
