/* Read the live "Support & Frequently Asked Questions" page into build/faq-data.json.

   There is no brief for this page, so its words are the live page's. This reads them
   once, deliberately, and build/faq.js builds from the stored copy:

     curl -sL -A "Mozilla/5.0" https://plagiarismsearch.com/faq-and-support -o build/legal/faq-and-support.html
     node build/faq-fetch.js

   The page is nine groups — a heading, an illustration (its file name and alt are kept as
   a record of what the live page showed, not used), an accordion — and an inquiry form.
   An answer is stored as paragraphs of inline HTML (a, strong, em, br). */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'legal', 'faq-and-support.html');
const OUT = path.join(__dirname, 'faq-data.json');
const h = fs.readFileSync(SRC, 'utf8');

const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;/g, '\'').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
  .replace(/&quot;/g, '"').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—').replace(/&hellip;/g, '…');
const text = s => ent(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const bare = s => s.replace(/<[^>]+>/g, '').trim();

/* An answer as paragraphs of inline HTML — what the library's FAQ takes (items: { q, paras }):
   a, strong, em, br inside a paragraph; everything else unwrapped. The one table on the
   page (words per submission) becomes one paragraph, a row a line, its header row bold:
   the FAQ component has no table, and every figure of it is kept. */
const INLINE = ['a', 'strong', 'em', 'br'];
const inline = s => ent(s)
  .replace(/<(\/?)([a-z0-9]+)\b([^>]*)>/gi, (m, close, tag, attrs) => {
    tag = tag.toLowerCase();
    if (tag === 'b') tag = 'strong';
    if (tag === 'i') tag = 'em';
    if (!INLINE.includes(tag)) return ' ';
    if (close) return '</' + tag + '>';
    if (tag === 'a') { const href = (attrs.match(/href="([^"]*)"/i) || [])[1]; return href ? '<a href="' + href.trim() + '">' : ''; }
    return '<' + tag + '>';
  })
  .replace(/\s+/g, ' ').replace(/\s*<br>\s*/g, '<br>').replace(/<(strong|em)>\s*<\/\1>/g, '').replace(/^(<br>)+|(<br>)+$/g, '').trim();
const table = t => {
  const rows = [...t.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(r => ({
    head: /<th\b/i.test(r[1]),
    cells: [...r[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(c => text(c[1])),
  }));
  return '<p>' + rows.map(r => (r.head ? '<strong>' + r.cells.join(' — ') + '</strong>' : r.cells.join(' — '))).join('<br>') + '</p>';
};
const paras = s => {
  const src = s.replace(/<!--[\s\S]*?-->/g, '').replace(/<table[\s\S]*?<\/table>/gi, table);
  const out = [];
  let last = 0;
  const push = x => { const p = inline(x); if (bare(p)) out.push(p); };
  for (const m of src.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    push(src.slice(last, m.index));
    push(m[1]);
    last = m.index + m[0].length;
  }
  push(src.slice(last));
  return out;
};

const title = text((h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
const meta = ent((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
const h1 = text((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '');

/* each group: from its faq-block opener to the next one (or to the form) */
const starts = [...h.matchAll(/<div class="[^"]*page-content-faq[^"]*"[^>]*>/g)].map(m => m.index);
const formAt = h.indexOf('faq-form');
if (!starts.length || formAt < 0) throw new Error('faq-fetch: the page has changed shape');
const groups = starts.map((s, i) => {
  const seg = h.slice(s, i + 1 < starts.length ? starts[i + 1] : formAt);
  const name = text((seg.match(/<h3[^>]*>([\s\S]*?)<\/h3>/) || [])[1] || '');
  const img = seg.match(/<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/) || [];
  const items = [...seg.matchAll(/<div class="collapsible-header[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="collapsible-body[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/li>/g)]
    .map(m => ({ q: text(m[1]), paras: paras(m[2]) })).filter(x => x.q && x.paras.length);
  return { name, liveImage: (img[1] || '').trim(), liveAlt: ent(img[2] || ''), items };
});

/* the inquiry form: its heading, its sent message, its fields with their labels, its actions */
const f = h.slice(formAt, h.indexOf('<footer', formAt));
const heading = text((f.match(/<div class="custom-h1-1[^"]*"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || '');
const sent = text((f.match(/<div class="inquiry-message-send"[^>]*>([\s\S]*?)<\/div>/) || [])[1] || '');
const fields = [...f.matchAll(/<label[^>]*>([\s\S]*?)<\/label>\s*<(input|textarea)\b([^>]*)>/g)].map(m => {
  const label = text(m[1]);
  return { name: (m[3].match(/name="([^"]*)"/) || [])[1] || '', tag: m[2], label: label.replace(/^\*\s*/, '').replace(/:\s*$/, ''), required: /^\*/.test(label) };
});
const actions = [...f.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(m => ({ label: text(m[2]), href: (m[1].match(/href="([^"]*)"/) || [])[1] || '' })).filter(a => a.label);

const data = { source: 'https://plagiarismsearch.com/faq-and-support', fetched: new Date().toISOString().slice(0, 10), title, meta, h1, groups,
  form: { heading, sent, fields, actions } };
fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
console.log('  build/faq-data.json — "' + h1 + '"');
groups.forEach(g => console.log('    ' + String(g.items.length).padStart(2) + '  ' + g.name + '   [' + g.liveImage.split('/').pop() + ']'));
console.log('    ' + groups.reduce((n, g) => n + g.items.length, 0) + ' questions in ' + groups.length + ' groups');
console.log('    form: "' + heading + '" · ' + fields.map(x => x.label + (x.required ? '*' : '')).join(', ') + ' · ' + actions.map(a => a.label).join(' | ') + ' · sent: "' + sent + '"');
