/* Check the Legal and User Guide plain-HTML typography
   (build/assets/css/26-legal-guide-body.css: ".legal-body", ".guide-body") and the four
   pages that prove it (build/body-plain.js).

   The promises held here:
     the rules stay inside their container   every selector starts at its hook, styles only
                                             elements without a class, and weighs one class
     the two are two styles                  neither block names the other's hook, nor the
                                             blog's; the blog's block is as it was committed
     the hook is in one place                on the document's container of each template,
                                             once per page, and on no other page
     the approved pages are not reached      nothing inside their container is plain
     a document stays as it is               the proof pages carry their documents as given —
                                             no class added to any element
     the contents works                      every section id is unique; every link of
                                             "On this page" has its heading; headings stop
                                             clear of the fixed header

   What the rules look like is checked in a browser, not here:
     node build/parity/run.js <approved page>      the approved pages against the last commit

   Run: node build/check-body-plain.js
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const P = require('./body-plain');
const legal = require('./legal');
const article = require('./article');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const site = f => fs.readFileSync(path.join(SITE, f), 'utf8');
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

/* the two hooks: the class, the opening tag that carries it, the element that closes it */
const HOOKS = {
  legal: { cls: 'legal-body', open: '<article class="min-w-0 legal-body">', close: '</article>' },
  guide: { cls: 'guide-body', open: '<div class="rv guide-body">', close: null },
};
/* what is inside a page's container. The guide's is a <div>, closed by div depth. */
function inside(html, hook) {
  const a = html.indexOf(hook.open);
  if (a < 0) return null;
  const from = a + hook.open.length;
  if (hook.close) return html.slice(from, html.indexOf(hook.close, from));
  let depth = 1; const tag = /<\/?div\b[^>]*>/g; tag.lastIndex = from; let t;
  while ((t = tag.exec(html))) { depth += t[0][1] === '/' ? -1 : 1; if (depth === 0) return html.slice(from, t.index); }
  return null;
}

const CSS_FILE = 'build/assets/css/26-legal-guide-body.css';
const src = fs.readFileSync(path.join(ROOT, CSS_FILE), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...src.matchAll(/([^{}]+)\{[^{}]*\}/g)].map(m => m[1].trim());

