/**
 * Campaign attribution + CallTrackingMetrics identity.
 *
 * Why this file exists (FW-46). Every lead reached Clarion correctly, and every lead was
 * unattributed. Two independent faults, both silent:
 *
 *  1. **The campaign was read at submit time from `location.search`.** Clarion's
 *     `forms-capture.v1.js` builds its own payload and takes `utm_*` and `gclid` from the
 *     *current* URL. Land on an ad, read two pages, then submit, and the query string is long
 *     gone — the lead files as direct traffic. The vendor script persists `landing_page_url`
 *     and `referrer` (sessionStorage) but *not* the campaign, so the record looks populated.
 *     That is the worst shape for a bug like this: paid spend that appears to convert at zero.
 *  2. **`/api/lead` sent `utm: null, gclid: null, referrer: null` and no CTM id at all** —
 *     hardcoded. Anything that fell back to the server route was unattributable by construction.
 *
 * The approach here is deliberately **not** the URL-rewriting shim (restore the campaign into
 * `location.search` on later pageviews so the vendor script finds it). That shim is less code,
 * but on this site it would stamp a persistent ad-click id onto internal URLs such as
 * `/treatment/dual-diagnosis` — and GTM and CTM are both on the page reading `location.href`.
 * Joining a click identifier to a treatment-page path inside two third-party tools is exactly
 * the pattern behind the HHS OCR tracking-technologies bulletin; see the note beside
 * `analytics` in `lib/site.ts`, which is already explicit that the *path* is the sensitive part
 * of this site. So attribution is carried in the submission payload instead, where it goes to
 * one recipient and never lands in a URL.
 *
 * Storage is `localStorage`, not `sessionStorage`: a second tab is the same visit, and a
 * campaign click needs to outlive the tab it arrived in.
 *
 * The CTM id is the one thing here that is NOT cached by us — see `ctmSessionId()`.
 */

/** Click identifiers worth keeping. `wbraid`/`gbraid` matter — see `getAttribution()`. */
const CAMPAIGN_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
  'msclkid',
] as const;

const CAMPAIGN_KEY = 'fww.attribution.campaign.v1';
const VISIT_KEY = 'fww.attribution.visit.v1';

/** Standard click window. A campaign touch stays creditable for 30 days. */
const CAMPAIGN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** A visit ends after 30 minutes of inactivity — the usual analytics convention. */
const VISIT_IDLE_MS = 30 * 60 * 1000;

type Touch = {
  /** Raw click params exactly as they appeared in the URL. */
  p: Record<string, string>;
  /** The page the campaign actually landed on, not wherever the form happens to be. */
  landing: string;
  /** External referrer only; an internal page is never a referrer. */
  referrer: string;
  /** Epoch ms of the touch. */
  at: number;
};

type Visit = { landing: string; referrer: string; at: number };

/*
 * Storage helpers. Every access is wrapped: `localStorage` throws outright in Safari private
 * mode and when a browser is set to block site data, and an exception here would take the
 * whole form down with it. Attribution is worth having, never worth a lost lead.
 */
function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage disabled — proceed unattributed rather than throwing */
  }
}

/** The referrer, but only when it came from off-site. */
function externalReferrer(): string {
  try {
    const ref = document.referrer || '';
    return ref && ref.indexOf(location.origin) !== 0 ? ref : '';
  } catch {
    return '';
  }
}

/** Click params present in the current URL. */
function paramsInUrl(): Record<string, string> {
  const found: Record<string, string> = {};
  try {
    const qs = new URLSearchParams(location.search);
    for (const key of CAMPAIGN_KEYS) {
      const value = qs.get(key);
      if (value) found[key] = value;
    }
  } catch {
    /* malformed query string */
  }
  return found;
}

/**
 * Record this pageview. Safe to call on every route change — it is idempotent within a visit.
 *
 * Must run on **every** page, not only pages that host a form. A visitor can land on
 * `/treatment/detox?gclid=…`, click through to `/contact`, and submit there; by then the query
 * string is gone, so if capture only happened where a form is mounted the campaign would
 * already be lost. `AttributionTracker` in the root layout is what guarantees this.
 */
export function recordPageview(): void {
  const now = Date.now();
  const found = paramsInUrl();

  if (Object.keys(found).length > 0) {
    // A fresh click always wins. This is a new campaign touch, not a continuation of an older
    // one, so last-click beats first-click here — which is also how the ad platforms count it.
    writeJson(CAMPAIGN_KEY, {
      p: found,
      landing: location.href,
      referrer: externalReferrer(),
      at: now,
    } satisfies Touch);
  }

  // Visit entry point, for the organic case where there is no campaign to borrow a landing
  // page from. Refreshed on each pageview so the idle window tracks activity, not first paint.
  const visit = readJson<Visit>(VISIT_KEY);
  if (!visit || now - visit.at > VISIT_IDLE_MS) {
    writeJson(VISIT_KEY, { landing: location.href, referrer: externalReferrer(), at: now });
  } else {
    writeJson(VISIT_KEY, { ...visit, at: now });
  }
}

