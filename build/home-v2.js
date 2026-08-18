/* Generate site/index-v2.html — the DEC-0030 homepage.

   The approved baseline is the source of copy. Every string the brief fixes is held in
   COPY below, verbatim, so it can be diffed against the brief line by line instead of
   being hunted through markup. Nothing here paraphrases, shortens or "improves" it.

   Placeholders are deliberate. The brief lists exactly which fields are dynamic —
   review quotes and ratings, prices and quotas, the final Canvas URL — and anything
   NOT on that list is an omission, not a placeholder. That is why the ESL and accuracy
   figures the old homepage carried are simply absent rather than dashed out.

   Run:  node build/home-v2.js  →  node build/shell.js  →  node build/check.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'index-v2.html';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — DEC-0030, 2026-08-14. Verbatim.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Plagiarism Checker – Check Text Online | PlagiarismSearch',
  meta: 'Check text for plagiarism online. Find matching passages and sources, review similarity, citations, and source context in a clear report.',

  s1: {
    h1: 'Plagiarism Checker',
    support: 'Find matching passages and sources, review similarity in context, and see citations and references in a clear report.',
    placeholder: 'Paste or type your text here',
    /* The brief fixes the labels; the icons are ours. Dropbox and OneDrive carry their
       own marks because recognising a service you already use is the whole point of
       listing it — the other two are actions, not brands, so they stay in UI ink. */
    inputs: [
      { label: 'Attach file', icon: 'lucide', path: '<path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/>' },
      { label: 'Dropbox',     icon: 'brand',  file: 'dropbox.svg' },
      { label: 'OneDrive',    icon: 'brand',  file: 'onedrive.svg' },
      { label: 'By URL',      icon: 'lucide', path: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>' },
    ],
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
  },

  s2: {
    fixed: ['500,000+ users', 'Plagiarism checking in 80+ languages', 'BBB Accredited'],
    dynamic: 'INSERT CURRENT VERIFIED REVIEW-PLATFORM RATING/COUNT',
  },

  s3: { label: 'Integrations & API', items: ['Moodle', 'API', 'Canvas', 'Google Docs'] },

  s4: {
    h2: 'See the evidence behind every match',
    intro: 'A similarity score is only the starting point. Open a highlighted passage to see the matching source and its context, then review citations, references, and other report signals before deciding how the match should be interpreted.',
    callout: 'PlagiarismSearch surfaces matching text and sources for review. It does not make the final plagiarism judgment for you.',
    labels: ['Matched passage', 'Matching source', 'Source context', 'Similarity', 'Citations', 'References', 'AI probability'],
  },

  s5: {
    h2: 'Control what your plagiarism check includes',
    intro: 'Choose the source collections and exclusions that fit your document before you interpret the result. Search the web, academic databases, your storage, or organization storage, and exclude references or in-text citations when appropriate.',
    coverage: 'When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts.',
    sources: ['Web', 'Academic databases', 'My storage', 'Organization storage'],
    settings: ['Exclude references', 'Exclude in-text citations', 'Character normalization', 'Add to storage'],
  },

  s6: {
    h2: 'Plagiarism and AI checks answer different questions',
    plagiarism: 'Finds text that matches available sources and shows where those matches come from, so you can review similarity and citation context.',
    ai: 'Provides a separate AI-writing indicator for the text you choose to analyze. It does not replace source matching and does not prove authorship.',
    bridge: 'You can run plagiarism checking on its own or add AI writing analysis in the same check. AI-generated text is not automatically plagiarism, and low similarity does not prove that a text was written by a human.',
    cta: 'Explore AI Detector',
    ctaHref: 'ai-detector.html',
  },

  s7: {
    h2: 'Know what happens to your document',
    intro: 'Your document is processed to perform the checks you select. The file you upload is not retained as a stored source document, while a generated report may remain in your account for convenient access.',
    steps: [
      ['Upload &amp; process', 'Your document is processed for the checks you select.'],
      ['Source document', 'The uploaded file is not retained as a stored source document.'],
      ['Report', 'Your generated report may remain in your account for convenient access.'],
      ['Delete', 'You can permanently delete reports from your account.'],
    ],
    storage: 'If you choose Add to storage, that is a separate action you control.',
    infra: 'AI checks are processed on PlagiarismSearch infrastructure.',
    cta: 'Read our Privacy Policy',
    ctaHref: 'policy.html',
  },

  s8: {
    h2: 'Use PlagiarismSearch in the workflow you already have',
    intro: 'Check a document in the web app, bring plagiarism checking into Moodle or Canvas, work from Google Docs, or connect your own system through the API.',
    /* visual priority is fixed by the brief: Moodle → API → Canvas → Google Docs */
    cards: [
      ['Moodle', 'Run plagiarism checks where Moodle courses and submissions already live. Keep report access, source settings, and citation/reference exclusions inside the LMS workflow.', 'View Moodle integration', 'integration-guide.html'],
      ['API', 'Connect plagiarism checking to your own product, platform, or internal workflow through the PlagiarismSearch API.', 'Explore API', 'api.html'],
      ['Canvas', 'Bring plagiarism checking into Canvas course workflows through a full LMS integration, with the same core role as the Moodle integration.', 'Canvas integration', 'canvas-integration.html'],
      ['Google Docs', 'Use the PlagiarismSearch add-on from your Google Docs workflow when you want to check document text without switching to the main web form.', 'Google Docs add-on', 'how-to-use-plagiarismsearch-google-add-on.html'],
    ],
  },

  s9: {
    h2: 'For individual checks, education, and teams',
    intro: 'Start with a single document, or use PlagiarismSearch across organization and LMS workflows when more people need shared access, storage, or administration.',
    cards: [
      ['Students &amp; individual users', 'Check essays, papers, assignments, presentations, and other documents before submission. Review matched passages, sources, citations, and references in one report.', 'For students', 'plagiarism-checker-for-students.html'],
      ['Education &amp; Institutions', 'Bring plagiarism checking into institutional workflows with Moodle and Canvas, organization management, shared storage, and member permissions.', 'Education &amp; Institutions', 'university-plagiarism-checker.html'],
      ['Business &amp; Teams', 'Invite team members, manage permissions, share organization storage, and connect plagiarism checking through the API when needed.', 'Business &amp; Teams', 'plagiarism-checker-for-organization.html'],
    ],
  },

  s10: {
    h2: 'What users say about PlagiarismSearch',
    placeholder: 'INSERT 3–5 EXACT SHORT REVIEWS FROZEN FROM APPROVED SOURCES',
    pool: 'Trustpilot · SmartCustomer · G2 · owned testimonials',
    cta: 'Read more reviews',
    ctaHref: 'testimonials.html',
  },

  s11: {
    h2: 'Choose a one-time plan',
    intro: 'Need more than the free check? Choose a one-time plan, or compare all available pricing options.',
    tiers: ['Light', 'Standard', 'Premium'],
    placeholder: 'BACKEND-SUPPLIED CURRENT PRICE / WORD QUOTA / APPROVED ENTITLEMENT FIELDS',
    cta: 'See all pricing options',
    ctaHref: 'prices.html',
  },

  s12: {
    h2: 'Plagiarism Checker FAQ',
    items: [
      ['What does PlagiarismSearch check for?', 'PlagiarismSearch compares the text you submit with the source collections enabled for your check and highlights matching or similar passages in the report. Depending on your settings, the check can include web sources, academic databases, personal storage, or organization storage. The report gives you evidence to review rather than an automatic plagiarism verdict.'],
      ['Does similarity automatically mean plagiarism?', 'No. Similarity means that some text matches or closely resembles text found in the sources checked. A match can come from a quotation, reference, common phrasing, or material that needs closer review, so source context and citation information matter.'],
      ['What sources can the plagiarism checker search?', 'Depending on your settings and access, the checker can search web sources, academic databases, personal storage, and organization storage. When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts. Not every source collection is necessarily included in every check.'],
      ['Can I exclude references and in-text citations?', 'Yes. The checker includes settings to exclude references and in-text citations when appropriate. Because exclusions change what is checked and reported, review your settings before interpreting the result.'],
      ['Is my uploaded document stored?', 'Uploaded source documents are not retained as documents after processing. Generated reports may remain in your account for convenience, and you can permanently delete them. If you choose Add to storage, that is a separate action you control.'],
      ['Can I check for AI-written text at the same time?', 'Yes. Keep Check for plagiarism on and optionally add Check for AI writing. The two analyses answer different questions: plagiarism checking looks for source matches and similarity, while AI detection provides a separate AI-writing indicator. An AI result does not by itself mean plagiarism or prove authorship.'],
      ['Which languages does the plagiarism checker support?', 'PlagiarismSearch supports plagiarism checking in 80+ languages.'],
      ['Which file types can I upload?', 'The checker accepts common file types such as DOC/DOCX, PDF, TXT, PPT/PPTX, and XLS/XLSX, along with other supported document formats. The uploader shows the formats accepted by the current checker.'],
      ['Can I try the plagiarism checker without registration?', 'Yes. You can check up to 150 words for plagiarism without registering.'],
    ],
  },

  s13: {
    h2: 'Check your text for plagiarism',
    support: 'Paste your text or upload a document to review matching passages and sources in a clear report.',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
  },
};

