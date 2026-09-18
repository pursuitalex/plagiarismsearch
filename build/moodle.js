/* Generate site/integration-guide.html — the Moodle Integration page to the 2026-09-15
   brief. It replaces a stub, so no -v2 and no version switcher.

   This is the site's first documentation page, and the brief is plain that it must not
   be a landing in disguise: no checker, no pricing, no reviews, no feature bento, no
   repeated sales CTAs. The top fifth does an evaluator's job — what this is, what it
   supports, where to get it — and everything under it is a manual an administrator can
   follow with Moodle open in the other window.

   So the page has two grounds. The header and "at a glance" are the system's tinted hero
   and a facts sheet. Below them the page becomes a two-column document: a sticky "On this
   page" rail on the left (a jump menu on a phone) and one reading column on the right,
   where every settings table is a definition list that stacks instead of shrinking, every
   limitation is a callout rather than a footnote, and every screenshot is a narrow crop of
   the real plugin with its caption and the same facts in text beside it.

   The screenshots (site/assets/img/moodle/) are crops of the three reference captures in
   the brief. The API user and API key values were painted over before cropping — the raw
   captures never enter the repository's public folder. Nothing in them is redrawn.

   The compatibility range lives in one constant so the day the plugin supports a newer
   Moodle it is one edit.

   Run:  node build/moodle.js  →  node build/shell.js  →  node build/check-moodle.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'integration-guide.html';
const banner = require('./banner');
const { dots } = require('./dots');

/* ─────────────────────────────────────────────────────────────────────────────
   The facts that change with a plugin release — one place.
   ───────────────────────────────────────────────────────────────────────────── */
const MOODLE_RANGE = '2.7–5.2';
const ACTIVITY = 'Moodle Assignment (mod_assign)';

/* Destinations. The two external ones are the official listing and the official
   repository's releases; /account/api is the account page in the prototype (the brief:
   "respect normal login/session behavior"). */
