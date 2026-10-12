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
   the report excerpts carry test markings, so no screenshot of them is on the page or in
   the repository: the proof is drawn from them (see "THE TEST'S EVIDENCE, DRAWN" below),
   reviewed and approved by the owner on 2026-10-12. The page never prints the test's
   own figures (its percentage, its word and source counts) or claims OCR, a per-slide
   score or an accuracy.

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
    /* the owner's wording (review of 2026-10-12): this report is the sitewide sample, not
       the report of the PPTX test */
    caveat: 'Illustrative PlagiarismSearch report example. The controlled PowerPoint test results are shown in the section above.',
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
   THE TEST'S EVIDENCE, DRAWN (Olex, 2026-10-12). The proof is one controlled PPTX and the
   report it produced: slide A → excerpt R-A (text box), B → R-B (table), C → R-C (shape),
   D → R-D (speaker notes). A raw screenshot sat badly in a card — no room at its sides,
   two different shapes side by side — so each pair is drawn in the site's own manner: the
   slide as a slide, the report excerpt as a sheet of extracted text. The screenshots were
   shown beside the drawings for one review round; Olex kept the drawings, and the
   screenshots (internal test material, never in the repository) left the page.
   The manner is ours; the content is the test's:
   · a slide keeps its own title, its own element (text box, table, shape, notes) and the
     passage it held, word for word;
   · a report excerpt keeps the lines the real report shows for that slide, in its order,
     with the real category on each (Plagiarism / Similarities) and the real source
     numbers on each marker.
   Left out, on both sides alike: the test deck's QA chrome (its header and footer lines,
   the "TEST A" badge, the QA subtitle) — and nothing is added. No figure of the test.
   The owner reviewed the drawings on 2026-10-12 and approved them; the review badges and
   the prototype note that stood on them have left the page.
   ───────────────────────────────────────────────────────────────────────────── */
const DECK = 'PlagiarismSearch_PowerPoint_Extraction_Test_2026.pptx';
const TXT = {
  dickens: 'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way—in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.',
  decl: ['When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature\'s God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.',
    'We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.'],
  alice: ['Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do:',
    'once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, \'and what is the use of a book,\' thought Alice \'without pictures or conversation?\' So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.'],
  lincoln: ['Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.',
    'Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure.',
    'We are met on a great battle-field of that war.'],
};
/* a report line: { plain } as extracted, unmarked · { mark: 'plag' | 'sim', text, src } — a
   highlighted run, src: the source numbers on the marker that opens it (the report's own) */
