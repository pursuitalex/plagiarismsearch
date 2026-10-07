/* Generate site/spell-check.html — the Grammar, Style, and Spell Checker, illustrated.

   The one version of the page (Olex, 2026-10-07: "Залишаємо варіант 2 для Spell Check,
   перший видаляємо"). It was "v2" while it stood beside the hand-written first page; that
   one is gone, and this one took the page's own name, so the links to it never changed.
   This file and its check keep their names.

   Every word is the live page's (plagiarismsearch.com/spell-checker, read 2026-09-30),
   from build/spell-data.json, made from the page's text by line number; the result
   panel's group and row labels are the live widget's own. The feedback is the Reviews
   data in Trustpilot's manner (testimonials-v2.js), as on Readability v2.

   The hero is the form the site's other checkers have (Olex, 2026-10-07: "має бути форма
   аналогічна, як і на всіх плагчеках чи AI-чеках… кнопочки… в одному стилі… не потрібно
   відразу виводити всі параметри… лише після того, як людина натисне перевірка"): the
   text with its count, the drop zone and "UPLOAD FILE", the checker's own four ways in
   (build/checker.js — Attach file, Dropbox, OneDrive, By URL, with their marks), and one
   row with the 47 languages, "Order analysis" and "Free check". The live result panel —
   Mistakes, Statistics, Readability, Language — is a state of the same card, shown when
   "Free check" is pressed. Statistics and Readability are computed in the browser by
   the first page's module (site.js, module spell), which reads a dropped file too; the mistake
   counts need the service, so they stay a dash here.

   The manner is the illustrated one (IMAGES.md §8, the wardrobe law): three photographs,
   a spot-icon set, chips carrying only the page's own words.

   Links: "/rate-my-paper" is this prototype's paper-analysis.html; the manual, which the
   prototype has no page for, links to the live site.

   Run:  node build/spell-v2.js  →  node build/shell.js  →  node build/check-spell-v2.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const TV2 = require('./testimonials-v2');
const checker = require('./checker');
const C = require('./spell-data.json');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'spell-check.html';
const IMG = '/assets/img/spell/';
const TOP = '#spell-checker-top';
const PAPER = 'paper-analysis.html';                              /* the live /rate-my-paper */
const href = h => (h === '/rate-my-paper' || /\/rate-my-paper$/.test(h) ? PAPER : /^\//.test(h) ? 'https://plagiarismsearch.com' + h : h);

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's, as in readability-v2.js.
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const BODY = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const SMALL = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');
const btnDark = (label, h) => `<a href="${h}"${ext(h)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${esc(label)}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const inline = (label, h, dark) => `<a href="${h}"${ext(h)} class="font-semibold ${dark ? 'text-white decoration-white/40 hover:decoration-white' : 'text-ink-800 decoration-ink-300 hover:text-ink-900'} underline underline-offset-4 transition-colors duration-300">${esc(label)}</a>`;
/* a sentence with its one live link set on the linked phrase */
const linked = (text, [label, h], dark) => {
  if (!text.includes(label)) throw new Error('link phrase not found: ' + label);
  return esc(text).replace(esc(label), inline(label, href(h), dark));
};
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};
const ico = (paths, stroke, size = 18, sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  box:    '<path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.66 1.66 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.64 1.64 0 0 0 1.63 0z"/>',
  cloud:  '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  clip:   '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  link:   '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  globe:  '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  check:  '<path d="M20 6 9 17l-5-5"/>',
  spell:  '<path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="m16 20 2 2 4-4"/>',
  clock:  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
};

/* a one-line chip over a photograph: under the photo on a phone */
const chip = (pos, tone, icon, label) => `        <span class="${pos} flex items-center gap-2.5 rounded-full bg-white shadow-diffuse-lg pl-2 pr-4 lg:pr-5 py-2">
          <span class="w-9 h-9 rounded-full ${tone} flex items-center justify-center shrink-0">${ico(I[icon], '#fff', 17, 2.2)}</span>
          <span class="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-ink-800">${esc(label)}</span>
        </span>`;

/* ═══════════════ 01 · HERO — THE TOOL ═══════════════ */
const H = C.hero;
const tileParts = t => { const m = t.match(/^(.*?)\s([\d.]+\/5|\d+ \| [\dK+]+)$/); return m ? [m[1], m[2]] : [t, '']; };
/* the result panel: each live label bound to the module's output where there is one */
const HOOK = {
  Grammar: 'grammar', Punctuation: 'punct', Spelling: 'spell', Style: 'style',
  Paragraphs: 'para', Sentences: 'sent', Syllables: 'syl', Words: 'words', Characters: 'chars', Spaces: 'spaces',
  'Read time': 'read', 'Speak time': 'speak', 'Automated readability index': 'ari', 'Coleman–Liau index': 'cli',
  'Flesch reading ease': 'fre', 'Flesch–Kincaid grade level': 'fkg', 'SMOG grade': 'smog', 'Gunning fog index': 'fog',
};
const ZERO = new Set(['para', 'sent', 'syl', 'words', 'chars', 'spaces']);
const TONE = { Mistakes: 'bg-orange-500', Statistics: 'bg-teal-500', Readability: 'bg-mint-500', Language: 'bg-ink-700' };
const panel = () => C.panel.map(([group, rows]) => `                <div class="rounded-xl sm:rounded-[14px] bg-ink-50 p-4">
                  <p class="flex items-center gap-2 mb-2.5"><span class="w-2 h-2 rounded-full ${TONE[group]}" aria-hidden="true"></span><span class="${CAP} text-ink-600">${esc(group)}</span></p>
${rows.length ? `                  <dl class="grid gap-1.5">
${rows.map(r => `                    <div class="sp-row"><dt>${esc(r)}</dt><dd><b data-sp="${HOOK[r]}" class="nums">${ZERO.has(HOOK[r]) ? '0' : '&mdash;'}</b></dd></div>`).join('\n')}
                  </dl>` : `                  <p class="text-[13px] font-semibold text-ink-800" data-sp-lang-echo>${esc(H.languages[0])}</p>`}
                </div>`);
/* two columns that each stack their own groups, so a short group leaves no hole beside a
   long one: Mistakes over Statistics, Readability over Language */
const panelColumns = () => { const g = panel(), half = Math.ceil(g.length / 2); return [g.slice(0, half), g.slice(half)].map(col => `              <div class="grid gap-3">
${col.join('\n')}
              </div>`).join('\n'); };

/* the ways in are the site's checker's own (build/checker.js): the same four, in the same
   order, with the same marks — "Attach file" opens the file input here */
const source = i => {
  const glyph = i.icon === 'brand'
    ? `<img src="/assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="${checker.ICON} shrink-0">`
    : `<svg class="${checker.ICON} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`;
  return i.label === 'Attach file'
    ? `<label for="sp-file" class="qc-chip cursor-pointer">${glyph}${i.label}</label>`
    : `<button type="button" class="qc-chip">${glyph}${i.label}</button>`;
};

