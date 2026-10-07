/* Check site/blog-author-kelsey-ayton.html against the live author page
   (build/legal/blog-author-kelsey-ayton.html, as build/blog-author.js reads it).

   No brief: the profile's words and the posts' titles and dates are the live page's. So
   the checker holds them to the rendered text, the posts to their live order and
   destinations, the pictures to files on disk, the pager to the live number of pages,
   and the article to its link here.

   Run: node build/check-blog-author.js
*/
const fs = require('fs');
const path = require('path');
const A = require('./blog-author');

const SITE = path.join(__dirname, '..', 'site');
const html = fs.readFileSync(path.join(SITE, A.OUT), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&hellip;/g, '…').replace(/&amp;/g, '&');
const flat = s => unesc(s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('the author');
{
  const hero = body.slice(0, body.indexOf('data-component="blog-author-posts"'));
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1: the author\'s name', h1s.length === 1 && h1s[0] === A.name, h1s.join(' | '));
  ok('the live heading, as the pill and the H1: "' + A.heading + '"', flat(hero).includes(A.label + ' ' + A.name));
  ok('the bio\'s first line, word for word', flat(hero).includes(A.bio[0]));
  const chips = [...hero.matchAll(/<li class="inline-flex[^"]*">([^<]*)<\/li>/g)].map(m => unesc(m[1]));
  ok('its second line as ' + A.roles.length + ' chips, the same words in order', JSON.stringify(chips) === JSON.stringify(A.roles), chips.join(' | '));
  ok('the live Twitter link, named for assistive technology', hero.includes('<a href="' + A.twitter + '" rel="noopener" aria-label="Twitter"'));
  const img = (hero.match(/<img src="([^"]+)" alt="([^"]*)"/) || []);
  ok('the photograph: a file on disk, with the name as its text', !!img[1] && fs.existsSync(path.join(SITE, img[1])) && unesc(img[2]) === A.name);
  ok('self-canonical to the live URL', html.includes('<link rel="canonical" href="' + A.LIVE + '/blog/author/kelsey-ayton"'));
}

console.log('\nthe posts');
{
  const sec = body.slice(body.indexOf('data-component="blog-author-posts"'), body.indexOf('data-component="blog-3"'));
  const titles = [...sec.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(m => flat(m[1]));
  ok('ten posts, the live titles in the live order', JSON.stringify(titles) === JSON.stringify(A.posts.map(p => p.title)), titles.length + ' titles');
  ok('every live date printed', A.posts.every(p => flat(sec).includes(p.date)));
  const want = A.posts.map(p => A.LOCAL[p.href] || A.LIVE + p.href);
  const blocks = sec.split(/(?=<article\b)/);
  const hrefs = [(blocks[0].match(/<a href="([^"]+)"[^>]*class="group block"/) || [])[1], ...blocks.slice(1).map(b => (b.match(/<a href="([^"]+)"/) || [])[1])];
  ok('each leads to its own article: the one the prototype holds locally, the rest to the live site', JSON.stringify(hrefs) === JSON.stringify(want), hrefs.filter((h, i) => h !== want[i]).join(' '));
  ok('a local destination exists; an outside one carries rel="noopener"', hrefs.every(h => /^https?:/.test(h) ? sec.includes('<a href="' + h + '" rel="noopener"') : fs.existsSync(path.join(SITE, h))));
  const imgs = [...sec.matchAll(/<img src="([^"]+)"/g)].map(m => m[1]);
  ok('ten pictures, each a file on disk, none used twice', imgs.length === 10 && new Set(imgs).size === 10 && imgs.every(i => fs.existsSync(path.join(SITE, i))));
  const nav = sec.slice(sec.indexOf('aria-label="Pages"'));
  const nums = [...nav.matchAll(/>(\d+)<\/(?:a|span)>/g)].map(m => +m[1]);
  ok('the pager: page 1 current, the live last page ' + A.pages + ', Next', nums[0] === 1 && Math.max(...nums) === A.pages && /aria-current="page">1</.test(nav) && />Next /.test(nav), nums.join(' '));
}

console.log('\nstructure');
{
  const comp = [...body.matchAll(/<section\b[^>]*data-component="([^"]+)"/g)].map(m => m[1]);
  ok('three sections: the author, the posts, the blog\'s closing band', comp.join() === 'blog-author,blog-author-posts,blog-3', comp.join());
  const blog = fs.readFileSync(path.join(SITE, 'blog.html'), 'utf8');
  const band = s => { const a = s.indexOf('<section data-component="blog-3"'); return s.slice(a, s.indexOf('</section>', a)); };
  ok('the closing band is the blog index\'s, byte for byte', band(body) === band(blog) && band(blog).length > 500);
  const hs = [...body.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  ok('heading order: h1, then h2s', hs[0] === 1 && hs.slice(1).every(h => h === 2), hs.join(''));
  ok('no <style>, no <script>, no inline style', !/<style|<script|\sstyle="/.test(body));
  const art = fs.readFileSync(path.join(SITE, 'blog-best-checker-2026.html'), 'utf8');
  ok('the article links its author here, in the masthead and over the bio', (art.match(/<a href="blog-author-kelsey-ayton\.html"[^>]*>Kelsey Ayton<\/a>/g) || []).length === 2);
}

console.log('\ngates — open items, not defects');
console.log('  G1    Nine of the ten posts and pages 2–' + A.pages + ' of the list are not in the prototype: their links go to the live site.');
console.log('  G2    The live site serves the author\'s photograph at 128px only; it is shown at 96px. A larger original would be sharper.');
console.log('  G3    The live list prints "Best Plagiarism Checker in 2026 How to Choose…" without the colon the article\'s own title has; kept as the live page has it.');
console.log('  G4    The index card has no excerpt, so the live excerpts are not printed; the live sidebar (search, categories, archives, recent posts) is not carried, as on the index.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
