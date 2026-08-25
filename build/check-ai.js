/* Check site/ai-detector-v2.html against DEC-0038.

   Same discipline as check-home.js: the brief is specific enough to be testable, so it
   is tested rather than asserted. Every rule below quotes the clause it enforces.

   The forbidden list is the reason this file exists. DEC-0038 names claims that the old
   ai-detector.html carries in eight separate places — "No data storage", "Proven high
   accuracy", the GPT-5/Gemini/LLaMA/Mistral line, "results in seconds", "1,000 words
   free daily", "150 words on the spot". The likeliest failure here is not inventing a
   new claim but carrying an old one across, and a person rereading a 74KB page will not
   catch that reliably.

   AMENDED 2026-08-25 by the Visual & Interaction Correction Batch, which supersedes
   DEC-0038 on four points. Each amendment is marked below with the clause it follows,
   because the two documents now disagree and the newer one wins only where it speaks:

     · bracket placeholders go from REQUIRED-until-asset to BANNED outright
     · the report must carry real numeric values
     · 'Choose plan' is forbidden where a card holds more than one package
     · the checker states must not be listed anywhere as page content

   Run: node build/check-ai.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'ai-detector-v2.html';
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
function context(m) {
  const i = text.indexOf(m[0]);
  return text.slice(Math.max(0, i - 30), i + m[0].length + 30).trim();
}

/* -- page-level SEO ------------------------------------------------------ */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)]
    .map(m => m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
  ok('exactly one visible H1', h1s.length === 1, h1s.join(' | '));
  ok('H1 is "AI Detector for Text and Documents"',
     h1s[0] === 'AI Detector for Text and Documents', h1s[0]);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title',
     title === 'AI Detector &amp; AI Checker for Documents | PlagiarismSearch', title);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description',
     desc === 'Paste text or upload a document to check for AI-written content. Review AI Probability, Total AI Rate, and highlighted passages in one report.',
     desc.slice(0, 55) + '…');

  /* "Self-canonical to https://plagiarismsearch.com/ai-content-detector" */
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to /ai-content-detector',
     canon === 'https://plagiarismsearch.com/ai-content-detector', canon);

  /* "Do not lead the title/H1 with Free, Most Accurate, 99%, ChatGPT Detector, ..." */
  ok('H1 does not lead with a banned word',
     !/^(Free|Most Accurate|99|ChatGPT|GPT-5|Humanizer|Authenticity|Plagiarism)/i.test(h1s[0] || ''));
}

/* -- the ten approved sections, in the approved order --------------------- */
console.log('\nsection order');
{
  /* anchor, then the H2 the baseline fixes for it. Section 1 carries the H1 instead,
     and section 10 has no anchor in the baseline — it is given one so the order of
     all ten is checkable rather than only the nine that were named. */
  const ORDER = [
    ['ai-checker',           null],
    ['ai-report',            'Understand your AI detection report'],
    ['document-ai-checker',  'Check AI-written text in complete documents'],
    ['interpret-ai-results', 'Use AI detection as a signal, not a verdict'],
    ['ai-vs-plagiarism',     'AI-generated text and plagiarism are different'],
    ['ai-data-handling',     'Your AI check is processed on PlagiarismSearch infrastructure'],
    ['ai-api',               'Add AI detection to your own workflow'],
    ['ai-pricing',           'Choose an AI word package for your checking volume'],
    ['ai-detector-faq',      'AI Detector FAQ'],
    ['ai-final-cta',         'Check your text for AI-writing signals'],
  ];

  const seen = [...body.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m => m[1]);
  ok('ten sections carry the approved anchors in order',
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
    /* hero */
    'Paste text or upload a document to review AI-writing signals in a report that separates overall AI likelihood from the share and location of flagged passages.',
    'Paste text or upload a document',
    'Minimum: 100 characters. For a more reliable result, we recommend 150–200 words or more.',
    'Drag and drop a document here',
    /* the three metrics -- the page's whole reason for existing */
    'AI Probability',
    'The percentage likelihood that the analyzed text, considered as a whole, was AI-generated.',
    'Document-level likelihood',
    'Total AI Rate',
    'The share of the document made up of passages flagged as AI-generated.',
    'Share of flagged text',
    'Highlighted passages',
    'Location and passage-level signal',
    /* the interpretation callouts -- the differentiator DEC-0038 calls the signature */
    'AI Probability and Total AI Rate are not the same metric.',
    'These values are detection indicators, not proof of authorship.',
    'A 70% AI Probability does not mean that 70% of the text was written by AI.',
    /* free credit -- one-time, never daily */
    'New accounts receive a one-time 1,000-word credit that can be used for AI or plagiarism checking.',
    /* data handling */
    'AI checks are processed on PlagiarismSearch infrastructure. Checked content is not sent to an external AI detector provider.',
    /* API */
    'AI checking is available through the same PlagiarismSearch API infrastructure used for the main service. It is not a separate AI API product.',
  ];
  const missing = FIXED.filter(s => !has(s));
  ok(FIXED.length + ' approved strings present', !missing.length,
     missing.map(s => '"' + s.slice(0, 45) + '…"').join(' · '));

  /* AMENDED: 'Choose plan' was approved by DEC-0038 and is now forbidden — the batch
     calls a generic CTA over several packages a conversion defect, not a preference. */
  const CTAS = ['Check for AI', 'View AI pricing', 'Create free account', 'Check for plagiarism',
                'Read the Privacy Policy', 'Explore the PlagiarismSearch API', 'Visit the Help Center',
                'Start AI check'];
  const missingCta = CTAS.filter(s => !has(s));
  ok(CTAS.length + ' approved CTA labels present', !missingCta.length, missingCta.join(' · '));

  /* "Required tool states" -- all five, in the rendered HTML */
  const STATES = [
    'Please enter at least 100 characters or upload a document.',
    'Try another document or paste the text directly.',
    'Analyzing your text for AI-writing signals',
    'Your AI report is ready.',
    'have enough AI words for this check.',
  ];
  const missingState = STATES.filter(s => !has(s));
  ok('five tool states in the rendered HTML', !missingState.length,
     missingState.map(s => '"' + s.slice(0, 35) + '…"').join(' · '));
}

