/* Generate site/api-v2.html — the DEC-0041 Plagiarism API page.

   Same shape as build/home-v2.js and build/ai-v2.js: approved copy in COPY, verbatim,
   diffable against the brief line by line.

   What makes this page different is the code. DEC-0041 gives it the status of a real
   product screenshot — highlight it, truncate it, animate the tabs, add a Copy control,
   but never invent or rename an endpoint, property, status, auth method or version. The
   old api.html got every one of those wrong: /api/v1 for /api/v3/reports/create, 201 for
   202, "callback" for callback_url, an invented report_url, and a Bearer literal nobody
   supplied. So the samples below are the brief's own, transcribed as line arrays rather
   than template literals — a trailing backslash inside a template literal is a line
   continuation and would silently eat the newline out of every curl command.

   P0 AUTH GATE: the Authorization line is the developer-supplied example. Basic and
   Bearer are both supported and Bearer is preferred, but the exact preferred public
   literal has not been given, and the brief forbids inferring it. When it arrives,
   replace that one line and nothing else.

   Run:  node build/api-v2.js  →  node build/shell.js  →  node build/check-api.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'api-v2.html';
const cta = require('./cta');   /* the closing band — recipe and reasoning live there */

const DOCS = 'https://plagiarismsearch.com/docs/';   /* live production, no page here */

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — DEC-0041, 2026-08-24. Verbatim.

   Destinations: /docs/ has no page in this prototype and is a live production URL, so
   it is linked absolutely — the treatment user-manuals.html gives the guides that still
   live on production. /prices, /terms-of-use and /policy exist here as flat filenames.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Plagiarism Checker API &amp; Integration | PlagiarismSearch',
  meta: 'Integrate plagiarism checking into your product with the PlagiarismSearch API. Send text, files, or URLs, configure search sources, and receive a webhook when the report is ready.',
  canonical: 'https://plagiarismsearch.com/plagiarism-api',

  s1: {
    eyebrow: 'REST API',
    h1: 'Plagiarism Checker API',
    support: 'Embed plagiarism checking into your product or workflow. Send text, documents, or public URLs, choose the search sources and scan settings you need, and receive a webhook when the report is ready.',
    primary: 'View API documentation',
    secondary: 'Request API access',
    rail: [
      ['REST API', 'Build plagiarism checking into your own application.'],
      ['Text, files &amp; URLs', 'Submit the content format your workflow already uses.'],
      ['Asynchronous webhooks', 'Receive a callback when the report has finished processing.'],
    ],
    /* Line arrays, not template literals — see the header note about trailing
       backslashes. Transcribed from the brief; nothing here is ours. */
    tabs: [
      { name: 'Request', lines: [
        'curl -X POST \\',
        "  'https://plagiarismsearch.com/api/v3/reports/create' \\",
        "  -H 'Content-Type: application/json' \\",
        "  -H 'Authorization: your:authorization_token_123' \\",
        "  -d '{",
        '    "callback_url": "https://your.app/plagiarismsearch/web-hook?id=100500",',
        '    "text": "Text to check for plagiarism."',
        "  }'",
      ], caption: null },
      { name: 'Response', lines: [
        '{',
        '  "status": true,',
        '  "version": "3.1.0",',
        '  "code": 202,',
        '  "data": {',
        '    "id": 100500,',
        '    "progress": 0.58,',
        '    "status": 1,',
        '    "status_label": "processing"',
        '  }',
        '}',
      ], caption: 'The API accepts the report and returns its ID while processing continues asynchronously.' },
      { name: 'Webhook', lines: [
        'curl -X POST \\',
        "  'https://your.app/plagiarismsearch/web-hook?id=100500' \\",
        "  -H 'Content-Type: application/json' \\",
        "  -d '{",
        '    "event": "report.checked",',
        '    "id": 100500,',
        '    "plagiarism": 20.20,',
        '    "status": 2,',
        '    "status_label": "checked",',
        '    "checked_words": 540,',
        '    "words": 628,',
        '    "links": {',
        '      "self": "https://plagiarismsearch.com/api/v3/reports/100500"',
        '    }',
        "  }'",
      ], caption: 'When the check is complete, PlagiarismSearch sends a report.checked event to the callback URL supplied with the request.' },
    ],
    codeLink: 'View the full API reference',
  },

  s2: {
    h2: 'Send text, documents, or public URLs',
    intro: 'Use the input method that fits the content already available in your system. Standard text and URL requests can use JSON, while document uploads use multipart form data.',
    items: [
      ['Text', 'Send text directly in a JSON request when the content already exists inside your product or workflow.', 'JSON',
       '<path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>'],
      ['Documents', 'Upload a supported document with multipart form data when the content you need to check is stored as a file.', 'Multipart upload',
       '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>'],
      ['Public URLs', 'Submit a public URL when the content you want to analyze is already available online.', 'URL input',
       '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>'],
    ],
  },

  s3: {
    h2: 'Configure each plagiarism check around your workflow',
    intro: 'Choose where the API searches and adjust the options that matter for each check instead of using the same scan configuration for every document.',
    items: [
      ['Search the web', 'Enable web plagiarism search when the submitted content should be compared with sources available on the web.', null, 'lg:col-span-3', '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>', 'teal'],
      ['Include the academic database', 'Add PlagiarismSearch’s academic database to the scan when academic source coverage matters.', '500M+ indexed academic texts', 'lg:col-span-2', '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>', 'teal'],
      ['Search your storage', 'Search personal or organization storage when those repositories and permissions are available to the API account. Submitted content can also be added to storage when that workflow is enabled.', null, 'lg:col-span-2', '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>', 'teal'],
      ['Exclude references and quoted content', 'Configure the check to exclude references and quoted or cited text when those parts should not affect the result.', null, 'lg:col-span-3', '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3 3 21"/><path d="M16 21h5v-5"/>', 'ink'],
      ['Control web and storage scope', 'Exclude specific URLs from web search and narrow storage searches with the filters available in the API request.', null, 'lg:col-span-3', '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>', 'ink'],
      ['Add AI analysis when needed', 'AI checking is available through the same PlagiarismSearch API infrastructure. AI analysis uses the AI word balance available to the account.', null, 'lg:col-span-2', '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>', 'orange'],
    ],
  },

  s4: {
    h2: 'How the PlagiarismSearch API workflow works',
    steps: [
      ['Submit', 'Send text or a public URL as JSON, or upload a document with multipart form data.'],
      ['Configure', 'Select the search sources and options required for the check and provide the callback_url where completion events should be sent.'],
      ['Process', 'The API creates the report and returns a 202 response with the report ID while plagiarism checking continues asynchronously.'],
      ['Receive', 'When processing is complete, PlagiarismSearch sends a report.checked webhook to your callback URL. Use the report ID and returned report link to continue the workflow inside your own system.'],
    ],
    /* The approved SUPPORTING CALLOUT, split at its own full stop. The lead carries
       the point of the section; the support explains the mechanism. Splitting a
       paragraph is layout, not rewriting — no word changes. */
    calloutLead: 'Your integration does not need to wait for the plagiarism check to finish before continuing other work.',
    calloutSupport: 'The initial response identifies the report, and the completion webhook tells your system when the check is ready.',
    /* the accented fragment, lifted out of the lead so the emphasis is a span rather
       than a second copy of the words */
    calloutAccent: 'does not need to wait',
  },

  s5: {
    h2: 'Use report status and result data in your own product',
    intro: 'The API gives your application the information needed to track a check from submission to completion without forcing users into a separate manual checking flow.',
    items: [
      ['Track the report', 'Use the report id, processing progress, status, and status_label returned by the API to identify the check and follow its current state.'],
      ['React when processing completes', 'The completion webhook identifies the checked report, returns its completion status and word counts, and includes a self link to the report resource.'],
      ['Continue with the result', 'Use the report resource and the current API response schema to bring the result data required by your workflow into your own application.'],
    ],
    cta: 'See the complete response schema',
  },

  s6: {
    h2: 'Build plagiarism checking into the workflow you already use',
    intro: 'The API is designed for systems that need plagiarism checking inside an existing product or document process rather than as a separate manual step.',
    items: [
      ['Education and LMS platforms', 'Add plagiarism checks to workflows that process academic documents or student submissions. Configure web, academic, and permitted storage sources according to the needs of the integration.', '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'],
      ['Publishing and content operations', 'Run plagiarism checks as part of an editorial or pre-publication workflow without requiring every user to move into a separate checking interface.', '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>'],
      ['Products that process submitted documents', 'Trigger plagiarism checks when users submit text, files, or URLs to your product, then use the webhook and report data to continue the process inside your own application.', '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'],
    ],
  },

  s7: {
    h2: 'Move from evaluation to implementation',
    intro: 'Use the commercial API page to understand the product, then move into the technical resources when you are ready to work with the current API contract.',
    card: ['API Documentation', 'Review the current PlagiarismSearch RESTful API 3.1.0 reference for endpoints, request parameters, and response schemas.'],
    cta: 'Open API documentation',
  },

  s8: {
    h2: 'Choose the API access path that fits your implementation',
    intro: 'API access can be included in selected PlagiarismSearch plans or arranged separately for custom and higher-volume implementations. Trial access may also be available through supported trial or contact flows.',
    paths: [
      ['Review available plans', 'See current PlagiarismSearch plans and the features included with each option.', 'View pricing', 'prices.html'],
      ['Discuss API access or a trial', 'Tell us what you are building and the approximate volume you expect to process. We can use those details to discuss access, evaluation options, or custom pricing.', 'Request API access', '#api-quote'],
    ],
  },

  s9: {
    h2: 'Request API access or a custom quote',
    intro: 'Share your integration requirements and expected volume. We’ll use the details to discuss the most appropriate API access, trial, or pricing option for your workflow.',
    /* label, placeholder, required, note, textarea */
    fields: [
      ['Name', 'Jordan Reeves', true, null, false],
      ['Work email', 'name@company.com', true, null, false],
      ['Organization', 'Company, university, or platform', false, null, false],
      ['Phone', '+1 555 000 0000', false, 'Optional', false],
      ['Estimated monthly volume', 'e.g. 1,000,000 words', false, 'An approximate figure is enough.', false],
      ['What are you integrating?', 'Describe your product, platform, or workflow and any requirements that matter to the integration.', true, null, true],
    ],
    cta: 'Request API access',
    successHeading: 'Your API request has been sent',
    successCopy: 'Thank you. We’ve received your integration details.',
    alt: 'Prefer email? Contact us at services@plagiarismsearch.com.',
    altHref: 'mailto:services@plagiarismsearch.com',
  },

  s10: {
    h2: 'Plagiarism API FAQ',
    items: [
      ['What can I submit through the PlagiarismSearch API?', 'You can submit text, upload a supported document, or provide a public URL for plagiarism checking. Text and URL requests can use JSON. File uploads use multipart form data. Use the current API documentation for the complete request schema and current file requirements.'],
      ['Is the plagiarism check synchronous or asynchronous?', 'The current API uses asynchronous processing. When you create a report, the API returns a 202 response with the report ID while the check continues. When processing is complete, PlagiarismSearch sends a completion event to the callback_url supplied with the request.'],
      ['How does the completion webhook work?', 'Include a callback_url when you create the report. After the check is complete, PlagiarismSearch sends a report.checked event to that URL. The webhook identifies the report, provides completion information, and includes a link to the report resource.'],
      ['What sources can the API search?', 'A plagiarism check can use web search, the PlagiarismSearch academic database, and permitted personal or organization storage. The academic database contains more than 500 million indexed academic texts. The sources used for a particular check depend on the scan configuration and the access available to the API account.'],
      ['Can I exclude references, citations, or specific URLs?', 'The API includes options for controlling parts of the plagiarism scan, including reference and quoted or cited-text exclusions, URL controls, and storage filtering. Use the current API reference for the exact parameters supported by API 3.1.0.'],
      ['Can I run AI detection through the same API?', 'Yes. AI analysis is available through the same PlagiarismSearch API infrastructure rather than as a separate standalone API product. The account must have an available AI word balance for AI checking.'],
      ['Which authentication methods does the API support?', 'PlagiarismSearch API 3.1.0 supports Basic and Bearer authentication. Use the current API documentation for the exact authentication format required by your implementation.'],
      ['How can I get API access or a trial?', 'API access may be included with selected plans or arranged separately depending on the implementation. Trial access may be available through supported trial flows or by contacting PlagiarismSearch. If you need custom access or pricing, send your requirements through the API request form on this page.'],
      ['Does the API support plagiarism checking in multiple languages?', 'Yes. The API supports multilingual plagiarism checking. Detection performance is strongest in English.'],
    ],
    footer: 'Need implementation details?',
    cta: 'View API documentation',
  },

  s11: {
    h2: 'Ready to evaluate the PlagiarismSearch API?',
    support: 'Review the API documentation to inspect the current technical contract, or send us your requirements if you need API access, trial options, or custom pricing.',
    primary: 'View API documentation',
    secondary: 'Request API access',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the site's, not a new one for this page. DEC-0041 is explicit:
   "Do not invent a separate developer microsite visual language."
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;

const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const h2 = t => `<h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]">${t}</h2>`;

const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

const ext = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;

const btnLight = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;

const linkQuiet = (label, href, dark) => `<a href="${href}"${ext(href)} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold ${dark ? 'text-white/70 hover:text-white decoration-white/30' : 'text-ink-500 hover:text-ink-900 decoration-ink-300'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

/* Pen mark — DESIGN.md § Motion. One per heading; emphasis, not decoration. Applied at
   render so the approved H1 stays one plain diffable string. */
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* ═══════════════ 01 · PRODUCT HERO / REAL API EVIDENCE ═══════════════ */
const section1 = () => `  <!-- ================= 01 · PRODUCT HERO / REAL API EVIDENCE =================
       "Show the integration, not just promise that it is easy." The code is the proof,
       so it sits beside the proposition rather than below the fold.

       DOM order is fixed by the brief for below 1024: category, H1, copy, CTAs, proof
       rail, code panel. That is the source order here, and the split is done with a grid
       at lg — so the code never precedes the H1 in reading order at any width.

       Every character in the tabs is the brief's. The Authorization line is the
       developer-supplied example and stays until the preferred literal is given. -->
  <section id="plagiarism-api" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.08fr] gap-10 lg:gap-14 items-center">

        <div class="rv">
