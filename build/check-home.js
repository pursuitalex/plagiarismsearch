/* Check site/index-v2.html against DEC-0030.

   The brief is specific enough to be testable, so it is tested rather than asserted.
   Every rule below quotes the clause it enforces.

   Run: node build/check-home.js
*/
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'site', 'index-v2.html'), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
                 .replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ')
                 .replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

/* ── SEO / HTML requirements ────────────────────────────────────────────── */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
  ok('exactly one visible H1', h1s.length === 1, h1s.join(' | '));
  ok('H1 is "Plagiarism Checker"', h1s[0] === 'Plagiarism Checker', h1s[0]);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'Plagiarism Checker – Check Text Online | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc.startsWith('Check text for plagiarism online.'), desc.slice(0, 60) + '…');

  /* "Do not lead the title or H1 with Free, AI Detector, Similarity Checker, ..." */
  ok('H1 does not lead with a banned word',
     !/^(Free|AI Detector|Similarity Checker|Content Integrity|Best|Most Accurate|99%)/i.test(h1s[0] || ''));
}

/* ── the thirteen blocks, in the approved order ─────────────────────────── */
console.log('\nsection order');
{
  const ORDER = [
    'Plagiarism Checker',                                    // 1 hero (h1)
    null,                                                    // 2 trust rail — no mandatory H2
    null,                                                    // 3 integrations rail — label only
    'See the evidence behind every match',                   // 4
    'Control what your plagiarism check includes',           // 5
    'Plagiarism and AI checks answer different questions',   // 6
    'Know what happens to your document',                    // 7
    'Use PlagiarismSearch in the workflow you already have', // 8
    'For individual checks, education, and teams',           // 9
    'What users say about PlagiarismSearch',                 // 10
    'Choose a one-time plan',                                // 11
    'Plagiarism Checker FAQ',                                // 12
    'Check your text for plagiarism',                        // 13
  ];
  const sections = [...body.matchAll(/<section\b[\s\S]*?(?=<section\b|$)/g)].map(m => m[0]);
  ok('thirteen sections', sections.length === 13, sections.length + ' found');

  const heads = sections.map(s => {
    const m = s.match(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/);
    return m ? m[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim() : null;
  });
  const wrong = ORDER.map((want, i) => want && heads[i] !== want ? (i + 1) + ': "' + heads[i] + '"' : null).filter(Boolean);
  ok('every heading in the approved order', !wrong.length, wrong.join('; '));
}

/* ── fixed copy and CTA labels ──────────────────────────────────────────── */
console.log('\nfixed copy');
{
  const MUST = [
    'Find matching passages and sources, review similarity in context',
    'Paste or type your text here',
    '150 words free — no registration required.',
    'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX',
    '500,000+ users',
    'Plagiarism checking in 80+ languages',
    'BBB Accredited',
    'Integrations & API',
    'PlagiarismSearch surfaces matching text and sources for review',
    'over 500 million indexed academic texts',
    'AI-generated text is not automatically plagiarism',
    'The uploaded file is not retained as a stored source document.',
    'AI checks are processed on PlagiarismSearch infrastructure.',
  ];
  const missing = MUST.filter(s => !text.includes(s));
  ok(MUST.length + ' fixed strings present verbatim', !missing.length, missing.join(' | '));

  const CTAS = ['Check for plagiarism', 'Explore AI Detector', 'Read our Privacy Policy',
                'View Moodle integration', 'Explore API', 'Canvas integration', 'Google Docs add-on',
                'For students', 'Education & Institutions', 'Business & Teams',
                'Read more reviews', 'See all pricing options'];
  const noCta = CTAS.filter(c => !text.includes(c));
  ok(CTAS.length + ' approved CTA labels present', !noCta.length, noCta.join(' | '));

  const labels = ['Matched passage', 'Matching source', 'Source context', 'Similarity',
                  'Citations', 'References', 'AI probability'];
  ok('all seven report labels present', labels.every(l => text.includes(l)),
     labels.filter(l => !text.includes(l)).join(' | '));
}

/* ── what the brief forbids ─────────────────────────────────────────────── */
console.log('\nforbidden');
{
  const BANNED = [
    [/\bESL\b/i,                          'ESL claim'],
    [/false[- ]positive/i,                'false-positive claim'],
    [/\d{2}(\.\d)?\s*%\s*accura/i,        'accuracy percentage'],
    [/\b\d+\s*B\+?\s+(indexed\s+)?pages/i,'billions-of-pages claim'],
    [/17\s+languages/i,                   '17 languages'],
    [/500,?000\+?\s+(writers|customers)/i,'500,000 writers/customers'],
    [/Turnitin/i,                         'Turnitin reference'],
    [/Plagiarism\s+\d+(\.\d)?\s*%/i,      'definitive plagiarism verdict'],
    [/100%\s+(original|authentic)/i,      'originality absolute'],
    [/\bChatGPT|Claude|Gemini|Llama\b/,   'named-model coverage'],
    [/\bVIP\b|Quote Checker|PDF Plagiarism|PowerPoint Plagiarism/, 'body link to a footer-only page'],
    [/military[- ]grade|never stored|no data storage/i, 'banned security wording'],
  ];
  const hits = BANNED.filter(([re]) => re.test(text)).map(([, name]) => name);
  ok('no forbidden claim in the page body', !hits.length, hits.join(', '));

  /* Prices. The brief forbids hardcoding them; Olex set that aside on 2026-08-18 so the
     pricing block can be judged as a design. The section becomes a widget later and the
     figures go with it.

     Reported, not asserted — and reported against the whole file, not the body. The
     figures are injected by script, so a body-only check would print a serene "ok"
     beside a page that visibly shows $9.95, which is worse than a failure. */
  {
    const prices = [...new Set([...html.matchAll(/\$\d+(?:\.\d\d)?/g)].map(m => m[0]))];
    console.log('  ' + (prices.length ? 'WAIVED' : 'ok    ') + ' hardcoded prices' +
      (prices.length ? '  ' + prices.length + ' figures, deviation recorded 2026-08-18'
                     + '  (' + prices.slice(0, 4).join(', ') + '…)' : ''));
    ok('no price baked into the static body markup', !/\$\s?\d/.test(text));
  }
}

/* ── structural rules ───────────────────────────────────────────────────── */
console.log('\nstructure');
{
  ok('one checker form, and no second one in the final CTA',
     (body.match(/<form\b/g) || []).length === 1 && (body.match(/<textarea\b/g) || []).length === 1);
  ok('the form is inert', !/\baction=/.test(body) && /onsubmit="return false"/.test(body));

  const faqAnswers = (body.match(/class="faq-a"/g) || []).length;
  ok('nine FAQ answers in the rendered HTML', faqAnswers === 9, faqAnswers + ' found');

  /* "roughly 8–12 meaningful unique body destinations".

     Internal only. The rule is a site-architecture guideline about where the homepage
     sends link equity, so an attribution link to Trustpilot is not one of its
     destinations — counting them failed the page for citing its own sources. External
     links are still printed, because they should never grow unnoticed either. */
  const all = new Set([...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1]));
  const internal = [...all].filter(h => !/^https?:/.test(h));
  const external = [...all].filter(h => /^https?:/.test(h));
  ok('8–12 unique internal body destinations', internal.length >= 8 && internal.length <= 12,
     internal.length + ': ' + internal.join(', '));
  console.log('  ok    ' + external.length + ' external link(s)  ' +
     external.map(h => h.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]).join(', '));

  /* the AI checkbox must default to off, plagiarism to on */
  ok('plagiarism checked by default, AI not',
     /id="optPlag" checked/.test(body) && !/id="optAI" checked/.test(body));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'index-v2.html matches DEC-0030'));
process.exit(failed ? 1 : 0);