/* The report demo. One precomputed report, using only the labels the brief approves.
   No global "Plagiarism X%" verdict, no threshold or colour logic, and the AI signal
   is kept visually separate from source matching. */
const REPORT = {
  paragraphs: [
    { text: 'The economic implications of climate change extend beyond environmental damage and touch every part of modern agricultural systems.', match: null },
    { text: 'Recent studies have shown that rising global temperatures correlate with decreased yields in rain-fed regions.', match: 0 },
    { text: 'However, smallholder farmers in West Africa have adapted through diversified cropping patterns and drought-resistant millet varieties.', match: 1 },
    { text: 'Field data from recent seasons supports this approach across tropical zones worldwide.', match: null },
  ],
  matches: [
    { source: 'Climate volatility and agriculture vulnerability', where: 'Nature Climate Change · 2023', context: '…measurements across rain-fed systems indicate that rising global temperatures correlate with decreased yields, particularly where irrigation is unavailable…', similarity: '92%', cited: false },
    { source: 'Adaptation strategies in West African smallholding', where: 'Cambridge J. Agricultural Econ. · 2022', context: '…smallholder farmers have adapted through diversified cropping patterns, with drought-resistant millet varieties among the most widely adopted responses…', similarity: '78%', cited: true },
  ],
  aiProbability: 'Low',
};

