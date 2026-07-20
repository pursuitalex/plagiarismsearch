# PlagiarismSearch — Redesign Brief

> Документ синтезує: аудит сайту → moodboard (D3) → competitor analysis → service blueprint. Фундамент для дизайн-фази.
>
> **Версія:** v1 (approved) · 2026-05-13
> **Автори:** Олекс (PM / Design) · Claude (синтез)
> **Status:** approved, перехід у фазу дизайн-системи

---

## 1. Project context

PlagiarismSearch.com — SaaS 15+ років з перевіркою плагіату + AI-детекції. Бренд має сильні активи (orange/teal айдентика, метафора звіту, 490K Google Docs add-on installs, Trustpilot 4.9), але візуально та UX-но "застряг у 2017". Конкуренти (Originality, GPTZero, Copyleaks) обігнали по hero-патернах, accuracy proof і UX. Загроза: Turnitin domesticates institutional, Grammarly бундлить AI-detection.

**Тригер до редизайну:** падіння довіри студентського сегменту через bait free trial + decision paralysis на /prices; неможливість конвертувати university-сегмент через broken IA та B2C-only-credibility.

---

## 2. Goals & Success metrics

| # | Мета | Що вимірюємо | Базова → ціль (12 міс) |
|---|---|---|---|
| G1 | **Hero → trial conversion** | Доля юзерів які успішно перевіряють ≥1 фрагмент тексту без редіректу на signup | ~0% (бо bait) → **40%** anonymous → ≥1 scan |
| G2 | **Trial → paid conversion** | Доля registered users які купують перший тариф у 7 днів | unknown → **+30%** від поточного |
| G3 | **Pricing comprehension** | Avg time на /pricing до click; bounce rate | bounce ~unknown → **−25%** bounce |
| G4 | **B2B inquiry volume** | Заявок «Request demo» / місяць від університетів | ~0 (нема CTA) → **20+/міс через 6 міс** |
| G5 | **Brand modernization perception** | NPS «sounds professional» у студентів + institutional buyers | qualitative baseline → +1 pt |
| G6 | **Accessibility baseline** | WCAG 2.2 AA pass на P0/P1 сторінках | fail → **100% pass** |

**Не-цілі (NOT goals):**
- Збільшення features. Це редизайн існуючого продукту, не product expansion.
- Перетворення на "writing suite" (як Grammarly). Зберігаємо фокус "plagiarism + AI detection".
- Перепис бекенду. Дизайн-токени → frontend; backend незмінний.

---

## 3. Target audiences

Тримаємо 3 персони з Service Blueprint (детально див. Figma page `5225:2`):

| # | Персона | % від revenue (оцінка) | Канал | Тон комунікації |
|---|---|---|---|---|
| P1 | **Student** (17–28, undergrad/Master, ESL ~30%) | ~65% | SEO «free checker» + peer referral + Google Docs add-on | Friendly, reassuring, прозоро про free + price |
| P2 | **Teacher / individual educator** | ~20% | Google Docs add-on + peer recommendation | Pragmatic, time-saving, batch-friendly |
| P3 | **University admin / academic integrity office** | ~15% | Search «Turnitin alternative», G2/Capterra reviews | Editorial, compliance-first, peer-endorsed |

**Edge persona (NOT scoped зараз, лишаємо для майбутніх спринтів):** researcher / journalist / publisher. Існуючі сторінки `/for-editors` і `/for-journalists` лишаємо живими, але не редизайнимо.

---

## 4. Scope

### In scope (P0–P1 для MVP редизайну)
- Home (`/`)
- Pricing (`/prices`)
- B2B landing pages: `/for-universities`, `/for-teachers` + URL fix на 404
- Global elements: header navigation, footer, design tokens, motion guidelines

### In scope (P2 — наступна хвиля)
- `/ai-detection`
- Google Docs add-on landing (post-install funnel)

### In scope (P3 — якщо буде час)
- Compliance / Security hub (новий)
- Sample Report / Live Demo сторінка

### Out of scope (явно НЕ робимо)
- Post-login product (dashboard, report viewer, admin panel) — окремий проект
- Mobile apps (iOS / Android)
- Email templates
- В'юер Google Docs add-on (chrome-only refresh; UI самого add-on без змін)
- Marketing landing pages для дрібних сегментів (`/for-editors`, `/for-journalists`, `/for-publishers`, `/for-authors`)
- Blog redesign
- Help center

---

## 5. Information Architecture

### Глобальна навігація (компресія з поточних 30+ items)

```
Header:
  Products
    → Plagiarism Checker
    → AI Detector
    → Paper Analysis           (merge spell / readability / grammar into one)
  Solutions
    → For Students
    → For Teachers
    → For Universities
  Pricing
  Resources
    → Sample Report             (NEW)
    → API
    → Help Center
    → Blog
  Login / Sign up
```

