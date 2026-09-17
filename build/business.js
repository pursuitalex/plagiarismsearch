/* Generate site/plagiarism-checker-for-organization.html — the Business & Teams
   solution page to the 2026-09-15 brief. It replaces a stub: no -v2, no switcher.

   The brief's hardest rule is a negative one: "Do not copy the University page sequence
   just because University and Business belong to the same Solution family. Share design
   language, not page story." University v2 is a decision journey for an institution —
   hub, relationship map, source map with brackets, a three-branch tree. This page is an
   operations page for a team, and the one idea it has to land before any other is that
   a member's PERSONAL balance and the ORGANIZATION's resources are two separate things.
   So that separation is drawn twice, on purpose: small in the hero, where every member
   carries two balances, and large in Organization Management, where it is the lead
   card of a bento and the four set-up facts sit beside it.

   The rest follows the same logic — each act takes the shape of its own claim:
   Storage is two parallel tracks (a normal check, and the separate action that adds
   content), workflows are an editorial list rather than persona cards, workspace-vs-API
   is one card split in two, data handling is three columns of one card, plans is the
   shared compact banner, and the page closes on the inquiry, never on a checker.

   No checker widget anywhere. No dashboard drawn. Copy is the brief's, verbatim.

   Run:  node build/business.js  →  node build/shell.js  →  node build/check-business.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'plagiarism-checker-for-organization.html';
const cta = require('./cta');
const banner = require('./banner');
const { dots } = require('./dots');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

/* /organization-management has no page in this prototype and is a live production URL */
const ORG = 'https://plagiarismsearch.com/organization-management';
const INQUIRY = '#business-inquiry';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — Business & Teams brief, 2026-09-15. Verbatim.

   Destinations (URLS.md): /organization-management → absolute (above),
   /plagiarism-api → api.html, /ai-content-detector → ai-detector.html,
   /prices → prices.html, /policy → policy.html. /plagiarism-database is on HOLD by the
   brief and is not linked.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Plagiarism Checker for Business &amp; Teams | PlagiarismSearch',
  meta: 'Manage plagiarism checking across your team with member permissions, organization balances, Organization Storage, interactive reports, and optional API access.',
  canonical: 'https://plagiarismsearch.com/plagiarism-checker-for-organization',

  hero: {
    eyebrow: 'Business &amp; Teams',
    h1: 'Plagiarism Checking for Business &amp; Teams',
    p1: 'Bring recurring plagiarism checks into a managed team workflow. Administrators can manage members, permissions, and organization resources, while team members can keep their personal balances separate.',
    p2: 'Use Organization Storage when your own content should be part of comparison, or connect the PlagiarismSearch API when checks need to run inside another workflow.',
    primary: 'Request a business quote', primaryHref: INQUIRY,
    secondary: 'See how team access works', secondaryHref: '#organization-management',
    line: 'For agencies, content teams, companies, publishers, and other organizations with recurring content-review needs.',
  },

  org: {
    eyebrow: 'Organization Management',
    h2: 'Manage members, permissions, and shared resources in one organization',
    intro: 'Organization Management gives administrators a practical way to coordinate team access while keeping organization resources separate from each member’s personal balance.',
    items: [
      ['Create your organization', 'An administrator creates the organization and manages its members from one organization workspace.',
       '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>'],
      ['Invite and manage members', 'Invite members by email and manage their organization access as your team changes. Members can be blocked or unblocked when needed.',
       '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>'],
      ['Set organization permissions', 'Control how members can use Organization Storage, search the organization’s storage during plagiarism checks, and view documents stored there.',
       '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'],
      ['Allocate checking resources', 'Administrators can allocate organization plagiarism and AI word balances to members according to the team’s needs.',
       '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'],
    ],
    separate: ['Personal and organization balances stay separate', 'A member can keep a private personal balance that the administrator and other organization members do not access, while also using organization resources allocated by the administrator.'],
    cta: 'Learn more about Organization Management', ctaHref: ORG,
  },

  report: {
    eyebrow: 'Report Evidence',
    h2: 'Review the source evidence behind each check',
    intro: 'PlagiarismSearch does not decide whether a passage is plagiarism. The report shows matched or similar text and the sources found for it, so your team can review the context before deciding what needs attention.',
    steps: [
      ['Matched text', 'See the passages where matching or similar text was found.'],
      ['Source evidence', 'Review the corresponding sources and compare them with the checked text.'],
      ['Interactive review', 'Select a match in the report to focus on the relevant source and inspect the result in context.'],
    ],
    closing: 'The report supports review and decision-making; it is not an automatic plagiarism verdict.',
  },

  storage: {
    eyebrow: 'Sources &amp; Organization Storage',
    h2: 'Use Organization Storage as a controlled comparison source',
    intro: 'PlagiarismSearch supports multiple source options in its scan settings, including web search, academic database search, personal storage search, and organization storage search.',
    /* the four source options the intro names, as the list it describes */
    options: ['Web search', 'Academic database search', 'Personal storage search', 'Organization storage search'],
    business: 'For a team, Organization Storage can become an additional comparison source when the relevant organization permissions and search option are enabled.',
    clarification: 'Running a plagiarism check does not automatically add the checked document to Organization Storage. Adding content to Storage is a separate action and remains distinct from the normal checking and report workflow.',
    support: 'This lets an organization decide when its own stored content should become part of future comparisons instead of treating every checked document as repository content.',
    /* the two tracks — labels drawn from the clarification above */
    trackCheck: ['Checked document', 'Plagiarism check', 'Report'],
    trackStore: ['Content you choose', 'Add to Storage', 'Organization Storage', 'Future comparisons'],
  },

  workflows: {
    eyebrow: 'Business Workflows',
    h2: 'Fit plagiarism checking into the way your team already reviews content',
    intro: 'The same organization controls can support different recurring review workflows without requiring a separate plagiarism product for each type of business.',
    items: [
      ['Agencies and content teams', 'Give writers, editors, and reviewers access to organization resources while the administrator manages permissions and balances. Review source matches before work is delivered or published.',
       ['Organization resources', 'Permissions and balances', 'Source matches']],
      ['In-house teams', 'Coordinate recurring plagiarism checks across a team while each member can keep personal resources separate from the organization balances assigned to them.',
       ['Recurring checks', 'Personal resources separate', 'Organization balances']],
      ['Publishers and recurring document review', 'Use Organization Storage when your own repository should be part of comparison, and use the API for workflows that need plagiarism checks to run from another system.',
       ['Organization Storage', 'API']],
    ],
  },

  choose: {
    eyebrow: 'Choose Your Workflow',
    h2: 'Work in PlagiarismSearch or connect checking to your own system',
    intro: 'Teams can work directly in PlagiarismSearch or use the API when plagiarism checking needs to become part of another application or automated workflow.',
    a: ['Organization workspace', 'Choose the organization workspace when team members should run checks and review reports directly in PlagiarismSearch. The administrator manages members, permissions, and organization resources while each member works through their own account access.', 'Learn about Organization Management', ORG],
    b: ['API integration', 'Use the PlagiarismSearch API when checks need to be triggered from another application or workflow. API access may be included in some packages or purchased separately.', 'Explore the Plagiarism API', 'api.html'],
    apiAi: 'AI checking can also be used through the PlagiarismSearch API when the account has available AI-word balance.',
  },

  ai: {
    heading: 'Plagiarism and AI checks remain separate',
    copy: 'Administrators can allocate both plagiarism and AI word balances through the organization. AI detection remains a separate analysis from plagiarism checking and uses its own AI-word balance.',
    cta: 'Explore AI Content Detector', ctaHref: 'ai-detector.html',
  },

  data: {
    eyebrow: 'Data Handling',
    h2: 'Keep checked documents, reports, and Organization Storage distinct',
    intro: 'A checked document, a generated report, and content intentionally added to Organization Storage are different parts of the workflow.',
    items: [
      ['Checked document', 'Uploaded source documents are not retained as stored documents after the check.',
       '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>'],
      ['Generated report', 'Generated reports can remain available in the account for convenience. Users can permanently delete their reports.',
       '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>'],
      ['Organization Storage', 'Organization Storage is a separate repository workflow. Content is added to it separately and access is governed by organization permissions.',
       '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>'],
    ],
    closing: 'A normal plagiarism check should not be confused with intentionally adding content to Organization Storage.',
    cta: 'Read the Privacy Policy', ctaHref: 'policy.html',
  },

  plans: {
    eyebrow: 'Plans &amp; Custom Requirements',
    h2: 'Choose a standard plan or discuss a custom setup',
    p1: 'Standard PlagiarismSearch plans are available on the Pricing page. If your organization needs larger volumes, API access, or a custom commercial arrangement, tell us what your workflow requires.',
    p2: 'Custom contracts and pricing are available for larger customers.',
    primary: 'Request a business quote',
    secondary: 'View standard pricing', secondaryHref: 'prices.html',
  },

  inquiry: {
    eyebrow: 'Business Inquiry',
    h2: 'Tell us how your team plans to use PlagiarismSearch',
    support: 'Share your team size, expected usage, and the workflow you want to support. These details help us understand whether you need an organization workspace, Organization Storage, API access, AI checking, standard pricing, or a custom commercial setup.',
    /* label, placeholder, required, helper, kind, wide */
    fields: [
      ['Name', '', true, null, 'text', false],
      ['Work email', '', true, null, 'email', false],
      ['Organization or company', '', true, null, 'text', true],
      ['Role or job title', '', false, null, 'text', false],
      ['Approximate team size', '', false, null, 'text', false],
      ['Approximate monthly checking volume', '', false, 'Words, documents, or another estimate is fine.', 'text', true],
    ],
    needsLabel: 'What do you need?',
    needs: ['Organization workspace', 'Organization Storage', 'API access', 'AI checking', 'Custom volume or pricing', 'Not sure yet'],
    phone: 'Phone number',
    message: 'Tell us about your workflow or requirements',
    /* the site's approved consent sentence (University v2 brief); the Business brief asks
       for "approved production consent wording" and forbids inventing any — see gate G2 */
    terms: 'terms-of-use.html', policy: 'policy.html',
    cta: 'Request a business quote',
    success: 'Thanks — your business inquiry has been submitted.',
  },

  faq: {
    h2: 'Business &amp; Teams FAQ',
    items: [
      ['Can multiple people use PlagiarismSearch through one organization?', 'Yes. An administrator can create an organization, invite members, and manage their access to organization resources. Members can also be blocked or unblocked when needed.'],
      ['Can an administrator control what organization members can access?', 'Yes. Organization Management includes permissions related to Organization Storage and its use, including searching organization storage during plagiarism checks and viewing documents stored there.'],
      ['How do organization and personal balances work together?', 'Organization plagiarism and AI balances are managed separately from each member’s personal balance. A member can keep a private personal balance that the administrator and other members do not access, while also receiving organization resources allocated by the administrator.'],
      ['Are checked documents automatically added to Organization Storage?', 'No. Running a plagiarism check does not automatically add the checked document to Organization Storage. Storage is a separate action and depends on the organization workflow and the member’s permissions.'],
      ['Can Organization Storage be used as a plagiarism-checking source?', 'Yes. Organization Storage can be used as an additional comparison source when organization storage search is enabled and the member has the relevant permission.'],
      ['Can we integrate plagiarism checking into our own platform?', 'Yes. PlagiarismSearch provides an API for programmatic plagiarism-checking workflows. API access may be included in some packages or purchased separately. See the Plagiarism API page for the current integration workflow and developer documentation.'],
      ['Can an organization use AI detection too?', 'Yes. Administrators can allocate organization AI-word balance to members. AI detection is a separate analysis from plagiarism checking and requires available AI-word balance.'],
      ['What happens to uploaded documents and reports?', 'Uploaded source documents are not retained as stored documents after the check. Generated reports can remain available in the account for convenience and can be permanently deleted by the user. Organization Storage is a separate repository workflow.'],
      ['Do you offer custom pricing for larger organizations?', 'Yes. Standard plans are available on the Pricing page, while larger customers can use custom contracts and pricing. Send a business inquiry if your organization has larger-volume, API, or other custom commercial requirements.'],
    ],
    /* "Use real crawlable links to /plagiarism-api and /prices where the answer
       references them" — the phrase in the answer becomes the link */
    links: { 5: ['Plagiarism API page', 'api.html'], 8: ['Pricing page', 'prices.html'] },
  },

  close: {
    h2: 'Set up plagiarism checking for your team',
    support: 'Tell us how your organization works today and whether you need a managed team workspace, Organization Storage, API access, or higher-volume usage.',
    primary: 'Request a business quote',
    secondary: 'View standard pricing', secondaryHref: 'prices.html',
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
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
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
const inline = (label, href) => `<a href="${href}"${ext(href)} class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.replace(/&amp;/g, '&').length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const TINT = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'], mint: ['bg-mint-100', '#1B7A50'] };
const chip = (tint, paths) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINT[tint][0]} items-center justify-center shrink-0">${ico(paths, TINT[tint][1])}</span>`;
const I = {
  admin:   '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  lock:    '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  wallet:  '<path d="M17 14h.01"/><path d="M7 7h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10"/>',
  building:'<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/>',
  info:    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert:   '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
  code:    '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  sparkles:'<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  sliders: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
};

/* the two balances every member carries — the page's one recurring device */
const twoBalances = (compact) => `<span class="flex flex-col gap-1.5">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-teal-50 ring-1 ring-teal-600/15 px-2.5 py-1 text-[${compact ? '10.5' : '11.5'}px] font-semibold text-teal-800"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Organization resources</span>
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-[${compact ? '10.5' : '11.5'}px] font-semibold text-ink-700">${ico(I.lock, '#4B5563', 11)}Personal balance</span>
                  </span>`;

/* ═══════════════ 01 · HERO — THE MANAGED TEAM WORKFLOW ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / BUSINESS & TEAMS =================
       No checker, no free-check line: the homepage owns that. The first product idea on
       this page is the managed organization, so the visual is that and nothing else —
       an administrator, the organization's resources, and members who each carry TWO
       balances. A diagram, not a dashboard: every label is the supporting copy's. -->
  <section id="business-and-teams" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">

        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.hero.eyebrow)}
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Business &amp; Teams')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[60ch]">${COPY.hero.p1}</p>
          <p class="mt-3 text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[60ch] mb-7 lg:mb-8">${COPY.hero.p2}</p>

          <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 lg:mb-7">
            ${btnDark(COPY.hero.primary, COPY.hero.primaryHref)}
            <a href="${COPY.hero.secondaryHref}" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.hero.secondary}</a>
          </div>
          <p class="text-[13px] sm:text-[13.5px] text-ink-500 max-w-[58ch]">${COPY.hero.line}</p>
        </div>

        <!-- the managed organization, drawn -->
        <div class="rv min-w-0">
          <div class="rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
            <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-7">

              <div class="flex items-center gap-3.5 rounded-2xl bg-ink-950 text-white px-4 py-3.5">
                <span class="shrink-0 w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">${ico(I.admin, '#fff', 18)}</span>
                <div class="min-w-0">
                  <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">Administrator</p>
                  <p class="text-[12px] sm:text-[12.5px] text-white/60">Members, permissions, organization resources</p>
                </div>
              </div>

              <span class="block mx-auto w-px h-4 bg-ink-200" aria-hidden="true"></span>

              <div class="rounded-2xl bg-teal-50 ring-1 ring-teal-200 px-4 py-3.5">
                <p class="${CAP} text-teal-700 mb-2.5">Organization resources</p>
                <div class="flex flex-wrap gap-1.5">
                  <span class="rounded-full bg-white ring-1 ring-teal-200 px-3 py-1 text-[12px] font-semibold text-ink-800">Plagiarism words</span>
                  <span class="rounded-full bg-white ring-1 ring-teal-200 px-3 py-1 text-[12px] font-semibold text-ink-800">AI words</span>
                  <span class="rounded-full bg-white ring-1 ring-teal-200 px-3 py-1 text-[12px] font-semibold text-ink-800">Organization Storage</span>
                </div>
              </div>

              <!-- one stem, a bar, two rounded drops: the allocation reaches each member -->
              <div class="relative h-8" aria-hidden="true">
                <span class="absolute left-1/2 top-0 h-4 w-px bg-ink-200"></span>
                <span class="absolute left-1/4 right-1/2 top-4 h-4 border-t border-l border-ink-200 rounded-tl-2xl"></span>
                <span class="absolute left-1/2 right-1/4 top-4 h-4 border-t border-r border-ink-200 rounded-tr-2xl"></span>
              </div>

              <div class="grid grid-cols-2 gap-3">
${[0, 1].map(() => `                <div class="rounded-2xl bg-ink-50 ring-1 ring-black/[.04] px-3.5 py-3.5">
                  <div class="flex items-center gap-2.5 mb-3">
                    <span class="w-8 h-8 rounded-full bg-white ring-1 ring-black/5 flex items-center justify-center">${ico(I.admin, '#374151', 15)}</span>
                    <p class="text-[13.5px] font-bold tracking-tight">Team member</p>
                  </div>
                  ${twoBalances(true)}
                </div>`).join('\n')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · ORGANIZATION MANAGEMENT — THE SIGNATURE ═══════════════ */
const section2 = () => `  <!-- ================= 02 · ORGANIZATION MANAGEMENT =================
       A bento with one lead: the separation of personal and organization balances is
       the card that carries the section, drawn as two ledgers with a wall between them;
       the four set-up facts sit beside it at card-title weight. No SSO, departments,
       role tiers, seats, audit logs — nothing the brief does not confirm. -->
  <section id="organization-management" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.org.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.org.h2}</h2>
        <p class="${INTRO}">${COPY.org.intro}</p>
      </div>

      <div class="grid lg:grid-cols-[1.05fr_1fr] gap-4 sm:gap-5 lg:gap-6 items-stretch">

        <!-- the lead: two ledgers, one wall -->
        <div class="rv rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-7 lg:p-8 flex flex-col">
            <div class="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-stretch mb-6 lg:mb-7">
              <div class="rounded-2xl bg-teal-50 ring-1 ring-teal-200 p-4 sm:p-5">
                <div class="flex items-center gap-2.5 mb-3.5">
                  <span class="w-9 h-9 rounded-xl bg-white ring-1 ring-teal-200 flex items-center justify-center">${ico(I.wallet, '#06748A', 16)}</span>
                  <p class="${CAP} text-teal-700">Organization</p>
                </div>
                <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight mb-2.5">Organization balances</p>
                <ul class="space-y-1.5 text-[12.5px] sm:text-[13px] font-semibold text-ink-800">
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>Plagiarism words</li>
                  <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>AI words</li>
                </ul>
                <p class="text-[12px] sm:text-[12.5px] text-ink-600 mt-3">Allocated by the administrator</p>
              </div>

              <div class="flex flex-col items-center justify-center gap-2" aria-hidden="true">
                <span class="flex-1 w-px border-l border-dashed border-ink-300"></span>
                <span class="${CAP} text-ink-500 [writing-mode:vertical-rl] rotate-180">separate</span>
                <span class="flex-1 w-px border-l border-dashed border-ink-300"></span>
              </div>

              <div class="rounded-2xl bg-ink-50 ring-1 ring-black/[.05] p-4 sm:p-5">
                <div class="flex items-center gap-2.5 mb-3.5">
                  <span class="w-9 h-9 rounded-xl bg-white ring-1 ring-black/5 flex items-center justify-center">${ico(I.lock, '#374151', 16)}</span>
                  <p class="${CAP} text-ink-500">Member</p>
                </div>
                <p class="text-[14.5px] sm:text-[15px] font-bold tracking-tight mb-2.5">Personal balance</p>
                <p class="text-[12.5px] sm:text-[13px] font-semibold text-ink-800">Private</p>
                <p class="text-[12px] sm:text-[12.5px] text-ink-600 mt-3">The administrator and other members do not access it</p>
              </div>
            </div>

            <h3 class="text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-2.5">${COPY.org.separate[0]}</h3>
            <p class="${BODY} text-ink-600 max-w-[60ch]">${COPY.org.separate[1]}</p>
            <div class="mt-auto pt-6">${linkQuiet(COPY.org.cta, COPY.org.ctaHref)}</div>
          </div>
        </div>

        <!-- the four set-up facts -->
        <div class="rv-kids grid sm:grid-cols-2 gap-4 sm:gap-5">
${COPY.org.items.map(([head, body, icon], i) => `          <div class="rounded-3xl sm:rounded-[28px] bg-ink-50 p-5 sm:p-6 flex flex-col">
            <div class="flex items-center justify-between gap-3 mb-4">
              <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white ring-1 ring-black/5 items-center justify-center shrink-0">${ico(icon, ['#06748A', '#374151', '#B84431', '#374151'][i])}</span>
              <span class="text-[11px] font-bold tracking-[0.2em] text-ink-400 nums">0${i + 1}</span>
            </div>
            <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1.5">${head}</h3>
            <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${body}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · REPORT EVIDENCE ═══════════════ */
const section3 = () => `  <!-- ================= 03 · REPORT EVIDENCE =================
       Supporting evidence, kept proportionate: the approved report, the three points as
       one strip, the closing line. No fields, thresholds or verdicts invented. -->
  <section id="report-evidence" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
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
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white font-semibold max-w-[76ch]">${COPY.report.closing}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · SOURCES + ORGANIZATION STORAGE ═══════════════ */
const section4 = () => `  <!-- ================= 04 · SOURCES & ORGANIZATION STORAGE =================
       Two things the section has to say, two halves: on the left, the four source
       options as the list the intro names, the organization one marked as the
       conditional it is; on the right, the claim that matters — a normal check and
       adding content to Storage are TWO TRACKS that never join. Solid for the check,
       dashed for the separate action, and nothing drawn between them. -->
  <section id="organization-storage" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.storage.eyebrow)}
        <h2 class="${H2}">${COPY.storage.h2}</h2>
        <p class="${INTRO}">${COPY.storage.intro}</p>
      </div>

      <div class="grid lg:grid-cols-[.85fr_1.15fr] gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div class="rv rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <div class="flex items-center gap-3 mb-3">
            ${chip('teal', I.sliders)}
            <span class="${CAP} text-ink-500">Source options in scan settings</span>
          </div>
          <ul class="divide-y divide-ink-100">
