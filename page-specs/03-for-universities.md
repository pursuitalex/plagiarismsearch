# /for-universities — Page Spec

**Phase:** P1 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Перетворити пошук "Turnitin alternative" у заявку на demo для academic integrity office.

## 2. Primary persona
P3 University admin / academic integrity coordinator. Secondary: dean / procurement.

## 3. Success metric
**G4** — 20+ demo requests / місяць через 6 місяців (зараз ~0, бо CTA немає + URL broken).

## 4. Design layer
**D1 "Editorial Trust"** — cream/off-white фон, serif accents (Newsreader або Source Serif Pro) на H1/H2, менше градієнтів, editorial-структура (asymmetric grid, large quotes), photo: real people в академ-контексті.

**Brief override:** D3 base components (button/input/card) використовуємо як є, але з cream surface override.

## 5. Hero
- **Меседж (H1, serif):** "Academic integrity at scale. Without Turnitin's price tag."
- **Subline:** "GDPR · FERPA · SOC2 compliant. LMS integration. Bulk processing. Dedicated support."
- **Primary CTA:** "Request a demo" (форма / Calendly link)
- **Secondary CTA:** "Download whitepaper" (PDF)
- **Візуал:** editorial asymmetric — текст ліворуч (1.5 col), праворуч real photo (faculty member з laptop в bibliotece, НЕ stock) або abstract editorial graphic. **Open Q** — фото vs ілюстрація.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero** | Editorial H1 + dual CTA (demo / whitepaper) |
| 2 | **Outcome stats strip** | "X universities · Y million essays checked · Z% accuracy" |
| 3 | **The problem we solve** | 3-section editorial: AI-generated essays · contract cheating · ESL false positives. Real quote per problem. |
| 4 | **How we differ from Turnitin** | Comparison table compact: price · ESL-aware · 17 languages · API · onboarding time |
| 5 | **Integration story** | Canvas / Moodle / Blackboard / Google Classroom badges + "Set up in 1 day" timeline |
| 6 | **Compliance badges row** | GDPR · FERPA · SOC2 · ISO 27001 — посилання на `/compliance` |
| 7 | **Peer institution logos** | Real university logos (consent required) + textual mentions |
| 8 | **Testimonial spotlight** | Велика editorial цитата від real academic integrity officer (named, with photo) |
| 9 | **Demo request form** | Inline form (institution name, role, email, # students, message) → Calendly or email |
| 10 | **FAQ (B2B-focused)** | Pricing model · data residency · bulk pricing · trial period · onboarding · SLA |
| 11 | **Bottom CTA** | "Talk to our academic integrity team" + email/phone |
| 12 | **Footer** | Глобальний |

## 7. Trust / social proof slots
- §2 outcome stats
- §6 compliance badges (clickable → `/compliance`)
- §7 peer institution logos
- §8 named testimonial + photo + institution
- Footer trust badges

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (primary + secondary outline) | **Editorial hero** — asymmetric layout з serif H1 |
| Card (bordered — для problem sections) | **Compliance badge grid** — large icon + label |
| Input + Textarea | **Demo request form** — composed (Input + Textarea + Select + Button + reCAPTCHA) |
| Lucide icons | **Institution logo strip** — як trust logos, але кольорові, не grayscale |
| | **Editorial quote spotlight** — large pull-quote з attribution |
| | **D1 surface tokens** — cream-50 background + warm neutrals (треба додати в DS) |
| | **Serif text styles** — display-serif, heading-serif (треба додати в DS) |

## 9. Animations / motion
- Hero photo: subtle parallax (3% на scroll)
- Stats §2: animated counters
- Compliance badges: stagger fade-in (50ms each)
- Form: focus ring teal, success state з checkmark animation

## 10. States / edge cases
- Demo form submitted → inline thank-you + "Our team will reach out within 1 business day" + calendar embed (Calendly inline) для self-scheduling
- Form validation errors → field-level helper text у червоному
- LMS integration logos — link до окремих integration sub-pages? **Open Q**
- Mobile: asymmetric hero → stacked, photo above text

## 11. Open questions
1. **Hero visual** — real photo of academic context, abstract editorial illustration, або mesh-gradient editorial variant?
2. **Demo form vs Calendly** — inline form (тільки lead-capture, потім email), Calendly embed (direct booking), або hybrid?
3. **Real institutions** — є реальні peer-universities для §7? Якщо ні, як працюємо: textual "ranks include X institutions" без logos?
4. **Whitepaper** — існує? Що в ньому? Чи створюємо новий?
5. **Pricing для universities** — показуємо приблизний range ($X–Y per student/year) чи лише "custom quote"?
6. **Serif font** — Newsreader vs Source Serif Pro (бріф §6 каже "обидва на тест")
7. **Multi-language** — university спільнота часто non-English; робимо ES/PL переклади (UA-команда має)?
8. **URL fix** — поточний `/for-universities` → 404, реальний `/university-plagiarism-checker`. Підтвердити що нова сторінка повністю заміняє стару URL з 301-редіректом.

## 12. Out of scope
- Live chat widget (non-goal §9)
- Pricing for end-users (Light/Standard/Pro — в `/prices`)
- LMS integration deep-dive (окремі sub-pages, поза MVP)
- Student-facing CTAs ("try free check") — ця сторінка для institutional buyers
- Self-serve signup (B2B path = sales-assisted, бріф §12.4 open)
