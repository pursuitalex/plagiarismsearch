/* Generate the two pages that prove the article body's plain-HTML typography
   (build/assets/css/26-article.css, ".article-body"):

     site/blog-affiliate-programs.html   a real article from the archive, set in the approved
                                         blog article template exactly as the archive holds
                                         it: plain <h2>, <h3>, <p>, <ul>, <ol>, <table>, <img>
                                         with no class on any of them
     site/blog-article-elements.html     every element the stylesheet covers, once — h2 to h6,
                                         long headings, nested lists, a quotation, a figure, a
                                         table, code — because no single article has them all

   Both are the approved template itself: site/blog-best-checker-2026.html (hand-written,
   its own source) is read, and only its content is swapped — the title, the masthead, the
   post picture, the two "On this page" lists, the article body, the author block. Nothing
   of the template's markup or classes is changed, so what these pages show is what the
   template does with plain content.

   THE ARCHIVE ARTICLE IS NOT EDITED. build/blog/affiliate-programs.body.html is the body of
   plagiarismsearch.com/blog/best-plagiarism-checker-affiliate-programs-for-education-bloggers-
   and-academic-creators as served on 2026-10-12 (the contents of its articleBody), with one
   thing left out: its FAQ JSON-LD <script>, which is metadata, not content. Its own <style>
   block (legacy rules for .table-wrap) is kept, because a transferred article brings it
   along. At build time three things are done to it, none of them a class:
     · each <h2> gets an id, as the template's contents needs an anchor per section;
     · site-relative image addresses (/files/…) point at the live site, where the files are;
     · the one internal link points at the prototype's page.

   Run:  node build/blog-plain.js  →  node build/shell.js  →  node build/check-blog-plain.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const TEMPLATE = 'blog-best-checker-2026.html';
const LIVE = 'https://plagiarismsearch.com';

const esc = s => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const text = s => s.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/\s+/g, ' ').trim();
const slug = t => t.toLowerCase().replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40).replace(/-+$/, '');

/* one swap in the template: `from` must be there exactly once */
function swap(html, from, to, what) {
  const m = html.match(from);
  if (!m || html.split(m[0]).length !== 2) throw new Error('blog-plain: the template has no single place for ' + what);
  return html.replace(m[0], () => (typeof to === 'function' ? to(m) : to));
}

