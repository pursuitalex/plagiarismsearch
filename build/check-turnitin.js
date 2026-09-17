/* Check site/turnitin-checker-alternative.html against the Turnitin Alternative brief of
   2026-09-15.

   The brief is a trademark and comparative-advertising contract before it is a design
   one, so this file is mostly about what the page may and may not say: the copy
   verbatim, every Turnitin fact tied to one of the five official guides, the
   independence disclosure at the top and the full notice at the end, the comparison as
   a real table — and a long list of phrases that must never come back.

   Run: node build/check-turnitin.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'turnitin-checker-alternative.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
  .replace(/&#39;/g, '\'').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
/* the brief writes its dashes as " - "; the site sets them as " — ". Same sentence. */
const norm = s => s.replace(/\s[—–-]\s/g, ' — ');
const text = norm(flat(body));

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(norm(s));
function section(id) {
  const i = body.indexOf('id="' + id + '"');
  if (i < 0) return '';
  return body.slice(body.lastIndexOf('<section', i), body.indexOf('</section>', i) + 10);
}

const OFFICIAL = [
  'https://guides.turnitin.com/hc/en-us/articles/37985974637453-How-to-purchase-a-Turnitin-subscription',
  'https://guides.turnitin.com/hc/en-us/articles/34400565079053-Turnitin-and-plagiarism',
  'https://guides.turnitin.com/hc/en-us/articles/28310712438029-Accessing-the-Similarity-Report-and-similarity-score-via-Turnitin-Website',
  'https://guides.turnitin.com/hc/en-us/articles/21745851240589-Customizing-account-settings-for-Similarity-and-SimCheck',
  'https://guides.turnitin.com/hc/en-us/articles/22774058814093-Using-the-AI-Writing-Report',
];

/* ── page-level ─────────────────────────────────────────────────────────────── */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the approved one', h1s.length === 1 && h1s[0] === 'An Independent Alternative to Turnitin® for Plagiarism Checking', h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'Turnitin Checker Alternative | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Compare PlagiarismSearch with Turnitin® using verified facts about access, reports, sources and pricing. Run an independent self-service plagiarism check.', desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the existing URL', canon === 'https://plagiarismsearch.com/turnitin-checker-alternative', canon);
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

/* ── the information jobs, as sections with their H2s ───────────────────────── */
console.log('\ninformation jobs');
{
  const H2S = [
    ['comparison',               'PlagiarismSearch vs Turnitin®: what is actually different?'],
    ['not-the-same-score',       'Your PlagiarismSearch result will not be the same as a Turnitin® score'],
    ['which-option-fits',        'Which option fits your workflow?'],
    ['report',                   'Review the evidence behind each match'],
    ['sources-and-settings',     'Know what PlagiarismSearch checks against'],
    ['ai-writing',               'AI writing analysis is separate from plagiarism checking'],
    ['your-document',            'Know what happens to your document in PlagiarismSearch'],
    ['pricing',                  'Choose a PlagiarismSearch plan directly'],
    ['independent-cta',          'Run an independent plagiarism check'],
  ];
  for (const [anchor, h] of H2S) {
    const found = flat((section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + anchor + ' H2', found === h, found || '(missing)');
  }
  const order = H2S.map(([a]) => body.indexOf('id="' + a + '"'));
  ok('the acts run in the brief\'s order', order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])));
  ok('the comparison is the second section — evidence high on the page',
     body.indexOf('id="comparison"') === body.indexOf('<section', body.indexOf('<section') + 1) + '<section '.length);
  const EYEBROWS = ['Independent plagiarism checking', 'What You Get with PlagiarismSearch', 'Scan Sources & Settings', 'Self-Service Pricing'];
  ok('the four approved eyebrows present', EYEBROWS.every(e => text.toLowerCase().includes(e.toLowerCase())),
     EYEBROWS.filter(e => !text.toLowerCase().includes(e.toLowerCase())).join(' · '));
}

