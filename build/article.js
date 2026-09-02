/* The text-page template.

   Lifted whole from site/blog-best-checker-2026.html, which is the shape this site had
   already settled on for long-form text: one column dead centre at 700px, a masthead, a
   contents box, and then semantic blocks that are styled once here instead of once per
   section. Nothing in it is new — every class below is copied from that page.

   The point is that a new text page should be a list of blocks, not a layout job:

     const { page } = require('./article');
     const { html, style } = page({
       breadcrumb: [['All guides', 'user-manuals.html'], 'Plagiarism and AI Check Report'],
       h1: '…',
       meta: ['November 29, 2025', '8 min read'],
       blocks: [
         { t: 'h2', text: 'What the report shows' },
         { t: 'p',  html: '…' },
         { t: 'ul', items: ['…', '…'] },
         { t: 'ol', items: ['…'] },
         { t: 'note', html: '…', tone: 'teal' },
       ],
     });

   Contents is built from the h2 blocks; ids are slugs of their own text, truncated to 40
   characters the way the blog page truncates its own. Word count is counted, not typed.
*/

const esc = s => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|nbsp);)/g, '&amp;');

const slug = t => t.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40)
  .replace(/-+$/, '');

/* ── the one body ramp, and the classes built on it ───────────────────────── */
const BODY = 'text-[15.5px] sm:text-[16px] lg:text-[17px] text-ink-700 leading-[1.72]';

/* The masthead and contents classes are the blog post's, with one change: everything
   that page sets in ink-400 or ink-300 is ink-500 here. Measured on the rendered page,
   ink-400 on white is 2.54:1 and the ink-300 breadcrumb slash is 1.47, against the 4.5
   AA asks of text that size. site/blog-best-checker-2026.html carries the same values
   and so fails the same way — worth fixing there too. */
const CLS = {
  h1:   'text-[clamp(2.4rem,5.5vw,3.6rem)] font-extrabold tracking-tightest leading-[1.06] mb-5 sm:mb-6 lg:mb-7',
  h2:   'text-[21px] sm:text-[23px] lg:text-[26px] font-extrabold tracking-tightest leading-[1.2] scroll-mt-28 mt-10 sm:mt-12 lg:mt-14 mb-4 lg:mb-5',
  h3:   'text-[17px] sm:text-[19px] lg:text-[20px] font-bold tracking-tight leading-snug mt-8 sm:mt-9 lg:mt-10 mb-3 lg:mb-4',
  p:    BODY + ' mb-4 sm:mb-5 lg:mb-6',
  li:   'flex gap-3 ' + BODY,
  oli:  BODY + ' pl-10 relative',
  note: 'my-8 sm:my-10 lg:my-12 rounded-2xl sm:rounded-3xl lg:rounded-[28px] p-5 sm:p-6 lg:p-7',
};

const TICK = '<svg class="shrink-0 mt-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

const dot = colour =>
  `<span class="shrink-0 w-3.5 h-3.5 mt-[.42em] rounded-full ring-1 ring-black/10" style="background:${colour}" aria-hidden="true"></span>`;

const bullet = '<span class="shrink-0 w-1.5 h-1.5 mt-[.7em] rounded-full bg-orange-400" aria-hidden="true"></span>';

/* ── one block ────────────────────────────────────────────────────────────── */
const render = b => {
  switch (b.t) {
    case 'h2':
      return `        <h2 id="${b.id || slug(b.text)}" class="${CLS.h2}">${esc(b.text)}</h2>`;

    case 'h3':
      return `        <h3 class="${CLS.h3}">${esc(b.text)}</h3>`;

    case 'p':
      return `        <p class="${CLS.p}">${b.html}</p>`;

    /* marker: 'check' (default), 'bullet', or an array of colours, one per item */
    case 'ul': {
      const mark = i => Array.isArray(b.marker) ? dot(b.marker[i])
        : b.marker === 'bullet' ? bullet
        : TICK;
      return `        <ul class="space-y-3 mb-4 sm:mb-5 lg:mb-6">
${b.items.map((it, i) => `          <li class="${CLS.li}">
            ${mark(i)}
            <span>${it}</span>
          </li>`).join('\n')}
        </ul>`;
    }

    case 'ol':
      return `        <ol class="counter mb-5 sm:mb-6 lg:mb-7 space-y-3">
${b.items.map(it => `          <li class="${CLS.oli}">${it}</li>`).join('\n')}
        </ol>`;

    /* a boxed aside. tone 'teal' for something worth acting on, 'ink' for a note */
    case 'note': {
      const skin = b.tone === 'teal' ? 'bg-teal-50 ring-1 ring-teal-600/10' : 'bg-ink-50';
      const inner = (b.blocks || [{ t: 'p', html: b.html }])
        .map(x => render(x).replace(/\bmb-4 sm:mb-5 lg:mb-6\b/, 'mb-3 last:mb-0'))
        .join('\n');
      return `        <div class="${CLS.note} ${skin}">
${b.label ? `          <p class="text-[10px] sm:text-[10.5px] font-bold tracking-[0.22em] uppercase text-ink-600 mb-3">${esc(b.label)}</p>` : ''}
${inner}
        </div>`;
    }

    default:
      throw new Error('article: unknown block type "' + b.t + '"');
  }
};

