# Pricing (`/prices`) — Page Spec

**Phase:** P0 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Прибрати decision paralysis на pricing (зараз 12 тарифів + дубльовані ціни) → довести до вибору тарифу за <60 сек.

## 2. Primary persona
P1 Student (single-check + monthly). Secondary: P2 Teacher (educator plan).

## 3. Success metric
- **G2** — Trial → paid conversion +30%
- **G3** — Pricing bounce −25%, time-to-CTA −50%

## 4. Design layer
D3 base.

## 5. Hero
- **Меседж (H1):** "3 simple plans. No hidden tiers."
- **Subline:** "Pay only for what you need. Cancel anytime. 7-day money-back guarantee."
- **Hero CTA:** Monthly/Yearly toggle (за замовчуванням Yearly — −20%)
- **Візуал:** без hero-картинки. Pricing cards починаються в hero — це і є основний контент.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero header** | H1 + toggle + subline |
| 2 | **3-tier pricing cards** | Light · Standard ("Most Popular") · Pro — без duplicate prices |
| 3 | **Pay-as-you-go option** | Single check $1.95 — для casual student |
| 4 | **Educator plan** | Teacher tier ($XX/міс, 30 essays) — окремою картою, посилання на `/for-teachers` |
| 5 | **University tier** | Custom quote → CTA "Request demo" → `/for-universities` |
| 6 | **Comparison table** | Plagiarism + AI detection vs Turnitin / Scribbr / Originality — наш ціновий перевага |
| 7 | **Trust strip** | "Same accuracy as Turnitin / Scribbr — half the price" · refund policy badge · 4.9★ Trustpilot |
| 8 | **FAQ** | 5–8 питань (refunds, plan switching, what counts as a "check", credit rollover, team accounts) |
| 9 | **Bottom CTA** | "Still unsure? Try 150 words free →" → Home hero anchor |
| 10 | **Footer** | Глобальний |

## 7. Trust / social proof slots
- §7 trust strip — 4.9★ + refund badge + "X-day guarantee"
- §6 comparison — позиція "affordable Scribbr / Turnitin alternative" (з бріфу §6)
- Footer trust badges

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (primary + secondary) | **Pricing Card full** — price + features list + CTA + "Most Popular" badge |
| Badge ("Most Popular", "Best Value") | **Monthly/Yearly toggle** — switch component |
| Card (elevated — для tier cards) | **Comparison table** — Pricing-spec adapted з DS §10 |
| Input | **FAQ accordion** (shared з Home) |
| Lucide icons (check, x для features list) | **Pay-as-you-go callout** — між tiers і educator |

## 9. Animations / motion
- Monthly/Yearly toggle → ціни flip-вгору (200ms)
- "Most Popular" tier — субтильна elevation pulse на mount (один раз, 600ms)
- Card hover — translateY -4px + elevation з /2 → /3 (200ms)
- Comparison row hover — subtle highlight (150ms)

## 10. States / edge cases
- Toggle Yearly → ціни перераховані + savings badge "Save 20%"
- Currency: USD by default. **Open Q** — auto-detect locale?
- Tax inclusion: показуємо excl. tax + footnote "Taxes calculated at checkout"
- CTA на tier card → одразу checkout flow (logged-in) або signup→checkout (anonymous)
- Discount banner (sticky top) — якщо є кампанія, не зашиваємо в макет, тримаємо як option slot

## 11. Open questions
1. **Які саме 3 тарифи** (бріф §12.3 — pricing simplification ще open) — потрібен список з PM:
   - Light: $X/міс · Y words · Z checks
   - Standard ("Most Popular"): $X/міс · …
   - Pro: $X/міс · …
2. **Single-check $1.95 pay-as-you-go** — окремий блок (як зараз пропоную §3) чи 4-та картка в ряду?
3. **Educator + University** — окремі блоки (§4, §5) чи прибираємо звідси і лишаємо тільки CTAs у footer?
4. **Yearly default чи Monthly default?** Yearly підвищує LTV, Monthly — conversion.
5. **Free trial** — окрема картка "Free 150 words" чи лише як bottom CTA?
6. **Refund period** — 7 чи 14 днів? (бріф не фіксує)
7. **Credit rollover** — чи дозволяємо переніс невикористаних credits між місяцями?

## 12. Out of scope
- Checkout flow (отриманий dashboard / payment processing)
- Affiliate / referral program (окрема сторінка, якщо буде)
- Detailed feature matrix (тільки топ-3-5 рядків у comparison, повний список — в окремому FAQ-link)
- Currency switcher UI (locale auto-detect, без UI control у MVP)