const MARKETPLACE = 'https://marketplace.moodle.com/plugins/plagiarism_plagiarismsearch';
const GITHUB = 'https://github.com/plagiarismsearch/moodle-plagiarism_plagiarismsearch/releases';
const API_CREDS = 'account.html';
const CONTACT = 'contact-us.html';
const UNIVERSITY = 'university-plagiarism-checker.html';
const API_PAGE = 'api.html';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — Moodle Integration brief, 2026-09-15. Verbatim.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Moodle Plagiarism Checker Plugin: Setup Guide | PlagiarismSearch',
  meta: 'Install and configure the PlagiarismSearch Moodle plugin for Assignments. Set up API access, checking modes, reports, student permissions, and optional AI detection.',
  canonical: 'https://plagiarismsearch.com/integration-guide',

  hero: {
    eyebrow: 'Moodle Integration · Setup Guide',
    h1: 'PlagiarismSearch Moodle Integration: Installation &amp; Setup',
    p1: 'Connect PlagiarismSearch to Moodle Assignments so file and online-text submissions can be sent for plagiarism checking directly from the Moodle workflow.',
    p2: 'Administrators can configure automatic checking, Web and Storage comparison sources, report access, student permissions, and optional AI detection from the PlagiarismSearch plugin settings.',
    compat: `Current compatibility: Moodle ${MOODLE_RANGE} · ${ACTIVITY}`,
    primary: 'Download Moodle Plugin',
    secondary: 'Start Setup',
    support: ['Need help with an institutional Moodle deployment?', 'Contact our team.'],
  },

  glance: {
    h2: 'Moodle Integration at a Glance',
    intro: 'The PlagiarismSearch plugin works inside the Moodle Assignment workflow and lets administrators control when submissions are checked, which comparison sources are used, what report access is available, and which options students can use.',
    facts: [
      ['Moodle versions', MOODLE_RANGE],
      ['Supported activity', ACTIVITY],
      ['Submission types', 'File submissions and online text'],
      ['Automatic checking', 'Available for file and online-text submissions'],
      ['Manual checking', 'Available for file and online-text submissions, subject to permissions and settings'],
      ['Comparison sources', 'Web, Storage, or Web + Storage'],
      ['AI detection', 'Optional separate setting'],
      ['Reports', 'PDF, HTML, or both'],
      ['API credentials', 'API User + API Key from your PlagiarismSearch account'],
    ],
  },

  nav: {
    label: 'On this page',
    items: [
      ['requirements', 'Requirements'],
      ['installation', 'Installation'],
      ['connect-your-account', 'Connect your account'],
      ['plugin-settings', 'Plugin settings'],
      ['assignment-setup', 'Assignment setup'],
      ['reports-and-student-access', 'Reports &amp; student access'],
      ['troubleshooting', 'Troubleshooting'],
      ['faq', 'FAQ'],
    ],
  },

  requirements: {
    h2: 'Before You Install the Moodle Plugin',
    p1: 'Before starting the setup, make sure you have administrator access to the Moodle site and access to the API credentials in your PlagiarismSearch account.',
    p2: 'Moodle also requires plagiarism prevention to be enabled at the site level before plagiarism plugins can be used. In current Moodle documentation, this setting is available under Site administration → Advanced features → Enable plagiarism plugins.',
    heads: ['Requirement', 'Explanation'],
    rows: [
      ['Moodle administrator access', 'Required to enable plagiarism prevention, install the plugin, and configure site-wide settings.'],
      ['Supported Moodle version', `Your installation should be within the currently supported Moodle ${MOODLE_RANGE} range.`],
      ['PlagiarismSearch account', 'Required to obtain the API User and API Key used by the plugin.'],
      ['Moodle Assignment workflow', `This guide documents the current PlagiarismSearch workflow for ${ACTIVITY}.`],
    ],
  },

  how: {
    h2: 'How the Moodle Integration Works',
    intro: 'PlagiarismSearch uses Moodle’s plagiarism-plugin workflow. Once the plugin is installed and connected, site-wide settings can provide the default checking behavior, while supported settings can also be configured for individual Moodle Assignments.',
    steps: [
      ['Enable plagiarism prevention', 'Turn on Moodle’s plagiarism-plugin feature at the site level.'],
      ['Install PlagiarismSearch', 'Download the current plugin and install it through Moodle administration.'],
      ['Connect your account', 'Enter the API credentials available in your PlagiarismSearch account.'],
      ['Set your defaults', 'Choose checking mode, comparison sources, report options, AI detection, and student permissions.'],
      ['Enable it for an Assignment', 'Configure PlagiarismSearch in the Moodle Assignment where submissions should be checked.'],
    ],
    support: 'When Assignment-level settings are not stored, the plugin falls back to the corresponding site-wide settings. This lets administrators define defaults while still allowing Assignment-specific configuration where permitted.',
    /* the schematic the brief allows, node for node */
    flow: ['Moodle Assignment', 'File / online-text submission', 'PlagiarismSearch check', 'Similarity / optional AI result', 'Report links and permitted student/teacher actions'],
  },

  install: {
    h2: 'Install the PlagiarismSearch Plugin in Moodle',
    intro: 'Use the current plugin package from Moodle Marketplace or the official PlagiarismSearch GitHub repository. Moodle menu wording can vary slightly between versions, but the installation flow remains the same.',
    steps: [
      'In Moodle, go to Site administration → Advanced features and enable plagiarism plugins.',
      'Download the current PlagiarismSearch plugin ZIP from Moodle Marketplace or the official GitHub releases page.',
      'In Moodle, open Site administration → Plugins → Install plugins.',
      'Upload the PlagiarismSearch ZIP package and follow Moodle’s installation prompts.',
      'After installation, open the PlagiarismSearch plugin settings under Moodle site administration.',
      'Enable PlagiarismSearch and enter the connection details described in the next section.',
      'Save the settings and confirm that Moodle can connect to the PlagiarismSearch API.',
    ],
    links: [['Download from Moodle Marketplace', MARKETPLACE], ['View GitHub Releases', GITHUB]],
  },

  connect: {
    h2: 'Connect Moodle to Your PlagiarismSearch Account',
    p: [
      'Sign in to PlagiarismSearch and open the API section of your account. Your API User and API Key are available there.',
      'In the Moodle PlagiarismSearch settings, enter those values in the corresponding API user and API key fields. The current plugin also contains an API URL field for the service endpoint.',
      'Save the settings after entering your credentials.',
    ],
    link: 'Open My API Credentials',
    security: 'Keep your API Key private. Do not place it in screenshots, public documentation, support tickets visible to third parties, or other publicly accessible content.',
    trouble: 'If PlagiarismSearch cannot validate the connection while the plugin is being enabled, check the API connection values and save the settings again.',
  },

  settings: {
    h2: 'Configure PlagiarismSearch Settings',
    intro: 'PlagiarismSearch separates connection settings from checking, comparison, reporting, and student-access controls. Site-wide values act as defaults for Moodle Assignments unless an Assignment-specific value has been saved.',
    heads: ['Setting', 'Explanation'],
    g1: {
      label: 'Group 1 — Connection',
      rows: [
        ['Enable PlagiarismSearch', 'Turns the PlagiarismSearch plugin on at the site level. The integration must also be enabled for the Assignment where you want to use it.'],
        ['API url', 'Defines the PlagiarismSearch API endpoint used by the plugin.'],
        ['API user', 'Your PlagiarismSearch API user value.'],
        ['API key', 'Your PlagiarismSearch API key.'],
        ['API debug', 'Advanced connection/debugging setting. Leave this at the standard configuration unless PlagiarismSearch support instructs you to change it.'],
      ],
    },
    g2: {
      label: 'Group 2 — Checking behavior',
      rows: [
        ['Auto check', 'Automatically sends supported Moodle Assignment submissions for checking after the relevant submission event. This applies to Assignment file submissions and online text.'],
        ['Manual check', 'Enables manual checking controls for supported Moodle Assignment file and online-text submissions when the user has the required permission. Student access also depends on the student settings below.'],
      ],
    },
  },

  sources: {
    h2: 'Choose What to Compare — and What to Store',
    intro: 'Sources and Add to Storage are separate controls. One decides where a submission is compared; the other decides whether the new submission is added to PlagiarismSearch Storage.',
    heads: ['Source option', 'Meaning'],
    rows: [
      ['Doc vs Web + Storage', 'Compare the submitted content against both Web sources and the configured PlagiarismSearch Storage.'],
      ['Doc vs Web', 'Compare the submitted content against Web sources without using Storage as a comparison source.'],
      ['Doc vs Storage', 'Compare the submitted content against Storage without using Web sources for that check.'],
    ],
    storageLabel: 'Add to Storage',
    storage: 'Add to Storage controls whether the submitted content is added to Storage for future comparisons. Searching Storage does not by itself mean that the current submission will be added to Storage. Likewise, adding a submission to Storage is separate from deciding whether Storage will be searched during the current check.',
  },

  filters: {
    h3: 'Refine the Comparison',
    rows: [
      ['Only Latin characters', 'Applies the plugin’s character-substitution filter during the search. It is intended to help identify character replacements that can affect text matching.'],
      ['Exclude references', 'Excludes detected reference-list content from the similarity calculation when the filter is enabled.'],
      ['Exclude in-text citations', 'Excludes qualifying in-text citation content from the similarity calculation when the filter is enabled.'],
      ['Exclude self-plagiarism', 'Changes how Storage comparisons involving the same user and/or course are filtered. This setting is relevant when Storage is used as a comparison source.'],
    ],
    optionsLabel: 'Self-comparison options',
    options: [
      ['No', 'do not apply a same-user/course exclusion.'],
      ['Exclude user plagiarism within the same course', 'filter matching Storage content associated with the same user in the same course.'],
      ['Exclude user plagiarism', 'filter matching Storage content associated with the same user.'],
      ['Exclude course plagiarism', 'filter matching Storage content associated with the same course.'],
    ],
  },

  ai: {
    h3: 'Optional AI Detection',
    p: [
      'Detect AI is a separate setting from plagiarism detection. Enable it when you also want the PlagiarismSearch check to request an AI-related result.',
      'When an AI result is available, Moodle can display it separately from the plagiarism/similarity result.',
      'AI-generated text is not automatically plagiarism, and the two signals should be interpreted separately.',
    ],
  },

  reports: {
    h3: 'Configure Report Access',
    rows: [
      ['Report language', 'Selects the language used when a supported report language is requested.'],
      ['Report file type', 'Controls whether Moodle provides no report link, a PDF report, an HTML report, or both.'],
      ['Allow teachers review reports', 'Enables the additional teacher review-report link when the user has the required permission.'],
    ],
    langLabel: 'Current report-language options',
    langs: 'Default (English), English, Spanish, Ukrainian, Polish, and Russian.',
  },

  assignment: {
    h2: 'Configure PlagiarismSearch for a Moodle Assignment',
    activityLabel: 'Current documented activity',
    activity: `This guide covers the current PlagiarismSearch workflow for ${ACTIVITY}.`,
    p: [
      'Create a new Moodle Assignment or edit an existing one. In the Assignment settings, find the PlagiarismSearch section and enable the integration.',
      'Supported checking and report settings can then use the site-wide defaults or be saved specifically for that Assignment. This allows administrators to establish a standard configuration while still supporting Assignment-level requirements where course configuration is permitted.',
    ],
    governanceLabel: 'Admin governance note',
    governance: 'If Only administrators can configure course settings is enabled at the site level, Assignment-level PlagiarismSearch configuration is restricted accordingly.',
    splitLabel: 'Checking behavior for file and online-text submissions',
    split: 'Automatic and manual checking can be used for both Moodle Assignment file and online-text submissions. Manual actions remain subject to the configured permissions and checking settings.',
    matrix: { cols: ['File submission', 'Online text'], rows: [['Auto check', 'Supported', 'Supported'], ['Manual checking', 'Supported, subject to permissions and settings', 'Supported, subject to permissions and settings']] },
  },

  url: {
    h3: 'URL Parsing for Online Text',
    p: [
      'The plugin also includes an Allow URL parsing in text option.',
      'When URL parsing is enabled, the plugin can use the configured Valid URLs list for parsing to define which URLs are allowed for that workflow.',
      'Keep the allowed URL list limited to services and domains your institution intentionally supports.',
    ],
    /* the brief's nuance, as two scope tags — not copy, a level marker */
    levels: [['Allow URL parsing in text', 'Assignment level, where available'], ['Valid URLs list for parsing', 'Site level, administrator-maintained']],
  },

  after: {
    h2: 'What Happens After a Student Submits Work',
    p: [
      'If Auto check is enabled, PlagiarismSearch listens for supported Moodle Assignment submission events and sends the submitted file or online text for checking.',
      'When Manual check is enabled, eligible file and online-text submissions can also be checked manually, subject to the configured permissions and student-access settings.',
      'While a report is being processed, Moodle can show an In progress status and a Check status link.',
      'After processing is complete, Moodle can display the returned percentage and the report links enabled by your configuration. If AI detection was enabled and an AI result was returned, the AI value is shown separately.',
    ],
    noteLabel: 'Interpretation note',
    note: 'A similarity result identifies matching content that should be reviewed in context. It should not be treated as an automatic determination that plagiarism or academic misconduct occurred.',
  },

  students: {
    h2: 'Control What Students Can See and Do',
    intro: 'Student access is configurable. Administrators can determine whether students can see report links, view the returned percentage, manually submit eligible Moodle Assignment submissions, or resubmit them after revision.',
    rows: [
      ['Allow students view reports', 'Select whether students receive no report link, PDF, HTML, or both supported report formats.'],
      ['Allow students view plagiarism percentage', 'Controls whether students can see the returned percentage in Moodle.'],
      ['Allow students submit papers', 'Allows students to manually submit eligible Moodle Assignment submissions when Manual check is enabled.'],
      ['Allow students re-submit papers', 'Allows students to manually resubmit eligible Moodle Assignment submissions after a previous completed check when Manual check is enabled.'],
      ['The number of re-submits', 'Limits the number of permitted student resubmissions when a limit is configured.'],
      ['Student disclosure', 'Defines the disclosure text shown to students when the plugin is enabled.'],
    ],
    important: 'Important: student permissions do not override the overall checking mode. Enabling student submission does not create a manual submission action unless Manual check is also enabled.',
  },

  trouble: {
    h2: 'Troubleshooting Moodle Integration',
    heads: ['Problem', 'Recommended check'],
    rows: [
      ['PlagiarismSearch does not appear in the Assignment', 'Confirm that Moodle plagiarism plugins are enabled, the PlagiarismSearch plugin is installed and enabled, and you are configuring a Moodle Assignment.'],
      ['The plugin cannot be enabled successfully', 'Recheck the API URL, API User, and API Key. The plugin validates the API connection when it is enabled.'],
      ['Manual Submit or Resubmit is unavailable', 'Confirm Manual check is enabled, verify the user’s permissions/capabilities, and review the applicable student submit/resubmit settings for the Assignment.'],
      ['A student cannot see the result', 'Check Allow students view reports and Allow students view plagiarism percentage.'],
      ['The result is still processing', 'Use Check status while the report remains In progress.'],
      ['Storage behavior is not what you expected', 'Check both Sources and Add to Storage. They control different behaviors.'],
    ],
  },

  faq: {
    h2: 'Moodle Integration FAQ',
    /* [question, answer, optional link] */
    items: [
      ['Does PlagiarismSearch work with Moodle?', `Yes. PlagiarismSearch provides a Moodle plagiarism plugin for the Moodle Assignment workflow. The current confirmed compatibility range is Moodle ${MOODLE_RANGE}.`],
      ['Which Moodle activity does this guide cover?', `This guide covers the current PlagiarismSearch workflow for ${ACTIVITY}.`],
      ['Can PlagiarismSearch check both files and online text in Moodle?', 'Yes. In Moodle Assignments, both file and online-text submissions can be checked. Automatic checking and manual checking are supported; manual actions depend on the configured permissions and plugin settings.'],
      ['Where do I get the API User and API Key for Moodle?', 'Sign in to your PlagiarismSearch account and open the API section. The API User and API Key used by the Moodle plugin are available there.', ['Open API Credentials', API_CREDS]],
      ['Can Moodle submissions be checked automatically?', 'Yes. Enable Auto check in the PlagiarismSearch settings. For supported Moodle Assignment submissions, the plugin can automatically send new file and online-text submissions for checking.'],
      ['Can I compare Moodle submissions with our own stored documents?', 'Yes. The Sources setting can use Web, Storage, or Web + Storage. Searching Storage is separate from Add to Storage, which controls whether a new submission is added to Storage for future comparisons.'],
      ['Does the Moodle plugin include AI detection?', 'The plugin has a separate Detect AI option. When it is enabled, an AI-related result can be requested and displayed separately from the plagiarism/similarity result. AI detection and plagiarism detection are not the same analysis.'],
      ['Which report formats are available in Moodle?', 'The current plugin can provide PDF reports, HTML reports, both formats, or no report link, depending on the selected settings. A separate teacher review link can also be enabled.'],
      ['Can students see their plagiarism report?', 'Yes, if the administrator allows it. Student report access and percentage visibility are separate settings, so institutions can control what students can see.'],
      ['Can students resubmit a paper after checking it?', 'Yes, for eligible Moodle Assignment submissions when Manual check and student resubmission are enabled. Administrators can also configure a resubmission limit.'],
      ['Are all Moodle submissions automatically stored?', 'No. Storage behavior is configurable. Add to Storage controls whether a submitted document is added to Storage, while Sources controls whether Storage is searched during a check.'],
    ],
  },

  support: {
    h2: 'Need Help with Your Moodle Setup?',
    p1: 'This guide covers the standard PlagiarismSearch Moodle installation and configuration workflow.',
    p2: 'If you need help with API access, institutional deployment, account configuration, or a Moodle setup that requires additional technical review, contact the PlagiarismSearch team.',
    cta: 'Contact Support',
    routes: [
      ['Planning an institution-wide plagiarism workflow?', 'Explore PlagiarismSearch for Universities', UNIVERSITY],
      ['Need a custom integration instead of the Moodle plugin?', 'Explore the Plagiarism API', API_PAGE],
    ],
    externalLabel: 'External resources',
    external: [['Moodle Marketplace', MARKETPLACE], ['GitHub Releases', GITHUB]],
  },
};

