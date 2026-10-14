# Section Library — source-of-truth audit

**14 October 2026 · audit only: no page, design, code, copy or price was changed.**
Everything in this folder is new; nothing outside `docs/section-library/` was written.

Deliverables in this folder:

| File | What it is |
|---|---|
| `SECTION_MANIFEST_2026-10-14.csv` | one row per copyable snippet (65), the 29 requested columns |
| `LIBRARY_AUDIT.md` | this report |
| `CMS_HANDOFF.md` | copy procedure for the owner, checklist for the developer, the CMS trial plan |
| `DECISION_LOG.md` | approved decisions retained; this audit's proposals, not implemented |
| `SNIPPET_INDEX_2026-10-14.json` | read-only index of the 65 snippet files with SHA-256 (the optional export: the HTML is not duplicated, the committed files are the source) |
| `audit-tools/` | the scripts that produced every number below; they only read the repository |
| `evidence/` | their raw outputs |

**Rule used throughout: no unverified claim.** A statement is either backed by a command
and its output in `evidence/`, or marked `NOT TESTED` / `UNKNOWN` / `NOT FOUND`.
**Nothing was inserted into the real CMS.** Every CMS statement is a simulation.

---

## 1. Executive summary

- **Parity.** Branch `main`, HEAD `76d63e568a05a626159e60a5e219c316dcea196c` = `origin/main` =
  the Vercel production deployment (GitHub deployments API: status `success`,
  2026-10-13 12:19:43 UTC). 398 of 399 tracked files under `site/` are byte-identical on
  Vercel; the 399th is `site/vercel.json`, a config file Vercel does not serve.
  Regenerating everything (38 page generators, catalogue, snippets, `site.css`,
  `tailwind.css`, `site.js`) on a copy of HEAD changed **0 files**: nothing generated is stale.
- **Totals now.** 13 components + 3 primitives (unchanged). **65** catalogue snippets
  (was 66; one retired 2026-10-07). **108** library instances on **24** pages (was 92 on
  26). **145** page-specific sections on 39 pages, plus 7 template sections, 10 sections on
  6 typography proof pages and 19 on the internal spec sheet (the old "172" is not
  comparable: see §3).
- **Readiness of the 65 snippets:** READY_STATIC **37** · READY_WITH_SHARED_JS **13** ·
  WIDGET_INTEGRATION **10** · CMS_TEST_REQUIRED **5** · PAGE_SPECIFIC **0** (none is in the
  catalogue) · BLOCKED **0**. All 65: real CMS **NOT TESTED**.
- **Validation:** `node build/check-library.js` exit 0 — 55 pages and 65 snippets pass,
  321 bad pastes rejected, 140 allowed edits accepted. Chrome, 375 / 768 / 1440, every
  snippet alone, as published and CMS-simulated: 0 script errors, 0 overflow, identical
  pixels and behaviour in both forms; content visible with JavaScript off.
- **Most important CMS risks:** (1) prototype forms look live — hero checker and inquiry
  forms submit nowhere; (2) a sanitizer that strips `<script type="application/json">`
  silently freezes the pricing preview, one that strips `style=""` blanks the report's
  meters; (3) after the described attribute rewrite (`data-x` → `data-x="1"`) the
  library validator rejects 4 snippets although they still work; (4) copying from the
  browser's rendered DOM produces dead FAQ and carousel blocks; (5) link rewriting is
  unknown — 10 snippets carry `#fragment` links whose targets live elsewhere on the page.
- **What we need from you:** how the CMS rewrites links; whether its sanitizer keeps
  `<script type="application/json">`, `<template>`, `style=""`, `data-*`, `aria-*` and inline
  SVG; the production pricing source; the checker and form endpoints; and one staging page
  for the three-block trial (`CMS_HANDOFF.md` §6).

---

## 2. Phase A — the source and the deployment

