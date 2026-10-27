import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { site } from '@/lib/site';

// Standard network SMS terms (legal-pages package, 2026-10-27). The approved wording
// is shared across every site; only facility facts differ.
export const metadata: Metadata = pageMeta({
  title: 'SMS Terms',
  description: `Terms for text-message communications from ${site.name}: consent, frequency, cost, opt-out, and privacy.`,
  path: '/sms-terms/',
});

export default function SmsTermsPage() {
  return (
    <>
      {/* Same page frame as the site's other policy pages. */}
      <section className="bg-ink-900 pt-16">
        <div className="container-fw pb-14 pt-6">
          <JsonLd data={breadcrumbSchema([{ label: 'SMS Terms' }])} />
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/85">SMS Terms</span>
          </nav>
          <h1 className="text-4xl !text-white sm:text-5xl">SMS Terms</h1>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-fw">
          {/* suppressHydrationWarning: CallTrackingMetrics rewrites the phone links inside. */}
          <div className="article-body mx-auto max-w-prose" suppressHydrationWarning>
            <p>These terms describe how text-message communications work when you opt in to messages from Fort Worth Wellness Center.</p>
            <p><em>Last updated: October 27, 2026.</em></p>

            <h2>Program description</h2>
            <p>By providing your mobile number and opting in, you agree to receive recurring informational and admissions-related text messages from Fort Worth Wellness Center. Message frequency varies.</p>
            <h2>Consent is not a condition of treatment</h2>
            <p>Consent to receive SMS communications is not a condition of purchasing or receiving treatment or services.</p>

            <h2>Cost</h2>
            <p>Message and data rates may apply, depending on your carrier plan.</p>

            <h2>Opt-out</h2>
            <p suppressHydrationWarning>You can cancel at any time by replying STOP to any message. For help, reply HELP or contact us at <a href="tel:+18176126807">817-612-6807</a>.</p>
            <h2>Carriers</h2>
            <p>Carriers are not liable for delayed or undelivered messages.</p>

            <h2>Privacy</h2>
            <p>Mobile information is never shared or sold to third parties for marketing purposes. See our <Link href="/privacy-policy/">Privacy Policy</Link> for details.</p>
            <h2>If this is an emergency</h2>
            <p>Text messages are not monitored around the clock and are not for emergencies. If you are in crisis, call or text 988. In a medical emergency, call 911.</p>
          </div>
        </div>
      </section>
    </>
  );
}
