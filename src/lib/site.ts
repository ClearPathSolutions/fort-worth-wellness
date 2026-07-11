// ============================================================================
// Fort Worth Wellness Center — single source of truth for site-wide data.
// Change contact details, nav, services, etc. here and it updates everywhere.
// ============================================================================

export const site = {
  name: 'Fort Worth Wellness Center',
  shortName: 'Fort Worth Wellness',
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
} as const;

export type NavChild = { label: string; href: string; blurb?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Who We Are', href: '/about-us' },
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
        href: '/treatment/aftercare-planning',
        blurb: 'Lifelong support after your stay.',
      },
    ],
  },
  { label: 'Who We Help', href: '/who-we-help' },
  { label: 'Tour', href: '/tour' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Contact', href: '/contact-us' },
];

// Insurance carriers (white SVG logos, shown on a dark band)
export const insurers = [
  { name: 'Anthem', file: 'anthem.svg' },
  { name: 'Blue Cross Blue Shield', file: 'bluecross.svg' },
  { name: 'Beacon Health Options', file: 'beacon.svg' },
  { name: 'ComPsych', file: 'compsych.svg' },
  { name: 'Magellan Health', file: 'magellan.svg' },
  { name: 'MultiPlan', file: 'multiplan.svg' },
  { name: 'Three Rivers', file: 'threerivers.svg' },
  { name: 'ValueOptions', file: 'valueoptions.svg' },
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
    image: '/images/facility/dsc05028.jpg',
  },
  {
    slug: 'mental-health-residential',
    href: '/treatment/mental-health-residential',
    title: 'Mental Health Residential',
    short: 'Residential',
    blurb:
      'Intensive, live-in psychiatric care for depression, anxiety, trauma, and mood disorders in a restorative home-like sanctuary.',
    image: '/images/facility/dsc09517.jpg',
  },
  {
    slug: 'dual-diagnosis',
    href: '/treatment/dual-diagnosis',
    title: 'Dual Diagnosis',
    short: 'Dual Diagnosis',
    blurb:
      'Integrated care that treats mental health conditions and co-occurring substance use at the same time, addressing the root cause.',
    image: '/images/facility/dsc05010.jpg',
  },
  {
    slug: 'aftercare-planning',
    href: '/treatment/aftercare-planning',
    title: 'Aftercare & Alumni',
    short: 'Aftercare',
    blurb:
      'A structured step-down plan and a lifelong alumni community to help you carry your progress home and keep it.',
    image: '/images/facility/dsc05075.jpg',
  },
];

export type TeamMember = {
  name: string;
  role: string;
  image?: string;
};

export const team: TeamMember[] = [
  { name: 'Olivia Hadjerioua', role: 'Executive Director', image: '/images/team/olivia-hadjerioua.png' },
  { name: 'Antoine Gross Sr.', role: 'Director of Clinical Services' },
  { name: 'Deborah Wade', role: 'Director of Nursing' },
  { name: 'Joshua Leder', role: 'Director of Operations', image: '/images/team/joshua-leder.png' },
  { name: 'Haley Wadlington', role: 'Director of Client Care', image: '/images/team/haley-wadlington.png' },
];

// Curated facility gallery — real photos of the Weatherford estate.
export type GalleryPhoto = { src: string; caption: string; w: number; h: number };

export const gallery: GalleryPhoto[] = [
  { src: '/images/facility/dji0577.jpg', caption: 'Our private wooded estate', w: 2000, h: 1125 },
  { src: '/images/facility/dsc05028.jpg', caption: 'Private resident suites', w: 2000, h: 1335 },
  { src: '/images/facility/dsc09517.jpg', caption: 'Group therapy & activity room', w: 2000, h: 1333 },
  { src: '/images/facility/dsc09533.jpg', caption: 'Resort-style pool & patio', w: 2000, h: 1333 },
  { src: '/images/facility/dsc04980.jpg', caption: 'Chef-prepared nutrition', w: 2000, h: 1333 },
  { src: '/images/facility/dsc05075.jpg', caption: 'The Cedar Creek Barn', w: 2000, h: 1333 },
  { src: '/images/facility/dsc05010.jpg', caption: 'Calm clinical care spaces', w: 2000, h: 1333 },
  { src: '/images/facility/dsc09523.jpg', caption: 'Modern private baths', w: 2000, h: 1333 },
  { src: '/images/facility/dsc09536.jpg', caption: 'Light-filled common areas', w: 2000, h: 1333 },
  { src: '/images/facility/dsc05013.jpg', caption: 'Restful living spaces', w: 2000, h: 1335 },
  { src: '/images/facility/dsc05061.jpg', caption: 'Room to breathe', w: 2000, h: 1335 },
  { src: '/images/facility/dji0584.jpg', caption: 'Serene outdoor grounds', w: 2000, h: 1125 },
];
