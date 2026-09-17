/* Generate site/plagiarism-checker-for-students.html — the Students page to the
   2026-09-15 brief. It replaces a stub, so no -v2 and no version switcher.

   What the brief fixes and what it leaves to us: every string below is the approved
   content baseline, verbatim; the composition is ours, with one rule above the others —
   share the checker, the report and the controls with the homepage, but do not share
   its story. The homepage is the generic checker. This page is the student checking
   their own draft before they hand it in, and the thing it has to teach is that
   "Similarity is not a plagiarism grade."

   So: the real checker is the hero's object but the hero is two columns, the student
   framing on the left and the form on the right — not the homepage's centred stack.
   The report act ends on the student principle as a display statement rather than a
   caption. The workflow is a decision path — what a match can be, what revising can
   mean — not four equal step cards. Controls, lifecycle, AI, free entry and FAQ each
   take the shape their job needs and nothing is added to make the page longer.

   Run:  node build/students.js  →  node build/shell.js  →  node build/check-students.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'plagiarism-checker-for-students.html';
const cta = require('./cta');
const checker = require('./checker');
const { dots } = require('./dots');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — Students brief, 2026-09-15. Verbatim.

   Destinations (URLS.md): /prices → prices.html, /policy → policy.html,
   /ai-content-detector → ai-detector.html. The hero and both checker CTAs point at
   the one real form, #student-checker.
   ───────────────────────────────────────────────────────────────────────────── */
const ANCHOR = '#student-checker';

