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

/* One icon per category, Lucide, matching what the group is about. */
const ICONS = {
  'Plagiarism Check': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'Moodle Integration': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  'Services Overview': '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/>',
  'Account Features and Management': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
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
                <span class="min-w-0 flex-1 text-[14px] sm:text-[14.5px] font-medium text-ink-700 group-hover:text-ink-900 leading-snug transition-colors duration-300">${l.text}</span>
                ${external ? OUT : ARROW}
              </a>
            </li>`;
};

const card = g => `        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
          <div class="flex items-center gap-3 mb-4 lg:mb-5">
            <span class="w-10 h-10 shrink-0 rounded-xl bg-teal-50 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[g.name] || ICONS['Services Overview']}</svg>
            </span>
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

      <div class="grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-start">
${groups.map(card).join('\n')}
      </div>

      <!-- The page's own FAQ, questions and answers unchanged. Same accordion as the
           homepage: every answer is in the rendered HTML, opened and closed rather than
           fetched, and the first one starts open so the control explains itself. -->
      <div class="mt-12 sm:mt-16 lg:mt-20">
        <div class="max-w-[720px] mb-6 sm:mb-8">
          <h2 class="text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold tracking-tightest leading-[1.15] mb-3">${faqTitle}</h2>
          <p class="text-[14.5px] sm:text-[15px] lg:text-[15.5px] text-ink-600 leading-relaxed">${faqLead}</p>
        </div>

        <div class="rounded-3xl sm:rounded-[28px] bg-white ring-1 ring-black/5 shadow-diffuse p-1.5 sm:p-2" id="faqList">
          <div class="rounded-[18px] sm:rounded-[20px] bg-white divide-y divide-ink-100 overflow-hidden">
${faqs.map((f, i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5">
                <span class="text-[14.5px] sm:text-[15.5px] font-bold tracking-tight">${f.q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[76ch]">${f.a}</p></div></div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>

      <div class="mt-10 sm:mt-12 lg:mt-14 pt-7 sm:pt-8 border-t border-ink-200/60 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p class="text-[13.5px] sm:text-[14px] text-ink-500">Looking for something else?</p>
        <a href="help-center.html" class="btn-press inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 hover:bg-ink-900/5 px-4 sm:px-5 py-2.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-900 transition-colors duration-300">
          Help Center
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
        <a href="contact-us.html" class="btn-press inline-flex items-center gap-2 rounded-full ring-1 ring-black/10 hover:bg-ink-900/5 px-4 sm:px-5 py-2.5 text-[13.5px] sm:text-[14px] font-semibold text-ink-900 transition-colors duration-300">
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
