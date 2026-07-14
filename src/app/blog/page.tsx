import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts, formatDate } from '@/lib/posts';
import ClarionBlog from '@/components/ClarionBlog';
import SectionHeading from '@/components/SectionHeading';
import CTABand from '@/components/CTABand';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Clock } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Blog — Recovery & Mental Health Insights',
  description:
    'Expert articles on mental health, addiction recovery, detox, and dual diagnosis from the clinical team at Fort Worth Wellness Center.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

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

      {/* Latest, Clarion-managed posts — auto-hidden until Clarion has published posts */}
      <section className="section clarion-embed-section bg-cream-deep">
        <div className="container-wide">
          <SectionHeading align="left" eyebrow="Latest" title="Fresh from our team" />
          <div className="mt-10">
            <ClarionBlog />
          </div>
        </div>
      </section>

      {/* Featured (original library) */}
      {featured && (
        <section className="section bg-cream pb-0">
          <div className="container-wide">
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:shadow-lift lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] lg:aspect-auto">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="text-xs font-semibold uppercase tracking-widest text-sand">
                    Latest Article
                  </span>
                  <h2 className="mt-3 text-2xl leading-snug sm:text-3xl">{featured.title}</h2>
                  <p className="mt-4 text-ink/65">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-ink/50">
                    <span>{formatDate(featured.date)}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock width={15} height={15} /> {featured.readingMin} min read
                    </span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-steel">
                    Read article
                    <ArrowRight width={16} height={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Library grid (original 42 posts) */}
      <section className="section bg-cream">
        <div className="container-wide">
          <SectionHeading align="left" eyebrow="All Articles" title="Browse the library" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 80}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-ink/50">
                      <span>{formatDate(p.date)}</span>
                      <span className="flex items-center gap-1">
                        <Clock width={13} height={13} /> {p.readingMin} min
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg leading-snug">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60 line-clamp-3">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
                      Read more
                      <ArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand image="/images/facility/dji0587.jpg" />
    </>
  );
}
