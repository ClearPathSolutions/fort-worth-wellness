import { site } from './site';

/**
 * Every FAQ on the site, in one place (V0099).
 *
 * These questions used to be four separate `const faqs = [...]` arrays inlined in the pages that
 * rendered them. The `/faq` hub needs all of them, and copying the arrays would have guaranteed
 * they drifted apart — so the pages now import their own group from here instead.
 *
 * Answers are **verbatim** from the original page arrays. Two of them make a claim that
 * [FW-37] flags as uncorroborated — "regular, direct sessions with an on-staff psychiatrist"
 * (dual diagnosis) and "regular sessions with our psychiatric team" (residential). They are
 * reproduced unchanged rather than softened, because rewording an unverified clinical claim into
 * something vaguer just hides it. Note the hub now surfaces both on a second URL, so if FW-37
 * comes back unconfirmed there are two places to correct, and this file is the one to edit.
 */
export type QA = { q: string; a: string };

export type FaqGroup = {
  /** Stable key used by the page that owns this group, and as the hub's anchor id. */
  id: string;
  /** Section heading on the hub. */
  title: string;
  /** The page these questions live on, linked from the hub. */
  href: string;
  hrefLabel: string;
};

const admissions: QA[] = [
  {
    q: 'How quickly can I be admitted?',
    a: `Many individuals can be admitted the same day or within 24 hours. Our team works quickly to assess your needs, verify insurance, and coordinate arrival. Call us at ${site.phone.display} to get started.`,
  },
  {
    q: 'Will my job be protected if I take time off for treatment?',
    a: 'Many employees qualify for protection under the Family and Medical Leave Act (FMLA), which may allow leave for medical treatment without losing your job. Our team can help you understand the process and provide documentation if needed.',
  },
  {
    q: 'Is treatment confidential?',
    a: 'Yes. Your privacy is protected by federal confidentiality laws and HIPAA regulations. We do not share your information without your written permission.',
  },
  {
    q: 'What types of insurance do you accept?',
    a: 'We accept most major private insurance providers. Since coverage varies, we recommend using our verification form or calling our admissions team to confirm your specific benefits.',
  },
  {
    q: 'Can my family be involved in my treatment?',
    a: 'Yes. With your permission, family involvement can be an important part of recovery. We offer family communication and therapy options to strengthen support systems and improve long-term outcomes.',
  },
];

const detox: QA[] = [
  {
    q: 'How long does medical detox take?',
    a: 'While every individual is different, most medical detox stays last between 5 and 10 days. Once our medical team determines you are physically stable, you transition into our residential program to begin your personalized mental health or dual diagnosis track.',
  },
  {
    q: 'Why is medical detox necessary?',
    a: 'For many, physical stabilization is the required first step toward psychological healing. Managing withdrawal safely ensures your brain chemistry is balanced, making you far more resilient and prepared for the intensive therapy that follows.',
  },
  {
    q: 'Is my mental health addressed during detox?',
    a: 'Yes. While the first days focus on physical safety and stabilization, our integrated clinical team begins coordinating your mental health care immediately. As you feel stronger, you gain access to counseling and emotional support to prepare you for deeper work.',
  },
  {
    q: 'Do you accept insurance for detox?',
    a: `We accept most major private insurance providers and offer a complimentary, confidential verification to help you understand your coverage before you arrive. Call us at ${site.phone.display} to learn more.`,
  },
  {
    q: 'How do I get started?',
    a: `Starting is simple. Call our confidential line at ${site.phone.display} or fill out our online form. We'll conduct a brief assessment and verify your insurance to get you or your loved one into care as quickly as possible.`,
  },
];

const residential: QA[] = [
  {
    q: 'What is residential mental health treatment?',
    a: 'It is a 24/7, live-in program where you receive intensive psychiatric care and therapy in a safe, structured environment.',
  },
  {
    q: 'How long is a typical stay?',
    a: 'Stay lengths are personalized to your needs, typically ranging from 30 to 90 days to ensure deep, lasting restoration.',
  },
  {
    // FW-37: unverified psychiatric-staffing claim. Left verbatim — see the file docstring.
    q: 'Will I see a psychiatrist?',
    a: 'Yes. You will have regular sessions with our psychiatric team for medication management and clinical oversight of your care plan.',
  },
  {
    q: 'What conditions do you focus on?',
    a: 'We focus on complex cases of depression, anxiety, PTSD, bipolar disorder, and personality disorders.',
  },
  {
    q: 'Is the setting private?',
    a: `Absolutely. We are a boutique facility with just ${site.beds} licensed beds, set on a private wooded property outside ${site.address.city} — chosen specifically for privacy and discretion.`,
  },
  {
    q: 'Can my family be involved?',
    a: 'Yes — we encourage family therapy and education sessions to help your loved ones support your long-term wellness.',
  },
];

const dualDiagnosis: QA[] = [
  {
    q: 'How is your dual diagnosis approach different?',
    a: 'By prioritizing psychiatric stability, we address the underlying drivers of self-medication — such as untreated depression or trauma — allowing for a more sustainable, profound recovery than traditional programs.',
  },
  {
    q: 'Can I come if substance use is a secondary concern?',
    a: 'Yes. Our sanctuary is designed for those who need intensive psychiatric support, even if substance use is a secondary or past concern.',
  },
  {
    // FW-37: unverified psychiatric-staffing claim. Left verbatim — see the file docstring.
    q: 'Will I work with a psychiatrist?',
    a: 'Our clinical model includes regular, direct sessions with an on-staff psychiatrist to ensure your medication protocols are precisely balanced for both your mental health and recovery needs.',
  },
  {
    q: 'How do you address trauma?',
    a: 'Trauma is often the silent catalyst for co-occurring disorders, so we integrate specialized modalities like EMDR and trauma-informed counseling to help you process the past and regulate your nervous system.',
  },
  {
    q: 'Do you accept insurance?',
    a: `Yes — we work with most major PPO insurance providers. Our admissions team can perform a confidential verification of your benefits. Call us at ${site.phone.display} to learn more.`,
  },
];

const groups: Record<string, QA[]> = {
  admissions,
  detox,
  residential,
  'dual-diagnosis': dualDiagnosis,
};

/** Order and labelling for the `/faq` hub. */
export const faqGroups: FaqGroup[] = [
  {
    id: 'admissions',
    title: 'Admissions & getting started',
    href: '/admissions',
    hrefLabel: 'Admissions',
  },
  { id: 'detox', title: 'Medical detox', href: '/treatment/detox', hrefLabel: 'Medical Detox' },
  {
    id: 'residential',
    title: 'Residential mental health',
    href: '/treatment/mental-health-residential',
    hrefLabel: 'Residential Inpatient',
  },
  {
    id: 'dual-diagnosis',
    title: 'Dual diagnosis',
    href: '/treatment/dual-diagnosis',
    hrefLabel: 'Dual Diagnosis',
  },
];

/** The questions for one page. Throws on an unknown id so a typo fails the build, not silently. */
export function faqGroup(id: string): QA[] {
  const items = groups[id];
  if (!items) throw new Error(`Unknown FAQ group: ${id}`);
  return items;
}

/** Every question, in hub order — used by `/faq` and its single `FAQPage` block. */
export const allFaqs: QA[] = faqGroups.flatMap((g) => faqGroup(g.id));