${eyebrow('teal-400', COPY.s1.eyebrow)}
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.s1.h1, 'API')}</h1>
          <p class="text-[14.5px] sm:text-[15.5px] lg:text-[16px] leading-relaxed text-ink-600 max-w-[58ch] mb-7 lg:mb-8">${COPY.s1.support}</p>

          <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-9 lg:mb-11">
            ${btnDark(COPY.s1.primary, DOCS)}
            <a href="#api-access" class="text-[13.5px] sm:text-[14px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.secondary}</a>
          </div>

          <!-- technical proof rail: each item one element, in reading order -->
          <div class="grid sm:grid-cols-3 gap-4 sm:gap-5 pt-7 lg:pt-8 border-t border-ink-900/10">
${COPY.s1.rail.map(([head, sup]) => `            <div>
              <p class="text-[13.5px] font-bold tracking-tight mb-1">${head}</p>
              <p class="text-[12.5px] leading-relaxed text-ink-500">${sup}</p>
            </div>`).join('\n')}
          </div>
        </div>

        <!-- min-w-0 is load-bearing. A grid item defaults to min-width:auto, so it refuses
             to shrink below its content's min-content width — and a <pre> with
             white-space:pre has an enormous one. Without this the panel measured 547px
             inside a 375px viewport and the section's overflow-hidden CLIPPED the long
             lines instead of letting .code-pre scroll them, which is exactly the
             "changing code semantics" the brief rules out. -->
        <div class="rv min-w-0">
          <div class="rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-950 shadow-diffuse-lg overflow-hidden">
            <div class="flex items-center gap-1 px-3 sm:px-4 pt-3 sm:pt-4 pb-0">
