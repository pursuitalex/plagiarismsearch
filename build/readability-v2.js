/* Generate site/readability-check-v2.html — the Readability Score Checker, illustrated.
   v1 (site/readability-check.html, hand-written in an earlier session) stays beside it;
   the switcher (build/version-switch.js) puts the two one click apart until Olex picks.

   Every word is the live page's (plagiarismsearch.com/readability-checker, read
   2026-09-30), from build/readability-data.json — made from the page's text by line
   number, so no sentence is retyped. Two things on the live page are pictures of data,
   and become the data here: the Flesch Reading Ease bar chart (table-6.png) and the
   score-by-genre chart (table-9.png), their labels and axes word for word. The Trustpilot
   feedback the live page loads is the same widget Reviews v2 renders (testimonials-v2.js).

   The manner is the illustrated one of the company pages (IMAGES.md §8, the wardrobe law):
   three photographs in place of the live page's stock images, a duotone spot-icon set,
   chips carrying only the page's own words. The working calculator is v1's (site.js,
   module readability: Flesch Reading Ease and Flesch-Kincaid Grade Level in the browser),
   now with the live page's upload options and a drop zone that reads a dropped file.

   Liberties, none in the words:
   - The live headings mix h2 and h3 at one level; here each section has an h2.
   - One live sentence carries an editor's marker, "[М1]"; it is left out.
   - The live copy's typo "am biguous" is kept, word for word.

   Run:  node build/readability-v2.js  →  node build/shell.js  →  node build/check-readability-v2.js */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const TV2 = require('./testimonials-v2');
const C = require('./readability-data.json');

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'readability-check-v2.html';
const IMG = '/assets/img/readability/';
const TOP = '#readability-checker-top';

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's, as in affiliate-v2.js.
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const SMALL = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const CAP = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');
const btnDark = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${esc(label)}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: "' + phrase + '" not in "' + text + '"');
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};
const ico = (paths, stroke, size = 18, sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  upload:  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  box:     '<path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.66 1.66 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.64 1.64 0 0 0 1.63 0z"/>',
  cloud:   '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  clip:    '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  link:    '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  gauge:   '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  book:    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  quote:   '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
};

/* a one-line chip over a photograph (the Mission hero's): under the photo on a phone */
const chip = (pos, tone, icon, label) => `        <span class="${pos} flex items-center gap-2.5 rounded-full bg-white shadow-diffuse-lg pl-2 pr-4 lg:pr-5 py-2">
          <span class="w-9 h-9 rounded-full ${tone} flex items-center justify-center shrink-0">${ico(I[icon], '#fff', 17, 2.2)}</span>
          <span class="text-[12.5px] sm:text-[13px] font-bold tracking-tight text-ink-800">${esc(label)}</span>
        </span>`;

/* the Contact page's illustration card, turned for a tint section: white card, the plate
   in the section's tint — on the tint, a grey card and white plate sink into the ground */
const spotCard = (icon, head, body, extraBody = '') => `        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/[.05] p-4 sm:p-5 lg:p-6">
          <div class="rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-[#F7FAFC] mb-4 lg:mb-5 py-4 sm:py-5 lg:py-6 flex items-center justify-center">
            <img src="${IMG}${icon}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-[64px] h-[64px]">
          </div>
          <h3 class="text-[15.5px] sm:text-[16.5px] font-bold tracking-tight mb-2">${esc(head)}</h3>
          <p class="${SMALL} text-ink-600">${esc(body)}</p>${extraBody}
        </div>`;

const head = (h, intro, center) => `      <div class="rv ${center ? 'text-center mx-auto ' : ''}max-w-[820px] mb-10 sm:mb-12">
        <h2 class="${H2}">${esc(h)}</h2>${intro ? `
        <p class="${INTRO}${center ? ' mx-auto' : ''} max-w-[64ch]">${esc(intro)}</p>` : ''}
      </div>`;

