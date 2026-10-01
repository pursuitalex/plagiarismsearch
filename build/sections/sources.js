/* Sources — library component. One template for "what a check is compared against, and
   what it can leave out": the source collections and the scan settings, shown as what is
   available — ticks and tiles, never switches.

   CSS  build/sections/sources.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/20-motion.js — hooks .rv and .rv-kids (nothing of its own)
   Contract + validator  build/sections/sources.contract.js, sources.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const sources = require('./sections/sources');
     sources.section({
       id: 'sources-and-settings',             // optional anchor
       layout: 'groups',                       // 'groups' | 'flow' | 'list' | 'cells'
       bg: 'cool', space: 'lg',                // 'white' | 'cool';  'lg' (lg:py-32) | 'md' (lg:py-28)
       accent: 'teal',                         // optional: the pill's dot (default orange)
       head: { eyebrow, title, intro, measure, introMeasure },   // the Section Header
       …                                       // by layout, below
     })

   By layout
     groups   groups: two of { label, icon, tone, items }, items: [[title, text], …] — or,
              with labels: true (the homepage), items: ['label', …];
              stat: { icon, value, text } — the dark figure card;
              notes: up to two of '…' | { text, tone: 'warm' }
     flow     media: '<div …>…</div>' — the input, sealed as [data-slot="media"];
              group: { label, icon, tone, items: [[title, text], …] }
     list     rows: [{ term, desc, icon, tone }];  foot: { icon, text } — the sheet's dark last line
     cells    cells: [{ term, desc, icon, tone, kicker }] — two or four
   icon: the inner markup of a 24×24 <svg>.

   The text is written as given: escape it first if it is not already HTML. */
const sh = require('./section-head');
const tile = require('./icon-tile');

/* the variant values are the contract's */
const C = require('./sources.contract');
const V = C.variants;