| Item | Finding | Evidence |
|---|---|---|
| Branch | `main` | `git branch --show-current` |
| HEAD | `76d63e568a05a626159e60a5e219c316dcea196c` (2026-10-13 15:19 +0300) | `git rev-parse HEAD` |
| `origin/main` | same commit; nothing unpushed | `git fetch`; `git log origin/main..HEAD` empty |
| Vercel deployment commit | `76d63e5…`, environment Production, state `success` at 2026-10-13T12:19:43Z, deployment `plagiarismsearch-l8u2g3fir-…vercel.app` | public GitHub API `repos/pursuitalex/plagiarismsearch/deployments` |
| Deployed content | 398 / 399 tracked `site/` files byte-identical to HEAD; `site/vercel.json` 404 (config, not served — expected) | `audit-tools/vercel-parity.js` → `evidence/vercel-parity.json` |
| Build command on Vercel | **UNKNOWN** (needs Vercel dashboard access). Observed behaviour: the repository commits the built `site/`, and Vercel serves `site/` at the root with no build step; `site/vercel.json` only adds an `X-Robots-Tag: noindex` header | `curl -I`, `site/vercel.json` |
| Local build command | `npm run build:assets` → page generators → `node build/section-library.js` → `node build/urlmap.js` / `node build/pages.js` → `node build/shell.js` | `package.json`, `build/*.js` headers |
| Generated files out of date | **none**: on a copy of HEAD, all 38 generators + catalogue + assets + shell reproduced every tracked file byte for byte | snapshot run, `git status` clean |
| Local changes | `.claude/launch.json` modified (tool config, not the site); untracked `new-tasks/google-play-assets/`, `new-tasks/new-page-7/`, `new-tasks/pay-icons/`, `store-assets/` (never deployed) | `git status` |
| Catalogue = source | the 65 copy fields on `section-library.html` equal the 65 files in `build/sections/snippets/` exactly | `audit-tools/catalogue-browser.js` |

---

## 3. Totals — now against the 5 October report

| Measure | 5 Oct (historical) | 14 Oct (current) | Why it differs |
|---|---|---|---|
| Components | 13 | **13** | — |
| Primitives | 3 | **3** (Section Header, Action, Icon tile; plus the hosted pen mark) | — |
| Catalogue snippets | 66 | **65** | `cta-band-plain-orange` retired in `c240e56` (2026-10-07): no page uses it after the free-tool pages became one version each |
| …of them sections / embedded blocks | — | 63 / 2 (`faq-grid-embedded`, `faq-frame-doc`) | |
| …with no live page | — | **2** stored renderings (`feature-cards-inline-head`, `steps-rows-icon`, `build/sections/kept/`) | their page (first Affiliate version) was removed 2026-10-07 |
| …re-rendered after the freeze | — | **10** (5 hero with checker, 2 pricing, 2 FAQ, 1 report) | approved page changes: drop zone, recurring switch, order links, help links |
| Contract variant attributes | — | **97** across 13 contracts | counted from `*.contract.js` |
| Library instances on the site | 92 | **108** (106 top-level sections + 2 FAQ blocks embedded in other sections) | Canvas (+8), PowerPoint (+7), Support & FAQ (FAQ ×4 + inquiry form) added; versions consolidated |
| Pages with library instances | 26 | **24** | v1/v2 duplicates and the old free-tool versions removed on 2026-10-07 |
| Page-specific top-level sections | 172 (132 names) | **145** on 39 pages | the old count's scope is not documented; the current split is below |

All 290 top-level `<section>` elements in `<main>` across the 55 pages (the catalogue page
excluded) reconcile:

| Kind | Sections | Pages |
|---|---|---|
| Library instances | 106 | 23 (+1 page with only an embedded FAQ block → 24) |
| Page-specific | 145 | 39 |
| Template sections on approved pages (Blog article 3, Legal 3, User Guide article 1) | 7 | 5 |
| Stub pages | 3 | 3 |
| Typography proof pages (Blog ×2, Legal ×2, Guide ×2) | 10 | 6 |
| Internal spec sheet (`design-system.html`) | 19 | 1 |
| **Total** | **290** | — |

Section **instances** are counted per occurrence; **unique pages** once each; **page-only
sections** are the 145; **reusable variants** are the 65 snippets (and, within contracts,
the 97 variant switches an editor may set).

---

## 4. Families — current mapping

`data-component` is the name in the HTML; the file stem is the same in `build/sections/`.

