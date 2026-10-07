/* Generate site/faq-and-support.html — "Support & Frequently Asked Questions", the live
   /faq-and-support in the new system (Olex, 2026-10-07).

   There is no brief, so the words are the live page's, verbatim, read into
   build/faq-data.json by build/faq-fetch.js: the H1, the nine group names, the sixty-two
   questions with their answers, the form's heading, labels and button. Only the
   architecture is new.

   THE LIVE PAGE is nine blocks — a stock illustration (a stopwatch, a backpack, a medal)
   beside an accordion, the picture left and right in turn — and an inquiry form.

   THIS PAGE
   01      the hero: the H1 and the nine groups as a row of jump links with their counts
           (a wrapping row on a desktop, one scrolling row below 1024px — the shared chip
           row). "Resources" over the H1 is the header group's name, as on the User Guide.
   02–10   one section a group: the library's FAQ (build/sections/faq.js, layout "fixed"):
           the group's name and its figure in the sticky column, the accordion beside it.
           Grounds alternate, white and tint.
   11      "Didn't find the answer?" — the library's Inquiry form with the live fields.

   THE FIGURES (build/faq/figures.js) are what Olex asked for in place of the stock
   pictures: schematics of our own interface that show what the group is about — the
   report's metrics and highlights, the checker, the Moodle assignment and a private
   repository, the readability scale, the account's balance. IMAGES.md §3.5; every word
   on them is the product's or the group's own.

   NOT CARRIED FROM THE LIVE PAGE: its "Live Chat" button (the prototype has no chat to
   open; the library form has one action) — the e-mail address beside it is the line
   under the form's heading. One answer's table (words per submission) is set as lines of
   one paragraph: the FAQ component has no table.

   Run:  node build/faq.js  →  node build/shell.js  →  node build/check-faq.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const faq = require('./sections/faq');
const inquiry = require('./sections/inquiry-form');
const { FIGURES } = require('./faq/figures');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'faq-and-support.html';
const D = require('./faq-data.json');
if (D.groups.length !== FIGURES.length) throw new Error('faq: ' + D.groups.length + ' groups, ' + FIGURES.length + ' figures');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const ID = D.groups.map(g => slug(g.name));

/* an answer's paragraph: text escaped, the stored inline tags kept; a link takes the FAQ's
   link class, a destination this prototype holds is made local */
const LOCAL = { 'https://plagiarismsearch.com/ai-content-detector': 'ai-detector.html' };
const para = p => p.split(/(<\/?(?:strong|em)>|<br>|<a href="[^"]*">|<\/a>)/).map(part => {
  const a = part.match(/^<a href="([^"]*)">$/);
  if (a) { const href = LOCAL[a[1]] || a[1]; return `<a href="${href}"${/^https?:/.test(href) ? ' rel="noopener"' : ''} class="faq-link">`; }
  return /^<\/?(strong|em|a)>$|^<br>$/.test(part) ? part : esc(part);
}).join('');

/* ═══════════════ 01 · HERO ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / SUPPORT & FREQUENTLY ASKED QUESTIONS =================
       The live H1, and the nine groups as jump links with the number of questions in
       each: the page is sixty-two questions long, so its first screen is its contents.
       The row wraps on a desktop and is one scrolling row below 1024px (the shared chip
       row, 32-scroll-fade.css). -->
  <section id="faq-and-support" data-component="faq-hero" class="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[860px] mx-auto">
        <div class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-4 lg:mb-5">Resources</div>
        <h1 class="text-[clamp(2.2rem,4.6vw,3.6rem)] font-extrabold tracking-tightest leading-[1.05]">${esc(D.h1)}</h1>
      </div>

      <nav class="rv chip-scroll -mx-4 sm:-mx-6 lg:mx-auto px-4 sm:px-6 lg:px-0 py-1 mt-7 sm:mt-8 lg:mt-10 max-w-none lg:max-w-[980px]" data-scroll-fade="x" aria-label="${esc(D.h1)}">
        <ul class="flex flex-nowrap lg:flex-wrap lg:justify-center gap-2 w-max lg:w-auto" role="list">
${D.groups.map((g, i) => `          <li><a href="#${ID[i]}" class="btn-press inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white ring-1 ring-black/5 text-ink-700 hover:bg-ink-50 hover:text-ink-900 px-3.5 py-2 text-[12.5px] sm:text-[13px] font-semibold transition-colors duration-300">${esc(g.name)} <span class="text-[10.5px] font-bold nums text-ink-400">${g.items.length}</span></a></li>`).join('\n')}
        </ul>
      </nav>
    </div>
  </section>`;

/* ═══════════════ 02–10 · THE NINE GROUPS ═══════════════ */
const group = (g, i) => `  <!-- ================= ${String(i + 2).padStart(2, '0')} · ${g.name.toUpperCase()} =================
       The library's FAQ, layout "fixed": the group's name and its figure (a schematic of
       what the questions are about — build/faq/figures.js) in the sticky column, the
       ${g.items.length} questions beside it. -->
${faq.section({
    id: ID[i], ns: 'faq-g' + (i + 1), bg: i % 2 ? 'tint' : 'white', space: 'md', layout: 'fixed', heading: 'h3', rich: true,
    head: { title: esc(g.name) },
    aside: FIGURES[i](),
    items: g.items.map(it => ({ q: esc(it.q), paras: it.paras.map(para) })),
  })}`;

/* ═══════════════ 11 · DIDN'T FIND THE ANSWER? ═══════════════ */
const F = D.form;
const mail = F.actions.find(a => /^mailto:/.test(a.href));
const TYPE = { email: 'email', phone: 'tel', text: 'textarea' };
const section11 = () => `  <!-- ================= 11 · DIDN'T FIND THE ANSWER? =================
       The live inquiry form in the library's Inquiry form: the same six fields, the same
       four required, the same button. Inert, as every form of the prototype. -->
${inquiry.section({
    id: 'send-free-inquiry', bg: D.groups.length % 2 ? 'cool' : 'white', ns: 'fq',
    head: { title: esc(F.heading) },
    alt: { text: '', label: mail.label, href: mail.href },   /* the live page prints the address alone, with no words before it */
    fields: F.fields.map(f => ({ label: esc(f.label), type: TYPE[f.name] || 'text', required: f.required, wide: f.name === 'title' || f.name === 'text', rows: 5 })),
    submit: esc(F.actions[0].label),
    success: { id: 'fq-sent', title: esc(F.sent), tag: 'p' },
  })}`;

module.exports = { D, ID, OUT, LOCAL };
if (require.main !== module) return;

const sections = [section1(), ...D.groups.map(group), section11()];
const html = page.render({ title: esc(D.title), meta: D.meta, canonical: D.source, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/class="faq-item/g) + ' questions, ' + count(/class="fg"/g) + ' figures, ' + count(/class="cf-field"/g) + ' form fields');
