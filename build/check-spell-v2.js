/* Check site/spell-check-v2.html against the live page's words (build/spell-data.json)
   and its working parts: every string word for word, all 47 languages, every result-panel
   label bound to the spell module's output, the drop zone and "Attach file" reaching the
   file input, the live links (rate my paper → this prototype's page, the manual → live),
   the Trustpilot feedback word for word from the Reviews data.

   Run: node build/check-spell-v2.js
*/
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'site', 'spell-check-v2.html'), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&mdash;/g, '—');
const flat = s => unesc(s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
const text = flat(body);
const C = require('./spell-data.json');
const TP = require('./testimonials-v2').D.trustpilot;

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
  const skip = new Set(['source', 'read', 'title', 'meta', 'canonical', 'placeholder', 'languages']);
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
  ok('the box carries the live placeholder', body.includes('placeholder="' + C.hero.placeholder + '"'));
  const opts = [...body.matchAll(/<option[^>]*>([^<]*)<\/option>/g)].map(m => unesc(m[1]));
  ok(opts.length + ' languages, the live list in order', opts.join('|') === C.hero.languages.join('|'));
}

console.log('\nthe tool');
{
  const form = body.slice(body.indexOf('<form data-spell'), body.indexOf('</form>'));
  const need = ['text', 'file', 'count', 'lang', 'para', 'sent', 'syl', 'words', 'chars', 'spaces', 'read', 'speak', 'ari', 'cli', 'fre', 'fkg', 'smog', 'fog'];
  const lost = need.filter(k => !form.includes('data-sp="' + k + '"'));
  ok('every hook the spell module reads', !lost.length, lost.join(', '));
  ok('the word count carries its units, the form its time unit', /data-sp="count" data-one=" word" data-many=" words"/.test(form) && /<form data-spell data-unit="min"/.test(body));
  ok('inert: onsubmit="return false"', /<form data-spell[^>]*onsubmit="return false"/.test(body));
  ok('the drop zone and "Attach file" reach the file input', /<label for="sp-file" data-sp-drop/.test(body) && /<label for="sp-file" class="qc-chip/.test(body) && /<input id="sp-file" type="file" data-sp="file"/.test(body));
  const labels = C.panel.flatMap(([g, rows]) => [g, ...rows]);
  const lostLabel = labels.filter(l => !form.includes('>' + l + '<'));
  ok(labels.length + ' result-panel labels, the live widget\'s', !lostLabel.length, lostLabel.join(', '));
}

console.log('\nlinks');
{
  const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  ok('"click here", "rate my paper", "Order analysis" → the Rate my paper page', hrefs.filter(h => h === 'paper-analysis.html').length >= 4);
  ok('"check the manual" → the live manual', hrefs.includes('https://plagiarismsearch.com/spell-checker-manual'));
  ok('"Free check" in the feedback goes back to the tool', hrefs.includes('#spell-checker-top') && /<section id="spell-checker-top"/.test(body));
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
  ok('no <style> or <script> in the body', !/<style|<script/.test(body));
  const inline = [...body.matchAll(/\sstyle="([^"]*)"/g)].map(m => m[1]);
  ok(inline.length + ' inline styles, all data (star fills)', inline.every(s => /^((width|--f):[\d.]+%;?)+$/.test(s)));
  const imgs = [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m => m[1]);
  const lostImg = imgs.filter(s => s.startsWith('/') && !fs.existsSync(path.join(__dirname, '..', 'site', s)));
  ok(imgs.length + ' images on disk', !lostImg.length, lostImg.join(', '));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
