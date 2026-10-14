# Section Library — decision log

Audit of 14 October 2026, repository HEAD `76d63e5` (= `origin/main` = the Vercel production
deployment). Part A records decisions already taken; nothing in it is reopened by this
audit. Part B lists changes this audit proposes. **None of Part B is implemented.** Each
needs an explicit approval before anyone acts on it.

Companion documents: `LIBRARY_AUDIT.md` (findings), `CMS_HANDOFF.md` (copy instructions),
`SECTION_MANIFEST_2026-10-14.csv` (one row per snippet).

---

## Part A — approved decisions, retained

| # | Date | Decision | Source |
|---|---|---|---|
| A1 | 2026-10-01 | The pilot (FAQ + Section Header) is the model for every reusable section: one template, semantic editor-friendly markup, a content contract, a validator, a catalogue snippet. Not to be re-discussed. | pilot merge `81c019d`; tag `level-a-baseline` |
| A2 | 2026-10-01 | Section rhythm `data-space` `md` / `lg` stays a legitimate variant. | pilot review |
| A3 | 2026-10-01 | The UA layout `fluid-narrow` (0.8fr / 1.2fr) stays a variant. | pilot review |
| A4 | 2026-10-01 | One intro size; the eyebrow pill's background follows the section's `data-bg` and is never set per pill. | pilot review |
| A5 | 2026-10-01 | An embedded FAQ grid carries no margin utilities; its host spaces it. | pilot review |
| A6 | 2026-10-01 | FAQ answer `id` / `aria-controls` pairs are repaired by `50-faq.js` at load; the validator only warns about copied ids. The same rule was applied to the inquiry form's label/field pairs (`36-inquiry-form.js`). | pilot review; Wave 1 |
| A7 | 2026-10-01 → 05 | Waves 1–3: CTA band, Banner, Inquiry form; Hero, Steps, Feature cards, Sources, Start free; Report showcase, Pricing preview, Stat rail, Reviews. | scaling approval |
| A8 | 2026-10-05 | **Section Library V1 frozen** as the design handoff (`7b967fc`): 13 components + 3 primitives (Section Header, Action, Icon tile). No extension without a concrete page need. No CMS or backend integration during the design stage; developer items live in `build/sections/INTEGRATION.md`. | `7b967fc`, report of 2026-10-05 |
| A9 | 2026-10-05 | Sealed blocks are copied as they are and are not editor content: the checker (`data-slot="checker"`), the report mock-up (`data-slot="report"`), pricing periods and plans with their data island (`data-slot="pricing-periods"`, `"pricing-plans"`), diagrams and media (`data-slot="media"`). | V1 |
| A10 | 2026-10-05 | About page Team and Timeline are page-specific (`build/about/`), not library members. | V1 report |
| A11 | 2026-10-07 | One drop zone on every check form; the hero checker snippets were re-rendered with it. | `bdbfa0d`, `cb3e7a4` |
| A12 | 2026-10-07 | One version of each free-tool page; the snippet `cta-band-plain-orange` was retired because no page uses that configuration any more (66 → 65 snippets). | `c240e56` |
| A13 | 2026-10-07 | Final versions take their pages' names (Testimonials, Scholarship, Affiliate). Two catalogue examples read from the removed first Affiliate page are kept as stored renderings in `build/sections/kept/` (`feature-cards-inline-head`, `steps-rows-icon`). | `0f8f5b9` |
| A14 | 2026-10-07 | The "Recurring payments" switch is an optional part of the Pricing preview; the period note hides when the switch is off (2026-10-12). | `0f8f5b9`, `9262bf6` |
| A15 | 2026-10-12 | Every plan button leads to `payment.html` with the order in the address fragment (`#plan=…&period=…[&recurring=on]`). | `7e1758a` |
| A16 | 2026-10-12 / 13 | Canvas Integration and PowerPoint Plagiarism Checker are assembled from library components plus page-specific proof sections (see `LIBRARY_AUDIT.md` §5). | `9262bf6`, `029178f`, `7e1758a` |
| A17 | 2026-10-13 | Three independent typography wrappers for plain HTML: `.article-body` (Blog article), `.legal-body` (Legal), `.guide-body` (User Guide). They are content wrappers, not landing sections; each keeps its own approved type. | `0009e07`, `76d63e5` |
| A18 | standing | The GitHub repository is public: brief archives and internal screenshots stay local and untracked. | owner rule |

### Open decisions carried over from the 5 October report (unchanged, none blocks use)

- the dark accent card on Blog and four other pages;
- the plain CTA band on eight older pages;
- spot-card title sizes on v2 pages;
- whether the hero template grows;
- the Why us band;
- glows written with classes Tailwind 3 does not compile, so they never painted;
- about eight micro-variants kept only for parity.

---

## Part B — proposed by this audit, NOT implemented

