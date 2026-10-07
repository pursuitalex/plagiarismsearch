/* Check site/scholarship.html against the live page's copy.

   There is no brief for this page: the words are the live page's, verbatim, and only the
   architecture is new. So the checker holds every string in build/scholarship.js COPY to
   the rendered text, the links to their live destinations, the form to the live fields
   (and to staying inert), and the page to the shared assets' structure.

   Run: node build/check-scholarship.js
*/
const fs = require('fs');
const path = require('path');

/* the page is the illustrated one (build/scholarship-v2.js) since 2026-10-07 */
const FILE = process.argv[2] || 'scholarship.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<wbr>/g, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;/g, '\'')
  .replace(/\s+/g, ' ').replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body);
const { COPY } = require('./scholarship');

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
  ok('live title', title === COPY.title, title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('live meta description', desc === COPY.meta, desc.slice(0, 50) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to the live URL', canon === COPY.canonical, canon);
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

console.log('\ncopy, verbatim');
{
  /* every string in COPY except the head fields, hrefs, ids and attribute values */
  const skip = v => /^(https?:|#|\.|[a-z-]+\.html$)/.test(v) || /^[a-z]+(-[a-z]+)*$/.test(v);
  const strings = [];
  const walk = (v, key) => {
    if (typeof v === 'string') { if (!['title', 'meta', 'canonical'].includes(key) && !skip(v)) strings.push(v); }
    else if (Array.isArray(v)) v.forEach(x => walk(x));
    else if (v && typeof v === 'object') for (const k in v) walk(v[k], k);
  };
  walk(COPY);
  const missing = strings.filter(s => !text.includes(flat(s)));
  ok(strings.length + ' live strings present word for word', !missing.length, missing.slice(0, 4).join(' | '));
  ok('15 terms, 5 prompts, 6 questions', COPY.terms.items.length === 15 && COPY.requirement.prompts.length === 5 && COPY.faq.items.length === 6);
}

console.log('\nlinks');
{
  const hrefs = [...body.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  for (const [name, h] of COPY.hero.winners) ok('winner ' + name, hrefs.includes(h));
  ok('"Get Started" lands on the form (#app-form-1)', hrefs.includes('#app-form-1') && /<section id="app-form-1"/.test(body));
  const ext = [...body.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/g)].map(m => m[0]);
  ok('every external link carries rel="noopener"', ext.every(a => /rel="noopener"/.test(a)), ext.length + ' external');
}

console.log('\nthe design correction pack of 2026-10-06');
{
  ok('no mid-page dark application block', !/data-component="dark-act"/.test(body) && !/id="apply-for-scholarship"/.test(body));
  ok('no generic product proof ("500,000 Clients")', !/500,000/.test(text));
  const forms = (body.match(/<form\b/g) || []).length;
  ok('one application destination: one form, in the last section', forms === 1 && body.lastIndexOf('<section') === body.indexOf('<section id="app-form-1"'));
}

console.log('\nform');
{
  const form = (body.match(/<form\b[^>]*>/) || [''])[0];
  ok('inert: no action, onsubmit="return false"', form && !/\baction=/.test(form) && /onsubmit="return false"/.test(form));
  for (const [label, id] of COPY.form.fields) {
    ok('field "' + label + '" labelled and required',
       new RegExp('<label class="cf-label" for="sc-' + id + '">').test(body) &&
       new RegExp('<input[^>]*id="sc-' + id + '"[^>]*required').test(body));
  }
  ok('message textarea labelled and required', /for="sc-message"/.test(body) && /<textarea[^>]*id="sc-message"[^>]*required/.test(body));
  ok('file input: multiple, the live formats', /<input id="sc-files"[^>]*type="file" multiple accept="\.7z,/.test(body));
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
  ok('no <style>, <script> or inline style in the body', !/<style|<script|\sstyle="/.test(body));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
