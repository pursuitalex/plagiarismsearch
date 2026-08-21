/* Build the legal pages from the live document, styled to this design system.

   The text is the client's own, carried over word for word: this generator only decides
   how it looks. It never rewrites, shortens or reorders a sentence — the only edits it
   makes to the source markup are to rewrite absolute links back to the pages we have,
   and to drop attributes the old stylesheet needed and this one does not.

   The source is fetched once into build/legal/, so a rebuild does not depend on the
   network and the exact text that was approved is what ships. Refresh it deliberately:

     curl -sL -A "Mozilla/5.0" https://plagiarismsearch.com/terms-of-use \
       -o build/legal/terms-of-use.html
     node build/legal.js  →  node build/shell.js  →  node build/check.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SRC  = path.join(__dirname, 'legal');

/* slug        our filename, which is also the approved production path
   container   the class the live page wraps its document in
   eyebrow     where this sits in the footer's own grouping
   intro       null unless the page needs a line the source does not carry  */
const PAGES = [
  { slug: 'terms-of-use',  container: 'terms-of-use',  eyebrow: 'Plans &amp; Legal', title: 'Terms of Use' },
  { slug: 'policy',        container: 'policy',        eyebrow: 'Plans &amp; Legal', title: 'Privacy Policy' },
  { slug: 'cookie-policy', container: 'cookie-policy', eyebrow: 'Plans &amp; Legal', title: 'Cookie Policy' },
];

/* absolute addresses on the live site that we hold a page for */
const LOCAL = {
  'https://plagiarismsearch.com/terms-of-use':  'terms-of-use.html',
  'https://plagiarismsearch.com/policy':        'policy.html',
  'https://plagiarismsearch.com/cookie-policy': 'cookie-policy.html',
  'https://plagiarismsearch.com/prices':        'prices.html',
  'https://plagiarismsearch.com/contact-us':    'contact-us.html',
};

/* ── the head, borrowed from a real page so the tailwind config stays one config ── */
const donor = fs.readFileSync(path.join(SITE, 'help-center.html'), 'utf8');
const head = donor.slice(0, donor.indexOf('<body'));
const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

/* ── type, in one place so the three pages cannot drift ───────────────────── */
const T = {
  body: 'text-[15.5px] sm:text-[16px] lg:text-[16.5px] text-ink-700 leading-[1.75]',
  h2:   'text-[19px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tightest leading-[1.25] scroll-mt-28 mt-10 sm:mt-12 lg:mt-14 mb-3 lg:mb-4',
  h3:   'text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight leading-snug mt-7 sm:mt-8 mb-2.5 lg:mb-3',
  h4:   'text-[15px] sm:text-[15.5px] font-bold tracking-tight mt-6 mb-2',
};

const slugOf = s => s.toLowerCase().replace(/&[a-z]+;/g, ' ').replace(/<[^>]+>/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 44);

/* Inline markup is kept as the source wrote it — links, bold, italics — and only the
   things that would fight this stylesheet are touched. */
const clean = html => html
  .replace(/\s(class|style|id|target|rel|onclick)="[^"]*"/gi, '')
  .replace(/href="([^"]+)"/gi, (m, href) => {
    const local = LOCAL[href.replace(/\/$/, '')];
    return 'href="' + (local || href) + '"' + (local || href.startsWith('mailto:') ? '' : ' rel="noopener"');
  })
  .replace(/<a /gi, '<a class="text-teal-700 underline decoration-teal-600/30 underline-offset-2 hover:text-teal-800 hover:decoration-teal-600 transition-colors duration-300" ')
  .replace(/<strong>/gi, '<strong class="font-bold text-ink-900">')
  .replace(/<b>/gi, '<b class="font-bold text-ink-900">')
  .replace(/\s+/g, ' ')
  .trim();

