/* Generate site/canvas-integration.html — the Canvas Integration page to the approved
   illustrated brief of 2026-10-08 (new-tasks/new-page-7/Canvas_Integration_…_CORRECTED.zip).
   It replaces a stub, so no -v2 and no version switcher.

   THE BRIEF IN ONE LINE: eleven sections in a fixed order, the English copy as approved,
   and the proof is two real developer screenshots of Canvas SpeedGrader — never a drawn
   Canvas screen, never another product's.

   What that makes of the page:
   · The words below are the brief's, section by section. Only the hero has an eyebrow in
     the brief; the other sections have none, so they carry none.
   · The screenshots are shown as supplied (site/assets/img/canvas/, the PNGs re-encoded,
     pixels and size untouched), in one place: the SpeedGrader act. A full screenshot is
     small in a column, so each opens enlarged, and the report panel — the brief's own crop
     of the same screenshot — stands beside it at a size its labels can be read at.
   · The hero carries no screenshot (Olex, 2026-10-12 — the brief put the File Upload one
     there too): it draws the integration as a loop between the two marks instead.
   · The percentages on them are the values of two demo submissions. The page says so by
     each screenshot and never repeats a figure in its own copy.
   · Nothing here claims Canvas certification, a partner badge, a file-format list, a size
     limit, a price or an outcome.

   Three compositions are this page's own, each one section and named by data-component:
     canvas-flow      the hub hero's media: Canvas ⇄ PlagiarismSearch, drawn (36-canvas-hero.css)
     canvas-proof     File Upload / Text Entry — two tabs that swap a screenshot and its
                      caption (build/evidence.js; a tab runs nothing)
     setup-paths      two role cards of equal weight, each to its published guide
   Everything else is the Section Library: hero (hub), steps, feature cards, sources, the
   banner, the FAQ, the closing band; the plagiarism / AI card is the Students page's.

   Destinations: the Admin and Teacher guides are the live site's published pages (the
   brief: link to them, do not recreate them); /policy → policy.html; Contact → the
   prototype's contact-us.html.

   Run:  node build/canvas.js  →  node build/shell.js  →  node build/check-canvas.js
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const ev = require('./evidence');
const sh = require('./sections/section-head');
const action = require('./sections/action');
const tile = require('./sections/icon-tile');
const hero = require('./sections/hero');
const steps = require('./sections/steps');
const cards = require('./sections/feature-cards');
const sources = require('./sections/sources');
const banner = require('./sections/banner');
const faq = require('./sections/faq');
const cta = require('./sections/cta-band');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'canvas-integration.html';

const ADMIN = 'https://plagiarismsearch.com/canvas-admin-guide';
const TEACHER = 'https://plagiarismsearch.com/canvas-teacher-guide';
const POLICY = 'policy.html';
const CONTACT = 'contact-us.html';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — Canvas Integration brief, 2026-10-08. Verbatim.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  /* the brief gives no <title> or meta description: the title is the H1 with the site's
     name, the description the hero's first sentence — for editorial sign-off */
  title: 'Canvas Plagiarism Checker &amp; AI Writing Detection | PlagiarismSearch',
  meta: 'Integrate PlagiarismSearch into your Canvas LMS workflow to check student submissions for matching text and indicators of AI-generated writing.',
  canonical: 'https://plagiarismsearch.com/canvas-integration',

  hero: {
    eyebrow: 'Canvas LMS Integration',
    h1: 'Canvas Plagiarism Checker &amp; AI Writing Detection',
    lead: 'Integrate PlagiarismSearch into your Canvas LMS workflow to check student submissions for matching text and indicators of AI-generated writing. Instructors can review similarity scores, AI-writing results, and links to detailed reports in Canvas SpeedGrader.',
    primary: 'View Canvas Setup Guide',
    secondary: 'Contact Our Team',
    chips: ['LTI 1.3 Integration', 'File Uploads &amp; Text Entry', 'SpeedGrader Reports'],
  },

  how: {
    h2: 'How PlagiarismSearch Works in Canvas',
    intro: 'PlagiarismSearch connects to Canvas through an LTI 1.3 document processing integration. Once the app is installed and enabled for an eligible assignment, submitted work can be checked as part of the existing Canvas workflow.',
    steps: [
      ['Connect the integration', 'A Canvas administrator installs PlagiarismSearch using Dynamic Registration and makes the app available in the appropriate Canvas account or courses.'],
      ['Enable assignment checking', 'An instructor adds PlagiarismSearch as a document processing app to an eligible assignment and configures the available checking options.'],
      ['Students submit their work', 'Students complete their assignments using Canvas File Uploads or Text Entry. The submission is sent for processing when the integration is enabled.'],
      ['Review the results', 'After processing, instructors can see the returned similarity and AI-writing indicators, when available, in SpeedGrader and open the corresponding detailed reports.'],
    ],
    link: 'Read the Canvas Admin Guide',
  },

  proof: {
    h2: 'Review Similarity and AI Results in SpeedGrader',
    intro: 'PlagiarismSearch returns checking results to the grading environment your instructors already use. Instead of relying on a single number, reviewers can open detailed reports and examine the results in context.',
    points: [
      ['Similarity Score', 'See the reported level of matching or similar text and open the detailed similarity report to examine the results and associated sources.'],
      ['AI Probability', 'When AI-writing analysis is enabled and a result is available, view a separate AI probability indicator and access its corresponding report.'],
      ['Detailed Reports', 'Use the report links in SpeedGrader to move from a summary indicator to a more detailed review of the submitted work.'],
    ],
    important: ['Important:', 'A similarity score is not an automatic determination of plagiarism. Reported matches require review in context.'],
    tabs: ['File Upload', 'Text Entry'],
  },

  versus: {
    h2: 'Plagiarism Checking and AI Writing Detection Are Separate Analyses',
    intro: 'Plagiarism and AI-generated writing are different questions. PlagiarismSearch provides separate analyses so instructors can consider each result for its intended purpose.',
    plagiarism: ['Plagiarism Checking', 'Identify matching or similar passages in submitted work and review the sources associated with those matches.', 'Similarity findings can help instructors examine quotations, citations, reused material, and passages that may require closer attention. A match does not automatically mean that plagiarism has occurred.'],
    ai: ['AI Writing Detection', 'Analyze text for patterns associated with AI-generated writing when the AI-checking feature is enabled.', 'The resulting AI probability indicator can support further review, but it does not establish who wrote a document or whether academic misconduct occurred.'],
    closing: 'Two separate results. One informed review process.',
  },

  types: {
    h2: 'Check File Uploads and Text Entry Assignments',
    intro: 'PlagiarismSearch supports two common Canvas assignment submission types.',
    items: [
      ['File Uploads', 'Students can submit supported documents through Canvas assignments. PlagiarismSearch processes eligible files and returns the available checking results for instructor review.'],
      ['Text Entry', 'Students can also submit text directly in Canvas. Supported Text Entry submissions can be processed without requiring students to create a separate document for upload.'],
    ],
    note: 'Both submission types are part of the existing Canvas assignment workflow. Actual file acceptance depends on the supported formats and applicable Canvas settings.',
  },

  config: {
    h2: 'Configure Checking and Report Access',
    intro: 'Different institutions and assignments may require different approaches to reviewing student work. PlagiarismSearch provides configuration options to help administrators and instructors adapt checking to their workflows.',
    items: [
      ['Plagiarism and AI-Writing Checks', 'Configure the available checking options according to the assignment\'s requirements. AI-writing analysis is separate from plagiarism checking.'],
      ['Comparison Sources', 'Control the available comparison-source settings used for plagiarism analysis, subject to the institution\'s configuration and enabled features.'],
      ['Report Visibility', 'Manage available report-access settings, including whether students can view results where supported by the integration and Canvas configuration.'],
      ['Document Storage', 'Configure applicable storage behavior separately from the checking process, including whether submitted work is retained for future comparisons.'],
    ],
    note: 'Available controls and permissions depend on the institution\'s integration configuration.',
  },

  setup: {
    h2: 'Get Started with PlagiarismSearch for Canvas',
    intro: 'Whether you manage Canvas across an institution or teach within an existing Canvas environment, follow the guide that matches your role.',
    roles: [
      { h3: 'For Canvas Administrators', lead: 'Install and configure the PlagiarismSearch LTI 1.3 integration.',
        steps: ['Open Canvas Apps.', 'Start the Dynamic Registration process.', 'Connect the integration to your PlagiarismSearch account.', 'Configure the app\'s availability for the appropriate Canvas environment.'],
        cta: 'Read Canvas Admin Guide', href: ADMIN },
      { h3: 'For Canvas Instructors', lead: 'Enable PlagiarismSearch within an eligible assignment after the app has been made available by your administrator.',
        steps: ['Open or create a Canvas assignment.', 'Add the PlagiarismSearch document processing app.', 'Save the assignment with the appropriate settings.', 'Review checking results in SpeedGrader.'],
        cta: 'Read Canvas Teacher Guide', href: TEACHER },
    ],
    /* [the question, the link's words, the rest of the sentence] */
    help: ['Need help with deployment?', 'Contact our team', 'to discuss your institution\'s Canvas configuration.'],
  },

  handling: {
    h2: 'Understand How Submitted Work Is Handled',
    intro: 'Checking submitted work and storing it for future comparisons are separate parts of the workflow.',
    steps: [
      ['Submission processing', 'When an eligible assignment uses PlagiarismSearch, supported submitted content is transferred for the configured analysis.'],
      ['Report generation', 'PlagiarismSearch processes the submission and returns the available results to Canvas. Detailed reports can be accessed through their corresponding links.'],
      ['Storage configuration', 'Whether a submission is retained in PlagiarismSearch Storage for future comparisons depends on the applicable storage settings. Processing a submission does not, by itself, mean that the document becomes a permanent comparison source.'],
    ],
    note: 'Institutions should review their integration settings and applicable data-handling policies before deployment.',
    link: 'Read Our Privacy Policy',
  },

  value: {
    h2: 'Bring Plagiarism Checking into Your Canvas Workflow',
    intro: 'PlagiarismSearch is designed to support institutions that want to review student submissions within their established learning-management processes.',
    items: [
      ['Work Within the Grading Workflow', 'Instructors can access returned checking indicators in SpeedGrader, alongside the assignments they already review.'],
      ['Configure Assignment Checking', 'Administrators and instructors can use the available integration settings and permissions to determine how checking is applied to supported assignments.'],
      ['Review Evidence, Not Just Scores', 'Detailed reports provide information for further review. Instructors remain responsible for interpreting the results and applying their institution\'s academic-integrity policies.'],
    ],
    ask: { h2: 'Evaluating PlagiarismSearch for your institution?', lead: 'Discuss your Canvas requirements with our team before deployment.', cta: 'Contact Our Team' },
  },

  faq: {
    h2: 'Frequently Asked Questions About Canvas Integration',
    items: [
      ['Does PlagiarismSearch integrate with Canvas LMS?', 'Yes. PlagiarismSearch provides an integration based on LTI 1.3 document processing for supported Canvas assignment workflows. A Canvas administrator must install and configure the app in a compatible Canvas environment.'],
      ['Can PlagiarismSearch check Canvas Text Entry submissions?', 'Yes. The integration supports both Text Entry and File Upload submissions for eligible Canvas assignments.'],
      ['Where can instructors see plagiarism and AI-writing results?', 'After processing, the available results appear in Canvas SpeedGrader. Instructors can review similarity and AI probability indicators, when returned, and use the report links to access more detailed information.'],
      ['Does Canvas have a built-in plagiarism checker?', 'Canvas supports workflows that allow compatible third-party tools to analyze student submissions. The checking capabilities depend on the tool installed and enabled by the institution. PlagiarismSearch provides a separate plagiarism-checking and AI-writing analysis integration.'],
      ['Can students see their PlagiarismSearch reports?', 'Student access depends on the report-visibility settings and permissions configured for the integration. Administrators and instructors should confirm the available access options for their Canvas environment.'],
      ['Is AI writing detection the same as plagiarism detection?', 'No. Plagiarism checking identifies matching or similar content, while AI-writing detection analyzes indicators associated with AI-generated text. Neither result alone establishes plagiarism, authorship, or academic misconduct.'],
      ['Are Canvas submissions automatically stored for future plagiarism checks?', 'Storage behavior depends on the configured settings. Submitting work for analysis and retaining it as a future comparison source are separate actions within the workflow.'],
      ['How do I install PlagiarismSearch in Canvas?', 'A Canvas administrator can follow the PlagiarismSearch Canvas Admin Guide to install the LTI 1.3 app through Dynamic Registration and configure its availability. After installation, instructors can follow the Canvas Teacher Guide to add PlagiarismSearch to eligible assignments.'],
    ],
  },

  close: {
    h2: 'Add PlagiarismSearch to Your Canvas Workflow',
    lead: ['Check student submissions and review detailed similarity and AI-writing results within your institution\'s Canvas process.', 'Follow our setup instructions or contact our team to discuss your institution\'s requirements.'],
    primary: 'View Canvas Setup Guide',
    secondary: 'Contact Our Team',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   THE SCREENSHOTS — the developer's, as supplied. w and h are the files' own pixels.
   alt and caption say what is on the picture and nothing more; a figure named in an alt
   is the one printed on that screenshot.
   ───────────────────────────────────────────────────────────────────────────── */
const IMG = '/assets/img/canvas/';
const SHOTS = {
  file: {
    full: { src: IMG + 'speedgrader-file-upload-tidied.webp', w: 1918, h: 951,
      title: 'Canvas SpeedGrader — File Upload submission',
      alt: 'Canvas SpeedGrader with a File Upload submission open: the submitted document is previewed on the left; in the right sidebar, Submitted Files lists ai-5.docx and the Document processor reports panel shows PlagiarismSearch with AI Probability 66.5% and Similarity Score 100.0%, each with a link to its report.' },
    panel: { src: IMG + 'speedgrader-file-upload-panel-tidied.webp', w: 470, h: 404,
      alt: 'Close-up of the same screenshot: Document processor reports — PlagiarismSearch, file ai-5.docx, AI Probability 66.5% with a View AI Probability Report button, Similarity Score 100.0% with a View Similarity Score Report button.' },
    /* where the crop sits in the full file — 1448,223 470×404 of 1918×951, an exact pixel
       match — as per cent; and the crop's own width, which it is never stretched past */
    spot: 'left-[75.5%] top-[23.45%] w-[24.5%] h-[42.48%]', panelMax: 'max-w-[470px]',
    kind: 'File Upload submission',
    caption: 'The student submitted a document. SpeedGrader lists the file and shows an AI Probability and a Similarity Score indicator for it, each with a link to its detailed report.',
  },
  text: {
    full: { src: IMG + 'speedgrader-text-entry-tidied.webp', w: 1911, h: 943,
      title: 'Canvas SpeedGrader — Text Entry submission',
      alt: 'Canvas SpeedGrader with a Text Entry submission open: the submitted text is shown on the left; in the right sidebar, the Document processor reports panel shows PlagiarismSearch under “Text submitted to Canvas” with AI Probability 50.0% and Similarity Score 100.0%, each with a link to its report.' },
    panel: { src: IMG + 'speedgrader-text-entry-panel-tidied.webp', w: 635, h: 390,
      alt: 'Close-up of the same screenshot: Document processor reports — PlagiarismSearch, Text submitted to Canvas, AI Probability 50.0% with a View AI Probability Report button, Similarity Score 100.0% with a View Similarity Score Report button.' },
    /* 1265,210 635×390 of 1911×943, an exact pixel match */
    spot: 'left-[66.2%] top-[22.27%] w-[33.23%] h-[41.36%]', panelMax: 'max-w-[635px]',
    kind: 'Text Entry submission',
    caption: 'The student typed the text directly in Canvas. SpeedGrader marks it “Text submitted to Canvas” and shows an AI Probability and a Similarity Score indicator for it, each with a link to its detailed report.',
  },
};
/* the brief's sample-data caution, said once by each screenshot */
const DEMO = 'Screenshot of a demo submission. The values shown are specific to this example.';
/* THE TIDIED FILES (Olex, 2026-10-12). The Canvas interface is not touched; three details
   of the demo data are, on copies of the developer's files. The page shows the copies
   (Olex kept them after one review round beside the originals; the originals then left
   the site — they are the developer's PNGs in the brief's package, which stays local):
   · File Upload — the app's name in our report block reads "PlagiarismSearch", as it does
     on the other screenshot (the file had a second test install's name, "PlagiarismSearch2");
     the empty grade field carries a grade, as the other screenshot's does;
   · Text Entry — the two comments ("test" and an emoji) are two plain comments.
   The name is closed up by moving the file's own pixels (the rest of that line shifts
   10px left over the "2"): no type is set, every glyph is the screenshot's. The grade and
   the comments are small patches set in the interface's own face (Lato), placed by
   laying the original words over the original first. Every pixel outside those places is
   the developer's (0.13% and 0.20% of the pixels changed). The submitted
   work, the file name, the PlagiarismSearch indicators, their values and the report links
   are as supplied. The close-ups are cut from the tidied files at the same place.
   The brief asks for the screenshots unmodified, so this needs its owner's yes. */
const TIDIED = 'Screenshot · demo details tidied';
const TIDIED_NOTE = 'Review note: on these two screenshots the app name in the report block, the grade field and the two comments were retouched. The Canvas interface, the submitted work and the PlagiarismSearch results are as supplied.';

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's.
   ───────────────────────────────────────────────────────────────────────────── */
const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const WRAP = 'relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10';
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  plug:     '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
  toggle:   '<rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  review:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>',
  percent:  '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  text:     '<path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>',
  sliders:  '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  eye:      '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  archive:  '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  send:     '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  shield:   '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  admin:    '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  teacher:  '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  workflow: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
};

