/* Does site/plagiarism-and-ai-check-report.html still say what the live page says, in
   the order it says it?

   The page has no brief. It is a migration of an article whose logic is sequential, and
   the instruction was that the sequence must not be broken — so that is what this
   checks, block by block, against build/report-guide-data.json.

     node build/check-report-guide.js
*/
const fs = require('fs');
const path = require('path');

const FILE = 'plagiarism-and-ai-check-report.html';
const html = fs.readFileSync(path.join(__dirname, '..', 'site', FILE), 'utf8');
const src = require('./report-guide-data.json');
const B = src.paras;

const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const text = body.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
                 .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—')
                 .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
                 .replace(/&quot;/g, '"')
                 .replace(/\s+/g, ' ')
                 /* a stripped tag leaves a space where it stood; close it only where the
                    mark ends a word, or this eats the space in ".docx"-shaped strings */
                 .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1')
                 .trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('\n' + FILE + ' — the live article, in its own order\n');

/* ── every block, once, unreworded ────────────────────────────────────────── */
/* The seven definition blocks are rendered as a heading and a paragraph, which is the
   point of the section — so they are checked as their two halves, not as the single
   string the live page runs them together into. Nothing else is split. */
const SPLIT = new Set([11, 12, 13, 14, 15, 16, 17]);
const halves = b => {
  const m = b.t.match(/^(.+?)\s+[–-]\s+([\s\S]+)$/);
  if (!m) throw new Error('block ' + b.i + ' will not split');
  return [m[1].trim(), m[2].trim()];
};

const pieces = [];               /* what must appear, in source order */
for (const b of B) {
  if (b.items && b.items.length) b.items.forEach(t => pieces.push({ i: b.i, t, kind: 'item' }));
  else if (SPLIT.has(b.i)) halves(b).forEach(t => pieces.push({ i: b.i, t, kind: 'half' }));
  else pieces.push({ i: b.i, t: b.t, kind: 'block' });
}

{
  const missing = pieces.filter(p => !text.includes(p.t));
  ok(pieces.length + ' pieces of copy present, unreworded', !missing.length,
     missing.slice(0, 3).map(p => '[' + p.i + '] "' + p.t.slice(0, 44) + '…"').join(' · '));
}

/* the seven "Name – description" blocks were split into a card; both halves must be
   there, and the name must read as a heading rather than having been dropped */
{
  const defs = [11, 12, 13, 14, 15, 16, 17].map(i => {
    const m = B[i].t.match(/^(.+?)\s+[–-]\s+([\s\S]+)$/);
    return { i, name: m[1].trim(), body: m[2].trim() };
  });
  const lostName = defs.filter(d => !new RegExp('<h3[^>]*>' + d.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '</h3>').test(body));
  ok('7 category names are headings', !lostName.length, lostName.map(d => d.name).join(' · '));
  const lostBody = defs.filter(d => !text.includes(d.body));
  ok('7 category descriptions intact', !lostBody.length, lostBody.map(d => d.name).join(' · '));
}

