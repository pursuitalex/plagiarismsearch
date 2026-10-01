/* Generate site/turnitin-checker-alternative.html — the Turnitin Alternative page to the
   2026-09-15 brief. It replaces a stub, so no -v2 and no version switcher.

   The brief is narrow about facts and wide about form: every sentence below is the
   approved baseline, verbatim, and every claim about Turnitin is one the brief sourced to
   an official Turnitin guide. What is ours is the composition, and the brief gives it one
   rule: make the comparison easier to evaluate, not louder.

   So the page is built from things that are true about both products rather than from
   things that are good about ours. The comparison is a real <table> with two columns of
   equal weight — no winner column, no ticks and crosses, no colour that means "better" —
   and each Turnitin cell carries the number of the official source that supports it. The
   non-equivalence act is the one dark act and the page's signature: two systems drawn
   side by side, the same four ingredients in each, two different reports at the bottom
   and a neutral "not directly interchangeable" between them. "Which option fits" gives Turnitin its own column and its own
   three reasons. Nothing on the page borrows Turnitin's logo, UI, colours or report.

   The checker, the report and the closing band are the shared modules. The pricing
   preview is the homepage's widget shell reading build/pricing-data.js — placeholder
   figures until the backend widget lands, and no competitor price anywhere.

   Run:  node build/turnitin.js  →  node build/shell.js  →  node build/check-turnitin.js

   On the shared production assets (build/assets.js, build/page.js) since 2026-09-25:
   no Play CDN, no <style> or <script> of its own. Hooks are data-*, decorative styles are
   classes, asset paths are root-relative. Parity: node build/parity/run.js turnitin-checker-alternative.html
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const faq = require('./sections/faq');   /* the FAQ: one library template */

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'turnitin-checker-alternative.html';
const cta = require('./sections/cta-band');
const hero = require('./sections/hero');   /* the hero: one library template; it renders the form (build/checker.js) in its sealed slot */
const steps = require('./sections/steps');   /* the numbered sequences: one library template */
const { PLANS, LABEL, TAGLINE } = require('./pricing-data');
const pricing = require('./pricing');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — Turnitin Alternative brief, 2026-09-15. Verbatim.

   Destinations (URLS.md): /prices → prices.html, /policy → policy.html,
   /ai-content-detector → ai-detector.html. Every checker CTA points at the one real
   form, #independent-checker.
   ───────────────────────────────────────────────────────────────────────────── */
const ANCHOR = '#independent-checker';

/* the five official Turnitin guides the brief rechecked on 2026-09-15 — the only
   substantiation this page may use for a Turnitin fact */
const SOURCES = [
  ['How to purchase a Turnitin subscription', 'https://guides.turnitin.com/hc/en-us/articles/37985974637453-How-to-purchase-a-Turnitin-subscription'],
  ['Turnitin and plagiarism', 'https://guides.turnitin.com/hc/en-us/articles/34400565079053-Turnitin-and-plagiarism'],
  ['Accessing the Similarity Report and similarity score via Turnitin Website', 'https://guides.turnitin.com/hc/en-us/articles/28310712438029-Accessing-the-Similarity-Report-and-similarity-score-via-Turnitin-Website'],
  ['Customizing account settings for Similarity and SimCheck', 'https://guides.turnitin.com/hc/en-us/articles/21745851240589-Customizing-account-settings-for-Similarity-and-SimCheck'],
  ['Using the AI Writing Report', 'https://guides.turnitin.com/hc/en-us/articles/22774058814093-Using-the-AI-Writing-Report'],
];

