/* Check site/testimonials.html against build/testimonials-data.json — the live page's
   words, read by build/testimonials-fetch.js.

   Every review is a real person's words under their name, so the checker holds each of
   the hundred cards to the data field by field (name, title, every paragraph, score),
   and the page to its behaviour contract: the first nine per platform visible, the rest
   in the HTML behind "Show more", the videos as links that work without JS.

   Run: node build/check-testimonials.js
*/
const fs = require('fs');
const path = require('path');

/* the illustrated version carries the same reviews: node build/check-testimonials.js testimonials-v2.html */
const FILE = process.argv[2] || 'testimonials.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
/* v2 renames Sitejabber to SmartCustomer and takes that profile's figures (Olex,
   2026-09-30); its generator exports the data it renders, so both are held to the same */
const D = FILE === 'testimonials-v2.html' ? require('./testimonials-v2').D : require('./testimonials-data.json');
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
/* inline tags leave a space before the punctuation that follows them (the pen mark's
   </span> before "Impact:"); both sides of every comparison go through this */
const flat = s => unesc(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
const text = flat(body);

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  /* the pen mark's SVG sits between "Impact" and the colon, so tags come out without a space */
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<svg[\s\S]*?<\/svg>/g, '');
  ok('exactly one H1, the live one', h1s.length === 1 && flat(h1) === D.h1, flat(h1));
  ok('live title', unesc((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '') === D.title);
  ok('live meta description', unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '') === D.meta);
  ok('self-canonical', /<link rel="canonical" href="https:\/\/plagiarismsearch\.com\/testimonials"/.test(html));
  ok('no H4+', !/<h[4-6]\b/.test(body));
  for (const s of [D.lead, D.trust.title, D.trust.text, D.videos.title, D.videos.text]) ok('"' + s.slice(0, 40) + '…"', text.includes(s));
}

console.log('\nrating tiles');
for (const t of D.trust.tiles) {
  const a = body.indexOf('href="' + t.url + '"');
  const tile = a < 0 ? '' : flat(body.slice(a, body.indexOf('</a>', a)));
  const want = [t.rating && t.rating + ' / ' + t.max, t.reviewsCount, t.downloads].filter(Boolean);
  ok(t.key + ': ' + want.join(', '), a >= 0 && want.every(w => tile.includes(w)), tile.slice(0, 60));
}

for (const key of ['trustpilot', 'sitejabber']) {
  const P = D[key];
  console.log('\n' + key);
  const i = body.indexOf('id="' + key + '-reviews"');
  const sec = body.slice(i, body.indexOf('</section>', i));
  const st = flat(sec);
  ok('summary: ' + P.rating + ' / ' + P.max + ', based on ' + P.count + (P.textRating ? ', ' + P.textRating : ''),
     st.includes(P.rating + ' / ' + P.max) && st.includes('Based on ' + P.count + ' reviews') && (!P.textRating || st.includes(P.textRating)) &&
     sec.includes('href="' + P.url + '"'));
  ok('featured quote', st.includes(P.featured.title) && st.includes(P.featured.text));
  ok('heading "' + P.heading + '"', new RegExp('<h2[^>]*>' + P.heading + '</h2>').test(sec));

  /* A card is whatever carries data-review — a grid, a masonry wall or a marquee row.
     A marquee repeats its cards for the loop; the copies carry data-review-copy (inside
     an aria-hidden track) and are not counted. Everything before the first copy is the
     real set. */
  const parts = sec.split(/\s(data-review(?:-copy)?)(?=[\s>])/);
  const cards = [];
  for (let n = 1; n < parts.length; n += 2) if (parts[n] === 'data-review') cards.push(parts[n + 1]);
  ok(P.reviews.length + ' cards, in the live order', cards.length === P.reviews.length);
  const bad = [];
  P.reviews.forEach((r, n) => {
    const c = cards[n] || '', ct = flat(c);
    const good = ct.includes(flat(r.name)) && ct.includes(flat(r.title)) && r.text.every(p => ct.includes(flat(p))) &&
                 c.includes('aria-label="' + r.score + ' out of 5"');
    if (!good) bad.push(n + ' ' + r.name);
  });
  ok('every card: name, title, every paragraph, score — word for word', !bad.length, bad.slice(0, 4).join(', '));
  if (/data-show-more="/.test(sec)) {
    const later = cards.map(c => /^\s*class="more-later/.test(c)).map((l, n) => l === (n >= 9));
    ok('first 9 shown, the rest behind "Show more"', later.every(Boolean));
    ok('the "Show more" button, in the live words', new RegExp('data-show-more-btn[^>]*>\\s*' + P.showMore).test(sec) && /data-show-more="9"/.test(sec));
  } else {
    /* a marquee shows every card; its copies must be hidden from assistive tech and focus */
    ok('every card shown (no "Show more")', !cards.some(c => /^\s*class="more-later/.test(c)));
    const copies = (sec.match(/\sdata-review-copy(?=[\s>])/g) || []).length;
    const tracks = [...sec.matchAll(/<div\b[^>]*\bdata-marquee-copy\b[^>]*>/g)].map(m => m[0]);
    /* copies stay hoverable (a copy card opens its popup too), so not inert: they must be
       aria-hidden and hold nothing focusable */
    const copyHtml = sec.split(/<div\b[^>]*\bdata-marquee-copy\b[^>]*>/).slice(1).map(c => c.split(/<div class="mq-group"(?![^>]*data-marquee-copy)|<\/section>/)[0]).join('');
    ok(copies + ' loop copies, aria-hidden, nothing focusable', copies === P.reviews.length &&
       tracks.length > 0 && tracks.every(t => /aria-hidden="true"/.test(t)) && !/tabindex=|<a\b|<button\b|<h[1-6]\b/.test(copyHtml));
    ok('the real cards are reachable by keyboard (tabindex="0")', cards.every(c => /^\s*tabindex="0"/.test(c)));
  }
}

console.log('\nvideos');
for (const v of D.videos.items) {
  ok(v.name + ' — a working link without JS', body.includes('href="https://www.youtube.com/watch?v=' + v.youtube + '"') &&
     (body.includes('data-video="' + v.youtube + '"') || body.includes('data-video-pick="' + v.youtube + '"')) && text.includes(v.name) && text.includes(v.line));
}
ok('no player loads with the page', !/<iframe/.test(body));

console.log('\nstructure');
{
  const secs = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  ok(secs.length + ' sections, each with data-component', secs.every(s => /data-component="/.test(s)));
  ok('no <style> or <script> in the body', !/<style|<script/.test(body));
  const inline = [...body.matchAll(/\sstyle="([^"]*)"/g)].map(m => m[1]);
  ok(inline.length + ' inline styles, all rating fills (data)', inline.every(s => /^(width|--f):[\d.]+%$/.test(s)));
  const ext = [...body.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/g)].map(m => m[0]);
  ok('every external link carries noopener', ext.every(a => /rel="[^"]*noopener/.test(a)), ext.length + ' external');
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
