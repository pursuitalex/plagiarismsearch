/* Generate site/pdf-plagiarism-checker.html — the PDF Plagiarism Checker to the
   2026-09-15 brief. It replaces a stub, so no -v2 and no version switcher.

   PROTECT-FIRST. This URL is a working organic asset — the brief's own words are "do not
   trade a working SEO asset for novelty" — so the title, the route, the checker-first
   shape and the H1 stay what they are. What changes is truth and clarity: the legacy
   "100% unique / never stored / scans all visible text / quick results" claims go, and
   the one thing only this page can teach comes in: what text a PDF actually gives the
   checker. Text layer, scan-only, mixed — and no OCR, drawn so a scanned page is visibly
   an image and never a source of text.

   Same components as the homepage and the Students page — build/checker.js,
   build/report.js, build/sections/cta-band.js — in a format-specific story: the form is the hero's
   object and sits first; the how-to is three real steps; the extraction act is the
   signature; sources are shown as the dimension the file format does not decide.

   Run:  node build/pdf.js  →  node build/shell.js  →  node build/check-pdf.js

   On the shared production assets (build/assets.js, build/page.js) since 2026-09-25:
   no Play CDN, no <style> or <script> of its own. Hooks are data-*, decorative styles are
   classes, asset paths are root-relative. Parity: node build/parity/run.js pdf-plagiarism-checker.html
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const faq = require('./sections/faq');   /* the FAQ: one library template */

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'pdf-plagiarism-checker.html';
const cta = require('./sections/cta-band');
const hero = require('./sections/hero');   /* the hero: one library template; it renders the form (build/checker.js) in its sealed slot */
const steps = require('./sections/steps');   /* the numbered sequences: one library template */
const cards = require('./sections/feature-cards');   /* the feature cards: one library template */
const sources = require('./sections/sources');   /* sources & scan settings: one library template */
const startFree = require('./sections/start-free');   /* the free entry: one library template */
const reportShowcase = require('./sections/report-showcase');

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — PDF brief, 2026-09-15. Verbatim.

   Destinations (URLS.md): /prices → prices.html, /policy → policy.html. The
   "Using a scanned PDF?" link lands on the on-page extraction act, as required.
   ───────────────────────────────────────────────────────────────────────────── */
const ANCHOR = '#pdf-checker';

