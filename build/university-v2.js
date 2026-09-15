/* Generate site/university-plagiarism-checker-v2.html — the University page to the
   v2 brief of 2026-09-04.

   v1 (build/university.js) translated the first brief's fact lists into card grids,
   twelve sections of them, and the v2 brief names that as the thing to fix: "a supplied
   list of facts is content, not a prescribed list of cards". So v2 is nine sections and
   every major act gets its own proof type — a hub in the hero, the real report, a
   relationship map for Organization Management, a source map with a separate Storage
   branch, a decision tree for deployment, a compact banner for AI, the form, the
   accordion, the closing band. Nothing is drawn as a product screen: the asset gate from
   v1 still holds (no real captures exist), and the v2 brief asks for diagrams whose text
   stays in the HTML, which is what these are.

   Copy is the brief's — LOCKED COPY verbatim, INFORMATION CONTRACT entities and
   relationships as diagram labels, nothing invented. build/check-university-v2.js holds
   the page to it.

   v1 stays beside it with a version switcher, the index-v2 precedent: nothing is
   retired until Olex accepts the replacement.

   Run:  node build/university-v2.js  →  node build/shell.js  →  node build/check-university-v2.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'university-plagiarism-checker-v2.html';
const cta = require('./cta');
const { dots } = require('./dots');
const banner = require('./banner');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

/* /organization-management has no page in this prototype and is a live production URL */
const ORG = 'https://plagiarismsearch.com/organization-management';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — University v2 brief, 2026-09-04. Verbatim.

   Destinations: /organization-management → absolute (above), /integration-guide →
   integration-guide.html, /canvas-integration → canvas-integration.html,
   /plagiarism-api → api.html, /ai-content-detector → ai-detector.html,
   /policy → policy.html, /terms-of-use → terms-of-use.html.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'University Plagiarism Checker for Higher Education | PlagiarismSearch',
  meta: 'Manage plagiarism checking across your university with source-based reports, organization permissions, institutional Storage, LMS integrations, and API access.',
  canonical: 'https://plagiarismsearch.com/university-plagiarism-checker',

  s1: {
    eyebrow: 'FOR UNIVERSITIES &amp; HIGHER EDUCATION',
    h1: 'University Plagiarism Checker',
    support: 'Give educators source evidence they can review and administrators the controls to manage institutional access, checking resources, and Storage. Use PlagiarismSearch directly, through your LMS, or through the API.',
    primary: 'Request institutional pricing', primaryHref: '#institutional-inquiry',
    secondary: 'See how it works', secondaryHref: '#institutional-report',
    line: 'For universities, colleges, academic departments, and other higher-education institutions.',
    /* INFORMATION CONTRACT — the three outcomes, as the brief states them */
    outcomes: [
      ['Review', 'Source evidence for educators.'],
      ['Manage', 'People, permissions, and institutional resources.'],
      ['Integrate', 'Direct workspace, LMS, or API.'],
    ],
  },

  s2: {
    eyebrow: 'REPORT EVIDENCE',
    h2: 'Give educators evidence they can review',
    body: 'After a plagiarism check, the report highlights matching and similar passages and connects them to detected sources. Educators can inspect the matched text, open the source, and review citations, references, and surrounding context before deciding how a match should be interpreted.',
    body2: 'A similarity result is evidence for review, not an automatic finding that academic misconduct occurred.',
    /* LOCKED COPY, "NOT required as three large cards" */
    steps: [
      ['See the match', 'Identify where matching or similar text appears in the submitted document.'],
      ['Open the source', 'Review the source connected to the match.'],
      ['Review the context', 'Consider citations, references, and surrounding text before reaching a conclusion.'],
    ],
    signature: 'Interpret the similarity percentage together with the underlying matches, sources, citations, and context.',
  },

  s3: {
    eyebrow: 'INSTITUTIONAL CONTROL',
    h2: 'Manage people, permissions, and checking resources centrally',
    intro: 'PlagiarismSearch Organization Management gives administrators one place to invite members, manage access, and distribute institutional checking resources.',
    items: [
      ['Invite and manage members', 'Invite members by email and manage access as your institutional team changes.',
       '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>'],
      ['Control access', 'Set the permissions members need for Organization Storage, document access, and institutional plagiarism checking.',
       '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'],
      ['Allocate institutional resources', 'Distribute plagiarism-checking words from the organization balance. If your institution also uses AI detection, AI words can be allocated separately.',
       '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'],
      ['Keep personal and organization usage separate', 'Members keep their personal balance separate from the organization balance.',
       '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>'],
    ],
    cta: 'Explore Organization Management', ctaHref: ORG,
    /* INFORMATION CONTRACT A — the relationships, in order, as diagram labels */
    flow: [
      ['Administrator', 'Creates and manages the organization and invites a member by email.',
       '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'],
      ['Invitation', 'Pending until accepted.',
       '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'],
      ['Organization member', 'After acceptance the member joins the organization.',
       '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>'],
      ['Uses institutional resources', 'Within the permissions the administrator has set.',
       '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>'],
    ],
    /* what the administrator sets after the member joins — relationship 3 */
    grants: ['Permissions', 'Plagiarism-checking words', 'AI words, separately'],
    distinction: 'Personal balance remains separate from organization balance.',
  },

  s4: {
    eyebrow: 'SOURCES &amp; STORAGE',
    h2: 'Choose what each check compares — and what enters institutional Storage',
    intro: 'A plagiarism check can use external sources and your institution’s own Storage. The comparison sources, scan controls, report retention, and Storage workflow remain separate.',
    /* LOCKED COPY — the four items; the third is the institution-controlled one */
    sources: [
      ['Web sources', 'Compare submitted work with sources available on the web.', null,
       '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'],
      ['Academic database', 'Include more than 500 million indexed academic texts when academic source coverage matters.', '500M+ indexed academic texts',
       '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'],
      ['Organization Storage', 'Use your institution’s Storage as an additional comparison source when the relevant permissions and workflow are enabled.', null,
       '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>'],
    ],
    control: ['References and citations', 'Exclude references and in-text citations when those parts should not affect the similarity result.'],
    /* the map's own nodes — INFORMATION CONTRACT B */
    input: 'Submitted work',
    check: 'Plagiarism check',
    output: 'Report',
    lifecycle: 'Generated reports may remain available in the account for convenient access and can be permanently deleted when they are no longer needed.',
    branch: ['Selected material', 'Add to Storage — a separate, intentional workflow', 'Organization Storage', 'May participate in future comparisons'],
    clarification: 'Running a plagiarism check does not automatically add the document to Organization Storage. Adding material to Storage is a separate, intentional workflow.',
    cta: 'Read the Privacy Policy', ctaHref: 'policy.html',
  },

  s5: {
    eyebrow: 'DEPLOYMENT',
    h2: 'Use PlagiarismSearch in the workflow your institution already has',
    intro: 'Choose direct institutional access, an LMS integration, or a custom API workflow. The right path depends on where your users already submit, check, and review work.',
    /* label, title, body, [cta, href]…, decision rule (INFORMATION CONTRACT C), icon */
    paths: [
      ['MANAGED INSTITUTIONAL ACCESS', 'Organization workspace',
       'Use PlagiarismSearch directly when you need centralized member management, permissions, institutional balances, and Organization Storage without building a custom integration.',
       [['Explore Organization Management', ORG]],
       'We want centralized institutional access without building an integration.',
       '<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/>'],
      ['LMS WORKFLOW', 'Moodle &amp; Canvas',
       'Keep plagiarism checking inside the LMS when course and submission workflows already live there. Moodle lets administrators configure when checks run, which sources are searched, whether material is added to Storage, and what report information students can see.',
       [['View Moodle integration', 'integration-guide.html'], ['View Canvas integration', 'canvas-integration.html']],
       'Course and submission workflows already live in our LMS.',
       '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'],
      ['CUSTOM INTEGRATION', 'API',
       'Use the PlagiarismSearch API when your institution has its own platform or needs plagiarism checking inside a custom technical workflow.',
       [['Explore the API', 'api.html']],
       'We have our own platform or need a custom technical workflow.',
       '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>'],
    ],
  },

  s6: {
    eyebrow: 'OPTIONAL AI CHECKING',
    h2: 'Need AI checking as part of the same institutional setup?',
    /* the approved paragraph, whole — one support line reads easier than two */
    lead: 'AI detection is available as a separate analysis within the PlagiarismSearch ecosystem. When an organization uses AI checking, administrators can allocate AI word balance separately from plagiarism-checking balance.',
    clarification: 'AI-generated text is not automatically plagiarism. Plagiarism checking and AI detection answer different questions and should be interpreted separately.',
    cta: 'Learn about AI detection', ctaHref: 'ai-detector.html',
    /* the two balances, drawn — v1's schematic, the brief's own labels */
    branch: {
      parent: ['Organization balance', '<path d="M17 14h.01"/><path d="M7 7h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10"/>'],
      children: [
        ['Plagiarism-checking balance', '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>'],
        ['AI word balance', '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>'],
      ],
    },
  },

  s7: {
    eyebrow: 'INSTITUTIONAL INQUIRY',
    h2: 'Discuss plagiarism checking for your institution',
    intro: 'Tell us how your institution plans to manage users, checking volume, Storage, and integrations. We’ll use those details to discuss an appropriate setup and pricing path.',
    alt: 'Prefer email? Contact us at', altMail: 'services@plagiarismsearch.com',
    /* label, placeholder/options, required, helper, kind, wide */
    fields: [
      ['Name', 'Jordan Reeves', true, null, 'text', false],
      ['Work email', 'name@university.edu', true, null, 'email', false],
      ['Institution', 'University or college name', true, null, 'text', true],
      ['Your role', ['Academic or faculty', 'Administration', 'Academic integrity', 'IT or LMS', 'Procurement', 'Other'], false, null, 'select', false],
      ['How do you plan to use PlagiarismSearch?', ['Organization workspace', 'Moodle', 'Canvas', 'API', 'Not sure yet', 'Other'], false, null, 'select', false],
      ['Approximate institution size', 'e.g. 5,000 students or users', false, 'An estimate is enough.', 'text', false],
      ['Approximate monthly checking volume', 'e.g. 2,000 documents or 1,000,000 words', false, 'Use whichever estimate is easier for your institution.', 'text', false],
      ['Institutional requirements', 'Tell us about your plagiarism-checking workflow, source or Storage requirements, integration needs, or any questions we should consider.', true, null, 'textarea', true],
    ],
    terms: 'terms-of-use.html', policy: 'policy.html',
    cta: 'Request institutional pricing',
    successHeading: 'Your institutional request has been sent',
    successCopy: 'Thank you. We’ve received the information about your institution and plagiarism-checking requirements.',
  },

  s8: {
    eyebrow: 'QUESTIONS',
    h2: 'University Plagiarism Checker FAQ',
    items: [
      ['Can our university manage multiple users and institutional checking resources?', 'Yes. PlagiarismSearch Organization Management lets an administrator create an organization, invite members, manage access, and distribute plagiarism-checking words. If the institution also uses AI detection, AI words can be allocated separately. Personal balance remains separate from organization balance.'],
      ['Can our institution compare new submissions with its own documents?', 'Yes, when Organization Storage is enabled and the relevant permissions are available. Organization Storage can be used as an additional comparison source alongside the external sources selected for the check.'],
      ['Does every checked document automatically enter Organization Storage?', 'No. Running a plagiarism check does not automatically add the document to Organization Storage. Storage is a separate workflow used when the institution wants selected material to be available for future comparisons.'],
      ['What sources can be included in an institutional plagiarism check?', 'Depending on the selected configuration and available access, a check can use web sources, the PlagiarismSearch academic database with more than 500 million indexed academic texts, and permitted Organization Storage. References and in-text citations can also be excluded when appropriate.'],
      ['Does PlagiarismSearch integrate with Moodle and Canvas?', 'Yes. PlagiarismSearch supports LMS integration paths for Moodle and Canvas. In Moodle, administrators can configure when checks run, which sources are searched, whether work is added to Storage, and what report information students can see. Use the dedicated integration pages for current setup details.'],
      ['Can our institution use the API instead of an LMS integration?', 'Yes. Institutions with their own platform or custom technical workflow can integrate plagiarism checking through the PlagiarismSearch API. The organization workspace, LMS integrations, and API are separate deployment paths.'],
      ['Can our institution also use AI detection?', 'Yes. AI detection is available as a separate analysis within the PlagiarismSearch ecosystem. Organizations that use AI checking can allocate AI word balance separately from plagiarism-checking balance. AI-generated text is not automatically plagiarism.'],
      ['Does the plagiarism report automatically determine that a student plagiarized?', 'No. The report identifies matching and similar passages and connects them to detected sources. Educators should review the matches, citations, references, and surrounding context before deciding how the result should be interpreted academically.'],
      ['How do we get institutional pricing?', 'Institutional requirements can vary by number of users, checking volume, Storage needs, and integration workflow. Send your requirements through the institutional inquiry form on this page so PlagiarismSearch can discuss an appropriate setup and pricing path.'],
    ],
    /* the links the brief attaches to answers 5, 6, 7 and 9 */
    links: {
      4: [['Moodle', 'integration-guide.html'], ['Canvas', 'canvas-integration.html']],
      5: [['PlagiarismSearch API', 'api.html']],
      6: [['AI detection', 'ai-detector.html']],
      8: [['Request institutional pricing', '#institutional-inquiry']],
    },
  },

  s9: {
    h2: 'Build a plagiarism-checking workflow that fits your institution',
    support: 'Give educators source evidence they can review, manage institutional access and resources centrally, and choose the deployment path that fits your existing systems.',
    primary: 'Request institutional pricing', primaryHref: '#institutional-inquiry',
    secondary: 'Review deployment options', secondaryHref: '#institutional-workflow',
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

const h2 = t => `<h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]">${t}</h2>`;
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;

const linkQuiet = (label, href, dark) => `<a href="${href}"${ext(href)} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold ${dark ? 'text-white/70 hover:text-white decoration-white/30' : 'text-ink-500 hover:text-ink-900 decoration-ink-300'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

const inline = (label, href) => `<a href="${href}"${ext(href)} class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const TINT = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'] };
const chip = (tint, paths) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINT[tint][0]} items-center justify-center shrink-0">${ico(paths, TINT[tint][1])}</span>`;

