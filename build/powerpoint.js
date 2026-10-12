/* Generate site/powerpoint-plagiarism-checker.html — the PowerPoint Plagiarism Checker to
   the brief of 2026-10-08 (new-tasks/new-page-7/PowerPoint_…_Package_2026-10-08.zip).
   It replaces a stub, so no -v2 and no version switcher.

   THE BRIEF IN ONE LINE: an existing URL with search value, ten sections in a fixed
   order, the real checker first, and the one thing only this page can show — what text a
   PPTX gives the checker, proved by one controlled test: four source slides and the four
   excerpts of the real report they produced.

   What that makes of the page:
   · The words below are the brief's, section by section.
   · Exactly two compositions are this page's own (the brief allows two):
       pptx-content-types   where the text lives in a presentation — four tiles, each a
                            small drawing of a slide with the checked place marked, and
                            the image-only case as a restrained "Not guaranteed" note
       pptx-proof           four tabs; each shows a source slide beside the excerpt of the
                            report that came from it (build/evidence.js — a tab swaps the
                            pictures and their caption, it runs nothing)
     The source slides stand in one place only, the proof: the tiles draw the idea and do
     not repeat the screenshots (the Canvas page's lesson — Olex, 2026-10-12).
   · Everything else is the Section Library: the hero with the shared checker, the report
     showcase, the steps, the pricing preview (the homepage's, with its Recurring payments
     switch), the FAQ, the closing band; the two notices are the Turnitin page's split
     card, the trust strip a row of the review platforms' marks without a figure.

   THE TEST MATERIAL IS INTERNAL. The slides say "INTERNAL QA · PLEASE DO NOT PUBLISH" and
   the report excerpts carry test markings; the brief has them shown in the prototype as
   clearly marked internal references, pending publication-safe versions. So every one
   stands under an "Internal reference" tag, they live in a folder named for what they are
   (site/assets/img/pptx-internal-reference/), and the page never prints the test's own
   figures (its percentage, its word and source counts) or claims OCR, a per-slide score
   or an accuracy.

   Destinations: /prices → prices.html, /policy → policy.html; every checker action
   returns to the one form in the hero.

   Run:  node build/powerpoint.js  →  node build/shell.js  →  node build/check-powerpoint.js
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const ev = require('./evidence');
const sh = require('./sections/section-head');
const action = require('./sections/action');
const tile = require('./sections/icon-tile');
const hero = require('./sections/hero');
const steps = require('./sections/steps');
const reportShowcase = require('./sections/report-showcase');
const pricingPreview = require('./sections/pricing-preview');
const faq = require('./sections/faq');
const cta = require('./sections/cta-band');
const REVIEWS = require('./reviews');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'powerpoint-plagiarism-checker.html';
const ANCHOR = '#powerpoint-checker';
const PROOF = '#powerpoint-proof';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — PowerPoint brief, 2026-10-08. Verbatim.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'PowerPoint Plagiarism Checker for PPT &amp; PPTX | PlagiarismSearch',
  meta: 'Check PPT and PPTX presentations for matching text. Review slide content, speaker notes and source matches in a PlagiarismSearch report.',
  canonical: 'https://plagiarismsearch.com/powerpoint-plagiarism-checker',

  hero: {
    eyebrow: 'PowerPoint Plagiarism Checker',
    h1: 'PowerPoint Plagiarism Checker for PPT &amp; PPTX Files',
    support: 'Upload your presentation to check text in your slides, tables, editable shapes, and speaker notes for matching content. Review the sources in a PlagiarismSearch report before you submit or present.',
    chips: ['PPT &amp; PPTX uploads', 'Matched-text evidence', 'Source-based reports'],
    /* the shared checker's own copy — the sitewide form, unchanged */
    placeholder: 'Paste or type your text here',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
  },

  types: {
    eyebrow: 'PowerPoint Content',
    h2: 'What Text Can Be Checked in a PowerPoint?',
    intro: 'PowerPoint presentations contain text in more places than the main slide body. In a controlled PPTX test, PlagiarismSearch found matching content from editable slide text, tables, shapes, and speaker notes.',
    tiles: [
      ['Slide text', 'Titles, paragraphs, and bullet points stored as editable PowerPoint text can be included in the check.'],
      ['Tables', 'Text inside native PowerPoint table cells was included in our sample PPTX check.'],
      ['Editable shapes', 'Text within editable slide shapes was also found in the sample report.'],
      ['Speaker notes', 'The text stored in a slide’s speaker notes appeared in the sample report, even though it was not visible on the slide.'],
    ],
    limit: ['Not guaranteed', 'Text embedded only in images or screenshots is not guaranteed to be extracted. Review important visual material separately rather than assuming the checker reads every pixel.'],
    cta: 'See a real check result',
  },

  proof: {
    eyebrow: 'Real Product Example',
    h2: 'From PowerPoint Text to a Source-Based Report',
    intro: 'We tested one PPTX file with known text placed in different PowerPoint elements. The PlagiarismSearch report displayed the extracted passages and linked them to matching sources. Explore the examples below to see what happened.',
    tabs: [
      ['Slide text', 'A passage in a regular PowerPoint text box appeared as highlighted text in the report.'],
      ['Table', 'A passage written inside an editable PowerPoint table appeared in the result.'],
      ['Shape', 'A passage inside an editable shape was also present with matches.'],
      ['Speaker notes', 'Text from the Notes pane appeared in the report even though it was absent from the visible slide.'],
    ],
    captions: ['Source presentation', 'Extracted text and matching sources'],
    caveat: 'Example from a controlled PPTX test. Results depend on document content, selected sources, and checking settings.',
    cta: 'Check your PowerPoint',
  },

  report: {
    eyebrow: 'Interpret Your Report',
    h2: 'See Matching Text and the Sources Behind It',
    intro: 'A PlagiarismSearch report highlights matching or similar passages and connects them to the sources found during the check. Select a match to examine the corresponding source and understand the result in context.',
    points: [
      ['Matched passages', 'Locate the text where matches or similarities were identified.'],
      ['Source evidence', 'Examine the sources associated with the passages in the report.'],
      ['Interactive review', 'Select a match to review the source and passage in context.'],
    ],
    callout: 'A similarity percentage is evidence to review, not an automatic plagiarism verdict.',
  },

  how: {
    eyebrow: 'How It Works',
    h2: 'How to Check a PowerPoint for Plagiarism',
    intro: 'You do not need to copy every slide into a separate document. Upload your presentation, run the check, and review the matching text and its sources.',
    steps: [
      ['Upload your PPT or PPTX', 'Choose the presentation from your device or drag it into the checker. The supported file upload flow is the same as on other PlagiarismSearch checker pages.'],
      ['Run the plagiarism check', 'PlagiarismSearch processes supported text from your presentation and compares it with the search sources available for your check.'],
      ['Review your report', 'Look at the highlighted passages, inspect the sources, and decide whether a citation, quotation, or revision is needed.'],
    ],
    cta: 'Check for plagiarism',
  },

  meaning: {
    eyebrow: 'What Your Results Mean',
    h2: 'Understand the Result Before You Make a Decision',
    notices: [
      ['Similarity is not a plagiarism verdict', 'A matching passage can be a quotation, a citation, commonly used wording, or material that needs attribution. Review the text and its source before deciding what the match means.'],
      ['AI writing analysis is separate', 'AI-writing indicators address a different question from source similarity. An AI result does not by itself establish plagiarism, misconduct, or who authored the work.'],
    ],
  },

  handling: {
    eyebrow: 'Your Document &amp; Report',
    h2: 'What Happens to Your PowerPoint After the Check?',
    intro: 'Processing a presentation, keeping a generated report, and adding a document to Storage are different actions. It is important not to confuse them.',
    steps: [
      ['Your presentation', 'Your uploaded PowerPoint is processed to perform the check using the sources and settings you select. A check does not by itself mean the file has been added to your reusable Storage collection.'],
      ['Your report', 'The generated report may remain available in your account, depending on your account and service settings. You can review the matching passages and their sources in the report.'],
      ['Optional Storage', 'Where Storage is available, adding documents to it is a separate account-controlled workflow. Storage availability and settings may vary by plan and account.'],
    ],
    cta: 'Read the Privacy Policy', ctaHref: 'policy.html',
  },

  pricing: {
    eyebrow: 'Start Free or Choose a Plan',
    h2: 'Check a Short Excerpt Free — Or Choose a Plan',
    intro: 'Try the plagiarism checker with the available free word limit. For longer presentations or regular checks, choose the PlagiarismSearch plan and billing period that fit your needs.',
    /* the brief's helper line. The homepage's pricing module has no slot for a line of
       its own beside the head, so it is not on the page (the hero, the FAQ and the closing
       band say the same thing); kept here for the day a slot exists */
    helper: '150 words can be checked without registration.',
    recurring: 'Recurring payments',
    cta: 'View all pricing', ctaHref: 'prices.html',
  },

  trust: {
    h2: 'Trusted by People Who Review Their Writing',
    intro: 'Explore independently hosted PlagiarismSearch feedback and decide whether the service fits your workflow.',
  },

  faq: {
    h2: 'PowerPoint Plagiarism Checker FAQ',
    items: [
      ['Can I upload PPT and PPTX files directly?', 'Yes. The PlagiarismSearch checker accepts PowerPoint PPT and PPTX uploads. You can submit a presentation directly rather than manually copying all its text into the checker.'],
      ['Does the checker analyze PowerPoint speaker notes?', 'In our controlled PPTX test, text stored only in speaker notes appeared in the exported report and matched available sources. Extraction may vary with the file and its contents.'],
      ['Can it check text in tables and shapes?', 'In the same PPTX test, text inside a native PowerPoint table and an editable shape appeared in the report. The checker works with the text it can extract; it does not assess the originality of every visual element.'],
      ['Can it find plagiarism inside images or screenshots?', 'Do not assume that text embedded only in an image will be extracted. The controlled test did not establish image-text recognition. If the words are important to your review, provide them in editable text where possible.'],
      ['Can I check a PowerPoint for free?', 'You can check up to 150 words without registration. A longer presentation may require an account or an appropriate plan; the free limit is not a promise of a complete free presentation scan.'],
      ['Does a high similarity score mean the presentation is plagiarized?', 'No. A similarity score identifies matching or similar material for review. Citations, quotations, standard wording and other context must be considered before drawing any conclusion.'],
      ['What happens to my file after checking?', 'Your presentation is processed to produce the result. The report and any optional Storage content are managed separately, subject to the service\'s available settings and Privacy Policy. A normal check should not be described as automatically adding the document to Storage.'],
    ],
  },

  close: {
    eyebrow: 'Ready to check?',
    h2: 'Check Your PowerPoint Before You Share It',
    body: 'Upload your PPT or PPTX, inspect the matching passages, and review the sources before submission or presentation.',
    primary: 'Check your PowerPoint',
    micro: '150 words free — no registration required.',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   THE TEST MATERIAL — one controlled PPTX and the report it produced, as supplied.
   A source slide is paired with the excerpt that came from it and with no other:
   A → R-A (text box), B → R-B (table), C → R-C (shape), D → R-D (speaker notes).
   w and h are the files' own pixels. Internal reference: see the head of this file.
   ───────────────────────────────────────────────────────────────────────────── */
const IMG = '/assets/img/pptx-internal-reference/';
const INTERNAL = 'Internal reference';
const PROTOTYPE_NOTE = 'Prototype note: these are internal test screenshots, shown as references until publication-ready versions are approved.';
/* the notes of slide D, as they are in the test file (the opening of the Gettysburg
   Address — public domain); the slide itself does not show them */
const NOTES = {
  label: 'Speaker notes of this slide — in the Notes pane, not on the slide',
  text: 'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure.',
};
const PAIRS = [
  { source: { src: IMG + 'source-a-textbox.webp', w: 1600, h: 900, title: 'Source slide — native text box',
      alt: 'Test slide “Native text box”: an ordinary PowerPoint text box holding the opening passage of Charles Dickens’s A Tale of Two Cities.' },
    report: { src: IMG + 'report-a-textbox.webp', w: 966, h: 639, title: 'Report excerpt — text box',
      alt: 'Excerpt of the PlagiarismSearch report for that slide: the Dickens passage from the text box appears as extracted text, highlighted as matching, with numbered source markers.' } },
  { source: { src: IMG + 'source-b-table.webp', w: 1600, h: 900, title: 'Source slide — native PowerPoint table',
      alt: 'Test slide “Native PowerPoint table”: a table whose cell holds the opening passage of the Declaration of Independence.' },
    report: { src: IMG + 'report-b-table.webp', w: 985, h: 796, title: 'Report excerpt — table',
      alt: 'Excerpt of the PlagiarismSearch report for that slide: the passage from the table cell appears as extracted text, highlighted, with numbered source markers.' } },
  { source: { src: IMG + 'source-c-shape.webp', w: 1600, h: 900, title: 'Source slide — editable shape',
      alt: 'Test slide “Editable shape text”: a rounded rectangle shape holding the opening passage of Lewis Carroll’s Alice’s Adventures in Wonderland.' },
    report: { src: IMG + 'report-c-shape.webp', w: 985, h: 648, title: 'Report excerpt — shape',
      alt: 'Excerpt of the PlagiarismSearch report for that slide: the passage from the shape appears as extracted text, highlighted, with numbered source markers.' } },
  { source: { src: IMG + 'source-d-notes.webp', w: 1600, h: 900, title: 'Source slide — speaker notes only',
      alt: 'Test slide “Speaker notes only”: the slide itself carries no source passage and says the text is in the PowerPoint speaker notes.' },
    report: { src: IMG + 'report-d-speaker-notes.webp', w: 985, h: 722, title: 'Report excerpt — speaker notes',
      alt: 'Excerpt of the PlagiarismSearch report for that slide: the Gettysburg Address passage, stored only in the speaker notes, appears as extracted text, highlighted, with numbered source markers.' },
    notes: true },
];

/* the review platforms' own pages and marks (build/reviews.js holds the addresses) */
const PLATFORMS = [
  { name: 'Trustpilot', url: REVIEWS.SOURCES.trustpilot.url, img: '/assets/svg/reviews/trustpilot-logo.svg', w: 318, h: 78, cls: 'h-7 sm:h-8' },
  { name: 'SmartCustomer', url: REVIEWS.SOURCES.smartcustomer.url, img: '/assets/svg/reviews/smartcustomer-logo.svg', w: 480, h: 78, cls: 'h-6 sm:h-7' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's.
   ───────────────────────────────────────────────────────────────────────────── */
const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const WRAP = 'relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10';
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  layers:   '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  archive:  '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  image:    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  quote:    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  ext:      '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
};

/* ═══════════════ 01 · HERO — THE SITEWIDE CHECKER ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / THE REAL CHECKER =================
       The sitewide form (build/checker.js), unchanged: one field, one drop zone with
       "Upload file", Dropbox / OneDrive / By URL, the two switches, "Check for
       plagiarism" — no PPTX widget of its own, no extra chip. The library's hero
       (build/sections/hero.js), layout "split-aside": H1 → form → the three proof chips
       as one line beside an icon, so a phone opens on the checker. The free line under
       the form is the brief's form helper. -->
${hero.section({
    id: ANCHOR.slice(1), layout: 'split-aside',
    eyebrow: COPY.hero.eyebrow,
    title: COPY.hero.h1, pen: 'PowerPoint', size: 'long',
    lead: COPY.hero.support,
    checker: { copy: COPY.hero, textId: 'powerpoint-checker-text' },
    aside: { notice: { tone: 'teal', icon: I.layers, text: COPY.hero.chips.join(' · ') } },
  })}`;

/* ═══════════════ 02 · WHAT GETS CHECKED — NEW MODULE A ═══════════════ */
/* the drawings: a slide is a small white 16:9 sheet; the place the text lives in is the
   one thing on it in teal. They draw where the text is, not a product screen. */
const sheet = (inner, extra = '') => `<span class="block aspect-[16/9] rounded-lg bg-white ring-1 ring-black/10 shadow-diffuse p-2.5 sm:p-3 ${extra}">${inner}</span>`;
const line = (w, tone) => `<span class="block h-1.5 rounded-full ${tone} w-[${w}%]"></span>`;
const grey = 'bg-ink-200', teal = 'bg-teal-400/70';
const DRAW = [
  /* slide text: a title and a paragraph, the paragraph marked */
  () => sheet(`${line(42, 'bg-ink-300')}<span class="block mt-2.5 space-y-1.5">${[94, 88, 96, 72].map(w => line(w, teal)).join('')}</span>`),
  /* a table: a header row and marked cells */
  () => sheet(`<span class="grid grid-cols-3 gap-1 h-full content-center">${Array.from({ length: 9 }, (_, i) => `<span class="block h-3.5 sm:h-4 rounded-[3px] ${i < 3 ? 'bg-ink-200' : 'bg-teal-400/60'}"></span>`).join('')}</span>`),
  /* a shape: a rounded box that holds the text */
  () => sheet(`<span class="flex flex-col justify-center gap-1.5 h-full rounded-xl bg-teal-50 ring-1 ring-teal-300 px-3">${[86, 94, 70].map(w => line(w, teal)).join('')}</span>`),
  /* speaker notes: the slide carries none of it; the notes strip under the slide does */
  () => `<span class="block">${sheet(`${line(42, 'bg-ink-300')}<span class="block mt-2.5 space-y-1.5">${[80, 62].map(w => line(w, grey)).join('')}</span>`, '!aspect-[16/6]')}<span class="block mt-1.5 rounded-lg bg-teal-50 ring-1 ring-teal-300 px-2.5 py-2"><span class="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-teal-700 mb-1.5">Notes pane</span><span class="block space-y-1.5">${[92, 76].map(w => line(w, teal)).join('')}</span></span></span>`,
];

const section2 = () => `  <!-- ================= 02 · WHAT GETS CHECKED / NEW MODULE A — POWERPOINT CONTENT TYPES =================
       The honest answer to "what does a PowerPoint checker read?": four places text
       lives in a presentation, each a tile with a small drawing of a slide and that place
       marked. The notes tile draws the Notes pane under the slide — the text is there,
       not on the slide. Text that exists only inside an image is not a fifth tile: it is
       the restrained note under them, "Not guaranteed". Static by choice (the brief allows
       a plain grid): the real slides and what the report made of them are the next act,
       and the same screenshots are not shown twice. -->
  <section id="powerpoint-content" data-component="pptx-content-types" data-bg="white" data-accent="teal" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="${WRAP}">
${indent(sh.block({ eyebrow: COPY.types.eyebrow, title: COPY.types.h2, intro: COPY.types.intro, measure: '860' }), '      ')}
      <ul class="rv-kids grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
${COPY.types.tiles.map(([title, text], i) => `        <li class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-4 sm:p-5 flex flex-col">
          <span class="flex flex-col justify-center rounded-xl sm:rounded-2xl bg-ink-50 px-4 sm:px-5 h-[176px] sm:h-[184px]" aria-hidden="true"><span class="block w-full max-w-[220px] mx-auto">${DRAW[i]()}</span></span>
          <h3 class="mt-4 sm:mt-5 text-[17px] sm:text-[18px] font-bold tracking-tight">${title}</h3>
          <p class="mt-2 ${BODY} text-ink-600">${text}</p>
        </li>`).join('\n')}
      </ul>

      <div class="rv mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl sm:rounded-3xl bg-ink-50 ring-1 ring-black/5 p-5 sm:p-6">
        ${tile.render({ tone: 'ink', icon: I.image })}
        <p class="min-w-0 ${BODY} text-ink-700"><span class="inline-flex items-center rounded-full bg-white ring-1 ring-black/10 px-2.5 py-0.5 mr-2 text-[11.5px] font-bold text-ink-800 whitespace-nowrap">${COPY.types.limit[0]}</span>${COPY.types.limit[1]}</p>
      </div>

      <div class="rv mt-7 sm:mt-8">
${indent(action.button({ label: COPY.types.cta, href: PROOF, tone: 'light' }), '        ')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · A REAL CHECK — NEW MODULE B ═══════════════ */
const internalTag = `<span class="shrink-0 rounded-full bg-orange-50 ring-1 ring-orange-200 px-2.5 py-1 text-[11px] font-semibold text-orange-700 whitespace-nowrap">${INTERNAL}</span>`;
const proofFigure = (caption, shot, extra = '') => `<figure class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-3 sm:p-4">
  <figcaption class="flex items-center justify-between gap-3 px-1 pb-3">
    <span class="${LABEL} text-ink-600">${caption}</span>
    ${internalTag}
  </figcaption>
  <div class="rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-black/10 bg-white">
${indent(ev.shot({ ...shot, zoom: true }), '    ')}
  </div>${extra}
</figure>`;
const notesBox = `
  <div class="mt-3 rounded-xl sm:rounded-2xl bg-teal-50 ring-1 ring-teal-200 p-4">
    <p class="text-[12px] sm:text-[12.5px] font-bold text-teal-800 mb-1.5">${NOTES.label}</p>
    <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-700">“${NOTES.text}”</p>
  </div>`;
const proofPanel = (p, i) => `<div data-proof-panel>
  <p class="text-[15px] sm:text-[16px] lg:text-[17px] font-semibold tracking-tight leading-snug text-ink-900 max-w-[70ch] mb-5 sm:mb-6">${COPY.proof.tabs[i][1]}</p>
  <div class="grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
${indent(proofFigure(COPY.proof.captions[0], p.source, p.notes ? notesBox : ''), '    ')}
${indent(proofFigure(COPY.proof.captions[1], p.report), '    ')}
  </div>
</div>`;

const section3 = () => `  <!-- ================= 03 · A REAL POWERPOINT CHECK / NEW MODULE B — FROM PPTX TO REPORT EVIDENCE =================
       One controlled PPTX, four tabs, and in each the source slide on the left and, on the
       right, the excerpt of the real report that came from that slide and no other:
       text box, table, shape, speaker notes. The notes tab also prints the notes
       themselves, because the slide does not show them. A tab changes the evidence shown
       (build/evidence.js) — it runs no check and is not wired to the form above. Light and
       restrained on purpose: the dark report act follows. Every picture is internal test
       material and is tagged so; no figure of the test is printed. -->
  <section id="${PROOF.slice(1)}" data-component="pptx-proof" data-bg="cool" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="${WRAP}">
${indent(sh.block({ eyebrow: COPY.proof.eyebrow, title: COPY.proof.h2, intro: COPY.proof.intro, measure: '860' }), '      ')}
      <div class="rv">
${indent(ev.tabs({ ns: 'pptx-proof', label: 'Where the text was in the test presentation',
    items: PAIRS.map((p, i) => ({ tab: COPY.proof.tabs[i][0], panel: proofPanel(p, i) })) }), '        ')}
      </div>

      <p class="rv mt-6 sm:mt-8 flex items-start gap-3 max-w-[880px] ${BODY} text-ink-700">
        <span class="mt-0.5 shrink-0 text-ink-500">${ico(I.info, 'currentColor', 16)}</span>
        <span>${COPY.proof.caveat}</span>
      </p>
      <p data-prototype-note class="rv mt-2.5 pl-7 max-w-[880px] text-[12px] sm:text-[12.5px] leading-relaxed text-orange-700">${PROTOTYPE_NOTE}</p>

      <div class="rv mt-7 sm:mt-8">
${indent(action.button({ label: COPY.proof.cta, href: ANCHOR }), '        ')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · THE REPORT ═══════════════ */
const section4 = () => `  <!-- ================= 04 · EXPLORE THE SIMILARITY REPORT =================
       The library's report showcase with the sitewide sample report (build/report.js) —
       the page's one dark act. It is the static sample, not the result of the PPTX test
       above, and it does not answer to the switches in the hero. -->
${reportShowcase.section({
  id: 'powerpoint-report', surface: 'dark', space: 'md', accent: 'teal',
  head: { eyebrow: COPY.report.eyebrow, title: COPY.report.h2, intro: COPY.report.intro, measure: '760', introMeasure: '72' },
  foot: { points: COPY.report.points, callout: COPY.report.callout },
})}`;

/* ═══════════════ 05 · THREE STEPS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · HOW TO CHECK A POWERPOINT =================
       The library's stepper (build/sections/steps.js): three real steps, the button back
       to the one form. -->
${steps.section({
    id: 'how-to-check-a-powerpoint', layout: 'cards', marker: 'icon', bg: 'white', space: 'md', accent: 'teal',
    head: { eyebrow: COPY.how.eyebrow, title: COPY.how.h2, intro: COPY.how.intro },
    cols: 3, link: 'line',
    items: COPY.how.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'orange', 'ink'][i], icon: [I.upload, I.search, I.report][i] })),
    foot: { action: { label: COPY.how.cta, href: ANCHOR } },
  })}`;

/* ═══════════════ 06 · INTERPRETATION ═══════════════ */
const section6 = () => `  <!-- ================= 06 · UNDERSTAND YOUR RESULTS =================
       Two restrained notices as the two halves of one card (the Turnitin page's split
       card): no graph, no percentage, no guarantee. -->
  <section id="what-results-mean" data-component="split-card" data-bg="cool" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="${WRAP}">
${indent(sh.block({ eyebrow: COPY.meaning.eyebrow, title: COPY.meaning.h2 }), '      ')}
      <div class="rv rounded-3xl sm:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="rounded-[18px] sm:rounded-3xl bg-white shadow-inner-hl overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-100">
${COPY.meaning.notices.map(([title, text], i) => `          <div class="p-5 sm:p-6 lg:p-8">
            ${tile.render({ tone: ['teal', 'orange'][i], icon: [I.quote, I.sparkles][i] })}
            <h3 class="mt-4 sm:mt-5 text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight">${title}</h3>
            <p class="mt-2 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${text}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · PRIVACY AND DOCUMENT HANDLING ═══════════════ */
const section7 = () => `  <!-- ================= 07 · YOUR DOCUMENT, YOUR REPORT, STORAGE =================
       The library's rail: three stations, each with its approved sentences whole, and the
       Privacy Policy. Nothing says a file is deleted at once or never stored. -->
${steps.section({
    id: 'your-powerpoint', layout: 'rail', marker: 'icon', bg: 'white', space: 'md',
    head: { eyebrow: COPY.handling.eyebrow, title: COPY.handling.h2, intro: COPY.handling.intro },
    cols: 3,
    items: COPY.handling.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'orange', 'ink'][i], icon: [I.file, I.report, I.archive][i] })),
    foot: { action: { label: COPY.handling.cta, href: COPY.handling.ctaHref, tone: 'light' } },
  })}`;

/* ═══════════════ 08 · PRICING ═══════════════ */
const section8 = () => `  <!-- ================= 08 · PRICING AND FREE CHECK =================
       The full shared pricing module, as the homepage carries it: the four billing
       periods, the "Recurring payments" switch and three plan cards, every figure from
       build/pricing-data.js through build/pricing.js. No price is typed here. -->
${pricingPreview.section({
  id: 'pricing', layout: 'center', space: 'md',
  head: { eyebrow: COPY.pricing.eyebrow, title: COPY.pricing.h2, intro: COPY.pricing.intro },
  recurring: COPY.pricing.recurring,
  plans: { href: COPY.pricing.ctaHref },
  foot: { link: { label: COPY.pricing.cta, href: COPY.pricing.ctaHref } },
})}`;

/* ═══════════════ 09 · TRUST STRIP + FAQ ═══════════════ */
const section9 = () => `  <!-- ================= 09 · TRUST STRIP =================
       Compact platform proof: the two review platforms' own marks, each a link to
       PlagiarismSearch's page there. No rating, no review count, no quotation — nothing
       that goes stale, and nothing passed off as praise for the PowerPoint checker. -->
  <section id="reviews" data-component="trust-strip" class="relative py-10 sm:py-12 lg:py-14 bg-white border-b border-ink-100">
    <div class="${WRAP}">
      <div class="rv grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 lg:gap-12 items-center">
        <div class="min-w-0">
          <h2 class="text-[clamp(1.35rem,2.2vw,1.85rem)] font-extrabold tracking-tightest leading-[1.15]">${COPY.trust.h2}</h2>
          <p class="mt-3 ${BODY} text-ink-600 max-w-[60ch]">${COPY.trust.intro}</p>
        </div>
        <ul class="grid grid-cols-2 gap-3 sm:gap-4">
${PLATFORMS.map(p => `          <li><a href="${p.url}" target="_blank" rel="nofollow noopener noreferrer" aria-label="PlagiarismSearch reviews on ${p.name} (opens in a new tab)" class="group flex items-center justify-center gap-2 h-[72px] sm:h-[88px] rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 hover:ring-black/15 shadow-diffuse px-4 transition-shadow duration-300"><img src="${p.img}" alt="${p.name}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" class="${p.cls} w-auto max-w-full"><span class="text-ink-400 group-hover:text-ink-700 transition-colors duration-300">${ico(I.ext, 'currentColor', 13)}</span></a></li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>

  <!-- ================= 09 · POWERPOINT FAQ =================
       Seven PowerPoint questions, every answer in the HTML (the library's accordion). -->
${faq.section({
  id: 'powerpoint-faq', ns: 'powerpoint-faq', bg: 'tint', space: 'md', layout: 'fluid',
  head: { title: COPY.faq.h2 },
  items: COPY.faq.items.map(([q, a]) => ({ q, a })),
})}`;

/* ═══════════════ 10 · FINAL CTA ═══════════════ */
const section10 = () => `  <!-- ================= 10 · FINAL CTA =================
       The closing band (build/sections/cta-band.js): one action, back to the hero's
       form — not a second form. -->
${cta.section({
  id: 'powerpoint-cta',
  eyebrow: COPY.close.eyebrow,
  title: COPY.close.h2, ring: 'PowerPoint',
  lead: COPY.close.body, measure: '58',
  actions: { layout: 'stack', button: { label: COPY.close.primary, href: ANCHOR }, hint: COPY.close.micro },
})}`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js). The components' CSS and JS live in
   build/assets/ (site.css, site.js); the page carries none of its own.
   ───────────────────────────────────────────────────────────────────────────── */
const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10];

module.exports = { COPY, PAIRS, NOTES, PLATFORMS, INTERNAL, PROTOTYPE_NOTE, ANCHOR, PROOF, OUT };
if (require.main !== module) return;

const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
