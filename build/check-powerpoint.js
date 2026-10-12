/* Check site/powerpoint-plagiarism-checker.html against the PowerPoint Plagiarism Checker
   brief of 2026-10-08 (new-tasks/new-page-7).

   The brief's own QA list, as assertions: the existing URL, ten sections in order, one
   H1, the copy word for word, the sitewide checker and no other form, module A telling
   text box, table, shape and notes apart with no OCR claim, module B pairing each source
   slide with its own report excerpt, every test picture treated as an internal
   reference, the library sections reused, and none of the promises the brief forbids —
   the test's own figures included.

   Run: node build/check-powerpoint.js
*/
const fs = require('fs');
const path = require('path');
const P = require('./powerpoint');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const html = fs.readFileSync(path.join(SITE, P.OUT), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const plain = s => flat(String(s));

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const sections = [...body.matchAll(/<section\b[^>]*>/g)].map(m => ({
  id: (m[0].match(/\sid="([^"]*)"/) || [, ''])[1], comp: (m[0].match(/data-component="([^"]*)"/) || [, ''])[1], at: m.index }));
const section = id => { const s = sections.find(x => x.id === id); return s ? body.slice(s.at, body.indexOf('</section>', s.at) + 10) : ''; };
/* the page's own words: everything a reader gets, without the sealed sample report and
   the plan cards (their figures are the product's and the pricing data's, not copy) */
const own = flat(sections.filter(s => !['report-showcase', 'pricing-preview'].includes(s.comp)).map(s => section(s.id)).join(' '));
const text = flat(body);
const has = s => text.includes(plain(s));
const K = P.COPY;

/* ── identity: the existing URL keeps its purpose ───────────────────────────── */
console.log('identity');
{
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('the proposed title', title === K.title, title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('the proposed meta description', desc === K.meta, desc.slice(0, 60));
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the existing route', canon === 'https://plagiarismsearch.com/powerpoint-plagiarism-checker', canon);
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the approved one', h1s.length === 1 && h1s[0] === plain(K.hero.h1), h1s.join(' | '));
  ok('no H4+', !/<h[4-6]\b/.test(body));
  ok('a page of its own, not the placeholder', !/approved destination in the navigation architecture/i.test(html));
  /* the sealed sample report colours its legend inline, as on every page that shows it */
  const unsealed = sections.filter(s => s.comp !== 'report-showcase').map(s => section(s.id)).join('\n');
  ok('no CSS or JS of its own in the body (the pricing data island apart)', !/<style\b/.test(body) && !/\sstyle="/.test(unsealed) && [...body.matchAll(/<script\b[^>]*>/g)].every(m => /type="application\/json"/.test(m[0])));
  ok('no second PowerPoint route is linked', !/ppt-plagiarism-checker/.test(html));
}

/* ── ten sections, in the approved order ────────────────────────────────────── */
console.log('\nsections');
{
  /* [anchor, component, eyebrow, H2] — section 09 is the trust strip and the FAQ */
  const ORDER = [
    ['powerpoint-checker',        'hero',               K.hero.eyebrow,     null],
    ['powerpoint-content',        'pptx-content-types', K.types.eyebrow,    K.types.h2],
    ['powerpoint-proof',          'pptx-proof',         K.proof.eyebrow,    K.proof.h2],
    ['powerpoint-report',         'report-showcase',    K.report.eyebrow,   K.report.h2],
    ['how-to-check-a-powerpoint', 'steps',              K.how.eyebrow,      K.how.h2],
    ['what-results-mean',         'split-card',         K.meaning.eyebrow,  K.meaning.h2],
    ['your-powerpoint',           'steps',              K.handling.eyebrow, K.handling.h2],
    ['pricing',                   'pricing-preview',    K.pricing.eyebrow,  K.pricing.h2],
    ['reviews',                   'trust-strip',        null,               K.trust.h2],
    ['powerpoint-faq',            'faq',                null,               K.faq.h2],
    ['powerpoint-cta',            'cta-band',           K.close.eyebrow,    K.close.h2],
  ];
  ok('the sections, in order', sections.map(s => s.id).join(' ') === ORDER.map(o => o[0]).join(' '), sections.map(s => s.id).join(' '));
  ok('every section names its component', sections.every((s, i) => ORDER[i] && s.comp === ORDER[i][1]), sections.map(s => s.comp).join(' '));
  for (const [id, , eyebrow, h2] of ORDER) {
    const s = section(id);
    if (h2) { const found = flat((s.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]); ok('#' + id + ' H2', found === plain(h2), found || '(missing)'); }
    const eb = flat((s.match(/class="section-eyebrow-label">([\s\S]*?)<\/span>/) || [, ''])[1]);
    ok('#' + id + (eyebrow ? ' eyebrow' : ' has no eyebrow'), eb === (eyebrow ? plain(eyebrow) : ''), eb);
  }
  ok('only two compositions are this page\'s own (modules A and B)', ['pptx-content-types', 'pptx-proof'].every(c => sections.filter(s => s.comp === c).length === 1));
}

/* ── the approved copy, word for word ───────────────────────────────────────── */
console.log('\napproved copy');
{
  const all = [
    K.hero.support, K.hero.chips.join(' · '), K.hero.free, K.hero.cta,
    K.types.intro, ...K.types.tiles.flat(), ...K.types.limit, K.types.cta,
    K.proof.intro, ...K.proof.tabs.flat(), ...K.proof.captions, K.proof.caveat, K.proof.cta,
    K.report.intro, ...K.report.points.flat(), K.report.callout,
    K.how.intro, ...K.how.steps.flat(), K.how.cta,
    ...K.meaning.notices.flat(),
    K.handling.intro, ...K.handling.steps.flat(), K.handling.cta,
    K.pricing.intro, K.pricing.cta,
    K.trust.intro,
    ...K.faq.items.flat(),
    K.close.body, K.close.primary, K.close.micro,
  ];
  const missing = all.filter(s => !has(s));
  ok(all.length + ' approved strings present verbatim', !missing.length, missing.slice(0, 3).map(s => '"' + String(s).slice(0, 50) + '…"').join(' '));
  ok('seven FAQ items, every answer in the HTML', (body.match(/class="faq-item/g) || []).length === 7);
  ok('three steps to check, three stations of handling', (section('how-to-check-a-powerpoint').match(/class="steps-item"/g) || []).length === 3 && (section('your-powerpoint').match(/class="steps-item"/g) || []).length === 3);
}

/* ── the hero: the sitewide form and nothing beside it ──────────────────────── */
console.log('\nthe checker');
{
  const hero = section('powerpoint-checker');
  ok('the real shared form stands in the hero\'s sealed slot', /data-slot="checker"/.test(hero) && (body.match(/data-slot="checker"/g) || []).length === 1);
  ok('one form on the page', (body.match(/<form\b/g) || []).length === 1);
  ok('one upload area with "Upload file"; Dropbox, OneDrive, By URL', /Upload file/.test(hero) && ['Dropbox', 'OneDrive', 'By URL'].every(c => hero.includes(c)));
  ok('no "Attach file" chip', !/Attach file/i.test(body));
  ok('the shared format label is unchanged', hero.includes('Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.'));
  const links = [...body.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => [flat(m[2]), m[1]]);
  const to = (label, href) => links.filter(l => l[0] === label && l[1] === href).length;
  ok('"Check your PowerPoint" returns to the hero form: the proof and the closing band', to(K.proof.cta, P.ANCHOR) === 2);
  /* the form's own button carries the same words and the same anchor: two in all */
  ok('"Check for plagiarism" under the steps returns to the hero form', to(K.how.cta, P.ANCHOR) === 2 && new RegExp('<a href="' + P.ANCHOR + '"[^>]*class="action-button[^>]*>\\s*' + K.how.cta).test(section('how-to-check-a-powerpoint')));
  ok('"See a real check result" → the proof', to(K.types.cta, P.PROOF) === 1);
  ok('"Read the Privacy Policy" → policy.html', to(K.handling.cta, 'policy.html') === 1);
  ok('"View all pricing" → prices.html', to(K.pricing.cta, 'prices.html') === 1);
  ok('internal destinations exist', ['policy.html', 'prices.html'].every(f => fs.existsSync(path.join(SITE, f))));
}

/* ── module A: where the text lives ─────────────────────────────────────────── */
console.log('\nmodule A — content types');
{
  const a = section('powerpoint-content');
  const h3s = [...a.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map(m => flat(m[1]));
  ok('four tiles: slide text, tables, editable shapes, speaker notes', h3s.join(' | ') === K.types.tiles.map(t => t[0]).join(' | '), h3s.join(' | '));
  ok('the notes tile draws the Notes pane, apart from the slide', /Notes pane/.test(a));
  ok('image-only text is a "Not guaranteed" note, not a fifth tile', a.includes(K.types.limit[0]) && (a.match(/<li\b/g) || []).length === 4);
  ok('the tiles are drawings: no test screenshot repeated here', !/<img\b/.test(a));
  ok('the drawings are hidden from a screen reader', (a.match(/aria-hidden="true">/g) || []).length >= 4);
}

/* ── module B: each source slide beside its own report excerpt ──────────────── */
console.log('\nmodule B — the proof');
{
  const b = section('powerpoint-proof');
  const tabs = [...b.matchAll(/<button type="button" role="tab"[^>]*>([^<]*)<\/button>/g)].map(m => m[1]);
  ok('four tabs, each named for its tested content type', tabs.join(' | ') === K.proof.tabs.map(t => t[0]).join(' | '), tabs.join(' | '));
  const panels = b.split('role="tabpanel"').slice(1);
  const src = p => [...p.matchAll(/<img\b[^>]*src="([^"]*)"/g)].map(m => m[1]);
  ok('A → R-A, B → R-B, C → R-C, D → R-D: a slide never meets another slide\'s excerpt',
     panels.length === 4 && P.PAIRS.every((pr, i) => src(panels[i]).join(' ') === [pr.source.src, pr.report.src].join(' ')));
  ok('each panel carries its own description and both fixed captions', panels.length === 4 && K.proof.tabs.every((t, i) => panels[i].includes(t[1]) && K.proof.captions.every(c => panels[i].includes(c))));
  ok('the notes tab prints the notes and says they are not on the slide', panels.length === 4 && panels[3].includes(P.NOTES.label) && panels[3].includes(P.NOTES.text) && panels.slice(0, 3).every(p => !p.includes(P.NOTES.label)));
  const imgs = [...b.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  const files = P.PAIRS.flatMap(pr => [pr.source, pr.report]);
  ok('eight pictures, each its own file at its own size', imgs.length === 8 && files.every(f => fs.existsSync(path.join(SITE, f.src)) && imgs.some(i => i.includes(`src="${f.src}"`) && i.includes(`width="${f.w}"`) && i.includes(`height="${f.h}"`))));
  ok('every picture has a factual alt and opens enlarged', imgs.every(i => ((i.match(/alt="([^"]*)"/) || [, ''])[1]).length > 60) && (b.match(/<button type="button" class="ev-zoom" data-zoom/g) || []).length === 8);
  ok('every picture stands under an "Internal reference" tag', (b.split('>' + P.INTERNAL + '<').length - 1) === 8);
  ok('the prototype note says what they are', b.includes(P.PROTOTYPE_NOTE) && /data-prototype-note/.test(b));
  ok('the test pictures live in a folder named for what they are', files.every(f => f.src.startsWith('/assets/img/pptx-internal-reference/')));
  ok('tabs are wired by id', [1, 2, 3, 4].every(n => b.includes(`id="pptx-proof-tab-${n}" aria-controls="pptx-proof-panel-${n}"`) && b.includes(`id="pptx-proof-panel-${n}" aria-labelledby="pptx-proof-tab-${n}"`)));
  /* the only inputs here are the review switch's two radios */
  const inputs = [...b.matchAll(/<input\b[^>]*>/g)].map(m => m[0]);
  ok('a tab is not wired to the form', !/data-period|data-recurring|<form\b/.test(b) && inputs.every(i => /type="radio" name="pptx-proof-view"/.test(i)));

  /* ── the same evidence, redrawn (Olex, 2026-10-12) — and the Before / After switch ── */
  const flatP = panels.map(flat);
  ok('review switch: two radios, After checked, marked as a review tool', inputs.length === 2 && /data-review-tool/.test(b) && /value="after"[^>]*checked/.test(b) && !/value="before"[^>]*checked/.test(b) && /class="pv-scope\b/.test(b));
  ok('each tab holds both views: redrawn first, the screenshots second', panels.length === 4 && panels.every(p => p.indexOf('data-proof-view="after"') > -1 && p.indexOf('data-proof-view="after"') < p.indexOf('data-proof-view="before"')));
  const after = panels.map(p => p.slice(p.indexOf('data-proof-view="after"'), p.indexOf('data-proof-view="before"')));
  ok('the redrawn views carry no screenshot', after.every(a => !/<img\b/.test(a)));
  ok('every redrawn card is tagged for review, and the note says what it is', (b.split('>' + P.REDRAWN + '<').length - 1) === 8 && b.includes(P.REDRAWN_NOTE));
  const passages = [[P.TXT.dickens], P.TXT.decl, P.TXT.alice, P.TXT.lincoln];
  const count = (hay, s) => hay.split(plain(s)).length - 1;
  ok('each passage is the test\'s own, word for word, on the slide and in the report excerpt', passages.every((ps, i) => ps.every(s => count(flat(after[i]), s) === 2)),
     passages.map((ps, i) => ps.map(s => count(flat(after[i]), s)).join('/')).join(' '));
  ok('a passage never appears under another tab', passages.every((ps, i) => ps.every(s => flatP.every((t, n) => n === i || !t.includes(plain(s))))));
  ok('each slide keeps its own title, element and number', P.REDRAW.every((r, i) => flat(after[i]).includes(r.slide.title) && after[i].includes('>' + r.slide.tag + '<') && after[i].includes('Slide ' + r.slide.no + ' of 7')));
  ok('the table is a real table; the notes stand in a Notes pane apart from the slide', /<table role="table"/.test(after[1]) && /Notes pane · not on the slide/.test(after[3]) && after.slice(0, 3).every(a => !/Notes pane/.test(a)));
  /* the real report's categories and source numbers, per excerpt */
  const marks = a => [...a.matchAll(/<mark data-kind="(plag|sim)"/g)].map(m => m[1]).join(' ');
  ok('the highlights keep the real report\'s categories, in its order', P.REDRAW.every((r, i) => marks(after[i]) === r.report.filter(l => l.mark).map(l => l.mark).join(' ')), after.map(marks).join(' | '));
  ok('text box: all Plagiarism; table and shape: Similarities then Plagiarism; notes: all Plagiarism', marks(after[0]) === 'plag plag' && marks(after[1]) === 'sim sim sim plag' && marks(after[2]) === 'sim sim plag' && marks(after[3]) === 'plag plag plag');
  ok('every source marker carries the report\'s own numbers', P.REDRAW.every((r, i) => r.report.filter(l => l.src).every(l => flat(after[i]).includes('Sources ' + l.src))));
  ok('a category is never said by colour alone: a legend names each one used', P.REDRAW.every((r, i) => [...new Set(r.report.filter(l => l.mark).map(l => l.mark))].every(k => after[i].includes('>' + { plag: 'Plagiarism', sim: 'Similarities' }[k] + '</li>'))));
  ok('the test deck\'s QA chrome is not redrawn', !/INTERNAL QA|DO NOT PUBLISH|TEST [A-F]\b|Positive control|CONTENT EXTRACTION TEST/.test(text));
  ok('no test screenshot anywhere else on the page', sections.filter(s => s.id !== 'powerpoint-proof').every(s => !section(s.id).includes('pptx-internal-reference')));
  const deployed = fs.readdirSync(path.join(SITE, 'assets', 'img', 'pptx-internal-reference'));
  ok('only the eight paired pictures are in the site: no PDF, no PPTX, no overview, no image-only or control slide', deployed.length === 8 && deployed.every(f => files.some(x => x.src.endsWith('/' + f))), deployed.join(' '));
}

/* ── the library sections ───────────────────────────────────────────────────── */
console.log('\nlibrary sections');
{
  ok('the sample report is the sealed library one', /data-slot="report"/.test(section('powerpoint-report')));
  const pr = section('pricing');
  ok('the full pricing module: four periods, the Recurring payments switch, the data island', ['onetime', 'monthly', 'quarterly', 'yearly'].every(k => pr.includes(`data-period="${k}"`)) && /data-recurring/.test(pr) && /type="application\/json"/.test(pr));
  ok('no price typed into the copy around the cards', !/[$€£]\s?\d/.test(flat(pr.slice(0, pr.indexOf('data-slot="pricing-periods"')))));
  const trust = section('reviews');
  ok('trust strip: platform marks and links only — no rating, no count, no quotation', P.PLATFORMS.every(p => trust.includes(`href="${p.url}"`) && trust.includes(`alt="${p.name}"`)) && !/\d/.test(flat(trust)) && !/<blockquote\b/.test(trust));
  ok('the closing band has one action and no form', (section('powerpoint-cta').match(/class="cta-button btn-press/g) || []).length === 1 && !/<form\b/.test(section('powerpoint-cta')));
}

/* ── what the brief forbids ─────────────────────────────────────────────────── */
console.log('\nguardrails');
{
  const BANNED = [
    [/100% original|plagiarism-free|guaranteed/i, 'a guarantee', /Not guaranteed|not guaranteed to be extracted/g],
    [/checks all images|detects plagiarism in graphics|scans your entire slide|reads every element|\bOCR\b/i, 'an image / OCR claim'],
    [/real-time|instant results|in seconds/i, 'a timing promise'],
    [/official Microsoft|Microsoft (?:PowerPoint )?partner/i, 'a Microsoft partnership'],
    [/deleted immediately|immediately (?:and permanently )?deleted|zero data retention|never stored/i, 'a deletion promise'],
    [/100% accurate|accuracy/i, 'an accuracy claim'],
    [/slide-by-slide|per-slide|score for (?:each|every) slide/i, 'a per-slide score'],
    [/50\.61|\b917\b|\b65 (?:listed )?sources\b/i, 'the test\'s own figures'],
    [/\b\d+\s?(?:MB|GB)\b/i, 'a size limit'],
    [/turnitin|copyleaks|grammarly/i, 'a competitor'],
  ];
  for (const [re, what, allow] of BANNED) { const t = allow ? own.replace(allow, '') : own; ok('no ' + what, !re.test(t), (t.match(re) || [''])[0]); }
  ok('no percentage in the page\'s own copy', !/\d+(?:\.\d+)?\s?%/.test(own), (own.match(/\d+(?:\.\d+)?\s?%/) || [''])[0]);
  ok('the free limit is stated as 150 words, never as a free full file', /150 words/.test(own) && !/free (?:full|complete|entire) (?:file|presentation|scan)\b(?! scan)/i.test(own.replace(/not a promise of a complete free presentation scan/g, '')));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + P.OUT + ')');
process.exit(failed ? 1 : 0);