/* ── the approved baseline, verbatim ────────────────────────────────────────── */
console.log('\napproved copy');
{
  const COPY = [
    'Looking for a plagiarism check you can run directly? PlagiarismSearch lets individuals upload or paste their own content, review matching passages and sources, and use self-service plagiarism checking without an institutional PlagiarismSearch setup.',
    'PlagiarismSearch is an independent service. It is not affiliated with or endorsed by Turnitin, LLC and does not generate Turnitin Similarity Reports.',
    'Independent service - not affiliated with Turnitin, LLC.',
    '150 words free - no registration required.',
    'Turnitin offers several products and institution-specific configurations. This comparison focuses on PlagiarismSearch self-service plagiarism checking and documented aspects of Turnitin Similarity / Feedback Studio that can be compared using current official information.',
    'Turnitin information on this page was last reviewed on September 15, 2026 against current official Turnitin documentation covering subscription access, Similarity Reports, source repositories and AI Writing Reports. Turnitin product availability and settings can vary by license, institution and configuration.',
    'Different plagiarism-checking systems use different source collections, repositories, matching methods and settings. Because of those differences, a similarity percentage from PlagiarismSearch should not be treated as a prediction of the score that Turnitin may return.',
    'PlagiarismSearch does not access Turnitin proprietary databases or its repository of submitted papers. Use the PlagiarismSearch report to review the matches and sources it finds - not to predict an official institutional result.',
    'You need to run your own plagiarism checks without relying on an institution to provide your PlagiarismSearch account.',
    'You want to review the matches and sources found by PlagiarismSearch before you submit your final version.',
    'You want to choose from current PlagiarismSearch plan options directly.',
    'You want to configure the source collections and exclusions available for your PlagiarismSearch check.',
    'Your school or organization already uses Turnitin® as part of its official workflow.',
    'You need the official Turnitin Similarity Report required by your institution.',
    'Your workflow depends on Turnitin® institutional repositories, assignment settings or integrations.',
    'The two products should not be treated as interchangeable. The better fit depends on whether you need an independent self-service check or an institution-managed Turnitin® workflow.',
    'The PlagiarismSearch report highlights matching or similar passages and connects them with the sources found during the check. Select a match to review the relevant source and inspect the result in context.',
    'See the text where a match or similarity was found.',
    'Review the sources associated with reported matches.',
    'Select a match to focus on the corresponding source and examine its context.',
    'A similarity percentage is not a plagiarism verdict.',
    'The results you see depend on the source collections and exclusions used for your PlagiarismSearch check.',
    'Search available web sources for matching or similar text.',
    'Include academic database search when you want to compare text with indexed academic material. PlagiarismSearch provides access to over 500 million indexed academic texts when this search source is enabled.',
    'Personal or organization storage can also be used as comparison sources where available for the account.',
    'References and in-text citations can be excluded when appropriate for the purpose of the check.',
    'These are PlagiarismSearch source collections. They are not Turnitin® databases.',
    'PlagiarismSearch can run AI writing analysis as a separate check when that capability and AI-word balance are available. An AI-writing result does not mean that plagiarism occurred and does not prove authorship.',
    'Turnitin® also presents AI writing detection separately from its similarity result. Turnitin states that its AI model may misidentify text and should not be used as the sole basis for adverse action against a student.',
    'Your uploaded document is processed to perform the checks you select. The uploaded source document is not retained as a stored source document.',
    'A generated report may remain available in your account for convenience, and you can permanently delete reports.',
    'Adding content to Storage is a separate action you control. Running a plagiarism check does not automatically add the document to Storage.',
    'PlagiarismSearch offers public self-service plan options for users who need more than the free check. Current prices, quotas, billing periods and plan entitlements should always come from the live pricing system.',
    '150 plagiarism words can be checked without registration. Registered users receive 300 plagiarism words per day.',
    'Review the matches and sources PlagiarismSearch finds before you submit your work. Your result is a PlagiarismSearch report - not a Turnitin Similarity Report or a prediction of an official Turnitin score.',
    'Turnitin® is a registered trademark of Turnitin, LLC. PlagiarismSearch is an independent service and is not affiliated with, endorsed by, sponsored by, or otherwise connected with Turnitin, LLC. References to Turnitin® on this page are used for comparative and consumer-information purposes. PlagiarismSearch does not provide access to Turnitin software or proprietary databases and does not generate Turnitin Similarity Reports.',
  ];
  const missing = COPY.filter(c => !has(c));
  ok(COPY.length + ' approved strings present verbatim', !missing.length, missing.map(m => '“' + m.slice(0, 48) + '…”').join(' '));
}