const section1 = () => `  <!-- ================= 01 · HERO / THE SPELL CHECKER =================
       The form the site's other checkers have (the homepage, the AI Detector): the text,
       the drop zone, the four ways in, and one row with the button. What a check returns
       — Mistakes, Statistics, Readability, Language — is a state of the same card, shown
       when "Free check" is pressed. The two service notes and the rating tiles sit under it. -->
  <section id="spell-checker-top" data-component="hero-tool" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <h1 class="rv text-center text-[clamp(2.3rem,5vw,3.8rem)] font-extrabold tracking-tightest leading-[1.04] mb-8 sm:mb-10 lg:mb-12 max-w-[18ch] mx-auto">${penMark(esc(H.h1), 'Spell Checker')}</h1>

      <div class="rv max-w-[860px] mx-auto rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
        <form data-spell data-unit="min" onsubmit="return false" class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6">
          <label for="sp-text" class="sr-only">${esc(H.placeholder.replace(/\.+$/, ''))}</label>
          <!-- the count belongs to the text, so it sits in the corner of the field -->
          <div class="relative mb-4">
            <textarea id="sp-text" data-sp="text" rows="4" class="qc-area block pr-24" placeholder="${esc(H.placeholder)}"></textarea>
            <span data-sp="count" data-one=" word" data-many=" words" class="pointer-events-none absolute bottom-0 right-0 text-[12px] font-medium text-ink-400 nums">0 words</span>
          </div>

          <!-- below 768 there is no pointer to drag with, so the drop zone goes, as it does
               on the homepage's checker; "Attach file" opens the same file input -->
          <label for="sp-file" data-sp-drop class="sp-drop qc-drop hidden md:flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-3.5 mb-3 cursor-pointer">
            <span class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-black/5">${ico(I.upload, '#0991A8', 18, 1.75)}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-[13.5px] font-bold tracking-tight">${esc(H.drop[0])}</span>
              <span class="block text-[12px] text-ink-500">${esc(H.drop[1])}</span>
            </span>
            <span class="qc-chip shrink-0">${esc(H.upload)}</span>
          </label>
          <input id="sp-file" type="file" data-sp="file" class="sr-only" accept=".txt,.md,text/plain">

          <div class="flex flex-wrap gap-2 mb-4 lg:mb-5">
            ${checker.INPUTS.map(source).join('\n            ')}
          </div>

          <!-- the one choice this check has, beside the button it modifies -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 pt-4 border-t border-ink-100">
            <label class="flex items-center gap-2 text-ink-500 min-w-0">${ico(I.globe, 'currentColor', 15, 1.75)}
              <select data-sp="lang" class="sp-select min-w-0" aria-label="${esc(H.languages[0])}">
${H.languages.map((l, i) => `                <option${i ? '' : ' selected'}>${esc(l)}</option>`).join('\n')}
              </select>
            </label>
            <span class="flex items-center justify-between sm:justify-end gap-4 sm:gap-5">
              <a href="${PAPER}" class="text-[13px] sm:text-[13.5px] font-semibold text-ink-500 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${esc(H.order)}</a>
              <button type="submit" class="btn-press group shrink-0 flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
                ${esc(H.free)}
                <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
              </button>
            </span>
          </div>

          <!-- THE RESULT. Not a panel that waits beside the form: a state of this card,
               shown when "Free check" is pressed with a text in the field (site.js, module
               spell). The labels are the live widget's own. -->
          <div data-sp-results hidden tabindex="-1" class="mt-4 pt-5 border-t border-ink-100 outline-none">
            <div class="grid sm:grid-cols-2 gap-3 items-start">
${panelColumns()}
            </div>
          </div>
        </form>
      </div>

      <div class="rv mt-5 sm:mt-6 grid gap-1.5 text-center">
${H.notes.map(([t, l]) => `        <p class="${SMALL} text-ink-600">${linked(t, l)}</p>`).join('\n')}
      </div>
      <ul class="rv mt-5 sm:mt-6 flex flex-wrap justify-center gap-2.5" role="list">
${H.tiles.map(([label, h]) => { const [name, fig] = tileParts(label); return `        <li><a href="${h}" rel="nofollow noopener" class="inline-flex items-baseline gap-2 rounded-2xl bg-white/80 hover:bg-white ring-1 ring-black/5 px-4 py-2.5 transition-colors duration-300"><span class="text-[12.5px] font-semibold text-ink-500">${esc(name)}</span> <span class="text-[15px] font-extrabold tracking-tight text-ink-900 nums">${esc(fig)}</span></a></li>`; }).join('\n')}
      </ul>
    </div>
  </section>`;