| Family | Snippets | Status (snippets) | Instances / pages | Template · contract · check · catalogue · CSS | Shared JS |
|---|---|---|---|---|---|
| hero | 7 | 5 WIDGET_INTEGRATION, 2 READY_WITH_SHARED_JS | 9 / 9 | `hero.js` · `.contract.js` · `.check.js` · `.catalogue.js` · `hero.css`; checker: `build/checker.js` | `18-pen-mark`, `22-hero-title` (center), `30-checker` |
| stat-rail | 2 | 1 READY_STATIC, 1 READY_WITH_SHARED_JS | 2 / 2 | `stat-rail.*` | `24-odometer` (roll) |
| steps | 10 | 10 READY_STATIC | 13 / 10 | `steps.*` | reveal only |
| feature-cards | 6 | 6 READY_STATIC | 6 / 6 | `feature-cards.*` | reveal only |
| sources | 5 | 5 READY_STATIC | 6 / 6 | `sources.*` | reveal only |
| report-showcase | 5 | 5 CMS_TEST_REQUIRED | 8 / 8 | `report-showcase.*`; report: `build/report.js` | `40-report`, `42-report-pass` (quiet), `18-pen-mark` |
| start-free | 2 | 2 READY_STATIC | 3 / 3 | `start-free.*` | reveal only (its link goes to the page's checker) |
| pricing-preview | 2 | 2 WIDGET_INTEGRATION | 3 / 3 | `pricing-preview.*`; switch and cards: `build/pricing.js`; data: `build/pricing-data.js` | `60-pricing` |
| reviews | 2 | 2 READY_WITH_SHARED_JS | 2 / 2 | `reviews.*`; quotes: `build/reviews.js` | `45-carousel`, `44-review-rating` |
| faq | 8 | 8 READY_WITH_SHARED_JS | 25 / 17 | `faq.*` | `50-faq` |
| cta-band | 8 | 8 READY_STATIC | 20 / 20 | `cta-band.*` | reveal only |
| banner | 5 | 5 READY_STATIC | 7 / 7 | `banner.*` | reveal only |
| inquiry-form | 3 | 3 WIDGET_INTEGRATION | 4 / 4 | `inquiry-form.*`; fields: `build/assets/css/14-forms.css` | `36-inquiry-form`, `35-form-arrive`, `37-dropdown` |

All files exist (none `NOT FOUND`). "Reveal only" = `20-motion.js`, which every section
uses and which is safe without JavaScript. Library CSS (`build/sections/*.css`) is
compiled into `site/assets/css/tailwind.css`; `build/assets/css/NN-*.css` into
`site/assets/css/site.css`; all modules into `site/assets/js/site.js`.

**Old names.** The renames recorded in `build/sections/INTEGRATION.md` (`hero-checker`,
`hero-hub`, `hero-facts` → `hero`; `lifecycle-rail` → `steps` / `feature-cards`;
`report-dark`, `report-light` → `report-showcase`; `trust-rail`, `proof-rail` → `stat-rail`;
`reviews-carousel` → `reviews`) were searched in every page, script and stylesheet: **no
stale use remains** (only the ignored parity-harness output keeps a historic copy). No
script selects by `data-component`; one stylesheet rule does (`[data-component="legal"]`, §5).

**Catalogue drift.** The chapters' "where used" tables omit Canvas Integration (8
instances), PowerPoint (7) and Support & FAQ (FAQ ×4, inquiry form) — decision B9. Four
live configurations pass the validator but are not shown as snippets (Canvas hero
`hub`+`long`, Canvas steps cards ×4 columns, Canvas feature-cards grid ×3, UA banner glow
`coral-soft`) — B11.

---

## 5. Scope matrix — newer pages, templates and wrappers

| Page / template | What it is | Library parts | Page-specific / sealed parts |
|---|---|---|---|
| **Canvas Integration** (`build/canvas.js`) | page assembled from the library + proof | hero (hub, `data-slot="media"` drawn loop, CSS `36-canvas-hero.css`), steps ×2, sources, feature-cards, banner, FAQ, CTA band | `canvas-proof` (screenshot tabs + zoom: `35-evidence.css`, `52-evidence.js`), `ai-compare`, `submission-types`, `setup-paths` — **one-off** |
| **PowerPoint Plagiarism Checker** (`build/powerpoint.js`) | page assembled from the library + proof | hero (checker), report showcase, steps ×2, pricing preview, FAQ, CTA band | `pptx-content-types`, `pptx-proof` (tabs, HTML-drawn slides), `split-card`, `trust-strip` — **one-off** |
| **Blog article** (`site/blog-best-checker-2026.html`, hand-written) | **template** with content wrapper `.article-body` | — | masthead, contents rail, article body, author block (3 sections) |
| **Legal** (`build/legal.js` → Privacy, Terms, Cookie) | **template** with content wrapper `.legal-body` | — | one section `data-component="legal"`: masthead, contents, document, "Also in legal" |
| **User Guide article** (`build/article.js` → `plagiarism-and-ai-check-report.html`) | **template** with content wrapper `.guide-body` | — | one section `data-component="article"`; the colour list carries 6 inline `style=""` |
| Typography wrappers `.article-body` / `.legal-body` / `.guide-body` | **separate content wrappers**, not sections: they style class-less HTML inside one container. Sources: `build/assets/css/26-article.css` (`.article-body`, unchanged since `0009e07`), `build/assets/css/26-legal-guide-body.css` (`.legal-body`, `.guide-body`, `76d63e5`) | — | proof pages: `blog-affiliate-programs`, `blog-article-elements`, `legal-plain-cookie-policy`, `legal-elements`, `guide-plain-storage`, `guide-elements` |
| Payment, Thank you (`build/payment.js`, `build/thank-you.js`) | **sealed widget** (prototype) | — | order summary filled from the address fragment by `62-payment.js`; JSON islands; prototype data |
| Discounts (`build/discounts.js`) | **one-off** | — | coupon + offer banners; `63-copy-text.js`; one example offer is made up (`AUTUMN20`) |
| 404 (`build/not-found.js`) | **one-off** | — | needs `<base href="/">` in its head |
| Section Library catalogue, design-system, pages index | internal review pages | — | not site pages |