${COPY.storage.options.map((o, i) => `            <li class="flex items-center gap-3 py-3">
              <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              <span class="text-[14.5px] sm:text-[15px] font-bold tracking-tight">${o}</span>${i === 3 ? '\n              <span class="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700 bg-teal-50 ring-1 ring-teal-600/15 rounded-full px-2.5 py-1">when enabled</span>' : ''}
            </li>`).join('\n')}
          </ul>
          <p class="mt-auto pt-4 ${BODY} text-ink-600">${COPY.storage.business}</p>
        </div>

        <div class="rv rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="h-full rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl p-5 sm:p-6 lg:p-8 flex flex-col gap-5">

            <div>
              <p class="${CAP} text-ink-500 mb-3">A normal check</p>
              <ol class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0">
${COPY.storage.trackCheck.map((t, i) => `                <li class="flex items-center sm:flex-1">
                  <span class="flex-1 rounded-xl ${i === 1 ? 'bg-ink-950 text-white' : 'bg-ink-50 ring-1 ring-black/[.04] text-ink-900'} px-3.5 py-2.5 text-[13px] sm:text-[13.5px] font-semibold text-center">${t}</span>${i < 2 ? '\n                  <span class="hidden sm:flex items-center w-8 shrink-0" aria-hidden="true"><span class="flex-1 h-px bg-ink-300"></span><svg class="-ml-1 shrink-0" width="8" height="10" viewBox="0 0 10 12" fill="#9CA3AF"><path d="M0 0 10 6 0 12z"/></svg></span>' : ''}
                </li>`).join('\n')}
              </ol>
            </div>

            <div class="flex items-center gap-3" aria-hidden="true">
              <span class="flex-1 border-t border-dashed border-ink-300"></span>
              <span class="${CAP} text-orange-700 bg-orange-50 ring-1 ring-orange-200 rounded-full px-3 py-1">not automatic</span>
              <span class="flex-1 border-t border-dashed border-ink-300"></span>
            </div>

            <div>
              <p class="${CAP} text-teal-700 mb-3">A separate action</p>
              <ol class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 rounded-2xl ring-dashed ring-teal-300 p-2.5 sm:p-3 bg-teal-50/50">
