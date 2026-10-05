# Section Library — матеріали для review pilot (Section Header + FAQ)

Усе в розділах 1–7 — це **pilot у закоміченому стані** (`main`, коміт `5330452`; сам pilot — `468505c`, злиття — `81c019d`). П'ять уніфікацій у розділі 8 **не закомічені**; у фрагменти розділів 1–7 вони не входять.

Живий каталог: `site/section-library.html` (локально `http://localhost:4173/section-library.html`). Увага: у робочій копії каталог зараз перезібраний з уніфікаціями, тому для review pilot беріть фрагменти з цього файлу або з `git show 5330452:build/sections/snippets/<файл>`.

## 1. HTML FAQ — базовий фрагмент

`build/sections/snippets/faq-fluid.html` — те, що копіюється в CMS. Копія Pricing FAQ, три питання.

```html
<section id="example-faq" data-component="faq" class="faq" data-bg="tint" data-space="lg" data-layout="fluid">
  <div class="faq-inner">
    <div class="faq-grid">
      <div class="faq-aside rv">
        <div class="section-eyebrow">
          <span class="section-eyebrow-dot"></span>
          <span class="section-eyebrow-label">Questions</span>
        </div>
        <h2 class="section-title">Pricing FAQ</h2>
        <p class="section-intro">Need help with an existing plan or account?</p>
        <div class="section-more"><a href="https://plagiarismsearch.com/faq-and-support" rel="noopener" class="section-link">Visit the Help Center</a></div>
      </div>
      <div class="faq-frame rv">
        <div class="faq-list" data-faq>
          <div class="faq-item open">
            <button type="button" aria-controls="example-faq-a1" aria-expanded="true" class="faq-q">
              <span class="faq-q-text">How do I choose the right PlagiarismSearch plan?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-a1"><div><p class="faq-a-body">Start with how much content you expect to check and which additional features you need. Use the One-time, Monthly, 3-Months, and Yearly tabs to compare the current price, checking allowance, billing period, and included features for each plan.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-a2" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Do one-time packages expire?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-a2"><div><p class="faq-a-body">No. A purchased one-time quota does not expire, so you can use it when you need it rather than within a fixed billing period.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-a3" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">What if the standard plans do not fit my volume?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-a3"><div><p class="faq-a-body">Explore the VIP options if you need a higher-volume or custom arrangement beyond the standard pricing choices. <a href="vip.html" class="faq-link">View VIP options</a></p></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## 2. HTML Section Header

Section Header — примітив: пігулка, `h2`, вступ і тихе посилання. Власної обгортки не має: частини лежать у колонці компонента-хоста (у FAQ — в `.faq-aside`).

**Базовий вигляд** (з `faq-fluid.html`):

```html
<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">Questions</span>
</div>
<h2 class="section-title">Pricing FAQ</h2>
<p class="section-intro">Need help with an existing plan or account?</p>
<div class="section-more"><a href="https://plagiarismsearch.com/faq-and-support" rel="noopener" class="section-link">Visit the Help Center</a></div>
```

**Посилання з іконкою, без обгортки** (fixed-розкладка, з `faq-fixed.html`):

```html
<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">Questions</span>
</div>
<h2 class="section-title">Plagiarism Checker FAQ</h2>
<p class="section-intro">Answers to common questions about plagiarism checking, sources, privacy, AI analysis, supported languages, file types, and free use.</p>
<a href="help-center.html" class="section-more section-link">
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
  More questions? Visit the Help Center.
