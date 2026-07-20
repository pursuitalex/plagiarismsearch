# Header (global) — Spec

**Phase:** P0 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Стиснути 30+ menu items / 4 dropdowns поточної навігації до 5 категорій. Зменшити cognitive load + покращити mobile UX.

## 2. Primary persona
All — header shared across all pages.

## 3. Success metric
Behavior — navigation depth metrics (% users hitting a sub-page within 60s). Indirect: G1, G2, G4.

## 4. Design layer
D3 base. На D1 pages (B2B) фон header може бути cream/transparent. На D2 pages (`/ai-detection`) — light surface вільно, dark hero під ним.

---

## 5. Structure (desktop)

```
[Logo]   Products ▾   Solutions ▾   Pricing   Resources ▾        [🌐 EN]  [Login]  [Sign up]
```

### Logo (left)
- Orange + teal lozenge mark + "PlagiarismSearch" wordmark
- Click → `/`
- Height: ~40px на desktop, ~32px на mobile

### Nav (centered або left-aligned, TBD)
| Item | Type | Sub-items |
|---|---|---|
| **Products** | Dropdown (3) | Plagiarism Checker · AI Detector · Paper Analysis (merge spell/readability/grammar) |
| **Solutions** | Dropdown (3) | For Students · For Teachers · For Universities |
| **Pricing** | Link | → `/prices` |
| **Resources** | Dropdown (4) | Sample Report **(NEW)** · API · Help Center · Blog |

### Right side
| Item | Type | Notes |
|---|---|---|
| **Language switcher** | Dropdown | EN · ES · UA · PL · RU (current: 5 supported) — globe icon + code, mobile drawer варіант |
| **Login** | Text link | → `/login` |
| **Sign up** | Primary button (small) | → `/signup` |

---

## 6. Mobile structure (≤768px)

```
[Logo]                                                          [☰]
```
Burger відкриває full-screen drawer:
- Products (accordion з 3 sub-items)
- Solutions (accordion з 3 sub-items)
- Pricing (direct link)
- Resources (accordion з 4 sub-items)
- ---
- Language switcher
- Login
- Sign up (full-width primary button)

---

## 7. Behavior / states

| State | Visual |
|---|---|
| **Default** | Solid white background, subtle bottom border (1px neutral-200) |
| **Scrolled (>100px)** | Sticky, condensed height (від 80px до 64px), backdrop blur 12px з 90% opacity, slightly stronger shadow |
| **Dropdown open** | Mega-menu опускається з 12px translateY anim + fade (150ms). Closes on outside-click, Esc, or item click. |
| **Mobile drawer open** | Slide-in from right, body scroll locked, ✕ кнопка з top-right |
| **Active page** | Top-level item має underline + slightly bolder weight (на desktop) або background pill (на mobile drawer) |
| **Focus** | Visible teal 2px ring (accessibility) |

---

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (Sign up — primary sm, Login — ghost) | **Nav item** — text with optional dropdown chevron |
| Lucide icons (globe, chevron, menu/burger, x) | **Dropdown / mega-menu** — multi-column з icon + label + (optional) description |
| Text styles (ui/md для nav, ui/sm для items) | **Mobile drawer** — full-screen overlay з accordion-list |
| | **Language switcher** — globe + code + dropdown (desktop) / list (mobile) |
| | **Logo component** — SVG composed: lozenges + wordmark, з link wrapper |

---

## 9. Animations / motion
- Dropdown open: opacity 0→1 + translateY 12→0 (150ms ease-out)
- Sticky condense: height + padding interpolate over 200ms when scroll>100px
- Mobile drawer: slide-in-from-right (250ms cubic-bezier) + backdrop fade-in
- Active link underline: width 0→100% (200ms) на mount/hover
- Reduced motion: no slide, just instant show/hide

---

## 10. States / edge cases
- **Logged-in state:** "Sign up" замінено на avatar+menu (Account / Billing / Logout). Avatar: ініціали або profile img. Login link сховано.
- **CTA на dark backgrounds (D2 `/ai-detection` hero):** transparent variant header (white text, transparent surface), на scroll з умовою → переходить на solid білий
- **Long page titles в dropdowns** — truncate з ellipsis, або wrap на 2 рядки
- **5 mov language**: якщо browser locale matches one of 5 — підказка "View in [lang]?" (open Q — потрібен чи ні)
- **404 page** — header показаний, але contextual help link "Looking for something?" → search

---

## 11. Open questions
1. **Nav alignment** — logo+nav left, CTAs right (Stripe-style) vs logo left, nav center, CTAs right (Linear-style)?
2. **Mega-menu vs simple dropdown** — для Products/Solutions з 3 items вистачить simple dropdown. Для Resources з 4 items — теж simple. Чи додаємо descriptions для richer мега-меню?
3. **Sticky behavior** — sticky on every page чи опційно (наприклад, не на /pricing де sticky може перекривати ціни)?
4. **Language switcher placement** — header right (зараз) чи footer (як Stripe)? Header перевага — visible always; footer перевага — менше clutter.
5. **"Sample Report" NEW badge** — додаємо при першому показі юзеру (cookie-based)?
6. **CTA buttons size** — sm (compact) чи md (prominent)?
7. **Search** — додаємо search icon у header (для Help Center / Blog)?

---

## 12. Out of scope
- Account menu deep-dive (логiн-state UI — окремий design)
- Search functionality (можна додати later)
- Notifications bell (logged-in state, не P0)
- Promotional banner above header (separate component, on-demand)
