/* Generate site/index.html — the DEC-0030 homepage.

   The approved baseline is the source of copy. Every string the brief fixes is held in
   COPY below, verbatim, so it can be diffed against the brief line by line instead of
   being hunted through markup. Nothing here paraphrases, shortens or "improves" it.

   Placeholders are deliberate. The brief lists exactly which fields are dynamic —
   review quotes and ratings, prices and quotas, the final Canvas URL — and anything
   NOT on that list is an omission, not a placeholder. That is why the ESL and accuracy
   figures the old homepage carried are simply absent rather than dashed out.

   Run:  node build/home-v2.js  →  node build/shell.js  →  node build/check.js

   On the shared production assets (build/assets.js, build/page.js) since 2026-09-25:
   no Play CDN, no <style> or <script> of its own. Hooks are data-*, decorative styles are
   classes, asset paths are root-relative. Parity: node build/parity/run.js index.html
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'index.html';

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
       listing it — "By URL" is an action, not a brand, so it stays in UI ink. "Attach file"
       led the list until 2026-10-07: the drop zone's "Upload file" is that action. */
    inputs: [
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
    /* The brief fixes the visual priority as Moodle → API → Canvas → Google Docs.
       Olex swapped the last two on 2026-08-20, so the page reads Moodle, API, Google
       Docs, Canvas. Canvas lands in the wide slot, which weights it above Google Docs
       as the brief intends — but it now follows Google Docs in reading order, which
       the brief does not. Recorded rather than quietly reordered. */
    cards: [
      ['Moodle', 'Run plagiarism checks where Moodle courses and submissions already live. Keep report access, source settings, and citation/reference exclusions inside the LMS workflow.', 'View Moodle integration', 'integration-guide.html', 'moodle.svg'],
      ['API', 'Connect plagiarism checking to your own product, platform, or internal workflow through the PlagiarismSearch API.', 'Explore API', 'api.html', null],
      ['Google Docs', 'Use the PlagiarismSearch add-on from your Google Docs workflow when you want to check document text without switching to the main web form.', 'Google Docs add-on', 'how-to-use-plagiarismsearch-google-add-on.html', 'google-docs.svg'],
      ['Canvas', 'Bring plagiarism checking into Canvas course workflows through a full LMS integration, with the same core role as the Moodle integration.', 'Canvas integration', 'canvas-integration.html', 'canvas.svg'],
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
    cta: 'Read more reviews',
    ctaHref: 'testimonials.html',
  },

  s11: {
    h2: 'Choose a plan',
    intro: 'Need more than the free check? Compare one-time and subscription options, or view all pricing details.',
    tiers: ['Light', 'Standard', 'Premium'],
    placeholder: 'BACKEND-SUPPLIED CURRENT PRICE / WORD QUOTA / APPROVED ENTITLEMENT FIELDS',
    cta: 'See all pricing options',
    ctaHref: 'prices.html',
    /* not the brief's: the Pricing page's own label, for the same switch (Olex, 2026-10-07) */
    recurring: 'Recurring payments',
  },

  s12: {
    h2: 'Plagiarism Checker FAQ',
    intro: 'Answers to common questions about plagiarism checking, sources, privacy, AI analysis, supported languages, file types, and free use.',
    help: 'More questions? Visit the Help Center.',
    helpHref: 'help-center.html',
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

/* The pricing preview is the library's (build/sections/pricing-preview.js): the period
   switch and the plan cards are rendered by build/pricing.js from build/pricing-data.js —
   one price list, every page — and this generator holds no figure. */
const pricingPreview = require('./sections/pricing-preview');
const statRail = require('./sections/stat-rail');   /* the proof rail under the hero: one library template */


/* The interactive report component. Extracted to build/report.js when the University
   page needed the same evidence — one report, two pages, per DEC-0043. */
const reportShowcase = require('./sections/report-showcase');

/* ── page-specific styles ────────────────────────────────────────────────── */
/* The page's CSS lives in build/assets/css (site.css): the odometer, hero title and pulse
   dot in 22-home, the reviews rail with the library's Reviews (build/sections/reviews.css), the report's pass and tab colours in
   09-report, the tinted FAQ chevron in 03-faq; the quick-check form, the period switcher
   and the closing band are the shared components. */

/* ─────────────────────────────────────────────────────────────────────────────
   The site's visual vocabulary, so the sections below read as content.
   Everything here is v1's language: the eyebrow chip, the pen underline, tinted
   icon chips, dark acts between light ones, partner marks, oversized numerals.
   ───────────────────────────────────────────────────────────────────────────── */
const ICON = 'w-[14px] h-[14px] sm:w-4 sm:h-4';
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const LEAD = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const TILE_SUB = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CARD = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7';
const CARD_DARK = 'rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white/[.06] ring-1 ring-white/10 p-5 sm:p-6 lg:p-7';

/* the section marker: orange dot on a white chip, wide-tracked label */
const eyebrow = (text, dark = false) => `<div class="inline-flex items-center gap-2 rounded-full ${dark ? 'bg-white/[.07] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/5'} px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-white/70' : 'text-ink-700'}">${text}</span>
        </div>`;

/* one word takes the accent colour, then its underline draws itself */
const pen = w => `<span class="pen-word relative inline-block">${w}<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c30-7 80-7 114-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg></span>`;

/* (The hero title's words — each in the box that clips it so it can rise on load — are
   written by the hero template now: build/sections/hero.js.) */

/* v1 closes by ringing a word rather than underlining it. Same idea as pen(), drawn
   as a loop, and reserved for the last thing on the page: the closing band's template
   (build/sections/cta-band.js) draws it. */

const grad = w => `<span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-teal-600">${w}</span>`;

const I = {
  search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  help:     '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
  sliders:  '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  trash:    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  shield:   '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  cap:      '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  building: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
  users:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  code:     '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  star:     '<path d="m12 2 2.9 6.26 6.6.83-4.9 4.6 1.3 6.31L12 16.9 6.1 20l1.3-6.31L2.5 9.09l6.6-.83z"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  tag:      '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
};

/* tinted chip; the three tints rotate so a row of cards is not monotone */
const TINTS = [
  ['bg-teal-50', 'ring-teal-500/15', 'text-teal-700'],
  ['bg-orange-100', 'ring-orange-500/15', 'text-orange-700'],
  ['bg-mint-100', 'ring-mint-500/20', 'text-mint-700'],
];
const chip = (icon, i = 0, dark = false) => {
  const [bg, ring, fg] = TINTS[i % TINTS.length];
  return `<span class="w-11 h-11 rounded-xl sm:rounded-[14px] ${dark ? 'bg-white/10 ring-1 ring-white/15 text-white' : bg + ' ring-1 ' + ring + ' ' + fg} flex items-center justify-center shrink-0">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
          </span>`;
};

const btn = (label, href, tone = 'dark') => {
  const skin = tone === 'dark' ? 'bg-ink-900 text-white hover:bg-ink-800'
             : tone === 'onDark' ? 'bg-white text-ink-900 hover:bg-white/90'
             : 'ring-1 ring-black/10 text-ink-900 hover:bg-ink-900/5';
  const orb = tone === 'dark' ? 'bg-white/15' : tone === 'onDark' ? 'bg-ink-900/10' : 'bg-ink-900/5';
  return `<a href="${href}" class="group btn-press inline-flex items-center gap-2 h-12 sm:h-14 pl-5 sm:pl-7 pr-2.5 rounded-full ${skin} text-[14px] sm:text-[15px] font-semibold transition-colors duration-300">
          ${label}
          <span class="icon-orb w-9 h-9 rounded-full ${orb} flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>`;
};

/* The site's tick, the one the pricing feature lists already use. */
const tick = label => `<li class="flex items-center gap-3 py-2.5">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              <span class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-800">${label}</span>
            </li>`;

const placeholder = (text, dark = false) => `<span class="${dark ? 'ph-dark text-white/45' : 'ph text-ink-400'} inline-block px-3 py-2 text-[11px] sm:text-[11.5px] font-semibold uppercase tracking-[0.14em]">${text}</span>`;

/* partner mark on its own plate, the treatment already used on the current homepage */
const partner = (file, alt) => `<span class="rounded-xl bg-ink-50 aspect-[324/113] w-full flex items-center justify-center overflow-hidden">
            <img src="/assets/svg/partners/${file}" alt="${alt}" loading="lazy" decoding="async" class="w-full h-full object-contain">
          </span>`;

/* the reviews — sources, the eight quotes, the card and its stars — live in
   build/reviews.js since the Ukrainian checker page needed the same ones */
const { REVIEWS, item: reviewItem } = require('./reviews');
const reviews = require('./sections/reviews');   /* the reviews: one library template (the card, the rail, the grid) */

/* Dark-theme plate and marks, from Figma node 5545-515. The light sections keep the
   colour logos on white; only this rail uses the reversed set — Canvas in white,
   Moodle in orange on white, Google Docs with its grey wordmark.

   The marks are Figma's own exports, not redrawn. Figma bakes every ancestor fill into
   a node export, so each arrived carrying three background rects — the page plate, the
   section and the card. Those were removed; every glyph path is untouched. */
const partnerDark = (file, alt) => `<span class="rounded-xl bg-[#1B1F29] aspect-[324/113] w-full flex items-center justify-center overflow-hidden">
            <img src="/assets/svg/partners/${file}" alt="${alt}" loading="lazy" decoding="async" class="w-[60%] h-auto max-h-[57%] object-contain">
          </span>`;

/* the four input methods, drawn once for both hero variants */
const NL12 = String.fromCharCode(10) + '            ';
const chipGlyph = i => {
  const glyph = i.icon === 'brand'
    ? `<img src="/assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="${ICON} shrink-0">`
    : `<svg class="${ICON} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`;
  return `<button type="button" class="qc-chip">${glyph}${i.label}</button>`;
};

const S = COPY;

/* ─────────────────────────────────────────────────────────────────────────────
   Sections. Light and dark alternate so the page has a pulse rather than one
   long scroll: the report, the reviews and the closing CTA are the dark acts.
   ───────────────────────────────────────────────────────────────────────────── */

/* The ground the page opens and closes on: a 2px dot with rounded corners on a 22px
   grid, drawn as a pattern rather than tiled from an image, so it stays crisp at any
   pixel density, costs no request, and the colour and spacing are values here instead
   of baked pixels. The hero and the closing act share the same wash, so they share the
   same ground — one definition, one place to change it, a separate pattern id each so
   neither section depends on the other still being on the page. */
/* the dot field is shared now — build/dots.js — so every hero on the tint has it */
const { dotField } = require('./dots');
const cta = require('./sections/cta-band');
const page = require('./page');
const faq = require('./sections/faq');   /* the FAQ: one library template */
/* the hero is the library's; it renders the shared quick-check form (build/checker.js)
   in its sealed slot, so Students and PDF show the same component */
const hero = require('./sections/hero');
const steps = require('./sections/steps');   /* the numbered sequences: one library template */
const cards = require('./sections/feature-cards');   /* the feature cards: one library template */
const sources = require('./sections/sources');   /* sources & scan settings: one library template */

const section1 = () => `
  <!-- ================= 01 · HERO / REAL CHECKER =================
       The quick-check form from the product pages, chosen over the plainer one on
       2026-08-20. Field with its count in the corner, drop zone, input chips, then
       the two checks beside the button under a rule.

       It is the page's primary object, per the hero rule: no decorative report
       stands in for it. Inert — no action, submit returns false.
       The hero is the library's (build/sections/hero.js), layout "center": the head
       centred over the form, the title at section scale, its words rising one by one. -->
${hero.section({
    id: 'checker', layout: 'center',
    title: S.s1.h1, pen: 'Checker', penWidth: 120, rise: true,
    lead: S.s1.support,
    checker: { copy: S.s1, textId: 'checker-text' },
  })}`;

const section2 = () => `
  <!-- ================= 02 · COMPACT TRUST RAIL =================
       Each column is one element, in reading order, because the approved strings
       have to survive as sentences: "500,000+ users" and "Plagiarism checking in
       80+ languages" are read whole by a crawler and a screen reader, and laying
       the rail out row-by-row across a grid shreds both.

       The middle column carries a lead-in the other two do not — that is the copy,
       not the layout: one sentence puts words before its number, the other does
       not. An empty row of the same height at the top of columns 1 and 3 puts the
       three figures on one baseline without adding a word to either.

       Visible headings on all three would need three words the brief does not
       supply. Ask before inventing them.

       NOTE: the brief lists a fourth item here, the verified review-platform rating
       and count. Olex removed its placeholder on 2026-08-18. The slot went with it,
       so restoring the item means putting a fourth column back. -->
${statRail.section({
  tone: 'soft', roll: true,
  items: [
    { value: '500,000+', label: 'users' },
    { lead: 'Plagiarism checking in', value: '80+', label: 'languages' },
    { mark: { src: '/assets/svg/partners/bbb.svg' }, label: 'BBB Accredited' },
  ],
})}`;

const section4 = () => `
  <!-- ================= 04 · SIGNATURE · INTERACTIVE REPORT =================
       The first dark act. This is the page's centrepiece, so it gets the break in
       rhythm and the accent colour on the matched text. -->
${reportShowcase.section({
  surface: 'dark', space: 'md', tone: 'quiet',
  head: { eyebrow: 'The report', title: 'See the evidence behind every match', pen: 'evidence', penWidth: 120, intro: S.s4.intro, measure: '720' },
  /* The report as the cabinet draws it, chosen over a card layout invented for the page
     on 2026-08-20 — the library's sealed block (build/report.js), in the homepage's
     rendition: the scan pass. */
  foot: {
    /* A caveat about how to read the report, not a claim about the product, so it sits
       under the thing it qualifies at a footnote's weight. */
    caveat: { text: S.s4.callout, icon: I.shield },
    /* The integrations rail, moved here from its own section at Olex's request.
       NOTE: the brief's page story puts the integrations proof at block 3 and the
       report at block 4, so sitting at the foot of the report act reverses the two.
       Moving this above the report heading would restore the order and keep the
       visual merge — one move of this block. It is the page's own block: the section
       seals it as [data-slot="media"], and it carries its own gap above.
       Moodle and Canvas co-primary, API next, Google Docs secondary — the business
       priority approved 2026-08-20. Marks only, no links: the full integration cards
       below carry the approved destinations. */
    media: `<div class="rv mt-10 sm:mt-12 lg:mt-14">
  <div class="flex items-center gap-4 mb-6 sm:mb-7 lg:mb-8">
    <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/40 shrink-0">${S.s3.label}</span>
    <span class="h-px flex-1 bg-white/10"></span>
  </div>
  <ul class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
    <li>${partnerDark('moodle-on-dark.svg', 'Moodle')}</li>
    <li>${partnerDark('canvas-on-dark.svg', 'Canvas')}</li>
    <li>
      <span class="rounded-xl bg-[#1B1F29] aspect-[324/113] w-full flex items-center justify-center gap-2 text-white/80">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.code}</svg>
        <span class="text-[15px] sm:text-[17px] font-extrabold tracking-tight">API</span>
      </span>
    </li>
    <li>${partnerDark('google-docs-on-dark.svg', 'Google Docs')}</li>
  </ul>
</div>`,
  },
})}`;

const section5 = () => `
  <!-- ================= 05 · SIGNATURE · SOURCES & SCAN CONTROLS =================
       The library's Sources (build/sections/sources.js), layout "groups", the
       homepage's short labels. Ticks, not switches: these are a list of what a check
       can include, so a control that moves invites you to set something the page cannot
       act on. The coverage card does not dim with a toggle for the same reason — its
       sentence already carries the condition. -->
${sources.section({
    layout: 'groups', bg: 'cool', space: 'md', labels: true,
    head: { eyebrow: 'Scan controls', title: S.s5.h2, intro: S.s5.intro, measure: '720' },
    groups: [
      { label: 'Search sources', icon: I.search, tone: 'teal', items: S.s5.sources },
      { label: 'Review settings', icon: I.sliders, tone: 'orange', items: S.s5.settings },
    ],
    stat: { icon: I.database, value: '500 million', text: S.s5.coverage },
  })}`;

const section6 = () => `
  <!-- ================= 06 · SIGNATURE · PLAGIARISM VS AI =================
       One type size across all three blocks. They had been running at 17.5, 14.5
       and 15.5 with nothing to explain the difference, which reads as three
       accidents rather than a hierarchy. They are peers — two answers and the
       sentence that ties them — so they share the section-body step.

       Plagiarism stays primary, as the brief requires, but through the things that
       actually rank a block: the dark surface and the wider column. Type size was
       doing that job badly and inconsistently.

       The bridge gets a chip of its own, so it stands beside the cards rather than
       reading as a leftover paragraph under them. -->
  <section data-component="ai-compare" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Two analyses')}
        <h2 class="${H2}">Plagiarism and AI checks answer ${grad('different questions')}</h2>
      </div>

      <div class="rv grid lg:grid-cols-[1.25fr_1fr] gap-4 sm:gap-5 lg:gap-6 mb-4 sm:mb-5 lg:mb-6">
        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-ink-900 text-white p-6 sm:p-7 lg:p-8">
          <div class="flex items-center gap-3 mb-5 lg:mb-6">
            ${chip(I.search, 0, true)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45">Plagiarism check</span>
          </div>
          <p class="${LEAD} text-white/85 max-w-[58ch]">${S.s6.plagiarism}</p>
        </div>
        <div class="${CARD} flex flex-col">
          <div class="flex items-center gap-3 mb-5 lg:mb-6">
            ${chip(I.sparkles, 1)}
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400">AI writing check</span>
          </div>
          <p class="${LEAD} text-ink-600 mb-6">${S.s6.ai}</p>
          <div class="mt-auto">${btn(S.s6.cta, S.s6.ctaHref, 'light')}</div>
        </div>
      </div>

      <div class="rv rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-orange-50 ring-1 ring-orange-500/10 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        ${chip(I.info, 1)}
        <p class="${LEAD} text-ink-700 max-w-[76ch]">${S.s6.bridge}</p>
      </div>
    </div>
  </section>`;

const section7 = () => `
  <!-- ================= 07 · DOCUMENT & REPORT PRIVACY LIFECYCLE =================
       The library's Steps (build/sections/steps.js): four cards with the homepage's
       ringed tile on top and the number before the name; the note panel under them. -->
${steps.section({
    layout: 'cards', marker: 'icon-stack', bg: 'aqua', space: 'md', glow: true,
    head: { eyebrow: 'Document handling', title: S.s7.h2, intro: S.s7.intro, measure: '720' },
    cols: 4,
    items: S.s7.steps.map(([title, text], i) => ({ title, text, icon: [I.upload, I.file, I.report, I.trash][i], tone: ['teal', 'orange', 'mint'][i % 3] })),
    foot: { note: { lines: [S.s7.storage, S.s7.infra], action: { label: S.s7.cta, href: S.s7.ctaHref, tone: 'ghost' } } },
  })}`;

const section8 = () => `
  <!-- ================= 08 · FULL WORKFLOW / INTEGRATIONS =================
       Bento, weighted to the brief's visual priority: Moodle wide, then API, Canvas,
       Google Docs. The marks come back here at full size. -->
  <section data-component="integrations" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        ${eyebrow('Workflow')}
        <h2 class="${H2} mb-4 lg:mb-5">${S.s8.h2}</h2>
        <p class="${LEAD} text-ink-600">${S.s8.intro}</p>
      </div>

      <div class="rv-kids grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        ${S.s8.cards.map(([t, d, cta, href, mark], i) => {
          const wide = i === 0 || i === 3;
          return `<div class="${CARD} flex flex-col${wide ? ' lg:col-span-2' : ''}">
          <div class="w-[208px] mb-5">${mark
            ? partner(mark, t)
            : `<span class="rounded-xl bg-ink-50 aspect-[324/113] w-full flex items-center justify-center gap-3 text-ink-700"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.code}</svg><span class="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tight">API</span></span>`}</div>
          <p class="text-[17.5px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight text-ink-900 mb-3">${t}</p>
          <p class="${TILE_SUB} text-ink-600 mb-6${wide ? ' max-w-[62ch]' : ''}">${d}</p>
          <div class="mt-auto">${btn(cta, href, 'light')}</div>
        </div>`;
        }).join('\n        ')}
      </div>
    </div>
  </section>`;

const section9 = () => `
  <!-- ================= 09 · AUDIENCE PATHWAYS =================
       The library's Feature cards (build/sections/feature-cards.js), size "lead": the
       ringed tile, a name at lead scale, the card's own button at its foot. -->
${cards.section({
    layout: 'grid', bg: 'cool', space: 'md', size: 'lead',
    head: { eyebrow: 'Pathways', title: S.s9.h2, intro: S.s9.intro, measure: '720' },
    cols: 3,
    items: S.s9.cards.map(([title, text, cta, href], i) => ({ title, text, icon: [I.cap, I.building, I.users][i], tone: ['teal', 'orange', 'mint'][i % 3], action: { label: cta, href, tone: 'ghost' } })),
  })}`;

const section10 = () => `
  <!-- ================= 10 · REVIEWS =================
       A carousel rather than a fixed three: the number of reviews is not ours to
       decide, and a row that only ever holds three would have to be rebuilt the
       moment a fourth arrives.

       Controls hide themselves when there is nothing to scroll — on a wide screen
       with three reviews the arrows and dots simply do not appear.

       No quote, name or rating is filled in. The brief lists them as dynamic and
       says not to browse for them; beyond that, a mistranscribed review is an
       invented quote with a real person's name under it. -->
${reviews.section({
  layout: 'carousel', space: 'md', tone: 'quiet',
  head: { eyebrow: 'Reviews', title: S.s10.h2, measure: '720' },
  items: REVIEWS.map(reviewItem),
  /* The source-pool line was working copy for review, not public text, and went with the
     placeholders. The button is centred under the centred pagination rather than pushed
     to an edge it no longer shares with anything. */
  action: { label: S.s10.cta, href: S.s10.ctaHref },
})}`;

const section11 = () => `
  <!-- ================= 11 · PRICING PREVIEW =================
       v1's card architecture with the four-period switcher from the pricing page.
       The header copy is the brief's; the numbers are not — see the note on PLANS. -->
${pricingPreview.section({
  layout: 'center', space: 'md',
  head: { eyebrow: 'Plans &amp; pricing', title: S.s11.h2, intro: S.s11.intro },
  /* under the tabs, the Pricing page's "Recurring payments" switch — one for the three
     cards, off on One-time (Olex, 2026-10-07) */
  recurring: S.s11.recurring,
  /* the plans' own buttons and the line under the cards lead to the Pricing page. The
     brief calls the latter the primary CTA; Olex asked for it as a quiet text link, since
     each card now carries its own button. The label and destination are the brief's,
     only the weight changed. */
  plans: { href: S.s11.ctaHref },
  foot: { link: { label: S.s11.cta, href: S.s11.ctaHref } },
})}`;

const section12 = () => `
  <!-- ================= 12 · FAQ ================= -->
${faq.section({
  id: 'faq', ns: 'home-faq', bg: 'white', space: 'md', layout: 'fixed',
  head: { eyebrow: 'Questions', title: S.s12.h2, intro: S.s12.intro,
          more: { label: S.s12.help, href: S.s12.helpHref,
                  icon: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I.help}</svg>` } },
  items: S.s12.items.map(([q, a]) => ({ q, a })),
})}`;

const section13 = () => `
  <!-- ================= 13 · FINAL CTA =================
       Built on v1's closing act: the tinted wash the hero opens on, two soft orbs,
       a pill with a pulsing dot, an oversized heading and the word ringed rather
       than underlined. The page opens and closes on the same colour.

       What did not come across from v1: its second button (talk to sales) and its
       trust strip (G2 Leader, Trustpilot 4.7, Capterra 4.8, 7-day money-back). The
       brief supplies neither, and the ratings are dynamic fields besides.

       Sends you back to the real checker in section 1; no second form is rendered. -->
${cta.section({
  id: 'cta',
  eyebrow: 'Free check',
  title: 'Check your text for plagiarism', ring: 'plagiarism',
  lead: S.s13.support, measure: '52',
  actions: { button: { label: S.s13.cta, href: '#checker', icon: 'spark' } },
  note: S.s13.free,
})}`;

/* ── behaviour ───────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js). The behaviour lives in build/assets/js
   (site.js): the odometer, the hero title, the report and its pass, the carousel, the
   pricing periods, the FAQ, the reveals and marks. The page carries none of its own.
   ───────────────────────────────────────────────────────────────────────────── */
/* twelve, not thirteen: the integrations rail folded into the report act */
const sections = [section1, section2, section4, section5, section6, section7,
                  section8, section9, section10, section11, section12, section13];

const html = page.render({ title: COPY.title, meta: COPY.meta, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const h1s = (html.match(/<h1\b/g) || []).length;
const h2s = (html.match(/<h2\b/g) || []).length;
const secs = (html.match(/<section\b/g) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + secs + ' sections, ' + h1s + ' h1, ' + h2s + ' h2');
