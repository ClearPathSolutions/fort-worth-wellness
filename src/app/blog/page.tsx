import type { Metadata } from 'next';
import Link from 'next/link';
import ClarionBlog from '@/components/ClarionBlog';
import SectionHeading from '@/components/SectionHeading';
import CTABand from '@/components/CTABand';

export const metadata: Metadata = {
  title: 'Blog — Recovery & Mental Health Insights',
  description:
    'Expert articles on mental health, addiction recovery, detox, and dual diagnosis from the clinical team at Fort Worth Wellness Center.',
};

export default function BlogPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-ink-900 pt-16">
        <div className="container-fw pb-14 pt-6">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/85">Blog</span>
          </nav>
          <p className="eyebrow !text-sand-light">
            <span className="h-px w-6 bg-sand-light" /> Insights &amp; Education
          </p>
          <h1 className="mt-4 text-4xl !text-white sm:text-5xl">Recovery &amp; mental health insights</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Guidance, education, and encouragement from our clinical team — on mental health,
            addiction recovery, detox, and lasting wellness.
          </p>
        </div>
      </section>

      {/* Clarion-managed blog posts (via same-origin proxy) */}
      <section className="section bg-cream">
        <div className="container-wide">
          <SectionHeading align="left" eyebrow="All Articles" title="Browse the library" />
          <div className="mt-10">
            <ClarionBlog />
          </div>
        </div>
      </section>

      <CTABand image="/images/facility/dji0587.jpg" />
    </>
  );
}
