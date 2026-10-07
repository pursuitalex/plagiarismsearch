/* Check site/readability-check.html (build/readability-v2.js) against the live page's words
   (build/readability-data.json) and its working parts.

   Every string in the data — headings, paragraphs, list items, the hero's controls, the
   charts' labels — must be on the page word for word; the calculator must carry every
   hook its module reads; the drop zone and "Attach file" must reach the file input; the
   Trustpilot feedback must be the Reviews data, word for word.

   Run: node build/check-readability-v2.js
*/
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'site', 'readability-check.html'), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&mdash;/g, '—');
const flat = s => unesc(s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
const text = flat(body);
const C = require('./readability-data.json');
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
  /* sources: the four ways in are the site's checker's own (build/checker.js), checked below */
  const skip = new Set(['source', 'read', 'title', 'meta', 'canonical', 'sources', 'upload']);
  const strings = [];
  const walk = (v, k) => {
    if (skip.has(k)) return;
    if (typeof v === 'string') { if (!/^(https?:|\/|#)/.test(v)) strings.push(v); }
    else if (Array.isArray(v)) v.forEach(x => walk(x));
    else if (v && typeof v === 'object') for (const kk in v) walk(v[kk], kk);
  };
  const { charts, ...copy } = C;
  walk(copy);
  /* the tiles are printed as name + figure: compare without the joining space */
  const squash = s => s.replace(/\s+/g, '');
  const missing = strings.filter(s => !text.includes(flat(s)) && !squash(text).includes(squash(flat(s))));
  ok(strings.length + ' live strings present word for word', !missing.length, missing.slice(0, 3).join(' | '));
  ok('no editor marker left in the copy', !/\[М1\]/.test(text));
  const labels = [charts.ease.title, charts.ease.y, charts.ease.x, ...charts.ease.bars.map(b => charts.ease.label + b[2]), ...charts.genres.rows.map(r => r[0])];
  const lost = labels.filter(l => !text.includes(l) && !body.includes(l));
  ok(labels.length + ' chart labels (the live pictures, now data)', !lost.length, lost.join(', '));
}

console.log('\nthe calculator');
{
  const form = body.slice(body.indexOf('<form data-readability'), body.indexOf('</form>'));
  const need = ['text', 'file', 'score', 'level', 'needle', 'words', 'sents', 'asl', 'grade', 'hint'];
  const lost = need.filter(k => !new RegExp('data-rc="' + k + '"').test(form + body));
  ok('every hook the readability module reads', !lost.length, lost.join(', '));
  ok('inert: onsubmit="return false"', /<form data-readability[^>]*onsubmit="return false"/.test(body));
  { const INPUTS = require('./checker').INPUTS.map(i => i.label);
    const chips = [...form.matchAll(/<(?:button type="button"|label for="rc-file") class="qc-chip[^"]*">(?:<img[^>]*>|<svg[\s\S]*?<\/svg>)([^<]+)</g)].map(m => m[1]);
    ok('the four ways in are the checker\'s own, in its order, Dropbox and OneDrive with their marks', chips.join('|') === INPUTS.join('|') && /partners\/dropbox\.svg/.test(form) && /partners\/onedrive\.svg/.test(form), chips.join(', ')); }
  ok('the drop zone carries the checker\'s "Upload file" chip', new RegExp('class="qc-chip shrink-0[^"]*">' + require('./checker').UPLOAD_LABEL + '<').test(form) && !/UPLOAD FILE/.test(form));
  ok('the drop zone and "Attach file" reach the file input', /<label for="rc-file" data-rc-drop/.test(body) && /<label for="rc-file" class="qc-chip/.test(body) && /<input id="rc-file" type="file" data-rc="file"/.test(body));
  ok('the text field opens the form with nothing over it — "Simple text" is its name for a screen reader, its live line the placeholder, the lead its description', /<form data-readability[^>]*>\s*(<!--[\s\S]*?-->\s*)?<label for="rc-text" class="sr-only">Simple text<\/label>\s*<textarea id="rc-text"/.test(body) &&/<textarea id="rc-text" data-rc="text"[^>]*placeholder="Paste your text into our web-based software to get instant analysis and recommended improvements\."[^>]*aria-describedby="rc-lead"/.test(body) && /id="rc-lead"/.test(body));
  ok('"Start checking" goes back to the checker', (body.match(/href="#readability-checker-top"/g) || []).length >= 2 && /<section id="readability-checker-top"/.test(body));
}

console.log('\nfeedback');
{
  const cards = body.split(/\sdata-review(?=[\s>])/).slice(1);
  const bad = TP.reviews.slice(0, cards.length).filter((r, n) => { const c = flat(cards[n]); return !(c.includes(flat(r.name)) && c.includes(flat(r.title)) && r.text.every(p => c.includes(flat(p)))); });
  ok(cards.length + ' Trustpilot cards, word for word from the Reviews data', cards.length === 6 && !bad.length, bad.map(r => r.name).join(', '));
  ok('the live summary: Excellent, 4.7/5, based on 58 reviews', text.includes('Excellent') && text.includes(TP.rating + '/' + TP.max) && text.includes('Based on ' + TP.count + ' reviews'));
}

console.log('\nstructure');
{
  const secs = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  ok(secs.length + ' sections, each with data-component', secs.every(s => /data-component="/.test(s)));
  ok('no <style> or <script> in the body', !/<style|<script/.test(body));
  const inline = [...body.matchAll(/\sstyle="([^"]*)"/g)].map(m => m[1]);
  ok(inline.length + ' inline styles, all data (bar heights, ranges, fills, the needle)', inline.every(s => /^((height|left|width|--f):[\d.]+%;?)+$/.test(s)));
  const ext = [...body.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/g)].map(m => m[0]);
  ok('every external link carries noopener', ext.every(a => /rel="[^"]*noopener/.test(a)), ext.length + ' external');
  const imgs = [...body.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(m => m[1]);
  const lostImg = imgs.filter(s => s.startsWith('/') && !fs.existsSync(path.join(__dirname, '..', 'site', s)));
  ok(imgs.length + ' images on disk', !lostImg.length, lostImg.join(', '));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
