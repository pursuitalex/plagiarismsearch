/* Check site/api-v2.html against DEC-0041.

   DEC-0041 ships its own FIXED-STRING CHECKLIST — eleven headings, three tab labels and
   six CTA labels it calls "intentionally machine-checkable". That table is transcribed
   below and enforced literally.

   The code contract gets the same treatment, and it is the reason this file matters
   most. The brief gives code the status of a product screenshot: Claude may highlight,
   truncate or animate it, but may not invent or rename an endpoint, property, status,
   auth method or version. Every line of the OLD api.html violates that — /api/v1
   against the real /api/v3/reports/create, 201 against 202, "callback" against
   callback_url, an invented report_url, and a Bearer literal the developer has NOT
   supplied. Those are asserted here so they cannot come back.

   Run: node build/check-api.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'api-v2.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
                 .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
                 .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<')
                 .replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

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
    .map(m => m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
  ok('exactly one visible H1', h1s.length === 1, h1s.join(' | '));
  ok('H1 is "Plagiarism Checker API"', h1s[0] === 'Plagiarism Checker API', h1s[0]);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title',
     title === 'Plagiarism Checker API &amp; Integration | PlagiarismSearch', title);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description',
     desc === 'Integrate plagiarism checking into your product with the PlagiarismSearch API. Send text, files, or URLs, configure search sources, and receive a webhook when the report is ready.',
     desc.slice(0, 55) + '…');

  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to /plagiarism-api',
     canon === 'https://plagiarismsearch.com/plagiarism-api', canon);

  /* "Do not lead the title/H1 with Free, Best, Most Accurate, AI Detector API, ..." */
  ok('H1 does not lead with a banned word',
     !/^(Free|Best|Most Accurate|AI Detector|Content Integrity|Heavy Demand|24h|14B)/i.test(h1s[0] || ''));
}

