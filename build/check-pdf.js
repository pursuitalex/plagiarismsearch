/* Check site/pdf-plagiarism-checker.html against the PDF Plagiarism Checker brief of
   2026-09-15.

   Protect-first: the title, route and H1 are asserted exactly; the approved copy is
   asserted verbatim; the extraction semantics — no OCR, scan-only yields no text — are
   asserted both as copy present and as claims absent; the checker is one, real and
   first; the P0 legacy claims are hunted by pattern.

   Run: node build/check-pdf.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'pdf-plagiarism-checker.html';
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

/* ── protect-first: title, route, H1 ────────────────────────────────────────── */
console.log('protect-first');
{
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('the launch title is KEPT', title === 'PDF Plagiarism Checker – Scan Your PDFs for Plagiarism', title);
  ok('the title was not "optimised"', !/free pdf|ai pdf|originality/i.test(title || ''));
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, "PDF Plagiarism Checker"', h1s.length === 1 && h1s[0] === 'PDF Plagiarism Checker', h1s.join(' | '));
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Upload a PDF directly and check its extractable text for matching sources. Review highlighted matches and source evidence in a clear plagiarism report.', desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the existing route', canon === 'https://plagiarismsearch.com/pdf-plagiarism-checker', canon);
  ok('no noindex', !/noindex/.test(html.slice(0, html.indexOf('<body'))) || /noindex, nofollow/.test(html.slice(0, html.indexOf('<body'))) /* the prototype-wide robots meta, same as every page */);
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