${COPY.storage.trackStore.map((t, i) => `                <li class="flex items-center sm:flex-1">
                  <span class="flex-1 rounded-xl ${i === 2 ? 'bg-teal-600 text-white' : 'bg-white ring-1 ring-black/5 text-ink-900'} px-3 py-2.5 text-[12.5px] sm:text-[13px] font-semibold text-center leading-snug">${t}</span>${i < 3 ? '\n                  <span class="hidden sm:flex items-center w-6 shrink-0" aria-hidden="true"><span class="flex-1 border-t border-dashed border-teal-400"></span><svg class="-ml-1 shrink-0" width="8" height="10" viewBox="0 0 10 12" fill="#2CC3DB"><path d="M0 0 10 6 0 12z"/></svg></span>' : ''}
                </li>`).join('\n')}
              </ol>
            </div>

            <p class="${BODY} text-ink-600 mt-auto">${COPY.storage.support}</p>
          </div>
        </div>
      </div>

      <div class="rv mt-5 sm:mt-6 rounded-3xl bg-orange-50 ring-1 ring-orange-200 p-5 sm:p-6 lg:p-7 flex items-start gap-4 sm:gap-5">
        <span class="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-100 flex items-center justify-center">${ico(I.alert, '#B84431')}</span>
        <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-900 font-semibold max-w-[84ch]">${COPY.storage.clarification}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · BUSINESS WORKFLOWS ═══════════════ */
