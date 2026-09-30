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

module.exports = { PLANS, LINES, feats, template, island };