**The Legal template depends on `data-component="legal"`:** `site.css` keys its phone
overflow fix to `[data-component="legal"]` (two rules). If production drops or renames that
attribute, long strings could widen the page on phones again (B7).

---

## 6. Phase B — CMS copy contract and risks

Classification rules (applied per snippet in the manifest): WIDGET_INTEGRATION when the
visible shell depends on a backend or widget (checker, pricing, forms); CMS_TEST_REQUIRED
when a known sanitizer behaviour would visibly break it and the CMS's behaviour is
unknown (report); READY_WITH_SHARED_JS when it needs a `site.js` module beyond the
reveal; otherwise READY_STATIC. Every row also carries `REAL CMS NOT TESTED`.

### 6.1 The wrapper `<div>`
- No stylesheet rule depends on a section being a child of `<main>` or `<body>`, on a
  sibling section, or on a section's position: searched all 1,203 selectors of `site.css`
  and all 608 selectors of the library's own CSS (`build/sections/*.css`). The only
  `html`-anchored library rules are the FAQ's no-JavaScript fallback
  (`:where(html:not(.js)) .faq-a`), which does not involve the wrapper.
- The validator reports a section that is not a direct child of `<main>` as a **warning**,
  not an error.
- Simulated on all 65 snippets at three widths: 0 differing pixels, identical behaviour.

### 6.2 Valueless attributes → `="1"`
- 29 distinct valueless attributes occur in snippets (e.g. `data-faq`, `data-carousel`,
  `data-pricing-animate`, `data-recurring`, `hidden`, `required`, `novalidate`; full list
  per row in the manifest). Every script reads them by presence (`hasAttribute`, `[attr]`
  selectors) — read in the code and confirmed by the simulation. No stylesheet rule tests
  an empty value (`[data-x=""]`).
- **The library validator does not accept them.** After the rewrite, 4 snippets fail
  `check-library.js`: `hero-center` (`data-hero-title`, `data-hero-support`),
  `pricing-preview-center` and `-split` (`data-pricing-animate`, `data-period-note`),
  `reviews-carousel` (`data-carousel*`). The wrapper alone causes no error. Decision B4.

### 6.3 Links and fragments
- 41 relative links to prototype `.html` files, 18 in-page `#fragment` links, 14 absolute,
  2 `mailto`, across the 65 snippets. All `.html` links must be mapped to production URLs
  (`URLS.md`) — the CMS's own rewriting rule is **UNKNOWN**.
- 10 snippets link to an id outside themselves (`#checker`, `#ai-checker`, `#ai-pricing`,
  `#pdf-text-extraction` …): the target must exist on the assembled page.
- `30-checker.js` and `35-form-arrive.js` select `a[href^="#"]` to put the caret in a form
  after an in-page jump. If the CMS rewrites `#checker` into an absolute URL, the jump may
  still scroll but the caret behaviour is lost.
- Pricing order links carry the order in the fragment (`payment.html#plan=…&period=…`);
  the payment page reads it. A rewrite that drops fragments breaks the order hand-off.

### 6.4 Scripts, styles, forms
- `<script>` inside snippets: only the pricing data islands (`type="application/json"`),
  2 snippets. **Simulated without the island:** no error, the section shows its
  first-paint one-time prices, the period tabs do nothing.