/* the five evidence crops: [file, width, height, alt, caption] */
const SHOT = {
  connection: ['settings-connection.png', 560, 262,
    'PlagiarismSearch settings in Moodle: the Enable PlagiarismSearch checkbox, then the API url, API user and API key fields and the API debug option. The API user and API key values are masked.',
    'Example PlagiarismSearch settings in Moodle — the connection fields. Credential values are masked.'],
  checking: ['settings-checking-sources.png', 560, 458,
    'PlagiarismSearch settings in Moodle: Auto check, Manual check, Add to Storage and Sources shown as separate controls, followed by the Only Latin characters, Exclude references, Exclude in-text citations and Exclude self-plagiarism filters.',
    'Example PlagiarismSearch settings in Moodle — Sources and Add to Storage are separate controls, followed by the comparison filters. The values shown are one example configuration.'],
  students: ['settings-reports-students.png', 640, 490,
    'PlagiarismSearch settings in Moodle: Report language, Report file type, Allow students view reports, Allow students view plagiarism percentage, Allow students submit papers, Allow students re-submit papers and The number of re-submits.',
    'Example PlagiarismSearch settings in Moodle — report and student-access controls. The values shown are one example configuration.'],
  result: ['result-teacher-view.png', 250, 220,
    'A Moodle Assignment grading row for a file submission: the submitted file name, the returned percentage, a Download .pdf report link and a Resubmit to PlagiarismSearch link.',
    'Example Moodle Assignment result view for a file submission — the file, the returned percentage, the PDF report link and the Resubmit action. It does not show the online-text workflow.'],
  locator: ['assignment-locator.png', 520, 140,
    'The Moodle Assignment settings form (Updating: Assignment) with a PlagiarismSearch section expanded and Enable PlagiarismSearch set to Yes.',
    'Where to look: the PlagiarismSearch section inside the Moodle Assignment settings. Shown as a locator only — it is not the full list of current settings.'],
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's, plus the three documentation devices this page
   introduces page-locally: the definition table, the callout, the evidence figure.
   ───────────────────────────────────────────────────────────────────────────── */
const H2 = 'text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold tracking-tightest leading-[1.1]';
const H2_WIDE = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const H3 = 'text-[clamp(1.2rem,1.6vw,1.375rem)] font-bold tracking-tight leading-snug';
const P = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-700';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const extIcon = '<svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  info:    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert:   '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  lock:    '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  wrench:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  list:    '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
};

