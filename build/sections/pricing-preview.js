/* Pricing preview — library component. One template for the section that previews the
   plans on a page that is not the Pricing page: a head, the period switch, three plan
   cards, a way on to the full pricing.

   CSS  build/sections/pricing-preview.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/60-pricing.js ([data-pricing]: the period switch), 20-motion.js
        (.rv) — nothing of its own
   Contract + validator  build/sections/pricing-preview.contract.js, pricing-preview.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const pricingPreview = require('./sections/pricing-preview');
     pricingPreview.section({
       id: 'pricing',                          // optional anchor
       layout: 'split',                        // 'center' | 'split'
       space: 'md',                            // the page's rhythm: 'md' | 'lg'
       accent: 'teal',                         // optional: the pill's dot (default orange)
       head: { eyebrow, title, intro, introMeasure },
       aside: { text, icon },                  // split: the note card beside the head
       recurring: 'Recurring payments',        // optional, center: the switch under the tabs
       plans: { href: 'prices.html' },         // where a plan's own button leads
       foot: { button: { label, href } },      // split: a light button under the cards
     })                                        // center: foot: { link: { label, href } }

   THE FIGURES ARE NOT THE PAGE'S. Plan names, prices, rates, quotas, periods and the
   Recommended state come from build/pricing-data.js through build/pricing.js — the period
   switch and the plan cards are rendered there as two sealed blocks, and the plans block
   carries the JSON island 60-pricing.js switches periods with (DEC-0042: nothing of it
   may be frozen into page copy). This template takes no figure: only the text around the
   cards, and where their buttons lead.

   Layouts
     center   the homepage: the head and the switch centred, the recommended plan dark and
              raised; under the cards one line — the period's note (from the data) and a
              quiet link. With `recurring`, the Pricing page's "Recurring payments" switch
              sits under the tabs, inside their sealed block: one for the three cards,
              off and disabled on a period that cannot recur (60-pricing.js does the rest)
     split    Turnitin: the head beside a note card, the switch at the column's edge, three
              equal cards; under them a light button

   Every external href gets rel="noopener". The text is written as given: escape it first
   if it is not already HTML. */
const sh = require('./section-head');
const action = require('./action');
const tile = require('./icon-tile');
const pricing = require('../pricing');

/* the variant values are the contract's */
const C = require('./pricing-preview.contract');
const V = C.variants;

const need = (cond, msg) => { if (!cond) throw new Error('pricing-preview: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');
/* a price typed into the text around the cards is a frozen figure */
const noPrice = (text, what) => need(!/[$€£₴]\s?\d|\d\s?(?:USD|EUR|UAH)\b/.test(String(text || '').replace(/<[^>]*>/g, ' ')), `${what}: a price in the text — figures come from the pricing data only`);

const INITIAL = 'onetime';

function section(o) {
  need(o && o.head && o.head.title, 'head: { title } is required');
  need(V.section['data-layout'].values.includes(o.layout), 'layout must be one of ' + V.section['data-layout'].values.join(', '));
  need(V.section['data-space'].values.includes(o.space), 'space must be lg or md');
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  need(o.plans && o.plans.href, 'plans: { href } — where a plan\'s button leads');
  const center = o.layout === 'center';
  const { introMeasure, measure, ...h } = o.head;
  need(measure === undefined, 'the head takes no measure here (its width belongs to the layout)');
  need(introMeasure === undefined || V.intro['data-measure'].values.includes(String(introMeasure)), 'head.introMeasure must be one of ' + V.intro['data-measure'].values.join(', '));
  noPrice(h.title, 'head.title'); noPrice(h.intro, 'head.intro'); noPrice(h.eyebrow, 'head.eyebrow');
  const f = o.foot || {};
  const parts = [];

  if (center) {
    need(!o.aside, 'the note card beside the head belongs to layout: split');
    need(introMeasure === undefined, 'center: the intro takes the head\'s width');
    parts.push(sh.block(h));
  } else {
    let aside = '';
    if (o.aside) {
      need(o.aside.text && o.aside.icon, 'aside: { text, icon }');
      noPrice(o.aside.text, 'aside.text');
      aside = `
  <p class="pricing-aside rv">
    <span class="pricing-aside-icon">${tile.icon(o.aside.icon, 17)}</span>
    <span class="pricing-aside-text">${o.aside.text}</span>
  </p>`;
    }
    parts.push(`<div class="pricing-top">
  <div class="pricing-top-head rv">
${sh.render({ ...h, introMeasure }, '    ')}
  </div>${aside}
</div>`);
  }

  need(!o.recurring || center, 'recurring: the switch under the tabs belongs to layout: center');
  noPrice(o.recurring, 'recurring');
  parts.push(pricing.periods({ align: center ? 'center' : 'start', initial: INITIAL, recurring: o.recurring }));
  parts.push(pricing.plans({ style: center ? 'spotlight' : 'even', href: o.plans.href, initial: INITIAL }));

  if (center) {
    need(!f.button, 'center: the foot is { link: { label, href } } (the plans carry the buttons)');
    const link = f.link ? `
  <span class="pricing-foot-dot"></span>
  <a href="${f.link.href}"${rel(f.link.href)} class="pricing-link">${f.link.label}</a>` : '';
    need(!f.link || (f.link.label && f.link.href), 'foot.link: { label, href }');
    parts.push(`<div class="pricing-foot rv">
  <span class="pricing-note" data-period-note>${pricing.PLANS[INITIAL].note}</span>${link}
</div>`);
  } else if (f.button) {
    need(!f.link, 'split: the foot is { button: { label, href } }');
    parts.push(`<div class="pricing-actions rv">
${indent(action.button({ ...f.button, tone: 'light' }), '  ')}
</div>`);
  }

  return `<section${attr('id', o.id)} data-component="pricing-preview" class="pricing-preview" data-layout="${o.layout}" data-bg="tint" data-space="${o.space}"${attr('data-accent', o.accent)} data-pricing="${INITIAL}" data-pricing-animate>${center ? `
  <div class="orb pricing-glow"></div>` : ''}
  <div class="pricing-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section };
