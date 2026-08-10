'use client';

import { useState, type FormEvent } from 'react';
import { track } from '@vercel/analytics';
import { site } from '@/lib/site';
import { ArrowRight, Check, Phone, Star } from '@/components/icons';

declare global {
  interface Window {
    ClarionForms?: {
      submit: (payload: { form_key: string; data: Record<string, unknown> }) => Promise<Response>;
    };
  }
}

type Props = {
  /** headline shown above the form */
  title?: string;
  subtitle?: string;
  /** 'card' = boxed white; 'bare' = no card chrome (for use inside a styled panel) */
  variant?: 'card' | 'bare';
  /** insurance verification requires a mandatory date of birth */
  requireDob?: boolean;
  /** identifies which form this is in Clarion (e.g. 'insurance-verification') */
  formKey?: string;
  /** submit button label — the default suits a callback request, not every form (FW-34) */
  submitLabel?: string;
};

const field =
  'w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-ink placeholder-ink/40 shadow-sm outline-none transition focus:border-steel focus:ring-2 focus:ring-steel/25';

export default function LeadForm({
  title = 'Request a confidential callback',
  subtitle = 'Fill out the form and our admissions team will reach out quickly — day or night.',
  variant = 'card',
  requireDob = false,
  formKey = 'website-form',
  submitLabel = 'Request my callback',
}: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot — silently "succeed" for bots without sending anything.
    if ((raw.company || '').trim() !== '') {
      setStatus('ok');
      form.reset();
      return;
    }

    setStatus('sending');

    // Field names Clarion / BEN (Verification of Benefits) recognize.
    const name = (raw.name || '').trim();
    const parts = name.split(/\s+/);
    const data: Record<string, string> = {
      name,
      first_name: parts[0] || '',
      last_name: parts.slice(1).join(' '),
      phone: (raw.phone || '').trim(),
      email: (raw.email || '').trim(),
      date_of_birth: (raw.dob || '').trim(),
      seeking_for: (raw.who || '').trim(),
      message: (raw.message || '').trim(),
    };

    try {
      // Primary: ClarionLabs official form capture (window.ClarionForms.submit).
      let delivered = false;
      const cf = typeof window !== 'undefined' ? window.ClarionForms : undefined;
      if (cf && typeof cf.submit === 'function') {
        try {
          const res = await cf.submit({ form_key: formKey, data });
          // Must be a real, non-failing Response. The previous `!res || res.ok !== false`
          // treated a nullish return as delivered, which would have skipped the server-route
          // fallback if Clarion's script ever stopped returning one (FW-34).
          delivered = !!res && res.ok !== false;
        } catch {
          delivered = false;
        }
      }

      // Fallback: server route (also posts to Clarion's forms API) if the
      // client script didn't load or the capture didn't confirm.
      if (!delivered) {
        // Trailing slash is required, not cosmetic: `trailingSlash: true` in next.config.mjs
        // makes the slashless form 308 to this one, so omitting it costs an extra round trip on
        // the most important interaction on the site.
        const res = await fetch('/api/lead/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...raw, formKey }),
        });
        if (!res.ok) {
          // FW-02: the route now reports real failures, and its message is more useful than a
          // generic one — it distinguishes "Clarion rejected this, please call" from a 429.
          // Never show the success screen on a failed submit: Clarion is the only destination,
          // so a rejected lead is not captured anywhere and a thank-you would be a lie.
          const detail = await res
            .json()
            .then((j: { error?: string }) => j?.error)
            .catch(() => undefined);
          throw new Error(detail || 'failed');
        }
      }

      /*
        FW-45. Fires only on a submission Clarion actually accepted, so the number means
        "a lead reached admissions" rather than "someone pressed a button".

        `form` is the only property sent — never a field value. Two reasons: the payload is
        intake data for someone seeking mental-health or substance-use treatment and does not
        belong in an analytics vendor, and the whole point of choosing a cookieless platform was
        to avoid holding anything that could identify them.

        This is also what makes the verification conversion measurable at all: V0096 kept
        verification inside `/admissions`, so page-level metrics cannot separate it from general
        admissions traffic — but `form=insurance_verification` can.

        Note: custom events need Vercel Web Analytics on a paid plan. On the free tier `track()`
        is a harmless no-op, and pageview data still works.
      */
      track('lead_submitted', { form: formKey });

      setStatus('ok');
      form.reset();
    } catch (err) {
      setStatus('error');
      const detail = err instanceof Error && err.message !== 'failed' ? err.message : null;
      setMessage(
        detail ||
          `Something went wrong sending your request. Please call us directly at ${site.phone.display}.`,
      );
    }
  }

  if (status === 'ok') {
    return (
      <div className={variant === 'card' ? 'card p-8 text-center sm:p-10' : 'text-center'}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-steel-50 text-steel">
          <Check width={28} height={28} />
        </div>
        <h3 className="mt-5 text-2xl">Thank you — we've got it.</h3>
        <p className="mx-auto mt-3 max-w-md text-ink/65">
          A member of our admissions team will reach out shortly. If you'd like to talk right now,
          we're here 24/7.
        </p>
        <a href={site.phone.href} className="btn-primary mt-6">
          <Phone width={16} height={16} /> Call {site.phone.display}
        </a>

        {/* Review ask, scoped to people who have actually received care — it must
            not read as asking a prospective patient to review us. */}
        <p className="mt-6 border-t border-ink/10 pt-5 text-sm text-ink/50">
          Already been part of our community?{' '}
          <a
            href={site.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-steel hover:underline"
          >
            <Star width={13} height={13} /> Share your experience
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className={variant === 'card' ? 'card p-6 sm:p-8' : ''}>
      {title && <h3 className="text-2xl">{title}</h3>}
      {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink/80">
              Full name
            </label>
            <input id="name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink/80">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className={field}
              placeholder="(000) 000-0000"
            />
          </div>
        </div>

        {requireDob && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="dob" className="mb-1.5 block text-sm font-medium text-ink/80">
                Date of birth <span className="text-steel">*</span>
              </label>
              <input
                id="dob"
                name="dob"
                type="date"
                required
                autoComplete="bday"
                max="2015-12-31"
                className={field}
                aria-label="Date of birth (required)"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink/80">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={field}
                placeholder="you@email.com"
              />
            </div>
          </div>
        )}

        <div className={`grid gap-4 ${requireDob ? '' : 'sm:grid-cols-2'}`}>
          {!requireDob && (
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink/80">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={field}
                placeholder="you@email.com"
              />
            </div>
          )}
          <div>
            <label htmlFor="who" className="mb-1.5 block text-sm font-medium text-ink/80">
              Who is this for?
            </label>
            <select id="who" name="who" className={field} defaultValue="Myself">
              <option>Myself</option>
              <option>A family member</option>
              <option>A friend</option>
              <option>A client / patient</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink/80">
            How can we help? <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={field}
            placeholder="Tell us a little about what you're looking for…"
          />
        </div>

        {/* Identifies the form in Clarion */}
        <input type="hidden" name="formKey" value={formKey} />

        {/* Honeypot for bots */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

        <label className="flex items-start gap-3 text-sm text-ink/60">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-steel" />
          <span>
            I consent to be contacted by {site.name}. My information is kept strictly
            confidential and is never shared.
          </span>
        </label>

        {/*
          FW-02. This is the only thing standing between a failed submission and a lost lead, so
          it gets `role="alert"` (a screen reader announces it instead of the visitor silently
          waiting on a form that already finished) and a tappable phone number rather than a
          number embedded in prose they would have to retype.
        */}
        {status === 'error' && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800"
          >
            <p>{message}</p>
            <a
              href={site.phone.href}
              className="mt-2 inline-flex items-center gap-1.5 font-semibold text-red-900 underline"
            >
              <Phone width={14} height={14} /> Call {site.phone.display}
            </a>
          </div>
        )}

        <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-70">
          {status === 'sending' ? (
            'Sending…'
          ) : (
            <>
              {submitLabel} <ArrowRight width={16} height={16} />
            </>
          )}
        </button>
        <p className="text-center text-xs text-ink/45">
          Prefer to talk now? Call{' '}
          <a href={site.phone.href} className="font-semibold text-steel">
            {site.phone.display}
          </a>{' '}
          — {site.hours.toLowerCase()}.
        </p>
      </form>
    </div>
  );
}
