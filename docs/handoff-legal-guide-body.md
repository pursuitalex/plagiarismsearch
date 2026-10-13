# Handoff: plain-HTML typography for Legal pages and User Guide articles

Self-contained. Written 2026-10-13 for the developer who moves existing content into the
redesigned templates. It extends the approach already approved for blog articles
(`.article-body`) to two more templates, each with its own approved look.

## What it does

Existing documents are plain semantic HTML: `<h2>`, `<p>`, `<ul>`, `<table>` with no
classes. The redesigned templates set every element with its own utility classes, and the
site's reset (Tailwind preflight) leaves a class-less element with no type of its own.
Two container classes fix that:

| Class | Template | Put it on |
|---|---|---|
| `.legal-body` | Legal pages (Privacy Policy, Terms of Use, Cookie Policy) | the `<article>` that holds the document — in the prototype `<article class="min-w-0 legal-body">` |
| `.guide-body` | User Guide articles | the element that holds the article's content, after the title, the meta line and "On this page" — in the prototype `<div class="rv guide-body">` |

Inside such a container, **only elements without a `class` attribute** are styled. Anything
that carries classes — every element of the approved pages, any component placed inside a
document — is left alone. Nothing outside the container is touched.

## Files

| File | What changed |
|---|---|
| `build/assets/css/26-legal-guide-body.css` | **new** — all the CSS, two blocks: `LEGAL` and `GUIDE`. Compiled into `site/assets/css/site.css`. |
| `build/legal.js` | the `<article>` of the Legal template gets `legal-body`; section ids are made unique. Output of the three pages is otherwise byte-identical. |
| `build/article.js` | the content wrapper of the article template gets `guide-body`; section ids are made unique; a block type `html` passes a plain document through. |
| `site/policy.html`, `site/terms-of-use.html`, `site/cookie-policy.html` | one class added on `<article>` — nothing else |
| `site/plagiarism-and-ai-check-report.html` | one class added on the content `<div>` (and a comment above it) — nothing else |
| `build/body-plain.js`, `build/plain/*.body.html` | **new** — build four proof pages (below) |
| `build/check-body-plain.js` | **new** — static checks |
| `build/assets/css/26-article.css` (the blog's `.article-body`) | **not changed** |

## What to transfer to production

1. Copy the whole of `build/assets/css/26-legal-guide-body.css` into the production
   stylesheet, as it is. Plain CSS: no Tailwind config change, no plugin, no JavaScript,
   no `!important`, no new dependency. Load order does not matter — every selector weighs
   exactly one class, which beats preflight's element selectors and never beats a utility.
2. Add `legal-body` to the Legal template's document container and `guide-body` to the
   User Guide template's content container (table above). One class each; no other markup.
3. Output the document's HTML inside that container as it is.
4. Keep these out of the container — the template sets them itself:
   - the document's `<h1>` (it goes in the masthead);
   - on a Legal page, the line the document dates itself with ("Last Updated: …");
   - "On this page", breadcrumb, meta line.
5. Give every `<h2>` a unique `id` and build "On this page" from the `<h2>`s. The CSS
   cannot do this. In the prototype the id is a slug of the heading text and a repeated
   heading gets `-2`, `-3`. The CSS does give headings `scroll-margin-top: 7rem`, so a
   heading reached from the contents stops 112px from the top, clear of the fixed header.

## The CSS, in short

Every selector has one shape:

```css
.legal-body :where(h2:not([class])) { … }
.guide-body :where(ul:not([class]) > li, ol:not([class]) > li, :not(ul, ol, menu) > li:not([class])) { … }
```

Covered in both: `p`, `h2`–`h6`, `ul`, `ol`, `li` (nested too), `dl`, `a`, `strong`/`b`,
`code`, `pre`, `blockquote`, `table`, `img`, `hr`, `small`, `sup`/`sub`. Guide also:
`figure`/`figcaption`, `iframe`/`video`, `mark`, and list items that stand outside a list.

The two blocks are different styles, each measured on its approved template:

| | Legal | Guide |
|---|---|---|
| body text | 15.5 / 16 / 17px, line-height 1.75 | 15.5 / 16 / 17px, line-height 1.72 |
| `h2` | 19 / 20 / 22px | 21 / 23 / 26px |
| `h3` | 16 / 17 / 18px | 17 / 19 / 20px |
| `ul` marker | teal dot | teal tick |
| `ol` | numbered disc, text at 36px | numbered disc, text at 40px |
| links | teal, regular weight | teal, semibold |

(three values = under 640px / from 640px / from 1024px)

A wide table never widens the page: under 640px a plain table scrolls inside itself. On a
Legal page it does so from one edge of the screen to the other and is 640px wide inside,
exactly as the approved Cookie Policy table.

## Verified

All at 375, 768 and 1440px, in Chrome.

- **Approved pages unchanged.** `node build/parity/run.js <page>` compares each approved
  page with the last commit — pixels, every element's box and computed style, behaviour:
  Privacy Policy, Terms of Use, Cookie Policy and the approved User Guide article.
- **Plain equals classed.** Each approved page was loaded twice; in one copy every class
  inside the container was removed and the drawn list markers and wrappers taken out, so
  the content was plain HTML. Result on all four pages: no block moves (0.00px), page
  height identical, and no differing pixels at 375 and 768px. At 1440px the Legal pages
  differ in 0.14–0.29% of pixels — anti-aliasing of list-item text, in the same position,
  size, weight and colour; not visible to the eye. The Guide article: 0 pixels at all
  three widths.
- **A real document from source.** `legal-plain-cookie-policy.html` is the Cookie Policy
  built straight from the live site's HTML: it reads word for word as the approved page
  and matches it pixel for pixel at 375 and 768px.
- **Whole archive.** All 14 live User Guide articles were placed in the Guide template as
  served: none widens the page at any width; pictures stay in the column with their
  proportions; code blocks scroll inside themselves.
- **Contents.** On every proof page each "On this page" link has its heading, ids are
  unique, and headings land 112px from the top.

Proof pages (prototype only, not pages of the site):

| Page | What it is |
|---|---|
| `legal-plain-cookie-policy.html` | the Cookie Policy from the live site's plain HTML |
| `legal-elements.html` | every Legal element once: h2–h6, long headings, nested lists, table, code, quotation |
| `guide-plain-storage.html` | a live User Guide article (`/plagiarism-database`): 11 sections, lists, 3 screenshots |
| `guide-elements.html` | every Guide element once, including the archive's own shapes |

## How to verify after transfer

1. Open an approved Legal page and the approved User Guide article — they must look as
   before.
2. Put a plain document in each template. Check: headings are distinct by level; lists
   have their markers; links are teal and underlined; a long URL wraps.
3. At 375px: no horizontal page scroll; a wide table scrolls inside itself.
4. Click every "On this page" link: the heading stops below the header.
5. In this repository: `node build/check-body-plain.js`.

## Limitations

**Legal archive — nothing to fix.** The three live documents carry no classes and no
inline styles; lists are flat; there is one table.

**User Guide archive — to clean at transfer** (found in the 14 live articles):

| Case | Where | What happens | What to do |
|---|---|---|---|
| Word-paste classes `p.MsoNormal`, `p.MsoNoSpacing`, some with inline `line-height` / `margin` | *different-options-in-search-filters* (13 paragraphs) | not styled — they carry a class | remove the `class` and `style` attributes |
| Hidden paste leftovers: `<div style="position:absolute; left:-10000px…">` | three articles, 77 blocks | stay off-screen, but are read by search engines and screen readers | delete them |
| Old page-layout classes: `process-step`, `why-us-item`, `h1.h1.bold`, `h3.text-center`, `p.subtitle`, `a.my-button` | *how-plagiarism-checker-work*, *how-to-use-plagiarismsearch-checker*, *organization-management* | these are designed pages, not articles; their headings and step blocks are not styled | need a design decision — not plain-article content |
| `<li>` outside any `<ul>`/`<ol>` | *interpreting-plagiarismsearch-similarity-report* | **handled**: set as list items | optional: wrap in `<ul>` |
| Screenshot inside a list item after `<br>` | *spell-checker-manual* | **handled** | — |
| Inline `style` on `<span>` (report colours) and `<img style="width:65%">` | two articles | inline styles win, as intended | — |

A class was deliberately not overridden: styling elements that carry classes would also
reach the approved pages' own elements and any component inside a document.

**No approved example exists for these**, so each continues its template's scale and
should be confirmed by the designer:
Legal — `h5`, `h6`, nested lists, `blockquote`, `pre`, `hr`, pictures;
Guide — `h4`–`h6`, nested lists, `blockquote`, pictures and captions, tables, `code`/`pre`,
`hr`. Guide screenshots get a hairline and a 12–16px radius.

**Not verified.**
- Any browser other than Chrome. Firefox and Safari were not available for this work. The
  rule most worth a look there is the Legal table on a phone: its 640px inner width comes
  from an empty table caption. If a browser ignored it, the table would be narrower and
  still scroll or wrap — nothing would widen the page.
- Elements that are styled but had no test content: Legal — pictures; Guide — `iframe`,
  `video`, `dl`.
- Link hover states, print, and right-to-left text.

**Browsers.** `:where()`, `:not()` lists and `counter(list-item)` need 2021+ browsers.
`:has()` is used for one spacing rule in the Guide (a paragraph holding only a picture);
older browsers fall back to normal paragraph spacing.

**Approved behaviour worth knowing.** On a phone the approved Cookie Policy table starts at
the very edge of the screen, with no left gutter. Plain tables on Legal pages follow it,
so both look the same. Not changed — reported for a decision.

**An embedded `<style>` block or inline `style` in a document wins** over these rules.

**The blog's `.article-body` is unchanged**; no issue was found in it during this work.