const COPY = {
  title: 'Plagiarism Checker for Students | PlagiarismSearch',
  meta: 'Check essays, papers, assignments, and theses for matching text and sources before you submit. Review similarity, citations, references, and source context in a clear report.',
  canonical: 'https://plagiarismsearch.com/plagiarism-checker-for-students',

  hero: {
    h1: 'Plagiarism Checker for Students',
    support: 'Check your essay, paper, assignment, thesis, or other coursework for matching text and sources before you submit. Review each match in context and decide what needs attention before you turn in your work.',
    /* the checker's own copy — the homepage's, with the approved CTA and free line */
    placeholder: 'Paste or type your text here',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
    /* the student story the brief asks the page to preserve (§15), as the path it
       draws — labels, not copy */
    path: ['Draft', 'Check', 'Inspect the match and its source', 'Revise deliberately', 'Submit'],
  },

  proof: [['500,000+', 'users'], ['80+', 'languages', 'Plagiarism checking in'], ['BBB Accredited']],

  report: {
    eyebrow: 'Before You Submit',
    h2: 'Review every match before you submit',
    intro: 'A similarity score is only a starting point. Open a highlighted passage to see the matching source and its context, then review citations, references, and other report signals before deciding whether anything needs to change.',
    callout: 'PlagiarismSearch surfaces matching text and sources for review. It does not decide whether a passage is plagiarism.',
    principle: 'Similarity is not a plagiarism grade.',
    support: 'A matching passage may be a quotation, a reference, common phrasing, a close paraphrase, or text that needs closer review. Look at the source and context instead of treating one percentage as a pass-or-fail result.',
  },

  workflow: {
    eyebrow: 'Review Your Draft',
    h2: 'What to do when you find a match',
    steps: [
      ['Open the matched passage', 'Find the highlighted text in your report and open the source connected to that match.'],
      ['Review the source and context', 'Check whether the match comes from a quotation, reference, common phrasing, a close paraphrase, or another passage that needs closer attention.'],
      ['Revise where necessary', 'If the wording or attribution needs work, revise the passage appropriately — for example, correct the citation, use quotation marks where required, or rewrite the idea in your own words.'],
      ['Review the updated draft', 'If you make changes, you can check the revised paper again and review the updated matches before submission.'],
    ],
    /* the decision the steps describe, drawn beside them: every phrase is from step 2
       and step 3 above */
    kinds: ['A quotation', 'A reference', 'Common phrasing', 'A close paraphrase', 'A passage that needs closer attention'],
    fixes: ['Correct the citation', 'Use quotation marks where required', 'Rewrite the idea in your own words'],
  },

  sources: {
    eyebrow: 'Sources &amp; Settings',
    h2: 'Control what your paper is checked against',
    intro: 'Choose the source collections and exclusions that fit your paper before you interpret the result. Search the web and academic databases, and exclude references or in-text citations when appropriate.',
    search: [
      ['Web', 'Search available web sources for matching or similar text.'],
      ['Academic databases', 'Include academic database search when you want the paper compared with indexed academic material.'],
    ],
    exclusions: [
      ['Exclude references', 'Exclude the reference section when that fits the way you need to review the paper.'],
      ['Exclude in-text citations', 'Exclude in-text citations when appropriate for the check.'],
    ],
    coverage: 'When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts.',
    note: 'Depending on your account, settings, and access, personal or organization storage may also be available as comparison sources.',
    interpretation: 'Changing the source collections or exclusions changes what the report can show, so review your settings before comparing results between checks.',
  },

  paper: {
    eyebrow: 'Your Paper &amp; Report',
    h2: 'Know what happens to your paper',
    intro: 'Your document is processed to perform the checks you select. The file you upload is not retained as a stored source document, while a generated report may remain in your account for convenient access.',
    steps: [
      ['Upload &amp; process', 'Your document is processed for the checks you select.'],
      ['Source document', 'The uploaded file is not retained as a stored source document.'],
      ['Report', 'Your generated report may remain in your account for convenient access.'],
      ['Delete', 'You can permanently delete reports from your account.'],
    ],
    storage: 'If you choose Add to storage, that is a separate action you control.',
    clarification: 'Running a plagiarism check does not automatically add your paper to storage.',
    cta: 'Read our Privacy Policy', ctaHref: 'policy.html',
  },

  ai: {
    h2: 'Plagiarism and AI writing are different checks',
    plagiarism: ['Plagiarism check', 'Plagiarism checking finds text that matches available sources and shows where those matches come from.'],
    ai: ['AI writing check', 'AI writing analysis provides a separate indicator for the text you choose to analyze. It does not replace source matching and does not prove authorship.'],
    critical: 'AI-generated text is not automatically plagiarism, and a low similarity result does not prove that a text was written by a human.',
    cta: 'Explore AI Detector', ctaHref: 'ai-detector.html',
  },

  free: {
    eyebrow: 'Start Free',
    h2: 'Check a short passage before you choose a plan',
    p1: 'You can check up to 150 words for plagiarism without registering. Registered users receive 300 plagiarism words per day.',
    p2: 'If you need to check more, compare the current PlagiarismSearch plans and choose the option that fits your work.',
    primary: 'Check for plagiarism',
    secondary: 'See all pricing options', secondaryHref: 'prices.html',
  },

  faq: {
    h2: 'Plagiarism Checker for Students FAQ',
    items: [
      ['Can I check my essay or paper before submitting it?', 'Yes. You can paste text or upload a supported document and run a plagiarism check before submission. The report shows matching or similar passages and their sources so you can review the result in context.'],
      ['Does a similarity percentage mean I plagiarized?', 'No. Similarity means that some text matches or closely resembles text found in the sources included in your check. A match may come from a quotation, reference, common phrasing, a close paraphrase, or material that needs closer review.'],
      ['What is a safe similarity percentage for a student paper?', 'There is no universal similarity percentage that proves a paper is plagiarism-free or automatically means that plagiarism occurred. Review the individual matches, their sources, and citation context, and follow any requirements set by your course or institution.'],
      ['Can I exclude references and in-text citations?', 'Yes. PlagiarismSearch includes settings to exclude references and in-text citations when appropriate. Because exclusions affect what is checked and reported, review your settings before interpreting the result.'],
      ['What sources can my paper be checked against?', 'Depending on your settings and access, a plagiarism check can include web sources, academic databases, personal storage, or organization storage. When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts.'],
      ['Is my uploaded paper stored?', 'The uploaded file is not retained as a stored source document after processing. A generated report may remain available in your account for convenience, and you can permanently delete it. Adding content to storage is a separate action you control.'],
      ['Can I check for AI-written text too?', 'Yes. AI writing analysis can be added as a separate check when the capability and AI-word balance are available. Plagiarism checking and AI detection answer different questions: an AI result does not by itself mean plagiarism or prove authorship.'],
      ['How much can I check for free?', 'You can check up to 150 words for plagiarism without registering. Registered users receive 300 plagiarism words per day.'],
      ['Which file types can I upload?', 'The checker accepts common document formats such as DOC/DOCX, PDF, TXT, PPT/PPTX, and XLS/XLSX, along with other supported formats. The current uploader shows the formats available at the time of your check.'],
    ],
  },

  close: {
    h2: 'Check your paper before you submit',
    support: 'Paste your text or upload a document to review matching passages and sources in a clear report.',
    primary: 'Check for plagiarism',
    micro: '150 words free — no registration required.',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's.
   ───────────────────────────────────────────────────────────────────────────── */
const eyebrow = (dot, label, ground = 'white') => `        <div class="inline-flex items-center gap-2 rounded-full ${ground === 'white' ? 'bg-white' : 'bg-ink-50'} ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;
const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CARD = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const btnLight = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 ring-1 ring-black/10 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;
const linkQuiet = (label, href, dark) => `<a href="${href}"${ext(href)} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold ${dark ? 'text-white/70 hover:text-white decoration-white/30' : 'text-ink-500 hover:text-ink-900 decoration-ink-300'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const TINT = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'], mint: ['bg-mint-100', '#1B7A50'] };
const chip = (tint, paths) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINT[tint][0]} items-center justify-center shrink-0">${ico(paths, TINT[tint][1])}</span>`;
const I = {
  search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  sliders:  '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  trash:    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  quote:    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  pen:      '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  rotate:   '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  eye:      '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
};

/* a tick line — the homepage's list item */
const tick = (head, body) => `            <li class="flex items-start gap-3 py-3">
              <svg class="shrink-0 mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              <span class="min-w-0">
                <span class="block text-[14.5px] sm:text-[15px] font-bold tracking-tight text-ink-900">${head}</span>
                <span class="block text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600 mt-0.5">${body}</span>
              </span>
            </li>`;

/* ═══════════════ 01 · HERO — THE REAL CHECKER, STUDENT-FRAMED ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / REAL STUDENT CHECKER =================
       The same form the homepage renders (build/checker.js), in a different hero: two
       columns, the student's job on the left and the form on the right, so the page
       opens on "before you submit" rather than on the generic category. The path under
       the support line is the brief's own student story, drawn — labels, not copy. -->
  <section id="student-checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <!-- three blocks: DOM order H1 → form → path, so a phone has the checker on its first
           screen; at lg the form takes the right column across both rows -->
      <div class="grid lg:grid-cols-[.95fr_1.05fr] gap-x-14 gap-y-8 lg:gap-y-7 items-start">

        <div class="rv min-w-0 lg:col-start-1 lg:row-start-1 lg:pt-4">
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Students')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[54ch]">${COPY.hero.support}</p>
        </div>

        <div class="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
${checker.form(COPY.hero, ANCHOR)}
${checker.free(COPY.hero)}
        </div>

        <div class="rv min-w-0 lg:col-start-1 lg:row-start-2">
          <!-- the pre-submission path: the brief's student story, as a strip -->
          <ol class="flex flex-wrap items-center gap-y-2" aria-label="Before you submit">
${COPY.hero.path.map((step, i) => `            <li class="flex items-center">
              <span class="inline-flex items-center gap-2 rounded-full ${i === 1 ? 'bg-ink-900 text-white' : 'bg-white ring-1 ring-black/5 text-ink-800'} px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-semibold">${i === 1 ? '<span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>' : ''}${step}</span>${i < COPY.hero.path.length - 1 ? `
              <svg class="mx-1.5 text-ink-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>` : ''}
            </li>`).join('\n')}
          </ol>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · COMPACT TRUST PROOF ═══════════════ */
const section2 = () => `  <!-- ================= 02 · COMPACT TRUST PROOF =================
       The homepage rail, still: three verified facts in reading order, each column one
       element so "500,000+ users" survives as a sentence. Static here — the page's
       object is the checker and a roll beside it would compete. -->
  <section class="relative py-10 sm:py-12 lg:py-14 bg-white border-b border-ink-100">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-start justify-center gap-x-12 sm:gap-x-16 lg:gap-x-24 gap-y-8 text-center">
        <div class="flex flex-col items-center">
          <div class="hidden sm:block h-[17px]" aria-hidden="true"></div>
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><div class="text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold tracking-tightest nums leading-none">500,000+</div></div>
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mt-2">users</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="text-[11px] sm:text-[11.5px] font-medium text-ink-500 h-[17px] leading-[17px]">Plagiarism checking in</div>
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><div class="text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold tracking-tightest nums leading-none">80+</div></div>
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mt-2">languages</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="hidden sm:block h-[17px]" aria-hidden="true"></div>
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><img src="assets/svg/partners/bbb.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" class="h-full w-auto object-contain"></div>
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mt-2">BBB Accredited</div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · THE REPORT, AND THE PRINCIPLE ═══════════════ */
const section3 = () => `  <!-- ================= 03 · SIGNATURE · THE REPORT, BEFORE YOU SUBMIT =================
       The dark act. The approved report (build/report.js), semantics untouched, and
       under it the thing this page exists to say: "Similarity is not a plagiarism
       grade." — set as a display statement on a white card, with the interpretation
       callout beside it. No verdicts, thresholds, fixes or new fields. -->
  <section id="before-you-submit" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute" style="width:620px;height:620px;left:-13%;top:40px;background:rgba(13,168,194,.12)"></div>
    <div class="orb absolute" style="width:520px;height:520px;right:-10%;bottom:-120px;background:rgba(243,111,90,.10)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10 lg:mb-12">
${eyebrowDark('teal-400', COPY.report.eyebrow)}
        <h2 class="${H2}">${COPY.report.h2}</h2>
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[72ch]">${COPY.report.intro}</p>
      </div>

      <div class="rv grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div id="cabDoc" class="relative min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden shadow-diffuse-lg">
          <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 sm:px-6 lg:px-7 py-3.5 sm:py-4 lg:py-5 border-b border-ink-100">
            <span class="text-[13.5px] sm:text-[14.5px] font-bold tracking-tight tabular-nums">${CAB.id}</span>
            <span class="flex items-center gap-5 text-[12px] sm:text-[12.5px] text-ink-600">
              <span>Words: <b class="font-bold text-ink-800 tabular-nums">${CAB.words}</b></span>
              <span>Uploaded at: <b class="font-bold text-ink-800">${CAB.uploaded}</b></span>
            </span>
          </div>
          <div class="px-5 sm:px-6 lg:px-7 py-5 sm:py-6 lg:py-7 space-y-3.5">
            ${CAB.doc.map(cabLine).join(NL14)}
          </div>
          <div class="cab-foot flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 px-5 py-3.5 sm:py-4 lg:py-5 border-t border-ink-100 bg-ink-50">
            ${CAB.legend.map(cabLegend).join(NL14)}
          </div>
        </div>

        <div id="cabSide" class="flex flex-col min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden shadow-diffuse-lg">
          <div class="shrink-0 px-5 sm:px-6 py-5 sm:py-6">
            <p class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-5">Report information</p>
            ${CAB.metrics.map(cabMetric).join(NL14)}
          </div>
          <div class="shrink-0 flex items-center gap-6 px-5 sm:px-6 border-b border-ink-200 bg-ink-100 text-[13.5px] font-semibold">
            <span class="cab-tab on pt-3">Plagiarism</span>
            <span class="cab-tab pt-3">AI</span>
          </div>
          <div class="cab-sources relative flex-1 min-h-[140px] overflow-hidden">
            <ul class="absolute inset-0 divide-y divide-ink-100">
              ${CAB.sources.map(cabSource).join(NL16)}
            </ul>
          </div>
        </div>
      </div>

      <!-- the principle, as the page's one display statement; the callout beside it -->
      <div class="rv mt-6 sm:mt-8 grid lg:grid-cols-[1.15fr_.85fr] gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div class="rounded-3xl sm:rounded-4xl bg-white text-ink-900 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-4">Student principle</p>
          <p class="text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold tracking-tightest leading-[1.1] mb-4 lg:mb-5">${penMark(COPY.report.principle, 'not')}</p>
          <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[60ch]">${COPY.report.support}</p>
        </div>
        <div class="rounded-3xl sm:rounded-4xl bg-teal-400/[.07] ring-1 ring-teal-400/25 p-6 sm:p-7 lg:p-8 flex items-start gap-4 sm:gap-5">
          <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30 flex items-center justify-center">${ico(I.info, '#6ED7E8')}</span>
          <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white font-semibold">${COPY.report.callout}</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · WHAT TO DO WITH A MATCH ═══════════════ */
const section4 = () => `  <!-- ================= 04 · REVIEW YOUR DRAFT — THE DECISION =================
       Four steps, but drawn as the decision they describe rather than four equal cards:
       the steps run down the left on one spine; beside them, what a match can be and
       what revising can mean — every phrase lifted from steps 2 and 3. Step 4 loops
       back to the checker because that is what the copy says it does. No automatic
       fixes anywhere. -->
  <section id="review-your-draft" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.workflow.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.workflow.h2}</h2>
      </div>

      <div class="grid lg:grid-cols-[1.1fr_.9fr] gap-6 lg:gap-12 items-start">
        <ol class="rv-kids relative space-y-4 sm:space-y-5">
          <span class="absolute left-[21px] top-8 bottom-8 w-px bg-ink-200" aria-hidden="true"></span>
${COPY.workflow.steps.map(([head, body], i) => `          <li class="relative flex items-start gap-4 sm:gap-5">
            <span class="relative z-[1] shrink-0 w-11 h-11 rounded-full ${i === 3 ? 'bg-ink-900 text-white' : 'bg-teal-100 text-teal-800'} flex items-center justify-center text-[14px] font-bold tabular-nums">${i === 3 ? ico(I.rotate, '#fff', 18) : i + 1}</span>
            <div class="min-w-0 flex-1 rounded-2xl sm:rounded-3xl bg-ink-50 px-5 py-4 sm:px-6 sm:py-5">
              <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-1">Step ${i + 1}</p>
              <h3 class="text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight mb-1.5">${head}</h3>
              <p class="${BODY} text-ink-600 max-w-[58ch]">${body}</p>${i === 3 ? `
              <a href="${ANCHOR}" class="mt-3 inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-700 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.hero.cta}</a>` : ''}
            </div>
          </li>`).join('\n')}
        </ol>

        <!-- the decision beside the steps: what a match can be, what revising can mean -->
        <div class="rv lg:sticky lg:top-28 rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-7">
            <div class="flex items-center gap-3 mb-4">
              ${chip('orange', I.eye)}
              <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">A match may be</p>
            </div>
            <ul class="grid gap-2 mb-6">
${COPY.workflow.kinds.map(k => `              <li class="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-2.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-800"><span class="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>${k}</li>`).join('\n')}
            </ul>
            <div class="flex items-center gap-3 mb-4">
              ${chip('teal', I.pen)}
              <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">Revise appropriately</p>
            </div>
            <ul class="grid gap-2">
${COPY.workflow.fixes.map(k => `              <li class="flex items-center gap-3 rounded-xl bg-teal-50 ring-1 ring-teal-600/10 px-4 py-2.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-800"><svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>${k}</li>`).join('\n')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · SOURCES & ACADEMIC CONTROLS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · SOURCES & SETTINGS =================
       Control-style evidence, academic first: two lists a student actually sets — what
       to search and what to exclude — with the coverage fact as the one figure, and the
       two qualifying lines set as the notes they are. Ticks, not switches: the page
       cannot act on a control that moves. -->
  <section id="sources-and-settings" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.sources.eyebrow)}
        <h2 class="${H2}">${COPY.sources.h2}</h2>
        <p class="${INTRO}">${COPY.sources.intro}</p>
      </div>

      <div class="rv-kids grid lg:grid-cols-[1fr_1fr_.85fr] gap-4 sm:gap-5 lg:gap-6">
        <div class="${CARD}">
          <div class="flex items-center gap-3 mb-3">
            ${chip('teal', I.search)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">Search sources</span>
          </div>
          <ul class="divide-y divide-ink-100">
${COPY.sources.search.map(([h, b]) => tick(h, b)).join('\n')}
          </ul>
        </div>

        <div class="${CARD}">
          <div class="flex items-center gap-3 mb-3">
            ${chip('orange', I.sliders)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">Exclusions</span>
          </div>
          <ul class="divide-y divide-ink-100">
${COPY.sources.exclusions.map(([h, b]) => tick(h, b)).join('\n')}
          </ul>
        </div>

        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-900 text-white p-5 sm:p-6 lg:p-7 flex flex-col justify-center">
          <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.database, '#fff', 19)}</span>
          <div class="text-[clamp(1.7rem,3vw,2.6rem)] font-extrabold tracking-tightest nums leading-none mt-5 mb-3">500 million</div>
          <p class="${BODY} text-white/60">${COPY.sources.coverage}</p>
        </div>
      </div>

      <div class="rv mt-4 sm:mt-5 lg:mt-6 grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <p class="rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 px-5 py-4 sm:px-6 sm:py-5 ${BODY} text-ink-600">${COPY.sources.note}</p>
        <p class="rounded-2xl sm:rounded-3xl bg-orange-50 ring-1 ring-orange-200 px-5 py-4 sm:px-6 sm:py-5 ${BODY} text-ink-900 font-semibold">${COPY.sources.interpretation}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · YOUR PAPER & REPORT ═══════════════ */
const section6 = () => `  <!-- ================= 06 · YOUR PAPER & REPORT =================
       The lifecycle as one rail of four stations rather than four cards: the document
       goes in, the file is not kept, the report is, and you can delete it. Storage is
       the separate action it is, in its own card with the privacy link. No absolutes. -->
  <section id="your-paper" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.paper.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.paper.h2}</h2>
        <p class="${INTRO}">${COPY.paper.intro}</p>
      </div>

      <ol class="rv-kids relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <span class="hidden lg:block absolute left-[10%] right-[10%] top-[22px] h-px bg-ink-200" aria-hidden="true"></span>
${COPY.paper.steps.map(([head, body], i) => `        <li class="relative">
          <div class="flex items-center gap-3 mb-4">
            ${chip(['teal', 'ink', 'orange', 'ink'][i], [I.upload, I.file, I.report, I.trash][i]).replace('inline-flex', 'relative z-[1] inline-flex ring-4 ring-white')}
            <span class="text-[11px] font-bold tracking-[0.2em] text-ink-400 nums">0${i + 1}</span>
          </div>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1.5">${head}</h3>
          <p class="${BODY} text-ink-600 max-w-[36ch]">${body}</p>
        </li>`).join('\n')}
      </ol>

      <div class="rv mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-50 p-5 sm:p-6 lg:p-7">
        <div class="min-w-0">
          <p class="${BODY} text-ink-600 mb-1.5">${COPY.paper.storage}</p>
          <p class="${BODY} text-ink-900 font-semibold">${COPY.paper.clarification}</p>
        </div>
        <div class="shrink-0 sm:ml-auto">${btnLight(COPY.paper.cta, COPY.paper.ctaHref)}</div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · PLAGIARISM VS AI, COMPACT ═══════════════ */
const section7 = () => `  <!-- ================= 07 · PLAGIARISM VS AI =================
       Compact by instruction: one card, two halves, the critical line under them, one
       quiet link. Plagiarism keeps the darker half. -->
  <section id="plagiarism-vs-ai" class="relative py-12 sm:py-14 lg:py-16 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-7 sm:mb-8 lg:mb-10">
        <h2 class="${H2}">${COPY.ai.h2}</h2>
      </div>
      <div class="rv rounded-3xl sm:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="rounded-[18px] sm:rounded-3xl bg-white shadow-inner-hl overflow-hidden">
          <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-100">
            <div class="p-5 sm:p-6 lg:p-7 bg-ink-900 text-white">
              <div class="flex items-center gap-3 mb-4">
                <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.search, '#fff', 19)}</span>
                <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/50">${COPY.ai.plagiarism[0]}</span>
              </div>
              <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/85">${COPY.ai.plagiarism[1]}</p>
            </div>
            <div class="p-5 sm:p-6 lg:p-7 flex flex-col">
              <div class="flex items-center gap-3 mb-4">
                ${chip('orange', I.sparkles)}
                <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">${COPY.ai.ai[0]}</span>
              </div>
              <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 mb-5">${COPY.ai.ai[1]}</p>
              <div class="mt-auto">${linkQuiet(COPY.ai.cta, COPY.ai.ctaHref)}</div>
            </div>
          </div>
          <div class="flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5 bg-orange-50 border-t border-orange-200/60">
            ${chip('orange', I.info)}
            <p class="text-[14.5px] sm:text-[15px] leading-relaxed text-ink-900 font-semibold">${COPY.ai.critical}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · START FREE ═══════════════ */