/* ── page-specific styles ────────────────────────────────────────────────── */
const STYLE = `
<style>
  /* the report demo */
  .hl { cursor:pointer; border-radius:.35rem; padding:.05em .18em; margin:-.05em -.18em;
        background:rgba(217,119,87,.16); box-shadow:inset 0 -2px 0 rgba(217,119,87,.45);
        transition:background .25s ease, box-shadow .25s ease; }
  .hl:hover { background:rgba(217,119,87,.26); }
  .hl.on { background:rgba(217,119,87,.34); box-shadow:inset 0 -2px 0 rgba(217,119,87,.9); }
  .match-panel { display:none; }
  .match-panel.on { display:block; animation:mIn .3s cubic-bezier(.32,.72,0,1); }
  @keyframes mIn { from { opacity:0; transform:translateY(8px); } }

  /* scan controls */
  .ctl-row { transition:opacity .3s ease; }
  .ctl-row.off { opacity:.45; }
  .sw { width:38px; height:22px; border-radius:999px; background:rgba(16,24,40,.14);
        position:relative; transition:background .25s cubic-bezier(.32,.72,0,1); flex:none; }
  .sw::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px;
        border-radius:999px; background:#fff; box-shadow:0 1px 3px rgba(16,24,40,.3);
        transition:transform .25s cubic-bezier(.32,.72,0,1); }
  .sw.on { background:#0D9488; }
  .sw.on::after { transform:translateX(16px); }

  /* placeholder chrome — anything wearing this is waiting on production data */
  .ph { border:1px dashed rgba(16,24,40,.22); border-radius:.75rem; }
  .ph-dark { border:1px dashed rgba(255,255,255,.22); border-radius:.75rem; }

  @media (prefers-reduced-motion: reduce) {
    .match-panel.on { animation:none; }
    .hl, .sw, .sw::after, .ctl-row { transition:none; }
  }
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Small builders, so the sections below read as content rather than markup.
   ───────────────────────────────────────────────────────────────────────────── */
/* One icon slot for the whole page. The rendered size never depends on what a mark
   happens to contain — every file is drawn on a 24x24 artboard and optical weight is
   balanced by whitespace inside it, not by handing one icon a bigger box out here. */
const ICON = 'w-[14px] h-[14px] sm:w-4 sm:h-4';

const EYEBROW = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const LEAD = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] text-ink-600 leading-relaxed';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600';
const CARD = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7';
const TILE_SUB = 'text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600';

const btn = (label, href, tone = 'dark') => {
  const skin = tone === 'dark'
    ? 'bg-ink-900 text-white hover:bg-ink-800'
    : 'ring-1 ring-black/10 text-ink-900 hover:bg-ink-900/5';
  const orb = tone === 'dark' ? 'bg-white/15' : 'bg-ink-900/5';
  return `<a href="${href}" class="btn-press inline-flex items-center gap-2 h-12 sm:h-14 pl-5 sm:pl-7 pr-2.5 rounded-full ${skin} text-[14px] sm:text-[15px] font-semibold transition-colors duration-300">
          ${label}
          <span class="icon-orb w-9 h-9 rounded-full ${orb} flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>`;
};

