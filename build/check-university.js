/* Check site/university-plagiarism-checker.html against DEC-0043.

   This page replaced a stub, so unlike the others there is no previous version to fall
   back on and no switcher — which makes the checks the only safety net.

   Two rules here have no equivalent on the other pages, and both exist because the brief
   says the same thing twice: Organization Storage must never read as automatic ingestion
   of every checked document, and the report must never read as a misconduct verdict.
   Those are the claims that would do real damage to an institution evaluating the
   product, so they are asserted directly rather than left to the forbidden-word sweep.

   Run: node build/check-university.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'university-plagiarism-checker.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
                 .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
                 .replace(/&#39;/g, "'").replace(/&hellip;/g, '…')
                 .replace(/\s+/g, ' ').trim();

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

/* -- page-level SEO ------------------------------------------------------- */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)]
    .map(m => m[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim());
  ok('exactly one visible H1', h1s.length === 1, h1s.join(' | '));
  ok('H1 is "University Plagiarism Checker"',
     h1s[0] === 'University Plagiarism Checker', h1s[0]);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title',
     title === 'University Plagiarism Checker for Higher Education | PlagiarismSearch', title);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description',
     desc === 'Manage plagiarism checking across your institution with source reports, organization permissions, shared Storage, Moodle workflows, and API integration.',
     desc.slice(0, 55) + '…');

  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to /university-plagiarism-checker',
     canon === 'https://plagiarismsearch.com/university-plagiarism-checker', canon);
}

