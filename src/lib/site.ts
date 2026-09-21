// ============================================================================
// Fort Worth Wellness Center — single source of truth for site-wide data.
// Change contact details, nav, services, etc. here and it updates everywhere.
// ============================================================================

export const site = {
  name: 'Fort Worth Wellness Center',
  tagline: 'A Private Sanctuary for Mental Wellness in Texas',
  description:
    'Fort Worth Wellness Center provides residential mental health, dual diagnosis, and medical detox care with 24/7 clinical support in a private, restorative Texas setting.',
  url: 'https://fortworthwellness.org',

  // Primary 24/7 admissions line (used site-wide for consistency)
  phone: {
    display: '817-612-6807',
    href: 'tel:+18176126807',
  },
  email: 'info@fortworthwellness.org',
  address: {
    street: '101 Mariah Drive',
    city: 'Weatherford',
    state: 'Texas',
    zip: '76087',
    full: '101 Mariah Drive, Weatherford, Texas 76087',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=101+Mariah+Drive+Weatherford+Texas+76087',
  },
  hours: 'Admissions available 24/7',

  // FW-16. The site previously said "minutes from Fort Worth" in two places. Weatherford is
  // ~30 miles west — a ~35 minute drive — so "minutes" was simply false. Stated in miles because
  // that is the fact; drive time varies.
  // NOTE: this fixes the inaccuracy only. How the Fort Worth *brand* should be framed against a
  // Parker County address is still an open question for the owner (FW-16, step 2).
  distanceFromFortWorth: 'about 30 miles west of Fort Worth',

  // Licensed capacity — the number behind the "boutique / low-capacity" claims.
  beds: 20,
  // Year the facility opened.
  founded: 2026,
  // Google Business Profile review link ("Leave us a review").
  reviewUrl: 'https://g.page/r/CXXpx5vEltafEAE/review',

  /**
   * The Joint Commission (FW-18). Accreditation confirmed current by the owner, 2026-08-03.
   *
   * The seal is now a link, because TJC's own display guidance is that the Gold Seal should point
   * to the organisation's Quality Check listing so a visitor can verify it. An unverifiable seal is
   * the weakest possible version of a trust signal.
   *
   * ⚠️ `qualityCheckUrl` is a **search**, not the direct listing, for two reasons worth knowing:
   *   1. TJC returns 403 to automated requests, so the listing URL could not be captured here.
   *   2. More importantly, the accreditation may be held under a **different legal entity name**.
   *      A public TJC provider entry appears to exist for "Fort Worth Detox, LLC" at this exact
   *      address (101 Mariah Dr, Weatherford 76087) — not for "Fort Worth Wellness Center". If so,
   *      someone searching Quality Check for the brand name will not find it.
   *
   * Replace with the direct listing URL, and see FW-18 about whether the accredited entity name
   * should be disclosed alongside the seal.
   */
  jointCommission: {
    qualityCheckUrl: 'https://www.qualitycheck.org/search/?keyword=Weatherford%2C+TX',
  },
} as const;

/**
 * Official social profiles, in the order they render in the footer.
 *
 * This list is also the source of schema.org `sameAs` on the site-wide MedicalBusiness
 * (see `organizationSchema` in `seo.ts`) — that property is how a search engine ties these
 * profiles to this domain as one entity, so add a new profile HERE rather than dropping a
 * link straight into the footer, or the markup and the structured data drift apart.
 *
 * `icon` keys a brand mark in `components/icons.tsx`; this file stays plain data, with no
 * JSX, because it is imported by both server and client components.
 *
 * Only profiles the business actually controls belong here. `sameAs` is an identity claim,
 * not a link list — pointing it at a page someone else runs asserts something untrue.
 */