/* the six colours, each shown as well as named */
{
  const NAMES = ['Red', 'Yellow', 'Purple', 'Green', 'Dark blue', 'Light blue'];
  const named = NAMES.filter(n => text.includes(n));
  ok('6 colours named', named.length === 6, NAMES.filter(n => !named.includes(n)).join(' · '));
  const swatches = (body.match(/rounded-md ring-1 ring-black\/10" style="background:#/g) || []).length;
  ok('6 colours actually shown', swatches === 6, swatches + ' swatches');
}

/* ── the order, which is the whole point ──────────────────────────────────── */
{
  /* Only on pieces long enough to locate. "AI" is a whole list item on the live page and
     indexOf finds it in the first paragraph that happens to mention AI, which would
     report a break in an order that is fine. */
  const positions = pieces.filter(p => p.t.length >= 25).map(p => ({ ...p, at: text.indexOf(p.t) }));
  const found = positions.filter(p => p.at >= 0);
  const broken = found.filter((p, n) => n && p.at < found[n - 1].at);
  ok(found.length + ' locatable pieces in the order the article runs', !broken.length,
     broken.slice(0, 3).map(p => 'block ' + p.i + ' "' + p.t.slice(0, 30) + '…"').join(' · '));

  /* the short ones still have to be somewhere, and inside the section that introduces
     them — the five option chips belong to §3 and nowhere else */
  const s3 = body.slice(body.indexOf('id="before-you-submit"'), body.indexOf('id="report-shows"'));
  const chips = [...B[5].items, ...B[7].items];
  const astray = chips.filter(c => !s3.includes('>\n                ' + c + '\n') && !s3.includes(c));
  ok(chips.length + ' option chips sit in the section that introduces them', !astray.length, astray.join(' · '));
}

/* ── nothing said twice ───────────────────────────────────────────────────── */
{
  const long = pieces.filter(p => p.t.length > 60);
  const twice = long.filter(p => text.indexOf(p.t) !== text.lastIndexOf(p.t));
  ok('no block printed twice', !twice.length, twice.map(p => 'block ' + p.i).join(' · '));
}

/* ── the page's own head and shape ────────────────────────────────────────── */
{
  ok('one h1, and it is the live heading',
     (body.match(/<h1\b/g) || []).length === 1 && body.includes('>' + src.h1 + '</h1>'));
  ok('the live title', html.includes('<title>' + src.meta.title + '</title>'));
  ok('the live meta description', html.includes('content="' + src.meta.description + '"'));

  const ids = [...body.matchAll(/<section[^>]+id="([^"]+)"/g)].map(m => m[1]);
  ok('sections in order',
     ids.join(',') === 'report-guide,why-check,before-you-submit,report-shows,report-categories,report-colours,report-closing',
     ids.join(', '));

  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const idsAll = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set(anchors)].filter(a => !idsAll.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(' · '));

  ok('the way back to the guide index is on the page',
     (body.match(/href="user-manuals\.html"/g) || []).length >= 1);
}

/* ── the two plain-text destinations were made usable ─────────────────────── */
{
  ok('the account link is a link', /href="https:\/\/plagiarismsearch\.com\/account\/buy"/.test(body));
  ok('the support address is a mailto', /href="mailto:services@plagiarismsearch\.com"/.test(body));
  const offsite = [...body.matchAll(/<a[^>]+href="https?:[^"]*"[^>]*>/g)];
  ok('every outbound link carries rel="noopener"',
     offsite.every(a => /rel="noopener"/.test(a[0])), offsite.length + ' outbound');
}

/* ── what this page must not do ───────────────────────────────────────────── */
{
  ok('no invented sub-heading carries product claims',
     !/<h2[^>]*>[^<]*(best|leading|guarantee|100%|most accurate)/i.test(body));
  /* The article scheme: two content widths and no third. A page that drifts back to
     four different max-widths is the page Olex called hard to read — the edges have to
     line up, and they only line up if there is nothing else to line up with. */
  const widths = [...new Set([...body.matchAll(/max-w-\[(\d+)px\]/g)].map(m => +m[1]))].sort((a, b) => a - b);
  ok('exactly two content widths inside the page shell',
     widths.length === 3 && widths[0] === 700 && widths[1] === 1080 && widths[2] === 1280,
     widths.join(' · ') + ' (1280 is the shell)');

  const col = (body.match(/max-w-\[700px\] mx-auto/g) || []).length;
  const wide = (body.match(/max-w-\[1080px\] mx-auto/g) || []).length;
  ok('every block is centred on the same axis', col >= 8 && wide >= 3,
     col + ' on the column, ' + wide + ' breakouts');

  ok('no per-element measure fighting the column',
     !/max-w-\[\d+ch\]/.test(body), (body.match(/max-w-\[\d+ch\]/g) || []).join(' · '));
}

console.log('\n' + (failed
  ? '  ' + failed + ' FAILED\n'
  : FILE + ' carries the live article whole, in order\n'));
process.exit(failed ? 1 : 0);
