/**
 * Staff managed centrally in the Quadrant support portal.
 *
 * The portal is the place non-engineers add and edit bios
 * (support.quadranthealthgroup.com/dev/staff). This helper returns only the
 * people who are NOT already listed locally, so the hand-curated entries here —
 * which have headshots — stay exactly as they are and remain the source of
 * truth for anyone appearing in both places.
 *
 * Fails soft: a portal outage yields an empty list, never a broken page.
 */

const FEED_ORIGIN =
  process.env.STAFF_FEED_ORIGIN ?? 'https://support.quadranthealthgroup.com';

type FeedPerson = {
  name: string;
  title: string;
  credentials: string | null;
  photoUrl: string | null;
};

export type ExtraMember = {
  name: string;
  role: string;
  /** Kept as its own field, not folded into `name`: the team card styles it separately. */
  credential?: string;
  image?: string | null;
};

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

export async function extraStaff(
  facility: string,
  local: readonly { name: string }[],
): Promise<ExtraMember[]> {
  try {
    const res = await fetch(
      `${FEED_ORIGIN}/api/public/facilities/${encodeURIComponent(facility)}/staff`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { staff?: FeedPerson[] };
    const already = new Set(local.map((m) => nameKey(m.name)));
    return (data.staff ?? [])
      .filter((p) => p.name && !already.has(nameKey(p.name)))
      .map((p) => ({
        name: p.name,
        role: p.title,
        credential: p.credentials ?? undefined,
        image: p.photoUrl ?? null,
      }));
  } catch {
    return [];
  }
}
