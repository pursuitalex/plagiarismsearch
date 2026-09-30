# Shared production assets

Replaces the Tailwind Play CDN and the `<style>`/`<script>` blocks that every page
carried. **Status: every page is on it.** The 11 master pages (Home, Students, PDF, UA, Organization,
University, Turnitin, Pricing, API, AI Detector, Moodle Integration) were migrated first,
each passing its parity run against the approved page at commit `04c8e24`. The
design-system page is on it too (checked against `db7d735`), and so are the report guide
and the Newsroom (checked against `40f96a2`). The v1 pages were retired on 2026-09-30, and the same day every remaining page moved
too: stubs, legal, the user guide, the badges, the prototype index and the hand-written
pages (Help Center, Blog, Why Us, Mission, Contact, VIP, Account and the free tools). No
page uses the Play CDN; every head is build/shell/head.html with the shared assets.

The design-system page adds two files of its own, `ds.css` and `ds.js` (source
`build/assets/ds/`, linked with `head({ ds: true })`): the spec sheet around the
components, such as swatches, rendered ramps, the state list and copy-to-clipboard. The
components it shows come from `site.css` and `site.js`, exactly as on every page.

## Output

| File | What | Source |
|---|---|---|
| `site/assets/css/site.css` | our CSS | `build/assets/css/NN-*.css`, concatenated in file order |
| `site/assets/css/tailwind.css` | Tailwind utilities + preflight | `tailwind.config.js`, tailwindcss **3.4.17** + autoprefixer |
| `site/assets/js/site.js` | our JS | `build/assets/js/NN-*.js`, one module per component |
| `site/assets/vendor/gsap/3.12.5/` | GSAP + ScrollTrigger | `node_modules/gsap`, pinned |
| boot snippet (inline, `<head>`) | `.js` / `.js-motion` + fail-safe | `build/assets/js/boot.js` |

Build: `npm run build:assets`. Every version is pinned exactly in `package.json`.

## What a page puts in `<head>`

```html
<link rel="stylesheet" href="/assets/css/site.css">
<link rel="stylesheet" href="/assets/css/tailwind.css">   <!-- AFTER site.css: see Cascade -->
<script>/* boot.js, inlined */</script>
<script defer src="/assets/vendor/gsap/3.12.5/gsap.min.js"></script>
<script defer src="/assets/vendor/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script defer src="/assets/js/site.js"></script>
```

That is the whole page-level CSS/JS. `build/page.js` writes it: a generator passes its
title, meta, canonical, `lang` and its sections, and nothing else. The body holds only
markup. The one `<script>` a body may hold is data: a pricing section's JSON island.

## The model

1. **Tailwind is compiled.** tailwindcss 3.4.17 is the version the Play CDN served
   (cdn.tailwindcss.com → /3.4.17) and the version every page was approved under. The theme
   in `tailwind.config.js` is the inline config, verbatim, and `build/check.js` compares
   the two. Autoprefixer runs with the targets in `build/assets.js`, which reproduce every
   prefix the CDN produced (a few harmless extras are added). **Do not minify with
   `tailwindcss --minify`**: it rewrote a colour lossily (caught by the parity run). A new
   utility written into markup needs a rebuild, because only classes the build has seen exist.
2. **Cascade.** `site.css` comes first and `tailwind.css` last. The CDN appended its sheet
   after our `<style>` blocks, so on equal specificity a utility has always won. Inside
   `site.css` the partial order is also part of the design. For example, `06-controls-phone`
   must precede `08-checker` (see the note in that file).
3. **CSS belongs to components, not pages.** A rule that exists for one component lives in
   that component's partial, even if the component is used once. No page carries CSS.
   Where two approved pages drew the same component differently, the difference is a named
   variant, never a page selector. The migration found five and kept each as a variant;
   all five were unified on 2026-09-30, so there are none today.
4. **Markup keeps its utilities.** Every top-level element of `<main>` has a stable root
   hook, `data-component="…"`, and the behaviour hooks it needs (catalogue below).
5. **No id is a CSS or JS hook.** Ids exist for in-page anchors and for accessibility
   pairs only.
6. **Accessibility ids are rendered, not scripted.** `label for`/`id` on the checker field
   and `aria-controls`/`id` on the FAQ are written by the template, namespaced per instance
   (`student-checker-text`, `student-faq-a3`). The HTML is correct before JS runs, and JS
   never creates or rewrites them.
7. **JS is modular in source, one file in production.** Each module registers an init.
   Every init wires each instance it finds by its `data-*` hook, once (`data-*-ready`),
   inside its own try/catch. Two of the same component on one page do not share state.
   Nothing in `site.js` looks up a page id.
8. **Progressive enhancement.** Every piece of content is in the HTML. Reveals hide content
   only under `html.js-motion`, the FAQ collapses only under `html.js`, code panels are all
   visible without JS, and the pen and ring marks show their final state without JS. The
   boot snippet removes both classes if `site.js` has not reported in within 3.5 s. The
   motion module removes `.js-motion` if GSAP is missing. Scroll-triggered animations are
   tracked, and whatever a page can never scroll to (a short page, a section that ends
   one) plays once the page is at its end. Reachable triggers fire where they always did.
