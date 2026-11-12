import Link from 'next/link';
import type { Byline, BylinePerson } from '@/lib/byline';
import { editorialPolicyServed, EDITORIAL_POLICY_PATH } from '@/lib/editorial';

/** Date-only and UTC, so "2026-09-30" can't render as the 29th in US time zones. */
function formatDay(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function Name({ person, rel }: { person: BylinePerson; rel?: string }) {
  const label = person.credentials ? `${person.name}, ${person.credentials}` : person.name;
  // A CMS-supplied author with no bio page on this site is shown unlinked rather than as a 404.
  return person.bioPath ? (
    <Link href={person.bioPath} rel={rel}>
      {label}
    </Link>
  ) : (
    <span className="font-semibold">{label}</span>
  );
}

/**
 * Article byline, from the package's templates/article-byline.html. Sits directly under the
 * post's H1. "Written by" renders only for a real author. The "Medically reviewed by" line renders
 * on every post: `getByline()` always resolves a reviewer (the post's own, any missing field
 * filled from the site default), at the client's request. "Last reviewed" shows only with a real
 * date. Posts carry no modified date, so the template's "Updated" item is omitted.
 */
export default function ArticleByline({ byline }: { byline: Byline }) {
  const { author, reviewer, lastReviewed } = byline;
  const meta = [
    lastReviewed && (
      <span key="reviewed">
        Last reviewed <time dateTime={lastReviewed}>{formatDay(lastReviewed)}</time>
      </span>
    ),
    // Linked only where the policy is served, so production never links a 404.
    editorialPolicyServed && (
      <Link key="policy" href={EDITORIAL_POLICY_PATH}>
        Editorial policy
      </Link>
    ),
  ].filter(Boolean);

  return (
    <div className="article-byline">
      {author && (
        <p className="byline-line">
          Written by <Name person={author} rel="author" />
        </p>
      )}
      <p className="byline-line">
        Medically reviewed by{' '}
        {reviewer.internal && reviewer.href ? (
          // A profile on this site: an ordinary same-tab internal link.
          <Link href={reviewer.href}>{reviewer.name}</Link>
        ) : reviewer.href ? (
          <a href={reviewer.href} target="_blank" rel="noopener noreferrer">
            {reviewer.name}
          </a>
        ) : (
          <span className="font-semibold">{reviewer.name}</span>
        )}
        {reviewer.credentials ? `, ${reviewer.credentials}` : ''}
      </p>
      {meta.length > 0 && (
        <p className="byline-meta">{meta.flatMap((m, i) => (i === 0 ? [m] : [' · ', m]))}</p>
      )}
    </div>
  );
}
