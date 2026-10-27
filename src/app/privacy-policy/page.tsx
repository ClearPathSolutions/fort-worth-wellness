import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, pageMeta } from '@/lib/seo';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses, and protects your information.`,
  path: '/privacy-policy/',
});

// Bump this whenever the policy text below changes.
const effectiveDate = 'August 3, 2026';

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
      'How we may use and disclose protected health information, and your rights to access, amend, and restrict your medical records, are described in full in our Notice of Privacy Practices below, which is also provided at admission.',
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
      // FW-45 added analytics to the site, so this describes what it actually does. Kept to
      // verifiable statements of fact — Vercel Analytics is cookieless by design and the only
      // custom event sent is which form was submitted, never a field value.
      'The analytics we use is privacy-preserving: it does not set tracking cookies, does not build a profile of you, and does not identify individual visitors. We measure which pages are visited and whether a contact form was completed — never the information you typed into it.',
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
      `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. This version is effective ${effectiveDate}.`,
    ],
  },
];

// Bump this whenever the Notice of Privacy Practices text changes.
const nppEffectiveDate = 'October 27, 2026';
const OCR_URL = 'https://www.hhs.gov/ocr/privacy/hipaa/complaints/';

export default function PrivacyPolicyPage() {
  const p = 'mt-4 leading-relaxed text-ink/75';
  const ul = 'mt-4 list-disc space-y-3 pl-6 leading-relaxed text-ink/75';
  return (
    <>
      <section className="bg-ink-900 pt-16">
        <div className="container-fw pb-14 pt-6">
          <JsonLd data={breadcrumbSchema([{ label: 'Privacy Policy' }])} />
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
          <p className="mt-4 text-sm text-white/55">Effective {effectiveDate}</p>
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

            {/* ------------------------------------------------------------------
                HIPAA Notice of Privacy Practices. Added 2026-10-27 after
                LegitScript asked for a policy covering protected health
                information, medical records and patient rights (Terms §V(e),
                Certification Standard 10). Structure follows the HHS model notice:
                https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/model-notices-privacy-practices/index.html
                Counsel should confirm: Privacy Officer designation, 42 CFR Part 2
                program status for the detox program, and Texas Medical Records
                Privacy Act specifics.
            ------------------------------------------------------------------ */}
            <div id="notice-of-privacy-practices" className="border-t border-ink/10 pt-10">
              <p className="text-sm font-semibold uppercase tracking-wider text-steel">
                Notice of Privacy Practices
              </p>
              <h2 className="mt-2 text-3xl">Your health information and your rights</h2>
              <p className="mt-4 text-sm text-ink/55">Effective {nppEffectiveDate}</p>
              <p className={p}>
                <strong>
                  This notice describes how medical information about you may be used and disclosed
                  and how you can get access to this information. Please review it carefully.
                </strong>
              </p>
              <p className={p}>
                {site.name} is required by law to maintain the privacy and security of your
                protected health information (&ldquo;PHI&rdquo;), to give you this notice of our
                legal duties and privacy practices, and to follow the terms of the notice currently
                in effect. This notice applies to all records of your care that we create or
                maintain.
              </p>
            </div>

            <div>
              <h2 className="text-2xl">Your Rights</h2>
              <p className={p}>When it comes to your health information, you have certain rights.</p>
              <ul className={ul}>
                <li>
                  <strong>Get a copy of your medical record.</strong> You can ask to see or get an
                  electronic or paper copy of your medical record and other health information we
                  have about you. We will provide a copy or a summary, usually within 30 days of your
                  request. We may charge a reasonable, cost-based fee.
                </li>
                <li>
                  <strong>Ask us to correct your medical record.</strong> You can ask us to correct
                  health information about you that you think is incorrect or incomplete. We may say
                  &ldquo;no&rdquo; to your request, but we will tell you why in writing within 60 days.
                </li>
                <li>
                  <strong>Request confidential communications.</strong> You can ask us to contact you
                  in a specific way (for example, home or office phone) or to send mail to a different
                  address. We will say &ldquo;yes&rdquo; to all reasonable requests.
                </li>
                <li>
                  <strong>Ask us to limit what we use or share.</strong> You can ask us not to use or
                  share certain health information for treatment, payment, or our operations. We are
                  not required to agree, and we may say &ldquo;no&rdquo; if it would affect your care.
                  If you pay for a service or item out of pocket in full, you can ask us not to share
                  that information for the purpose of payment or our operations with your health
                  insurer. We will say &ldquo;yes&rdquo; unless a law requires us to share it.
                </li>
                <li>
                  <strong>Get a list of those with whom we have shared information.</strong> You can
                  ask for an accounting of the times we have shared your health information for six
                  years prior to the date you ask, who we shared it with, and why. We will include all
                  disclosures except those about treatment, payment, and health care operations, and
                  certain other disclosures (such as any you asked us to make). We will provide one
                  accounting a year for free but will charge a reasonable, cost-based fee if you ask
                  for another within 12 months.
                </li>
                <li>
                  <strong>Get a copy of this privacy notice.</strong> You can ask for a paper copy of
                  this notice at any time, even if you have agreed to receive it electronically.
                </li>
                <li>
                  <strong>Choose someone to act for you.</strong> If you have given someone medical
                  power of attorney or if someone is your legal guardian, that person can exercise
                  your rights and make choices about your health information. We will confirm the
                  person has this authority before we take any action.
                </li>
                <li>
                  <strong>File a complaint if you feel your rights are violated.</strong> You can
                  complain to us using the contact information at the bottom of this page. You can
                  also file a complaint with the U.S. Department of Health and Human Services Office
                  for Civil Rights by sending a letter to 200 Independence Avenue, S.W., Washington,
                  D.C. 20201, calling 1-800-368-1019, or visiting{' '}
                  <a href={OCR_URL} target="_blank" rel="noopener noreferrer" className="text-steel hover:underline">
                    www.hhs.gov/ocr/privacy/hipaa/complaints/
                  </a>
                  . <strong>We will not retaliate against you for filing a complaint.</strong>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl">Your Choices</h2>
              <p className={p}>
                For certain health information, you can tell us your choices about what we share.
                If you have a clear preference for how we share your information in the situations
                described below, talk to us. Tell us what you want us to do, and we will follow your
                instructions.
              </p>
              <p className={p}>In these cases, you have both the right and choice to tell us to:</p>
              <ul className={ul}>
                <li>Share information with your family, close friends, or others involved in your care.</li>
                <li>Share information in a disaster relief situation.</li>
              </ul>
              <p className={p}>
                If you are not able to tell us your preference, for example if you are unconscious,
                we may go ahead and share your information if we believe it is in your best interest.
                We may also share your information when needed to lessen a serious and imminent
                threat to health or safety.
              </p>
              <p className={p}>
                In these cases, we never share your information unless you give us written
                permission:
              </p>
              <ul className={ul}>
                <li>Marketing purposes.</li>
                <li>Sale of your information.</li>
                <li>Most sharing of psychotherapy notes.</li>
              </ul>
              <p className={p}>
                We do not use your health information for fundraising. If that ever changes, we will
                tell you and you will be able to opt out.
              </p>
            </div>

            <div>
              <h2 className="text-2xl">Substance Use Disorder Treatment Records</h2>
              <p className={p}>
                Because we provide substance use disorder treatment, records that identify you as
                seeking or receiving such treatment are also protected by the federal
                confidentiality regulations at 42 C.F.R. Part 2. In general, we may not tell anyone
                outside our program that you attend the program, or disclose any information
                identifying you as having a substance use disorder, unless you consent in writing,
                the disclosure is allowed by a court order, or the disclosure is made to medical
                personnel in a medical emergency, to qualified personnel for research, audit, or
                program evaluation, or as otherwise permitted by Part 2. Violation of these federal
                regulations is a crime, and suspected violations may be reported to the appropriate
                authorities. Federal law and regulations do not protect any information about a
                crime committed by a patient at the program or against any person who works for the
                program, or about any threat to commit such a crime, and do not protect information
                about suspected child abuse or neglect from being reported under state law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl">Our Uses and Disclosures</h2>
              <p className={p}>We typically use or share your health information in the following ways.</p>
              <ul className={ul}>
                <li>
                  <strong>Treat you.</strong> We can use your health information and share it with
                  other professionals who are treating you. <em>Example:</em> a physician treating
                  you for a medical condition asks our clinical team about your medications.
                </li>
                <li>
                  <strong>Run our organization.</strong> We can use and share your health information
                  to run our practice, improve your care, and contact you when necessary.{' '}
                  <em>Example:</em> we use health information about you to manage your treatment and
                  services.
                </li>
                <li>
                  <strong>Bill for your services.</strong> We can use and share your health
                  information to bill and get payment from health plans or other entities.{' '}
                  <em>Example:</em> we give information about you to your health insurance plan so
                  it will pay for your services.
                </li>
              </ul>
              <p className={p}>
                We are also allowed or required to share your information in other ways, usually in
                ways that contribute to the public good, such as public health and research. We have
                to meet many conditions in the law before we can share your information for these
                purposes. Where 42 C.F.R. Part 2 applies, we will only make these disclosures as that
                regulation permits.
              </p>
              <ul className={ul}>
                <li>
                  <strong>Help with public health and safety issues.</strong> Preventing disease,
                  helping with product recalls, reporting adverse reactions to medications, reporting
                  suspected abuse, neglect, or domestic violence, and preventing or reducing a
                  serious threat to anyone&rsquo;s health or safety.
                </li>
                <li>
                  <strong>Do research.</strong> We can use or share your information for health
                  research, subject to the conditions required by law.
                </li>
                <li>
                  <strong>Comply with the law.</strong> We will share information about you if state
                  or federal laws require it, including with the Department of Health and Human
                  Services if it wants to see that we are complying with federal privacy law.
                </li>
                <li>
                  <strong>Respond to organ and tissue donation requests</strong> and{' '}
                  <strong>work with a medical examiner or funeral director</strong> when required.
                </li>
                <li>
                  <strong>
                    Address workers&rsquo; compensation, law enforcement, and other government
                    requests.
                  </strong>{' '}
                  For workers&rsquo; compensation claims, for law enforcement purposes or with a law
                  enforcement official, with health oversight agencies for activities authorized by
                  law, and for special government functions such as military, national security, and
                  presidential protective services.
                </li>
                <li>
                  <strong>Respond to lawsuits and legal actions.</strong> In response to a court or
                  administrative order, or in response to a subpoena, as permitted by law.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl">Our Responsibilities</h2>
              <ul className={ul}>
                <li>
                  We are required by law to maintain the privacy and security of your protected
                  health information.
                </li>
                <li>
                  We will let you know promptly if a breach occurs that may have compromised the
                  privacy or security of your information.
                </li>
                <li>
                  We must follow the duties and privacy practices described in this notice and give
                  you a copy of it.
                </li>
                <li>
                  We will not use or share your information other than as described here unless you
                  tell us we can in writing. If you tell us we can, you may change your mind at any
                  time. Let us know in writing if you change your mind.
                </li>
              </ul>
              <p className={p}>
                For more information, see{' '}
                <a
                  href="https://www.hhs.gov/hipaa/for-individuals/notice-privacy-practices/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-steel hover:underline"
                >
                  www.hhs.gov/hipaa/for-individuals/notice-privacy-practices
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl">State Law</h2>
              <p className={p}>
                Texas law, including the Texas Medical Records Privacy Act, may give you additional
                protections for your medical information and may further restrict how we use or
                disclose information about mental health and substance use disorder treatment.
                Where state law is stricter than federal law, we follow the stricter requirement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl">Changes to the Terms of This Notice</h2>
              <p className={p}>
                We can change the terms of this notice, and the changes will apply to all
                information we have about you. The new notice will be available upon request, at our
                facility, and on our website.
              </p>
            </div>

            <div className="rounded-xl2 bg-white p-8 shadow-card ring-1 ring-ink/[0.06]">
              <h2 className="text-2xl">Contact Us</h2>
              <p className="mt-4 leading-relaxed text-ink/75">
                If you have questions about this Privacy Policy or the Notice of Privacy Practices,
                want to exercise any of the rights above, or wish to file a complaint, contact our
                Privacy Officer:
              </p>
              <ul className="mt-4 space-y-1.5 text-ink/80">
                <li>
                  <strong className="font-semibold text-ink">{site.name}</strong>
                </li>
                <li>Attn: Privacy Officer</li>
                <li>{site.address.full}</li>
                <li>
                  <a href={site.phone.href} className="text-steel hover:underline" suppressHydrationWarning>
                    {site.phone.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="text-steel hover:underline">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
