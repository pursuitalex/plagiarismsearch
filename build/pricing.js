/* The pricing periods, rendered — the single place a page gets its plan figures from.

   The rule (Olex, 2026-09-25): the initial prices may be in the server-rendered HTML, but
   only from the single pricing data source, never typed into a page by hand. So a page
   renders its cards with the initial period's values from build/pricing-data.js (the
   stand-in for the backend), and carries the same data once, as a JSON island inside the
   section, for site.js (build/assets/js/60-pricing.js) to switch periods with. Content is
   in the HTML before any script runs; the script only updates it.

   A feature line is markup, so it lives in the page as a <template> (one per section, or
   one per card where a card differs — the homepage's dark card), and both this file and
   the script fill the same template. First paint and a period switch produce the same
   DOM by construction.

     const pricing = require('./pricing');
     <section data-pricing="onetime" [data-pricing-animate] …>
       ${pricing.template(pricing.LINES.tick)}
       …<ul class="js-feats">${pricing.feats(PLANS.onetime.light.feats, pricing.LINES.tick)}</ul>…
       [data-period-note] (text of the period's note) · [data-period-only="onetime"] (shown for that period only)
       ${pricing.island()}
     </section>
*/
const { PLANS } = require('./pricing-data');

const MARK = '{feat}';
const LINES = {
  /* the tick line of the homepage and the Turnitin preview */
  tick: '<li class="flex gap-3"><svg class="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' + MARK + '</li>',
  /* the homepage's dark (recommended) card */
  tickOnDark: '<li class="flex gap-3"><svg class="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ED7E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' + MARK + '</li>',
  /* the pricing page's widget */
  check: '<li class="flex items-start gap-2.5"><svg class="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' + MARK + '</li>',
};

const feats = (list, line) => list.map(f => line.split(MARK).join(f)).join('');
const template = line => `<template data-pricing-feat>${line}</template>`;
const island = (plans = PLANS) => `<script type="application/json" data-pricing-data>${JSON.stringify(plans).replace(/</g, '\\u003c')}</script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   THE PREVIEW WIDGET — the period switch and the three plan cards of the Section
   Library's Pricing preview (build/sections/pricing-preview.js calls these two).

   Both blocks are business logic, not editor content: plan names, prices, quotas, periods
   and the Recommended state come from the data above and nowhere else (DEC-0042). So they
   are rendered here, each marked data-slot (sealed — copied as it is), and the plans block
   carries the data island with it, so a copy of the cards can never be parted from the
   figures the script switches them to. Their markup keeps its utilities, as the
   quick-check form's does.

     pricing.periods({ align: 'center' })       the switch, centred (the homepage) or at the
                                                column's edge ('start', Turnitin)
     pricing.plans({ style: 'spotlight', href }) the homepage's cards: the recommended plan
                                                dark and raised, the others white
     pricing.plans({ style: 'even', href })     three equal white cards with dark buttons
   href: where a card's button leads. `initial`: the period shown first ('onetime'). */
const { LABEL, TAGLINE } = require('./pricing-data');
const TABS = [['onetime', 'One-time'], ['monthly', 'Monthly'], ['quarterly', '3-Months'], ['yearly', 'Yearly']];
const SPARK = '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>';

function periods({ align = 'center', initial = 'onetime' } = {}) {
  if (!['center', 'start'].includes(align)) throw new Error('pricing: align must be center or start');
  return `<div data-slot="pricing-periods" class="rv flex ${align === 'center' ? 'justify-center mb-8 sm:mb-10 lg:mb-12' : 'mb-7 sm:mb-8 lg:mb-10'}">
  <div class="inline-flex items-center rounded-full bg-ink-100 p-1 max-w-full overflow-x-auto" role="group" aria-label="Billing period">
${TABS.map(([k, label]) => `    <button type="button" data-period="${k}" aria-pressed="${k === initial}" class="period-btn whitespace-nowrap rounded-full px-3.5 sm:px-5 lg:px-6 py-2.5 text-[13px] sm:text-[13.5px] font-semibold text-ink-500${k === initial ? ' active' : ''}">${label}</button>`).join('\n')}
  </div>
</div>`;
}

function plans({ style, href, initial = 'onetime' } = {}) {
  if (!['spotlight', 'even'].includes(style)) throw new Error('pricing: style must be spotlight or even');
  if (!href) throw new Error('pricing: href (where a card\'s button leads) is required');
  const P = PLANS[initial];
  const TIERS = ['light', 'standard', 'premium'];
  if (style === 'even') return `<div data-slot="pricing-plans" class="rv grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch mb-8 sm:mb-10">
