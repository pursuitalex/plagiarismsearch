# /compliance — Page Spec

**Phase:** P3 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Закрити security/compliance review для university procurement. Сторінка часто шукається після demo як частина vendor evaluation.

## 2. Primary persona
P3 University admin + IT/security/procurement officer. Secondary: enterprise legal team.

## 3. Success metric
**G4** supporting — reduce sales cycle time for university deals (no "send me your DPA" email round-trips).

## 4. Design layer
**D1 "Editorial Trust"** — cream/off-white surface, serif accents, large editorial typography, less interactive/motion-heavy. Це довідкова сторінка, не conversion funnel.

## 5. Hero
- **Меседж (H1, serif):** "GDPR · FERPA · SOC2 · Data residency"
- **Subline:** "Built for institutions. Audited annually. Documentation available for download."
- **Primary CTA:** "Download our DPA" (PDF link)
- **Secondary CTA:** "Talk to security team" (email mailto: чи form)
- **Візуал:** editorial — 4 large compliance badges в hero (GDPR / FERPA / SOC2 / ISO 27001), кожен — клікабельний link на свою секцію нижче.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero** | H1 + 4 compliance badges + DPA download |
| 2 | **Per-framework sections (anchor links)** | GDPR · FERPA · SOC2 · ISO 27001 — кожна 1-page-длиною з: scope, certification status, document download, last audit date |
| 3 | **Data flow diagram** | Visual: user → upload → encryption → storage → deletion. Editorial illustration. |
| 4 | **Data residency** | EU / US data centers explained · choose your region option for paid tiers |
| 5 | **Sub-processors list** | Table: name · purpose · location · DPA link (AWS, Cloudflare, Stripe, etc.) |
| 6 | **Vulnerability disclosure** | Responsible disclosure policy + security@email + PGP key |
| 7 | **Document downloads** | DPA · SOC2 Type II report (NDA-gated) · Penetration test summary · Privacy whitepaper |
| 8 | **Contact security team** | Inline form (institution, role, framework concern, message) |
| 9 | **Footer** | Глобальний |

## 7. Trust / social proof slots
- §1 4 compliance badges
- §2 last audit dates per framework
- §5 sub-processors transparency
- §7 downloadable artifacts = trust proof
- Footer

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (download CTAs) | **Compliance badge grid** — large icon + label + last audit date (shared з /for-universities) |
| Card (bordered — для framework sections) | **Data flow diagram** — editorial illustration (one-time art, not reusable component) |
| Input + Textarea (security contact form) | **Sub-processor table** — adapted from DS §10 Table pattern |
| Lucide icons (lock, shield, certificate) | **Anchor nav (sticky)** — Compliance ToC: GDPR · FERPA · SOC2 · ISO 27001 |
| | **Document download card** — file icon + name + size + last updated + download button |

## 9. Animations / motion
- Minimal — це reference page
- Anchor nav: smooth-scroll до section (300ms)
- Compliance badges: fade-in on load (no other motion)
- `prefers-reduced-motion` повна compliance

## 10. States / edge cases
- DPA download → direct PDF (no signup gate)
- SOC2 report download → NDA-gated form: name, company, email → email link
- Form submitted → inline thank-you
- Sub-processor list — keep up-to-date (open Q — process для оновлення)

## 11. Open questions
1. **Compliance status real?** — які саме certifications реально маємо? GDPR mandatory, але SOC2 Type II / FERPA / ISO 27001 — потрібен audit list.
2. **DPA template** — існує? Чи треба створити з legal?
3. **Sub-processors list** — real list від engineering team
4. **Pen test summary** — є / коли був останній / можна публікувати?
5. **PGP key для vulnerability disclosure** — є / створюємо?
6. **Data residency** — реально пропонуємо EU-only storage чи це plan?
7. **Priority P3 vs P1?** — бріф §12.6 open: піднімаємо до P1 якщо є договори з universities в pipeline?

## 12. Out of scope
- Customer-facing security dashboard (product feature, out of scope)
- Compliance certifications для frameworks які не маємо (HIPAA, etc.)
- Bug bounty program (вирішує separately, посилання можна додати якщо буде)
- Per-customer custom security questionnaires (sales process, not page)