/* the panel every diagram sits in: the double bezel */
const panel = inner => `        <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-8">
${inner}
          </div>
        </div>`;

/* the small glyphs the hero tiles carry: a schematic of each outcome, drawn */
const GLYPH = {
  /* three lines of a report with a highlighted passage */
  Review: `<span class="block space-y-1.5" aria-hidden="true">
                  <span class="block h-1.5 w-[86%] rounded-full bg-ink-200"></span>
                  <span class="block h-1.5 w-[70%] rounded-full bg-orange-400/70"></span>
                  <span class="block h-1.5 w-[92%] rounded-full bg-ink-200"></span>
                </span>`,
  /* three members and a switch */
  Manage: `<span class="flex items-center gap-2" aria-hidden="true">
                  <span class="flex -space-x-1.5"><span class="w-5 h-5 rounded-full bg-teal-200 ring-2 ring-white"></span><span class="w-5 h-5 rounded-full bg-teal-400 ring-2 ring-white"></span><span class="w-5 h-5 rounded-full bg-teal-600 ring-2 ring-white"></span></span>
                  <span class="ml-auto inline-flex w-8 h-[18px] rounded-full bg-teal-600 p-[2px]"><span class="ml-auto block w-3.5 h-3.5 rounded-full bg-white"></span></span>
                </span>`,
  /* the three routes as pills */
  Integrate: `<span class="flex flex-wrap gap-1.5" aria-hidden="true">
                  <span class="rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] font-semibold text-ink-700">Workspace</span>
                  <span class="rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] font-semibold text-ink-700">LMS</span>
                  <span class="rounded-full bg-ink-100 px-2 py-0.5 text-[10.5px] font-semibold text-ink-700">API</span>
                </span>`,
};