const REDRAW = [
  { slide: { no: '2', tag: 'Text box', title: 'Native text box', el: 'textbox', label: 'Source excerpt / Charles Dickens', text: TXT.dickens },
    report: [{ plain: 'Native text box' },
      { mark: 'plag', src: '8, 9, 10, 11, 27', text: 'SOURCE EXCERPT / CHARLES DICKENS' },
      { mark: 'plag', text: TXT.dickens }] },
  { slide: { no: '3', tag: 'Table', title: 'Native PowerPoint table', el: 'table', heads: ['Probe', 'Source text in a native table cell'], row: 'Declaration of Independence', text: TXT.decl.join(' ') },
    report: [{ plain: 'Native PowerPoint table' },
      { mark: 'sim', src: '13, 18, 19, 20, 21, 22, 23, 24, 25', text: 'PROBE   SOURCE TEXT IN A NATIVE TABLE CELL' },
      { mark: 'sim', text: 'Declaration of Independence' },
      { mark: 'sim', text: TXT.decl[0], join: true },
      { mark: 'plag', src: '1, 13, 28, 29, 30, 31, 32, 33, 47, 48, 49', text: TXT.decl[1] }] },
  { slide: { no: '4', tag: 'Shape', title: 'Editable shape text', el: 'shape', label: 'Source excerpt / Lewis Carroll', text: TXT.alice.join(' ') },
    report: [{ plain: 'Editable shape text' },
      { mark: 'sim', src: '12, 60, 61', text: 'SOURCE EXCERPT / LEWIS CARROLL' },
      { mark: 'sim', text: TXT.alice[0], join: true },
      { mark: 'plag', src: '12, 14, 15, 16, 17, 26, 37', text: TXT.alice[1] }] },
  { slide: { no: '5', tag: 'Speaker notes', title: 'Speaker notes only', el: 'notes', line: 'This slide has no source passage on the canvas. The text is in PowerPoint speaker notes.', notes: TXT.lincoln.join(' ') + ' …' },
    report: [{ plain: 'Speaker notes only' },
      { plain: 'This slide has no source passage on the canvas. The text is in PowerPoint speaker notes.' },
      { mark: 'plag', src: '1, 2, 3, 4, 5, 6, 7, 35, 46', text: TXT.lincoln[0], join: true },
      { mark: 'plag', src: '1, 2, 3, 4, 5, 6, 7, 44, 45', text: TXT.lincoln[1], join: true },
      { mark: 'plag', src: '1, 2, 3, 4, 5, 62', text: TXT.lincoln[2] }] },
];
const KIND = { plag: 'Plagiarism', sim: 'Similarities' };

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
/* ── the redrawn pair ────────────────────────────────────────────────────────── */
const PASSAGE = 'text-[12.5px] sm:text-[13.5px] leading-[1.7] text-ink-800';
const SLIDE_LABEL = 'text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700';
const slideEl = s => {
  if (s.el === 'textbox') return `<div class="rounded-xl sm:rounded-2xl bg-white ring-1 ring-ink-200 shadow-diffuse p-4 sm:p-5">
  <p class="${SLIDE_LABEL} mb-2.5">${s.label}</p>
  <p class="${PASSAGE}">${s.text}</p>
</div>`;
  if (s.el === 'shape') return `<div class="rounded-[22px] sm:rounded-[28px] bg-teal-50 ring-1 ring-teal-200 px-5 py-5 sm:px-7 sm:py-6">
  <p class="${SLIDE_LABEL} mb-2.5 text-center">${s.label}</p>
  <p class="${PASSAGE}">${s.text}</p>
</div>`;
  /* a real table. Under 640px two columns would leave the passage a ribbon one word
     wide, so the row stacks — each cell under its own column's name (data-label) — and
     the explicit roles keep it a table for assistive tech once it is display:block */
  const CELL_LABEL = 'before:content-[attr(data-label)] before:block sm:before:hidden before:mb-1.5 before:text-[9.5px] before:font-bold before:uppercase before:tracking-[0.14em] before:text-teal-700';
  if (s.el === 'table') return `<table role="table" class="block sm:table w-full border-separate border-spacing-0 rounded-xl sm:rounded-2xl ring-1 ring-ink-200 overflow-hidden text-left">
  <thead role="rowgroup" class="sr-only sm:not-sr-only sm:table-header-group">
    <tr role="row" class="bg-ink-50">
      <th scope="col" role="columnheader" class="${SLIDE_LABEL} px-4 py-2.5 w-[30%] align-top">${s.heads[0]}</th>
      <th scope="col" role="columnheader" class="${SLIDE_LABEL} px-4 py-2.5 border-l border-ink-200 align-top">${s.heads[1]}</th>
    </tr>
  </thead>
  <tbody role="rowgroup" class="block sm:table-row-group">
    <tr role="row" class="block sm:table-row">
      <th scope="row" role="rowheader" data-label="${s.heads[0]}" class="block sm:table-cell ${CELL_LABEL} bg-teal-50 px-4 py-3.5 align-top text-[13.5px] sm:text-[14px] font-bold tracking-tight text-ink-900 sm:border-t border-ink-200">${s.row}</th>
      <td role="cell" data-label="${s.heads[1]}" class="block sm:table-cell ${CELL_LABEL} px-4 py-3.5 align-top border-t sm:border-l border-ink-200 ${PASSAGE}">${s.text}</td>
    </tr>
  </tbody>
</table>`;
  return `<p class="${PASSAGE} text-ink-600">${s.line}</p>`;
};
const redrawnSlide = s => `<figure class="h-full min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-3 sm:p-4 flex flex-col">
  <figcaption class="flex items-center justify-between gap-3 px-1 pb-3">
    <span class="${LABEL} text-ink-600">${COPY.proof.captions[0]}</span>
  </figcaption>
  <div class="flex-1 flex flex-col justify-center gap-3 rounded-xl sm:rounded-2xl bg-ink-50 p-3.5 sm:p-5 lg:p-6">
    <div class="rounded-xl sm:rounded-2xl bg-white ring-1 ring-black/10 shadow-diffuse overflow-hidden">
      <span class="block h-1.5 bg-teal-500" aria-hidden="true"></span>
      <div class="p-4 sm:p-5 lg:p-6">
        <div class="flex items-center justify-between gap-3 mb-3">
          <span class="text-[10.5px] sm:text-[11px] font-semibold text-ink-500 tabular-nums">Slide ${s.no} of 7</span>
          <span class="rounded-md bg-teal-50 ring-1 ring-teal-200 px-2 py-0.5 text-[10.5px] sm:text-[11px] font-bold text-teal-800">${s.tag}</span>
        </div>
        <p class="text-[17px] sm:text-[19px] lg:text-[21px] font-extrabold tracking-tight leading-tight text-ink-900 mb-3.5 sm:mb-4">${s.title}</p>
${indent(slideEl(s), '        ')}
      </div>
    </div>${s.el === 'notes' ? `
    <div class="rounded-xl sm:rounded-2xl bg-teal-50 ring-1 ring-teal-200 p-4 sm:p-5">
      <p class="${SLIDE_LABEL} mb-2">Notes pane · not on the slide</p>
      <p class="${PASSAGE}">${s.notes}</p>
    </div>` : ''}
  </div>
</figure>`;
/* a highlighted run: the category is said by the colour, by the line under it (solid for
   Plagiarism, dashed for Similarities) and by the legend — never by colour alone */
