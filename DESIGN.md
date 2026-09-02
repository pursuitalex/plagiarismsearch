# PlagiarismSearch — Design System

> Foundations + components. Live in Figma file `7hBJUpDs9IXzBs6opCdUiE` → "Design System" page (`5233:2`). State snapshot: see `~/.claude/.../memory/project_design_system_state.md`.

---

## Theme layers

Same component primitives, three surface treatments:

| Layer | Surface | Used on | Mood |
|---|---|---|---|
| **D3 — Soft Productivity** (base) | white + mesh-gradient hero (orange × teal) | Home, Pricing, AI Detection product-pages | friendly, light, modern |
| **D1 — Editorial Trust** | cream `surface/editorial-base` + serif H1/H2 (Newsreader) | /for-universities, /compliance | warm, formal, institutional |
| **D2 — AI Confident** | navy `surface/ai-base` + teal accents | /ai-detection hero, /sample-report | sharp, technical, product-demo |

---

## Color — palette + semantic

### Palette ramps (50–950, 11 shades each)
**Brand:** `color/orange/*` (#F36F5A = 500, brand-locked), `color/teal/*` (#0CA9C3 = 500, brand-locked)
**State:** `color/success/*` (#3AC184 = 500), `color/danger/*` (#DC4444 = 500), `color/warning/*`, `color/info/*`
**Neutral:** `color/neutral/0` (white) → `color/neutral/950` (#0A0E1A)
**Theme:** `color/cream/*` (D1 warm off-white ramp), `color/navy/*` (D2 cool dark ramp)

### Semantic aliases (always prefer over palette refs)

**Text** (on light surfaces): `text/primary` (neutral/900), `text/secondary` (neutral/700), `text/muted` (neutral/500), `text/disabled` (neutral/400), `text/inverse` (white), `text/brand` (orange/500), `text/link` (teal/600)
**Text** (theme layers): `text/editorial-strong` (cream/950), `text/editorial-muted` (cream/700), `text/ai-muted` (navy/300)

**Surface:** `surface/primary` (white), `surface/subtle` (neutral/50), `surface/muted` (neutral/100), `surface/inverse` (neutral/900), `surface/brand-soft` (orange/100), `surface/brand-solid` (orange/500)
**Theme surfaces:** `surface/editorial-base` (cream/50), `surface/editorial-card` (white), `surface/editorial-accent` (cream/100), `surface/ai-base` (navy/950), `surface/ai-elevated` (navy/900), `surface/ai-card` (navy/800)

**Button state recipes** (bound to deeper palette shades for WCAG AA compliance):
- `surface/brand-solid-hover` → orange/700 (contrast 5.37:1 with white)
- `surface/brand-solid-active` → orange/800 (8.31:1)
- `surface/danger-solid-hover` → danger/700, `-active` → danger/800
- `surface/teal-solid` → teal/500, `-hover` → teal/700, `-active` → teal/800
- `surface/inverse-hover` → neutral/800, `-active` → neutral/950

**Border:** `border/subtle` (neutral/100), `border/default` (neutral/200), `border/strong` (neutral/300), `border/brand` (orange/500), `border/focus` (teal/500), `border/editorial` (cream/200), `border/ai` (navy/700)

### Contrast notes
- ✅ Hover/active states of primary/teal/danger all pass WCAG AA (≥4.5:1 white-on-fill)
- ⚠️ DEFAULT primary/teal at brand 500 fail AA (2.81–2.90) — brand-locked exception per brief §8. Hover/active compensate visually.

---

## Typography

### Families
- **Sans (primary):** Manrope — variable, supports Cyrillic. All body, UI, buttons, default headings.
- **Serif (D1 accent):** Newsreader — display + H1 + H2 on B2B editorial pages only.
- **Mono:** Geist Mono — code samples, API specs.

### Manrope tracking ramp (applied to all sans)
- ≥60px (display): **-2.5% to -3%**
- ≥40px: -2%
- ≥28px (H1): -1.5%
- ≥22px (H2): -1%
- ≤17px (body, UI): 0%
- UI caps with explicit positive LS: +4 to +8% (e.g., button caps, eyebrow labels)

### Newsreader (serif)
- No negative tracking — Newsreader's optical sizing handles spacing inherently
- Use Medium for display + H1, Regular for H2

### Text styles (responsive, 3 modes Desktop/Tablet/Mobile)
- **Display:** display/xl, display/lg, display/md (also display-serif/lg)
- **Heading:** heading/h1..h4 (also heading-serif/h1, heading-serif/h2)
- **Body:** body/lg, body/md, body/sm
- **UI:** ui/lg, ui/md, ui/sm, ui/caps
- **Component:** button/text/{xs..lg}, button/caps/{xs..lg}, badge/sm-md, input/sm-md-lg

### Responsive scale (Desktop / Tablet / Mobile)
- display-xl: 72 / 56 / 40 px
- display-lg: 64 / 48 / 36 px
- h1: 56 / 40 / 32 px
- h2: 40 / 32 / 28 px
- body-lg: 18 / 17 / 16 px
- body-md: 16 / 15 / 15 px
- ui-md: 15 / 14 / 14 px

---

## Layout

### Breakpoints
- **Desktop:** 1280px content max, 80px gutters → device 1440+
- **Tablet:** 768px content max, 48px gutters → device 768
- **Mobile:** 360px content max, 24px gutters → device 375

### Grid
12-col implicit grid. Hero patterns: 7:5 asymmetric (text + product mock), 5:7 inverted, 6:6 balanced. Bento sections use asymmetric 60:40 split with full-width footer cell.

### Spacing scale (responsive)
2, 4, 6, 8, 10, 12 (don't scale across breakpoints) | 16, 20, 24, 28, 32, 36, 40 (scale ~80% at tablet, 65% at mobile) | 48, 64, 80, 96, 128 (scale ~75% tablet, 55% mobile)

→ For the exact utility triples this maps to in the web build, see **Web build → Responsive ramp**.

---

## Radii + Elevation

**Radii:** none, xs (2), sm (4), md (8), lg (12, **default for buttons + cards**), xl (16, hero/feature cards), 2xl (20, sections), 3xl (24, hero cards), full (999)

**Elevation effect styles (5):**
- elevation/0 — flat (no shadow)
- elevation/1 — subtle (cards): 0 1 2 4%
- elevation/2 — raised: 0 1 2 4% + 0 2 8 6%
- elevation/3 — modal: 0 2 4 6% + 0 4 16 8%
- elevation/4 — popover: 0 4 8 8% + 0 12 40 12% (slight blue tint)

---

## Components

### Button (Figma `5251:34`) — **192 variants**
4 properties: size (xs/sm/md/lg) × variant (primary/secondary/ghost/danger/dark/teal) × case (normal/caps) × state (default/hover/active/disabled)
- Fixed heights: **xs=32, sm=40, md=48, lg=56** (match Input heights)
- Radius: `radius/lg` (12px) uniform
- Text: SemiBold via `button/text/*` (normal) or `button/caps/*` (caps, progressive +8% LS at xs → +4% at lg)
- Padding: xs (12/6), sm (16/8), md (20/12), lg (28/16) — bound to space tokens

### Badge — 24 variants
6 colors (brand/info/success/warning/danger/neutral) × 2 sizes (sm/md) × 2 styles (soft/solid). Pill-shaped (`radius/full`), SemiBold caps, progressive LS.

### Input — 12 variants
3 sizes (sm=40, md=48, lg=56) × 4 states (default/focused/error/disabled). Border-only style, `radius/md` (8px). Focus = teal 2px stroke. Error = danger/500 stroke. **Body text is Medium** (Regular reads thin in input).

### Checkbox, radio & groups

**Never ship a browser-default checkbox or radio.** Tinting a native box with `accent-color` is not
a component — it still renders with the browser's own shape, size and animation, and looks different
on every platform. Equally, do not reach for Tailwind's `form-*` classes (`text-teal-600`,
`focus:ring-*` on an input): the CDN build has no forms plugin, so those classes silently do nothing.

The box is **replaced, not hidden**: `appearance:none` on the real input, styled directly. Hiding the
input behind a decorative `<span>` breaks label association and keyboard focus unless it is rebuilt
by hand — this way `:checked`, `:focus-visible`, `[disabled]` and the label hit area all work for free.

| class | what it is |
|---|---|
| `.ck` | checkbox — 18px, `radius/xs` 5px, teal-600 fill, white SVG check |
| `.rd` | radio — 18px circle, teal-600 fill, white centre dot |
| `.ctl` | the clickable row wrapping an input + its label (`.ctl-top` aligns to the first line for multi-line labels) |
| `.ctl-group` | quiet list of options, hover tint per row |
| `.ctl-group-boxed` | each option is a bordered card; the checked one takes a teal ring — for a prominent either/or |
| `.chipset` + `.chip-opt` | compact single choice as pills, radio semantics, no visible box |

The check glyph and radio dot are **background images**, not a rotated `::after` box — centring is
then exact by construction rather than tuned by eye at one size. Focus is a 3px teal halo
(`rgba(12,169,195,.28)`), not the 1px stroke used on Input: on an 18px control a 1px ring is invisible.

Live examples: `site/design-system.html#controls`.

### Card — 3 variants
elevated (elevation/2), bordered (border/subtle), filled (surface/muted). 380w, padding 32, `radius/xl` (16px).

### Table — pattern (not Component Set)
Dark header (surface/inverse) + white Bold caps text +8% LS. Alternating rows (neutral/50 + white). Cell padding 16v × 20h. Right-align numerics. `radius/lg` container.

### Icons — Lucide
24 starter components named `icon/{name}` (arrow-right, chevron-down, menu, x, search, check, check-circle, info, alert-circle, mail, globe, lock, shield-check, file-text, upload, download, external-link, user, users, play, sparkles, copy + a few more). 24×24 viewBox, 2px stroke bound to `color/neutral/900`. Add more on-demand from lucide.dev.

### One box for every icon
**Every icon is drawn on a 24×24 artboard and rendered in the same slot.** A row of icons uses one size class — not one per icon. If a mark looks too heavy or too light next to its neighbours, the fix is whitespace *inside* its artboard; never a different box in the markup.

Live area inside the 24 box:

| shape | live width | why |
|---|---|---|
| square / upright | 20 | the Lucide default; leaves 2px of air each side |
| wide (ratio > 1.3) | 22 | a short shape needs more width to carry the same visual weight |

Brand marks arrive in their own proportions and must be re-boxed before use. The OneDrive cloud is 800×512 as supplied — wrapped in a `<g transform>` inside a 24×24 viewBox at 22 wide, vertically centred. Dropbox was drawn full-bleed at 24 and was inset to 20 for the same reason.

Why it matters: sizing per icon means the slot changes whenever artwork is replaced, and rows silently fall out of alignment. Re-boxing keeps the substitution of an official vector a file swap with no markup change.

Brand marks live in `site/assets/svg/partners/`, named after the service in lower case — `dropbox.svg`, `onedrive.svg`, `moodle.svg`. They are referenced as `<img>`, never inlined, so the file can be replaced without touching a page.

---

## Motion

**Principles:**
- Spring-based easing (NOT linear)
- Every animation has purpose (not "wow")
- `prefers-reduced-motion` respected — all animations off

**Duration tokens:**
- 150–250ms — UI transitions (hover, focus, tab switch)
- 400–600ms — hero / scan-progress / counter animations
- 800–1200ms — onboarding / page reveals

**Common patterns:**
- Hero gradient: slow mesh shift, 10s ease loop
- Stats counters: spring-up 0 → value on scroll-in, 400ms
- Scan widget: scan-line during processing, 1.5s loop
- Section reveal: fade + 12px translateY on viewport-enter, 250ms
- Pricing toggle Monthly/Yearly: slide-flip 200ms
- Button hover: fill transition 150ms ease-out

---

## Accessibility floor

- WCAG 2.2 AA on all P0/P1 pages
- Text contrast ≥4.5:1, UI contrast ≥3:1
- Visible focus states on every interactive (2px teal ring `border/focus`)
- Pinch-zoom enabled (NO `maximum-scale=1` in viewport)
- Color-only signals always backed by icon or text
- Touch target minimum 44×44 (Apple HIG)
- `prefers-reduced-motion` full support

---

## Anti-patterns (do not use)

- ❌ Stock photos
- ❌ 3 evenly-stacked feature columns (use bento)
- ❌ Gradient on H1 text
- ❌ Pure-orange background (low contrast for text)
- ❌ Live chat widget
- ❌ Carousel hero
- ❌ 12-tier pricing (max 3 + pay-as-you-go)
- ❌ Solid emoji icons (use Lucide line icons only)
- ❌ Carbon copy of Linear / Vercel / Stripe aesthetic — our look is friendly-warm, not industrial-cold

---

## Web build — layout conventions (site/*.html)

> How the live prototype implements the system. Established on Home (`site/index.html`), reuse verbatim on every internal page. Tokens live in the inline `tailwind.config` — **copy it unchanged from index.html; design-system.html holds the same copy** (three files must never drift).

### Page scaffold
1. `<body class="font-sans text-ink-900 bg-white overflow-x-hidden">` + `<div class="grain">` noise overlay
2. **Floating island nav** (shared chrome): `fixed top-5`, pill `bg-white/85 backdrop-blur-md ring-1 ring-black/5 shadow-diffuse`. Internal pages link back to `index.html` anchors
3. Sections stack; **dark footer** `bg-ink-950` (shared chrome, copy from index.html)
4. First section gets `pt-28`+ to clear the fixed nav

### Section rhythm
- Vertical padding: `py-28 lg:py-36` every section; hero-type sections may go `min-h-[100dvh] flex items-center`
- Background alternation: white → `bg-ink-50` → white…; **max one dark band** (`bg-ink-950`) per view as accent; hero tint `#F2FCFC`
- **Two sections on the same background = one padding, not two.** Where the alternation
  breaks and two neighbours share a background, their facing paddings stack and the gap
  doubles. Collapse it: **keep the larger padding, strip the smaller one** — `py-24 lg:py-32`
  becomes `pb-24 lg:pb-32` on the second (or `pt-…` on the first, whichever is being kept).
  Keep the larger rather than always the first: a closing CTA is deliberately roomier
  (`py-32 lg:py-44`) and truncating it would cost the breathing space before the footer.
  This is easy to reintroduce by inserting a section without re-checking the sequence —
  after any insert, re-read the whole page's background chain, not just the neighbours.
- Container: `max-w-[1280px] mx-auto px-6 lg:px-10` (narrower content: 1180px)
- Section header pattern: eyebrow chip → `h2 text-[clamp(2rem,4vw,3.4rem)]` → the section support line (see **Support lines — two roles, two sizes**)

### Responsive ramp — three steps, never two

Spacing, margins and radii carry **three** values, not two: phone (bare utility) → tablet (`sm:`) →
desktop (`lg:`). Writing `p-4 sm:p-6` looks responsive but gives a 390px phone and a 900px
tablet the same 24px, and writing a bare `px-6` gives every screen 24px.

| desktop | tablet | phone | example |
|---|---|---|---|
| 48 | 40 | 32 | `py-8 sm:py-10 lg:py-12` |
| 40 | 32 | 24 | `p-6 sm:p-8 lg:p-10` |
| 32 | 28 | 24 | `p-6 sm:p-7 lg:p-8` |
| 28 | 24 | 20 | `px-5 sm:px-6 lg:px-7` |
| **24** | **20** | **16** | `p-4 sm:p-5 lg:p-6` |
| 20 | — | 16 | `p-4 lg:p-5` |
| 16 | 14 | 12 | `rounded-xl sm:rounded-[14px] lg:rounded-2xl` |

**A spacing value is a semantic step, never a number.** Pick the step, take all three of its
values — do not invent a pair, and do not leave a spacing utility bare:

| step | phone | tablet | desktop | utility |
|---|---|---|---|---|
| 2XS | 6 | 8 | 8 | `p-1.5 sm:p-2` (bezel frames only) |
| XS | 8 | 10 | 12 | `p-2 sm:p-2.5 lg:p-3` |
| S | 12 | 14 | 16 | `p-3 sm:p-3.5 lg:p-4` |
| **M** | **16** | **20** | **24** | `p-4 sm:p-5 lg:p-6` |
| L | 20 | 24 | 28 | `p-5 sm:p-6 lg:p-7` |
| XL | 24 | 28 | 32 | `p-6 sm:p-7 lg:p-8` |
| 2XL | 32 | 40 | 48 | `p-8 sm:p-10 lg:p-12` |
| 3XL | 48 | 64 | 80 | `p-12 sm:p-16 lg:p-20` |
| 4XL | 64 | 80 | 96 | `p-16 sm:p-20 lg:p-24` |

**The bare utility is the phone value.** When a block reads too tight on a phone, move it down a
step — the whole triple moves with it, and desktop follows. The FAQ rows were L (20/24/28) and went
to M (16/20/24); desktop came down to 24 as a consequence, which is the point of stepping rather
than patching one breakpoint.

**Gaps and vertical margins** (`m`, `my`, `mt`, `mb`) use the same table. Horizontal margins are
usually doing layout work (`mx-auto`, small negative nudges) rather than rhythm, so they stay flat.
Values of 4px and under are hairlines — a ring offset, a dot inset — and do not step.

**Reserve height with a grid stack, never a magic `min-h`.** A switcher whose panels are absolutely
positioned inside a `min-h-[380px]` holder is holding a number measured on one breakpoint: the
persona panel needs 371px on desktop and 311px on a phone, so the phone carried 69px of dead space
that read as a broken gap. Put every panel in the same grid cell (`grid` + `grid-area:1/1`) and the
holder is exactly as tall as the tallest panel at any width, with no jump when switching.

**Radii of a double-bezel must stay concentric at all three steps, not just the ends.**
The inner radius is always outer − frame padding, so a ramped shell forces a ramped inner:

| | phone | tablet | desktop |
|---|---|---|---|
| frame padding | 6 | 8 | 8 |
| outer | 24 | 32 | 40 |
| inner | 18 | 24 | 32 |

A shell written with a flat `p-2` breaks this on the phone (24 − 8 = 16, not 18) — the frame
thins with the card, so bezels are `p-1.5 sm:p-2`.

### Three columns do not survive a phone

A row of icon + text + action is comfortable at 600px and cramped at 280. Measured on the
plagiarism-check upload row: the middle column collapsed to **112px**, breaking a 25-character
title over two lines and its support line over three, inside a 314px card.

Don't shrink the type to fit — **drop the action to its own row**. Put `flex-wrap` on the row and
`w-full sm:w-auto` on the button: below `sm` it cannot share a line, so it takes the full width and
returns the space to the text (112px → 227px, title back to one line); from `sm` up it sits inline
again and the desktop layout is untouched. The same move fixes a `justify-between` label/note pair —
`flex-wrap` + `gap-x-3 gap-y-1` lets the note fall to its own line instead of both halves wrapping.

### Mock-UI type is its own scale

The schematic interface blocks (report mock, scan document, hero bento tiles, language
strip) are miniatures. On desktop the mock has ~600px; on a phone the same mock has ~358px,
so its labels are proportionally 40% too large and rows stop fitting — the report's tab strip
needed 380px of text in a 278px box. Inside a mock, type runs **phone 0.85 / tablet 0.93 /
desktop 1.00**, snapped to half a pixel, floor 8px.

This scale applies *only inside mocks*. Real sub-13px UI elsewhere — nav items, the Trustpilot
badge, pricing captions, the footer line — is already at its floor and must not be shrunk again.

### Hero H1 scale — three ceilings, one curve

Every hero H1 is `font-extrabold tracking-tightest leading-[1.02]` plus one of exactly three sizes.
**Only the ceiling changes.** The minimum and the growth rate are shared, so all pages render the
*same* size on every phone and tablet width and separate only on desktop:

| tier | class | when |
|---|---|---|
| Home | `text-[clamp(2.4rem,5.5vw,4.35rem)]` | `index.html` only |
| **L** | `text-[clamp(2.4rem,5.5vw,4rem)]` | longest authored line ≤ 25 characters |
| **S** | `text-[clamp(2.4rem,5.5vw,3.6rem)]` | longest authored line > 25 characters |

**How to pick:** count the longest line the headline actually has to fit — that is, split on any
hard `<br>` and take the longest piece, not the total character count. A headline you break
yourself stays in L however long it is overall; a long sentence that must wrap on its own goes to S.
Never eyeball it against the rendered page.


Measured result: identical at 375 / 430 / 768 / 1024px (38.4 → 56.3px, all pages), separating only
at ≥1057px as each tier reaches its ceiling — 69.6 / 64 / 57.6px by 1280px.

> Before this rule the site carried six different hero sizes for two actual situations, drifting a
> little more with each new page. If a headline looks wrong at its tier, fix the copy or the line
> break — do not invent a fourth size.

### Support lines — two roles, two sizes

Copy under a heading takes its size from the heading's rank, never from the page it happens to be
on. There are exactly two sizes on the whole site:

| role | phone | tablet | desktop | class |
|---|---|---|---|---|
| **hero** — under the page `h1` | 15.5 | 16 | 16.5 | `text-[15.5px] sm:text-[16px] lg:text-[16.5px]` |
| **heading block** — under any `h2`: section intros **and** CTA banners alike | 14.5 | 15 | 15.5 | `text-[14.5px] sm:text-[15px] lg:text-[15.5px]` |

> Before this rule the site carried 4 sizes across 34 lead lines and 6 across 40 section lines, and
> the most common one (`text-[15.5px]`, 32 uses) had no phone step at all. Three sub-headings a
> screen apart could read 16.5, 15.5 and 15px.

**One size per block, not per paragraph.** A heading block often runs to two paragraphs. Size the
first and you get two sizes a line apart — 16.5 then 14.5 in the API banner, and on phones a
*backwards* pair where the continuation (flat 15.5) outweighed the intro (14.5). Every direct `<p>`
of the block takes the same size. A gap that small is not hierarchy; it reads as a mistake.

**A CTA banner is not a bigger section.** It was briefly given the hero size — the extra point of
size did nothing except break the rule above. Banners are heading blocks.

**A card title is not a heading.** The rule applies to headings sized with `clamp()`. A card or form
title uses a fixed size (`h2 text-[17px]` "Send a Free Inquiry"), and the small print under it is a
form hint, not a support line — promoting it to 15.5px would be wrong.

**Scope the pass by container, not by keyword.** Selecting banners by `text-teal-300` swept in 12
unrelated paragraphs, because the Google Docs bento card and the pricing cards carry teal eyebrows
too. Walk out to the block that holds the heading and take its direct `<p>` children.

### Body and small text — 14px is not a size

Below the support lines there is one body ramp and one small-UI ramp, and nothing between them:

| role | phone | tablet+ | class |
|---|---|---|---|
| **body** — card and tile copy, table cells, secondary links, list items, data values | 13.5 | 14.5 | `text-[13.5px] sm:text-[14.5px]` |
| **small UI** — segmented switchers, captions, meta | 13 | 13.5 | `text-[13px] sm:text-[13.5px]` |

**14px is reserved for the standalone button label** (`text-[14px] sm:text-[15px]`, above) and appears
nowhere else. It had leaked into 31 other places as a half-pixel-short body ramp — `13.5 → 14` in 17
of them against `13.5 → 14.5` in 49 — which rendered a flat 14 beside a flat 14.5 on desktop, close
enough to read as a mistake rather than a distinction. If a body line looks wrong at 14.5, change its
weight or colour; there is no size between 13.5 and 14.5.


### A section must not leave a gap down one side

This is the layout rule, and it holds on every page including the homepage. A section is one
of two things:

**Something in it fills the shell.** A heading block sits left at `max-w-[760px]` above a grid,
a table or a card row that runs the full `max-w-[1280px]` content width. Nothing is short of
the right edge, so nothing reads as a gap. This is what the homepage does throughout, and what
every v2 page does.

**Or the whole section is text, and then it is centred.** No capped block is ever left-aligned
on its own — a 760px block hard left in a 1200px shell puts 440px of nothing down the right,
and that reads as a fault, not as a margin. Centre it and the space becomes a margin.

> Never cap a grid at some width narrower than the shell and leave it left-aligned. That was the
> mistake on `plagiarism-and-ai-check-report`: grids capped at 1080 inside a 1200 shell left a
> 105px strip down the right of four sections in a row.

### Text width — cap the long runs, not the page

| role | width | what it is |
|---|---|---|
| hero | `max-w-[820px]` | the `h1` block |
| heading block | `max-w-[760px]` | eyebrow + `h2` + the line or two under it |
| **long prose** | `max-w-[700px]` | a paragraph run of roughly four lines or more |
| card list | `max-w-[880px]` | a column of cards with a date or icon rail beside the prose |

Body copy on a text page is `text-[15.5px] sm:text-[16px] lg:text-[17px]` with `leading-[1.72]`.
Both the ramp and the 700 come from `blog-best-checker-2026.html`; a new text page reuses them
rather than starting its own size architecture.

**700 is settled, and it is only for a long run.** It was agreed as the readable compromise for
a long block — a blog paragraph, an article's opening. Putting it on every heading and every
one-line lead shrinks the page for nothing and makes it look unlike the rest of the site. A
two-line section intro belongs at 760, and a grid belongs at full width.

**`ch` is not a character.** `max-w-[68ch]` renders a 94-character line — Manrope's `ch` is about
0.6em while its average character is about 0.44em. Use px, and measure by counting characters
per line box rather than trusting the unit.

### Standalone button — one shape

A standalone button is a section-level call to action: not a control inside a form, a pricing card,
a bento tile, or a segmented switcher. Every one of them is **48px on a phone, 56px from `sm` up**,
set with `h-12 sm:h-14` — a height, never padding.

| | plain | with a trailing icon orb |
|---|---|---|
| height | `h-12 sm:h-14` | `h-12 sm:h-14` |
| padding | `px-5 sm:px-6 lg:px-7` | `pl-5 sm:pl-7 pr-2.5` |
| label | `text-[14px] sm:text-[15px]` | `text-[14px] sm:text-[15px]` |
| orb | — | `icon-orb w-9 h-9` |

The orb variant keeps its asymmetric padding: the circle sits tight against the right edge, so
`px-*` would break it. `w-9` + `pr-2.5` is the 56px orb; `w-8` + `pr-2` is the 48px one and belongs
to card buttons.

**Set the height, don't imply it.** 13 buttons sat at 44 or 48px purely because they used
`py-2` / `py-3` / `py-3.5`, and 24 more reached 56px on desktop through padding but rendered 52px on
a phone — a set that looks uniform on the machine you designed it on and ragged everywhere else.

**Not every pill is a button.** Segmented switchers (Student/Teacher/University, Monthly/Yearly) are
`rounded-full` too and sit at 38–41px. They are a control, not a call to action; leave them.

### Section furniture

- **Checkerboard imagery**: consecutive two-column sections must alternate which side the image sits on — image right, then image left, then right. Never two in a row on the same side. Keep the text block first in the DOM (mobile reads text → image) and flip with `lg:order-1` / `lg:order-2`, not by reordering markup
- **No tall portraits**: images cap at roughly 1 : 1.25 (portrait) — a 3:4 or taller frame forces the column to stretch and starves the section of horizontal room
- Eyebrow chip: `inline-flex gap-2 rounded-full bg-ink-50 ring-1 ring-black/5 px-3.5 py-1.5` + 1.5px colored dot + `text-[10px] sm:text-[10.5px] uppercase tracking-[0.22em]` (on ink-50 sections the chip is `bg-white`)
- **One scale for every eyebrow**, chipped or bare — the uppercase labels in CTA bands are the same
  component and take the same two sizes. This is the exception to "sub-13px type does not step":
  eyebrows step 10 → 10.5 by design. Sitewide passes that rescale type by *region* must skip them,
  or a handful drift to another size purely because they sat inside a mock-up zone.

### Card recipes
- **Double-bezel** (feature/bento): outer `rounded-4xl|5xl bg-black/[.02] ring-1 ring-black/5 p-2 shadow-diffuse` + inner `rounded-[calc(outer-0.5rem)] bg-white shadow-inner-hl`
- **Flat card** (pricing/tiles): `rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-8 lg:p-9`
- **Dark accent card**: `bg-ink-950 text-white ring-1 ring-white/10 shadow-diffuse-lg` + one masked orb inside
- Highlighted pricing tier additionally `lg:-my-6` (physically taller in an `items-center` grid)
- **Photo card** (a card whose background is a photograph): the photo is a **band at the top**, not a
  fill. It is dissolved into the card's own colour by a vertical gradient, so it has no bottom edge to
  crop — `transparent 0% → transparent ~38% → ink-950/72 at ~74% → #0A0E1A 100%`, on a wrapper of
  `absolute inset-x-0 top-0`. The plate underneath is solid `bg-ink-950`, so body copy and secondary
  links sit on ink and stay readable; a photo stretched over the whole card puts them on whatever the
  image happens to show. Band height `330px / 380px / 70%` of the card.
  **The band ends mid-heading on purpose**: eyebrow and opening lines read against the photograph, the
  closing line and everything below sit on ink. Below `lg` the text column needs `pt-[210px] sm:pt-[240px]`
  so there is clear photograph above the eyebrow — without it the image has no room to read as a
  photograph at all. (Reference: Figma `5524:479`.)
- **Illustration card**: grey card (`bg-ink-50 p-6 lg:p-7`) → white plate spanning the content width (`rounded-2xl bg-white py-6`, card padding visible around it) → illustration modest and centered inside (`max-w-[260px]`). Standalone illustrations (hero) instead get their background removed and sit directly on the section tint — no plate. Generated series keep ONE line-weight family: thin ink outlines, white objects, small coral/teal accents, no big solid color tiles

### Decoration
- **Orbs** (mesh glow): `.orb` = masked radial gradient, NEVER `filter: blur()`. Solid low-alpha bg (`bg-teal-500/8`), position off-canvas partially. 1–2 per section max
- **An orb's clipper must be positioned, not just `overflow-hidden`.** `overflow` only clips
  descendants whose containing block is the clipper or lives inside it. An `absolute` orb resolves
  its containing block against the nearest *positioned* ancestor, so a `static` wrapper is skipped
  entirely and the orb is measured against whatever is further up. The scan panel is
  `lg:sticky … overflow-hidden`: positioned on desktop, `static` below `lg` — so its two orbs
  escaped and reached 540px inside a 390px viewport, on phones only. Any `overflow-hidden` that
  exists to contain decoration needs `relative` alongside it.
- Grain overlay is global — don't re-add per section
- **Root clip, not body clip.** Horizontal containment belongs on `html` as `overflow-x: clip`,
  and `<body>` must stay `visible`. Two traps: `overflow-x: hidden` creates a scroll container and
  kills `position: sticky` inside it, whereas `clip` does not; and once `html` is non-`visible`,
  `body`'s own overflow stops propagating to the viewport, so a leftover `overflow-x-hidden` on
  `<body>` turns body itself into the scroll container — which silently unpinned the scan scene.
- `::selection` orange; `.nums` = tabular numerals for any changing/aligned numbers

### Motion (GSAP + ScrollTrigger via CDN)
- **Reveal**: `.rv` class = `opacity:0 translateY(40px)`; batch-triggered at `start:'top 70%'`, `y:0 opacity:1 .7s power2.out`, stagger ~.08; elements already in first viewport animate on load with top-down cascade
- Buttons: `.btn-press` scale feedback; `.icon-orb svg` rotates -45° on group hover
- **Pen mark** (accent word in a heading — reusable on every page): wrap the word in
  `<span class="pen-word relative inline-block">word<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c30-7 80-7 114-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg></span>`.
  JS loops `.pen-word`: word tweens to `#DC5A45` (orange-600), then the path draws via
  `strokeDashoffset` measured with `getTotalLength()`. Marks in the first viewport wait out the
  reveal cascade (`delay: 1`); lower ones fire on `top 80%`, `once: true`. Reduced-motion CSS
  fallback is mandatory: `.no-motion .pen-word { color:#DC5A45 } .no-motion .pen-underline { opacity:1 }`.
  Use **one** pen mark per heading — it is emphasis, not decoration.
  *(index.html's hero `one.` and CTA `free` predate the class and use IDs with bespoke timing tied
  to the hero cascade; the class pattern above is the standard for all new work.)*
- **Ring mark** (the closing CTA only): the band loops a word instead of underlining it.
  `<span class="ring-word relative inline-block">word<svg class="ring-mark absolute pointer-events-none" viewBox="0 0 230 100" style="left:-9%; top:-26%; width:118%; height:152%; transform:rotate(-2deg);"><path class="ring-path" d="…" stroke="#F36F5A" stroke-opacity=".5" stroke-width="6.5" opacity="0"/></svg></span>`.
  Same mechanism as the pen mark, longer path, slower draw (.9s), and it fires later —
  `top 75%`, `once: true` — because it is the last thing the page says. One per heading.
  The loop is drawn for a fragment of **about ten characters**; the SVG is sized in
  percentages of the span, so a much shorter or longer phrase stretches the loop into an
  egg. Pick the fragment by length as well as by meaning. Reduced-motion fallback is
  mandatory: `.no-motion .ring-word { color:#DC5A45 } .no-motion .ring-path { opacity:1 }`.
  *(The loop reads as a loose scribble across the word, not a tight enclosure — measured,
  the path is ~0.6–0.75 of the span width. That is the intended look, not a defect.)*

#### The closing CTA band — `build/cta.js`

The section before the footer is a shared component. Its recipe has four parts and all
four carry weight:

1. **Dot field.** An SVG `<pattern>`, 22px cell, a 2×2 rounded square (`rx=.65`) in
   `#DAE7ED`. It is what stops the band reading as an empty coloured rectangle — the
   section is mostly air, and the dots give that air a texture. A `<pattern>` rather than
   a repeating background-image, so it stays crisp at any zoom for one rasterisation.
   **It must sit under the glows** — dots over glow reads as dirt on glass.
2. **Two glows**, warm upper-left and cool lower-right, as masked gradients on a solid
   fill — never `blur()`. Every knob is a custom property on the section id, and the two
   media queries are not optional: the warm glow is 1138px wide, which on a 390px phone
   is three viewports of coral washing the screen.
3. **One ring mark** in the heading, per the entry above.
4. **Hero-scale heading**, `clamp(2.4rem,5.5vw,4.35rem)` — the one place a non-hero
   heading takes the hero size, because a closing CTA is deliberately roomier.

- Counters: tween object + `onUpdate` with cached writes, `.nums` on the element
- **`prefers-reduced-motion`**: add `.no-motion` to `<html>`, all `.rv` forced visible, final states set statically — every scripted animation needs its static fallback
- Perf floor: animate only `transform`/`opacity`; no `backdrop-blur` on elements that repaint per frame; `will-change` only on continuously-moving nodes

### Page-level SEO/meta (prototype)
- `noindex, nofollow` meta on every page + `robots.txt` disallow (WIP site)
- Title pattern: `PlagiarismSearch — {Page}`; Manrope/Newsreader/Flow Circular from Google Fonts (Flow only where redacted-text mock is used)

---

## File locations
- **Figma:** `7hBJUpDs9IXzBs6opCdUiE`
  - Design System: page `5233:2` → root frame `5233:3`
  - Screens (in progress): page → "Screens"
  - Service Blueprint: page `5225:2`
  - Moodboard: page `5205:2`
- **Brief:** `redesign-brief-v1.md`
- **Page specs:** `page-specs/` (10 files)
- **Image style guide:** `IMAGES.md` — generation system for photo-UI collages, masked heroes, duotone spot icons (Magnific / Nano Banana Pro); validated samples in `site/assets/img/style-tests/`
