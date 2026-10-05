# Section Library V1 — developer-only integration items

For the developer who connects the prototype to the CMS and the backend. Nothing here is
a design task, and nothing here has been started: the design stage hands the library over
as static HTML + shared CSS/JS, frozen as V1 on 2026-10-05.

`README.md` (next to this file) explains how the library is built and maintained. This
file lists only what is a stand-in today and must be bound, replaced or decided by a
developer before production.

## 1. Stand-ins that must be replaced

| What | Where it is now | What production needs |
|---|---|---|
| **Plan data** — names, prices, quotas, periods, the one-off (`single`) prices | `build/pricing-data.js`, written into each page as a JSON island by `build/pricing.js`; switched by `build/assets/js/60-pricing.js` | The authoritative pricing widget or its data (DEC-0042: none of it may be frozen into page copy). Keep the island's shape or change `60-pricing.js` with it. Then delete `pricing-data.js` |
| **The Recommended plan** | Hard-wired to `standard` in `build/pricing.js` (the card markup), not in the data | Take it from the data source, like the other figures |
| **Forms** — Inquiry form (API, Business & Teams, University) | `<form data-inquiry-form onsubmit="return false" novalidate>`: inert in the prototype | The real submission. Replace the inline `onsubmit` stub with the binding (a `data-*` hook is the library's convention); server-side validation; the success block is already in the markup (`hidden`, `role="status"`) |
| **The checker** in a Hero | `build/checker.js` renders the form; `30-checker.js` only counts words and toggles the demo states (`08-checker.css` holds classes the production binding will toggle) | The production checker component, bound to the same markup and hooks. It is a sealed block (`data-slot="checker"`): an editor copies it as is |
| **The report mock-up** | `build/report.js` → `report.mock()`, static sample data, sealed (`data-slot="report"`) | Stays a static illustration unless the product decides otherwise; if it becomes live, it is a product component, not editor content |
| **Reviews** | `build/reviews.js` — real reviews quoted word for word, as static data | Either keep as curated static quotes, or feed from the review platforms; a card must stay a quotation (text, name, rating as published) |
| **Google Play link** in the footer | A Play Store search URL, marked `PLACEHOLDER LINK` in `build/shell/footer-v2.html` | The app's listing URL when it is live |
| **`noindex`** | `build/shell/head.html` puts `noindex, nofollow` on every prototype page | Remove for production pages; set canonical per page (each generator already passes its own) |

## 2. Rules the validator enforces today that depend on a stand-in

- **Price truth.** `pricing-preview.check.js` compares a section's island and its
  first-paint figures with `build/pricing-data.js`. When the backend data replaces that
  file, re-point this rule at the new source — otherwise a section carrying production
  figures is refused.
- **`onsubmit`.** `inquiry-form.check.js` allows the attribute only with the exact value
  `return false`, and accepts a form without it ("the backend binding takes over"). No
  other inline handler passes.
- **Review words.** The library validator holds a card's shape only; `check-home.js` and
  `check-ua.js` hold the words against `build/reviews.js`. If reviews become dynamic,
  those two page checks go.

## 3. Behaviour that lives in `site.js` (must ship with the CMS pages)

A page assembled from library sections needs the shared `site.css`, `tailwind.css` and
`site.js` and nothing else. The modules a library component relies on:

| Module (`build/assets/js/`) | Used by | What it does |
|---|---|---|
| `20-motion.js` | every component | reveals `.rv` / `.rv-kids` parts on scroll; without JS or with reduced motion everything is visible |
| `18-pen-mark.js`, `22-hero-title.js` | Hero, Report showcase | redraws the underline under an edited word; boxes words typed into a rising title |
| `24-odometer.js` | Stat rail | rolls a figure marked `od-num` |
| `30-checker.js` | Hero (checker slot) | the prototype's word count and demo states — replaced by the production checker |
| `35-form-arrive.js`, `36-inquiry-form.js` | Inquiry form | focuses the first field on arrival (`data-focus-first`); repairs label `for` / field `id` pairs |
| `40-report.js`, `42-report-pass.js` | Report showcase | selecting a passage highlights it and its source; the homepage's scan pass |
| `44-review-rating.js`, `45-carousel.js` | Reviews | repairs a rating's figure and label from `data-rating`; the homepage rail |
| `50-faq.js` | FAQ | the accordion; repairs answer `id` / `aria-controls` pairs |
| `60-pricing.js` | Pricing preview | period switching from the island |

The repair scripts exist so an editor never keeps two attributes in step by hand. They
run once at load; a server-side render that already writes correct pairs loses nothing.

## 4. CMS workflow

- **Validate a paste before publishing:** `node build/check-library.js --stdin < paste.html`
  (or a file path). Exit code 1 on an error; warnings do not fail. This is the one step
  worth wiring into the CMS save hook or a CI job.
- **Tailwind and CMS-only sections.** Library CSS is written outside `@layer` on purpose,
  so a section that exists only in the CMS (and not in `build/` or `site/`) still has its
  styles. A sealed block keeps Tailwind utilities; they are compiled because the same
  block exists in the repo's pages. A new utility typed into the CMS would not be.
- **`data-component` names changed** when families were merged (`hero-checker`,
  `hero-hub`, `hero-facts` → `hero`; `lifecycle-rail` → `steps` or `feature-cards`;
  `report-dark`, `report-light` → `report-showcase`; `trust-rail`, `proof-rail` →
  `stat-rail`; `reviews-carousel` → `reviews`). Anything outside this repo that selects
  by the old names needs updating.

## 5. Small technical debts, invisible to a visitor

- The step lists on AI Detector and API are `div > div`, not `ol > li`; the homepage's
  audience card names are `p`, not `h3`. Retagging changes nothing on screen, but the
  parity harness has no acceptance for a tag change — add one, then retag.
- `hero.css` uses `:has()` once; a browser without it places one hero head 8px lower at
  desktop width.
- Three glows on the homepage and one on the plain CTA band are written with classes
  Tailwind 3 does not compile (`bg-orange-500/12` and the like), so they never painted.
  The empty elements are kept to hold the DOM; drawing or deleting them is a design
  decision that is still open.
- `data-focus-first` is on the Business & Teams form only.
- `site/testimonials-v2.html` does not render repeatably in the parity harness (its
  moving rows); its geometry and behaviour are checked, its pixels are not.

## 6. Not tested in the design stage

Browsers other than Chrome; a paste into the real CMS editor; hover states by eye.