const COPY = {
  title: 'Turnitin Checker Alternative | PlagiarismSearch',
  meta: 'Compare PlagiarismSearch with Turnitin® using verified facts about access, reports, sources and pricing. Run an independent self-service plagiarism check.',
  canonical: 'https://plagiarismsearch.com/turnitin-checker-alternative',

  hero: {
    eyebrow: 'Independent plagiarism checking',
    h1: 'An Independent Alternative to Turnitin® for Plagiarism Checking',
    support: 'Looking for a plagiarism check you can run directly? PlagiarismSearch lets individuals upload or paste their own content, review matching passages and sources, and use self-service plagiarism checking without an institutional PlagiarismSearch setup.',
    independence: 'PlagiarismSearch is an independent service. It is not affiliated with or endorsed by Turnitin, LLC and does not generate Turnitin Similarity Reports.',
    /* the checker's own copy — the homepage's, with the approved CTA and free line */
    placeholder: 'Paste or type your text here',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
    free: '150 words free — no registration required.',
  },

  compare: {
    h2: 'PlagiarismSearch vs Turnitin®: what is actually different?',
    intro: 'Turnitin offers several products and institution-specific configurations. This comparison focuses on PlagiarismSearch self-service plagiarism checking and documented aspects of Turnitin Similarity / Feedback Studio that can be compared using current official information.',
    verifiedLabel: 'Last verified: September 15, 2026',
    verification: 'Turnitin information on this page was last reviewed on September 15, 2026 against current official Turnitin documentation covering subscription access, Similarity Reports, source repositories and AI Writing Reports. Turnitin product availability and settings can vary by license, institution and configuration.',
    heads: ['Topic', 'Turnitin® Similarity / Feedback Studio', 'PlagiarismSearch'],
    /* [topic, Turnitin cell, PlagiarismSearch cell, official source number] */
    rows: [
      ['Direct individual purchase',
       'Turnitin states that subscriptions to these products are designed for educational institutions and are not sold directly to individuals.',
       'Individuals can use PlagiarismSearch directly through its self-service checker and public plan options.', 1],
      ['How access works',
       'Access commonly depends on an institution\'s Turnitin product, license and workflow. Student access to a Similarity Report can also depend on instructor or institutional settings.',
       'A user can start their own check directly in PlagiarismSearch and review the generated report through their account workflow.', 3],
      ['What the report means',
       'Turnitin\'s Similarity Report highlights text that matches selected search sources. Turnitin states that a similarity score is not itself a determination of plagiarism.',
       'PlagiarismSearch highlights matching or similar passages and their sources. The result is evidence for the user to review, not an automatic plagiarism determination.', 2],
      ['Source collections',
       'Depending on the product and settings, Turnitin documents source collections including internet content, publications and repositories of submitted works.',
       'PlagiarismSearch can search web sources, an academic database with 500M+ indexed academic texts when enabled, and available personal or organization storage sources.', 4],
      ['Pricing path',
       'Institutional customers request pricing based on their organization\'s requirements; these subscriptions are not sold directly to individuals.',
       'Public self-service plan options are available directly from PlagiarismSearch.', 1],
      ['Official Turnitin report',
       'Turnitin generates its own Similarity Reports using its products, databases and configured search targets.',
       'PlagiarismSearch generates a PlagiarismSearch report. It does not connect to Turnitin software or generate an official Turnitin Similarity Report.', 3],
    ],
    sourcesLabel: 'Official Turnitin sources',
  },

  differ: {
    h2: 'A PlagiarismSearch result is not equivalent to a Turnitin® score',
    p: 'PlagiarismSearch and Turnitin® use different source collections, repositories, matching methods, and settings. Because of those differences, a PlagiarismSearch similarity percentage should not be treated as a prediction of the score an official Turnitin Similarity Report may return.',
    /* patch 2026-09-18: the relation between the two results is a neutral label, not a ≠ */
    relation: 'Not directly interchangeable',
    /* the diagram's labels — each one a noun from the paragraph */
    parts: ['Source collections', 'Repositories', 'Matching methods', 'Settings'],
    lanes: [['PlagiarismSearch', 'PlagiarismSearch report'], ['Turnitin®', 'Turnitin Similarity Report']],
  },

  fit: {
    h2: 'Which option fits your workflow?',
    ps: {
      label: 'PlagiarismSearch may fit when',
      items: [
        ['Direct self-service access', 'You need to run your own plagiarism checks without relying on an institution to provide your PlagiarismSearch account.'],
        ['Independent pre-submission review', 'You want to review the matches and sources found by PlagiarismSearch before you submit your final version.'],
        ['Public self-service pricing', 'You want to choose from current PlagiarismSearch plan options directly.'],
        ['Scan control', 'You want to configure the source collections and exclusions available for your PlagiarismSearch check.'],
      ],
    },
    tii: {
      label: 'Turnitin® may fit when',
      items: [
        ['Official institutional workflow', 'Your school or organization already uses Turnitin® as part of its official workflow.'],
        ['Official Turnitin report', 'You need the official Turnitin Similarity Report required by your institution.'],
        ['Institution-managed features', 'Your workflow depends on Turnitin® institutional repositories, assignment settings or integrations.'],
      ],
    },
    closing: 'The right workflow depends on whether you need independent self-service checking or an institution-managed Turnitin® process.',
  },

  report: {
    eyebrow: 'What You Get with PlagiarismSearch',
    h2: 'Review the evidence behind each match',
    intro: 'The PlagiarismSearch report highlights matching or similar passages and connects them with the sources found during the check. Select a match to review the relevant source and inspect the result in context.',
    points: [
      ['Matched passages', 'See the text where a match or similarity was found.'],
      ['Source evidence', 'Review the sources associated with reported matches.'],
      ['Interactive review', 'Select a match to focus on the corresponding source and examine its context.'],
    ],
    callout: 'A similarity percentage is not a plagiarism verdict.',
  },

  sources: {
    eyebrow: 'Scan Sources &amp; Settings',
    h2: 'Know what PlagiarismSearch checks against',
    intro: 'The results you see depend on the source collections and exclusions used for your PlagiarismSearch check.',
    items: [
      ['Web', 'Search available web sources for matching or similar text.'],
      ['Academic database', 'Include academic database search when you want to compare text with indexed academic material. PlagiarismSearch provides access to over 500 million indexed academic texts when this search source is enabled.'],
      ['Storage', 'Personal or organization storage can also be used as comparison sources where available for the account.'],
      ['Exclusions', 'References and in-text citations can be excluded when appropriate for the purpose of the check.'],
    ],
    boundary: 'These source options apply to PlagiarismSearch checks.',
  },

  ai: {
    h2: 'AI writing analysis is separate from plagiarism checking',
    ps: 'PlagiarismSearch can run AI writing analysis as a separate check when that capability and AI-word balance are available. An AI-writing result does not mean that plagiarism occurred and does not prove authorship.',
    tii: 'Turnitin® also presents AI writing detection separately from its similarity result. Turnitin states that its AI model may misidentify text and should not be used as the sole basis for adverse action against a student.',
    cta: 'Explore AI Content Detector', ctaHref: 'ai-detector.html',
  },

  data: {
    h2: 'Know what happens to your document in PlagiarismSearch',
    /* [station label — ours, a noun from the sentence — , the approved sentence(s)] */
    steps: [
      ['Your document', 'Your uploaded document is processed to perform the checks you select. The uploaded source document is not retained as a stored source document.'],
      ['Your report', 'A generated report may remain available in your account for convenience, and you can permanently delete reports.'],
      ['Storage', 'Adding content to Storage is a separate action you control. Running a plagiarism check does not automatically add the document to Storage.'],
    ],
    cta: 'Read the Privacy Policy', ctaHref: 'policy.html',
  },

  pricing: {
    eyebrow: 'Self-Service Pricing',
    h2: 'Choose a PlagiarismSearch plan directly',
    intro: 'PlagiarismSearch offers public self-service plan options for users who need more than the free check. Current prices, quotas, billing periods and plan entitlements should always come from the live pricing system.',
    free: '150 plagiarism words can be checked without registration. Registered users receive 300 plagiarism words per day.',
    cta: 'View all pricing', ctaHref: 'prices.html',
  },

  faq: {
    h2: 'Turnitin Alternative FAQ',
    /* [question, answer, optional official source number shown after the answer] */
    items: [
      ['Is PlagiarismSearch affiliated with Turnitin® or a third-party Turnitin® checker?', 'No. PlagiarismSearch is an independent service. It is not affiliated with, endorsed by, sponsored by, or otherwise connected with Turnitin, LLC; it does not access Turnitin software or proprietary databases and does not generate official Turnitin Similarity Reports.'],
      ['Will PlagiarismSearch give me the same similarity score as Turnitin®?', 'Not necessarily. Different services can use different source collections, repositories, matching methods and settings, so similarity results may differ. A PlagiarismSearch result should not be treated as a prediction of an official Turnitin score.'],
      ['Can individuals buy Turnitin® Similarity directly?', 'Turnitin currently states that Turnitin Feedback Studio and Similarity subscriptions are not sold directly to individuals. Access may be provided through an institution; Turnitin points individuals with personal similarity-checking needs toward iThenticate.', 1],
      ['Do I need an institutional account to use PlagiarismSearch?', 'No. PlagiarismSearch is available through its own self-service workflow and does not require your school or university to provide access.'],
      ['Is a similarity percentage proof of plagiarism?', 'No. A similarity percentage shows matched or similar text found against the sources used for a check. The context of each match still needs to be reviewed before deciding what it means.'],
      ['Can I use PlagiarismSearch before submitting through my institution?', 'You can use PlagiarismSearch to review your own draft before submission, subject to your institution\'s rules. Because PlagiarismSearch and Turnitin® use different systems and source collections, do not assume that the two services will return the same result.'],
      ['Does PlagiarismSearch check AI writing too?', 'AI writing analysis is available as a separate check when the capability and AI-word balance are available. AI detection and plagiarism checking answer different questions; an AI result does not itself mean plagiarism.'],
      ['How much can I check for free?', 'You can check up to 150 plagiarism words without registering. Registered users receive 300 plagiarism words per day.'],
    ],
  },

  close: {
    h2: 'Run an independent plagiarism check',
    support: 'Review the matches and sources PlagiarismSearch finds before you submit your work.',
    primary: 'Check for plagiarism',
    micro: '150 words free — no registration required.',
  },

  notice: {
    label: 'Trademark notice',
    text: 'Turnitin® is a registered trademark of Turnitin, LLC. PlagiarismSearch is an independent service and is not affiliated with, endorsed by, sponsored by, or otherwise connected with Turnitin, LLC. References to Turnitin® on this page are used for comparative and consumer-information purposes. PlagiarismSearch does not provide access to Turnitin software or proprietary databases and does not generate Turnitin Similarity Reports.',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's.
   ───────────────────────────────────────────────────────────────────────────── */
const eyebrow = (dot, label, ground = 'white') => `        <div class="inline-flex items-center gap-2 rounded-full ${ground === 'white' ? 'bg-white' : 'bg-ink-50'} ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const LABEL_CLS = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');
/* an external link says so: the arrow that leaves the box */
const extIcon = '<svg class="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

const btnLight = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 ring-1 ring-black/10 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;
const linkQuiet = (label, href) => `<a href="${href}"${ext(href)} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-500 hover:text-ink-900 decoration-ink-300 underline underline-offset-4 transition-colors duration-300">${label}</a>`;

/* the reference to an official source: a quiet numbered pill that opens the official guide
   itself, in a new tab (patch 2026-09-18 — the in-page jump to the registry barely moved) */
const srcRef = n => `<a href="${SOURCES[n - 1][1]}" target="_blank" rel="noopener noreferrer" class="src-ref inline-flex items-center gap-1.5 rounded-full bg-ink-50 hover:bg-ink-100 ring-1 ring-black/5 px-2.5 py-1 text-[11px] sm:text-[11.5px] font-semibold text-ink-600 hover:text-ink-900 transition-colors duration-300" aria-label="Official Turnitin source ${n}: ${SOURCES[n - 1][0]} (opens in a new tab)">Source ${n}<span class="text-ink-400">${extIcon}</span></a>`;

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
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  archive:  '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  shield:   '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  text:     '<path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>',
  link:     '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  pointer:  '<path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.944.033z"/>',
};

/* ═══════════════ 01 · HERO — THE REAL CHECKER, AND WHO IS SPEAKING ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / INDEPENDENT ALTERNATIVE + REAL CHECKER =================
       The shared form (build/checker.js) on the right, and on the left the two things a
       visitor from a "Turnitin alternative" query has to learn before they type: what
       this is, and what it is not. The independence sentence is a card of its own, not
       fine print. (The second, short disclosure under the form went with the 2026-09-18
       patch: one statement in the hero is enough.)
       Three blocks, DOM order H1 → form → independence, so a phone opens on the checker.
       The hero is the library's (build/sections/hero.js), layout "split-aside"; the
       title is a sentence, so it takes the long size. -->
${hero.section({
    id: ANCHOR.slice(1), layout: 'split-aside',
    eyebrow: COPY.hero.eyebrow,
    title: COPY.hero.h1, pen: 'Independent', size: 'long',
    lead: COPY.hero.support,
    checker: { copy: COPY.hero, textId: 'independent-checker-text' },
    aside: { notice: { tone: 'ink', icon: I.shield, text: COPY.hero.independence } },
  })}`;

/* ═══════════════ 02 · THE COMPARISON ═══════════════ */
const section2 = () => `  <!-- ================= 02 · OBJECTIVE COMPARISON + ITS SOURCES =================
       A real table: <th scope="col"> for the two products, <th scope="row"> for the
       topic, every cell text. Both product columns are set identically — same ground,
       same weight, no winner. Each Turnitin cell ends on the number of the official guide
       that supports it, and the guides are listed directly under the table with the
       date they were checked. Under 768px the table reflows into one card per topic; the
       explicit roles keep it a table for assistive tech once display:block has been
       applied, and each cell repeats its product name as a label. -->
  <section id="comparison" data-component="compare-table" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[860px] mb-8 sm:mb-10 lg:mb-12">
        <h2 class="${H2}">${COPY.compare.h2}</h2>
        <p class="${INTRO} max-w-[76ch]">${COPY.compare.intro}</p>
        <p class="mt-5 inline-flex items-center gap-2 rounded-full bg-ink-50 ring-1 ring-black/5 px-3.5 py-1.5 text-[12px] sm:text-[12.5px] font-semibold text-ink-700">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1B7A50" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
          ${COPY.compare.verifiedLabel}
        </p>
      </div>

      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <table class="cmp w-full text-left" role="table">
          <caption class="sr-only">PlagiarismSearch self-service plagiarism checking compared with documented aspects of Turnitin Similarity / Feedback Studio</caption>
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader" class="cmp-topic ${LABEL_CLS} text-ink-500">${COPY.compare.heads[0]}</th>
              <th scope="col" role="columnheader" class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight text-ink-900">${COPY.compare.heads[1]}</th>
              <th scope="col" role="columnheader" class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight text-ink-900">${COPY.compare.heads[2]}</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
${COPY.compare.rows.map(([topic, tii, ps, n]) => `            <tr role="row">
              <th scope="row" role="rowheader" class="cmp-topic text-[15px] sm:text-[15.5px] font-bold tracking-tight text-ink-900">${topic}</th>
              <td role="cell" data-label="${COPY.compare.heads[1]}">
                <p class="${BODY} text-ink-700">${tii}</p>
                <p class="mt-2.5">${srcRef(n)}</p>
              </td>
              <td role="cell" data-label="${COPY.compare.heads[2]}">
                <p class="${BODY} text-ink-700">${ps}</p>
              </td>
            </tr>`).join('\n')}
          </tbody>
        </table>
      </div>

      <!-- the evidence, directly under the claims it supports -->
      <div class="rv mt-6 sm:mt-8 grid lg:grid-cols-[.9fr_1.1fr] gap-6 lg:gap-12 rounded-2xl sm:rounded-3xl bg-ink-50 p-5 sm:p-7 lg:p-8">
        <div class="min-w-0">
          <p class="${LABEL_CLS} text-ink-500 mb-3">${COPY.compare.verifiedLabel}</p>
          <p class="${BODY} text-ink-700 max-w-[62ch]">${COPY.compare.verification}</p>
        </div>
        <div class="min-w-0">
          <p class="${LABEL_CLS} text-ink-500 mb-3">${COPY.compare.sourcesLabel}</p>
          <ol class="grid gap-2">
${SOURCES.map(([label, href], i) => `            <li class="flex items-start gap-3 py-1.5">
              <span class="shrink-0 w-6 h-6 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center text-[11.5px] font-bold text-ink-700 tabular-nums">${i + 1}</span>
              <a href="${href}" target="_blank" rel="noopener noreferrer" class="min-w-0 inline-flex items-start gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-800 hover:text-ink-950 underline decoration-ink-300 hover:decoration-ink-500 underline-offset-4 transition-colors duration-300"><span>${label}</span><span class="mt-1 text-ink-400">${extIcon}</span></a>
            </li>`).join('\n')}
          </ol>
          <p class="mt-3 text-[12.5px] sm:text-[13px] text-ink-500">guides.turnitin.com — official Turnitin documentation.</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · NOT THE SAME SCORE — THE SIGNATURE ACT ═══════════════ */
const RELATION = 'inline-flex whitespace-nowrap rounded-full bg-ink-800 ring-1 ring-white/20 px-4 py-2 text-[12.5px] sm:text-[13px] font-semibold text-white';
const lane = ([name, result], i) => `          <div class="rounded-2xl sm:rounded-3xl bg-white/[.04] ring-1 ring-white/10 p-4 sm:p-5">
            <p class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight text-white mb-3.5">${name}</p>
            <ul class="grid gap-2">
${COPY.differ.parts.map(p => `              <li class="flex items-center gap-2.5 rounded-xl bg-white/[.05] px-3.5 py-2 text-[12.5px] sm:text-[13px] font-medium text-white/75"><span class="w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-teal-400' : 'bg-white/50'} shrink-0"></span>${p}</li>`).join('\n')}
            </ul>
            <div class="flex justify-center py-2.5 text-white/30" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg></div>
            <p class="rounded-xl bg-white text-ink-900 px-3.5 py-2.5 text-center text-[13px] sm:text-[13.5px] font-bold tracking-tight">${result}</p>
          </div>`;

const section3 = () => `  <!-- ================= 03 · SIGNATURE · NOT THE SAME SCORE =================
       The page's one dark act, and the thing a competitor page will not say. The diagram
       is the first paragraph, drawn: two systems, the same four ingredients named in
       each, two different reports, and a neutral label on the bracket that joins the
       results — "Not directly interchangeable", not an inequality sign. Both lanes are set
       alike — neither is the "good" one — and nothing in the right lane imitates
       Turnitin's product. Every label is a noun from the approved paragraph. -->
  <section id="not-the-same-score" data-component="dark-lanes" data-surface="dark" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute orb-dark-teal"></div>
    <div class="orb absolute orb-dark-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0">
          <h2 class="${H2}">${penMark(COPY.differ.h2, 'not equivalent')}</h2>
          <p class="mt-5 lg:mt-6 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[60ch]">${COPY.differ.p}</p>
        </div>

        <!-- two lanes, and the relation between their results as a neutral label on a
             bracket that joins them — stacked on a phone, the label sits between the lanes -->
        <div class="rv grid sm:grid-cols-2 gap-3 sm:gap-x-4 sm:gap-y-0" role="img" aria-label="Two separate systems: PlagiarismSearch and Turnitin each use their own source collections, repositories, matching methods and settings, and each produces its own report. The two results are not directly interchangeable.">
${lane(COPY.differ.lanes[0], 0)}
          <p class="sm:hidden flex justify-center" aria-hidden="true"><span class="${RELATION}">${COPY.differ.relation}</span></p>
${lane(COPY.differ.lanes[1], 1)}
          <div class="hidden sm:block sm:col-span-2 relative h-[46px]" aria-hidden="true">
            <span class="absolute left-1/4 right-1/4 top-0 h-[22px] border-x border-b border-white/25 rounded-b-2xl"></span>
            <span class="absolute left-1/2 top-[22px] -translate-x-1/2 -translate-y-1/2 ${RELATION}">${COPY.differ.relation}</span>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · WHICH OPTION FITS ═══════════════ */
const fitCol = (side, dot) => `        <div class="rounded-3xl sm:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8">
          <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight pb-4 mb-1 border-b border-ink-100">${side.label}</h3>
          <ul class="divide-y divide-ink-100">
${side.items.map(([head, body]) => `            <li class="flex items-start gap-3.5 py-4">
              <span class="mt-[9px] w-1.5 h-1.5 rounded-full ${dot} shrink-0"></span>
              <span class="min-w-0">
                <span class="block text-[14.5px] sm:text-[15px] font-bold tracking-tight text-ink-900">${head}</span>
                <span class="block ${BODY} text-ink-600 mt-1">${body}</span>
              </span>
            </li>`).join('\n')}
          </ul>
        </div>`;

const section4 = () => `  <!-- ================= 04 · WHICH OPTION FITS YOUR WORKFLOW =================
       Balanced on purpose. Two cards with the same shell, the same type and the same
       bullet — Turnitin's column is not dimmed, crossed out or shorter by design; it has
       three reasons because the brief gives it three. The closing line sits under both
       as the sentence that joins them. -->
  <section id="which-option-fits" data-component="fit-columns" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-8 sm:mb-10 lg:mb-12">
        <h2 class="${H2}">${COPY.fit.h2}</h2>
      </div>
      <div class="rv-kids grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
${fitCol(COPY.fit.ps, 'bg-teal-500')}
${fitCol(COPY.fit.tii, 'bg-ink-400')}
      </div>
      <p class="rv mt-6 sm:mt-8 max-w-[860px] text-[15.5px] sm:text-[17px] lg:text-[18px] font-semibold tracking-tight leading-snug text-ink-900">${COPY.fit.closing}</p>
    </div>
  </section>`;

/* ═══════════════ 05 · THE REAL REPORT ═══════════════ */
const section5 = () => `  <!-- ================= 05 · WHAT YOU GET — THE PLAGIARISMSEARCH REPORT =================
       The approved report (build/report.js), semantics untouched, on a light ground so
       the page keeps one dark act. Under it, the three things the report lets you do and
       the one sentence it must not be mistaken for. -->
  <section id="report" data-component="report-light" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10 lg:mb-12">
${eyebrow('orange-500', COPY.report.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.report.h2}</h2>
        <p class="${INTRO} max-w-[72ch]">${COPY.report.intro}</p>
      </div>

      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-50 ring-1 ring-black/5 p-3 sm:p-4 lg:p-5">
        <div data-report class="grid lg:grid-cols-[1fr_360px] gap-3 sm:gap-4 lg:gap-5 items-stretch">
          <div class="relative min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden ring-1 ring-black/5 shadow-diffuse">
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

          <div class="flex flex-col min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden ring-1 ring-black/5 shadow-diffuse">
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
      </div>

      <div class="mt-8 sm:mt-10 grid lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-10 items-stretch">
        <ul class="rv-kids grid sm:grid-cols-3 gap-5 sm:gap-6">
${COPY.report.points.map(([head, body], i) => `          <li>
            ${chip(['orange', 'teal', 'ink'][i], [I.text, I.link, I.pointer][i])}
            <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mt-4 mb-1.5">${head}</h3>
            <p class="${BODY} text-ink-600">${body}</p>
          </li>`).join('\n')}
        </ul>
        <div class="rv rounded-3xl sm:rounded-4xl bg-orange-50 ring-1 ring-orange-200 p-6 sm:p-7 flex items-center gap-4">
          ${chip('orange', I.info)}
          <p class="text-[16px] sm:text-[17.5px] lg:text-[19px] font-bold tracking-tight leading-snug text-ink-900">${COPY.report.callout}</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · SOURCES & SETTINGS ═══════════════ */
const section6 = () => `  <!-- ================= 06 · WHAT PLAGIARISMSEARCH CHECKS AGAINST =================
       Heading left, the four collections as one list on the right — a definition list in
       a double-bezel card, not four cards — and the boundary line as the card's footer:
       these are ours, they are not Turnitin's. -->
  <section id="sources-and-settings" data-component="source-list" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('teal-400', COPY.sources.eyebrow)}
          <h2 class="${H2}">${COPY.sources.h2}</h2>
          <p class="${INTRO}">${COPY.sources.intro}</p>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl overflow-hidden">
            <dl class="divide-y divide-ink-100">