const COPY = {
  /* KEEP at launch — the brief forbids "optimising" it */
  title: 'PDF Plagiarism Checker – Scan Your PDFs for Plagiarism',
  meta: 'Upload a PDF directly and check its extractable text for matching sources. Review highlighted matches and source evidence in a clear plagiarism report.',
  canonical: 'https://plagiarismsearch.com/pdf-plagiarism-checker',

  hero: {
    h1: 'PDF Plagiarism Checker',
    support: 'Upload a PDF directly — no copying or file conversion required. PlagiarismSearch checks the extractable text in your PDF against the sources enabled for the check and shows matching passages and sources in a clear report.',
    placeholder: 'Paste or type your text here',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
    helper: 'File size limit: 2 MB for guests and 24 MB when signed in. Upload up to 10 files at once.',
    /* the three production limits the helper states, as figures beside it */
    limits: [['2 MB', 'for guests'], ['24 MB', 'when signed in'], ['10 files', 'at once']],
    scanned: 'Using a scanned PDF?', scannedHref: '#pdf-text-extraction',
  },

  howto: {
    eyebrow: 'How It Works',
    h2: 'How to check a PDF for plagiarism',
    intro: 'You can upload a PDF directly without converting it to another format. The checker extracts the machine-readable text in the file, runs the plagiarism search using your selected settings, and returns the matches and sources found for review.',
    steps: [
      ['Upload your PDF', 'Drag and drop the PDF or select it from your device. You can upload up to 10 files at once. The upload size limit is 2 MB for guests and 24 MB when signed in.'],
      ['Choose your plagiarism settings', 'Select the source collections and exclusions that fit your check. Available options can include web search, academic database search, storage sources, reference exclusion, and in-text citation exclusion.'],
      ['Review the matches and sources', 'Open the completed report to inspect matching or similar passages and the sources found for them. Review each result in context before deciding whether the text needs attention.'],
    ],
  },

  extraction: {
    eyebrow: 'PDF Text Extraction',
    h2: 'What text can be checked in a PDF?',
    intro: 'A PDF can contain machine-readable text, page images, or a combination of both. PlagiarismSearch checks the text that can be extracted from the PDF file; it does not perform OCR on text that exists only inside images.',
    states: [
      ['Text-based PDF', 'Text stored in the PDF’s text layer can be extracted and submitted for plagiarism checking.'],
      ['Scan-only PDF', 'If the PDF contains only scanned page images and no text layer, PlagiarismSearch cannot read the visible words with OCR. The file will not provide text for the plagiarism check.'],
      ['Mixed PDF', 'If a PDF contains both extractable text and image-only pages, PlagiarismSearch checks the extractable text. Text that exists only inside scanned images is not analyzed.'],
    ],
    note: 'If you need to check a scan-only document, create a searchable PDF with a text layer before uploading it.',
    /* the confirmed test states the drawings are allowed to show — the checker's own
       message for a scan-only file, and the page pattern of the mixed test */
    noText: 'No text found in the file',
    noWords: '0 Words',
    mixedPages: [true, false, true, false, true],
  },

  report: {
    eyebrow: 'Plagiarism Report',
    h2: 'Review matches and sources from your PDF',
    intro: 'The report highlights matching or similar passages extracted from your document and lists the sources found for them. Select a match to review the corresponding source and inspect the result in context.',
    steps: [
      ['Matched passages', 'See which extracted passages matched or closely resembled text found in the selected sources.'],
      ['Source evidence', 'Review the sources connected to each reported match.'],
      ['Interactive review', 'Select a match to focus on the relevant source and examine the result before deciding what it means.'],
    ],
    callout: 'A match is evidence for review, not an automatic plagiarism verdict.',
  },

  sources: {
    eyebrow: 'Sources &amp; Settings',
    h2: 'Choose what your PDF is checked against',
    intro: 'PDF is the input format. The sources searched during a plagiarism check are determined by the settings you choose, not by the PDF file extension.',
    items: [
      ['Web search', 'Search available web sources for matching or similar text.'],
      ['Academic database', 'Enable academic database search when you want to compare the document with indexed academic material. PlagiarismSearch provides access to over 500 million indexed academic texts when academic database search is enabled.'],
      ['References and citations', 'Exclude references or in-text citations when those exclusions fit the document and the purpose of your review.'],
      ['Storage sources', 'Personal or organization storage can also be used as comparison sources when they are available for the account and enabled for the check.'],
    ],
  },

  handling: {
    eyebrow: 'PDF &amp; Report Handling',
    h2: 'Know what happens to your uploaded PDF',
    intro: 'Your PDF is processed to perform the checks you select. The uploaded source document and the generated report have different retention behavior.',
    items: [
      ['Uploaded PDF', 'The uploaded source document is not retained as a stored source document.'],
      ['Report', 'A generated report may remain available in your account for convenient access.'],
      ['Your control', 'You can permanently delete reports from your account.'],
      ['Storage', 'Adding content to Storage is a separate action you control. Running a plagiarism check does not automatically add the PDF to Storage.'],
    ],
    cta: 'Read the Privacy Policy', ctaHref: 'policy.html',
  },

  free: {
    eyebrow: 'Start Free',
    h2: 'Start with a free PDF check',
    p1: 'You can check up to 150 plagiarism words without registering. Registered users receive 300 plagiarism words per day.',
    p2: 'If you need to check more text, view the current plagiarism plans and choose the option that fits your usage.',
    primary: 'Check my PDF',
    secondary: 'View pricing', secondaryHref: 'prices.html',
    micro: 'One-time purchased plagiarism quota does not expire.',
  },

  faq: {
    h2: 'PDF Plagiarism Checker FAQ',
    items: [
      ['Can I upload a PDF directly for plagiarism checking?', 'Yes. You can upload a PDF directly without converting it to DOCX or copying the text manually. PlagiarismSearch extracts the machine-readable text available in the PDF and uses it for the check.'],
      ['Does PlagiarismSearch read scanned PDF files?', 'PlagiarismSearch does not perform OCR on image-only scans. If the visible text exists only inside scanned page images and the PDF has no text layer, that text cannot be submitted for plagiarism checking.'],
      ['What happens if my PDF contains both text and scanned pages?', 'The checker analyzes the text that can be extracted from the PDF. If some pages contain only scanned images, the text inside those images is not analyzed.'],
      ['Does the checker analyze every visible word in a PDF?', 'It analyzes extractable text, not every visually displayed element. Text that appears only inside an image or scan is not read with OCR.'],
      ['How large can my PDF file be?', 'The upload size limit is 2 MB for guests and 24 MB for signed-in users.'],
      ['Can I upload more than one PDF?', 'Yes. You can upload up to 10 files at once.'],
      ['What sources can my PDF be checked against?', 'Depending on the settings and account access, a plagiarism check can use web sources, academic databases, personal storage, or organization storage. Reference and in-text citation exclusions are also available.'],
      ['Is my uploaded PDF stored?', 'The uploaded source document is not retained as a stored source document. A generated report may remain available in your account for convenience and can be permanently deleted. Adding content to Storage is a separate action.'],
      ['How much can I check for free?', 'You can check up to 150 plagiarism words without registering. Registered users receive 300 plagiarism words per day.'],
    ],
  },

  close: {
    h2: 'Check your PDF for plagiarism',
    support: 'Upload your PDF and review matching passages and sources without converting the document to another format.',
    primary: 'Upload a PDF',
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
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  book:     '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  quote:    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  archive:  '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>',
  image:    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  text:     '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
  alert:    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
};

/* a tick line */
const tick = (head, body) => `            <li class="flex items-start gap-3 py-3">
              <svg class="shrink-0 mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              <span class="min-w-0">
                <span class="block text-[14.5px] sm:text-[15px] font-bold tracking-tight text-ink-900">${head}</span>
                <span class="block text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600 mt-0.5">${body}</span>
              </span>
            </li>`;

/* ── the drawn PDF pages of the extraction act ──────────────────────────────
   A page is a small white sheet. A text page carries lines; an image-only page carries
   one grey plate with a picture glyph and nothing that could be read as text. The two
   are told apart by the drawing AND by the label under it — never by colour alone. */
const textLines = (n = 6) => `<span class="block space-y-1.5" aria-hidden="true">${Array.from({ length: n }, (_, i) =>
  `<span class="block h-1.5 rounded-full ${i % 3 === 1 ? 'bg-orange-300/80' : 'bg-ink-300'} w-[${[92, 78, 88, 64, 84, 72][i % 6]}%]"></span>`).join('')}</span>`;
const imagePlate = () => `<span class="flex items-center justify-center h-full min-h-[60px] rounded-md bg-ink-200/80" aria-hidden="true">${ico(I.image, '#6B7280', 18)}</span>`;
const sheet = (inner, extra = '') => `<span class="block rounded-lg bg-white ring-1 ring-black/10 shadow-diffuse p-3 ${extra}">${inner}</span>`;

/* ═══════════════ 01 · HERO — THE REAL PDF CHECKER ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / REAL PDF CHECKER =================
       The same form the homepage and Students render (build/checker.js), on the right.
       The H1 and its support take the left column, with the three production limits as
       figures under the approved helper sentence and the scanned-PDF link straight to
       the extraction act. (The form sat on the left at first; Olex swapped the columns
       on 2026-09-17 so the page opens on its name, like the other checker heroes.)
       The hero is the library's (build/sections/hero.js), layout "split-aside": three
       blocks, not two columns — DOM order is H1 → form → limits, which is what a phone
       shows, so the checker is on the first screen there too; at lg the form takes the
       right column across both rows and the other two stack on the left. -->
${hero.section({
    id: ANCHOR.slice(1), layout: 'split-aside',
    title: COPY.hero.h1, pen: 'PDF',
    lead: COPY.hero.support,
    checker: { copy: COPY.hero, textId: 'pdf-checker-text' },
    /* the upload limits: the approved sentence, and its three figures */
    aside: { facts: { items: COPY.hero.limits, note: COPY.hero.helper,
      link: { label: COPY.hero.scanned, href: COPY.hero.scannedHref, icon: I.image } } },
  })}`;

/* ═══════════════ 02 · HOW TO CHECK A PDF ═══════════════ */
const section2 = () => `  <!-- ================= 02 · HOW TO CHECK A PDF FOR PLAGIARISM =================
       The natural how-to heading the brief asks for, as three real product steps on one
       line, each with the object it is about. A connector starts at a card's right edge
       and is exactly as long as the grid gap (gap-5 / lg:gap-6), so it sits between
       the cards and never runs into one. -->