</a>
```

**Малий вступ** (з `faq-fluid-small-intro.html`):

```html
<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">Questions</span>
</div>
<h2 class="section-title">AI Detector FAQ</h2>
<p class="section-intro" data-size="small">Still have a question about your account, reports, or AI checking?</p>
<div class="section-more"><a href="https://plagiarismsearch.com/faq-and-support" rel="noopener" class="section-link">Visit the Help Center</a></div>
```

**Пігулка на білій секції** (з `faq-fluid-rich.html`):

```html
<div class="section-eyebrow" data-bg="tint">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">Questions</span>
</div>
<h2 class="section-title">Turnitin Alternative FAQ</h2>
```

| Клас | Що це | Варіант |
|---|---|---|
| `.section-eyebrow` | пігулка | `data-bg="white"` (за замовчуванням) або `"tint"` |
| `.section-eyebrow-dot` | крапка в пігулці | — |
| `.section-eyebrow-label` | напис у пігулці | — |
| `.section-title` | `h2` | — |
| `.section-intro` | вступ | `data-size="lead"` (за замовчуванням) або `"small"` |
| `.section-more` | відступ над посиланням: обгортка `<div>` або сам `<a>` | — |
| `.section-link` | тихе посилання | — |

## 3. Усі варіанти FAQ

Вісім затверджених конфігурацій. Три корені: секція (`<section class="faq">`), сітка всередині іншого компонента (`.faq-grid`), сам список (`.faq-frame`).

| Файл | Назва | Варіанти | Що відрізняє | Де на сайті |
|---|---|---|---|---|
| `faq-fluid.html` | fluid (базовий) | tint · lg · fluid | пігулка, заголовок, вступ, посилання під ним; відповіді одним абзацом | prices |
| `faq-fluid-title-only.html` | fluid, лише заголовок | tint · lg · fluid | без вступу й посилання — найчастіша конфігурація | students, pdf, organization, university |
| `faq-fluid-small-intro.html` | fluid, білий фон, малий вступ | white · lg · fluid | вступ `data-size="small"` (15px і на десктопі) | ai-detector, api |
| `faq-fluid-rich.html` | fluid, розгорнуті відповіді | white · md · fluid | пігулка `data-bg="tint"`; відповідь — `div.faq-a-body` з абзацами й посиланням на джерело | turnitin-checker-alternative |
| `faq-fluid-narrow.html` | fluid-narrow, без пігулки | tint · md · fluid-narrow | сітка 0.8fr/1.2fr, лише заголовок | ua-plagiarism-check |
| `faq-fixed.html` | fixed (головна) | white · md · fixed | ліва колонка 380px; посилання з іконкою без обгортки | index |
| `faq-grid-embedded.html` | сітка всередині іншого компонента | grid · fixed | без `<section>`; відступ дає хост (лише margin-утиліти) | user-manuals |
| `faq-frame-doc.html` | лише список у колонці документації | frame · doc | без заголовка; кожне питання в `<h3 class="faq-heading">` | integration-guide (Moodle) |

### fluid, лише заголовок — `faq-fluid-title-only.html`

```html
<section id="example-faq-title" data-component="faq" class="faq" data-bg="tint" data-space="lg" data-layout="fluid">
  <div class="faq-inner">
    <div class="faq-grid">
      <div class="faq-aside rv">
        <div class="section-eyebrow">
          <span class="section-eyebrow-dot"></span>
          <span class="section-eyebrow-label">Questions</span>
        </div>
        <h2 class="section-title">Plagiarism Checker for Students FAQ</h2>
      </div>
      <div class="faq-frame rv">
        <div class="faq-list" data-faq>
          <div class="faq-item open">
            <button type="button" aria-controls="example-faq-title-a1" aria-expanded="true" class="faq-q">
              <span class="faq-q-text">Can I check my essay or paper before submitting it?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-title-a1"><div><p class="faq-a-body">Yes. You can paste text or upload a supported document and run a plagiarism check before submission. The report shows matching or similar passages and their sources so you can review the result in context.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-title-a2" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Does a similarity percentage mean I plagiarized?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-title-a2"><div><p class="faq-a-body">No. Similarity means that some text matches or closely resembles text found in the sources included in your check. A match may come from a quotation, reference, common phrasing, a close paraphrase, or material that needs closer review.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-title-a3" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">What is a safe similarity percentage for a student paper?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-title-a3"><div><p class="faq-a-body">There is no universal similarity percentage that proves a paper is plagiarism-free or automatically means that plagiarism occurred. Review the individual matches, their sources, and citation context, and follow any requirements set by your course or institution.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### fluid, білий фон, малий вступ — `faq-fluid-small-intro.html`

```html
<section id="example-faq-small" data-component="faq" class="faq" data-bg="white" data-space="lg" data-layout="fluid">
  <div class="faq-inner">
    <div class="faq-grid">
      <div class="faq-aside rv">
        <div class="section-eyebrow">
          <span class="section-eyebrow-dot"></span>
          <span class="section-eyebrow-label">Questions</span>
        </div>
        <h2 class="section-title">AI Detector FAQ</h2>
        <p class="section-intro" data-size="small">Still have a question about your account, reports, or AI checking?</p>
        <div class="section-more"><a href="https://plagiarismsearch.com/faq-and-support" rel="noopener" class="section-link">Visit the Help Center</a></div>
      </div>
      <div class="faq-frame rv">
        <div class="faq-list" data-faq>
          <div class="faq-item open">
            <button type="button" aria-controls="example-faq-small-a1" aria-expanded="true" class="faq-q">
              <span class="faq-q-text">What does AI Probability mean?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-small-a1"><div><p class="faq-a-body">AI Probability is the percentage likelihood that the analyzed text, considered as a whole, was AI-generated. It is a document-level detection indicator. It does not represent the percentage of the document that was generated by AI, and it is not proof of authorship.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-small-a2" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">What does Total AI Rate mean?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-small-a2"><div><p class="faq-a-body">Total AI Rate is the share of the document made up of passages flagged as AI-generated. It complements AI Probability by showing how much of the text is contained in flagged passages rather than the overall likelihood for the document.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-small-a3" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Why can AI Probability and Total AI Rate be different?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-small-a3"><div><p class="faq-a-body">They measure different things. AI Probability describes the likelihood that the document as a whole was AI-generated. Total AI Rate describes the amount of text contained in passages flagged as AI-generated. The two percentages therefore should not be expected to match.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### fluid, розгорнуті відповіді — `faq-fluid-rich.html`

```html
<section id="example-faq-rich" data-component="faq" class="faq" data-bg="white" data-space="md" data-layout="fluid">
  <div class="faq-inner">
    <div class="faq-grid">
      <div class="faq-aside rv">
        <div class="section-eyebrow" data-bg="tint">
          <span class="section-eyebrow-dot"></span>
          <span class="section-eyebrow-label">Questions</span>
        </div>
        <h2 class="section-title">Turnitin Alternative FAQ</h2>
      </div>
      <div class="faq-frame rv">
        <div class="faq-list" data-faq>
          <div class="faq-item open">
            <button type="button" aria-controls="example-faq-rich-a1" aria-expanded="true" class="faq-q">
              <span class="faq-q-text">Is PlagiarismSearch affiliated with Turnitin® or a third-party Turnitin® checker?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-rich-a1"><div><div class="faq-a-body">
              <p>No. PlagiarismSearch is an independent service. It is not affiliated with, endorsed by, sponsored by, or otherwise connected with Turnitin, LLC; it does not access Turnitin software or proprietary databases and does not generate official Turnitin Similarity Reports.</p>
            </div></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-rich-a2" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Will PlagiarismSearch give me the same similarity score as Turnitin®?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-rich-a2"><div><div class="faq-a-body">
              <p>Not necessarily. Different services can use different source collections, repositories, matching methods and settings, so similarity results may differ. A PlagiarismSearch result should not be treated as a prediction of an official Turnitin score.</p>
            </div></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-rich-a3" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Can individuals buy Turnitin® Similarity directly?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-rich-a3"><div><div class="faq-a-body">
              <p>Turnitin currently states that Turnitin Feedback Studio and Similarity subscriptions are not sold directly to individuals. Access may be provided through an institution; Turnitin points individuals with personal similarity-checking needs toward iThenticate.</p>
              <p class="faq-a-more"><a href="https://guides.turnitin.com/hc/en-us/articles/37985974637453-How-to-purchase-a-Turnitin-subscription" target="_blank" rel="noopener noreferrer" class="faq-a-link"><span>Official Turnitin guide: How to purchase a Turnitin subscription</span><span class="faq-a-link-icon"><svg class="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></span></a></p>
            </div></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### fluid-narrow, без пігулки — `faq-fluid-narrow.html`

