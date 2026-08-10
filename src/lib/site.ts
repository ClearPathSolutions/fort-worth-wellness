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
        label: 'Mental Health Residential',
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
    slug: 'mental-health-residential',
    href: '/treatment/mental-health-residential',
    title: 'Mental Health Residential',
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
 * **Fort Worth's actual clinical director is still missing**, deliberately. The bios document
 * spells her name "Cortney" Best four times in the body and "Corney" Best once in the heading, and a
 * clinical director's name is not something to guess. Add her — with `credential: 'M.C.J., LCDC'` —
 * as soon as the spelling is confirmed.
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
  // No credential: the client's staff list gives one for Deborah (BSN, RN) and Corney
  // (M.C.J., LCDC) and deliberately none for Olivia, so the LPC that used to sit here is gone.
  {
    name: 'Olivia Hadjerioua',
    role: 'Executive Director',
    image: '/images/team/olivia-hadjerioua.png',
  },
  { name: 'Deborah Wade', role: 'Director of Nursing', credential: 'BSN, RN' },
  { name: 'Joshua Leder', role: 'Director of Operations', image: '/images/team/joshua-leder.png' },
  {
    name: 'Haley Wadlington',
    role: 'Director of Client Care',
    image: '/images/team/haley-wadlington.png',
  },
];

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
  { src: '/images/facility/exterior-front-elevation-through-oaks.jpg', caption: 'The main house under mature oaks', w: 2048, h: 1536 },  // wide tile
  { src: '/images/facility/bedroom-two-beds.jpg', caption: 'A semi-private bedroom', w: 2048, h: 1365 },
  { src: '/images/facility/lounge-green-sofas-and-macrame.jpg', caption: 'Light-filled common areas', w: 2048, h: 1365 },
  { src: '/images/facility/kitchen-double-island.jpg', caption: 'Our on-site kitchen', w: 2048, h: 1368 },
  { src: '/images/facility/entry-hall-french-doors.jpg', caption: 'The front entry hall', w: 2048, h: 1365 },
  { src: '/images/facility/grounds-pool-and-rear-elevation.jpg', caption: 'Outdoor pool & patio', w: 2048, h: 1536 },  // wide tile
  { src: '/images/facility/dining-room-long-table-and-fireplace.jpg', caption: 'Communal dining room', w: 2048, h: 1368 },
  { src: '/images/facility/bathroom-vanity-and-mirror.jpg', caption: 'Resident bathrooms', w: 2048, h: 1365 },
  { src: '/images/facility/lounge-vaulted-ceiling-armchairs.jpg', caption: 'A quiet lounge for downtime', w: 2048, h: 1368 },
  { src: '/images/facility/group-room-long-table.jpg', caption: 'Group therapy & activity room', w: 2048, h: 1368 },
  { src: '/images/facility/exterior-side-elevation-and-terraces.jpg', caption: 'The upper deck & terraced grounds', w: 2048, h: 1536 },  // wide tile
  { src: '/images/facility/grounds-fire-pit-and-rear-elevation.jpg', caption: 'Wooded grounds & fire pit', w: 2048, h: 1536 },
  { src: '/images/facility/recreation-room-ping-pong.jpg', caption: 'Recreation room', w: 2048, h: 1368 },
  { src: '/images/facility/laundry-room-stacked-washer-dryers.jpg', caption: 'On-site laundry service', w: 2048, h: 1368 },
  { src: '/images/facility/grounds-barn-and-sport-court.jpg', caption: 'The barn, sport court & outdoor gym', w: 2048, h: 1536 },
];
