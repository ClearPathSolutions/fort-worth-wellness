import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses, and protects your information.`,
  robots: { index: true, follow: false },
};

const sections = [
  {
    h: 'Our Commitment to Your Privacy',
    p: [
      `${site.name} ("we," "us," or "our") is committed to protecting the privacy and confidentiality of everyone who visits our website or reaches out for care. This policy explains what information we collect, how we use it, and the choices you have. Because we are a healthcare provider, we treat your information with the sensitivity it deserves.`,
    ],
  },
  {
    h: 'Information We Collect',
    p: [
      'When you contact us, request a callback, or submit an insurance verification, we may collect information you choose to provide — such as your name, phone number, email address, and any details you share about your situation.',
      'We may also automatically collect limited technical information, such as your browser type, device, and pages visited, to help us improve our website. This site does not require you to create an account.',
    ],
  },
  {
    h: 'How We Use Your Information',
    p: [
      'We use the information you provide solely to respond to your inquiry, verify insurance benefits, coordinate care, and support your admissions process. We do not sell your personal information, and we do not share it for advertising purposes.',
    ],
  },
  {
    h: 'Protected Health Information & HIPAA',
    p: [
      'Any health information you share with us in the course of seeking or receiving treatment is protected under the Health Insurance Portability and Accountability Act (HIPAA) and applicable federal confidentiality laws. We do not disclose protected health information without your written authorization, except as permitted or required by law.',
    ],
  },
  {
    h: 'How We Protect Your Information',
    p: [
      'We use reasonable administrative, technical, and physical safeguards to protect the information you share with us. However, no method of transmission over the internet is completely secure. If your matter is urgent or sensitive, we encourage you to call us directly.',
    ],
  },
  {
    h: 'Third-Party Services',
    p: [
      'Our website may use trusted third-party services (for example, mapping and basic analytics) that operate under their own privacy policies. Insurance carrier names and logos are shown for informational purposes only and do not imply endorsement.',
    ],
  },
  {
    h: 'Your Choices',
    p: [
      'You may request that we update or delete the personal information you have provided, or ask us to stop contacting you, at any time. To make a request, contact us using the details below.',
    ],
  },
  {
    h: 'Changes to This Policy',
    p: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-ink-900 pt-16">
        <div className="container-fw pb-14 pt-6">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-white/85">Privacy Policy</span>
          </nav>
          <h1 className="text-4xl !text-white sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Your trust matters to us. Here's how we handle the information you share with{' '}
            {site.name}.
          </p>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-fw">
          <div className="mx-auto max-w-prose space-y-10">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-2xl">{s.h}</h2>
                {s.p.map((para, i) => (
                  <p key={i} className="mt-4 leading-relaxed text-ink/75">
                    {para}
                  </p>
                ))}
              </div>
            ))}

            <div className="rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
              <h2 className="text-2xl">Contact Us</h2>
              <p className="mt-4 leading-relaxed text-ink/75">
                If you have questions about this Privacy Policy or how your information is handled,
                please reach out:
              </p>
              <ul className="mt-4 space-y-1.5 text-ink/80">
                <li>
                  <strong className="font-semibold text-ink">{site.name}</strong>
                </li>
                <li>{site.address.full}</li>
                <li>
                  <a href={site.phone.href} className="text-steel hover:underline">
                    {site.phone.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="text-steel hover:underline">
                    {site.email}
                  </a>
                </li>
              </ul>
              <p className="mt-6 text-xs text-ink/45">
                This policy is provided as a general template and should be reviewed by qualified
                legal counsel to ensure it reflects your specific practices and regulatory
                obligations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
