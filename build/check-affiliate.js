/* Check site/affiliate-program-at-plagiarismsearch.html against the live page's copy.

   There is no brief for this page: the words are the live page's, verbatim, and only the
   architecture is new. So the checker holds every string in build/affiliate.js COPY to
   the rendered text, the links to their live destinations, and the page to the shared
   assets' structure (data-component on every section, a11y ids from the template).

   Run: node build/check-affiliate.js
*/
const fs = require('fs');
const path = require('path');

/* the page is build/affiliate-v3.js's since 2026-10-07; it carries the same words and links */
const FILE = process.argv[2] || 'affiliate-program-at-plagiarismsearch.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, '\'')
  .replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body);

/* the generator writes the page on require; the copy object is what this reads */
const { COPY } = (() => {
  const log = console.log; console.log = () => {};
  try { return require('./affiliate'); } finally { console.log = log; }
})();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the live one', h1s.length === 1 && h1s[0] === COPY.hero.h1, h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('live title', title === COPY.title.replace(/&/g, '&amp;'), title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('live meta description', desc === COPY.meta, desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the live URL', canon === COPY.canonical, canon);
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

console.log('\ncopy, verbatim');
{
  /* every string in COPY except the head fields and hrefs */
  const strings = [];
  const walk = (v, key) => {
    if (typeof v === 'string') {
      if (!['title', 'meta', 'canonical', 'href'].includes(key) && !/^(https?:|[a-z-]+\.html$)/.test(v) &&
          !/^[a-z][a-zA-Z]+$/.test(v)) strings.push(v);
    } else if (Array.isArray(v)) v.forEach(x => walk(x));
    else if (v && typeof v === 'object') for (const k in v) walk(v[k], k);
  };
  walk(COPY);
  const missing = strings.filter(s => !text.includes(flat(s)));
  ok(strings.length + ' live strings present word for word', !missing.length, missing.slice(0, 4).join(' | '));
}

console.log('\nlinks');
{
  const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const need = [
    ['https://app.plagiarismsearch.com/affiliate', 3],
    ['https://app.plagiarismsearch.com/friends', 1],
    ['#how-it-works', 1],
    ['turnitin-checker-alternative.html', 1],
    ['https://www.trustpilot.com/review/plagiarismsearch.com', 1],
    ['contact-us.html', 1],
  ];
  for (const [h, n] of need) {
    const c = hrefs.filter(x => x === h).length;
    ok(h + ' ×' + n, c === n, 'found ' + c);
  }
  ok('#how-it-works lands on a section', /<section id="how-it-works"/.test(body));
  const ext = [...body.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/g)].map(m => m[0]);
  ok('every external link carries rel="noopener"', ext.every(a => /rel="noopener"/.test(a)), ext.length + ' external');
}

console.log('\nstructure');
{
  const secs = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  ok(secs.length + ' sections, each with data-component', secs.every(s => /data-component="/.test(s)));
  const faq = [...body.matchAll(/aria-controls="([^"]+)"/g)].map(m => m[1]);
  ok(faq.length + ' FAQ answers, ids written by the template', faq.length === COPY.faq.items.length &&
     faq.every(id => body.includes('id="' + id + '"')));
  ok('one open FAQ item, aria in step', (body.match(/faq-item open/g) || []).length === 1 &&
     (body.match(/aria-expanded="true"/g) || []).length === 1);
  ok('no <style> or <script> in the body', !/<style|<script/.test(body));
  ok('the two programs, cash dark', /data-component="offer-pair"/.test(body) &&
     body.indexOf(COPY.programs.cash.name) < body.indexOf(COPY.programs.credits.name));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