```html
<section id="example-faq-narrow" data-component="faq" class="faq" data-bg="tint" data-space="md" data-layout="fluid-narrow">
  <div class="faq-inner">
    <div class="faq-grid">
      <div class="faq-aside rv">
        <h2 class="section-title">Поширені запитання</h2>
      </div>
      <div class="faq-frame rv">
        <div class="faq-list" data-faq>
          <div class="faq-item open">
            <button type="button" aria-controls="example-faq-narrow-a1" aria-expanded="true" class="faq-q">
              <span class="faq-q-text">Скільки тексту можна перевірити на плагіат безкоштовно?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-narrow-a1"><div><p class="faq-a-body">Без реєстрації можна перевірити до 150 слів. Для зареєстрованих користувачів доступно 300 слів для перевірки на плагіат щодня. Для більших обсягів можна скористатися платним тарифом.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-narrow-a2" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Що показує звіт PlagiarismSearch?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-narrow-a2"><div><p class="faq-a-body">Звіт показує знайдені текстові збіги, відповідні джерела та пов’язані з ними фрагменти документа. Ви можете перейти від позначеного тексту до джерела й самостійно перевірити контекст.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-narrow-a3" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Чи означає знайдений збіг, що в тексті є плагіат?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-narrow-a3"><div><p class="faq-a-body">Ні. Текстовий збіг сам по собі не є автоматичним висновком про плагіат. Важливо перевірити джерело, контекст, цитування й правила, за якими оцінюється конкретний текст.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### fixed (головна) — `faq-fixed.html`

```html
<section id="example-faq-fixed" data-component="faq" class="faq" data-bg="white" data-space="md" data-layout="fixed">
  <div class="faq-inner">
    <div class="faq-grid">
      <div class="faq-aside rv">
        <div class="section-eyebrow">
          <span class="section-eyebrow-dot"></span>
          <span class="section-eyebrow-label">Questions</span>
        </div>
        <h2 class="section-title">Plagiarism Checker FAQ</h2>
        <p class="section-intro">Answers to common questions about plagiarism checking, sources, privacy, AI analysis, supported languages, file types, and free use.</p>
        <a href="help-center.html" class="section-more section-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          More questions? Visit the Help Center.
        </a>
      </div>
      <div class="faq-frame rv">
        <div class="faq-list" data-faq>
          <div class="faq-item open">
            <button type="button" aria-controls="example-faq-fixed-a1" aria-expanded="true" class="faq-q">
              <span class="faq-q-text">What does PlagiarismSearch check for?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-fixed-a1"><div><p class="faq-a-body">PlagiarismSearch compares the text you submit with the source collections enabled for your check and highlights matching or similar passages in the report. Depending on your settings, the check can include web sources, academic databases, personal storage, or organization storage. The report gives you evidence to review rather than an automatic plagiarism verdict.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-fixed-a2" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">Does similarity automatically mean plagiarism?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-fixed-a2"><div><p class="faq-a-body">No. Similarity means that some text matches or closely resembles text found in the sources checked. A match can come from a quotation, reference, common phrasing, or material that needs closer review, so source context and citation information matter.</p></div></div>
          </div>
          <div class="faq-item">
            <button type="button" aria-controls="example-faq-fixed-a3" aria-expanded="false" class="faq-q">
              <span class="faq-q-text">What sources can the plagiarism checker search?</span>
              <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
            </button>
            <div class="faq-a" id="example-faq-fixed-a3"><div><p class="faq-a-body">Depending on your settings and access, the checker can search web sources, academic databases, personal storage, and organization storage. When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts. Not every source collection is necessarily included in every check.</p></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### сітка всередині іншого компонента — `faq-grid-embedded.html`

