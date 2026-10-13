/* Check the article body's plain-HTML typography (build/assets/css/26-article.css,
   ".article-body") and the two pages that prove it (build/blog-plain.js).

   Three promises are held here:
     the rules stay inside the article   every selector starts at .article-body, styles only
                                         elements without a class, and weighs one class
     the archive stays as it is          the article's body is on the page as the archive
                                         holds it — no class added to any element
     the template stays as it is         apart from its content, each page is the approved
                                         template; the approved page differs from the last
                                         approved state by the one hook class

   What the rules look like is not checked here: a browser does that
   (node build/parity/run.js blog-best-checker-2026.html for the approved page).

   Run: node build/check-blog-plain.js
*/
const fs = require('fs');
const path = require('path');
const B = require('./blog-plain');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

/* the article of a page: what is between the template's <article …> and its </article> */
const OPEN = '<article class="rv min-w-0 article-body">';
const article = html => { const a = html.indexOf(OPEN); return a < 0 ? null : html.slice(a + OPEN.length, html.indexOf('</article>', a)); };

console.log('the rules stay inside the article');
{
  const src = read('build/assets/css/26-article.css');
  const from = src.indexOf('/* ── the article body: plain semantic HTML');
  ok('the block is in 26-article.css', from > 0);
  const block = src.slice(from).replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...block.matchAll(/([^{}]+)\{[^{}]*\}/g)].map(m => m[1].trim());
  ok(rules.length + ' rules found', rules.length > 60);
  const outside = rules.filter(r => !r.startsWith('.article-body'));
  ok('every selector starts at .article-body', !outside.length, outside.slice(0, 3).join(' | '));
  /* the container's own rule aside, a rule reaches an element only through :where(… :not([class]) …) */
  const reach = rules.filter(r => r !== '.article-body');
  const loose = reach.filter(r => !/^\.article-body (?:> )?:where\(/.test(r));
  ok('every element is reached through :where()', !loose.length, loose.slice(0, 3).join(' | '));
  const classed = reach.filter(r => {
    const inner = r.slice(r.indexOf(':where(') + 7, r.lastIndexOf(')'));
    /* each alternative of the list names at least one element without a class */
    return inner.split(/,(?![^()]*\))/).some(part => !part.includes(':not([class])'));
  });
  ok('every alternative names an element without a class', !classed.length, classed.slice(0, 3).join(' | '));
  const heavy = reach.filter(r => /[.#][a-z]/i.test(r.replace('.article-body', '')));
  ok('no selector weighs more than the one class', !heavy.length, heavy.slice(0, 3).join(' | '));
  ok('no !important', !/!important/.test(block));
  const css = read('site/assets/css/site.css').replace(/\/\*[\s\S]*?\*\//g, '');
  ok('the built site.css carries the block', (css.match(/\.article-body /g) || []).length === (block.match(/\.article-body /g) || []).length,
    (css.match(/\.article-body /g) || []).length + ' / ' + (block.match(/\.article-body /g) || []).length);
}

console.log('\nthe template stays as it is');
const template = fs.readFileSync(path.join(SITE, B.TEMPLATE), 'utf8');
{
  ok('the approved page carries the hook once, on its <article>', template.split(OPEN).length === 2 && (template.match(/article-body/g) || []).length === 1);
  const body = article(template);
  const plain = [...body.matchAll(/<(p|h[2-6]|ul|ol|table|img|blockquote|figure)(?=[\s>])(?![^>]*\sclass=)[^>]*>/g)].map(m => m[1]);
  ok('nothing in the approved article is plain: its own classes still set it', !plain.length, [...new Set(plain)].join(', '));
}

for (const p of B.PAGES) {
  console.log('\n' + p.out);
  const html = fs.readFileSync(path.join(SITE, p.out), 'utf8');
  const body = article(html);
  ok('the template\'s <article>, with the hook', body !== null && html.split(OPEN).length === 2);
  if (body === null) continue;

  /* the body as given, with the ids the build adds to its h2s and nothing else */
  const want = B.withIds(p.body);
  ok('the body is on the page as given', body.trim() === want.body.trim());
  const given = p.body.replace(/<style[\s\S]*?<\/style>/g, '');
  const classes = [...given.matchAll(/<([a-z0-9]+)\b[^>]*\sclass="([^"]*)"/g)].map(m => m[1] + '.' + m[2]);
  const added = [...body.replace(/<style[\s\S]*?<\/style>/g, '').matchAll(/<([a-z0-9]+)\b[^>]*\sclass="([^"]*)"/g)].map(m => m[1] + '.' + m[2]);
  ok('no class is added to any element' + (classes.length ? ' (its own: ' + [...new Set(classes)].join(', ') + ')' : ''), added.join() === classes.join(), added.join(', '));
  ok('no inline style is added', (body.match(/\sstyle="/g) || []).length === (p.body.match(/\sstyle="/g) || []).length);
  const tags = t => (given.match(new RegExp('<' + t + '[\\s>]', 'g')) || []).length;
  ok('plain content: ' + ['h2', 'h3', 'p', 'ul', 'ol', 'li', 'table', 'img'].map(t => tags(t) + ' ' + t).join(', '), tags('h2') > 2 && tags('p') > 5 && tags('ul') > 0 && tags('ol') > 0);

  /* the contents: one link per h2 in the rail and in the folded card, each to a heading that exists */
  const ids = want.heads.map(h => h.id);
  const rail = [...html.matchAll(/<a href="#([^"]+)" data-spy="\1" class="rail-link">/g)].map(m => m[1]);
  ok(ids.length + ' sections, each with an id, each in the rail', rail.join() === ids.join() && new Set(ids).size === ids.length, rail.length + ' in the rail');
  const fold = html.slice(html.indexOf('<details class="toc-fold'), html.indexOf('</details>'));
  ok('and each in the folded contents', [...fold.matchAll(/data-spy="([^"]+)"/g)].map(m => m[1]).join() === ids.join());
  ok('every heading id is on the page once', ids.every(id => html.split(' id="' + id + '"').length === 2));

  /* outside its content the page is the template: same header, same foot of the article, same sections */
  const frame = h => h.slice(0, h.indexOf('<main')).replace(/<title>[\s\S]*?<\/title>/, '');
  ok('the head and the header are the template\'s', frame(html) === frame(template));
  const comps = h => [...h.matchAll(/data-component="([^"]+)"/g)].map(m => m[1]).join();
  ok('the same sections in the same order', comps(html) === comps(template), comps(html));
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]).replace(/&amp;/g, '&'));
  ok('exactly one H1, the title', h1.length === 1 && h1[0] === p.title);
  ok('no script in the body of the article', !/<script/i.test(body));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + B.PAGES.map(p => p.out).join(', ') + ')');
process.exit(failed ? 1 : 0);
