# Fort Worth Wellness Center — Open Issues

**Scope: this website only** (`fortworthwellness.org` / `fort-worth-wellness.vercel.app`).
Issues belonging to the other 11 QHG properties have been deliberately excluded — see
[Appendix A](#appendix-a--checked-and-excluded) for what was removed and why.

**Sources**

| Source | What it covers |
|---|---|
| `QHG-Vercel-Build-Issues.xlsx` (audited 2026-07-28) | Crawl-level: SEO, site architecture, internal links, slugs. Rows carry `Vxxxx` IDs. |
| Code & UX audit of this repo (2026-08-03) | Code-level: API/security, accessibility, layout, content integrity. Rows carry `FW-xx` IDs. |
| `Faclility Bios.docx` (rev. 2026-08-03) | Staff names, roles and credentials across all 12 facilities. Source for [FW-36](#fw-36), [FW-37](#fw-37), and new evidence on [V0108](#v0108). |
| Media audit of this repo (2026-08-03) | Every one of the 91 media files opened and identified by content. Full inventory and correct naming in [Section E](#media-inventory). |

The first two overlap on only four items (canonicals, privacy `nofollow`, Dallas slugs,
verify-insurance), so they are complementary rather than redundant. Overlaps are cross-referenced,
not double-counted.

> **On the bios document.** Two copies exist in `~/Downloads`: `Faclility Bios .pdf` (2026-07-27) and
> `Faclility Bios.docx` (2026-08-03). The Fort Worth sections are **identical** — same three staff,
> same two errors. The docx is the later revision (bios added elsewhere in the portfolio); nothing
> was dropped. Neither file contains **any images**, so it does not resolve [FW-15](#fw-15).

**Verification.** Every tracker claim below was re-checked against the code on this branch rather
than taken from the 2026-07-28 snapshot. Results are noted per issue. Two findings reproduced
*exactly*: the broken-link inventory (13 targets / 47 instances) and V0040 (42 pages missing
`og:url`). Anything I could not verify from the repo — production server behaviour, Google Business
Profile — is marked **`needs external check`**.

<a id="review-pass"></a>
**Independent review pass — 2026-08-03.** The completed work was re-verified end to end: typecheck,
lint and build clean; all 18 routes 200; all 58 image references resolve; every internal `href` and
all 9 distinct in-body blog links resolve with zero redirect hops; canonicals and `og:url` present
and slash-consistent on every page; redirects one hop from the slashed (production-canonical) form.
FW-05, FW-06, FW-07, FW-08, FW-09, FW-11, FW-14, FW-19, FW-23, FW-32, FW-41 confirmed fixed by
direct measurement.

Five defects found and corrected in that pass:

| # | Defect | Fix |
|---|---|---|
| R1 | `LeadForm` posted to `/api/lead` — `trailingSlash: true` 308s it, adding a round trip to every form submission | now posts `/api/lead/` |
| R2 | **[FW-40](#fw-40) hero swap was missed on `/who-we-help`** — still the fire pit full of dead leaves on bare dirt, and the page had no interior image at all | now `great-room-dining-and-lounge.jpg` |
| R3 | `og:image` emitted `/opengraph-image` (slashless), handing every social crawler a 308 | now `/opengraph-image/`, served directly |
| R4 | `hasOfferCatalog` URLs in `organizationSchema()` lacked trailing slashes, so all four cited redirecting URLs — `breadcrumbSchema()` normalised correctly, the two had drifted | shared `absUrl()` helper, both now consistent |
| R5 | `services[].slug` for aftercare still read `aftercare-planning` after the rename | now `aftercare` |
| R6 | `group-room-folding-tables.jpg` was the hero on **three** pages, and `/treatment/dual-diagnosis` led with a staff desk area showing a fire-alarm panel | four heroes reassigned; **all 11 page heroes are now unique** |

**R6 in detail.** Completes [FW-40](#fw-40) — it promoted images into the gallery and CTA band but
left the page heroes largely as they were.

| Page | Was | Now | Why |
|---|---|---|---|
| `/who-we-help` | fire pit, dead leaves, bare dirt | `great-room-dining-and-lounge` | page had no interior at all |
| `/admissions` | `group-room-folding-tables` | `corridor-seating-nook` | arrival and being received, not a group room |
| `/treatment/mental-health-residential` | `group-room-folding-tables` | `bedroom-bright-two-beds-main-house` | residential care should show where you live |
| `/treatment/dual-diagnosis` | `nurses-station-staff-desks` | `lounge-barn-upstairs-open` | staff desk + fire-alarm panel is not a hero |

`/treatment` keeps `group-room-folding-tables` — a group therapy room is the right single home for it
on the programs overview. Each replacement was checked at hero crop, not just swapped: the first
choice for the residential page (`bedroom-barn-upstairs-two-beds`) cropped to a desk and TV with the
beds cut off, so it was changed again.

The four **service card** images were deliberately left alone: as a set they read as
bedroom / group room / clinical station / exterior, which is well differentiated in a four-card row,
and a clinical station suits dual diagnosis at card size where it does not at hero size.

One consequence worth tracking: consolidating FAQs into `/faq` put the two uncorroborated
psychiatric-staffing claims ([FW-37](#fw-37)) on a **second** URL. `src/lib/faqs.ts` is the single
place to correct them if that comes back unconfirmed.

**Totals (updated 2026-08-03, after step 1)**

| | Count |
|---|---|
| Tracked issues | **62** — was 59; FW-43/FW-44 found in step 1, FW-45 answering V0096. **FW-46 + FW-47 raised and withdrawn** (wrong domain) and are not counted |
| Fixed | **59** — steps 1, 3, 4, 5 complete, 4 unbundled from blocked steps, plus FW-02 / V0095 / V0097 / V0098 / V0096 / V0099 / FW-22 / FW-45 / FW-36 & FW-15 (both partial) |
| Open | **3** |
| Blocked on one decision | 0 — [V0108](#v0108) is settled |
| Owner decisions outstanding | **none** — all 11 answered. Remaining work needs counsel, production access, real reviews, or a content commission |

**Steps 1, 4 and 5 are complete.** Every remaining step is blocked by this document's own
sequencing, not by available effort:

| Step | Status | Blocker |
|---|---|---|
| 0 | ⏳ | send [the questions](#outstanding-questions) |
| 1 | ✅ complete | — |
| 2 | ⏳ in progress | 10 owner decisions — **FW-02 and the slug rename answered and shipped**; 7 to go |
| 3 | ✅ complete | unblocked by the slug decision; 20 of 47 broken links fixed |
| 4 | ✅ complete | — |
| 5 | ✅ complete | FW-28 and FW-30 partial, residuals named above |
| 6 | ✅ substantially complete | V0108 answered; V0105 + V0038 remain as content decisions |
| 7 | 🔒 blocked | facility, counsel, or production access |

### Four items were unbundled from blocked steps and completed

On review, four issues sitting in steps 2/6/7 turned out to bundle a **factual correction** (doable
now) with a **judgment call** (genuinely the owner's). The blocker was the bundling, not a real
dependency. All four are done:

- **[FW-39](#fw-39)** — step 7 only because it was grouped "same pass" as the FW-13 photo shoot. The
  rename needs no photography: all 32 correct names were already specified in [E1](#media-inventory).
  Parsed the mapping straight out of this document rather than retyping it, `git mv`'d all 32, and
  rewrote 53 references across 16 source files. Verified: 0 camera-serial names left in the build,
  0 references to a non-existent file. Blog images untouched.
- **[FW-24](#fw-24)** — step 6, bundled into blog remediation as "one job". Its fix does not depend
  on [V0108](#v0108) at all, and it cannot become wasted work: if path B prunes those posts, the fix
  goes with them. Fixed now because the links are actively harmful today — see the entry.
- **[FW-17](#fw-17)** — investigating it changed the diagnosis; see the entry. Not deferrable once
  understood.
- **[FW-16](#fw-16)** — the *inaccuracy* is a fact with one right answer. The brand-framing half
  stays in step 2.

Separately, [section F](#fixed-on-this-branch)'s three `FW-F*` fixes predate step 1 and are not part
of the 61.

> **Step 1 is complete.** See the [step 1 section](#recommended-sequence) for what changed per issue,
> and "Not done in step 1, and why" for the three page heroes that rolled into [FW-13](#fw-13).
> Nothing has been committed — everything is uncommitted working-tree changes on `changes`.
>
> Two counts in this document were wrong and are corrected in place: step 1's heading said 16 items
> and listed 18; [FW-29](#fw-29) said four over-length titles and there were six. Both were heading
> miscounts, not missing items — the 59→61 invariant holds.

---

## Priority summary

| # | Issue | Source |
|---|---|---|
| 1 | [FW-01 Vercel API token in plaintext](#fw-01) | code audit |
| 2 | [FW-02 Leads can be silently lost](#fw-02) | code audit |
| 3 | [FW-36 We credit Dallas's clinical director as ours](#fw-36) | bios doc |
| 4 | [FW-37 Psychiatric-staffing claims not corroborated](#fw-37) | bios doc |
| 5 | [V0108 Is this site mental-health-first? — blocks 5 issues](#v0108) | tracker + bios doc |
| 6 | [V0039 Canonical tag missing on all 55 pages](#v0039) | tracker |
| 7 | [FW-05 Mobile call bar hides the 988 crisis line](#fw-05) | code audit |
| 8 | [V0024–V0036 47 broken internal links](#broken-links) | tracker |
| 9 | [FW-40 Best photos unused; back-of-house used as page heroes](#fw-40) | media audit |
| 10 | [FW-13 Photography contradicts the premium copy](#fw-13) | code audit |
| 11 | [FW-15 Team headshots appear AI-generated](#fw-15) | code audit |

<a id="outstanding-questions"></a>
### Questions outstanding with the facility

Seven items are blocked on someone with facility access. Worth asking together, in one message.

1. **Clinical scope** — is this site mental-health-first, or substance-use-led? Gates [V0108](#v0108)
   and five issues under it.
2. **Name spelling** — "Cortney" or "Corney" Best? The bios document says both. See [FW-36](#fw-36).
3. **Jacci Westbrook's bio** — it refers to "Jessica" three times. Needs a corrected version before
   it can be published. See [FW-36](#fw-36).
4. **Psychiatric staffing** — who is the psychiatrist the site promises? See [FW-37](#fw-37). Also
   confirm the Joint Commission accreditation in [FW-18](#fw-18) while you are asking.
5. **Real Fort Worth headshots** — see [FW-15](#fw-15) for why they will not arrive unprompted. The
   bios document contains no images at all.
6. **The street number.** This site uses **101** Mariah Drive. Tracker row V0023 records the sister
   Dallas Detox site showing **100** Mariah Drive, Weatherford — consistently, including in its
   JSON-LD. If these are not genuinely separate premises, resolve it before cutover; a wrong street
   number on a healthcare NAP propagates into directories and Google Business Profile. See
   [Appendix A](#appendix-a--checked-and-excluded).
7. **The unlabelled `x` column** in the facility data row supplied for this site — its meaning was
   never established, so nothing was published from it. Confirm whether it holds anything that
   belongs on the site.

---

# A. Site-specific tracker issues

<a id="v0037"></a>
## V0037 — Copy promises pages that do not exist · HIGH · ✅ CLOSED BY DECISION

13 structural pages support 42 blog posts. The treatment section carries four levels of care
(detox, mental-health residential, dual diagnosis, aftercare) but there is **no substance-abuse
residential page, no substance pages, and no What We Treat hub** — while the homepage names seven
substances under a "Conditions We Treat" heading (alcohol, benzo, opioid, fentanyl, meth, cocaine,
prescription).

The treatment hub itself is sound: all 13 of its internal links return 200. The gap is between what
the copy claims and what pages exist, not broken navigation.

- **Location:** `/treatment`, `/`
- **Verified:** `/what-we-treat`, `/treatment/residential`, `/treatment/residential-inpatient`,
  `/treatment/substance-abuse-residential` all 404 — no substance-residential page under any
  plausible slug.
- **✅ Closed by [V0108](#v0108) path B.** No substance-residential page will be built. The homepage
  naming seven substances under "Conditions We Treat" is accurate for a facility offering medical
  detox and dual diagnosis — those are conditions treated, not programmes promised, and none of them
  is a link. The 27 links that *did* promise pages are retargeted; see [B2](#broken-links).

<a id="v0038"></a>
## V0038 — `/who-we-help` has no child pages · ✅ CLOSED — accepted as-is, no change

Seven populations (Professionals, Veterans, First Responders, Women, Men, Young Adults, College
Students) exist as headings on a single 565-word page — roughly 80 words each — with zero child
pages. The sister Dallas site gives each of the same seven its own page.

- **Location:** `/who-we-help`
- **Options:** build seven child pages, or accept the single-page treatment and drop the ambition.
- **Unblocked by [V0108](#v0108) but not answered by it.** Path B settled clinical *scope*; whether
  seven populations each deserve a page is an independent content decision that reads the same either
  way.

### ✅ Owner decision, 2026-08-03: leave it exactly as is

Taking this row's own second option — "accept the single-page treatment and drop the ambition."
**Nothing was changed.**

Two corrections to the row while closing it:

1. **It is thinner than stated.** This says "roughly 80 words each". Measured: each population gets
   **one sentence of ~15 words** on a 580-word page.
2. **Building the seven would have made [V0105](#v0105) worse.** The sister Dallas site already has a
   page for each of these same seven populations, so mirroring them here would have created seven new
   duplicate-content surfaces against a site still publishing them — not merely added work.

**Residual, accepted with the decision and recorded rather than fixed:**

The page is headed *"Specialized mental health programs"* and describes the seven with language like
*"Specialized trauma-informed care for PTSD"* and *"Intensive clinical pathways to process
occupational trauma"*. That **implies seven distinct clinical tracks**, which for a 20-bed facility is
an unverified claim of the same class as [FW-37](#fw-37) — nobody has confirmed whether these are
differentiated pathways or one programme serving a mixed population.

The decision was to leave it, which is the owner's call. Worth knowing it is the one remaining place
on the site where a specialism is asserted without corroboration.
- **Note:** tracker row V0107 describes this same defect and is marked *withdraw / merge into
  V0038*. Treat as one issue.

<a id="v0039"></a>
## V0039 — Canonical tag missing on all 55 pages · HIGH · ✅ FIXED

100% of pages lack a canonical link element. The preview is fully indexable (`Allow: /`,
`index, follow`, no `X-Robots-Tag`) while production self-canonicalises — so any preview page that
gets discovered competes with its production twin as a near-duplicate.

- **Verified in this repo:** 14/14 routes sampled have no canonical. No `alternates.canonical` in
  any `page.tsx` or in `layout.tsx`.
- **Fix:** self-referencing canonical on every template, pointing at the production domain.
  `metadataBase` is already set in `src/app/layout.tsx`, so per-page
  `alternates: { canonical: '<path>' }` is sufficient.
- Most severe SEO defect on the site, and independently the top item in the code audit.

<a id="v0040"></a>
## V0040 — `og:url` absent or wrong on every page · ✅ FIXED

> ⚠️ **This issue has no row on the tracker's Issues tab** — it exists only in the Verification Log
> and is referenced obliquely from another facility's row (V0077). It would be missed by anyone
> filtering the Issues tab by facility. Flagging so it gets a row.

- **Verified against this build — matches the tracker exactly:**

| State | Tracker (55 pages) | This build (56 incl. 404) |
|---|---|---|
| `og:url` absent | 42 | **42** |
| Points at bare domain root (non-homepage) | 12 | **12** |
| Correct / page-specific | 1 (homepage) | 1 (homepage) |

- **Root cause (code):** `src/app/layout.tsx` sets `openGraph.url = site.url`, which every page
  inheriting the layout's `openGraph` receives verbatim → bare root. Blog posts override
  `openGraph` without a `url` key → the tag is dropped entirely. That split produces exactly the
  12/42 division above.
- **Fix:** set `openGraph.url` per page, or remove it from the layout and let `metadataBase` +
  per-page canonical drive it.
- **Related:** [FW-25](#fw-25) — `og:image` is missing on 13 of 14 pages. Same file, not in tracker.

<a id="v0041"></a>
## V0041 — Missing substance pages 404 on production too · ✅ CLOSED BY DECISION

`/alcohol-detox`, `/benzo-detox`, `/meth-detox`, `/fentanyl-detox`, `/opioid-detox`,
`/luxury-treatment` and `/treatment/residential-inpatient` return 404 on **both** production and
preview. These broken links are inherited from the old site, not introduced by the rebuild.

- **Why it matters:** fixing them in the new build also closes long-standing production 404s. These
  are not migration regressions, which lowers their urgency relative to regressions.
- **✅ Closed by [V0108](#v0108) path B.** These pages are never built, so the production 404s are
  not inherited — the links that pointed at them now point at `/treatment/detox` and
  `/treatment/mental-health-residential`. Nothing on the new build references them.

<a id="v0042"></a>
## V0042 — Privacy policy is `index, nofollow` · ✅ FIXED

`/privacy-policy` is `index, nofollow`; all 54 other pages are `index, follow`. It is the only
`nofollow` page on this site *and* the only one in the entire 12-site portfolio.

- **Verified in this repo:** `src/app/privacy-policy/page.tsx` → `robots: { index: true, follow: false }`.
- `nofollow` achieves nothing here — link-equity sculpting via `nofollow` has not worked since 2009,
  and it does not prevent indexing. The page's only links are internal.
- **Fix:** delete the `robots` override so it inherits `index, follow`.
- **Portfolio context:** the same page type carries four different robots treatments across the
  portfolio. Worth deciding once, centrally — but this site's fix is a one-line deletion either way.

<a id="v0104"></a>
## V0104 — Root cause: all 42 posts cloned from Dallas · ✅ FIXED — and the original diagnosis was incomplete

42 of 42 slugs are identical to the Dallas site. Body copy was find-and-replaced (0 posts mention
Dallas, 42/42 mention Fort Worth) but **slugs and in-body `href`s were left untouched** — which is
precisely why the links point at Dallas URL patterns that do not exist here.

- **Verified in this repo:** zero occurrences of "Dallas" in rendered post text across all 42 posts;
  23 distinct internal `href`s, 13 of which 404. Confirms the find-and-replace hit prose only.

### ⚠️ The check that "Dallas" was gone did not check the replacement was *right*

Fixed under path B, but the diagnosis needed correcting first. "0 posts mention Dallas" was true and
misleading: the find-and-replace substituted a brand that **does not exist**.

| Found | Count | Fixed to |
|---|---|---|
| **"Fort Worth Detox"** — see the correction below | **54**, across **29 of 42 posts** | Fort Worth Wellness Center |
| "luxury …" in body copy | 15 | removed / reworded — [FW-13](#fw-13) had removed it site-wide |
| "top-rated" | 7 | removed — unsubstantiated, and [FW-20](#fw-20) records **zero** reviews exist |
| "state-of-the-art" | 10 | removed — unsubstantiated |
| **`§DFW§`** — an untracked normalisation sentinel, live in production copy | 1 | `DFW` |
| Old admissions number `817-904-2197` | 3 posts | `817-612-6807` |

Two process notes worth keeping:

- **`§DFW§` was never tracked by this document at all** — zero mentions before today. A literal
  sentinel string reading "located just outside the §DFW§ area" was live on a published page.
- The first pass fixed only the `html` field and missed **`excerpt`**, leaving "Fort Worth Detox" in
  one post's meta description. Any future blog remediation must cover `title`, `excerpt` **and**
  `html`.

The closing boilerplate now reads consistently, e.g. *"Fort Worth Wellness Center is a residential
dual diagnosis and detox center in Fort Worth."* Verified: 0 occurrences of "Fort Worth Detox",
"luxur", "top-rated", "state-of-the-art" or `§` in **any** field of **any** post.

**Left alone deliberately:** the five `quadranthealthgroup.com` links. QHG is the parent operator, not
a competitor — and since path B means this site will not offer PHP/IOP, referring those into the
network is legitimate.

> ### ⚠️ Correction: "Fort Worth Detox" is probably the legal entity name, not a phantom brand
>
> I replaced it 54 times on the stated grounds that it was "a brand that does not exist". While
> working [FW-18](#fw-18) a public Joint Commission provider entry surfaced for **"Fort Worth Detox,
> LLC" at 101 Mariah Dr, Weatherford 76087** — this facility's exact address.
>
> **The replacement still stands**: the consumer-facing brand is Fort Worth Wellness Center
> throughout — domain, logo, page titles — so marketing prose should use it consistently. But **the
> reason I gave was wrong**, and the distinction matters, because if the licensed entity is named
> differently then the site never says so anywhere. That is now tracked under FW-18.
- **Treat [V0024–V0036](#broken-links), [V0105](#v0105) and [V0106](#v0106) as one remediation**,
  not 13 separate link fixes.

<a id="v0105"></a>
## V0105 — Cross-site duplicate content vs. Dallas · ⚠️ PARTLY ACTIONED (2 posts deleted; the broad question needs the sister site)

62–67% 8-gram overlap and 81–84% word-level similarity against the Dallas twin across six sampled
post pairs, after neutralising brand and city names. Two sites in the same portfolio publishing
near-identical articles at identical slugs.

- **Fix:** decide which domain owns each topic. Rewrite substantially for the other, or consolidate
  to one and 301. Do not leave both indexable at the same slugs.
- **`needs external check`** — requires comparing against the live Dallas site.

### Status after V0108 — unblocked, but genuinely not finishable here

[V0108](#v0108) chose to keep the blog rather than drop it, so this row is now the **live** risk
rather than a hypothetical one: 42 posts remain, at 62–67% 8-gram overlap with a sister site that is
still publishing them. Four of the six shared slugs have diverged ([V0106](#v0106)), which reduces
the exact-slug collision but not the body-text duplication.

Three reasons it cannot be closed from here, stated plainly rather than left as "not verified":

1. **It needs a decision about the *other* site**, not this one. Consolidating means 301-ing one
   domain's posts to the other, which is not this project's call to make.
2. **It needs the Dallas site measured**, and re-measuring it now would only establish the overlap,
   not resolve it.
3. **Substantial rewriting of 42 articles is a content commission**, not a remediation pass.

### ⚠️ Owner decision, 2026-08-03: delete the two Dallas-suburb posts

**Blog 42 → 40.** `addiction-rehab-near-irving-texas` and `how-to-find-alcohol-rehab-near-garland-texas`
are gone — they geo-targeted cities 45–55 miles away that this facility does not serve, and competed
with the sister Dallas site for its own catchment. Both images removed with `git rm`; both old URLs
**301 to `/blog/`** rather than left to 404, since they had inbound history.

**One more clone artefact found while verifying**, in a post that survives: a section heading reading
*"How to Find Alcohol Detox Programs Near **Garland, Texas**?"* spliced into
`does-alcohol-cause-withdrawal`, an otherwise general article. Retargeted to Fort Worth.

**Arlington was deliberately kept** in `the-fentanyl-plus-crisis-…` — it is in Tarrant County, ~30
miles away, and genuinely part of this facility's catchment. Not every non-Weatherford city is a
clone artefact.

Verified: **0 pages** in the build mention Irving, Garland, Plano or Richardson · sitemap 54 URLs ·
40 posts, 39 blog images · **54 internal link targets, all 200, zero broken, zero hops.**

### Still open: the broad question, and it is not finishable here

42 → 40 posts does not resolve a 62–67% 8-gram overlap. Three reasons this cannot be closed from
inside this project:

1. **It needs a decision about the *other* site.** Consolidating means 301-ing one domain's posts to
   the other — not this project's call.
2. **It needs the Dallas site measured**, and measuring it establishes the overlap without resolving
   it.
3. **Substantially rewriting ~40 articles is a content commission**, not a remediation pass.

[V0108](#v0108) path B chose to keep the blog, which makes this the **live** duplicate-content risk
rather than a hypothetical one. It is the largest remaining SEO exposure on the site and the only
open item that needs work rather than an answer.

<a id="v0106"></a>
## V0106 — Blog slugs still name the wrong city · ⚠️ 4 of 6 FIXED (2 are a different problem)

Slugs target a different city than their own content.

| Slug | Problem |
|---|---|
| `alcohol-drug-detox-in-dallas-what-to-expect-when-starting-recovery-in-the-new-year` | body says Fort Worth 27× |
| `dallas-detox-center-a-guiding-light-on-your-path-to-recovery` | carries the **sister facility's brand name** |
| `the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas` | body says Fort Worth |
| `the-vital-role-of-aftercare-…-insights-from-dallas-detox-center` | sister brand name |
| `addiction-rehab-near-irving-texas` | Irving is a Dallas suburb |
| `how-to-find-alcohol-rehab-near-garland-texas` | Garland is a Dallas suburb |

- **Verified in this repo:** all six slugs present in `src/lib/posts.json`. The tracker names three;
  **there are six.**
- **Fix:** rewrite the slugs to match the content and 301 the old paths. Do this **before launch** —
  renaming after indexing costs the equity twice.

### ⚠️ Done for four. The other two are not slug/content mismatches.

Four slugs named a city their own content no longer mentions. Renamed, with the matching
`slug.jpg` image moved via `git mv` so the naming convention holds, and a permanent redirect for each:

| Old slug | New slug |
|---|---|
| `…-polysubstance-detox-in-dallas` | `…-polysubstance-detox-in-fort-worth` |
| `alcohol-drug-detox-in-dallas-…` | `alcohol-drug-detox-in-fort-worth-…` |
| `dallas-detox-center-a-guiding-light-…` | `fort-worth-wellness-center-a-guiding-light-…` |
| `…-insights-from-dallas-detox-center` | `…-insights-from-fort-worth-wellness-center` |

**`addiction-rehab-near-irving-texas` and `how-to-find-alcohol-rehab-near-garland-texas` were
deliberately NOT renamed.** This row groups them with the other four, but they are a different defect:
their slugs match their content exactly — both posts really are about those cities. Renaming the slug
would make it *disagree* with the article. The actual problem is that two posts geo-target Dallas
suburbs 45+ miles from a Weatherford facility, which is a content decision (rewrite for a local
catchment, or drop them), not a rename. **Still open — see the note under [V0105](#v0105).**

Verified: all four old paths 308 to the new ones and resolve 200; 42 posts, 42 unique slugs; no
"dallas" left in any slug.

<a id="v0108"></a>
## V0108 — DECISION: is this site mental-health-first? · ✅ SETTLED — mental-health-first, prune the blog

> **This is the fork in the road. Settle it before touching V0037, V0038, V0041, V0104 or V0105.**

The absence of a substance-abuse residential page may be **intentional**. This site is positioned
mental-health-first — "Premier Mental Health & Wellness Care in Fort Worth", "premier psychiatric
and behavioral care" — and offers detox, then mental-health residential and dual diagnosis.

If that is the model, **the cloned substance-heavy blog is the thing that does not fit, not the
missing page.**

Two mutually exclusive paths:

| | Action | Consequence |
|---|---|---|
| **A — build** | Create 8 substance/residential pages | Fixes 27 broken link instances; broadens positioning toward substance use |
| **B — prune** | Rewrite or drop the substance-assuming posts | Fixes the same 27 by removing the links; keeps mental-health-first positioning intact |

This is a **clinical scope question for the facility, not a technical one.** Needs a human answer.

### New evidence (bios document, 2026-08-03) — points toward path A

Read from the site copy alone, path B looked more consistent. **The staffing evidence runs the other
way.**

- **Fort Worth's Clinical Director is a Licensed Chemical Dependency Counselor** (Cortney Best,
  M.C.J., **LCDC**) — a substance-use credential, not a mental-health one.
- Her bio leads with *"individuals struggling with **substance use disorders** and co-occurring
  mental health conditions"* and cites *"extensive experience working with individuals and families
  affected by **addiction**."*
- The Director of Nursing's bio centres **detox and RTC**: "medically supporting clients through the
  detoxification process… manages client care at the Residential Treatment Center (RTC) level."
- Quadrant's medical oversight is **Addiction Medicine** (Dr. Tambini), not psychiatry — see
  [FW-37](#fw-37).
- The facility data row supplied by the owner lists services as **"Detox & Res"**.

Counterweight: Krystal Moore's bio is the one that leads with mental health ("navigate their mental
health and recovery journeys"), and Olivia Hadjerioua is an LPC. So the picture is mixed rather than
uniformly substance-led.

**Reading:** the clinical reality looks substance-use-led, or at minimum co-equal — which means the
cloned substance-heavy blog may fit the facility better than the site's own
"mental health–first center" framing does. If so, the thing that needs to change is the
**positioning**, not the blog, and this stops being a link-fixing exercise.

**Still requires facility confirmation.** This raises the stakes rather than settling it: the answer
now potentially rewrites the homepage `h1` and `/treatment`, not just eight missing pages. Do not act
on inference alone.

### ✅ Owner decision, 2026-08-03: **path B — mental-health-first. Positioning stands; the blog was the outlier.**

Unblocks all six gated rows plus [B2](#broken-links). What was done under it is recorded on each row.

### Further evidence (the live predecessor site, measured 2026-08-03) — points toward path B

The production site this build replaces was measured directly, which is the most relevant evidence
available and had not been consulted for this question:

| Page on `fortworthwellness.org` | "mental health" | "psychiatr\*" | "residential" | "substance" | "outpatient" |
|---|---|---|---|---|---|
| Homepage | **29** | 10 | 14 | 5 | **0** |
| `/treatment-services/` | **38** | 9 | 14 | 9 | **0** |
| `/who-we-help/` | **15** | 9 | 9 | 2 | **0** |
| `/about-us/` | **12** | 2 | 6 | 1 | **0** |

Its `h1` is *"Premier Mental Health & Wellness Center in Fort Worth, TX"*, and its treatment URLs are
`/treatment-services/mental-health-residential` and `/dual-diagnosis`.

**What this changes.** The mental-health-first positioning is **inherited, not invented by this
rebuild** — it outweighs substance-use language by roughly 3–5× on every page, and the predecessor
never mentions outpatient care at all. So the new build is faithful to the site it replaces, and the
cloned Dallas blog remains the outlier.

**The conflict is therefore sharper, not resolved.** Two years of consistent public marketing say
mental-health-first; the staffing document says the clinical lead is an LCDC and medical oversight is
Addiction Medicine. That is a genuine gap between how the business presents itself and who it
employs — which is precisely why this needs a clinician's answer rather than an inference.

Note also that the predecessor emphasises psychiatry heavily (`psychiatr*` ×10 and ×9 on its two main
pages). So [FW-37](#fw-37)'s psychiatrist claims are **long-standing**, not newly introduced here.
That does not make them substantiated; it does mean they have been public for some time.

---

<a id="broken-links"></a>
# B. Broken internal links — 13 targets, 47 instances (V0024–V0036)

**Independently re-counted against `src/lib/posts.json`. The tracker is exactly right** — 13
distinct targets, 47 link instances, 24 posts affected; every per-row count matches. These are all
in-body blog links.

## B1. One-line redirects — 5 targets, 20 instances · ✅ FIXED

**All 20 resolve.** Done after the slug decision came back "rename all three", which changed the
shape of the fix: only **three** redirect rules were needed, not five.

Renaming made `/contact` and `/about` into **real pages**, so the 9 + 1 links pointing at them now
return 200 natively rather than travelling through a redirect. The other three are genuine rules.

| Broken link | Instances | How it resolves now |
|---|---|---|
| `/contact` | 9 | **200 native** — the page lives here now |
| `/about` | 1 | **200 native** — the page lives here now |
| `/treatment-services/aftercare` | 5 | 308 → `/treatment/aftercare` |
| `/treatment-services/texas-dual-diagnosis` | 3 | 308 → `/treatment/dual-diagnosis` |
| `/home` | 2 | 308 → `/` |

Also done in the same pass, because the rename would otherwise have broken things that worked:

- **18 in-body blog links rewritten** — 15 × `/contact-us/` and 3 × `/treatment/aftercare-planning`.
  Left alone they would each have become a redirect hop.
- **The legacy WordPress rule was retargeted, not chained.**
  `/treatment-services/aftercare-planning` now points straight at `/treatment/aftercare` instead of
  at `/treatment/aftercare-planning`, which is itself now a redirect. One hop, not two.
- **301s kept for the old `-us` paths** as a safety net for external links and the owner's own
  material. Nothing internal depends on them.

Verified against a running production build: `/about`, `/contact`, `/treatment/aftercare` all 200;
all three old slugs 308 to the new ones; all five B1 targets reach a 200. Note Next emits **308**
for `permanent: true`, not 301 — search engines treat them equivalently.

Full internal-link audit of the built site: **71 link targets, 0 unexpected breaks.** The only 404s
left are B2's eight, below.

### Original table, for reference

None of these were in `next.config.mjs` before.

| ID | Broken | → Send to | Posts | Instances |
|---|---|---|---|---|
| V0027 | `/contact` | `/contact-us` | 9 | 9 |
| V0033 | `/treatment-services/aftercare` | `/treatment/aftercare-planning` | 4 | 5 |
| V0036 | `/treatment-services/texas-dual-diagnosis` | `/treatment/dual-diagnosis` | 3 | 3 |
| V0029 | `/home` | `/` | 1 | 2 |
| V0024 | `/about` | `/about-us` | 1 | 1 |

**Near miss:** `next.config.mjs` already redirects `/treatment-services/aftercare-**planning**` but
not the bare `/treatment-services/aftercare` that the posts actually link to.

**Lowest-risk, highest-yield item on this entire document** — 20 broken links fixed in five lines,
no content decisions required.

## B2. Need a page built, or the links rewritten — 8 targets, 27 instances · ✅ FIXED

| ID | Broken | Posts | Instances |
|---|---|---|---|
| V0034 | `/treatment-services/inpatient` | 9 | 9 |
| V0035 | `/treatment-services/residential-inpatient` | 4 | 5 |
| V0025 | `/alcohol-detox` | 3 | 4 |
| V0030 | `/luxury-treatment` | 3 | 3 |
| V0026 | `/benzo-detox` | 2 | 2 |
| V0028 | `/fentanyl-detox` | 1 | 2 |
| V0031 | `/meth-detox` | 1 | 1 |
| V0032 | `/opioid-detox` | 1 | 1 |

**✅ Resolved under [V0108](#v0108) path B — rewritten, not built.**

Path B is "rewrite **or** drop". Rewriting was chosen over deleting posts: it removes every broken
link while keeping the blog's accumulated SEO, where deleting 42 posts discards it. All 27 retargeted
to pages that exist, matched to what each anchor actually says:

| Broken target | Instances | Retargeted to |
|---|---|---|
| `/treatment-services/inpatient` | 9 | `/treatment/mental-health-residential` |
| `/treatment-services/residential-inpatient` | 5 | `/treatment/mental-health-residential` |
| `/alcohol-detox` | 4 | `/treatment/detox` |
| `/luxury-treatment` | 3 | `/treatment` |
| `/benzo-detox` | 2 | `/treatment/detox` |
| `/fentanyl-detox` | 2 | `/treatment/detox` |
| `/meth-detox` | 1 | `/treatment/detox` |
| `/opioid-detox` | 1 | `/treatment/detox` |

Substance-specific anchors go to the one medical-detox page rather than a page per drug, which is
what path B means in practice: we detox, we do not run a programme per substance.

**Two anchors were rewritten as well**, because leaving them would have put back the claim
[FW-13](#fw-13) had just removed — "luxury treatment at our state-of-the-art drug and alcohol rehab
facility" → "our residential treatment programs", and "luxury detox center in Fort Worth" →
"medical detox in Fort Worth".

### 🎯 The site now has zero broken internal links

Verified against a running production build: **56 internal link targets, all 200, zero broken, zero
avoidable redirect hops.** Down from 47 broken instances at the start.

Getting to zero hops took two extra passes worth noting:
- Retargeting initially **preserved the original trailing slash**, so `/alcohol-detox/` became
  `/treatment/detox/` — a working link that cost a 308. 45 trailing slashes stripped and `/home` → `/`.
- Eight in-body links pointed at B1's own redirect *rules*. Those rules stay in `next.config.mjs` for
  external inbound links, but internal links now go direct.

Anchor text is documented per instance in the tracker's *Broken Internal Links* tab (columns H, I),
so in-body links can be edited directly. Notable: `/luxury-treatment` anchors include "luxury
treatment at our state-of-the-art drug and alcohol rehab facility" and "luxury detox center in Fort
Worth" — copy that conflicts with the mental-health-first positioning *and* with
[FW-13](#fw-13).

---

# C. Portfolio-wide tracker issues that genuinely affect this site

Only rows where this site is explicitly named as affected. Rows where it is already compliant are in
[Appendix A](#appendix-a--checked-and-excluded).

<a id="v0102"></a>
## V0102 — Trailing-slash mismatch at cutover · CRITICAL · ✅ FIXED — build is now slash-canonical

All 12 previews serve the slashless form at 200 and 308-redirect the slash form. All 12 production
sites are slash-canonical, returning 301 on the slashless form. **At cutover, every inbound link or
citation using the production slash convention hits a redirect on the new build.**

- **Verified in this repo:** `next.config.mjs` has no `trailingSlash` setting → Next default
  `false` → slashless. Confirms the mismatch.
- **Fix:** decide one convention portfolio-wide, then make the build and the redirect map agree.

### ✅ Owner decision, 2026-08-03: match production. `trailingSlash: true`.

Chosen so existing inbound links, citations and directory listings resolve **with no redirect at
all** on cutover day, rather than every one of them paying a hop.

This is not a one-line change — the convention has to hold in **five** places or the site starts
disagreeing with itself. All five were updated together:

| Surface | Change |
|---|---|
| `next.config.mjs` | `trailingSlash: true` |
| `pageMeta()` paths — drives **canonical and `og:url`** | 14 page paths + the blog template |
| `sitemap.ts` | 13 static routes + the blog URL builder |
| `breadcrumbSchema()` | `item` URLs now normalised to slashed |
| In-body blog links | **137** re-slashed (they had been normalised the other way under V0108) |
| Redirect **destinations** | 14 slashed, so an old URL lands in **one** hop, not two |
| `#verify` anchors | 7 × `/admissions#verify` → `/admissions/#verify` |

**Verified against a running production build:**

- Slash form serves 200, slashless 308s to it — the mirror of before.
- Old production URLs (`/about-us/`, `/contact-us/`, `/treatment-services/detox/`) reach 200 in
  **one hop**.
- **Sitemap: 56 URLs, 0 without a trailing slash.**
- **Internal links: 56 targets, all 200, zero broken, zero avoidable hops.**
- **56 canonicals, all present in the sitemap, no disagreement.**

One bug this caught: the sitemap's homepage entry was a bare `https://fortworthwellness.org` while
its own canonical said `https://fortworthwellness.org/` — the site contradicting itself on its most
important URL. Fixed.

> **Portfolio note.** The tracker records all 12 previews sharing this mismatch. This site is now
> slash-canonical; if the portfolio standardises the other way, this is the row to revisit — and the
> five surfaces above are the checklist.

<a id="v0103"></a>
## V0103 — Production `/contact` 301s to a JPEG · CONFIRMED

On production, `/contact` redirects to a **JPEG media attachment** rather than the contact page — a
WordPress attachment squatting the slug. Confirmed on this site and Dallas. Any inbound link using
`/contact` currently lands on an image file.

- **Compounding:** [V0027](#broken-links) has 9 blog links pointing at `/contact`.
- **Fix:** delete or rename the attachment, then 301 `/contact` → `/contact-us`. Fix **before
  cutover** or the new build inherits it.
- **`needs external check`** — production WordPress, not in this repo.

<a id="v0096"></a>
## V0096 — No `/verify-insurance` page · ✅ RESOLVED BY DECISION (keep it on `/admissions`)

This site is one of five with no verify-insurance page. Insurance verification lives inside
`/admissions` instead.

- **Verified in this repo:** no `/verify-insurance` route. `/admissions` has a `#verify` section —
  and see [FW-35](#fw-35): **nothing on the site links to that anchor.**
- Every "Verify Insurance" CTA points at `/admissions` rather than a dedicated page.

### ✅ Owner decision, 2026-08-03: keep verification inside `/admissions`

No page to build. The implementation already landed in step 1 under [FW-35](#fw-35): all seven
"Verify Insurance" / "Verify Your Benefits" / "Verify" CTAs now target `/admissions#verify`, and the
anchor lands flush under the sticky header (verified at exactly 72px). So the dead-anchor half of the
problem is closed and this row needs no further work.

Two consequences accepted with the decision, recorded so nobody rediscovers them as bugs:

1. **This site stays one of five portfolio outliers** with no dedicated verification page. Fine as a
   deliberate choice; worth being consistent about if the portfolio ever standardises.
2. **The verification conversion cannot be isolated.** Traffic and form submissions on
   `/admissions#verify` are indistinguishable from all other `/admissions` traffic, and there is no
   dedicated landing page for paid search to point at. That matters more than it sounds, because of
   the next item.

<a id="v0098"></a>
## V0098 — Contact slug is `/contact-us` · ✅ FIXED (renamed to `/contact`)

Eight sites use `/contact`; this site and Dallas use `/contact-us`.

<a id="v0097"></a>
## V0097 — About slug is `/about-us` · ✅ FIXED (renamed to `/about`)

`/about` is live on nine sites. Genuine rename list is three: this site, Dallas, Greater Texas.

<a id="v0095"></a>
## V0095 — Aftercare slug is `/treatment/aftercare-planning` · ✅ FIXED (renamed to `/treatment/aftercare`)

Six variants across nine sites. This site's `/treatment/aftercare-planning` is explicitly listed as
an outlier; proposed standard is `/treatment/aftercare`.

> ### ⚠️ Sequence these three renames before writing any redirects
>
> V0095, V0097 and V0098 each **also fix broken links for free**:
>
> | Rename | Fixes | Instances |
> |---|---|---|
> | `/contact-us` → `/contact` | V0027 | 9 |
> | `/about-us` → `/about` | V0024 | 1 |
> | `/treatment/aftercare-planning` → `/treatment/aftercare` | aligns with V0033's target | 5 |
>
> Write the B1 redirects **after** deciding these, or you will write them twice and against the
> wrong targets.

<a id="v0099"></a>
## V0099 — No `/faq` page · ✅ BUILT (owner decision)

The tracker says FAQ is absent on seven sites but does not name them.

- **Verified in this repo:** no `/faq` route exists. FAQ accordions are embedded on four pages
  (`/admissions`, `/treatment/detox`, `/treatment/mental-health-residential`,
  `/treatment/dual-diagnosis`).
- **Marked inferred** — this site is very likely one of the seven, but the tracker does not confirm
  it. Worth a row.
- **Related:** [FW-26](#fw-26) — no `FAQPage` structured data on any of those four pages.

### ✅ Owner decision, 2026-08-03: build `/faq` as the hub

Built, live at `/faq`, in the sitemap (56 locs) and linked from the footer's Explore list.

**One deliberate deviation from the option as I framed it.** I offered this as "service pages lose
their accordions, gain a link", and flagged that moving answers away from the page where someone is
deciding usually costs conversion. That trade-off turned out to be avoidable, so the accordions
**stayed**:

- All four service pages keep their visible Q&A, exactly where the question is being asked.
- `/faq` is the **single home for the `FAQPage` markup**. The service pages no longer emit their
  own — marking identical Q&A up at five URLs is the one thing Google's guidance here is explicit
  about, and that was the real reason not to have both.

So the hub exists without the conversion cost. If you would rather the service pages were stripped
after all, it is one line each — say so.

**Implementation note.** The questions were four `const faqs = [...]` arrays inlined in the pages
that rendered them. Copying them into a hub would have guaranteed drift, so they now live in
`src/lib/faqs.ts` and every page — hub included — imports from it. `faqGroup()` throws on an unknown
id, so a typo fails the build rather than silently rendering an empty accordion.

Verified: `/faq` 200 · 21 questions rendered in 4 groups with working jump anchors · **exactly one
`FAQPage` block site-wide** · all four service pages still 200 with their accordions intact.

> ⚠️ **Carried forward:** two of these answers are the psychiatric-staffing claims
> [FW-37](#fw-37) flags as uncorroborated — "regular, direct sessions with an **on-staff
> psychiatrist**" and "regular sessions with our **psychiatric team**". They are reproduced
> **verbatim** rather than softened. The hub means each now appears on a second URL, so if FW-37
> comes back unconfirmed, `src/lib/faqs.ts` is the single file to correct.

---

# D. Issues from the code & UX audit (not in the tracker)

**The tracker has zero rows for this site on its Visual Issues tab** — all 799 rows belong to Dallas
Detox (407), Des Moines (206) and Hillside (186). Visual, accessibility and code quality were never
audited for this site. That is what this section covers.

## D1. Security & data integrity

<a id="fw-01"></a>
### FW-01 — Vercel API token in plaintext · CRITICAL · ✅ LINE REMOVED (rotation still owed)

`.env` contains `vercel token: vcp_4IL88…`. Gitignored and never committed (`git ls-files`
confirms), and the line is malformed (no `=`) so it is not even loading as an env var — but it is a
live-looking credential sitting in the working tree.

**Rotate the token and delete the line.**

<a id="fw-02"></a>
### FW-02 — Leads can be silently lost · CRITICAL · ✅ FIXED (owner decision: fail loudly, Clarion-only)

`src/app/api/lead/route.ts` returns `{ok: true}` unconditionally. On upstream failure the lead is
only `console.error`'d (line 122).

- **Verified live:** 10 test submissions all failed with `403 origin not allowed for this site` and
  **all 10 returned success to the client.**
- On Vercel this means an admissions lead disappears into short-retention runtime logs with no
  alert, while the visitor sees a thank-you screen.
- The 403s are expected from localhost; production works **only if** the exact origin (apex, `www`,
  and every `.vercel.app` alias) is allowlisted in Clarion.
- **Fix:** a real backup — email/SMS to admissions, or a database row — plus an alert on rejection.

Highest-cost failure mode on the site. Everything else here is recoverable; a lost admissions call
is not.

### ✅ Resolved — owner decision, 2026-08-03

**Decision: leads always go to Clarion.** No secondary inbox, no second CRM, no queue. And when
Clarion still refuses after retries, **the visitor is told the truth** rather than shown a
thank-you screen.

That combination has one consequence stated plainly, because it was chosen with eyes open: a
rejected lead is **not captured anywhere**. The fix therefore is not "capture it elsewhere", it is
"never claim success you did not achieve, and make failure loud".

What changed:

- **Retry, but only what retrying can fix.** Network errors, timeouts, 5xx and 429 retry with
  500ms/1500ms backoff. **4xx is never retried** — a 403 means the origin is not allowlisted, and
  no number of attempts fixes a configuration problem. Verified: a 403 returns in 0.67s with
  `attempts: 1` instead of stalling the visitor for 2s first.
- **Honest response contract.** Success → `200 {ok:true}`. Rejection → `502` with a message naming
  the phone number. The form no longer shows the success screen on a failed submit.
- **The error is now announceable and actionable** — `role="alert"` so a screen reader says it
  instead of the visitor waiting on a form that already finished, and a tappable `tel:` link rather
  than a number buried in prose.
- **PII out of the logs.** The failure path used to log the entire `data` object — name, phone,
  email and **date of birth**. Vercel runtime logs are not a controlled store and that is intake
  data for someone seeking mental-health or substance-use treatment. Now logs diagnostics only:
  form key, origin, attempt count, upstream status and body, plus an explicit hint naming the
  allowlist when the status is 403. Verified: 0 occurrences of the test name, phone, email or DOB.
- Honeypot still silently returns 200; validation still returns 400; the FW-03 rate limit still
  returns 429.

> ### ⚠️ Action required before cutover — this is now the single point of failure
>
> Because failure is visible, a missing origin in Clarion means **every visitor from that host sees
> an error**. Allowlist all of them in **Clarion → Website Integrations**:
>
> - `https://fort-worth-wellness.vercel.app` — the current preview/production host
> - `https://fortworthwellness.org` — at cutover
> - `https://www.fortworthwellness.org` — at cutover, **and** any other `.vercel.app` alias that
>   will serve the form
>
> Verified failing today from a non-allowlisted origin, exactly as designed:
> `403 {"detail":"origin not allowed for this site"}`.
>
> There is no alerting on this. Nothing notifies anyone when a submission is rejected — the signal
> is a visitor seeing an error and (hopefully) calling. Worth revisiting once
> [FW-43](#fw-43) is decided, since both want the same plumbing.

<a id="fw-03"></a>
### FW-03 — No rate limiting or CAPTCHA on `/api/lead` · HIGH · ✅ FIXED (see [FW-43](#fw-43))

Eight rapid unauthenticated POSTs all returned 200. Only defence is a honeypot field. Junk leads
flow straight into Clarion/BEN and cost admissions-staff time.

<a id="fw-04"></a>
### FW-04 — Client-controlled `Origin` forwarded upstream · HIGH · ✅ FIXED (both routes)

`route.ts:109-112` falls back to `req.headers.get('origin')`, and `CLARION_ORIGIN` is unset.
Verified an arbitrary `Origin: https://evil-spoof.example` is accepted and relayed — this site can
be used as an origin-laundering relay against Clarion's allowlist.

**Fix:** derive from `host` only, or set `CLARION_ORIGIN`.

> The `/api/clarion` proxy is correctly locked down — `forms/public/submit`, `admin` and a `../../`
> traversal attempt all returned 404.

## D2. Layout & accessibility

<a id="fw-05"></a>
### FW-05 — Mobile call bar hides the 988 crisis line · HIGH · ✅ FIXED

Measured **65px of overlap**. The copyright line, Privacy Policy link and **988 crisis line** are
completely hidden on phones.

**Cause:** `pb-16` compensation is on `<main>` (`layout.tsx:89`) but `<Footer>` is a sibling outside
it. The single element you least want hidden on mobile.

<a id="fw-06"></a>
### FW-06 — Chat widget overlaps the "Verify" button · HIGH · ✅ FIXED (CSS verified; widget not)

The Clarion chat FAB sits on top of the right half of `MobileCallBar`, partly obstructing the
Verify tap target. Two fixed CTAs colliding (`MobileCallBar` is `z-30`; the widget is higher).

<a id="fw-07"></a>
### FW-07 — Closed mobile menu stays in the tab order · HIGH · WCAG 2.4.3 / 4.1.2 · ✅ FIXED

Tab stops 5 through 14+ land inside `#mobile-menu` while it is off-screen and `aria-hidden="true"`.
~15 focusable links. `pointer-events-none` does not remove focusability.

**Fix:** `inert`, `visibility: hidden`, or conditional rendering.

<a id="fw-08"></a>
### FW-08 — Desktop dropdown unreachable by keyboard · WCAG 2.1.1 · ✅ FIXED

Tab order goes Treatment → Who We Help, skipping all four submenu links. `Header.tsx:101` uses
`invisible` + `group-hover` with no `focus-within`.

Partly mitigated because `/treatment` lists all four, but still a defect.

<a id="fw-09"></a>
### FW-09 — Gallery lightbox is not a dialog · ✅ FIXED

No `role="dialog"` or `aria-modal`; focus is never moved into it (verified — it stays on the
trigger), never restored on close, no focus trap. **Only a close button** — prev/next is arrow-keys
only, so on touch you must close and reopen for each of the 12 photos, on the page whose entire
purpose is browsing photos.

<a id="fw-10"></a>
### FW-10 — Hero text contrast is marginal · ✅ FIXED

The gold eyebrow and `white/80` subtitle sit on a bright sky/limestone photo with **no overlay** —
only `text-shadow`. Visibly hard to read at both breakpoints. The `h1` is fine; the eyebrow is
weakest.

<a id="fw-11"></a>
### FW-11 — Tour gallery mosaic leaves large holes · ✅ FIXED

`wide = i === 0 || i === 5` makes those tiles double-width, but every tile keeps `aspect-[4/3]`
(`Gallery.tsx:33-42`) — so wide tiles are 2× taller than their row-mates, leaving **~250px of empty
space** under the short tiles in rows 1 and 2, plus a half-empty final row (12 photos into a
14-cell layout).

The code comment claims "every row stays full, nothing hangs"; the render contradicts it.
**Fix:** `md:row-span-2` on the wide tiles, or `aspect-[8/3]`.

<a id="fw-12"></a>
### FW-12 — Homepage "Explore our facility" dead block · ✅ FIXED

`lg:items-center` centers the short text column against a much taller image column, leaving a large
empty region above the heading.

<a id="fw-35"></a>
### FW-35 — Anchor offset mismatch + dead `#verify` anchor · minor · ✅ FIXED

`--header-h: 88px` / `scroll-padding-top: 88px` vs. an actual 72px sticky header — 16px
over-offset. And `#verify` on `/admissions` is a dead anchor: nothing links to it. See
[V0096](#v0096).

## D3. Content credibility

<a id="fw-13"></a>
### FW-13 — Photography contradicts the premium copy · HIGH · ✅ RESOLVED (copy moved, not photos)

Copy promises "premier", "luxury", "boutique", "high-end amenities", "resort-style pool & patio",
"chef-prepared nutrition", "private wooded estate". The photos show:

| Caption | What the photo actually shows |
|---|---|
| "Our private wooded estate" (homepage hero) | Bare winter trees with a **chain-link fence** across the foreground |
| "Resort-style pool & patio" | Small backyard pool behind a **wooden stockade fence**, bare trees, pool lift, stacked furniture |
| "Chef-prepared nutrition" | **Commercial/institutional kitchen** — stainless prep sink, wall dispensers, mop-friendly floor, **primary-coloured plastic tumblers** |
| "The Cedar Creek Barn" | Metal pole barn on a gravel lot |
| "Serene outdoor grounds" | Aerial of bare winter dirt |

Longest lead time of anything on this list — resolve by commissioning photography that matches the
positioning, **or** softening the copy to match the property. Note this interacts with
[V0108](#v0108) and the `/luxury-treatment` anchors in [B2](#broken-links).

### ✅ Owner decision, 2026-08-03: soften the copy. No shoot.

**Verified: zero instances of premier / luxury / luxurious / high-end / resort-style /
chef-prepared / upscale / opulent / five-star remain on any site page.** "Estate" is also gone —
the photographs show a wire stock fence and a subdivision, which does not support the word.

| Was | Now |
|---|---|
| Homepage `h1`: "**Premier** Mental Health & Wellness Care" | "**Residential** Mental Health & Wellness Care" |
| "**Resort-style** pool & patio" | "Outdoor pool & patio" |
| "**Chef-prepared** nutrition" | "Our on-site kitchen" — the photo is the commercial dish-and-prep area, not plated food |
| "A **luxury**, home-like atmosphere" | "A warm, home-like atmosphere" |
| "designed to feel like a **high-end** private residence" | "designed to feel like a private home" |
| "**High-End** Amenities" | "Comfortable Amenities" |
| "A Modern, **Luxury** Sanctuary" | "A Calm, Private Setting" |
| "**Premier** psychiatric & behavioral care" | "Specialized psychiatric & behavioral care" |
| "Our **luxury** property" | "Our property" |
| "a **premier** mental health center" (footer) | "a residential mental health center" |
| "private wooded **estate**" (×3) | "wooded grounds" / "private wooded property" |
| "**sophisticated** suites", "**curated** spaces" | "comfortable suites", "quiet spaces" |

**"Boutique" and "low-capacity" were kept deliberately.** 20 licensed beds makes them true, and the
goal was removing claims the images contradict — not sterilising every warm word. A calm, honest
small facility is a real proposition, and it is the one the photographs actually support.

**Residuals, both out of scope by the document's own sequencing:**

1. **12 blog posts still say "luxury"**, including the `/luxury-treatment` anchor text
   ("luxury detox center in Fort Worth"). That is blog copy — [V0104](#v0104) / [V0106](#v0106) /
   [B2](#broken-links), all gated on [V0108](#v0108). The site's own pages no longer disagree with
   its photographs; its blog still does.
2. **Three weak page heroes remain** and re-selection cannot fix them — Who We Help is a
   debris-filled fire pit on bare dirt, Dual Diagnosis a staff desk with a fire-alarm panel,
   Treatment/MHR folding tables with a Costco box. Nothing unused is better. They no longer sit
   under a claim they contradict, which was the actual defect, but they are still the weakest images
   on the site.

> ⚠️ **Knock-on for [FW-42](#fw-42):** its stated fix was "reshoot exteriors in one season". With no
> shoot commissioned, that route is closed and FW-42 needs either a different mitigation or to be
> accepted. Flagged rather than silently orphaned.

<a id="fw-14"></a>
### FW-14 — Gallery captions do not match their photos · ✅ FIXED

In `src/lib/site.ts:160-173`:

- "Light-filled common areas" → an **outdoor pool** shot
- "Restful living spaces" and "Calm clinical care spaces" → **office / nurse-station** rooms with
  desks, task chairs and a coffee maker
- "Room to breathe" → a room with a **taxidermy mount** on the wall, an odd choice for a
  mental-health sanctuary

Separately, the homepage "Who We Are" image is alt'd "private resident suite" but shows a **two-bed
room with a drop ceiling and commercial smoke detector**, while `/about-us` lists "Semi-private
rooms" — three descriptions of the same room type.

<a id="fw-15"></a>
### FW-15 — Team headshots appear AI-generated · HIGH · ⚠️ CREDENTIALS DONE (photography still open)

All three photos share an identical background — snowy trees through the same window, same white
curtain, same orange object. For a licensed healthcare provider, synthetic staff imagery is a
serious trust and regulatory exposure.

Also: 2 of 5 leaders have no photo (initials tiles), **none list credentials** (RN/LPC/LMSW/MD), and
none have bios. "Director of Nursing" with no RN is conspicuous in this vertical.

**Update (bios document, 2026-08-03).** The credentials and bios half of this issue is now
resolvable; the photography half is not.

- **Credentials are available** and should be added: Olivia Hadjerioua, **LPC** · Deborah Wade,
  **BSN, RN** · Cortney Best, **M.C.J., LCDC** · Krystal Moore, **MSW**. None listed for Joshua
  Leder or Haley Wadlington.
- **Full bios are available** for every current team member plus the three missing Fort Worth staff
  in [FW-36](#fw-36).
- **No headshots.** Zero images in either revision — the docx's 713KB is embedded Montserrat/Roboto
  fonts, not photos. **The AI-generated-photo problem stands unchanged.**
- **They will not arrive unprompted.** The document's own "BIOS NEEDED" list marks "need headshot"
  against other facilities' staff, and the only outstanding Texas item is
  `Landon Hawpe — Case Manager DDC` (Dallas). Fort Worth is treated as complete, so real headshots
  have to be requested specifically.

<a id="fw-36"></a>
### FW-36 — We credit Dallas's clinical director as ours; Fort Worth's is missing · HIGH · ⚠️ PARTLY FIXED (wrong name removed; correct one still blocked)

`src/lib/site.ts` lists **Antoine Gross Sr. — Director of Clinical Services** on the team. The bios
document files him under **`[Title] Dallas Detox Center`** — he is *Dallas's* clinical lead, with an
LPC credential our site also omits.

**Fort Worth's actual clinical lead is `Cortney Best, M.C.J., LCDC — Clinical Director`, who does not
appear anywhere on this site.**

Attributing the wrong clinician to a licensed treatment facility is a material accuracy problem, and
it is the highest-value correction available from this document.

**Three Fort Worth staff are absent entirely:**

| Name | Role | Credential | Publishable now? |
|---|---|---|---|
| Cortney Best | Clinical Director | M.C.J., LCDC | ⚠️ pending name spelling |
| Jacci Westbrook | Case Manager | Certified Peer Support Specialist | ❌ bio is broken |
| Krystal Moore | Behavioral Health Case Manager | MSW | ✅ yes |

**Four of our five current entries are shared Texas roles, not Fort Worth's own.** All sit under
`[Title] TX Sites`, and the bios say so outright: Olivia is Executive Director "for Dallas Detox
Center **and** Fort Worth Wellness Center"; Joshua covers "the **Texas facilities**"; Deborah "has
been a dedicated member of the **Dallas Detox Center** team for the past three years"; Haley has no
facility named. Legitimate for a shared leadership team, but the About page presents them as this
facility's own staff. Worth labelling.

**Two blockers before publishing** — both present in the 2026-07-27 *and* 2026-08-03 revisions, so
neither has been caught upstream:

1. **`Jacci Westbrook`'s bio refers to "Jessica" three times** — "Jessica brings authenticity…",
   "Jessica is proud to be part of the team…". Either a find-and-replace error or the wrong person's
   bio. **Cannot be published as written.**
2. **Name spelling conflict** — the heading reads "**Corney** Best", the body reads "**Cortney**
   Best" (4×). Confirm before publishing a clinical director's name.

**Safe to do now:** swap Antoine Gross → Cortney Best as the clinical lead, add the four available
credentials, label the shared Texas roles. Hold both case managers until the questions in
[Questions outstanding](#outstanding-questions) come back.

### ⚠️ Owner decision, 2026-08-03: remove the wrong entry now

**Antoine Gross Sr. is off the site.** Verified: the string "Antoine" appears on **zero** built
pages. Crediting another facility's clinical lead as this one's is a misstatement about who provides
clinical care, and the owner chose not to let it stand while the replacement name is confirmed. Team
shows 4 instead of 5; the section never claimed to be exhaustive, so nothing advertises a gap.

Also shipped:

- **Credentials added** where the bios document supplies one — Olivia Hadjerioua, **LPC** and
  Deborah Wade, **BSN, RN**. Both render. This closes the credentials half of [FW-15](#fw-15);
  "Director of Nursing" with no RN shown was the conspicuous one.
- **Shared regional roles now stated.** Every remaining leader holds a Texas-wide role — the bios
  say it outright ("for Dallas Detox Center **and** Fort Worth Wellness Center", "the **Texas
  facilities**"). `/about` now says so instead of implying a Fort Worth-exclusive team.
- A `credential` field on `TeamMember`, documented as bios-document-only so nobody infers one.

> **Two contradictions inside this row, flagged rather than silently resolved:**
>
> 1. The table above marks **Krystal Moore** "✅ yes" publishable, but *Safe to do now* says hold
>    **both** case managers. I followed the explicit instruction and held both — no new people were
>    added. Worth reconciling.
> 2. "Add the four available credentials" is really **two** in practice. The other two belong to
>    Cortney Best and Krystal Moore, neither of whom is on the site yet.

**Still blocked, and unchanged:** the clinical director slot is empty until the spelling is confirmed
(**"Cortney" ×4 in the body vs "Corney" ×1 in the heading**). Add her with
`credential: 'M.C.J., LCDC'` the moment that lands — `src/lib/site.ts` is the only file to touch.
Both case managers stay held, Jacci Westbrook's on the Jessica/Jacci bio error.

<a id="fw-37"></a>
### FW-37 — Psychiatric-staffing claims not corroborated by the bios document · HIGH · ✅ OWNER-CONFIRMED — psychiatrist on staff

The site makes specific, repeated promises about psychiatric staffing:

| Claim | Location |
|---|---|
| *"Will I see a psychiatrist?" → "Yes. You will have regular sessions with our psychiatric team…"* | `treatment/mental-health-residential/page.tsx:77` |
| *"regular, direct sessions with an **on-staff psychiatrist**"* | `treatment/dual-diagnosis/page.tsx:56` |
| *"**Physician-led** psychiatric oversight"* | `treatment/dual-diagnosis/page.tsx:21` |
| *"**Dedicated Psychiatry** — direct, daily support"* | `treatment/mental-health-residential/page.tsx:36` |
| *"24/7 On-site clinical & **psychiatric** care"* | `page.tsx:162` |

**The bios document lists no psychiatrist, MD, or psychiatric NP at Fort Worth.** The facility's
clinical lead is an LCDC. Medical coverage appears to come from **Dr. Pamela Tambini** at Quadrant
level — board-certified in **Internal Medicine and Addiction Medicine, not psychiatry** — supplying
"Medical Oversight" through an external MSO (The Sober Connection). The only psychiatrist in the
entire 12-facility document is **Dr. Olivia M. Gibson-Delaney, M.D.**, Medical Director at
**Wellness Recovery NJ**.

This is absence of evidence, not evidence of absence — the document may simply omit contracted
providers. But these are load-bearing claims on a YMYL healthcare site, in the same risk class as
[FW-18](#fw-18) (unverified Joint Commission accreditation).

**Verify before launch.** If there is no psychiatrist, the copy has to change; "Will I see a
psychiatrist? Yes" is not a claim to leave unconfirmed.

### ✅ Owner confirmed 2026-08-03: a psychiatrist is on staff and treats residents directly

**All claims stand as written. No copy changed.**

### This row undercounted the claim surface

It lists five claims. Measured against the build, there are **eleven placements**, and two of them are
on *every* page:

| Claim | Renders on |
|---|---|
| "expert **psychiatric care**" — footer brand blurb | **all 57 pages** |
| JSON-LD `medicalSpecialty: ['Psychiatric', …]` | **all 57 pages** |
| "regular, direct sessions with an **on-staff psychiatrist**" | `/treatment/dual-diagnosis` + `/faq` |
| "regular sessions with **our psychiatric team**" | `/treatment/mental-health-residential` + `/faq` |
| "**Physician-led** psychiatric oversight" | `/treatment/dual-diagnosis` |
| "**Dedicated Psychiatry** — direct, daily support" | `/treatment/mental-health-residential` |
| "**Psychiatric medication management**" | `/treatment/mental-health-residential` |
| "24/7 On-site clinical & **psychiatric care**" | homepage stat tile |
| "Expert psychiatric care…" — hero subtitle | homepage |

Anyone revisiting this needs the full list, not the five. Note two of them are on `/faq` because
[V0099](#v0099) moved the FAQ content there — that was a consequence of the hub, recorded at the time.

**Unlike [FW-18](#fw-18), these claims are inherited, not new.** The predecessor site uses `psychiatr*`
ten times on its homepage alone. They have been public for years — which does not substantiate them,
but does mean the rebuild did not invent them.

> ### ⚠️ Two things that follow, and neither is a criticism of the answer
>
> **1. The bios document is not a complete staff roster.** If a psychiatrist is on staff, that
> document omits them entirely — it lists no psychiatrist, MD or psychiatric NP at this facility. It
> is the sole evidence base for [FW-36](#fw-36) and [FW-15](#fw-15), so treat it as partial from here.
> ([FW-36](#fw-36) itself is unaffected: the doc makes a *positive* statement that Antoine Gross is
> Dallas's clinical lead, rather than merely omitting him.)
>
> **2. Naming the psychiatrist is the single strongest trust signal available.** "Will I see a
> psychiatrist? Yes" is far more persuasive when the site can say who. The `credential` field added
> under FW-36 is ready — supply a name and credential and it renders immediately, no code needed.
> In a vertical where families check clinicians, an unnamed psychiatric team is a weaker claim than
> a named one.
>
> **Still unverified independently.** This and FW-18 both rest on owner confirmation and both run
> against the bios document. That is a legitimate basis to ship on — the owner is accountable for
> them — but it is worth one look from the clinical director before cutover, since between them they
> touch every page of the site.

<a id="fw-16"></a>
### FW-16 — "Minutes from Fort Worth" is inaccurate · ⚠️ PARTLY FIXED (inaccuracy gone; brand framing still owner's)

`/contact-us` says "Minutes from Fort Worth, TX" and "minutes west of Fort Worth". Weatherford is
**~30 miles / ~35 minutes** away.

Independently corroborated by tracker row V0023, which states plainly: "Weatherford is roughly 30
miles west of Fort Worth and roughly 65 miles west of Dallas." Also worth settling how the
Fort Worth brand name is framed against a Parker County address.

**The inaccuracy is fixed; the framing question is not.** Both strings now read "about 30 miles west
of Fort Worth", from a single `site.distanceFromFortWorth` field so they cannot diverge again. Stated
in miles because that is the verifiable fact — drive time varies. Verified: neither "Minutes from
Fort Worth" nor "minutes west of Fort Worth" survives in the build.

> **Retracted.** I briefly recorded here that the operator had genuine Fort Worth heritage at 329 S
> Henderson St. That was based on `fortworthrecovery.com`, which turned out to be an unrelated
> business ([FW-46](#fw-46)). **The inference is void** — the only known address remains 101 Mariah
> Drive, Weatherford, and the framing question is exactly as open as it was.

**Still yours to decide:** how a Fort Worth brand name should be presented against a Parker County
address. That is positioning, not a fact, so it stays in step 2 — and it is the same question as
the local-SEO tension where every page title targets Fort Worth while the schema and footer say
Weatherford.

<a id="fw-17"></a>
### FW-17 — Uncited federal-agency statistics · ✅ FIXED (they were MISATTRIBUTED, not just uncited)

- `/treatment/aftercare-planning` attributes a "40–60% increase" to the **National Institutes of Health**
- `/treatment/dual-diagnosis` attributes "roughly 50%" to **NAMI**

Neither links to a source. On a YMYL healthcare site, uncited claims attributed to federal agencies
are a liability.

### ⚠️ Corrected diagnosis: these were misattributed, not merely uncited

Checking both claims against their supposed sources changed what the fix had to be. "Cite it" was
never available, because neither source says what the site said it says:

| Site claim | What the source actually says |
|---|---|
| NIH: aftercare and peer support give a **"40–60% increase in their ability to maintain lasting stability"** | NIDA's 40–60% is the **relapse rate** for substance use disorder, cited to show addiction behaves like other chronic illnesses; separately, that treatment **reduces drug use** by 40–60%. Neither is a statement about aftercare improving stability. A real number was repurposed into a claim its source does not make. |
| NAMI: **"roughly 50%"** of people with a severe mental health disorder are also affected by substance use | NAMI publishes **34.5%** of U.S. adults with any mental illness also having a substance use disorder. It says severity raises the likelihood, but does not publish this ~50% figure. |

**Fixed by deletion**, per the standing rule that an unsubstantiated claim gets removed rather than
reworded into something that merely sounds defensible. Both statistics and both attributions are
gone; the surrounding qualitative statements stand on their own and make no research claim. Verified:
"National Institutes of Health", "National Alliance on Mental Illness", "40–60%" and "roughly 50%"
appear nowhere in the built output.

**If you want cited statistics on these pages**, that is an owner call and the honest options are
NIDA's actual relapse-rate framing or a named study — not a re-citation of what was there.

Two notes for the tracker: **NAMI is a nonprofit, not a federal agency** as this row describes; and
the NAMI sentence is at `dual-diagnosis/page.tsx:121`, spelled out in full, so a grep for "NAMI"
misses it.

Sources checked: [NIDA — Treatment and Recovery](https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/treatment-recovery) ·
[NAMI — Mental Health By the Numbers](https://www.nami.org/about-mental-illness/mental-health-by-the-numbers/)

<a id="fw-18"></a>
### FW-18 — Joint Commission accreditation claimed in 3 places, unverified · ⚠️ OWNER-CONFIRMED, seal now verifiable (entity-name gap open)

Asserted on the homepage trust badge, the floating gold-seal card and the footer. A false
accreditation claim is actionable. **Confirm it is current.** `public/images/joint-commission.png`
is present but unused. **`needs external check`**

### ⚠️ Owner confirmed current, 2026-08-03 — kept, and made verifiable

**Scale first: the claim renders on 57 of 57 pages** via the footer, plus two more placements on the
homepage. It is the most-repeated trust signal on the site.

**What the claim's history actually is** — worth recording, because it took three attempts to get
right:

- The **logo** is inherited. `joint-commission-3.png` has been in the predecessor's media library
  since **November 2021** and is displayed on nearly every page of the live site.
- But on the live site it carries **empty `alt` text and no accompanying words**. The strings
  "Joint Commission" and "accredited" appear **nowhere** in its visible copy.
- So the **written claim is new in this rebuild**: an ambiguous unlabelled logo became the specific
  assertion "Accredited by The Joint Commission". That escalation is where the exposure sits.

**Shipped:** the Gold Seal is now a **link to Quality Check** in both placements, per TJC's own
display guidance that the seal should let a visitor verify. Verified on 57/57 pages. An unverifiable
seal is the weakest possible form of a trust signal.

> ### 🔴 Open, and more consequential than the original row: the accredited entity may have a different name
>
> A public TJC provider entry appears to exist for **"Fort Worth Detox, LLC" at 101 Mariah Dr,
> Weatherford 76087** — this facility's exact address — rather than for "Fort Worth Wellness Center".
>
> If accreditation is held under that entity, **a visitor searching Quality Check for the brand name
> will not find it**, which defeats the purpose of displaying the seal at all. Two things needed:
>
> 1. The **direct Quality Check listing URL**, to replace the interim search link in
>    `site.jointCommission.qualityCheckUrl`.
> 2. A decision on whether the accredited legal entity should be **named** beside the seal
>    (e.g. "Accredited by The Joint Commission as Fort Worth Detox, LLC").
>
> **I could not verify independently** — jointcommission.org returns **403 to automated requests**.
> This rests on the owner's confirmation. A human can check it in a browser in under a minute, and
> given it is on every page, that is worth doing before cutover.

**Correction to two things I said while working this row:**

1. I claimed the seal was a *delivery* problem at 772KB on every page. It is not — `next/image`
   serves **3–9.6KB AVIF** at the sizes actually requested. The oversized 900×900 source is disk
   hygiene only, and low priority.
2. See the correction on [V0104](#v0104) about "Fort Worth Detox".

<a id="fw-19"></a>
### FW-19 — Privacy policy publishes an internal note, and has no effective date · ✅ FIXED

`privacy-policy/page.tsx:119-123` renders to visitors: *"This policy is provided as a general
template and should be reviewed by qualified legal counsel…"*

It also has **no effective date**, though its own "Changes to This Policy" section promises one.

<a id="fw-20"></a>
### FW-20 — No testimonials or reviews

`scrape/reviews/reviews.json` is empty (`widgetPresent: false`). Significant conversion gap in this
vertical. **Partly addressed** — see [Fixed](#fixed-on-this-branch); a Google review link now
appears in four places, but there are still no reviews *displayed* on the site.

<a id="fw-21"></a>
### FW-21 — Missing required healthcare disclosures · COMPLIANCE

- No **HIPAA Notice of Privacy Practices** (distinct from a privacy policy)
- No **No Surprises Act / Good Faith Estimate** notice for uninsured/self-pay patients
- No Terms of Use
- No accessibility statement

<a id="fw-22"></a>
### FW-22 — Two of eight insurance carriers no longer exist · ⚠️ DE-RISKED (real list still unconfirmed)

**Beacon Health Options** and **ValueOptions** both folded into Carelon Behavioral Health;
**Magellan** is now Magellan Healthcare. Defunct brands undercut the trust the band exists to build.

### ⚠️ Owner decision, 2026-08-03: pull the dead brands now, don't wait

Band is 8 → **6**. Two removed, one renamed:

| Was | Action | Why |
|---|---|---|
| ValueOptions | **removed** | Brand ceased to exist in 2014 |
| Beacon Health Options | **removed** | Brand ceased to exist in 2023 (→ Carelon) |
| Magellan Health | **renamed** → Magellan Healthcare | **Not removed** — unlike the two above, this carrier still exists. Deleting it would have dropped a real one. |

> **Correction to how I put this decision to the owner.** The option was labelled "drop the 3 stale
> logos" and its preview listed five survivors, while its own description said Magellan would be
> *renamed*. Those were contradictory and the preview list was simply wrong — it omitted Magellan.
> Remove-2-and-rename-1 leaves **six**, and that is what shipped, because removing a live carrier to
> satisfy a miscounted label would have been the wrong outcome. Flagging because the decision was
> made against a flawed description.

Also changed: the grid went `sm:grid-cols-4` → `sm:grid-cols-3`. Six logos in four columns leaves a
half-empty trailing row; six divides exactly by both 2 and 3, so every row stays full at both
breakpoints.

`beacon.svg` and `valueoptions.svg` are **left on disk, unreferenced**, not deleted — if the facility
confirms Carelon, that slot wants a successor logo. Adds 2 to [FW-38](#fw-38)'s unreferenced count.

Verified: 6 logos render, correct alt text, no defunct brand string anywhere in the build, no missing
files.

> ### 🔴 Still open, and this is the part that matters
>
> This is a **de-risked** list, not a verified one. Nobody has confirmed which carriers the facility
> is actually contracted with — displaying a logo is a representation about coverage, and six
> plausible names is safer than eight with two corpses but is not the same as correct.
>
> **Still needs the facility before cutover.** Anthem, BCBS, ComPsych, Magellan Healthcare,
> MultiPlan and Three Rivers were inherited from the old site, not confirmed.

<a id="fw-23"></a>
### FW-23 — Insurance logos render small and inconsistently sized · ✅ FIXED

All eight SVGs share `viewBox="0 0 216 76.29"` — sliced from a single "InsuranceLogos" sprite — so
each logo is letterboxed inside a mostly-empty box. Declared `160×64` does not match the intrinsic
216×76.29 ratio either. Anthem renders noticeably larger than MultiPlan / Three Rivers /
ValueOptions.

`site.ts` also calls them "white SVG logos"; they are grey (`#b0afab`).

<a id="fw-24"></a>
### FW-24 — Four outbound links send readers to Dallas-area resources · ✅ FIXED (six, not four)

AA Dallas, NA Dallas, White Rock Lake, Dallas Arboretum — wrong referrals for a Parker County
patient. Should point to AA Fort Worth, Tarrant/Parker County NA, and local parks.

Distinct from [V0106](#v0106): those are slugs, these are outbound `href`s.

**There were six, not four.** All in `alcohol-drug-detox-in-dallas-…`. The rebrand rewrote anchor
*text* but left every `href` alone, so two links actively lied about where they went:

| Anchor text said | Went to | Now goes to |
|---|---|---|
| "Fort Worth Area AA Intergroup" | `aadallas.org` | `fortworthaa.org` — **Fort Worth AA Central Office** |
| "North Texas NA" | `narcotics.com/…/dallas-texas/` | `fwana.org` — **Fort Worth Area of Narcotics Anonymous** |
| "Fort Worth Museum of Art" | `dma.org` (**Dallas** Museum of Art) | `themodern.org` — Modern Art Museum of Fort Worth |
| "Fort Worth Arboretum" | `dallasarboretum.org` | `fwbg.org` — Fort Worth Botanic Garden |
| "Klyde Warren Park" (a Dallas park) | `klydewarrenpark.org` | `sundancesquare.com` |
| "White Rock Lake" (a Dallas lake) | `dallasparks.org` | `trinitytrailsfw.com` |

The first two are the ones that mattered: someone in crisis clicking "Fort Worth Area AA Intergroup"
landed on Dallas AA. **Every replacement URL was fetched and its page title confirmed** before use —
`aa-fortworth.org` and `fortwortharea-na.org`, the names you would guess, do not resolve.

Rewrote the whole anchor element rather than just the `href`, so text and destination cannot drift
apart again. Verified: 6 anchors changed, 1 post touched, all 42 posts and every other field intact,
and no Dallas-institution URL anywhere in the built output.

**Anchor text for the two recreational swaps is now Fort Worth-accurate but was chosen by me** —
Sundance Square for an urban park with events, the Trinity Trails for a lakeside walk. Swap them for
whatever the facility actually recommends to residents.

## D4. SEO gaps not in the tracker

<a id="fw-25"></a>
### FW-25 — `og:image` missing on 13 of 14 pages · ✅ FIXED

Only blog posts set one, while `twitter:card` is `summary_large_image` — so every share of the
homepage, treatment or admissions pages renders blank. No `opengraph-image` file either.

Same file as [V0040](#v0040); fix together.

<a id="fw-26"></a>
### FW-26 — No `FAQPage` structured data · ✅ FIXED

FAQ accordions exist on four pages with no schema. Large rich-result miss in this vertical. See
[V0099](#v0099).

<a id="fw-27"></a>
### FW-27 — No `BreadcrumbList` structured data · ✅ FIXED

Visible breadcrumbs on 10 pages, no schema.

<a id="fw-28"></a>
### FW-28 — `MedicalBusiness` schema is thin · ⚠️ PARTLY FIXED (geo / sameAs / priceRange need owner input)

No `geo`, `areaServed`, `sameAs`, `priceRange`, `hasOfferCatalog`. Uses `openingHours` rather than
`openingHoursSpecification`. (`foundingDate` was added on this branch.)

<a id="fw-29"></a>
### FW-29 — Four page titles exceed ~70 characters · ✅ FIXED (six, not four)

82–86 chars; will truncate in SERPs.

**Recount.** Measuring the built HTML, **five** titles fell in the stated 82–86 band, not four —
`/treatment/mental-health-residential` was 82 and had been missed. Since the descriptive criterion
(82–86 chars) is more reliable than the count, and `/tour` sat at 80, all six were shortened:

| Page | Before | After |
|---|---|---|
| `/` | 84 | **55** |
| `/treatment` | 85 | **68** |
| `/admissions` | 84 | **63** |
| `/contact-us` | 84 | **68** |
| `/treatment/mental-health-residential` | 82 | **68** |
| `/tour` | 80 | **63** |

The homepage now uses an absolute title so it leads with the brand instead of ending with it.

**Four titles are still 71–76 chars** and were left alone deliberately — that range is borderline
rather than clearly truncating, and trimming further means dropping geo keywords, which is a
marketing call, not a defect: `/treatment/detox` 76 · `/who-we-help` 75 · `/treatment/aftercare-planning` 73 ·
`/treatment/dual-diagnosis` 71. Say the word and they go too.

<a id="fw-30"></a>
### FW-30 — 42 long posts with no in-body images · ⚠️ PARTLY FIXED (lead image done; mid-article needs assets)

Only featured images. Unbroken walls of text.

<a id="fw-31"></a>
### FW-31 — `robots.ts` emits a non-standard `host` directive; sitemap has no `lastModified` on static routes · ✅ FIXED

## D5. Code quality & docs

<a id="fw-32"></a>
### FW-32 — README materially misdescribes the lead flow · ✅ FIXED

`README.md:55-58` says the route "delivers each inquiry into ClarionLabs as a **webchat
conversation** … creates a public webchat session and posts the lead's details as a message."

That is **precisely the bug** `docs/CLARION_FORM_INTEGRATION.md:8-11` records as fixed. The code
correctly uses `/forms/public/submit`. Anyone onboarding will be misled.

`README.md:88` also claims "Accessible: … keyboard-navigable menu/FAQ/gallery" — contradicted by
[FW-07](#fw-07), [FW-08](#fw-08) and [FW-09](#fw-09).

<a id="fw-33"></a>
### FW-33 — Most body copy is invisible without JavaScript · ✅ FIXED

`Reveal` renders `opacity: 0` inline and only reveals via IntersectionObserver
(`ui/Reveal.tsx:49-53`). Its docstring claims a reduced-motion fallback the code does not implement.

<a id="fw-34"></a>
### FW-34 — Minor code items · ✅ FIXED

- `LeadForm`'s submit button is hardcoded "Request my callback" even on the contact page's "Send us
  a message" form
- `delivered = !res || res.ok !== false` (`LeadForm.tsx:75`) counts a nullish return as delivered —
  latent only; the current Clarion script returns a real `Response`
- No `error.tsx`, no `loading.tsx`, no metadata on `not-found`
- `npm run lint` is configured but there is no ESLint config or dependency — it prompts
  interactively and fails in CI

---

<a id="media-inventory"></a>
# E. Media inventory, correct naming & mapping

**Every media file in the repo was opened and identified by content.** 91 deployed files. **No video
or audio assets exist anywhere** — no `.mp4`/`.mov`/`.webm`/`.gif`, no `<video>` element, no
YouTube/Vimeo embed. All motion on the site is CSS.

| Folder | Files | Weight | Naming status |
|---|---|---|---|
| `public/images/facility` | 33 | 17 MB | ❌ camera serials — all need renaming |
| `public/images/blog` | 41 | 5.7 MB | ✅ already `slug.jpg` |
| `public/images/team` | 3 | 2.1 MB | ✅ `firstname-lastname.png` |
| `public/images/insurance` | 8 | 56 KB | ✅ carrier names |
| `public/brand` | 4 | 52 KB | ✅ semantic |
| `public/images` (loose) | 2 | 788 KB | ✅ semantic |

## E1. Facility images — content, correct name, and where each is used

Two distinct building qualities are on this property, and the distinction drives
[FW-40](#fw-40):

- **Main house** — wide-plank white-oak floors, no drop ceiling, black steel arched doors, designer
  lighting. Genuinely premium.
- **Clinical/support wing + barn** — suspended acoustic drop ceilings, mint-green cabinetry, EXIT
  signage, commercial fixtures. Institutional.

### Exteriors & aerials (all winter, bare trees)

| Current | Correct name | What it actually shows | Used in |
|---|---|---|---|
| `dji0577.jpg` | `exterior-front-elevation-winter.jpg` | Main house from the road; **wire stock fence across the foreground** | Home hero · tour hero · who-we-help CTA · dual-dx CTA · gallery "Our private wooded estate" |
| `dji0580.jpg` | `exterior-front-entrance-winter.jpg` | Front entry, stone façade, US flag, ADA ramp + handrail | who-we-help |
| `dji0584.jpg` | `aerial-overhead-pool-and-parking.jpg` | Top-down: roof, pool, fire pit, **parking lot with 6 cars + marked accessible bay** | about CTA · detox CTA · tour CTA · gallery "Serene outdoor grounds" |
| `dji0587.jpg` | `aerial-oblique-property-and-neighbors.jpg` | Oblique aerial; **neighbouring houses clearly visible** | blog CTA · aftercare CTA |
| `dji0591.jpg` | `aerial-wide-neighborhood-context.jpg` | Wide aerial of the whole subdivision + a commercial building with trucks | blog-post CTA · admissions CTA · **`CTABand` default → every page without an override** |

### Clinical & support wing — drop ceilings, mint cabinets

| Current | Correct name | What it actually shows | Used in |
|---|---|---|---|
| `dsc04980.jpg` | `kitchen-commercial-dish-and-prep.jpg` | **Commercial kitchen**: 3-compartment sink, commercial dish machine, ice machine, orange dish rack, food-safety posters | Home ("Chef's kitchen and dining") · gallery "Chef-prepared nutrition" |
| `dsc04983.jpg` | `kitchen-range-and-island.jpg` | Same kitchen: residential range, two hoods, open-shelf island | — unused — |
| `dsc04989.jpg` | `dining-room-communal-tables.jpg` | Two long tables, ~12 chairs, drop ceiling, longhorn skull | — unused — |
| `dsc04995.jpg` | `lounge-tv-and-sofas.jpg` | Lounge, blue velvet pillows, wall TV | — unused — |
| `dsc04998.jpg` | `great-room-dining-and-lounge.jpg` | Wider great room; **EXIT sign** visible | — unused — |
| `dsc05004.jpg` | `corridor-seating-nook.jpg` | Hallway nook, doors receding, office visible | — unused — |
| `dsc05010.jpg` | `nurses-station-staff-desks.jpg` | **Staff work area**: two desks, task chairs, cork boards, printer, shredder, water cooler, **fire-alarm panel + pull station** | detox split · **dual-diagnosis HERO** · gallery "Calm clinical care spaces" |
| `dsc05013.jpg` | `med-room-nurse-desk-and-wc.jpg` | **Medication room**: sink, two under-counter med fridges, "health / wellness" art, candy jar, **toilet visible through the open door** | **about-us split ("A warm, home-like living space")** · MHR split ("A restful living space") · gallery "Restful living spaces" |
| `dsc05022.jpg` | `bedroom-private-single-queen.jpg` | **A genuinely private single-occupancy room** with ensuite | ❗ **— unused —** |
| `dsc05028.jpg` | `bedroom-semi-private-two-queens.jpg` | **Two queen beds** — semi-private | Home split ("private resident suite") · detox hero · dual-dx split · gallery "Private resident suites" |
| `dsc05037.jpg` | `laundry-room.jpg` | Two stacked washer/dryer sets — evidences the "Laundry Service" amenity | — unused — |
| `dsc05040.jpg` | `bedroom-barn-upstairs-two-beds.jpg` | Two beds + desk under gambrel slope (barn upper floor) | — unused — |
| `dsc05058.jpg` | `lounge-and-corridor-barn-upstairs.jpg` | Lounge + long corridor, two EXIT signs | — unused — |
| `dsc05061.jpg` | `lounge-small-tv-and-longhorn-skull.jpg` | Small TV lounge, **decorative longhorn skull**, EXIT door | gallery "Room to breathe" |
| `dsc05064.jpg` | `lounge-barn-upstairs-open.jpg` | Open upstairs lounge, first-aid box | — unused — |
| `dsc05067.jpg` | `office-barn-upstairs.jpg` | Sparse two-desk office / therapy room | — unused — |
| `dsc05075.jpg` | `barn-exterior-and-gravel-court-summer.jpg` | **Metal pole barn**, new timber stair, firewood, gravel — *summer foliage* | Home mosaic · aftercare hero · gallery "The Cedar Creek Barn" |
| `dsc05078.jpg` | `barn-exterior-and-parking-summer.jpg` | Barn from parking: **propane tank, water tank, ADA bay** | — unused — |

### Main house — white oak, no drop ceilings

| Current | Correct name | What it actually shows | Used in |
|---|---|---|---|
| `dsc09517.jpg` | `group-room-folding-tables.jpg` | **Folding banquet tables, black stacking chairs**, board games on a shelf, **a Costco box and piled exercise mats in the corner** | admissions hero · **treatment hero** · **MHR hero** · gallery "Group therapy & activity room" · **1 blog featured image** |
| `dsc09520.jpg` | `staff-office-personal.jpg` | Staff office: personal decor, "Hunt Fish Run" signs, soft toy, printer | — unused — *(correctly)* |
| `dsc09523.jpg` | `bathroom-vanity-and-toilet.jpg` | Bathroom — **toilet in the foreground**, commercial paper-towel dispenser | **about-us HERO** · gallery "Modern private baths" |
| `dsc09526.jpg` | `living-room-green-sofas-white-oak.jpg` | **Best interior on the property**: green velvet sofas, white-oak floor, designer pendant, macramé, guitar | ❗ **— unused —** |
| `dsc09529.jpg` | `entry-foyer-arched-doors-branded.jpg` | Entry foyer, tall black steel arched doors, **the Fort Worth Wellness longhorn logo on the glass** | ❗ **— unused —** |
| `dsc09532.jpg` | `bedroom-bright-two-beds-main-house.jpg` | Bright two-bed room, no drop ceiling, matched white furniture | ❗ **— unused —** |
| `dsc09533.jpg` | `pool-and-deck-wide-winter.jpg` | Pool + stamped deck, **ADA pool lift**, stockade fence, **neighbour roofs over the fence** | Home mosaic · **contact hero** · treatment CTA · MHR CTA · gallery "Resort-style pool & patio" |
| `dsc09536.jpg` | `pool-tanning-ledge-winter.jpg` | Pool close-up, **dry/unfilled beach entry**, neighbour house through the trees | aftercare split · dual-dx split · gallery "Light-filled common areas" |
| `dsc09539.jpg` | `firepit-and-rear-yard-winter.jpg` | Stone fire pit **full of dead leaves**, bare dirt ring, dormant grass, satellite dish, parked cars | **who-we-help HERO** |
| `.jpg` | 🗑 **delete** | Zero-length filename, 283 KB, 2000×1333 — a **stray duplicate export of `dsc09523`** (bathroom). Unreferenced. | — none — |

## E2. Other media

- **Team** (`1536×1024` PNG, ~700–800 KB each) — see [FW-15](#fw-15). The `1536×1024` dimension is a
  standard generative-image output size, which corroborates the AI conclusion; `olivia-hadjerioua.png`
  is `1535×1024`, one pixel off, indicating a re-crop. They are also **PNGs for photographic
  content** — should be JPEG/WebP, which would cut ~2 MB.
- **`public/images/gold-seal.png`** — `900×900`, **772 KB**, rendered at 56–64 px. Roughly 100× the
  pixels needed.
- **`public/brand/logo-mark-white.png`** — unreferenced.
- **`public/images/joint-commission.png`** — unreferenced (see [FW-18](#fw-18)).
- **Blog** — 41 files, all already correctly named `slug.jpg`, all used, none orphaned. **Do not
  rename these**; the names are load-bearing and 6 inherit the wrong-city slugs in
  [V0106](#v0106). One post (`is-xanax-addictive`) has no image of its own and borrows
  `dsc09517.jpg` — the facility group room — as its featured image.

---

<a id="fw-40"></a>
### FW-40 — The best photos on the property are unused; back-of-house is used as page heroes · HIGH · ✅ FIXED (5 specified swaps)

This reframes [FW-13](#fw-13). The problem is **not only** that the photography is weak — it is that
the strongest images already exist and are sitting unused, while institutional and back-of-house
rooms carry the most important pages.

**Currently used as heroes:**

| Page | Hero image | What it shows |
|---|---|---|
| About Us | `dsc09523` | a **toilet** in the foreground |
| Who We Help | `dsc09539` | a **debris-filled fire pit on bare dirt** |
| Dual Diagnosis | `dsc05010` | a **staff desk area with a fire-alarm panel** |
| Treatment & MHR | `dsc09517` | **folding tables, stacking chairs, a Costco box** |

**Unused and better:**

| Unused file | Would serve |
|---|---|
| `dsc09529` — branded foyer, arched steel doors | About Us hero — it literally shows the brand on the door |
| `dsc09526` — green sofas, white-oak floor, pendant | "Light-filled common areas" (currently an **outdoor pool photo**) |
| `dsc09532` — bright two-bed room, no drop ceiling | Bedroom imagery, in place of `dsc05028` |
| `dsc05022` — **genuinely private single room** | "Private resident suites" — the current photo has **two beds** |
| `dsc05037` — laundry room | Substantiates the "Housekeeping & Laundry" amenity claim |

**A re-selection pass costs nothing and needs no new photography.** Do this before commissioning a
shoot — it may resolve much of [FW-13](#fw-13) on its own, and it is the cheapest credibility win
available anywhere in this document.

<a id="fw-38"></a>
### FW-38 — 17 unreferenced media files (~6.3 MB), including a zero-name junk file · ✅ JUNK FILE DELETED; count now 17 again (see below)

`public/images/facility/.jpg` — a **283 KB JPEG with an empty filename**, unreferenced, and a
duplicate export of `dsc09523`. Delete it.

**Count as of 2026-08-03: 17 unreferenced files** — it went down and back up, deliberately.
`.jpg` was deleted; FW-40 put 4 previously-unused images into service; then FW-41 retired 3 aerials
and FW-22 retired 2 insurance logos. Currently unreferenced: **13 facility images**, `beacon.svg`,
`valueoptions.svg`, `logo-mark-white.png`, `joint-commission.png`. All retained on purpose — the
aerials and carrier logos are publishing decisions that could be reversed, not dead weight.

Original note follows.

Plus 16 unreferenced facility images (~6 MB of the 17 MB folder), `logo-mark-white.png`, and
`joint-commission.png`. **Do not bulk-delete** — several are the exact images
[FW-40](#fw-40) recommends promoting. Triage first, then remove the genuine leftovers.

<a id="fw-45"></a>
### FW-45 — No analytics of any kind · NEW (found while answering V0096) · ✅ FIXED

**Verified: the site has zero measurement.** No GA4, no Google Tag Manager, no Meta pixel, no Vercel
Analytics, no Plausible, no PostHog, no conversion event anywhere in the codebase or `package.json`.

For a lead-generation site that is a structural blind spot, not a nice-to-have. Today it is
impossible to answer: which pages produce calls, what share of visitors reach a form, where they
abandon it, or whether any paid spend returns anything. Every decision about this site — including
[V0096](#v0096), which was just settled without data because none exists — is being made blind.

It also interacts with two other open items:

- [V0096](#v0096) chose to keep verification on `/admissions`, which is defensible but means the
  highest-intent conversion on the site cannot be measured separately even once analytics exists,
  unless the form submission fires its own event. That is worth building in whichever platform is
  chosen.
- [FW-02](#fw-02) now fails visibly when Clarion rejects a submission, and **nothing alerts anyone**.
  An analytics or error-tracking platform is the natural place to catch that.

### ✅ Fixed 2026-08-03 — Vercel Analytics + Speed Insights

**Platform chosen on compliance grounds, not convenience.** On this site the page path is itself
sensitive: a request for `/treatment/dual-diagnosis` is a health inference about the person making
it. GA4 storing that against a persistent `_ga` client id is precisely the pattern that has drawn
regulatory attention at healthcare providers. Vercel Analytics is **cookieless and stores no visitor
identifier**, so there is no profile for a diagnosis-shaped URL to attach to — and no consent banner
is needed. The project is already on Vercel, so it adds no new vendor and no new data-processing
relationship.

Shipped:

- `<Analytics />` and `<SpeedInsights />` in `layout.tsx`. **Zero bundle cost** — shared First Load
  JS is unchanged at 87.3 kB; both load an external script client-side.
- **A `lead_submitted` conversion event**, fired only on a submission Clarion actually accepted — so
  the number means "a lead reached admissions", not "someone pressed a button".
- The event sends **one property, `form`**, and never a field value. The payload is treatment intake
  data and does not belong in an analytics vendor; sending it would also defeat the point of
  choosing a cookieless platform.
- Privacy policy updated to describe what the analytics actually does, in verifiable terms.

**This also recovers what [V0096](#v0096) gave up.** Keeping verification inside `/admissions` means
page metrics cannot separate it from general admissions traffic — but `form=insurance_verification`
can, so the highest-intent conversion on the site is measurable after all.

Two caveats, stated rather than buried:

1. **Custom events require Vercel Web Analytics on a paid plan.** On the free tier `track()` is a
   harmless no-op and pageview data still works — so `lead_submitted` needs the plan enabled to
   actually record.
2. **Not verifiable locally.** The `/_vercel/insights/script.js` endpoints only exist on Vercel.
   Confirmed as far as is possible here: both script paths are present in the layout client chunk
   and the components are wired into the root layout. Final confirmation needs a deployed preview —
   same category as [FW-06](#fw-06) and [FW-44](#fw-44).

**Still not covered: alerting.** [FW-02](#fw-02) now fails visibly when Clarion rejects a submission
and nothing notifies anyone. Analytics will show the conversion *rate* fall; it will not page anyone.
That remains open under [FW-43](#fw-43), which wants the same plumbing.

<a id="fw-46"></a>
### FW-46 — ~~A SECOND site is being replaced~~ · ❌ VOID / WITHDRAWN 2026-08-03

> **Withdrawn the same day it was raised. `fortworthrecovery.com` is an unrelated business.**
> The owner corrected it immediately: the site being replaced is `fortworthwellness.org`, as this
> document always had it. I chased the wrong domain and this row is void — no migration work is
> needed and nothing should be redirected from that domain. Kept rather than deleted only so the
> comparison below is not re-derived by someone who finds the same domain later.

The owner initially identified `fortworthrecovery.com` as a site this build replaces.

Checked directly. It is not a redesign of the same facility; it describes a **different one**:

| | `fortworthrecovery.com` | This build |
|---|---|---|
| Address | **329 S Henderson St, Fort Worth, TX 76104** | 101 Mariah Drive, **Weatherford** 76087 |
| Phone | **855-654-2500** | 817-612-6807 |
| Level of care | **Outpatient** — PHP, IOP, OP, **ambulatory** detox, aftercare | **Residential**, 20 licensed beds, 24/7 live-in |
| Clinical focus | Drug & alcohol addiction | Mental-health-first |
| "mental health" / "psychiatr\*" | **zero mentions sitewide** | central to the positioning |
| Accreditation claimed | **none** | Joint Commission, in 3 places |

There are also **no cross-references between the two brands in either direction** — nothing on
`fortworthrecovery.com` mentions Weatherford, Mariah, Quadrant or Fort Worth Wellness, and
`fortworthwellness.org` does not mention Fort Worth Recovery.

**22 pages, and 8 have no destination on the new build:**

| Old URL | Maps to |
|---|---|
| `/`, `/about-us/`, `/admissions/`, `/contact/`, `/programs/`, `/programs/aftercare/` | ✅ an equivalent exists |
| `/programs/outpatient-program/` | ❌ nothing |
| `/programs/intensive-outpatient/` | ❌ nothing |
| `/programs/partial-hospitalization/` | ❌ nothing |
| `/programs/ambulatory-detox/` | ❌ nothing |
| `/outpatient-alcohol-drug-rehab/` | ❌ nothing |
| `/admissions/payment-insurance/` | ❌ nothing |
| `/sobriety-calculator/` | ❌ nothing |
| `/fmla/` | ❌ nothing |

**Resolved:** unrelated business. Nothing built, nothing redirected. Row closed.

<a id="fw-47"></a>
### FW-47 — ~~Level-of-care mismatch with the site being replaced~~ · ❌ VOID / WITHDRAWN 2026-08-03

> **Void with [FW-46](#fw-46).** The outpatient-vs-residential mismatch was measured against the
> wrong business. The **actual** predecessor, `fortworthwellness.org`, is residential and mental
> health throughout — 14 mentions of "residential", zero of "outpatient", and its treatment pages are
> `/treatment-services/mental-health-residential` and `/dual-diagnosis`. There is no mismatch.
>
> One fragment survives and is already tracked elsewhere: "20 licensed beds" is owner-confirmed
> facility data, and the accreditation claim remains open under [FW-18](#fw-18).

Original reasoning follows, against the wrong predecessor.

The predecessor offers **outpatient** care — partial hospitalization, intensive outpatient, standard
outpatient, and **ambulatory** detox, where the patient goes home. This build offers **none of
those**, and instead claims 20 licensed beds, a "24/7, live-in program", and "medical detox with 24/7
clinical supervision in a private residential setting".

Those are **different levels of care under different licences.** Two consequences:

1. **Patient-facing.** Anyone arriving from an outpatient page — someone who needs to keep working,
   or who cannot leave their family — lands on a residential site that does not offer what they came
   for. Redirecting `/programs/intensive-outpatient/` to a residential page is worse than a 404,
   because it looks like an answer.
2. **Substantiation.** "20 licensed beds" and "24/7 live-in" are licensing claims. The owner's own
   facility data row says **"Detox & Res"**, which supports them — but the only public evidence of
   this operator's actual services describes outpatient care exclusively.

**Confirm the licensed level of care before cutover.** Same risk class as [FW-18](#fw-18) and
[FW-37](#fw-37): claims about what a treatment facility is licensed to provide should not ship
unverified. If outpatient services are in fact still offered, the site is missing them entirely,
which is a much larger gap than the eight pages [V0037](#v0037) describes.

<a id="fw-43"></a>
### FW-43 — Rate limiting is per-instance and there is still no CAPTCHA · NEW (found in step 1) · ✅ RESOLVED (alerting added; limiter left as-is by decision)

[FW-03](#fw-03) is closed: `/api/lead` now allows 5 submissions per IP per 10 minutes and returns
`429` beyond that. But the counter is a `Map` in one serverless instance's memory, so a flood spread
across instances still gets through, and a warm instance is the only thing making it work at all.

Durable options, both of which need a provider decision from the owner:

- **Shared store** — Vercel KV or Upstash Redis. Accurate across instances; adds a dependency and a
  small per-request latency.
- **CAPTCHA** — Turnstile or reCAPTCHA on the form. Stops bots rather than counting them, but adds a
  third-party script and a friction point on an admissions form, which is a real conversion cost on a
  page someone may be filling in during a crisis.

Not urgent — the honeypot plus the new limiter already stop the trivial case. In **step 2**.

### ✅ Owner decision, 2026-08-03: add alerting, skip the shared store

The decision reframed this row correctly. Rate limiting was never the live risk — the honeypot plus
the in-memory limiter already blunt a script hammering the endpoint. **The real exposure was that
[FW-02](#fw-02) made failure visible to the visitor but invisible to us.** A dropped origin on
Clarion's allowlist would have cost every form lead, with no signal but a visitor who might phone.

So: **no shared store, no CAPTCHA, alerting added.**

- Fires on every Clarion rejection, i.e. exactly the case where the lead is not captured anywhere.
- **Provider-agnostic by design** — a plain incoming webhook, so Slack, Discord and Teams all work
  unchanged. No new dependency, and no vendor decision was needed to ship it. Set
  `LEAD_ALERT_WEBHOOK_URL` in Vercel to switch it on; unset it no-ops.
- **Diagnoses the likely cause.** On a 403 the alert names the origin and says it is not allowlisted
  in Clarion → Website Integrations, because that is the failure this is really guarding against.
- **No lead data in the alert.** A failed lead means the PII was never delivered; putting it in a
  chat channel would be the wrong fix for the wrong problem. Verified: the test submission's name,
  phone, email and DOB all absent from the payload.
- Awaited with a 2s cap, and cannot throw — a serverless function can be frozen the moment it
  responds, so a detached promise is not reliably sent, but the visitor's error response must not
  wait on a slow webhook either.

Verified end to end against a local webhook receiver: submission → Clarion 403 → visitor gets 502
with the phone number → alert delivered with the allowlist diagnosis and no PII.

**Accepted residual:** rate limiting is still per-instance in memory. A distributed flood across
instances still gets through, and a cold start resets the window. That was the explicit trade — the
honeypot and limiter cover the realistic case, and a shared store was judged not worth a paid add-on.

> **Action for you:** set `LEAD_ALERT_WEBHOOK_URL` in Vercel. Until you do, a rejected lead is still
> only visible in the runtime logs — the code is in place but silent.

<a id="fw-44"></a>
### FW-44 — Tailwind was purging every third-party CSS hook · NEW (found in step 1) · ✅ FIXED

Found by accident: the [FW-06](#fw-06) fix was written, built, and had **no effect**. The rule was
absent from the compiled CSS entirely.

Cause: Tailwind tree-shakes anything inside an `@layer` block against the content scan. Every
`.clarion-*` class is injected at runtime by Clarion's script, so it appears nowhere in `src/` and
was being dropped. This was **not** specific to the new rule — measured on the pre-existing
`.clarion-blog-*` block in `globals.css`:

| Class | In compiled CSS before | After |
|---|---|---|
| `.clarion-blog-card` | ❌ 0 | ✅ 4 |
| `.clarion-blog-cover` | ❌ 0 | ✅ 2 |
| `.clarion-blog-title` | ❌ 0 | ✅ 3 |
| `.clarion-blog-body` (+ nested) | ❌ 0 | ✅ 19 |
| `.clarion-blog-readmore` | ❌ 0 | ✅ 3 |
| `.clarion-blog-list` / `.clarion-blog-empty` | ⚠️ retained incidentally | ✅ |

Those last two survived only because they appear inside `:has()` selectors hanging off
`.clarion-embed-section`, which *is* referenced in `blog/page.tsx`.

**Consequence:** ~90 lines of styling written for the Clarion blog embed have never been shipped. It
was never visible because the embed is `display: none` until Clarion has published posts — so the
first time a post appeared, it would have rendered essentially unstyled, and it would have looked
like a Clarion bug rather than ours.

**Fix:** the whole Clarion block now sits outside `@layer components`, as plain top-level CSS, which
is emitted verbatim. A comment in `globals.css` explains why and says not to move it back.

**Verified:** all class names now present in the compiled CSS (table above). **Not** visually
verified — that needs Clarion to actually publish a post, which also gates
[commit a78af81's](#fixed-on-this-branch) embed section. Worth one look once it does.

<a id="fw-39"></a>
### FW-39 — Facility filenames are camera serials · ✅ FIXED

All 33 are `dji0577.jpg` / `dsc05028.jpg` — they carry no meaning. Consequences: image filenames are
a real (if minor) ranking signal and these forfeit it entirely; and nobody can pick the right photo
without opening all 33, which is how [FW-14](#fw-14)'s caption mismatches happened in the first
place. Correct names are in [E1](#media-inventory).

Rename with `git mv`, update `src/lib/site.ts` plus the page references, and keep the blog images
untouched.

**Done.** All 32 renamed exactly as specified in [E1](#media-inventory) — the mapping was parsed out
of this document's tables rather than retyped, and the script refused to run unless it was 1:1 with
what was on disk with no duplicate targets. `git mv` for all 32 so history follows the files, then 53
references rewritten across 16 source files (including the one in `posts.json`, where
`is-xanax-addictive` borrows the group-room photo).

Verified against the build output: **0 camera-serial names remain**, 22 distinct facility images are
referenced and **all 22 exist**, `tsc`/`build`/`lint` clean. Blog images untouched by construction —
different folder, never in the mapping.

Note it is 32 files, not 33: the 33rd was `.jpg`, deleted under [FW-38](#fw-38) in step 1.

<a id="fw-41"></a>
### FW-41 — Aerials publish the facility's exact layout, parking and neighbours · ✅ FIXED (all three removed)

`dji0584`, `dji0587` and `dji0591` show the roof plan, the parking area with legible vehicles, the
pool enclosure, and the surrounding houses. `dji0591` is the **`CTABand` default**, so it appears on
most pages.

Two problems. First, they contradict the copy: "private wooded estate", "serene outdoor grounds",
"maximum privacy and discretion" — while the images show a subdivision with close neighbours.
Second, and more substantively: for a residential behavioural-health facility that sells discretion,
publishing identifiable aerial views of the premises works against the promise being made to
patients and their families. Worth a deliberate decision rather than a default.

### ✅ Owner decision, 2026-08-03: remove all three

Verified: none of the three appear anywhere in the built site. Nothing published now shows the roof
plan, the parking area, legible vehicles, or the neighbouring houses. Nine references were swapped
for ground-level images:

| Page | Was | Now |
|---|---|---|
| `CTABand` **default** | aerial-wide-neighborhood-context | living-room-green-sofas-white-oak |
| `/admissions` | aerial-wide-neighborhood-context | entry-foyer-arched-doors-branded |
| blog post template | aerial-wide-neighborhood-context | lounge-tv-and-sofas |
| `/about` | aerial-overhead-pool-and-parking | exterior-front-entrance-winter |
| `/blog` | aerial-oblique-property-and-neighbors | dining-room-communal-tables |
| `/treatment/aftercare` | aerial-oblique-property-and-neighbors | dining-room-communal-tables |
| `/tour` | aerial-overhead-pool-and-parking | pool-and-deck-wide-winter |
| `/treatment/detox` | aerial-overhead-pool-and-parking | bedroom-private-single-queen |
| tour gallery | aerial-overhead-pool-and-parking · "Serene outdoor grounds" | exterior-front-entrance-winter · "Our front entrance" |

Two things worth noting about how it was done:

- **The gallery slot was replaced, not deleted.** Fourteen photos is precisely what makes the
  [FW-11](#fw-11) mosaic fill 5 rows with no trailing gap; dropping to 13 would have reopened it.
  Verified still 14 tiles.
- **The CTABand default matters most** — it is what every page without an override falls back to, so
  it was the single most-published image on the site. It is now the best interior on the property
  rather than an aerial of the subdivision.

The three files are **left on disk, unreferenced**, not deleted — this was a publishing decision, not
a judgement that the photographs are worthless. Adds 3 to [FW-38](#fw-38).

This also removes the copy contradiction [FW-13](#fw-13) noted: no image now shows a subdivision
under the words "maximum privacy and discretion".

<a id="fw-42"></a>
### FW-42 — Gallery mixes winter and summer exteriors · ✅ CLOSED — accepted, no change

Every `dji*` aerial and both pool photos are **bare-tree winter**. `dsc05075` and `dsc05078` (the
barn) are **full summer green**. In the tour mosaic these sit adjacent, so the property reads as two
different places photographed in different years.

### ✅ Owner decision, 2026-08-03: accepted as-is. No change made.

This row's stated fix was "reshoot exteriors in one season", and [FW-13](#fw-13) closed that route —
the owner chose to move the copy rather than commission photography. So this was re-decided on its
merits rather than left orphaned, and the answer was to accept it.

The reasoning, recorded so it isn't rediscovered as a bug:

- **The scale is smaller than the row implies.** Only **one** summer photo is actually published:
  `barn-exterior-and-gravel-court-summer`, serving as the tour gallery's "The Cedar Creek Barn" tile
  and the `/treatment/aftercare` hero. `barn-exterior-and-parking-summer` is unreferenced. So it is
  one image among fourteen, not a competing set.
- **The three aerials that made the contrast worst are gone**, removed under [FW-41](#fw-41). Much of
  the "two different places" effect went with them.
- **The barn is a named amenity.** Dropping it would have removed the Cedar Creek Barn from the site
  entirely, and the available replacements are weaker — the barn interiors carry EXIT signage.
- It is also simply **honest**: the property does look both ways depending on when you visit. As of
  this decision it is August, so the summer foliage is the current state and the winter shots are
  the off-season ones.

**Reopen only if a shoot is ever commissioned**, at which point this folds into it for free. Nothing
to do until then.

---

### Correction to [FW-14](#fw-14)

I earlier described the wall-mounted object in `dsc05061` ("Room to breathe") as a **taxidermy
mount**. Having viewed the file directly, it is a **decorative longhorn skull** — a faux/painted
piece that deliberately echoes the longhorn in the company logo, and it appears in three rooms. It is
a consistent brand motif, not taxidermy. The caption mismatch in FW-14 stands; that particular
characterisation was wrong.

---

<a id="fixed-on-this-branch"></a>
# F. Fixed on the `changes` branch

| ID | Issue | Fix |
|---|---|---|
| FW-F1 | Homepage stat card rendered the bare word **"Acres"** with no number | Now `20 licensed beds` / `24/7` / `2026`, sourced from `site.ts` |
| FW-F2 | Footer copyright year hardcoded to `2026` | Derived at build time |
| FW-F3 | Residential FAQ said "a quiet neighborhood", contradicting "private wooded estate" everywhere else | Now consistent with the actual Weatherford property |

Also added, from confirmed facility data: `beds: 20`, `founded: 2026` and the Google review link
(footer, contact page, aftercare alumni card, post-submission screen) — partly addressing
[FW-20](#fw-20).

Verified: `tsc --noEmit` clean, `next build` clean (61 pages), all changes confirmed rendering at
desktop and mobile.

**Open follow-up:** `/about-us` uses "Decades of Experience" as the team eyebrow and says "our team
has decades of experience", which now sits next to "Established 2026" in the footer. Defensible if
it means staff tenure, but a visitor may read it as a contradiction. Worth a wording pass.

---

<a id="appendix-a--checked-and-excluded"></a>
# Appendix A — Checked and excluded

Every row in the tracker was checked for genuine relevance to this site, including rows filed under
other facilities. These were deliberately excluded.

## Mentions this site, but is another site's issue

| ID | Filed under | Why excluded |
|---|---|---|
| V0020 | Dallas Detox | Dallas has a `/fort-worth-drug-rehab` page — a *Dallas* page targeting Fort Worth keywords. Worth knowing a sister site competes for this market, but not a defect here. |
| V0077 | Seaside | Only cites this site's V0040 for comparison. **V0040 itself is included above** — it is a real issue here with no Issues-tab row. |
| V0091 | QHG parent | Asks the *parent* to link out to `fortworthwellness.org`. The reciprocal back-link is a minor possible task here, but the defect is the parent's. |
| V0023 | Dallas Detox | A Dallas copy/locality defect. Two facts worth carrying over: it corroborates [FW-16](#fw-16) ("Weatherford is roughly 30 miles west of Fort Worth"), and it records Dallas Detox showing **100 Mariah Drive, Weatherford** — one door from this site's 101 Mariah Drive. If those are not genuinely separate premises, that is worth resolving before launch. |

## Portfolio rows where this site is already compliant

| ID | Standard | This site |
|---|---|---|
| V0094 | Treatment hub → `/treatment` | Already `/treatment` ✓ |
| V0100 | Privacy policy → `/privacy-policy` | Already `/privacy-policy` ✓ (its `nofollow` is [V0042](#v0042)) |
| V0101 | Blog pattern → `/blog/slug` | Already `/blog/slug` ✓ |

## Portfolio rows that do not involve this site

| ID | Scope |
|---|---|
| V0116 | Preview-vs-production slug changes — Wellness NJ, Greater Texas, Laguna, Ocean Coast |
| V0118 | Geo-suffixed slug contradiction — Marina Harbor, Des Moines, Hillside |
| V0124 | Cutover content-snapshot drift — **explicitly states this site is unaffected** (nothing published after the 15–16 July snapshot; newest content 11 June) |

> **V0124 is worth a second look anyway.** This site is cleared only because it has not published
> recently. If anyone publishes to production before cutover, it becomes affected. The row's own
> advice — re-run the sitemap diff immediately before launch — still applies here.

## Tracker data-quality notes

- **V0040 has no Issues-tab row** — Verification Log only, reachable only via another facility's
  row. Anyone filtering the Issues tab by facility will miss it. Needs a row.
- **V0038 / V0107 are duplicates** of the same defect; V0107 is marked withdraw-and-merge.
- **[V0106](#v0106) undercounts** — names 3 Dallas-named slugs; there are **6**.
- Three other IDs (V0019, V0023, V0046) also exist only in the Verification Log. Of those, only
  V0023 touches this site, and it is another facility's issue.

---

# Recommended sequence

**Every one of the 59 issues appears below exactly once.** If it isn't in a step, it isn't tracked —
so don't drop items, and add any new finding to a step when you log it.

## Step 0 — Send the facility [the questions](#outstanding-questions) today

They gate the largest items and have the longest turnaround. Steps 1 and 2 proceed while you wait.

## Step 1 — Safe now: no decisions, no external input ✅ COMPLETE (18)

> **Count correction.** This heading said **16**; the list contains **18** issue IDs. All 18 are
> done. The 59-issue invariant is unaffected — the miscount was in this heading only, not in the
> item list. (A second miscount of the same kind is noted under [FW-29](#fw-29).)
>
> Completed 2026-08-03. `tsc --noEmit` clean · `next build` clean (62 pages) · `npm run lint` clean.
> Nothing committed — still all working-tree changes on `changes`.

- [x] [FW-01](#fw-01) — `.env` now holds only a comment naming the two real env vars. **Token
      rotation is still outstanding and is the owner's to do.**
- [x] [FW-05](#fw-05) — moved the clearance from `<main>` (footer's *sibling*, which is why padding
      there never worked) to a `md:hidden` spacer between `</footer>` and `<MobileCallBar>`, sized
      `calc(65px + env(safe-area-inset-bottom))` to mirror the bar's own box. 988 line, copyright and
      privacy link all clear. Also removed the now-dead `pb-16` gap above the footer on mobile.
- [x] [FW-06](#fw-06) — `.clarion-chat` lifted to `bottom: calc(78px + env(safe-area-inset-bottom))`
      below `md`. See the caveat in [FW-44](#fw-44): the first attempt silently did nothing because
      Tailwind purged it. **Verified in the compiled CSS, not in the running widget** — Clarion's
      script will not initialise against a non-allowlisted localhost origin, so the final rendered
      position needs one look on a deployed preview.
- [x] [FW-03](#fw-03) — 5 submissions per IP per 10 minutes, sliding window, `429` + `Retry-After`.
      In-memory per serverless instance; see [FW-43](#fw-43) for the durable version.
- [x] [FW-04](#fw-04) — the forwarded origin now derives from the platform-set `host` only. Fixed in
      **both** routes: `api/lead` (the one the issue cited) and `api/clarion/[...path]`, which had the
      identical `req.headers.get('origin')` fallback.
- [x] [FW-40](#fw-40) — all five specified swaps applied. About Us hero `dsc09523` (toilet) →
      `dsc09529` (branded foyer); "Light-filled common areas" `dsc09536` (outdoor pool) → `dsc09526`;
      homepage bedroom `dsc05028` (two queens) → `dsc09532`; "Private resident suites" → `dsc05022`
      (the genuinely single room); `dsc05037` added to the gallery to substantiate the
      "Housekeeping & Laundry Service" amenity.
- [x] [FW-14](#fw-14) — captions reconciled with what the photos show. Also swapped `dsc05013` (the
      **medication room, toilet visible through the open door**) out of the About Us split *and* the
      MHR split — the issue named the gallery caption, but the same file was carrying two page splits
      captioned "living space". `dsc05013` is now referenced on **zero** built pages. Homepage alt
      changed from "private resident suite" to "semi-private bedroom", matching `/about-us`.
- [x] [FW-38](#fw-38) — `public/images/facility/.jpg` deleted (`git rm`); 32 facility files remain.
      **The other 16 unreferenced files were left in place**, and 4 of them are now in use via FW-40.
- [x] [V0039](#v0039) — self-referencing canonical on all 55 pages, via a new `pageMeta()` helper in
      `src/lib/seo.ts`. `_not-found` deliberately has none (it is `noindex`).
- [x] [V0040](#v0040) + [FW-25](#fw-25) — `openGraph` removed from `layout.tsx` and built per page by
      `pageMeta()`, so `og:url` is page-specific on all 55. New `src/app/opengraph-image.tsx` renders
      a 1200×630 brand card via `next/og` (39 KB, no new dependencies, no photo — deliberate, given
      FW-13). One gotcha worth recording: the `opengraph-image` file convention attaches only to its
      own segment, so nested routes still had no `og:image` until `pageMeta()` referenced the
      generated route by path. Verified: 55/55 pages now have canonical + `og:url` + `og:image`.
- [x] [V0042](#v0042) — `robots` override deleted; `/privacy-policy` now inherits `index, follow`.
- [x] [FW-19](#fw-19) — the "general template … reviewed by qualified legal counsel" note no longer
      renders to visitors. Added an `effectiveDate` constant, shown under the `h1` and referenced in
      "Changes to This Policy". **This does not make the policy adequate** — [FW-21](#fw-21) still
      needs counsel.
- [x] [FW-29](#fw-29) — see the note on that issue: fixed **six**, not four.
- [x] [FW-31](#fw-31) — `host` removed from `robots.ts`; static sitemap routes now carry a build-time
      `lastModified`.
- [x] [FW-32](#fw-32) — README's lead-flow section rewritten to describe the actual two-stage
      forms-API path, with the FW-02 gap flagged inline. The "keyboard-navigable menu/FAQ/gallery"
      claim replaced with an accurate statement naming FW-07/08/09 as open.
- [x] [FW-35](#fw-35) — `--header-h` 88px → 72px (the utility bar scrolls away and must not be
      counted). `#verify` is no longer dead: all 7 verification CTAs now target `/admissions#verify`.
      Verified the anchor lands at exactly 72px, flush under the sticky header. The "Admissions"
      *nav* links still point at `/admissions`, unchanged. Compatible with either
      [V0096](#v0096) outcome.
- [x] [FW-34](#fw-34) — `submitLabel` prop added ("Send my message" on contact, "Verify my benefits"
      on admissions); `delivered = !!res && res.ok !== false`; added `error.tsx` (keeps the 24/7 phone
      number reachable on a render failure) and `loading.tsx`; `not-found` now has metadata and is
      `noindex`. `npm run lint` works and passes — installed `eslint`/`eslint-config-next` and added
      `.eslintrc.json`. All 19 findings were `react/no-unescaped-entities` on literal apostrophes in
      patient-facing copy; that one rule is **off**, rather than escaping prose by hand.

### Not done in step 1, and why

- **Three of the four bad heroes remain.** [FW-40](#fw-40) specifies a replacement only for About Us.
  Who We Help (`dsc09539`, debris-filled fire pit), Dual Diagnosis (`dsc05010`, staff desks + fire
  alarm panel) and Treatment/MHR (`dsc09517`, folding tables + a Costco box) are diagnosed there but
  have no prescribed swap, because nothing unused is a better fit. That is [FW-13](#fw-13)'s
  territory — step 7, "re-scope after FW-40". **Re-scoping note: FW-40 did not shrink FW-13 as hoped.**
  A shoot is still needed for a group/therapy room, a dual-diagnosis-appropriate clinical space, and a
  hero for Who We Help.
- **FW-06 is unverified in the browser** — see above.

## Step 2 — Needs one decision from the owner (11 · 6 answered)

Each is a short question, not research. Ask them together.

- [FW-02](#fw-02) **lead backup channel** — email, SMS, or a database row? Highest-consequence issue
  on the site; verified 10 submissions returning success while reaching nothing.
- [FW-43](#fw-43) **durable rate limiting** — a shared store (Vercel KV / Upstash) or a CAPTCHA?
  Both mean a provider choice. New; logged during step 1.
- [x] ~~[FW-45](#fw-45) **analytics platform**~~ — **done**: Vercel Analytics, chosen for being
  cookieless on a site where the URL is a health inference. See the entry for the two caveats.
- [V0108](#v0108) **clinical scope** — gates step 6 entirely
- [V0095](#v0095) / [V0097](#v0097) / [V0098](#v0098) **slug standardisation** — gates step 3
- [V0096](#v0096) `/verify-insurance` — build the page, or keep verification inside `/admissions`?
- [V0099](#v0099) `/faq` — build a hub, or keep the four on-page accordions?
- [FW-16](#fw-16) how to frame a Weatherford address under a Fort Worth brand
- [FW-22](#fw-22) confirm which carriers are current before the logos are corrected
- [FW-41](#fw-41) whether identifiable aerials should be published at all

## Step 3 — After the slug decision ✅ COMPLETE (1)

- [x] [B1](#broken-links) — 20 of the 47 broken link instances now resolve. Waiting for step 2 was
      the right call: the answer ("rename all three") reduced this from five redirect rules to
      three, because two of the targets became real pages. Writing them first would have produced
      two redundant rules pointing at slugs that no longer exist.

**Remaining broken: B2's 8 targets / 27 instances**, still gated on [V0108](#v0108) —
`/treatment-services/inpatient`, `/treatment-services/residential-inpatient`, `/luxury-treatment`,
`/alcohol-detox`, `/benzo-detox`, `/fentanyl-detox`, `/meth-detox`, `/opioid-detox`.

### Found while auditing: 11 internal links point at a redirect

Mostly trailing-slash forms inherited from the Dallas clone — `/tour/`, `/contact/`, `/about/`. They
work, but each costs an avoidable hop. **Deliberately not normalised**, because the slash convention
is [V0102](#v0102)'s open decision and normalising now is exactly the kind of work that gets done
twice. Fold it into V0102.

## Step 4 — Accessibility & layout ✅ COMPLETE (8)

> Completed 2026-08-03. `tsc --noEmit` clean · `next build` clean (62 pages) · `npm run lint` clean.
> 24 DOM/CSS assertions checked against the build output. Still uncommitted on `changes`.

- [x] [FW-07](#fw-07) — the closed panel now carries `invisible`, so `visibility: hidden` drops all
      ~15 links from the tab order and the a11y tree, matching the `aria-hidden` that was already
      there. `inert` was tried first and **React 18 silently drops the attribute** (it ships in
      React 19) — worth revisiting on that upgrade; until then `invisible` is load-bearing.
      A `transition-[visibility]` + `delay-300` keeps the slide-out animation intact.
- [x] [FW-08](#fw-08) — every `group-hover:` state now has a `group-focus-within:` twin, so tabbing
      into the group opens the panel exactly as hovering does. Added `aria-haspopup` and a real
      `aria-expanded` backed by state that tracks hover *and* focus, so it reports the truth while
      tabbing through the panel rather than being hardcoded.
- [x] [FW-09](#fw-09) — `role="dialog"` + `aria-modal`, focus moved to the close button on open and
      returned to the tile that opened it on close, and a Tab focus trap. Added visible
      previous/next buttons: prev/next was arrow-keys only, so on touch you had to close and reopen
      the lightbox for every photo, on the page whose whole purpose is browsing them.
- [x] [FW-10](#fw-10) — a gradient scrim behind the text column only, strongest at the left edge and
      fading out before the right of the frame. Deliberately **not** the full-image dark overlay
      that commit `42ada5c` removed on purpose: the building and sky stay bright, while the gold
      eyebrow (the weakest element) and the `white/80` subtitle get consistent dark backing.
- [x] [FW-11](#fw-11) — `md:row-span-2` on the two wide tiles, so they occupy the two rows their
      height actually fills. The grid arithmetic then works out exactly: 12 single tiles + 2 doubles
      = 20 cells = 5 full rows of 4. **That needed a 14th photo**, so `dsc04989` (communal dining
      room, previously unused) was added — with 13 there was still a trailing gap. Mobile is 14 / 2
      = 7 full rows. Drop a photo and the hole returns.
- [x] [FW-12](#fw-12) — `lg:items-center` → `lg:items-start` so the heading starts level with the
      first photo, and the two lower mosaic tiles went `aspect-square` → `aspect-[4/3]`, cutting
      ~78px off the image column so the two columns start closer in height.
- [x] [FW-23](#fw-23) — measured every logo's true content bounds with `getBBox()` and rewrote each
      `viewBox` to fit. They were filling only **19–42%** of the shared 216×76.29 sprite box
      (ComPsych 19.4%, MultiPlan 42%) — a >2× optical difference at the same rendered height, which
      is exactly the reported symptom. `next/image` now gets each file's real dimensions instead of
      a wrong 160×64 for all eight, and the cell caps both axes (`max-h-10` + `max-w-[140px]`)
      because the tightened ratios span 2.8:1 to 6.25:1 and a single shared height would blow up the
      wide wordmarks. Path data untouched.
      **Left grey on purpose**, and the misleading "white SVG logos" comment corrected instead:
      MultiPlan's mark uses a five-step tonal ramp that flattens into an unreadable blob if forced
      to one colour.
- [x] [FW-44](#fw-44) — fixed in step 1; see that entry.

## Step 5 — SEO & structured data ✅ COMPLETE (4, two partial)

> **Amended after V0099.** [FW-26](#fw-26)'s `FAQPage` markup moved from the four service pages to
> the new `/faq` hub, which is now its single home. Net effect is the same coverage without
> duplicate markup at five URLs; the visible accordions were left in place.

- [x] [FW-26](#fw-26) — `FAQPage` on exactly the four pages with accordions, generated from the same
      `faqs` array the accordion renders so the two cannot drift.
- [x] [FW-27](#fw-27) — `BreadcrumbList` emitted from `PageHero` itself, so all 10 pages using it
      derive the schema from the crumbs they actually display. Added separately to `/blog`,
      `/privacy-policy` and the post template, which render their trails inline. **Verified: 13
      pages + all 42 posts.** The homepage and the 404 correctly have none.
- [~] [FW-28](#fw-28) — added `areaServed`, `hasOfferCatalog` (built from the real `services` list),
      `hasMap`, `logo`, `@id`, and `openingHoursSpecification` in place of the loose `openingHours`
      string. **`geo`, `sameAs` and `priceRange` are deliberately still absent** — each would mean
      inventing a fact: no verified coordinates (and question 6 has the street number itself
      unresolved, 101 vs 100), no social profiles to point at, no published pricing. Reasoning is
      recorded in `organizationSchema()`. **Needs owner input to finish.**
- [~] [FW-30](#fw-30) — measured first: 42/42 posts have no in-body image, but 40/42 already have
      `h2` structure and the median post is only 758 words, so the gap is images, not structure.
      Every post already ships a featured image that was **only ever used as a 30%-opacity hero
      backdrop** — never actually seen. It is now a real lead figure in the article body, giving all
      42 posts one genuine image from assets already in the repo. Verified 42/42.
      **Mid-article topical imagery is not solved** and needs new assets. Worth holding: under
      [V0108](#v0108) path B these posts get rewritten or dropped, so per-post artwork commissioned
      now could be thrown away. Revisit as part of step 6.

## Step 6 — ✅ SUBSTANTIALLY COMPLETE (7)

[V0108](#v0108) answered: **mental-health-first, prune the blog.** Done in one pass, as the row
advised.

- [x] [B2](#broken-links) — all 27 retargeted. **The site now has zero broken internal links and zero
      avoidable redirect hops** (56 targets, all 200).
- [x] [V0104](#v0104) — the clone boilerplate. Found and fixed something this document had missed:
      **"Fort Worth Detox", a non-existent brand, in 29 of 42 posts**, plus an untracked `§DFW§`
      sentinel live in production copy.
- [x] [V0106](#v0106) — 4 of 6 slugs renamed with redirects. The other two are a geo-targeting
      problem, not a slug mismatch; carried into [V0105](#v0105).
- [x] [V0037](#v0037) · [V0041](#v0041) — closed by decision. No substance pages get built.
- [ ] [V0105](#v0105) — **unblocked but not finishable here.** Needs a decision about the *sister*
      site and a content commission. Now the live duplicate-content risk, since the blog was kept.
- [ ] [V0038](#v0038) — unblocked but independent of clinical scope. Still a content decision.
- [FW-24](#fw-24) was done earlier, unbundled from this group.

## Step 7 — Blocked on the facility, counsel, or production access (11)

- [FW-36](#fw-36) remainder — both case managers, once spelling and the Jacci/Jessica bio come back
- [FW-37](#fw-37) psychiatric staffing · [FW-18](#fw-18) Joint Commission accreditation — if either
  is unconfirmed, **the copy changes**
- [FW-17](#fw-17) source or remove the NIH / NAMI statistics
- [FW-21](#fw-21) **COMPLIANCE** — HIPAA Notice of Privacy Practices, No Surprises Act / Good Faith
  Estimate, Terms of Use, accessibility statement. Needs counsel.
- [FW-20](#fw-20) testimonials — needs real reviews to exist first
- [FW-15](#fw-15) real headshots — **request explicitly**; nothing arrives on its own
- [FW-13](#fw-13) photography vs. copy — **re-scope after [FW-40](#fw-40)** · [FW-39](#fw-39) rename
  the 33 facility files (same pass) · [FW-42](#fw-42) reshoot exteriors in one season
- [V0102](#v0102) trailing-slash · [V0103](#v0103) production `/contact` → JPEG — need production access

## Not tracked as work

[V0107](#v0038) is withdrawn (duplicate of V0038). Section [F](#fixed-on-this-branch) is already done.
Appendix A is excluded by design.
