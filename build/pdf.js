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
   build/report.js, build/cta.js — in a format-specific story: the form is the hero's
   object and sits first; the how-to is three real steps; the extraction act is the
   signature; sources are shown as the dimension the file format does not decide.

   Run:  node build/pdf.js  →  node build/shell.js  →  node build/check-pdf.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'pdf-plagiarism-checker.html';
const cta = require('./cta');
const checker = require('./checker');
const { dots } = require('./dots');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

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
  `<span class="block h-1.5 rounded-full ${i % 3 === 1 ? 'bg-orange-300/80' : 'bg-ink-300'}" style="width:${[92, 78, 88, 64, 84, 72][i % 6]}%"></span>`).join('')}</span>`;
const imagePlate = () => `<span class="flex items-center justify-center h-full min-h-[60px] rounded-md bg-ink-200/80" aria-hidden="true">${ico(I.image, '#6B7280', 18)}</span>`;
const sheet = (inner, extra = '') => `<span class="block rounded-lg bg-white ring-1 ring-black/10 shadow-diffuse p-3 ${extra}">${inner}</span>`;

/* ═══════════════ 01 · HERO — THE REAL PDF CHECKER ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / REAL PDF CHECKER =================
       The same form the homepage and Students render (build/checker.js), on the right.
       The H1 and its support take the left column, with the three production limits as
       figures under the approved helper sentence and the scanned-PDF link straight to
       the extraction act. (The form sat on the left at first; Olex swapped the columns
       on 2026-09-17 so the page opens on its name, like the other checker heroes.) -->
  <section id="pdf-checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <!-- three blocks, not two columns: DOM order is H1 → form → limits, which is what a
           phone shows, so the checker is on the first screen there too; at lg the form
           takes the right column across both rows and the other two stack on the left -->
      <div class="grid lg:grid-cols-[.95fr_1.05fr] gap-x-14 gap-y-8 lg:gap-y-7 items-start">

        <div class="rv min-w-0 lg:col-start-1 lg:row-start-1 lg:pt-4">
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'PDF')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[54ch]">${COPY.hero.support}</p>
        </div>

        <div class="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
${checker.form(COPY.hero, ANCHOR)}
${checker.free(COPY.hero)}
        </div>

        <div class="rv min-w-0 lg:col-start-1 lg:row-start-2">
          <!-- the upload limits: the approved sentence, and its three figures -->
          <div class="rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-4 sm:p-5">
            <div class="grid grid-cols-3 gap-3 sm:gap-4 mb-3.5">
${COPY.hero.limits.map(([n, l]) => `              <div class="min-w-0">
                <p class="text-[20px] sm:text-[22px] lg:text-[24px] font-extrabold tracking-tightest nums leading-none">${n}</p>
                <p class="text-[11px] sm:text-[11.5px] font-medium text-ink-500 mt-1.5">${l}</p>
              </div>`).join('\n')}
            </div>
            <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600 border-t border-ink-100 pt-3.5">${COPY.hero.helper}</p>
          </div>
          <p class="mt-4">
            <a href="${COPY.hero.scannedHref}" class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-700 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${ico(I.image, 'currentColor', 15)}${COPY.hero.scanned}</a>
          </p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · HOW TO CHECK A PDF ═══════════════ */
const section2 = () => `  <!-- ================= 02 · HOW TO CHECK A PDF FOR PLAGIARISM =================
       The natural how-to heading the brief asks for, as three real product steps on one
       line, each with the object it is about. A connector starts at a card's right edge
       and is exactly as long as the grid gap (gap-5 / lg:gap-6), so it sits between
       the cards and never runs into one. -->
  <section id="how-to-check-a-pdf" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.howto.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.howto.h2}</h2>
        <p class="${INTRO}">${COPY.howto.intro}</p>
      </div>

      <ol class="rv-kids relative grid md:grid-cols-3 gap-5 lg:gap-6">