${TIERS.map(tier => `  <div data-tier="${tier}" class="rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7 flex flex-col">
    <span class="text-[11px] font-bold tracking-[0.16em] uppercase text-orange-600 mb-1.5">${tier}</span>
    <div class="text-[13.5px] text-ink-500 mb-4 sm:mb-5">${TAGLINE[tier]}</div>
    <div class="flex items-end gap-1.5 mb-3">
      <span class="text-[29px] sm:text-[32px] lg:text-[38px] font-extrabold tracking-tightest leading-none nums js-price">${P[tier].price}</span>
      <span class="text-[12.5px] font-medium text-ink-400 pb-1.5 js-term">${P.term}</span>
    </div>
    <div class="self-start inline-flex items-center rounded-full bg-ink-50 text-ink-500 px-3 py-1 text-[11.5px] font-bold nums mb-5 sm:mb-6"><span class="js-rate">${P[tier].rate}</span>&nbsp;/ 1,000 words</div>
    <div class="h-px bg-ink-100 mb-5 sm:mb-6"></div>
    <ul class="space-y-3 text-[13.5px] font-medium text-ink-700 mb-6 sm:mb-7 js-feats">${feats(P[tier].feats, LINES.tick)}</ul>
    <a href="${href}" class="btn-press mt-auto block text-center rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[13.5px] sm:text-[14.5px] font-semibold py-3 transition-colors duration-300">Start ${LABEL[tier]}</a>
  </div>`).join('\n')}
  ${template(LINES.tick)}
  ${island()}
</div>`;
  return `<div data-slot="pricing-plans" class="rv grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-center max-w-[1180px] mx-auto mb-8 sm:mb-10 lg:mb-12">
${TIERS.map(tier => {
    const dark = tier === 'standard';
    const line = dark ? LINES.tickOnDark : LINES.tick;
    return `  <div data-tier="${tier}"${dark ? ' data-surface="dark"' : ''} class="${dark
      ? 'relative rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-ink-950 text-white ring-1 ring-white/10 shadow-diffuse-lg p-5 sm:p-6 lg:p-8 lg:-my-6 overflow-hidden'
      : 'rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-white ring-1 ring-black/5 shadow-diffuse p-5 sm:p-6 lg:p-7'}">${dark ? `
    <div class="orb w-[300px] h-[300px] bg-orange-500/15 -right-20 -top-24"></div>` : ''}
    <div class="relative">
      <div class="flex items-center justify-between gap-3 mb-1.5">
        <span class="text-[11px] font-bold tracking-[0.16em] uppercase ${dark ? 'text-teal-300' : 'text-orange-600'}">${tier}</span>${dark ? `
        <span class="flex items-center gap-1.5 text-[9.5px] font-bold tracking-widest bg-orange-500 rounded-full px-2.5 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SPARK}</svg>
          RECOMMENDED
        </span>` : ''}
      </div>
      <div class="text-[13.5px] ${dark ? 'text-white/50' : 'text-ink-500'} mb-4 sm:mb-5 lg:mb-6">${TAGLINE[tier]}</div>
      <div class="flex items-end gap-1.5 mb-3">
        <span class="text-[29px] sm:text-[34px] lg:text-[40px] font-extrabold tracking-tightest leading-none nums js-price">${P[tier].price}</span>
        <span class="text-[12.5px] font-medium ${dark ? 'text-white/40' : 'text-ink-400'} pb-1.5 js-term">${P.term}</span>
      </div>
      <div class="inline-flex items-center rounded-full ${dark ? 'bg-white/10 text-white/70' : 'bg-ink-50 text-ink-500'} px-3 py-1 text-[11.5px] font-bold nums mb-5 sm:mb-6 lg:mb-7"><span class="js-rate">${P[tier].rate}</span>&nbsp;/ 1,000 words</div>
      <div class="h-px ${dark ? 'bg-white/10' : 'bg-ink-100'} mb-5 sm:mb-6 lg:mb-7"></div>
      ${template(line)}
      <ul class="space-y-3.5 text-[13.5px] font-medium ${dark ? 'text-white/80' : 'text-ink-700'} min-h-[9rem] mb-6 sm:mb-7 lg:mb-8 js-feats">${feats(P[tier].feats, line)}</ul>
      <a href="${href}" class="btn-press block text-center rounded-full ${dark
        ? 'bg-white text-ink-900 hover:bg-ink-50'
        : 'ring-1 ring-ink-200 text-ink-900 hover:bg-ink-50'} text-[13.5px] sm:text-[14.5px] font-semibold py-3 sm:py-3.5 transition-colors duration-300">Start ${LABEL[tier]}</a>
    </div>
  </div>`;
  }).join('\n')}
  ${island()}
</div>`;
}

module.exports = { PLANS, LINES, feats, template, island, periods, plans };
