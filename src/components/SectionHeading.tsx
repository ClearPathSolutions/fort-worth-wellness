import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  tone = 'dark',
  className = '',
}: Props) {
  const centered = align === 'center';
  return (
    <Reveal
      className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow ${centered ? 'justify-center' : ''} ${tone === 'light' ? '!text-sand-light' : ''}`}>
          <span className={`h-px w-6 ${tone === 'light' ? 'bg-sand-light' : 'bg-steel'}`} />
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-4 text-3xl leading-[1.12] sm:text-4xl lg:text-[2.7rem] ${
          tone === 'light' ? '!text-white' : ''
        }`}
      >
        {title}
      </h2>
      {intro && (
        <div
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            tone === 'light' ? 'text-white/70' : 'text-ink/65'
          }`}
        >
          {intro}
        </div>
      )}
    </Reveal>
  );
}
