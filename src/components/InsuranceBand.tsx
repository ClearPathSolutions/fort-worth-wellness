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

        {/*
          FW-23. Each cell is a fixed-height box and the logo is capped on BOTH axes, rather than
          forced to one shared height. The tightened viewBoxes span 2.8:1 to 6.25:1 — a uniform
          height would render ComPsych's wordmark more than twice the size of MultiPlan's. Capping
          width as well lets the very wide marks sit shorter, which is how a logo row is normally
          balanced optically.
        */}
        {/*
          3 columns, not 4 (FW-22). The list is 6 carriers since the two defunct brands came out,
          and 6 in a 4-column grid leaves a half-empty trailing row. 6 divides exactly by both 2
          and 3, so every row stays full at each breakpoint. Revisit if the count changes.
        */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {insurers.map((ins) => (
            <div key={ins.name} className="flex h-12 items-center justify-center">
              <Image
                src={`/images/insurance/${ins.file}`}
                alt={`${ins.name} insurance accepted`}
                width={ins.w}
                height={ins.h}
                className="max-h-10 w-auto max-w-[140px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/admissions/#verify" className="btn-primary">
            <Shield width={17} height={17} /> Verify Your Benefits <ArrowRight width={16} height={16} />
          </Link>
          <a href={site.phone.href} className="btn-outline-light" suppressHydrationWarning>
            Or call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