for (const [name, hook] of Object.entries(HOOKS)) {
  console.log('.' + hook.cls + ' — the rules stay inside the container');
  const mine = rules.filter(r => r.startsWith('.' + hook.cls));
  ok(mine.length + ' rules', mine.length > 55);
  /* the container's own rule aside, a rule reaches an element only through :where(… :not([class]) …) */
  const reach = mine.filter(r => r !== '.' + hook.cls);
  const loose = reach.filter(r => !new RegExp('^\\.' + hook.cls + ' (?:> )?:where\\(').test(r));
  ok('every element is reached through :where()', !loose.length, loose.slice(0, 3).join(' | '));
  const classed = reach.filter(r => {
    const inner = r.slice(r.indexOf(':where(') + 7, r.lastIndexOf(')'));
    /* each alternative of the list names at least one element without a class */
    return inner.split(/,(?![^()]*\))/).some(part => !part.includes(':not([class])'));
  });
  ok('every alternative names an element without a class', !classed.length, classed.slice(0, 3).join(' | '));
  const heavy = reach.filter(r => /[.#][a-z]/i.test(r.replace('.' + hook.cls, '')));
  ok('no selector weighs more than the one class, and none names another hook', !heavy.length, heavy.slice(0, 3).join(' | '));
  const block = src.slice(src.indexOf('.' + hook.cls));
  ok('headings stop clear of the fixed header: scroll-margin-top 7rem on h2 to h6',
    new RegExp('\\.' + hook.cls + ' :where\\(h2:not\\(\\[class\\]\\), h3:not\\(\\[class\\]\\), h4:not\\(\\[class\\]\\), h5:not\\(\\[class\\]\\), h6:not\\(\\[class\\]\\)\\) \\{[^}]*scroll-margin-top:7rem').test(block));
  console.log('');
}

console.log('the stylesheet');
{
  const strays = rules.filter(r => !/^\.(legal|guide)-body\b/.test(r));
  ok('nothing in the file reaches outside the two containers', !strays.length, strays.slice(0, 3).join(' | '));
  ok('no !important, no global element rule', !/!important/.test(src) && !rules.some(r => /^(?:html|body|p|h[1-6]|ul|ol|li|a|table|img)\b/.test(r)));
  const css = site('assets/css/site.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const count = (s, k) => (s.match(new RegExp('\\.' + k + '[ {]', 'g')) || []).length;
  ok('the built site.css carries both blocks', ['legal-body', 'guide-body'].every(k => count(css, k) === count(src, k) && count(src, k) > 55), count(css, 'legal-body') + ' / ' + count(css, 'guide-body'));
  let blog = 'unknown';
  try { execFileSync('git', ['diff', '--quiet', 'HEAD', '--', 'build/assets/css/26-article.css'], { cwd: ROOT }); blog = 'same'; } catch (e) { blog = e.status === 1 ? 'changed' : 'unknown'; }
  ok('the blog\'s block (.article-body, 26-article.css) is as committed', blog !== 'changed', blog);
}

console.log('\nthe hook is in one place');
const APPROVED = { legal: legal.PAGES.map(p => p.slug + '.html'), guide: ['plagiarism-and-ai-check-report.html'] };
const PROOF = { legal: P.LEGAL.map(p => p.out), guide: P.GUIDE.map(p => p.out) };
{
  for (const [name, hook] of Object.entries(HOOKS)) {
    const pages = APPROVED[name].concat(PROOF[name]);
    const wrong = pages.filter(f => { const h = site(f); return h.split(hook.open).length !== 2 || (h.match(new RegExp('class="[^"]*\\b' + hook.cls + '\\b', 'g')) || []).length !== 1; });
    ok('.' + hook.cls + ' is on the document\'s container, once, on ' + pages.length + ' pages (' + hook.open + ')', !wrong.length, wrong.join(', '));
    const others = fs.readdirSync(SITE).filter(f => f.endsWith('.html') && !pages.includes(f) && new RegExp('class="[^"]*\\b' + hook.cls + '\\b').test(site(f)));
    ok('and on no other page', !others.length, others.join(', '));
  }
  /* the container holds the document and nothing of the template: not the title, not the contents */
  const leak = APPROVED.legal.concat(PROOF.legal).filter(f => /<h1\b|toc-fold|toc-side|aria-label="On this page"/.test(inside(site(f), HOOKS.legal)))
    .concat(APPROVED.guide.concat(PROOF.guide).filter(f => /<h1\b|toc-fold|toc-side|aria-label="On this page"|aria-label="Breadcrumb"/.test(inside(site(f), HOOKS.guide))));
  ok('no title, breadcrumb or contents is inside a container', !leak.length, leak.join(', '));
}

console.log('\nthe approved pages are not reached');
{
  const TEXT = /<(p|h[2-6]|ul|ol|li|table|th|td|img|a|strong|b|code|blockquote|pre|figure|dl)(?=[\s>])(?![^>]*\sclass=)[^>]*>/g;
  for (const [name, hook] of Object.entries(HOOKS)) for (const f of APPROVED[name]) {
    const body = inside(site(f), hook);
    /* in an approved table the cells of the head row are set through their row and table: th and td carry classes */
    const plain = [...new Set([...body.matchAll(TEXT)].map(m => m[1]))];
    ok(f + ': nothing in its container is plain — its own classes still set it', !plain.length, plain.join(', '));
  }
}

console.log('\na document stays as it is');
for (const [name, hook] of Object.entries(HOOKS)) for (const p of (name === 'legal' ? P.LEGAL : P.GUIDE)) {
  const html = site(p.out), body = inside(html, hook);
  const want = P.withIds(p.body, name === 'legal' ? legal.slugOf : article.slug);
  ok(p.out + ': the document is on the page as given', body !== null && body.trim() === want.body.trim());
  const cls = s => [...s.matchAll(/<([a-z0-9]+)\b[^>]*\sclass="([^"]*)"/g)].map(m => m[1] + '.' + m[2]).join();
  ok('   no class and no inline style is added to it', cls(body) === cls(p.body) && (body.match(/\sstyle="/g) || []).length === (p.body.match(/\sstyle="/g) || []).length, cls(body));
  ok('   it is plain: no class on any of its elements', !/\sclass="/.test(p.body));
  const tags = t => (p.body.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length;
  ok('   ' + ['h2', 'h3', 'p', 'ul', 'ol', 'li', 'table', 'img', 'a', 'strong', 'code'].map(t => tags(t) + ' ' + t).join(', '), tags('h2') > 2 && tags('p') > 5 && tags('ul') > 0);
  /* the contents: one link per h2, in order, each to a heading that is there once */
  const ids = want.heads.map(h => h.id);
  const toc = [...html.matchAll(/<a href="#([^"]+)"/g)].map(m => m[1]);
  const lists = toc.length / ids.length;
  ok('   ' + ids.length + ' sections, ids unique; the contents links to each, in order' + (lists === 2 ? ' (the rail and the folded card)' : ''),
    new Set(ids).size === ids.length && Number.isInteger(lists) && lists >= 1 && Array.from({ length: lists }, (_, i) => toc.slice(i * ids.length, (i + 1) * ids.length).join()).every(x => x === ids.join()));
  ok('   every heading id is on the page once', ids.every(id => html.split(' id="' + id + '"').length === 2));
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('   exactly one H1, in the masthead', h1.length === 1 && html.indexOf('<h1') < html.indexOf(hook.open));
  ok('   no script in the document', !/<script/i.test(body));
}

console.log('\nthe same words, the same template');
{
  /* the Cookie Policy from plain HTML says what the approved Cookie Policy says */
  const a = flat(inside(site('cookie-policy.html'), HOOKS.legal)), b = flat(inside(site('legal-plain-cookie-policy.html'), HOOKS.legal));
  ok('the plain Cookie Policy reads word for word as the approved one', a === b, a.length + ' / ' + b.length + ' characters');
  /* around its container a proof page is its template: the same sections, the same outline */
  const comps = h => [...h.matchAll(/data-component="([^"]+)"/g)].map(m => m[1]).join();
  ok('the Legal proof pages are the Legal template', PROOF.legal.every(f => comps(site(f)) === comps(site('cookie-policy.html')) && /Also in legal/.test(site(f))));
  ok('the Guide proof pages are the article template', PROOF.guide.every(f => comps(site(f)) === comps(site('plagiarism-and-ai-check-report.html')) && /aria-label="Breadcrumb"/.test(site(f))));
}

console.log('\nevery id on these pages');
{
  const all = [...APPROVED.legal, ...PROOF.legal, ...APPROVED.guide, ...PROOF.guide];
  const dup = all.filter(f => { const ids = [...site(f).matchAll(/\sid="([^"]+)"/g)].map(m => m[1]); return new Set(ids).size !== ids.length; });
  ok(all.length + ' pages, no id repeats on any', !dup.length, dup.join(', '));
  const dead = all.filter(f => { const h = site(f); return [...h.matchAll(/href="#([^"]+)"/g)].some(m => !h.includes(' id="' + m[1] + '"')); });
  ok('every in-page link has its target', !dead.length, dead.join(', '));
  /* the generators give a repeated heading a number, so a future document cannot break the contents */
  const u = legal.uniqueIds();
  ok('a repeated heading would get an id of its own', [u('fees'), u('fees'), u('fees')].join() === 'fees,fees-2,fees-3');
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + [...PROOF.legal, ...PROOF.guide].join(', ') + ')');
process.exit(failed ? 1 : 0);
