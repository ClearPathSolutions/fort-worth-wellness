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
 * First-name corrections applied inside a person's own bio.
 *
 * Both of these bios were previously withheld from the site entirely, because each one called
 * its subject by a different name than the card above it. That was the safe call while the
 * correct spelling was genuinely unknown. It no longer is: the owner supplied a written staff
 * list naming both people, which is the authoritative source for how each name is spelled.
 *
 * - `jacci westbrook` — her bio refers to "Jessica" twice. The owner's list reads
 *   "Jacci Westbrook", so those are simply the wrong name.
 *
 * There used to be a second rule here rewriting "Cortney" to "Corney" in the clinical director's
 * bio, on the strength of the owner's first staff list. He has since corrected himself: she is
 * Cortney. Her bio body already said Cortney in all four sentences, so that rule was not fixing
 * a bio — it was corrupting a correct one into the typo, on every render. Deleted outright
 * rather than reversed, because there is now nothing in her bio to correct.
 *
 * The lesson worth keeping: a rule like this is only ever as good as the source it trusts, and
 * it fails silently and confidently when that source is wrong.
 *
 * Deliberately narrow. Each rule only ever rewrites the subject's own first name, inside their
 * own bio, as a whole word — never a surname, never anyone else's name, never any other prose.
 * The bio is otherwise published exactly as the portal returns it.
 *
 * This is a correction at the point of display, not at the source. The shared bios document
 * still has the wrong spellings, so anything else generated from it will still be wrong, and
 * any re-import would reintroduce them here. Worth fixing properly at
 * support.quadranthealthgroup.com/dev/staff — after which these rules become no-ops and can be
 * deleted.
 */
const BIO_NAME_FIX: Record<string, { wrong: RegExp; right: string }> = {
  'jacci westbrook': { wrong: /\bJessica\b/g, right: 'Jacci' },
};

/**
 * Spelling variants that must collapse to one person.
 *
 * `nameKey` is the ONLY thing joining a curated entry to its portal bio, and a miss does not
 * degrade quietly — `roster()` treats an unmatched feed entry as a portal-only person and
 * appends it, so the page renders the same human twice, once with a headshot and once without.
 *
 * The portal still calls the clinical director "Corney Best" while this repo now correctly calls
 * her "Cortney Best", which is exactly that miss. Aliasing the portal's spelling onto ours keeps
 * them one record. Delete the entry once the portal is corrected — it becomes a no-op, though a
 * harmless one.
 */
const NAME_ALIASES: Record<string, string> = {
  'corney best': 'cortney best',
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
  const k = raw
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, '')
    .replace(/[“”"'’]/g, '')
    .replace(/,.*$/, '')
    .replace(/\s+(sr|jr|ii|iii)\.?$/i, '')
    .replace(/[^a-z ]/gi, '')
    .trim()
    .toLowerCase();
  return NAME_ALIASES[k] ?? k;
}

function publishableBio(name: string, bio: string | null): string | undefined {
  if (!bio) return undefined;
  const fix = BIO_NAME_FIX[nameKey(name)];
  const text = (fix ? bio.replace(fix.wrong, fix.right) : bio).trim();
  return text || undefined;
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
    // `?? m.bio` matters: the portal wins when it HAS prose, but adding someone to the portal
    // with the bio field left blank would otherwise silently delete the copy written here.
    // Landon and Jacob are both in that position right now — curated bio, no portal entry yet.
    return match ? { ...m, bio: publishableBio(m.name, match.bio) ?? m.bio } : m;
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
  // A bio authored in this repo carries real paragraph breaks, so use the author's own
  // paragraphing and do not touch it. The sentence-chunking below exists only for the portal,
  // which flattens every bio to a single line — this is the `\n\n` case its own comment
  // anticipated. Guarded on `> 1` so a flat portal string still falls through.
  const authored = bio.split(/\n{2,}/).map((t) => t.trim()).filter(Boolean);
  if (authored.length > 1) return authored;

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
