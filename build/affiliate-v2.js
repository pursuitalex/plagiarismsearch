/* Generate site/affiliate-program-at-plagiarismsearch-v2.html — the Affiliate Program,
   illustrated. v1 (build/affiliate.js) stays beside it; the switcher (build/version-
   switch.js) puts the two one click apart until Olex picks one.

   Same words as v1 — the live page's, verbatim, from affiliate.js COPY — and the same
   order of ideas. What changes is the manner, the one the Mission and Contact pages set
   (Olex, 2026-09-30): real photographs with HTML chips laid over them, and duotone spot
   icons on white plates. The photographs follow the "Revenue Infrastructure" block of
   bithide.vercel.app — bright daylight interiors, plants and pale wood, people busy
   with a device and not looking at the camera — graded a touch warmer, with one garment
   in our teal or coral (IMAGES.md types A/B and D, generated with Nano Banana 2 at 2K).

   The chips carry the live page's own facts ("30% commission", "90 days"), never an
   invented number (IMAGES.md, real text on panels). On a phone they leave the photo and
   sit under it, so no face is covered and no fact is lost.

   The programs, the FAQ and the closing band are v1's sections, unchanged.

   Run:  node build/affiliate-v2.js  →  node build/shell.js  →  node build/check-affiliate.js affiliate-program-at-plagiarismsearch-v2.html */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const v1 = require('./affiliate');
const { COPY } = v1;

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'affiliate-program-at-plagiarismsearch-v2.html';
const IMG = '/assets/img/affiliate/';
const JOIN = 'https://app.plagiarismsearch.com/affiliate';

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's, as in affiliate.js.
   ───────────────────────────────────────────────────────────────────────────── */
const esc = s => s.replace(/&(?!amp;)/g, '&amp;');
const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${label}</span>
        </div>`;
const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');
const inline = (label, href) => `<a href="${href}"${ext(href)} class="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 transition-colors duration-300">${label}</a>`;
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
  percent:  '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  cookie:   '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>',
  banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
};

/* a chip laid over a photograph (the Mission hero's): on a phone it drops into the flow
   under the photo, from sm up it floats at the given position */
const chip = (pos, tone, icon, big, small) => `        <span class="${pos} flex items-center gap-3 rounded-2xl bg-white shadow-diffuse-lg pl-2.5 pr-4 lg:pr-5 py-2.5">
          <span class="w-10 h-10 rounded-full ${tone} flex items-center justify-center shrink-0">${ico(I[icon], '#fff')}</span>
          <span class="flex flex-col">
            <span class="text-[15px] sm:text-[16px] font-extrabold tracking-tight leading-tight nums">${big}</span>
            <span class="text-[12px] sm:text-[12.5px] text-ink-500 leading-snug">${small}</span>
          </span>
        </span>`;

/* the Contact page's illustration card: grey card, white plate at content width, the
   spot icon modest inside it */
const spotCard = (icon, head, body) => `        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-50 p-4 sm:p-5 lg:p-6">
          <div class="rounded-xl sm:rounded-[14px] lg:rounded-2xl bg-white mb-4 lg:mb-5 py-4 sm:py-5 lg:py-6 flex items-center justify-center">
            <img src="${IMG}${icon}.webp" alt="" width="288" height="288" loading="lazy" decoding="async" class="w-[64px] h-[64px]">
          </div>
          <h3 class="text-[15px] sm:text-[16px] font-bold tracking-tight mb-2">${head}</h3>
          <p class="text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600">${body}</p>
        </div>`;

/* ═══════════════ 01 · HERO ═══════════════ */
const F = COPY.hero.facts;   /* [lead, rest, icon] × 4, the live hero's */
const section1 = () => `  <!-- ================= 01 · HERO / AFFILIATE PROGRAM =================
       The photograph is the hero: a creator at work, the two money facts as chips over
       the quiet parts of the frame (the window top right, the desk bottom left). The
       other two facts run as a quiet line under the actions. -->
  <section id="affiliate-program" data-component="hero-photo" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.hero.eyebrow)}
          <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.02] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Your Audience')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[58ch] mb-7 lg:mb-8">${COPY.hero.p}</p>
          <div class="flex flex-wrap items-center gap-3 sm:gap-4 mb-7 lg:mb-8">
            ${btnDark(COPY.hero.primary, JOIN)}
            <a href="#how-it-works" class="text-[13.5px] sm:text-[14.5px] font-semibold text-ink-600 hover:text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-300">${COPY.hero.secondary}</a>
          </div>
          <p class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-1.5 text-[13px] sm:text-[13.5px] text-ink-500">
            <span>${F[1][0]} ${F[1][1]}</span>
            <span class="hidden sm:block w-1 h-1 rounded-full bg-ink-300" aria-hidden="true"></span>
            <span>${F[2][0]} ${F[2][1]}</span>
          </p>
        </div>

        <div class="rv relative min-w-0">
          <img src="${IMG}hero.webp" alt="" width="1000" height="1241" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse" fetchpriority="high">
          <div class="mt-3 flex flex-col gap-2.5 sm:mt-0">