```html
<div class="faq-grid mt-12 sm:mt-16 lg:mt-20" data-layout="fixed">
  <div class="faq-aside">
    <div class="section-eyebrow">
      <span class="section-eyebrow-dot"></span>
      <span class="section-eyebrow-label">Questions</span>
    </div>
    <h2 class="section-title">Frequently Asked Questions</h2>
    <p class="section-intro">Find out the answers to the most frequently asked questions about our service</p>
    <a href="help-center.html" class="section-more section-link">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
      More questions? Visit the Help Center.
    </a>
  </div>
  <div class="faq-frame">
    <div class="faq-list" data-faq>
      <div class="faq-item open">
        <button type="button" aria-controls="example-faq-grid-a1" aria-expanded="true" class="faq-q">
          <span class="faq-q-text">Is PlagiarismSearch really able to identify plagiarism?</span>
          <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
        </button>
        <div class="faq-a" id="example-faq-grid-a1"><div><p class="faq-a-body">PlagiarismSearch.com provides an accurate plagiarism analysis of the scanned text. Your paper will be compared to billions of web pages and sources from various databases. The plagiarized parts will be marked with different colors. Please check these sentences to see if they contain a reference to the source, if you want to eliminate possible plagiarism charges from your educator.</p></div></div>
      </div>
      <div class="faq-item">
        <button type="button" aria-controls="example-faq-grid-a2" aria-expanded="false" class="faq-q">
          <span class="faq-q-text">Will my paper be saved at any databases by PlagiarismSearch?</span>
          <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
        </button>
        <div class="faq-a" id="example-faq-grid-a2"><div><p class="faq-a-body">No. Your paper will not be added to any databases by PlagiarismSearch.</p></div></div>
      </div>
      <div class="faq-item">
        <button type="button" aria-controls="example-faq-grid-a3" aria-expanded="false" class="faq-q">
          <span class="faq-q-text">How can I be sure that you are not going to use the texts I have submitted for checking?</span>
          <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
        </button>
        <div class="faq-a" id="example-faq-grid-a3"><div><p class="faq-a-body">Our rules and policies are very strict regarding your rights. You can go through them carefully, so that every aspect will be clear to you.</p></div></div>
      </div>
    </div>
  </div>
</div>
```

### лише список у колонці документації — `faq-frame-doc.html`

```html
<div class="faq-frame" data-variant="doc">
  <div class="faq-list" data-faq>
    <div class="faq-item open">
      <h3 class="faq-heading"><button type="button" aria-controls="example-faq-doc-a1" aria-expanded="true" class="faq-q">
        <span class="faq-q-text">Does PlagiarismSearch work with Moodle?</span>
        <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
      </button></h3>
      <div class="faq-a" id="example-faq-doc-a1"><div><div class="faq-a-body">
        <p>Yes. PlagiarismSearch provides a Moodle plagiarism plugin for the Moodle Assignment workflow. The current confirmed compatibility range is Moodle 2.7–5.2.</p>
      </div></div></div>
    </div>
    <div class="faq-item">
      <h3 class="faq-heading"><button type="button" aria-controls="example-faq-doc-a2" aria-expanded="false" class="faq-q">
        <span class="faq-q-text">Where do I get the API User and API Key for Moodle?</span>
        <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
      </button></h3>
      <div class="faq-a" id="example-faq-doc-a2"><div><div class="faq-a-body">
        <p>Sign in to your PlagiarismSearch account and open the API section. The API User and API Key used by the Moodle plugin are available there.</p>
        <p class="faq-a-more"><a href="account.html" class="faq-a-link">Open API Credentials</a></p>
      </div></div></div>
    </div>
    <div class="faq-item">
      <h3 class="faq-heading"><button type="button" aria-controls="example-faq-doc-a3" aria-expanded="false" class="faq-q">
        <span class="faq-q-text">Can Moodle submissions be checked automatically?</span>
        <span class="faq-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span>
      </button></h3>
      <div class="faq-a" id="example-faq-doc-a3"><div><div class="faq-a-body">
        <p>Yes. Enable <span class="ui">Auto check</span> in the PlagiarismSearch settings. For supported Moodle Assignment submissions, the plugin can automatically send new file and online-text submissions for checking.</p>
      </div></div></div>
    </div>
  </div>
</div>
```

Базовий `faq-fluid.html` наведено в розділі 1.

## 4. Контракт — `build/sections/faq.contract.js`

Одне джерело для валідатора і каталогу: правила, які читає редактор, — ті самі, які застосовує перевірка. Головне правило для CMS: міняти **текст, посилання і значення варіантів зі списку**; питання додавати й прибирати цілим `.faq-item`; класи, обгортки `<div>` та іконки лишати як у фрагменті.

### Варіанти

| Де | Атрибут | Значення | Обов'язковий | Пояснення |
|---|---|---|---|---|
| `<section class="faq">` | `data-bg` | `white`, `tint` | так | фон секції: white — білий, tint — світло-сірий (ink-50). Чергуйте з сусідніми секціями. |
| `<section class="faq">` | `data-space` | `lg`, `md` | так | вертикальні відступи на десктопі: lg — 128px (lg:py-32), md — 112px (lg:py-28). На телефоні/планшеті однакові. |
| `<section class="faq">` | `data-layout` | `fluid`, `fluid-narrow`, `fixed` | так | сітка: fluid — 0.85fr/1.15fr (продуктові сторінки); fluid-narrow — 0.8fr/1.2fr (UA); fixed — 380px/1fr (головна, User Guide) зі своїм ритмом заголовка. |
| `.faq-grid` (без секції) | `data-layout` | `fluid`, `fluid-narrow`, `fixed` | так | те саме, що data-layout секції — коли FAQ стоїть усередині іншого компонента без власної секції. |
| `.faq-frame` | `data-variant` | `doc` | ні | doc — список усередині колонки документації (Moodle guide): компактніші відступи на десктопі, колір тексту ink-700, посилання в стилі гайду. |
| `.section-eyebrow` | `data-bg` | `white`, `tint` | ні | фон «пігулки» над заголовком: white (за замовчуванням) або tint (ink-50) — щоб пігулка читалась на білій секції. |
| `p.section-intro` | `data-size` | `lead`, `small` | ні | розмір вступу: lead (за замовчуванням) — 14.5/15/15.5px; small — 14.5/15/15px (так затверджено на AI Detector і API). |

