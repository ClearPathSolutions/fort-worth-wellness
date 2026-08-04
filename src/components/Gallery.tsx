'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from '@/lib/site';
import { ArrowRight, X } from '@/components/icons';

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Which tile opened the lightbox, so focus can be handed back to it on close (WCAG 2.4.3).
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((a) => (a === null ? a : (a + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key === 'ArrowRight') {
        step(1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        step(-1);
        return;
      }
      // Focus trap. Without it, tabbing walks out of the lightbox and into the page
      // underneath while the overlay still covers it (FW-09).
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    // Move focus into the dialog rather than leaving it on the trigger behind the overlay.
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, close, step]);

  // Restore focus to the tile that opened the lightbox once it closes.
  useEffect(() => {
    if (active === null && openerRef.current) {
      openerRef.current.focus();
      openerRef.current = null;
    }
  }, [active]);

  const current = active === null ? null : photos[active];

  return (
    <>
      {/*
        FW-11. The two `wide` tiles span two columns but every tile kept `aspect-[4/3]`, so a
        wide tile rendered about twice as tall as its row-mates and left ~250px of dead space
        beneath the short ones. `md:row-span-2` gives the wide tiles the two grid rows their
        height actually fills, which is what the original "every row stays full" comment claimed
        but did not do.
      */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {photos.map((p, i) => {
          // Three wide tiles, not two — the set is 15 photographs now. At md a wide tile occupies
          // 4 cells (2 cols x 2 rows), so 12 x 1 + 3 x 4 = 24 = six full rows of four, with no
          // half-empty trailing row. Two wide tiles would give 21 cells and leave three holes.
          // At base the grid is 2 columns and the wide tiles span the full width: 3 x 2 + 12 = 18,
          // which is nine exact rows, so the phone layout has no orphan either.
          const wide = i === 0 || i === 5 || i === 10;
          return (
            <button
              key={p.src}
              type="button"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setActive(i);
              }}
              aria-haspopup="dialog"
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl2 shadow-card ring-1 ring-ink/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2 ${
                wide ? 'col-span-2 md:row-span-2 md:aspect-auto' : ''
              }`}
            >
              <Image
                src={p.src}
                // Empty alt on purpose: the visible caption below is the button's accessible
                // name, and duplicating it here made screen readers announce it twice.
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 50vw"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
              <span className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-medium text-white">
                {p.caption}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {current && active !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Facility photo ${active + 1} of ${photos.length}: ${current.caption}`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-4"
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close photo viewer"
          >
            <X width={22} height={22} />
          </button>

          {/*
            Previous / next were arrow-keys only, which on a touch device meant closing and
            reopening the lightbox for every photo — on the page whose entire purpose is
            browsing them (FW-09).
          */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
            aria-label="Previous photo"
          >
            <ArrowRight width={22} height={22} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
            aria-label="Next photo"
          >
            <ArrowRight width={22} height={22} />
          </button>

          <figure
            className="relative max-h-[85vh] w-full max-w-5xl px-12 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.caption}
              width={current.w}
              height={current.h}
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/80">
              {current.caption} · {active + 1} / {photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
