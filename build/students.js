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

   Run:  node build/assets.js  →  node build/students.js  →  node build/shell.js
         →  node build/check-students.js  →  node build/parity/run.js plagiarism-checker-for-students.html

   On the shared production assets (build/assets.js, build/page.js) since 2026-09-25 —
   the page that proved the model. No Play CDN, no <style> or <script> of its own: the
   components it uses live in build/assets/css and build/assets/js. Hooks are data-*,
   decorative styles are classes, asset paths are root-relative. */
const page = require('./page');
const faq = require('./sections/faq');   /* the FAQ: one library template */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'plagiarism-checker-for-students.html';
const cta = require('./sections/cta-band');
const hero = require('./sections/hero');   /* the hero: one library template; it renders the form (build/checker.js) in its sealed slot */
const steps = require('./sections/steps');   /* the numbered sequences: one library template */
const sources = require('./sections/sources');   /* sources & scan settings: one library template */
const startFree = require('./sections/start-free');   /* the free entry: one library template */
const reportShowcase = require('./sections/report-showcase');

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

/* a glow, by preset (build/assets/css/01-base.css) */
const orb = preset => `<div class="orb absolute orb-${preset}"></div>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
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
       the support line is the brief's own student story, drawn — labels, not copy.
       The hero is the library's (build/sections/hero.js), layout "split-aside": three
       blocks, DOM order H1 → form → path, so a phone has the checker on its first screen;
       at lg the form takes the right column across both rows. -->
${hero.section({
    id: ANCHOR.slice(1), layout: 'split-aside',
    title: COPY.hero.h1, pen: 'Students',
    lead: COPY.hero.support,
    checker: { copy: COPY.hero, textId: 'student-checker-text' },
    /* the pre-submission path: the brief's student story, as a strip */
    aside: { path: { label: 'Before you submit', steps: COPY.hero.path, current: 1 } },
  })}`;

/* ═══════════════ 02 · COMPACT TRUST PROOF ═══════════════ */
const section2 = () => `  <!-- ================= 02 · COMPACT TRUST PROOF =================
       The homepage rail, still: three verified facts in reading order, each column one
       element so "500,000+ users" survives as a sentence. Static here — the page's
       object is the checker and a roll beside it would compete. -->
  <section data-component="proof-rail" class="relative py-10 sm:py-12 lg:py-14 bg-white border-b border-ink-100">
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
          <div class="h-[63px] sm:h-[78px] lg:h-[90px] flex items-center"><img src="/assets/svg/partners/bbb.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" class="h-full w-auto object-contain"></div>
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
${reportShowcase.section({
  id: 'before-you-submit', surface: 'dark', space: 'md', accent: 'teal',
  head: { eyebrow: COPY.report.eyebrow, title: COPY.report.h2, intro: COPY.report.intro, measure: '760', introMeasure: '72' },
  /* the principle, as the page's one display statement; the callout beside it */
  foot: { pair: { cards: [
    { principle: { kicker: 'Student principle', title: COPY.report.principle, pen: 'not', text: COPY.report.support } },
    { callout: COPY.report.callout },
  ] } },
})}`;

/* ═══════════════ 04 · WHAT TO DO WITH A MATCH ═══════════════ */
const section4 = () => `  <!-- ================= 04 · REVIEW YOUR DRAFT — THE DECISION =================
       Four steps, but drawn as the decision they describe rather than four equal cards:
       the steps run down the left on one spine; beside them, what a match can be and
       what revising can mean — every phrase lifted from steps 2 and 3. Step 4 loops
       back to the checker because that is what the copy says it does. No automatic
       fixes anywhere. -->
  <section id="review-your-draft" data-component="workflow-decision" class="relative py-16 sm:py-24 lg:py-32 bg-white">
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
       cannot act on a control that moves.
       The library's Sources (build/sections/sources.js), layout "groups". -->
${sources.section({
    id: 'sources-and-settings', layout: 'groups', bg: 'cool', space: 'lg', accent: 'teal',
    head: { eyebrow: COPY.sources.eyebrow, title: COPY.sources.h2, intro: COPY.sources.intro },
    groups: [
      { label: 'Search sources', icon: I.search, tone: 'teal', items: COPY.sources.search },
      { label: 'Exclusions', icon: I.sliders, tone: 'orange', items: COPY.sources.exclusions },
    ],
    stat: { icon: I.database, value: '500 million', text: COPY.sources.coverage },
    notes: [COPY.sources.note, { text: COPY.sources.interpretation, tone: 'warm' }],
  })}`;

