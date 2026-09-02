/* The floating v1 / v2 switcher — a review tool, not part of the site.

   Three pages are being rebuilt against a brief while their current versions stay live
   beside them, and comparing the two meant typing URLs. This puts the pair one click
   apart, from either side: the switcher appears on BOTH halves, so v1 can reach v2 and
   back. A one-way link would not be a switcher.

   It lives here rather than in the three generators because the v1 pages are hand-written
   and have no generator — and because six inlined copies of one widget is exactly the
   drift build/shell.js was written to end.

   TEMPORARY. It carries its own marker comments so shell.js can replace or remove it
   idempotently, and so a grep for VSWITCH finds every instance when the comparison is
   over and the losing versions are retired.
*/

/* Each pair, both ways round. A page absent from this table gets no switcher, and any
   switcher previously written into it is stripped — so retiring a v1 is one deletion
   here rather than an edit in two files. */
const PAIRS = {
  'index.html':            { other: 'index-v2.html',        self: 1 },
  'index-v2.html':         { other: 'index.html',           self: 2 },
  'ai-detector.html':      { other: 'ai-detector-v2.html',  self: 1 },
  'ai-detector-v2.html':   { other: 'ai-detector.html',     self: 2 },
  'api.html':              { other: 'api-v2.html',          self: 1 },
  'api-v2.html':           { other: 'api.html',             self: 2 },
  'prices.html':           { other: 'prices-v2.html',       self: 1 },
  'prices-v2.html':        { other: 'prices.html',          self: 2 },
  /* the same guide two ways: v1 designs each section, v2 runs the whole article
     through build/article.js — the template lifted from the blog post */
  'plagiarism-and-ai-check-report.html':    { other: 'plagiarism-and-ai-check-report-v2.html', self: 1 },
  'plagiarism-and-ai-check-report-v2.html': { other: 'plagiarism-and-ai-check-report.html',    self: 2 },
};

const OPEN = '<!-- VSWITCH · temporary review tool, remove with the retired version -->';
const CLOSE = '<!-- /VSWITCH -->';

const seg = (n, active, href) => active
  ? `      <span aria-current="page" class="rounded-full bg-ink-900 text-white text-[12px] font-bold px-3.5 py-1.5 tabular-nums">${n}</span>`
  : `      <a href="${href}" class="rounded-full text-[12px] font-bold text-ink-500 hover:text-ink-900 hover:bg-ink-100 px-3.5 py-1.5 tabular-nums transition-colors duration-200">${n}</a>`;

/* Bottom centre, above everything, and out of the way of the sticky header. Hidden when
   printing — it is scaffolding, and it should not turn up in a PDF sent to anyone. */
function markup(file) {
  const pair = PAIRS[file];
  if (!pair) return null;
  return [
    OPEN,
    '<div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] print:hidden">',
    '  <div class="flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md ring-1 ring-black/10 shadow-diffuse-lg p-1 pl-3">',
    '    <span class="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-400">Version</span>',
    '    <div class="flex items-center gap-0.5 ml-1.5">',
    seg(1, pair.self === 1, pair.self === 1 ? '#' : pair.other),
    seg(2, pair.self === 2, pair.self === 2 ? '#' : pair.other),
    '    </div>',
    '  </div>',
    '</div>',
    CLOSE,
  ].join('\n');
}

/* Idempotent: strip whatever is there, then write the current one back if this page has
   a pair. Running it twice leaves the file identical, which is what lets shell.js call
   it on every build without accumulating widgets. */
function apply(html, file) {
  const a = html.indexOf(OPEN);
  if (a > -1) {
    const b = html.indexOf(CLOSE, a);
    if (b < 0) throw new Error(file + ': VSWITCH opened but never closed');
    /* Normalise both sides of the cut to exactly what a page without a switcher looks
       like: one newline before </body>, nothing after the block. Without this the strip
       leaves a blank line the next insert does not, the file differs on every run, and
       shell.js --check calls all six pages stale forever. */
    html = html.slice(0, a).replace(/\n+$/, '\n') +
           html.slice(b + CLOSE.length).replace(/^\n+/, '');
  }
  const block = markup(file);
  if (!block) return html;

  const at = html.lastIndexOf('</body>');
  if (at < 0) throw new Error(file + ': no </body> to anchor the switcher to');
  return html.slice(0, at) + block + '\n' + html.slice(at);
}

module.exports = { apply, PAIRS };