/* ═══════════════ 02 · FREE ESSAY GRADER ═══════════════ */
const G = C.grader;
const section2 = () => `  <!-- ================= 02 · FREE ESSAY GRADER =================
       The claim beside a student proofreading; the chips are two of the panel's own
       mistake types. -->
  <section id="free-essay-grader" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0">
          <h2 class="${H2}">${esc(G.h2)}</h2>
          <p class="mt-5 lg:mt-6 ${BODY} max-w-[64ch]">${esc(G.body)}</p>
        </div>
        <div class="rv relative min-w-0">
          <img src="${IMG}proofreading.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
          <div class="mt-3 flex flex-col gap-2.5 sm:mt-0">
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:top-8', 'bg-teal-500', 'check', C.panel[0][1][0])}
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:bottom-10', 'bg-orange-500', 'spell', C.panel[0][1][2])}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · THE ADVANTAGES ═══════════════ */
const A = C.advantages;
const TAB_ICON = ['icon-mistakes', 'icon-statistics', 'icon-readability', 'icon-language'];
/* what each tab holds, in the panel's own labels; for Language, the first live languages */
const tabRows = i => (i < 3 ? C.panel[i][1] : H.languages.slice(1).filter(l => !/\(/.test(l)).slice(0, 8));
const section3 = () => `  <!-- ================= 03 · THE ADVANTAGES OF OUR FREE ESSAY GRADER =================
       The text, then the four parts of the grader's report (the live page's four tabs) as
       illustration cards, each listing what it holds in the panel's own words. -->
  <section id="advantages" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-14 mb-10 sm:mb-12">
        <h2 class="${H2}">${esc(A.h)}</h2>
        <div class="grid gap-4">
${A.body.map(p => `          <p class="${BODY}">${esc(p)}</p>`).join('\n')}
        </div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
