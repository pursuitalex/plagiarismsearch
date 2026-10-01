/* Generate site/paper-analysis-v2.html — Rate my paper (Paper analysis), illustrated.
   v1 (site/paper-analysis.html, hand-written in an earlier session) stays beside it; the
   switcher (build/version-switch.js) puts the two one click apart until Olex picks.

   Every word is the live page's (plagiarismsearch.com/rate-my-paper, read 2026-09-30),
   from build/paper-data.json, including the form's labels, its 21 paper types and its
   thirty prices, read from the live HTML.

   THE FORM (Olex, 2026-09-30: "a strange form, but the only one — make it clearer, it
   matters"). The live form hides how the price is made: a card per deadline, the level
   behind arrows inside each card, a figure that is really a price per page, and the
   total only after an upload. Here the same choices are laid out as what they are:
     1  the document — the drop zone, then its card: Pages (a stepper; a .txt file counts
        its own), Words, the type of paper, the description;
     2  the price per page — one table, the five academic levels by the six deadlines,
        all thirty prices at once; a cell is the choice of both;
     3  the three services, each row a checkbox, the plagiarism check on as it is live;
   and beside them a summary that shows the sum being made — level and deadline, the
   price per page times the pages, each service chosen, the total — with the discount
   code, the agreement and "CHECK YOUR TEXT". It recomputes on every change (site.js,
   module paper-form); without JS the table still works and the defaults' total shows.

   New words, marked for Olex's review: "/ page" and "×" in the table and the summary (the
   live page never says the price is per page), the step numbers 1–3, and "Services" as
   step 3's heading.

   Run:  node build/paper-v2.js  →  node build/shell.js  →  node build/check-paper-v2.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const TV2 = require('./testimonials-v2');
const cta = require('./sections/cta-band');
const C = require('./paper-data.json');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'paper-analysis-v2.html';
const F = C.form;
const WPP = 275;                                   /* words to a page, as v1's module counts */
const DEFAULT = { level: F.levels[0], days: '2', pages: 1 };   /* the live form's featured card */
const SERVICES = 'Services';                       /* NEW WORD — the live form's services have no heading */

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const money = n => '$' + n.toFixed(2);
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const BODY = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const SMALL = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const IMG = '/assets/img/paper/';
const TOP = '#paper-analysis-top';
const PHOTO = 'w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl';
const live = h => (/^\//.test(h) ? 'https://plagiarismsearch.com' + h : h);
const internal = h => ({ '/policy': 'policy.html' }[h] || live(h));
const ico = (paths, stroke, size = 18, sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  box:    '<path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.66 1.66 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.64 1.64 0 0 0 1.63 0z"/>',
  cloud:  '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  clip:   '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  link:   '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  file:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  x:      '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  arrow:  '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  check:  '<path d="M20 6 9 17l-5-5"/>',
  spell:  '<path d="m6 16 6-12 6 12"/><path d="M8 12h8"/><path d="m16 20 2 2 4-4"/>',
  clock:  '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
};
/* a one-line chip over a photograph: under the photo on a phone (IMAGES.md §8.5) */
const chip = (pos, tone, icon, label) => `        <span class="${pos} flex items-center gap-2.5 rounded-full bg-white shadow-diffuse-lg pl-2 pr-4 lg:pr-5 py-2">
          <span class="w-9 h-9 rounded-full ${tone} flex items-center justify-center shrink-0">${ico(I[icon], '#fff', 17, 2.2)}</span>
          <span class="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-ink-800">${esc(label)}</span>
        </span>`;
const btnDark = (label, h) => `<a href="${h}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${esc(label)}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${ico(I.arrow, 'currentColor', 14, 1.75)}</span>
          </a>`;
/* an illustration card on a tint section: the card is white and its plate takes the
   section's tint — the inner surface alternates with the ground, so neither sinks into it */
const CARD = 'bg-white ring-1 ring-black/[.05]';
const plate = name => `<div class="rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-[#F7FAFC] mb-4 lg:mb-5 py-4 sm:py-5 lg:py-6 flex items-center justify-center">
            <img src="${IMG}${name}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-[64px] h-[64px]">
          </div>`;
const step = (n, title) => `<div class="flex items-center gap-3 mb-4"><span class="w-7 h-7 rounded-full bg-ink-900 text-white flex items-center justify-center text-[12.5px] font-extrabold nums" aria-hidden="true">${n}</span><h2 class="text-[16px] sm:text-[17px] font-bold tracking-tight">${esc(title)}</h2></div>`;
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

/* the defaults' figures, rendered so the summary is right before (and without) JS */
const per0 = F.rates[DEFAULT.level][DEFAULT.days];
const extras0 = F.services.filter(s => s.checked).reduce((n, s) => n + s.price, 0);
const dayLabel = d => F.dayLabels[F.days.indexOf(+d)];

/* ═══════════════ 01 · HERO — THE ORDER FORM ═══════════════ */
const H = C.hero;
const tileParts = t => { const m = t.match(/^(.*?)\s([\d.]+\/5|\d+ \| [\dK+]+)$/); return m ? [m[1], m[2]] : [t, '']; };

const stepDocument = () => `            <div role="group" aria-labelledby="pf-s1" class="pb-6 sm:pb-7 border-b border-ink-100">
              ${step(1, F.document).replace('<h2 ', '<h2 id="pf-s1" ')}
              <label for="pf-file" data-pf="drop" class="pf-drop qc-drop flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 cursor-pointer">
                <span class="qc-drop-icon">${ico(I.upload, 'currentColor', 18)}</span>
                <span class="min-w-0 flex-1"><span class="qc-drop-title">${esc(H.drop[0])}</span><span class="qc-drop-hint mt-0.5">${esc(H.drop[1])}</span></span>
                <span class="self-start sm:self-auto shrink-0 inline-flex items-center rounded-full bg-white ring-1 ring-black/10 px-4 py-2 text-[12px] font-bold tracking-wide text-ink-900">${esc(H.upload)}</span>
              </label>
              <input id="pf-file" type="file" data-pf="file" class="sr-only">
              <div data-pf="doc" hidden class="flex items-center gap-3 rounded-xl bg-teal-50 ring-1 ring-teal-200/70 p-3.5">
                <span class="w-10 h-10 rounded-lg bg-white ring-1 ring-teal-200 flex items-center justify-center shrink-0">${ico(I.file, '#0991A8', 18, 1.75)}</span>
                <span class="min-w-0 flex-1"><span data-pf="name" class="block text-[14px] font-bold truncate"></span><span data-pf="size" class="block text-[12px] text-ink-500 nums"></span></span>
                <button type="button" data-pf="another" class="shrink-0 text-[12.5px] font-semibold text-teal-800 underline decoration-teal-300 underline-offset-4">${esc(F.another)}</button>
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
${H.sources.map((s, i) => { const icon = [I.box, I.cloud, I.clip, I.link][i]; return i === 2
    ? `                <label for="pf-file" class="qc-chip cursor-pointer">${ico(icon, 'currentColor', 14, 1.75)}${esc(s)}</label>`
    : `                <button type="button" class="qc-chip">${ico(icon, 'currentColor', 14, 1.75)}${esc(s)}</button>`; }).join('\n')}
              </div>

              <div class="mt-5 grid grid-cols-2 sm:grid-cols-[9rem_9rem_1fr] gap-3 sm:gap-4 items-end">
                <div>
                  <label for="pf-pages" class="${CAP} text-ink-500 block mb-2">${esc(F.pages)}</label>
                  <div class="pf-step"><button type="button" data-pf-step="-1" aria-label="−1">−</button><input id="pf-pages" data-pf="pages" type="text" inputmode="numeric" value="${DEFAULT.pages}"><button type="button" data-pf-step="1" aria-label="+1">+</button></div>
                </div>
                <div>
                  <p class="${CAP} text-ink-500 mb-2">${esc(F.words)}</p>
                  <p class="h-11 rounded-xl bg-ink-50 flex items-center px-4 text-[15px] font-bold nums" data-pf="words">${(DEFAULT.pages * WPP).toLocaleString('en-US')}</p>
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label for="pf-type" class="${CAP} text-ink-500 block mb-2">${esc(F.typeLabel)}</label>
                  <select id="pf-type" name="type" class="sp-select w-full h-11">
                    <option value="" selected>${esc(F.typePlaceholder)}</option>
${F.types.map(t => `                    <option>${esc(t)}</option>`).join('\n')}
                  </select>
                </div>
              </div>
              <div class="mt-3">
                <button type="button" data-pf="descToggle" data-show="${attr(F.showDescription)}" data-hide="${attr(F.hideDescription)}" aria-expanded="false" aria-controls="pf-desc" class="text-[13px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4"><span class="sr-only">${esc(F.description)}: </span>${esc(F.showDescription)}</button>
                <textarea id="pf-desc" data-pf="desc" name="description" hidden rows="3" placeholder="${attr(F.description)}" aria-label="${attr(F.description)}" class="cf-field mt-3 !h-auto py-3"></textarea>
              </div>
            </div>`;

const stepMatrix = () => `            <div role="group" aria-labelledby="pf-s2" class="py-6 sm:py-7 border-b border-ink-100">
              ${step(2, F.levelLabel).replace('<h2 ', '<h2 id="pf-s2" ').replace('</h2></div>', '</h2><span class="ml-auto text-[12px] font-semibold text-ink-400">$ / page</span></div>')}
              <div class="sm:-mx-1.5">
                <table class="pf-table">
                  <thead><tr><th scope="col"><span class="sr-only">${esc(F.levelLabel)}</span></th>${F.days.map((d, i) => `<th scope="col" data-pf-col="${d}"${String(d) === DEFAULT.days ? ' class="is-on"' : ''}>${esc(F.dayLabels[i])}</th>`).join('')}</tr></thead>
                  <tbody>
${F.levels.map((lv, r) => `                    <tr><th scope="row" data-pf-row="${attr(lv)}"${lv === DEFAULT.level ? ' class="is-on"' : ''}>${esc(F.levelLabels[r])}</th>${F.days.map((d, c) => `<td><label class="pf-cell"><input type="radio" class="sr-only" name="pf-cell" value="${attr(lv)}|${d}" data-level-label="${attr(F.levelLabels[r])}" data-day-label="${attr(F.dayLabels[c])}" aria-label="${attr(F.levelLabels[r] + ', ' + F.dayLabels[c] + ', ' + money(F.rates[lv][d]) + ' / page')}"${lv === DEFAULT.level && String(d) === DEFAULT.days ? ' checked' : ''}><span>${money(F.rates[lv][d])}</span></label></td>`).join('')}</tr>`).join('\n')}
                  </tbody>
                </table>
              </div>
            </div>`;

const stepServices = () => `            <div role="group" aria-labelledby="pf-s3" class="pt-6 sm:pt-7">
              ${step(3, SERVICES).replace('<h2 ', '<h2 id="pf-s3" ')}
              <div class="grid gap-2.5">
${F.services.map(s => `                <label class="pf-service"><input type="checkbox" id="pf-sv${s.id}" data-pf-service data-price="${s.price}" name="services[${s.id}]"${s.checked ? ' checked' : ''}><span class="min-w-0 flex-1"><span class="block text-[14.5px] font-bold tracking-tight">${esc(s.title)}</span><span class="block text-[13px] text-ink-500 leading-snug mt-0.5">${esc(s.hint)}</span></span><span class="shrink-0 text-[15px] font-extrabold nums">${money(s.price)}</span></label>`).join('\n')}
              </div>
            </div>`;

const summary = () => `          <aside class="bg-ink-50 border-t lg:border-t-0 lg:border-l border-ink-100 p-5 sm:p-6 lg:p-7">
            <div class="lg:sticky lg:top-28 grid gap-4">
              <dl class="grid gap-2.5 text-[13.5px]">
                <div class="flex justify-between gap-3"><dt class="text-ink-500">${esc(F.levelLabel)}</dt><dd class="font-bold text-right"><span data-pf="level">${esc(F.levelLabels[0])}</span> · <span data-pf="deadline">${esc(dayLabel(DEFAULT.days))}</span></dd></div>
                <div class="flex justify-between gap-3"><dt class="text-ink-500"><span data-pf="rate" class="nums">${money(per0)}</span> / page × <span data-pf="pagesOut" class="nums">${DEFAULT.pages}</span> ${esc(F.pages)}</dt><dd data-pf="base" class="font-bold nums">${money(per0 * DEFAULT.pages)}</dd></div>
${F.services.map(s => `                <div class="pf-sum-line justify-between gap-3" data-pf-sum="pf-sv${s.id}"><dt class="text-ink-500">${esc(s.title)}</dt><dd class="font-bold nums">${money(s.price)}</dd></div>`).join('\n')}
              </dl>

              <div class="flex gap-2">
                <input type="text" data-pf="code" name="discount_code" placeholder="${attr(F.discountPlaceholder)}" aria-label="${attr(F.discountPlaceholder)}" class="cf-field !h-11 flex-1 min-w-0">
                <button type="button" data-pf="apply" class="shrink-0 h-11 rounded-xl bg-white ring-1 ring-black/10 hover:ring-black/20 px-4 text-[13px] font-bold">${esc(F.apply)}</button>
              </div>
              <p data-pf="codeMsg" data-error="${attr(F.discountError)}" role="status" hidden class="-mt-2 text-[12.5px] font-semibold text-orange-700"></p>

              <div class="pt-4 border-t border-ink-200/70 flex items-baseline justify-between gap-3">
                <span class="text-[14px] font-bold">${esc(F.total)}</span>
                <span data-pf="total" class="text-[clamp(1.8rem,3vw,2.3rem)] font-extrabold tracking-tightest leading-none nums">${money(per0 * DEFAULT.pages + extras0)}</span>
              </div>
              <p data-pf="hint" class="rounded-xl bg-orange-50 ring-1 ring-orange-200/60 px-3.5 py-2.5 text-[12.5px] text-ink-700">${esc(F.uploadHint[0])} <label for="pf-file" class="font-semibold text-orange-700 underline underline-offset-4 cursor-pointer">${esc(F.uploadHint[1])}</label> ${esc(F.uploadHint[2])}</p>

              <label class="flex items-start gap-2.5 text-[13px] text-ink-600 cursor-pointer"><input type="checkbox" name="agreement" required class="mt-0.5 w-4 h-4 accent-teal-600 shrink-0"><span>${esc(F.agreement[0])} <a href="${live(F.terms)}" rel="noopener" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4">${esc(F.agreement[1])}</a> ${esc(F.agreement[2])} <a href="${internal(F.policy)}" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4">${esc(F.agreement[3])}</a></span></label>

              <button type="submit" class="btn-press group flex items-center justify-center gap-2.5 w-full rounded-full bg-orange-500 hover:bg-orange-600 transition-colors duration-300 text-white text-[14px] font-bold tracking-wide py-3.5">${esc(F.submit)}${ico(I.arrow, '#fff', 16, 2)}</button>
            </div>
          </aside>`;

const section1 = () => `  <!-- ================= 01 · HERO / THE ORDER FORM =================
       The live form's choices laid out as what they are (see the file's header): three
       steps and a summary that shows the sum being made. -->
  <section id="paper-analysis-top" data-component="order-form" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-clip">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-end mb-8 sm:mb-10">
        <div>
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4">${penMark(esc(H.h1), 'analysis')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[17px] leading-relaxed text-ink-600 max-w-[52ch]">${esc(H.lead)} <i class="not-italic font-semibold text-ink-800">${esc(H.leadTail)}</i></p>
        </div>
        <ul class="flex flex-wrap gap-2.5 lg:justify-end" role="list">
${H.tiles.map(([label, h]) => { const [name, fig] = tileParts(label); return `          <li><a href="${h}" rel="nofollow noopener" class="inline-flex items-baseline gap-2 rounded-2xl bg-white/80 hover:bg-white ring-1 ring-black/5 px-4 py-2.5 transition-colors duration-300"><span class="text-[12.5px] font-semibold text-ink-500">${esc(name)}</span> <span class="text-[15px] font-extrabold tracking-tight text-ink-900 nums">${esc(fig)}</span></a></li>`; }).join('\n')}
        </ul>
      </div>

      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
        <form data-paper-form data-words-per-page="${WPP}" onsubmit="return false" class="grid lg:grid-cols-[1.55fr_1fr] rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl overflow-clip">
          <script type="application/json" data-pf-rates>${JSON.stringify(F.rates)}</script>
          <div class="p-5 sm:p-6 lg:p-8 min-w-0">
${stepDocument()}
${stepMatrix()}
${stepServices()}
          </div>
${summary()}
        </form>
      </div>
      <p class="rv mt-5 text-center text-[13.5px] text-ink-600">${esc(H.manual[0])} <a href="${live(H.manual[1][1])}" rel="noopener" class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4">${esc(H.manual[1][0])}</a>.</p>
    </div>
  </section>`;

/* ═══════════════ 02 · RATE MY PAPER ═══════════════ */
const R = C.rate, GET = C.get;
const section2 = () => `  <!-- ================= 02 · RATE MY PAPER =================
       The live opening text beside a student rereading her paper; the chips are two of the
       aspects the next section names. -->
  <section id="rate-my-paper" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0">
          <h2 class="${H2}">${esc(R.h2)}</h2>
          <div class="mt-5 lg:mt-6 grid gap-4 max-w-[64ch]">
${R.body.map(p => `            <p class="${BODY}">${esc(p)}</p>`).join('\n')}
          </div>
        </div>
        <div class="rv relative min-w-0">
          <img src="${IMG}student.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="${PHOTO} shadow-diffuse">
          <div class="mt-3 flex flex-col gap-2.5 sm:mt-0">
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:top-8', 'bg-teal-500', 'check', GET.items[0][0])}
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:bottom-10', 'bg-orange-500', 'spell', GET.items[1][0])}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · WHAT CAN ONE GET ═══════════════ */
const GET_ICON = ['icon-content', 'icon-grammar', 'icon-research', 'icon-structure'];
const section3 = () => `  <!-- ================= 03 · WHAT CAN ONE GET FROM OUR COMPANY? =================
       The four aspects the specialists look at, as illustration cards. -->
  <section id="what-you-get" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-14 mb-10 sm:mb-12 items-end">
        <h2 class="${H2}">${esc(GET.h2)}</h2>
        <p class="${BODY}">${esc(GET.intro)}</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
${GET.items.map(([t, d], i) => `        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl ${CARD} p-4 sm:p-5 lg:p-6">
          ${plate(GET_ICON[i])}
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-2">${esc(t)}</h3>
          <p class="${SMALL} text-ink-600">${esc(d)}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · SPECIFICS OF USING OUR SERVICES ═══════════════ */
const SP = C.specifics;
const section4 = () => `  <!-- ================= 04 · SPECIFICS OF USING OUR SERVICES =================
       The text, then the live four-step procedure as a numbered row; the last step's card
       is dark, where the work arrives. -->
  <section id="how-it-works" data-component="steps" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-14 mb-10 sm:mb-12">
        <div>
          <h2 class="${H2}">${esc(SP.h2)}</h2>
          <p class="mt-5 text-[16px] sm:text-[17px] font-semibold leading-snug text-ink-800 max-w-[44ch]">${esc(SP.lead)}</p>
        </div>
        <p class="${BODY} lg:pt-2">${esc(SP.body)}</p>
      </div>
      <ol class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
${SP.steps.map(([t, d], i) => { const last = i === SP.steps.length - 1; return `        <li class="rv rounded-3xl sm:rounded-[28px] ${last ? 'bg-ink-950 text-white' : 'bg-ink-50 ring-1 ring-black/[.03]'} p-5 sm:p-6 flex flex-col">
          <span class="w-10 h-10 rounded-full ${last ? 'bg-orange-500 text-white' : 'bg-white text-ink-900 ring-1 ring-black/[.06]'} flex items-center justify-center text-[14px] font-extrabold nums mb-8 sm:mb-10" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1.5">${esc(t)}</h3>
          <p class="${SMALL} ${last ? 'text-white/65' : 'text-ink-600'}">${esc(d)}</p>
        </li>`; }).join('\n')}
      </ol>
    </div>
  </section>`;

/* ═══════════════ 05 · WHO WILL RATE MY PAPER — THE DARK ACT ═══════════════ */
const W = C.who;
const CHECK_LINK = { 'Plagiarism check': 'index.html' };   /* live: https://plagiarismsearch.com */
const section5 = () => `  <!-- ================= 05 · WHO WILL RATE MY PAPER? =================
       The editors, on the dark act: the text beside an editor at work, "24/7" (the text's
       own) his chip, and the four checks the experts conduct as a list; "Plagiarism check"
       keeps its live link, to this prototype's home. -->
  <section id="who-will-rate" data-component="dark-act" data-surface="dark" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute w-[680px] h-[680px] -left-56 -top-56 bg-[rgba(44,195,219,.14)]"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-16 items-center">
        <div class="rv relative min-w-0 order-2 lg:order-1">
          <img src="${IMG}editor.webp" alt="" width="1000" height="1241" loading="lazy" decoding="async" class="${PHOTO}">
          <div class="mt-3 sm:mt-0">
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:top-10', 'bg-teal-500', 'clock', '24/7')}
          </div>
        </div>
        <div class="rv min-w-0 order-1 lg:order-2">
          <h2 class="${H2} mb-6 lg:mb-7">${esc(W.h2)}</h2>
          <div class="grid gap-4 max-w-[66ch]">
${W.body.map(p => `            <p class="${SMALL} lg:text-[15px] text-white/70">${esc(p)}</p>`).join('\n')}
          </div>
          <h3 class="mt-8 lg:mt-10 mb-4 text-[16px] sm:text-[17px] font-bold tracking-tight">${esc(W.h3)}</h3>
          <ul class="grid sm:grid-cols-2 gap-2.5" role="list">
${W.checks.map(t => { const inner = `<span class="shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">${ico(I.check, '#fff', 15, 2.4)}</span><span class="text-[14.5px] sm:text-[15px] font-semibold tracking-tight">${esc(t)}</span>`; return CHECK_LINK[t]
    ? `            <li><a href="${CHECK_LINK[t]}" class="flex items-center gap-3 rounded-2xl bg-white/[.06] hover:bg-white/[.1] ring-1 ring-white/10 p-2.5 pr-4 underline decoration-white/30 underline-offset-4 transition-colors duration-300">${inner}</a></li>`
    : `            <li class="flex items-center gap-3 rounded-2xl bg-white/[.06] ring-1 ring-white/10 p-2.5 pr-4">${inner}</li>`; }).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · THE WAY WE GRADE PAPERS ═══════════════ */
const GR = C.grade;
const section6 = () => `  <!-- ================= 06 · THE WAY WE GRADE PAPERS =================
       The heading and the first paragraph across the top; below, an editor marking a paper
       beside the rest of the process. Checkerboard: the photo is on the left here, after
       the right-hand photo of 02. -->
  <section id="how-we-grade" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-14 mb-10 sm:mb-12">
        <h2 class="${H2}">${esc(GR.h2)}</h2>
        <p class="${BODY} lg:pt-2">${esc(GR.body[0])}</p>
      </div>
      <div class="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
        <div class="rv relative min-w-0">
          <img src="${IMG}grading.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="${PHOTO} shadow-diffuse">
          <div class="mt-3 flex flex-col gap-2.5 sm:mt-0">
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:top-8', 'bg-teal-500', 'spell', W.checks[1])}
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:bottom-10', 'bg-orange-500', 'search', W.checks[2])}
          </div>
        </div>
        <div class="rv grid gap-4 min-w-0">
${GR.body.slice(1).map(p => `          <p class="${BODY}">${esc(p)}</p>`).join('\n')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · OUR ADVANTAGES ═══════════════ */
const ADV = C.advantages;
const ADV_ICON = ['icon-papers', 'icon-quality', 'icon-privacy', 'icon-specialists', 'icon-support', 'icon-prices'];
const section7 = () => `  <!-- ================= 07 · OUR ADVANTAGES =================
       Six illustration cards, the page's second spot-icon set of one sheet. -->
  <section id="advantages" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <h2 class="rv ${H2} mb-10 sm:mb-12">${esc(ADV.h)}</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
${ADV.items.map(([t, d], i) => `        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl ${CARD} p-4 sm:p-5 lg:p-6">
          ${plate(ADV_ICON[i])}
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-2">${esc(t)}</h3>
          <p class="${SMALL} text-ink-600">${esc(d)}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · FEEDBACK ═══════════════ */
const P = TV2.D.trustpilot;
const section8 = () => `  <!-- ================= 08 · FEEDBACK OF OUR CUSTOMERS =================
       The Trustpilot feedback the live page loads — the Reviews data, word for word, in
       Trustpilot's manner. Live, it follows the CTA; here the CTA band closes the page,
       as the system has it (build/sections/cta-band.js). -->
  <section id="feedback" data-component="review-masonry" class="relative py-16 sm:py-24 lg:py-32 bg-[#FCFBF3]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-wrap items-end justify-between gap-4 mb-8">
        <h2 class="${H2} text-[#191919]">${esc(C.feedback.h)}</h2>
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#191919]/70"><b class="text-[#191919]">${esc(P.textRating)}</b> ${TV2.tpStars(P.stars)} <b class="text-[#191919] nums">${P.rating}/${P.max}</b> <span aria-hidden="true">|</span> <span>Based on <a href="${P.url}" rel="nofollow noopener" class="font-semibold text-[#191919] underline decoration-[#191919]/30 underline-offset-4">${P.count} reviews</a></span></p>
      </div>
      <div class="masonry columns-1 sm:columns-2 lg:columns-3 gap-4">
${P.reviews.slice(0, 6).map(TV2.tpCard).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · CHECKING YOUR WORK IS EASY — THE CLOSING BAND ═══════════════ */
const CT = C.cta;
const section9 = () => `  <!-- ================= 09 · CHECKING YOUR WORK IS EASY =================
       The shared closing CTA band (build/sections/cta-band.js); the button goes back up to the form. -->
${cta.section({
  id: 'paper-final-cta',
  title: esc(CT.h), ring: 'easy',
  lead: esc(CT.lead), measure: '56',
  actions: { button: { label: esc(CT.button), href: TOP } },
})}`;

module.exports = { C };
if (require.main !== module) return;

const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9].map(f => f());
const html = page.render({ title: esc(C.title), meta: C.meta, canonical: C.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/<img\b/g) + ' images, ' + count(/<option\b/g) + ' paper types');
