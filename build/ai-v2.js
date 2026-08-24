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
    /* All five required states ship in the HTML. They are the product's real
       vocabulary, and the brief forbids plagiarism status strings anywhere in the
       AI flow — keeping them here, visible to the checker, is how that stays true. */
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
      ['AI Probability', 'The percentage likelihood that the analyzed text, considered as a whole, was AI-generated.', 'Document-level likelihood', '[REAL AI PROBABILITY]'],
      ['Total AI Rate', 'The share of the document made up of passages flagged as AI-generated.', 'Share of flagged text', '[REAL TOTAL AI RATE]'],
      ['Highlighted passages', 'See where AI-writing signals appear in the document. Individual highlighted sentences or passages can show their own AI probability.', 'Location and passage-level signal', '[REAL PASSAGE-LEVEL AI PROBABILITY]'],
    ],
    callout: [
      'AI Probability and Total AI Rate are not the same metric. AI Probability describes the document-level likelihood. Total AI Rate describes how much of the document is contained in passages flagged as AI-generated.',
      'These values are detection indicators, not proof of authorship.',
    ],
  },

  s3: {
    h2: 'Check AI-written text in complete documents',
    intro: 'Paste text directly into the AI checker for a quick analysis, or upload a document when you want to review the text from a complete file. Document upload makes it easier to check longer essays, reports, articles, and other written work without copying the entire text into the editor.',
    blocks: [
      ['Paste text', 'Use the editor when the text is already available to copy and paste. Pasted text must contain at least 100 characters.'],
      ['Upload a document', 'Upload a supported document and let PlagiarismSearch extract the readable text for AI analysis.'],
      ['Give the detector enough context', 'For a more reliable result, we recommend checking at least 150–200 words whenever possible. Longer samples give the detector more context than very short excerpts.'],
      ['Check text in different languages', 'PlagiarismSearch can process text in any language. Detection accuracy is highest in English, so results in other languages should be interpreted with that limitation in mind.'],
    ],
  },

  s4: {
    h2: 'Use AI detection as a signal, not a verdict',
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
    body: [
      'AI checking is available through the same PlagiarismSearch API infrastructure used for the main service. It is not a separate AI API product.',
      'AI checks use AI-specific checking limits or credits within the API workflow. Use the main PlagiarismSearch API page to review current access options and implementation details.',
    ],
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
    planCta: 'Choose plan',
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

          <div class="flex flex-wrap gap-2 mb-4 lg:mb-5">
${COPY.s1.inputs.map(i => `            <button type="button" class="qc-chip">${
  i.icon === 'brand'
    ? `<img src="assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="w-[14px] h-[14px] sm:w-4 sm:h-4 shrink-0">`
    : `<svg class="w-[14px] h-[14px] sm:w-4 sm:h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`
}${i.label}</button>`).join('\n')}
          </div>

          <div class="flex items-center justify-between gap-4 sm:gap-6 pt-4 border-t border-ink-100">
            <a href="#ai-pricing" class="text-[13px] sm:text-[13.5px] font-semibold text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.secondary}</a>
            <a href="#ai-report" class="btn-press group shrink-0 flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
              ${COPY.s1.cta}
              <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
            </a>
          </div>
        </form>
      </div>

      <!-- the states the real flow uses, rendered so they cannot silently drift -->
      <div class="rv max-w-[860px] mx-auto mt-4 sm:mt-5">
        <details class="rounded-2xl bg-white/70 ring-1 ring-black/5 px-4 py-3">
          <summary class="text-[12.5px] font-semibold text-ink-600 cursor-pointer">Checker states</summary>
          <ul class="mt-3 space-y-2">
${COPY.s1.states.map(([k, v]) => `            <li class="flex gap-3 text-[12.5px] leading-relaxed"><span class="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400"></span><span class="text-ink-600"><span class="font-semibold text-ink-900">${k}</span> — ${v}${k === 'insufficient' ? ` <a href="#ai-pricing" class="underline decoration-ink-300 underline-offset-2 font-semibold text-ink-700">${COPY.s1.insufficientCta}</a>` : ''}</span></li>`).join('\n')}
          </ul>
        </details>
      </div>

      <!-- Registration is where the free AI allowance begins. "Do not promise an
           anonymous free AI scan" — so this sits under the tool as the next step,
           not as a badge on it. -->
      <div class="rv max-w-[860px] mx-auto mt-4 sm:mt-5 rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div class="min-w-0 flex-1">
          <h2 class="text-[15px] sm:text-[16px] font-bold tracking-tight mb-1.5">${COPY.s1.reg.heading}</h2>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${COPY.s1.reg.copy}</p>
        </div>
        <div class="shrink-0 flex flex-col items-start sm:items-end gap-2">
          ${btnDark(COPY.s1.reg.cta, 'account.html')}
          <a href="account.html" class="text-[12.5px] font-semibold text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.reg.secondary}</a>
        </div>
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

       Every value is a placeholder. DEC-0038 requires a real approved AI-only report
       state as the visual source of truth and forbids inventing values, colours,
       thresholds or interactions — and that asset has not been supplied. So the demo
       shows the three-layer structure and the highlight mechanic, and nothing that
       could be mistaken for a result: the metric slots wear .ph-dark chrome around
       [REAL …] tokens, and the document body is set in Flow Circular, which renders
       text as redacted bars rather than sentences.

       No plagiarism metric appears anywhere in this section. check-ai.js asserts it. -->
  <section id="ai-report" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:900px;height:820px;left:-16%;top:-300px;background:rgba(44,195,219,.20)"></div>
    <div class="orb absolute" style="width:720px;height:700px;right:-14%;bottom:-320px;background:rgba(154,106,222,.18)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12 lg:mb-14 text-white">
${eyebrowDark('teal-400', 'The report')}
        ${h2(COPY.s2.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[70ch]">${COPY.s2.intro}</p>
      </div>

      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-8 items-start">

        <!-- the three layers, in the approved order: document → amount → location -->
        <div class="rv-kids space-y-4 sm:space-y-5">
${COPY.s2.metrics.map(([label, def, sup, token], i) => `          <div class="rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6">
            <div class="flex items-start justify-between gap-4 mb-2">
              <div class="min-w-0">
                <span class="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45 mb-1.5">0${i + 1} · ${sup}</span>
                <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight text-white">${label}</h3>
              </div>
              <span class="shrink-0">${phDark(token)}</span>
            </div>
            <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-white/65 max-w-[52ch]">${def}</p>
          </div>`).join('\n')}
        </div>

        <!-- the document panel: real mechanic, no invented content -->
        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white/[.05] ring-1 ring-white/10 p-1.5 sm:p-2">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white p-5 sm:p-6 lg:p-7">
            <div class="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-ink-100">
              <span class="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-400">AI report</span>
              <span class="text-[12px] font-semibold text-ink-500">Highlighted passages</span>
            </div>

            <!-- Flow Circular renders these as redacted bars. The two marked spans carry
                 the real highlight treatment, so the mechanic reads at a glance while
                 the text itself stays unmistakably placeholder. -->
            <p class="font-flow text-[15px] leading-[2] text-ink-300 select-none" aria-hidden="true">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed
              <span class="hl-ai on-ai">do eiusmod tempor incididunt ut labore et dolore magna</span>
              aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut
              <span class="hl-ai on-ai">aliquip ex ea commodo consequat duis aute irure</span>
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p class="sr-only">Placeholder document body. The approved AI-only report state has not yet been supplied.</p>

            <div class="mt-5 pt-4 border-t border-ink-100 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span class="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-600">
                <span class="w-3 h-3 rounded-[4px]" style="background:rgba(154,106,222,.35)"></span>
                Passage flagged as AI-generated
              </span>
              <span class="text-[12px] text-ink-400">Passage-level signal ${ph('[REAL PASSAGE-LEVEL AI PROBABILITY]')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- the critical interpretation callout -->
      <div class="rv mt-8 sm:mt-10 lg:mt-12 rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6 lg:p-7 max-w-[92ch]">
${COPY.s2.callout.map((p, i) => `        <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed ${i === 0 ? 'text-white/80 mb-3' : 'text-white font-semibold'}">${p}</p>`).join('\n')}
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
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Documents')}
        ${h2(COPY.s3.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s3.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
${COPY.s3.blocks.map(([head, body], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-ink-50 p-5 sm:p-6 lg:p-7">
          <span class="block text-[11px] font-semibold tabular-nums text-ink-400 mb-3">0${i + 1}</span>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600 max-w-[54ch]">${body}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · RESPONSIBLE INTERPRETATION ═══════════════ */
const section4 = () => `  <!-- ================= 04 · RESPONSIBLE INTERPRETATION =================
       The 70% callout is the sharpest sentence on the page and the one most likely to
       be softened by a layout, so it gets its own plate rather than a line of body. -->
  <section id="interpret-ai-results" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50 overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">
        <div class="rv">
${eyebrow('orange-500', 'Interpretation')}
          ${h2(COPY.s4.h2)}
        </div>

        <div class="rv space-y-4 lg:space-y-5">
${COPY.s4.body.map(p => `          <p class="text-[14px] sm:text-[15px] leading-relaxed text-ink-600 max-w-[68ch]">${p}</p>`).join('\n')}

          <div class="rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
            <div class="flex items-start gap-4">
              <span class="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              </span>
              <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-900 font-semibold max-w-[60ch]">${COPY.s4.callout}</p>
            </div>
          </div>

          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500 max-w-[68ch]">${COPY.s4.consequential}</p>
        </div>
      </div>
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

      <div class="rv max-w-[1000px] mx-auto mt-6 lg:mt-8 rounded-3xl bg-ink-50 p-6 sm:p-7 lg:p-8 text-center">
${COPY.s5.core.map((p, i) => `        <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed ${i === 0 ? 'text-ink-900 font-semibold mb-2.5' : 'text-ink-600'} max-w-[76ch] mx-auto">${p}</p>`).join('\n')}
        <div class="mt-5 lg:mt-6">${btnDark(COPY.s5.cta, COPY.s5.ctaHref)}</div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · DATA HANDLING / REPORT LIFECYCLE ═══════════════ */
const section6 = () => `  <!-- ================= 06 · AI DATA HANDLING / REPORT LIFECYCLE =================
       The section that replaces the old page's "No data storage" card. What is true is
       narrower and it is said exactly: processed on our infrastructure, not sent to an
       external provider, report kept for convenience, deletable by the user. -->
  <section id="ai-data-handling" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50 overflow-hidden">
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
       The dark callout composition the brief encourages, rewritten to the approved
       semantics: the main API, not a separate AI API product, and no promise that
       every account has access. -->
  <section id="ai-api" class="relative py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-950 overflow-hidden relative p-7 sm:p-10 lg:p-14">
        <div class="orb absolute" style="width:620px;height:600px;right:-8%;top:-260px;background:rgba(44,195,219,.20)"></div>
        <div class="relative grid lg:grid-cols-[1.15fr_auto] gap-8 lg:gap-12 items-center">
          <div class="text-white max-w-[62ch]">
${eyebrowDark('teal-400', 'API')}
            ${h2(COPY.s7.h2)}
${COPY.s7.body.map((p, i) => `            <p class="mt-${i === 0 ? '4 lg:mt-5' : '3'} text-[14px] sm:text-[15px] leading-relaxed text-white/70">${p}</p>`).join('\n')}
          </div>
          <div class="shrink-0">${btnLight(COPY.s7.cta, COPY.s7.ctaHref)}</div>
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
  <section id="ai-pricing" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50 overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[720px] mx-auto mb-10 sm:mb-12">
${eyebrow('orange-500', 'AI pricing')}
        ${h2(COPY.s8.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s8.intro}</p>
        <p class="mt-3 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500">${COPY.s8.free}</p>
      </div>

      <div class="rv-kids grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-[1100px] mx-auto">
${COPY.s8.groups.map(([billing, rows]) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <div class="flex items-baseline justify-between gap-3 mb-4 lg:mb-5">
            <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight">${billing}</h3>
            <span class="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-400">AI words</span>
          </div>
          <ul class="flex-1 divide-y divide-ink-100">
${rows.map(([words, price]) => `            <li class="flex items-baseline justify-between gap-4 py-3">
              <span class="text-[14.5px] sm:text-[15px] font-bold tracking-tight tabular-nums">${words}</span>
              <span class="text-[13.5px] sm:text-[14px] font-semibold text-ink-600 tabular-nums">${price}</span>
            </li>`).join('\n')}
          </ul>
          <a href="account.html" class="btn-press mt-5 lg:mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] font-semibold px-5 py-2.5">${COPY.s8.planCta}</a>
        </div>`).join('\n')}
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
              <button type="button" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
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
       So both actions are anchors back up the page, not a new input. -->
  <section id="ai-final-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden bg-[#F2FCFC]">
    <div class="orb absolute" style="width:1000px;height:940px;left:-20%;top:-460px;background:rgba(243,111,90,.22)"></div>
    <div class="orb absolute" style="width:880px;height:860px;right:-16%;bottom:-420px;background:rgba(13,168,194,.16)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <div class="rv max-w-[720px] mx-auto">
        ${h2(COPY.s10.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[16px] leading-relaxed text-ink-600">${COPY.s10.support}</p>
        <div class="mt-7 lg:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          ${btnDark(COPY.s10.cta, '#ai-checker')}
          <a href="#ai-pricing" class="text-[13.5px] sm:text-[14px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s10.secondary}</a>
        </div>
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