${COPY.sources.items.map(([head, body], i) => `              <div class="flex items-start gap-4 sm:gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:px-7">
                ${chip(['teal', 'orange', 'ink', 'mint'][i], [I.globe, I.database, I.archive, I.sliders][i])}
                <div class="min-w-0">
                  <dt class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight text-ink-900">${head}</dt>
                  <dd class="${BODY} text-ink-600 mt-1 max-w-[62ch]">${body}</dd>
                </div>
              </div>`).join('\n')}
            </dl>
            <p class="flex items-start gap-3 px-5 py-4 sm:px-6 sm:py-5 lg:px-7 bg-ink-900 text-white text-[14px] sm:text-[15px] font-semibold leading-relaxed">
              <span class="mt-0.5 shrink-0">${ico(I.info, '#6ED7E8', 18)}</span>
              <span>${COPY.sources.boundary}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · AI, COMPACT ═══════════════ */
const section7 = () => `  <!-- ================= 07 · AI WRITING IS A SEPARATE CHECK =================
       Compact: one card, two halves of equal weight — what PlagiarismSearch does, what
       Turnitin documents — with the official guide cited on Turnitin's half and one quiet
       link to the AI owner on ours. -->
  <section id="ai-writing" data-component="split-card" class="relative py-12 sm:py-14 lg:py-16 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-7 sm:mb-8 lg:mb-10">
        <h2 class="${H2}">${COPY.ai.h2}</h2>
      </div>
      <div class="rv rounded-3xl sm:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="rounded-[18px] sm:rounded-3xl bg-white shadow-inner-hl overflow-hidden grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-100">
          <div class="p-5 sm:p-6 lg:p-7 flex flex-col">
            <p class="${LABEL_CLS} text-ink-500 mb-3">PlagiarismSearch</p>
            <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-700 mb-5">${COPY.ai.ps}</p>
            <div class="mt-auto">${linkQuiet(COPY.ai.cta, COPY.ai.ctaHref)}</div>
          </div>
          <div class="p-5 sm:p-6 lg:p-7 flex flex-col">
            <p class="${LABEL_CLS} text-ink-500 mb-3">Turnitin®</p>
            <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-700 mb-5">${COPY.ai.tii}</p>
            <div class="mt-auto">${srcRef(5)}</div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · DATA HANDLING ═══════════════ */
const section8 = () => `  <!-- ================= 08 · WHAT HAPPENS TO YOUR DOCUMENT =================
       Three stations on one rail — the document, the report, Storage — each carrying its
       approved sentences whole. About PlagiarismSearch only: the page says nothing about
       how anyone else handles a paper. -->