${chip('sm:absolute sm:-right-4 lg:-right-6 sm:top-10', 'bg-teal-500', 'cookie', F[3][0], F[3][1])}
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:bottom-14', 'bg-orange-500', 'percent', F[0][0], F[0][1])}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE THREE TOOLS ═══════════════ */
const section2 = () => `  <!-- ================= 02 · AFFILIATE TOOLS =================
       The Contact page's illustration cards: grey card, white plate, spot icon. -->
  <section id="affiliate-tools" data-component="spot-cards" aria-label="${COPY.tools.map(t => t[0]).join(', ')}" class="relative py-14 sm:py-20 lg:py-24 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid md:grid-cols-3 gap-4 max-w-[1080px] mx-auto">
${spotCard('icon-dashboard', COPY.tools[0][0], COPY.tools[0][1])}
${spotCard('icon-statistics', COPY.tools[1][0], COPY.tools[1][1])}
${spotCard('icon-conversion', COPY.tools[2][0], COPY.tools[2][1])}
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · HOW IT WORKS ═══════════════ */
const H = COPY.how;
const section3 = () => `  <!-- ================= 03 · HOW IT WORKS =================
       Photo left, steps right. The creator at his desk is step 2 in the act; the chip
       over the shelves is where it leads, step 3. "Learn more" in the hero lands here. -->
  <section id="how-it-works" data-component="photo-steps" class="relative py-16 sm:py-24 lg:py-32 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <div class="rv relative min-w-0 order-2 lg:order-1">
          <img src="${IMG}how.webp" alt="" width="1200" height="805" loading="lazy" decoding="async" class="w-full rounded-3xl sm:rounded-[28px] lg:rounded-4xl shadow-diffuse">
          <div class="mt-3 sm:mt-0">
${chip('sm:absolute sm:-left-4 lg:-left-6 sm:top-8', 'bg-orange-500', 'banknote', H.steps[2][0], H.steps[2][1])}
          </div>
        </div>

        <div class="min-w-0 order-1 lg:order-2">
          <div class="rv mb-8 lg:mb-10">
            <h2 class="${H2}">${H.h2}</h2>
            <p class="${INTRO} max-w-[52ch]">${H.intro}</p>
          </div>
          <ol class="grid gap-3 sm:gap-4" role="list">
${H.steps.map(([step, head, body], i) => `            <li class="rv flex gap-4 sm:gap-5 rounded-2xl sm:rounded-3xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6">
              <span class="shrink-0 w-10 h-10 rounded-full ${['bg-teal-50 text-teal-700', 'bg-orange-50 text-orange-700', 'bg-mint-50 text-mint-700'][i]} flex items-center justify-center text-[14px] font-extrabold nums" aria-hidden="true">${i + 1}</span>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-500 mb-1">${step}</p>
                <h3 class="text-[16px] sm:text-[17px] lg:text-[18px] font-bold tracking-tight mb-1">${head}</h3>
                <p class="${BODY} text-ink-600">${body}</p>
              </div>
            </li>`).join('\n')}
          </ol>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · WHY JOIN US ═══════════════ */
const W = COPY.why;
const WHY_ICONS = ['icon-interface', 'icon-confidentiality', 'icon-algorithms', 'icon-pricing', 'icon-customers'];
const section5 = () => `  <!-- ================= 05 · WHY JOIN US =================
       Five reasons as the Contact page's illustration cards; the heading block takes
       the first cell, so the grid is a clean three by two. The live links stay. -->
  <section id="why-join-us" data-component="spot-cards" class="relative py-16 sm:py-24 lg:py-32 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="rv sm:col-span-2 lg:col-span-1 flex flex-col justify-center p-1 sm:p-2 lg:pr-6">
          <h2 class="${H2}">${W.h2}</h2>
          <p class="${INTRO}">${W.intro}</p>
        </div>
${W.items.map(([head, body, , link], i) => {
  const text = link ? body.replace(link[0], inline(link[0], link[1])) : body;
  if (link && text === body) throw new Error('why: link phrase not found: ' + link[0]);
  return spotCard(WHY_ICONS[i], head, text);
}).join('\n')}
      </div>
    </div>
  </section>`;

module.exports = { section3, section5 };   /* v3 (build/affiliate-v3.js) takes How it works and Why join us */
if (require.main !== module) return;

/* This file writes no page any more. The page it wrote was the first version; the final
   one is build/affiliate-v3.js (developer's review of 2026-10-07), which takes the page's own name and
   is built from the parts exported above (How it works and Why join us). */
console.log('  build/affiliate-v2.js writes no page since 2026-10-07 — run node build/affiliate-v3.js');
