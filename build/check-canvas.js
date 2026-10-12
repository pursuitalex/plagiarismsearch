/* Check site/canvas-integration.html against the approved Canvas Integration brief of
   2026-10-08 (new-tasks/new-page-7).

   The brief's own acceptance list, as assertions: eleven sections in the approved order,
   one H1, the supplied copy word for word, every CTA at its destination, two tabs that
   swap the two original screenshots (and only those), the screenshots untouched and
   named for what they are, nothing claimed that the brief forbids — and no figure from a
   demo screenshot repeated in the page's own copy.

   Run: node build/check-canvas.js
*/
const fs = require('fs');
const path = require('path');
const C = require('./canvas');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const html = fs.readFileSync(path.join(SITE, C.OUT), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
/* the page's words as a reader gets them: no alt text, no attributes */
const text = flat(body);
const plain = s => flat(String(s));

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(plain(s));
const sections = [...body.matchAll(/<section\b[^>]*>/g)].map(m => ({
  id: (m[0].match(/\sid="([^"]*)"/) || [, ''])[1], comp: (m[0].match(/data-component="([^"]*)"/) || [, ''])[1], at: m.index }));
const section = id => { const s = sections.find(x => x.id === id); return s ? body.slice(s.at, body.indexOf('</section>', s.at) + 10) : ''; };

/* ── identity ───────────────────────────────────────────────────────────────── */
console.log('identity');
{
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the approved one', h1s.length === 1 && h1s[0] === plain(C.COPY.hero.h1), h1s.join(' | '));
  ok('no H4+', !/<h[4-6]\b/.test(body));
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to /canvas-integration', canon === 'https://plagiarismsearch.com/canvas-integration', canon);
  ok('the page is a page of its own, not the placeholder', !/approved destination in the navigation architecture/i.test(html));
  ok('no CSS or JS of its own in the body', !/<style\b/.test(body) && !/<script\b/.test(body) && !/\sstyle="/.test(body));
}

/* ── eleven sections, in the approved order ─────────────────────────────────── */
console.log('\nsections');
{
  /* [anchor, data-component, the approved H2 (the hero: its H1)] — section 09 is the
     three benefits and, under them, its question to an institution as the banner */
  const ORDER = [
    ['canvas-integration',  'hero',             null],
    ['how-it-works',        'steps',            C.COPY.how.h2],
    ['speedgrader-results', 'canvas-proof',     C.COPY.proof.h2],
    ['plagiarism-vs-ai',    'ai-compare',       C.COPY.versus.h2],
    ['submission-types',    'submission-types', C.COPY.types.h2],
    ['configuration',       'sources',          C.COPY.config.h2],
    ['setup-paths',         'setup-paths',      C.COPY.setup.h2],
    ['document-handling',   'steps',            C.COPY.handling.h2],
    ['institutional-value', 'feature-cards',    C.COPY.value.h2],
    ['evaluate-for-your-institution', 'banner', C.COPY.value.ask.h2],
    ['canvas-faq',          'faq',              C.COPY.faq.h2],
    ['canvas-cta',          'cta-band',         C.COPY.close.h2],
  ];
  ok('the sections, in order', sections.map(s => s.id).join(' ') === ORDER.map(o => o[0]).join(' '), sections.map(s => s.id).join(' '));
  ok('every section names its component', sections.every((s, i) => ORDER[i] && s.comp === ORDER[i][1]), sections.map(s => s.comp).join(' '));
  for (const [id, , h2] of ORDER.filter(o => o[2])) {
    const found = flat((section(id).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + id + ' H2', found === plain(h2), found || '(missing)');
  }
  const eyebrows = [...body.matchAll(/class="section-eyebrow-label">([^<]*)</g)].map(m => m[1]);
  ok('one eyebrow, the hero\'s (the brief gives the other sections none)', eyebrows.length === 1 && eyebrows[0] === C.COPY.hero.eyebrow, eyebrows.join(' | '));
}

/* ── the approved copy, word for word ───────────────────────────────────────── */
console.log('\napproved copy');
{
  const K = C.COPY;
  const all = [
    K.hero.lead, K.hero.primary, K.hero.secondary, ...K.hero.chips,
    K.how.intro, ...K.how.steps.flat(), K.how.link,
    K.proof.intro, ...K.proof.points.flat(), K.proof.important.join(' '), ...K.proof.tabs,
    K.versus.intro, ...K.versus.plagiarism, ...K.versus.ai, K.versus.closing,
    K.types.intro, ...K.types.items.flat(), K.types.note,
    K.config.intro, ...K.config.items.flat(), K.config.note,
    K.setup.intro, ...K.setup.roles.flatMap(r => [r.h3, r.lead, ...r.steps, r.cta]), K.setup.help.join(' '),
    K.handling.intro, ...K.handling.steps.flat(), K.handling.note, K.handling.link,
    K.value.intro, ...K.value.items.flat(), K.value.ask.lead, K.value.ask.cta,
    ...K.faq.items.flat(),
    ...K.close.lead, K.close.primary, K.close.secondary,
  ];
  const missing = all.filter(s => !has(s));
  ok(all.length + ' approved strings present verbatim', !missing.length, missing.slice(0, 3).map(s => '"' + String(s).slice(0, 50) + '…"').join(' '));
  ok('the three hero chips on one line, in order', has(K.hero.chips.join(' · ')));
  ok('eight FAQ items, every answer in the HTML', (body.match(/class="faq-item/g) || []).length === 8);
  ok('four workflow steps, three handling steps', (section('how-it-works').match(/class="steps-item"/g) || []).length === 4 && (section('document-handling').match(/class="steps-item"/g) || []).length === 3);
  const roles = section('setup-paths');
  ok('two role cards, four numbered steps each', (roles.match(/<ol\b/g) || []).length === 2 && (roles.match(/<li\b/g) || []).length === 8);
}

/* ── destinations ───────────────────────────────────────────────────────────── */
console.log('\ndestinations');
{
  const links = [...body.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => [flat(m[2]), m[1]]);
  const to = (label, href) => links.filter(l => l[0] === label && l[1] === href).length;
  ok('"View Canvas Setup Guide" → the Admin guide, in the hero and the closing band', to('View Canvas Setup Guide', C.ADMIN) === 2);
  ok('"Contact Our Team" → Contact: hero, institutional value, closing band', to('Contact Our Team', C.CONTACT) === 3);
  ok('"Read the Canvas Admin Guide" → the Admin guide', to('Read the Canvas Admin Guide', C.ADMIN) === 1);
  ok('the role cards lead to their own guides', to('Read Canvas Admin Guide', C.ADMIN) === 1 && to('Read Canvas Teacher Guide', C.TEACHER) === 1);
  ok('"Contact our team" in the deployment line → Contact', to('Contact our team', C.CONTACT) === 1);
  ok('"Read Our Privacy Policy" → policy.html', to('Read Our Privacy Policy', C.POLICY) === 1);
  const known = new Set([C.ADMIN, C.TEACHER, C.CONTACT, C.POLICY]);
  ok('no other destination in the page body', links.every(l => known.has(l[1])), links.filter(l => !known.has(l[1])).map(l => l.join(' → ')).join(', '));
  ok('the two guides are the published live pages', C.ADMIN === 'https://plagiarismsearch.com/canvas-admin-guide' && C.TEACHER === 'https://plagiarismsearch.com/canvas-teacher-guide');
  ok('internal destinations exist', [C.CONTACT, C.POLICY].every(f => fs.existsSync(path.join(SITE, f))));
}

/* ── the screenshots: the developer's two, and their two crops ──────────────── */
console.log('\nscreenshots');
{
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  const src = i => (i.match(/src="([^"]*)"/) || [, ''])[1];
  const S = C.SHOTS;
  const files = [S.file.full, S.file.panel, S.text.full, S.text.panel];
  const LOGOS = ['/assets/svg/partners/canvas.svg', '/assets/svg/logo.svg'];
  ok('every image is one of the four supplied files, or one of the two marks in the hero', imgs.length > 0 && imgs.every(i => files.some(f => f.src === src(i)) || LOGOS.includes(src(i))), imgs.map(src).filter(s => !files.some(f => f.src === s) && !LOGOS.includes(s)).join(', '));
  ok('each file is there and is its own size', files.every(f => fs.existsSync(path.join(SITE, f.src)) && imgs.filter(i => src(i) === f.src).every(i => i.includes(`width="${f.w}"`) && i.includes(`height="${f.h}"`))));
  ok('every screenshot has a factual alt', imgs.filter(i => !LOGOS.includes(src(i))).every(i => ((i.match(/alt="([^"]*)"/) || [, ''])[1]).length > 60));

  const heroS = section('canvas-integration');
  const heroImgs = [...heroS.matchAll(/<img\b[^>]*>/g)].map(m => src(m[0]));
  /* Olex, 2026-10-12: no screenshot on the first screen — the hero draws the integration */
  ok('hero: no screenshot — the two marks, Canvas and PlagiarismSearch, and nothing else', heroImgs.join(' ') === LOGOS.join(' ') && /alt="Canvas"/.test(heroS) && /alt="PlagiarismSearch"/.test(heroS), heroImgs.join(' '));
  ok('hero: the drawing stands in the sealed media slot, named for a screen reader', /data-slot="media"/.test(heroS) && heroS.includes('aria-label="' + C.FLOW.label + '"'));
  const flowWords = [C.FLOW.link, C.FLOW.out.cap, C.FLOW.back.cap, ...C.FLOW.out.chips.map(c => c[0]), ...C.FLOW.back.chips.map(c => c[0])];
  ok('hero: every word on the drawing is there, and is a term of the approved copy', flowWords.every(w => flat(heroS).includes(w)) && ['File Uploads', 'Text Entry', 'Similarity Score', 'AI Probability', 'Detailed Reports', 'LTI 1.3', 'SpeedGrader'].every(w => flowWords.join(' ').includes(w)));
  ok('hero: two lines, out and back, and no drawn screen', (heroS.match(/class="cvh-line"/g) || []).length === 2 && !/<button\b|<input\b|<table\b/.test(heroS));
  ok('hero: copy and actions come before the drawing in the source (a phone shows them first)', heroS.indexOf('hero-actions') < heroS.indexOf('data-slot="media"'));

  const proof = section('speedgrader-results');
  const tabs = [...proof.matchAll(/<button type="button" role="tab"[^>]*>([^<]*)<\/button>/g)].map(m => m[1]);
  ok('two tabs only: File Upload, Text Entry', tabs.join(' | ') === 'File Upload | Text Entry', tabs.join(' | '));
  const panels = proof.split('role="tabpanel"').slice(1);
  const pimgs = p => [...p.matchAll(/<img\b[^>]*>/g)].map(m => src(m[0])).join(' ');
  ok('tab 1 shows the File Upload screenshot and its crop', panels.length === 2 && pimgs(panels[0]) === [S.file.full.src, S.file.panel.src].join(' '));
  ok('tab 2 shows the Text Entry screenshot and its crop', panels.length === 2 && pimgs(panels[1]) === [S.text.full.src, S.text.panel.src].join(' '));
  ok('each caption says which kind of submission it is', panels.length === 2 && panels[0].includes(S.file.kind) && panels[0].includes(S.file.caption) && panels[1].includes(S.text.kind) && panels[1].includes(S.text.caption));
  ok('tabs are wired by id: aria-controls ↔ panel, aria-labelledby ↔ tab', [1, 2].every(n => proof.includes(`id="speedgrader-tab-${n}" aria-controls="speedgrader-panel-${n}"`) && proof.includes(`id="speedgrader-panel-${n}" aria-labelledby="speedgrader-tab-${n}"`)));
  ok('the first tab is the one selected in the HTML', /id="speedgrader-tab-1"[^>]*aria-selected="true"/.test(proof) && /id="speedgrader-tab-2"[^>]*aria-selected="false"/.test(proof));
  ok('nothing in a screenshot is a link: the report buttons stay a photograph', !/<a\b[^>]*>\s*<img/.test(body) && !/<map\b|usemap=/.test(body));
  ok('the demo note stands by each screenshot (the two tabs)', (body.split(C.DEMO).length - 1) === 2);
  ok('no figure from a screenshot in the page\'s own copy', !/\d+(?:\.\d+)?\s?%/.test(text), (text.match(/\d+(?:\.\d+)?\s?%/) || [''])[0]);
  ok('no other section carries a screenshot', sections.filter(s => s.id !== 'speedgrader-results').every(s => !files.some(f => section(s.id).includes(f.src))));
}

/* ── what the brief forbids ─────────────────────────────────────────────────── */
console.log('\nguardrails');
{
  const BANNED = [
    [/turnitin|copyleaks|gptzero|grammarly/i, 'a competitor'],
    [/certified|certification|official (?:canvas|instructure) partner|instructure partner|endorsed by/i, 'Canvas certification or endorsement'],
    [/\b\d+\s?(?:MB|GB)\b/i, 'a size limit'],
    [/\.docx?\b|\.pdf\b|\.pptx?\b|\.txt\b|DOC\/DOCX|PPT\/PPTX/i, 'a file-format list'],
    [/[$€£]\s?\d|\bper (?:month|year|student)\b|pricing/i, 'a price'],
    [/\d+\s?%|\baccuracy\b|\bsaves? (?:time|hours)\b|faster grading/i, 'an outcome or accuracy claim'],
    [/moodle|blackboard|brightspace|all (?:major )?LMS/i, 'another LMS'],
    [/100% (?:original|accurate)|plagiarism-free|proves? (?:plagiarism|authorship|misconduct)/i, 'a verdict promise'],
  ];
  for (const [re, what] of BANNED) ok('no ' + what, !re.test(text), (text.match(re) || [''])[0]);
  ok('no checker form, no upload field: this page sends to the guides', !/data-slot="checker"|<form\b|<input\b/.test(body));
  ok('no pricing block, no testimonial, no partner badge', !/data-component="(?:pricing-preview|reviews|stat-rail)"/.test(body));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + C.OUT + ')');
process.exit(failed ? 1 : 0);
