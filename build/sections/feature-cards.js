/* Feature cards — library component. One template for an unnumbered set of things of
   equal rank: an icon, a name and a few lines each.

   CSS  build/sections/feature-cards.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/20-motion.js — hooks .rv and .rv-kids (nothing of its own)
   Contract + validator  build/sections/feature-cards.contract.js, feature-cards.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const cards = require('./sections/feature-cards');
     cards.section({
       id: 'pdf-handling',                     // optional anchor
       layout: 'grid',                         // 'grid' | 'panel'
       bg: 'cool', space: 'lg',                // 'white' | 'cool' | 'aqua';  'lg' | 'md' | 'sm'
       accent: 'teal',                         // optional: the pill's dot (default orange)
       head: { eyebrow, title, intro, measure },   // the Section Header block; optional in a panel
       cols: 4,                                // grid: 3 | 4
       items: [{ title, text, icon, tone, accent: true }],   // icon: the inner markup of a 24×24 <svg>
       action: { label, href, tone: 'light' }, // grid: one button under the cards
     })

   Options
     size        grid only. 'compact' — the API page's card (flat tile, smaller text);
                 'lead' — the homepage's card: items take action: { label, href } too
     inlineHead  grid only, true: the head is the grid's first cell (h2 + intro, no pill),
                 two cards a row from 640px and three from 1024px (Affiliate)
     items       accent: true — the teal accent card (one a grid)
     foot        panel only: { note, action: { label, href, tone } } — the sheet's last row
     label       panel without a head: the section's aria-label

   Every external href gets rel="noopener". The text is written as given: escape it first
   if it is not already HTML. */
const sh = require('./section-head');
const action = require('./action');
const tile = require('./icon-tile');

/* the variant values are the contract's */
const C = require('./feature-cards.contract');
const V = C.variants;

const need = (cond, msg) => { if (!cond) throw new Error('feature-cards: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

/* the icon tile of a card: the homepage's is ringed, with a 19px icon; so is the API's size */
const iconTile = (it, o) => {
  need(it.icon && it.tone, 'each item needs icon and tone');
  return tile.render({ tone: it.tone, icon: it.icon, ...(o.size === 'lead' ? { variant: 'ring', size: 19 } : o.size === 'compact' ? { size: 19 } : {}) });
};

function card(it, o) {
  need(it && it.title && it.text, 'each item needs title and text');
  need(!it.action || o.size === 'lead', 'a card\'s own action goes with size: lead');
  const title = o.size === 'lead' ? `<p class="cards-title">${it.title}</p>` : `<h3 class="cards-title">${it.title}</h3>`;
  return `<div class="cards-item"${it.accent ? ' data-tone="teal"' : ''}>
  ${iconTile(it, o)}
  ${title}
  <p class="cards-text">${it.text}</p>${it.action ? `
  <div class="cards-item-action">
${indent(action.button(it.action), '    ')}
  </div>` : ''}
</div>`;
}

function grid(o) {
  need(!o.foot && !o.label, 'foot and label belong to layout: panel');
  need(o.items.filter(i => i.accent).length <= 1, 'one accent card at most');
  const cells = o.items.map(it => card(it, o));
  let open;
  if (o.inlineHead) {
    need(o.cols === undefined, 'inlineHead sets its own columns');
    need(o.head && o.head.title && !o.head.eyebrow, 'inlineHead: head { title, intro } (no pill)');
    cells.unshift(`<div class="cards-head-cell">
${sh.render({ title: o.head.title, intro: o.head.intro }, '  ')}
</div>`);
    open = '<div class="cards-grid rv" data-head="inline">';
  } else {
    need(V.grid['data-cols'].values.includes(String(o.cols)), 'cols must be 3 or 4');
    open = `<div class="cards-grid rv-kids" data-cols="${o.cols}">`;
  }
  const parts = [`${open}
${indent(cells.join('\n'), '  ')}
</div>`];
  if (o.action) parts.push(`<div class="cards-actions rv">
${indent(action.button(o.action), '  ')}
</div>`);
  return parts.join('\n');
}

function panel(o) {
  for (const k of ['cols', 'size', 'inlineHead', 'action']) need(o[k] === undefined, `${k} does not belong to layout: panel`);
  need(o.items.length >= 2 && o.items.length <= 4, 'a panel holds two to four cells');
  const cell = it => {
    need(it && it.title && it.text && !it.accent && !it.action, 'a cell: { title, text, icon, tone }');
    return `<div class="cards-cell">
  ${iconTile(it, o)}
  <h3 class="cards-title">${it.title}</h3>
  <p class="cards-text">${it.text}</p>
</div>`;
  };
  let foot = '';
  if (o.foot) {
    need(o.foot.note, 'foot: { note, action }');
    foot = `
  <div class="cards-panel-foot">
    <p class="cards-panel-note">${o.foot.note}</p>${o.foot.action ? `
    <span class="cards-panel-action">
${indent(action.button(o.foot.action), '      ')}
    </span>` : ''}
  </div>`;
  }
  return `<div class="cards-panel rv">
  <div class="cards-cells">
${indent(o.items.map(cell).join('\n'), '    ')}
  </div>${foot}
</div>`;
}

function section(o) {
  need(o && V.section['data-layout'].values.includes(o.layout), 'layout must be grid or panel');
  need(V.section['data-bg'].values.includes(o.bg), 'bg must be one of ' + V.section['data-bg'].values.join(', '));
  need(V.section['data-space'].values.includes(o.space), 'space must be one of ' + V.section['data-space'].values.join(', '));
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  need(!o.size || V.section['data-size'].values.includes(o.size), 'size must be one of ' + V.section['data-size'].values.join(', '));
  need(Array.isArray(o.items) && o.items.length >= 2, 'items: at least two');
  const parts = [];
  if (o.head && !o.inlineHead) parts.push(sh.block(o.head));
  else need(o.inlineHead || o.layout === 'panel', 'a grid needs a head (or inlineHead)');
  need(!o.label || !o.head, 'label is for a section without a head');
  parts.push(o.layout === 'grid' ? grid(o) : panel(o));
  return `<section${attr('id', o.id)} data-component="feature-cards"${attr('aria-label', o.label)} class="cards-section" data-layout="${o.layout}" data-bg="${o.bg}" data-space="${o.space}"${attr('data-accent', o.accent)}${attr('data-size', o.size)}>
  <div class="cards-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section };