const eyebrow = label => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span class="${LABEL} text-ink-700">${label}</span>
        </div>`;

/* the primary action leaves the site, and says so: the dark button with the leaving arrow */
const btnExternal = (label, href) => `<a href="${href}" rel="noopener" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${extIcon}</span>
          </a>`;
const btnLight = (label, href) => `<a href="${href}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 ring-1 ring-black/10 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${arrow}</span>
          </a>`;
const LINK = 'font-semibold text-ink-800 hover:text-ink-950 underline decoration-ink-300 hover:decoration-ink-500 underline-offset-4 transition-colors duration-300';
const link = (label, href) => /^https?:/.test(href)
  ? `<a href="${href}" rel="noopener" class="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] ${LINK}"><span>${label}</span><span class="text-ink-400">${extIcon}</span></a>`
  : `<a href="${href}" class="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] ${LINK}">${label}</a>`;

/* Moodle's own labels, wherever a sentence names one: set as interface text */
const UI_TERMS = [
  'Site administration → Advanced features → Enable plagiarism plugins', 'Site administration → Advanced features',
  'Site administration → Plugins → Install plugins', 'Only administrators can configure course settings',
  'Submit to PlagiarismSearch', 'Resubmit to PlagiarismSearch', 'Allow students view plagiarism percentage',
  'Allow students view reports', 'Allow URL parsing in text', 'Valid URLs list for parsing',
  'Check status', 'In progress', 'Add to Storage', 'Auto check', 'Manual check', 'Detect AI', 'Sources',
];
const ui = s => {
  /* longest first, and never inside a term already wrapped */
  let out = s; const held = [];
  UI_TERMS.forEach(t => {
    out = out.split(t).join('\u0000' + held.length + '\u0000');
    held.push(`<span class="ui">${t}</span>`);
  });
  return out.replace(/\u0000(\d+)\u0000/g, (_, n) => held[+n]);
};

/* the definition table: a <dl> that is two columns from sm and stacks under it */
const defs = (heads, rows, { term = 'ui' } = {}) => `          <div class="deftable">
            <div class="deftable-head" aria-hidden="true"><span>${heads[0]}</span><span>${heads[1]}</span></div>
            <dl>
${rows.map(([k, v]) => `              <div class="deftable-row">
                <dt>${term === 'ui' ? `<span class="ui">${k}</span>` : k}</dt>
                <dd>${ui(v)}</dd>
              </div>`).join('\n')}
            </dl>
          </div>`;

/* a callout: tone sets the ground; the label is optional */
const TONE = {
  note:   ['bg-ink-50 ring-black/5', '#4B5563', I.info],
  limit:  ['bg-orange-50 ring-orange-200', '#B84431', I.alert],
  secure: ['bg-teal-50 ring-teal-600/15', '#06748A', I.lock],
  fix:    ['bg-ink-50 ring-black/5', '#4B5563', I.wrench],
};
const callout = (tone, text, label) => `          <div class="callout flex items-start gap-3.5 rounded-2xl ring-1 ${TONE[tone][0]} px-4 py-4 sm:px-5 sm:py-[18px]">
            <span class="mt-0.5 shrink-0">${ico(TONE[tone][2], TONE[tone][1], 18)}</span>
            <div class="min-w-0">${label ? `
              <p class="${LABEL} text-ink-500 mb-1.5">${label}</p>` : ''}
              <p class="${BODY} text-ink-900 font-medium">${ui(text)}</p>
            </div>
          </div>`;

/* the evidence figure: a real crop at its natural size, framed, labelled from outside */
const figure = (key, tag = 'Moodle · plugin settings') => {
  const [file, w, h, alt, cap] = SHOT[key];
  return `          <figure class="shot" style="max-width:${w + 34}px">
            <div class="shot-frame">
              <p class="shot-tag"><span></span><span></span><span></span><b>${tag}</b></p>
              <img src="assets/img/moodle/${file}" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async">
            </div>
            <figcaption>${cap}</figcaption>
          </figure>`;
};

const paras = list => list.map(t => `          <p class="${P} max-w-[72ch]">${ui(t)}</p>`).join('\n');
const docSection = (id, h2, inner) => `        <section id="${id}" class="doc-section" aria-labelledby="${id}-h">
          <h2 id="${id}-h" class="${H2}">${h2}</h2>
${inner}
        </section>`;
const sub = (id, h3, inner) => `          <div id="${id}" class="doc-sub">
            <h3 class="${H3}">${h3}</h3>
${inner}
          </div>`;

/* ═══════════════ 01 · HEADER ═══════════════ */
const section1 = () => `  <!-- ================= 01 · DOCUMENTATION / PRODUCT HEADER =================
       Compact. What this is, what it supports — the compatibility line is set as a fact,
       not as small print — and the two ways on: get the plugin (leaves the site, and the
       button says so) and start the setup. No checker. On the right, the link: Moodle's
       mark above, ours below, two straight tracks and the plugin between them; on a phone it sits under the
       actions at a smaller size. -->
  <section id="moodle-integration" class="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-14 lg:pb-16 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_420px] gap-x-12 xl:gap-x-16 gap-y-10 items-center">
      <div class="rv min-w-0 max-w-[900px]">
${eyebrow(COPY.hero.eyebrow)}
        <h1 class="text-[clamp(2.1rem,4.4vw,3.25rem)] font-extrabold tracking-tightest leading-[1.05] mb-5 lg:mb-6">${COPY.hero.h1}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[70ch]">${COPY.hero.p1}</p>
        <p class="mt-3 text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[70ch]">${COPY.hero.p2}</p>

        <p class="mt-6 inline-flex items-start sm:items-center gap-2.5 rounded-2xl sm:rounded-full bg-white ring-1 ring-black/5 shadow-diffuse px-4 py-2.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-900">
          <svg class="shrink-0 mt-0.5 sm:mt-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B7A50" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
          <span>${COPY.hero.compat}</span>
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
          ${btnExternal(COPY.hero.primary, MARKETPLACE)}
          ${btnLight(COPY.hero.secondary, '#installation')}
        </div>
        <p class="mt-5 text-[13px] sm:text-[13.5px] text-ink-500">${COPY.hero.support[0]} <a href="${CONTACT}" class="${LINK}">${COPY.hero.support[1]}</a></p>
      </div>
