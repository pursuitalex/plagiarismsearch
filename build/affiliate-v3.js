/* Generate site/affiliate-program-at-plagiarismsearch-v3.html — the Affiliate Program with
   the old site's opening, redrawn. v1 and v2 stay beside it; the switcher shows 1 · 2 · 3.

   Olex, 2026-10-06: on the old page (plagiarismsearch.com/affiliate-program-at-
   plagiarismsearch) he likes the first screen and how it runs into the second — the
   centred title among people on dashed paths, then a browser window with the affiliate
   cabinet of a signed-in user, the four facts pinned over it, and the three tools right
   under it. This version brings that composition into the new system.

   WHAT IS WHERE
   01  the hero: the live eyebrow, H1, lead and two actions, centred; four portraits with
       the old page's three tags ("High Conversion", "Scale Your Revenue", "Lifetime
       Earnings") on dashed paths (from 1280px up — decoration, nothing is lost without
       it); then the cabinet in a browser window, with the four live facts as chips.
   02  the three tools: v1's section (the library's Feature cards, one sheet) — icon, name,
       line. The window ends above it; nothing overlaps.
   03+ v2's sections, as Olex chose: How it works and Why join us (photographs), and v1's
       programs, FAQ and closing band.

   THE CABINET is not a screenshot. It is Olex's Figma frame "browser" (file
   sgIVt3vKOgTIT2LMpBIaNg, node 3299:43805) redrawn in HTML and SVG: the same labels, the
   same four figures (4,860 · 612 · 160 · $4,720) and the same thirteen days of the chart,
   bar for bar, in the site's type and colours (build/assets/css/30-affiliate-panel.css).
   Those figures are the mock-up's sample data, as they were on the old page.

   THE WORDS are the live page's, verbatim, from affiliate.js COPY. New to the prototype's
   copy, all from the old page itself: the three tags (they were inside its background
   picture) and the cabinet's labels.

   THE PORTRAITS are the old page's own four (Olex, 2026-10-06 — a first draft had
   generated ones): the frame's "image 78 / 76 / 79 / 77" in top-BG (node 3298:41124),
   exported at 4× and cropped to the photo disc, each in its original corner.

   The hero is page-specific: Section Library V1 is frozen, and a one-off composition is
   not a reason to extend it.

   Run:  node build/affiliate-v3.js  →  node build/shell.js  →  node build/check-affiliate.js affiliate-program-at-plagiarismsearch-v3.html */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const { dotField } = require('./dots');
const v1 = require('./affiliate');
const v2 = require('./affiliate-v2');
const { COPY } = v1;

const SITE = path.join(__dirname, '..', 'site');
const OUT = 'affiliate-program-at-plagiarismsearch-v3.html';
const IMG = '/assets/img/affiliate/';
const JOIN = 'https://app.plagiarismsearch.com/affiliate';

const esc = s => s.replace(/&(?!amp;)/g, '&amp;');
const svg = (paths, size, sw = 1.75, cls = '') => `<svg${cls ? ` class="${cls}"` : ''}${size ? ` width="${size}" height="${size}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const I = {
  arrow:    '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  percent:  '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  award:    '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  cookie:   '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>',
  users:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  userPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  coins:    '<path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/>',
  dollar:   '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  search:   '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  sparkle:  '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  mail:     '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  alert:    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  bell:     '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  user:     '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  lock:     '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  share:    '<path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>',
  plus:     '<path d="M5 12h14"/><path d="M12 5v14"/>',
};

/* ─────────────────────────────────────────────────────────────────────────────
   The cabinet — the Figma frame's content, as data.
   ───────────────────────────────────────────────────────────────────────────── */
