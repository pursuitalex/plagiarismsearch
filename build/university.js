/* Generate site/university-plagiarism-checker.html — the DEC-0043 institutional page.

   This one replaces a stub rather than standing beside a previous version, so there is
   no -v2 file and no version switcher: it is the first real page at this URL.

   Two constraints shape it more than anything else.

   THE ASSET GATE. DEC-0043 asks for real Organization Management and Moodle screenshots
   and then says, plainly, that if they are unavailable "do not create fictional product
   UI — use neutral diagrams, structured copy, icons or abstract workflow visuals until
   real assets are supplied." No such captures exist in this repo. So the management,
   Moodle and deployment sections are built from structure and type, not from drawings of
   screens that would be inventions. The one piece of real product evidence on the page
   is the report, and it is the approved component rather than a university-specific one.

   NO PAGE MOCK. There is no designer comp for this URL and the brief forbids inventing a
   parallel visual language, so every pattern here already exists elsewhere in the system:
   the double-bezel bento, the dark product-evidence act, the shared report, the FAQ
   accordion, the inquiry form family and the dotted closing band.

   Run:  node build/university.js  →  node build/shell.js  →  node build/check-university.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'university-plagiarism-checker.html';
const cta = require('./cta');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

/* /organization-management has no page in this prototype and is a live production URL,
   the same treatment user-manuals gives the guides that still live on production. */