const section8 = () => `  <!-- ================= 08 · START FREE — THE COMPACT PRICING PATH =================
       The two confirmed limits as two figures, the approved sentences beside them, and
       the two ways on: back to the checker, or to the pricing owner. No matrix, no
       prices, no plan names. -->
  <section id="start-free" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-14 items-center">
        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.free.eyebrow, 'ink')}
          <h2 class="${H2}">${COPY.free.h2}</h2>
          <p class="${INTRO}">${COPY.free.p1}</p>
          <p class="mt-3 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.free.p2}</p>
          <div class="flex flex-wrap items-center gap-3 sm:gap-4 mt-7 lg:mt-8">
            ${btnDark(COPY.free.primary, ANCHOR)}
            ${linkQuiet(COPY.free.secondary, COPY.free.secondaryHref)}
          </div>
        </div>

        <div class="rv-kids grid sm:grid-cols-2 gap-4 sm:gap-5">
          <div class="rounded-3xl sm:rounded-4xl bg-teal-50 ring-1 ring-teal-600/10 p-6 sm:p-7 lg:p-8">
            <p class="text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-tightest nums leading-none text-teal-800">150</p>
            <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-teal-700 mt-3">words</p>
            <p class="${BODY} text-ink-600 mt-3">without registering</p>
          </div>
          <div class="rounded-3xl sm:rounded-4xl bg-ink-950 text-white p-6 sm:p-7 lg:p-8">
            <p class="text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-tightest nums leading-none">300</p>
            <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/60 mt-3">plagiarism words per day</p>
            <p class="${BODY} text-white/60 mt-3">for registered users</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · FAQ ═══════════════ */
const section9 = () => `  <!-- ================= 09 · FAQ =================
       Nine questions, full answers in the HTML, the accordion the site uses. -->
  <section id="student-faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Questions')}
          <h2 class="${H2}">${COPY.faq.h2}</h2>
        </div>
        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.faq.items.map(([q, a], i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${a}</p></div></div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 10 · FINAL CTA ═══════════════ */
const section10 = () => `  <!-- ================= 10 · FINAL CTA =================
       The closing band (build/cta.js). One action, back to the one real checker. -->
  <section id="student-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('student-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.close.h2, 'before you')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[58ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.close.support}</p>
      <div class="rv flex flex-col items-center gap-4">
        <a href="${ANCHOR}" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          ${COPY.close.primary}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <p class="flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-700">
          <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.sparkles}</svg>
          ${COPY.close.micro}
        </p>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles. The .cab-* rules are the report component's contract, carried
   verbatim; the form's rules come from build/checker.js.
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  [hidden] { display: none !important; }
  section[id] { scroll-margin-top: 100px; }

  a:focus-visible, button:focus-visible, select:focus-visible,
  [tabindex]:focus-visible, input:focus-visible, textarea:focus-visible {
    outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  .bg-ink-950 a:focus-visible, .bg-ink-950 button:focus-visible { outline-color: #6ED7E8; }

  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

${checker.style}

  /* ---------- the shared report component ---------- */
  .cab-mark { cursor:pointer; transition:background-color .25s ease, box-shadow .25s ease;
    border-radius:.3rem; padding:.08em .16em; margin:-.08em -.16em;
    box-shadow:inset 0 -2px 0 currentColor;
    background-image:linear-gradient(var(--wash), var(--wash));
    background-repeat:no-repeat; background-position:left center; background-size:100% 100%; }
  .cab-plag { --wash:rgba(243,111,90,.18); color:rgba(243,111,90,.85); }
  .cab-ai   { --wash:rgba(168,85,247,.15); color:rgba(168,85,247,.75); }
  .cab-plag.on { --wash:rgba(243,111,90,.4); }
  .cab-ai.on   { --wash:rgba(168,85,247,.34); }
  .cab-mark > span { color:#111827; }
  .cab-src.on { background:#F8F9FB; }
  .cab-tab { padding-bottom:10px; border-bottom:2px solid transparent; color:#4B5563; }
  .cab-tab.on { color:#06748A; border-bottom-color:#0991A8; }
  .cab-sources, .cab-foot { border-bottom-left-radius:1rem; border-bottom-right-radius:1rem; }
  @media (min-width:640px) {
    .cab-sources, .cab-foot { border-bottom-left-radius:20px; border-bottom-right-radius:20px; }
  }
  @media (min-width:1024px) {
    .cab-sources, .cab-foot { border-bottom-left-radius:1.5rem; border-bottom-right-radius:1.5rem; }
  }
  .cab-sources::after { content:""; position:absolute; left:0; right:0; bottom:0; height:64px;
    pointer-events:none; background:linear-gradient(to bottom, rgba(255,255,255,0), #fff 88%); }
  @media (prefers-reduced-motion: reduce) { .cab-mark { transition:none; } }

  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
${cta.style('student-cta')}
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour — the form's own, the report's own, the accordion, the burger.
   ───────────────────────────────────────────────────────────────────────────── */
const SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });

  gsap.utils.toArray('.rv-kids').forEach(group => {
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .08,
      scrollTrigger: { trigger: group, start: 'top 80%' } });
  });

  gsap.utils.toArray('.pen-word').forEach(word => {
    const line = word.querySelector('.pen-underline');
    if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    const inFirstView = word.getBoundingClientRect().top < innerHeight * .9;
    const tl = gsap.timeline(inFirstView
      ? { delay: 1 }
      : { scrollTrigger: { trigger: word, start: 'top 80%', once: true } });
    tl.to(word, { color: '#DC5A45', duration: .45, ease: 'power2.out' })
      .set(line, { opacity: 1 }, .35)
      .to(line, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, .35);
  });
${cta.script}
})();
</script>
<script>
(() => {
  'use strict';
${checker.script(ANCHOR)}

  /* the report: selecting a passage highlights it and its source */
  const marks = [...document.querySelectorAll('.cab-mark')];
  const sources = [...document.querySelectorAll('.cab-src')];
  const pick = i => {
    marks.forEach(m => m.classList.toggle('on', m.dataset.match === String(i)));
    sources.forEach(s => s.classList.toggle('on', s.dataset.src === String(i)));
  };
  marks.forEach(m => {
    m.addEventListener('click', () => pick(m.dataset.match));
    m.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(m.dataset.match); }
    });
  });
  if (marks.length) pick(marks[0].dataset.match);

  /* FAQ: answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      const list = item.parentElement;
      list.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
      list.querySelectorAll('.faq-q').forEach(b =>
        b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open'))));
    });
  });
})();
</script>
<script>
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
  addEventListener('resize', () => { if (innerWidth >= 1024) setOpen(false); });
})();
</script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + COPY.title + '</title>');
if (/name="description"/.test(head)) {
  head = head.replace(/<meta name="description"[^>]*>/,
    '<meta name="description" content="' + COPY.meta + '" />');
} else {
  head = head.replace('<title>',
    '<meta name="description" content="' + COPY.meta + '" />\n<title>');
}
head = head.replace('<title>', '<link rel="canonical" href="' + COPY.canonical + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10];

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${sections.map(f => f()).join('\n\n')}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items, ' +
            count(/<form\b/g) + ' form');
