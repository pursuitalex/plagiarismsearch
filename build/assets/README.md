# Shared production assets

Replaces the Tailwind Play CDN and the `<style>`/`<script>` blocks that every page
carried. **Status: proof of concept on Students only**
(`site/plagiarism-checker-for-students-poc.html`). The other master pages still use the
CDN until each is migrated and passes its parity run.

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

That is the whole page-level CSS/JS. The body holds only markup.

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
4. **Markup keeps its utilities.** A reusable section has a stable root hook,
   `data-component="…"`, and the behaviour hooks it needs: `data-checker`, `data-report`,
   `data-faq`, `.cta-band`.
5. **No id is a CSS or JS hook.** Ids exist for in-page anchors and for accessibility
   pairs only.
6. **Accessibility ids are rendered, not scripted.** `label for`/`id` on the checker field
   and `aria-controls`/`id` on the FAQ are written by the template, namespaced per instance
   (`student-checker-text`, `student-faq-a3`). The HTML is correct before JS runs, and JS
   never creates or rewrites them. The one exception would be a component whose instances
   are created in the browser (none today).
7. **JS is modular in source, one file in production.** Each module registers an init.
   Every init wires each instance it finds by its `data-*` hook, once (`data-*-ready`),
   inside its own try/catch. Two of the same component on one page do not share state.
   Nothing in `site.js` looks up a page id.
8. **Progressive enhancement.** Every piece of content is in the HTML. Reveals hide content
   only under `html.js-motion`, the FAQ collapses only under `html.js`, and the pen and ring
   marks show their final state without JS. The boot snippet removes both classes if
   `site.js` has not reported in within 3.5 s. The motion module removes `.js-motion` if
   GSAP is missing. Scroll triggers are `clamp()`ed, so a section that ends a page still
   reveals.
9. **Inline `style=""` only for data.** Report bar widths and legend colours stay inline.
   Decorative values are classes: orb presets (`.orb-hero-teal` …), `.ring-mark`,
   `.dot-field`, `.cta-glow-*`.
10. **Surfaces are declared.** `data-surface="dark"` switches the focus ring. It is never
    inferred from a background utility.
11. **Paths.** Assets are root-relative (`/assets/…`). The SVG `<pattern>` dot field
    became a CSS background, so no SVG ids are left in reusable sections.

## Proof

`npm run parity:students` (real Chrome, 375 / 768 / 1440):

- CDN CSS ⊆ static CSS, rule by rule
- full-page pixels, exact
- 699 elements × 65 computed properties + box
- behaviour on both pages
- reduced motion, no JS, GSAP blocked, `site.js` blocked
- four sections copied verbatim into `site/poc-sections.html`, compared element by element
  and pixel by pixel

Output goes to `build/parity/out/`.