/* ═══════════════ 06 · YOUR PAPER & REPORT ═══════════════ */
const section6 = () => `  <!-- ================= 06 · YOUR PAPER & REPORT =================
       The lifecycle as one rail of four stations rather than four cards: the document
       goes in, the file is not kept, the report is, and you can delete it. Storage is
       the separate action it is, in its own card with the privacy link. No absolutes.
       The library's Steps (build/sections/steps.js), layout "rail". -->
${steps.section({
    id: 'your-paper', layout: 'rail', marker: 'icon', bg: 'white', space: 'lg',
    head: { eyebrow: COPY.paper.eyebrow, title: COPY.paper.h2, intro: COPY.paper.intro },
    cols: 4,
    items: COPY.paper.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'ink', 'orange', 'ink'][i], icon: [I.upload, I.file, I.report, I.trash][i] })),
    foot: { note: { lines: [COPY.paper.storage, { text: COPY.paper.clarification, tone: 'strong' }], action: { label: COPY.paper.cta, href: COPY.paper.ctaHref, tone: 'light' } } },
  })}`;

/* ═══════════════ 07 · PLAGIARISM VS AI, COMPACT ═══════════════ */
const section7 = () => `  <!-- ================= 07 · PLAGIARISM VS AI =================
       Compact by instruction: one card, two halves, the critical line under them, one
       quiet link. Plagiarism keeps the darker half. -->
  <section id="plagiarism-vs-ai" data-component="ai-compare" class="relative py-12 sm:py-14 lg:py-16 bg-[#F7FAFC]">
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
       prices, no plan names.
       The library's Start free (build/sections/start-free.js), layout "open". -->
${startFree.section({
    id: 'start-free', layout: 'open', space: 'lg',
    head: { eyebrow: COPY.free.eyebrow, title: COPY.free.h2, intro: [COPY.free.p1, COPY.free.p2] },
    button: { label: COPY.free.primary, href: ANCHOR },
    link: { label: COPY.free.secondary, href: COPY.free.secondaryHref },
    figures: [
      { value: '150', label: 'words', sub: 'without registering' },
      { value: '300', label: 'plagiarism words per day', sub: 'for registered users' },
    ],
  })}`;

/* ═══════════════ 09 · FAQ ═══════════════ */
const section9 = () => `  <!-- ================= 09 · FAQ =================
       Nine questions, full answers in the HTML, the accordion the site uses. -->
${faq.section({
  id: 'student-faq', ns: 'student-faq', bg: 'tint', space: 'lg', layout: 'fluid',
  head: { eyebrow: 'Questions', title: COPY.faq.h2 },
  items: COPY.faq.items.map(([q, a]) => ({ q, a })),
})}`;

/* ═══════════════ 10 · FINAL CTA ═══════════════ */
const section10 = () => `  <!-- ================= 10 · FINAL CTA =================
       The closing band (build/sections/cta-band.js). One action, back to the one real checker. -->
${cta.section({
  id: 'student-cta',
  title: COPY.close.h2, ring: 'before you',
  lead: COPY.close.support,
  actions: { layout: 'stack', button: { label: COPY.close.primary, href: ANCHOR }, hint: COPY.close.micro },
})}`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js)
   ───────────────────────────────────────────────────────────────────────────── */
const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10];
const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items, ' +
            count(/<form\b/g) + ' form');