${A.tabs.map((t, i) => `        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/[.05] p-4 sm:p-5 lg:p-6">
          <div class="rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-[#F7FAFC] mb-4 lg:mb-5 py-4 sm:py-5 lg:py-6 flex items-center justify-center">
            <img src="${IMG}${TAB_ICON[i]}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-[64px] h-[64px]">
          </div>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-3">${esc(t)}</h3>
          <ul class="flex flex-wrap gap-1.5" role="list">
${tabRows(i).map(r => `            <li class="rounded-full bg-[#F7FAFC] ring-1 ring-black/5 px-2.5 py-1 text-[11.5px] font-semibold text-ink-600">${esc(r)}</li>`).join('\n')}
          </ul>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · YOUR PERFECT OPPORTUNITY — THE DARK ACT ═══════════════ */
const O = C.opportunity;
const OPP_ICON = ['icon-professors', 'icon-skills', 'icon-errors', 'icon-performance', 'icon-potential'];
const section4 = () => `  <!-- ================= 04 · OUR ONLINE GRADER IS YOUR PERFECT OPPORTUNITY TO =================
       The five opportunities on the dark act, each with its spot icon on a white plate,
       beside a lecturer grading; the paragraph after them closes the act, its "24 hours"
       the photograph's chip. -->
  <section id="perfect-opportunity" data-component="dark-act" data-surface="dark" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute w-[680px] h-[680px] -left-56 -top-56 bg-[rgba(44,195,219,.14)]"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-16 items-center">
        <div class="rv relative min-w-0 order-2 lg:order-1">
          <img src="${IMG}lecturer.webp" alt="" width="1000" height="1241" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl">
          <div class="mt-3 sm:mt-0">
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:top-10', 'bg-teal-500', 'clock', '24 hours')}
          </div>
        </div>
        <div class="rv min-w-0 order-1 lg:order-2">
          <h2 class="${H2} mb-8 lg:mb-10">${esc(O.h)}</h2>
          <ol class="grid gap-3" role="list">
${O.items.map((t, i) => `            <li class="flex items-center gap-4 rounded-2xl bg-white/[.06] ring-1 ring-white/10 p-3 pr-5"><span class="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center"><img src="${IMG}${OPP_ICON[i]}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-8 h-8"></span><span class="text-[15px] sm:text-[16px] font-semibold tracking-tight">${esc(t)}</span></li>`).join('\n')}
          </ol>
          <p class="mt-7 lg:mt-8 ${SMALL} lg:text-[15px] text-white/70 max-w-[66ch]">${esc(O.after)}</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · HOW TO IMPROVE WRITING SKILLS ═══════════════ */
const M = C.improve;
const section5 = () => `  <!-- ================= 05 · HOW TO IMPROVE WRITING SKILLS =================
       The advice beside two students with a good result; "rate my paper" keeps its live
       link, to this prototype's Rate my paper page, and the live "Order analysis" joins it. -->
  <section id="improve-writing-skills" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0">
          <h2 class="${H2}">${esc(M.h2)}</h2>
          <p class="mt-5 lg:mt-6 ${BODY} max-w-[64ch]">${linked(M.body, M.link)}</p>
          <div class="mt-7 lg:mt-8">${btnDark(H.order, PAPER)}</div>
        </div>
        <div class="rv min-w-0">
          <img src="${IMG}results.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · FEEDBACK ═══════════════ */
const P = TV2.D.trustpilot;
const section6 = () => `  <!-- ================= 06 · FEEDBACK OF OUR CUSTOMERS =================
       The Trustpilot feedback the live page loads — the Reviews data, word for word, in
       Trustpilot's manner. -->
  <section id="feedback" data-component="review-masonry" class="relative pb-16 sm:pb-24 lg:pb-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-end justify-between gap-4 mb-8">
        <h2 class="${H2} text-[#191919]">${esc(C.feedback.h)}</h2>
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#191919]/70"><b class="text-[#191919]">${esc(P.textRating)}</b> ${TV2.tpStars(P.stars)} <b class="text-[#191919] nums">${P.rating}/${P.max}</b> <span aria-hidden="true">|</span> <span>Based on <a href="${P.url}" rel="nofollow noopener" class="font-semibold text-[#191919] underline decoration-[#191919]/30 underline-offset-4">${P.count} reviews</a></span></p>
      </div>
      <div class="masonry columns-1 sm:columns-2 lg:columns-3 gap-4">
${P.reviews.slice(0, 6).map(TV2.tpCardOn('ring-ink-200')).join('\n')}
      </div>
      <div class="rv mt-6 flex justify-center">${btnDark(H.free, TOP)}</div>
    </div>
  </section>`;

module.exports = { C };
if (require.main !== module) return;

const sections = [section1, section2, section3, section4, section5, section6].map(f => f());
const html = page.render({ title: esc(C.title), meta: C.meta, canonical: C.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/<img\b/g) + ' images, ' + count(/<option\b/g) + ' languages');