/* -- the eleven sections, in the approved DOM order ------------------------ */
console.log('\nsection order');
{
  /* Straight from the brief's FIXED-STRING CHECKLIST. Section 1 carries the H1;
     section 11 has no anchor in the baseline and is given one so all eleven are
     checkable rather than only the ten that were named. */
  const ORDER = [
    ['plagiarism-api',   null],
    ['api-inputs',       'Send text, documents, or public URLs'],
    ['api-configuration','Configure each plagiarism check around your workflow'],
    ['api-workflow',     'How the PlagiarismSearch API workflow works'],
    ['api-results',      'Use report status and result data in your own product'],
    ['api-use-cases',    'Build plagiarism checking into the workflow you already use'],
    ['api-resources',    'Move from evaluation to implementation'],
    ['api-access',       'Choose the API access path that fits your implementation'],
    ['api-quote',        'Request API access or a custom quote'],
    ['api-faq',          'Plagiarism API FAQ'],
    ['api-final-cta',    'Ready to evaluate the PlagiarismSearch API?'],
  ];

  const seen = [...body.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
  ok('eleven sections carry the approved anchors in order',
     seen.join(',') === ORDER.map(o => o[0]).join(','), seen.join(', ') || 'none');

  for (const [anchor, h2] of ORDER) {
    if (!h2) continue;
    const found = (section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]
      .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    ok('#' + anchor + ' H2', found === h2, found || '(missing)');
  }
}

/* -- the code contract ----------------------------------------------------
   "Code on this page has the same source-of-truth status as a real product
   screenshot." Present-and-correct first, then absent-and-fabricated. */
console.log('\ncode contract');
{
  const REQUIRED = [
    ['create endpoint',   'https://plagiarismsearch.com/api/v3/reports/create'],
    ['callback_url',      '"callback_url": "https://your.app/plagiarismsearch/web-hook?id=100500"'],
    ['version 3.1.0',     '"version": "3.1.0"'],
    ['202 accepted',      '"code": 202'],
    ['status_label',      '"status_label": "processing"'],
    ['progress field',    '"progress": 0.58'],
    ['completion event',  '"event": "report.checked"'],
    ['checked status',    '"status_label": "checked"'],
    ['word counts',       '"checked_words": 540'],
    ['self link',         '"self": "https://plagiarismsearch.com/api/v3/reports/100500"'],
  ];
  const missing = REQUIRED.filter(([, s]) => !has(s)).map(([l]) => l);
  ok(REQUIRED.length + ' approved contract facts present', !missing.length, missing.join(' · '));

  /* P0 AUTH GATE: "Claude must not change this to Bearer <token> until the exact
     preferred literal is supplied." The developer-supplied line, and nothing else. */
  ok('developer-supplied Authorization line, unaltered',
     has("'Authorization: your:authorization_token_123'"), '');
  ok('no invented Bearer literal', !/Bearer\s*[<{]|Bearer\s+your[-_]?token/i.test(text));

  const FABRICATED = [
    ['fake /api/v1 endpoint', /api\/v1/i],
    ['invented report_url',   /report_url/i],
    ['wrong 201 status',      /\b201\b/],
    ['legacy callback field', /"callback"\s*:/],
  ];
  for (const [label, re] of FABRICATED) ok('no ' + label, !re.test(text));

  /* "The code tabs are fixed: Request · Response · Webhook", in that order. */
  const hero = section('plagiarism-api');
  const tabs = [...hero.matchAll(/data-tab="([^"]+)"/g)].map(m => m[1]);
  ok('three code tabs in order', tabs.join(',') === 'Request,Response,Webhook',
     tabs.join(', ') || 'none');
}

/* -- fixed copy ------------------------------------------------------------ */
console.log('\nfixed copy');
{
  const FIXED = [
    'Embed plagiarism checking into your product or workflow. Send text, documents, or public URLs, choose the search sources and scan settings you need, and receive a webhook when the report is ready.',
    'Build plagiarism checking into your own application.',
    'Submit the content format your workflow already uses.',
    'Receive a callback when the report has finished processing.',
    'The API accepts the report and returns its ID while processing continues asynchronously.',
    'When the check is complete, PlagiarismSearch sends a report.checked event to the callback URL supplied with the request.',
    'Use the input method that fits the content already available in your system. Standard text and URL requests can use JSON, while document uploads use multipart form data.',
    'Choose where the API searches and adjust the options that matter for each check instead of using the same scan configuration for every document.',
    '500M+ indexed academic texts',
    'Your integration does not need to wait for the plagiarism check to finish before continuing other work.',
    'AI checking is available through the same PlagiarismSearch API infrastructure. AI analysis uses the AI word balance available to the account.',
    'Share your integration requirements and expected volume.',
  ];
  const missing = FIXED.filter(s => !has(s));
  ok(FIXED.length + ' approved strings present', !missing.length,
     missing.map(s => '"' + s.slice(0, 45) + '…"').join(' · '));

  /* the brief's checklist, verbatim */
  const CTAS = ['View API documentation', 'Request API access', 'View pricing',
                'Open API documentation', 'See the complete response schema',
                'View the full API reference', 'Your API request has been sent'];
  const missingCta = CTAS.filter(s => !has(s));
  ok(CTAS.length + ' checklist strings present', !missingCta.length, missingCta.join(' · '));

  /* "The primary hero CTA is View API documentation; Request API access is secondary." */
  const hero = section('plagiarism-api');
  const first = hero.indexOf('View API documentation');
  const second = hero.indexOf('Request API access');
  ok('documentation is the primary hero CTA', first > -1 && second > -1 && first < second,
     first > -1 && second > -1 ? 'docs at ' + first + ', access at ' + second : 'one is missing');
}

/* -- what the brief forbids ------------------------------------------------ */
console.log('\nforbidden');
{
  const BANNED = [
    ['<24h integration',    /less than 24|<\s*24\s*h|24 hours? to integrat|24h (setup|integration)/i],
    ['14B pages',           /\b14\s*b(illion)?\b|14,000,000,000/i],
    ['a numeric language count', /\b\d+\s+languages\b/i],
    ['batch submission',    /batch (submission|upload|check|processing)/i],
    ['instant support',     /instant (help|support)|response in a few minutes|call you back|24\/7/i],
    ['universal free trial',/free trial|30-day|100 submissions|test .{0,20}for free/i],
    ['universal API access',/every (user|account) (has|includes|gets)|all users have api/i],
    ['standalone AI API',   /AI (Content )?Detector API|separate AI API/i],
    ['undocumented tooling',/\bSDK\b|Postman|sandbox|rate limit|uptime|\bSLA\b/i],
    ['generic filler',      /various integration methods|extended functionality|perfect for any organization|built for heavy demand/i],
    ['Moodle as an API mechanic', /moodle/i],
    ['duplicate audience cards',  /\bschools\b[\s\S]{0,80}\buniversities\b[\s\S]{0,80}\bcolleges\b/i],
  ];
  for (const [label, re] of BANNED) {
    const m = text.match(re);
    const i = m ? text.search(re) : 0;
    ok('no ' + label, !m,
       m ? '"' + text.slice(Math.max(0, i - 30), i + m[0].length + 30).trim() + '"' : '');
  }
}

/* -- structural rules ------------------------------------------------------ */
console.log('\nstructure');
{
  /* "Exactly nine FAQ questions/answers are rendered in the initial implementation." */
  const faq = section('api-faq');
  ok('nine FAQ answers in the rendered HTML',
     (faq.match(/class="faq-a"/g) || []).length === 9,
     (faq.match(/class="faq-a"/g) || []).length + ' found');

  /* "Exactly three input concepts are presented: Text, Documents, Public URLs." */
  const inputs = section('api-inputs');
  ok('three input concepts', (inputs.match(/<h3\b/g) || []).length === 3,
     (inputs.match(/<h3\b/g) || []).length + ' found');
  ok('JSON paired with text/URL, multipart with upload',
     inputs.includes('JSON') && inputs.includes('Multipart upload') && inputs.includes('URL input'));

  /* "Four steps stay in order Submit → Configure → Process → Receive." */
  const wf = section('api-workflow').replace(/<[^>]*>/g, ' ');
  const steps = ['Submit', 'Configure', 'Process', 'Receive'];
  const idx = steps.map(s => wf.indexOf(s));
  ok('four workflow steps in order',
     idx.every((v, i) => v > -1 && (i === 0 || v > idx[i - 1])), steps.join(' → '));

  /* "Exactly three workflow cards/paths." */
  const uc = section('api-use-cases');
  ok('three use-case cards', (uc.match(/<h3\b/g) || []).length === 3,
     (uc.match(/<h3\b/g) || []).length + ' found');

  /* Q&A GATE: "Do not render the API FAQ & troubleshooting resource card yet." */
  ok('stale API Q&A is not linked',
     !body.includes('plagiarismsearch-api-questions-and-answers'));

  /* the approved quote-form data model */
  const quote = section('api-quote');
  const FIELDS = ['Jordan Reeves', 'name@company.com', 'Company, university, or platform',
                  '+1 555 000 0000', 'e.g. 1,000,000 words'];
  const missingField = FIELDS.filter(f => !quote.includes(f));
  ok('five approved form placeholders', !missingField.length, missingField.join(' · '));
  ok('no social fields', !/facebook|linkedin/i.test(quote));
  ok('phone is marked Optional, not required', /Optional/.test(quote));

  /* "Approved internal destinations must use real crawlable <a href> links." */
  const APPROVED = new Set(['prices.html', 'terms-of-use.html', 'policy.html',
                            'https://plagiarismsearch.com/docs/']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(h => !h.startsWith('mailto:') && !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the approved body destinations', !extra.length, extra.join(', '));

  /* "Do not use click handlers as the only navigation mechanism." */
  ok('documentation is reachable above the fold',
     section('plagiarism-api').includes('href="https://plagiarismsearch.com/docs/"'));
}

/* -- what DEC-0041 gates rather than forbids ------------------------------- */
console.log('\ngates — open items, not defects');
console.log('  P0  The preferred public Bearer header literal is still unsupplied. The page');
console.log('      ships the developer-supplied Authorization line; only that one line is');
console.log('      replaced once the literal is confirmed.');
console.log('  P0  /plagiarismsearch-api-questions-and-answers stays unlinked until it is');
console.log('      factually synchronized with API 3.1.0.');
console.log('  P1  Pricing and entitlements come from the commercial source of truth, not');
console.log('      from this page — no plan cards are hardcoded here.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches DEC-0041'));
process.exit(failed ? 1 : 0);