/* ═══════════════ 01 · INSTITUTIONAL HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · INSTITUTIONAL HERO =================
       Positioning. The visual is the three outcomes the brief names — Review, Manage,
       Integrate — as one system: three lanes joined by one bracket. Not the v1
       stack of deployment cards, which now lives in section 05 where the decision
       belongs. No checker form, no dashboard, no stock photograph. -->
  <section id="university-plagiarism-checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">

      <div class="rv min-w-0">
${eyebrow('teal-400', COPY.s1.eyebrow)}
        <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.s1.h1, 'University')}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[62ch] mb-7 lg:mb-8">${COPY.s1.support}</p>

        <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 lg:mb-7">
          ${btnDark(COPY.s1.primary, COPY.s1.primaryHref)}
          <a href="${COPY.s1.secondaryHref}" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.secondary}</a>
        </div>

        <p class="text-[13px] sm:text-[13.5px] text-ink-500">${COPY.s1.line}</p>
      </div>

      <!-- the hub: three outcomes joined by one bracket. Every word is the brief's. -->
      <div class="rv min-w-0">
${panel(`            <!-- one bracket on the left joins the three lanes: rounded corners, its arms
                 meeting the first and last tile, a stub to the middle one. No node — the
                 bracket is the "one system". -->
            <div class="relative pl-5 sm:pl-6">
              <span class="absolute left-0 top-9 bottom-9 w-5 sm:w-6 border-l border-t border-b border-ink-200 rounded-l-2xl" aria-hidden="true"></span>
              <span class="absolute left-0 top-1/2 w-5 sm:w-6 h-px bg-ink-200" aria-hidden="true"></span>
              <div class="space-y-3 sm:space-y-3.5">
${COPY.s1.outcomes.map(([name, body]) => `                <div class="rounded-2xl bg-ink-50 ring-1 ring-black/[.04] px-4 py-3.5 sm:px-5 sm:py-4">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                      <p class="text-[15px] sm:text-[16px] font-bold tracking-tight">${name}</p>
                      <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600 mt-0.5">${body}</p>
                    </div>
                    <div class="w-[88px] shrink-0 pt-1">${GLYPH[name]}</div>
                  </div>
                </div>`).join('\n')}
              </div>
            </div>`)}
      </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · REPORT EVIDENCE ═══════════════ */