### Що редактор може міняти

| Поле | Де | Правило |
|---|---|---|
| Якір секції | `<section id="…">` | латиниця, унікальний на сторінці; можна прибрати, якщо на FAQ ніхто не посилається |
| Варіанти секції | `data-bg, data-space, data-layout на <section>` | лише значення зі списку variants |
| Надпис-пігулка | `.section-eyebrow-label` | текст; блок .section-eyebrow можна прибрати цілком |
| Фон пігулки | `data-bg на .section-eyebrow` | white \| tint |
| Заголовок H2 | `.section-title` | текст (обов’язковий); допускаються <br>, <em>, <strong> |
| Вступ | `p.section-intro` | текст; можна прибрати; data-size = lead \| small |
| Посилання під вступом | `a.section-link (у div.section-more або сам із класом section-more)` | текст, href, rel; іконку <svg> можна прибрати, але не змінювати; блок можна прибрати |
| Питання | `.faq-q-text` | лише текст, без тегів |
| Відповідь (один абзац) | `p.faq-a-body` | текст; усередині — a.faq-link, strong, em, br |
| Відповідь (кілька абзаців) | `div.faq-a-body > p` | кожен абзац — простий <p> без класів; ті самі inline-теги |
| Посилання під відповіддю | `p.faq-a-more > a.faq-a-link` | текст, href, target/rel; лише в останньому абзаці div.faq-a-body |
| Кількість питань | `.faq-item` | копіюйте або видаляйте цілий .faq-item; перший завжди class="faq-item open" + aria-expanded="true", решта — без open + "false" |
| Id відповідей | `id на .faq-a і aria-controls на кнопці` | <простір-імен>-a1, -a2 … — однакові пари, унікальні на сторінці; при копіюванні секції змініть простір імен |

### Що заблоковано

- усі класи й обгортки <div> (зокрема порожній <div> усередині .faq-a) — від них залежать вигляд, анімація і JS
- data-component="faq" на секції і data-faq на .faq-list — гачки для JS і перевірок
- кнопка: type="button", class="faq-q", aria-controls + aria-expanded
- іконки <svg> (шеврон, іконка посилання) — копіюються як є
- клас rv на .faq-aside і .faq-frame — анімація появи (можна прибрати лише обидва разом і лише за рішенням дизайну)
- жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині FAQ

### Дозволена inline-розмітка

| Де | Дозволено |
|---|---|
| текст відповіді | `a.faq-link`, `strong`, `em`, `b`, `i`, `br`, `span.ui` |
| вступ | `a.faq-link`, `strong`, `em`, `br` |
| заголовок | `br`, `em`, `strong` |
| питання | лише текст |

### Дозволені класи за частинами

| Частина | Класи |
|---|---|
| section | `faq` |
| inner | `faq-inner` |
| grid | `faq-grid` |
| aside | `faq-aside`, `rv` |
| eyebrow | `section-eyebrow` |
| eyebrowDot | `section-eyebrow-dot` |
| eyebrowLabel | `section-eyebrow-label` |
| title | `section-title` |
| intro | `section-intro` |
| moreWrap | `section-more` |
| moreLink | `section-link`, `section-more` |
| frame | `faq-frame`, `rv` |
| list | `faq-list` |
| item | `faq-item`, `open` |
| heading | `faq-heading` |
| q | `faq-q` |
| qText | `faq-q-text` |
| chev | `faq-chev` |
| a | `faq-a` |
| body | `faq-a-body` |
| more | `faq-a-more` |
| aLink | `faq-a-link` |
| aLinkIcon | `faq-a-link-icon` |
| inlineLink | `faq-link` |
| ui | `ui` |

Повний файл — у додатку A.

## 5. Що перевіряє `build/check-library.js`

**Як запускати**

- `node build/check-library.js` — усі сторінки `site/` з FAQ, усі фрагменти каталогу і самоперевірка;
- `node build/check-library.js <файл.html>` — один файл;
- `node build/check-library.js --stdin` — HTML зі стандартного входу (вставка з CMS);
- `require('./build/check-library').validate(html)` — з коду.

**Що перевіряє в кожному FAQ**

- **Каркас.** Одна з трьох кореневих форм (секція, сітка, список) і точний порядок вкладених елементів, включно з порожнім `<div>` усередині `.faq-a`.
- **Класи.** Лише класи з контракту; будь-яку утиліту Tailwind називає поіменно.
- **Варіанти.** Лише атрибути `data-*` з контракту й лише значення зі списку; обов'язкові мають бути.
- **Вміст.** Заголовок обов'язковий; у питанні лише текст; у відповіді, вступі й заголовку лише дозволені inline-теги; порожня пігулка чи відповідь — помилка.
- **Доступність.** `type="button"`; `aria-controls` вказує на `.faq-a` свого питання; `aria-expanded` відповідає класу `.open`; id унікальні на сторінці (схема `<простір>-aN` — попередження).
- **Поведінка.** `data-faq` на списку; перше питання відкрите.
- **Безпека.** Жодних `style=""`, `on*`, `<script>`, `<style>`, `javascript:`; `target="_blank"` вимагає `noopener`.
- **Цілісність HTML.** Незакриті й зайві теги.
- **Не перевіряє:** вміст `<svg>` і вміст слота `[data-slot="aside"]` (туди ставиться інший блок бібліотеки).