${steps.section({
    id: 'how-to-check-a-pdf', layout: 'cards', marker: 'icon', bg: 'white', space: 'md', accent: 'teal',
    head: { eyebrow: COPY.howto.eyebrow, title: COPY.howto.h2, intro: COPY.howto.intro },
    cols: 3, link: 'line',
    items: COPY.howto.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'orange', 'ink'][i], icon: [I.upload, I.sliders, I.report][i] })),
  })}`;

/* ═══════════════ 03 · PDF TEXT EXTRACTION — THE SIGNATURE ═══════════════ */
const section3 = () => `  <!-- ================= 03 · PDF TEXT EXTRACTION =================
       The one thing only this page can teach. Three document states, each drawn: a
       text-based PDF is a sheet of lines, a scan-only PDF is a sheet holding one image
       plate — and the checker's real message for it, "No text found in the file · 0
       Words" — and a mixed PDF is the confirmed five-page test, text on 1/3/5, image
       on 2/4, with only the text pages marked as checked. Nothing suggests an image
       yields words. The state is in the drawing AND in the label. -->
  <section id="pdf-text-extraction" data-component="pdf-extraction" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.extraction.eyebrow)}
        <h2 class="${H2}">${COPY.extraction.h2}</h2>
        <p class="${INTRO}">${COPY.extraction.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        <!-- text-based -->
        <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-7 flex flex-col">
            <div class="rounded-2xl bg-ink-50 p-4 sm:p-5 mb-5">
              <div class="max-w-[150px] mx-auto">${sheet(textLines(6))}</div>
              <p class="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-mint-700"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Text layer · extracted</p>
            </div>
            <h3 class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-2">${COPY.extraction.states[0][0]}</h3>
            <p class="${BODY} text-ink-600">${COPY.extraction.states[0][1]}</p>
          </div>
        </div>

        <!-- scan-only -->
        <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-7 flex flex-col">
            <div class="rounded-2xl bg-ink-50 p-4 sm:p-5 mb-5">
              <div class="max-w-[150px] mx-auto">${sheet(imagePlate(), 'h-[96px]')}</div>
              <p class="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-orange-700">${ico(I.alert, 'currentColor', 13)}${COPY.extraction.noText} · ${COPY.extraction.noWords}</p>
            </div>
            <h3 class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-2">${COPY.extraction.states[1][0]}</h3>
            <p class="${BODY} text-ink-600">${COPY.extraction.states[1][1]}</p>
          </div>
        </div>

        <!-- mixed -->
        <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-7 flex flex-col">
            <div class="rounded-2xl bg-ink-50 p-4 sm:p-5 mb-5">
              <div class="grid grid-cols-5 gap-1.5" aria-hidden="true">
${COPY.extraction.mixedPages.map((isText, i) => `                ${sheet(isText ? textLines(4) : imagePlate(), 'min-h-[62px] ' + (isText ? 'ring-mint-500/40' : 'opacity-70'))}`).join('\n')}
              </div>
              <p class="mt-3 flex items-center justify-center gap-1.5 text-[11.5px] font-semibold text-ink-700"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1B7A50" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Pages 1, 3, 5 checked · pages 2, 4 image-only</p>
            </div>
            <h3 class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-2">${COPY.extraction.states[2][0]}</h3>
            <p class="${BODY} text-ink-600">${COPY.extraction.states[2][1]}</p>
          </div>
        </div>
      </div>

      <div class="rv mt-5 sm:mt-6 rounded-2xl sm:rounded-3xl bg-orange-50 ring-1 ring-orange-200 p-5 sm:p-6 flex items-start gap-4">
        ${chip('orange', I.info)}
        <p class="text-[14.5px] sm:text-[15px] leading-relaxed text-ink-900 font-semibold">${COPY.extraction.note}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · THE REPORT ═══════════════ */
const section4 = () => `  <!-- ================= 04 · THE PLAGIARISM REPORT =================
       The dark act: the approved report (build/report.js), the three reading points as
       one strip under it, the callout. No PDF-only fields, no verdict. -->
${reportShowcase.section({
  id: 'pdf-report', surface: 'dark', space: 'md', accent: 'teal',
  head: { eyebrow: COPY.report.eyebrow, title: COPY.report.h2, intro: COPY.report.intro, measure: '760', introMeasure: '72' },
  foot: { points: COPY.report.steps, callout: COPY.report.callout },
})}`;

/* ═══════════════ 05 · SOURCES & SETTINGS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · SOURCES & SETTINGS =================
       The point of the section drawn as its layout: the PDF is the input, on the left,
       one node; the sources are the settings, on the right, four of them. The file
       extension decides nothing about the right-hand side.
       The library's Sources (build/sections/sources.js), layout "flow": the input node
       is this page's drawing, sealed in the section's slot. -->
${sources.section({
    id: 'sources-and-settings', layout: 'flow', bg: 'white', space: 'lg', accent: 'teal',
    head: { eyebrow: COPY.sources.eyebrow, title: COPY.sources.h2, intro: COPY.sources.intro },
    media: `        <div data-surface="dark" class="rounded-3xl sm:rounded-4xl bg-ink-950 text-white p-6 sm:p-7 lg:p-8">
          <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-4">Input format</p>
          <div class="flex items-center gap-4">
            <span class="inline-flex w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.file, '#fff', 26)}</span>
            <div>
              <p class="text-[22px] sm:text-[24px] font-extrabold tracking-tightest leading-none">PDF</p>
              <p class="text-[12.5px] sm:text-[13px] text-white/60 mt-1.5">The extractable text goes in</p>
            </div>
          </div>
        </div>`,
    group: { label: 'Scan settings decide the sources', icon: I.sliders, tone: 'teal', items: COPY.sources.items },
  })}`;

/* ═══════════════ 06 · PDF & REPORT HANDLING ═══════════════ */
const section6 = () => `  <!-- ================= 06 · PDF & REPORT HANDLING =================
       Four facts, the two retention behaviours kept apart: the uploaded PDF and the
       report are two columns of one card; deletion and Storage follow. No absolutes. -->
${cards.section({
    id: 'pdf-handling', layout: 'grid', bg: 'cool', space: 'lg',
    head: { eyebrow: COPY.handling.eyebrow, title: COPY.handling.h2, intro: COPY.handling.intro },
    cols: 4,
    items: COPY.handling.items.map(([title, text], i) => ({ title, text, tone: ['ink', 'teal', 'orange', 'teal'][i], icon: [I.file, I.report, I.trash, I.archive][i], accent: i === 3 })),
    action: { label: COPY.handling.cta, href: COPY.handling.ctaHref, tone: 'light' },
  })}`;

/* ═══════════════ 07 · START FREE ═══════════════ */
const section7 = () => `  <!-- ================= 07 · START FREE — THE COMPACT PRICING PATH =================
       One band: the two confirmed limits inline, the two ways on, the one-time note. No
       matrix, no prices.
       The library's Start free (build/sections/start-free.js), layout "framed". -->
${startFree.section({
    id: 'start-free', layout: 'framed', space: 'lg',
    head: { eyebrow: COPY.free.eyebrow, title: COPY.free.h2, intro: [COPY.free.p1, COPY.free.p2] },
    button: { label: COPY.free.primary, href: ANCHOR },
    link: { label: COPY.free.secondary, href: COPY.free.secondaryHref },
    figures: [
      { value: '150', label: 'plagiarism words', sub: 'without registering' },
      { value: '300', label: 'plagiarism words per day', sub: 'for registered users' },
    ],
    note: { icon: I.info, text: COPY.free.micro },
  })}`;

/* ═══════════════ 08 · FAQ ═══════════════ */
const section8 = () => `  <!-- ================= 08 · FAQ =================
       Nine PDF-specific questions, full answers in the HTML. No timing promise. -->
${faq.section({
  id: 'pdf-faq', ns: 'pdf-faq', bg: 'tint', space: 'lg', layout: 'fluid',
  head: { eyebrow: 'Questions', title: COPY.faq.h2 },
  items: COPY.faq.items.map(([q, a]) => ({ q, a })),
})}`;

/* ═══════════════ 09 · FINAL CTA ═══════════════ */
const section9 = () => `  <!-- ================= 09 · FINAL CTA =================
       The closing band (build/sections/cta-band.js). One action, back to the one real checker. -->
${cta.section({
  id: 'pdf-cta',
  title: COPY.close.h2, ring: 'your PDF',
  lead: COPY.close.support,
  actions: { layout: 'stack', button: { label: COPY.close.primary, href: ANCHOR }, hint: COPY.close.micro },
})}`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js). The components' CSS and JS live in
   build/assets/ (site.css, site.js); the page carries none of its own.
   ───────────────────────────────────────────────────────────────────────────── */
const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9];

const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
