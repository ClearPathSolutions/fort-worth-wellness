'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  as?: 'div' | 'li' | 'section';
};

/**
 * Fades + lifts children into view once, when scrolled to.
 *
 * FW-33. This wraps most of the site's body copy, and the server renders it at `opacity: 0`,
 * so with JavaScript unavailable the page used to arrive almost entirely blank. Two fallbacks
 * make that safe, and the docstring used to claim the second one without implementing it:
 *
 * 1. **No JavaScript** — a `<noscript>` rule in `layout.tsx` forces every `[data-reveal]`
 *    element visible. That is why the `data-reveal` attribute below is not decorative.
 * 2. **Reduced motion** — now actually checked. Those users skip the hidden state entirely
 *    rather than depending on an IntersectionObserver callback to become readable.
 */
export default function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as any;
  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal={shown ? 'shown' : 'pending'}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(22px)',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
}
