'use client';

import { useState } from 'react';
import { Minus, Plus } from '@/components/icons';

export type QA = { q: string; a: string };

export default function FAQ({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink/10 overflow-hidden rounded-xl2 bg-white shadow-card ring-1 ring-ink/[0.06]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-steel-50/50"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg text-ink">{item.q}</span>
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isOpen ? 'bg-steel text-white' : 'bg-steel-50 text-steel'
                }`}
              >
                {isOpen ? <Minus width={16} height={16} /> : <Plus width={16} height={16} />}
              </span>
            </button>
            <div
              className="grid overflow-hidden transition-all duration-300 ease-smooth"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="min-h-0">
                <p className="px-6 pb-6 leading-relaxed text-ink/70">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
