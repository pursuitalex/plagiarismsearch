/* Build site/user-manuals.html — the User Guide index — from the live page.

   Unlike the legal pages, this one was asked to be redesigned rather than restyled. What
   carries over is the content: the heading, the four category names and all twenty guide
   titles with their destinations, none of them reworded. What is new is the arrangement —
   the live page is four stacked lists of blue links; this is four cards in the site's own
   card idiom, each carrying its count and marking which links leave for the live site.

   Refresh the source deliberately:
     curl -sL -A "Mozilla/5.0" https://plagiarismsearch.com/user-manuals \
       -o build/legal/user-manuals.html
     node build/manuals.js  →  node build/shell.js  →  node build/check.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SRC  = path.join(__dirname, 'legal', 'user-manuals.html');

/* Destinations this prototype holds a page for. Everything else keeps its address on the
   live site, which is where those guides actually are — inventing local stubs for twenty
   articles would be twenty pages pretending to be documentation. */
const LOCAL = {
  'https://plagiarismsearch.com/integration-guide': 'integration-guide.html',
  'https://plagiarismsearch.com/how-to-use-plagiarismsearch-google-add-on': 'how-to-use-plagiarismsearch-google-add-on.html',
  'plagiarism-checker-app': 'chat-bot.html',
  'how-plagiarism-checker-work': 'https://plagiarismsearch.com/how-plagiarism-checker-work',
};

/* One generated spot icon per category — type D in IMAGES.md, the duotone family the
   ai-detector page set the benchmark for. Made as ONE sheet, never four separate
   generations: the model holds a single stroke weight only within one canvas.

   Measured against that benchmark on a true-thickness scan, not the row scan the guide
   prescribes — a row scan runs ALONG a horizontal stroke and reports its length, which
   put the layered-panels icon at 42px for an 8px line. Both sets rescored on the same
   scale: benchmark 7.00, this set 7.50, spread 1.

   Source sheet kept at build/legal/ug-sheet.jpg. Without it the weight cannot be
   retuned and the set has to be generated again from nothing. */
const ICONS = {
  'Plagiarism Check':                'cat-check',
  'Moodle Integration':              'cat-moodle',
  'Services Overview':               'cat-services',
  'Account Features and Management': 'cat-account',
};

/* ── the document, by div depth ───────────────────────────────────────────── */
const src = fs.readFileSync(SRC, 'utf8');
let m = null;
const opens = /<div\s+class="([^"]*)"[^>]*>/gi;
let o;
while ((o = opens.exec(src))) {
  if (o[1].split(/\s+/).includes('user-manuals')) { m = o; break; }
}
if (!m) throw new Error('no .user-manuals container');
let depth = 1, end = -1;
const tag = /<\/?div\b[^>]*>/gi;
tag.lastIndex = m.index + m[0].length;
let t;
while ((t = tag.exec(src))) {
  depth += t[0][1] === '/' ? -1 : 1;
  if (depth === 0) { end = t.index; break; }
}
const doc = src.slice(m.index + m[0].length, end);

const h1 = (doc.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, 'User Guide'])[1].replace(/<[^>]+>/g, '').trim();

/* The FAQ and the inquiry block sit OUTSIDE .user-manuals, in .user-manuals-content
   further down the page. The first pass took only the first container and dropped both
   without noticing — a whole accordion gone. Scope to a container, then check what else
   the page holds. */
const wrap = (() => {
  let w = null;
  const re = /<div\s+class="([^"]*)"[^>]*>/gi;
  let x;
  while ((x = re.exec(src))) {
    if (x[1].split(/\s+/).includes('user-manuals-content')) { w = x; break; }
  }
  if (!w) throw new Error('no .user-manuals-content container');
  let d = 1, e = -1;
  const tg = /<\/?div\b[^>]*>/gi;
  tg.lastIndex = w.index + w[0].length;
  let y;
  while ((y = tg.exec(src))) { d += y[0][1] === '/' ? -1 : 1; if (d === 0) { e = y.index; break; } }
  return src.slice(w.index + w[0].length, e);
})();