/* ── the information jobs ───────────────────────────────────────────────────── */
console.log('\ninformation jobs');
{
  const H2S = [
    ['how-to-check-a-pdf',   'How to check a PDF for plagiarism'],
    ['pdf-text-extraction',  'What text can be checked in a PDF?'],
    ['pdf-report',           'Review matches and sources from your PDF'],
    ['sources-and-settings', 'Choose what your PDF is checked against'],
    ['pdf-handling',         'Know what happens to your uploaded PDF'],
    ['start-free',           'Start with a free PDF check'],
    ['pdf-faq',              'PDF Plagiarism Checker FAQ'],
    ['pdf-cta',              'Check your PDF for plagiarism'],
  ];
  for (const [anchor, h] of H2S) {
    const found = flat((section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + anchor + ' H2', found === h, found || '(missing)');
  }
  ok('"How to check a PDF for plagiarism" is a real H2, once', (body.match(/How to check a PDF for plagiarism/g) || []).length === 1);
  const EYEBROWS = ['How It Works', 'PDF Text Extraction', 'Plagiarism Report', 'Sources & Settings', 'PDF & Report Handling', 'Start Free'];
  ok('the six approved eyebrows present', EYEBROWS.every(e => text.toLowerCase().includes(e.toLowerCase())),
     EYEBROWS.filter(e => !text.toLowerCase().includes(e.toLowerCase())).join(' · '));
}

/* ── the approved baseline, verbatim ────────────────────────────────────────── */
console.log('\napproved copy');
{
  const COPY = [
    'Upload a PDF directly - no copying or file conversion required. PlagiarismSearch checks the extractable text in your PDF against the sources enabled for the check and shows matching passages and sources in a clear report.',
    '150 words free - no registration required.',
    'File size limit: 2 MB for guests and 24 MB when signed in. Upload up to 10 files at once.',
    'Using a scanned PDF?',
    'You can upload a PDF directly without converting it to another format. The checker extracts the machine-readable text in the file, runs the plagiarism search using your selected settings, and returns the matches and sources found for review.',
    'Upload your PDF', 'Drag and drop the PDF or select it from your device. You can upload up to 10 files at once. The upload size limit is 2 MB for guests and 24 MB when signed in.',
    'Choose your plagiarism settings', 'Select the source collections and exclusions that fit your check. Available options can include web search, academic database search, storage sources, reference exclusion, and in-text citation exclusion.',
    'Review the matches and sources', 'Open the completed report to inspect matching or similar passages and the sources found for them. Review each result in context before deciding whether the text needs attention.',
    'A PDF can contain machine-readable text, page images, or a combination of both. PlagiarismSearch checks the text that can be extracted from the PDF file; it does not perform OCR on text that exists only inside images.',
    'Text-based PDF', 'Text stored in the PDF’s text layer can be extracted and submitted for plagiarism checking.',
    'Scan-only PDF', 'If the PDF contains only scanned page images and no text layer, PlagiarismSearch cannot read the visible words with OCR. The file will not provide text for the plagiarism check.',
    'Mixed PDF', 'If a PDF contains both extractable text and image-only pages, PlagiarismSearch checks the extractable text. Text that exists only inside scanned images is not analyzed.',
    'If you need to check a scan-only document, create a searchable PDF with a text layer before uploading it.',
    'The report highlights matching or similar passages extracted from your document and lists the sources found for them. Select a match to review the corresponding source and inspect the result in context.',
    'See which extracted passages matched or closely resembled text found in the selected sources.',
    'Review the sources connected to each reported match.',
    'Select a match to focus on the relevant source and examine the result before deciding what it means.',
    'A match is evidence for review, not an automatic plagiarism verdict.',
    'PDF is the input format. The sources searched during a plagiarism check are determined by the settings you choose, not by the PDF file extension.',
    'Search available web sources for matching or similar text.',
    'Enable academic database search when you want to compare the document with indexed academic material. PlagiarismSearch provides access to over 500 million indexed academic texts when academic database search is enabled.',
    'Exclude references or in-text citations when those exclusions fit the document and the purpose of your review.',
    'Personal or organization storage can also be used as comparison sources when they are available for the account and enabled for the check.',
    'Your PDF is processed to perform the checks you select. The uploaded source document and the generated report have different retention behavior.',
    'The uploaded source document is not retained as a stored source document.',
    'A generated report may remain available in your account for convenient access.',
    'You can permanently delete reports from your account.',
    'Adding content to Storage is a separate action you control. Running a plagiarism check does not automatically add the PDF to Storage.',
    'You can check up to 150 plagiarism words without registering. Registered users receive 300 plagiarism words per day.',
    'If you need to check more text, view the current plagiarism plans and choose the option that fits your usage.',
    'One-time purchased plagiarism quota does not expire.',
    'Upload your PDF and review matching passages and sources without converting the document to another format.',
  ];
  const missing = COPY.filter(s => !has(s));
  ok(COPY.length + ' approved strings present, unreworded', !missing.length, missing.slice(0, 3).map(s => '"' + s.slice(0, 44) + '…"').join(' · '));
  const CTAS = ['Check for plagiarism', 'Check my PDF', 'View pricing', 'Read the Privacy Policy', 'Upload a PDF'];
  ok('approved CTA labels present', CTAS.every(c => has(c)), CTAS.filter(c => !has(c)).join(' · '));
}

/* ── the checker: one, real, first ──────────────────────────────────────────── */
console.log('\nthe checker');
{
  const hero = section('pdf-checker');
  ok('the hero is the first section', body.indexOf('id="pdf-checker"') < body.indexOf('<section', body.indexOf('<section') + 1));
  ok('the hero carries the shared form (build/checker.js)', /<textarea id="checkText"/.test(hero) && /class="qc-drop/.test(hero) && /id="optPlag" checked/.test(hero));
  ok('plagiarism is the checked control; AI is optional and not the story', /id="optAI" class/.test(hero) && !/id="optAI" checked/.test(hero) && !/AI (detector|detection)/i.test(flat(hero)));
  ok('exactly one form on the page', (body.match(/<form\b/g) || []).length === 1);
  ok('the form sits first at lg (upload is the job)', /lg:col-start-1 lg:row-start-1 lg:row-span-2">[\s\S]*<textarea/.test(hero));
  ok('on a phone the order is H1 → form → limits', hero.indexOf('<h1') < hero.indexOf('<textarea') && hero.indexOf('<textarea') < hero.indexOf('File size limit'));
  ok('the three limits are the production ones', /2 MB/.test(flat(hero)) && /24 MB/.test(flat(hero)) && /10 files/.test(flat(hero)));
  ok('"Using a scanned PDF?" lands on the extraction act', /href="#pdf-text-extraction"[^>]*>[^<]*Using a scanned PDF\?/.test(hero.replace(/<svg[\s\S]*?<\/svg>/g, '')));
  const ctas = [...body.matchAll(/href="#pdf-checker"/g)].length;
  ok('free-entry and closing CTAs return to the one checker', ctas >= 2, ctas + ' links');
  ok('the free line appears in the hero and the close', (text.match(/150 words free — no registration required\./g) || []).length === 2);
}

/* ── extraction semantics ───────────────────────────────────────────────────── */
console.log('\nextraction');
{
  const ex = section('pdf-text-extraction');
  const t = flat(ex);
  ok('three states, each labelled in text', ['Text-based PDF', 'Scan-only PDF', 'Mixed PDF'].every(s => t.includes(s)));
  ok('the scan-only drawing carries the checker’s real message', /No text found in the file/.test(t) && /0 Words/.test(t));
  ok('the mixed drawing is the confirmed 1/3/5 test', /Pages 1, 3, 5 checked/.test(t) && /pages 2, 4 image-only/.test(t));
  ok('no drawing shows text extracted from an image', !/OCR (reads|extracts)|text recognized|recognised/i.test(t));
  const imgCards = (ex.match(/rounded-md bg-ink-200\/80/g) || []).length;
  ok('image-only pages are drawn as plates, not lines (3: one scan-only, two mixed)', imgCards === 3, imgCards + ' plates');
  ok('states are told apart by label, not colour alone', /Text layer · extracted/.test(t) && /image-only/.test(t));
}

/* ── report, sources, handling, free ────────────────────────────────────────── */
console.log('\nreport · sources · handling · free');
{
  const rep = section('pdf-report');
  ok('the approved report component, once', /cab-mark/.test(rep) && (body.match(/id="cabDoc"/g) || []).length === 1);
  ok('no PDF-only report field, no verdict', !/pdf score|originality (score|report)|verdict(?! \.)/i.test(flat(rep).replace('not an automatic plagiarism verdict', '')));
  const src = section('sources-and-settings');
  ok('four source settings, PDF drawn as the input', ['Web search', 'Academic database', 'References and citations', 'Storage sources'].every(c => flat(src).includes(c)) && /Input format/.test(flat(src)));
  const lc = section('pdf-handling');
  ok('uploaded PDF, report, control and Storage are four distinct items', (lc.match(/<h3\b/g) || []).length === 4);
  ok('the privacy link goes to /policy', /href="policy\.html"/.test(lc));
  const free = section('start-free');
  ok('the pricing path is a link to /prices, not a matrix', /href="prices\.html"/.test(free) && !/One-time \/|Monthly|3-Months|Yearly|\$\d/.test(flat(free)));
  ok('no price anywhere on the page', !/\$\d/.test(text));
}

/* ── FAQ ─────────────────────────────────────────────────────────────────────── */
console.log('\nFAQ');
{
  const faq = section('pdf-faq');
  const QS = [
    'Can I upload a PDF directly for plagiarism checking?',
    'Does PlagiarismSearch read scanned PDF files?',
    'What happens if my PDF contains both text and scanned pages?',
    'Does the checker analyze every visible word in a PDF?',
    'How large can my PDF file be?',
    'Can I upload more than one PDF?',
    'What sources can my PDF be checked against?',
    'Is my uploaded PDF stored?',
    'How much can I check for free?',
  ];
  const found = [...faq.matchAll(/class="faq-q[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)].map(m => flat(m[1]));
  ok('the nine approved questions, in order', found.join('|') === QS.join('|'), found.length + ' found');
  ok('nine answers rendered in the HTML', (faq.match(/class="faq-a"/g) || []).length === 9);
  ok('no timing-promise FAQ', !/how fast/i.test(flat(faq)));
  ok('accordion controls are buttons with aria-expanded', (faq.match(/<button type="button" aria-expanded=/g) || []).length === 9);
}

/* ── the P0 legacy claims, gone ─────────────────────────────────────────────── */
console.log('\nforbidden');
{
  const BANNED = [
    ['100% unique / truly original / plagiarism-free', /100% (unique|original)|truly original|plagiarism-free\b(?! or)/i],
    ['privacy guarantees', /100% privacy|guaranteed privacy|privacy (is )?guaranteed|full privacy/i],
    ['never store', /never store|never stored|no data storage/i],
    ['any PDF / all PDFs', /\b(upload )?any PDF\b|\ball PDFs\b/i],
    ['OCR implication', /scans all visible text|reads (all )?visible text|OCR (is )?(performed|used|available)|with OCR\b(?!\.|,)/i],
    ['billions of sources', /billions? of (online |offline )?sources/i],
    ['speed / SLA', /quick results|few minutes|\d-\d minutes|in minutes|instant/i],
    ['originality score', /originality (score|report)/i],
    ['every matched sentence', /every matched sentence/i],
    ['roadmap / automatic fixes', /roadmap|automatic(ally)? (fix|correct|cite)/i],
    ['no hidden costs', /no hidden (costs|fees)/i],
    ['500,000 clients', /500,000\+? (clients|customers)/i],
    ['students framing', /before you submit|ace your submission|your paper\b/i],
    ['legacy free offers', /15,?000|20,?000|unlimited/i],
    ['a solution-page directory', /turnitin|business & teams|for teachers|university plagiarism/i],
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
  const APPROVED = new Set(['prices.html', 'policy.html']);
  const links = [...body.matchAll(/href="([^"#][^"]*)"/g)].map(m => m[1]).filter(h => !h.startsWith('assets/'));
  const extra = [...new Set(links)].filter(h => !APPROVED.has(h));
  ok('only the brief’s destinations in the body', !extra.length, extra.join(', '));
  const anchors = [...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set(anchors)].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));
  /* the only <img> allowed are the service marks inside the form's input chips */
  ok('no stock imagery', !/<img\b(?![^>]*partners\/)/.test(body));
  ok('the page is not the Students composition', !/grid lg:grid-cols-\[\.95fr_1\.05fr\]/.test(body) && !/Similarity is not a plagiarism grade/.test(text));
}

console.log('\ngates — open items, not defects');
console.log('  G1  The form is the shared prototype checker; production binds the real uploader');
console.log('      and its validation states. 2 MB / 24 MB / 10 files and 150 / 300 are the');
console.log('      approved facts and must be re-QAed against production before launch.');
console.log('  G2  The optional trust rail is omitted on this page by the brief’s own rule.');
console.log('  G3  Hreflang for the PDF locale family is a staging check, outside the prototype.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : FILE + ' matches the PDF brief'));
process.exit(failed ? 1 : 0);
