'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { GalleryPhoto } from '@/lib/site';
import { X } from '@/components/icons';

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') setActive((a) => (a === null ? a : (a + 1) % photos.length));
      if (e.key === 'ArrowLeft')
        setActive((a) => (a === null ? a : (a - 1 + photos.length) % photos.length));
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [active, photos.length]);

  return (
    <>
      {/* Balanced 12-tile mosaic — every row stays full, nothing hangs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {photos.map((p, i) => {
          // First & sixth tiles span 2 cols on desktop for rhythm
          const wide = i === 0 || i === 5;
          return (
            <button
              key={p.src}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative aspect-[4/3] overflow-hidden rounded-xl2 shadow-card ring-1 ring-ink/[0.06] ${
                wide ? 'md:col-span-2' : ''
              }`}
            >
              <Image
                src={p.src}
                alt={p.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
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
      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/95 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X width={22} height={22} />
          </button>
          <figure
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[active].src}
              alt={photos[active].caption}
              width={photos[active].w}
              height={photos[active].h}
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-4 text-center text-sm text-white/80">
              {photos[active].caption} · {active + 1} / {photos.length}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