9. **Inline `style=""` only for data.** Report bar widths, legend colours, star ratings
   and a screenshot's own width stay inline. Decorative values are classes: orb presets
   (`.orb-hero-teal` …), `.ring-mark`, `.dot-field`, `.cta-glow-*`, `.hero-link-tile.is-top`.
10. **Surfaces are declared.** `data-surface="dark"` switches the focus ring. It is never
    inferred from a background utility.
11. **Paths.** Assets are root-relative (`/assets/…`). The SVG `<pattern>` dot field
    became a CSS background, so no SVG ids are left in reusable sections.
12. **Prices come from one source.** A pricing section renders its initial period from
    `build/pricing-data.js` (the stand-in for the backend) and carries the same data once as
    a JSON island. The script only switches periods. Nothing is typed into a page by hand.

## Hooks (site.js modules)

| Module | Hook | Does |
|---|---|---|
| header | `[data-site-header]`, `[data-nav-burger]`, `[data-nav-panel]`, `[data-to-top]` | phone dock, burger, back to top |
| motion | `.rv`, `.rv-kids` (`data-stagger`), `.pen-word`, `.ring-word`; on an ancestor `data-rv-start`, `data-rv-delay` | reveals and marks |
| hero-title | `[data-hero-title]` + `[data-hero-support]` | words rise, support follows, pen draws |
| odometer | `.od-num` | statistics roll |
| checker | `form[data-checker]`, `[data-checker-text]`, `[data-checker-count]`, `[data-switch]` | count, switches; an in-page link to the form focuses its field |
| form-arrive | `form[data-focus-first="ms"]` | a link to the form focuses its first field |
| report | `[data-report]` (`.cab-mark`, `.cab-src`) | select a passage |
| report-pass | `[data-report-doc]`, `[data-report-side]`, `[data-report-scan]` | the scan plays once |
| carousel | `[data-carousel]`, `-track`, `-prev`, `-next`, `-dots` (`data-dot-label`) | reviews rail |
| faq | `[data-faq]` | accordion |
| pricing | `[data-pricing="period"]`, JSON island, `template[data-pricing-feat]` | period switch |
| ai-package | `[data-ai-package]`, `[data-purchase-hook="ai-package"]` | package pick |
| package-cta | `[data-group]` + `[data-cta]` | button names the package |
| code | `[data-code]` | code sample tabs, copy |
| ai-check | `form[data-ai-check]`, `[data-too-short]`, `[data-auth-gate]` | the AI checker flow |
| doc-nav | `[data-doc-nav]`, `[data-spy]`, `details[data-jump]`, `[data-jump-now]` | section spy, jump menu |
| modal | `[data-modal-open="id"]`, `.md`, `[data-close]` | open, close, Escape, focus trap and return |
| news-archive | `[data-archive]`, `.tp-btn[data-topic]`, `.news-item`, `.yr-group`, `[data-pager]` (`-count`, `-nums`, `-prev`, `-next`), `[data-archive-empty]` | topic filter and pager; words in data-* |

Component recipes with no behaviour live in `site.css` only: buttons (`.btn`), badge,
field (`.fld`), checkbox, radio and chipset (`05-recipes`), and the checker's states
(`.qc-*.is-*`, in `08-checker`), which the binding to the production checker toggles.

## Proof

`node build/parity/run.js <page.html>` (real Chrome, 375 / 768 / 1440), against the page
as approved at `04c8e24` (or the commit a page names in `build/parity/pages.js`):

0. CDN CSS ⊆ static CSS, rule by rule; extras are prefixes only
1. title, meta, canonical, lang and the text of `<main>` identical
2. full-page pixels, exact
3. every element × 65 computed properties + box (a border colour on a zero-width border is
   not compared: it is never painted)
4. behaviour on both pages: first view, checker, report, FAQ, periods, code tabs, the
   checker link, page extras (`build/parity/pages.js`), back to top, focus rings, dock, burger
5. reduced motion, no JS, GSAP blocked, `site.js` blocked
6. reuse: every top-level `[data-component]` served alone in an empty page with only the
   shared assets, compared pixel by pixel and element by element at three widths, then its
   behaviour alone

Third-party responses (fonts, the CDN) are recorded once per run and replayed to both
pages, so text metrics cannot drift between them. A pixel difference is measured twice, in
fresh browser contexts, and passes only if the second measurement is exactly 0.

A difference that was decided rather than missed is named in `build/parity/pages.js`
with its reason: `accept` (a behaviour key), `acceptPixels` (bounded anti-aliasing at
one width, with geometry identical) or `acceptGeometry` (a whitelist of properties). The
run prints each one as ACCEPT, and anything outside it still fails. `--section=<name>`
runs only the reuse test for one section. Output goes to `build/parity/out/`.
