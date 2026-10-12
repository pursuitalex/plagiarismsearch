/* Generate site/404.html — the page for an address that leads nowhere.

   No brief: Olex asked for it on 2026-10-12 — an interesting page, original copy, and a
   hint that the visitor is lost or that something is missing. Until now a wrong address
   got the host's bare "NOT_FOUND" line, with no way back.

   THE IDEA is the product's own vocabulary turned on the page itself: a checker looks
   for a match, and for this address there is none. So the "0" of the 404 is a lens that
   has found nothing; a dashed trail wanders in across the stage, loops — the way a lost
   person walks — and stops at an empty outline where the page should be; and the
   heading says the page wandered off. Then the useful part: one button home, the Help
   Center, and five places people usually mean to go.

   The copy is ours (there is no approved text for this page) and says only what is true
   of every wrong address: the page may have moved, been renamed or never existed, and
   nothing happened to the visitor's documents, reports or account. No product claim, no
   figure, no form.

   ONE THING IS UNLIKE EVERY OTHER PAGE. The host serves this file AT the wrong address,
   which can be any depth (/a/b/c), so a relative link or image would resolve against
   that path and break. The head therefore carries <base href="/">: every relative
   address on the page — the header's, the footer's, this section's — resolves from the
   site's root. (The page has no in-page "#" links, which a base would send to the root.)

   Vercel serves a 404.html at the root for every missing address by itself; so does the
   local `serve`. The page is not linked from anywhere and is not in the navigation.

   Run:  node build/not-found.js  →  node build/shell.js  →  node build/check-not-found.js
*/
const fs = require('fs');
const path = require('path');
const page = require('./page');
const action = require('./sections/action');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = '404.html';

const COPY = {
  title: 'Page not found | PlagiarismSearch',
  eyebrow: 'Error 404',
  h1: 'This page wandered off',
  lead: 'We checked every source we have and found no match for this address. The page may have moved, been renamed, or never existed — your documents, reports and account are right where you left them.',
  primary: ['Back to the homepage', 'index.html'],
  secondary: ['Visit the Help Center', 'help-center.html'],
  ways: {
    label: 'Or find your way back',
    links: [['Plagiarism Checker', 'index.html'], ['AI Detector', 'ai-detector.html'], ['Pricing', 'prices.html'], ['Blog', 'blog.html'], ['Contact us', 'contact-us.html']],
  },
  /* what the drawing shows, for a screen reader */
  drawing: 'The number 404, its zero drawn as a magnifying glass that has found nothing. A dashed trail wanders in, loops and stops at an empty outline where the page should be.',
};

/* ── the drawing (38-not-found.css) ───────────────────────────────────────────
   The numerals are type, sized in one clamp; the lens and its handle are sized in em, so
   they keep their proportion to the digits at every width. The trail is one path in a
   stretched viewBox behind them; the missing page is an outline at its end. */
const drawing = () => `<div class="nf relative mx-auto w-full max-w-[1040px] mt-7 sm:mt-9 lg:mt-10" role="img" aria-label="${COPY.drawing}">
  <svg class="nf-trail" viewBox="0 0 1040 320" preserveAspectRatio="none" aria-hidden="true"><path d="M4 262C92 262 118 176 168 142C232 99 282 168 228 214C172 262 104 182 192 104C266 38 372 84 452 60C566 26 668 30 742 96C796 144 778 232 848 242C900 250 934 196 946 132"/></svg>
  <span class="nf-start absolute left-0 top-[81.9%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-teal-500 ring-4 ring-teal-500/20" aria-hidden="true"></span>
  <span class="nf-sheet absolute right-[1%] sm:right-[5.5%] top-[-16%] sm:top-[2%] w-[44px] h-[58px] sm:w-[64px] sm:h-[84px] lg:w-[76px] lg:h-[98px] rounded-lg sm:rounded-xl border-2 border-dashed border-orange-400 bg-white/70 flex items-center justify-center text-[18px] sm:text-[24px] lg:text-[28px] font-extrabold text-orange-500" aria-hidden="true">?</span>
  <p class="nf-num relative flex items-center justify-center text-[clamp(6.5rem,24vw,16rem)] font-extrabold tracking-tightest leading-[1.08] text-ink-900 select-none" aria-hidden="true">
    <span>4</span>
    <span class="nf-lens relative inline-block w-[0.7em] h-[0.7em] mx-[0.07em] rounded-full border-[0.105em] border-ink-900 bg-white/75">
      <span class="absolute left-[14%] top-[14%] w-[30%] h-[30%] rounded-tl-full border-t-[0.035em] border-l-[0.035em] border-teal-400"></span>
      <span class="absolute left-[84%] top-[84%] w-[0.105em] h-[0.34em] origin-top -rotate-45 rounded-full bg-ink-900"></span>
    </span>
    <span>4</span>
  </p>
</div>`;

const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');

const section = () => `  <!-- ================= 404 · THE PAGE THAT IS NOT THERE =================
       One section. The drawing first — the 404 with a lens for its zero, the wandering
       trail, the empty outline — then the heading, what happened, and the ways back. -->
  <section id="not-found" data-component="not-found" class="relative pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-28 lg:pb-32 bg-[#F2FCFC] overflow-hidden">
    <div class="dot-field absolute inset-0" aria-hidden="true"></div>
    <div class="orb orb-hero-teal"></div>
    <div class="orb orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <div class="rv section-eyebrow">
        <span class="section-eyebrow-dot"></span>
        <span class="section-eyebrow-label">${COPY.eyebrow}</span>
      </div>

${indent(drawing(), '      ')}

      <h1 class="rv mt-6 sm:mt-8 text-[clamp(2rem,4.2vw,3.4rem)] font-extrabold tracking-tightest leading-[1.06]">${COPY.h1}</h1>
      <p class="rv mt-4 lg:mt-5 mx-auto max-w-[62ch] text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed text-ink-600">${COPY.lead}</p>

      <div class="rv mt-7 lg:mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
${indent(action.button({ label: COPY.primary[0], href: COPY.primary[1] }), '        ')}
${indent(action.link({ label: COPY.secondary[0], href: COPY.secondary[1] }), '        ')}
      </div>

      <nav class="rv mt-10 sm:mt-12 lg:mt-14" aria-label="${COPY.ways.label}">
        <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-4">${COPY.ways.label}</p>
        <ul class="flex flex-wrap justify-center gap-2 sm:gap-2.5">
${COPY.ways.links.map(([label, href]) => `          <li><a href="${href}" class="inline-flex items-center rounded-full bg-white ring-1 ring-black/5 hover:ring-black/15 shadow-diffuse px-4 py-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-800 hover:text-ink-950 transition-shadow duration-300">${label}</a></li>`).join('\n')}
        </ul>
      </nav>
    </div>
  </section>`;

module.exports = { COPY, OUT };
if (require.main !== module) return;

/* the shared shell, plus the one thing this page needs of its own: a base for its
   relative addresses (see the head of this file) */
let html = page.render({ title: COPY.title, sections: [section()] });
if (html.split('<head>').length !== 2) throw new Error('not-found: the page head changed — cannot place <base>');
html = html.replace('<head>', '<head>\n<base href="/" />');
fs.writeFileSync(path.join(SITE, OUT), html);
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
