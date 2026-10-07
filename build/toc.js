/* The contents of a long-form page — "On this page" — one pattern for every long text:
   the article template (build/article.js: User Guide articles, blog posts), the legal
   pages (build/legal.js) and the hand-written blog post.

   Secondary Pages Design Correction Pack, 2026-10-06, section 2. The rule:

     a SHORT page (fewer than LONG sections) keeps what it had — a compact card at the
     top of the column, open, at every width;

     a LONG page gets two renditions of the same list, and CSS shows one of them:
       from 1280px   a rail in the left margin, sticky while the document scrolls; it
                     marks the section being read, and if it is taller than the window
                     it scrolls inside itself. The reading column does not move or narrow.
       below 1280px  the card at the top, folded (a <details>), so a list of thirty
                     sections does not stand between the title and the text.

   Nothing here is a new visual language: the rail is the Moodle guide's (.rail,
   .rail-link in 21-docs.css), the card is the article's own contents card, the marking
   of the current section is site.js module doc-nav ([data-doc-nav], data-spy), and the
   rail's inner scroll is the shared scrolling box ([data-scroll-fade="y"]).

     const toc = require('./toc');
     const long = toc.isLong(items);                 // items: [{ id, text }]  (text: HTML)
     toc.card(items, { cols: 2, aside: '…', rv: true })   // the short page's card
     toc.fold(items, { cols: 2, aside: '…', rv: true })   // the long page's card, folded
     toc.rail(items)                                       // the long page's rail
     toc.WRAP                                              // attributes of the element that holds rail + fold + text

   The wrapper (toc.WRAP: class="toc-wrap" data-doc-nav) is the rail's range: the rail
   sticks from the wrapper's top to its bottom, so the wrapper holds the text and nothing
   after it. CSS: build/assets/css/26-article.css. */
const LONG = 8;
const isLong = items => items.length >= LONG;
const WRAP = 'class="toc-wrap" data-doc-nav';

const LABEL = 'On this page';
const esc = s => String(s).replace(/"/g, '&quot;');
const CHEV = '<svg class="toc-fold-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

/* the list both cards print: the article's own (a dot, a link); tone: the label / dot greys
   the host page already uses (the article template runs one step darker, for contrast) */
const list = (items, o, pad) => `${pad}<ul class="grid ${o.cols === 2 ? 'sm:grid-cols-2 gap-x-6 ' : ''}gap-y-2.5">
${items.map(h => `${pad}  <li class="flex gap-2.5">
${pad}    <span class="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-ink-300" aria-hidden="true"></span>
${pad}    <a href="#${h.id}"${o.spy ? ` data-spy="${h.id}"` : ''} class="min-w-0 text-[13.5px] sm:text-[14.5px] font-medium text-ink-600 hover:text-ink-900 leading-snug transition-colors duration-300">${h.text}</a>
${pad}  </li>`).join('\n')}
${pad}</ul>`;

const CAP = tone => `text-[10px] sm:text-[10.5px] font-bold tracking-[0.22em] uppercase ${tone}`;

/* the short page's card — the markup the article template and the legal pages always had */
function card(items, o = {}) {
  const tone = o.tone || 'text-ink-500', label = o.label || LABEL, pad = o.pad || '        ';
  const head = o.aside
    ? `${pad}  <div class="flex items-center gap-3 mb-4 lg:mb-5">
${pad}    <span class="${CAP(tone)}">${label}</span>
${pad}    <span class="ml-auto text-[11.5px] font-medium ${tone}">${o.aside}</span>
${pad}  </div>`
    : `${pad}  <div class="${CAP(tone)} mb-4 lg:mb-5">${label}</div>`;
  return `${pad}<nav class="${o.rv ? 'rv ' : ''}rounded-3xl sm:rounded-[28px] bg-ink-50 p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12" aria-label="${esc(label)}">
${head}
${list(items, o, pad + '  ')}
${pad}</nav>`;
}

/* the long page's card, below 1280px: the same card, folded */
function fold(items, o = {}) {
  const tone = o.tone || 'text-ink-500', label = o.label || LABEL, pad = o.pad || '        ';
  return `${pad}<details class="toc-fold${o.rv ? ' rv' : ''} rounded-3xl sm:rounded-[28px] bg-ink-50 mb-8 sm:mb-10 lg:mb-12">
${pad}  <summary class="flex items-center gap-3 p-4 sm:p-5 lg:p-6">
${pad}    <span class="${CAP(tone)}">${label}</span>
${pad}    <span class="ml-auto flex items-center gap-3 text-[11.5px] font-medium ${tone}">${o.aside ? `<span>${o.aside}</span>` : ''}${CHEV}</span>
${pad}  </summary>
${pad}  <nav class="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6" aria-label="${esc(label)}">
${list(items, { ...o, spy: true }, pad + '    ')}
${pad}  </nav>
${pad}</details>`;
}

/* the long page's rail, from 1280px: the Moodle guide's rail in the column's left margin */
function rail(items, o = {}) {
  const label = o.label || LABEL, pad = o.pad || '        ';
  return `${pad}<aside class="toc-side" aria-label="${esc(label)}">
${pad}  <div class="rail">
${pad}    <p class="toc-side-label">${label}</p>
${pad}    <nav class="toc-side-scroll" data-scroll-fade="y" aria-label="${esc(label)}">
${pad}      <ul>
${items.map(h => `${pad}        <li><a href="#${h.id}" data-spy="${h.id}" class="rail-link">${h.text}</a></li>`).join('\n')}
${pad}      </ul>
${pad}    </nav>
${pad}  </div>
${pad}</aside>`;
}

module.exports = { LONG, isLong, WRAP, card, fold, rail };