**Результат запуску на закоміченому стані (`5330452`):** 17 сторінок з FAQ, 8 фрагментів каталогу, 11 навмисно зламаних вставок відхилено, 6 дозволених правок прийнято; `all inputs keep the library contract`.

Самоперевірка — що валідатор відхиляє і що приймає:

```text
rejects a utility added to an answer
rejects an unknown variant value
rejects a variant removed
rejects aria-controls not matching the answer id
rejects aria-expanded out of step with .open
rejects a duplicated question
rejects the inner <div> of an answer removed
rejects data-faq removed
rejects a style attribute
rejects markup in a question
rejects a <div> left open
accepts new question and answer text
accepts a rich answer: two paragraphs with <strong>
accepts the last question removed
accepts the intro and the more link removed
accepts other variant values
accepts an aside slot for another block
```

## 6. Stage 0 — рекомендований список компонентів бібліотеки (14)

| # | Компонент | Де використовується зараз | Примітка |
|---|---|---|---|
| 1 | **Section Header** (примітив) | у кожній секції із заголовком | у pilot ✅; власний контракт отримає, коли його візьме другий компонент |
| 2 | **FAQ** | 12 сторінок pilot + Affiliate, Scholarship | у pilot ✅ |
| 3 | CTA band | 10 сторінок | 4 розкладки дій; контейнер 880 і 920; вступ 52–62ch |
| 4 | Banner | 6 сторінок + design-system | з бічним блоком і без; 4 пресети світіння; блок `after` mt-3 і mt-3.5 |
| 5 | Hero | hero-checker на 5 сторінках, hero-hub на 2 | — |
| 6 | Report showcase | report-dark на 6, report-light на Turnitin | — |
| 7 | Steps | lifecycle-rail на 6 сторінках (одна назва, три дизайни); workflow-steps, steps-row, read-steps, workflow-list | розкладки cards / rail / panel / rows |
| 8 | Feature cards | — | — |
| 9 | Sources | sources-controls на 3, source-list, source-cells | — |
| 10 | Start free | PDF, Students, UA | framed / open |
| 11 | Pricing preview | Home, Turnitin | ціни тільки з даних, не редагуються в HTML |
| 12 | Inquiry form | API, Organization, University | — |
| 13 | Stat / proof rail | trust-rail, proof-rail | — |
| 14 | Reviews | карусель на Home, сітка на UA | — |

**Не входять у бібліотеку:** report-ai-dark, results-dark, source-map, storage-map, relationship-map, ілюстрації hero-hub. Для них — лише закритий слот «diagram».

**Запропонований порядок після review:** cta-band → banner → steps → inquiry-form (за частотою використання). Жоден із них не розпочато.

## 7. Pilot — підсумок parity

Порівняння з базовим станом `2c00ed8` (тег `level-a-baseline`), повний прогін на 375 / 768 / 1440.

| Сторінка | Перевірок | Результат |
|---|---|---|
| index.html | 107 | 0 px |
| ai-detector.html | 95 | 0 px |
| api.html | 89 | 0 px |
| plagiarism-checker-for-organization.html | 93 | 0 px |
| pdf-plagiarism-checker.html | 93 | 0 px |
| prices.html | 77 | 0 px |
| plagiarism-checker-for-students.html | 97 | 0 px |
| turnitin-checker-alternative.html | 107 | 0 px |
| ua-plagiarism-check.html | 101 | 0 px |
| university-plagiarism-checker.html | 83 | 0 px |
| integration-guide.html | 63 | 0 px |
| user-manuals.html | 47 | 0 px |
| **Разом** | **1052** | **0 FAIL, 0 прийнятих відмінностей** |

- Пікселі: 0 px на всіх трьох ширинах.
- Геометрія: 0 відмінностей (кожен елемент × 65 властивостей + рамка).
- Поведінка і стани (без JS усі відповіді відкриті) збігаються.
- Тест повторного використання: кожна FAQ-секція окремо в порожній сторінці — 0 px.
- Affiliate і Scholarship (v1 і v2) переведені на шаблон під час злиття. Це нові сторінки без затвердженого базового стану, тому в parity не входять; перевірку тексту і валідатор бібліотеки вони проходять.

Невидимі зміни розмітки, які вніс pilot: `aria-hidden` на шевроні; id відповідей у гайді Moodle `faq-a-0` → `moodle-faq-a1`; прибрано невживаний `id="faqList"`.

## 8. П'ять уніфікацій — НЕ закомічені

Внесені в робочу копію `main`, не закомічені й не запушені. Чекають окремого підтвердження після цього review. Порівнюються з `5330452`.

### 8.1 Єдиний відступ секцій

- **Було:** стандартна секція `py-16 sm:py-24 lg:py-28` на частині сторінок і `lg:py-32` на решті; FAQ мав варіант `data-space="md|lg"`, щоб іти за сторінкою.
- **Стало:** `py-16 sm:py-24 lg:py-32` скрізь; варіант `data-space` прибрано з шаблону, контракту і розмітки.
- **Де видно:** лише від 1024px. Кожна змінена секція стає на 32px вищою (по 16px зверху і знизу). На телефоні й планшеті нічого не змінюється.
- **Ширше, ніж FAQ:** на Home, Turnitin і UA `lg:py-28` мали всі стандартні секції, не лише FAQ. Змінити тільки FAQ означало б вибити його з ритму власної сторінки, тому переведено секції цілих сторінок.

