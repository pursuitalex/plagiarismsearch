# Home (`/`) — Page Spec

**Phase:** P0 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Перевести анонімного відвідувача з SEO / реферала на ≥1 успішний 150-word check без редіректу на signup — і далі м'яко на тариф.

## 2. Primary persona
P1 Student (≈65% revenue). Secondary: P2 Teacher.

## 3. Success metric
**G1** — Hero → trial conversion: **40%** anonymous users → ≥1 scan (current ~0% через bait-CTA).

## 4. Design layer
D3 "Soft Productivity" base. Без D1/D2 шарів на цій сторінці.

## 5. Hero
- **Меседж (H1):** "Plagiarism + AI detection in one. From $9.95."
- **Subline:** "Trusted by 500K+ writers · 14B pages indexed · 4.9★ Trustpilot"
- **Primary CTA:** **Inline paste-text widget** — "Check 150 words free, no signup"
- **Secondary CTA:** "See pricing →" (teal ghost)
- **Візуал:** mesh-gradient (orange × teal) фон. Праворуч від тексту — мокап результату скану (підсвічені збіги + AI-probability indicator) як live-демо. Без stock-фото.

## 6. Page structure (зверху вниз)

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero** | Меседж + inline check widget + соцпруф числами |
| 2 | **Trust strip** | Логотипи преси / G2 / Capterra / Trustpilot · grayscale |
| 3 | **3-step "How it works"** | Paste → Scan → Get report. Anchor-link з hero "How does it work?" |
| 4 | **Dual capability bento** | 2×2: Plagiarism check · AI detection · 17 languages · GDocs add-on. Кожен блок — короткий CTA "See more →" |
| 5 | **Live sample report teaser** | Inline preview звіту з підсвічуваннями + CTA "See full sample →" → `/sample-report` |
| 6 | **Pricing teaser** | 3 тарифи compact, "Most popular" посередині + toggle Monthly/Yearly. CTA "See all plans →" → `/prices` |
| 7 | **Testimonials** | 3 цитати (Student / Teacher / University admin) + Trustpilot/Sitejabber widget |
| 8 | **FAQ** | 6–8 питань (free trial, accuracy, AI vs plagiarism, languages, data privacy, refund) |
| 9 | **Bottom CTA strip** | Велика повторна CTA "Start free check" + secondary "Talk to sales (B2B)" |
| 10 | **Footer** | Стиснений (див. [10-footer-global.md](10-footer-global.md)) |

## 7. Trust / social proof slots
- Hero subline: 500K+ users · 14B pages · 4.9★
- §2 Trust strip: press logos (grayscale → color on hover)
- §5 inline mention: "Used by university X / Y / Z"
- §7: 3 quote cards + Trustpilot widget
- Footer: trust badges (див. footer spec)

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (primary CTA, secondary ghost, teal) | **Hero paste-text widget** — paste area + char counter + scan button + result preview · критично для G1 |
| Input | **Stats strip** — число + label з animated counter |
| Badge ("Most popular") | **Trust logo strip** — grayscale-to-color logos |
| Card (filled — feature bento) | **Pricing Card compact** — для §6 teaser |
| Text styles (display/h1/h2/body) | **Testimonial card** — quote + avatar + name + role |
| Lucide icons | **FAQ accordion** |
| | **Section header** — eyebrow + title + subtitle |
| | **Bento grid container** — 2×2 з різними cell sizes |
| | **Bottom CTA strip** — full-width band |

## 9. Animations / motion
- Hero gradient: повільний mesh shift (10s ease loop)
- Stats counters: spring-up з 0 на scroll-in (400ms)
- Scan widget: scan-line анімація під час обчислення (1.5s loop)
- Section reveal: fade + 12px translateY на in-view (250ms)
- Pricing toggle Monthly/Yearly: slide-flip 200ms
- `prefers-reduced-motion` — всі анімації off

## 10. States / edge cases (paste widget — критично)
- **Empty:** placeholder "Paste your text here (max 150 words for free check)"
- **<50 words:** disabled CTA + helper "At least 50 words needed"
- **>150 words:** counter червоний + "Sign up to scan longer texts"
- **Loading:** scan-line + "Checking 17 languages…"
- **Result clean:** green badge "0% plagiarism · 2% AI"
- **Result detected:** orange callout + "See full report (free signup)"
- **Rate-limit hit:** "You've used your free check. [Sign up] to continue"
- **Error / network:** retry CTA + fallback "Try again or [contact support]"

## 11. Open questions

### Locked 2026-05-13
- ✅ **Hero дуальність** — Plagiarism + AI detection **рівноправно**. Hero меседж "Plagiarism + AI detection in one." Diferentiator = комбо.
- ✅ **Pricing teaser** — **3 compact-картки** з "Most Popular" посередині + toggle Monthly/Yearly + CTA "See all plans →". Placeholder-цифри до закриття §12.3 бріфу.
- ✅ **Sequence** — Pricing → Testimonials → FAQ → Bottom CTA. Pricing раніше = менше скролу до конверсії; testimonials закривають заперечення.
- ✅ **490K GDocs claim** — **лише в bento §4** як окремий cell з CTA "Already a user? Claim →". Hero без додаткового CTA.
- ✅ **B2B path** — лише в **bottom strip §9** ("Talk to sales (B2B)") + Header nav. Hero чистий для P1 student.
- ✅ **Stats** — **"500,000+ writers · 490K Google Docs installs · 14B pages · 4.9★"** (розділяємо verifiable installs і heritage total claim). Якщо 500K total не підтверджено, fallback: "490K Google Docs installs" як head.
- ✅ **Bento §4** — **2×2 asymmetric**: великий лівий (60%) Plagiarism з product mockup; 2 невеликі праворуч — AI detection + 17 languages; широкий нижній (100%) — GDocs add-on з "490K installs · Claim →".

### Still open (не блокують макет)
- Точне число total users (500K vs 490K) — потребує верифікації з аналітики. Якщо 500K не підтверджено — fallback до 490K як головного.

## 12. Out of scope (для цієї сторінки)
- Full report viewer (окрема сторінка `/sample-report`)
- Detailed pricing comparison (на `/prices`)
- Login / signup форми (модалка, окремий flow)
- Blog teasers (Blog redesign out of scope per бріф §4)
- Live chat widget (non-goal per §9)
