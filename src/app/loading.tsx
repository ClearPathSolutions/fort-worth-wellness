/**
 * Route-level loading fallback (FW-34). Pages are prerendered, so this rarely appears — it
 * exists so a slow navigation shows brand-consistent chrome instead of a blank frame.
 * Deliberately quiet: no spinner, since `prefers-reduced-motion` users get animation stripped
 * globally in `globals.css` and a frozen spinner reads as a hang.
 */
export default function Loading() {
  return (
    <section className="section bg-cream" aria-busy="true" aria-live="polite">
      <div className="container-fw flex min-h-[50vh] flex-col items-center justify-center">
        <span className="sr-only">Loading…</span>
        <div className="w-full max-w-2xl space-y-4" aria-hidden="true">
          <div className="h-3 w-32 rounded-full bg-ink/10" />
          <div className="h-10 w-3/4 rounded-lg bg-ink/10" />
          <div className="h-4 w-full rounded bg-ink/[0.07]" />
          <div className="h-4 w-5/6 rounded bg-ink/[0.07]" />
        </div>
      </div>
    </section>
  );
}