/* ids for the h2s: the only thing added to an article's own markup */
function withIds(body) {
  const seen = new Set(), heads = [];
  const out = body.replace(/<h2>([\s\S]*?)<\/h2>/g, (all, inner) => {
    let id = slug(text(inner)) || 'section', n = 1;
    while (seen.has(id)) id = slug(text(inner)) + '-' + (++n);
    seen.add(id); heads.push({ id, html: inner.trim() });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { body: out, heads };
}

function build(p) {
  let html = fs.readFileSync(path.join(SITE, TEMPLATE), 'utf8');
  const { body, heads } = withIds(p.body);
  const words = (text(body.replace(/<style[\s\S]*?<\/style>/g, ' ')).match(/\S+/g) || []).length;
  const initials = p.author.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  html = swap(html, /<title>[\s\S]*?<\/title>/, `<title>PlagiarismSearch — ${esc(p.title)}</title>`, 'the title');
  html = swap(html, /(<h1 class="[^"]*">)[\s\S]*?(<\/h1>)/, m => m[1] + esc(p.title) + m[2], 'the h1');
  /* the masthead: initials, name (the template links its author's page; these have none), date, reading time */
  html = swap(html, /(<span class="w-9 h-9 shrink-0 rounded-full[^"]*">)KA(<\/span>)/, m => m[1] + initials + m[2], 'the initials');
  html = swap(html, /<a href="blog-author-kelsey-ayton\.html" class="(text-\[13\.5px\] font-bold text-ink-900)[^"]*">Kelsey Ayton<\/a>/, m => `<span class="${m[1]}">${esc(p.author.name)}</span>`, 'the author in the masthead');
  html = swap(html, /(<span class="text-\[12\.5px\] font-medium text-ink-400">)November 29, 2025(<\/span>)/, m => m[1] + p.date + m[2], 'the date');
  html = swap(html, /(<span class="nums">)18(<\/span> min read)/, m => m[1] + Math.max(1, Math.round(words / 200)) + m[2], 'the reading time');
  /* the post picture */
  html = swap(html, /<img src="\/assets\/img\/blog\/post-02\.webp" alt="" width="740" height="550"/, `<img src="${p.picture}" alt="" width="740" height="550"`, 'the post picture');
  /* the two contents lists: the rail's, then the folded card's — each keeps the template's own item markup */
  html = swap(html, /(<nav class="toc-side-scroll"[^>]*>\s*<ul>)[\s\S]*?(<\/ul>)/, m => m[1] + '\n' +
    heads.map(h => `                <li><a href="#${h.id}" data-spy="${h.id}" class="rail-link">${h.html}</a></li>`).join('\n') + '\n              ' + m[2], 'the rail list');
  html = swap(html, /(<span class="nums">)3,527(<\/span> words)/, m => m[1] + words.toLocaleString('en-US') + m[2], 'the word count');
  const item = html.match(/<li class="flex gap-2\.5">\s*(<span class="[^"]*" aria-hidden="true"><\/span>)\s*<a href="#[^"]*" data-spy="[^"]*" class="([^"]*)">/);
  if (!item) throw new Error('blog-plain: the folded contents has no item to copy');
  html = swap(html, /(<details class="toc-fold[\s\S]*?<ul[^>]*>)[\s\S]*?(<\/ul>\s*<\/nav>\s*<\/details>)/, m => m[1] + '\n' +
    heads.map(h => `              <li class="flex gap-2.5">\n                ${item[1]}\n                <a href="#${h.id}" data-spy="${h.id}" class="${item[2]}">${h.html}</a>\n              </li>`).join('\n') + '\n            ' + m[2], 'the folded list');
  /* the body: the template's <article>, with the one hook class the stylesheet needs */
  html = swap(html, /(<article class="rv min-w-0 article-body">)[\s\S]*?(\n\s*<\/article>)/, m => m[1] + '\n' + body.trim() + m[2], 'the article body');
  /* the foot: posted line and the author block */
  html = swap(html, /(Posted <span class="font-semibold text-ink-600">)November 29, 2025(<\/span>)/, m => m[1] + p.date + m[2], 'the posted date');
  html = swap(html, /(by <span class="font-semibold text-ink-600">)Kelsey Ayton(<\/span>)/, m => m[1] + esc(p.author.name) + m[2], 'the posted author');
  html = swap(html, /<img src="\/assets\/img\/blog\/authors\/kelsey-ayton\.webp" alt="Kelsey Ayton"/, `<img src="${p.author.photo}" alt="${esc(p.author.name)}"`, 'the author photograph');
  html = swap(html, /<a href="blog-author-kelsey-ayton\.html" class="hover:text-teal-700[^"]*">Kelsey Ayton<\/a>/, esc(p.author.name), 'the author name in the foot');
  html = swap(html, /(<p class="text-\[13\.5px\] sm:text-\[14\.5px\] leading-relaxed text-ink-500 mb-2">)[\s\S]*?(<\/p>)/, m => m[1] + esc(p.author.bio[0]) + m[2], 'the author bio');
  html = swap(html, /(<p class="text-\[13\.5px\] sm:text-\[14\.5px\] leading-relaxed text-ink-500">)[\s\S]*?(<\/p>)/, m => m[1] + p.author.bio[1] + m[2], 'the author roles');

  fs.writeFileSync(path.join(SITE, p.out), html);
  console.log('  site/' + p.out + ' — ' + heads.length + ' sections, ' + words.toLocaleString('en-US') + ' words, ' + html.length + ' bytes');
}

/* ── 1 · the archive article ──────────────────────────────────────────────────────── */
const ARCHIVE = fs.readFileSync(path.join(__dirname, 'blog', 'affiliate-programs.body.html'), 'utf8')
  .replace(/(src|href)="\/files\//g, `$1="${LIVE}/files/`)
  .replace(/href="\/affiliate-program-at-plagiarismsearch"/g, 'href="affiliate-program-at-plagiarismsearch.html"');
const MELISSA = {
  name: 'Melissa Anderson',
  photo: LIVE + '/img/128/users-8452a08762929565.jpg',
  bio: ['Born in Lviv, Ukraine. Studied English and American Literature and Linguistics at Ostroh Academy National University. Participant in international TV and radio programs related to arts, music, and literature.',
    'Former Radio Presenter <span class="text-ink-300">|</span> Former host of the TV project &ldquo;English is Easy&rdquo; <span class="text-ink-300">|</span> Mass Media Translator <span class="text-ink-300">|</span> Poet <span class="text-ink-300">|</span> PlagiarismSearch writer and Educational Clients Manager'],
};

/* ── 2 · every element once ───────────────────────────────────────────────────────── */
const ELEMENTS = fs.readFileSync(path.join(__dirname, 'blog', 'elements.body.html'), 'utf8');

const PAGES = [
  { out: 'blog-affiliate-programs.html', title: 'Best Plagiarism Checker Affiliate Programs for Education Bloggers and Academic Creators',
    date: 'April 17, 2026', author: MELISSA, picture: LIVE + '/img/1024/articles-image-vbaxdq7bnnzuhv3qi89lqlacbh2dwqr.png', body: ARCHIVE },
  { out: 'blog-article-elements.html', title: 'Article Typography: Every Element of the Blog Article Body, Set From Plain HTML Without a Single Class',
    date: 'October 12, 2026', author: MELISSA, picture: '/assets/img/blog/post-02.webp', body: ELEMENTS },
];

module.exports = { PAGES, TEMPLATE, withIds };
if (require.main !== module) return;
PAGES.forEach(build);