/* ── the comparison: a table, six sourced rows ──────────────────────────────── */
console.log('\ncomparison');
{
  const cmp = section('comparison');
  const table = (cmp.match(/<table[\s\S]*?<\/table>/) || [''])[0];
  ok('exactly one <table> on the page, and it is here', (body.match(/<table\b/g) || []).length === 1 && !!table);
  ok('it has a caption', /<caption/.test(table));
  const cols = [...table.matchAll(/<th scope="col"[^>]*>([\s\S]*?)<\/th>/g)].map(m => flat(m[1]));
  ok('three column headers: Topic, Turnitin®…, PlagiarismSearch', cols.join('|') === 'Topic|Turnitin® Similarity / Feedback Studio|PlagiarismSearch', cols.join('|'));
  const rows = [...table.matchAll(/<th scope="row"[^>]*>([\s\S]*?)<\/th>/g)].map(m => flat(m[1]));
  const TOPICS = ['Direct individual purchase', 'How access works', 'What the report means', 'Source collections', 'Pricing path', 'Official Turnitin report'];
  ok('six rows, the approved topics, in order', rows.join('|') === TOPICS.join('|'), rows.join('|'));
  ok('no unapproved row (accuracy, speed, support, ease, privacy)', !/accura|turnaround|speed|support quality|ease of use|privacy|hidden cost/i.test(flat(table)));
  const CELLS = [
    'Turnitin states that subscriptions to these products are designed for educational institutions and are not sold directly to individuals.',
    'Individuals can use PlagiarismSearch directly through its self-service checker and public plan options.',
    'Access commonly depends on an institution\'s Turnitin product, license and workflow. Student access to a Similarity Report can also depend on instructor or institutional settings.',
    'A user can start their own check directly in PlagiarismSearch and review the generated report through their account workflow.',
    'Turnitin\'s Similarity Report highlights text that matches selected search sources. Turnitin states that a similarity score is not itself a determination of plagiarism.',
    'PlagiarismSearch highlights matching or similar passages and their sources. The result is evidence for the user to review, not an automatic plagiarism determination.',
    'Depending on the product and settings, Turnitin documents source collections including internet content, publications and repositories of submitted works.',
    'PlagiarismSearch can search web sources, an academic database with 500M+ indexed academic texts when enabled, and available personal or organization storage sources.',
    'Institutional customers request pricing based on their organization\'s requirements; these subscriptions are not sold directly to individuals.',
    'Public self-service plan options are available directly from PlagiarismSearch.',
    'Turnitin generates its own Similarity Reports using its products, databases and configured search targets.',
    'PlagiarismSearch generates a PlagiarismSearch report. It does not connect to Turnitin software or generate an official Turnitin Similarity Report.',
  ];
  const t = flat(table);
  const lost = CELLS.filter(c => !t.includes(c));
  ok('all twelve cells verbatim, as text in the table', !lost.length, lost.map(m => '“' + m.slice(0, 40) + '…”').join(' '));
  ok('every Turnitin cell cites an official source', (table.match(/href="#source-\d"/g) || []).length === 6);
  ok('each data cell names its product for the stacked phone layout', (table.match(/data-label="Turnitin® Similarity \/ Feedback Studio"/g) || []).length === 6 && (table.match(/data-label="PlagiarismSearch"/g) || []).length === 6);
  ok('no winner marks in the table (ticks, crosses, colour-coded cells)', !/<svg/.test(table) && !/bg-(mint|teal|orange|red|green)/.test(table));
  ok('"Last verified: September 15, 2026" is visible in the comparison', /Last verified: September 15, 2026/.test(flat(cmp)));
}