/* ── the page ─────────────────────────────────────────────────────────────── */
const words = blocks => blocks.reduce((n, b) => {
  const t = [b.text, b.html, ...(b.items || []), ...(b.blocks || []).map(x => x.html || '')]
    .filter(Boolean).join(' ').replace(/<[^>]+>/g, ' ');
  return n + (t.match(/\S+/g) || []).length;
}, 0);

const page = ({ breadcrumb = [], h1, meta = [], blocks, tocLabel = 'On this page', ground = 'bg-white' }) => {
  if (!h1 || !Array.isArray(blocks) || !blocks.length) throw new Error('article: h1 and blocks are required');

  const heads = blocks.filter(b => b.t === 'h2');
  const crumbs = breadcrumb.map((c, i) => Array.isArray(c)
    ? `          <a href="${c[1]}" class="hover:text-ink-700 transition-colors duration-300">${esc(c[0])}</a>
          <span class="text-ink-500">/</span>`
    : `          <span class="text-ink-700">${esc(c)}</span>`).join('\n');

  const html = `  <section class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 ${ground}">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[560px] h-[560px] bg-teal-500/10 -left-44 -top-40"></div>
      <div class="orb w-[420px] h-[420px] bg-teal-500/15 -right-24 -top-40"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <!-- One column, dead centre: 700px of text, nothing in the margins. Body type is
           15.5/16/17, the one ramp the site uses. At 700 that runs to about 86
           characters a line — wider than the 65–75 reading is comfortable at, and a
           deliberate call: one body size across the site was worth more than the
           measure here. Narrowing the column is the fix if that stops being true. -->
      <div class="mx-auto max-w-[700px]">

        <div class="rv mb-6 sm:mb-8 lg:mb-10">
${crumbs ? `          <nav class="flex items-center gap-2 text-[12.5px] font-medium text-ink-500 mb-4 sm:mb-5 lg:mb-6" aria-label="Breadcrumb">
${crumbs}
          </nav>` : ''}
          <h1 class="${CLS.h1}">${esc(h1)}</h1>
${meta.length ? `          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
${meta.map((m, i) => (i ? '            <span class="w-1 h-1 rounded-full bg-ink-300" aria-hidden="true"></span>\n' : '') +
  `            <span class="text-[12.5px] font-medium text-ink-500">${m}</span>`).join('\n')}
          </div>` : ''}
        </div>

${heads.length ? `        <nav class="rv rounded-3xl sm:rounded-[28px] bg-ink-50 p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12" aria-label="${esc(tocLabel)}">
          <div class="flex items-center gap-3 mb-4 lg:mb-5">
            <span class="text-[10px] sm:text-[10.5px] font-bold tracking-[0.22em] uppercase text-ink-500">${esc(tocLabel)}</span>
            <span class="ml-auto text-[11.5px] font-medium text-ink-500"><span class="nums">${words(blocks).toLocaleString('en-US')}</span> words</span>
          </div>
          <ul class="grid gap-y-2.5">
${heads.map(h => `            <li class="flex gap-2.5">
              <span class="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-ink-300" aria-hidden="true"></span>
              <a href="#${h.id || slug(h.text)}" class="min-w-0 text-[13.5px] sm:text-[14.5px] font-medium text-ink-600 hover:text-ink-900 leading-snug transition-colors duration-300">${esc(h.text)}</a>
            </li>`).join('\n')}
          </ul>
        </nav>` : ''}

        <div class="rv">
${blocks.map(render).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

  return { html, headings: heads.map(h => ({ id: h.id || slug(h.text), text: h.text })), words: words(blocks) };
};

/* the one rule the template needs beyond Tailwind — the drawn list counter, copied
   from the blog page so a numbered list carries the article's own type and colour */
const style = `  /* numbered list: the counter is drawn rather than left to the browser so it can
     carry the article's own type and colour */
  .counter { counter-reset: step; }
  .counter > li { counter-increment: step; }
  .counter > li::before {
    content: counter(step);
    position: absolute; left: 0; top: .1em;
    width: 1.65em; height: 1.65em;
    display: flex; align-items: center; justify-content: center;
    border-radius: 999px; background: #E6F4F7; color: #0991A8;
    font-size: .72em; font-weight: 800; font-variant-numeric: tabular-nums;
  }`;

module.exports = { page, render, slug, style, CLS, BODY };