const section2 = () => `  <!-- ================= 02 · REPORT EVIDENCE =================
       The page's dark act and its one piece of real product UI — the approved component
       from build/report.js, semantics untouched. The three supporting concepts are a
       reading strip under it, not three cards: the report is the focal object and they
       say how to read it. -->
  <section id="institutional-report" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute" style="width:620px;height:620px;left:-13%;top:40px;background:rgba(13,168,194,.12)"></div>
    <div class="orb absolute" style="width:520px;height:520px;right:-10%;bottom:-120px;background:rgba(243,111,90,.10)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10 lg:mb-12">
${eyebrowDark('teal-400', COPY.s2.eyebrow)}
        ${h2(COPY.s2.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[72ch]">${COPY.s2.body}</p>
        <p class="mt-3 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/60 max-w-[72ch]">${COPY.s2.body2}</p>
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

      <!-- how to read it: one strip, three steps, secondary to the report above -->
      <ol class="rv mt-6 sm:mt-8 grid sm:grid-cols-3 rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
${COPY.s2.steps.map(([head, body], i) => `        <li class="flex items-start gap-3.5 px-5 py-4 sm:px-6 sm:py-5">
          <span class="shrink-0 inline-flex w-7 h-7 rounded-full bg-white text-ink-900 text-[12px] font-bold items-center justify-center tabular-nums">${i + 1}</span>
          <span class="min-w-0">
            <span class="block text-[14.5px] sm:text-[15px] font-bold tracking-tight text-white">${head}</span>
            <span class="block text-[12.5px] sm:text-[13px] leading-relaxed text-white/60 mt-0.5">${body}</span>
          </span>
        </li>`).join('\n')}
      </ol>

      <div class="rv mt-5 sm:mt-6 rounded-3xl bg-teal-400/[.07] ring-1 ring-teal-400/25 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30 flex items-center justify-center">
          ${ico('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', '#6ED7E8')}
        </span>
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white font-semibold max-w-[76ch]">${COPY.s2.signature}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · INSTITUTIONAL CONTROL ═══════════════ */
const section3 = () => `  <!-- ================= 03 · INSTITUTIONAL CONTROL =================
       Information Contract A as a relationship map: administrator → invitation (pending)
       → member → what the administrator grants → the member uses what was granted, with
       the personal balance drawn apart at the foot. The four locked items stand beside
       it as a list, not a grid. No dashboard, no permission tiers, no SSO. -->
  <section id="institutional-management" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.s3.eyebrow, 'ink')}
        ${h2(COPY.s3.h2)}
        <p class="${INTRO}">${COPY.s3.intro}</p>
      </div>

      <div class="grid lg:grid-cols-[1.05fr_.95fr] gap-6 lg:gap-12 items-stretch">
        <div class="rv min-w-0">
