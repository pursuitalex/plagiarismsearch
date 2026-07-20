# /for-teachers — Page Spec

**Phase:** P1 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Перевести вчителя (individual educator, не institutional) на self-serve Educator-тариф з прозорим pricing і integration story.

## 2. Primary persona
P2 Teacher / individual educator (K-12 чи undergrad faculty). Secondary: tutor, ESL instructor.

## 3. Success metric
**G2** — Trial → paid (Educator-tier specifically) +30%. Поточна conversion невідома.

## 4. Design layer
D3 base. Subtle D1 hints — serif accent у H1 (опційно, для warmth), без повного editorial-treatment.

## 5. Hero
- **Меседж (H1):** "Check 30 essays a month. Spot AI-written work. Built for educators."
- **Subline:** "Trusted by 490K educators on Google Docs. No IT setup. Works in your existing flow."
- **Primary CTA:** "Start Educator plan — $XX/mo"
- **Secondary CTA:** "Try free with Google Docs add-on"
- **Візуал:** mockup Google Docs sidebar з PlagiarismSearch add-on відкритим — реальний product demo, не ілюстрація. Hero split 50/50.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero** | Меседж + dual CTA + GDocs add-on hero mockup |
| 2 | **GDocs add-on highlight** | "490K educators already use this. Free install. 4.9★" + install button → Workspace Marketplace |
| 3 | **3 use cases** | (a) Batch essay grading · (b) AI-written work detection · (c) ESL false-positive aware checking — кожен з product screenshot |
| 4 | **Workflow integration** | Step-by-step: assign → student writes in GDocs → you check → highlighted report. Visual flow. |
| 5 | **Educator plan card** | Single-tier focus (на відміну від generic /prices): 30 checks/mo, batch upload, no LMS req'd, $XX/mo. CTA "Start plan" |
| 6 | **Testimonials** | 3 quotes from real teachers (named, school context) + Google Workspace Marketplace reviews widget |
| 7 | **Comparison vs Grammarly / Turnitin Feedback Studio** | Compact: price, AI detection inclusion, GDocs native, batch limit |
| 8 | **FAQ** | Educator-specific: classroom use · student privacy · grading workflow · bulk upload · receipts/invoicing for school reimbursement |
| 9 | **Bottom CTA** | "Need accounts for the whole school? [Talk to us →]" → soft handoff на `/for-universities` |
| 10 | **Footer** | Глобальний |

## 7. Trust / social proof slots
- Hero subline: 490K educators on GDocs · 4.9★
- §2 GDocs add-on: Workspace Marketplace reviews widget
- §6 testimonials: 3 named teachers + школа
- §7 comparison: positioning as "affordable + integrated"
- Footer

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (primary + secondary teal) | **GDocs add-on hero mockup** — real product screenshot with annotations |
| Card (elevated — use cases, testimonials) | **Educator Pricing Card** — single-tier focused card (різниться від comparison cards на /prices) |
| Badge | **Workflow flow diagram** — 4-step visual (assign → write → check → report) |
| Lucide icons | **Workspace Marketplace reviews widget** — embed або custom |
| FAQ accordion (shared) | **Comparison row** (compact) |

## 9. Animations / motion
- §4 workflow: step-by-step revealed on scroll (intersection observer)
- §3 use cases: screenshot zoom-in on hover (subtle 102% scale, 200ms)
- §5 pricing card: gentle highlight pulse на initial mount

## 10. States / edge cases
- "Try free with GDocs add-on" CTA → external link до Workspace Marketplace (open new tab)
- Already-installed users — banner: "You're already using our add-on. [Claim web account →]" → posyіляється з cookie/login detection або просто посилання
- Pricing show — без toggle Monthly/Yearly на цій сторінці (один tier, простіше)

## 11. Open questions
1. **Educator tier exact pricing** — $9.99 / $14.99 / $19.95? Кількість checks? (залежить від pricing simplification §12.3 бріфу)
2. **Hero mockup** — real GDocs add-on screenshot (need consent / current UI state) чи реконструкція в Figma?
3. **K-12 vs higher-ed teachers** — одна сторінка чи split? (моя реко — одна, бо use cases overlap)
4. **Student privacy** — потрібен дисклеймер на сторінці? Якщо так — placement?
5. **Bulk upload / batch processing** — це фіча в Educator tier чи upsell?
6. **School reimbursement / invoices** — підтримуємо custom invoicing? (важливо для K-12)
7. **Google Classroom integration** — teaser в бріфі §7 згадує — є technical implementation чи це promise?

## 12. Out of scope
- Student-facing copy (це сторінка для teachers, не для їх студентів)
- Institutional onboarding (`/for-universities`)
- API for grading systems (B2B, не educator-tier)
- Multi-teacher / department accounts (це між educator і university tier — open question)