${COPY.s1.tabs.map((t, i) => `              <button type="button" class="code-tab${i === 0 ? ' on' : ''}" data-tab="${t.name}">${t.name}</button>`).join('\n')}
              <button type="button" class="code-copy ml-auto" data-copy>Copy</button>
            </div>
${COPY.s1.tabs.map((t, i) => `            <div class="code-panel${i === 0 ? ' on' : ''}" data-panel="${t.name}">
              <pre class="code-pre"><code>${t.lines.map(esc).join('\n')}</code></pre>
${t.caption ? `              <p class="px-4 sm:px-5 lg:px-6 pb-4 text-[12px] leading-relaxed text-white/50">${t.caption}</p>` : ''}
            </div>`).join('\n')}
            <div class="px-4 sm:px-5 lg:px-6 py-3.5 border-t border-white/10">
              ${linkQuiet(COPY.s1.codeLink, DOCS, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · INPUTS ═══════════════ */
const section2 = () => `  <!-- ================= 02 · INPUTS =================
       Exactly three concepts, each with the encoding that actually applies. No file
       list: "Do not publish an exhaustive file-extension/size list until the current
       API-specific allow-list and limits are confirmed." -->
  <section id="api-inputs" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Inputs')}
        ${h2(COPY.s2.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s2.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${COPY.s2.items.map(([head, body, tag, icon]) => `        <div class="rounded-3xl sm:rounded-[28px] bg-ink-50 p-5 sm:p-6 lg:p-7 flex flex-col">
          <div class="flex items-center justify-between gap-3 mb-4">
            <span class="w-11 h-11 rounded-xl bg-white flex items-center justify-center ring-1 ring-black/5">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            </span>
            <span class="inline-flex items-center rounded-full bg-white ring-1 ring-black/5 px-2.5 py-1 text-[11px] font-semibold tracking-tight text-ink-600">${tag}</span>
          </div>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · SEARCH SCOPE & CONFIGURATION ═══════════════ */
const section3 = () => `  <!-- ================= 03 · SEARCH SCOPE & SCAN CONFIGURATION =================
       The bento the brief encourages, carrying actual capabilities rather than generic
       advantage cards. The 500M+ academic figure is approved; no web-corpus number is,
       so none appears. AI is one card among six, not a product. -->
  <section id="api-configuration" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('teal-400', 'Configuration')}
        ${h2(COPY.s3.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s3.intro}</p>
      </div>

      <!-- The homepage capabilities grid is lg:grid-cols-5 with no tablet step, but it
           carries four blocks and this carries six: one column from 640 to 1024 is a long
           scroll. A plain two-up fills that band; the bento itself is unchanged, because
           the spans are lg-only and do not apply until the five columns exist. -->
      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
${COPY.s3.items.map(([head, body, proof, span, icon, tint]) => {
  const wide = span === 'lg:col-span-3';
  const CHIP = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'] }[tint];
  return `        <div class="min-w-0 ${span} rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse spotlight">
          <div class="min-w-0 h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-7 lg:p-8 flex flex-col">
            <span class="inline-flex ${wide ? 'w-12 h-12' : 'w-11 h-11'} rounded-xl sm:rounded-[14px] lg:rounded-2xl ${CHIP[0]} items-center justify-center mb-4 sm:mb-5">
              <svg width="${wide ? 22 : 20}" height="${wide ? 22 : 20}" viewBox="0 0 24 24" fill="none" stroke="${CHIP[1]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            </span>
            <h3 class="${wide ? 'text-[19px] sm:text-[21px] lg:text-[22px]' : 'text-[17px] sm:text-[18px] lg:text-[19px]'} font-bold tracking-tight mb-2.5">${head}</h3>
            <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[52ch]">${body}</p>
${proof ? `            <p class="mt-5 pt-4 border-t border-ink-100 text-[12.5px] font-semibold tracking-tight text-teal-700">${proof}</p>` : ''}
          </div>
        </div>`;
}).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · THE ACTUAL API WORKFLOW ═══════════════ */
const section4 = () => `  <!-- ================= 04 · ACTUAL API WORKFLOW =================
       A product workflow, not a sales workflow. The legacy "Contact us → Describe
       requirements → Receive API → Stay in touch" is gone; these four are what the
       integration actually does. No stock developer photograph: the brief calls for
       actual product evidence, and the async callout is that evidence. -->
  <section id="api-workflow" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Workflow')}
        ${h2(COPY.s4.h2)}
      </div>

      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
${COPY.s4.steps.map(([head, body], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-ink-50 p-5 sm:p-6 lg:p-7">
          <span class="inline-flex w-8 h-8 rounded-full bg-ink-900 text-white text-[12.5px] font-bold items-center justify-center tabular-nums mb-4">${i + 1}</span>
          <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>

      <div class="rv mt-6 lg:mt-8 rounded-3xl sm:rounded-4xl bg-ink-950 p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">

        <div class="max-w-[54ch]">
          <p class="text-[19px] sm:text-[21px] lg:text-[23px] font-bold tracking-tight leading-[1.25] text-white mb-3 lg:mb-4">${
            COPY.s4.calloutLead.replace(COPY.s4.calloutAccent,
              '<span class="text-orange-300">' + COPY.s4.calloutAccent + '</span>')}</p>
          <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/65">${COPY.s4.calloutSupport}</p>
        </div>

        <!-- The sequence, read top to bottom as time. Two hosts, three messages, and a
             gap in the middle that is the whole point: the app is free between the 202
             and the webhook.

             Every label is a literal from the hero code samples — your.app and
             plagiarismsearch.com are the two hosts in the curl commands, and the rest are
             the endpoint, the status code, the processing label and the event name. A
             diagram that quotes the contract needs no invented copy. -->
        <div class="w-full lg:w-[400px] rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6">
          <div class="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
            <code class="text-[12px] sm:text-[12.5px] font-semibold text-white/70">your.app</code>
            <code class="text-[12px] sm:text-[12.5px] font-semibold text-white/70">plagiarismsearch.com</code>
          </div>

          <div class="space-y-4">
${[
  { dir: 'out',  label: 'POST /api/v3/reports/create', tone: 'teal' },
  { dir: 'in',   label: '202', tone: 'teal' },
  { dir: 'wait', label: 'status_label: \"processing\"', tone: 'muted' },
  { dir: 'in',   label: 'report.checked', tone: 'orange' },
].map(step => {
  const C = { teal: ['#2CC3DB', 'text-teal-300'], orange: ['#F58971', 'text-orange-300'], muted: ['', 'text-white/40'] }[step.tone];
  if (step.dir === 'wait') {
    return `            <div class="flex items-center gap-3 py-1">
              <span class="flex-1 border-t border-dashed border-white/15"></span>
              <code class="shrink-0 text-[11.5px] sm:text-[12px] ${C[1]}">${step.label}</code>
              <span class="flex-1 border-t border-dashed border-white/15"></span>
            </div>`;
  }
  const out = step.dir === 'out';
  return `            <div>
              <code class="block text-[12px] sm:text-[13px] font-semibold ${C[1]} mb-1.5 ${out ? '' : 'text-right'}">${step.label}</code>
              <div class="flex items-center gap-2" aria-hidden="true">
                ${out ? '' : `<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M8 4.5H1M4 1.5 1 4.5l3 3" stroke="${C[0]}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
                <span class="flex-1 h-px" style="background:${C[0]}66"></span>
                ${out ? `<svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 4.5h7M5 1.5l3 3-3 3" stroke="${C[0]}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
              </div>
            </div>`;
}).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · RESULT LIFECYCLE ═══════════════ */
const section5 = () => `  <!-- ================= 05 · RESULT LIFECYCLE =================
       Confirmed field concepts only — id, progress, status, status_label, the completion
       webhook and the self link. "Do not claim PDF reports, HTML reports, detailed
       source relations or other legacy Q&amp;A output features."

       The field chips are the real names from the Response and Webhook tabs above, which
       is the "actual product evidence" the brief asks for in place of stock imagery. -->
  <section id="api-results" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:880px;height:820px;left:-14%;top:-360px;background:rgba(44,195,219,.20)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-12%;bottom:-320px;background:rgba(243,111,90,.12)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-8 lg:gap-12 items-start">
        <div class="rv lg:sticky lg:top-28 text-white">
${eyebrowDark('teal-400', 'Results')}
          ${h2(COPY.s5.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] leading-relaxed text-white/70 max-w-[56ch]">${COPY.s5.intro}</p>
          <div class="mt-6 lg:mt-7">${linkQuiet(COPY.s5.cta, DOCS, true)}</div>

          <!-- Field treatment, not a picture of a developer. Every name here appears in
               the Response or Webhook sample in the hero, so it is the same contract the
               reader just saw, named rather than re-quoted. -->
          <div class="hidden lg:block mt-8 rounded-2xl bg-white/[.05] ring-1 ring-white/10 p-5">
            <span class="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/40 mb-3">Returned by the API</span>
            <div class="flex flex-wrap gap-2">
${['id', 'progress', 'status', 'status_label', 'event', 'checked_words', 'words', 'links.self']
  .map(f => `              <code class="rounded-lg bg-white/[.07] px-2.5 py-1 text-[12px] font-medium text-teal-300">${f}</code>`).join('\n')}
            </div>
          </div>
        </div>

        <div class="rv-kids space-y-4 sm:space-y-5">
${COPY.s5.items.map(([head, body], i) => `          <div class="rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6 lg:p-7">
            <span class="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/45 mb-2">Step 0${i + 1}</span>
            <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight text-white mb-2">${head}</h3>
            <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-white/65 max-w-[60ch]">${body}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · WORKFLOW USE CASES ═══════════════ */
const section6 = () => `  <!-- ================= 06 · WORKFLOW USE CASES =================
       Three genuinely distinct integration shapes. Not Schools / Universities / Colleges,
       which the brief rejects as near-duplicate persona cards, and no Moodle card — that
       cross-link is a separate later decision, not an API mechanic. -->
  <section id="api-use-cases" class="relative py-16 sm:py-24 lg:py-32 bg-[#F2FCFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Use cases')}
        ${h2(COPY.s6.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s6.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${COPY.s6.items.map(([head, body, icon]) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
          <span class="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
          </span>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-2.5">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · DEVELOPER RESOURCES ═══════════════ */
const section7 = () => `  <!-- ================= 07 · DEVELOPER RESOURCES =================
       One card, deliberately. The API Q&amp;A page is gated until it is synchronized with
       3.1.0, and the brief is explicit: "Do not reserve an empty second-card slot." So
       the layout is built for one rather than showing a hole where the second will go. -->
  <section id="api-resources" class="relative py-16 sm:py-24 lg:py-28 bg-white overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10">
${eyebrow('teal-400', 'Resources')}
        ${h2(COPY.s7.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s7.intro}</p>
      </div>

      <div class="rv max-w-[820px] rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        <span class="shrink-0 w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1.5">${COPY.s7.card[0]}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600 max-w-[62ch]">${COPY.s7.card[1]}</p>
        </div>
        <div class="shrink-0">${btnDark(COPY.s7.cta, DOCS)}</div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · ACCESS, TRIAL & PRICING ═══════════════ */
const section8 = () => `  <!-- ================= 08 · ACCESS, TRIAL &amp; PRICING =================
       Two paths and no price cards. The legacy Monthly / 3-Month / Yearly module is
       rejected outright: pricing and entitlements come from the commercial source of
       truth. No universal free trial, and no claim that every account gets API access. -->
  <!-- The dark commercial callout DEC-0041 lists under encouraged reuse, and the page's
       second dark act. Two paths, no price cards: pricing and entitlements come from the
       commercial source of truth, not from here. -->
  <section id="api-access" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 overflow-hidden">
    <div class="orb absolute" style="width:820px;height:780px;right:-14%;top:-340px;background:rgba(243,111,90,.18)"></div>
    <div class="orb absolute" style="width:660px;height:640px;left:-10%;bottom:-300px;background:rgba(44,195,219,.16)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[760px] mx-auto mb-10 sm:mb-12 text-white">
${eyebrowDark('orange-500', 'Access')}
        ${h2(COPY.s8.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70">${COPY.s8.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-[1000px] mx-auto">
${COPY.s8.paths.map(([head, body, cta, href]) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white/[.05] ring-1 ring-white/10 p-6 sm:p-7 lg:p-8 flex flex-col">
          <h3 class="text-[17px] sm:text-[18px] font-bold tracking-tight text-white mb-2.5">${head}</h3>
          <p class="flex-1 text-[13.5px] sm:text-[14px] leading-relaxed text-white/70 max-w-[52ch] mb-6">${body}</p>
          <div>${btnLight(cta, href)}</div>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · QUOTE FORM ═══════════════ */
const section9 = () => `  <!-- ================= 09 · API ACCESS / CUSTOM QUOTE FORM =================
       The approved simplified data model: six fields, no Facebook or LinkedIn, and
       estimated monthly WORDS rather than pages derived from a hidden 300-per-page
       assumption. Organization and Phone carry no asterisk; Phone says Optional.

       No consent checkbox. The brief ties this to the shared form's existing legal
       behaviour — "If the shared form requires a visible consent checkbox" — and
       contact-us.html, the shared inquiry form here, has none. Adding one would be
       inventing a consent claim, which the same clause forbids.

       No response-time promise anywhere, including the success state. -->
  <section id="api-quote" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('teal-400', 'Get access')}
          ${h2(COPY.s9.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] leading-relaxed text-ink-600 max-w-[56ch]">${COPY.s9.intro}</p>
          <p class="mt-6 lg:mt-7 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500">
            Prefer email? Contact us at <a href="${COPY.s9.altHref}" class="font-semibold text-ink-700 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">services@plagiarismsearch.com</a>.
          </p>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
          <form onsubmit="return false" novalidate>
            <div class="grid sm:grid-cols-2 gap-4 sm:gap-5">
${COPY.s9.fields.map(([label, placeholder, required, note, isArea], i) => {
  const id = 'aq-' + i;
  const wide = isArea || i === 4 ? ' sm:col-span-2' : '';
  return `              <div class="${wide.trim() || 'min-w-0'}${wide}">
                <label class="cf-label" for="${id}">${label}${required ? ' <i>*</i>' : ''}${note && note === 'Optional' ? ' <span class="font-medium text-ink-400">Optional</span>' : ''}</label>
                ${isArea
                  ? `<textarea class="cf-field" id="${id}" rows="4" placeholder="${placeholder}"></textarea>`
                  : `<input class="cf-field" id="${id}" type="${label === 'Work email' ? 'email' : label === 'Phone' ? 'tel' : 'text'}" placeholder="${placeholder}">`}
${note && note !== 'Optional' ? `                <p class="mt-2 text-[12px] text-ink-500">${note}</p>` : ''}
              </div>`;
}).join('\n')}
            </div>

            <div class="mt-6 lg:mt-7">
              <button type="submit" class="btn-press group flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold pl-5 sm:pl-6 pr-2 py-2">
                ${COPY.s9.cta}
                <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
              </button>
            </div>
          </form>

          <!-- the approved success state, rendered so its copy is checkable and carries
               no response-time promise; the prototype form never submits -->
          <div class="mt-6 pt-6 border-t border-ink-100" hidden id="aq-success">
            <h3 class="text-[15.5px] font-bold tracking-tight mb-1.5">${COPY.s9.successHeading}</h3>
            <p class="text-[13px] leading-relaxed text-ink-600">${COPY.s9.successCopy}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 10 · FAQ ═══════════════ */
const section10 = () => `  <!-- ================= 10 · PLAGIARISM API FAQ =================
       Exactly nine, all rendered in HTML. The tenth — the legacy Q&amp;A cross-link — is
       gated until that page is synchronized with 3.1.0, so the footer offers docs only. -->
  <section id="api-faq" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Questions')}
          ${h2(COPY.s10.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] leading-relaxed text-ink-600">${COPY.s10.footer}</p>
          <div class="mt-5 lg:mt-6">${linkQuiet(COPY.s10.cta, DOCS)}</div>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.s10.items.map(([q, a], i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
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

/* ═══════════════ 11 · FINAL CTA ═══════════════ */
const section11 = () => `  <!-- ================= 11 · FINAL CTA =================
       Dual next steps, in the approved hierarchy: the technical evaluator returns to the
       docs, the buyer goes to the form. No third action, no free-trial button. -->
  <section id="api-final-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('api-final-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.s11.h2, 'evaluate')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[58ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.s11.support}</p>
      <div class="rv flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        <a href="${DOCS}" rel="noopener" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
          ${COPY.s11.primary}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <a href="#api-quote" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s11.secondary}</a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles.
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

  /* ---------- code panel ----------
     "Code text must remain readable; horizontal scrolling inside the code container is
     preferred to shrinking text or changing code semantics." So the pre scrolls in its
     own box and the page never gains a horizontal scrollbar. */
  .code-tab { padding:7px 13px; border-radius:9999px; font-size:12.5px; font-weight:600;
    color:rgba(255,255,255,.5); transition:background-color .2s ease, color .2s ease; }
  .code-tab:hover { color:rgba(255,255,255,.8); }
  .code-tab.on { background:rgba(255,255,255,.1); color:#fff; }
  .code-copy { padding:7px 13px; border-radius:9999px; font-size:12px; font-weight:600;
    color:rgba(255,255,255,.45); transition:background-color .2s ease, color .2s ease; }
  .code-copy:hover { background:rgba(255,255,255,.08); color:#fff; }
  .code-panel { display:none; }
  .code-panel.on { display:block; }
  .code-pre { overflow-x:auto; padding:18px 16px 16px; margin:0;
    font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size:12.5px; line-height:1.75; color:rgba(255,255,255,.82);
    -webkit-overflow-scrolling:touch; }
  .code-pre::-webkit-scrollbar { height:6px; }
  .code-pre::-webkit-scrollbar-thumb { background:rgba(255,255,255,.18); border-radius:3px; }
  @media (min-width:640px) { .code-pre { padding:22px 20px 18px; font-size:13px; } }

  /* ---------- shared inquiry-form fields, same as contact-us ----------
     The shared head carries only the small-breakpoint height override, so the base
     rules have to live here or the fields collapse to browser defaults. */
  .cf-label { display:block; font-size:12px; font-weight:700; letter-spacing:.01em; color:#4B5563; margin-bottom:7px; }
  .cf-label i { font-style:normal; color:#F36F5A; }
  .cf-field { width:100%; height:48px; padding:0 14px; border-radius:10px; border:1px solid #E5E7EB;
    background:#fff; color:#111827; font-size:14.5px; font-weight:500; font-family:inherit;
    transition:border-color .15s ease, box-shadow .15s ease; }
  .cf-field::placeholder { color:#9CA3AF; font-weight:400; }
  .cf-field:focus { outline:none; border-color:#0CA9C3; box-shadow:0 0 0 1px #0CA9C3; }
  textarea.cf-field { height:auto; padding:12px 14px; line-height:1.6; resize:none; }

${cta.style('api-final-cta')}

  /* the bento hover from the homepage capabilities grid */
  .spotlight { transition:transform .35s cubic-bezier(.32,.72,0,1), box-shadow .35s ease; }
  .spotlight:hover { transform:translateY(-4px); }
  @media (prefers-reduced-motion: reduce) { .spotlight { transition:none; } .spotlight:hover { transform:none; } }

  /* pen mark — the reduced-motion fallback is mandatory */
  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
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

${cta.script}

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

  /* code tabs — all three panels are in the DOM; this only switches which is shown */
  const tabs = [...document.querySelectorAll('.code-tab')];
  const panels = [...document.querySelectorAll('.code-panel')];
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.toggle('on', t === tab));
      panels.forEach(p => p.classList.toggle('on', p.dataset.panel === tab.dataset.tab));
    });
  });

  /* the utility label exception the brief grants: exactly "Copy", success "Copied" */
  const copy = document.querySelector('[data-copy]');
  if (copy) {
    copy.addEventListener('click', async () => {
      const open = document.querySelector('.code-panel.on code');
      if (!open) return;
      try { await navigator.clipboard.writeText(open.textContent); } catch (e) { return; }
      copy.textContent = 'Copied';
      setTimeout(() => { copy.textContent = 'Copy'; }, 1600);
    });
  }

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
head = head.replace('<title>', '<link rel="canonical" href="' + COPY.canonical + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const sections = [section1, section2, section3, section4, section5, section6,
                  section7, section8, section9, section10, section11];

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
            count(/<h2\b/g) + ' h2, ' + count(/class="faq-item/g) + ' faq items, ' +
            count(/class="code-panel/g) + ' code tabs');
