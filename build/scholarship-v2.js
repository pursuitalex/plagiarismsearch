/* Generate site/scholarship.html — the 2026 Scholarship, illustrated.

   The one version of the page: the developer's review of 2026-10-07 selected it ("Version
   2 as the final version"). It was "v2" beside the first Scholarship page; that page is
   gone and this one took its name, so the links to it never changed. build/scholarship.js
   is kept for the parts this file takes from it, and writes nothing. This file and its
   check keep their names.

   Same words as v1 — the live page's, verbatim, from scholarship.js COPY — in the same
   order. The manner is the illustrated one of Affiliate v2 (IMAGES.md §8): photographs in
   the bithide "Revenue Infrastructure" manner with HTML chips, duotone spot icons on white
   plates. Nano Banana 2 at 2K; the laptop's maker's mark was patched out of the hero shot
   (IMAGES.md §5, no brands in the frame).

   What changes against v1:
   - The hero is a photograph with one chip, the prize ("Win $1,000"). The four other
     contest facts leave the hero card and become the illustration cards right under it.
   - "So, what should you do to try your luck?" gets a photograph, on the opposite side
     from the hero's (DESIGN.md, checkerboard imagery), with a chip carrying two of the
     terms' own titles.
   - The fifteen terms are sorted into three shapes (rules as tiles, the sequence from
     deadline to payout as a timeline beside a photograph, the fine print as a row) —
     every title and text unchanged, no heading invented (Olex, 2026-09-30).
   The prompts, the FAQ and the form are v1's sections, unchanged but for their grounds.

   Run:  node build/scholarship-v2.js  →  node build/shell.js  →  node build/check-scholarship.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const v1 = require('./scholarship');
const { COPY } = v1;

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'scholarship.html';
const IMG = '/assets/img/scholarship/';
const FORM = '#app-form-1';

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's, as in scholarship.js and affiliate-v2.js.
   ───────────────────────────────────────────────────────────────────────────── */
const amp = s => s.replace(/&(?!amp;|[a-z]+;)/g, '&amp;');
const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');
const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};
const ico = (paths, stroke, size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  cap:    '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
};

/* a chip over a photograph (affiliate-v2.js): under the photo on a phone, floating from sm */
const chip = (pos, tone, icon, big, small) => `        <span class="${pos} flex items-center gap-3 rounded-2xl bg-white shadow-diffuse-lg pl-2.5 pr-4 lg:pr-5 py-2.5">
          <span class="w-10 h-10 rounded-full ${tone} flex items-center justify-center shrink-0">${ico(I[icon], '#fff')}</span>
          <span class="flex flex-col">
            <span class="text-[15px] sm:text-[16px] font-extrabold tracking-tight leading-tight nums">${big}</span>
            <span class="text-[12px] sm:text-[12.5px] text-ink-500 leading-snug">${small}</span>
          </span>
        </span>`;

/* ═══════════════ 01 · HERO — THE PRIZE ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / SCHOLARSHIP =================
       A student writing, and the prize as the one chip over the window. The title keeps
       v1's scale step and soft break (the 21-character "PlagiarismSearch.com!"). -->
  <section id="scholarship" data-component="hero-photo" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">
        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.hero.eyebrow)}
          <h1 class="text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Win $1,000').replace('PlagiarismSearch.com!', 'PlagiarismSearch<wbr>.com!')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[58ch] mb-7 lg:mb-8">${COPY.hero.lead}</p>
          <div class="mb-8 lg:mb-10">${btnDark(COPY.hero.cta, FORM)}</div>

          <p class="${CAP} text-ink-500 mb-3">${COPY.hero.winnersLabel}</p>
          <ul class="flex flex-wrap gap-2" role="list">
${COPY.hero.winners.map(([name, href]) => `            <li><a href="${href}" rel="noopener" class="inline-flex items-center gap-2 rounded-full bg-white/80 hover:bg-white ring-1 ring-black/5 px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-semibold text-ink-800 transition-colors duration-300"><span class="w-1.5 h-1.5 rounded-full bg-orange-500" aria-hidden="true"></span>${name}</a></li>`).join('\n')}
          </ul>
        </div>

        <div class="rv relative min-w-0">
          <img src="${IMG}hero.webp" alt="" width="1000" height="1241" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse" fetchpriority="high">
          <div class="mt-3 sm:mt-0">
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:top-10', 'bg-orange-500', 'trophy', COPY.hero.prize[0], COPY.hero.prize[1])}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE CONTEST FACTS ═══════════════ */
const FACT_ICONS = ['icon-essay', 'icon-deadlines', 'icon-announcement', 'icon-payment'];
const section2 = () => `  <!-- ================= 02 · CONTEST FACTS =================
       The live hero's four facts after the prize, as the Contact page's illustration
       cards: grey card, white plate, spot icon, the fact's own label and value. -->
  <section id="contest-facts" data-component="spot-cards" aria-label="${COPY.hero.facts.map(f => f[0]).join(', ')}" class="relative py-14 sm:py-20 lg:py-24 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <dl class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
${COPY.hero.facts.map(([dt, dd], i) => `        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-50 p-4 sm:p-5 lg:p-6">
          <div class="rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white mb-4 lg:mb-5 py-4 sm:py-5 lg:py-6 flex items-center justify-center">
            <img src="${IMG}${FACT_ICONS[i]}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-[64px] h-[64px]">
          </div>
          <dt class="${CAP} text-ink-500 mb-2">${dt}</dt>