/* ═══════════════ 01 · HERO — THE CHECKER ═══════════════ */
const H = C.hero;
/* the tiles: the live link text, the platform name and the figure set apart */
const tileParts = t => { const m = t.match(/^(.*?)\s([\d.]+\/5|\d+ \| [\dK+]+)$/); return m ? [m[1], m[2]] : [t, '']; };
const section1 = () => `  <!-- ================= 01 · HERO / READABILITY CHECKER =================
       The working calculator (v1's module), dressed in the live page's own controls: the
       box, the drop zone with "UPLOAD FILE", the four sources, "CHECK TEXT". Its readouts
       are named in the page's own terms. The live rating tiles sit under the lead. -->
  <section id="readability-checker-top" data-component="hero-tool" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.9fr_1.1fr] gap-10 lg:gap-14 items-center">
        <div class="rv min-w-0">
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(esc(H.h1), 'checker')}</h1>
          <p id="rc-lead" class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[46ch] mb-8 lg:mb-10">${esc(H.lead)}</p>
          <ul class="flex flex-wrap gap-2.5" role="list">
${H.tiles.map(([label, href]) => { const [name, fig] = tileParts(label); return `            <li><a href="${href}" rel="nofollow noopener" class="inline-flex items-baseline gap-2 rounded-2xl bg-white/80 hover:bg-white ring-1 ring-black/5 px-4 py-2.5 transition-colors duration-300"><span class="text-[12.5px] font-semibold text-ink-500">${esc(name)}</span> <span class="text-[15px] font-extrabold tracking-tight text-ink-900 nums">${esc(fig)}</span></a></li>`; }).join('\n')}
          </ul>
        </div>

        <div class="rv min-w-0 rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
          <form data-readability data-bands='[[0,""]]' onsubmit="return false" class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6">
            <label for="rc-text" class="flex items-center gap-2 mb-2.5"><span class="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center shrink-0">${ico('<path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/>', '#fff', 13, 2.4)}</span><span class="text-[14px] font-bold tracking-tight text-ink-900">${esc(C.acceptance.items[0][0])}</span></label>
            <textarea id="rc-text" data-rc="text" class="rc-area mb-4 rounded-xl sm:rounded-[14px] bg-ink-50/60 ring-1 ring-black/[.06] focus:ring-teal-500 px-4 py-3 transition-shadow duration-200" placeholder="${esc(C.acceptance.items[0][1])}" aria-describedby="rc-lead"></textarea>

            <label for="rc-file" data-rc-drop class="rc-drop qc-drop flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 cursor-pointer">
              <span class="qc-drop-icon">${ico(I.upload, 'currentColor', 18)}</span>
              <span class="min-w-0 flex-1">
                <span class="qc-drop-title">${esc(H.drop[0])}</span>
                <span class="qc-drop-hint mt-0.5">${esc(H.drop[1])}</span>
              </span>
              <span class="self-start sm:self-auto shrink-0 inline-flex items-center rounded-full bg-white ring-1 ring-black/10 px-4 py-2 text-[12px] font-bold tracking-wide text-ink-900">${esc(H.upload)}</span>
            </label>
            <input id="rc-file" type="file" data-rc="file" class="sr-only" accept=".txt,.md,text/plain">

            <div class="mt-3 flex flex-wrap gap-2">
${H.sources.map((s, i) => {
  const icon = [I.box, I.cloud, I.clip, I.link][i];
  return i === 2
    ? `              <label for="rc-file" class="qc-chip cursor-pointer">${ico(icon, 'currentColor', 14, 1.75)}${esc(s)}</label>`
    : `              <button type="button" class="qc-chip">${ico(icon, 'currentColor', 14, 1.75)}${esc(s)}</button>`;
}).join('\n')}
            </div>

            <div class="mt-5 rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-ink-50 p-4 lg:p-5">
              <div class="flex items-end justify-between gap-4 mb-3">
                <div>
                  <div class="${CAP} text-ink-400 mb-2">Flesch Reading Ease</div>
                  <span data-rc="score" class="text-[28px] sm:text-[32px] font-extrabold tracking-tightest leading-none nums text-ink-900">&mdash;</span>
                </div>
                <div class="text-right">
                  <div class="${CAP} text-ink-400 mb-2">Flesch-Kincaid Grade Level</div>
                  <span data-rc="grade" class="text-[20px] sm:text-[22px] font-extrabold tracking-tightest leading-none nums text-ink-900">&mdash;</span>
                </div>
              </div>
              <div class="rc-scale mb-2"><span data-rc="needle" class="rc-needle hidden" style="left:0%"></span></div>
              <div class="flex justify-between text-[10px] font-semibold text-ink-400 nums"><span>0</span><span>100</span></div>
              <div class="mt-3 pt-3 border-t border-ink-200/70 flex items-center justify-between text-[12px] font-semibold text-ink-500">
                <span>Average Sentence Length</span><b data-rc="asl" class="nums text-ink-900 text-[14px]">0</b>
              </div>
              <span data-rc="words" hidden>0</span><span data-rc="sents" hidden>0</span><span data-rc="level" hidden></span>
              <span data-rc="hint" data-empty="" data-short="" data-ok="" hidden></span>
            </div>

            <div class="mt-5 flex justify-end">
              <button type="submit" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] font-bold tracking-wide pl-5 pr-2 py-2">
                ${esc(H.check)}
                <span class="icon-orb w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">${arrow}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · UPGRADED READABILITY CHECKER ═══════════════ */
const U = C.upgraded;
const section2 = () => `  <!-- ================= 02 · UPGRADED READABILITY CHECKER =================
       The claim beside an editor at work; the chips are the two scores the paragraph
       names. -->
  <section id="upgraded-readability-checker" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0">
          <h2 class="${H2}">${esc(U.h2)}</h2>
          <div class="mt-5 lg:mt-6 grid gap-4 max-w-[62ch]">