${steps.section({
    id: 'your-document', layout: 'rail', marker: 'icon', bg: 'cool', space: 'md',
    head: { title: COPY.data.h2 },
    cols: 3,
    items: COPY.data.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'orange', 'ink'][i], icon: [I.file, I.report, I.archive][i] })),
    foot: { action: { label: COPY.data.cta, href: COPY.data.ctaHref, tone: 'light' } },
  })}`;

/* ═══════════════ 09 · SELF-SERVICE PRICING ═══════════════ */
const section9 = () => `  <!-- ================= 09 · SELF-SERVICE PRICING =================
       A real preview, because buying directly is part of the comparison and this URL
       already converts: the homepage's widget shell and its period switcher, reading
       build/pricing-data.js. PLACEHOLDER figures — production values are backend-driven —
       and only PlagiarismSearch prices: no Turnitin number, no "cheaper". -->
  <section id="pricing" data-component="pricing-preview" data-pricing="onetime" data-pricing-animate class="relative py-16 sm:py-24 lg:py-28 bg-ink-50 overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_.8fr] gap-6 lg:gap-14 items-end mb-8 sm:mb-10 lg:mb-12">
        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.pricing.eyebrow)}
          <h2 class="${H2}">${COPY.pricing.h2}</h2>
          <p class="${INTRO} max-w-[64ch]">${COPY.pricing.intro}</p>
        </div>
        <p class="rv flex items-start gap-3 rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 px-5 py-4 sm:px-6 sm:py-5 ${BODY} text-ink-800 font-semibold">
          <span class="mt-0.5 shrink-0">${ico(I.sparkles, '#DC5A45', 17)}</span>
          <span>${COPY.pricing.free}</span>
        </p>
      </div>

      <div class="rv flex mb-7 sm:mb-8 lg:mb-10">
        <div class="inline-flex items-center rounded-full bg-ink-100 p-1 max-w-full overflow-x-auto" role="group" aria-label="Billing period">
          ${[['onetime', 'One-time'], ['monthly', 'Monthly'], ['quarterly', '3-Months'], ['yearly', 'Yearly']]
            .map(([k, label]) => `<button type="button" data-period="${k}" aria-pressed="${k === 'onetime'}" class="period-btn whitespace-nowrap rounded-full px-3.5 sm:px-5 lg:px-6 py-2.5 text-[13px] sm:text-[13.5px] font-semibold text-ink-500${k === 'onetime' ? ' active' : ''}">${label}</button>`)
            .join('\n          ')}
        </div>
      </div>

      <div class="rv grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch mb-8 sm:mb-10">
        ${['light', 'standard', 'premium'].map(tier => `<div data-tier="${tier}" class="rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <span class="text-[11px] font-bold tracking-[0.16em] uppercase text-orange-600 mb-1.5">${tier}</span>
          <div class="text-[13.5px] text-ink-500 mb-4 sm:mb-5">${TAGLINE[tier]}</div>
          <div class="flex items-end gap-1.5 mb-3">
            <span class="text-[29px] sm:text-[32px] lg:text-[38px] font-extrabold tracking-tightest leading-none nums js-price">${PLANS.onetime[tier].price}</span>
            <span class="text-[12.5px] font-medium text-ink-400 pb-1.5 js-term">${PLANS.onetime.term}</span>
          </div>
          <div class="self-start inline-flex items-center rounded-full bg-ink-50 text-ink-500 px-3 py-1 text-[11.5px] font-bold nums mb-5 sm:mb-6"><span class="js-rate">${PLANS.onetime[tier].rate}</span>&nbsp;/ 1,000 words</div>
          <div class="h-px bg-ink-100 mb-5 sm:mb-6"></div>
          <ul class="space-y-3 text-[13.5px] font-medium text-ink-700 mb-6 sm:mb-7 js-feats">${pricing.feats(PLANS.onetime[tier].feats, pricing.LINES.tick)}</ul>
          <a href="${COPY.pricing.ctaHref}" class="btn-press mt-auto block text-center rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[13.5px] sm:text-[14.5px] font-semibold py-3 transition-colors duration-300">Start ${LABEL[tier]}</a>
        </div>`).join('\n        ')}
      </div>

      <div class="rv">${btnLight(COPY.pricing.cta, COPY.pricing.ctaHref)}</div>
      ${pricing.template(pricing.LINES.tick)}
      ${pricing.island()}
    </div>
  </section>`;

/* ═══════════════ 10 · FAQ ═══════════════ */
const section10 = () => `  <!-- ================= 10 · FAQ =================
       Nine questions, the confusion ones first, every answer in the HTML. The answer about
       buying Turnitin directly is followed by the official purchase guide. -->