const PANEL = {
  url: 'plagiarismsearch.com',
  side: { cta: 'Check document', links: [['file', 'Reports'], ['sparkle', 'AI Reports'], ['database', 'Storage']], foot: [['mail', 'Contact us'], ['alert', 'Report a mistake']] },
  title: 'Affiliate Program', action: 'Referral rewards',
  tabs: ['Dashboard', 'Statistics', 'Conversions', 'Visits', 'Referred users', 'Payouts'], on: 'Statistics',
  stats: [['users', '4,860', 'Visitors'], ['userPlus', '612', 'Registrations'], ['coins', '160', 'Conversions'], ['dollar', '$4,720', 'Earnings']],
  chart: {
    title: 'Affiliate Statistics',
    days: ['Jan 02', 'Jan 03', 'Jan 04', 'Jan 05', 'Jan 06', 'Jan 07', 'Jan 08', 'Jan 09', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14'],
    left: ['500$', '400$', '300$', '200$', '100$', '0$'], right: ['500', '400', '300', '200', '100', '0'],
    /* heights in the frame's own pixels over a 210px plot: the bars and two of the lines are
       the frame's exact values; the visitors line was drawn there as one path and is read
       off its render */
    earnings:      [118.1, 144.3, 131.2, 157.4, 183.6, 196.8, 183.6, 209.9, 196.8, 157.4, 144.3, 131.2, 144.3],
    visitors:      [124, 137, 128, 150, 159, 183, 176, 187, 178, 164, 150, 140, 132],
    registrations: [15.4, 18.0, 16.3, 19.7, 22.2, 24.8, 23.1, 25.7, 23.9, 20.5, 18.8, 17.1, 12.8],
    conversions:   [3.9, 4.7, 4.3, 5.2, 6.0, 6.5, 6.0, 6.9, 6.5, 5.2, 4.7, 4.3, 4.7],
    legend: [['Visitors', 'visitors'], ['Registrations', 'registrations'], ['Conversions', 'conversions'], ['Earnings', 'earnings']],
  },
};

const chart = () => {
  const c = PANEL.chart, X0 = 34, X1 = 486, Y0 = 16, YB = 226, n = c.days.length, slot = (X1 - X0) / n, bw = 15;
  const cx = i => +(X0 + slot * (i + .5)).toFixed(1);
  const line = (vals, color) => `<polyline points="${vals.map((v, i) => cx(i) + ',' + (YB - v).toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="1" stroke-linejoin="round"/>` +
    vals.map((v, i) => `<circle cx="${cx(i)}" cy="${(YB - v).toFixed(1)}" r="1.7" fill="#fff" stroke="${color}" stroke-width="1"/>`).join('');
  return `<svg viewBox="0 0 520 246" role="img" aria-label="${c.title}: ${c.days[0]} – ${c.days[n - 1]}">
${c.left.map((t, k) => { const y = Y0 + k * 42; return `                    <line x1="${X0}" x2="${X1}" y1="${y}" y2="${y}" stroke="#EEF0F4" stroke-width="1"${k < 5 ? ' stroke-dasharray="2 3"' : ''}/><text x="${X0 - 7}" y="${y + 2.5}" text-anchor="end">${t}</text><text x="${X1 + 7}" y="${y + 2.5}">${c.right[k]}</text>`; }).join('\n')}
                    ${c.earnings.map((v, i) => `<rect x="${(cx(i) - bw / 2).toFixed(1)}" y="${(YB - v).toFixed(1)}" width="${bw}" height="${v}" rx="1.5" fill="#0CA9C3"/>`).join('')}
                    ${line(c.visitors, '#8B93A7')}
                    ${line(c.registrations, '#2AA46C')}
                    ${line(c.conversions, '#F36F5A')}
                    ${c.days.map((d, i) => `<text x="${cx(i)}" y="${YB + 13}" text-anchor="middle">${d}</text>`).join('')}
                  </svg>`;
};

const panel = () => `          <div class="afd" role="img" aria-label="The affiliate panel of a signed-in user: ${PANEL.stats.map(s => s[1] + ' ' + s[2].toLowerCase()).join(', ')}, and a chart of the last two weeks">
            <div class="afd-in" aria-hidden="true">
              <div class="afd-bar">
                <span class="afd-dots"><i></i><i></i><i></i></span>
                <span class="afd-url">${svg(I.lock, 0, 2)}${PANEL.url}</span>
                <span class="afd-bar-end">${svg(I.share, 0)}${svg(I.plus, 0)}</span>
              </div>
              <div class="afd-top">
                <img src="/assets/svg/logo.svg" alt="" class="afd-logo">
                <span class="afd-top-end">${svg(I.bell, 0)}${svg(I.globe, 0)}<span class="afd-user">${svg(I.user, 0)}</span></span>
              </div>
              <div class="afd-body">
                <div class="afd-side">
                  <span class="afd-side-cta">${svg(I.search, 0, 2)}${PANEL.side.cta}</span>
${PANEL.side.links.map(([i, t]) => `                  <span class="afd-side-link">${svg(I[i], 0)}${t}</span>`).join('\n')}
                  <span class="afd-side-gap"></span>
                  <span class="afd-side-rule"></span>
${PANEL.side.foot.map(([i, t]) => `                  <span class="afd-side-link">${svg(I[i], 0)}${t}</span>`).join('\n')}
                </div>
                <div class="afd-main">
                  <div class="afd-head"><span class="afd-title">${PANEL.title}</span><span class="afd-ghost">${PANEL.action}</span></div>
                  <div class="afd-tabs">${PANEL.tabs.map(t => `<span${t === PANEL.on ? ' class="is-on"' : ''}>${t}</span>`).join('')}</div>
                  <div class="afd-stats">
${PANEL.stats.map(([i, v, l]) => `                    <div class="afd-stat${l === 'Earnings' ? ' is-money' : ''}"><b>${svg(I[i], 0, 1.75, 'i')}${v}</b><small>${l}</small></div>`).join('\n')}
                  </div>
                  <div class="afd-chart">
                    <div class="afd-chart-title">${PANEL.chart.title}</div>
                  ${chart()}
                    <div class="afd-legend">${PANEL.chart.legend.map(([t, k]) => `<span><i class="is-${k}"></i>${t}</span>`).join('')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

/* a fact pinned over the window: v2's chip, the live page's own two lines */
const F = COPY.hero.facts;
const chip = (pos, tone, icon, big, small) => `            <span class="${pos} flex items-center gap-3 rounded-2xl bg-white shadow-diffuse-lg pl-2.5 pr-4 lg:pr-3 xl:pr-5 py-2.5">
              <span class="w-10 h-10 rounded-full ${tone} text-white flex items-center justify-center shrink-0">${svg(I[icon], 18, 2.2)}</span>
              <span class="flex flex-col text-left">
                <span class="text-[15px] sm:text-[16px] lg:text-[15px] xl:text-[16px] font-extrabold tracking-tight leading-tight nums">${big}</span>
                <span class="text-[12px] sm:text-[12.5px] text-ink-500 leading-snug">${small}</span>
              </span>
            </span>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const mark = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
  if (!text.includes(phrase)) throw new Error('penMark: ' + phrase);
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${mark}</span>`);
};

/* the people of the old hero: stage coordinates, 1440 × 720, centred on the section */
const PEOPLE = {
  /* where each stands is the stylesheet's (.afp-f1 … f4, .afp-t1 … t3, .afp-p1, p2): the page
     carries no inline style */
  faces: ['face-1', 'face-3', 'face-4', 'face-2'],
  tags: [['High Conversion', ''], ['Scale Your Revenue', 'is-coral'], ['Lifetime Earnings', 'is-coral']],
  plates: 2,
  /* dashed paths with rounded elbows, and two that leave the stage */
  paths: [
    'M200 220 V 396 Q 200 430 176 430 Q 152 430 152 464 V 506',
    'M1242 342 V 400 Q 1242 434 1266 434 Q 1290 434 1290 468 V 510',
    'M158 178 H 96 Q 66 178 66 148 V 60',
    'M1284 300 H 1340 Q 1370 300 1370 270 V 90',
    'M110 548 H 30',
    'M1332 552 H 1420',
  ],
  nodes: [[66, 60], [1370, 90], [30, 548], [1420, 552]],
};
const people = () => `    <div class="afp hidden xl:block" aria-hidden="true">
${Array.from({ length: PEOPLE.plates }, (_, i) => `      <span class="afp-plate afp-p${i + 1}"></span>`).join('\n')}
      <svg viewBox="0 0 1440 720" fill="none">
        ${PEOPLE.paths.map(d => `<path d="${d}" stroke="#B9DCE2" stroke-width="1.5" stroke-dasharray="4 5" stroke-linecap="round"/>`).join('')}
        ${PEOPLE.nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#9CCFD8"/>`).join('')}
      </svg>
${PEOPLE.faces.map((f, i) => `      <img class="afp-face afp-f${i + 1}" src="${IMG}${f}.webp" alt="" width="220" height="220">`).join('\n')}
${PEOPLE.tags.map(([t, c], i) => `      <span class="afp-tag afp-t${i + 1}${c ? ' ' + c : ''}">${t}</span>`).join('\n')}
    </div>`;

/* ═══════════════ 01 · HERO — THE TITLE, THE PEOPLE, THE CABINET ═══════════════ */
const section1 = () => `  <!-- ================= 01 · HERO / AFFILIATE PROGRAM =================
       The old page's opening in the new system: the title centred among people on dashed
       paths, then the affiliate cabinet in a browser window with the four facts pinned
       over it. Below 1280 the facts stand in a grid under the window. -->
  <section id="affiliate-program" data-component="hero-showcase" class="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dotField()}
    <div class="orb absolute orb-hero-teal"></div>
    <div class="orb absolute orb-hero-coral"></div>
${people()}

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv text-center max-w-[860px] mx-auto">
        <div class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-700">${COPY.hero.eyebrow}</span>
        </div>
        <h1 class="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold tracking-tightest leading-[1.04] mb-4 sm:mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'Academic Tool')}</h1>
        <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[60ch] mx-auto mb-7 lg:mb-8">${COPY.hero.p}</p>
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a href="${JOIN}" rel="noopener" class="btn-press group inline-flex items-center gap-2.5 h-12 sm:h-14 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[14px] sm:text-[15px] font-semibold pl-5 sm:pl-7 pr-2.5">
            ${COPY.hero.primary}
            <span class="icon-orb flex w-9 h-9 rounded-full bg-white/10 items-center justify-center">${svg(I.arrow, 14)}</span>
          </a>
          <a href="#how-it-works" class="btn-press inline-flex items-center h-12 sm:h-14 rounded-full bg-white ring-1 ring-black/10 hover:ring-black/20 transition-shadow duration-300 text-ink-900 text-[14px] sm:text-[15px] font-semibold px-5 sm:px-6 lg:px-7">${COPY.hero.secondary}</a>
        </div>
      </div>

      <div class="rv relative mt-12 sm:mt-14 lg:mt-16 max-w-[1000px] mx-auto">
${panel()}
        <div class="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 xl:mt-0 xl:block">
${chip('xl:absolute xl:-right-24 xl:top-[142px]', 'bg-orange-500', 'percent', F[0][0], F[0][1])}
${chip('xl:absolute xl:-left-14 xl:top-[300px]', 'bg-ink-900', 'award', F[1][0], F[1][1])}
${chip('xl:absolute xl:-right-16 xl:top-[380px]', 'bg-teal-500', 'activity', F[2][0], F[2][1])}
${chip('xl:absolute xl:-left-24 xl:top-[470px]', 'bg-orange-500', 'cookie', F[3][0], F[3][1])}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE THREE TOOLS ═══════════════ */
/* v1's section as it is: the library's Feature cards, one sheet with rules between the
   three — an icon, a name and a line each, and nothing else. (The first draft had cards
   riding up over the window with small mock tables in them; Olex, 2026-10-06: no
   pretend interface, no overlap — a plain section under the first screen, with ordinary
   spacing before and after.) */
const section2 = () => v1.section2();

module.exports = { PANEL, PEOPLE };
if (require.main !== module) return;

const sections = [section1(), section2(), v2.section3(), v1.section4(), v2.section5(), v1.section6(), v1.section7()];
const html = page.render({ title: esc(COPY.title), meta: COPY.meta, canonical: COPY.canonical, sections });
fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' + count(/<h2\b/g) + ' h2, ' +
            count(/<h3\b/g) + ' h3, ' + count(/<img\b/g) + ' images, ' + count(/class="faq-item/g) + ' faq items');