${heroLink()}
      </div>
    </div>
  </section>`;

/* The link — the hero's one drawing: Moodle's mark above, ours below, and two straight
   vertical tracks between them — submissions run down the left one,
   results and report links run up the right one — with the plugin as the pill between the
   tracks. (A first version joined the marks with a curved bracket; Olex chose straight
   lines on 2026-09-18 — a plain column is easier to seat in a layout.) One 340×330 box:
   tiles in percentages, tracks in an SVG on the same viewBox, so they meet at every size.
   Moodle's logo is the official file the homepage uses (assets/svg/partners/moodle.svg). The
   tracks run a little way under the tiles, so a pulse appears from behind one mark and
   disappears behind the other. */
const TRACK_DOWN = 'M110 84 V246';
const TRACK_UP = 'M230 246 V84';
const pulses = (path, colour) => [0, -1.4].map(b => `            <circle class="hero-link-pulse" r="4.5" fill="${colour}"><animateMotion dur="2.8s" begin="${b}s" repeatCount="indefinite" path="${path}"/></circle>`).join('\n');
const heroLink = () => `        <div class="hero-link rv" role="img" aria-label="Moodle and PlagiarismSearch connected through the PlagiarismSearch plagiarism plugin: Assignment submissions go to PlagiarismSearch, results and report links come back to Moodle.">
          <svg viewBox="0 0 340 330" fill="none" aria-hidden="true">
            <path d="${TRACK_DOWN}" stroke="#C3CAD5" stroke-width="1.5" stroke-dasharray="4 6" stroke-linecap="round"/>
            <path d="${TRACK_UP}" stroke="#C3CAD5" stroke-width="1.5" stroke-dasharray="4 6" stroke-linecap="round"/>
            <path d="m104 222 6 6 6-6" stroke="#0CA9C3" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="m224 108 6-6 6 6" stroke="#F36F5A" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
${pulses(TRACK_DOWN, '#0CA9C3')}
${pulses(TRACK_UP, '#F36F5A')}
          </svg>
          <div class="hero-link-tile" style="left:14.7%;top:0;width:70.6%;height:29.1%">
            <img src="assets/svg/partners/moodle.svg" alt="Moodle" width="600" height="270" decoding="async" style="width:72%">
          </div>
          <div class="hero-link-tile" style="left:14.7%;top:70.9%;width:70.6%;height:29.1%">
            <img src="assets/svg/logo.svg" alt="PlagiarismSearch" width="200" height="28" decoding="async" style="width:72%">
          </div>
          <span class="hero-link-plug" style="left:50%;top:50%" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>
            Plugin
          </span>
          <span class="hero-link-side is-left" style="left:32.35%;top:50%" aria-hidden="true">Submission</span>
          <span class="hero-link-side" style="left:67.65%;top:50%" aria-hidden="true">Result &amp; report</span>
        </div>`;

/* ═══════════════ 02 · AT A GLANCE ═══════════════ */
const section2 = () => `  <!-- ================= 02 · QUICK FACTS =================
       The evaluator's ten seconds. Nine label/value pairs as one sheet — a definition
       list, every value text — not nine cards. -->
  <section id="at-a-glance" class="relative py-12 sm:py-16 lg:py-20 bg-white border-b border-ink-100">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.8fr_1.2fr] gap-8 lg:gap-14 items-start">
        <div class="rv">
          <h2 class="${H2_WIDE}">${COPY.glance.h2}</h2>
          <p class="mt-4 lg:mt-5 ${P} text-ink-600">${COPY.glance.intro}</p>
        </div>
        <div class="rv rounded-3xl sm:rounded-[28px] bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <dl class="glance rounded-[18px] sm:rounded-[20px] bg-white shadow-inner-hl overflow-hidden">
${COPY.glance.facts.map(([k, v]) => `            <div class="glance-row">
              <dt>${k}</dt>
              <dd>${v}</dd>
            </div>`).join('\n')}
          </dl>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · THE DOCUMENT ═══════════════ */
const navList = cls => COPY.nav.items.map(([id, label]) => `            <li><a href="#${id}" class="${cls}" data-spy="${id}">${label}</a></li>`).join('\n');

const docRequirements = () => docSection('requirements', COPY.requirements.h2, `${paras([COPY.requirements.p1, COPY.requirements.p2])}
${defs(COPY.requirements.heads, COPY.requirements.rows, { term: 'plain' })}`);

const docHow = () => docSection('how-it-works', COPY.how.h2, `${paras([COPY.how.intro])}
          <ol class="steps">
${COPY.how.steps.map(([head, body], i) => `            <li>
              <span class="steps-n">${i + 1}</span>
              <div class="min-w-0">
                <p class="text-[15px] sm:text-[15.5px] font-bold tracking-tight text-ink-900">${head}</p>
                <p class="${BODY} text-ink-600 mt-0.5">${body}</p>
              </div>
            </li>`).join('\n')}
          </ol>
${callout('note', COPY.how.support)}
          <!-- the schematic the brief allows: five nodes, a line, no Moodle UI -->
          <figure class="flow" aria-label="How a submission moves: ${COPY.how.flow.join(' → ')}">
            <ol>
${COPY.how.flow.map((n, i) => `              <li${i === 2 ? ' class="is-ps"' : ''}><span>${n}</span></li>`).join('\n')}
            </ol>
            <figcaption>Schematic of the workflow — not a Moodle screen.</figcaption>
          </figure>`);

const docInstall = () => docSection('installation', COPY.install.h2, `${paras([COPY.install.intro])}
          <ol class="steps steps-tight">
${COPY.install.steps.map((s, i) => `            <li>
              <span class="steps-n">${i + 1}</span>
              <p class="${P} min-w-0 pt-[3px]">${ui(s)}</p>
            </li>`).join('\n')}
          </ol>
          <p class="flex flex-wrap items-center gap-x-6 gap-y-2">
            ${COPY.install.links.map(([l, h]) => link(l, h)).join('\n            ')}
          </p>`);

const docConnect = () => docSection('connect-your-account', COPY.connect.h2, `${paras(COPY.connect.p)}
          <p>${btnLight(COPY.connect.link, API_CREDS)}</p>
${figure('connection')}
${callout('secure', COPY.connect.security, 'Security note')}
${callout('fix', COPY.connect.trouble)}`);

const docSettings = () => docSection('plugin-settings', COPY.settings.h2, `${paras([COPY.settings.intro])}
          <p class="group-label">${COPY.settings.g1.label}</p>
${defs(COPY.settings.heads, COPY.settings.g1.rows)}
          <p class="group-label">${COPY.settings.g2.label}</p>
${defs(COPY.settings.heads, COPY.settings.g2.rows)}`);