${faq.section({
  id: 'turnitin-alternative-faq', ns: 'turnitin-alternative-faq', bg: 'white', space: 'md', layout: 'fluid',
  head: { eyebrow: 'Questions', title: COPY.faq.h2 },
  rich: true,
  items: COPY.faq.items.map(([q, a, n]) => ({ q, a,
    link: n ? { label: 'Official Turnitin guide: ' + SOURCES[n - 1][0], href: SOURCES[n - 1][1], target: '_blank', rel: 'noopener noreferrer', icon: extIcon } : null })),
})}`;

/* ═══════════════ 11 · FINAL CTA ═══════════════ */
const section11 = () => `  <!-- ================= 11 · FINAL CTA =================
       The closing band (build/sections/cta-band.js). One action, back to the one real checker — and the
       support line says once more what the result is and is not. -->
${cta.section({
  id: 'independent-cta',
  title: COPY.close.h2, ring: 'independent',
  lead: COPY.close.support, measure: '62',
  actions: { layout: 'stack', button: { label: COPY.close.primary, href: ANCHOR }, hint: COPY.close.micro },
})}`;

/* ═══════════════ 12 · THE FULL TRADEMARK NOTICE ═══════════════ */
const section12 = () => `  <!-- ================= 12 · TRADEMARK NOTICE =================
       In the page body, above the footer, at a size a person can read. It is the last
       word, not the only one: the hero and the comparison have already said it. -->
  <section id="trademark-notice" data-component="notice" class="relative py-8 sm:py-10 bg-white border-t border-ink-100" aria-label="${COPY.notice.label}">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid md:grid-cols-[200px_1fr] gap-3 md:gap-10">
        <p class="${LABEL_CLS} text-ink-500 md:pt-0.5">${COPY.notice.label}</p>
        <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600 max-w-[96ch]">${COPY.notice.text}</p>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js). The components' CSS and JS live in
   build/assets/ (site.css, site.js); the page carries none of its own.
   ───────────────────────────────────────────────────────────────────────────── */
const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12];

const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