${U.body.map(p => `            <p class="${BODY}">${esc(p)}</p>`).join('\n')}
          </div>
        </div>
        <div class="rv relative min-w-0">
          <img src="${IMG}editor.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
          <div class="mt-3 flex flex-col gap-2.5 sm:mt-0">
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:top-8', 'bg-teal-500', 'gauge', 'Flesch Readability Ease')}
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:bottom-10', 'bg-orange-500', 'book', 'Flesch-Kincaid Grade Level')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · ACCEPTANCE ═══════════════ */
const A = C.acceptance;
const section3 = () => `  <!-- ================= 03 · READABILITY CHECKER ACCEPTANCE =================
       The four ways in, as the Contact page's illustration cards; "Start checking" goes
       back up to the checker. -->
  <section id="readability-checker-acceptance" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-12">
        <div class="max-w-[720px]">
          <h2 class="${H2}">${esc(A.h)}</h2>
          <p class="${INTRO}">${esc(A.intro)}</p>
        </div>
        <div class="shrink-0">${btnDark(A.cta, TOP)}</div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
${A.items.map(([h, b], i) => spotCard(['icon-text', 'icon-files', 'icon-url', 'icon-cloud'][i], h, b)).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 04 · WHY READABILITY ═══════════════ */
const W = C.why;
const section4 = () => `  <!-- ================= 04 · WHY IS READABILITY QUINTESSENTIAL =================
       A reader on the left (opposite the editor above); the argument on the right, its
       one summarising sentence set as a pull quote. -->
  <section id="why-readability" data-component="photo-split" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0 order-2 lg:order-1">
          <img src="${IMG}reader.webp" alt="" width="1000" height="1241" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
        </div>
        <div class="rv min-w-0 order-1 lg:order-2">
          <h2 class="${H2}">${esc(W.h2)}</h2>
          <div class="mt-5 lg:mt-6 grid gap-4 max-w-[64ch]">
${W.body.map(p => `            <p class="${BODY}">${esc(p)}</p>`).join('\n')}
          </div>
          <figure class="mt-7 lg:mt-8 flex gap-4 rounded-2xl sm:rounded-3xl bg-[#F2FCFC] ring-1 ring-teal-600/10 p-5 sm:p-6 max-w-[64ch]">
            <span class="shrink-0 mt-0.5">${ico(I.quote, '#0CA9C3', 22, 1.75)}</span>
            <blockquote class="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold tracking-tight leading-snug text-ink-900">${esc(W.quote)}</blockquote>
          </figure>
          <p class="mt-6 ${BODY} max-w-[64ch]">${esc(W.last)}</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · WHO NEEDS IT ═══════════════ */