const docSources = () => docSection('sources-and-storage', COPY.sources.h2, `${paras([COPY.sources.intro])}
          <!-- the two controls, side by side, so nobody reads them as one -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="rounded-2xl ring-1 ring-black/5 bg-white shadow-diffuse p-5 sm:p-6">
              <p class="${LABEL} text-ink-500 mb-1.5">Control 1 · where it is compared</p>
              <p class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-3"><span class="ui">Sources</span></p>
              <ul class="grid gap-1.5">
${COPY.sources.rows.map(([k]) => `                <li class="flex items-center gap-2.5 ${BODY} text-ink-700"><span class="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span><span class="ui">${k}</span></li>`).join('\n')}
              </ul>
            </div>
            <div class="rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-5 sm:p-6">
              <p class="${LABEL} text-ink-500 mb-1.5">Control 2 · whether it is kept</p>
              <p class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-3"><span class="ui">${COPY.sources.storageLabel}</span></p>
              <p class="${BODY} text-ink-700">Yes / No — set separately from <span class="ui">Sources</span>.</p>
            </div>
          </div>
${defs(COPY.sources.heads, COPY.sources.rows)}
          <div>
            <p class="group-label !mt-0">${COPY.sources.storageLabel}</p>
            <p class="${P} max-w-[72ch]">${ui(COPY.sources.storage)}</p>
          </div>
${figure('checking')}
${sub('refine-the-comparison', COPY.filters.h3, `${defs(COPY.settings.heads, COPY.filters.rows)}
            <p class="group-label">${COPY.filters.optionsLabel}</p>
            <ul class="grid gap-2">
${COPY.filters.options.map(([k, v]) => `              <li class="${BODY} text-ink-700"><span class="ui">${k}</span> — ${v}</li>`).join('\n')}
            </ul>`)}
${sub('optional-ai-detection', COPY.ai.h3, paras(COPY.ai.p))}
${sub('report-access', COPY.reports.h3, `${defs(COPY.settings.heads, COPY.reports.rows)}
            <p class="${BODY} text-ink-700"><b class="font-semibold text-ink-900">${COPY.reports.langLabel}:</b> ${COPY.reports.langs}</p>`)}`);

const docAssignment = () => docSection('assignment-setup', COPY.assignment.h2, `${callout('note', COPY.assignment.activity, COPY.assignment.activityLabel)}
${paras(COPY.assignment.p)}
${figure('locator', 'Moodle · Assignment settings')}
${callout('note', COPY.assignment.governance, COPY.assignment.governanceLabel)}
          <!-- file and online text, side by side: both modes cover both (patch 2026-09-18 — the
               developer confirmed manual checking for online text; no button name is invented) -->
          <div class="rounded-2xl ring-1 ring-black/5 bg-white shadow-diffuse overflow-hidden">
            <p class="px-5 sm:px-6 pt-5 text-[15.5px] sm:text-[16.5px] font-bold tracking-tight">${COPY.assignment.splitLabel}</p>
            <p class="px-5 sm:px-6 pt-2 pb-5 ${BODY} text-ink-700 max-w-[72ch]">${ui(COPY.assignment.split)}</p>
            <table class="matrix w-full text-left">
              <thead><tr><th scope="col"><span class="sr-only">Checking mode</span></th>${COPY.assignment.matrix.cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead>
              <tbody>
${COPY.assignment.matrix.rows.map(([mode, a, b]) => `                <tr><th scope="row">${mode === 'Auto check' ? '<span class="ui">Auto check</span>' : mode}</th><td>${a}</td><td>${b}</td></tr>`).join('\n')}
              </tbody>
            </table>
          </div>
${sub('url-parsing', COPY.url.h3, `${paras(COPY.url.p)}
            <ul class="grid sm:grid-cols-2 gap-3">
${COPY.url.levels.map(([k, v]) => `              <li class="rounded-xl bg-ink-50 ring-1 ring-black/5 px-4 py-3"><span class="ui">${k}</span><span class="block mt-1.5 ${LABEL} text-ink-500">${v}</span></li>`).join('\n')}
            </ul>`)}`);

const docAfter = () => docSection('reports-and-student-access', COPY.after.h2, `          <div class="grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-start">
            <div class="grid gap-4 min-w-0">
${paras(COPY.after.p)}
            </div>
${figure('result', 'Moodle · Assignment grading')}
          </div>
${callout('limit', COPY.after.note, COPY.after.noteLabel)}`);

const docStudents = () => docSection('student-access', COPY.students.h2, `${paras([COPY.students.intro])}
${defs(COPY.settings.heads, COPY.students.rows)}
${callout('limit', COPY.students.important)}
${figure('students')}`);

const docTrouble = () => docSection('troubleshooting', COPY.trouble.h2, `          <dl class="trouble">
${COPY.trouble.rows.map(([k, v]) => `            <div>
              <dt><span class="trouble-q" aria-hidden="true">?</span>${k}</dt>
              <dd><span class="${LABEL} text-ink-500 block mb-1">${COPY.trouble.heads[1]}</span>${ui(v)}</dd>
            </div>`).join('\n')}
          </dl>`);

const docFaq = () => docSection('faq', COPY.faq.h2, `          <div class="rounded-3xl sm:rounded-[28px] bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
            <div class="rounded-[18px] sm:rounded-[20px] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.faq.items.map(([q, a, l], i) => `              <div class="faq-item${i === 0 ? ' open' : ''}">
                <h3 class="m-0"><button type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-a-${i}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5">
                  <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                  <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </button></h3>
                <div class="faq-a" id="faq-a-${i}"><div><div class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 max-w-[72ch]">
                  <p class="${BODY} text-ink-700">${ui(a)}</p>${l ? `
                  <p class="mt-3">${link(l[0], l[1])}</p>` : ''}
                </div></div></div>
              </div>`).join('\n')}
            </div>
          </div>`);

const section3 = () => `  <!-- ================= 03 · THE GUIDE =================
       One reading column and its rail. The rail is sticky from lg and marks the section
       being read; under lg it is a jump menu that sticks below the site header and closes
       when a link is chosen. Every section is anchorable; the offset clears both bars. -->
  <div id="guide" class="relative bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <details class="jump lg:hidden" id="jumpMenu">
        <summary><span class="flex items-center gap-2.5">${ico(I.list, '#374151', 16)}<span>${COPY.nav.label}</span></span><span class="jump-now" id="jumpNow"></span><svg class="jump-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
        <nav aria-label="${COPY.nav.label}">
          <ul>
${navList('jump-link')}
          </ul>
        </nav>
      </details>

      <div class="grid lg:grid-cols-[232px_minmax(0,1fr)] gap-x-14 xl:gap-x-20 py-10 sm:py-14 lg:py-20">
        <aside class="hidden lg:block">
          <nav class="rail" aria-label="${COPY.nav.label}">
            <p class="${LABEL} text-ink-500 mb-4">${COPY.nav.label}</p>
            <ul>
${navList('rail-link')}
            </ul>
            <div class="mt-7 pt-6 border-t border-ink-100 grid gap-2.5">
              ${link('Moodle Marketplace', MARKETPLACE)}
              ${link('GitHub Releases', GITHUB)}
            </div>
          </nav>
        </aside>

        <div class="doc min-w-0 max-w-[860px]">
${[docRequirements, docHow, docInstall, docConnect, docSettings, docSources, docAssignment, docAfter, docStudents, docTrouble, docFaq].map(f => f()).join('\n\n')}
        </div>
      </div>
    </div>
  </div>`;

/* ═══════════════ 04 · SUPPORT / HANDOFF ═══════════════ */
const section4 = () => banner({
  id: 'moodle-support',
  eyebrow: ['teal-400', 'Support'],
  h2: COPY.support.h2,
  lead: COPY.support.p1,
  leadMax: '60ch',
  after: `            <p class="mt-3 ${banner.SUPPORT} max-w-[60ch]">${COPY.support.p2}</p>`,
  action: banner.btn(COPY.support.cta, CONTACT),
});

const section5 = () => `  <!-- ================= 05 · WHERE TO GO INSTEAD / NEXT =================
       The resource row: two routes to the pages that own the neighbouring jobs, and the
       two official places the plugin lives — marked as leaving the site, not dressed as
       buttons. -->
  <section id="related" class="relative pb-16 sm:pb-20 lg:pb-24 bg-white">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv-kids grid md:grid-cols-2 lg:grid-cols-[1fr_1fr_.8fr] gap-4 sm:gap-5 lg:gap-6">
${COPY.support.routes.map(([q, label, href]) => `        <a href="${href}" class="group rounded-2xl sm:rounded-3xl bg-ink-50 hover:bg-ink-100 transition-colors duration-300 p-5 sm:p-6 lg:p-7 flex flex-col">
          <p class="${BODY} text-ink-600 mb-3">${q}</p>
          <p class="mt-auto inline-flex items-center gap-2 text-[15px] sm:text-[16px] font-bold tracking-tight text-ink-900">${label}<span class="transition-transform duration-300 group-hover:translate-x-1">${arrow}</span></p>
        </a>`).join('\n')}
        <div class="md:col-span-2 lg:col-span-1 rounded-2xl sm:rounded-3xl ring-1 ring-black/5 p-5 sm:p-6 lg:p-7">
          <p class="${LABEL} text-ink-500 mb-4">${COPY.support.externalLabel}</p>
          <ul class="grid gap-3">
${COPY.support.external.map(([l, h]) => `            <li>${link(l, h)}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles — the documentation devices.
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  [hidden] { display: none !important; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden;
    clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  /* anchors clear the site header, and under lg the jump menu beneath it */
  section[id], .doc-sub[id] { scroll-margin-top: 104px; }
  @media (max-width:1023px) { .doc-section, .doc-sub[id] { scroll-margin-top: 132px; } }

  a:focus-visible, button:focus-visible, summary:focus-visible {
    outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  .bg-ink-950 a:focus-visible { outline-color: #6ED7E8; }

  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

  /* ---------- the hero link: two marks, two straight tracks, the plugin between ---------- */
  .hero-link { position:relative; width:100%; max-width:340px; aspect-ratio:340/330; margin:0 auto; }
  .hero-link > svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
  .hero-link-tile { position:absolute; display:flex; align-items:center; justify-content:center; border-radius:20px;
    background:#fff; box-shadow:0 0 0 1px rgba(0,0,0,.05), 0 18px 40px -22px rgba(16,24,40,.28); }
  .hero-link-tile img { display:block; width:82%; height:auto; }
  .hero-link-plug { position:absolute; transform:translate(-50%,-50%); display:inline-flex; align-items:center; gap:7px; height:34px; padding:0 14px 0 11px;
    border-radius:999px; background:#111827; color:#fff; font-size:10.5px; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    box-shadow:0 0 0 5px rgba(242,252,252,.9), 0 10px 24px -10px rgba(16,24,40,.5); }
  .hero-link-side { position:absolute; transform:translate(12px,-50%); max-width:92px; font-size:12px; font-weight:600; line-height:1.3; color:#374151; }
  .hero-link-side.is-left { transform:translate(calc(-100% - 12px),-50%); text-align:right; }
  @media (max-width:1023px) { .hero-link { max-width:300px; margin:0; } .hero-link-tile { border-radius:16px; } }
  @media (prefers-reduced-motion: reduce) { .hero-link-pulse { display:none; } }

  /* Moodle's own words */
  .ui { font-weight:600; color:#111827; background:#F3F4F6; border-radius:6px; padding:.08em .4em;
    box-decoration-break:clone; -webkit-box-decoration-break:clone; }
  .bg-orange-50 .ui { background:rgba(184,68,49,.10); }
  .bg-teal-50 .ui, .bg-ink-50 .ui, .deftable dt .ui { background:#E9EBEF; }

  /* ---------- the reading column ---------- */
  .doc-section { display:grid; gap:20px; padding-bottom:56px; margin-bottom:56px; border-bottom:1px solid #EEF0F3; }
  .doc-section:last-child { border-bottom:0; margin-bottom:0; padding-bottom:0; }
  .doc-section > h2 { margin-bottom:4px; }
  .doc-sub { display:grid; gap:16px; padding-top:28px; margin-top:8px; border-top:1px dashed #E1E4E9; }
  .group-label { margin-top:8px; font-size:11px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:#B84431; }
  @media (min-width:1024px) { .doc-section { gap:22px; padding-bottom:72px; margin-bottom:72px; } }

  /* ---------- the definition table ---------- */
  .deftable { border-radius:16px; box-shadow:0 0 0 1px rgba(0,0,0,.06); overflow:hidden; background:#fff; }
  .deftable-head { display:none; }
  .deftable-row { padding:14px 16px; border-top:1px solid #EEF0F3; }
  .deftable-row:first-child { border-top:0; }
  .deftable dt { font-size:14px; font-weight:700; color:#111827; letter-spacing:-.01em; margin-bottom:6px; }
  .deftable dd { font-size:13.5px; line-height:1.6; color:#374151; }
  @media (min-width:640px) {
    .deftable-head, .deftable-row { display:grid; grid-template-columns:minmax(0,.38fr) minmax(0,.62fr); gap:24px; }
    .deftable-head { padding:11px 20px; background:#F8F9FB; border-bottom:1px solid #EEF0F3;
      font-size:10.5px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6B7280; }
    .deftable-row { padding:16px 20px; }
    .deftable dt { margin-bottom:0; font-size:14.5px; }
    .deftable dd { font-size:14.5px; }
  }

  /* ---------- at a glance ---------- */
  .glance-row { display:grid; gap:2px; padding:13px 18px; border-top:1px solid #EEF0F3; }
  .glance-row:first-child { border-top:0; }
  .glance dt { font-size:10.5px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#6B7280; }
  .glance dd { font-size:15px; font-weight:700; letter-spacing:-.01em; color:#111827; }
  @media (min-width:640px) {
    .glance-row { grid-template-columns:200px minmax(0,1fr); gap:20px; align-items:baseline; padding:14px 24px; }
    .glance dd { font-size:15.5px; }
  }

  /* ---------- numbered steps on one spine ---------- */
  .steps { position:relative; display:grid; gap:16px; counter-reset:none; }
  .steps::before { content:""; position:absolute; left:15px; top:16px; bottom:16px; width:1px; background:#E1E4E9; }
  .steps > li { position:relative; display:flex; align-items:flex-start; gap:16px; }
  .steps-n { position:relative; z-index:1; flex:none; width:31px; height:31px; border-radius:999px; background:#D4F3F8; color:#06748A;
    display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; font-variant-numeric:tabular-nums;
    box-shadow:0 0 0 4px #fff; }
  .steps-tight { gap:12px; }

  /* ---------- the schematic ---------- */
  .flow { margin:4px 0 0; }
  .flow ol { display:grid; gap:22px; }
  .flow li { position:relative; }
  .flow li span { display:flex; align-items:center; justify-content:center; text-align:center; min-height:56px; padding:10px 12px;
    border-radius:14px; background:#F8F9FB; box-shadow:0 0 0 1px rgba(0,0,0,.06);
    font-size:12.5px; font-weight:600; line-height:1.35; color:#1F2937; }
  .flow li.is-ps span { background:#111827; color:#fff; box-shadow:none; }
  .flow li + li::before { content:""; position:absolute; left:50%; top:-16px; width:1px; height:10px; background:#9CA3AF; }
  .flow li + li::after { content:""; position:absolute; left:50%; top:-9px; width:6px; height:6px; margin-left:-3px;
    border-right:1px solid #9CA3AF; border-bottom:1px solid #9CA3AF; transform:rotate(45deg); }
  .flow figcaption, .shot figcaption { margin-top:10px; font-size:12.5px; line-height:1.5; color:#6B7280; }
  @media (min-width:768px) {
    .flow ol { grid-template-columns:repeat(5, minmax(0,1fr)); gap:22px; }
    .flow li span { height:100%; min-height:76px; }
    .flow li + li::before { left:-17px; top:50%; width:11px; height:1px; }
    .flow li + li::after { left:-11px; top:50%; margin-left:0; margin-top:-3px; transform:rotate(-45deg); }
  }

  /* ---------- the evidence figure ---------- */
  .shot { margin:4px 0 0; width:100%; }
  .shot-frame { border-radius:16px; background:#F3F4F6; box-shadow:0 0 0 1px rgba(0,0,0,.06); padding:0 8px 8px; }
  .shot-tag { display:flex; align-items:center; gap:5px; height:30px; padding:0 6px; }
  .shot-tag span { width:7px; height:7px; border-radius:999px; background:#D1D5DB; }
  .shot-tag b { margin-left:8px; font-size:10.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#6B7280; }
  .shot img { display:block; width:100%; height:auto; border-radius:10px; background:#fff; padding:8px 9px; box-shadow:0 0 0 1px rgba(0,0,0,.05); }

  /* ---------- file vs online text ---------- */
  .matrix { border-top:1px solid #EEF0F3; border-collapse:collapse; font-size:13.5px; }
  .matrix th, .matrix td { padding:12px 16px; border-top:1px solid #EEF0F3; vertical-align:top; line-height:1.5; }
  .matrix thead th { border-top:0; background:#F8F9FB; font-size:10.5px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#6B7280; }
  .matrix tbody th { font-weight:700; color:#111827; width:32%; }
  .matrix td { color:#1B7A50; font-weight:600; }
  @media (min-width:640px) { .matrix { font-size:14.5px; } .matrix th, .matrix td { padding:14px 24px; } }

  /* ---------- troubleshooting ---------- */
  .trouble { display:grid; gap:12px; }
  .trouble > div { border-radius:16px; box-shadow:0 0 0 1px rgba(0,0,0,.06); background:#fff; padding:16px 18px; }
  .trouble dt { display:flex; align-items:flex-start; gap:12px; font-size:15px; font-weight:700; letter-spacing:-.01em; color:#111827; }
  .trouble-q { flex:none; width:22px; height:22px; border-radius:999px; background:#FDE6E1; color:#B84431; font-size:12.5px; font-weight:800;
    display:flex; align-items:center; justify-content:center; margin-top:1px; }
  .trouble dd { margin:10px 0 0 34px; font-size:14px; line-height:1.6; color:#374151; }
  @media (min-width:768px) {
    .trouble > div { display:grid; grid-template-columns:minmax(0,.42fr) minmax(0,.58fr); gap:28px; padding:18px 22px; }
    .trouble dd { margin:0; font-size:14.5px; }
  }

  /* ---------- the rail and the jump menu ---------- */
  .rail { position:sticky; top:112px; }
  .rail ul { display:grid; border-left:1px solid #E1E4E9; }
  .rail-link { display:block; margin-left:-1px; padding:7px 0 7px 16px; border-left:2px solid transparent;
    font-size:13.5px; font-weight:500; color:#6B7280; transition:color .2s ease, border-color .2s ease; }
  .rail-link:hover { color:#111827; }
  .rail-link.on { color:#111827; font-weight:700; border-left-color:#0991A8; }

  .jump { position:sticky; top:68px; z-index:30; margin:0 -16px; background:rgba(255,255,255,.94);
    -webkit-backdrop-filter:saturate(1.4) blur(10px); backdrop-filter:saturate(1.4) blur(10px); border-bottom:1px solid #EEF0F3; }
  @media (min-width:640px) { .jump { margin:0 -24px; top:84px; } }
  .jump summary { list-style:none; display:flex; align-items:center; gap:12px; min-height:48px; padding:0 16px; cursor:pointer;
    font-size:13.5px; font-weight:700; color:#111827; }
  @media (min-width:640px) { .jump summary { padding:0 24px; } }
  .jump summary::-webkit-details-marker { display:none; }
  .jump-now { margin-left:auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500; color:#6B7280; }
  .jump-chev { flex:none; transition:transform .25s ease; }
  .jump[open] .jump-chev { transform:rotate(180deg); }
  .jump nav { padding:4px 8px 12px; }
  @media (min-width:640px) { .jump nav { padding:4px 16px 12px; } }
  .jump-link { display:flex; align-items:center; min-height:44px; padding:0 8px; border-radius:10px; font-size:14.5px; font-weight:500; color:#374151; }
  .jump-link.on { background:#F3F4F6; color:#111827; font-weight:700; }
  @media (prefers-reduced-motion: reduce) { .jump-chev, .rail-link { transition:none; } }
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour — reveals, the section spy for both navigations, the accordion, the burger.
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
})();
</script>
<script>
(() => {
  'use strict';
  /* the section spy: the last navigated section whose top has passed the reading line */
  const links = [...document.querySelectorAll('[data-spy]')];
  const ids = [...new Set(links.map(a => a.dataset.spy))];
  const targets = ids.map(id => document.getElementById(id)).filter(Boolean);
  const now = document.getElementById('jumpNow');
  const jump = document.getElementById('jumpMenu');
  let current = null, ticking = false;
  const spy = () => {
    ticking = false;
    const line = innerWidth < 1024 ? 150 : 140;
    let hit = null;
    targets.forEach(t => { if (t.getBoundingClientRect().top <= line) hit = t.id; });
    if (hit === current) return;
    current = hit;
    links.forEach(a => {
      const on = a.dataset.spy === hit;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (now) { const a = links.find(x => x.dataset.spy === hit); now.textContent = a ? a.textContent : ''; }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  addEventListener('resize', spy);
  spy();
  if (jump) {
    jump.addEventListener('click', e => { if (e.target.closest('a')) jump.open = false; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') jump.open = false; });
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

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${[section1, section2, section3, section4, section5].map(f => f()).join('\n\n')}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' +
            count(/class="deftable"/g) + ' definition tables, ' + count(/<figure class="shot"/g) + ' screenshots, ' +
            count(/class="faq-item/g) + ' faq items, ' + count(/<form\b/g) + ' forms');