${dd.map(line => `          <dd class="text-[15px] sm:text-[16px] font-bold tracking-tight text-ink-900 nums">${amp(line)}</dd>`).join('\n')}
        </div>`).join('\n')}
      </dl>
    </div>
  </section>`;

/* ═══════════════ 03 · TRY YOUR LUCK ═══════════════ */
const T = COPY.terms.items;
const section3 = () => `  <!-- ================= 03 · TRY YOUR LUCK =================
       The pitch beside a student at her desk; the photograph sits left, opposite the
       hero's. The chip carries two of the terms' own titles — who the contest is for. -->
  <section id="try-your-luck" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div class="rv relative min-w-0 order-2 lg:order-1">
          <img src="${IMG}luck.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
          <div class="mt-3 sm:mt-0">
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:top-8', 'bg-teal-500', 'cap', T[0][0], T[1][0])}
          </div>
        </div>
        <div class="rv min-w-0 order-1 lg:order-2">
          <h2 class="${H2}">${COPY.luck.h2}</h2>
          <p class="${INTRO} max-w-[52ch]">${COPY.luck.lead}</p>
          <div class="mt-6 lg:mt-7 grid gap-4 max-w-[60ch]">
${COPY.luck.body.map(p => `            <p class="text-[15px] sm:text-[15.5px] lg:text-[16px] leading-relaxed text-ink-700">${p}</p>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* 04 was v1's dark "Apply for Scholarship" act. It went from both versions with the
   Secondary Pages Design Correction Pack of 2026-10-06; nothing stands in its place, and
   nothing else on the page changed for it — the pack asked for the eligibility cards and
   the process section to stay as they were. So "try your luck" and the rules now stand
   on the same tint, one after the other (noted for Olex). */

/* ═══════════════ 05–06 · THE FIFTEEN TERMS, SORTED BY WHAT THEY ARE ═══════════════
   v1 prints the fifteen terms as one grid of fifteen equal cards — correct, and a wall
   (Olex, 2026-09-30: "make it more interesting, maybe split it"). They are three kinds
   of thing, so they become three shapes, every term's own title and text unchanged and
   no heading invented for the new parts:
   - six short rules of entry, read at a glance → a tile grid under the section heading;
   - six terms that are really a sequence, deadline → jury → winner → email → ten days →
     payout → a timeline beside a photograph of the moment it leads to;
   - three terms of fine print → a quiet row under the timeline. */
const LI = {
  cap:    I.cap,
  check:  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
  file:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  lang:   '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  gift:   '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
  alert:  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
  scale:  '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  info:   '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  coins:  '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
};
const TINTS = [['bg-teal-50', '#06748A'], ['bg-orange-50', '#B84431'], ['bg-mint-50', '#1B7A50'], ['bg-ink-100', '#374151']];
const lchip = (paths, t) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINTS[t][0]} items-center justify-center shrink-0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${TINTS[t][1]}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg></span>`;

/* which term goes where, by its index in COPY.terms.items (v1's order) */
const RULES = [[0, 'cap'], [1, 'check'], [4, 'ticket'], [5, 'file'], [6, 'lang'], [13, 'gift']];
const SEQUENCE = [7, 8, 9, 10, 11, 12];
const FINE = [[2, 'alert'], [3, 'scale'], [14, 'info']];
{ const all = [...RULES.map(r => r[0]), ...SEQUENCE, ...FINE.map(f => f[0])].sort((a, b) => a - b);
  if (all.join() !== T.map((_, i) => i).join()) throw new Error('every term must appear exactly once'); }

const termsRules = () => `  <!-- ================= 05 · TERMS — THE RULES OF ENTRY =================
       The section heading over the six short rules as tiles: who can enter and how. -->
  <section id="terms-and-conditions" data-component="rule-tiles" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12">