/* ── evidence: the five official guides, and nothing else ───────────────────── */
console.log('\nsources');
{
  const external = [...new Set([...body.matchAll(/href="(https?:\/\/[^"]+)"/g)].map(m => m[1]))];
  ok('the five official Turnitin guides are linked', OFFICIAL.every(u => external.includes(u)), OFFICIAL.filter(u => !external.includes(u)).join(' '));
  ok('no other external link in the page body', external.every(u => OFFICIAL.includes(u)), external.filter(u => !OFFICIAL.includes(u)).join(' '));
  ok('the source list sits inside the comparison act', OFFICIAL.every(u => section('comparison').includes(u)));
  ok('source references resolve (#source-1…5)', [1, 2, 3, 4, 5].every(n => body.includes('id="source-' + n + '"')));
  ok('the Turnitin AI caveat cites the AI Writing Report guide', /href="#source-5"/.test(section('ai-writing')));
  ok('no link to plagiarismcheck.org', !/plagiarismcheck/i.test(html));
  const faq = section('turnitin-alternative-faq');
  const buy = faq.slice(faq.indexOf('Can individuals buy'), faq.indexOf('Do I need an institutional account'));
  ok('the individual-purchase answer is followed by the official purchase guide', buy.includes(OFFICIAL[0]));
}

/* ── independence, trademark, trade dress ───────────────────────────────────── */
console.log('\ntrademark / deconfusion');
{
  const hero = section('independent-checker');
  ok('the hero is the first section and carries the shared form', body.indexOf('id="independent-checker"') < body.indexOf('id="comparison"') && /<textarea id="checkText"/.test(hero));
  ok('exactly one form on the page', (body.match(/<form\b/g) || []).length === 1);
  ok('plagiarism is the checked control; AI is not', /id="optPlag" checked/.test(hero) && !/id="optAI" checked/.test(hero));
  ok('the short disclosure is in the hero, by the checker', flat(hero).includes('Independent service — not affiliated with Turnitin, LLC.'));
  ok('the independence sentence is in the hero too', flat(hero).includes('It is not affiliated with or endorsed by Turnitin, LLC'));
  ok('on a phone the order is H1 → form → independence card', hero.indexOf('<h1') < hero.indexOf('<textarea') && hero.indexOf('<textarea') < hero.indexOf('It is not affiliated with or endorsed'));
  ok('the full trademark notice is the last section of the page body', body.lastIndexOf('<section') === body.lastIndexOf('<section', body.indexOf('id="trademark-notice"')));
  /* the only <img> allowed are the service marks inside the form's input chips */
  ok('no imagery beyond the form\'s own service marks', !/<img\b(?![^>]*partners\/)/.test(body));
  ok('no Turnitin logo, screenshot or asset', !/(src|href)="[^"]*turnitin[^"]*\.(svg|png|jpe?g|webp)/i.test(html));
  ok('the non-equivalence act says "not … a prediction"', /should not be treated as a prediction of the score that Turnitin may return/.test(flat(section('not-the-same-score'))));
  ok('both lanes of the diagram are drawn alike (no winner)', (section('not-the-same-score').match(/bg-white\/\[\.04\] ring-1 ring-white\/10/g) || []).length === 2);
  const fit = section('which-option-fits');
  ok('"Which option fits": 4 reasons for PlagiarismSearch, 3 for Turnitin®, same shell', (fit.match(/<li class="flex items-start gap-3\.5 py-4">/g) || []).length === 7 && (fit.match(/<h3\b/g) || []).length === 2);
  ok('no ticks or crosses in the fit act', !/<svg/.test(fit));
}

/* ── claims that must not come back ─────────────────────────────────────────── */
console.log('\nforbidden claims');
{
  const BAN = [
    [/works just like/i, 'works just like'], [/Turnitin[- ]like/i, 'Turnitin-like'], [/Turnitin[- ]level/i, 'Turnitin-level'],
    [/98\.5|on par with/i, 'accuracy equivalence'], [/\.edu\b/i, '.edu framing'], [/better alternative|better than|superior/i, 'superiority'],
    [/same as Turnitin|equivalent/i, 'equivalence'], [/check your paper like/i, 'check like Turnitin'],
    [/billions/i, 'billions of sources'], [/\binstant|in seconds|in minutes|\bfast(er|est)?\b/i, 'speed promise'],
    [/built into every scan/i, 'AI in every scan'], [/GPT|ChatGPT|Gemini|Claude\b/, 'named LLMs'], [/human-written/i, 'human-written or not'],
    [/never leave|we do not store|never stored/i, 'storage absolute'], [/suggested fix|automatic(ally)? (fix|correct)/i, 'auto-fix'],
    [/hidden (score|cost)|blocked details/i, 'competitor insinuation'], [/pay-as-you-go/i, 'pay-as-you-go'], [/cheaper|lower price|save \d/i, 'price superiority'],
    [/\bHR\b|human resources/i, 'HR audience'], [/youtube|<iframe/i, 'video walkthrough'], [/official partner|partnership/i, 'partnership'],
    [/accura(te|cy)/i, 'accuracy claim'],
  ];
  const hit = BAN.filter(([re]) => re.test(text)).map(([, l]) => l);
  ok(BAN.length + ' forbidden patterns absent from the page body', !hit.length, hit.join(' · '));
  ok('never names PlagiarismSearch a "Turnitin checker" outside the approved FAQ question',
     (text.match(/Turnitin®? checker/gi) || []).length === 1 && has('Is PlagiarismSearch a third-party Turnitin® checker?'));
  ok('no Turnitin price anywhere', !/Turnitin[^.]{0,80}\$\d/.test(text));
}

/* ── report, sources, AI, data, pricing ─────────────────────────────────────── */
console.log('\nproduct acts');
{
  const rep = section('report');
  ok('the shared report is rendered (build/report.js), once', (body.match(/id="cabDoc"/g) || []).length === 1 && /cab-mark/.test(rep) && /cab-src/.test(rep));
  ok('the report uses no Turnitin vocabulary as UI', !/Similarity Report|Turnitin/i.test(flat(rep)));
  ok('the page has one dark act only — the non-equivalence one', (body.match(/<section[^>]*bg-ink-950/g) || []).length === 1 && /bg-ink-950/.test(section('not-the-same-score').slice(0, 200)));
  ok('four source items as a definition list', (section('sources-and-settings').match(/<dt\b/g) || []).length === 4);
  ok('AI act links to the AI owner once', (section('ai-writing').match(/href="ai-detector\.html"/g) || []).length === 1);
  ok('data handling links to the privacy policy', /href="policy\.html"/.test(section('your-document')) && (section('your-document').match(/<li class="relative">/g) || []).length === 3);
  ok('data handling says nothing about Turnitin', !/Turnitin/.test(flat(section('your-document'))));
  const pr = section('pricing');
  ok('pricing preview: three plan cards, a period switcher, "View all pricing" → prices.html', (pr.match(/data-tier="/g) || []).length === 3 && /id="periodTabs"/.test(pr) && /href="prices\.html"[^>]*>\s*View all pricing/.test(pr));
  ok('no price is frozen into the pricing markup (values are written by the widget script)', !/\$\d/.test(flat(pr)));
  ok('no static billing helper ("cancel anytime") on the page', !/cancel anytime/i.test(text));
}

/* ── FAQ and the closing band ───────────────────────────────────────────────── */
console.log('\nFAQ / CTA');
{
  const faq = section('turnitin-alternative-faq');
  const QA = [
    ['Is PlagiarismSearch affiliated with Turnitin®?', 'No. PlagiarismSearch is an independent plagiarism-checking service. It is not affiliated with, endorsed by, sponsored by, or otherwise connected with Turnitin, LLC.'],
    ['Is PlagiarismSearch a third-party Turnitin® checker?', 'No. PlagiarismSearch does not connect to Turnitin software, access Turnitin proprietary databases, or generate Turnitin Similarity Reports. It is a separate plagiarism-checking service that can be used as an independent alternative.'],
    ['Will PlagiarismSearch give me the same similarity score as Turnitin®?', 'Not necessarily. Different services can use different source collections, repositories, matching methods and settings, so similarity results may differ. A PlagiarismSearch result should not be treated as a prediction of an official Turnitin score.'],
    ['Can individuals buy Turnitin® Similarity directly?', 'Turnitin currently states that Turnitin Feedback Studio and Similarity subscriptions are not sold directly to individuals. Access may be provided through an institution; Turnitin points individuals with personal similarity-checking needs toward iThenticate.'],
    ['Do I need an institutional account to use PlagiarismSearch?', 'No. PlagiarismSearch is available through its own self-service workflow and does not require your school or university to provide access.'],
    ['Is a similarity percentage proof of plagiarism?', 'No. A similarity percentage shows matched or similar text found against the sources used for a check. The context of each match still needs to be reviewed before deciding what it means.'],
    ['Can I use PlagiarismSearch before submitting through my institution?', 'You can use PlagiarismSearch to review your own draft before submission, subject to your institution\'s rules. Because PlagiarismSearch and Turnitin® use different systems and source collections, do not assume that the two services will return the same result.'],
    ['Does PlagiarismSearch check AI writing too?', 'AI writing analysis is available as a separate check when the capability and AI-word balance are available. AI detection and plagiarism checking answer different questions; an AI result does not itself mean plagiarism.'],
    ['How much can I check for free?', 'You can check up to 150 plagiarism words without registering. Registered users receive 300 plagiarism words per day.'],
  ];
  ok('nine FAQ items', (faq.match(/class="faq-item/g) || []).length === 9);
  const f = flat(faq);
  const bad = QA.filter(([q, a]) => !f.includes(q) || !f.includes(a)).map(([q]) => q.slice(0, 30));
  ok('nine questions and answers verbatim, answers in the HTML', !bad.length, bad.join(' · '));
  ok('every question is a button with aria-expanded', (faq.match(/<button type="button" aria-expanded="(true|false)"/g) || []).length === 9);
  ok('no accuracy-comparison question', !/how accurate/i.test(f));
  const close = section('independent-cta');
  ok('the closing CTA returns to the one real checker', /href="#independent-checker"/.test(close) && !/<form|<textarea/.test(close));
  ok('closing microcopy', flat(close).includes('150 words free — no registration required.'));
}

/* ── hygiene ────────────────────────────────────────────────────────────────── */
console.log('\nhygiene');
{
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const anchors = [...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const dead = [...new Set(anchors)].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));
  const local = [...new Set([...body.matchAll(/href="([a-z0-9-]+\.html)(#[^"]*)?"/g)].map(m => m[1]))];
  const gone = local.filter(f => !fs.existsSync(path.join(__dirname, '..', 'site', f)));
  ok('every local page link exists', !gone.length, gone.join(', '));
  ok('the hero carries the dot field under its orbs', /id="heroDots"/.test(section('independent-checker')) && section('independent-checker').indexOf('heroDots') < section('independent-checker').indexOf('class="orb'));
  ok('header and footer were injected by build/shell.js', /<header[^>]*>\s*\S/.test(html) && /<footer[^>]*>\s*\S/.test(html));
}

console.log('\ngates — open items, not defects');
console.log('  G1    Final legal / trademark review before production (brief §6, §19).');
console.log('  G2    Pricing preview reads build/pricing-data.js — placeholder figures; production is backend-driven.');
console.log('  G0    The prototype is noindexed site-wide (donor head); production must serve this URL indexable.');
console.log('  G3    The five guides.turnitin.com URLs must be re-verified to resolve before launch; refresh the date if rechecked.');

console.log(failed ? '\n' + failed + ' check(s) FAILED' : '\nall checks passed');
process.exit(failed ? 1 : 0);
