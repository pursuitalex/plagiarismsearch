/* Generate site/ai-detector-v2.html — the DEC-0038 AI Detector page.

   Same shape as build/home-v2.js, for the same reason: the approved baseline is the
   source of copy, so every string the brief fixes is held in COPY below verbatim and
   can be diffed against the brief line by line instead of hunted through markup.

   Two things about this page are unlike the homepage.

   The report demo has no approved asset yet. DEC-0038 makes the real AI-only report
   screenshot mandatory for final QA and forbids inventing values, colours, thresholds
   or interactions in the meantime — so the demo here shows the STRUCTURE and nothing
   else: metric slots wearing .ph placeholder chrome around [REAL …] tokens, and a
   document body set in Flow Circular, which renders text as redacted bars. That is the
   honest version of "show the mechanic without fabricating the content", and it is
   deliberately impossible to mistake for a finished report. build/check-ai.js prints
   the outstanding placeholders on every run.

   The old ai-detector.html is left alone. It carries eight separate forbidden claims
   and every one of its content blocks is on the brief's reject list, so this is a new
   file beside it rather than an edit — the index-v2.html precedent, and the same
   reason: nothing is retired until Olex accepts the replacement.

   Run:  node build/ai-v2.js  →  node build/shell.js  →  node build/check-ai.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'ai-detector-v2.html';
const cta = require('./cta');   /* the closing band — recipe and reasoning live there */

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — DEC-0038, 2026-08-22. Verbatim.

   Destinations note: the brief names production routes. The prototype keeps flat
   filenames and URLS.md holds the mapping, so /  → index.html, /policy → policy.html,
   /plagiarism-api → api.html, and the signup/login flow → account.html, which is how
   every other page in this prototype spells the shared auth action. /faq-and-support
   has no page here and is a live production URL, so it is linked absolutely — the
   same treatment user-manuals.html gives the guides that still live on production.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'AI Detector &amp; AI Checker for Documents | PlagiarismSearch',
  meta: 'Paste text or upload a document to check for AI-written content. Review AI Probability, Total AI Rate, and highlighted passages in one report.',
  canonical: 'https://plagiarismsearch.com/ai-content-detector',

  s1: {
    h1: 'AI Detector for Text and Documents',
    support: 'Paste text or upload a document to review AI-writing signals in a report that separates overall AI likelihood from the share and location of flagged passages.',
    toolHeading: 'Paste text or upload a document',
    placeholder: 'Paste your text here…',
    guidance: 'Minimum: 100 characters. For a more reliable result, we recommend 150–200 words or more.',
    dropzone: 'Drag and drop a document here',
    uploadBtn: 'Upload file',
    inputs: [
      { label: 'Attach file', icon: 'lucide', path: '<path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/>' },
      { label: 'Dropbox',  icon: 'brand', file: 'dropbox.svg' },
      { label: 'OneDrive', icon: 'brand', file: 'onedrive.svg' },
      { label: 'By URL',   icon: 'lucide', path: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>' },
    ],
    cta: 'Check for AI',
    secondary: 'View AI pricing',
    /* All five required states ship in the HTML, hidden until their event fires.
       They are the product's real vocabulary and the brief forbids plagiarism status
       strings anywhere in the AI flow, so keeping them in the markup is how that stays
       checkable — but the 2026-08-25 batch is explicit that they are implementation
       states, not page content, and must never be listed for a reader. */
    states: [
      ['too-short',    'Please enter at least 100 characters or upload a document.'],
      ['unreadable',   'We couldn’t identify readable text in this file. Try another document or paste the text directly.'],
      ['processing',   'Analyzing your text for AI-writing signals…'],
      ['completed',    'Your AI report is ready.'],
      ['insufficient', 'You don’t have enough AI words for this check.'],
    ],
    insufficientCta: 'View AI pricing',
    reg: {
      heading: 'Create an account to run your AI check',
      copy: 'New accounts receive a one-time 1,000-word credit that can be used for AI or plagiarism checking.',
      cta: 'Create free account',
      secondary: 'Already have an account? Log in',
    },
    rail: [
      ['500,000+ users', 'Across PlagiarismSearch'],
      ['Processed on PlagiarismSearch infrastructure', 'Checked content is not sent to an external AI detector provider.'],
      ['Text or document', 'Paste text or upload a file for analysis.'],
    ],
  },

  s2: {
    h2: 'Understand your AI detection report',
    intro: 'A single percentage can be easy to misread. PlagiarismSearch separates the result into three levels so you can see what the detector says about the document as a whole, how much of the text is flagged, and where those signals appear.',
    metrics: [
      ['AI Probability', 'The percentage likelihood that the analyzed text, considered as a whole, was AI-generated.', 'Document-level likelihood'],
      ['Total AI Rate', 'The share of the document made up of passages flagged as AI-generated.', 'Share of flagged text'],
      ['Highlighted passages', 'See where AI-writing signals appear in the document. Individual highlighted sentences or passages can show their own AI probability.', 'Location and passage-level signal'],
    ],

    /* ── the report demo ──────────────────────────────────────────────────────
       Values are REAL, from the product state supplied with the 2026-08-25
       correction batch. The 2026-08-22 rule that forbade numbers was reversed by
       that batch: visible numeric report values are now required and bracket
       placeholders are banned from any user-facing build.

       These are sample OUTPUT values from one report. They are not an accuracy
       claim, and nothing on the page presents them as one.

       Label case follows the PRODUCT, not the brief — 'Total AI rate', not 'Total
       AI Rate' (DEC-U02). Inside the report the page is quoting an interface; in
       the explanations beside it, the approved title case is untouched. */
    report: {
      id: '#11549335',
      words: '1443',
      uploaded: 'Jul 21, 2026',
      totalLabel: 'Total AI rate',
      totalValue: '13.44%',
      probLabel: 'AI probability',
      probValue: '12.5%',
      tabs: ['Plagiarism', 'AI'],
      panelHeading: 'Report information',
      /* Demo document body, English (DEC-U01). Written for this mock, deliberately
         neutral: it is sample content, the way a screenshot's document would be, and
         it makes no claim about anything. `hl: true` marks a flagged passage. */
      doc: [
        [{ t: 'Urban transport planning has changed considerably over the past two decades. Cities that once measured success by road capacity now look at how many journeys can be completed without a car at all.' }],
        [{ t: 'Several factors contribute to this shift. ' },
         { t: 'The widespread adoption of integrated ticketing has made multi-modal journeys significantly more convenient for daily commuters, while real-time arrival data has reduced the perceived cost of waiting.', hl: true },
         { t: ' Local authorities have also revised how street space is allocated.' }],
        [{ t: 'Evidence from comparable programmes suggests the effects are cumulative rather than immediate. ' },
         { t: 'Sustained investment across a decade tends to produce more durable changes in travel behaviour than short-term interventions concentrated in a single corridor.', hl: true },
         { t: ' Measurement remains difficult, and results vary between districts.' }],
      ],
    },
    callout: [
      'AI Probability and Total AI Rate are not the same metric. AI Probability describes the document-level likelihood. Total AI Rate describes how much of the document is contained in passages flagged as AI-generated.',
      'These values are detection indicators, not proof of authorship.',
    ],
  },

  s3: {
    h2: 'Check AI-written text in complete documents',
    /* The document shown attached in the section's visual. Deliberately the same one
       the report demo reports on — 1,443 words is the figure in its Report information
       panel — so the page shows one document through two stages rather than two
       unrelated mocks. Mock UI content, not product copy. */
    file: { name: 'urban-transport-review.docx', words: '1,443 words' },
    intro: 'Paste text directly into the AI checker for a quick analysis, or upload a document when you want to review the text from a complete file. Document upload makes it easier to check longer essays, reports, articles, and other written work without copying the entire text into the editor.',
    /* head, body, Lucide path, bento span. The spans make this a bento rather than a
       grid of four identical tiles: the two ways INTO the checker are the wide pair,
       the two things to know about the sample are the narrow pair. */
    blocks: [
      ['Paste text', 'Use the editor when the text is already available to copy and paste. Pasted text must contain at least 100 characters.',
       '<path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2"/>', 'lg:col-span-3', 'teal'],
      ['Upload a document', 'Upload a supported document and let PlagiarismSearch extract the readable text for AI analysis.',
       '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>', 'lg:col-span-2', 'teal'],
      ['Give the detector enough context', 'For a more reliable result, we recommend checking at least 150–200 words whenever possible. Longer samples give the detector more context than very short excerpts.',
       '<line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/>', 'lg:col-span-2', 'ink'],
      ['Check text in different languages', 'PlagiarismSearch can process text in any language. Detection accuracy is highest in English, so results in other languages should be interpreted with that limitation in mind.',
       '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>', 'lg:col-span-3', 'ink'],
    ],
  },

  s4: {
    h2: 'Use AI detection as a signal, not a verdict',
    /* The reading order, from the 2026-08-25 batch § 6. Each label pairs a metric
       with the approved supporting label DEC-0038 already gives it, so the section
       teaches a sequence without introducing new terminology. */
    steps: [
      ['Document-level likelihood', 'Start with AI Probability.'],
      ['Share of flagged text', 'Compare Total AI Rate.'],
      ['Highlighted passages', 'Inspect the exact passages and context.'],
    ],
    body: [
      'AI detection estimates patterns associated with AI-generated writing. It cannot prove who wrote a text or, by itself, establish that a person used AI.',
      'Review the document-level AI Probability together with Total AI Rate and the highlighted passages. Looking at these signals together provides more context than relying on a single percentage.',
      'Short samples give the detector less context, which is why we recommend 150–200 words or more whenever possible.',
    ],
    callout: 'A 70% AI Probability does not mean that 70% of the text was written by AI. AI Probability describes the likelihood for the document as a whole. Use Total AI Rate to understand the share of text contained in passages flagged as AI-generated.',
    consequential: 'If an AI result is being considered in an academic or other consequential review, use the report as one source of evidence and consider the surrounding context before making a decision.',
  },

  s5: {
    h2: 'AI-generated text and plagiarism are different',
    intro: 'An AI detector and a plagiarism checker answer different questions.',
    ai: ['AI Detector', 'AI detection estimates whether writing shows patterns associated with AI generation and highlights the parts of the text that contribute to the result.'],
    plag: ['Plagiarism Checker', 'Plagiarism checking compares text with available sources to identify matching or similar passages for review.'],
    core: [
      'AI-generated text is not automatically plagiarism, and a matching source does not prove that AI was used.',
      'If you need both checks, run them as separate analyses and interpret each report according to what it measures.',
    ],
    cta: 'Check for plagiarism',
    ctaHref: 'index.html',
  },

  s6: {
    h2: 'Your AI check is processed on PlagiarismSearch infrastructure',
    intro: 'AI checks are processed on PlagiarismSearch infrastructure. Checked content is not sent to an external AI detector provider.',
    steps: [
      ['Submit', 'Paste text or upload a document for AI analysis.'],
      ['Process', 'The AI check runs on PlagiarismSearch infrastructure without sending the checked content to an external AI detector provider.'],
      ['Review or delete', 'The generated AI report may remain available in your account for convenience. You can permanently delete the report when you no longer need it.'],
    ],
    support: 'For broader information about account data and privacy practices, read the PlagiarismSearch Privacy Policy.',
    cta: 'Read the Privacy Policy',
    ctaHref: 'policy.html',
  },

  s7: {
    h2: 'Add AI detection to your own workflow',
    /* The two approved paragraphs, split at their own full stops so the layout can give
       each sentence the weight its job deserves. Nothing added, cut or reordered — and
       lead + note still read as one sentence pair in the rendered text, which is what
       check-ai.js asserts. */
    lead: 'AI checking is available through the same PlagiarismSearch API infrastructure used for the main service.',
    note: 'It is not a separate AI API product.',
    support: 'AI checks use AI-specific checking limits or credits within the API workflow. Use the main PlagiarismSearch API page to review current access options and implementation details.',
    /* one API, two analyses — and the two labels are the tabs the real report carries */
    branch: ['PlagiarismSearch API', [
      ['Plagiarism', "<path d=\"m8 11 2 2 4-4\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/>"],
      ['AI', "<path d=\"M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z\"/>"],
    ]],
    cta: 'Explore the PlagiarismSearch API',
    ctaHref: 'api.html',
  },

  s8: {
    h2: 'Choose an AI word package for your checking volume',
    intro: 'AI checking is priced by word allowance. Choose a one-time package or a recurring plan based on how much text you expect to analyze.',
    free: 'New accounts receive a one-time 1,000-word credit that can be used for AI checking.',
    /* DYNAMIC — "currently approved 2026-08-20 AI prices … Production pricing/billing
       data must come from the authoritative backend/source." Grouped by billing here;
       the grouping is layout, the eight rows and their values are the baseline. */
    groups: [
      ['One-time', [['10,000', '$4.95'], ['50,000', '$9.95']]],
      ['Monthly',  [['100,000', '$12.95/month'], ['300,000', '$25.95/month'], ['500,000', '$35.95/month']]],
      ['Yearly',   [['1,000,000', '$55.95/year'], ['3,000,000', '$125.95/year'], ['5,000,000', '$215.95/year']]],
    ],
    /* One short interface instruction, added by the 2026-08-25 batch § 10. */
    helper: 'Select an AI word allowance, then continue with the chosen package.',
    /* The CTA is built from the selection, so it always names what it buys. The batch
       gives the pattern: "Continue with 300,000 words". A generic label is only
       acceptable where a card holds exactly one package, and none here does. */
    planCtaPrefix: 'Continue with',
    planCtaSuffix: 'words',
  },

  s9: {
    h2: 'AI Detector FAQ',
    items: [
      ['What does AI Probability mean?', 'AI Probability is the percentage likelihood that the analyzed text, considered as a whole, was AI-generated. It is a document-level detection indicator. It does not represent the percentage of the document that was generated by AI, and it is not proof of authorship.'],
      ['What does Total AI Rate mean?', 'Total AI Rate is the share of the document made up of passages flagged as AI-generated. It complements AI Probability by showing how much of the text is contained in flagged passages rather than the overall likelihood for the document.'],
      ['Why can AI Probability and Total AI Rate be different?', 'They measure different things. AI Probability describes the likelihood that the document as a whole was AI-generated. Total AI Rate describes the amount of text contained in passages flagged as AI-generated. The two percentages therefore should not be expected to match.'],
      ['Does a high AI Probability prove that a text was written by AI?', 'No. AI detection is probabilistic. A high AI Probability means the detector found stronger AI-writing signals in the document, but it does not prove who wrote the text or establish by itself that AI was used. Review Total AI Rate, the highlighted passages, and the context of the document before drawing a conclusion.'],
      ['Can I upload a document instead of pasting text?', 'Yes. You can paste text directly into the AI checker or upload a supported document. PlagiarismSearch uses broad document-format support for uploaded files. If readable text cannot be extracted from a file, paste the text directly into the checker instead.'],
      ['How much text should I check?', 'Pasted text must contain at least 100 characters. For a more reliable AI detection result, we recommend checking at least 150–200 words whenever possible because a longer sample gives the detector more context.'],
      ['What languages can the AI detector check?', 'PlagiarismSearch can process text in any language. Detection accuracy is highest in English, so results for other languages should be interpreted with that limitation in mind.'],
      ['Is AI-generated text the same as plagiarism?', 'No. AI generation and plagiarism are different issues. AI detection looks for patterns associated with AI-generated writing. Plagiarism checking compares text with available sources to identify matching or similar passages. AI-generated text is not automatically plagiarism, and a source match does not prove that AI was used.'],
      ['What happens to my text and report after an AI check?', 'AI checks are processed on PlagiarismSearch infrastructure, and checked content is not sent to an external AI detector provider. Generated reports may remain available in your account for convenience, and you can permanently delete them. For broader information about account data and privacy practices, see the Privacy Policy.'],
      ['Is AI checking free?', 'New accounts receive a one-time 1,000-word credit that can be used for AI or plagiarism checking. This is not a recurring daily AI allowance. Additional AI checks use the AI word balance available with the selected package.'],
    ],
    footer: 'Still have a question about your account, reports, or AI checking?',
    cta: 'Visit the Help Center',
    ctaHref: 'https://plagiarismsearch.com/faq-and-support',
  },

  s10: {
    h2: 'Check your text for AI-writing signals',
    support: 'Paste text or upload a document to review AI Probability, Total AI Rate, and highlighted passages in one report.',
    cta: 'Start AI check',
    secondary: 'View AI pricing',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the site's, not a new one for this page.
   ───────────────────────────────────────────────────────────────────────────── */
const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const h2 = t => `<h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]">${t}</h2>`;
const lede = t => `<p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[70ch]">${t}</p>`;

const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/* Pen mark — DESIGN.md § Web build → Motion. The word colours in, then a hand-drawn
   underline draws beneath it. One per heading: it is emphasis, not decoration.

   Applied at render, not stored in COPY, so the approved H1 stays one plain diffable
   string. check-ai.js compares the H1 with tags stripped, so the wrap is invisible to it.

   The viewBox has to match the phrase: the existing marks run 120 units for an
   eight-character word and 180 for a ten, so the control points are proportions of the
   width rather than fixed numbers — "AI Detector" is eleven characters and gets 200. */
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* dark pill on light ground */
const btnDark = (label, href) => `<a href="${href}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;

/* light pill on dark ground */
const btnLight = (label, href) => `<a href="${href}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;

/* the quiet underlined editorial link */
const linkQuiet = (label, href, dark) => `<a href="${href}"${/^https?:/.test(href) ? ' rel="noopener"' : ''} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold ${dark ? 'text-white/70 hover:text-white decoration-white/30' : 'text-ink-500 hover:text-ink-900 decoration-ink-300'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

/* placeholder chrome — anything wearing this waits on the approved report asset */
const ph = t => `<span class="ph inline-block px-2 py-0.5 text-[12px] font-semibold tracking-tight text-ink-500">${t}</span>`;
const phDark = t => `<span class="ph-dark inline-block px-2 py-0.5 text-[12px] font-semibold tracking-tight text-white/60">${t}</span>`;

/* ═══════════════ 01 · HERO + REAL AI CHECKER ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO + REAL AI CHECKER =================
       "The real AI checker is the dominant above-the-fold product object." So the
       tool is the largest thing here and both ways in — paste and upload — are given
       equal weight: the drop zone is a full-width panel, not an icon beside the field.

       The five required tool states ship in the HTML rather than being built by script
       on demand. They are inert here (this is a prototype, and check.js requires the
       forms submit nowhere), but they are the states the real flow must use, and
       leaving them in the markup is what keeps a plagiarism status string from
       drifting back into the AI flow unnoticed. -->
  <section id="ai-checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 bg-[#F2FCFC] overflow-hidden">
    <div class="orb absolute" style="width:820px;height:760px;left:-14%;top:-380px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:680px;height:660px;right:-12%;top:-180px;background:rgba(243,111,90,.14)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[760px] mx-auto mb-8 sm:mb-10 lg:mb-12">
${eyebrow('teal-400', 'AI Detector')}
        <h1 class="text-[clamp(2.1rem,4.4vw,3.5rem)] font-extrabold tracking-tightest leading-[1.05] mb-4 lg:mb-5">${penMark(COPY.s1.h1, 'AI Detector')}</h1>
        <p class="text-[14.5px] sm:text-[15.5px] lg:text-[16px] leading-relaxed text-ink-600">${COPY.s1.support}</p>
      </div>

      <div class="rv max-w-[860px] mx-auto rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
        <form class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6" onsubmit="return false">

          <h2 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-3 lg:mb-4">${COPY.s1.toolHeading}</h2>

          <label for="aiText" class="sr-only">${COPY.s1.toolHeading}</label>
          <div class="relative mb-3">
            <textarea id="aiText" rows="4" class="qc-area block" placeholder="${COPY.s1.placeholder}"></textarea>
          </div>
          <p class="text-[12px] sm:text-[12.5px] text-ink-500 mb-4">${COPY.s1.guidance}</p>

          <!-- Inline validation, tied to the field it is about. role="alert" so a screen
               reader hears it when it appears rather than only on the next focus move. -->
          <p id="stTooShort" role="alert" hidden class="flex items-start gap-2 -mt-2 mb-4 text-[12.5px] font-medium text-orange-700">
            <svg class="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            ${COPY.s1.states[0][1]}
          </p>

          <!-- Upload is a peer of the editor, not a footnote to it: "File/document upload
               is visually prominent and not relegated to a minor icon." Below md there is
               no pointer to drag with, so the panel becomes a plain upload button. -->
          <div class="qc-drop flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-4 mb-3">
            <span class="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-black/5">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-[13.5px] font-bold tracking-tight"><span class="hidden md:inline">${COPY.s1.dropzone}</span><span class="md:hidden">${COPY.s1.uploadBtn}</span></span>
              <span class="block text-[12px] text-ink-500">PlagiarismSearch extracts the readable text for AI analysis.</span>
            </span>
            <button type="button" class="qc-chip shrink-0">${COPY.s1.uploadBtn}</button>
          </div>

          <!-- file error, tied to the upload area rather than the page -->
          <p id="stUnreadable" role="alert" hidden class="flex items-start gap-2 -mt-1 mb-3 text-[12.5px] font-medium text-orange-700">
            <svg class="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            ${COPY.s1.states[1][1]}
          </p>

          <div class="flex flex-wrap gap-2 mb-4 lg:mb-5">
${COPY.s1.inputs.map(i => `            <button type="button" class="qc-chip">${
  i.icon === 'brand'
    ? `<img src="assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="w-[14px] h-[14px] sm:w-4 sm:h-4 shrink-0">`
    : `<svg class="w-[14px] h-[14px] sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`
}${i.label}</button>`).join('\n')}
          </div>

          <div class="flex items-center justify-between gap-4 sm:gap-6 pt-4 border-t border-ink-100">
            <a href="#ai-pricing" class="text-[13px] sm:text-[13.5px] font-semibold text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.secondary}</a>
            <button type="submit" id="runCheck" class="btn-press group shrink-0 flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
              ${COPY.s1.cta}
              <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
            </button>
          </div>

          <!-- Run states. The checker itself changes; there is no separate page block,
               which is what the batch rules out. -->
          <p id="stProcessing" role="status" hidden class="flex items-center gap-2.5 mt-4 pt-4 border-t border-ink-100 text-[13px] font-semibold text-ink-700">
            <span class="w-3.5 h-3.5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" aria-hidden="true"></span>
            ${COPY.s1.states[2][1]}
          </p>
          <p id="stCompleted" role="status" hidden class="flex items-center gap-2.5 mt-4 pt-4 border-t border-ink-100 text-[13px] font-semibold text-mint-700">
            <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            ${COPY.s1.states[3][1]}
          </p>
          <div id="stBalance" role="alert" hidden class="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 pt-4 border-t border-ink-100 text-[13px] font-semibold text-orange-700">
            ${COPY.s1.states[4][1]}
            <a href="#ai-pricing" class="underline decoration-orange-300 underline-offset-4 hover:text-orange-800 transition-colors duration-300">${COPY.s1.insufficientCta}</a>
          </div>

          <!-- THE AUTH GATE. Not a second form and not a persistent card: it is a state of
               this card, revealed only when an unauthenticated visitor presses Check for AI.
               The copy is the approved copy, unchanged; only its display condition moved.
               Both actions go to the shared account route, the same one every other page
               in this prototype uses for the auth flow. -->
          <div id="authGate" hidden class="mt-4 pt-5 border-t border-ink-100">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div class="min-w-0 flex-1">
                <p class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight mb-1.5">${COPY.s1.reg.heading}</p>
                <p class="text-[13px] leading-relaxed text-ink-600">${COPY.s1.reg.copy}</p>
              </div>
              <div class="shrink-0 flex flex-col items-start sm:items-end gap-2">
                ${btnDark(COPY.s1.reg.cta, 'account.html')}
                <a href="account.html" class="text-[12.5px] font-semibold text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.reg.secondary}</a>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Compact product proof rail. Each item is one element in reading order so the
           approved sentence survives whole for a crawler and a screen reader. -->
      <div class="rv-kids max-w-[1000px] mx-auto mt-10 sm:mt-12 lg:mt-14 grid sm:grid-cols-3 gap-4 sm:gap-5">
${COPY.s1.rail.map(([head, sup]) => `        <div class="rounded-2xl bg-white/60 ring-1 ring-black/5 px-5 py-4">
          <p class="text-[13.5px] sm:text-[14px] font-bold tracking-tight mb-1">${head}</p>
          <p class="text-[12.5px] leading-relaxed text-ink-500">${sup}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · SIGNATURE: THE AI-ONLY REPORT ═══════════════ */
const section2 = () => `  <!-- ================= 02 · SIGNATURE: AI-ONLY REPORT + METRICS =================
       The page's whole argument: "do not win by claiming more certainty than
       competitors; win by showing the result more clearly."

       Rebuilt 2026-08-25. The previous version was a schematic — grey bars and bracket tokens
       tokens — which the correction batch called out as looking like a Figma placeholder
       rather than a product. It now reproduces the real report's own layout: readable
       document text with violet flagged passages on the left, the Report information
       panel with its two metrics and the Plagiarism / AI tab pair on the right.

       The split follows the batch: the report takes ~65% of the content width and the
       three metric explanations ~35%, so the evidence outweighs the commentary. It used
       to be the other way round.

       The Plagiarism tab label is present and that is a recorded deviation — see
       DECISIONS.md § DEC-U03. No plagiarism PERCENTAGE appears: the real panel carries
       only the two AI metrics, and the tabs switch the passage list, not the figures. -->
  <section id="ai-report" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:900px;height:820px;left:-16%;top:-300px;background:rgba(44,195,219,.20)"></div>
    <div class="orb absolute" style="width:720px;height:700px;right:-14%;bottom:-320px;background:rgba(154,106,222,.18)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12 lg:mb-14 text-white">
${eyebrowDark('teal-400', 'The report')}
        ${h2(COPY.s2.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[70ch]">${COPY.s2.intro}</p>
      </div>

      <div class="grid lg:grid-cols-[1.85fr_1fr] gap-6 lg:gap-8">

        <!-- the report itself — the dominant object in this section -->
        <div class="rv min-w-0 rounded-3xl sm:rounded-4xl bg-white/[.06] ring-1 ring-white/10 p-1.5 sm:p-2">
          <div class="min-w-0 rounded-[18px] sm:rounded-3xl bg-white overflow-hidden">

            <div class="grid sm:grid-cols-[1.5fr_1fr]">

              <!-- document -->
              <div class="min-w-0 p-4 sm:p-5 lg:p-6 border-b sm:border-b-0 sm:border-r border-ink-100">
                <div class="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-ink-100">
                  <span class="text-[11.5px] font-semibold text-ink-500 tabular-nums">${COPY.s2.report.id}</span>
                  <span class="text-[11px] text-ink-500 tabular-nums">Words: ${COPY.s2.report.words}</span>
                </div>
${COPY.s2.report.doc.map(para => `                <p class="text-[12.5px] sm:text-[13px] leading-[1.85] text-ink-700 mb-3.5">` +
  para.map(run => run.hl ? `<span class="hl-ai on-ai">${run.t}</span>` : run.t).join('') + `</p>`).join('\n')}
              </div>

              <!-- Report information -->
              <div class="min-w-0 p-4 sm:p-5 lg:p-6 bg-ink-50/60">
                <h3 class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight mb-4">${COPY.s2.report.panelHeading}</h3>

${[[COPY.s2.report.totalLabel, COPY.s2.report.totalValue, 13.44],
   [COPY.s2.report.probLabel, COPY.s2.report.probValue, 12.5]]
  .map(([label, value, pct]) => `                <div class="mb-4">
                  <div class="text-[12px] font-medium text-ink-600 mb-1.5">${label}</div>
                  <div class="flex items-center gap-3">
                    <div class="flex-1 h-1.5 rounded-full bg-ink-200 overflow-hidden">
                      <div class="h-full rounded-full" style="width:${pct}%;background:#9A6ADE"></div>
                    </div>
                    <span class="shrink-0 text-[12.5px] font-semibold tabular-nums text-ink-900">${value}</span>
                  </div>
                </div>`).join('\n')}

                <div class="flex items-center gap-4 pt-3 mt-4 border-t border-ink-200">
${COPY.s2.report.tabs.map((t, i) => `                  <span class="text-[12.5px] font-semibold pb-1.5 ${i === 1 ? 'text-teal-700 border-b-2 border-teal-500' : 'text-ink-500'}">${t}</span>`).join('\n')}
                </div>

                <!-- the flagged passages, the same runs the document highlights -->
                <div class="mt-3 space-y-2.5">
${COPY.s2.report.doc.flat().filter(r => r.hl).map(r => `                  <p class="text-[11.5px] leading-relaxed text-ink-500 pb-2.5 border-b border-ink-100 last:border-0">${r.t}</p>`).join('\n')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- the three layers, compact: they explain the report, they do not compete with it -->
        <div class="rv-kids flex flex-col gap-3 sm:gap-4">
${COPY.s2.metrics.map(([label, def, sup], i) => `          <div class="flex-1 rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-4 sm:p-5">
            <span class="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/60 mb-1.5">0${i + 1} · ${sup}</span>
            <h3 class="text-[15px] sm:text-[16px] font-bold tracking-tight text-white mb-1.5">${label}</h3>
            <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-white/65">${def}</p>
          </div>`).join('\n')}
        </div>
      </div>

      <!-- The critical interpretation callout, as an informer rather than another card:
           icon chip, tinted ring, content offset beside it. Teal and an info mark —
           the coral warning triangle belongs to the interpretation section, which
           cautions rather than explains. -->
      <div class="rv mt-6 sm:mt-8 rounded-3xl bg-teal-400/[.07] ring-1 ring-teal-400/25 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ED7E8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </span>
        <div class="min-w-0">
${COPY.s2.callout.map((t, i) => `          <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed ${i === 0 ? 'text-white/80 mb-3' : 'text-white font-semibold'}">${t}</p>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · DOCUMENT / FILE CHECKING ═══════════════ */
const section3 = () => `  <!-- ================= 03 · DOCUMENT / FILE CHECKING =================
       An established organic wedge, so it gets a section of its own rather than a line
       in the hero. Four equal blocks, no keyword cards: "Do not turn this into
       repetitive AI detector for PDF / DOCX / PPT / students / teachers cards."
       No extension list either — the authoritative allow-list is not available. -->
  <section id="document-ai-checker" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center mb-10 sm:mb-12 lg:mb-16">

        <div class="rv lg:order-2">
${eyebrow('orange-500', 'Documents')}
          ${h2(COPY.s3.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s3.intro}</p>
        </div>

        <!-- Real product evidence, not a photograph. See the note in build/ai-v2.js.
             The filename and word count match the report demo below, so the two sections
             describe one document rather than two unrelated mocks. -->
        <div class="rv lg:order-1">
          <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
            <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6">

              <p class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight mb-4">${COPY.s1.toolHeading}</p>

              <!-- the drop zone in its attached state -->
              <div class="qc-drop flex items-center gap-3 sm:gap-4 px-4 py-3.5 mb-3">
                <span class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-black/5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-[13px] font-bold tracking-tight truncate">${COPY.s3.file.name}</span>
                  <span class="block text-[11.5px] text-ink-500 tabular-nums">${COPY.s3.file.words}</span>
                </span>
                <span class="shrink-0 w-7 h-7 rounded-full bg-ink-100 flex items-center justify-center" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </span>
              </div>

              <div class="flex flex-wrap gap-2 mb-4">
${COPY.s1.inputs.map(i => `                <span class="qc-chip">${
  i.icon === 'brand'
    ? `<img src="assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="w-4 h-4 shrink-0">`
    : `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`
}${i.label}</span>`).join('\n')}
              </div>

              <div class="flex items-center justify-between gap-4 pt-4 border-t border-ink-100">
                <span class="text-[13px] font-semibold text-ink-500">${COPY.s1.secondary}</span>
                <span class="flex items-center gap-2.5 rounded-full bg-ink-900 text-white text-[13.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
                  ${COPY.s1.cta}
                  <span class="hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
${COPY.s3.blocks.map(([head, body, icon, span, tint]) => {
  const wide = span === 'lg:col-span-3';
  const CHIP = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'] }[tint];
  return `        <div class="min-w-0 ${span} rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse spotlight">
          <div class="min-w-0 h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-7 lg:p-8 flex flex-col">
            <span class="inline-flex ${wide ? 'w-12 h-12' : 'w-11 h-11'} rounded-xl sm:rounded-[14px] lg:rounded-2xl ${CHIP[0]} items-center justify-center mb-4 sm:mb-5">
              <svg width="${wide ? 22 : 20}" height="${wide ? 22 : 20}" viewBox="0 0 24 24" fill="none" stroke="${CHIP[1]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            </span>
            <h3 class="${wide ? 'text-[19px] sm:text-[21px] lg:text-[22px]' : 'text-[17px] sm:text-[18px] lg:text-[19px]'} font-bold tracking-tight mb-2.5">${head}</h3>
            <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[52ch]">${body}</p>
          </div>
        </div>`;
}).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · RESPONSIBLE INTERPRETATION ═══════════════ */
const section4 = () => `  <!-- ================= 04 · RESPONSIBLE INTERPRETATION =================
       Recomposed 2026-08-25. It was a 50/50 split with a lone H2 on the left and three
       stacked paragraphs on the right — the batch called it sparse and disconnected, and
       it was: the most important sentence on the page sat as one card among equals.

       The section now has a job distinct from the report above it. The report answers
       'what are the three signals?'; this answers 'how do I use them?' — so it reads as
       a sequence: intro, three numbered steps, then the clarification as the thing the
       whole section builds to.

       The 70% sentence is the signature callout now, not a note beside paragraphs. The
       consequential-use note sits under it at lower priority, which is where the batch
       puts it. -->
  <section id="interpret-ai-results" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Interpretation')}
        ${h2(COPY.s4.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s4.body[0]}</p>
      </div>

      <!-- the reading order -->
      <div class="rv-kids grid sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8">
${COPY.s4.steps.map(([label, action], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
          <span class="inline-flex w-8 h-8 rounded-full bg-ink-900 text-white text-[12.5px] font-bold items-center justify-center tabular-nums mb-4">${i + 1}</span>
          <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-1.5">${label}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${action}</p>
        </div>`).join('\n')}
      </div>

      <!-- the sentence the section exists for -->
      <div class="rv rounded-3xl sm:rounded-4xl bg-ink-950 p-6 sm:p-8 lg:p-10 mb-5 lg:mb-6">
        <div class="flex flex-col sm:flex-row items-start gap-5 sm:gap-7">
          <span class="shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </span>
          <p class="text-[16px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight leading-[1.4] text-white max-w-[62ch]">${
            COPY.s4.callout.replace('A 70% AI Probability does not mean that 70% of the text was written by AI.',
              '<span class="text-orange-300">A 70% AI Probability does not mean that 70% of the text was written by AI.</span>')}</p>
        </div>
      </div>

      <!-- the remaining approved body, and the consequential-use note beneath it -->
      <div class="rv grid lg:grid-cols-2 gap-5 lg:gap-8">
${COPY.s4.body.slice(1).map(p => `        <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600">${p}</p>`).join('\n')}
      </div>
      <p class="rv mt-5 lg:mt-6 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500 max-w-[80ch]">${COPY.s4.consequential}</p>
    </div>
  </section>`;

/* ═══════════════ 05 · AI DETECTION VS PLAGIARISM ═══════════════ */
const section5 = () => `  <!-- ================= 05 · AI DETECTION VS PLAGIARISM =================
       Stated once, compactly, and this is the ONLY plagiarism cross-link in the body.
       "Do not spread plagiarism vocabulary through the AI page." -->
  <section id="ai-vs-plagiarism" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[720px] mx-auto mb-10 sm:mb-12">
        <div class="inline-flex items-center gap-2 rounded-full bg-ink-50 ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">Two different checks</span>
        </div>
        ${h2(COPY.s5.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s5.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-[1000px] mx-auto">
        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8">
          <span class="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6a6 6 0 1 0 6 6"/><circle cx="12" cy="12" r="1.5" fill="#0991A8"/></svg>
          </span>
          <h3 class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-2.5">${COPY.s5.ai[0]}</h3>
          <p class="text-[13.5px] sm:text-[14px] leading-relaxed text-ink-600 max-w-[52ch]">${COPY.s5.ai[1]}</p>
        </div>
        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8">
          <span class="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <h3 class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-2.5">${COPY.s5.plag[0]}</h3>
          <p class="text-[13.5px] sm:text-[14px] leading-relaxed text-ink-600 max-w-[52ch]">${COPY.s5.plag[1]}</p>
        </div>
      </div>

      <!-- Lead and support, split at the copy's own sentence boundary — see the note in
           build/ai-v2.js. The CTA needs something to sit under; two equal paragraphs
           gave it nothing. -->
      <div class="rv max-w-[1000px] mx-auto mt-6 lg:mt-8 rounded-3xl sm:rounded-4xl bg-ink-50 p-7 sm:p-9 lg:p-11 text-center">
        <p class="text-[19px] sm:text-[21px] lg:text-[23px] font-bold tracking-tight leading-[1.3] text-ink-900 mb-3 lg:mb-4">${
          COPY.s5.core[0].replace('not automatically plagiarism',
            '<span class="text-orange-600">not automatically plagiarism</span>')}</p>
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[62ch] mx-auto">${COPY.s5.core[1]}</p>
        <div class="mt-7 lg:mt-8 flex justify-center">${btnDark(COPY.s5.cta, COPY.s5.ctaHref)}</div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · DATA HANDLING / REPORT LIFECYCLE ═══════════════ */
const section6 = () => `  <!-- ================= 06 · AI DATA HANDLING / REPORT LIFECYCLE =================
       The section that replaces the old page's "No data storage" card. What is true is
       narrower and it is said exactly: processed on our infrastructure, not sent to an
       external provider, report kept for convenience, deletable by the user. -->
  <section id="ai-data-handling" class="relative py-16 sm:py-24 lg:py-32 bg-[#F2FCFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('teal-400', 'Data handling')}
        ${h2(COPY.s6.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s6.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${COPY.s6.steps.map(([head, body], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
          <span class="inline-flex items-center gap-2 mb-3">
            <span class="w-7 h-7 rounded-full bg-ink-900 text-white text-[12px] font-bold flex items-center justify-center tabular-nums">${i + 1}</span>
          </span>
          <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>

      <div class="rv mt-6 lg:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <p class="text-[13.5px] sm:text-[14px] leading-relaxed text-ink-600 max-w-[62ch]">${COPY.s6.support}</p>
        <span class="shrink-0">${linkQuiet(COPY.s6.cta, COPY.s6.ctaHref)}</span>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · AI THROUGH THE API ═══════════════ */
const section7 = () => `  <!-- ================= 07 · AI DETECTION THROUGH THE API =================
       A compact banner, not an act. This was a full dark section until the 2026-08-25
       batch cut it back: API is secondary here, and it was interrupting
       checker -> report -> understanding -> pricing.

       Reworked 2026-08-26: it was a heading and two paragraphs set at one size, one
       colour and one weight, which is why it read as a block of undifferentiated text.
       Now: eyebrow, a heading with room to breathe, a lead, the point of the section
       raised into a pill, the detail set quieter beneath it, then the CTA — and a small
       schematic that draws the sentence rather than repeating it.

       Not one word is rewritten. The approved sentences are split at their own full
       stops and given the weight each one's job deserves. -->
  <section id="ai-api" class="relative py-10 sm:py-12 lg:py-14 bg-white overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv rounded-3xl sm:rounded-4xl bg-ink-950 overflow-hidden relative px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div class="orb absolute" style="width:520px;height:500px;right:-6%;top:-220px;background:rgba(44,195,219,.18)"></div>
        <div class="relative grid lg:grid-cols-[1.4fr_1fr] gap-7 lg:gap-12 items-center">

          <div class="min-w-0 text-white">
        ${eyebrowDark('teal-400', 'API').replace('mb-4 sm:mb-5 lg:mb-6', 'mb-3.5')}
            <h2 class="text-[19px] sm:text-[21px] lg:text-[23px] font-bold tracking-tight leading-[1.25] mb-3">${COPY.s7.h2}</h2>
            <p class="text-[14px] sm:text-[15px] leading-relaxed text-white/80 max-w-[54ch]">${COPY.s7.lead}</p>
            <p class="inline-flex items-center gap-2 rounded-full bg-teal-400/10 ring-1 ring-teal-400/30 px-3.5 py-1.5 mt-3 text-[12.5px] sm:text-[13px] font-semibold text-teal-200">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>${COPY.s7.note}
            </p>
            <p class="mt-3.5 text-[13px] sm:text-[13.5px] leading-relaxed text-white/55 max-w-[58ch]">${COPY.s7.support}</p>
            <div class="mt-6">${btnLight(COPY.s7.cta, COPY.s7.ctaHref)}</div>
          </div>

          <div class="min-w-0 rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6" aria-hidden="true">
            <p class="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">${COPY.s7.branch[0]}</p>
            <div class="relative space-y-3 pl-6">
              <span class="absolute left-0 top-7 bottom-7 w-px bg-white/15"></span>
${COPY.s7.branch[1].map(([label, icon]) => {
  const ai = /^AI/.test(label);
  return `              <div class="relative flex items-center gap-3.5 rounded-2xl bg-white/[.06] ring-1 ring-white/10 px-4 py-3">
                <span class="absolute -left-6 top-1/2 w-5 h-px bg-white/15"></span>
                <span class="shrink-0 w-10 h-10 rounded-xl bg-white/[.07] ring-1 ring-white/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${ai ? '#F58971' : '#5AD3E4'}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
                </span>
                <span class="text-[12.5px] sm:text-[13px] font-semibold text-white/85 leading-snug">${label}</span>
              </div>`;
}).join('\n')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · AI PRICING ═══════════════ */
const section8 = () => `  <!-- ================= 08 · AI PRICING =================
       DYNAMIC. These are the approved 2026-08-20 values and they may be used in the
       prototype; production reads the authoritative backend. Grouped by billing —
       the grouping is layout, the eight rows and their values are the baseline.

       Pricing comes AFTER the product is understood, per the approved story. It is not
       the legacy "checker → pricing → advantages" order. -->
  <section id="ai-pricing" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[720px] mx-auto mb-10 sm:mb-12">
${eyebrow('orange-500', 'AI pricing')}
        ${h2(COPY.s8.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s8.intro}</p>
        <p class="mt-3 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500">${COPY.s8.free}</p>
        <p class="mt-4 text-[13px] sm:text-[13.5px] font-semibold text-ink-700">${COPY.s8.helper}</p>
      </div>

      <div class="rv-kids grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-[1100px] mx-auto">
${COPY.s8.groups.map(([billing, rows], g) => `        <fieldset class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col" data-group="${g}">
          <legend class="sr-only">${billing} AI word packages</legend>
          <div class="flex items-baseline justify-between gap-3 mb-4 lg:mb-5">
            <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight">${billing}</h3>
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">AI words</span>
          </div>
          <div class="flex-1 space-y-2">
${rows.map(([words, price], i) => `            <label class="pkg flex items-center gap-3 rounded-2xl px-3 py-3 cursor-pointer">
              <input type="radio" name="pkg-${g}" value="${words}" class="sr-only" ${i === 0 ? 'checked' : ''} data-words="${words}">
              <span class="pkg-dot shrink-0 w-[18px] h-[18px] rounded-full border-2 border-ink-300 flex items-center justify-center" aria-hidden="true"></span>
              <span class="text-[14.5px] sm:text-[15px] font-bold tracking-tight tabular-nums">${words}</span>
              <span class="ml-auto text-[13.5px] sm:text-[14px] font-semibold text-ink-600 tabular-nums">${price}</span>
            </label>`).join('\n')}
          </div>
          <a href="account.html" data-cta="${g}" data-prefix="${COPY.s8.planCtaPrefix}" data-suffix="${COPY.s8.planCtaSuffix}" class="btn-press mt-5 lg:mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] font-semibold px-5 py-2.5">${COPY.s8.planCtaPrefix} ${rows[0][0]} ${COPY.s8.planCtaSuffix}</a>
        </fieldset>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · FAQ ═══════════════ */
const section9 = () => `  <!-- ================= 09 · AI DETECTOR FAQ =================
       Every answer is in the rendered HTML, not fetched on click — the brief requires
       it and a crawler needs it. Ten questions, exactly the approved ten: no "what is
       AI" filler, no model-name keyword questions, no audience variations. -->
  <section id="ai-detector-faq" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Questions')}
          ${h2(COPY.s9.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] leading-relaxed text-ink-600">${COPY.s9.footer}</p>
          <div class="mt-5 lg:mt-6">${linkQuiet(COPY.s9.cta, COPY.s9.ctaHref)}</div>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.s9.items.map(([q, a], i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
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
       "Do not render a second checker form. The CTA returns the user to the real tool."
       So both actions are anchors back up the page, not a new input.

       The band is the shared closing CTA — dot field, two masked glows, hero-scale
       heading, one ring mark. Recipe and reasoning in build/cta.js.

       The ring goes round "AI-writing" because that is what this page is for, and it is
       ten characters — the length the loop was drawn for. No eyebrow chip: the homepage
       band has one ("Free check") but that is approved copy there, and inventing a label
       here would be new visible text the baseline does not carry. -->
  <section id="ai-final-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('ai-final-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.s10.h2, 'AI-writing')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[56ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.s10.support}</p>
      <div class="rv flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        <a href="#ai-checker" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/></svg>
          ${COPY.s10.cta}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <a href="#ai-pricing" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s10.secondary}</a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles. The donor head carries the design system, .faq-a, .faq-chev
   and the small-breakpoint overrides for .qc-area / .qc-chip; only what this page
   adds lives here.
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  /* [hidden] must actually hide. Tailwind's display utilities — .flex, .grid, .block —
     have the same specificity as the [hidden] attribute selector and come later in the
     sheet, so they win: a hidden paragraph carrying .flex still renders. Every
     visible on the default screen because of this, which is the exact defect the
     2026-08-25 batch exists to remove, reintroduced by the fix for it. */
  [hidden] { display: none !important; }

  /* Anchor landings clear the sticky header. Measured, not guessed: the header is
     fixed at top:20 and its bar ends at 76px, so a section arriving at offset 0 puts
     its own label underneath it. 100px leaves the H2 fully visible with air above.
     The batch is explicit that this is fixed at the anchor, never by changing section
     spacing globally. */
  section[id] { scroll-margin-top: 100px; }

  /* A visible focus ring on everything reachable by keyboard. :focus-visible rather
     than :focus, so a mouse press does not leave a ring behind. */
  a:focus-visible, button:focus-visible, summary:focus-visible,
  [tabindex]:focus-visible, input:focus-visible, textarea:focus-visible {
    outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  /* on ink, the teal ring is too close to the ground to read */
  .bg-ink-950 a:focus-visible, .bg-ink-950 button:focus-visible {
    outline-color: #6ED7E8; }
  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

  /* base rules for the checker — the shared head has only the small-breakpoint
     overrides, so without these the field ignores width:100% and the chips lose
     their pill (the same trap home-v2.js documents) */
  .qc-area { width:100%; border:0; outline:none; background:transparent; resize:none;
    font-size:15px; line-height:1.6; font-weight:500; color:#111827; }
  .qc-area::placeholder { color:#9CA3AF; font-weight:400; }
  .qc-chip { display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 14px;
    border-radius:9999px; background:#F1F2F6; color:#4B5563; font-size:12.5px; font-weight:600;
    transition:background-color .2s ease, color .2s ease; }
  .qc-chip:hover { background:#E5E7EB; color:#111827; }
  .qc-drop { border:1.5px dashed #A7E3ED; border-radius:16px; background:#F8FDFE;
    transition:border-color .2s ease, background-color .2s ease; }
  .qc-drop:hover { border-color:#2CC3DB; background:#F0FAFC; }

  /* AI highlight — violet, the product report's own colour coding, kept distinct from
     the orange used for plagiarism matches elsewhere on the site */
  .hl-ai { background:rgba(154,106,222,.22); border-radius:.35rem; padding:.05em .18em;
    margin:-.05em -.18em; box-shadow:inset 0 -2px 0 rgba(154,106,222,.5);
    box-decoration-break:clone; -webkit-box-decoration-break:clone; }
  .on-ai { color:#6D3FB0; }

  /* Flow Circular renders text as redacted bars — the honest stand-in for a document
     body we are not allowed to invent */
  .font-flow { font-family:'Flow Circular', cursive; }

  /* placeholder chrome — anything wearing this waits on the approved report asset */
  .ph { border:1px dashed rgba(16,24,40,.22); border-radius:.5rem; }
  .ph-dark { border:1px dashed rgba(255,255,255,.24); border-radius:.5rem; }

${cta.style('ai-final-cta')}
  /* the bento hover from the homepage capabilities grid */
  .spotlight { transition:transform .35s cubic-bezier(.32,.72,0,1), box-shadow .35s ease; }
  .spotlight:hover { transform:translateY(-4px); }
  @media (prefers-reduced-motion: reduce) { .spotlight { transition:none; } .spotlight:hover { transform:none; } }

  /* pricing package rows — a real selection, not decoration */
  .pkg { transition:background-color .2s ease, box-shadow .2s ease; }
  .pkg:hover { background:#F8F9FB; }
  .pkg:has(input:checked) { background:#E8F8FB; box-shadow:inset 0 0 0 1.5px #0CA9C3; }
  .pkg:has(input:checked) .pkg-dot { border-color:#0CA9C3; }
  .pkg:has(input:checked) .pkg-dot::after { content:''; width:8px; height:8px; border-radius:9999px; background:#0CA9C3; }
  /* the focus ring has to be on the label, since the input itself is visually hidden */
  .pkg:has(input:focus-visible) { box-shadow:inset 0 0 0 2px #0CA9C3, 0 0 0 3px rgba(12,169,195,.25); }

  /* pen mark — the reduced-motion fallback is mandatory, not optional: without it the
     emphasis simply vanishes for anyone who asked the site to stop moving */
  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour. Written out rather than sliced from another page — home-v2.js records
   what scraping someone else's <script> by indexOf costs.
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

  /* a grid of cards is read in order, so it should arrive in order */
  gsap.utils.toArray('.rv-kids').forEach(group => {
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .08,
      scrollTrigger: { trigger: group, start: 'top 80%' } });
  });

${cta.script}

  /* pen marks — the word colours in, then its underline draws. Marks in the first
     viewport wait out the reveal cascade; lower ones fire when scrolled to. */
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
})();
</script>
<script>
(() => {
  'use strict';

  /* The corrected checker flow, as far as a prototype can honestly show it.

     Under 100 characters the field objects, inline, where the text is. At or above it
     the auth gate opens — because this prototype has no session, and the approved
     behaviour for a visitor without one is exactly that. Nothing is submitted, so
     check.js's inert-form rule still holds.

     What is entered is preserved: the gate opens beneath the text, it does not replace
     the card. The batch asks for that explicitly. */
  const form = document.querySelector('#ai-checker form');
  const field = document.getElementById('aiText');
  const tooShort = document.getElementById('stTooShort');
  const gate = document.getElementById('authGate');

  if (form && field && tooShort && gate) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const short = field.value.trim().length < 100;
      tooShort.hidden = !short;
      gate.hidden = short;
      field.setAttribute('aria-invalid', String(short));
      (short ? field : gate.querySelector('a')).focus();
    });

    /* clear the objection as soon as the reason for it is gone */
    field.addEventListener('input', () => {
      if (!tooShort.hidden && field.value.trim().length >= 100) {
        tooShort.hidden = true;
        field.setAttribute('aria-invalid', 'false');
      }
    });
  }

  /* Pricing: the CTA must always name the package it buys. Radio semantics come from
     the markup — a keyboard user changes the selection with arrow keys and nothing here
     interferes; this only keeps the button label in step.

     The two words around the number are read off the button's own data attributes
     rather than baked into this script, so the approved copy stays in one place. */
  document.querySelectorAll('[data-group]').forEach(group => {
    const cta = group.querySelector('[data-cta]');
    if (!cta) return;
    group.addEventListener('change', () => {
      const on = group.querySelector('input:checked');
      if (!on) return;
      cta.textContent = [cta.dataset.prefix, on.dataset.words, cta.dataset.suffix].join(' ');
    });
  });

  /* FAQ: answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      const list = item.parentElement;
      list.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
      /* aria-expanded has to follow the visual state or a screen-reader user is told
         every answer is collapsed while looking at an open one */
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
/* "Self-canonical to /ai-content-detector. Do not redirect, canonicalize away or
   rename this URL." The prototype filename differs; the canonical does not. */
head = head.replace('<title>', '<link rel="canonical" href="' + COPY.canonical + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const sections = [section1, section2, section3, section4, section5,
                  section6, section7, section8, section9, section10];

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
            count(/<h2\b/g) + ' h2, ' + count(/class="faq-item/g) + ' faq items');
const pending = [...new Set(html.match(/\[REAL [A-Z\- ]+\]/g) || [])];
if (pending.length) console.log('  awaiting the approved report asset: ' + pending.join(' '));