function render(page) {
  const file = path.join(SRC, page.slug + '.html');
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, 'utf8');

  /* the container, by counting div depth: it holds nested divs and the page's footer
     follows it, so neither the next </div> nor the next </main> is the right edge */
  const open = new RegExp('<div class="' + page.container + '[^"]*"[^>]*>', 'i');
  const m = src.match(open);
  if (!m) throw new Error(page.slug + ': no .' + page.container + ' container');
  const from = m.index + m[0].length;
  let depth = 1, end = -1;
  const tag = /<\/?div\b[^>]*>/gi;
  tag.lastIndex = from;
  let t;
  while ((t = tag.exec(src))) {
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) { end = t.index; break; }
  }
  if (end < 0) throw new Error(page.slug + ': container never closes');
  const doc = src.slice(from, end);

  /* top-level blocks, in the order the document sets them */
  const blocks = [];
  const re = /<(h1|h2|h3|h4|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let b;
  while ((b = re.exec(doc))) {
    const html = b[2].trim();
    if (!html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()) continue;
    blocks.push({ tag: b[1].toLowerCase(), html });
  }

  const h1 = blocks.find(x => x.tag === 'h1');
  const rest = blocks.filter(x => x !== h1);

  /* The line the document dates itself with is metadata, not a paragraph: it belongs in
     the masthead beside the title rather than as the first sentence of the text. */
  const dateIdx = rest.findIndex(x => x.tag === 'p' && /^\s*(last\s+updated|effective\s+date)/i.test(x.html.replace(/<[^>]+>/g, '')));
  const dated = dateIdx >= 0 ? rest.splice(dateIdx, 1)[0] : null;

  /* Contents, built from the document's own section headings. Derived, not written:
     nothing here is a sentence anyone had to compose. */
  const sections = rest.filter(x => x.tag === 'h2').map(x => ({
    id: slugOf(x.html), text: clean(x.html).replace(/<[^>]+>/g, ''),
  }));
  let n = 0;
  const markup = rest.map(x => {
    const inner = clean(x.html);
    if (x.tag === 'h2') return `        <h2 id="${sections[n++].id}" class="${T.h2}">${inner}</h2>`;
    if (x.tag === 'h3') return `        <h3 class="${T.h3}">${inner}</h3>`;
    if (x.tag === 'h4') return `        <h4 class="${T.h4}">${inner}</h4>`;
    if (x.tag === 'p')  return `        <p class="${T.body} mb-4 sm:mb-5">${inner}</p>`;
    /* lists keep the marker the source chose; only the styling is ours */
    const items = [...x.html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(li => clean(li[1]));
    const ordered = x.tag === 'ol';
    return [
      `        <${x.tag} class="${ordered ? 'counter ' : ''}space-y-2.5 mb-5 sm:mb-6">`,
      ...items.map(it => ordered
        ? `          <li class="${T.body} pl-9 relative">${it}</li>`
        : `          <li class="${T.body} flex gap-3"><span class="shrink-0 w-1.5 h-1.5 mt-[.7em] rounded-full bg-teal-500" aria-hidden="true"></span><span>${it}</span></li>`),
      `        </${x.tag}>`,
    ].join('\n');
  }).join('\n');

  const others = PAGES.filter(p => p.slug !== page.slug);

  return { blocks: blocks.length, sections: sections.length, html: head
    .replace(/<title>[\s\S]*?<\/title>/, '<title>' + page.title + ' | PlagiarismSearch</title>') + `
<style>
  /* numbered list, drawn rather than left to the browser so it carries our own type */
  .counter { counter-reset: step; }
  .counter > li { counter-increment: step; }
  .counter > li::before {
    content: counter(step);
    position: absolute; left: 0; top: .15em;
    width: 1.6em; height: 1.6em;
    display: flex; align-items: center; justify-content: center;
    border-radius: 999px; background: #E8F8FB; color: #0991A8;
    font-size: .74em; font-weight: 800; font-variant-numeric: tabular-nums;
  }
</style>
${bodyTag}
<div class="grain"></div>

<header></header>

<main>
  <!-- Legal pages are reference, not reading: the text is the site's own, carried over
       word for word, and only its dress is new. One centred column at the site's reading
       size, a contents list built from the document's own headings, and no decoration
       competing with the clauses. -->
  <section class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 bg-white">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[560px] h-[560px] bg-teal-500/10 -left-44 -top-40"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="mx-auto max-w-[720px]">

        <div class="rv mb-8 sm:mb-10 lg:mb-12">
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-4 lg:mb-5">${page.eyebrow}</div>
          <h1 class="text-[clamp(2.1rem,4vw,3rem)] font-extrabold tracking-tightest leading-[1.06] mb-4 lg:mb-5">${clean(h1 ? h1.html : page.title)}</h1>
          ${dated ? `<p class="text-[13px] sm:text-[13.5px] font-semibold text-ink-400">${clean(dated.html)}</p>` : ''}
        </div>

        <nav class="rv rounded-3xl sm:rounded-[28px] bg-ink-50 p-4 sm:p-5 lg:p-6 mb-8 sm:mb-10 lg:mb-12" aria-label="On this page">
          <div class="text-[10px] sm:text-[10.5px] font-bold tracking-[0.22em] uppercase text-ink-400 mb-4 lg:mb-5">On this page</div>
          <ul class="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
${sections.map(s => `            <li class="flex gap-2.5">
              <span class="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-ink-300" aria-hidden="true"></span>
              <a href="#${s.id}" class="min-w-0 text-[13.5px] sm:text-[14px] font-medium text-ink-600 hover:text-ink-900 leading-snug transition-colors duration-300">${s.text}</a>
            </li>`).join('\n')}
          </ul>
        </nav>

        <article class="rv min-w-0">
${markup}
        </article>

        <div class="rv mt-10 sm:mt-12 lg:mt-14 pt-7 sm:pt-8 border-t border-ink-100">
          <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-4">Also in legal</div>
          <div class="flex flex-wrap gap-3">
${others.map(o => `            <a href="${o.slug}.html" class="btn-press inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 hover:bg-ink-900/5 px-4 sm:px-5 py-2.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-900 transition-colors duration-300">
              ${o.title}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>`).join('\n')}
          </div>
        </div>

      </div>
    </div>
  </section>
</main>

<footer></footer>
</body>
</html>
` };
}

let built = 0;
PAGES.forEach(p => {
  const out = render(p);
  if (!out) { console.log('  --  ' + p.slug + '  no source in build/legal/, skipped'); return; }
  fs.writeFileSync(path.join(SITE, p.slug + '.html'), out.html);
  console.log('  ok  site/' + p.slug + '.html  ' + out.blocks + ' blocks, ' + out.sections + ' sections');
  built++;
});
console.log(built + ' legal page(s) built');
