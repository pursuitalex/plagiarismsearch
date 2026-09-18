/* Check site/integration-guide.html against the Moodle Integration brief of 2026-09-15.

   The brief freezes facts more than layout: the compatibility range, Assignment-only
   support, auto vs manual, Sources vs Add to Storage, where credentials come from — and
   a list of legacy claims that must not come back. Those are checked by pattern. The copy
   is checked verbatim. The composition is checked only where the brief makes it testable:
   it is a document, not a landing — no checker, no pricing, no reviews — with a usable
   in-page navigation, facts in text rather than in images, and screenshots that carry no
   credentials.

   Developer-feedback patch of 2026-09-18 (new-tasks/new-page-4/updates/): the hero loses
   its credentials link, the activity wording stops listing what is not supported, and
   manual checking covers online text as well as files — with no button name invented.

   Run: node build/check-moodle.js
*/
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'site');
const FILE = 'integration-guide.html';
const html = fs.readFileSync(path.join(SITE, FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
  .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
/* the brief types straight apostrophes and " - "; the page sets ’ and — */
const norm = s => s.replace(/['’]/g, '’').replace(/\s[—–-]\s/g, ' — ');
const text = norm(flat(body));

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(norm(s));
function block(id) {
  const i = body.indexOf('id="' + id + '"');
  if (i < 0) return '';
  const start = body.lastIndexOf('<section', i);
  return body.slice(start, body.indexOf('</section>', i) + 10);
}

/* ── page-level ─────────────────────────────────────────────────────────────── */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the approved one', h1s.length === 1 && h1s[0] === 'PlagiarismSearch Moodle Integration: Installation & Setup', h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'Moodle Plagiarism Checker Plugin: Setup Guide | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Install and configure the PlagiarismSearch Moodle plugin for Assignments. Set up API access, checking modes, reports, student permissions, and optional AI detection.', desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the existing URL', canon === 'https://plagiarismsearch.com/integration-guide', canon);
  ok('no H4+', !/<h[4-6]\b/.test(body));
  /* headings are headings: no h3 before the first h2 of its section, no styled <p> posing as one */
  const seq = [...body.matchAll(/<h([1-3])\b/g)].map(m => +m[1]);
  ok('heading order never skips a level', seq.every((l, i) => i === 0 || l - seq[i - 1] <= 1), seq.join(''));
}

/* ── the H2s and H3s ────────────────────────────────────────────────────────── */
console.log('\nstructure');
{
  const H2S = [
    ['at-a-glance',                'Moodle Integration at a Glance'],
    ['requirements',               'Before You Install the Moodle Plugin'],
    ['how-it-works',               'How the Moodle Integration Works'],
    ['installation',               'Install the PlagiarismSearch Plugin in Moodle'],
    ['connect-your-account',       'Connect Moodle to Your PlagiarismSearch Account'],
    ['plugin-settings',            'Configure PlagiarismSearch Settings'],
    ['sources-and-storage',        'Choose What to Compare — and What to Store'],
    ['assignment-setup',           'Configure PlagiarismSearch for a Moodle Assignment'],
    ['reports-and-student-access', 'What Happens After a Student Submits Work'],
    ['student-access',             'Control What Students Can See and Do'],
    ['troubleshooting',            'Troubleshooting Moodle Integration'],
    ['moodle-support',             'Need Help with Your Moodle Setup?'],
  ];
  for (const [anchor, h] of H2S) {
    const found = norm(flat((block(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]));
    ok('#' + anchor + ' H2', found === norm(h), found || '(missing)');
  }
  const h3s = [...body.matchAll(/<h3 class="text-\[clamp[^>]*>([\s\S]*?)<\/h3>/g)].map(m => flat(m[1]));
  const H3S = ['Refine the Comparison', 'Optional AI Detection', 'Configure Report Access', 'URL Parsing for Online Text'];
  ok('the four approved H3s', H3S.every(h => h3s.includes(h)), h3s.join(' | '));
  ok('the anchor the brief names exists: #installation', /id="installation"/.test(body));
}

/* ── in-page navigation ─────────────────────────────────────────────────────── */
console.log('\nin-page navigation');
{
  const NAV = ['Requirements', 'Installation', 'Connect your account', 'Plugin settings', 'Assignment setup', 'Reports & student access', 'Troubleshooting', 'FAQ'];
  const rail = (body.match(/<nav class="rail"[\s\S]*?<\/nav>/) || [''])[0];
  const jump = (body.match(/<details class="jump[\s\S]*?<\/details>/) || [''])[0];
  const labels = s => [...s.matchAll(/data-spy="[^"]+">([^<]+)</g)].map(m => m[1].replace('&amp;', '&'));
  ok('desktop rail: "On this page" + the eight approved items, in order', /On this page/.test(rail) && labels(rail).join('|') === NAV.join('|'), labels(rail).join('|'));
  ok('phone jump menu: the same eight, as a <details>', labels(jump).join('|') === NAV.join('|'));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const spies = [...body.matchAll(/data-spy="([^"]+)"/g)].map(m => m[1]);
  ok('every navigation target exists', spies.every(s => ids.has(s)), spies.filter(s => !ids.has(s)).join(', '));
  ok('jump links are full-size tap targets (min-height 44px)', /\.jump-link \{[^}]*min-height:44px/.test(html));
  ok('anchors clear the sticky bars (scroll-margin-top set)', /scroll-margin-top:\s*104px/.test(html) && /scroll-margin-top:\s*132px/.test(html));
}

/* ── the frozen facts ───────────────────────────────────────────────────────── */
console.log('\ntechnical facts');
{
  ok('compatibility line, verbatim — without "only"', has('Current compatibility: Moodle 2.7–5.2 · Moodle Assignment (mod_assign)') && !has('(mod_assign) only'));
  const ranges = [...text.matchAll(/Moodle (\d\.\d+\s?[–-]\s?\d\.\d+)/g)].map(m => m[1]);
  ok('every stated Moodle range is 2.7–5.2', ranges.length >= 3 && ranges.every(r => r === '2.7–5.2'), [...new Set(ranges)].join(' '));
  ok('the range is one constant in the generator', (fs.readFileSync(path.join(__dirname, 'moodle.js'), 'utf8').match(/2\.7–5\.2/g) || []).length === 1);
  ok('no negative activity list: Workshop / Forum / Quiz are not named at all', !/Workshop|Forum|Quiz/.test(text));
  ok('no sentence says Assignment is the only activity', !/Assignments? only|\(mod_assign\)( activity)? only|only (supports|the Assignment)/i.test(text));
  ok('the activity is documented, future-proof, in the three places the patch names', (text.match(/This guide (covers|documents) the current PlagiarismSearch workflow for Moodle Assignment \(mod_assign\)\./g) || []).length === 3);
  ok('auto and manual both cover files and online text', has('Automatic and manual checking can be used for both Moodle Assignment file and online-text submissions. Manual actions remain subject to the configured permissions and checking settings.'));
  ok('no sentence says manual checking is file-only', !/file-based|file-only|for (eligible |supported )?file submissions|eligible files\b|no manual Submit/i.test(text));
  {
    const cells = [...(body.match(/<table class="matrix[\s\S]*?<\/table>/) || [''])[0].matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map(m => m[1]);
    ok('the matrix: four cells, all supported, the manual row subject to permissions', cells.join('|') === 'Supported|Supported|Supported, subject to permissions and settings|Supported, subject to permissions and settings', cells.join('|'));
  }
  ok('no online-text button name or screen is invented', !/Submit online text|online-text (button|screen|UI)/i.test(text) && (body.match(/<img\b/g) || []).length === 5);
  ok('credentials are self-service, never "provided by managers"', has('Your API User and API Key are available there.') && !/manager/i.test(text));
  ok('Sources vs Add to Storage stated as separate controls', has('Sources and Add to Storage are separate controls.') && has('Searching Storage does not by itself mean that the current submission will be added to Storage.'));
  ok('AI is optional and separate', has('Detect AI is a separate setting from plagiarism detection.') && has('AI-generated text is not automatically plagiarism, and the two signals should be interpreted separately.'));
  ok('similarity is not a verdict', has('It should not be treated as an automatic determination that plagiarism or academic misconduct occurred.'));
  ok('API debug carries no callback-encryption explanation', !/callback|encrypt/i.test(text));
  const glance = block('at-a-glance');
  const facts = [...glance.matchAll(/<dt>([^<]+)<\/dt>\s*<dd>([^<]+)<\/dd>/g)].map(m => m[1] + '=' + m[2]);
  const FACTS = ['Moodle versions=2.7–5.2', 'Supported activity=Moodle Assignment (mod_assign)', 'Submission types=File submissions and online text',
    'Automatic checking=Available for file and online-text submissions', 'Manual checking=Available for file and online-text submissions, subject to permissions and settings',
    'Comparison sources=Web, Storage, or Web + Storage', 'AI detection=Optional separate setting', 'Reports=PDF, HTML, or both',
    'API credentials=API User + API Key from your PlagiarismSearch account'];
  ok('nine quick facts, label and value verbatim, as a definition list', facts.join('|') === FACTS.join('|'), facts.filter(f => !FACTS.includes(f)).join(' | '));
}

/* ── the approved baseline, verbatim ────────────────────────────────────────── */
console.log('\napproved copy');
{
  const COPY = [
    'Moodle Integration · Setup Guide',
    'Connect PlagiarismSearch to Moodle Assignments so file and online-text submissions can be sent for plagiarism checking directly from the Moodle workflow.',
    'Administrators can configure automatic checking, Web and Storage comparison sources, report access, student permissions, and optional AI detection from the PlagiarismSearch plugin settings.',
    'Need help with an institutional Moodle deployment? Contact our team.',
    'The PlagiarismSearch plugin works inside the Moodle Assignment workflow and lets administrators control when submissions are checked, which comparison sources are used, what report access is available, and which options students can use.',
    'Before starting the setup, make sure you have administrator access to the Moodle site and access to the API credentials in your PlagiarismSearch account.',
    'Moodle also requires plagiarism prevention to be enabled at the site level before plagiarism plugins can be used. In current Moodle documentation, this setting is available under Site administration → Advanced features → Enable plagiarism plugins.',
    'Required to enable plagiarism prevention, install the plugin, and configure site-wide settings.',
    'Your installation should be within the currently supported Moodle 2.7–5.2 range.',
    'Required to obtain the API User and API Key used by the plugin.',
    'This guide documents the current PlagiarismSearch workflow for Moodle Assignment (mod_assign).',
    'PlagiarismSearch uses Moodle\'s plagiarism-plugin workflow. Once the plugin is installed and connected, site-wide settings can provide the default checking behavior, while supported settings can also be configured for individual Moodle Assignments.',
    'Turn on Moodle\'s plagiarism-plugin feature at the site level.',
    'Download the current plugin and install it through Moodle administration.',
    'Enter the API credentials available in your PlagiarismSearch account.',
    'Choose checking mode, comparison sources, report options, AI detection, and student permissions.',
    'Configure PlagiarismSearch in the Moodle Assignment where submissions should be checked.',
    'When Assignment-level settings are not stored, the plugin falls back to the corresponding site-wide settings. This lets administrators define defaults while still allowing Assignment-specific configuration where permitted.',
    'Use the current plugin package from Moodle Marketplace or the official PlagiarismSearch GitHub repository. Moodle menu wording can vary slightly between versions, but the installation flow remains the same.',
    'In Moodle, go to Site administration → Advanced features and enable plagiarism plugins.',
    'Download the current PlagiarismSearch plugin ZIP from Moodle Marketplace or the official GitHub releases page.',
    'In Moodle, open Site administration → Plugins → Install plugins.',
    'Upload the PlagiarismSearch ZIP package and follow Moodle\'s installation prompts.',
    'After installation, open the PlagiarismSearch plugin settings under Moodle site administration.',
    'Enable PlagiarismSearch and enter the connection details described in the next section.',
    'Save the settings and confirm that Moodle can connect to the PlagiarismSearch API.',
    'Sign in to PlagiarismSearch and open the API section of your account. Your API User and API Key are available there.',
    'In the Moodle PlagiarismSearch settings, enter those values in the corresponding API user and API key fields. The current plugin also contains an API URL field for the service endpoint.',
    'Save the settings after entering your credentials.',
    'Keep your API Key private. Do not place it in screenshots, public documentation, support tickets visible to third parties, or other publicly accessible content.',
    'If PlagiarismSearch cannot validate the connection while the plugin is being enabled, check the API connection values and save the settings again.',
    'PlagiarismSearch separates connection settings from checking, comparison, reporting, and student-access controls. Site-wide values act as defaults for Moodle Assignments unless an Assignment-specific value has been saved.',
    'Turns the PlagiarismSearch plugin on at the site level. The integration must also be enabled for the Assignment where you want to use it.',
    'Defines the PlagiarismSearch API endpoint used by the plugin.',
    'Advanced connection/debugging setting. Leave this at the standard configuration unless PlagiarismSearch support instructs you to change it.',
    'Automatically sends supported Moodle Assignment submissions for checking after the relevant submission event. This applies to Assignment file submissions and online text.',
    'Enables manual checking controls for supported Moodle Assignment file and online-text submissions when the user has the required permission. Student access also depends on the student settings below.',
    'One decides where a submission is compared; the other decides whether the new submission is added to PlagiarismSearch Storage.',
    'Compare the submitted content against both Web sources and the configured PlagiarismSearch Storage.',
    'Compare the submitted content against Web sources without using Storage as a comparison source.',
    'Compare the submitted content against Storage without using Web sources for that check.',
    'Add to Storage controls whether the submitted content is added to Storage for future comparisons.',
    'Likewise, adding a submission to Storage is separate from deciding whether Storage will be searched during the current check.',
    'Applies the plugin\'s character-substitution filter during the search. It is intended to help identify character replacements that can affect text matching.',
    'Excludes detected reference-list content from the similarity calculation when the filter is enabled.',
    'Excludes qualifying in-text citation content from the similarity calculation when the filter is enabled.',
    'Changes how Storage comparisons involving the same user and/or course are filtered. This setting is relevant when Storage is used as a comparison source.',
    'No — do not apply a same-user/course exclusion.',
    'Exclude user plagiarism within the same course — filter matching Storage content associated with the same user in the same course.',
    'Exclude user plagiarism — filter matching Storage content associated with the same user.',
    'Exclude course plagiarism — filter matching Storage content associated with the same course.',
    'When an AI result is available, Moodle can display it separately from the plagiarism/similarity result.',
    'Selects the language used when a supported report language is requested.',
    'Controls whether Moodle provides no report link, a PDF report, an HTML report, or both.',
    'Enables the additional teacher review-report link when the user has the required permission.',
    'Default (English), English, Spanish, Ukrainian, Polish, and Russian.',
    'Current documented activity',
    'This guide covers the current PlagiarismSearch workflow for Moodle Assignment (mod_assign).',
    'Create a new Moodle Assignment or edit an existing one. In the Assignment settings, find the PlagiarismSearch section and enable the integration.',
    'Supported checking and report settings can then use the site-wide defaults or be saved specifically for that Assignment. This allows administrators to establish a standard configuration while still supporting Assignment-level requirements where course configuration is permitted.',
    'If Only administrators can configure course settings is enabled at the site level, Assignment-level PlagiarismSearch configuration is restricted accordingly.',
    'Checking behavior for file and online-text submissions',
    'If Auto check is enabled, PlagiarismSearch listens for supported Moodle Assignment submission events and sends the submitted file or online text for checking.',
    'When Manual check is enabled, eligible file and online-text submissions can also be checked manually, subject to the configured permissions and student-access settings.',
    'While a report is being processed, Moodle can show an In progress status and a Check status link.',
    'After processing is complete, Moodle can display the returned percentage and the report links enabled by your configuration. If AI detection was enabled and an AI result was returned, the AI value is shown separately.',
    'A similarity result identifies matching content that should be reviewed in context.',
    'Student access is configurable. Administrators can determine whether students can see report links, view the returned percentage, manually submit eligible Moodle Assignment submissions, or resubmit them after revision.',
    'Select whether students receive no report link, PDF, HTML, or both supported report formats.',
    'Controls whether students can see the returned percentage in Moodle.',
    'Allows students to manually submit eligible Moodle Assignment submissions when Manual check is enabled.',
    'Allows students to manually resubmit eligible Moodle Assignment submissions after a previous completed check when Manual check is enabled.',
    'Limits the number of permitted student resubmissions when a limit is configured.',
    'Defines the disclosure text shown to students when the plugin is enabled.',
    'Important: student permissions do not override the overall checking mode. Enabling student submission does not create a manual submission action unless Manual check is also enabled.',
    'The plugin also includes an Allow URL parsing in text option.',
    'When URL parsing is enabled, the plugin can use the configured Valid URLs list for parsing to define which URLs are allowed for that workflow.',
    'Keep the allowed URL list limited to services and domains your institution intentionally supports.',
    'This guide covers the standard PlagiarismSearch Moodle installation and configuration workflow.',
    'If you need help with API access, institutional deployment, account configuration, or a Moodle setup that requires additional technical review, contact the PlagiarismSearch team.',
    'Planning an institution-wide plagiarism workflow?', 'Explore PlagiarismSearch for Universities',
    'Need a custom integration instead of the Moodle plugin?', 'Explore the Plagiarism API',
  ];
  const missing = COPY.filter(c => !has(c));
  ok(COPY.length + ' approved strings present verbatim', !missing.length, missing.map(m => '“' + m.slice(0, 46) + '…”').join(' '));

  const SETTINGS = ['Enable PlagiarismSearch', 'API url', 'API user', 'API key', 'API debug', 'Auto check', 'Manual check',
    'Doc vs Web + Storage', 'Doc vs Web', 'Doc vs Storage', 'Only Latin characters', 'Exclude references', 'Exclude in-text citations',
    'Exclude self-plagiarism', 'Report language', 'Report file type', 'Allow teachers review reports', 'Allow students view reports',
    'Allow students view plagiarism percentage', 'Allow students submit papers', 'Allow students re-submit papers', 'The number of re-submits', 'Student disclosure'];
  const dts = [...body.matchAll(/<dt>(?:<span class="ui">)?([^<]+)/g)].map(m => m[1]);
  ok(SETTINGS.length + ' setting names, each a <dt> in a definition table', SETTINGS.every(s => dts.includes(s)), SETTINGS.filter(s => !dts.includes(s)).join(', '));
  ok('settings are grouped, not one flat dump', has('Group 1 — Connection') && has('Group 2 — Checking behavior') && (body.match(/class="deftable"/g) || []).length >= 6);
}

/* ── troubleshooting and FAQ ────────────────────────────────────────────────── */
console.log('\ntroubleshooting / FAQ');
{
  const tr = block('troubleshooting');
  const TROUBLE = [
    ['PlagiarismSearch does not appear in the Assignment', 'Confirm that Moodle plagiarism plugins are enabled, the PlagiarismSearch plugin is installed and enabled, and you are configuring a Moodle Assignment.'],
    ['The plugin cannot be enabled successfully', 'Recheck the API URL, API User, and API Key. The plugin validates the API connection when it is enabled.'],
    ['Manual Submit or Resubmit is unavailable', 'Confirm Manual check is enabled, verify the user\'s permissions/capabilities, and review the applicable student submit/resubmit settings for the Assignment.'],
    ['A student cannot see the result', 'Check Allow students view reports and Allow students view plagiarism percentage.'],
    ['The result is still processing', 'Use Check status while the report remains In progress.'],
    ['Storage behavior is not what you expected', 'Check both Sources and Add to Storage. They control different behaviors.'],
  ];
  const t = norm(flat(tr));
  ok('six problems with their recommended checks (the two manual items merged)', TROUBLE.every(([p, c]) => t.includes(norm(p)) && t.includes(norm(c))) && (tr.match(/<dt>/g) || []).length === 6);

  const faq = block('faq');
  const QA = [
    ['Does PlagiarismSearch work with Moodle?', 'Yes. PlagiarismSearch provides a Moodle plagiarism plugin for the Moodle Assignment workflow. The current confirmed compatibility range is Moodle 2.7–5.2.'],
    ['Which Moodle activity does this guide cover?', 'This guide covers the current PlagiarismSearch workflow for Moodle Assignment (mod_assign).'],
    ['Can PlagiarismSearch check both files and online text in Moodle?', 'Yes. In Moodle Assignments, both file and online-text submissions can be checked. Automatic checking and manual checking are supported; manual actions depend on the configured permissions and plugin settings.'],
    ['Where do I get the API User and API Key for Moodle?', 'Sign in to your PlagiarismSearch account and open the API section. The API User and API Key used by the Moodle plugin are available there.'],
    ['Can Moodle submissions be checked automatically?', 'Yes. Enable Auto check in the PlagiarismSearch settings. For supported Moodle Assignment submissions, the plugin can automatically send new file and online-text submissions for checking.'],
    ['Can I compare Moodle submissions with our own stored documents?', 'Yes. The Sources setting can use Web, Storage, or Web + Storage. Searching Storage is separate from Add to Storage, which controls whether a new submission is added to Storage for future comparisons.'],
    ['Does the Moodle plugin include AI detection?', 'The plugin has a separate Detect AI option. When it is enabled, an AI-related result can be requested and displayed separately from the plagiarism/similarity result. AI detection and plagiarism detection are not the same analysis.'],
    ['Which report formats are available in Moodle?', 'The current plugin can provide PDF reports, HTML reports, both formats, or no report link, depending on the selected settings. A separate teacher review link can also be enabled.'],
    ['Can students see their plagiarism report?', 'Yes, if the administrator allows it. Student report access and percentage visibility are separate settings, so institutions can control what students can see.'],
    ['Can students resubmit a paper after checking it?', 'Yes, for eligible Moodle Assignment submissions when Manual check and student resubmission are enabled. Administrators can also configure a resubmission limit.'],
    ['Are all Moodle submissions automatically stored?', 'No. Storage behavior is configurable. Add to Storage controls whether a submitted document is added to Storage, while Sources controls whether Storage is searched during a check.'],
  ];
  const f = flat(faq);
  const bad = QA.filter(([q, a]) => !f.includes(q) || !f.includes(a)).map(([q]) => q.slice(0, 28));
  ok('eleven FAQ items, questions and answers verbatim, answers in the HTML', (faq.match(/class="faq-item/g) || []).length === 11 && !bad.length, bad.join(' · '));
  ok('FAQ buttons are keyboard-reachable and expose their state', (faq.match(/<button type="button" aria-expanded="(true|false)" aria-controls="faq-a-\d+"/g) || []).length === 11);
  ok('the credentials answer links to the account API area', /Where do I get the API User[\s\S]*?href="account\.html"[^>]*>Open API Credentials/.test(faq));
}

/* ── links and CTAs ─────────────────────────────────────────────────────────── */
console.log('\nbindings');
{
  const MARKET = 'https://marketplace.moodle.com/plugins/plagiarism_plagiarismsearch';
  const GH = 'https://github.com/plagiarismsearch/moodle-plagiarism_plagiarismsearch/releases';
  const hero = block('moodle-integration');
  ok('primary CTA: Download Moodle Plugin → Moodle Marketplace', new RegExp('href="' + MARKET.replace(/[.\/]/g, '\\$&') + '"[^>]*>\\s*Download Moodle Plugin').test(hero));
  ok('secondary CTA: Start Setup → #installation', /href="#installation"[^>]*>\s*Start Setup/.test(hero));
  ok('the hero has no Open API Credentials link — two setup actions and the contact line only', !/Open API Credentials/.test(hero) && !/href="account\.html"/.test(hero) && (hero.match(/class="btn-press/g) || []).length === 2);
  ok('support microcopy → contact-us', /href="contact-us\.html"[^>]*>Contact our team\./.test(hero));
  ok('"Open My API Credentials" in the connect section', /href="account\.html"[^>]*>\s*Open My API Credentials/.test(block('connect-your-account')));
  ok('installation links: Marketplace and GitHub Releases', block('installation').includes(MARKET) && block('installation').includes(GH));
  ok('Contact Support → contact-us', /href="contact-us\.html"[^>]*>\s*Contact Support/.test(block('moodle-support')));
  const rel = block('related');
  ok('handoff: University, API, Marketplace, GitHub', /href="university-plagiarism-checker\.html"/.test(rel) && /href="api\.html"/.test(rel) && rel.includes(MARKET) && rel.includes(GH));
  const external = [...new Set([...body.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]))];
  ok('the only external destinations are the two official ones', external.every(u => u === MARKET || u === GH), external.join(' '));
  ok('every external link is marked as leaving the site', [...body.matchAll(/<a href="https?:[^>]*>[\s\S]*?<\/a>/g)].every(m => /M15 3h6v6/.test(m[0])));
  const local = [...new Set([...body.matchAll(/href="([a-z0-9-]+\.html)(#[^"]*)?"/g)].map(m => m[1]))];
  ok('every local page link exists', local.every(f => fs.existsSync(path.join(SITE, f))), local.filter(f => !fs.existsSync(path.join(SITE, f))).join(', '));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set([...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));
}

/* ── screenshots ────────────────────────────────────────────────────────────── */
console.log('\nvisual evidence');
{
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  ok('five images, all from assets/img/moodle/', imgs.length === 5 && imgs.every(i => /src="assets\/img\/moodle\//.test(i)));
  ok('every image file exists, has dimensions, alt text and lazy loading', imgs.every(i => {
    const src = (i.match(/src="([^"]+)"/) || [])[1];
    return fs.existsSync(path.join(SITE, src)) && /width="\d+" height="\d+"/.test(i) && /alt="[^"]{40,}"/.test(i) && /loading="lazy"/.test(i);
  }));
  ok('every screenshot has a caption beside it', (body.match(/<figure class="shot"[\s\S]*?<figcaption>/g) || []).length === 5);
  ok('captions are neutral ("Example …" / locator), never "current interface"', !/current (Moodle )?interface/i.test(text) && (text.match(/Example (PlagiarismSearch settings|Moodle Assignment result view)/g) || []).length === 4);
  ok('the result screenshot is framed as a file-submission example', /Example Moodle Assignment result view for a file submission/.test(text) && /It does not show the online-text workflow\./.test(text) && /alt="A Moodle Assignment grading row for a file submission/.test(body));
  ok('the masking is said out loud', /Credential values are masked/.test(text));
  ok('the raw reference captures are not in the public folder', !fs.readdirSync(path.join(SITE, 'assets', 'img', 'moodle')).some(f => /^image\d|raw|full/i.test(f)));
  ok('no credential value in the page (the reference key and user)', !/bbeabed|plaguser/i.test(html));
  ok('the schematic says it is a schematic', /Schematic of the workflow — not a Moodle screen\./.test(text));
  const FLOW = ['Moodle Assignment', 'File / online-text submission', 'PlagiarismSearch check', 'Similarity / optional AI result', 'Report links and permitted student/teacher actions'];
  const nodes = [...(body.match(/<figure class="flow"[\s\S]*?<\/figure>/) || [''])[0].matchAll(/<li[^>]*><span>([^<]+)<\/span>/g)].map(m => m[1]);
  ok('the schematic has the five allowed nodes, in order', nodes.join('|') === FLOW.join('|'), nodes.join('|'));
}

/* ── it is a document, not a landing ────────────────────────────────────────── */
console.log('\nnot a landing');
{
  ok('no checker: no form, textarea or upload', !/<form\b|<textarea\b|type="file"/.test(body));
  ok('no pricing', !/\$\d|prices\.html|per month|pricing/i.test(body));
  ok('no reviews or ratings', !/testimonial|review carousel|★|stars?\b|rating/i.test(text.replace(/teacher review|review-report|review reports|reviewed in context|technical review/gi, '')));
  ok('no Google Docs / add-on content', !/google docs|add-on|addon/i.test(text));
  ok('at most one dark block — the support handoff', (body.match(/bg-ink-950/g) || []).length === 1);
}

/* ── legacy claims that must not come back ──────────────────────────────────── */
console.log('\nforbidden claims');
{
  const BAN = [
    [/150\+? languages|\d+\+ languages/i, 'language count'], [/1\s?[–-]\s?5 minutes|short timeframe|within minutes|\binstant/i, 'timing'],
    [/every plagiarized sentence/i, 'every plagiarized sentence'], [/never stored|files are never|(files|documents|submissions) are not stored/i, 'never-store absolute'],
    [/free (month|trial)|100 free|free submissions/i, 'free offer'], [/leading plagiarism|advanced online plagiarism/i, 'legacy promo'],
    [/proof of plagiarism|proves plagiarism/i, 'percentage = proof'], [/self-plagiarism (was|is) (found|detected)/i, 'self-plagiarism verdict'],
    [/\.docx?\b.*\.pdf\b.*\.txt\b/i, 'file-extension list'], [/canvas|blackboard|brightspace/i, 'other LMS'],
  ];
  const hit = BAN.filter(([re]) => re.test(text)).map(([, l]) => l);
  ok(BAN.length + ' forbidden patterns absent', !hit.length, hit.join(' · '));
}

console.log('\nhygiene');
{
  ok('the header carries the dot field under its orbs', /id="heroDots"/.test(block('moodle-integration')));
  ok('header and footer were injected by build/shell.js', /<header[^>]*>\s*\S/.test(html) && /<footer[^>]*>\s*\S/.test(html));
  ok('reduced motion is respected', /prefers-reduced-motion/.test(html));
}

console.log('\ngates — open items, not defects');
console.log('  G1    Marketplace + GitHub URLs were found by search on 2026-09-17, not supplied by the brief — confirm they are the official ones.');
console.log('  G2    The GitHub README still says Moodle 2.7–4.5 and the Marketplace text still claims workshops/forums, a free trial and manager-issued keys: the brief\'s P1 sync task (§16).');
console.log('  G3    /account/api has no page in the prototype; the three credential links go to account.html.');
console.log('  G4    Page-local labels that are ours, not the brief\'s: "Control 1 / Control 2" on the Sources pair, the matrix row labels, the two URL-parsing level tags, the FAQ H2.');
console.log('  G6    Patch 2026-09-18: the resubmission FAQ answer was reworded by us ("eligible Moodle Assignment submissions") — the patch asked for it without supplying text. Same for the student-access intro ("eligible files" → "eligible Moodle Assignment submissions").');
console.log('  G5    New page-local patterns (rail + jump menu, definition table, evidence figure) — not in the component library until approved.');

console.log(failed ? '\n' + failed + ' check(s) FAILED' : '\nall checks passed');
process.exit(failed ? 1 : 0);