export const social = [
  { icon: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/fortworthwellness_' },
  { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/fortworthwellnesscenter/' },
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/fort-worth-wellness-center',
  },
] as const;

// ClarionLabs live-chat widget. The site key is PUBLIC by design (origin-pinned
// + rate-limited, like an Intercom app id) — safe to ship in the page.
// Set NEXT_PUBLIC_CLARION_SITE_KEY in the environment (e.g. Vercel) to override
// the placeholder without a code change; then redeploy.
export const clarion = {
  siteKey: process.env.NEXT_PUBLIC_CLARION_SITE_KEY || 'cpx_VBotbTAdkkyKLFY5vyEpG3MHMp88defB',
  api: 'https://api.clarionlabs.ai',
  widgetSrc: 'https://www.clarionlabs.ai/widget.v1.js',
  formsSrc: 'https://www.clarionlabs.ai/forms-capture.v1.js',
  blogSrc: 'https://www.clarionlabs.ai/blog-embed.v1.js',
  color: '#4a7aa4', // brand steel blue — matches buttons + Longhorn logo
};

/**
 * Third-party measurement.
 *
 * Note what this changes about the site's privacy posture — see the note beside `<Analytics />`
 * in `app/layout.tsx`. Both tags below set first-party cookies and both can associate a visitor
 * with the URL they are on, and on this site the URL is the sensitive part: a request for
 * `/treatment/dual-diagnosis` is a health inference about the person making it. That is the
 * pattern behind the HHS OCR bulletin on tracking technologies and the FTC's actions against
 * BetterHelp and GoodRx. Owner's call, made knowingly — but it is a decision, not a default,
 * and anything added to the GTM container inherits it without further review.
 */
export const analytics = {
  /** Google Tag Manager container. */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-TC7PQ4LR',
  /**
   * CallTrackingMetrics. `t.js` performs dynamic number insertion — it rewrites the numbers
   * rendered from `site.phone` so calls can be attributed to a source. Supplied as a
   * protocol-relative `//264810.tctm.co/t.js`; pinned to https here because the site is
   * https-only and a protocol-relative src has no benefit left.
   *
   * `264810` is the account id for the whole facility group; a different `aid` is a different
   * account, so do not change it without checking which facility it points at.
   *
   * The tag itself must load with `async` and must stay that way — see the long note beside it
   * in `app/layout.tsx` for the two silent failures a synchronous tag causes here.
   */
  callTrackingSrc: 'https://264810.tctm.co/t.js',
};

export type NavChild = { label: string; href: string; blurb?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  { label: 'Who We Are', href: '/about' },
  {
    label: 'Treatment',
    href: '/treatment',
    children: [
      {
        label: 'Medical Detox',
        href: '/treatment/detox',
        blurb: 'Safe, 24/7 medically supervised stabilization.',
      },
      {
        label: 'Residential Inpatient',
        href: '/treatment/mental-health-residential',
        blurb: 'Intensive live-in psychiatric care.',
      },
      {
        label: 'Dual Diagnosis',
        href: '/treatment/dual-diagnosis',
        blurb: 'Mental health and substance use, treated together.',
      },
      {
        label: 'Aftercare & Alumni',
        href: '/treatment/aftercare',
        blurb: 'Lifelong support after your stay.',
      },
    ],
  },
  { label: 'Who We Help', href: '/who-we-help' },
  { label: 'Tour', href: '/tour' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Insurance carriers, shown on a dark band.
//
// The logos are light-grey monochrome SVGs (~#b0afab), not white — an earlier comment here said
// white, which was wrong (FW-23). They are left grey deliberately: MultiPlan's mark uses a
// five-step tonal ramp that flattens into an unreadable blob if forced to a single colour.
//
// `w`/`h` are each file's real content bounds. All eight were sliced from one 216x76.29
// "InsuranceLogos" sprite and had kept the sprite's viewBox, so every logo sat letterboxed in a
// mostly-empty box, filling only 19-42% of it — which is why they rendered small and at visibly
// different sizes. The viewBoxes are now tight and these dimensions match them, so `next/image`
// gets a truthful aspect ratio. If you replace a file, re-measure it.
//
// FW-22 — owner decision 2026-08-03: pull the dead brands now rather than wait for the full
// contracted list. Two were removed and one renamed:
//
//   ValueOptions          removed — brand ceased to exist in 2014 (folded into Beacon)
//   Beacon Health Options removed — brand ceased to exist in 2023 (became Carelon Behavioral Health)
//   Magellan Health    -> Magellan Healthcare, its current name. NOT removed: unlike the two
//                         above this carrier still exists, so deleting it would drop a real one.
//
// `beacon.svg` and `valueoptions.svg` are left on disk, unreferenced, rather than deleted — if the
// facility confirms Carelon, a successor logo is wanted in that slot. Logged under FW-38.
//
// ⚠️ STILL OPEN: this is a *de-risked* list, not a verified one. Nobody has confirmed which
// carriers the facility is actually contracted with, and showing a logo is a representation about
// coverage. Six plausible names is safer than eight with two corpses, but the real list still
// needs confirming before cutover.
export const insurers = [
  { name: 'Anthem', file: 'anthem.svg', w: 140.64, h: 39.39 },
  { name: 'Blue Cross Blue Shield', file: 'bluecross.svg', w: 171.65, h: 36.03 },
  { name: 'ComPsych', file: 'compsych.svg', w: 147.01, h: 23.52 },
  { name: 'Magellan Healthcare', file: 'magellan.svg', w: 111.1, h: 38.0 },
  { name: 'MultiPlan', file: 'multiplan.svg', w: 147.31, h: 48.98 },
  { name: 'Three Rivers', file: 'threerivers.svg', w: 143.31, h: 40.51 },
];

export type Service = {
  slug: string;
  href: string;
  title: string;
  short: string;
  blurb: string;
  image: string;
};

export const services: Service[] = [
  {
    slug: 'detox',
    href: '/treatment/detox',
    title: 'Medical Detox',
    short: 'Detoxification',
    blurb:
      'Safe, comfort-first withdrawal management with 24/7 clinical supervision in a private residential setting.',
    image: '/images/facility/bedroom-two-beds.jpg',
  },
  {
    // Renamed from "Mental Health Residential" — this location does not take primary mental
    // health, so the old label claimed a level of care it does not provide.
    //
    // The slug and href deliberately still read `mental-health-residential`. The URL is indexed,
    // is the target of a WordPress-era 301 in next.config.mjs, and is linked from blog bodies;
    // changing it costs real equity and buys nothing a visitor sees, since every label rendered
    // on the page now says Residential Inpatient. If it should change anyway, it needs a 301
    // from the old path, the redirect chain in next.config.mjs re-pointed so it stays one hop,
    // the sitemap entry updated and the in-body blog links rewritten — not just a rename here.
    slug: 'mental-health-residential',
    href: '/treatment/mental-health-residential',
    title: 'Residential Inpatient',
    short: 'Residential',
    blurb:
      'Intensive, live-in psychiatric care for depression, anxiety, trauma, and mood disorders in a restorative home-like sanctuary.',
    image: '/images/facility/lounge-vaulted-ceiling-armchairs.jpg',
  },
  {
    slug: 'dual-diagnosis',
    href: '/treatment/dual-diagnosis',
    title: 'Dual Diagnosis',
    short: 'Dual Diagnosis',
    blurb:
      'Integrated care that treats mental health conditions and co-occurring substance use at the same time, addressing the root cause.',
    image: '/images/facility/group-room-long-table.jpg',
  },
  {
    slug: 'aftercare',
    href: '/treatment/aftercare',
    title: 'Aftercare & Alumni',
    short: 'Aftercare',
    blurb:
      'A structured step-down plan and a lifelong alumni community to help you carry your progress home and keep it.',
    image: '/images/facility/grounds-fire-pit-and-rear-elevation.jpg',
  },
];

export type TeamMember = {
  name: string;
  role: string;
  /** Post-nominal credentials, e.g. 'LPC'. Only ever from the bios document — never inferred. */
  credential?: string;
  image?: string;
  /**
   * Hide from the /about preview grid while still appearing in full on /team. The two pages
   * render the same roster, and this is the only thing that separates them.
   */
  aboutHidden?: boolean;
  /**
   * Prose bio. Not authored here — it comes from the staff portal at request time, which is
   * where non-engineers edit it. Present on the type so a curated entry and a portal entry
   * are the same shape by the time the page renders.
   */
  bio?: string;
};

/**
 * Leadership team (FW-36 / FW-15).
 *
 * **Antoine Gross Sr. was removed.** He was listed here as Director of Clinical Services, but the
 * bios document files him under `[Title] Dallas Detox Center` — he is *Dallas's* clinical lead.
 * Crediting another facility's clinician as this one's is a material misstatement about who
 * provides clinical care, so it came off rather than waiting for a replacement.
 *
 * The clinical director's name is settled: **Cortney** Best. The bios document spells her
 * Cortney four times in the body and Corney once in the heading; the owner's first staff list
 * repeated the heading, then he corrected it. The body was right, and the heading, the portal's
 * `name` field and the headshot filename all carry the same typo.
 *
 * Also still held, per FW-36: both case managers (Jacci Westbrook, whose bio refers to "Jessica"
 * three times, and Krystal Moore, `MSW`).
 *
 * Every remaining entry is a **shared Texas role**, not Fort Worth-exclusive — the bios say so
 * outright. That is normal for a group operator but the page used to imply otherwise, so
 * `/about` now states it. Credentials are only listed where the bios document supplies one;
 * Joshua and Haley have none on record, so none are shown.
 */
export const team: TeamMember[] = [
  // Order, titles and credentials are the owner's written staff list verbatim — reordered
  // 2026-09-21 to the sequence he sent: Olivia, Cortney, Deborah, Joshua, Haley, Jacci,
  // Krystal, Landon, then Jacob. It is also why Olivia carries no credential: that list gives
  // one for Deborah and Cortney and none for her.
  //
  // Everyone is listed locally, where they used to be four. The rest arrived via the portal
  // feed, which returns `photoUrl: null` for the whole Texas team — so they had no way to get a
  // headshot. Listing them here gives them one; `roster()` still matches each person to the
  // portal by name and takes their bio prose from it. Anyone the portal knows about who is not
  // named here is still appended.
  {
    name: 'Olivia Hadjerioua',
    role: 'Executive Director',
    image: '/images/team/olivia-hadjerioua.png',
  },
  {
    // "Cortney", not "Corney". The owner's first staff list said Corney and the site followed it;
    // he has since corrected himself — the typo was his. That resolves the discrepancy the other
    // way from how it was originally called: the bios document's BODY, which spells her Cortney
    // in all four sentences, was right all along, and the document heading, the portal's `name`
    // field and the headshot filename all carry the same propagated typo.
    name: 'Cortney Best',
    role: 'Clinical Director',
    credential: 'M.C.J., LCDC',
    image: '/images/team/cortney-best.jpg',
  },
  {
    name: 'Deborah Wade',
    role: 'Director of Nursing',
    credential: 'BSN, RN',
    image: '/images/team/deborah-wade.jpg',
  },
  { name: 'Joshua Leder', role: 'Director of Operations', image: '/images/team/joshua-leder.png' },
  {
    // The supplied headshot is filed under "Haley Hayes"; it is the same frame as the one
    // already committed here, so it is the same person under a different surname. Her name is
    // spelled Wadlington on the owner's staff list, which is what the site follows.
    name: 'Haley Wadlington',
    role: 'Director of Client Care',
    image: '/images/team/haley-wadlington.png',
  },
  { name: 'Jacci Westbrook', role: 'Case Manager', image: '/images/team/jacci-westbrook.jpg' },
  { name: 'Krystal Moore', role: 'Case Manager', image: '/images/team/krystal-moore.jpg' },
  {
    // Bio supplied 2026-09-21 and reproduced verbatim. It also settles the title: the bios
    // document had him under "OTHER FACILITY BIOS NEEDED" as "Landon Hawpe - Case Manager DDC",
    // which was wrong on both counts — he is Head Chef, across both Texas facilities.
    name: 'Landon Hawpe',
    role: 'Head Chef',
    image: '/images/team/landon-hawpe.jpg',
    bio: 'Landon Hawpe serves as Head Chef for Dallas Detox Center and Fort Worth Wellness Center, bringing years of culinary experience and a personal passion for recovery to his role. Having spent most of his adult life in fine dining, Landon has served as Executive Chef at several restaurants, developing a deep appreciation for creating memorable experiences through food.\n\nAs Landon progressed in his own recovery, he felt called to take his culinary career in a more meaningful direction. About three years ago, he transitioned from the restaurant industry into behavioral healthcare, combining his love of food with his desire to serve people whose journeys he personally understands.\n\nToday, Landon oversees culinary services across both Texas facilities, creating thoughtful, high-quality meals that bring comfort, nourishment, and a sense of community to the treatment experience. For Landon, food is more than a meal\u2014it is an opportunity to care for others and contribute to an environment where people can focus on healing and recovery.',
  },
  {
    // Headshot and bio both supplied 2026-09-21; the bio is reproduced verbatim.
    //
    // `aboutHidden` stays, because the owner's list adds him to /team only. That is also the
    // better layout: /about centres a partial trailing row, so a ninth card there would sit alone
    // under a row of four — the exact "hanging off" shape the comment above that grid exists to
    // prevent. Eight fills two rows of four precisely. Drop this flag to show him there too.
    name: 'Jacob Doss',
    role: 'Alumni Coordinator',
    image: '/images/team/jacob-doss.jpg',
    bio: 'Jacob Doss serves as the Alumni Coordinator for Quadrant Health Group\u2019s Texas facilities, supporting both Dallas Detox Center and Fort Worth Wellness Center. His role focuses on helping clients stay connected to the support, relationships, and sense of community they begin building during treatment.\n\nJacob brings a personal understanding of mental health, addiction, treatment, and recovery to his work, allowing him to connect with clients in a genuine and relatable way. By building relationships while clients are still in residential treatment, he helps make the transition into alumni support feel more natural and ensures they know that support does not end at discharge.\n\nThrough alumni outreach, events, continued communication, and community engagement, Jacob works to create a strong and welcoming alumni network across both Texas locations. His goal is to make sure clients leave treatment knowing they are still part of a community\u2014one they can stay connected to, contribute to, and continue growing alongside long after discharge.',
  },
];

/**
 * Medical oversight — deliberately NOT a member of the `team` array above.
 *
 * Dr. Tambini is not Fort Worth Wellness Center staff. Her title at Quadrant Health Group is
 * "Medical Oversight", and she is Founder and CEO of The Sober Connection, a separate
 * physician-led medical services organisation that contracts with behavioural healthcare
 * facilities. Rendering her in the Weatherford roster between the Director of Nursing and the
 * case managers would tell a family she works at this building, which she does not — the same
 * class of claim as the facility photographs that turned out to be another property.
 *
 * She therefore gets her own scoped section and her own page, both of which state the
 * relationship in words rather than leaving it to be inferred from adjacency.
 *
 * The bio is reproduced verbatim from quadranthealthgroup.com/team/pamela-tambini/ at the
 * client's instruction. Nothing here is paraphrased and no credential is inferred: on a page
 * whose entire purpose is to establish medical authority, an embellished credential is the one
 * error that would matter most. If the Quadrant page changes, re-copy it — do not edit around it.
 */
export const medicalOversight = {
  name: 'Dr. Pamela Tambini',
  role: 'Medical Oversight',
  /** Board certifications, stated exactly as the source states them. */
  credential: 'MD',
  image: '/images/team/pamela-tambini.jpg',
  slug: 'pamela-tambini',
  sourceUrl: 'https://www.quadranthealthgroup.com/team/pamela-tambini/',
  /** Governs how she is introduced everywhere she appears on this site. */
  scopeNote:
    'Dr. Tambini provides medical oversight across Quadrant Health Group\u2019s facilities, including Fort Worth Wellness Center. She is not based at the Weatherford campus.',
  bio: [
    'Dr. Pamela Tambini is a board-certified physician in Internal Medicine and Addiction Medicine, healthcare executive, and Founder and Chief Executive Officer of The Sober Connection, a physician-led medical services organization supporting behavioral healthcare facilities nationwide.',
    'Through The Sober Connection, Dr. Tambini provides executive-level medical oversight and supports the development of clinical standards, quality assurance processes, and regulatory compliance initiatives. The Sober Connection\'s network of qualified medical professionals is responsible for the direct delivery and management of patient medical services at the behavioral healthcare facilities it serves, in accordance with applicable state and federal requirements.',
    'The Sober Connection provides comprehensive medical services across the continuum of behavioral healthcare, including medical detoxification, residential treatment, partial hospitalization, intensive outpatient, and outpatient settings. Its services include physician and advanced practice provider staffing, medical directorship services, provider credentialing, clinical quality assurance, policy development, provider education, and regulatory support.',
    'Dr. Tambini\'s role is focused primarily on organizational medical leadership, clinical governance, quality improvement, provider oversight.',
    'Prior to founding The Sober Connection, Dr. Tambini served as a hospitalist within the Veterans Health Administration, where she gained extensive experience managing medically complex patients and collaborating with multidisciplinary healthcare teams.',
    'Under Dr. Tambini\'s leadership, The Sober Connection has developed a multi-state medical services platform designed to provide behavioral healthcare organizations with consistent, evidence-based, and compliant medical services. The organization supports facilities with qualified medical professionals who evaluate and treat patients, manage medical needs, coordinate care, and provide services within their respective scopes of practice and applicable regulatory requirements.',
    'Dr. Tambini remains focused on advancing standards in addiction medicine and behavioral healthcare through physician leadership, provider education, clinical governance, and the development of systems that promote quality, accountability, continuity of care, and regulatory excellence.',
  ],
  /** Drives the Person schema; both are stated on the source page. */
  boardCertifications: ['Internal Medicine', 'Addiction Medicine'],
};

/** Shown with the team, because all of the above are shared across the Texas facilities. */
/**
 * Written when the roster was four shared directors. It now also covers two case managers and a
 * clinical director who work at this facility, so it says "several of" rather than implying the
 * whole list is shared — which would be inaccurate in the other direction.
 */
export const teamScopeNote =
  'Several of our directors work across our Texas facilities, including our sister location in Dallas.';

// Curated facility gallery — real photos of the Weatherford property.
export type GalleryPhoto = { src: string; caption: string; w: number; h: number };

// Every caption below was checked against the file it points at (FW-14). If you change a
// src, open the image and re-read the caption — the previous set had four captions describing
// a different room than the photo showed.
export const gallery: GalleryPhoto[] = [
  // 15 entries, and the count is load-bearing. Gallery spans tiles 0, 5 and 10 across two
  // columns AND two rows, so those three occupy four grid cells each: 12 x 1 + 3 x 4 = 24,
  // which is exactly six full rows of four. Drop or add one and the last row breaks.
  // Tiles 0, 5 and 10 are therefore the three widest, most establishing shots.
  //
  // The two lounge tiles were swapped 2026-09-21 at the owner's request: the vaulted-ceiling
  // room with the chandelier is the one that reads "light-filled", and the enclosed green-sofa
  // room is the quiet one. Captions kept their grid slots and the photographs moved between
  // them, so the mosaic is unchanged — only the pairing. `w`/`h` travel with their own file
  // because the lightbox passes them to next/image.
  { src: '/images/facility/exterior-front-elevation-through-oaks.jpg', caption: 'The main house under mature oaks', w: 2048, h: 1536 },  // wide tile
  { src: '/images/facility/bedroom-two-beds.jpg', caption: 'A semi-private bedroom', w: 2048, h: 1365 },
  { src: '/images/facility/lounge-vaulted-ceiling-armchairs.jpg', caption: 'Light-filled common areas', w: 2048, h: 1368 },
  { src: '/images/facility/kitchen-double-island.jpg', caption: 'Our on-site kitchen', w: 2048, h: 1368 },
  { src: '/images/facility/entry-hall-french-doors.jpg', caption: 'The front entry hall', w: 2048, h: 1365 },
  { src: '/images/facility/grounds-pool-and-rear-elevation.jpg', caption: 'Outdoor pool & patio', w: 2048, h: 1536 },  // wide tile
  { src: '/images/facility/dining-room-long-table-and-fireplace.jpg', caption: 'Communal dining room', w: 2048, h: 1368 },
  { src: '/images/facility/bathroom-vanity-and-mirror.jpg', caption: 'Resident bathrooms', w: 2048, h: 1365 },
  { src: '/images/facility/lounge-green-sofas-and-macrame.jpg', caption: 'A quiet lounge for downtime', w: 2048, h: 1365 },
  { src: '/images/facility/group-room-long-table.jpg', caption: 'Group therapy & activity room', w: 2048, h: 1368 },
  { src: '/images/facility/exterior-side-elevation-and-terraces.jpg', caption: 'The upper deck & terraced grounds', w: 2048, h: 1536 },  // wide tile
  { src: '/images/facility/grounds-fire-pit-and-rear-elevation.jpg', caption: 'Wooded grounds & fire pit', w: 2048, h: 1536 },
  { src: '/images/facility/recreation-room-ping-pong.jpg', caption: 'Recreation room', w: 2048, h: 1368 },
  { src: '/images/facility/laundry-room-stacked-washer-dryers.jpg', caption: 'On-site laundry service', w: 2048, h: 1368 },
  { src: '/images/facility/grounds-barn-and-sport-court.jpg', caption: 'The barn, sport court & outdoor gym', w: 2048, h: 1536 },
];