const ORG = 'https://plagiarismsearch.com/organization-management';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — DEC-0043, 2026-08-25. Verbatim.

   Destinations: /integration-guide → integration-guide.html, /plagiarism-api → api.html,
   /ai-content-detector → ai-detector.html, /policy → policy.html,
   /terms-of-use → terms-of-use.html, /organization-management → absolute (see above).
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'University Plagiarism Checker for Higher Education | PlagiarismSearch',
  meta: 'Manage plagiarism checking across your institution with source reports, organization permissions, shared Storage, Moodle workflows, and API integration.',
  canonical: 'https://plagiarismsearch.com/university-plagiarism-checker',

  s1: {
    eyebrow: 'FOR UNIVERSITIES &amp; HIGHER EDUCATION',
    h1: 'University Plagiarism Checker',
    support: 'Support academic integrity with plagiarism checking your institution can manage. Give educators source evidence they can review, let administrators control access and checking balances, and choose the workflow that fits your institution — the PlagiarismSearch organization workspace, Moodle, or API.',
    primary: 'Request institutional pricing',
    primaryHref: '#institutional-inquiry',
    secondary: 'See how it works',
    secondaryHref: '#institutional-report',
    line: 'For universities, colleges, academic departments, and other educational institutions.',
    /* The three workflows the supporting sentence names, quoted from it. The asset gate
       rules out a real screenshot in this hero and names the substitute in the same
       breath — "neutral diagrams, structured copy, icons or abstract workflow visuals"
       — so the hero draws the choice rather than showing a product that is not there. */
    paths: [
      ['Organization workspace', '<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/>'],
      ['Moodle', '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'],
      ['API', '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>'],
    ],
  },

  s2: {
    h2: 'Give educators evidence they can review',
    intro: 'After a plagiarism check, the report highlights matching and similar passages and links them to detected sources. Educators can inspect the matched text, review the source context, and consider citations and references before reaching a conclusion.',
    supporting: 'A similarity result is evidence for review, not an automatic decision that academic misconduct occurred. The report helps educators understand where a match comes from and evaluate it in context.',
    items: [
      ['Matched passages', 'See where matching or similar text appears in the submitted document.'],
      ['Detected sources', 'Review the sources connected to individual matches.'],
      ['Interactive review', 'Select a match to highlight the corresponding passage and inspect its source.'],
    ],
    callout: 'A similarity percentage should be interpreted together with the underlying matches, sources, citations, and context.',
  },

  s3: {
    h2: 'Manage people, permissions, and checking balances across your institution',
    intro: 'PlagiarismSearch Organization Management gives administrators a central place to manage who can use institutional resources and how those resources are distributed.',
    /* head, body, Lucide path, bento span. Exactly five — "do not add analytics,
       classes, assignments or SSO". */
    items: [
      ['Invite and manage members',
       'Add members to the organization by email and manage their access as your institutional team changes. Administrators can also block or restore member access when needed.',
       '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>', 'lg:col-span-3'],
      ['Set permissions',
       'Control which members can use organization Storage, search that Storage during plagiarism checks, access stored documents, and use organization checking resources.',
       '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 'lg:col-span-2'],
      ['Allocate plagiarism balance',
       'Distribute plagiarism-checking words from the organization balance to individual members according to the institution’s needs.',
       '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', 'lg:col-span-2'],
      ['Allocate AI balance separately',
       'If your institution also uses AI detection, administrators can allocate AI words separately from plagiarism-checking balance.',
       '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>', 'lg:col-span-3'],
      ['Keep personal and organization usage separate',
       'Organization members can receive institutional balance while keeping their own personal balance separate. Personal balance is not shared with other members of the organization.',
       '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>', 'lg:col-span-5'],
    ],
    cta: 'Explore Organization Management',
    ctaHref: ORG,
  },

  s4: {
    h2: 'Compare academic work with external and institutional sources',
    intro: 'Different institutions need different comparison sources. PlagiarismSearch can combine external source checking with your institution’s own controlled Storage when that workflow is enabled.',
    items: [
      ['Web sources', 'Search available web sources for matching and similar text relevant to the submitted document.', null],
      ['Academic database', 'Include an academic database with more than 500 million indexed academic texts when academic source coverage is required.', '500M+ indexed academic texts'],
      ['Organization Storage', 'Use your institution’s Organization Storage as an additional comparison source when members have the required permissions.', null],
      ['Keep citations and references in context', 'PlagiarismSearch includes controls for excluding references and in-text citations when those parts should not affect the similarity result.', null],
    ],
    clarification: 'Running a plagiarism check does not by itself mean that the document becomes part of Organization Storage. Storage is a separate workflow that the institution can use when it wants selected material to participate in future comparisons.',
  },

  s5: {
    h2: 'Use PlagiarismSearch in the workflow that fits your institution',
    intro: 'Institutions do not all manage plagiarism checking in the same way. PlagiarismSearch supports three practical paths depending on how your faculty, administrators, and technical teams already work.',
    /* head, body, supporting label, cta, href */
    paths: [
      ['Organization workspace',
       'Use PlagiarismSearch directly with an organization account when you need centralized member management, permissions, institutional balances, and shared Storage without building a custom integration.',
       'Managed institutional access', null, null],
      ['Moodle integration',
       'Bring plagiarism checking into Moodle when student submission and course workflows belong inside your LMS. Configure when checks run, which sources are searched, and what report information students can see.',
       'LMS workflow', 'View Moodle integration', 'integration-guide.html'],
      ['API integration',
       'Use the PlagiarismSearch API when your institution has its own platform or needs plagiarism checking inside a custom technical workflow.',
       'Custom integration', 'Explore the API', 'api.html'],
    ],
  },

  s6: {
    h2: 'Bring plagiarism checking into Moodle',
    intro: 'The PlagiarismSearch Moodle plugin lets institutions keep plagiarism checking inside the LMS workflow instead of requiring every document to be uploaded manually through a separate interface.',
    controls: [
      ['Automatic or manual checking', 'Choose whether a document is checked automatically after a student uploads it or submitted for checking manually.'],
      ['Choose the comparison sources', 'Configure checks to use Web sources, Storage, or both according to the course or institutional workflow.'],
      ['Decide when work is added to Storage', 'Use the Add to Storage setting when submitted material should become available for future comparisons.'],
      ['Handle references and citations', 'Exclude references and in-text citations when those matches should not contribute to the similarity result.'],
      ['Control what students can see', 'Decide whether students can view plagiarism reports and whether the plagiarism percentage is visible to them.'],
      ['Manage submissions and revisions', 'Allow or restrict student submissions and resubmissions, and set how many resubmissions are permitted when revision is part of the course workflow.'],
    ],
    cta: 'View the Moodle integration guide',
    ctaHref: 'integration-guide.html',
  },

  s7: {
    h2: 'Different roles, one institutional plagiarism-checking workflow',
    intro: 'Plagiarism checking affects more than one group inside an institution. PlagiarismSearch separates administrative control, academic review, and technical deployment so each team can focus on its own responsibility.',
    roles: [
      ['Administrators', 'Manage organization membership, permissions, plagiarism and AI balances, and access to Organization Storage.',
       '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'],
      ['Educators', 'Review matching passages and detected sources, use relevant scan controls, and interpret the report in the academic context of the submitted work.',
       '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'],
      ['Technical and LMS teams', 'Deploy the Moodle plugin or use the PlagiarismSearch API when plagiarism checking needs to become part of an existing institutional system.',
       '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>'],
    ],
  },

  s8: {
    h2: 'Keep plagiarism checking and institutional Storage under separate controls',
    intro: 'A plagiarism check and adding material to institutional Storage are different actions. This distinction lets institutions decide when documents should only be checked and when selected material should also be available as a reference source for future comparisons.',
    steps: [
      ['Check', 'Submit content for plagiarism analysis and review the generated report.'],
      ['Retain the report when needed', 'Generated reports may remain available in the account for convenient access. Users can permanently delete reports they no longer need.'],
      ['Use Storage intentionally', 'Organization Storage is a separate repository workflow. Material is used there when Storage is enabled and the relevant workflow or permissions allow it.'],
    ],
    clarification: 'A document does not automatically become part of Organization Storage simply because it was checked.',
    cta: 'Read the Privacy Policy',
    ctaHref: 'policy.html',
  },

  s9: {
    h2: 'Need AI checking as part of the same institutional setup?',
    /* The approved paragraph, split at its own full stop. Nothing added or reordered. */
    lead: 'AI detection is available as a separate analysis within the PlagiarismSearch product ecosystem.',
    support: 'When an organization uses AI checking, administrators can allocate AI word balance to members separately from plagiarism-checking balance.',
    /* two balances from one organization — section 3's own wording, drawn */
    /* One pool of words split into two allocations. "Plagiarism balance" and "AI
       balance" are the brief's own subsection headings, allocated from what it calls
       "the organization balance" — so all three labels are its words, not mine.
       Both children share the coins glyph because they are the same kind of object;
       the wallet on the parent is what makes the split legible. */
    branch: {
      parent: ['Organization balance', "<path d=\"M17 14h.01\"/><path d=\"M7 7h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10\"/>"],
      children: [
        ['Plagiarism balance', "<circle cx=\"8\" cy=\"8\" r=\"6\"/><path d=\"M18.09 10.37A6 6 0 1 1 10.34 18\"/><path d=\"M7 6h1v4\"/><path d=\"m16.71 13.88.7.71-2.82 2.82\"/>"],
        ['AI balance', "<circle cx=\"8\" cy=\"8\" r=\"6\"/><path d=\"M18.09 10.37A6 6 0 1 1 10.34 18\"/><path d=\"M7 6h1v4\"/><path d=\"m16.71 13.88.7.71-2.82 2.82\"/>"],
      ],
    },
    clarification: 'AI-generated text is not automatically plagiarism, so plagiarism checking and AI detection should be interpreted as separate results.',
    cta: 'Learn about AI detection',
    ctaHref: 'ai-detector.html',
  },

  s10: {
    h2: 'Discuss plagiarism checking for your institution',
    intro: 'Tell us how your institution plans to manage users, checking volume, Storage, and integrations. We’ll use those details to discuss an appropriate institutional setup and pricing path.',
    /* label, placeholder/options, required, helper, kind, wide */
    fields: [
      ['Name', 'Jordan Reeves', true, null, 'text', false],
      ['Work email', 'name@university.edu', true, null, 'email', false],
      ['Institution', 'University or college name', true, null, 'text', true],
      ['Your role', ['Academic or faculty', 'Administration', 'Academic integrity', 'IT or LMS', 'Procurement', 'Other'], false, null, 'select', false],
      ['How do you plan to use PlagiarismSearch?', ['Organization workspace', 'Moodle', 'API', 'Not sure yet', 'Other'], false, null, 'select-use', false],
      ['Approximate institution size', 'e.g. 5,000 students or users', false, 'An estimate is enough.', 'text', false],
      ['Approximate monthly checking volume', 'e.g. 2,000 documents or 1,000,000 words', false, 'Use whichever estimate is easier for your institution.', 'text', false],
      ['Moodle URL', 'https://moodle.university.edu', false, null, 'moodle', true],
      ['Institutional requirements', 'Tell us about your plagiarism-checking workflow, source or Storage requirements, integration needs, or any questions we should consider.', true, null, 'textarea', true],
    ],
    consent: 'I agree to the Terms of Use and Privacy Policy.',
    terms: 'terms-of-use.html',
    policy: 'policy.html',
    cta: 'Request institutional pricing',
    successHeading: 'Your institutional request has been sent',
    successCopy: 'Thank you. We’ve received the information about your institution and plagiarism-checking requirements.',
    altHref: 'mailto:services@plagiarismsearch.com',
  },

  s11: {
    h2: 'University Plagiarism Checker FAQ',
    items: [
      ['Can our university manage multiple PlagiarismSearch users?', 'Yes. PlagiarismSearch Organization Management lets an administrator create an organization, invite members, manage access, and control how institutional resources are used.'],
      ['Can administrators allocate plagiarism-checking balance to individual members?', 'Yes. Administrators can distribute plagiarism-checking words from the organization balance to individual members according to the institution’s needs.'],
      ['Can administrators also allocate AI checking balance?', 'Yes. AI words can be allocated separately when AI checking is part of the organization’s workflow. AI detection remains a separate analysis from plagiarism checking.'],
      ['Can our institution compare new submissions with its own documents?', 'Yes, when Organization Storage is enabled and the relevant permissions are available. Organization Storage can be used as an institutional comparison source alongside external sources selected for the check.'],
      ['Does every checked document automatically enter Organization Storage?', 'No. Running a plagiarism check does not automatically make the document part of Organization Storage. Storage is a separate workflow that the institution uses when it wants selected material to participate in future comparisons.'],
      ['Does PlagiarismSearch integrate with Moodle?', 'Yes. The PlagiarismSearch Moodle plugin supports plagiarism checking within LMS workflows, including automatic or manual checks, Web and Storage source settings, reference and citation exclusions, student report visibility, submissions, and resubmission controls.'],
      ['Can students submit papers and view plagiarism reports inside Moodle?', 'Moodle administrators can configure whether students may submit papers, resubmit revised work, view reports, and see the plagiarism percentage. These options can be adjusted to fit the institution’s course workflow.'],
      ['Can our institution use the API instead of Moodle?', 'Yes. Institutions with their own platform or custom technical workflow can integrate plagiarism checking through the PlagiarismSearch API. Moodle and API are separate deployment paths, so the institution can choose the approach that fits its existing systems.'],
      ['What sources can be included in an institutional plagiarism check?', 'Depending on the selected configuration and available access, checks can use Web sources, an academic database with more than 500 million indexed academic texts, and permitted Organization Storage.'],
      ['Does the plagiarism report automatically decide that a student plagiarized?', 'No. The report identifies matching and similar passages and connects them to detected sources. Educators should review the matches, citations, references, and surrounding context before deciding how the result should be interpreted academically.'],
      ['How do we get institutional pricing?', 'Institutional requirements can vary by scale, checking volume, Storage needs, and integration workflow. Send your requirements through the institutional inquiry form on this page so PlagiarismSearch can discuss an appropriate setup and pricing path.'],
    ],
    /* answer 8 embeds a link, answer 11 embeds a CTA */
    apiLinkText: 'PlagiarismSearch API',
    apiLinkHref: 'api.html',
    inAnswerCta: 'Request institutional pricing',
    inAnswerHref: '#institutional-inquiry',
  },

  s12: {
    h2: 'Build a plagiarism-checking workflow that fits your institution',
    support: 'Give educators source evidence they can review, give administrators control over institutional access and resources, and choose the deployment path that fits your existing workflow.',
    primary: 'Request institutional pricing',
    primaryHref: '#institutional-inquiry',
    secondary: 'View Moodle integration',
    secondaryHref: 'integration-guide.html',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's, per "do not invent a parallel visual language".
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
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;

const btnLight = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;

const linkQuiet = (label, href, dark) => `<a href="${href}"${ext(href)} class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold ${dark ? 'text-white/70 hover:text-white decoration-white/30' : 'text-ink-500 hover:text-ink-900 decoration-ink-300'} underline underline-offset-4 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* the double-bezel card, the vocabulary the capabilities grids established */
const assetSlot = (token, what) => `      <!-- ASSET SLOT — waiting on a real capture. Replace this whole block with the
           screenshot; nothing else in the section has to change. Do not draw a mock in
           its place: DEC-0043 forbids inventing product UI where a real one is missing. -->
      <div class="rv ph flex flex-col items-center justify-center text-center gap-3 px-6 py-12 sm:py-16 lg:py-20 aspect-[16/10] sm:aspect-[16/9] max-h-[520px]">
        <span class="w-12 h-12 rounded-2xl bg-ink-100 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </span>
        <p class="text-[12.5px] sm:text-[13px] font-bold tracking-[0.14em] uppercase text-ink-600">${token}</p>
        <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600 max-w-[46ch]">${what}</p>
        <p class="text-[12px] leading-relaxed text-ink-600 max-w-[52ch]">Crop and frame it, but keep the real labels and states — do not add controls the product does not have.</p>
      </div>`;

const bezel = (span, inner) => `        <div class="min-w-0 ${span} rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse spotlight">
          <div class="min-w-0 h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-7 lg:p-8 flex flex-col">
${inner}
          </div>
        </div>`;

const chip = (tint, icon, big) => {
  const C = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'] }[tint];
  return `            <span class="inline-flex ${big ? 'w-12 h-12' : 'w-11 h-11'} rounded-xl sm:rounded-[14px] lg:rounded-2xl ${C[0]} items-center justify-center mb-4 sm:mb-5">
              <svg width="${big ? 22 : 20}" height="${big ? 22 : 20}" viewBox="0 0 24 24" fill="none" stroke="${C[1]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
            </span>`;
};

/* ═══════════════ 01 · INSTITUTIONAL HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · INSTITUTIONAL HERO =================
       "Do not place an individual plagiarism-checker input in this hero. This is an
       institutional procurement/solution page." So the primary object is the decision,
       not a tool: category, outcome, and the two approved actions. -->
  <section id="university-plagiarism-checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">

      <div class="rv min-w-0">
${eyebrow('teal-400', COPY.s1.eyebrow)}
        <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.s1.h1, 'University')}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[70ch] mb-7 lg:mb-8">${COPY.s1.support}</p>

        <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 lg:mb-7">
          ${btnDark(COPY.s1.primary, COPY.s1.primaryHref)}
          <a href="${COPY.s1.secondaryHref}" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s1.secondary}</a>
        </div>

        <p class="text-[13px] sm:text-[13.5px] text-ink-500">${COPY.s1.line}</p>
      </div>

      <!-- The workflow choice, drawn. Every word in it is lifted from the supporting
           sentence above, so the panel adds structure without adding copy — and it is a
           diagram rather than a product screen, which is what the asset gate requires
           where no real capture exists. The three sit on one spine because they are one
           decision, not three features. -->
      <div class="rv min-w-0">
        <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-white/60 ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-8">
            <div class="relative space-y-3 sm:space-y-4">
              <span class="absolute left-[23px] sm:left-[25px] top-9 bottom-9 w-px bg-ink-200" aria-hidden="true"></span>
${COPY.s1.paths.map(([name, icon]) => `              <div class="relative flex items-center gap-4 rounded-2xl bg-ink-50 px-4 py-4 sm:px-5">
                <span class="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white ring-1 ring-black/5 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>
                </span>
                <span class="text-[15px] sm:text-[16px] font-bold tracking-tight">${name}</span>
              </div>`).join('\n')}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · REAL REPORT / FACULTY EVIDENCE ═══════════════ */
const section2 = () => `  <!-- ================= 02 · REAL REPORT / FACULTY EVIDENCE =================
       The page's first dark act, and its only piece of real product UI. The component is
       the approved one from build/report.js — the brief requires reuse and forbids a
       university-specific report, so the framing is institutional and the semantics are
       untouched. No misconduct labels, no thresholds, no invented fields. -->
  <section id="institutional-report" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute" style="width:620px;height:620px;left:-13%;top:40px;background:rgba(13,168,194,.12)"></div>
    <div class="orb absolute" style="width:520px;height:520px;right:-10%;bottom:-120px;background:rgba(243,111,90,.10)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[760px] mb-8 sm:mb-10 lg:mb-12">
${eyebrowDark('teal-400', 'Report evidence')}
        ${h2(COPY.s2.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[72ch]">${COPY.s2.intro}</p>
        <p class="mt-3 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/60 max-w-[72ch]">${COPY.s2.supporting}</p>
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

      <!-- the three things an educator does with it, and the caveat about how to read it -->
      <div class="rv-kids grid sm:grid-cols-3 gap-4 sm:gap-5 mt-6 sm:mt-8">
${COPY.s2.items.map(([head, body]) => `        <div class="rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6">
          <h3 class="text-[15px] sm:text-[16px] font-bold tracking-tight text-white mb-1.5">${head}</h3>
          <p class="text-[12.5px] sm:text-[13px] leading-relaxed text-white/65">${body}</p>
        </div>`).join('\n')}
      </div>

      <div class="rv mt-6 sm:mt-8 rounded-3xl bg-teal-400/[.07] ring-1 ring-teal-400/25 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ED7E8" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </span>
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white font-semibold max-w-[76ch]">${COPY.s2.callout}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · ORGANIZATION MANAGEMENT ═══════════════ */
const section3 = () => `  <!-- ================= 03 · ORGANIZATION MANAGEMENT =================
       ASSET GATE. There is no real Organization Management screenshot in this repo and
       the brief forbids inventing one, so this is structure and type rather than a
       drawing of an admin screen. Five capabilities, exactly the approved five. -->
  <section id="institutional-management" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Administration', 'ink')}
        ${h2(COPY.s3.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s3.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 mb-7 lg:mb-8">
${COPY.s3.items.map(([head, body, icon, span]) => {
  const big = span !== 'lg:col-span-2';
  return bezel(span,
    chip(span === 'lg:col-span-5' ? 'orange' : big ? 'teal' : 'ink', icon, big) + '\n' +
    `            <h3 class="${big ? 'text-[19px] sm:text-[21px] lg:text-[22px]' : 'text-[17px] sm:text-[18px] lg:text-[19px]'} font-bold tracking-tight mb-2.5">${head}</h3>\n` +
    `            <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[62ch]">${body}</p>`);
}).join('\n')}
      </div>

${assetSlot('[ORGANIZATION MANAGEMENT SCREENSHOT]',
  'The real members and permissions screen: the member list, the permission controls, and the plagiarism and AI balance allocation.')}

      <div class="rv mt-7 lg:mt-8">${linkQuiet(COPY.s3.cta, COPY.s3.ctaHref)}</div>
    </div>
  </section>`;

/* ═══════════════ 04 · SOURCES + INSTITUTIONAL STORAGE ═══════════════ */
const section4 = () => `  <!-- ================= 04 · SOURCE COVERAGE + INSTITUTIONAL STORAGE =================
       "External versus institution-controlled sources must remain understandable on
       narrow screens; do not merge them into one generic source card." So external and
       institutional stay visibly different, and the Storage clarification is a callout
       rather than fine print — the brief asks for it to be "visually noticeable and not
       buried in legal-size copy". -->
  <section id="institutional-sources" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', 'Sources')}
        ${h2(COPY.s4.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s4.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8">
${COPY.s4.items.map(([head, body, proof], i) => `        <div class="rounded-3xl sm:rounded-[28px] ${i === 2 ? 'bg-teal-50 ring-1 ring-teal-200' : 'bg-white ring-1 ring-black/5'} shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <span class="block text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] ${i === 2 ? 'text-teal-700' : 'text-ink-500'} mb-2.5">${i < 2 ? 'External source' : i === 2 ? 'Institution-controlled' : 'Scan control'}</span>
          <h3 class="text-[16px] sm:text-[17.5px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[56ch]">${body}</p>
${proof ? `          <p class="mt-4 pt-3 border-t border-ink-100 text-[12.5px] font-semibold tracking-tight text-teal-700">${proof}</p>` : ''}
        </div>`).join('\n')}
      </div>

      <div class="rv rounded-3xl bg-orange-50 ring-1 ring-orange-200 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B84431" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </span>
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-900 font-semibold max-w-[80ch]">${COPY.s4.clarification}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · THREE DEPLOYMENT PATHS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · THREE DEPLOYMENT PATHS =================
       Exactly three, and "Moodle and API are not presented as identical integration
       types" — so each keeps its own supporting label and only two of them carry a CTA,
       because only two have somewhere else to go. -->
  <section id="institutional-workflow" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Deployment', 'ink')}
        ${h2(COPY.s5.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s5.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${COPY.s5.paths.map(([head, body, label, ctaLabel, href], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-6 sm:p-7 lg:p-8 flex flex-col">
          <span class="inline-flex self-start items-center rounded-full bg-ink-50 ring-1 ring-black/5 px-3 py-1.5 text-[11.5px] font-semibold text-ink-600 mb-4 lg:mb-5">${label}</span>
          <h3 class="text-[17px] sm:text-[18.5px] font-bold tracking-tight mb-2.5">${head}</h3>
          <p class="flex-1 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 mb-5">${body}</p>
${ctaLabel ? `          <div>${linkQuiet(ctaLabel, href)}</div>` : ''}
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · MOODLE WORKFLOW ═══════════════ */
const section6 = () => `  <!-- ================= 06 · MOODLE WORKFLOW =================
       ASSET GATE again: no real Moodle captures, so no drawn LMS screens. All six
       approved controls are present and none may be dropped on mobile — "layout may
       change, copy may not be removed".

       The boundary the brief calls important: PlagiarismSearch has no native classes,
       assignments, gradebook or student dashboard. Those belong to the LMS, and nothing
       here suggests otherwise. -->
  <section id="moodle" class="relative py-16 sm:py-24 lg:py-32 bg-[#F2FCFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', 'Moodle')}
        ${h2(COPY.s6.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s6.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-7 lg:mb-8">
${COPY.s6.controls.map(([head, body], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
          <span class="inline-flex w-8 h-8 rounded-full bg-ink-900 text-white text-[12.5px] font-bold items-center justify-center tabular-nums mb-4">${i + 1}</span>
          <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>

${assetSlot('[MOODLE SETTINGS SCREENSHOT]',
  'The real plugin settings inside Moodle: automatic or manual checking, the source options, Add to Storage, and student report visibility.')}

      <div class="rv mt-7 lg:mt-8">${linkQuiet(COPY.s6.cta, COPY.s6.ctaHref)}</div>
    </div>
  </section>`;

/* ═══════════════ 07 · INSTITUTIONAL ROLES ═══════════════ */
const section7 = () => `  <!-- ================= 07 · INSTITUTIONAL ROLES =================
       Three roles, and no Students card: "Individual student intent belongs to
       /plagiarism-checker-for-students; the relevant institutional student workflow is
       already explained through Moodle." -->
  <section id="institutional-roles" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', 'Roles', 'ink')}
        ${h2(COPY.s7.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s7.intro}</p>
      </div>

      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
${COPY.s7.roles.map(([head, body, icon], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-ink-50 p-6 sm:p-7 lg:p-8">
${chip(['teal', 'orange', 'ink'][i], icon, false).replace('bg-teal-100', 'bg-white').replace('bg-orange-100', 'bg-white').replace('bg-ink-100', 'bg-white')}
          <h3 class="text-[17px] sm:text-[18.5px] font-bold tracking-tight mb-2.5">${head}</h3>
          <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · DATA HANDLING + STORAGE CONTROL ═══════════════ */
const section8 = () => `  <!-- ================= 08 · DATA HANDLING + STORAGE CONTROL =================
       Report retention and Organization Storage are different mechanisms and the section
       exists to keep them apart. No "No data storage", no automatic ingestion, no
       security certification. -->
  <section id="institutional-data" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC] overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', 'Data handling')}
        ${h2(COPY.s8.h2)}
        <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${COPY.s8.intro}</p>
      </div>

      <div class="rv-kids grid sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8">
${COPY.s8.steps.map(([head, body], i) => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
          <span class="inline-flex w-8 h-8 rounded-full bg-ink-900 text-white text-[12.5px] font-bold items-center justify-center tabular-nums mb-4">${i + 1}</span>
          <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`).join('\n')}
      </div>

      <div class="rv flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
        <p class="min-w-0 flex-1 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-900 font-semibold">${COPY.s8.clarification}</p>
        <span class="shrink-0">${linkQuiet(COPY.s8.cta, COPY.s8.ctaHref)}</span>
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · SECONDARY AI CAPABILITY ═══════════════ */
const section9 = () => `  <!-- ================= 09 · SECONDARY AI CAPABILITY =================
       "Keep this visually secondary. Do not turn it into a second AI Detector landing
       inside the University page." A compact banner, the same weight — and now the same
       shape — the AI Detector page gives its own API block.

       Reworked 2026-08-26: it was a heading and two paragraphs set at one size, one
       colour and one weight, which is why it read as a block of undifferentiated text.
       Now: eyebrow, a heading with room to breathe, a lead, the point of the section
       raised into a pill, the detail set quieter beneath it, then the CTA — and a small
       schematic that draws the sentence rather than repeating it.

       Not one word is rewritten. The approved sentences are split at their own full
       stops and given the weight each one's job deserves. -->
  <section id="institutional-ai" class="relative py-10 sm:py-12 lg:py-14 bg-white overflow-hidden">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv rounded-3xl sm:rounded-4xl bg-ink-950 overflow-hidden relative px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div class="orb absolute" style="width:520px;height:500px;right:-6%;top:-220px;background:rgba(154,106,222,.18)"></div>
        <div class="relative grid lg:grid-cols-[1.4fr_1fr] gap-7 lg:gap-12 items-center">

          <div class="min-w-0 text-white">
        ${eyebrowDark('teal-400', 'AI checking').replace('mb-4 sm:mb-5 lg:mb-6', 'mb-3.5')}
            <h2 class="text-[19px] sm:text-[21px] lg:text-[23px] font-bold tracking-tight leading-[1.25] mb-3">${COPY.s9.h2}</h2>
            <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/80 max-w-[56ch]">${COPY.s9.lead}</p>
            <p class="mt-3 text-[13px] sm:text-[13.5px] leading-relaxed text-white/55 max-w-[60ch]">${COPY.s9.support}</p>
            <p class="inline-flex items-start gap-2.5 rounded-2xl bg-orange-400/10 ring-1 ring-orange-400/30 px-4 py-3 mt-4 text-[12.5px] sm:text-[13px] leading-relaxed text-orange-100 max-w-[58ch]">
              <svg class="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F58971" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              ${COPY.s9.clarification}
            </p>
            <div class="mt-6">${btnLight(COPY.s9.cta, COPY.s9.ctaHref)}</div>
          </div>

          <div class="min-w-0 rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-5 sm:p-6" aria-hidden="true">
            <p class="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${COPY.s9.branch.parent[1]}</svg>
              ${COPY.s9.branch.parent[0]}
            </p>
            <div class="relative space-y-3 pl-6">
              <span class="absolute left-0 top-7 bottom-7 w-px bg-white/15"></span>
${COPY.s9.branch.children.map(([label, icon]) => {
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

/* ═══════════════ 10 · INSTITUTIONAL INQUIRY ═══════════════ */
const section10 = () => `  <!-- ================= 10 · INSTITUTIONAL PROCUREMENT / INQUIRY =================
       The approved institutional data model: no phone, no Facebook, no LinkedIn, no
       response-time promise, no price. The Moodle URL is conditional and reveals only
       when Moodle is chosen — the one behaviour implemented here, because it is a layout
       requirement rather than form logic. Validation and submission belong to the shared
       backend and are out of scope for this pass. -->
  <section id="institutional-inquiry" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Institutional inquiry', 'ink')}
          ${h2(COPY.s10.h2)}
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] leading-relaxed text-ink-600 max-w-[56ch]">${COPY.s10.intro}</p>
          <p class="mt-6 lg:mt-7 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-500">
            Prefer email? Contact us at <a href="${COPY.s10.altHref}" class="font-semibold text-ink-700 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">services@plagiarismsearch.com</a>.
          </p>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
          <form onsubmit="return false" novalidate>
            <div class="grid sm:grid-cols-2 gap-4 sm:gap-5">
${COPY.s10.fields.map(([label, spec, required, helper, kind, wide], i) => {
  const id = 'uq-' + i;
  const cls = wide ? 'sm:col-span-2' : 'min-w-0';
  const control = kind === 'textarea'
    ? `<textarea class="cf-field" id="${id}" rows="4" placeholder="${spec}"></textarea>`
    : kind === 'select' || kind === 'select-use'
      ? `<select class="cf-field" id="${id}"${kind === 'select-use' ? ' data-use' : ''}>\n` +
        `                  <option value="">Select an option</option>\n` +
        spec.map(o => `                  <option>${o}</option>`).join('\n') + '\n                </select>'
      : `<input class="cf-field" id="${id}" type="${kind === 'email' ? 'email' : 'text'}" placeholder="${spec}">`;
  const open = kind === 'moodle' ? `              <div id="moodleField" hidden class="${cls}">` : `              <div class="${cls}">`;
  return open + '\n' +
    `                <label class="cf-label" for="${id}">${label}${required ? ' <i>*</i>' : ''}</label>\n` +
    `                ${control}\n` +
    (helper ? `                <p class="mt-2 text-[12px] text-ink-500">${helper}</p>\n` : '') +
    '              </div>';
}).join('\n')}
            </div>

            <!-- the consent control the brief specifies, with both legal destinations -->
            <label class="flex items-start gap-3 mt-6 lg:mt-7 cursor-pointer">
              <input type="checkbox" id="uq-consent" class="mt-0.5 w-4 h-4 shrink-0 accent-teal-600">
              <span class="text-[13px] leading-relaxed text-ink-600">
                I agree to the <a href="${COPY.s10.terms}" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">Terms of Use</a>
                and <a href="${COPY.s10.policy}" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">Privacy Policy</a>.
              </span>
            </label>

            <div class="mt-6 lg:mt-7">
              <button type="submit" class="btn-press group flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold pl-5 sm:pl-6 pr-2 py-2">
                ${COPY.s10.cta}
                <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
              </button>
            </div>
          </form>

          <div class="mt-6 pt-6 border-t border-ink-100" hidden id="uq-success" role="status">
            <h3 class="text-[15.5px] font-bold tracking-tight mb-1.5">${COPY.s10.successHeading}</h3>
            <p class="text-[13px] leading-relaxed text-ink-600">${COPY.s10.successCopy}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 11 · INSTITUTIONAL FAQ ═══════════════ */
const section11 = () => `  <!-- ================= 11 · INSTITUTIONAL FAQ =================
       Eleven questions, full answers, all in the rendered HTML. Answer 5 keeps the
       non-automatic Storage rule and answer 10 keeps the human-review principle — the
       brief names both as things that must survive. -->
  <section id="institutional-faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Questions')}
          ${h2(COPY.s11.h2)}
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.s11.items.map(([q, a], i) => {
  let answer = a;
  if (i === 7) answer = a.replace(COPY.s11.apiLinkText,
    `<a href="${COPY.s11.apiLinkHref}" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${COPY.s11.apiLinkText}</a>`);
  if (i === 10) answer = a + ` <a href="${COPY.s11.inAnswerHref}" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${COPY.s11.inAnswerCta}</a>`;
  return `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${answer}</p></div></div>
            </div>`;
}).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 12 · FINAL INSTITUTIONAL CTA ═══════════════ */
const section12 = () => `  <!-- ================= 12 · FINAL INSTITUTIONAL CTA =================
       Primary returns to the inquiry form; secondary is real product evidence rather
       than a generic Contact Us. No consumer checker, plan CTA or trial claim. -->
  <section id="institutional-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('institutional-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.s12.h2, 'fits your')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[62ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.s12.support}</p>
      <div class="rv flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        <a href="${COPY.s12.primaryHref}" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          ${COPY.s12.primary}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <a href="${COPY.s12.secondaryHref}" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.s12.secondary}</a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles. The .cab-* rules are the report component's contract and are
   carried verbatim from the homepage.
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

  /* placeholder chrome — anything wearing this waits on a real asset */
  .ph { border:1.5px dashed rgba(16,24,40,.22); border-radius:1.5rem; background:rgba(16,24,40,.015); }

  .spotlight { transition:transform .35s cubic-bezier(.32,.72,0,1), box-shadow .35s ease; }
  .spotlight:hover { transform:translateY(-4px); }
  @media (prefers-reduced-motion: reduce) { .spotlight { transition:none; } .spotlight:hover { transform:none; } }

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

  /* The report: selecting a passage highlights it and its source. This is the approved
     component's own interaction — the brief requires reuse of the behaviour, not a
     university-specific one. */
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

  /* The Moodle URL field appears only when Moodle is the chosen deployment. The brief
     asks for a reveal "without layout jump that hides context", so the field occupies a
     full row of the grid and the ones after it keep their places. */
  const use = document.querySelector('[data-use]');
  const moodleField = document.getElementById('moodleField');
  if (use && moodleField) {
    use.addEventListener('change', () => { moodleField.hidden = use.value !== 'Moodle'; });
  }

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

const sections = [section1, section2, section3, section4, section5, section6,
                  section7, section8, section9, section10, section11, section12];

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