### Footer (з 47 → ~24 згрупованих)
- Product (4 links)
- Solutions (3 links)
- Resources (4 links)
- Company (4 links)
- Trust (Trustpilot, Sitejabber, Compliance) — як іконки/badges
- Legal (4 links)

**Fix critical:** видалити broken `/for-universities` (404) — замінити правильною URL.

---

## 6. Design direction (з moodboard)

**Base layer — D3 "Soft Productivity"** (затверджено)
- Білий фон + mesh-gradient hero на основі brand orange (#F36F5A) + teal (#0CA9C3)
- Bento-grid для feature blocks
- Friendly micro-animations: spring counters, scan-line, smooth scroll, hover states
- Display sizes: 56–72px H1 desktop / 36–40px mobile

**Layer 2 — D1 "Editorial Trust"** для B2B сторінок (`/for-universities`, `/for-teachers`)
- Тепліший фон (cream / off-white)
- Serif accents на H1/H2 (Newsreader або Source Serif Pro)
- Менше градієнтів, більше editorial-структури (asymmetric grid, large quotes)
- Photo: real people в академ-контексті (не stock)

**Layer 3 — D2 "AI Confident"** для product surfaces (`/ai-detection`, sample report)
- Sharper UI, technical accents
- Live product demos as hero
- Scan-progress animations, color-coded probability gradient

### Typography
- **Primary:** Manrope (variable, supports Cyrillic). Розмірна шкала ~ Display 72/56/40 · Heading 32/24/20 · Body 17/15/13.
- **Fallback:** Geist (якщо Manrope не зайде на демо)
- **Serif accents** (B2B сторінки): Newsreader або Source Serif Pro
- Replace всі Open Sans / Roboto / Arial / Times residuals.

### Color tokens (target — від 2 наявних змінних до ~80+)
- Brand: orange-500 = `#F36F5A`, teal-500 = `#0CA9C3`, success-500 = `#3AC184`
- Neutrals: ramp 50–950 (текст, бекграунди, межі)
- Semantic: priority badges (P0–P3), state (success / warning / danger), AI-probability gradient (0–100%)
- Backgrounds: cream-50 (B2B), white (B2C), navy-950 (D2 product surfaces)

### Motion principles
- Spring-based (не linear ease)
- Тривалість: 150–250ms для UI, 400–600ms для hero / scan-progress
- Reduced motion fallback (a11y)
- Кожна анімація має purpose, не "вау"

### Accessibility floor
- WCAG 2.2 AA на P0/P1 сторінках
- Видалити `maximum-scale=1` (pinch-zoom must work)
- Контраст ≥ 4.5:1 для text, ≥ 3:1 для UI
- Focus states видимі на всіх інтерактивних

---

## 7. Per-page messaging strategy

| Page | Hero меседж | Ключовий CTA | Соцдоказ |
|---|---|---|---|
| **Home** | "Plagiarism + AI detection in one. From $9.95." | Inline paste-text «Check 150 words free, no signup» | Stats (500K+ users, 14B pages, 4.9★) + press logos |
| **Pricing** | "3 simple plans. No hidden tiers." | Monthly/Yearly toggle + «Most popular» middle tier | Comparison: "Same protection as Turnitin / Scribbr, half the price" |
| **/for-universities** | "Academic integrity at scale. Without Turnitin's price tag." | "Request a demo" + custom-quote form | Peer institutions + GDPR / FERPA / SOC2 badges |
| **/for-teachers** | "Check 30 essays a month. Spot AI-written work. Built for educators." | "Start Educator plan" + Google Classroom integration teaser | Teacher quotes + Google Docs add-on (490K installs) |
| **/ai-detection** | "98% accuracy across 17 languages — including ESL-aware detection" | "Try AI detection free" + sample report link | Penn State-style independent study (коли буде) |
| **GDocs add-on landing** | "Already trusted by 490K writers — claim your account" | Deep-link to dashboard post-install | Reviews from Google Workspace Marketplace |
| **Sample Report** | "See exactly what we flag — interactive demo" | "Try with your own text" CTA | Color-coded probability gradient explained |
| **Compliance hub** | "GDPR · FERPA · SOC2 · Data residency" | Download whitepaper | Cert badges |

---

## 8. Brand constraints (preserve)

Що **зберігаємо без переробки** — це brand equity:
- ✅ Логотип (orange + teal ромби)
- ✅ Primary CTA color: orange `#F36F5A`
- ✅ Secondary / link color: teal `#0CA9C3`
- ✅ Метафора звіту з підсвічуванням збігів (signature interaction pattern)
- ✅ Stats: 500K+ users, 14B pages, 25K+ publications, 4.9★ — зберегти + переформатувати
- ✅ Trustpilot + Sitejabber + Google Marketplace badges
- ✅ Назва, slogans, продуктова термінологія

Що **переоформлюємо**, але концептуально лишаємо:
- 🔄 17 мов — підняти з дрібного шрифту в hero-credibility
- 🔄 Google Docs add-on — з footnote у major distribution story
- 🔄 Accuracy claim (98%, 99%) — перетворити з рекламних бейджів у proof-backed badge

---

## 9. Non-goals (явні відмови)

| Не робимо | Чому |
|---|---|
| Не додаємо Grammarly-style "writing suite" фічі | Розфокусовує бренд; PlagiarismSearch має чіткий фокус |
| Не робимо dark-mode як default | Аудиторія мікс (студенти + admin); dark-mode як opt-in після MVP |
| Не використовуємо stock photos | Замінюємо abstract illustrations + product UI demos |
| Не додаємо live chat widget | Дешевий B2C-сигнал; для B2B — окремий contact form |
| Не пушимо subscription-only model | Pay-as-you-go single check лишається для casual students |

---

## 10. Risks & mitigations

| # | Ризик | Ймовірність | Mitigation |
|---|---|---|---|
| R1 | "150 words inline" складно технічно (rate-limiting, anti-abuse) | High | Спочатку proof-of-concept на frontend; backend rate-limit per IP + reCAPTCHA invisible |
| R2 | Спрощення з 12 → 3 тарифів втратить revenue per visitor | Medium | A/B test: 3 vs 5 vs 12 (control). Almost certainly 3 виграє в conversion volume |
| R3 | Manrope не зайде у Cyrillic для UA/RU дублікатів сайту | Low | Manrope має Cyrillic; перевірити перед локом. Fallback — Geist |
| R4 | D3 "Soft Productivity" виглядатиме casual для university admins | Medium | D1 Editorial layer на /for-universities; design system tokens підтримують обидва відчуття |
| R5 | Команда розробки не зможе підняти 80+ дизайн-токенів | Medium | Поетапно: спочатку color + typography + spacing tokens (40); rest у фазі 2 |
| R6 | SEO просідання після зміни IA | High | 301-редіректи на всі змінені URLs; sitemap update; Search Console моніторинг 90 днів |

---

## 11. Timeline / phases

```
Phase 0 — Foundation (тижні 1–2)
  • Manrope/Geist final decision
  • Design tokens v1 (40 базових)
  • Component primitives (Button, Input, Card, Badge, Table)
  • Motion guidelines doc

Phase 1 — P0 pages (тижні 3–6)
  • Home: hero + 3-step + features + pricing teaser + footer
  • Pricing: 3 tiers + toggle + comparison
  • Visual QA, dev handoff

Phase 2 — P1 pages (тижні 7–10)
  • /for-universities (D1 editorial direction)
  • /for-teachers (educator hub)
  • B2B contact form / demo request flow

Phase 3 — P2 pages (тижні 11–13)
  • /ai-detection (ESL-aware)
  • GDocs add-on landing
  • Sample Report demo

Phase 4 — P3 + polish (тижні 14–15)
  • Compliance hub
  • Accessibility audit pass
  • Performance optimization
  • Pre-launch QA
```

**Передумова:** одна дизайн-зміна в Phase 0 (tokens + primitives) розблоковує паралельну роботу над P0/P1 у Phase 1–2.

---

## 12. Open decisions (для PM / стейкхолдерів)

Лишаються як open у v1:

1. ~~**Шрифт фінальний** — Manrope (моя реко) чи Geist?~~ → **LOCKED: Manrope** (2026-05-13). Revisitable при milestone готової home page.
2. **Persona priorities** — підтверджуємо 3 (Student + Teacher + Admin), чи додаємо researcher / publisher у MVP?
3. **Pricing simplification** — згода на 3 тарифи (з ймовірним короткостроковим revenue dip заради conversion volume)?
4. **B2B path** — чи окремий flow "Request demo" (sales-assisted) до Phase 2, чи self-serve лишаємо?
5. **490K Google Docs add-on юзери** — згода активувати їх через "claim account" deep-link (потребує backend підтримки)?
6. **Compliance hub priority** — P3 (як зараз), чи підняти до P1 якщо є договори з universities?

---

## Sources

- Audit (2026-05-13): DOM inspection of plagiarismsearch.com
- Service Blueprint: Figma page `5225:2` in [PlagiarismSearch — Redesign](https://www.figma.com/design/7hBJUpDs9IXzBs6opCdUiE/PlagiarismSearch---Redesign)
- Competitor analysis: 7 players (Turnitin, Copyleaks, Grammarly, GPTZero, Originality.ai, Scribbr, Quillbot)
- Moodboard direction: D3 "Soft Productivity" (approved 2026-05-13)
