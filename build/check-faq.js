/* Check site/faq-and-support.html against the live page's copy (build/faq-data.json).

   There is no brief for this page: the words are the live page's, verbatim, and only the
   architecture is new. So the checker holds the H1, the nine group names in their order,
   every question and every paragraph of every answer to the rendered text; the inquiry
   form to the live fields; the nine figures to their slot (one a group, decoration, the
   library's aside); and the page to the shared assets' structure.

   Run: node build/check-faq.js
*/
const fs = require('fs');
const path = require('path');
const { D, ID, OUT, LOCAL } = require('./faq');

const html = fs.readFileSync(path.join(__dirname, '..', 'site', OUT), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const flat = s => unesc(s.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1, the live one', h1s.length === 1 && h1s[0] === D.h1, h1s.join(' | '));
  ok('live title', unesc((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '') === D.title);
  ok('live meta description', unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '') === D.meta);
  ok('self-canonical to the live URL', html.includes('<link rel="canonical" href="' + D.source + '"'));
  const hs = [...body.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  ok('heading order: h1, then h2 a section, h3 a question; nothing deeper', hs[0] === 1 && hs.every((h, i) => h <= 3 && (!i || h - hs[i - 1] <= 1)));
}

console.log('\nthe nine groups');
{
  const secs = body.split(/(?=<section\b)/).filter(s => /^<section[^>]*data-component="faq"/.test(s));
  ok(D.groups.length + ' FAQ sections, in the live order', secs.length === D.groups.length && secs.every((s, i) => new RegExp('^<section id="' + ID[i] + '"').test(s)), secs.length + ' sections');
  let lostQ = 0, lostP = 0, total = 0;
  D.groups.forEach((g, i) => {
    const s = secs[i] || '';
    const title = flat((s.match(/<h2 class="section-title[^"]*"[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
    const items = s.split('<div class="faq-item').slice(1);
    const qs = items.map(x => flat((x.match(/<span class="faq-q-text">([\s\S]*?)<\/span>/) || [])[1] || ''));
    const good = title === g.name && qs.length === g.items.length && qs.every((q, k) => q === g.items[k].q);
    if (!good) lostQ++;
    g.items.forEach((it, k) => {
      const paras = [...(items[k] || '').matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => flat(m[1]));
      total += it.paras.length;
      if (paras.length !== it.paras.length || !it.paras.every((p, n) => flat(p) === paras[n])) lostP++;
    });
    ok(g.name + ': its name, ' + g.items.length + ' questions in order', good, good ? '' : title + ' / ' + qs.length);
  });
  ok('every answer word for word, paragraph for paragraph (' + total + ' paragraphs)', lostP === 0, lostP + ' answers differ');
  ok('62 questions in all', (body.match(/class="faq-item/g) || []).length === D.groups.reduce((n, g) => n + g.items.length, 0));
  const ids = [...body.matchAll(/aria-controls="([^"]+)"/g)].map(m => m[1]);
  ok('every question controls its own answer', ids.length === 62 && new Set(ids).size === 62 && ids.every(id => body.includes('id="' + id + '"')));
  ok('one open question a group', (body.match(/faq-item open/g) || []).length === D.groups.length);
  const links = [...body.matchAll(/<a href="([^"]+)"[^>]*class="faq-link"/g)].map(m => m[1]);
  ok(links.length + ' links in answers: the live ones, a page this prototype holds made local', links.length === 4 && links.every(h => /^https:\/\/plagiarismsearch\.com\//.test(h) || Object.values(LOCAL).includes(h)), links.join(' '));
}

console.log('\nthe figures');
{
  const figs = body.split('<div data-slot="aside" class="fg"').length - 1;
  ok('nine figures, one in each group\'s aside slot, hidden from assistive technology', figs === 9 && (body.match(/<div data-slot="aside" class="fg" aria-hidden="true">/g) || []).length === 9 &&
    body.split(/(?=<section\b)/).filter(s => /data-component="faq"/.test(s)).every(s => (s.match(/class="fg"/g) || []).length === 1));
  ok('built in HTML: no image, no inline style', !/<img\b/.test(body) && !/\sstyle="/.test(body));
  /* a figure's words are the interface's or the group's own; this list is all of them */
  const WORDS = ['Plagiarism', 'Citations', 'Add to Storage', 'API key', 'Paste or type your text here', 'Check for plagiarism', 'Moodle', 'Assignment', 'Private repository', 'Active',
    'An approximate grade', 'Grammar', 'Organization of ideas', 'Writing style', 'Content', 'Structure', 'Detect language', 'Free Check', 'Order Analysis', 'Readability score',
    'Words', 'Sentences', 'Syllables', 'Characters', 'Balance', 'Subscriptions', 'Payment history', 'Check for AI writing', 'Total AI rate', 'AI probability', 'Check Your Text'];
  const figText = [...body.matchAll(/<div data-slot="aside" class="fg"[\s\S]*?\n {6}<\/div>\n/g)].map(m => flat(m[0])).join(' ');
  const left = WORDS.reduce((t, w) => t.split(w).join(' '), figText).replace(/[.\d%•\s]|docx?|pdf/g, '');
  ok('no word on a figure outside the approved list', left === '', left.slice(0, 60));
}

console.log('\nthe inquiry form');
{
  const f = body.slice(body.indexOf('data-component="inquiry-form"'));
  ok('its heading: "' + D.form.heading + '"', flat((f.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '') === D.form.heading);
  const labels = [...f.matchAll(/<label class="cf-label" for="([^"]+)">([\s\S]*?)<\/label>/g)].map(m => [flat(m[2]).replace(/\s*\*$/, ''), /<i>\*<\/i>/.test(m[2]), m[1]]);
  ok('the six live fields in order, the same four required', JSON.stringify(labels.map(l => [l[0], l[1]])) === JSON.stringify(D.form.fields.map(x => [x.label, x.required])), labels.map(l => l[0] + (l[1] ? '*' : '')).join(', '));
  ok('each label names its field', labels.every(l => new RegExp('<(input|textarea) class="cf-field" id="' + l[2] + '"').test(f)));
  ok('the live button: "' + D.form.actions[0].label + '"', new RegExp('<button type="submit"[^>]*>\\s*' + D.form.actions[0].label).test(f));
  ok('inert: onsubmit="return false", no action', /<form[^>]*onsubmit="return false"/.test(f) && !/<form[^>]*\baction=/.test(f));
  ok('the sent message and the e-mail address are the live ones', f.includes(D.form.sent) && f.includes('href="mailto:services@plagiarismsearch.com"'));
}

console.log('\nstructure');
{
  const secs = [...body.matchAll(/<section\b[^>]*>/g)].map(m => m[0]);
  const comp = secs.map(s => (s.match(/data-component="([^"]+)"/) || [])[1]);
  ok('eleven sections: the hero, nine groups, the form', comp.join() === ['faq-hero', ...D.groups.map(() => 'faq'), 'inquiry-form'].join(), comp.join());
  const jumps = [...body.slice(0, body.indexOf('data-component="faq"')).matchAll(/<a href="#([^"]+)"/g)].map(m => m[1]);
  ok('the hero\'s nine jump links land on the nine groups', jumps.join() === ID.join());
  const grounds = secs.slice(1).map(s => (s.match(/data-bg="([^"]+)"/) || [])[1]);
  ok('grounds alternate from the first group to the form', grounds.every((g, i) => !i || g !== grounds[i - 1]), grounds.join(' '));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  ok(ids.length + ' ids, none twice', new Set(ids).size === ids.length, ids.filter((x, i) => ids.indexOf(x) !== i).slice(0, 4).join(' '));
  ok('no <style>, no <script>, no on* handler but the inert form\'s', !/<style|<script/.test(body) && (body.match(/\son[a-z]+="/g) || []).length === 1);
}

console.log('\ngates — open items, not defects');
console.log('  G1    The answers are the live page\'s and some no longer agree with the approved pages (file size 64 MB / 2 MB vs 24 MB; "Moodle now, Canvas and Blackboard planned"; the report\'s colours; "will not be added to any databases" vs Storage). Content is the client\'s to update.');
console.log('  G2    The live "Live Chat" button is not carried: the prototype has no chat to open.');
console.log('  G3    Linked from the header (Resources), the footer and the Help Center\'s FAQ card. The two "Visit the Help Center" links (AI Detector, Pricing) still go to the live /faq-and-support.');

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok'));
process.exit(failed ? 1 : 0);
