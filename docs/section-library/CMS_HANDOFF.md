# Section Library — CMS handoff

For the owner who assembles pages in the staging CMS, and for the developer who connects
that CMS to the shared assets and the widgets. Written from the audit of 14 October 2026,
repository HEAD `76d63e5` (the same commit Vercel serves).

> **Status.** No snippet has been pasted into the real CMS yet. Everything below about the
> CMS is a simulation in Chrome of the behaviour the developer described (one extra outer
> `<div>`, valueless attributes turned into `="1"`). Link rewriting could not be simulated:
> its rules are unknown. Nothing here is *verified* for the CMS until the trial in §6 passes.

Related: `SECTION_MANIFEST_2026-10-14.csv` (every snippet, one row), `LIBRARY_AUDIT.md`
(findings and evidence), `DECISION_LOG.md` (approved decisions; proposals not implemented).

---

## 1. What a CMS page needs before any snippet works

Every snippet expects the same shared files, and nothing of its own.

In the page `<head>`, in this order:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@1,6..72,400;1,6..72,500&family=Flow+Circular&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="stylesheet" href="/assets/css/tailwind.css">
<script>(function (h) {h.classList.add('js');if (!matchMedia('(prefers-reduced-motion: reduce)').matches) h.classList.add('js-motion');setTimeout(function () { if (!window.PS_READY) h.classList.remove('js', 'js-motion'); }, 3500);})(document.documentElement);</script>
<script defer src="/assets/vendor/gsap/3.12.5/gsap.min.js"></script>
<script defer src="/assets/vendor/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script defer src="/assets/js/site.js"></script>
```

Source of this block: `build/shell/head.html` + `build/assets.js` `head()`. The files are
built by `node build/assets.js` into `site/assets/`. `site.css` must load before
`tailwind.css`. The inline script must stay inline in the `<head>`: it switches the
scroll-reveal styles on, and switches them off again after 3.5 s if `site.js` never arrives,
so content is never left invisible.

The `<body>` keeps `class="font-sans text-ink-900 bg-white"`. Snippets go inside `<main>`.

---

## 2. How to copy a snippet (owner)

1. **Take the HTML from one of these, and only these:**
   - the catalogue's copy field: `https://plagiarismsearch.vercel.app/section-library.html`,
     field `#snippet-N` (the manifest's `catalogue_anchor`);
   - the snippet file `build/sections/snippets/<variant_id>.html` — identical to the field;
   - a published page's **source** (View Source), copying one whole `<section>`.

   **Never copy from the browser's DevTools (Elements → Copy outerHTML).** The rendered DOM
   carries the scripts' "ready" flags (`data-faq-ready="1"`, `data-carousel-ready="1"` …);
   a FAQ or a reviews carousel pasted that way never wakes up — tested, §7 of the audit.
2. **Paste the whole snippet**: one element from its first `<section …>` to its last
   `</section>`. Two FAQ snippets are blocks for inside another section, not sections
   (`faq-grid-embedded`, `faq-frame-doc`).
3. **Change only what the component's contract lists as editable** — the catalogue prints it
   under each component ("Що редактор може змінювати"), the manifest repeats it in
   `editable_fields` and `allowed_variants`. In short: the words, the link addresses, and
   the listed `data-*` values. Leave every class, wrapper `<div>`, icon `<svg>` and every
   `data-slot` block exactly as copied.
4. **Give the section a page-level `id`.** Snippets carry example ids (`example-faq`,
   `example-pricing`, `uq-0` …). Rename the section's id to a short, unique, stable slug
   (`pricing`, `faq`, `contact`). Inner ids of the FAQ and the inquiry form are repaired by
   their scripts at load; every other id must be unique on the page by hand.
5. **Fix the links.** Snippets link to prototype files (`prices.html`, `vip.html`,
   `payment.html#plan=…`). Replace each with the production URL (`URLS.md` maps every
   prototype file to its live path). A link that starts with `#` must point to an `id` that
   exists on the same page — the checker and form scripts follow such links to put the caret
   in the field. Keep `target="_blank"` only together with `rel="noopener"`.
6. **One H1 per page.** Only Hero snippets carry an `<h1>`. Use exactly one Hero per page;
   every other section starts at `<h2>`.
7. **Alternate surfaces.** Neighbouring sections should not share a ground; switch with the
   section's `data-bg` where the contract allows it (white ↔ tint).
8. **Check the paste** before publishing:
   `node build/check-library.js --stdin < paste.html` — exit code 1 means an error.
   ⚠ Until decision B4 is taken, a paste that went through the CMS's attribute rewrite fails
   on four snippets for that reason alone (`hero-center`, both `pricing-preview`,
   `reviews-carousel`). Validate the paste **before** saving it into the CMS.

---

## 3. What can be pasted, per component

Status is the audit's classification (see the manifest). "Shared JS" means the module in
`site.js` that must be present; without JavaScript every one of these sections still shows
all its content (tested; the reviews carousel's arrow buttons are controls and need it).

| Component | Snippets | Status | Shared JS | Notes for the editor |
|---|---|---|---|---|
| Steps | 10 | READY_STATIC | reveal only | `steps-rows-icon` has no live example (stored rendering) |
| Feature cards | 6 | READY_STATIC | reveal only | `feature-cards-inline-head` has no live example (stored rendering) |
| Sources | 5 | READY_STATIC | reveal only | `sources-flow` has a sealed diagram (`data-slot="media"`) |
| CTA band | 8 | READY_STATIC | reveal only | button links often point to `#checker`: keep that id on the page or change the link |
| Banner | 5 | READY_STATIC | reveal only | |
| Start free | 2 | READY_STATIC | reveal only | its button goes to the page's checker |
| Stat rail | 2 | 1 READY_STATIC, 1 READY_WITH_SHARED_JS | `24-odometer.js` (roll) | figures are product claims: change only with an approved source |
| FAQ | 8 | READY_WITH_SHARED_JS | `50-faq.js` | copy a whole `.faq-item` to add a question; ids repair themselves |
| Reviews | 2 | READY_WITH_SHARED_JS | `45-carousel.js`, `44-review-rating.js` | a card is a real, published review: text, name and rating word for word |
| Hero (hub, no checker) | 2 | READY_WITH_SHARED_JS | `18-pen-mark.js` | carries the page's only `<h1>` |
| Hero (with checker) | 5 | WIDGET_INTEGRATION | `30-checker.js` | the checker is a prototype: it counts words and submits nowhere |
| Pricing preview | 2 | WIDGET_INTEGRATION | `60-pricing.js` | prices come from a data island; see §5 |
| Inquiry form | 3 | WIDGET_INTEGRATION | `36-inquiry-form.js` (+ `35-form-arrive.js`, `37-dropdown.js`) | submits nowhere (`onsubmit="return false"`) |
| Report showcase | 5 | CMS_TEST_REQUIRED | `40-report.js` | the report mock-up uses inline `style=""`; see §5 |

---

## 4. What cannot be pasted safely yet

Do not put these on a public page until the listed condition is met.

| What | Why | Condition |
|---|---|---|
| **Hero with checker** (`hero-split`, `-split-path`, `-split-facts`, `-split-notice`, `hero-center`) | The form is a prototype: `onsubmit="return false"`, no `action`. A visitor would paste a text and nothing would happen. | The developer's checker widget replaces `data-slot="checker"` |
| **Inquiry form** (all three) | Looks live, sends nothing. Mandatory fields and consent are inconsistent (decision B6). | Real submission binding and server-side validation; B6 settled |
| **Pricing preview** (both) | Figures are prototype data from `build/pricing-data.js`; they live in a `<script type="application/json">` island a sanitizer may strip. Without it the tabs do nothing and one-time prices stay on screen. | B2: production price source decided and the island (or a widget) proven to survive the CMS |
| **Report showcase** (all five) | 8 inline `style=""` values draw the meters and legend; a sanitizer that strips them leaves figures without bars. | B5, or the trial proves `style` survives inside `[data-slot="report"]` |
| **Any page-specific section** (spot-cards, photo-split, pptx-proof, canvas-proof, discounts-offers …) | Not library members: no contract, no validator, no catalogue snippet. Many rely on page-only CSS or JS. | Rebuild through a page generator, or a library decision (B12) |
| **Blog, Legal, User Guide articles** | These are templates with a content wrapper (`.article-body`, `.legal-body`, `.guide-body`), not sections. | Use the template; paste the article's own HTML inside its wrapper (see `docs/handoff-legal-guide-body.md`) |

---

## 5. Developer checklist (independent of the owner's steps)

**Shared assets**
- [ ] Serve `site/assets/css/site.css`, `tailwind.css`, `js/site.js` and `vendor/gsap/3.12.5/*` from one place, for every CMS page; keep §1's order.
- [ ] Keep the inline boot script in `<head>` (not deferred, not moved to the footer).
- [ ] Rebuild `tailwind.css` only from the repository (`node build/assets.js`): sealed blocks use utilities that exist there only because the same blocks are on repository pages (B14).
- [ ] `site.js` initialises once, after `DOMContentLoaded` (`PS.start`). Content the CMS injects later (live preview, AJAX) is not initialised unless `PS.start()` is called again; every module skips elements it has already set up.

**Sanitizer** — must let through, or the named block breaks:
- [ ] all `data-*` attributes, `aria-*`, `role`, `tabindex`, `hidden`;
- [ ] inline `<svg>` with `path`, `circle`, `rect`, `line`, `polyline`, `use` and their attributes;
- [ ] `<template data-pricing-feat>` and `<script type="application/json" data-pricing-data>` (Pricing preview);
- [ ] `style=""` inside `[data-slot="report"]` (Report showcase) and in the Guide article's colour list — or B5 / B8;
- [ ] `<form>`, `<input>`, `<select>`, `<textarea>`, `<button>` (the checker and the inquiry forms, before the widgets replace them).

**Links** — tell the owner how the CMS rewrites them, and keep:
- [ ] in-page links as `href="#id"` (the checker and form scripts select `a[href^="#"]`; an absolute rewrite of an in-page link loses the caret-to-field behaviour);
- [ ] the fragment of `payment.html#plan=…&period=…` (the payment page reads it);
- [ ] `target` and `rel` as written.

**Attributes and wrappers**
- [ ] The added outer `<div>` and `data-x` → `data-x="1"` were simulated on all 65 snippets: no visible change, the same behaviour (§7 of the audit). Confirm on the real CMS in the trial.
- [ ] Do not drop `data-component`: the Legal phone fix is keyed to `[data-component="legal"]` (B7).
- [ ] If the library validator runs in the CMS save hook, settle B4 first.

**Widgets and backend**
- [ ] Checker: bind the production checker to `data-slot="checker"` (hooks `[data-checker]`, `[data-checker-text]`, `[data-checker-count]`, `[data-switch]`).
- [ ] Inquiry forms: replace `onsubmit="return false"` with the binding; validate server-side; the success block (`role="status"`, `hidden`) is already in the markup.
- [ ] Pricing: production source for plans, prices, the Recommended plan (hard-wired to `standard` in `build/pricing.js`) and the order links (B2).
- [ ] Footer Google Play link is a placeholder (`build/shell/footer-v2.html`).

**Per-URL SEO metadata** (not part of any snippet)
- [ ] `<title>` and `meta description` per URL (the prototype has a description on 24 of 56 pages).
- [ ] `canonical` per URL (24 of 56 prototype pages have one); `hreflang` for language versions (none in the prototype); Open Graph (none); structured data (none).
- [ ] Remove the prototype's `noindex` (`build/shell/head.html`, on all 56 pages) for production URLs only.
- [ ] One `<h1>` per page (true for every prototype page except the internal catalogue).

---

## 6. The smallest safe staging-CMS trial

Three blocks, on one **unpublished, noindex** staging page. Nothing here has been done yet.

### Procedure for every block

1. Keep the original: `build/sections/snippets/<file>` at commit `76d63e5` (the manifest
   gives its path; `SNIPPET_INDEX_2026-10-14.json` gives its SHA-256).
2. Paste it into the CMS as described in §2, save, publish to the staging URL.
3. Collect three artefacts:
   **(a)** the original file; **(b)** the HTML as the CMS stored it (export, API, or the staging
   page's View Source); **(c)** the rendered DOM after load (DevTools → Copy outerHTML of the
   section — for comparison only, never to paste).
4. Compare (a)→(b): every change the CMS made — wrapper, attribute values, links, removed
   elements or attributes, whitespace. Compare (b)→(c): only the scripts' changes are
   expected (the "ready" flags and the states listed below).
5. In the browser at 375, 768 and 1440: no console error, no failed request for
   `/assets/…`, no horizontal scroll (`document.documentElement.scrollWidth` equals the
   window width), `window.PS_READY === true`.

### T1 — a static block: Banner · row (`banner-row.html`, catalogue `#snippet-58`)

- Why: no script of its own; one relative link (`vip.html`) shows how the CMS rewrites links.
- Pass: the section looks as in the catalogue at all three widths; the only differences
  (a)→(b) are the outer `<div>` and the link, and the link points to the production VIP
  page; the button works with the keyboard (Tab, Enter).
- Fail: any class, `data-*`, `aria-*` or `<svg>` removed or renamed; the link broken.

### T2 — a shared-JS block: FAQ · fluid (`faq-fluid.html`, catalogue `#snippet-42`)

- Why: the accordion module, its id / `aria-controls` repair, and two relative links.
- Expected in (c): the list carries `data-faq-ready="1"` exactly once; every `.faq-q` has
  `aria-controls` naming an existing, unique `.faq-a` id; `aria-expanded` changes on click
  and on Enter.
- Pass: questions open and close by mouse and keyboard, one at a time; ids unique; no errors.
- Fail: answers do not open; duplicate ids; `data-faq` removed by the sanitizer.

### T3 — a controlled complex block: Pricing preview · center (`pricing-preview-center.html`, catalogue `#snippet-38`)

- Why: it is the only block whose behaviour depends on an inline JSON island, a
  `<template>` and fragment links (`payment.html#plan=…`). Use it only on the
  unpublished staging page: its figures are prototype data.
- Expected in (b): `<script type="application/json" data-pricing-data>` present and
  unchanged; `<template data-pricing-feat>` present.
- Expected in (c): the section carries `data-pricing-ready="1"`; clicking a period tab
  changes the prices; the "Recurring payments" switch changes the monthly prices and hides
  the note when off; each plan button's link carries `#plan=…&period=…`.
- Pass: all of the above at three widths, no errors.
- Fail: the island is stripped (the tabs then do nothing, silently); the fragment is
  removed from the order links.

The inquiry form is deliberately not in the trial: it must not appear on any reachable
page before its binding exists. Test it with the developer's binding, not before.
