/* Check site/paper-analysis-v2.html against the live page's words (build/paper-data.json)
   and its working parts: every string word for word, the 21 paper types in order, all
   thirty prices in the table and in the island the paper-form module reads, the services
   and their prices, every hook the module reads, the defaults' total rendered right, the
   live links, the Trustpilot feedback word for word from the Reviews data.

   Run: node build/check-paper-v2.js
*/
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'site', 'paper-analysis-v2.html'), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&mdash;/g, '—');
const flat = s => unesc(s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
const text = flat(body);
const C = require('./paper-data.json');
const F = C.form;
const TP = require('./testimonials-v2').D.trustpilot;
const money = n => '$' + n.toFixed(2);

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('page-level');
{
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g) || []).map(flat);
  ok('exactly one H1, the live one', h1.length === 1 && h1[0] === C.hero.h1, h1.join(' | '));
  ok('live title', unesc((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '') === C.title);
  ok('live meta description', unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '') === C.meta);
  ok('self-canonical', html.includes('<link rel="canonical" href="' + C.canonical + '"'));
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

console.log('\ncopy, verbatim');
{
  /* attributes, not text: checked below; "SELECT" is the live cards' button, which the
     table replaces — a cell is the choice */
  const skip = new Set(['source', 'read', 'title', 'meta', 'canonical', 'types', 'hideDescription', 'discountPlaceholder', 'discountError', 'select']);
  const strings = [];
  const walk = (v, k) => {
    if (skip.has(k)) return;
    if (typeof v === 'string') { if (!/^(https?:|\/|#)/.test(v)) strings.push(v); }
    else if (Array.isArray(v)) v.forEach(x => walk(x));
    else if (v && typeof v === 'object') for (const kk in v) walk(v[kk], kk);
  };
  walk(C);
  const squash = s => s.replace(/\s+/g, '');
  const missing = strings.filter(s => !text.includes(flat(s)) && !squash(text).includes(squash(flat(s))));
  ok(strings.length + ' live strings present word for word', !missing.length, missing.slice(0, 3).join(' | '));
  const opts = [...body.matchAll(/<option[^>]*>([^<]*)<\/option>/g)].map(m => unesc(m[1]));
  ok(opts.length - 1 + ' paper types, the live list in order, after the live placeholder', opts[0] === F.typePlaceholder && opts.slice(1).join('|') === F.types.join('|'));
  ok('the live description labels on the toggle', body.includes('data-show="' + F.showDescription + '" data-hide="' + F.hideDescription + '"'));
  ok('the live discount placeholder and message', body.includes('placeholder="' + F.discountPlaceholder + '"') && body.includes('data-error="' + F.discountError + '"'));
}

console.log('\nthe price table');
{
  const form = body.slice(body.indexOf('<form data-paper-form'), body.indexOf('</form>'));
  const island = JSON.parse((form.match(/<script type="application\/json" data-pf-rates>([\s\S]*?)<\/script>/) || [])[1] || '{}');
  ok('the island carries the live thirty prices', JSON.stringify(island) === JSON.stringify(F.rates));
  const cells = [...form.matchAll(/<input type="radio"[^>]*name="pf-cell" value="([^"]+)"[^>]*>\s*<span>([^<]+)<\/span>/g)].map(m => [unesc(m[1]), m[2]]);
  const wrong = cells.filter(([v, p]) => { const [l, d] = v.split('|'); return money(F.rates[l][d]) !== p; });
  ok(cells.length + ' cells, each showing its live price', cells.length === F.levels.length * F.days.length && !wrong.length, wrong.map(c => c.join(' ')).join(', '));
  const checked = [...form.matchAll(/name="pf-cell" value="([^"]+)"[^>]*checked/g)].map(m => m[1]);
  ok('one cell chosen by default', checked.length === 1, checked.join(', '));
  const sv = [...form.matchAll(/data-pf-service data-price="([\d.]+)" name="services\[(\d+)\]"( checked)?/g)].map(m => [+m[2], +m[1], !!m[3]]);
  ok(sv.length + ' services, the live ids, prices and default', JSON.stringify(sv) === JSON.stringify(F.services.map(s => [s.id, s.price, s.checked])));
  const need = ['pages', 'words', 'file', 'drop', 'doc', 'name', 'size', 'another', 'hint', 'descToggle', 'desc', 'rate', 'level', 'deadline', 'pagesOut', 'base', 'total', 'code', 'apply', 'codeMsg'];
  const lost = need.filter(k => !form.includes('data-pf="' + k + '"'));
  ok('every hook the paper-form module reads', !lost.length, lost.join(', '));
  ok('inert: onsubmit="return false"', /<form data-paper-form[^>]*onsubmit="return false"/.test(body));
  const [l, d] = checked[0].split('|');
  const extras = F.services.filter(s => s.checked).reduce((n, s) => n + s.price, 0);
  const total = (form.match(/data-pf="total"[^>]*>([^<]+)</) || [])[1];
  ok('the defaults\' total rendered for no-JS', total === money(F.rates[l][d] + extras), total);
  ok('the drop zone, "Attach file" and "upload" reach the file input', /<label for="pf-file" data-pf="drop"/.test(body) && /<label for="pf-file" class="qc-chip/.test(body) && /<label for="pf-file" class="font-semibold/.test(body) && /<input id="pf-file" type="file" data-pf="file"/.test(body));
}

console.log('\nlinks');
{
  const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  ok('"check the manual" → the live manual', hrefs.includes('https://plagiarismsearch.com' + C.hero.manual[1][1]));
  ok('"Terms of Use" → the live rate-paper terms, "Privacy Policy" → this prototype\'s', hrefs.includes('https://plagiarismsearch.com' + F.terms) && hrefs.includes('policy.html'));
  ok('"Plagiarism check" → the home page, as live', /<a href="index.html"[^>]*>[\s\S]*?Plagiarism check/.test(body));
  ok('"Check your text" goes back to the form', hrefs.includes('#paper-analysis-top') && /<section id="paper-analysis-top"/.test(body));
  const ext = [...body.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/g)].map(m => m[0]);
  ok('every external link carries noopener', ext.every(a => /rel="[^"]*noopener/.test(a)), ext.length + ' external');
}

console.log('\nfeedback');
{
  const cards = body.split(/\sdata-review(?=[\s>])/).slice(1);
  const bad = TP.reviews.slice(0, cards.length).filter((r, n) => { const c = flat(cards[n]); return !(c.includes(flat(r.name)) && c.includes(flat(r.title)) && r.text.every(p => c.includes(flat(p)))); });
  ok(cards.length + ' Trustpilot cards, word for word from the Reviews data', cards.length === 6 && !bad.length, bad.map(r => r.name).join(', '));
}

console.log('\nstructure');
{
  const secs = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  ok(secs.length + ' sections, each with data-component', secs.every(s => /data-component="/.test(s)));
  ok('no <style>, and no <script> but the JSON island', !/<style/.test(body) && [...body.matchAll(/<script\b[^>]*>/g)].every(m => /type="application\/json"/.test(m[0])));
  const inline = [...body.matchAll(/\sstyle="([^"]*)"/g)].map(m => m[1]);
  ok(inline.length + ' inline styles, all data (star fills)', inline.every(s => /^((width|--f):[\d.]+%;?)+$/.test(s)));
  const imgs = [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m => m[1]);
  const lostImg = imgs.filter(s => s.startsWith('/') && !fs.existsSync(path.join(__dirname, '..', 'site', s)));
  ok(imgs.length + ' images on disk', !lostImg.length, lostImg.join(', '));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