export type Attribution = {
  page_url: string;
  landing_page_url: string;
  referrer: string | null;
  utm: Record<string, string> | null;
  gclid: string | null;
  /**
   * Non-Google click ids, kept out of the envelope on purpose — see `getAttribution()`. The
   * caller folds these into the form's own `data` map rather than into `utm`.
   */
  clickIds: Record<string, string>;
};

/**
 * The attribution to send with a submission.
 *
 * `utm` is un-prefixed (`source`, `medium`, …) because that is the shape Clarion's own payload
 * uses, and `gclid` falls back to `wbraid`/`gbraid` — Google's substitutes when a click cannot
 * be tied to a cookie (iOS ATT, consent mode). CTM account 264810's routing rules key on all
 * three, so a wbraid click that we dropped would be attributed by CTM and invisible in Clarion.
 */
export function getAttribution(): Attribution {
  const stored = readJson<Touch>(CAMPAIGN_KEY);
  const campaign = stored && Date.now() - stored.at < CAMPAIGN_TTL_MS ? stored : null;
  const visit = readJson<Visit>(VISIT_KEY);
  const params = campaign?.p ?? {};

  // Exactly the five canonical fields, and no more. Clarion's own `forms-capture.v1.js` sends
  // only these, so they are the only keys the endpoint is known to accept here — and this route
  // never retries a 4xx, so an unrecognised key would not cost attribution, it would cost the
  // lead. Extra click ids travel in `clickIds` instead, where the payload is free-form.
  const utm: Record<string, string> = {};
  for (const field of ['source', 'medium', 'campaign', 'term', 'content'] as const) {
    const value = params[`utm_${field}`];
    if (value) utm[field] = value;
  }

  // Meta and Microsoft clicks have no sanctioned slot in the envelope, but dropping them would
  // leave those campaigns permanently unattributable.
  const clickIds: Record<string, string> = {};
  for (const field of ['fbclid', 'msclkid'] as const) {
    if (params[field]) clickIds[field] = params[field];
  }

  // Prefer the campaign's own landing page: it is the page the money bought. Fall back to this
  // visit's entry page for organic traffic, and only then to wherever we are standing.
  const landing = campaign?.landing || visit?.landing || location.href;
  const referrer = campaign?.referrer || visit?.referrer || externalReferrer();

  return {
    page_url: location.href,
    landing_page_url: landing,
    referrer: referrer || null,
    utm: Object.keys(utm).length > 0 ? utm : null,
    gclid: params.gclid || params.wbraid || params.gbraid || null,
    clickIds,
  };
}

/**
 * CallTrackingMetrics' visitor session id — 24 hex characters, no dashes.
 *
 * This is what lets CTM file a form submission against the visit (and therefore the ad click,
 * and therefore the call) that produced it. Clarion reads it from a **flat, top-level**
 * `ctm_visitor_sid`; nested anywhere it is silently ignored.
 *
 * Two rules, both learned the hard way:
 *
 *  - **Never substitute another id.** A UUID from some other session store is not CTM's and
 *    attaches the lead to nothing while looking populated. `null` is the correct answer when
 *    CTM's id is genuinely unavailable.
 *  - **Never cache it ourselves.** CTM already persists it: `__ctmid` is a first-party cookie
 *    with a 30-day lifetime, and `t.js` reconciles `__ctm.config.sid` against it on load. A copy
 *    of ours in `sessionStorage` could only ever be staler, and would not survive the second tab
 *    that the cookie handles fine.
 */
const CTM_ID = /^[0-9a-f]{24}$/i;

export function ctmSessionId(): string | null {
  let fromConfig: string | null = null;
  try {
    const config = (window as unknown as { __ctm?: { config?: { sid?: string } } }).__ctm?.config;
    fromConfig = config?.sid ? String(config.sid) : null;
  } catch {
    /* t.js absent or blocked */
  }

  let fromCookie: string | null = null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)__ctmid=([^;]*)/);
    fromCookie = match ? decodeURIComponent(match[1]) : null;
  } catch {
    /* cookies unavailable */
  }

  if (CTM_ID.test(fromConfig || '')) return fromConfig;
  if (CTM_ID.test(fromCookie || '')) return fromCookie;
  return null;
}

/**
 * The id, waiting briefly for `t.js` if it has not landed yet.
 *
 * `t.js` is loaded `afterInteractive`, so on a fast submit it can still be in flight. A human
 * filling this form takes far longer than that, and a returning visitor already has the
 * `__ctmid` cookie — so the wait almost never runs. It exists for the case where it would
 * otherwise cost the attribution outright, and it is capped tight: the alternative to waiting
 * one second is an unattributed lead, but the alternative to *bounding* the wait is a visitor
 * staring at a stalled button, and the lead matters more than the attribution.
 */
export async function ctmSessionIdWhenReady(timeoutMs = 1000): Promise<string | null> {
  const immediate = ctmSessionId();
  if (immediate) return immediate;

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const sid = ctmSessionId();
    if (sid) return sid;
  }
  return null;
}