const MARK = { plag: 'bg-orange-100 border-b-2 border-orange-400', sim: 'bg-yellow-100 border-b-2 border-dashed border-yellow-500' };
const srcChip = n => `<span class="inline-flex items-center align-[1px] mr-1.5 rounded-full bg-orange-500 px-1.5 py-px text-[9.5px] leading-[1.5] font-bold text-white tabular-nums"><span class="sr-only">Sources </span>${n}</span>`;
const reportLines = lines => {
  /* consecutive runs marked join: true are one paragraph, as the report sets them */
  const paras = []; let open = null;
  for (const l of lines) {
    const html = l.plain !== undefined ? l.plain
      : `${l.src ? srcChip(l.src) : ''}<mark data-kind="${l.mark}" class="${MARK[l.mark]} text-ink-900 px-0.5 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">${l.text}</mark>`;
    if (open) { open.push(html); if (!l.join) { paras.push(open.join(' ')); open = null; } }
    else if (l.join) open = [html];
    else paras.push(html);
  }
  return paras.map(p => `<p>${p}</p>`).join('\n');
};
const redrawnReport = r => {
  const kinds = [...new Set(r.filter(l => l.mark).map(l => l.mark))];
  return `<figure class="h-full min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-3 sm:p-4 flex flex-col">
  <figcaption class="flex items-center justify-between gap-3 px-1 pb-3">
    <span class="${LABEL} text-ink-600">${COPY.proof.captions[1]}</span>
  </figcaption>
  <div class="flex-1 min-w-0 flex flex-col rounded-xl sm:rounded-2xl bg-ink-50 p-3.5 sm:p-5 lg:p-6">
    <div class="flex-1 min-w-0 flex flex-col rounded-xl sm:rounded-2xl bg-white ring-1 ring-black/10 shadow-diffuse overflow-hidden">
      <p class="flex items-center gap-2.5 px-4 sm:px-5 lg:px-6 py-3 border-b border-ink-100 text-[11.5px] sm:text-[12px] font-semibold text-ink-700"><span class="shrink-0 text-ink-400">${ico(I.file, 'currentColor', 15)}</span><span class="min-w-0 truncate">${DECK}</span></p>
      <div class="flex-1 px-4 sm:px-5 lg:px-6 py-4 sm:py-5 space-y-3 text-[12.5px] sm:text-[13.5px] leading-[1.9] text-ink-700">
${indent(reportLines(r), '        ')}
      </div>
      <ul class="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 sm:px-5 lg:px-6 py-3 border-t border-ink-100 text-[11px] sm:text-[11.5px] font-semibold text-ink-500">
${kinds.map(k => `        <li class="inline-flex items-center gap-2"><span class="inline-block w-5 h-2.5 ${MARK[k]}" aria-hidden="true"></span>${KIND[k]}</li>`).join('\n')}
      </ul>
    </div>
  </div>
</figure>`;
};