const TICK = '<svg class="sources-tick" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AA46C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ARROW = '<svg class="sources-arrow-head" width="10" height="12" viewBox="0 0 10 12" fill="#D1D5DB"><path d="M0 0 10 6 0 12z"/></svg>';
const icon = (paths, size, stroke = 'currentColor') => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const need = (cond, msg) => { if (!cond) throw new Error('sources: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

/* ── a group of ticks ─────────────────────────────────────────────────────────── */
function group(g, o) {
  need(g && g.label && g.icon && g.tone && Array.isArray(g.items) && g.items.length, 'a group: { label, icon, tone, items }');
  const item = it => {
    if (o.labels) { need(typeof it === 'string', 'labels: each item is a string'); return `<li class="sources-item">
  ${TICK}
  <span class="sources-label">${it}</span>
</li>`; }
    need(Array.isArray(it) && it[0] && it[1], 'each item is [title, text]');
    return `<li class="sources-item">
  ${TICK}
  <span class="sources-item-body">
    <span class="sources-item-title">${it[0]}</span>
    <span class="sources-item-text">${it[1]}</span>
  </span>
</li>`;
  };
  return `<div class="sources-group">
  <div class="sources-group-head">
    ${tile.render({ tone: g.tone, icon: g.icon, ...(o.labels ? { variant: 'ring', size: 19 } : {}) })}
    <span class="sources-kicker">${g.label}</span>
  </div>
  <ul class="sources-list">
${indent(g.items.map(item).join('\n'), '    ')}
  </ul>
</div>`;
}

function groups(o) {
  need(Array.isArray(o.groups) && o.groups.length === 2, 'groups: exactly two');
  need(o.stat && o.stat.icon && o.stat.value && o.stat.text, 'stat: { icon, value, text }');
  const notes = [].concat(o.notes || []);
  need(notes.length <= 2, 'notes: two at most');
  const note = n => (typeof n === 'string' ? `<p class="sources-note">${n}</p>` : `<p class="sources-note"${attr('data-tone', n.tone)}>${n.text}</p>`);
  notes.forEach(n => need(typeof n === 'string' || (n.text && (!n.tone || n.tone === 'warm')), 'notes: a string, or { text, tone: "warm" }'));
  return `<div class="sources-grid rv-kids">
${indent(o.groups.map(g => group(g, o)).join('\n'), '  ')}
  <div class="sources-stat">
    <span class="sources-stat-icon">${icon(o.stat.icon, 19)}</span>
    <div class="sources-stat-value">${o.stat.value}</div>
    <p class="sources-stat-text">${o.stat.text}</p>
  </div>
</div>${notes.length ? `
<div class="sources-notes rv">
${notes.map(n => '  ' + note(n)).join('\n')}
</div>` : ''}`;
}

function flow(o) {
  need(typeof o.media === 'string' && /^\s*<[a-z]/i.test(o.media), 'media: the markup of the input (one root element)');
  need(!/^\s*<[a-z0-9]+[^>]*\sdata-slot=/i.test(o.media), 'media: the template marks the slot itself');
  need(o.group, 'flow: group is required');
  return `<div class="sources-flow rv">
${indent(o.media.trim().replace(/^<([a-z0-9]+)/i, '<$1 data-slot="media"'), '  ')}
  <div class="sources-arrow" aria-hidden="true">
    <span class="sources-arrow-line"></span>
    ${ARROW}
  </div>
${indent(group(o.group, o), '  ')}
</div>`;
}

const frame = inner => `<div class="sources-frame rv">
${indent(inner, '  ')}
</div>`;

function list(o) {
  need(Array.isArray(o.rows) && o.rows.length >= 2, 'rows: at least two');
  const row = r => {
    need(r.term && r.desc && r.icon && r.tone, 'a row: { term, desc, icon, tone }');
    return `<div class="sources-row">
  ${tile.render({ tone: r.tone, icon: r.icon })}
  <div class="sources-row-body">
    <dt class="sources-term">${r.term}</dt>
    <dd class="sources-desc">${r.desc}</dd>
  </div>
</div>`;
  };
  const foot = o.foot ? `
<p class="sources-foot">
  <span class="sources-foot-icon">${icon(o.foot.icon, 18, '#6ED7E8')}</span>
  <span class="sources-foot-text">${o.foot.text}</span>
</p>` : '';
  need(!o.foot || (o.foot.icon && o.foot.text), 'foot: { icon, text }');
  return `<div class="sources-split">
  <div class="sources-aside rv">
${sh.render(o.head, '    ')}
  </div>
${indent(frame(`<div class="sources-sheet">
  <dl class="sources-rows">
${indent(o.rows.map(row).join('\n'), '    ')}
  </dl>${indent(foot, '  ')}
</div>`), '  ')}
</div>`;
}

function cells(o) {
  need(Array.isArray(o.cells) && [2, 4].includes(o.cells.length), 'cells: two or four');
  const cell = c => {
    need(c.term && c.desc && c.icon && c.tone && c.kicker, 'a cell: { term, desc, icon, tone, kicker }');
    return `<div class="sources-cell">
  <div class="sources-cell-head">
    ${tile.render({ tone: c.tone, icon: c.icon })}
    <span class="sources-kicker">${c.kicker}</span>
  </div>
  <dt class="sources-term">${c.term}</dt>
  <dd class="sources-desc">${c.desc}</dd>
</div>`;
  };
  return frame(`<dl class="sources-cells cells">
${indent(o.cells.map(cell).join('\n'), '  ')}
</dl>`);
}

/* ── the section ───────────────────────────────────────────────────────────── */
function section(o) {
  need(o && o.head && o.head.title, 'head: { title } is required');
  need(V.section['data-layout'].values.includes(o.layout), 'layout must be one of ' + V.section['data-layout'].values.join(', '));
  need(V.section['data-bg'].values.includes(o.bg), 'bg must be white or cool');
  need(V.section['data-space'].values.includes(o.space), 'space must be lg or md');
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  need(!o.labels || o.layout === 'groups', 'labels goes with layout: groups');
  const body = { groups, flow, list, cells }[o.layout](o);
  const { introMeasure, measure, ...head } = o.head;
  need(o.layout !== 'list' || (measure === undefined && introMeasure === undefined), 'list: the head is a column of the split, it takes no measure');
  const parts = o.layout === 'list' ? [body] : [sh.block({ ...head, measure, introMeasure }), body];
  return `<section${attr('id', o.id)} data-component="sources" class="sources-section" data-layout="${o.layout}" data-bg="${o.bg}" data-space="${o.space}"${attr('data-accent', o.accent)}${o.labels ? ' data-items="labels"' : ''}>
  <div class="sources-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section };