const placeholder = (text, dark = false) => `<span class="${dark ? 'ph-dark text-white/45' : 'ph text-ink-400'} inline-block px-3 py-2 text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em]">${text}</span>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Sections
   ───────────────────────────────────────────────────────────────────────────── */
const S = COPY;

const section1 = () => `
  <!-- ================= 01 · HERO / REAL CHECKER ================= -->
  <section id="checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 bg-[#F2FCFC] overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[620px] h-[620px] bg-teal-500/12 -left-48 -top-40"></div>
      <div class="orb w-[520px] h-[520px] bg-orange-500/10 right-[-140px] top-40"></div>
    </div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="max-w-[760px] mx-auto text-center mb-8 sm:mb-10 lg:mb-12">
        <h1 class="${H2} mb-4 lg:mb-5">${S.s1.h1}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] text-ink-600 leading-relaxed">${S.s1.support}</p>
      </div>

      <!-- The real checker is the page's primary object, per the hero rule: no decorative
           report stands in for it. The form is inert — this is a prototype. -->
      <form class="rv max-w-[860px] mx-auto" onsubmit="return false">
        <div class="rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6">
            <label for="checkText" class="sr-only">${S.s1.placeholder}</label>
            <textarea id="checkText" rows="5" placeholder="${S.s1.placeholder}" class="w-full resize-none bg-transparent text-[14.5px] sm:text-[15.5px] leading-relaxed text-ink-800 placeholder:text-ink-300 focus:outline-none"></textarea>

            <div class="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-ink-100">
              ${S.s1.inputs.map(i => {
                const glyph = i.icon === 'brand'
                  /* an <img> rather than an inlined path, so replacing a mark with an
                     official vector is a file swap and touches no markup */
                  ? `<img src="assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="${ICON} shrink-0">`
                  : `<svg class="${ICON} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`;
                return `<button type="button" class="btn-press inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 pl-2.5 pr-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-semibold text-ink-700 hover:bg-ink-900/5 transition-colors duration-300">${glyph}${i.label}</button>`;
              }).join('\n              ')}
            </div>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 mt-4 border-t border-ink-100">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" id="optPlag" checked class="sr-only peer">
                <span class="sw on" data-for="optPlag"></span>
                <span class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-900">${S.s1.checkPlagiarism}</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" id="optAI" class="sr-only peer">
                <span class="sw" data-for="optAI"></span>
                <span class="text-[13.5px] sm:text-[14.5px] font-medium text-ink-600">${S.s1.checkAI}</span>
              </label>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-ink-100">
              <span class="text-[12.5px] sm:text-[13px] font-medium text-ink-400 nums"><span id="wordCount">0</span> / 150 words</span>
              ${btn(S.s1.cta, '#checker')}
            </div>
          </div>
        </div>
      </form>

      <p class="mt-5 sm:mt-6 text-center text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">${S.s1.free}</p>
      <p class="mt-1.5 text-center ${BODY} max-w-[56ch] mx-auto">${S.s1.formats}</p>
    </div>
  </section>`;

const section2 = () => `
  <!-- ================= 02 · COMPACT TRUST RAIL ================= -->
  <section class="relative py-8 sm:py-10 lg:py-12 bg-white border-y border-ink-100">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-4 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">
        ${S.s2.fixed.map(x => `<span>${x}</span>`).join('\n        ')}
        ${placeholder(S.s2.dynamic)}
      </div>
    </div>
  </section>`;

const section3 = () => `
  <!-- ================= 03 · COMPACT INTEGRATIONS RAIL ================= -->
  <section class="relative py-8 sm:py-10 lg:py-12 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3">
        <span class="${EYEBROW} text-ink-400">${S.s3.label}</span>
        <span class="hidden sm:block w-px h-4 bg-ink-200"></span>
        ${S.s3.items.map(x => `<span class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">${x}</span>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const section4 = () => `
  <!-- ================= 04 · SIGNATURE · INTERACTIVE REPORT ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Report</div>
        <h2 class="${H2} mb-4 lg:mb-5">${S.s4.h2}</h2>
        <p class="${LEAD}">${S.s4.intro}</p>
      </div>

      <div class="rv grid lg:grid-cols-[1.35fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        <div class="${CARD}">
          <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">${S.s4.labels[0]}</div>
          <div class="space-y-3.5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-ink-800">
            ${REPORT.paragraphs.map(p => p.match === null
              ? `<p>${p.text}</p>`
              : `<p><span class="hl" role="button" tabindex="0" data-match="${p.match}">${p.text}</span></p>`).join('\n            ')}
          </div>
          <p class="mt-5 pt-4 border-t border-ink-100 text-[12.5px] sm:text-[13px] font-medium text-ink-400">Select a highlighted passage to open its source.</p>
        </div>

        <div>
          ${REPORT.matches.map((m, i) => `
          <div class="match-panel${i === 0 ? ' on' : ''} ${CARD}" data-panel="${i}">
            <div class="${EYEBROW} text-ink-400 mb-3">${S.s4.labels[1]}</div>
            <p class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight text-ink-900 mb-1">${m.source}</p>
            <p class="text-[12.5px] sm:text-[13px] font-medium text-ink-400 mb-5">${m.where}</p>

            <div class="${EYEBROW} text-ink-400 mb-2">${S.s4.labels[2]}</div>
            <p class="${BODY} mb-5">${m.context}</p>

            <dl class="divide-y divide-ink-100 border-t border-ink-100">
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-[13.5px] sm:text-[14.5px] text-ink-500">${S.s4.labels[3]}</dt>
                <dd class="text-[13.5px] sm:text-[14.5px] font-bold text-ink-900 nums">${m.similarity}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-[13.5px] sm:text-[14.5px] text-ink-500">${S.s4.labels[4]}</dt>
                <dd class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-900">${m.cited ? 'Present for this passage' : 'None for this passage'}</dd>
              </div>
              <div class="flex items-center justify-between py-2.5">
                <dt class="text-[13.5px] sm:text-[14.5px] text-ink-500">${S.s4.labels[5]}</dt>
                <dd class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-900">Listed in the report</dd>
              </div>
            </dl>
          </div>`).join('\n          ')}

          <!-- kept in its own frame, away from the source-matching signals, because the
               brief requires the AI signal to read as separate rather than as a verdict -->
          <div class="mt-4 sm:mt-5 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-50 ring-1 ring-black/5 p-5 sm:p-6">
            <div class="${EYEBROW} text-ink-400 mb-2">${S.s4.labels[6]}</div>
            <p class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight text-ink-900 mb-1.5">${REPORT.aiProbability}</p>
            <p class="${BODY}">Reported as a separate signal. It is not part of source matching.</p>
          </div>
        </div>
      </div>

      <div class="rv rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-900 text-white p-5 sm:p-6 lg:p-7">
        <p class="text-[14.5px] sm:text-[15.5px] lg:text-[16px] font-semibold leading-relaxed max-w-[72ch]">${S.s4.callout}</p>
      </div>
    </div>
  </section>`;

const section5 = () => `
  <!-- ================= 05 · SIGNATURE · SOURCES & SCAN CONTROLS ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Scan controls</div>
        <h2 class="${H2} mb-4 lg:mb-5">${S.s5.h2}</h2>
        <p class="${LEAD}">${S.s5.intro}</p>
      </div>

      <div class="rv grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div class="${CARD}">
          <div class="${EYEBROW} text-ink-400 mb-5">Search sources</div>
          <div class="space-y-1">
            ${S.s5.sources.map((s, i) => `<label class="ctl-row flex items-center gap-3 py-2.5 cursor-pointer">
              <span class="sw${i < 2 ? ' on' : ''}" data-src="${i}"></span>
              <span class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-800">${s}</span>
            </label>`).join('\n            ')}
          </div>
          <p id="coverageNote" class="mt-4 pt-4 border-t border-ink-100 ${BODY}">${S.s5.coverage}</p>
        </div>

        <div class="${CARD}">
          <div class="${EYEBROW} text-ink-400 mb-5">Review settings</div>
          <div class="space-y-1">
            ${S.s5.settings.map((s, i) => `<label class="ctl-row flex items-center gap-3 py-2.5 cursor-pointer">
              <span class="sw${i < 2 ? ' on' : ''}"></span>
              <span class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-800">${s}</span>
            </label>`).join('\n            ')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

const section6 = () => `
  <!-- ================= 06 · SIGNATURE · PLAGIARISM VS AI ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Two analyses</div>
        <h2 class="${H2}">${S.s6.h2}</h2>
      </div>

      <!-- the plagiarism card leads and is the heavier of the two, because the brief
           keeps plagiarism visually and semantically primary -->
      <div class="rv grid lg:grid-cols-[1.25fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-900 text-white p-6 sm:p-7 lg:p-8">
          <div class="${EYEBROW} text-white/40 mb-4 lg:mb-5">Plagiarism check</div>
          <p class="text-[15.5px] sm:text-[16.5px] lg:text-[17.5px] leading-relaxed text-white/85 max-w-[54ch]">${S.s6.plagiarism}</p>
        </div>
        <div class="${CARD} flex flex-col">
          <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">AI writing check</div>
          <p class="${TILE_SUB} mb-6">${S.s6.ai}</p>
          <div class="mt-auto">${btn(S.s6.cta, S.s6.ctaHref, 'light')}</div>
        </div>
      </div>

      <p class="rv ${LEAD} max-w-[76ch]">${S.s6.bridge}</p>
    </div>
  </section>`;

const section7 = () => `
  <!-- ================= 07 · DOCUMENT & REPORT PRIVACY LIFECYCLE ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Document handling</div>
        <h2 class="${H2} mb-4 lg:mb-5">${S.s7.h2}</h2>
        <p class="${LEAD}">${S.s7.intro}</p>
      </div>

      <ol class="rv grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        ${S.s7.steps.map(([t, d], i) => `<li class="${CARD}">
          <span class="${EYEBROW} text-ink-400 nums">Step ${i + 1}</span>
          <p class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight text-ink-900 mt-3 mb-2">${t}</p>
          <p class="${TILE_SUB}">${d}</p>
        </li>`).join('\n        ')}
      </ol>

      <div class="rv flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <div class="min-w-0">
          <p class="${BODY} mb-1.5">${S.s7.storage}</p>
          <p class="${BODY}">${S.s7.infra}</p>
        </div>
        <div class="shrink-0 sm:ml-auto">${btn(S.s7.cta, S.s7.ctaHref, 'light')}</div>
      </div>
    </div>
  </section>`;

const section8 = () => `
  <!-- ================= 08 · FULL WORKFLOW / INTEGRATIONS ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Workflow</div>
        <h2 class="${H2} mb-4 lg:mb-5">${S.s8.h2}</h2>
        <p class="${LEAD}">${S.s8.intro}</p>
      </div>

      <div class="rv grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        ${S.s8.cards.map(([t, d, cta, href]) => `<div class="${CARD} flex flex-col">
          <p class="text-[17.5px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight text-ink-900 mb-3">${t}</p>
          <p class="${TILE_SUB} mb-6">${d}</p>
          <div class="mt-auto">${btn(cta, href, 'light')}</div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const section9 = () => `
  <!-- ================= 09 · AUDIENCE PATHWAYS ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Pathways</div>
        <h2 class="${H2} mb-4 lg:mb-5">${S.s9.h2}</h2>
        <p class="${LEAD}">${S.s9.intro}</p>
      </div>

      <div class="rv grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        ${S.s9.cards.map(([t, d, cta, href]) => `<div class="${CARD} flex flex-col">
          <p class="text-[17.5px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight text-ink-900 mb-3">${t}</p>
          <p class="${TILE_SUB} mb-6">${d}</p>
          <div class="mt-auto">${btn(cta, href, 'light')}</div>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const section10 = () => `
  <!-- ================= 10 · REVIEWS ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">Reviews</div>
        <h2 class="${H2}">${S.s10.h2}</h2>
      </div>

      <!-- Structure only. The brief forbids inventing, paraphrasing or browsing for
           reviews; three slots wait for quotes frozen from the approved sources. -->
      <div class="rv grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        ${[0, 1, 2].map(() => `<div class="${CARD} flex flex-col">
          <div class="ph flex-1 flex items-center justify-center text-center px-4 py-10 mb-5">
            <span class="text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-400 max-w-[24ch]">${S.s10.placeholder}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="${EYEBROW} text-ink-400">Source</span>
            ${placeholder('Attribution')}
          </div>
        </div>`).join('\n        ')}
      </div>

      <div class="rv flex flex-wrap items-center gap-5 sm:gap-8">
        <p class="${BODY}">Approved source pool: ${S.s10.pool}</p>
        <div class="sm:ml-auto">${btn(S.s10.cta, S.s10.ctaHref, 'light')}</div>
      </div>
    </div>
  </section>`;

const section11 = () => `
  <!-- ================= 11 · PRICING PREVIEW ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="${EYEBROW} text-ink-400 mb-4 lg:mb-5">One-time plans</div>
        <h2 class="${H2} mb-4 lg:mb-5">${S.s11.h2}</h2>
        <p class="${LEAD}">${S.s11.intro}</p>
      </div>

      <!-- One-time only. Monthly / 3-month / yearly matrices belong on the pricing page,
           and no number is hardcoded here: the backend is the source. -->
      <div class="rv grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
        ${S.s11.tiers.map(t => `<div class="${CARD}">
          <p class="text-[17.5px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight text-ink-900 mb-5">${t}</p>
          <div class="ph flex items-center justify-center text-center px-4 py-10">
            <span class="text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ink-400 max-w-[26ch]">${S.s11.placeholder}</span>
          </div>
        </div>`).join('\n        ')}
      </div>

      <div class="rv">${btn(S.s11.cta, S.s11.ctaHref)}</div>
    </div>
  </section>`;

const section12 = () => `
  <!-- ================= 12 · FAQ ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <h2 class="${H2}">${S.s12.h2}</h2>
      </div>

      <!-- every answer is in the rendered HTML, not fetched on click -->
      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse" id="faqList">
        <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
          ${S.s12.items.map(([q, a], i) => `<div class="faq-item${i === 0 ? ' open' : ''}">
            <button type="button" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
              <span class="text-[15.5px] font-semibold tracking-tight">${q}</span>
              <span class="faq-chev shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B84431" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${a}</p></div></div>
          </div>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>`;

const section13 = () => `
  <!-- ================= 13 · FINAL CTA ================= -->
  <section class="relative py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[520px] h-[520px] bg-teal-500/10 left-[-140px] bottom-[-180px]"></div>
    </div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <!-- sends you back to the real checker in section 1; no second form is rendered -->
      <div class="rv max-w-[720px] mx-auto text-center">
        <h2 class="${H2} mb-4 lg:mb-5">${S.s13.h2}</h2>
        <p class="${LEAD} mb-8 sm:mb-10">${S.s13.support}</p>
        ${btn(S.s13.cta, '#checker')}
        <p class="mt-5 sm:mt-6 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">${S.s13.free}</p>
      </div>
    </div>
  </section>`;

/* ── behaviour ───────────────────────────────────────────────────────────── */
const SCRIPT = `
<script>
(() => {
  'use strict';

  /* word counter — the free allowance is 150 words, so the count is the useful readout */
  const ta = document.getElementById('checkText'), wc = document.getElementById('wordCount');
  if (ta && wc) {
    const count = () => {
      const w = ta.value.trim() ? ta.value.trim().split(/\\s+/).length : 0;
      wc.textContent = w;
      wc.style.color = w > 150 ? '#B84431' : '';
    };
    ta.addEventListener('input', count);
  }

  /* switches: the visual state follows the real checkbox, so the control stays a control */
  document.querySelectorAll('.sw[data-for]').forEach(sw => {
    const input = document.getElementById(sw.dataset.for);
    if (!input) return;
    input.addEventListener('change', () => sw.classList.toggle('on', input.checked));
  });
  document.querySelectorAll('.ctl-row').forEach(row => {
    const sw = row.querySelector('.sw');
    row.addEventListener('click', e => {
      e.preventDefault();
      sw.classList.toggle('on');
      row.classList.toggle('off', !sw.classList.contains('on'));
      /* the coverage claim is true only while academic database search is on, so it
         dims with the toggle rather than standing as an unconditional statement */
      if (sw.dataset.src === '1') {
        const note = document.getElementById('coverageNote');
        if (note) note.style.opacity = sw.classList.contains('on') ? '' : '.4';
      }
    });
  });

  /* report: selecting a highlighted passage opens its source and context */
  const hls = [...document.querySelectorAll('.hl')];
  const panels = [...document.querySelectorAll('.match-panel')];
  const show = i => {
    hls.forEach(h => h.classList.toggle('on', h.dataset.match === String(i)));
    panels.forEach(p => p.classList.toggle('on', p.dataset.panel === String(i)));
  };
  hls.forEach(h => {
    h.addEventListener('click', () => show(h.dataset.match));
    h.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(h.dataset.match); }
    });
  });
  if (hls.length) show(0);

  /* FAQ: answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();
</script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head
  .replace(/<title>[\s\S]*?<\/title>/, '<title>' + COPY.title + '</title>')
  .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + COPY.meta + '" />');
if (!/name="description"/.test(head)) {
  head = head.replace('<title>', '<meta name="description" content="' + COPY.meta + '" />\n<title>');
}
const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const sections = [section1, section2, section3, section4, section5, section6, section7,
                  section8, section9, section10, section11, section12, section13];

/* The reveal and burger behaviours are written out here rather than sliced out of
   index.html. An earlier version scraped them by string search and produced a page with
   three broken <script> tags and an invisible checker form — cutting someone else's
   script out by indexOf is a trick that works until it silently doesn't. */
const revealBlock = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);

  // first viewport: top-down cascade on load
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  // the rest reveal as they reach mid-screen
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });
})();
</script>`;

const navScript = `<script>
(() => {
  'use strict';
  const btn = document.getElementById('navBurger');
  const panel = document.getElementById('navPanel');
  if (!btn || !panel) return;

  const setOpen = on => {
    btn.setAttribute('aria-expanded', String(on));
    panel.classList.toggle('open', on);
    btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
  };

  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  // the desktop menu takes over at lg — never leave the panel hanging open across it
  addEventListener('resize', () => { if (innerWidth >= 1024) setOpen(false); });
})();
</script>`;

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${sections.map(f => f()).join('\n')}
</main>

<footer></footer>

${revealBlock}
${navScript}
${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const h1s = (html.match(/<h1\b/g) || []).length;
const h2s = (html.match(/<h2\b/g) || []).length;
const secs = (html.match(/<section\b/g) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + secs + ' sections, ' + h1s + ' h1, ' + h2s + ' h2');