${panel(`            <ol class="relative space-y-3">
              <span class="absolute left-[21px] top-8 bottom-8 w-px bg-ink-200" aria-hidden="true"></span>
${COPY.s3.flow.map(([label, body, icon], i) => `              <li class="relative">
                <div class="flex items-start gap-4">
                  <span class="relative z-[1] shrink-0 w-11 h-11 rounded-full ${i === 1 ? 'bg-ink-50 ring-1 ring-dashed ring-ink-300' : 'bg-teal-100'} flex items-center justify-center">${ico(icon, i === 1 ? '#6B7280' : '#06748A', 18)}</span>
                  <div class="min-w-0 flex-1 rounded-2xl bg-ink-50 px-4 py-3 sm:px-5 sm:py-3.5">
                    <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">${label}</p>
                    <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600 mt-0.5">${body}</p>${i === 2 ? `
                    <div class="mt-3 pt-3 border-t border-ink-200/70">
                      <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-2">The administrator then sets</p>
                      <div class="flex flex-wrap gap-2">
${COPY.s3.grants.map(g => `                        <span class="inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-black/5 px-3 py-1.5 text-[12px] font-semibold text-ink-800"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>${g}</span>`).join('\n')}
                      </div>
                    </div>` : ''}
                  </div>
                </div>
              </li>`).join('\n')}
            </ol>

            <!-- the critical distinction, drawn apart from the flow -->
            <div class="mt-5 flex items-center gap-4 rounded-2xl bg-orange-50 ring-1 ring-orange-200 px-4 py-3 sm:px-5">
              <span class="shrink-0 w-9 h-9 rounded-full bg-white ring-1 ring-orange-200 flex items-center justify-center">${ico('<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>', '#B84431', 16)}</span>
              <p class="text-[13px] sm:text-[13.5px] font-semibold text-ink-900">${COPY.s3.distinction}</p>
            </div>`)}
        </div>

        <!-- the four locked items as filled cards (DESIGN.md § Card recipes): the muted
             surface sets them apart from the white double bezel beside them at a glance,
             and the column stretches so the four fill the panel's height -->
        <div class="rv-kids min-w-0 flex flex-col gap-4 sm:gap-5">
${COPY.s3.items.map(([head, body, icon], i) => `          <div class="flex-1 flex items-start gap-4 sm:gap-5 rounded-3xl sm:rounded-[28px] bg-ink-50 p-5 sm:p-6">
            <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white ring-1 ring-black/5 items-center justify-center shrink-0">${ico(icon, ['#06748A', '#374151', '#B84431', '#374151'][i])}</span>
            <div class="min-w-0">
              <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1">${head}</h3>
              <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[52ch]">${body}</p>
            </div>
          </div>`).join('\n')}
          <div class="pt-1 sm:pt-2">${linkQuiet(COPY.s3.cta, COPY.s3.ctaHref)}</div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · SOURCES, STORAGE & DOCUMENT HANDLING ═══════════════ */
const section4 = () => `  <!-- ================= 04 · SOURCES, STORAGE & DOCUMENT HANDLING =================
       Information Contract B as a source map. Top lane: the sources feed the check, the
       scan control sits on the check, the check produces the report, the report has its
       own lifecycle. Bottom lane, drawn apart and dashed: the Storage workflow — the
       thing that must NOT look like a consequence of running a check. -->
  <section id="institutional-sources" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.s4.eyebrow)}
        ${h2(COPY.s4.h2)}
        <p class="${INTRO}">${COPY.s4.intro}</p>
      </div>

      <div class="rv">