${eyebrow('orange-500', COPY.terms.eyebrow)}
        <h2 class="${H2}">${COPY.terms.h2}</h2>
      </div>
      <div>
        <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" role="list">
${RULES.map(([n, icon], i) => `          <li class="rv rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6">
            <div class="flex items-center gap-3.5 mb-3">
              ${lchip(LI[icon], i % 4)}
              <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight">${T[n][0]}</h3>
            </div>
            <p class="${BODY} text-ink-600">${T[n][1]}</p>
          </li>`).join('\n')}
        </ul>
      </div>
    </div>
  </section>`;

const termsSequence = () => `  <!-- ================= 06 · TERMS — FROM DEADLINE TO PAYOUT =================
       Six terms that happen in order, as a timeline beside the moment they lead to (a
       student reading the good news; the chip is the award's own figure). The three
       terms of fine print close the section as a quiet row. No heading of its own: the
       terms' titles carry it, and the section is labelled by them. -->
  <section id="from-deadline-to-payout" data-component="terms-timeline" aria-label="${SEQUENCE.map(n => T[n][0]).join(', ')}" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
        <div class="rv relative min-w-0 lg:sticky lg:top-28">
          <img src="${IMG}winner.webp" alt="" width="1000" height="1241" loading="lazy" decoding="async" class="w-full aspect-[4/3] object-cover object-[50%_45%] lg:aspect-auto rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
          <div class="mt-3 sm:mt-0">
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:top-10', 'bg-orange-500', 'trophy', '1,000.00 USD', T[12][0])}
          </div>
        </div>

        <ol class="relative min-w-0" role="list">
${SEQUENCE.map((n, i) => {
  const [head, body, list] = T[n];
  const last = i === SEQUENCE.length - 1;
  return `          <li class="rv relative grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr] gap-4 sm:gap-5${last ? '' : ' pb-8 sm:pb-10'}">
            ${last ? '' : '<span class="absolute left-5 sm:left-6 top-12 bottom-0 w-px bg-ink-200" aria-hidden="true"></span>'}
            <span class="relative z-[1] w-10 h-10 sm:w-12 sm:h-12 rounded-full ${last ? 'bg-orange-500 text-white' : 'bg-white ring-1 ring-ink-200 text-ink-700'} flex items-center justify-center text-[14px] sm:text-[15px] font-extrabold nums" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <div class="min-w-0 pt-1.5 sm:pt-2.5">
              <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight mb-1.5">${head}</h3>
              <p class="${BODY} text-ink-600 max-w-[60ch]">${body}</p>${list ? `
              <ul class="mt-2 list-disc pl-5 ${BODY} text-ink-600 marker:text-ink-300">
${list.map(x => `                <li>${x}</li>`).join('\n')}
              </ul>` : ''}
            </div>
          </li>`;
}).join('\n')}
        </ol>
      </div>

      <ul class="mt-12 sm:mt-16 grid md:grid-cols-3 gap-3 sm:gap-4" role="list">
${FINE.map(([n, icon]) => `        <li class="rv rounded-2xl sm:rounded-3xl bg-ink-50 p-5 sm:p-6">
          <div class="flex items-center gap-3 mb-2.5">
            ${lchip(LI[icon], 3)}
            <h3 class="text-[15px] sm:text-[16px] font-bold tracking-tight">${T[n][0]}</h3>
          </div>
          <p class="text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">${T[n][1]}</p>
        </li>`).join('\n')}
      </ul>
    </div>
  </section>`;

if (require.main !== module) return;

/* v1's sections keep their markup; only their grounds swap, so the rhythm still
   alternates after the two new terms sections (tinted → white → tinted → white → tinted) */
const ground = (html, from, to) => {
  const open = html.slice(0, html.indexOf('>', html.indexOf('<section')) + 1);
  if (!open.includes(from)) throw new Error('ground: ' + from + ' not on the section');
  return open.replace(from, to) + html.slice(open.length);
};
const sections = [section1(), section2(), section3(), termsRules(), termsSequence(),
  ground(v1.section5(), 'bg-white', 'bg-[#F7FAFC]'), ground(v1.section6(), 'data-bg="tint"', 'data-bg="white"'),
  ground(v1.section7(), 'bg-white', 'bg-[#F7FAFC]')];
const html = page.render({ title: COPY.title, meta: COPY.meta, canonical: COPY.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' +
            count(/<h3\b/g) + ' h3, ' + count(/<img\b/g) + ' images, ' + count(/class="faq-item/g) + ' faq items');