| Сторінка | Що змінено | Висота сторінки на 1440 | Порівняння |
|---|---|---|---|
| Home | 8 секцій + FAQ | +288 px | пройшло |
| Turnitin Alternative | 7 секцій + FAQ | +256 px | пройшло |
| UA | 6 секцій + FAQ | +224 px | пройшло |
| Reviews v2 | 4 секції | — | ще не завершено |
| Reviews | 2 секції | +64 px | ще не завершено |
| PDF | 2 секції | +64 px | ще не завершено |
| Business & Teams | 1 секція (report) | +32 px | пройшло |
| Students | 1 секція | +32 px | пройшло |
| University | 1 секція (report) | +32 px | є FAIL — див. нижче |
| Scholarship | 1 секція | +32 px | пройшло |
| Scholarship v2 | 1 секція | +32 px | пройшло |

Не змінено: завершальний блок перед футером на десяти рукописних сторінках (Blog, Blog article, Chat bot, Contact, Help Center, Mission, Plagiarism check і v1 трьох інструментів) — там теж `lg:py-28`, але це компонент CTA band, якого бібліотека ще не охоплює.

### 8.2 Сітка FAQ на українській сторінці

- **Було:** `data-layout="fluid-narrow"` — колонки 0.8fr / 1.2fr (на 1440: 457.6px і 686.4px).
- **Стало:** `data-layout="fluid"` — 0.85fr / 1.15fr, як на продуктових сторінках (на 1440: 486.2px і 657.8px). Значення `fluid-narrow` прибрано.
- **Де видно:** лише UA, від 1024px: колонка заголовка ширша на 28.6px, список вужчий на стільки ж.

### 8.3 Розмір вступу

- **Було:** `data-size="small"` на вступі FAQ — 15px на десктопі.
- **Стало:** один розмір — 14.5 / 15 / 15.5px; атрибут `data-size` прибрано.
- **Де видно:** AI Detector і API, від 1024px: вступ під заголовком FAQ на 0.5px більший, ліва колонка вища на 0.8px.

### 8.4 Пігулка на білій секції

- **Було:** біла пігулка (`#FFFFFF`) на білій секції — трималась лише на тонкій рамці.
- **Стало:** сіра пігулка (`ink-50`, `#F8F9FB`).
- **Де видно:** FAQ на Home, AI Detector і API, на всіх ширинах. На Turnitin пігулка вже була сірою.

### 8.5 Фон пігулки виводиться з фону секції

- **Було:** фон пігулки задавався вручну атрибутом `data-bg` на `.section-eyebrow`.
- **Стало:** CSS виводить його з `data-bg` секції: біла секція → сіра пігулка, сіра секція → біла. Атрибут на пігулці прибрано з шаблону і контракту; валідатор тепер відхиляє його.
- **Де видно:** сам собою вигляду не змінює — це механізм, який дає результат 8.4 і не дозволяє білій пігулці знову з'явитись на білій секції.

### Що ще змінюють уніфікації

- **Розмітка FAQ:** з усіх секцій прибрано `data-space`; на Turnitin — `data-bg` з пігулки; на AI Detector і API — `data-size` зі вступу; на UA — `fluid-narrow` → `fluid`.
- **Шаблон:** `faq.js` відмовляється збирати сторінку, якщо йому передали прибрану опцію (`space`, `eyebrowBg`, `introSize`, `fluid-narrow`).
- **Валідатор:** чотири нові навмисно зламані вставки (стара `data-space`, `fluid-narrow`, пігулка з власним фоном, вступ із розміром) — усі відхиляє.
- **Каталог:** 8 фрагментів, два перейменовано: `faq-fluid-small-intro` → `faq-fluid-white`, `faq-fluid-narrow` → `faq-fluid-no-eyebrow`.
- **DESIGN.md:** правило відступів секцій оновлено.
- **Parity:** прийняті відмінності записані в `build/parity/pages.js` проти `5330452`, для кожної сторінки свій перелік властивостей; усе поза переліком — помилка.

### Стан порівняння уніфікацій з `5330452`

Завершено 10 із 17 сторінок; без неочікуваних відмінностей — 9.

- **university-plagiarism-checker.html:** FAIL  1440px firstView: "110"  approved: "111"

## Додаток A. `build/sections/faq.contract.js` (закомічена версія)

