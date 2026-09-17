/* Check site/plagiarism-checker-for-organization.html against the Business & Teams
   brief of 2026-09-15.

   The brief's non-negotiables are mostly negatives — no checker in the hero, no
   University story, no enterprise features nobody confirmed, a check that never looks
   like it feeds Storage — so this checker is heavy on absences, alongside the usual
   verbatim copy, form and FAQ assertions.

   Run: node build/check-business.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'plagiarism-checker-for-organization.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
  .replace(/&#39;/g, '’').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
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
  ok('exactly one H1, "Plagiarism Checking for Business & Teams"', h1s.length === 1 && h1s[0] === 'Plagiarism Checking for Business & Teams', h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'Plagiarism Checker for Business &amp; Teams | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Manage plagiarism checking across your team with member permissions, organization balances, Organization Storage, interactive reports, and optional API access.', desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the existing URL', canon === 'https://plagiarismsearch.com/plagiarism-checker-for-organization', canon);
  ok('no H4+', !/<h[4-6]\b/.test(body));
  ok('not built around the legacy exact-match phrase', !/plagiarism checker for organization/i.test(text));
}

/* ── the information jobs ───────────────────────────────────────────────────── */
console.log('\ninformation jobs');
{
  const H2S = [
    ['organization-management', 'Manage members, permissions, and shared resources in one organization'],
    ['report-evidence',         'Review the source evidence behind each check'],
    ['organization-storage',    'Use Organization Storage as a controlled comparison source'],
    ['business-workflows',      'Fit plagiarism checking into the way your team already reviews content'],
    ['choose-your-workflow',    'Work in PlagiarismSearch or connect checking to your own system'],
    ['data-handling',           'Keep checked documents, reports, and Organization Storage distinct'],
    ['plans-and-custom',        'Choose a standard plan or discuss a custom setup'],
    ['business-inquiry',        'Tell us how your team plans to use PlagiarismSearch'],
    ['business-faq',            'Business & Teams FAQ'],
    ['business-cta',            'Set up plagiarism checking for your team'],
  ];
  const seen = [...body.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
  ok('eleven sections in the page order', seen.join(',') === ['business-and-teams', ...H2S.map(h => h[0])].join(','), seen.join(', '));
  for (const [anchor, h] of H2S) {
    const found = flat((section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + anchor + ' H2', found === h, found || '(missing)');
  }
  const EYEBROWS = ['Business & Teams', 'Organization Management', 'Report Evidence', 'Sources & Organization Storage', 'Business Workflows',
                    'Choose Your Workflow', 'Data Handling', 'Plans & Custom Requirements', 'Business Inquiry'];
  ok('the nine approved eyebrows present', EYEBROWS.every(e => text.toLowerCase().includes(e.toLowerCase())),
     EYEBROWS.filter(e => !text.toLowerCase().includes(e.toLowerCase())).join(' · '));
}

/* ── the approved baseline, verbatim ────────────────────────────────────────── */
console.log('\napproved copy');
{
  const COPY = [
    'Bring recurring plagiarism checks into a managed team workflow. Administrators can manage members, permissions, and organization resources, while team members can keep their personal balances separate.',
    'Use Organization Storage when your own content should be part of comparison, or connect the PlagiarismSearch API when checks need to run inside another workflow.',
    'For agencies, content teams, companies, publishers, and other organizations with recurring content-review needs.',
    'Organization Management gives administrators a practical way to coordinate team access while keeping organization resources separate from each member’s personal balance.',
    'Create your organization', 'An administrator creates the organization and manages its members from one organization workspace.',
    'Invite and manage members', 'Invite members by email and manage their organization access as your team changes. Members can be blocked or unblocked when needed.',
    'Set organization permissions', 'Control how members can use Organization Storage, search the organization’s storage during plagiarism checks, and view documents stored there.',
    'Allocate checking resources', 'Administrators can allocate organization plagiarism and AI word balances to members according to the team’s needs.',
    'Personal and organization balances stay separate', 'A member can keep a private personal balance that the administrator and other organization members do not access, while also using organization resources allocated by the administrator.',
    'PlagiarismSearch does not decide whether a passage is plagiarism. The report shows matched or similar text and the sources found for it, so your team can review the context before deciding what needs attention.',
    'See the passages where matching or similar text was found.',
    'Review the corresponding sources and compare them with the checked text.',
    'Select a match in the report to focus on the relevant source and inspect the result in context.',
    'The report supports review and decision-making; it is not an automatic plagiarism verdict.',
    'PlagiarismSearch supports multiple source options in its scan settings, including web search, academic database search, personal storage search, and organization storage search.',
    'For a team, Organization Storage can become an additional comparison source when the relevant organization permissions and search option are enabled.',
    'Running a plagiarism check does not automatically add the checked document to Organization Storage. Adding content to Storage is a separate action and remains distinct from the normal checking and report workflow.',
    'This lets an organization decide when its own stored content should become part of future comparisons instead of treating every checked document as repository content.',
    'The same organization controls can support different recurring review workflows without requiring a separate plagiarism product for each type of business.',
    'Give writers, editors, and reviewers access to organization resources while the administrator manages permissions and balances. Review source matches before work is delivered or published.',
    'Coordinate recurring plagiarism checks across a team while each member can keep personal resources separate from the organization balances assigned to them.',
    'Use Organization Storage when your own repository should be part of comparison, and use the API for workflows that need plagiarism checks to run from another system.',
    'Teams can work directly in PlagiarismSearch or use the API when plagiarism checking needs to become part of another application or automated workflow.',
    'Choose the organization workspace when team members should run checks and review reports directly in PlagiarismSearch. The administrator manages members, permissions, and organization resources while each member works through their own account access.',
    'Use the PlagiarismSearch API when checks need to be triggered from another application or workflow. API access may be included in some packages or purchased separately.',
    'AI checking can also be used through the PlagiarismSearch API when the account has available AI-word balance.',
    'Administrators can allocate both plagiarism and AI word balances through the organization. AI detection remains a separate analysis from plagiarism checking and uses its own AI-word balance.',
    'A checked document, a generated report, and content intentionally added to Organization Storage are different parts of the workflow.',
    'Uploaded source documents are not retained as stored documents after the check.',
    'Generated reports can remain available in the account for convenience. Users can permanently delete their reports.',
    'Organization Storage is a separate repository workflow. Content is added to it separately and access is governed by organization permissions.',
    'A normal plagiarism check should not be confused with intentionally adding content to Organization Storage.',
    'Standard PlagiarismSearch plans are available on the Pricing page. If your organization needs larger volumes, API access, or a custom commercial arrangement, tell us what your workflow requires.',
    'Custom contracts and pricing are available for larger customers.',
    'Share your team size, expected usage, and the workflow you want to support. These details help us understand whether you need an organization workspace, Organization Storage, API access, AI checking, standard pricing, or a custom commercial setup.',
    'Words, documents, or another estimate is fine.',
    'Thanks - your business inquiry has been submitted.',
    'Tell us how your organization works today and whether you need a managed team workspace, Organization Storage, API access, or higher-volume usage.',
  ];
  const missing = COPY.filter(s => !has(s));
  ok(COPY.length + ' approved strings present, unreworded', !missing.length, missing.slice(0, 3).map(s => '"' + s.slice(0, 44) + '…"').join(' · '));
  const CTAS = ['Request a business quote', 'See how team access works', 'Learn more about Organization Management', 'Learn about Organization Management',
                'Explore the Plagiarism API', 'Explore AI Content Detector', 'Read the Privacy Policy', 'View standard pricing'];
  ok('approved CTA labels present', CTAS.every(c => has(c)), CTAS.filter(c => !has(c)).join(' · '));
}

/* ── the non-negotiable differentiation ─────────────────────────────────────── */
console.log('\ndifferentiation');
{
  const hero = section('business-and-teams');
  ok('no checker widget or free-check offer in the hero', !/<form|<textarea|qc-area|150 words|free check/i.test(hero));
  ok('no checker anywhere on the page', !/<textarea id="checkText"|class="qc-drop/.test(body));
  ok('the hero’s primary CTA reaches the inquiry, the secondary the team-control act',
     /href="#business-inquiry"[^>]*>\s*Request a business quote/.test(hero) && /href="#organization-management"[^>]*>See how team access works/.test(hero));
  ok('the hero draws the managed organization, with two balances per member',
     /Administrator/.test(flat(hero)) && (hero.match(/Personal balance/g) || []).length === 2 && (hero.match(/Organization resources/g) || []).length >= 2);
  const org = section('organization-management');
  ok('the personal-vs-organization separation is the section’s lead card', /Organization balances/.test(flat(org)) && /Personal balance/.test(flat(org)) && /separate/.test(flat(org)));
  ok('the administrator is never shown accessing a personal balance', !/administrator (can )?(view|see|access|use)s? (a |the )?(member’s |members’ )?personal/i.test(text));
  ok('the page closes on a business action, not a checker', /href="#business-inquiry"/.test(section('business-cta')) && !/Check for plagiarism|Check free/.test(flat(section('business-cta'))));
  const quote = [...body.matchAll(/href="#business-inquiry"/g)].length;
  ok('every quote CTA goes to the one inquiry', quote >= 3, quote + ' links');
}

/* ── report, storage, workflows, choose, AI, data ───────────────────────────── */
console.log('\nacts');
{
  const rep = section('report-evidence');
  ok('the approved report component, once', /cab-mark/.test(rep) && (body.match(/id="cabDoc"/g) || []).length === 1);
  ok('no verdict or threshold language in the report act', !/threshold|red\/yellow|authenticity|plagiarism-free/i.test(flat(rep)));

  const st = flat(section('organization-storage'));
  ok('the four source options are listed', ['Web search', 'Academic database search', 'Personal storage search', 'Organization storage search'].every(o => st.includes(o)));
  ok('a normal check and adding to Storage are two tracks', /A normal check/.test(st) && /A separate action/.test(st) && /not automatic/.test(st));
  ok('the check track ends at the report, not at Storage', /Checked document Plagiarism check Report/.test(st));
  ok('no link to /plagiarism-database (on HOLD)', !/plagiarism-database/.test(body));

  const wf = section('business-workflows');
  ok('three operational scenarios, no added verticals', (wf.match(/<h3\b/g) || []).length === 3 && !/legal|healthcare|government|\bHR\b|compliance/i.test(flat(wf)));
  ok('no links out of the workflows act', !/<a\b/.test(wf));

  const ch = section('choose-your-workflow');
  ok('two paths, each with its own destination', /Path A/.test(flat(ch)) && /Path B/.test(flat(ch)) && /href="api\.html"/.test(ch) && /organization-management/.test(ch));
  ok('no code or request/response on this page', !/<pre\b|<code\b|curl |webhook/i.test(body));
  ok('AI is one compact treatment with one link', (body.match(/href="ai-detector\.html"/g) || []).length === 1 && /Plagiarism and AI checks remain separate/.test(text));

  const dh = section('data-handling');
  ok('checked document, report and Storage are three distinct items', (dh.match(/<h3\b/g) || []).length === 3);
  ok('the privacy link goes to /policy', /href="policy\.html"/.test(dh));

  const pl = section('plans-and-custom');
  ok('plans is the shared compact banner with both ways on', /py-10 sm:py-12 lg:py-14/.test(pl) && /href="#business-inquiry"/.test(pl) && /href="prices\.html"/.test(pl));
  ok('no pricing widget or price on the page', !/\$\d|One-time|Monthly|Yearly|js-price/.test(text));
}

/* ── the form, exactly ───────────────────────────────────────────────────────── */
console.log('\ninquiry form');
{
  const f = section('business-inquiry');
  const labels = [...f.matchAll(/<label class="cf-label"[^>]*>([\s\S]*?)<\/label>/g)].map(m => flat(m[1]).replace(/\s*\*$/, ''));
  const WANT = ['Name', 'Work email', 'Organization or company', 'Role or job title', 'Approximate team size',
                'Approximate monthly checking volume', 'Phone number', 'Tell us about your workflow or requirements'];
  ok('the approved fields, in order', labels.join('|') === WANT.join('|'), labels.join(' | '));
  const required = [...f.matchAll(/<label class="cf-label"[^>]*>([\s\S]*?)<\/label>/g)]
    .filter(m => /<i>\*<\/i>/.test(m[1])).map(m => flat(m[1]).replace(/\s*\*$/, ''));
  ok('Name, Work email, Organization and the message are required; phone is not',
     required.join('|') === 'Name|Work email|Organization or company|Tell us about your workflow or requirements', required.join(' | '));
  const needs = [...f.matchAll(/name="needs" value="([^"]*)"/g)].map(m => m[1]);
  ok('"What do you need?" is a multi-select of the six approved options',
     /<legend class="cf-label">What do you need\?<\/legend>/.test(f) &&
     needs.join('|') === 'Organization workspace|Organization Storage|API access|AI checking|Custom volume or pricing|Not sure yet', needs.join(' | '));
  ok('the options are real checkboxes (keyboard, multi)', (f.match(/<input type="checkbox" name="needs"/g) || []).length === 6);
  ok('no Facebook, LinkedIn, pages or documents counters', !/facebook|linkedin|number of pages|number of documents/i.test(flat(f)));
  ok('no callback or response-time promise', !/call you back|few minutes|within \d|response time|business day/i.test(text));
  ok('submit reads "Request a business quote"', /<button type="submit"[^>]*>\s*Request a business quote/.test(f));
  ok('the form submits nowhere in the prototype', /onsubmit="return false"/.test(f));
  ok('the success state is the approved sentence', /id="bq-success"[\s\S]*Thanks — your business inquiry has been submitted\./.test(f.replace(/\s[—–-]\s/g, ' — ')));
}

/* ── FAQ ─────────────────────────────────────────────────────────────────────── */
console.log('\nFAQ');
{
  const faq = section('business-faq');
  const QS = [
    'Can multiple people use PlagiarismSearch through one organization?',
    'Can an administrator control what organization members can access?',
    'How do organization and personal balances work together?',
    'Are checked documents automatically added to Organization Storage?',
    'Can Organization Storage be used as a plagiarism-checking source?',
    'Can we integrate plagiarism checking into our own platform?',
    'Can an organization use AI detection too?',
    'What happens to uploaded documents and reports?',
    'Do you offer custom pricing for larger organizations?',
  ];
  const found = [...faq.matchAll(/class="faq-q[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)].map(m => flat(m[1]));
  ok('the nine approved questions, in order', found.join('|') === QS.join('|'), found.length + ' found');
  ok('nine answers rendered in the HTML', (faq.match(/class="faq-a"/g) || []).length === 9);
  ok('the API answer links /plagiarism-api on its own phrase', /href="api\.html"[^>]*>Plagiarism API page</.test(faq));
  ok('the pricing answer links /prices on its own phrase', /href="prices\.html"[^>]*>Pricing page</.test(faq));
  ok('accordion controls are buttons with aria-expanded', (faq.match(/<button type="button" aria-expanded=/g) || []).length === 9);
}

/* ── forbidden / unconfirmed ─────────────────────────────────────────────────── */
console.log('\nforbidden');
{
  const BANNED = [
    ['superiority',                        /\bbest\b|\btop\b(?!ic)|most (reliable|accurate)|leading/i],
    ['plagiarism-free guarantee',          /plagiarism-free/i],
    ['privacy / security guarantees',      /(privacy|security) (is|are) guaranteed|enterprise-grade|certified|ISO ?\d|SOC ?2/i],
    ['deletion / storage absolutes',       /deleted forever|never stored|never leaves|always deleted/i],
    ['support hours / SLAs',               /24\/7|\bSLA\b|few minutes|priority support/i],
    ['universal API access or trial',      /free (API )?trial|every organization (has|gets) API|API access is included with every/i],
    ['SSO / departments / role tiers / seats / audit logs / analytics', /\bSSO\b|department|role tier|custom roles?|\bseats?\b|audit log|analytics|approval chain|project assignment/i],
    ['classes / assignments / LMS story',  /\bclass(es|room)?\b|assignments?\b|Moodle|Canvas|\bLMS\b|faculty|students?\b|institution/i],
    ['dedicated manager / discounts',      /dedicated (account )?manager|enterprise discount|\d+% (off|discount)/i],
    ['AI = plagiarism / authorship proof', /AI-generated text is plagiarism|proves authorship|AI accuracy|\d+% accura/i],
    ['normal checks feed Storage',         /automatically (added|adds|enters|stored) (to|in|into) (Organization )?Storage(?! \.)/i],
    ['customer counts relabelled',         /500,000\+? (customers|clients)/i],
    ['"what is plagiarism" filler',        /what is plagiarism|why plagiarism matters|benefits of plagiarism checking/i],
  ];
  for (const [label, re] of BANNED) {
    let hay = text;
    /* the two approved negations that contain a banned shape */
    hay = hay.replace(/does not automatically add the checked document to Organization Storage/g, '')
             .replace(/Are checked documents automatically added to Organization Storage\?/g, '');
    const m = hay.match(re);
    const i = m ? hay.search(re) : 0;
    ok('no ' + label, !m, m ? '"' + hay.slice(Math.max(0, i - 30), i + m[0].length + 30).trim() + '"' : '');
  }
}

/* ── links and structure ─────────────────────────────────────────────────────── */
console.log('\nstructure');
{
  const APPROVED = new Set(['https://plagiarismsearch.com/organization-management', 'api.html', 'ai-detector.html', 'prices.html', 'policy.html',
                            /* the consent sentence's Terms link — see gate G2 */ 'terms-of-use.html']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1]).filter(h => !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the brief’s destinations in the body', !extra.length, extra.join(', '));
  const anchors = [...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set(anchors)].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));
  ok('no stock imagery', !/<img\b/.test(body));
  ok('no diagram text baked into an image', !/<img\b/.test(section('business-and-teams') + section('organization-management') + section('organization-storage')));

  /* not the University page: none of its signature devices or copy */
  ok('not the University composition',
     !/Review[\s\S]{0,40}Manage[\s\S]{0,40}Integrate/.test(flat(section('business-and-teams'))) &&
     !/Where do your users already submit/.test(text) && !/Comparison sources/.test(text));
}

console.log('\ngates — open items, not defects');
console.log('  G1  /organization-management is linked absolutely to production; the prototype has');
console.log('      no page at that route. /plagiarism-database stays unlinked until it passes QA.');
console.log('  G2  The consent line reuses the site’s approved sentence ("I agree to the Terms of');
console.log('      Use and Privacy Policy."). The brief asks for approved production consent wording');
console.log('      and forbids inventing any — confirm this is the one, or supply the wording.');
console.log('  G3  The form is inert; validation, error messages, routing and consent handling are');
console.log('      the backend’s before launch.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches the Business & Teams brief'));
process.exit(failed ? 1 : 0);