/* -- the twelve sections, in the approved DOM order ----------------------- */
console.log('\nsection order');
{
  const ORDER = [
    ['university-plagiarism-checker', null],
    ['institutional-report',     'Give educators evidence they can review'],
    ['institutional-management', 'Manage people, permissions, and checking balances across your institution'],
    ['institutional-sources',    'Compare academic work with external and institutional sources'],
    ['institutional-workflow',   'Use PlagiarismSearch in the workflow that fits your institution'],
    ['moodle',                   'Bring plagiarism checking into Moodle'],
    ['institutional-roles',      'Different roles, one institutional plagiarism-checking workflow'],
    ['institutional-data',       'Keep plagiarism checking and institutional Storage under separate controls'],
    ['institutional-ai',         'Need AI checking as part of the same institutional setup?'],
    ['institutional-inquiry',    'Discuss plagiarism checking for your institution'],
    ['institutional-faq',        'University Plagiarism Checker FAQ'],
    ['institutional-cta',        'Build a plagiarism-checking workflow that fits your institution'],
  ];

  const seen = [...body.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
  ok('twelve sections carry the approved anchors in order',
     seen.join(',') === ORDER.map(o => o[0]).join(','), seen.join(', ') || 'none');

  for (const [anchor, h2] of ORDER) {
    if (!h2) continue;
    const found = (section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]
      .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    ok('#' + anchor + ' H2', found === h2, found || '(missing)');
  }
}

/* -- fixed copy ----------------------------------------------------------- */
console.log('\nfixed copy');
{
  const FIXED = [
    'Support academic integrity with plagiarism checking your institution can manage.',
    'For universities, colleges, academic departments, and other educational institutions.',
    'A similarity result is evidence for review, not an automatic decision that academic misconduct occurred.',
    'A similarity percentage should be interpreted together with the underlying matches, sources, citations, and context.',
    'PlagiarismSearch Organization Management gives administrators a central place to manage who can use institutional resources',
    'Personal balance is not shared with other members of the organization.',
    'more than 500 million indexed academic texts',
    'A document does not automatically become part of Organization Storage simply because it was checked.',
    'AI-generated text is not automatically plagiarism, so plagiarism checking and AI detection should be interpreted as separate results.',
    'Tell us how your institution plans to manage users, checking volume, Storage, and integrations.',
    'Your institutional request has been sent',
  ];
  const missing = FIXED.filter(s => !has(s));
  ok(FIXED.length + ' approved strings present', !missing.length,
     missing.map(s => '"' + s.slice(0, 44) + '…"').join(' · '));

  const CTAS = ['Request institutional pricing', 'See how it works',
                'Explore Organization Management', 'View Moodle integration',
                'View the Moodle integration guide', 'Explore the API',
                'Learn about AI detection', 'Read the Privacy Policy'];
  const missingCta = CTAS.filter(s => !has(s));
  ok(CTAS.length + ' approved CTA labels present', !missingCta.length, missingCta.join(' · '));
}

/* -- the two claims the brief protects twice ------------------------------ */
console.log('\nproduct semantics');
{
  /* "Organization Storage is never presented as automatic ingestion of every checked
     document." Both the sources section and FAQ 5 must carry the denial. */
  ok('Storage clarification present in the sources section',
     /does not by itself mean that the document becomes part of Organization Storage/.test(
       section('institutional-sources').replace(/<[^>]*>/g, ' ')), '');
  ok('Storage clarification present in the FAQ',
     /does not automatically make the document part of Organization Storage/.test(
       section('institutional-faq').replace(/<[^>]*>/g, ' ')), '');

  /* "The report identifies matching and similar passages ... Educators should review" */
  ok('report is framed as evidence, not a verdict',
     has('evidence for review, not an automatic decision') &&
     /Educators should review the matches, citations, references, and surrounding context/.test(text), '');

  /* "500M+ is explicitly academic texts, not web pages or clients" */
  const fiveHundred = [...text.matchAll(/500 million[^.]{0,40}/g)].map(m => m[0]);
  ok('every 500M claim is about academic texts',
     fiveHundred.length > 0 && fiveHundred.every(m => /academic texts/.test(m)),
     fiveHundred.join(' | '));
}

/* -- what the brief forbids ----------------------------------------------- */
console.log('\nforbidden');
{
  const BANNED = [
    ['punitive framing',        /catch cheat|stop cheating|students always copy|misconduct verdict/i],
    ['accuracy absolutes',      /most accurate|highest accuracy|guaranteed detection|perfect plagiarism/i],
    /* Asserting automatic ingestion is forbidden; ASKING about it and answering No is
       approved FAQ copy — question 5 exists precisely to deny it. A bare pattern fires
       on both, so this one is handled below with the question and the denial excluded. */
    ['automatic ingestion', null],
    ['cross-institution corpus',/global student.paper (database|repository)|shared student.paper corpus/i],
    ['native classes',          /native (classes|assignments)|gradebook/i],
    ['unverified enterprise',   /\bSSO\b|single sign.on|FERPA|SOC ?2|ISO ?27|FEDRAMP|analytics dashboard/i],
    ['other LMS',               /\bCanvas\b|Blackboard|Brightspace|Google Classroom/i],
    ['a numeric language count',/\b\d+\+?\s+languages\b/i],
    ['processing / support SLA',/1.5 minute|24\/7|instant (help|support)|response time/i],
    ['legacy institutional price', /\$145\.95|145\.95/],
    ['universal trial',         /free trial for every|universal trial|free API trial/i],
    ['legacy metrics',          /500,000 Clients|76\.8%|1000\+ Scholarly/i],
    ['AI accuracy or models',   /\b(GPT-?[45]|ChatGPT|Gemini|LLaMA|Mistral)\b|AI accuracy/i],
    ['generic filler',          /future cooperation|innovative algorithm|extended functionality/i],
  ];
  for (const [label, re] of BANNED) {
    if (!re) continue;
    const m = text.match(re);
    const i = m ? text.search(re) : 0;
    ok('no ' + label, !m,
       m ? '"' + text.slice(Math.max(0, i - 28), i + m[0].length + 28).trim() + '"' : '');
  }

  /* ASSERTED-ONLY — automatic Storage ingestion. Kept only if the sentence is neither a
     question nor immediately denied. */
  {
    const CLAIM = /every checked (student )?paper automatically|automatically enters? Organization Storage|automatically (make|makes|becomes? part of) [^.?]{0,30}Organization Storage/gi;
    const asserted = [];
    for (const m of text.matchAll(CLAIM)) {
      const after = text.slice(m.index + m[0].length, m.index + m[0].length + 12);
      const before = text.slice(Math.max(0, m.index - 24), m.index);
      /* The approved FAQ asks this exact thing and answers No, so a bare pattern fires
         on the denial as loudly as it would on the claim. A hit counts only when it is
         neither a question nor immediately negated. */
      const isQuestion = after.includes('?');
      const isDenied = /^\s*\?\s*No\b/.test(after) || /\b(not|does not|No\.)\s*$/i.test(before);
      if (!isQuestion && !isDenied) asserted.push(m[0]);
    }
    ok('no automatic Storage ingestion asserted', !asserted.length, asserted.join(' · '));
  }
}

/* -- structural rules ------------------------------------------------------ */
console.log('\nstructure');
{
  /* "Exactly five approved capability ideas" */
  ok('five Organization Management capabilities',
     (section('institutional-management').match(/<h3\b/g) || []).length === 5,
     (section('institutional-management').match(/<h3\b/g) || []).length + ' found');

  /* "Exactly three deployment paths" */
  ok('three deployment paths',
     (section('institutional-workflow').match(/<h3\b/g) || []).length === 3,
     (section('institutional-workflow').match(/<h3\b/g) || []).length + ' found');

  /* "All six approved Moodle control concepts remain present" */
  ok('six Moodle controls',
     (section('moodle').match(/<h3\b/g) || []).length === 6,
     (section('moodle').match(/<h3\b/g) || []).length + ' found');

  /* "Exactly three roles ... Students are not added as a fourth SEO persona card" */
  const roles = section('institutional-roles');
  ok('three roles', (roles.match(/<h3\b/g) || []).length === 3,
     (roles.match(/<h3\b/g) || []).length + ' found');
  ok('no Students role card', !/<h3[^>]*>\s*Students\s*</.test(roles));

  /* eleven FAQ items, answers rendered */
  const faq = section('institutional-faq');
  ok('eleven FAQ answers in the rendered HTML',
     (faq.match(/class="faq-a"/g) || []).length === 11,
     (faq.match(/class="faq-a"/g) || []).length + ' found');

  /* the approved institutional form model */
  const form = section('institutional-inquiry');
  const PLACEHOLDERS = ['Jordan Reeves', 'name@university.edu', 'University or college name',
                        'e.g. 5,000 students or users', 'e.g. 2,000 documents or 1,000,000 words',
                        'https://moodle.university.edu'];
  ok('six approved form placeholders', PLACEHOLDERS.every(p => form.includes(p)),
     PLACEHOLDERS.filter(p => !form.includes(p)).join(' · '));
  ok('no phone, Facebook or LinkedIn field', !/phone|facebook|linkedin/i.test(form));
  ok('the Moodle URL field is conditional', /id="moodleField"[^>]*hidden/.test(form));
  ok('consent control present with both destinations',
     form.includes('I agree to the') && form.includes('terms-of-use.html') && form.includes('policy.html'));

  /* "Do not place an individual plagiarism-checker input in this hero" */
  ok('no checker input in the hero', !/<textarea|<input/.test(section('university-plagiarism-checker')));

  /* the approved link policy, and nothing else */
  const APPROVED = new Set(['integration-guide.html', 'api.html', 'ai-detector.html',
                            'policy.html', 'terms-of-use.html',
                            'https://plagiarismsearch.com/organization-management']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(h => !h.startsWith('mailto:') && !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the approved body destinations', !extra.length, extra.join(', '));
}

console.log('\ngates — open items, not defects');
console.log('  ASSET  No Organization Management or Moodle screenshots exist in this repo, and');
console.log('         DEC-0043 forbids inventing product UI in their place. Those two sections');
console.log('         are built from structure and type; supply real captures and they can be');
console.log('         framed in without touching the copy.');
console.log('  FORM   Validation and submission belong to the shared backend. Only the');
console.log('         conditional Moodle reveal is implemented here, since it is a layout rule.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches DEC-0043'));
process.exit(failed ? 1 : 0);