const section5 = () => `  <!-- ================= 05 · REAL BUSINESS WORKFLOWS =================
       Three operational scenarios as an editorial list on one surface — number, name,
       what it uses, how it runs — not three persona cards. The "uses" chips are phrases
       lifted from each scenario's own sentence. No verticals added, no audience links. -->
  <section id="business-workflows" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.workflows.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.workflows.h2}</h2>
        <p class="${INTRO}">${COPY.workflows.intro}</p>
      </div>

      <div class="rv rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100">
${COPY.workflows.items.map(([head, body, uses], i) => `          <div class="grid lg:grid-cols-[5rem_1fr_1.35fr] gap-3 lg:gap-8 items-start px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
            <span class="text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold tracking-tightest leading-none text-ink-200 nums">0${i + 1}</span>
            <div class="min-w-0">
              <h3 class="text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-3">${head}</h3>
              <div class="flex flex-wrap gap-1.5">
${uses.map(u => `                <span class="rounded-full bg-ink-50 ring-1 ring-black/5 px-3 py-1 text-[12px] font-semibold text-ink-700">${u}</span>`).join('\n')}
              </div>
            </div>
            <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${body}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · WORKSPACE VS API — AND AI, COMPACT ═══════════════ */
const section6 = () => `  <!-- ================= 06 · ORGANIZATION WORKSPACE VS API =================
       One card, split in two: the two real ways to deploy, with an "or" on the seam. The
       lighter pattern, as the brief asks — no tree, no developer hero, no code. The AI
       note sits under it as the compact secondary treatment the brief allows. -->
  <section id="choose-your-workflow" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.choose.eyebrow)}
        <h2 class="${H2}">${COPY.choose.h2}</h2>
        <p class="${INTRO}">${COPY.choose.intro}</p>
      </div>

      <div class="rv relative rounded-3xl sm:rounded-4xl lg:rounded-5xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="relative grid md:grid-cols-2 rounded-[18px] sm:rounded-3xl lg:rounded-[calc(2.5rem-0.5rem)] overflow-hidden">
          <div class="bg-white p-6 sm:p-8 lg:p-10 flex flex-col">
            <div class="flex items-center gap-3 mb-5">
              ${chip('teal', I.building)}
              <span class="${CAP} text-ink-500">Path A</span>
            </div>
            <h3 class="text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-2.5">${COPY.choose.a[0]}</h3>
            <p class="flex-1 ${BODY} text-ink-600 mb-6">${COPY.choose.a[1]}</p>
            <div>${linkQuiet(COPY.choose.a[2], COPY.choose.a[3])}</div>
          </div>
          <div class="bg-ink-950 text-white p-6 sm:p-8 lg:p-10 flex flex-col">
            <div class="flex items-center gap-3 mb-5">
              <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.code, '#fff')}</span>
              <span class="${CAP} text-white/50">Path B</span>
            </div>
            <h3 class="text-[19px] sm:text-[21px] lg:text-[22px] font-bold tracking-tight mb-2.5">${COPY.choose.b[0]}</h3>
            <p class="${BODY} text-white/70 mb-3">${COPY.choose.b[1]}</p>
            <p class="flex-1 text-[13px] sm:text-[13.5px] leading-relaxed text-white/50 mb-6">${COPY.choose.apiAi}</p>
            <div>${linkQuiet(COPY.choose.b[2], COPY.choose.b[3], true)}</div>
          </div>
          <span class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white ring-1 ring-black/10 shadow-diffuse items-center justify-center text-[12px] font-bold uppercase tracking-[0.12em] text-ink-700" aria-hidden="true">or</span>
        </div>
      </div>

      <!-- AI: secondary, compact, separate -->
      <div id="plagiarism-and-ai" class="rv mt-5 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7">
        ${chip('orange', I.sparkles)}
        <div class="min-w-0 flex-1">
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1">${COPY.ai.heading}</h3>
          <p class="${BODY} text-ink-600 max-w-[86ch]">${COPY.ai.copy}</p>
        </div>
        <span class="shrink-0">${linkQuiet(COPY.ai.cta, COPY.ai.ctaHref)}</span>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · DATA HANDLING ═══════════════ */
const section7 = () => `  <!-- ================= 07 · DATA HANDLING =================
       Three different things, so three columns of one card with rules between them —
       distinct, side by side, not blended. The closing line and the privacy link are the
       card's foot. No absolutes, no timings. -->
  <section id="data-handling" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.data.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.data.h2}</h2>
        <p class="${INTRO}">${COPY.data.intro}</p>
      </div>

      <div class="rv rounded-3xl sm:rounded-4xl bg-ink-50 overflow-hidden">
        <div class="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-200/70">