/* -- what the brief forbids ----------------------------------------------- */
console.log('\nforbidden');
{
  const BANNED = [
    ['no-data-storage',        /no data storage|never stored|never leaves your browser/i],
    ['accuracy absolutes',     /most accurate|99(\.9)?\s*%|highest accuracy|proven high accuracy/i],
    ['named AI models',        /\b(GPT-?5|GPT-?4|ChatGPT|Gemini|LLaMA|Mistral)\b/i],
    ['speed / SLA claim',      /results in seconds|within seconds|24\/7/i],
    ['1,000 words daily',      /1,?000 words? free daily|up to 1,?000 words daily/i],
    ['150 words, no account',  /150 words free|no account needed|no registration required/i],
    /* Asserting authorship proof is forbidden; DENYING it is approved copy and appears
       three times ("It cannot prove who wrote a text", "it is not proof of authorship").
       A bare /proves? who wrote/ fires on both, so the negated form is excluded below
       rather than here — see NEGATED. */
    ['authorship proof',       null],
    ['standalone AI API',      /AI (Content )?Detector API/i],
    ['universal API access',   /all users have api|every user has an api|every account includes an api/i],
    ['security absolutes',     /GDPR-compliant|military-grade|faultless security/i],
    ['audience-swapped SEO',   /AI detector for (students|teachers|writers|marketers|bloggers)/i],
  ];
  for (const [label, re] of BANNED) {
    if (!re) continue;
    const m = text.match(re);
    ok('no ' + label, !m, m ? '"' + context(m) + '"' : '');
  }

  /* NEGATED — claims that are forbidden as assertions and required as denials.
     Each hit is kept only if the words just before it do not negate it. */
  {
    const CLAIM = /proves? who wrote|proves? that ai|proof of authorship|certif\w+ human|guarantees? authenticity/gi;
    const NEG = /(cannot|can not|can't|does not|doesn't|do not|don't|is not|are not|never|no|nor|not)\s*$/i;
    const asserted = [];
    for (const m of text.matchAll(CLAIM)) {
      if (!NEG.test(text.slice(Math.max(0, m.index - 28), m.index))) asserted.push(m[0]);
    }
    ok('no authorship proof asserted', !asserted.length, asserted.join(' · '));
  }
}

/* -- structural rules ----------------------------------------------------- */
console.log('\nstructure');
{
  /* "FAQ answers must exist in rendered HTML even when presented in an accordion." */
  const faq = section('ai-detector-faq');
  ok('ten FAQ answers in the rendered HTML',
     (faq.match(/class="faq-a"/g) || []).length === 10,
     (faq.match(/class="faq-a"/g) || []).length + ' found');

  const QS = [
    'What does AI Probability mean?',
    'What does Total AI Rate mean?',
    'Why can AI Probability and Total AI Rate be different?',
    'Does a high AI Probability prove that a text was written by AI?',
    'Can I upload a document instead of pasting text?',
    'How much text should I check?',
    'What languages can the AI detector check?',
    'Is AI-generated text the same as plagiarism?',
    'What happens to my text and report after an AI check?',
    'Is AI checking free?',
  ];
  const missingQ = QS.filter(q => !faq.includes(q));
  ok('ten approved FAQ questions', !missingQ.length, missingQ.join(' · '));

  /* "Approved editorial destinations are intentionally narrow" -- four, and no more.
     account.html is the prototype's shared auth route, standing in for the approved
     /account/signup?from=/ai-content-detector flow the way every other page does. */
  const APPROVED = new Set(['index.html', 'policy.html', 'api.html', 'account.html',
                            'https://plagiarismsearch.com/faq-and-support']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1])
    .filter(h => !h.startsWith('mailto:') && !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the approved body destinations', !extra.length, extra.join(', '));

  /* "Do not render a second checker form." */
  ok('exactly one checker form', (body.match(/<form\b/g) || []).length === 1,
     (body.match(/<form\b/g) || []).length + ' form(s)');

  /* "An AI-only report must not show a Plagiarism percentage/source-match result."
     Scoped to a METRIC. A bare /plagiarism/ fires on the brand name, which the approved
     intro to this very section uses ("PlagiarismSearch separates the result into three
     levels") — so the negative lookahead keeps the company out of it. */
  const reportText = section('ai-report').replace(/<[^>]*>/g, ' ');
  const metric = reportText.match(
    /\bplagiarism(?!search)\s*(score|rate|percentage|%|match)|\bsimilarity\s*(score|rate|%)|source match/i);
  ok('report demo shows no plagiarism metric', !metric, metric ? '"' + metric[0] + '"' : 'in #ai-report');

  /* the eight approved AI word packages */
  const pricing = section('ai-pricing');
  const rows = ['10,000', '50,000', '100,000', '300,000', '500,000',
                '1,000,000', '3,000,000', '5,000,000'];
  const missingRow = rows.filter(r => !pricing.includes(r));
  ok('eight approved AI word packages', !missingRow.length, missingRow.join(', '));

  /* AMENDED — the rule reversed. DEC-0038 required bracket placeholders while the real
     asset was missing; the asset arrived with the 2026-08-25 batch, which bans them:
     "No bracket placeholder may appear in a user-facing mock or production build." */
  const ph = [...new Set(body.match(/\[REAL [A-Z\- ]+\]/g) || [])];
  ok('no bracket placeholders anywhere', !ph.length, ph.join(' '));

  /* AMENDED — and the other half of the same reversal: real values are now required.
     These are the product's own, from the report state supplied with the batch. */
  const report = section('ai-report');
  ok('report carries the real metric values',
     report.includes('13.44%') && report.includes('12.5%'),
     'Total AI rate 13.44% / AI probability 12.5%');

  /* AMENDED — "In the normal/default state there is no Checker states control,
     accordion, disclosure, debug list, or documentation block anywhere on the page."
     The five messages must still EXIST (asserted above); they must not be listed. */
  const hero = section('ai-checker');
  ok('no states listed as page content',
     !/Checker states/i.test(body) && !/<details/.test(hero), '');

  /* Each state ships hidden, and [hidden] has to actually win against Tailwind's
     display utilities — it did not, and five of them rendered. */
  ok('[hidden] is guarded against the display utilities',
     /\[hidden\]\s*\{\s*display:\s*none\s*!important/.test(html), '');

  /* AMENDED — the account block is a state of the checker, not a second standalone
     card below it. It must sit inside the one form. */
  ok('auth gate lives inside the checker card',
     /id="authGate"[^>]*hidden/.test(hero) &&
     hero.indexOf('id="authGate"') < hero.indexOf('</form>'), '');

  /* AMENDED — every package row is individually selectable and the CTA names it. */
  const pricing2 = section('ai-pricing');
  const radios = (pricing2.match(/type="radio"/g) || []).length;
  ok('all eight packages are selectable', radios === 8, radios + ' radio(s)');
  ok('no generic Choose plan CTA', !/Choose plan/.test(pricing2), '');
  ok('each group CTA names its package',
     (pricing2.match(/data-prefix="Continue with"/g) || []).length === 3,
     (pricing2.match(/data-prefix=/g) || []).length + ' of 3');
}

/* -- what DEC-0038 asks for that this repo cannot supply ------------------
   Printed every run rather than filed somewhere and forgotten. Neither is a defect
   in the page; both need someone outside this prototype. */
console.log('\noutstanding — not blockers for the page, but the brief is not closed');
console.log('  1  CLOSED 2026-08-25 — the approved real AI-only report state arrived with');
console.log('     the correction batch. The demo now carries its values.');
console.log('  2  The P0 Help Center AI FAQ hotfix (three replaced answers) has no target');
console.log('     here: site/help-center.html is a four-door landing page, not the FAQ list.');
console.log('     Those three answers live on production /faq-and-support, so the fix is');
console.log('     for that page, not this prototype.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches DEC-0038'));
process.exit(failed ? 1 : 0);