const section5 = () => `  <!-- ================= 05 · WHO NEEDS TO CHECK READABILITY SCORE =================
       The four readers of the tool as illustration cards, two by two. -->
  <section id="who-needs-it" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
${head(C.who.h)}
      <div class="grid md:grid-cols-2 gap-4">
${C.who.items.map(([h, b], i) => spotCard(['icon-students', 'icon-websites', 'icon-marketers', 'icon-writers'][i], h, b)).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · HOW TO DEFINE A SCORE ═══════════════ */
const D = C.define;
const section6 = () => `  <!-- ================= 06 · HOW TO DEFINE A READABILITY SCORE =================
       The text on the left; on the right the six determining factors as a numbered card,
       and the 0-10 note as its foot. -->
  <section id="define-readability-score" data-component="text-factors" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-start">
        <div class="rv min-w-0">
          <h2 class="${H2}">${esc(D.h)}</h2>
          <div class="mt-5 lg:mt-6 grid gap-4 max-w-[64ch]">
${D.body.map(p => `            <p class="${BODY}">${esc(p)}</p>`).join('\n')}
          </div>
        </div>
        <div class="rv min-w-0 lg:sticky lg:top-28 rounded-3xl sm:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-3xl bg-white shadow-inner-hl p-5 sm:p-6 lg:p-8">
            <p class="text-[15px] sm:text-[16px] font-bold tracking-tight mb-5">${esc(D.factorsLead)}</p>
            <ol class="grid gap-3" role="list">
${D.factors.map((f, i) => `              <li class="flex items-center gap-3.5"><span class="shrink-0 w-8 h-8 rounded-full ${i % 2 ? 'bg-orange-50 text-orange-700' : 'bg-teal-50 text-teal-700'} flex items-center justify-center text-[12.5px] font-extrabold nums" aria-hidden="true">${i + 1}</span><span class="text-[14.5px] sm:text-[15px] font-semibold text-ink-800">${esc(f)}</span></li>`).join('\n')}
            </ol>
            <p class="mt-6 pt-5 border-t border-ink-100 ${SMALL} text-ink-600">${esc(D.grade)}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 07 · THE FLESCH READING EASE TEST ═══════════════ */
const T = C.test, E = C.charts.ease;
const MAXY = 200;
const easeChart = () => `          <figure class="rounded-3xl sm:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8">
            <figcaption class="flex items-baseline justify-between gap-4 mb-5">
              <span class="text-[15px] sm:text-[16px] font-bold tracking-tight">${esc(E.title)}</span>
              <span class="text-[12px] font-semibold text-ink-500">${esc(E.y)}</span>
            </figcaption>
            <div class="relative h-[300px] sm:h-[340px] grid grid-cols-10 gap-1.5 sm:gap-3 items-end border-b border-ink-200" role="img" aria-label="${attr(E.title + ': ' + E.bars.map(([x, y, w]) => E.x + ' ' + x + ', ' + y + ' ' + E.y + ', ' + E.label + w).join('; '))}">
${E.bars.map(([x, y, w]) => `              <div class="relative flex justify-center rounded-t-lg sm:rounded-t-xl bg-gradient-to-t from-teal-50 to-teal-400/80" style="height:${(y / MAXY * 100).toFixed(1)}%"><span class="absolute bottom-2.5 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[10px] sm:text-[11px] font-semibold text-ink-700 hidden sm:block">${esc(E.label + w)}</span></div>`).join('\n')}
            </div>
            <div class="grid grid-cols-10 gap-1.5 sm:gap-3 mt-2 text-[9.5px] sm:text-[10.5px] font-semibold text-ink-400 nums text-center" aria-hidden="true">${E.bars.map(([x]) => `<span>${x + 5}</span>`).join('')}</div>
            <p class="mt-2 text-[12px] font-semibold text-ink-500">${esc(E.x)}</p>
            <p class="sm:hidden mt-3 text-[11px] text-ink-500 nums">${esc(E.label.replace(/ - $/, ''))}: ${E.bars.map(b => b[2]).join(' · ')}</p>
          </figure>`;