/* the demo note: the same words by each screenshot, light or dark */
const demoNote = dark => `<span class="mt-3 flex items-start gap-2 text-[12px] sm:text-[12.5px] leading-relaxed ${dark ? 'text-white/55' : 'text-ink-500'}"><span class="mt-0.5 shrink-0">${ico(I.info, 'currentColor', 14)}</span><span>${DEMO}</span></span>`;

/* ═══════════════ 01 · HERO — COMPONENT A ═══════════════ */
/* the hero's media: the integration as one loop (36-canvas-hero.css). Olex, 2026-10-12:
   no screenshot on the first screen — the two real ones are the next act's, and the same
   picture twice is one too many — so the hero says "this is the Canvas integration" with
   the two marks and the lines between them. Every word on it is the page's own copy:
   the two submission types go out, the three things SpeedGrader shows come back, and the
   link between the plates is LTI 1.3. No Canvas screen is drawn and no figure is shown.
   (The brief's Component A put the File Upload screenshot here; that screenshot now
   stands only in the act below.) */
const flowChip = (label, icon, tone) => `<li class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 shadow-diffuse pl-1.5 pr-3.5 xl:pr-4 py-1.5 xl:py-2 text-[12.5px] sm:text-[13px] xl:text-[13.5px] font-semibold text-ink-800 whitespace-nowrap"><span class="inline-flex w-6 h-6 xl:w-7 xl:h-7 rounded-full ${tone === 'teal' ? 'bg-teal-100' : 'bg-orange-100'} items-center justify-center shrink-0">${ico(icon, tone === 'teal' ? '#06748A' : '#B84431', 13)}</span>${label}</li>`;
const tip = (cls, d) => `<svg class="cvh-tip ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const FLOW = {
  label: 'How PlagiarismSearch connects to Canvas',
  link: 'LTI 1.3',
  out: { cap: 'Submissions', chips: [['File Uploads', I.file], ['Text Entry', I.text]] },
  back: { cap: 'Results in SpeedGrader', chips: [['Similarity Score', I.percent], ['AI Probability', I.sparkles], ['Detailed Reports', I.report]] },
};
const heroMedia = () => `<div data-proof="canvas-flow" role="group" aria-label="${FLOW.label}" class="cvh relative w-full max-w-[560px] mx-auto lg:mr-0">
  <div class="cvh-lane relative ml-[17%] mr-[19%] px-2 sm:px-3 pt-5 sm:pt-6 xl:pt-7 pb-6 sm:pb-8 xl:pb-10 text-center">
    <svg class="cvh-line" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><path d="M1 100V22Q1 1 22 1H278Q299 1 299 22V100"/></svg>
    ${tip('right-[-6px] bottom-[-2px]', 'm6 9 6 6 6-6')}
    <p class="relative ${LABEL} text-teal-700 mb-3">${FLOW.out.cap}</p>
    <ul class="relative flex flex-wrap justify-center gap-2">