${COPY.data.items.map(([head, body, icon], i) => `          <div class="p-6 sm:p-7 lg:p-8">
            <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white ring-1 ring-black/5 items-center justify-center">${ico(icon, ['#374151', '#B84431', '#06748A'][i])}</span>
            <h3 class="text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight mt-5 mb-1.5">${head}</h3>
            <p class="${BODY} text-ink-600">${body}</p>
          </div>`).join('\n')}
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-t border-ink-200/70 bg-white/60 px-6 py-5 sm:px-7 lg:px-8">
          <p class="min-w-0 flex-1 ${BODY} text-ink-900 font-semibold">${COPY.data.closing}</p>
          <span class="shrink-0">${btnLight(COPY.data.cta, COPY.data.ctaHref)}</span>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · PLANS & CUSTOM ═══════════════ */
const section8 = () => `  <!-- ================= 08 · PLANS & CUSTOM REQUIREMENTS =================
       The shared compact banner (build/banner.js): between sections, two ways on. No
       pricing widget, no discounts, seats, managers or SLAs. -->
${banner({
    id: 'plans-and-custom',
    orb: 'rgba(243,111,90,.18)',
    eyebrow: ['orange-500', COPY.plans.eyebrow],
    h2: COPY.plans.h2,
    lead: COPY.plans.p1, leadMax: '66ch',
    after: `            <p class="mt-3 ${banner.SUPPORT} max-w-[60ch]">${COPY.plans.p2}</p>`,
    action: `<div class="flex flex-col items-start lg:items-end gap-3.5">${banner.btn(COPY.plans.primary, INQUIRY)}${linkQuiet(COPY.plans.secondary, COPY.plans.secondaryHref, true)}</div>`,
  })}`;

