# /ai-detection — Page Spec

**Phase:** P2 · **Status:** draft v1 · **Updated:** 2026-05-13

---

## 1. Goal
Capture SEO-traffic за "AI detector" / "ChatGPT detector" і конвертувати у trial → paid. Демонструвати ESL-aware accuracy як diferentiator vs GPTZero / Originality.

## 2. Primary persona
Cross-persona: студент (перевіряє власний текст перед submit), вчитель (перевіряє роботи учнів), researcher / editor.

## 3. Success metric
- **G1** — supporting (drives free checks)
- **G2** — supporting (trial → paid)
- SEO ranking для "AI detector" / "ChatGPT detector" queries

## 4. Design layer
**D2 "AI Confident"** — sharper UI, technical accents, live product demo як hero, scan-progress animations, color-coded probability gradient. Navy-950 surface variant.

## 5. Hero
- **Меседж (H1):** "98% accuracy across 17 languages — including ESL-aware detection"
- **Subline:** "Detect ChatGPT, Claude, Gemini, Llama-generated text. Trained on 14B pages. No false positives on non-native English."
- **Primary CTA:** "Try AI detection free" → inline paste widget (як на Home, але output-фокус на AI-probability)
- **Secondary CTA:** "See sample report →" → `/sample-report`
- **Візуал:** dark navy-950 surface, animated probability slider 0–100% (color-coded green→yellow→red gradient). Real-time scanning visual.

## 6. Page structure

| # | Секція | Призначення |
|---|---|---|
| 1 | **Hero (D2 dark)** | Меседж + inline AI-detection paste widget + animated probability indicator |
| 2 | **How it works (technical)** | 3-step з diagrams: tokenization → perplexity analysis → ensemble model. Technical-but-readable. |
| 3 | **Accuracy table** | Per-model: ChatGPT 4 · Claude · Gemini · Llama — detection rate %, false positive rate. Highlight: **2.1% false positive on ESL** vs competitors 15–30%. |
| 4 | **17 languages support** | Visual map або language pill grid з accuracy per language |
| 5 | **ESL-aware chapter** | Editorial-feel section: чому traditional detectors помиляються на ESL, як ми це вирішили. Real example з ESL essay. |
| 6 | **Sample report inline** | Embedded report з підсвічуваннями + probability slider — interactive preview |
| 7 | **Comparison vs GPTZero / Originality / Copyleaks** | Table: accuracy · false-positive rate · languages · API · pricing |
| 8 | **API teaser** | "Build AI detection into your product → [See API docs]" → posyлається на /api |
| 9 | **FAQ** | What models do you detect · paraphrasing tools · false positive rate · how accuracy is measured · per-language data |
| 10 | **Bottom CTA** | "Try AI detection free" + "Talk to API team" (для devs/B2B) |
| 11 | **Footer** | Глобальний (D3 light surface як normal, не D2) |

## 7. Trust / social proof slots
- §3 accuracy table — proof-backed (треба source / methodology link)
- §4 17 languages — claim transformed з footnote у first-class feature
- §6 inline sample — tangible demo
- §7 comparison — позиція "best ESL accuracy" як USP
- **Open Q** — independent study посилання (Penn State-style — бріф §7 згадує "коли буде")

## 8. Components

| Готове в DS | Треба добудувати |
|---|---|
| Button | **D2 hero variant** — dark surface, animated probability indicator |
| Badge | **AI-probability slider** — color-coded 0–100% gradient component |
| Input / Textarea | **Inline AI paste widget** — варіант hero widget з AI-output фокусом |
| Card (всі 3 стилі) | **Accuracy table** — technical comparison з %, color-coded fills |
| Lucide icons | **Language pill grid** — 17 language badges with accuracy on hover |
| FAQ accordion | **Animated scan visualization** — tokenization viz (Lottie?) |
| | **D2 surface tokens** — navy-950 + complementary accents (треба додати в DS) |
| | **Comparison feature row** — compact bench-mark layout |

## 9. Animations / motion
- Hero probability slider: continuous animation 0→100→0 (8s loop, easeInOut)
- §2 "how it works": tokenization viz running through sample text on scroll-in
- §4 language grid: stagger fade (30ms each)
- §6 sample report: scan-line during interactive preview
- D2 dark sections: subtle background pulse (very low opacity)

## 10. States / edge cases
- Paste widget identical states to Home (empty/below-min/above-max/loading/result/error)
- Result detected: probability slider lands on % з color-coded category + "View full report" CTA
- API CTA → external docs (open new tab)
- Reduce motion → static probability indicator (not animated)

## 11. Open questions
1. **Independent study** — є/буде Penn State-style independent research? Якщо ні, що в §3 для accuracy proof?
2. **Methodology link** — публікуємо whitepaper з detection methodology чи keep black-box?
3. **Models list** — які саме AI models claim'имо що detect'имо? (ChatGPT/Claude/Gemini/Llama/Mistral?)
4. **False positive rate** — 2.1% — confirmed number чи приблизний?
5. **API teaser deep-dive** — є real API docs page чи треба створювати?
6. **D2 dark hero на entire page чи лише в hero** — повна сторінка в navy vs тільки hero?
7. **Paraphrasing tools detection** (Quillbot, Wordtune) — як positioning'имо?

## 12. Out of scope
- Standalone AI Detection product page (на іншому продукті) — це частина основного продукту
- Per-AI-model deep dives (один section "models we detect", без окремих pages)
- AI writing tutorial / how-to (це не освітня сторінка)
- Educator-specific framing (це general product page; teachers йдуть на `/for-teachers`)
