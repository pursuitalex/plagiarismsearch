# Footer (global) — Spec

**Phase:** P0 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Стиснути 47 footer links до ~24 grouped. Прибрати broken links (`/for-universities` → 404 fix). Виправити IA inconsistency.

## 2. Primary persona
All. Footer = secondary nav + trust + legal.

## 3. Success metric
- 0 broken links
- Trust badges візуально prominent (для last-look conversion)

## 4. Design layer
D3 base. На light surface (D2 pages — footer лишається light, не темний).

---

## 5. Structure

5-column layout (desktop) → stacked accordion (mobile).

```
┌────────────────────────────────────────────────────────────────────────┐
│ Product     │ Solutions    │ Resources    │ Company      │ Trust       │
│ (4 links)   │ (3 links)    │ (4 links)    │ (4 links)    │ (badges)    │
├────────────────────────────────────────────────────────────────────────┤
│ © 2026 PlagiarismSearch · Privacy · Terms · DPA · Cookies   [🌐 EN ▾] │
└────────────────────────────────────────────────────────────────────────┘
```

### Column 1 — Product (4 links)
- Plagiarism Checker → `/`
- AI Detector → `/ai-detection`
- Paper Analysis → `/paper-analysis` (merged spell/grammar/readability)
- Sample Report → `/sample-report`

### Column 2 — Solutions (3 links)
- For Students → `/for-students` (TBD: чи створюємо окрему сторінку?)
- For Teachers → `/for-teachers`
- For Universities → `/for-universities` ⚠️ **fix URL** (currently 404; реальна URL — `/university-plagiarism-checker`. План — 301 redirect + clean URL)

### Column 3 — Resources (4 links)
- Help Center → `/help`
- API → `/api`
- Blog → `/blog`
- Free Tools → `/tools` (citation generator etc., якщо існують)

### Column 4 — Company (4 links)
- About → `/about`
- Contact → `/contact`
- Compliance → `/compliance`
- Careers → `/careers` (якщо є)

### Column 5 — Trust (badges, не links)
- Trustpilot widget (live rating 4.9★ + reviews count)
- Sitejabber badge
- Google Workspace Marketplace badge ("490K+ installs")
- (Optional) G2 / Capterra

### Bottom bar
- Copyright: "© 2026 PlagiarismSearch. All rights reserved."
- Legal links: Privacy · Terms · DPA · Cookies (Cookies opens cookie preferences modal)
- Language switcher (duplicated from header — better access)
- (Optional) Social: LinkedIn / Twitter / Facebook icons

---

## 6. Components

| Готове в DS | Треба добудувати |
|---|---|
| Text styles (ui/sm для links, body/sm для copyright) | **Footer column** — header + link list |
| Lucide icons (social) | **Trust badge row** — Trustpilot + Sitejabber + Workspace + G2 |
| | **Cookie preferences trigger** — opens modal (separate component) |
| | **Mobile footer accordion** — collapsible columns на mobile |
| | **Newsletter signup** (TBD — open question) |

---

## 7. Trust / social proof slots
- Column 5 → all trust badges grouped
- Trustpilot widget — live, не static screenshot

---

## 8. Behavior / states
- Link hover: text color shift neutral-600 → neutral-900 + underline (150ms)
- Mobile: columns collapse to accordion (tap to expand)
- Cookie modal trigger → opens granular cookie consent panel
- Language switcher: same dropdown as header

---

## 9. States / edge cases
- **Logged in:** не змінює footer (legal links однакові)
- **B2B context (`/for-universities`):** footer може мати "Talk to sales" CTA додатково — open Q
- **Localization:** all link labels translated to 5 languages; URLs можуть бути hardcoded EN paths

---

## 10. Open questions
1. **"For Students" сторінка** — чи створюємо окрему сторінку? Зараз бріф §4 згадує тільки solutions/students в navi, але контент-сторінки нема в P0/P1 scope.
2. **Free Tools** — чи маємо реально existing tools (citation generator etc.)? Якщо ні, прибираємо.
3. **Newsletter signup** — додаємо в footer (типовий SaaS pattern), якщо так — який столб?
4. **Social icons** — є active social presence? LinkedIn yes (B2B); Twitter / Facebook — статус?
5. **Trust badges візуальний баланс** — 4 badges може виглядати noisy; залишаємо топ-3?
6. **Compliance link в Company чи в Trust** — посилання на `/compliance` краще під Company чи бейджом в Trust column?
7. **URL strategy для legacy сторінок** — `/for-universities` → 301 від `/university-plagiarism-checker`. Plan для інших переіменованих pages?

---

## 11. Out of scope
- Sitemap full XML (SEO concern, окремий артефакт)
- Per-page footer variants (один footer для всіх pages)
- Investor relations page (no investors)
- Press kit (low priority, можна додати later)