- `style=""`: only inside the sealed report (`data-slot="report"`), 8 per report snippet
  (meter widths, legend colours). **Simulated stripped:** 1,118 px change — meters and
  legend dots blank while the percentages remain.
- Forms: the hero checker (5 snippets) and the inquiry forms (3) carry
  `onsubmit="return false"` and no `action`. Inquiry fields marked `*` in their labels are
  `required` only in `inquiry-form-chips` (4 fields); the consent box is never
  `required`; `inquiry-form-cool` (API) has no consent box. Real submission path: **NOT FOUND**.

### 6.5 Ids, headings, initialisation
- Every snippet's ids are unique within it; example ids (`example-*`, `uq-*`, `bq-*`, `aq-*`)
  must be renamed per page. FAQ answer ids and inquiry field ids are repaired by their
  scripts; all others are the editor's responsibility.
- Headings: only Hero snippets carry `<h1>` (7); others start at `<h2>`. Every site page has
  exactly one `<h1>` except the internal catalogue.
- `site.js` runs every module once after `DOMContentLoaded`. Each module marks what it set
  up (`data-faq-ready="1"` …) and skips it next time. **Simulated:** HTML copied from the
  rendered DOM carries those marks — the FAQ and the carousel then never wake up.
  Composed page: each module initialised exactly once per instance, as published and
  CMS-simulated.

### 6.6 The high-risk components

| Component | Finding |
|---|---|
| FAQ | accordion works by mouse and keyboard on all 8 snippets; `aria-controls` → answer id pairs valid and unique after load; works after the CMS simulation; dead if copied from the rendered DOM |
| Pricing preview | `[data-slot="pricing-periods"]`, `[data-slot="pricing-plans"]`, island `script[type="application/json"][data-pricing-data]` from `build/pricing-data.js`; `60-pricing.js` switches periods and the recurring switch (center snippet); the validator checks the island against `build/pricing-data.js`; production price source **NOT FOUND**; Recommended plan hard-wired to `standard` in `build/pricing.js` |
| Hero checker | `[data-slot="checker"]` sealed; `30-checker.js` counts words (tested) and follows in-page links to focus the field; replacement widget **NOT FOUND** |
| Inquiry form | prototype `onsubmit="return false"`; label/field pairs repaired (tested); submit does nothing and the success block stays hidden (tested); required/consent inconsistencies above |
| Reviews | `data-rating` repaired by `44-review-rating.js`; quotes are verified word for word by `build/check-home.js` and `build/check-ua.js` against `build/reviews.js`; platform icons from `site/assets/svg/`; carousel arrows are hidden until hover or focus on pointer devices, by design (`reviews.css`) |
| Stat rail | `24-odometer.js` rolls `.od-num` in `stat-rail-roll` only; figures are product claims |
| Report showcase | `[data-slot="report"]` (and `media` in `report-showcase-quiet`) sealed; passage → source selection works (tested); figures are a static illustration; inline styles at risk (above) |

---

## 7. Phase C — validation actually run

All runs on HEAD `76d63e5`, Windows, **Chrome only** (Playwright `channel: 'chrome'`).
Firefox, Safari and mobile devices: **NOT TESTED**.

| Check | Command / tool | Result |
|---|---|---|
| Library contracts | `node build/check-library.js` | exit 0; 55 pages with library markup, 65 snippets pass; 321 bad pastes rejected, 140 allowed edits accepted, 0 failures; 10 warnings (aside slots of host components) — `evidence/check-library.out` |
| Site integrity | `node build/check.js`, `node build/shell.js --check` | all ok (56 pages); 53 pages, 0 stale |
| Catalogue page | `audit-tools/catalogue-browser.js` | 375/768/1440: no error, no overflow, `PS_READY`; 65 copy fields = 65 snippet files exactly |
| Every snippet alone | `audit-tools/snip-browser.js` | 65 snippets × 3 widths × {as published, CMS-simulated}: 0 errors, 0 overflow, `PS_READY` true, 0 differing pixels between the two forms, identical behaviour (FAQ toggle + keyboard, carousel move, pricing switch + recurring, report selection, checker count, inquiry pairs + inert submit); JavaScript off: all content visible except the carousel's hover arrows (by design); motion on: all reveals finish, no errors — `evidence/snip-browser.json` |
| Composed page (rebuilt — the 5 Oct page is **NOT FOUND** in the repository) | `audit-tools/composed.js`: 13 sections, one per component | validator: 0 errors as published; 7 errors after the attribute rewrite (B4). Chrome 375/768/1440: no errors, no overflow, each module once per instance, no repeated ids, same in both forms — `evidence/composed.out` |
| Sanitizer / copy cases | `audit-tools/sanitizer-cases.js` | island removed → pricing frozen silently; `style` removed → report meters blank (`evidence/case-report-side.png`); copied from rendered DOM → FAQ and carousel dead — `evidence/sanitizer-cases.out` |
| Validator after the CMS rewrite | `audit-tools/validator-cms.js` | 4 / 65 fail on `="1"` alone; 0 on the wrapper alone — `evidence/validator-cms.json` |
| Keyboard / focus | inside the snippet run | FAQ question focusable and toggles on Enter; hover/focus states by eye: **NOT TESTED** |

