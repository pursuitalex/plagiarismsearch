# /sample-report — Page Spec

**Phase:** P3 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Знизити "what will I actually get?" risk через interactive demo full report. Працює як deep-dive trust builder перед покупкою.

## 2. Primary persona
All 3 personas (Student / Teacher / Admin) — кожна хоче побачити що саме flag'имо перш ніж заплатити.

## 3. Success metric
- **G1** supporting — користувачі хто бачив sample мають вищу conversion на trial
- **G2** supporting — reduced refund rate (фактичні очікування)

## 4. Design layer
**D2 "AI Confident"** — sharp UI, technical fidelity. Color-coded probability gradient в action. Можна inline на light surface (на відміну від `/ai-detection` де D2 dark hero).

## 5. Hero
- **Меседж (H1):** "See exactly what we flag — interactive demo"
- **Subline:** "Real report from real text. Try with your own — no signup required."
- **Primary CTA:** "Try with your own text" → inline paste widget (як Home)
- **Secondary CTA:** "View sample reports →" — switch між presets (essay / research paper / AI-generated text)
- **Візуал:** **embedded report viewer прямо в hero** — це і є сторінка. Hero = compact intro, всю сторінку займає live demo.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero (compact)** | H1 + dual CTA + preset switcher |
| 2 | **Embedded report viewer** | Full interactive demo: highlighted text + sidebar with detected sources + probability slider + filters (plagiarism / AI / cited / paraphrased) |
| 3 | **Legend & explanation** | Color-coded system explained: red (direct match) · orange (paraphrased) · yellow (AI-likely) · green (clean) · gray (cited). Editorial section. |
| 4 | **3 preset reports tabs** | Switch between: (a) Student essay з minor plagiarism · (b) Research paper з citations · (c) AI-generated text. Click tab → viewer updates. |
| 5 | **What we detect** | 4-section: Direct plagiarism · Paraphrasing · AI-generated · Proper citations. Each з icon + 2-line explanation. |
| 6 | **Try with your own text** | Inline paste widget — same flow як Home hero |
| 7 | **CTA strip** | "Get full reports for $X/month [See plans]" → `/prices` |
| 8 | **Footer** | Глобальний |

## 7. Trust / social proof slots
- Page itself IS the social proof — demonstrating capability через interactivity
- Section 5 — accuracy claim з footnote → methodology
- Footer trust badges

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button | **Embedded report viewer** — major new component: highlighted text + sidebar + filters + slider |
| Card | **Preset switcher tabs** — 3-tab segmented control |
| Badge (для color-coded categories) | **Color legend block** — visual key |
| Lucide icons (filter / source / paraphrase) | **AI-probability slider** (shared з /ai-detection) |
| Input (paste widget) | **Match-source sidebar card** — source URL + similarity % + excerpt |

## 9. Animations / motion
- Hero: highlight animation on sample text (як ця сторінка завантажується, текст послідовно підсвічується)
- Preset tab switch: cross-fade (200ms) + content swap
- Filter toggle: highlight types fade in/out (150ms)
- Hover на highlighted span: source preview tooltip
- Reduced motion → static highlights без entrance animation

## 10. States / edge cases
- Paste widget states: same as Home hero (empty/min/max/loading/result/error)
- Preset reports — preloaded JSON (не api calls на load)
- Source sidebar — empty state "Click any highlight to see source"
- Mobile: report viewer + sidebar stack (viewer top, sidebar collapsible drawer)
- Print view (advanced) — clean printable report

## 11. Open questions
1. **Sample report data** — 3 presets потребують real (anonymized) content. Хто пише / готує?
2. **Source previews** — показуємо real URLs (з real database matches) чи fictional examples?
3. **Interactive filter functionality** — повна functionality (real-time filter) чи статичний showcase з pre-determined views?
4. **Paste-and-scan integration** — coupled з backend API чи mock?
5. **Sharing** — generate shareable link для individual report? (advanced feature, потенційно out of scope для MVP)
6. **Sample reports per persona** — також показуємо "How a teacher uses this" / "How an admin views team reports" чи single end-user view?

## 12. Out of scope
- Real authenticated report viewer (це product UI — окремий проект)
- Bulk report comparison (team feature, out of scope per бріф §4)
- Custom branding for reports (B2B feature)
- Export to PDF / DOCX (mention as "available in paid plan" only)
- API documentation (на /api page)
