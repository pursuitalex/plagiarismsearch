# Google Docs Add-on Landing — Page Spec

**Phase:** P2 · **Status:** draft v1 · **Updated:** 2026-05-13
**Suggested URL:** `/gdocs` або `/google-docs-add-on`

---

## 1. Goal
Активувати 490K existing add-on users → створити web-account через "claim" deep-link. Net-new accounts з установленої аудиторії, без paid acquisition.

## 2. Primary persona
Existing add-on user (mix of P1 Student, P2 Teacher). Secondary: cold visitor хто шукає "Google Docs plagiarism checker".

## 3. Success metric
**Net-new web accounts** з existing 490K installs. Baseline TBD з аналітики. Цільова conversion 5–10% за 6 міс = 25K–50K accounts.

## 4. Design layer
D3 base.

## 5. Hero
- **Меседж (H1):** "Already trusted by 490K writers — claim your account"
- **Subline:** "Used PlagiarismSearch in Google Docs? Get a web account in one click. All your past checks. No re-registration."
- **Primary CTA:** "Claim my account" → deep-link до dashboard / auto-login flow (potrebує backend підтримки — бріф §12.5 open)
- **Secondary CTA:** "I'm new — install the add-on" → external Workspace Marketplace
- **Візуал:** split — ліворуч copy + CTA, праворуч GDocs add-on screenshot з визуально виділеним "Your account" link.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero** | Меседж "you already use us" + claim CTA |
| 2 | **Why claim?** | 3 benefits: history sync · longer checks (>150 words) · bulk upload · team accounts |
| 3 | **How it works (claim flow)** | 3-step: open GDocs → click "Claim account" link → password set. Visual. |
| 4 | **Already a paid user?** | Login CTA → standard login flow |
| 5 | **Not a user yet?** | Install add-on CTA → Workspace Marketplace + screenshot |
| 6 | **Reviews from Workspace Marketplace** | Embedded reviews widget (4.9★, X reviews) |
| 7 | **FAQ** | Why claim? · privacy of past checks · pricing change after claim · cancel anytime · multiple accounts |
| 8 | **Bottom CTA** | Repeat claim CTA + "Stay in Google Docs only" link (no-pressure path) |
| 9 | **Footer** | Глобальний |

## 7. Trust / social proof slots
- Hero: 490K writers
- §6 Workspace Marketplace reviews (4.9★)
- Footer

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button (primary + secondary outline) | **GDocs add-on hero screenshot** з annotation arrow |
| Card | **Claim-flow step viz** — 3 steps з real screenshots |
| Lucide icons | **Workspace Marketplace reviews embed** |
| FAQ accordion | |

## 9. Animations / motion
- §3 step viz: stepped reveal on scroll
- Claim CTA hover: gentle scale 1.02 + shadow lift
- Few animations — це transactional page, не marketing showcase

## 10. States / edge cases
- **Logged out, never used:** show "Install add-on" path більш prominently
- **Logged in (cookie):** auto-redirect → dashboard
- **Add-on user (detection via referrer / Google OAuth):** "Welcome back, [name]" + one-click claim
- **Claim fails / backend not ready:** fallback "Sign up" form з note "We'll sync your history within 24h"
- **No backend support:** page degrades to "Install add-on" + "Sign up" only — без auto-claim. Це baseline до §12.5 рішення.

## 11. Open questions
1. **Backend support для auto-claim** (бріф §12.5 open) — без неї ця сторінка має дуже обмежений value. Потрібен engineering ATL.
2. **Privacy для past checks** — чи маємо їх в DB associated with add-on installs? Якщо ні — promise треба прибрати.
3. **Email collection** — auto-claim requires user email; беремо з Google OAuth чи окремий form?
4. **Pricing transition** — vacant добра після claim? Якщо так, які? (треба free starter tier для GDocs add-on users)
5. **Multi-account merge** — якщо у юзера є web account і add-on history під різними emails — як консолідуємо?
6. **Marketing campaign** — ця сторінка має бути endpoint для in-add-on banner / email campaign? Потрібен координація з marketing.

## 12. Out of scope
- Add-on UI redesign (бріф §4: "В'юер Google Docs add-on (chrome-only refresh; UI самого add-on без змін)")
- Other Workspace integrations (Sheets, Slides — outside scope)
- Multi-platform Office add-ons (Word, etc.)
- Login flow changes (стандартний login flow на /login)
