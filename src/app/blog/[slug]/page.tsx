import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatDate, getUnifiedPosts } from '@/lib/posts';
import { getClarionPost } from '@/lib/clarion';
import { breadcrumbSchema, pageMeta } from '@/lib/seo';
import { site } from '@/lib/site';
import PostImage from '@/components/PostImage';
import CTABand from '@/components/CTABand';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Clock, Phone } from '@/components/icons';

// New Clarion posts appear without a redeploy; unknown slugs render on demand.
export const revalidate = 300;
export const dynamicParams = true;

// Pre-render the legacy library at build; Clarion posts are rendered on demand
// (their slugs live in Clarion, not the repo) and then cached via ISR.
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// Resolve a slug to either a legacy post or a live Clarion post.
async function resolvePost(slug: string) {
  const legacy = getPost(slug);
  if (legacy) return legacy;
  return getClarionPost(slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await resolvePost(params.slug);
  if (!post) return { title: 'Article Not Found' };
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    image: post.image || undefined,
    type: 'article',
    publishedTime: post.date,
  });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await resolvePost(params.slug);
  if (!post) notFound();

  // Related: three other newest posts from the unified list.
  const related = (await getUnifiedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    image: post.image.startsWith('/') ? `${site.url}${post.image}` : post.image,
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
    description: post.excerpt,
  };

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink-900">
        <PostImage src={post.image} alt="" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/70" />
        <div className="container-fw relative">
          <div className="mx-auto max-w-3xl pb-14 pt-16 sm:pt-20">
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="text-white/30">/</span>
              <Link href="/blog" className="hover:text-white">Blog</Link>
            </nav>
            {/* Capped to the article measure below it — the page frame is 1360 wide, and an
                uncapped post title runs the full width and no longer lines up with the body. */}
            <h1 className="max-w-3xl text-3xl leading-[1.15] !text-white sm:text-4xl lg:text-[2.9rem]">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span>By the {site.name} Clinical Team</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>{formatDate(post.date)}</span>
              {post.readingMin > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/30" />
                  <span className="flex items-center gap-1.5">
                    <Clock width={15} height={15} /> {post.readingMin} min read
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Body + aside */}
      <section className="section bg-cream">
        <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="mx-auto w-full max-w-prose lg:mx-0">
            {/*
              FW-30, partial. All 42 posts had zero in-body images. Each one already ships a
              featured image, but it was only ever used as a 30%-opacity hero backdrop — so the
              photo existed and was never actually seen. Promoting it to a real lead figure gives
              every post one genuine image using assets already in the repo.

              `alt=""` on purpose: the `h1` sits directly above and the image is illustrative, so
              a description here would just repeat the headline to a screen reader.

              Mid-article topical imagery is NOT solved by this and needs new assets — see the note
              on FW-30 in issues.md for why that is worth holding until V0108 settles whether these
              posts survive at all.
            */}
            {post.image && (
              <figure className="relative mb-10 aspect-[16/10] overflow-hidden rounded-xl2 shadow-card">
                {/* PostImage, not next/image: a Clarion post's cover is an arbitrary remote
                    URL and next/image rejects unconfigured hosts at render time. It renders
                    `fill`, hence the positioned, aspect-ratio parent. */}
                <PostImage src={post.image} alt="" sizes="(max-width: 1024px) 100vw, 680px" />
              </figure>
            )}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

            {/* Medical disclaimer */}
            <p className="mt-12 rounded-xl2 bg-cream-deep/70 p-5 text-sm leading-relaxed text-ink/55">
              This article is for educational purposes and is not a substitute for professional
              medical advice. If you or someone you love needs help, our team is available 24/7.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={site.phone.href} className="btn-primary" suppressHydrationWarning>
                <Phone width={16} height={16} /> Call {site.phone.display}
              </a>
              <Link href="/admissions/#verify" className="btn-ghost">
                Verify insurance <ArrowRight width={16} height={16} />
              </Link>
            </div>
          </article>

          {/* Sticky sidebar CTA */}
          <aside className="lg:pt-2">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-xl2 bg-ink p-7 text-white shadow-card">
                <h2 className="!text-white text-xl">Speak with our team</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Questions about treatment or getting started? We're here around the clock, with no
                  pressure and complete confidentiality.
                </p>
                <a href={site.phone.href} className="btn-white mt-5 w-full" suppressHydrationWarning>
                  <Phone width={16} height={16} /> {site.phone.display}
                </a>
                <Link href="/contact" className="btn-outline-light mt-3 w-full">
                  Send a message
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section bg-cream-deep pt-0">
          <div className="container-wide">
            <h2 className="text-2xl sm:text-3xl">Keep reading</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <PostImage src={p.image} alt={p.title} sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs text-ink/50">{formatDate(p.date)}</span>
                      <h3 className="mt-2 text-lg leading-snug">{p.title}</h3>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-steel">
                        Read more <ArrowRight width={14} height={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand image="/images/facility/lounge-green-sofas-and-macrame.jpg" />

      <JsonLd data={jsonLd} />
      {/* FW-27 — this page renders a Home / Blog trail but had no BreadcrumbList. */}
      <JsonLd
        data={breadcrumbSchema([{ label: 'Blog', href: '/blog' }, { label: post.title }])}
      />
    </>
  );
}