${panel(`            <!-- lane 1: what a check compares, and what comes out. One bracket gathers the
                 three sources (rounded corners, the hero's device mirrored), one line runs
                 from its middle into the check, one arrow runs from the check to the report.
                 Input and scan control are two parts of one card: the thing being checked
                 and the one control that shapes the check. -->
            <div class="grid lg:grid-cols-[1.15fr_3rem_1fr_3rem_.9fr] gap-4 lg:gap-0 items-center">
              <div>
                <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-3">Comparison sources</p>
                <div class="lg:pr-5 space-y-3">
${COPY.s4.sources.map(([head, body, proof, icon], i) => `                  <div class="relative flex items-start gap-3.5 rounded-2xl bg-ink-50 ring-1 ring-black/[.04] px-4 py-3.5">
                    <!-- the bracket, one piece per tile so each arm leaves from the tile's
                         own centre whatever its height: the first turns down, the middle
                         runs through with a stub, the last turns up; the pieces overlap the
                         gaps between tiles so the spine is one line. The middle stub runs
                         on through the bracket into the check. -->
                    ${i === 0
                      ? '<span class="hidden lg:block absolute left-full top-1/2 -bottom-3 w-5 border-t border-r border-ink-200 rounded-tr-2xl" aria-hidden="true"></span>'
                      : i === 1
                        ? '<span class="hidden lg:block absolute left-full -top-3 -bottom-3 w-5 border-r border-ink-200" aria-hidden="true"></span><span class="hidden lg:block absolute left-full top-1/2 w-[calc(1.25rem+3rem)] h-px bg-ink-200" aria-hidden="true"></span>'
                        : '<span class="hidden lg:block absolute left-full -top-3 bottom-1/2 w-5 border-b border-r border-ink-200 rounded-br-2xl" aria-hidden="true"></span>'}
                    <span class="shrink-0 w-10 h-10 rounded-xl bg-white ring-1 ring-black/5 flex items-center justify-center">${ico(icon, '#374151', 18)}</span>
                    <div class="min-w-0">
                      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-0.5">${i === 2 ? 'Institution-controlled' : 'External'}</p>
                      <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">${head}</p>
                      <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600 mt-0.5">${body}</p>${proof ? `
                      <p class="text-[12px] font-semibold text-teal-700 mt-1.5">${proof}</p>` : ''}
                    </div>
                  </div>`).join('\n')}
                </div>
              </div>

              <div class="hidden lg:block" aria-hidden="true"></div>

              <div>
                <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-3">The check</p>
                <!-- two tiles in the teal tint, joined by a bracket on their left: the thing
                     being checked and the one control that shapes the check. The line from
                     the sources lands on the bracket's spine. -->
                <div class="relative lg:px-5 space-y-3">
                  <!-- the arrow to the report leaves from the middle of the right-hand
                       bracket, so it is drawn on the tiles' wrapper, not on the row -->
                  <span class="hidden lg:flex absolute left-full top-1/2 -translate-y-1/2 w-12 items-center" aria-hidden="true">
                    <span class="flex-1 h-px bg-ink-200"></span>
                    <svg class="-ml-1.5 shrink-0" width="10" height="12" viewBox="0 0 10 12" fill="#D1D5DB"><path d="M0 0 10 6 0 12z"/></svg>
                  </span>
                  <div class="relative flex items-start gap-3.5 rounded-2xl bg-teal-50 ring-1 ring-teal-200 px-4 py-3.5">
                    <span class="hidden lg:block absolute right-full top-1/2 -bottom-3 w-5 border-t border-l border-ink-200 rounded-tl-2xl" aria-hidden="true"></span>
                    <span class="hidden lg:block absolute left-full top-1/2 -bottom-3 w-5 border-t border-r border-ink-200 rounded-tr-2xl" aria-hidden="true"></span>
                    <span class="shrink-0 w-10 h-10 rounded-xl bg-white ring-1 ring-teal-200 flex items-center justify-center">${ico('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/>', '#06748A', 18)}</span>
                    <div class="min-w-0">
                      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700 mb-0.5">Input</p>
                      <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">${COPY.s4.input}</p>
                      <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600 mt-0.5">${COPY.s4.check}</p>
                    </div>
                  </div>
                  <div class="relative flex items-start gap-3.5 rounded-2xl bg-teal-50 ring-1 ring-teal-200 px-4 py-3.5">
                    <span class="hidden lg:block absolute right-full -top-3 bottom-1/2 w-5 border-b border-l border-ink-200 rounded-bl-2xl" aria-hidden="true"></span>
                    <span class="hidden lg:block absolute left-full -top-3 bottom-1/2 w-5 border-b border-r border-ink-200 rounded-br-2xl" aria-hidden="true"></span>
                    <span class="shrink-0 w-10 h-10 rounded-xl bg-white ring-1 ring-teal-200 flex items-center justify-center">${ico('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>', '#06748A', 18)}</span>
                    <div class="min-w-0">
                      <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700 mb-0.5">Scan control</p>
                      <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">${COPY.s4.control[0]}</p>
                      <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600 mt-0.5">${COPY.s4.control[1]}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block" aria-hidden="true"></div>

              <div>
                <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-3">Output</p>
                <div class="rounded-2xl bg-white ring-1 ring-black/5 shadow-diffuse px-5 py-4">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">${ico('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>', '#B84431', 16)}</span>
                    <p class="text-[15px] font-bold tracking-tight">${COPY.s4.output}</p>
                  </div>
                  <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-ink-600">${COPY.s4.lifecycle}</p>
                </div>
              </div>
            </div>

            <!-- lane 2: Storage, a separate workflow — dashed, its own row, its own verb -->
            <div class="mt-6 lg:mt-8 rounded-2xl sm:rounded-3xl bg-teal-50/60 ring-1 ring-dashed ring-teal-300 p-4 sm:p-5">
              <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-teal-700 mb-3">Separate workflow</p>
              <ol class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
