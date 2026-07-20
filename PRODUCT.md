# PlagiarismSearch — Product Context

> Context for design + content decisions. Source of truth: `redesign-brief-v1.md` (strategy) + `page-specs/` (tactics).

---

## Product

**PlagiarismSearch.com** — 15-year-old SaaS for plagiarism detection + AI-generated-text detection. Hosted at plagiarismsearch.com. 500K+ writers, 490K Google Docs add-on installs, 14B pages indexed, 4.9★ Trustpilot.

**Current state:** Visually + UX stuck in 2017. Bait-style free trial (CTA → signup redirect, no inline check). 12 pricing tiers with duplicate prices. Hero stacked with stock-photo guy. Mixed icon styles. 30+ menu items in 4 dropdowns. Broken IA (`/for-universities` → 404, actual URL `/university-plagiarism-checker`).

**Goal:** Modernize the surface — fonts, motion, lightness, conversion patterns — **without rebranding**. Keep orange/teal identity, report-highlight metaphor, 500K user heritage.

---

## Personas (from Service Blueprint, Figma `5225:2`)

### P1 — Student (~65% revenue) — primary
17-28, undergrad/Master, ESL ~30%. Channel: SEO ("free plagiarism checker") + peer referral + Google Docs add-on. Tone: **friendly, reassuring, transparent on free + price**. Mental model: "I have a deadline, I need a fast, honest check, ideally free." Key emotions: anxiety about deadline, fear of false positives on ESL writing, distrust of bait-trial CTAs.

### P2 — Teacher / individual educator (~20% revenue)
K-12 + faculty + tutors. Channel: Google Docs add-on + peer recommendation. Tone: **pragmatic, time-saving, batch-friendly**. Mental model: "30 essays a month, gimme bulk + AI detection + invoice for school reimbursement."

### P3 — University admin / academic integrity office (~15% revenue, highest LTV)
Compliance / procurement / dean. Channel: search "Turnitin alternative", G2/Capterra reviews. Tone: **editorial, compliance-first, peer-endorsed**. Mental model: "Show me DPA, SOC2, peer institutions, demo flow, custom-quote."

**Edge personas (NOT scoped, but pages stay alive):** researcher, journalist, publisher, editor.

---

## Brand

### Locked equity (preserve)
- ✅ Logo (orange + teal lozenges)
- ✅ Primary CTA color: orange `#F36F5A`
- ✅ Secondary / link color: teal `#0CA9C3`
- ✅ Report metaphor with highlighted matches (signature interaction)
- ✅ Stats: 500K users · 14B pages · 25K publications · 4.9★ Trustpilot
- ✅ Trustpilot + Sitejabber + Google Workspace Marketplace badges
- ✅ Product names + slogans

### Reformatted (concept preserved, presentation new)
- 🔄 "17 languages" — from footnote to first-class hero credibility
- 🔄 "Google Docs add-on" — from afterthought to major distribution story (490K)
- 🔄 "98% accuracy" — from ad badge to proof-backed footnote-linked claim

### Brand voice tone register
- **B2C (Home, Pricing, AI Detection):** friendly, direct, honest. No marketing jargon. Imperative "Check 150 words free." Short sentences.
- **B2B (Universities, Compliance):** editorial, formal-but-warm. Use serif accents (Newsreader). Lead with outcomes ("Academic integrity at scale") not features.
- **Educator (Teachers):** pragmatic, peer-tone. "Check 30 essays a month." Lead with workflow integration.

---

## Strategic principles

1. **Honesty first** — no bait free trials. If we say "150 words free", it works inline, no signup gate.
2. **Conversion-first hero** — Home G1 metric: 40% anonymous → ≥1 scan. Inline paste widget is critical.
3. **Brand modernization, not rebrand** — keep orange/teal/lozenge identity; refresh typography, motion, spacing, photo policy.
4. **Multi-persona pages, not a monolith** — `/for-universities` editorial layer, `/for-teachers` GDocs-led, `/ai-detection` AI-confident layer. Same component primitives, different surfaces.
5. **B2B + B2C dual track** — student self-serve flow lives alongside sales-assisted university flow. Don't force one path on both.
6. **No stock photos** — abstract illustrations, mesh-gradients, product UI demos. Stock-photo guy is OUT.
7. **Accessibility floor: WCAG 2.2 AA on P0/P1.** Contrast ≥4.5:1 text, ≥3:1 UI. Remove `maximum-scale=1`. Pinch-zoom must work.
8. **Motion has purpose** — no "wow" animations. Spring 150-250ms UI, 400-600ms hero. Reduce-motion respected.

---

## Anti-references (what we are NOT)

- **Turnitin** — institutional-only, complex UI, no self-serve. We're affordable, self-serve-first.
- **Grammarly** — writing assistant first, plagiarism/AI as add-on. We stay focused: plagiarism + AI ONLY.
- **GPTZero / Originality.ai** — AI-first, narrow product. We do plagiarism + AI in one, not either-or.
- **Old PlagiarismSearch (current live site)** — bait CTA, stock photos, 12-tier pricing, 47-link footer. We're cleaner, lighter, faster.
- **Generic SaaS template look** — gradient hero + 3 feature columns + 3-tier pricing + testimonial carousel. We use bento, editorial, asymmetric layouts that fit our brand.

---

## Goals & metrics (G1-G6, from brief §2)

| # | Goal | Target (12 mo) |
|---|---|---|
| **G1** | Hero → trial conversion | ~0% → **40%** anonymous → ≥1 scan |
| **G2** | Trial → paid conversion | unknown → **+30%** |
| **G3** | Pricing comprehension (bounce, time-to-CTA) | bounce → **−25%** |
| **G4** | B2B inquiry volume | ~0 → **20+/mo** |
| **G5** | NPS "sounds professional" | qual baseline → +1 pt |
| **G6** | WCAG 2.2 AA on P0/P1 | fail → **100% pass** |

---

## Non-goals (явні відмови, бріф §9)

- ❌ Writing-suite features (Grammarly path) — stays focused on plagiarism + AI
- ❌ Dark mode as default (opt-in only post-MVP)
- ❌ Stock photos
- ❌ Live chat widget (B2C signal — too casual for B2B)
- ❌ Subscription-only (pay-as-you-go for casual students stays)
- ❌ Post-login product UI (dashboard, report viewer — separate project)
- ❌ Mobile apps
- ❌ Blog redesign

---

## Scope (P0–P3, brief §4)

- **P0 (Phase 1):** Home, Pricing, Header, Footer
- **P1 (Phase 2):** /for-universities, /for-teachers
- **P2 (Phase 3):** /ai-detection, GDocs claim landing
- **P3 (Phase 4):** /sample-report, /compliance
- **Per-page specs:** see `page-specs/`

---

## Open decisions (still affecting design)

From brief §12 — pending PM/stakeholder lock:
1. Persona MVP scope (researcher/publisher in or out?)
2. Pricing simplification 12 → 3 (revenue dip risk)
3. B2B path: sales-assisted vs self-serve
4. GDocs claim flow backend support (P0 blocker for `/gdocs` page value)
5. Compliance hub priority — P3 default, P1 if universities in pipeline
