/* Check site/plagiarism-checker-for-students.html against the Students brief of
   2026-09-15.

   The brief freezes copy, facts, CTAs and destinations and leaves composition free; so
   the copy is checked verbatim, the facts and forbidden claims by pattern, and the
   composition only where the brief makes it testable: one real checker, one report,
   the principle visible, no second form, no pricing matrix.

   Run: node build/check-students.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'plagiarism-checker-for-students.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
  .replace(/&#39;/g, '’').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
/* the brief writes its dashes as " - "; the site sets them as " — ". Same sentence. */
const text = flat(body).replace(/\s[—–-]\s/g, ' — ');
const norm = s => s.replace(/\s[—–-]\s/g, ' — ');

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

/* ── page-level ─────────────────────────────────────────────────────────────── */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, "Plagiarism Checker for Students"', h1s.length === 1 && h1s[0] === 'Plagiarism Checker for Students', h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'Plagiarism Checker for Students | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Check essays, papers, assignments, and theses for matching text and sources before you submit. Review similarity, citations, references, and source context in a clear report.', desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the existing URL', canon === 'https://plagiarismsearch.com/plagiarism-checker-for-students', canon);
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

/* ── the information jobs, as sections with their H2s ───────────────────────── */
console.log('\ninformation jobs');
{
  const H2S = [
    ['before-you-submit',    'Review every match before you submit'],
    ['review-your-draft',    'What to do when you find a match'],
    ['sources-and-settings', 'Control what your paper is checked against'],
    ['your-paper',           'Know what happens to your paper'],
    ['plagiarism-vs-ai',     'Plagiarism and AI writing are different checks'],
    ['start-free',           'Check a short passage before you choose a plan'],
    ['student-faq',          'Plagiarism Checker for Students FAQ'],
    ['student-cta',          'Check your paper before you submit'],
  ];
  for (const [anchor, h] of H2S) {
    const found = flat((section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + anchor + ' H2', found === h, found || '(missing)');
  }
  const EYEBROWS = ['Before You Submit', 'Review Your Draft', 'Sources & Settings', 'Your Paper & Report', 'Start Free'];
  ok('the five approved eyebrows present', EYEBROWS.every(e => text.toLowerCase().includes(e.toLowerCase())),
     EYEBROWS.filter(e => !text.toLowerCase().includes(e.toLowerCase())).join(' · '));
}

/* ── the approved baseline, verbatim ────────────────────────────────────────── */
console.log('\napproved copy');
{
  const COPY = [
    'Check your essay, paper, assignment, thesis, or other coursework for matching text and sources before you submit. Review each match in context and decide what needs attention before you turn in your work.',
    '150 words free - no registration required.',
    '500,000+ users', 'Plagiarism checking in 80+ languages', 'BBB Accredited',
    'A similarity score is only a starting point. Open a highlighted passage to see the matching source and its context, then review citations, references, and other report signals before deciding whether anything needs to change.',
    'PlagiarismSearch surfaces matching text and sources for review. It does not decide whether a passage is plagiarism.',
    'Similarity is not a plagiarism grade.',
    'A matching passage may be a quotation, a reference, common phrasing, a close paraphrase, or text that needs closer review. Look at the source and context instead of treating one percentage as a pass-or-fail result.',
    'Open the matched passage', 'Find the highlighted text in your report and open the source connected to that match.',
    'Review the source and context', 'Check whether the match comes from a quotation, reference, common phrasing, a close paraphrase, or another passage that needs closer attention.',
    'Revise where necessary', 'If the wording or attribution needs work, revise the passage appropriately - for example, correct the citation, use quotation marks where required, or rewrite the idea in your own words.',
    'Review the updated draft', 'If you make changes, you can check the revised paper again and review the updated matches before submission.',
    'Choose the source collections and exclusions that fit your paper before you interpret the result. Search the web and academic databases, and exclude references or in-text citations when appropriate.',
    'Search available web sources for matching or similar text.',
    'Include academic database search when you want the paper compared with indexed academic material.',
    'When academic database search is enabled, PlagiarismSearch can search over 500 million indexed academic texts.',
    'Exclude the reference section when that fits the way you need to review the paper.',
    'Exclude in-text citations when appropriate for the check.',
    'Depending on your account, settings, and access, personal or organization storage may also be available as comparison sources.',
    'Changing the source collections or exclusions changes what the report can show, so review your settings before comparing results between checks.',
    'Your document is processed to perform the checks you select. The file you upload is not retained as a stored source document, while a generated report may remain in your account for convenient access.',
    'Your document is processed for the checks you select.', 'The uploaded file is not retained as a stored source document.',
    'Your generated report may remain in your account for convenient access.', 'You can permanently delete reports from your account.',
    'If you choose Add to storage, that is a separate action you control.',
    'Running a plagiarism check does not automatically add your paper to storage.',
    'Plagiarism checking finds text that matches available sources and shows where those matches come from.',
    'AI writing analysis provides a separate indicator for the text you choose to analyze. It does not replace source matching and does not prove authorship.',
    'AI-generated text is not automatically plagiarism, and a low similarity result does not prove that a text was written by a human.',
    'You can check up to 150 words for plagiarism without registering. Registered users receive 300 plagiarism words per day.',
    'If you need to check more, compare the current PlagiarismSearch plans and choose the option that fits your work.',
    'Paste your text or upload a document to review matching passages and sources in a clear report.',
  ];
  const missing = COPY.filter(s => !has(s));
  ok(COPY.length + ' approved strings present, unreworded', !missing.length, missing.slice(0, 3).map(s => '"' + s.slice(0, 44) + '…"').join(' · '));

  const CTAS = ['Check for plagiarism', 'See all pricing options', 'Read our Privacy Policy', 'Explore AI Detector'];
  ok('approved CTA labels present', CTAS.every(c => has(c)), CTAS.filter(c => !has(c)).join(' · '));
}

/* ── the checker: one, real, primary, and where every CTA goes ──────────────── */
console.log('\nthe checker');
{
  const hero = section('student-checker');
  ok('the hero carries the shared form (build/checker.js)', /<textarea id="checkText"/.test(hero) && /class="qc-drop/.test(hero) && /id="optPlag" checked/.test(hero));
  ok('plagiarism is the checked control; AI is optional', /id="optPlag" checked/.test(hero) && /id="optAI" class/.test(hero) && !/id="optAI" checked/.test(hero));
  ok('exactly one form on the page', (body.match(/<form\b/g) || []).length === 1);
  ok('no fake scan state or invented result in the form', !/scanning|\d+ sources found|similarity: \d/i.test(flat(hero)));
  const ctas = [...body.matchAll(/href="#student-checker"/g)].length;
  ok('the workflow, free-entry and closing CTAs all return to the one checker', ctas >= 3, ctas + ' links');
  ok('the free line appears in the hero and the close', (text.match(/150 words free — no registration required\./g) || []).length === 2);
  ok('the hero is not the homepage composition', /grid lg:grid-cols-\[\.95fr_1\.05fr\]/.test(hero) && !/max-w-\[760px\] mx-auto text-center/.test(hero));
}

/* ── the report and the principle ───────────────────────────────────────────── */
console.log('\nreport evidence');
{
  const rep = section('before-you-submit');
  ok('the approved report component is on the page, once', /cab-mark/.test(rep) && (body.match(/id="cabDoc"/g) || []).length === 1);
  ok('AI probability stays a separate metric in the report', /Total AI rate/.test(rep) && /AI probability/.test(rep));
  ok('the principle is a display statement, not a caption', /<p class="text-\[clamp\(1\.6rem,2\.8vw,2\.4rem\)\][^>]*>[\s\S]*?Similarity is/.test(rep));
  ok('no verdict, threshold or fix language in the report act', !/verdict|safe (score|percentage)|threshold|automatic(ally)? (fix|correct)|suggested citation/i.test(flat(rep)));
}

/* ── the workflow, the controls, the lifecycle ──────────────────────────────── */
console.log('\nworkflow · controls · lifecycle');
{
  const wf = section('review-your-draft');
  ok('four steps, in order', /Step 1[\s\S]*Step 2[\s\S]*Step 3[\s\S]*Step 4/.test(flat(wf)));
  ok('the workflow promises no automatic repair', !/automatic(ally)? (fix|correct|rewrite|paraphras)|make (it )?original|we (fix|correct|rewrite)/i.test(flat(wf)));
  const src = section('sources-and-settings');
  ok('web, academic, references and in-text citations are all controls', ['Web', 'Academic databases', 'Exclude references', 'Exclude in-text citations'].every(c => flat(src).includes(c)));
  ok('controls are ticks, not live switches', !/class="sw/.test(src));
  const lc = section('your-paper');
  ok('the lifecycle keeps document, report and storage distinct', ['Source document', 'Report', 'Delete', 'Add to storage'].every(c => flat(lc).includes(c)));
  ok('the privacy link goes to /policy', /href="policy\.html"/.test(lc));
}

/* ── AI, free entry, pricing path ───────────────────────────────────────────── */
console.log('\nAI · free entry');
{
  ok('AI is one compact act, one link', (body.match(/href="ai-detector\.html"/g) || []).length === 1);
  const free = section('start-free');
  ok('the two confirmed limits, no others', /150/.test(flat(free)) && /300/.test(flat(free)) && !/15,?000|20,?000|unlimited/i.test(text));
  ok('the pricing path is a link to /prices, not a matrix', /href="prices\.html"/.test(free) && !/One-time|Monthly|3-Months|Yearly|\$\d/.test(flat(free)));
  ok('no price anywhere on the page', !/\$\d/.test(text));
}

/* ── FAQ ─────────────────────────────────────────────────────────────────────── */
console.log('\nFAQ');
{
  const faq = section('student-faq');
  const QS = [
    'Can I check my essay or paper before submitting it?',
    'Does a similarity percentage mean I plagiarized?',
    'What is a safe similarity percentage for a student paper?',
    'Can I exclude references and in-text citations?',
    'What sources can my paper be checked against?',
    'Is my uploaded paper stored?',
    'Can I check for AI-written text too?',
    'How much can I check for free?',
    'Which file types can I upload?',
  ];
  const found = [...faq.matchAll(/class="faq-q[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)].map(m => flat(m[1]));
  ok('the nine approved questions, in order', found.join('|') === QS.join('|'), found.length + ' found');
  ok('nine answers rendered in the HTML', (faq.match(/class="faq-a"/g) || []).length === 9);
  ok('the "safe percentage" answer says there is none', /There is no universal similarity percentage/.test(flat(faq)));
  ok('accordion controls are buttons with aria-expanded', (faq.match(/<button type="button" aria-expanded=/g) || []).length === 9);
}

/* ── forbidden ──────────────────────────────────────────────────────────────── */
console.log('\nforbidden');
{
  const BANNED = [
    ['originality / authenticity guarantee', /100% (original|authentic|unique)|guarantee[sd]? (originality|plagiarism-free)|plagiarism-free guarantee/i],
    ['a "safe" percentage or pass/fail threshold', /safe (similarity )?(percentage|score|threshold)\b(?! for a student paper\?)|pass\/fail threshold/i],
    ['legacy free offers', /15,?000|20,?000|unlimited (free )?check/i],
    ['superlatives', /most accurate|\bbest\b|\btop\b(?!ic)|perfectly reliable/i],
    ['speed / SLA', /instant|real-time|in \d+ minutes?|within minutes/i],
    ['storage absolutes', /never stored|no data storage|immediately deleted|100% confidential|privacy guaranteed|without storing/i],
    ['clients / customers / students as the 500,000', /500,000\+? (clients|customers|students)/i],
    ['coverage guarantees', /billions of sources|checks every source|finds all plagiarism/i],
    ['avoid getting caught / beat the detector', /getting caught|beat (the )?(detector|turnitin)|pass (a|the) (detector|check)/i],
    ['automatic citation fixes / rewriting', /automatic(ally)? (citation|fix|rewrite|paraphras)|make (it )?original/i],
    ['teacher / institutional story', /class(room|es)? management|gradebook|assignment dashboard|LMS|Moodle|procurement/i],
    ['Turnitin comparison', /turnitin/i],
    ['no hidden fees / best value', /no hidden fees|best value|cheapest/i],
  ];
  for (const [label, re] of BANNED) {
    const m = text.match(re);
    const i = m ? text.search(re) : 0;
    ok('no ' + label, !m, m ? '"' + text.slice(Math.max(0, i - 30), i + m[0].length + 30).trim() + '"' : '');
  }
}

/* ── links and structure ─────────────────────────────────────────────────────── */
console.log('\nstructure');
{
  const APPROVED = new Set(['prices.html', 'policy.html', 'ai-detector.html']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1]).filter(h => !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the brief’s destinations in the body', !extra.length, extra.join(', '));
  const anchors = [...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set(anchors)].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));
  ok('no links to other audience or specialist pages', !/students|teachers|university-plagiarism|pdf-plagiarism|powerpoint|turnitin/.test(links.join(' ')));
  ok('no stock imagery as proof', !/<img\b(?![^>]*partners\/)/.test(body));
  ok('the hero is the first section and the checker is above the fold', body.indexOf('id="student-checker"') < body.indexOf('<section', body.indexOf('<section') + 1));
}

console.log('\ngates — open items, not defects');
console.log('  G1  The form is the shared prototype checker; a developer binds it to the');
console.log('      production component. The 150 / 300 limits are the approved facts and');
console.log('      must be re-QAed against production before launch.');
console.log('  G2  The optional review-platform rating is omitted: no approved source supplied.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches the Students brief'));
process.exit(failed ? 1 : 0);