${FLOW.out.chips.map(([l, i]) => '      ' + flowChip(l, i, 'teal')).join('\n')}
    </ul>
  </div>
  <div class="relative grid grid-cols-[34%_minmax(0,1fr)_38%] items-center">
    <p class="h-[68px] sm:h-[88px] xl:h-[100px] rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse-lg flex items-center justify-center overflow-hidden"><img src="/assets/svg/partners/canvas.svg" alt="Canvas" width="600" height="270" fetchpriority="high" decoding="async" class="w-full h-full object-contain scale-110"></p>
    <p class="flex items-center min-w-0" aria-label="${FLOW.link}">
      <span class="flex-1 border-t-[1.5px] border-dashed border-ink-300" aria-hidden="true"></span>
      <span class="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white ring-1 ring-black/5 shadow-diffuse px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-[12px] font-bold tracking-tight text-ink-800 whitespace-nowrap"><span class="w-1.5 h-1.5 rounded-full bg-teal-400 pulse-dot" aria-hidden="true"></span>${FLOW.link}</span>
      <span class="flex-1 border-t-[1.5px] border-dashed border-ink-300" aria-hidden="true"></span>
    </p>
    <p class="h-[68px] sm:h-[88px] xl:h-[100px] rounded-2xl sm:rounded-3xl bg-white ring-1 ring-teal-500/25 shadow-diffuse-lg flex items-center justify-center px-3 sm:px-5"><img src="/assets/svg/logo.svg" alt="PlagiarismSearch" width="200" height="28" fetchpriority="high" decoding="async" class="w-full max-w-[164px] h-auto"></p>
  </div>
  <div class="cvh-lane cvh-lane-back relative ml-[17%] mr-[19%] px-2 sm:px-3 pt-6 sm:pt-8 xl:pt-10 pb-5 sm:pb-6 xl:pb-7 text-center">
    <svg class="cvh-line" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><path d="M299 0V78Q299 99 278 99H22Q1 99 1 78V0"/></svg>
    ${tip('left-[-6px] top-[-2px]', 'm18 15-6-6-6 6')}
    <ul class="relative flex flex-wrap justify-center gap-2">