const section7 = () => `  <!-- ================= 07 · THE FLESCH READING EASE TEST =================
       The test's two variables as a pair of cards, the text, and the live page's chart —
       a picture there — drawn here from its own numbers and words. -->
  <section id="flesch-reading-ease-test" data-component="text-chart" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
${head(T.h2, T.intro)}
      <div class="rv grid sm:grid-cols-2 gap-4 mb-10 sm:mb-12 max-w-[920px]">
${T.vars.map((v, i) => `        <div class="flex items-center gap-4 rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 p-5 sm:p-6"><span class="shrink-0 w-10 h-10 rounded-full ${i ? 'bg-orange-500' : 'bg-teal-500'} text-white flex items-center justify-center text-[15px] font-extrabold" aria-hidden="true">${i + 1}</span><span class="text-[15px] sm:text-[16px] font-bold tracking-tight">${esc(v)}</span></div>`).join('\n')}
      </div>
      <div class="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
        <div class="rv min-w-0 grid gap-4 max-w-[64ch]">
${T.body.map(p => `          <p class="${BODY}">${esc(p)}</p>`).join('\n')}
          <p class="${BODY}">${esc(T.algorithm)}</p>
        </div>
        <div class="rv min-w-0">
${easeChart()}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · FLESCH-KINCAID GRADE LEVEL — THE DARK ACT ═══════════════ */
const K = C.kincaid;
const section8 = () => `  <!-- ================= 08 · FLESCH-KINCAID GRADE LEVEL =================
       The history and the framework on the dark act, beside a reader with a book; the two
       determining factors as the photograph's chips. -->
  <section id="flesch-kincaid-grade-level" data-component="dark-act" data-surface="dark" class="relative py-16 sm:py-24 lg:py-32 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute w-[680px] h-[680px] -right-56 -top-56 bg-[rgba(44,195,219,.14)]"></div>
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[820px] mb-10 sm:mb-12"><h2 class="${H2}">${esc(K.h2)}</h2></div>
      <div class="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
        <div class="rv min-w-0 grid gap-8">
          <div>
            <h3 class="text-[18px] sm:text-[20px] font-bold tracking-tight mb-3">${esc(K.history[0])}</h3>
            <p class="${SMALL} lg:text-[15px] text-white/70 max-w-[68ch]">${esc(K.history[1])}</p>
          </div>
          <div>
            <h3 class="text-[18px] sm:text-[20px] font-bold tracking-tight mb-3">${esc(K.framework[0])}</h3>
            <div class="grid gap-3 max-w-[68ch]">
${K.framework.slice(1).map(p => `              <p class="${SMALL} lg:text-[15px] text-white/70">${esc(p)}</p>`).join('\n')}
            </div>
          </div>
        </div>
        <div class="rv relative min-w-0 lg:sticky lg:top-28">
          <img src="${IMG}book.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl">
          <div class="mt-5 rounded-2xl sm:rounded-3xl bg-white/[.06] ring-1 ring-white/10 p-5 sm:p-6">
            <h3 class="text-[15px] sm:text-[16px] font-bold tracking-tight mb-3">${esc(K.factors[0])}</h3>
            <ul class="flex flex-wrap gap-2" role="list">