${COPY.howto.steps.map(([head, body], i) => `        <li class="relative ${CARD} flex flex-col">
          ${i < 2 ? '<span class="hidden md:block absolute top-1/2 left-full w-5 lg:w-6 h-px bg-ink-200" aria-hidden="true"></span>' : ''}
          <div class="flex items-center justify-between gap-3 mb-5">
            ${chip(['teal', 'orange', 'ink'][i], [I.upload, I.sliders, I.report][i])}
            <span class="text-[11px] font-bold tracking-[0.2em] text-ink-400 nums">0${i + 1}</span>
          </div>
          <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="${BODY} text-ink-600">${body}</p>
        </li>`).join('\n')}
      </ol>
    </div>
  </section>`;

/* ═══════════════ 03 · PDF TEXT EXTRACTION — THE SIGNATURE ═══════════════ */
const section3 = () => `  <!-- ================= 03 · PDF TEXT EXTRACTION =================
       The one thing only this page can teach. Three document states, each drawn: a
       text-based PDF is a sheet of lines, a scan-only PDF is a sheet holding one image
       plate — and the checker's real message for it, "No text found in the file · 0
       Words" — and a mixed PDF is the confirmed five-page test, text on 1/3/5, image
       on 2/4, with only the text pages marked as checked. Nothing suggests an image
       yields words. The state is in the drawing AND in the label. -->
  <section id="pdf-text-extraction" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
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
  <section id="pdf-report" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
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

      <ol class="rv mt-6 sm:mt-8 grid sm:grid-cols-3 rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