${FLOW.back.chips.map(([l, i]) => '      ' + flowChip(l, i, 'orange')).join('\n')}
    </ul>
    <p class="relative ${LABEL} text-orange-700 mt-3">${FLOW.back.cap}</p>
  </div>
</div>`;

const section1 = () => `  <!-- ================= 01 · HERO / CANVAS PRODUCT HERO =================
       Copy and the two actions on the left; on the right the integration drawn as a loop:
       Canvas and PlagiarismSearch joined through LTI 1.3, the two submission types going
       out, the SpeedGrader results coming back (Olex, 2026-10-12: no screenshot up here —
       the real ones are the next act). On a phone the copy and the actions come first.
       The library's hero (build/sections/hero.js), layout "hub"; the three chips are its
       note line. -->
${hero.section({
    id: 'canvas-integration', layout: 'hub',
    eyebrow: COPY.hero.eyebrow,
    title: COPY.hero.h1, pen: 'Canvas', size: 'long',
    lead: COPY.hero.lead,
    actions: { button: { label: COPY.hero.primary, href: ADMIN }, link: { label: COPY.hero.secondary, href: CONTACT } },
    note: COPY.hero.chips.join(' · '),
    media: heroMedia(),
  })}`;

/* ═══════════════ 02 · HOW IT WORKS ═══════════════ */
const section2 = () => `  <!-- ================= 02 · HOW IT WORKS =================
       The library's four-step workflow (build/sections/steps.js): who does what, in
       order. Icons only — no Canvas screen is drawn. -->