/* ═══════════════ 09 · QUALIFIED BUSINESS INQUIRY ═══════════════ */
const section9 = () => `  <!-- ================= 09 · BUSINESS INQUIRY =================
       The approved field variant: no Facebook, no LinkedIn, no callback promise, phone
       optional, "What do you need?" as a clear multi-select. Inert — validation, routing
       and consent handling are the backend's. -->
  <section id="business-inquiry" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', COPY.inquiry.eyebrow, 'ink')}
          <h2 class="${H2}">${COPY.inquiry.h2}</h2>
          <p class="${INTRO} max-w-[56ch]">${COPY.inquiry.support}</p>
        </div>

        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
          <form onsubmit="return false" novalidate>
            <div class="grid sm:grid-cols-2 gap-4 sm:gap-5">
${COPY.inquiry.fields.map(([label, ph, required, helper, kind, wide], i) => {
  const id = 'bq-' + i;
  return `              <div class="${wide ? 'sm:col-span-2' : 'min-w-0'}">
                <label class="cf-label" for="${id}">${label}${required ? ' <i>*</i>' : ''}</label>
                <input class="cf-field" id="${id}" type="${kind === 'email' ? 'email' : 'text'}"${required ? ' required' : ''}>${helper ? `
                <p class="mt-2 text-[12px] text-ink-500">${helper}</p>` : ''}
              </div>`;
}).join('\n')}

              <fieldset class="sm:col-span-2 m-0 p-0 border-0 min-w-0">
                <legend class="cf-label">${COPY.inquiry.needsLabel}</legend>
                <div class="flex flex-wrap gap-2">
${COPY.inquiry.needs.map((n, i) => `                  <label class="need-opt cursor-pointer">
                    <input type="checkbox" name="needs" value="${n}" class="sr-only">
                    <span class="need-chip inline-flex items-center gap-2 rounded-full ring-1 ring-ink-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-ink-700">
                      <svg class="need-tick" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>${n}
                    </span>
                  </label>`).join('\n')}
                </div>
              </fieldset>

              <div class="min-w-0">
                <label class="cf-label" for="bq-phone">${COPY.inquiry.phone}</label>
                <input class="cf-field" id="bq-phone" type="tel">
              </div>
              <div class="sm:col-span-2">
                <label class="cf-label" for="bq-message">${COPY.inquiry.message} <i>*</i></label>
                <textarea class="cf-field" id="bq-message" rows="4" required></textarea>
              </div>
            </div>

            <label class="flex items-start gap-3 mt-6 lg:mt-7 cursor-pointer">
              <input type="checkbox" id="bq-consent" class="mt-0.5 w-4 h-4 shrink-0 accent-teal-600">
              <span class="text-[13px] leading-relaxed text-ink-600">I agree to the ${inline('Terms of Use', COPY.inquiry.terms)} and ${inline('Privacy Policy', COPY.inquiry.policy)}. <i class="not-italic text-orange-700">*</i></span>
            </label>

            <div class="mt-6 lg:mt-7">
              <button type="submit" class="btn-press group flex items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold pl-5 sm:pl-6 pr-2 py-2">
                ${COPY.inquiry.cta}
                <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
              </button>
            </div>
          </form>

          <div class="mt-6 pt-6 border-t border-ink-100" hidden id="bq-success" role="status">
            <p class="text-[15.5px] font-bold tracking-tight">${COPY.inquiry.success}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 10 · BUSINESS FAQ ═══════════════ */
const section10 = () => `  <!-- ================= 10 · BUSINESS FAQ =================
       Nine questions, full answers in the HTML, the two crawlable links the brief asks
       for set on the phrases that reference them. -->
  <section id="business-faq" class="relative py-16 sm:py-24 lg:py-32 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