/* a tab's panel: the description, then the pair */
const proofPanel = (r, i) => `<div data-proof-panel>
  <p class="text-[15px] sm:text-[16px] lg:text-[17px] font-semibold tracking-tight leading-snug text-ink-900 max-w-[70ch] mb-5 sm:mb-6">${COPY.proof.tabs[i][1]}</p>
  <div class="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
${indent(redrawnSlide(r.slide), '    ')}
${indent(redrawnReport(r.report), '    ')}
  </div>
</div>`;

const section3 = () => `  <!-- ================= 03 · A REAL POWERPOINT CHECK / NEW MODULE B — FROM PPTX TO REPORT EVIDENCE =================
       One controlled PPTX, four tabs, and in each the source slide on the left and, on the
       right, the excerpt of the real report that came from that slide and no other:
       text box, table, shape, speaker notes. The notes tab also prints the notes
       themselves, because the slide does not show them. A tab changes the evidence shown
       (build/evidence.js) — it runs no check and is not wired to the form above. Light and
       restrained on purpose: the dark report act follows. Both sides are drawn from the
       test (its passages word for word, the report's own categories and source numbers)
       — no screenshot, and no figure of the test, is on the page. The caveat under the tabs
       says where the examples come from. -->
  <section id="${PROOF.slice(1)}" data-component="pptx-proof" data-bg="cool" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="${WRAP}">
${indent(sh.block({ eyebrow: COPY.proof.eyebrow, title: COPY.proof.h2, intro: COPY.proof.intro, measure: '860' }), '      ')}
      <div class="rv">
${indent(ev.tabs({ ns: 'pptx-proof', label: 'Where the text was in the test presentation',
    items: REDRAW.map((r, i) => ({ tab: COPY.proof.tabs[i][0], panel: proofPanel(r, i) })) }), '        ')}
      </div>

      <p class="rv mt-6 sm:mt-8 flex items-start gap-3 max-w-[880px] ${BODY} text-ink-700">
        <span class="mt-0.5 shrink-0 text-ink-500">${ico(I.info, 'currentColor', 16)}</span>
        <span>${COPY.proof.caveat}</span>
      </p>
      <div class="rv mt-7 sm:mt-8">
${indent(action.button({ label: COPY.proof.cta, href: ANCHOR }), '        ')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · THE REPORT ═══════════════ */
const section4 = () => `  <!-- ================= 04 · EXPLORE THE SIMILARITY REPORT =================
       The library's report showcase with the sitewide sample report (build/report.js) —
       the page's one dark act. It is the static sample, not the result of the PPTX test
       above, and it does not answer to the switches in the hero; the footnote under it says
       so in the owner's words (the library's caveat line). -->
${reportShowcase.section({
  id: 'powerpoint-report', surface: 'dark', space: 'md', accent: 'teal',
  head: { eyebrow: COPY.report.eyebrow, title: COPY.report.h2, intro: COPY.report.intro, measure: '760', introMeasure: '72' },
  foot: { points: COPY.report.points, callout: COPY.report.callout, caveat: { text: COPY.report.caveat, icon: I.info } },
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
  plans: { href: 'payment.html' },
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

module.exports = { COPY, PLATFORMS, REDRAW, TXT, DECK, ANCHOR, PROOF, OUT };
if (require.main !== module) return;

const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