${steps.section({
    id: 'how-it-works', layout: 'cards', marker: 'icon', bg: 'white', space: 'md', accent: 'teal',
    head: { title: COPY.how.h2, intro: COPY.how.intro, measure: '860' },
    cols: 4, link: 'line',
    items: COPY.how.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'orange', 'ink', 'mint'][i], icon: [I.plug, I.toggle, I.upload, I.review][i] })),
    foot: { action: { label: COPY.how.link, href: ADMIN, tone: 'light' } },
  })}`;

/* ═══════════════ 03 · SPEEDGRADER EVIDENCE — COMPONENT B ═══════════════ */
/* one tab's panel: the screenshot whole (it opens enlarged), the brief's crop of its report
   panel beside it, and the caption that says which kind of submission this is. On a
   phone: screenshot → close-up → caption. */
/* THE SETTING OF THE TWO SCREENSHOTS (Olex, 2026-10-12: as on the PowerPoint page, but
   the interface shown must not be changed). So nothing of Canvas is redrawn: the two
   files stand at their own proportions (the tidied copies — see THE TIDIED FILES above),
   and what is designed is only what is ours, around them:
   · the screenshot gets the whole width of the section, on a plate with room at its
     sides and a title line that says what it is — large enough that the sidebar reads;
   · the close-up stands under it on a plate of its own, at its own size and never
     stretched past it, beside the caption;
   · one thin outline on the screenshot marks the area the close-up enlarges (s.spot: the
     crop's exact place in the file, in per cent). It is an element beside the image,
     not part of it — the enlarged view shows the screenshot bare. */
const proofPanel = s => `<figure data-proof-panel>
  <div class="rounded-2xl sm:rounded-3xl lg:rounded-4xl bg-white/[.05] ring-1 ring-white/10 p-3 sm:p-5 lg:p-7">
    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-1 pb-3 sm:pb-4 lg:pb-5">
      <span class="${LABEL} text-white/70">Canvas SpeedGrader · ${s.kind}</span>
      <span class="text-[11.5px] sm:text-[12px] font-semibold text-white/45">${TIDIED}</span>
    </div>
    <div class="relative rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/20 bg-white">
