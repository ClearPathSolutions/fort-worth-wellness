import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight, Check } from '@/components/icons';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  body?: ReactNode;
  bullets?: string[];
  image: string;
  imageAlt: string;
  imageSide?: 'left' | 'right';
  cta?: { label: string; href: string };
  bg?: 'cream' | 'cream-deep' | 'white';
};

export default function SplitFeature({
  eyebrow,
  title,
  intro,
  body,
  bullets,
  image,
  imageAlt,
  imageSide = 'right',
  cta,
  bg = 'cream',
}: Props) {
  const bgClass = bg === 'cream' ? 'bg-cream' : bg === 'cream-deep' ? 'bg-cream-deep' : 'bg-white';
  const imageFirst = imageSide === 'left';
  return (
    <section className={`section ${bgClass}`}>
      <div className="container-wide grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className={imageFirst ? 'order-2 lg:order-1' : 'order-2'}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 shadow-soft">
            <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </Reveal>

        <div className={imageFirst ? 'order-1 lg:order-2' : 'order-1'}>
          <SectionHeading align="left" eyebrow={eyebrow} title={title} intro={intro} />
          {body && (
            <Reveal className="prose-fw mt-6" delay={80}>
              {body}
            </Reveal>
          )}
          {bullets && bullets.length > 0 && (
            <Reveal className="mt-7" delay={100}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-steel-50 text-steel">
                      <Check width={14} height={14} />
                    </span>
                    <span className="text-ink/75">{b}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {cta && (
            <Reveal className="mt-8" delay={140}>
              <Link href={cta.href} className="btn-primary">
                {cta.label} <ArrowRight width={16} height={16} />
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