```js
/* FAQ — the content contract: what an editor may change in the FAQ's HTML, and what not.

   Read by build/check-library.js (the validator) and build/section-library.js (the
   catalogue page, site/section-library.html). One source, so the rules an editor reads
   are the rules the validator applies.

   The rule of thumb for the CMS: change the TEXT, the LINKS and the VARIANT VALUES listed
   here; add or remove whole questions by copying a whole .faq-item; leave every class,
   every wrapper <div> and every icon exactly as the snippet has them. */

/* the variant switches, on the element that carries them */
const variants = {
  section: {
    'data-bg': { values: ['white', 'tint'], required: true,
      uk: 'фон секції: white — білий, tint — світло-сірий (ink-50). Чергуйте з сусідніми секціями.' },
    'data-space': { values: ['lg', 'md'], required: true,
      uk: 'вертикальні відступи на десктопі: lg — 128px (lg:py-32), md — 112px (lg:py-28). На телефоні/планшеті однакові.' },
    'data-layout': { values: ['fluid', 'fluid-narrow', 'fixed'], required: true,
      uk: 'сітка: fluid — 0.85fr/1.15fr (продуктові сторінки); fluid-narrow — 0.8fr/1.2fr (UA); fixed — 380px/1fr (головна, User Guide) зі своїм ритмом заголовка.' },
  },
  grid: {
    'data-layout': { values: ['fluid', 'fluid-narrow', 'fixed'], required: true,
      uk: 'те саме, що data-layout секції — коли FAQ стоїть усередині іншого компонента без власної секції.' },
  },
  frame: {
    'data-variant': { values: ['doc'], required: false,
      uk: 'doc — список усередині колонки документації (Moodle guide): компактніші відступи на десктопі, колір тексту ink-700, посилання в стилі гайду.' },
  },
  eyebrow: {
    'data-bg': { values: ['white', 'tint'], required: false,
      uk: 'фон «пігулки» над заголовком: white (за замовчуванням) або tint (ink-50) — щоб пігулка читалась на білій секції.' },
  },
  intro: {
    'data-size': { values: ['lead', 'small'], required: false,
      uk: 'розмір вступу: lead (за замовчуванням) — 14.5/15/15.5px; small — 14.5/15/15px (так затверджено на AI Detector і API).' },
  },
};

/* the classes each part may carry — nothing else, anywhere inside a FAQ */
const classes = {
  section: ['faq'],
  inner: ['faq-inner'],
  grid: ['faq-grid'],
  aside: ['faq-aside', 'rv'],
  eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'],
  title: ['section-title'],
  intro: ['section-intro'],
  moreWrap: ['section-more'],
  moreLink: ['section-link', 'section-more'],
  frame: ['faq-frame', 'rv'],
  list: ['faq-list'],
  item: ['faq-item', 'open'],
  heading: ['faq-heading'],
  q: ['faq-q'], qText: ['faq-q-text'], chev: ['faq-chev'],
  a: ['faq-a'],
  body: ['faq-a-body'],
  more: ['faq-a-more'], aLink: ['faq-a-link'], aLinkIcon: ['faq-a-link-icon'],
  inlineLink: ['faq-link'],
  ui: ['ui'],
};

/* inline markup allowed inside answer text and the intro */
const inline = {
  answer: ['a.faq-link', 'strong', 'em', 'b', 'i', 'br', 'span.ui'],
  intro: ['a.faq-link', 'strong', 'em', 'br'],
  title: ['br', 'em', 'strong'],
  question: [],
};

/* what the editor may change — the catalogue prints this table */
const editable = [
  { field: 'Якір секції', where: '<section id="…">', rule: 'латиниця, унікальний на сторінці; можна прибрати, якщо на FAQ ніхто не посилається' },
  { field: 'Варіанти секції', where: 'data-bg, data-space, data-layout на <section>', rule: 'лише значення зі списку variants' },
  { field: 'Надпис-пігулка', where: '.section-eyebrow-label', rule: 'текст; блок .section-eyebrow можна прибрати цілком' },
  { field: 'Фон пігулки', where: 'data-bg на .section-eyebrow', rule: 'white | tint' },
  { field: 'Заголовок H2', where: '.section-title', rule: 'текст (обов’язковий); допускаються <br>, <em>, <strong>' },
  { field: 'Вступ', where: 'p.section-intro', rule: 'текст; можна прибрати; data-size = lead | small' },
  { field: 'Посилання під вступом', where: 'a.section-link (у div.section-more або сам із класом section-more)', rule: 'текст, href, rel; іконку <svg> можна прибрати, але не змінювати; блок можна прибрати' },
  { field: 'Питання', where: '.faq-q-text', rule: 'лише текст, без тегів' },
  { field: 'Відповідь (один абзац)', where: 'p.faq-a-body', rule: 'текст; усередині — a.faq-link, strong, em, br' },
  { field: 'Відповідь (кілька абзаців)', where: 'div.faq-a-body > p', rule: 'кожен абзац — простий <p> без класів; ті самі inline-теги' },
  { field: 'Посилання під відповіддю', where: 'p.faq-a-more > a.faq-a-link', rule: 'текст, href, target/rel; лише в останньому абзаці div.faq-a-body' },
  { field: 'Кількість питань', where: '.faq-item', rule: 'копіюйте або видаляйте цілий .faq-item; перший завжди class="faq-item open" + aria-expanded="true", решта — без open + "false"' },
  { field: 'Id відповідей', where: 'id на .faq-a і aria-controls на кнопці', rule: '<простір-імен>-a1, -a2 … — однакові пари, унікальні на сторінці; при копіюванні секції змініть простір імен' },
];

/* what stays locked */
const locked = [
  'усі класи й обгортки <div> (зокрема порожній <div> усередині .faq-a) — від них залежать вигляд, анімація і JS',
  'data-component="faq" на секції і data-faq на .faq-list — гачки для JS і перевірок',
  'кнопка: type="button", class="faq-q", aria-controls + aria-expanded',
  'іконки <svg> (шеврон, іконка посилання) — копіюються як є',
  'клас rv на .faq-aside і .faq-frame — анімація появи (можна прибрати лише обидва разом і лише за рішенням дизайну)',
  'жодних style="", <script>, <style>, класів Tailwind (px-4, text-ink-600 …) усередині FAQ',
];

module.exports = { name: 'faq', variants, classes, inline, editable, locked };
```