Not done in this audit: a real CMS insertion; link rewriting; any browser other than
Chrome; screen readers; print.

---

## 8. Discrepancies and actions

| # | P | Discrepancy | Action (owner of it) |
|---|---|---|---|
| D1 | P0 | Real CMS behaviour unobserved; all compatibility is simulated | Run the trial, `CMS_HANDOFF.md` §6 (owner + developer) |
| D2 | P0 | Hero checker and inquiry forms submit nowhere but look live | Bind before any public page (developer) — B3 |
| D3 | P0 | Pricing figures are prototype data in a script island; stripping it fails silently | Decide the source and the CMS path (developer) — B2 |
| D4 | P1 | Validator rejects CMS-normalised valueless attributes (4 snippets) | Decision B4 (owner) |
| D5 | P1 | Report mock-up (and the Guide colour list) depend on inline `style=""` | Decisions B5, B8 |
| D6 | P1 | Inquiry form required fields and consent inconsistent; API form has no consent | Decision B6 (owner + legal) |
| D7 | P1 | Legal phone fix keyed to `[data-component="legal"]` | Keep the attribute (developer) — B7 |
| D8 | P1 | Copying from the rendered DOM breaks FAQ and carousel | Copy rule in `CMS_HANDOFF.md` §2 — B13 |
| D9 | P2 | Catalogue "where used" tables omit Canvas, PowerPoint, Support & FAQ | B9 |
| D10 | P2 | Two catalogue snippets have no live page | B10 |
| D11 | P2 | Four live configurations not shown in the catalogue | B11 |
| D12 | P2 | Ten recurring page-specific families outside the library | B12 (only on a concrete need) |
| D13 | P2 | Utilities in sealed blocks exist only because repo pages use them | B14 |
| D14 | P2 | The 5 Oct composed demonstration page is not in the repository | Rebuilt here as a script (`audit-tools/composed.js`) |
| D15 | P3 | `INTEGRATION.md` names `site/testimonials-v2.html` (now `testimonials.html`) | B16 |
| D16 | P3 | Empty tracked file `=` at the repository root | B15 |
| D17 | P3 | Vercel project settings (root directory, build command) not readable | Export from the Vercel dashboard if needed |

---

## 9. Open questions for you

1. How does the CMS rewrite links — relative to absolute, prototype paths to production
   paths, and does it keep `#fragments` (both in-page and in `payment.html#plan=…`)?
2. Does its sanitizer keep `<script type="application/json">`, `<template>`, `style=""`,
   every `data-*` / `aria-*` / `role` / `tabindex`, and inline `<svg>` with `<use>`?
3. Is the added outer `<div>` always the same element, and does it carry attributes?
4. Does the CMS run any script on save or render (minification, lazy-loading images,
   adding ids)?
5. Where will production prices come from, and should the pricing preview stay as HTML or
   become the developer's widget?
6. Which endpoints receive the checker and the inquiry forms, and who owns consent wording?
7. Will the library validator run in the CMS save hook? If yes, B4 must be settled first.
8. Can we get one unpublished staging URL for the three-block trial?

---

## 10. How to reproduce

```bash
node docs/section-library/audit-tools/inv.js
```
```bash
node docs/section-library/audit-tools/instances.js
```
```bash
node docs/section-library/audit-tools/deps.js
```
```bash
node docs/section-library/audit-tools/validator-cms.js
```
```bash
node docs/section-library/audit-tools/snip-browser.js
```
```bash
node docs/section-library/audit-tools/manifest.js
```

The tools read the repository and write only into `docs/section-library/evidence/` (and
`manifest.js` into this folder). Browser tools need Chrome installed and the project's
`node_modules`. Running them again from the repository reproduced the manifest byte for byte.
