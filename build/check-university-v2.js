/* Check site/university-plagiarism-checker-v2.html against the University v2 brief of
   2026-09-04.

   The brief separates LOCKED COPY (must appear, unreworded) from INFORMATION CONTRACTS
   (relationships that must be visualised, as accessible HTML). So this checks both: the
   locked strings verbatim, and the contract entities present as text inside the
   sections that draw them — a diagram whose labels live only in an image would fail.

   Run: node build/check-university-v2.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'university-plagiarism-checker-v2.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
  .replace(/&#39;/g, '’').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body);

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(s);
function section(id) {
  const i = body.indexOf('id="' + id + '"');
  if (i < 0) return '';
  return body.slice(body.lastIndexOf('<section', i), body.indexOf('</section>', i) + 10);
}

/* ── page-level ─────────────────────────────────────────────────────────────── */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, "University Plagiarism Checker"', h1s.length === 1 && h1s[0] === 'University Plagiarism Checker', h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'University Plagiarism Checker for Higher Education | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Manage plagiarism checking across your university with source-based reports, organization permissions, institutional Storage, LMS integrations, and API access.', desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('canonical', canon === 'https://plagiarismsearch.com/university-plagiarism-checker', canon);
}

/* ── the nine sections, in order, with their anchors and H2s ─────────────────── */
console.log('\nthe nine-section story');
{
  const ORDER = [
    ['university-plagiarism-checker', null],
    ['institutional-report',     'Give educators evidence they can review'],
    ['institutional-management', 'Manage people, permissions, and checking resources centrally'],
    ['institutional-sources',    'Choose what each check compares — and what enters institutional Storage'],
    ['institutional-workflow',   'Use PlagiarismSearch in the workflow your institution already has'],
    ['institutional-ai',         'Need AI checking as part of the same institutional setup?'],
    ['institutional-inquiry',    'Discuss plagiarism checking for your institution'],
    ['university-faq',           'University Plagiarism Checker FAQ'],
    ['institutional-cta',        'Build a plagiarism-checking workflow that fits your institution'],
  ];
  const seen = [...body.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
  ok('nine sections carry the approved anchors in order', seen.join(',') === ORDER.map(o => o[0]).join(','), seen.join(', '));
  for (const [anchor, h] of ORDER) {
    if (!h) continue;
    const found = flat((section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + anchor + ' H2', found === h, found || '(missing)');
  }
  ok('exactly one H1 and no H4+', !/<h[4-6]\b/.test(body));
  /* eyebrows are not headings: the locked eyebrow labels must not be h-tags */
  const EYEBROWS = ['REPORT EVIDENCE', 'INSTITUTIONAL CONTROL', 'SOURCES & STORAGE', 'DEPLOYMENT', 'OPTIONAL AI CHECKING', 'INSTITUTIONAL INQUIRY', 'QUESTIONS'];
  const missingEb = EYEBROWS.filter(e => !text.toUpperCase().includes(e));
  ok('the seven locked eyebrows present', !missingEb.length, missingEb.join(' · '));
  ok('no eyebrow rendered as a heading', !/<h[1-6][^>]*>\s*(REPORT EVIDENCE|DEPLOYMENT|QUESTIONS)\s*<\/h/i.test(body));
}

/* ── LOCKED COPY, verbatim ───────────────────────────────────────────────────── */
console.log('\nlocked copy');
{
  const LOCKED = [
    /* 01 */
    'Give educators source evidence they can review and administrators the controls to manage institutional access, checking resources, and Storage. Use PlagiarismSearch directly, through your LMS, or through the API.',
    'For universities, colleges, academic departments, and other higher-education institutions.',
    'Source evidence for educators.', 'People, permissions, and institutional resources.', 'Direct workspace, LMS, or API.',
    /* 02 */
    'After a plagiarism check, the report highlights matching and similar passages and connects them to detected sources. Educators can inspect the matched text, open the source, and review citations, references, and surrounding context before deciding how a match should be interpreted.',
    'A similarity result is evidence for review, not an automatic finding that academic misconduct occurred.',
    'Identify where matching or similar text appears in the submitted document.',
    'Review the source connected to the match.',
    'Consider citations, references, and surrounding text before reaching a conclusion.',
    'Interpret the similarity percentage together with the underlying matches, sources, citations, and context.',
    /* 03 */
    'PlagiarismSearch Organization Management gives administrators one place to invite members, manage access, and distribute institutional checking resources.',
    'Invite members by email and manage access as your institutional team changes.',
    'Set the permissions members need for Organization Storage, document access, and institutional plagiarism checking.',
    'Distribute plagiarism-checking words from the organization balance. If your institution also uses AI detection, AI words can be allocated separately.',
    'Members keep their personal balance separate from the organization balance.',
    /* 04 */
    'A plagiarism check can use external sources and your institution’s own Storage. The comparison sources, scan controls, report retention, and Storage workflow remain separate.',
    'Compare submitted work with sources available on the web.',
    'Include more than 500 million indexed academic texts when academic source coverage matters.',
    '500M+ indexed academic texts',
    'Use your institution’s Storage as an additional comparison source when the relevant permissions and workflow are enabled.',
    'Exclude references and in-text citations when those parts should not affect the similarity result.',
    'Running a plagiarism check does not automatically add the document to Organization Storage. Adding material to Storage is a separate, intentional workflow.',
    'Generated reports may remain available in the account for convenient access and can be permanently deleted when they are no longer needed.',
    /* 05 */
    'Choose direct institutional access, an LMS integration, or a custom API workflow. The right path depends on where your users already submit, check, and review work.',
    'Use PlagiarismSearch directly when you need centralized member management, permissions, institutional balances, and Organization Storage without building a custom integration.',
    'Keep plagiarism checking inside the LMS when course and submission workflows already live there. Moodle lets administrators configure when checks run, which sources are searched, whether material is added to Storage, and what report information students can see.',
    'Use the PlagiarismSearch API when your institution has its own platform or needs plagiarism checking inside a custom technical workflow.',
    /* 06 */
    'AI detection is available as a separate analysis within the PlagiarismSearch ecosystem.',
    'When an organization uses AI checking, administrators can allocate AI word balance separately from plagiarism-checking balance.',
    'AI-generated text is not automatically plagiarism. Plagiarism checking and AI detection answer different questions and should be interpreted separately.',
    /* 07 */
    'Tell us how your institution plans to manage users, checking volume, Storage, and integrations. We’ll use those details to discuss an appropriate setup and pricing path.',
    'Prefer email? Contact us at services@plagiarismsearch.com.',
    'Your institutional request has been sent',
    'Thank you. We’ve received the information about your institution and plagiarism-checking requirements.',
    /* 09 */
    'Give educators source evidence they can review, manage institutional access and resources centrally, and choose the deployment path that fits your existing systems.',
  ];
  const missing = LOCKED.filter(s => !has(s));
  ok(LOCKED.length + ' locked strings present, unreworded', !missing.length, missing.slice(0, 3).map(s => '"' + s.slice(0, 44) + '…"').join(' · '));

  const LABELS = ['MANAGED INSTITUTIONAL ACCESS', 'LMS WORKFLOW', 'CUSTOM INTEGRATION', 'Organization workspace', 'Moodle & Canvas', 'API'];
  ok('the three deployment paths carry their labels and titles', LABELS.every(l => text.includes(l)), LABELS.filter(l => !text.includes(l)).join(' · '));

  const CTAS = ['Request institutional pricing', 'See how it works', 'Explore Organization Management', 'Read the Privacy Policy',
                'View Moodle integration', 'View Canvas integration', 'Explore the API', 'Learn about AI detection', 'Review deployment options'];
  ok('every approved CTA label present', CTAS.every(c => has(c)), CTAS.filter(c => !has(c)).join(' · '));
}

/* ── the information contracts, drawn in HTML ───────────────────────────────── */
console.log('\ninformation contracts');
{
  const hero = flat(section('university-plagiarism-checker'));
  ok('hero shows Review / Manage / Integrate', ['Review', 'Manage', 'Integrate'].every(w => hero.includes(w)));
  ok('hero does not repeat the deployment cards', !/Moodle integration|API integration|Organization workspace/.test(hero));
  ok('no checker form in the hero', !/<form|<textarea|<input/.test(section('university-plagiarism-checker')));

  const mgmt = flat(section('institutional-management'));
  ['Administrator', 'Invitation', 'Pending until accepted', 'Organization member', 'Uses institutional resources', 'Permissions', 'Plagiarism-checking words', 'AI words, separately', 'Personal balance remains separate from organization balance.']
    .forEach(e => ok('contract A: "' + e + '"', mgmt.includes(e)));

  const src = flat(section('institutional-sources'));
  ['Submitted work', 'Plagiarism check', 'Report', 'Web sources', 'Academic database', 'Organization Storage', 'References and citations',
   'Selected material', 'separate, intentional workflow', 'May participate in future comparisons', 'Institution-controlled']
    .forEach(e => ok('contract B: "' + e + '"', src.includes(e)));
  /* the Storage branch is its own lane, not a consequence of the check: it is marked as
     a separate workflow and is not inside the check's own column */
  ok('the Storage branch is labelled a separate workflow', /Separate workflow/.test(src));

  const dep = flat(section('institutional-workflow'));
  ['We want centralized institutional access without building an integration.',
   'Course and submission workflows already live in our LMS.',
   'We have our own platform or need a custom technical workflow.']
    .forEach(e => ok('contract C: "' + e.slice(0, 40) + '…"', dep.includes(e)));

  /* meaningful diagram text is HTML, never an image */
  const drawn = ['university-plagiarism-checker', 'institutional-management', 'institutional-sources', 'institutional-workflow'];
  ok('no <img> in any diagram section', drawn.every(id => !/<img\b/.test(section(id))));

  /* the real report, once, semantics intact */
  const rep = section('institutional-report');
  ok('the approved report component is on the page', /cab-mark/.test(rep) && /Report information/.test(rep));
  ok('the report is used once', (body.match(/id="cabDoc"/g) || []).length === 1);
  ok('the three reading steps are not three cards',
     (rep.match(/<li\b/g) || []).length >= 3 && !/<h3\b[^>]*>\s*See the match/.test(rep));
}

/* ── the form, exactly ───────────────────────────────────────────────────────── */
console.log('\ninquiry form');
{
  const f = section('institutional-inquiry');
  const labels = [...f.matchAll(/<label class="cf-label"[^>]*>([\s\S]*?)<\/label>/g)].map(m => flat(m[1]).replace(/\s*\*$/, ''));
  const WANT = ['Name', 'Work email', 'Institution', 'Your role', 'How do you plan to use PlagiarismSearch?', 'Approximate institution size', 'Approximate monthly checking volume', 'Institutional requirements'];
  ok('the eight approved fields, in order', labels.join('|') === WANT.join('|'), labels.join(' | '));
  const required = [...f.matchAll(/<label class="cf-label"[^>]*>([\s\S]*?)<\/label>/g)]
    .filter(m => /<i>\*<\/i>/.test(m[1])).map(m => flat(m[1]).replace(/\s*\*$/, ''));
  ok('Name, Work email, Institution and Institutional requirements are required',
     required.join('|') === 'Name|Work email|Institution|Institutional requirements', required.join(' | '));
  ok('no Phone field', !/Phone/.test(f));
  ok('no Moodle URL field', !/Moodle URL/.test(f));
  const opts = [...f.matchAll(/<option>([^<]*)<\/option>/g)].map(m => m[1]);
  ok('role options', opts.slice(0, 6).join('|') === 'Academic or faculty|Administration|Academic integrity|IT or LMS|Procurement|Other', opts.slice(0, 6).join(' | '));
  ok('use options', opts.slice(6).join('|') === 'Organization workspace|Moodle|Canvas|API|Not sure yet|Other', opts.slice(6).join(' | '));
  ok('placeholders as approved', /placeholder="Jordan Reeves"/.test(f) && /placeholder="name@university\.edu"/.test(f) && /placeholder="University or college name"/.test(f)
     && /placeholder="e\.g\. 5,000 students or users"/.test(f) && /placeholder="e\.g\. 2,000 documents or 1,000,000 words"/.test(f));
  ok('helpers as approved', /An estimate is enough\./.test(f) && /Use whichever estimate is easier for your institution\./.test(f));
  ok('consent links to Terms of Use and Privacy Policy', /href="terms-of-use\.html"[^>]*>Terms of Use</.test(f) && /href="policy\.html"[^>]*>Privacy Policy</.test(f));
  ok('submit reads "Request institutional pricing"', /<button type="submit"[^>]*>\s*Request institutional pricing/.test(f));
  ok('the form submits nowhere in the prototype', /onsubmit="return false"/.test(f));
  ok('no response-time promise', !/within \d+|business day|hours/i.test(flat(f)));
}

/* ── FAQ ─────────────────────────────────────────────────────────────────────── */
console.log('\nFAQ');
{
  const faq = section('university-faq');
  const QS = [
    'Can our university manage multiple users and institutional checking resources?',
    'Can our institution compare new submissions with its own documents?',
    'Does every checked document automatically enter Organization Storage?',
    'What sources can be included in an institutional plagiarism check?',
    'Does PlagiarismSearch integrate with Moodle and Canvas?',
    'Can our institution use the API instead of an LMS integration?',
    'Can our institution also use AI detection?',
    'Does the plagiarism report automatically determine that a student plagiarized?',
    'How do we get institutional pricing?',
  ];
  const found = [...faq.matchAll(/class="faq-q[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)].map(m => flat(m[1]));
  ok('the nine approved questions, in order', found.join('|') === QS.join('|'), found.length + ' found');
  ok('nine answers rendered in the HTML', (faq.match(/class="faq-a"/g) || []).length === 9);
  ok('answer 5 links Moodle and Canvas', /href="integration-guide\.html"[^>]*>Moodle</.test(faq) && /href="canvas-integration\.html"[^>]*>Canvas</.test(faq));
  ok('answer 6 links the API', /href="api\.html"[^>]*>PlagiarismSearch API</.test(faq));
  ok('answer 7 links AI detection', /href="ai-detector\.html"[^>]*>AI detection</.test(faq));
  ok('answer 9 links the inquiry form', /href="#institutional-inquiry"[^>]*>Request institutional pricing</.test(faq));
  ok('accordion controls are buttons with aria-expanded', (faq.match(/<button type="button" aria-expanded=/g) || []).length === 9);
}

/* ── forbidden / unconfirmed ─────────────────────────────────────────────────── */
console.log('\nforbidden');
{
  const BANNED = [
    ['no data storage',                 /no data storage/i],
    ['cheating / misconduct as a finding', /cheating detected|misconduct detected|pass\/fail|pass or fail/i],
    /* "academic departments" is in the locked hero line; what is banned is a department
       STRUCTURE — hierarchy, per-department anything */
    ['SSO / audit logs / department hierarchy / analytics / seats / admin tiers', /\bSSO\b|audit log|department (hierarch|admin|level)|per department|analytics|\bseats?\b|admin tier|permission level/i],
    ['global or cross-university repository', /global (student|paper) repository|cross-university|all universities/i],
    ['Canvas-specific controls',         /Canvas lets|In Canvas, administrators/i],
    ['API SLA / SDK / rate limit / sandbox / trial', /\bSLA\b|\bSDK\b|rate limit|sandbox|free trial/i],
    ['AI model names / accuracy / pricing', /GPT|Claude|Gemini|\d+% accura|accuracy of \d|\$\d/i],
    ['retention period / database count', /\b\d+ days?\b|retained for|deleted after \d/i],
    ['response-time promise',            /response time|we reply|within 24|business hours/i],
    ['a similarity score proves plagiarism', /(score|percentage) (proves|means|confirms|equals) (plagiarism|misconduct)|automatic finding that .* did occur/i],
    ['AI text = plagiarism',             /AI-generated text is plagiarism/i],
    ['automatic Storage ingestion',      /automatically (added|enters|stored) (to|in|into) (Organization )?Storage/i],
    ['Students / Teachers / Turnitin / blog body links', /plagiarism-checker-for-students\.html|plagiarism-checker-for-teachers\.html|turnitin|blog-/i],
  ];
  for (const [label, re] of BANNED) {
    const hay = label.includes('links') ? body.slice(0, body.indexOf('<footer')) : text;
    const m = hay.match(re);
    const i = m ? hay.search(re) : 0;
    ok('no ' + label, !m, m ? '"' + hay.slice(Math.max(0, i - 30), i + m[0].length + 30).replace(/<[^>]*>/g, ' ').trim() + '"' : '');
  }
}

/* ── links and structure ─────────────────────────────────────────────────────── */
console.log('\nstructure');
{
  const APPROVED = new Set(['https://plagiarismsearch.com/organization-management', 'integration-guide.html', 'canvas-integration.html',
                            'api.html', 'ai-detector.html', 'policy.html', 'terms-of-use.html', 'mailto:services@plagiarismsearch.com']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1]).filter(h => !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the brief’s destinations in the body', !extra.length, extra.join(', '));
  const anchors = [...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set(anchors)].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));

  /* the compact banner is the shared one, and it is compact */
  ok('AI is the shared compact banner', /id="institutional-ai" class="relative py-10 sm:py-12 lg:py-14/.test(body));
  ok('no AI report demo in the AI block', !/cab-mark/.test(section('institutional-ai')));

  /* h3s: only where a genuine subsection exists — the four control items, the three
     deployment paths, the success heading */
  const h3 = (body.match(/<h3\b/g) || []).length;
  ok('h3 only for genuine subsections (8)', h3 === 8, h3 + ' found');

  /* the v1 problem: no run of equal-card grids. A crude but honest proxy — no section
     other than deployment lays out three or more sibling cards with an h3 each. */
  const gridSections = ['institutional-management', 'institutional-sources', 'university-plagiarism-checker']
    .filter(id => (section(id).match(/<h3\b/g) || []).length >= 3 && /grid (sm:|md:|lg:)grid-cols-[3-5]/.test(section(id)));
  ok('no equal-card grid outside deployment', !gridSections.length, gridSections.join(', '));
  ok('the version switcher pairs with v1', /VSWITCH/.test(html) && /href="university-plagiarism-checker\.html"/.test(html));
}

console.log('\ngates — open items, not defects');
console.log('  G1  No real Organization Management or LMS captures exist; every diagram is HTML');
console.log('      by the v1 asset gate and the v2 accessibility rule alike.');
console.log('  G2  /organization-management is linked absolutely to production; the prototype');
console.log('      has no page at that route.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches the University v2 brief'));
process.exit(failed ? 1 : 0);