${COPY.report.steps.map(([head, body], i) => `        <li class="flex items-start gap-3.5 px-5 py-4 sm:px-6 sm:py-5">
          <span class="shrink-0 inline-flex w-7 h-7 rounded-full bg-white text-ink-900 text-[12px] font-bold items-center justify-center tabular-nums">${i + 1}</span>
          <span class="min-w-0">
            <span class="block text-[14.5px] sm:text-[15px] font-bold tracking-tight text-white">${head}</span>
            <span class="block text-[12.5px] sm:text-[13px] leading-relaxed text-white/60 mt-0.5">${body}</span>
          </span>
        </li>`).join('\n')}
      </ol>

      <div class="rv mt-5 sm:mt-6 rounded-3xl bg-teal-400/[.07] ring-1 ring-teal-400/25 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30 flex items-center justify-center">${ico(I.info, '#6ED7E8')}</span>
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white font-semibold max-w-[76ch]">${COPY.report.callout}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · SOURCES & SETTINGS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · SOURCES & SETTINGS =================
       The point of the section drawn as its layout: the PDF is the input, on the left,
       one node; the sources are the settings, on the right, four of them. The file
       extension decides nothing about the right-hand side. -->
  <section id="sources-and-settings" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.sources.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.sources.h2}</h2>
        <p class="${INTRO}">${COPY.sources.intro}</p>
      </div>

      <div class="rv grid lg:grid-cols-[.7fr_3rem_1.3fr] gap-5 lg:gap-0 items-center">
        <div class="rounded-3xl sm:rounded-4xl bg-ink-950 text-white p-6 sm:p-7 lg:p-8">
          <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/50 mb-4">Input format</p>
          <div class="flex items-center gap-4">
            <span class="inline-flex w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.file, '#fff', 26)}</span>
            <div>
              <p class="text-[22px] sm:text-[24px] font-extrabold tracking-tightest leading-none">PDF</p>
              <p class="text-[12.5px] sm:text-[13px] text-white/60 mt-1.5">The extractable text goes in</p>
            </div>
          </div>
        </div>
        <div class="hidden lg:flex items-center" aria-hidden="true">
          <span class="flex-1 h-px bg-ink-200"></span>
          <svg class="-ml-1.5 shrink-0" width="10" height="12" viewBox="0 0 10 12" fill="#D1D5DB"><path d="M0 0 10 6 0 12z"/></svg>
        </div>
        <div class="${CARD}">
          <div class="flex items-center gap-3 mb-2">
            ${chip('teal', I.sliders)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">Scan settings decide the sources</span>
          </div>
          <ul class="divide-y divide-ink-100">
${COPY.sources.items.map(([h, b]) => tick(h, b)).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · PDF & REPORT HANDLING ═══════════════ */
const section6 = () => `  <!-- ================= 06 · PDF & REPORT HANDLING =================
       Four facts, the two retention behaviours kept apart: the uploaded PDF and the
       report are two columns of one card; deletion and Storage follow. No absolutes. -->
  <section id="pdf-handling" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.handling.eyebrow)}
        <h2 class="${H2}">${COPY.handling.h2}</h2>
        <p class="${INTRO}">${COPY.handling.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
${COPY.handling.items.map(([head, body], i) => `        <div class="rounded-3xl sm:rounded-[28px] ${i === 3 ? 'bg-teal-50 ring-1 ring-teal-600/10' : 'bg-white ring-1 ring-black/5 shadow-diffuse'} p-5 sm:p-6 lg:p-7">
          ${chip(['ink', 'teal', 'orange', 'teal'][i], [I.file, I.report, I.trash, I.archive][i])}
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mt-5 mb-1.5">${head}</h3>
          <p class="${BODY} text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>

      <div class="rv mt-6 lg:mt-8">${btnLight(COPY.handling.cta, COPY.handling.ctaHref)}</div>
    </div>
  </section>`;

/* ═══════════════ 07 · START FREE ═══════════════ */
const section7 = () => `  <!-- ================= 07 · START FREE — THE COMPACT PRICING PATH =================
       One band: the two confirmed limits inline, the two ways on, the one-time note. No
       matrix, no prices. -->
  <section id="start-free" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1.1fr_.9fr] gap-8 lg:gap-12 items-center">
          <div class="min-w-0">
${eyebrow('teal-400', COPY.free.eyebrow, 'ink')}
            <h2 class="${H2}">${COPY.free.h2}</h2>
            <p class="${INTRO} max-w-[56ch]">${COPY.free.p1}</p>
            <p class="mt-3 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[56ch]">${COPY.free.p2}</p>
            <div class="flex flex-wrap items-center gap-3 sm:gap-4 mt-7 lg:mt-8">
              ${btnDark(COPY.free.primary, ANCHOR)}
              ${linkQuiet(COPY.free.secondary, COPY.free.secondaryHref)}
            </div>
          </div>
          <div class="min-w-0 grid grid-cols-2 gap-3 sm:gap-4">
            <div class="rounded-2xl sm:rounded-3xl bg-teal-50 ring-1 ring-teal-600/10 p-5 sm:p-6">
              <p class="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tightest nums leading-none text-teal-800">150</p>
              <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-teal-700 mt-3">plagiarism words</p>
              <p class="text-[12.5px] sm:text-[13px] text-ink-600 mt-2">without registering</p>
            </div>
            <div class="rounded-2xl sm:rounded-3xl bg-ink-950 text-white p-5 sm:p-6">
              <p class="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tightest nums leading-none">300</p>
              <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/60 mt-3">plagiarism words per day</p>
              <p class="text-[12.5px] sm:text-[13px] text-white/60 mt-2">for registered users</p>
            </div>
            <p class="col-span-2 flex items-center gap-2 text-[12.5px] sm:text-[13px] text-ink-600">${ico(I.info, '#6B7280', 14)}${COPY.free.micro}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · FAQ ═══════════════ */
const section8 = () => `  <!-- ================= 08 · FAQ =================
       Nine PDF-specific questions, full answers in the HTML. No timing promise. -->
  <section id="pdf-faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
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

/* ═══════════════ 09 · FINAL CTA ═══════════════ */
const section9 = () => `  <!-- ================= 09 · FINAL CTA =================
       The closing band (build/cta.js). One action, back to the one real checker. -->
  <section id="pdf-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('pdf-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.close.h2, 'your PDF')}</h2>
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
   Page-local styles.
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
${cta.style('pdf-cta')}
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour.
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

const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9];

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