${indent(ev.shot({ ...s.full, zoom: true, start: 'end' }), '      ')}
      <span class="absolute ${s.spot} rounded-[5px] sm:rounded-lg ring-2 ring-inset ring-teal-400 pointer-events-none" aria-hidden="true"></span>
    </div>
  </div>
  <div class="grid md:grid-cols-2 gap-5 sm:gap-6 lg:gap-10 items-center mt-4 sm:mt-5 lg:mt-6">
    <div class="rounded-2xl sm:rounded-3xl bg-white/[.05] ring-1 ring-white/10 p-3 sm:p-5 lg:p-6">
      <p class="flex items-center gap-2 px-1 pb-3 ${LABEL} text-teal-300"><span class="inline-block w-3.5 h-3.5 rounded-[4px] ring-2 ring-teal-400" aria-hidden="true"></span>Close-up of the outlined area</p>
      <div class="ev-shot mx-auto ${s.panelMax} rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-white/20 bg-white">
        ${ev.shot(s.panel)}
      </div>
    </div>
    <figcaption class="min-w-0 max-w-[560px]">
      <span class="block ${LABEL} text-teal-300">${s.kind}</span>
      <span class="block mt-2 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/80">${s.caption}</span>
      ${demoNote(true)}
    </figcaption>
  </div>
</figure>`;

const section3 = () => `  <!-- ================= 03 · SPEEDGRADER EVIDENCE / COMPONENT B — INTERACTIVE REPORT PROOF =================
       The page's one dark act. Two tabs and nothing else: "File Upload" shows the first
       developer screenshot, "Text Entry" the second, each with the brief's crop of its
       report panel and a caption that says which kind of submission it is. A tab swaps a
       picture and a caption (build/evidence.js) — it starts no check and changes no
       value; the buttons inside a screenshot are part of the photograph. The three
       reading points and the caution follow, as the brief words them. -->
  <section id="speedgrader-results" data-component="canvas-proof" data-surface="dark" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute orb-dark-teal"></div>
    <div class="orb absolute orb-dark-coral"></div>
    <div class="${WRAP}">
${indent(sh.block({ title: COPY.proof.h2, intro: COPY.proof.intro, measure: '860' }), '      ')}

      <div class="rv">
${indent(ev.tabs({ ns: 'speedgrader', label: 'Submission type shown in the screenshot',
    items: [SHOTS.file, SHOTS.text].map((s, i) => ({ tab: COPY.proof.tabs[i], panel: proofPanel(s) })) }), '        ')}
      </div>
      <p data-prototype-note class="rv mt-4 max-w-[880px] text-[12px] sm:text-[12.5px] leading-relaxed text-teal-300/90">${TIDIED_NOTE}</p>

      <ul class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-10 sm:mt-12 lg:mt-14">
${COPY.proof.points.map(([name, text], i) => `        <li class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white/[.04] ring-1 ring-white/10 p-5 sm:p-6 lg:p-7">
          <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center">${ico([I.percent, I.sparkles, I.report][i], ['#6ED7E8', '#F8A592', '#fff'][i])}</span>
          <h3 class="mt-4 text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight text-white">${name}</h3>
          <p class="mt-2 ${BODY} text-white/70">${text}</p>
        </li>`).join('\n')}
      </ul>

      <p class="rv mt-5 sm:mt-6 flex items-start sm:items-center gap-4 rounded-2xl sm:rounded-3xl bg-teal-400/10 ring-1 ring-teal-300/25 p-5 sm:p-6">
        <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-teal-400/15 items-center justify-center shrink-0">${ico(I.info, '#6ED7E8')}</span>
        <span class="text-[14.5px] sm:text-[15px] leading-relaxed text-white/90"><strong class="font-bold text-white">${COPY.proof.important[0]}</strong> ${COPY.proof.important[1]}</span>
      </p>
    </div>
  </section>`;

/* ═══════════════ 04 · PLAGIARISM VS AI ═══════════════ */
const section4 = () => `  <!-- ================= 04 · PLAGIARISM VS AI =================
       The two-column comparison the Students page carries: one card, two halves of equal
       size, plagiarism on the darker one, and the line that joins them as the card's foot.
       No figure, no "better" column. -->
  <section id="plagiarism-vs-ai" data-component="ai-compare" data-bg="white" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="${WRAP}">
