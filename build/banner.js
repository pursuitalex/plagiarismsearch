/* The compact dark banner — the in-page secondary block.

   The site has two dark banners, and this is the smaller one: a block that sits BETWEEN
   sections, says one thing about a capability that lives on another page, and links
   there. The AI Detector page's API block, the University page's AI block and the
   Pricing page's high-volume block are all this. The larger one — the closing CTA band
   before the footer, with its own eyebrow, hero-scale heading and double bezel — is
   build/cta.js, and the two must not be confused: a banner between sections is a
   heading block (DESIGN.md § Support lines), not a smaller act. It shares the accent
   card's heading and support colour; only the composition differs.

   Measured on 2026-09-15: three pages carried three versions of this block, two of them
   identical and one — Pricing — with a bigger heading, a smaller support line and wider
   padding. Nobody chose that; it drifted because the shell lived in each builder. So it
   lives here now, and the checker holds every page to it.

     const banner = require('./banner');
     banner({
       id: 'ai-api',
       orb: 'rgba(44,195,219,.18)',            // the glow, top right
       eyebrow: ['teal-400', 'API'],           // dot colour, label
       h2: '…',
       lead: '…',  leadMax: '54ch',            // the support line under the heading
       after: '…',                             // html under the lead: pill, note, callout
       action: banner.btn('Label', 'x.html'),  // the one action
       aside: '…',                             // optional right-hand panel; without it the
       actionUnder: 'text',                    // action sits on the right instead. With an
     });                                       // aside, 'aside' puts the action under it

   Two layouts, chosen by whether there is an aside: with one, text left and the panel
   right (1.4fr / 1fr) and the action stays under the text; without one, the action
   itself takes the right-hand slot so the block still reads as two halves. */

/* the dark accent card's heading, exactly. The two dark blocks share one heading and one
   support colour; what tells them apart is the composition — a short band with the
   action beside the text here, a tall double-bezel card with tall buttons there. */
const H2 = 'text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold tracking-tightest leading-[1.1] mb-3';
/* the lead is text-white/60 — the dark accent card's support colour, so the two dark
   blocks read the same; the detail steps down to /50, which still clears 4.5:1 on ink-950 */
const LEAD = 'text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/60';
const SUPPORT = 'text-[13px] sm:text-[13.5px] leading-relaxed text-white/50';
const BOX = 'rv rounded-3xl sm:rounded-4xl bg-ink-950 overflow-hidden relative px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10';
const SECTION = 'relative py-10 sm:py-12 lg:py-14 bg-white overflow-hidden';

const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const ext = h => (/^https?:/.test(h) ? ' rel="noopener"' : '');

/* the action on a dark ground: the white button */
const btn = (label, href) => `<a href="${href}"${ext(href)} class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-ink-100 transition-colors duration-300 text-ink-900 text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-ink-900/10 items-center justify-center">${ARROW}</span>
          </a>`;

const eyebrow = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-3.5">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/80">${label}</span>
        </div>`;

const banner = ({ id, orb = 'rgba(44,195,219,.18)', eyebrow: eb, h2, lead, leadMax = '54ch', after = '', action = '', aside = '', actionUnder = 'text' }) => {
  if (!id || !h2 || !lead) throw new Error('banner: id, h2 and lead are required');
  const text = `          <div class="min-w-0${aside ? '' : ' flex-1'} text-white">
${eb ? eyebrow(eb[0], eb[1]) : ''}
            <h2 class="${H2}">${h2}</h2>
            <p class="${LEAD} max-w-[${leadMax}]">${lead}</p>${after ? '\n' + after : ''}${aside && action && actionUnder === 'text' ? `
            <div class="mt-6">${action}</div>` : ''}
          </div>`;
  /* the aside IS the right-hand cell — the caller hands over the whole panel. With
     actionUnder: 'aside' the action sits under that panel instead of under the text. */
  const right = aside
    ? (action && actionUnder === 'aside'
        ? `          <div class="min-w-0">
${aside}
            <div class="mt-5">${action}</div>
          </div>`
        : aside)
    : action ? `          <div class="shrink-0">${action}</div>` : '';
  const grid = aside
    ? 'relative grid lg:grid-cols-[1.4fr_1fr] gap-7 lg:gap-12 items-center'
    : 'relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12';
  return `  <section id="${id}" class="${SECTION}">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="${BOX}">
        <div class="orb absolute" style="width:520px;height:500px;right:-6%;top:-220px;background:${orb}"></div>
        <div class="${grid}">
${text}
${right}
        </div>
      </div>
    </div>
  </section>`;
};

module.exports = Object.assign(banner, { btn, H2, LEAD, SUPPORT, BOX, SECTION });
