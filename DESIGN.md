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

### Card — 3 variants
elevated (elevation/2), bordered (border/subtle), filled (surface/muted). 380w, padding 32, `radius/xl` (16px).

### Table — pattern (not Component Set)
Dark header (surface/inverse) + white Bold caps text +8% LS. Alternating rows (neutral/50 + white). Cell padding 16v × 20h. Right-align numerics. `radius/lg` container.

### Icons — Lucide
24 starter components named `icon/{name}` (arrow-right, chevron-down, menu, x, search, check, check-circle, info, alert-circle, mail, globe, lock, shield-check, file-text, upload, download, external-link, user, users, play, sparkles, copy + a few more). 24×24 viewBox, 2px stroke bound to `color/neutral/900`. Add more on-demand from lucide.dev.

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
- Container: `max-w-[1280px] mx-auto px-6 lg:px-10` (narrower content: 1180px)
- Section header pattern: eyebrow chip → `h2 text-[clamp(2rem,4vw,3.4rem)]` → 15–16px `text-ink-600` subline
- Eyebrow chip: `inline-flex gap-2 rounded-full bg-ink-50 ring-1 ring-black/5 px-3.5 py-1.5` + 1.5px colored dot + `text-[10.5px] uppercase tracking-[0.22em]` (on ink-50 sections the chip is `bg-white`)

### Card recipes
- **Double-bezel** (feature/bento): outer `rounded-4xl|5xl bg-black/[.02] ring-1 ring-black/5 p-2 shadow-diffuse` + inner `rounded-[calc(outer-0.5rem)] bg-white shadow-inner-hl`
- **Flat card** (pricing/tiles): `rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-8 lg:p-9`
- **Dark accent card**: `bg-ink-950 text-white ring-1 ring-white/10 shadow-diffuse-lg` + one masked orb inside
- Highlighted pricing tier additionally `lg:-my-6` (physically taller in an `items-center` grid)

### Decoration
- **Orbs** (mesh glow): `.orb` = masked radial gradient, NEVER `filter: blur()`. Solid low-alpha bg (`bg-teal-500/8`), position off-canvas partially. 1–2 per section max
- Grain overlay is global — don't re-add per section
- `::selection` orange; `.nums` = tabular numerals for any changing/aligned numbers

### Motion (GSAP + ScrollTrigger via CDN)
- **Reveal**: `.rv` class = `opacity:0 translateY(40px)`; batch-triggered at `start:'top 70%'`, `y:0 opacity:1 .7s power2.out`, stagger ~.08; elements already in first viewport animate on load with top-down cascade
- Buttons: `.btn-press` scale feedback; `.icon-orb svg` rotates -45° on group hover
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