${indent(sh.block({ title: COPY.versus.h2, intro: COPY.versus.intro, measure: '860' }), '      ')}
      <div class="rv rounded-3xl sm:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <div class="rounded-[18px] sm:rounded-3xl bg-white shadow-inner-hl overflow-hidden">
          <div class="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-100">
            <div class="p-5 sm:p-6 lg:p-8 bg-ink-900 text-white">
              <div class="flex items-center gap-3 mb-4">
                <span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white/10 ring-1 ring-white/15 items-center justify-center shrink-0">${ico(I.search, '#fff', 19)}</span>
                <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight">${COPY.versus.plagiarism[0]}</h3>
              </div>
              <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white font-semibold">${COPY.versus.plagiarism[1]}</p>
              <p class="mt-3 ${BODY} text-white/70">${COPY.versus.plagiarism[2]}</p>
            </div>
            <div class="p-5 sm:p-6 lg:p-8">
              <div class="flex items-center gap-3 mb-4">
                ${tile.render({ tone: 'orange', icon: I.sparkles })}
                <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight">${COPY.versus.ai[0]}</h3>
              </div>
              <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-900 font-semibold">${COPY.versus.ai[1]}</p>
              <p class="mt-3 ${BODY} text-ink-600">${COPY.versus.ai[2]}</p>
            </div>
          </div>
          <div class="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5 lg:px-8 bg-orange-50 border-t border-orange-200/60">
            ${tile.render({ tone: 'orange', icon: I.info })}
            <p class="text-[14.5px] sm:text-[15px] lg:text-[16px] leading-relaxed text-ink-900 font-semibold">${COPY.versus.closing}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · SUBMISSION TYPES ═══════════════ */
const section5 = () => `  <!-- ================= 05 · SUBMISSION TYPES =================
       Two cards, one a submission type, and the brief's closing sentence under them. (The
       library has no two-card set — its cards are three or four across, its sheet three
       cells — so the pair is drawn here in the card recipe of the role cards below.) No
       second large screenshot: the Text Entry one is in the act above. No format list. -->
  <section id="submission-types" data-component="submission-types" data-bg="cool" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="${WRAP}">
${indent(sh.block({ title: COPY.types.h2, intro: COPY.types.intro }), '      ')}
      <div class="rv-kids grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
${COPY.types.items.map(([title, text], i) => `        <div class="rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
          ${tile.render({ tone: ['teal', 'orange'][i], icon: [I.file, I.text][i] })}
          <h3 class="mt-4 sm:mt-5 text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight">${title}</h3>
          <p class="mt-2 ${BODY} text-ink-600 max-w-[52ch]">${text}</p>
        </div>`).join('\n')}
      </div>
      <p class="rv mt-5 sm:mt-6 flex items-start gap-3 max-w-[880px] ${BODY} text-ink-700">
        <span class="mt-0.5 shrink-0 text-ink-500">${ico(I.info, 'currentColor', 16)}</span>
        <span>${COPY.types.note}</span>
      </p>
    </div>
  </section>`;

/* ═══════════════ 06 · CONFIGURATION ═══════════════ */
const section6 = () => `  <!-- ================= 06 · CONFIGURATION =================
       A structured overview, not a settings screen: the four areas as one definition list
       (the library's Sources, layout "list"), the brief's caveat as the sheet's last
       line. Nothing here looks like a switch. -->
${sources.section({
    id: 'configuration', layout: 'list', bg: 'white', space: 'md',
    head: { title: COPY.config.h2, intro: COPY.config.intro },
    rows: COPY.config.items.map(([term, desc], i) => ({ term, desc, tone: ['teal', 'ink', 'orange', 'mint'][i], icon: [I.sliders, I.database, I.eye, I.archive][i] })),
    foot: { icon: I.info, text: COPY.config.note },
  })}`;

/* ═══════════════ 07 · SETUP PATHS — COMPONENT C ═══════════════ */
const roleCard = (r, i) => `        <div class="rounded-3xl sm:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="h-full rounded-[18px] sm:rounded-3xl bg-white shadow-inner-hl p-5 sm:p-7 lg:p-8 flex flex-col">
            <div class="flex items-center gap-3.5">
              ${tile.render({ tone: ['teal', 'orange'][i], icon: [I.admin, I.teacher][i] })}
              <h3 class="text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tight">${r.h3}</h3>
            </div>
            <p class="mt-4 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${r.lead}</p>
            <ol class="mt-5 sm:mt-6 divide-y divide-ink-100 border-y border-ink-100">
${r.steps.map((s, n) => `              <li class="flex items-start gap-3.5 py-3.5">
                <span class="shrink-0 w-6 h-6 rounded-full bg-ink-50 ring-1 ring-black/5 flex items-center justify-center text-[11.5px] font-bold text-ink-700 tabular-nums" aria-hidden="true">${n + 1}</span>
                <span class="min-w-0 text-[14px] sm:text-[14.5px] leading-relaxed font-semibold text-ink-900">${s}</span>
              </li>`).join('\n')}
            </ol>
            <div class="mt-auto pt-6 sm:pt-7">
${indent(action.button({ label: r.cta, href: r.href }), '              ')}
            </div>
          </div>
        </div>`;

