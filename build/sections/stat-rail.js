/* Stat rail — library component. One template for the thin band of proof under a hero:
   a few figures or marks in a row, each with a short label.

   CSS  build/sections/stat-rail.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/20-motion.js (.rv), 24-odometer.js (.od-num: the figure rolls up
        on first view) — nothing of its own
   Contract + validator  build/sections/stat-rail.contract.js, stat-rail.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const statRail = require('./sections/stat-rail');
     statRail.section({
       id: 'proof',                            // optional anchor
       tone: 'soft',                           // optional: the homepage's lighter labels
       roll: true,                             // optional: the figures roll like odometers
       items: [
         { value: '500,000+', label: 'users' },
         { lead: 'Plagiarism checking in', value: '80+', label: 'languages' },
         { mark: { src: '/assets/svg/partners/bbb.svg' }, label: 'BBB Accredited' },
       ],
     })

   An item is a figure (value) or a mark (an image the label names), with its label under
   it and, optionally, a short line over it (lead). An item without a lead gets an empty
   spacer in its place, so every figure stands on one line.

   The text is written as given: escape it first if it is not already HTML. */
const C = require('./stat-rail.contract');

const need = (cond, msg) => { if (!cond) throw new Error('stat-rail: ' + msg); };
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

function item(it, o) {
  need(it && it.label, 'each item needs a label');
  need(!it.value !== !it.mark, 'each item is a figure (value) or a mark, not both');
  need(!it.mark || it.mark.src, 'mark: { src }');
  const top = it.lead ? `<div class="stat-rail-lead">${it.lead}</div>` : '<div class="stat-rail-gap" aria-hidden="true"></div>';
  const figure = it.value
    ? `<div class="stat-rail-value${o.roll ? ' od-num' : ''}">${it.value}</div>`
    : `<img class="stat-rail-mark" src="${it.mark.src}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
  return `<div class="stat-rail-item">
  ${top}
  <div class="stat-rail-figure">${figure}</div>
  <div class="stat-rail-label">${it.label}</div>
</div>`;
}

function section(o) {
  need(o && Array.isArray(o.items) && o.items.length >= 2 && o.items.length <= 5, 'items: two to five');
  need(!o.tone || C.variants.section['data-tone'].values.includes(o.tone), 'tone must be soft (or none)');
  return `<section${attr('id', o.id)} data-component="stat-rail" class="stat-rail"${attr('data-tone', o.tone)}>
  <div class="stat-rail-inner">
    <div class="stat-rail-list rv">
${o.items.map(it => item(it, o)).join('\n').split('\n').map(l => '      ' + l).join('\n')}
    </div>
  </div>
</section>`;
}

module.exports = { section };