Priority: **P0** blocks a safe CMS launch · **P1** must be settled before the affected block
is used in the CMS · **P2** should be settled · **P3** housekeeping.

| # | P | Proposal | Why (evidence) | Who decides |
|---|---|---|---|---|
| B1 | P0 | Run the three-block staging-CMS trial in `CMS_HANDOFF.md` §6 before any page is assembled. | CMS behaviour (link rewriting, wrapper, attribute normalisation, script and style sanitising) is described, not observed. Every compatibility statement in this audit is a simulation. | Owner + developer |
| B2 | P0 | Decide where pricing figures come from in production, then either let the JSON island through the CMS or replace it with the developer's widget. | With the island removed, the section keeps its first-paint (one-time) prices and the period tabs do nothing, silently (`LIBRARY_AUDIT.md` §7, case 1). | Developer |
| B3 | P0 | Bind the inquiry forms and the hero checker to real endpoints before publishing any page that carries them; until then they must not be published. | Both forms carry `onsubmit="return false"` and have no `action`: they look live and submit nothing. | Developer |
| B4 | P1 | Let the library validator accept a hook attribute whatever its value (`data-carousel="1"`), or accept `"1"` explicitly. | The developer described `<div data-x>` → `<div data-x="1">`. After that change 4 of 65 snippets fail `check-library.js` (hero-center, pricing-preview-center, pricing-preview-split, reviews-carousel) although the scripts still work. If the validator is wired into the CMS save hook as `INTEGRATION.md` §4 suggests, those saves would be refused. | Owner (it changes `build/sections/*.check.js`) |
| B5 | P1 | Move the report mock-up's 8 inline `style=""` values (meter widths, legend colours) into classes, or have the developer allow `style` inside `[data-slot="report"]`. | If a sanitizer strips `style`, the meters and legend dots go blank — the report then shows figures without their bars (1,118 px change, §7 case 2). | Owner + developer |
| B6 | P1 | Settle the inquiry forms' mandatory fields and consent: labels show `*` but `required` is set only on the Business form; the consent box is never `required`; the API form has no consent box. | Read from the three snippets (§6.4). Validation will be the binding's, but the markup and the consent wording are content decisions. | Owner + legal |
| B7 | P1 | Keep `data-component="legal"` on the Legal section in production, or move its two overflow rules onto `.legal-body`. | `site.css` keys the phone overflow fix for Legal pages to `[data-component="legal"]`. A CMS that drops or renames `data-component` would bring the horizontal scroll back on phones. | Developer |
| B8 | P1 | The Guide article's colour list carries 6 inline `style=""` (colour dots). Same choice as B5. | `plagiarism-and-ai-check-report.html`. | Owner + developer |
| B9 | P2 | Update the catalogue's "where used" tables. | They omit Canvas Integration (8 instances), PowerPoint (7) and Support & FAQ (FAQ ×4, Inquiry form). Read from `build/sections/*.catalogue.js` against the pages. | Owner (catalogue text only) |
| B10 | P2 | Decide whether the two stored renderings (`feature-cards-inline-head`, `steps-rows-icon`) stay in the catalogue. | No current page uses either configuration. They validate and render; they are approved designs without a live example. | Owner |
| B11 | P2 | Consider catalogue examples for four configurations used on live pages but not shown: Canvas hero `hub` + `long`, Canvas steps cards with 4 columns, Canvas feature-cards grid with 3 columns, UA banner glow `coral-soft`. | They pass the validator, so an editor can build them from a snippet — but nothing shows how. | Owner |
| B12 | P2 | Review recurring page-specific families as library candidates — only when a new page needs one: spot-cards (8 sections on 5 pages), photo-split (7 / 4), review-masonry (4 / 4), dark-act (3 / 3), ai-compare (3: Home, Students, Canvas), split-card (2: PowerPoint, Turnitin), relationship-map (2), hero-tool (2), hero-photo (2), plans (2). | Counted from `data-component` on every page. Not reusable today: an editor cannot paste them under a contract. | Owner |
| B13 | P2 | Write a copy rule into the CMS guide: copy from the catalogue or from the page source, never from the browser's rendered DOM. | Copied from the rendered DOM, the FAQ and the Reviews carousel arrive with their scripts' "ready" flags and stay dead (§7 cases 3–4). Included in `CMS_HANDOFF.md`; listed here because it is a new rule. | Owner |
| B14 | P2 | Note that utility classes inside sealed blocks exist in `tailwind.css` only because the same blocks are on repository pages. | A block that later lives only in the CMS could lose its utilities on the next Tailwind build. | Developer |
| B15 | P3 | Remove the empty tracked file named `=` at the repository root. | 0 bytes, added in `e11379f` (2026-08-21). | Owner |
| B16 | P3 | Update `build/sections/INTEGRATION.md`: it names `site/testimonials-v2.html`, which became `testimonials.html` on 2026-10-07. | Read from the file. | Owner |
