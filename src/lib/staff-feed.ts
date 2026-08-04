/**
 * Staff managed centrally in the Quadrant support portal.
 *
 * The portal is the place non-engineers add and edit bios
 * (support.quadranthealthgroup.com/dev/staff). It mirrors the shared bios document
 * and is the source of truth for prose; this repo stays the source of truth for
 * headshots, which the portal does not carry for the Texas team.
 *
 * `roster()` returns one merged list: the locally curated people first, each enriched
 * with their portal bio, then anyone the portal knows about who is not listed locally.
 * Local wins on name, role, credential and image — the portal only contributes prose
 * and people.
 *
 * Fails soft: a portal outage yields the local list unchanged, never a broken page.
 */

import type { TeamMember } from './site';

const FEED_ORIGIN =
  process.env.STAFF_FEED_ORIGIN ?? 'https://support.quadranthealthgroup.com';

type FeedPerson = {
  name: string;
  title: string;
  credentials: string | null;
  photoUrl: string | null;
  bio: string | null;
};

export type ExtraMember = {
  name: string;
  role: string;
  /** Kept as its own field, not folded into `name`: the team card styles it separately. */
  credential?: string;
  image?: string | null;
  bio?: string;
};

/**
 * Bios withheld from the site, by name key, with the reason.
 *
 * Both defects are in the shared bios document itself and are reproduced verbatim by
 * the portal, so neither is fixable in this repo — they need an edit at
 * support.quadranthealthgroup.com/dev/staff, after which the entry can simply be
 * deleted from this list. The person still appears on the page; only the bio is held.
 *
 * - `jacci westbrook` — the bio names her "Jessica" twice ("Drawing from her own lived
 *   experience, Jessica brings…" / "Jessica is proud to be part of the team…"). A staff
 *   bio that calls the person by someone else's name is not something to publish.
 *
 * - `corney best` — the document heading reads "Corney Best" while all four sentences of
 *   the body read "Cortney", and the portal's `name` field copies the heading. So the
 *   card title and the bio would disagree, in public, about the clinical director's own
 *   name. Whichever spelling is right, they have to match before either goes up.
 */
const BIO_HELD: Record<string, string> = {
  'jacci westbrook': 'bio refers to her as "Jessica"',
  'corney best': 'heading spells it "Corney", the bio body spells it "Cortney"',
};

/** Two-letter monogram for anyone without a headshot. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Loose name key so "Dr. Jane Smith, LPC" and "Jane Smith" match. */
function nameKey(raw: string): string {
  return raw
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, '')
    .replace(/[“”"'’]/g, '')
    .replace(/,.*$/, '')
    .replace(/\s+(sr|jr|ii|iii)\.?$/i, '')
    .replace(/[^a-z ]/gi, '')
    .trim()
    .toLowerCase();
}

function publishableBio(name: string, bio: string | null): string | undefined {
  if (!bio) return undefined;
  if (BIO_HELD[nameKey(name)]) return undefined;
  return bio.trim() || undefined;
}

async function fetchFeed(facility: string): Promise<FeedPerson[]> {
  try {
    const res = await fetch(
      `${FEED_ORIGIN}/api/public/facilities/${encodeURIComponent(facility)}/staff`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { staff?: FeedPerson[] };
    return (data.staff ?? []).filter((p) => p.name);
  } catch {
    return [];
  }
}

/** The team as rendered: curated entries enriched with portal bios, then portal-only people. */
export async function roster(
  facility: string,
  local: readonly TeamMember[],
): Promise<(TeamMember | ExtraMember)[]> {
  const feed = await fetchFeed(facility);
  const byKey = new Map(feed.map((p) => [nameKey(p.name), p]));

  const curated: TeamMember[] = local.map((m) => {
    const match = byKey.get(nameKey(m.name));
    return match ? { ...m, bio: publishableBio(m.name, match.bio) } : m;
  });

  const already = new Set(local.map((m) => nameKey(m.name)));
  const extras: ExtraMember[] = feed
    .filter((p) => !already.has(nameKey(p.name)))
    .map((p) => ({
      name: p.name,
      role: p.title,
      credential: p.credentials ?? undefined,
      image: p.photoUrl ?? null,
      bio: publishableBio(p.name, p.bio),
    }));

  return [...curated, ...extras];
}

/**
 * Split a bio into paragraphs for display.
 *
 * The shared document has these written as three or four proper paragraphs, but the portal
 * stores the field as one flat string — every bio comes back with zero newlines, up to 1,436
 * characters of it. Rendered as-is that is a twenty-line wall of text, which is what made the
 * first attempt at showing bios unreadable.
 *
 * This only ever inserts breaks at sentence boundaries and never alters a character, so the
 * worst case is a paragraph break in a slightly different place than the author chose. If the
 * portal is ever taught to preserve line breaks, delete this and split on `\n\n` instead.
 */
export function bioParagraphs(bio: string): string[] {
  const sentences = bio.match(/[^.!?]+[.!?]+["')\]]*\s*/g);
  if (!sentences) return [bio.trim()];

  const paras: string[] = [];
  let buf = '';
  for (const s of sentences) {
    buf += s;
    // ~320 chars is about three sentences of this prose — enough to hold a thought,
    // short enough to stay scannable.
    if (buf.trim().length >= 320) {
      paras.push(buf.trim());
      buf = '';
    }
  }
  const tail = buf.trim();
  if (tail) {
    // Avoid orphaning a single trailing sentence as its own paragraph.
    if (paras.length && tail.length < 140) paras[paras.length - 1] += ' ' + tail;
    else paras.push(tail);
  }
  return paras;
}
