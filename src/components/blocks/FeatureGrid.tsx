import type { ComponentType, SVGProps } from 'react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/SectionHeading';

export type Feature = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
};

type Props = {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  bg?: 'cream' | 'cream-deep' | 'white';
  tone?: 'dark' | 'light';
};

export default function FeatureGrid({
  eyebrow,
  heading,
  intro,
  features,
  columns = 3,
  bg = 'cream',
  tone = 'dark',
}: Props) {
  const bgClass = bg === 'cream' ? 'bg-cream' : bg === 'cream-deep' ? 'bg-cream-deep' : 'bg-white';
  const cols = columns === 4 ? 'lg:grid-cols-4' : columns === 2 ? 'sm:grid-cols-2' : 'md:grid-cols-3';
  return (
    <section className={`section ${bgClass}`}>
      <div className="container-wide">
        {(heading || eyebrow) && (
          <SectionHeading eyebrow={eyebrow} title={heading} intro={intro} tone={tone} />
        )}
        <div className={`mt-14 grid gap-6 ${columns === 4 ? 'sm:grid-cols-2' : ''} ${cols}`}>
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-xl2 bg-white p-7 shadow-card ring-1 ring-ink/[0.06]">
                {f.icon && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-steel-50 p-3 text-steel">
                    <f.icon width={24} height={24} />
                  </div>
                )}
                <h3 className="mt-5 text-lg">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