${K.factors.slice(1).map((f, i) => `              <li class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-2 text-[13px] font-semibold"><span class="w-1.5 h-1.5 rounded-full ${i ? 'bg-orange-400' : 'bg-teal-400'}" aria-hidden="true"></span>${esc(f)}</li>`).join('\n')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · ARE YOU INTERESTED — AND THE FEEDBACK ═══════════════ */
const P = TV2.D.trustpilot;
const FEED = 6;                  /* the live widget shows three at a time; two rows of them */
const section9 = () => `  <!-- ================= 09 · YOUR READABILITY SCORE, AND THE FEEDBACK =================
       The invitation, then the feedback the live page loads from Trustpilot — the same
       reviews and the same manner as Reviews v2, on Trustpilot's cream ground. -->
  <section id="feedback" data-component="review-masonry" class="relative py-16 sm:py-24 lg:py-32 bg-[#FCFBF3]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-14 mb-12 sm:mb-16">
        <h2 class="${H2} text-[#191919]">${esc(C.interested.h)}</h2>
        <div class="grid gap-4">
${C.interested.body.map(p => `          <p class="${BODY} text-[#191919]/75">${esc(p)}</p>`).join('\n')}
          <div class="mt-2">${btnDark(C.improve.cta, TOP)}</div>
        </div>
      </div>

      <div class="rv flex flex-wrap items-end justify-between gap-4 mb-8">
        <h2 class="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tightest text-[#191919]">${esc(C.feedback.h)}</h2>
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#191919]/70"><b class="text-[#191919]">${esc(P.textRating)}</b> ${TV2.tpStars(P.stars)} <b class="text-[#191919] nums">${P.rating}/${P.max}</b> <span aria-hidden="true">|</span> <span>Based on <a href="${P.url}" rel="nofollow noopener" class="font-semibold text-[#191919] underline decoration-[#191919]/30 underline-offset-4">${P.count} reviews</a></span></p>
      </div>
      <div class="masonry columns-1 sm:columns-2 lg:columns-3 gap-4">
${P.reviews.slice(0, FEED).map(TV2.tpCard).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 10 · HOW TO IMPROVE YOUR WRITING LEVEL ═══════════════ */
const M = C.improve, G = C.charts.genres;
const span = G.to - G.from;
const genreChart = () => `          <figure class="rounded-3xl sm:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-8" aria-label="${attr(G.rows.map(([n, a, b]) => n + ' ' + a + '–' + b).join('; '))}">
            <div class="grid grid-cols-[minmax(0,10.5rem)_1fr] gap-x-4 gap-y-3 items-center">
${G.rows.map(([n, a, b], i) => `              <span class="text-[12px] sm:text-[13px] font-semibold text-ink-700 text-right leading-tight">${esc(n)}</span>
              <span class="relative h-5 sm:h-6 rounded-md bg-ink-50"><span class="absolute inset-y-0 rounded-md ${n === 'Academic' ? 'bg-orange-400' : 'bg-teal-500'}" style="left:${((a - G.from) / span * 100).toFixed(2)}%;width:${((b - a) / span * 100).toFixed(2)}%"></span></span>`).join('\n')}
              <span class="text-[12px] font-semibold text-ink-500 text-right">${esc(G.x)}</span>
              <span class="flex justify-between text-[10.5px] font-semibold text-ink-400 nums" aria-hidden="true">${Array.from({ length: span + 1 }, (_, k) => `<span>${G.from + k}</span>`).join('')}</span>
            </div>
          </figure>`;

const section10 = () => `  <!-- ================= 10 · HOW TO IMPROVE YOUR WRITING LEVEL =================
       The text beside the live page's genre chart (a picture there), drawn from its own
       ranges and labels; the call to check closes it as a band. -->
  <section id="improve-writing-level" data-component="text-chart" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
${head(M.h2)}
      <div class="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
        <div class="rv min-w-0 grid gap-4 max-w-[64ch]">
${M.body.map(p => `          <p class="${BODY}">${esc(p)}</p>`).join('\n')}
          <p class="${BODY}">${esc(M.after)}</p>
        </div>
        <div class="rv min-w-0">
${genreChart()}
        </div>
      </div>
      <div data-surface="dark" class="rv mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-3xl sm:rounded-4xl bg-ink-950 text-white px-6 py-7 sm:px-9 sm:py-8">
        <p class="text-[clamp(1.25rem,2.2vw,1.7rem)] font-extrabold tracking-tight leading-snug">${esc(M.ctaLead[0])} <span class="text-white/60 font-bold">${esc(M.ctaLead[1])}</span></p>
        <a href="${TOP}" class="btn-press shrink-0 inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[14px] font-semibold pl-5 pr-2 py-2">${esc(M.cta)}<span class="icon-orb w-8 h-8 rounded-full bg-ink-900/10 flex items-center justify-center">${arrow}</span></a>
      </div>
    </div>
  </section>`;

/* ═══════════════ 11 · THE TWO SUGGESTIONS ═══════════════ */
const section11 = () => `  <!-- ================= 11 · THE TWO SUGGESTIONS =================
       Two illustration cards, side by side. -->
  <section id="two-suggestions" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
${head(C.tips.h)}
      <div class="grid md:grid-cols-2 gap-4">
${C.tips.items.map(([h, b], i) => spotCard(['icon-succinct', 'icon-terms'][i], h, b)).join('\n')}
      </div>
    </div>
  </section>`;

module.exports = { C };
if (require.main !== module) return;

const sections = [section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11].map(f => f());
const html = page.render({ title: esc(C.title), meta: C.meta, canonical: C.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/<img\b/g) + ' images');