const section7 = () => `  <!-- ================= 07 · SETUP PATHS / COMPONENT C — ROLE-BASED SETUP PATHS =================
       Two cards of equal prominence — same shell, same type, same button — one a role.
       Each sums up the role's four steps and hands over to its published guide on the
       live site; no installer and no Canvas screen is drawn here (the guides carry the
       installation screenshots). The help line under them leads to Contact. -->
  <section id="setup-paths" data-component="setup-paths" data-bg="aqua" class="relative py-16 sm:py-24 lg:py-28 bg-[#F2FCFC]">
    <div class="${WRAP}">
${indent(sh.block({ title: COPY.setup.h2, intro: COPY.setup.intro, measure: '860' }), '      ')}
      <div class="rv-kids grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
${COPY.setup.roles.map(roleCard).join('\n')}
      </div>
      <p class="rv mt-6 sm:mt-8 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-700"><strong class="font-bold text-ink-900">${COPY.setup.help[0]}</strong> <a href="${CONTACT}" class="font-semibold text-ink-900 underline decoration-ink-300 hover:decoration-ink-500 underline-offset-4 transition-colors duration-300">${COPY.setup.help[1]}</a> ${COPY.setup.help[2]}</p>
    </div>
  </section>`;

/* ═══════════════ 08 · DOCUMENT HANDLING ═══════════════ */
const section8 = () => `  <!-- ================= 08 · DOCUMENT HANDLING =================
       The library's rail (build/sections/steps.js): processing, the report, Storage —
       three stations, each with its approved sentences whole. The institutions' note and
       the Privacy Policy follow. -->
${steps.section({
    id: 'document-handling', layout: 'rail', marker: 'icon', bg: 'white', space: 'md',
    head: { title: COPY.handling.h2, intro: COPY.handling.intro },
    cols: 3,
    items: COPY.handling.steps.map(([title, text], i) => ({ title, text, tone: ['teal', 'orange', 'ink'][i], icon: [I.send, I.report, I.archive][i] })),
    foot: { note: { lines: [COPY.handling.note], action: { label: COPY.handling.link, href: POLICY, tone: 'light' } } },
  })}`;

/* ═══════════════ 09 · INSTITUTIONAL VALUE ═══════════════ */
const section9 = () => `  <!-- ================= 09 · INSTITUTIONAL VALUE =================
       The library's three-benefit cards, and under them the brief's question to an
       evaluating institution as the compact dark banner (build/sections/banner.js) with
       its one action. No outcome percentage, no testimonial. -->
${cards.section({
    id: 'institutional-value', layout: 'grid', bg: 'cool', space: 'md',
    head: { title: COPY.value.h2, intro: COPY.value.intro, measure: '860' },
    cols: 3,
    items: COPY.value.items.map(([title, text], i) => ({ title, text, tone: ['teal', 'ink', 'orange'][i], icon: [I.workflow, I.sliders, I.shield][i] })),
  })}

${banner.section({
    id: 'evaluate-for-your-institution',
    glow: 'teal',
    title: COPY.value.ask.h2,
    lead: COPY.value.ask.lead,
    action: { label: COPY.value.ask.cta, href: CONTACT },
  })}`;

/* ═══════════════ 10 · FAQ ═══════════════ */
const section10 = () => `  <!-- ================= 10 · FAQ =================
       Eight questions, every answer in the HTML (the library's accordion). -->
${faq.section({
  id: 'canvas-faq', ns: 'canvas-faq', bg: 'tint', space: 'md', layout: 'fluid',
  head: { title: COPY.faq.h2 },
  items: COPY.faq.items.map(([q, a]) => ({ q, a })),
})}`;

/* ═══════════════ 11 · FINAL CTA ═══════════════ */
const section11 = () => `  <!-- ================= 11 · FINAL CTA =================
       The closing band (build/sections/cta-band.js): the two actions of the hero again. -->
${cta.section({
  id: 'canvas-cta',
  title: COPY.close.h2, ring: 'Your Canvas',
  lead: COPY.close.lead.join(' '), measure: '62',
  actions: { layout: 'pair', button: { label: COPY.close.primary, href: ADMIN }, secondary: { label: COPY.close.secondary, href: CONTACT } },
})}`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble — the shared page shell (build/page.js). The components' CSS and JS live in
   build/assets/ (site.css, site.js); the page carries none of its own.
   ───────────────────────────────────────────────────────────────────────────── */
const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11];

module.exports = { COPY, SHOTS, DEMO, TIDIED, TIDIED_NOTE, FLOW, ADMIN, TEACHER, CONTACT, POLICY, OUT };
if (require.main !== module) return;

const html = page.render({ title: COPY.title, meta: COPY.meta.replace(/&amp;/g, '&'), canonical: COPY.canonical, sections: sections.map(f => f()) });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items');
