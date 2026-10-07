import { readFileSync } from 'node:fs';
import path from 'node:path';
import { editorial, editorialPolicyReady } from './editorial';

/** "2026-09-30" -> "September 2026". */
function monthYear(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * The policy body, read at build time from `src/data/editorial-policy.html` — an unedited copy
 * of the package's `templates/editorial-policy.html`. When the master copy changes, replace that
 * file wholesale; never hand-edit it. Server-only (reads the file system); the page that calls
 * it is statically generated.
 *
 * A merge field that is still blank renders as a visible `[FIELD not yet set]` marker in
 * preview builds, so reviewers see the gap without a raw `{{` reaching any rendered page.
 * Production never renders the page until every field is set (see `lib/editorial.ts`).
 */
export function editorialPolicyBody(): string {
  const file = path.join(process.cwd(), 'src/data/editorial-policy.html');
  const fields: Record<string, string> = {
    FACILITY_NAME: editorial.facilityName,
    DOMAIN: editorial.domain,
    EDITORIAL_EMAIL: editorial.editorialEmail,
    PHONE: editorial.phone,
    PHONE_TEL: editorial.phoneTel,
    LAST_REVIEWED: editorial.lastReviewed && monthYear(editorial.lastReviewed),
  };

  const html = readFileSync(file, 'utf8')
    // The header comment is dev notes, not page content.
    .replace(/<!--[\s\S]*?-->/g, '')
    // The page header renders the page's single H1.
    .replace(/<h1>[\s\S]*?<\/h1>/, '')
    .replace(/\{\{([A-Z_]+)\}\}/g, (token, name: string) => {
      if (fields[name]) return escapeHtml(fields[name]);
      // Known but blank: a preview-only marker. Unknown tokens stay as-is and fail below.
      return name in fields ? `<mark class="merge-missing">[${name} not yet set]</mark>` : token;
    })
    .trim();

  if (editorialPolicyReady && (html.includes('{{') || html.includes('merge-missing'))) {
    // README: "No placeholder text in production ... Any hit blocks launch." Fail the build.
    throw new Error(
      `Editorial policy still contains a placeholder: ${html.match(/\{\{[^}]*\}\}|\[[A-Z_]+ not yet set\]/)?.[0]}`,
    );
  }

  return html;
}