const faqTitle = (wrap.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
const faqLead  = (wrap.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i) || [, ''])[1].replace(/<[^>]+>/g, '').trim();
const faqs = [...wrap.matchAll(/<div class="collapsible-header">([\s\S]*?)<\/div>\s*<div class="collapsible-body">([\s\S]*?)<\/div>/gi)]
  .map(f => ({
    q: f[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    a: f[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  }))
  .filter(f => f.q && f.a);
if (!faqs.length) throw new Error('no FAQ items found');

const groups = [...doc.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi)].map(g => ({
  name: g[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
  links: [...g[2].matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map(a => ({
    href: a[1],
    text: a[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  })),
}));
if (!groups.length) throw new Error('no categories found');
const total = groups.reduce((n, g) => n + g.links.length, 0);
if (total !== 20) throw new Error('expected 20 guides, found ' + total);

/* ── the head, borrowed so the tailwind config stays one config ───────────── */
const donor = fs.readFileSync(path.join(SITE, 'help-center.html'), 'utf8');
const head = donor.slice(0, donor.indexOf('<body'));
const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const ARROW = '<svg class="shrink-0 mt-1 text-ink-300 group-hover:text-teal-600 transition-colors duration-300" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const OUT   = '<svg class="shrink-0 mt-1 text-ink-300" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

const link = l => {
  const href = LOCAL[l.href] || l.href;
  const external = /^https?:/.test(href);
  return `            <li>
              <a href="${href}"${external ? ' rel="noopener"' : ''} class="group flex items-start gap-3 rounded-xl -mx-2 px-2 py-2 hover:bg-ink-50 transition-colors duration-300">
                <span class="min-w-0 flex-1 text-[13.5px] sm:text-[14.5px] font-medium text-ink-700 group-hover:text-ink-900 leading-snug transition-colors duration-300">${l.text}</span>
                ${external ? OUT : ARROW}
              </a>
            </li>`;
};

/* The illustration convention this site already uses, taken from ai-detector: a tinted
   plate at content width, the icon modest inside it, heading below. The icons are keyed
   to transparency so the plate shows through their interiors rather than a white box. */
const card = g => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <div class="rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-ink-50 mb-4 lg:mb-5 py-5 sm:py-6 flex items-center justify-center">
            <img src="assets/img/ug/${ICONS[g.name] || 'cat-services'}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-[64px] h-[64px]">
          </div>
          <div class="flex items-baseline gap-3 mb-4 lg:mb-5">
            <h2 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight">${g.name}</h2>
            <span class="ml-auto text-[11.5px] font-semibold text-ink-400 tabular-nums">${g.links.length}</span>
          </div>
          <ul class="divide-y divide-ink-100">
${g.links.map(link).join('\n')}
          </ul>
        </div>`;

const html = head.replace(/<title>[\s\S]*?<\/title>/, '<title>User Guide | PlagiarismSearch</title>') + `
<style>
  /* the homepage accordion, in the two rules that make it work */
  .faq-a { display:grid; grid-template-rows:0fr; transition:grid-template-rows .32s cubic-bezier(.32,.72,0,1); }
  .faq-a > div { overflow:hidden; }
  .faq-item.open .faq-a { grid-template-rows:1fr; }
  .faq-chev { background:#F1F2F6; color:#6B7280; transition:transform .32s cubic-bezier(.32,.72,0,1), background-color .3s ease, color .3s ease; }
  .faq-item.open .faq-chev { background:#FDE5E0; color:#B84431; transform:rotate(180deg); }
</style>
${bodyTag}
<div class="grain"></div>

<header></header>

<main>
  <!-- The guide index. Category names and guide titles are the live page's own, unchanged;
       the arrangement is new. Four cards rather than four stacked lists, each showing how
       many guides it holds, and an outbound mark on the links that leave this prototype
       for the live site — which most of them do, because the guides live there. -->
  <section class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28 bg-[#F7F9FA]">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="orb w-[560px] h-[560px] bg-teal-500/10 -left-44 -top-40"></div>
    </div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">

      <div class="max-w-[720px] mb-8 sm:mb-10 lg:mb-12">
        <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-4 lg:mb-5">Resources</div>
        <h1 class="text-[clamp(2.1rem,4vw,3rem)] font-extrabold tracking-tightest leading-[1.06]">${h1}</h1>
      </div>

      <!-- No items-start: the cards stretch to the tallest in their row. The lists are
           six, five, four and five long, so left to themselves the pairs sat at
           different heights and the row edge stepped. -->
      <div class="grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
${groups.map(card).join('\n')}
      </div>

      <!-- The page's own FAQ, questions and answers unchanged, in the architecture the
           homepage established: a sticky left column that keeps the section's name in
           view, the accordion on the right. A long list under a centred heading leaves
           the last question a screen and a half from its own title.

           No .rv on any of it — that class ships hidden and is revealed by a script this
           generated page does not carry. It would hide the whole section. -->
      <div class="mt-12 sm:mt-16 lg:mt-20 grid lg:grid-cols-[380px_1fr] gap-10 sm:gap-12 lg:gap-14 items-start">

        <div class="lg:sticky lg:top-32">
          <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">Questions</span>
          </div>
          <h2 class="text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08] mb-4 lg:mb-5">${faqTitle}</h2>
          <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600">${faqLead}</p>
          <a href="help-center.html" class="inline-flex items-center gap-2 mt-5 lg:mt-6 text-[13px] sm:text-[13.5px] font-semibold text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            More questions? Visit the Help Center.
          </a>
        </div>

        <!-- every answer is in the rendered HTML, not fetched on click -->
        <div class="rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse" id="faqList">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${faqs.map((f, i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${f.q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${f.a}</p></div></div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>

      <div class="mt-10 sm:mt-12 lg:mt-14 pt-7 sm:pt-8 border-t border-ink-200/60 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p class="text-[13.5px] sm:text-[14.5px] text-ink-500">Looking for something else?</p>
        <a href="help-center.html" class="btn-press inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 hover:bg-ink-900/5 px-4 sm:px-5 py-2.5 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-900 transition-colors duration-300">
          Help Center
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
        <a href="contact-us.html" class="btn-press inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 hover:bg-ink-900/5 px-4 sm:px-5 py-2.5 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-900 transition-colors duration-300">
          Contact us
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>

    </div>
  </section>
</main>

<footer></footer>

<script>
(() => {
  /* answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }));
})();
<\/script>
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, 'user-manuals.html'), html);
console.log('  ok  site/user-manuals.html  ' + groups.length + ' categories, ' + total + ' guides');
groups.forEach(g => console.log('      ' + String(g.links.length).padStart(2) + '  ' + g.name));