${eyebrow('orange-500', 'Questions')}
          <h2 class="${H2}">${COPY.faq.h2}</h2>
        </div>
        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.faq.items.map(([q, a], i) => {
  const l = COPY.faq.links[i];
  const answer = l ? a.replace(l[0], inline(l[0], l[1])) : a;
  if (l && answer === a) throw new Error('FAQ link phrase not found: ' + l[0]);
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

/* ═══════════════ 11 · FINAL CTA ═══════════════ */
const section11 = () => `  <!-- ================= 11 · FINAL CTA =================
       The closing band (build/cta.js). A business action and the standard-pricing
       alternative — never a checker. -->
  <section id="business-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('business-cta')}

    <div class="relative max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.close.h2, 'your team')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[62ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.close.support}</p>
      <div class="rv flex flex-wrap items-center justify-center gap-4 sm:gap-5">
        <a href="${INQUIRY}" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          ${COPY.close.primary}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
        <a href="${COPY.close.secondaryHref}" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.close.secondary}</a>
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

  /* dashed rings: Tailwind's ring is a shadow and cannot dash, so these are borders */
  .ring-dashed { box-shadow:none !important; border:1px dashed currentColor; }
  .ring-dashed.ring-teal-300 { border-color:#6ED7E8; }

  /* the multi-select: a chip that fills when its checkbox is checked, and says so with a
     tick, not only with colour; focus lands on the hidden input, so the ring is drawn on
     the chip */
  .need-chip { transition:background-color .15s ease, color .15s ease, box-shadow .15s ease; }
  .need-chip .need-tick { display:none; }
  .need-opt input:checked + .need-chip { background:#111827; color:#fff; box-shadow:inset 0 0 0 1px #111827; }
  .need-opt input:checked + .need-chip .need-tick { display:block; }
  .need-opt input:focus-visible + .need-chip { outline:2px solid #0CA9C3; outline-offset:3px; }
  .need-opt:hover .need-chip { background:#F3F4F6; }
  .need-opt:hover input:checked + .need-chip { background:#1F2937; }

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
  .cf-label { display:block; font-size:12px; font-weight:700; letter-spacing:.01em; color:#4B5563; margin-bottom:7px; padding:0; }
  .cf-label i { font-style:normal; color:#B84431; }
  .cf-field { width:100%; height:48px; padding:0 14px; border-radius:10px; border:1px solid #E5E7EB;
    background:#fff; color:#111827; font-size:14.5px; font-weight:500; font-family:inherit;
    transition:border-color .15s ease, box-shadow .15s ease; }
  .cf-field::placeholder { color:#9CA3AF; font-weight:400; }
  .cf-field:focus { outline:none; border-color:#0CA9C3; box-shadow:0 0 0 1px #0CA9C3; }
  textarea.cf-field { height:auto; padding:12px 14px; line-height:1.6; resize:none; }

  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
${cta.style('business-cta')}
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

  /* every quote CTA lands on the form and puts the caret in its first field */
  document.querySelectorAll('a[href="${INQUIRY}"]').forEach(a => {
    a.addEventListener('click', () => {
      const first = document.getElementById('bq-0');
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 500);
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
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