${COPY.s4.branch.map((label, i) => `                <li class="relative flex items-center gap-3 rounded-2xl bg-white ring-1 ring-black/5 px-4 py-3">
                  <span class="shrink-0 inline-flex w-6 h-6 rounded-full bg-ink-100 text-ink-700 text-[11px] font-bold items-center justify-center tabular-nums">${i + 1}</span>
                  <span class="text-[13px] sm:text-[13.5px] font-semibold text-ink-900 leading-snug">${label}</span>
                </li>`).join('\n')}
              </ol>
            </div>`)}
      </div>

      <div class="rv mt-6 lg:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-3xl bg-orange-50 ring-1 ring-orange-200 p-5 sm:p-6 lg:p-7">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-100 flex items-center justify-center">
          ${ico('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>', '#B84431')}
        </span>
        <p class="min-w-0 flex-1 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-900 font-semibold max-w-[80ch]">${COPY.s4.clarification}</p>
        <span class="shrink-0">${linkQuiet(COPY.s4.cta, COPY.s4.ctaHref)}</span>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · DEPLOYMENT ═══════════════ */
const section5 = () => `  <!-- ================= 05 · DEPLOYMENT =================
       Information Contract C as a decision: the intro's own question is the root, the
       three decision rules are the branches, and each branch lands on its path. The
       hero said Review / Manage / Integrate; this answers "how should we deploy it?" —
       different question, different picture. -->
  <section id="institutional-workflow" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.s5.eyebrow, 'ink')}
        ${h2(COPY.s5.h2)}
        <p class="${INTRO}">${COPY.s5.intro}</p>
      </div>

      <!-- the root: where do your users already submit, check, and review work? -->
      <div class="rv flex flex-col items-center">
        <div class="rounded-full bg-ink-950 text-white px-5 py-3 sm:px-6 text-[13.5px] sm:text-[14.5px] font-semibold text-center max-w-[52ch]">Where do your users already submit, check, and review work?</div>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${COPY.s5.paths.map(([label, title, body, ctas, rule, icon], i) => `        <div class="relative flex flex-col">
          <!-- the branch. The whole tree lives in the grid so every line shares one
               coordinate system: the middle column carries the stem from the root down
               to its card and the bar across its own width; the outer columns start at
               the bar's height, reach across the grid gap to meet it, and turn down with
               a rounded corner. -->
          ${i === 1
            ? '<div class="hidden md:block relative h-16 sm:h-20" aria-hidden="true"><span class="absolute left-1/2 top-0 bottom-0 w-px bg-ink-200"></span><span class="absolute left-0 right-0 top-8 sm:top-10 h-px bg-ink-200"></span></div>'
            : '<div class="hidden md:block h-16 sm:h-20" aria-hidden="true"><div class="mt-8 sm:mt-10 h-8 sm:h-10 ' + (i === 0
                ? 'ml-[50%] -mr-4 sm:-mr-5 lg:-mr-6 border-t border-l border-ink-200 rounded-tl-2xl'
                : 'mr-[50%] -ml-4 sm:-ml-5 lg:-ml-6 border-t border-r border-ink-200 rounded-tr-2xl') + '"></div></div>'}
          <!-- the decision rule the brief attaches to this path -->
          <div class="rounded-2xl bg-ink-50 ring-1 ring-black/[.04] px-4 py-3 sm:px-5">
            <p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500 mb-1">If</p>
            <p class="text-[13.5px] sm:text-[14px] font-semibold text-ink-900 leading-snug">${rule}</p>
          </div>
          <span class="mx-auto w-px h-5 bg-ink-200" aria-hidden="true"></span>
          <div class="flex-1 rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8 flex flex-col">
            <div class="flex items-center justify-between gap-3 mb-4 lg:mb-5">
              <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500">${label}</span>
              ${chip(['teal', 'orange', 'ink'][i], icon)}
            </div>
            <h3 class="text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-2.5">${title}</h3>
            <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 mb-5">${body}</p>
            <div class="flex flex-wrap gap-x-5 gap-y-2">
${ctas.map(([l, h]) => `              ${linkQuiet(l, h)}`).join('\n')}
            </div>
          </div>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · OPTIONAL AI CHECKING ═══════════════ */
const section6 = () => `  <!-- ================= 06 · OPTIONAL AI CHECKING =================
       The compact banner (build/banner.js): secondary, no AI report, no model names, no
       accuracy, no pricing. The aside draws the one relationship the copy states — one
       organization balance, two allocations. -->
${banner({
    id: 'institutional-ai',
    orb: 'rgba(154,106,222,.18)',
    eyebrow: ['teal-400', COPY.s6.eyebrow],
    h2: COPY.s6.h2,
    lead: COPY.s6.lead, leadMax: '60ch',
    after: `            <p class="flex items-start gap-2.5 rounded-2xl bg-orange-400/10 ring-1 ring-orange-400/30 px-4 py-3 mt-4 text-[12.5px] sm:text-[13px] leading-relaxed text-orange-100">
              <svg class="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              ${COPY.s6.clarification}
            </p>`,
    action: banner.btn(COPY.s6.cta, COPY.s6.ctaHref),
    actionUnder: 'aside',
    aside: `          <div class="min-w-0 rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6" aria-hidden="true">
            <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${COPY.s6.branch.parent[1]}</svg>
              ${COPY.s6.branch.parent[0]}
            </p>
            <div class="space-y-3 pl-6">
${COPY.s6.branch.children.map(([label, icon], i) => `              <div class="relative flex items-center gap-3.5 rounded-2xl bg-white/[.06] ring-1 ring-white/10 px-4 py-3">
                ${i === 0
                  ? '<span class="absolute right-full top-1/2 -bottom-3 w-6 border-t border-l border-white/15 rounded-tl-2xl" aria-hidden="true"></span>'
                  : '<span class="absolute right-full -top-3 bottom-1/2 w-6 border-b border-l border-white/15 rounded-bl-2xl" aria-hidden="true"></span>'}
                <span class="shrink-0 w-10 h-10 rounded-xl bg-white/[.07] ring-1 ring-white/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${/^AI/.test(label) ? '#F58971' : '#5AD3E4'}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
                </span>
                <span class="text-[12.5px] sm:text-[13px] font-semibold text-white/85 leading-snug">${label}</span>
              </div>`).join('\n')}
            </div>
          </div>`,
  })}`;

/* ═══════════════ 07 · INSTITUTIONAL INQUIRY ═══════════════ */
const section7 = () => `  <!-- ================= 07 · INSTITUTIONAL INQUIRY =================
       The approved form, exactly: eight fields, no phone, no Moodle URL, the consent
       control with both legal destinations, the success state. Inert — submission is
       the shared backend's. -->
  <section id="institutional-inquiry" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', COPY.s7.eyebrow, 'ink')}
          ${h2(COPY.s7.h2)}
          <p class="${INTRO} max-w-[56ch]">${COPY.s7.intro}</p>
          <p class="mt-6 lg:mt-7 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500">${COPY.s7.alt} <a href="mailto:${COPY.s7.altMail}" class="font-semibold text-ink-700 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s7.altMail}</a>.</p>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
          <form onsubmit="return false" novalidate>
            <div class="grid sm:grid-cols-2 gap-4 sm:gap-5">
${COPY.s7.fields.map(([label, spec, required, helper, kind, wide], i) => {
  const id = 'uq-' + i;
  const control = kind === 'textarea'
    ? `<textarea class="cf-field" id="${id}" rows="4" placeholder="${spec}"></textarea>`
    : kind === 'select'
      ? `<select class="cf-field" id="${id}">\n                  <option value="">Select an option</option>\n` +
        spec.map(o => `                  <option>${o}</option>`).join('\n') + '\n                </select>'
      : `<input class="cf-field" id="${id}" type="${kind === 'email' ? 'email' : 'text'}" placeholder="${spec}">`;
  return `              <div class="${wide ? 'sm:col-span-2' : 'min-w-0'}">
                <label class="cf-label" for="${id}">${label}${required ? ' <i>*</i>' : ''}</label>
                ${control}${helper ? `
                <p class="mt-2 text-[12px] text-ink-500">${helper}</p>` : ''}
              </div>`;
}).join('\n')}
            </div>

            <label class="flex items-start gap-3 mt-6 lg:mt-7 cursor-pointer">
              <input type="checkbox" id="uq-consent" class="mt-0.5 w-4 h-4 shrink-0 accent-teal-600">
              <span class="text-[13px] leading-relaxed text-ink-600">I agree to the ${inline('Terms of Use', COPY.s7.terms)} and ${inline('Privacy Policy', COPY.s7.policy)}. <i class="not-italic text-orange-700">*</i></span>
            </label>

            <div class="mt-6 lg:mt-7">
              <button type="submit" class="btn-press group flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold pl-5 sm:pl-6 pr-2 py-2">
                ${COPY.s7.cta}
                <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
              </button>
            </div>
          </form>

          <div class="mt-6 pt-6 border-t border-ink-100" hidden id="uq-success" role="status">
            <h3 class="text-[15.5px] font-bold tracking-tight mb-1.5">${COPY.s7.successHeading}</h3>
            <p class="text-[13px] leading-relaxed text-ink-600">${COPY.s7.successCopy}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · UNIVERSITY FAQ ═══════════════ */
const section8 = () => `  <!-- ================= 08 · UNIVERSITY FAQ =================
       Nine questions, full answers in the HTML, the four answer links the brief attaches. -->
  <section id="university-faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', COPY.s8.eyebrow)}
          ${h2(COPY.s8.h2)}
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.s8.items.map(([q, a], i) => {
  const links = COPY.s8.links[i];
  const tail = links ? ' ' + links.map(([l, h]) => inline(l, h)).join(' · ') : '';
  return `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${a}${tail}</p></div></div>
            </div>`;
}).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · FINAL CTA ═══════════════ */
const section9 = () => `  <!-- ================= 09 · FINAL CTA =================
       The closing band (build/cta.js). Primary returns to the form; secondary sends the
       reader back to the deployment decision. -->
  <section id="institutional-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('institutional-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.s9.h2, 'fits your')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[62ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.s9.support}</p>
      <div class="rv flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        <a href="${COPY.s9.primaryHref}" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          ${COPY.s9.primary}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <a href="${COPY.s9.secondaryHref}" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s9.secondary}</a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles. The .cab-* rules are the report component's contract, carried
   verbatim; the .cf-* rules are the inquiry form's, carried from v1.
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

  /* dashed rings: Tailwind's ring is a shadow and cannot dash, so these are borders */
  .ring-dashed { box-shadow:none !important; border:1px dashed currentColor; }
  .ring-dashed.ring-ink-300 { border-color:#D1D5DB; }
  .ring-dashed.ring-teal-300 { border-color:#6ED7E8; }

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

  /* ---------- the shared inquiry-form fields ---------- */
  .cf-label { display:block; font-size:12px; font-weight:700; letter-spacing:.01em; color:#4B5563; margin-bottom:7px; }
  .cf-label i { font-style:normal; color:#B84431; }
  .cf-field { width:100%; height:48px; padding:0 14px; border-radius:10px; border:1px solid #E5E7EB;
    background:#fff; color:#111827; font-size:14.5px; font-weight:500; font-family:inherit;
    transition:border-color .15s ease, box-shadow .15s ease; }
  .cf-field::placeholder { color:#9CA3AF; font-weight:400; }
  .cf-field:focus { outline:none; border-color:#0CA9C3; box-shadow:0 0 0 1px #0CA9C3; }
  textarea.cf-field { height:auto; padding:12px 14px; line-height:1.6; resize:none; }
  select.cf-field { appearance:none; cursor:pointer;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }

  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
${cta.style('institutional-cta')}
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour — the report's own interaction, the accordion, the burger. Nothing new.
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
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
