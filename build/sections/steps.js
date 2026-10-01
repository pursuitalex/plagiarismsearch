/* Steps — library component. One template for a numbered sequence: what happens, in order.

   CSS  build/sections/steps.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/20-motion.js — hooks .rv and .rv-kids (nothing of its own)
   Contract + validator  build/sections/steps.contract.js, steps.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const steps = require('./sections/steps');
     steps.section({
       id: 'your-paper',                       // optional anchor
       layout: 'rail',                         // 'rail' | 'cards' | 'rows'
       marker: 'icon',                         // by layout — see below
       bg: 'white', space: 'lg',               // 'white' | 'cool' | 'aqua';  'lg' (lg:py-32) | 'md' (lg:py-28)
       accent: 'teal',                         // optional: the pill's dot (default orange)
       head: { eyebrow, title, intro, measure, introMeasure },   // the Section Header block (section-head.js)
       cols: 4,                                // rail, cards: 3 | 4
       items: [{ title, text, icon, tone }],   // icon: the inner markup of a 24×24 <svg>
       foot: { … },                            // optional, one of five — see below
     })

   Layouts and their markers
     rail    marker 'icon' (tile + number) | 'disc' (a large numbered disc; no icon)
             last: 'apart' — the last station drawn apart (the Ukrainian page)
     cards   marker 'icon' (tile and number on one row) | 'icon-stack' (the homepage: tile
             on top, number before the title) | 'badge' (a round number) | 'badge-sm' (the
             compact card); link: 'line' — connectors between the cards; tag: 'div' — the
             AI Detector and API lists are <div>s, as approved
     rows    items: { title, text, tags: [..] }; with marker 'icon': { title, text, icon,
             tone, kicker }; tag: 'ol' — the sheet as a list (Affiliate)
   stagger: '.06' — the list's reveal beat (the Ukrainian page).  glow: true — the soft
   glow on the aqua ground (the homepage).

   The foot
     { note: { lines: ['…', { text, tone: 'strong' }], action: { label, href, tone } } }
     { action: { label, href, tone } }                 one button alone
     { more: { text, link: { label, href } } }         a line and a quiet link
     { callout: { tone, icon, text } }                 a statement beside an icon tile
     { media: '<div …>…</div>' }                       a diagram, sealed as [data-slot="media"]

   Every external href gets rel="noopener". The text is written as given: escape it first
   if it is not already HTML. */
const sh = require('./section-head');
const action = require('./action');
const tile = require('./icon-tile');

/* the variant values are the contract's */
const C = require('./steps.contract');
const V = C.variants;
const LAYOUTS = V.section['data-layout'].values;

const need = (cond, msg) => { if (!cond) throw new Error('steps: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');
const pad2 = n => String(n).padStart(2, '0');

/* ── a step, by layout and marker ─────────────────────────────────────────────── */
const iconTile = (it, o) => {
  need(it.icon && it.tone, `marker "${o.marker}": each item needs icon and tone`);
  return tile.render({ tone: it.tone, icon: it.icon, ...(o.marker === 'icon-stack' ? { variant: 'ring', size: 19 } : {}) });
};

function item(it, i, o) {
  need(it && it.title && it.text, 'each item needs title and text');
  const li = o.tag === 'div' ? 'div' : 'li';
  const text = `<p class="steps-text">${it.text}</p>`;
  const h3 = `<h3 class="steps-title">${it.title}</h3>`;
  let body;
  if (o.marker === 'icon') body = `<div class="steps-marker">
  ${iconTile(it, o)}
  <span class="steps-num">${pad2(i + 1)}</span>
</div>
${h3}
${text}`;
  else if (o.marker === 'icon-stack') body = `${iconTile(it, o)}
<div class="steps-heading">
  <span class="steps-num">${pad2(i + 1)}</span>
  <p class="steps-title">${it.title}</p>
</div>
${text}`;
  else if (o.marker === 'badge') body = `<span class="steps-badge">${i + 1}</span>
${h3}
${text}`;
  else if (o.marker === 'badge-sm') body = `<span class="steps-marker">
  <span class="steps-badge">${i + 1}</span>
</span>
${h3}
${text}`;
  else body = `<span class="steps-disc">${i + 1}</span>
${h3}
${text}`;
  const link = o.link && i < o.items.length - 1 ? '<span class="steps-link" aria-hidden="true"></span>\n' : '';
  return `<${li} class="steps-item">
${indent(link + body, '  ')}
</${li}>`;
}

function list(o) {
  need(V.list['data-cols'].values.includes(String(o.cols)), 'cols must be 3 or 4');
  need(!o.link || (o.layout === 'cards' && o.link === 'line'), 'link: "line" goes with layout: cards');
  need(!o.last || (o.layout === 'rail' && o.last === 'apart'), 'last: "apart" goes with layout: rail');
  need(!o.stagger || V.list['data-stagger'].values.includes(String(o.stagger)), 'stagger must be one of ' + V.list['data-stagger'].values.join(', '));
  need(!o.tag || (o.tag === 'div' && o.layout === 'cards'), 'tag: "div" goes with layout: cards');
  const tag = o.tag === 'div' ? 'div' : 'ol';
  const line = o.layout === 'rail' ? '  <span class="steps-line" aria-hidden="true"></span>\n' : '';
  return `<${tag}${attr('data-stagger', o.stagger)} class="steps-list rv-kids" data-cols="${o.cols}"${attr('data-link', o.link)}${attr('data-last', o.last)}>
${line}${indent(o.items.map((it, i) => item(it, i, o)).join('\n'), '  ')}
</${tag}>`;
}

/* rows: one sheet, a row a step */
function rows(o) {
  for (const k of ['cols', 'link', 'last', 'stagger']) need(o[k] === undefined, `${k} does not belong to layout: rows`);
  need(!o.tag || o.tag === 'ol', 'rows: tag is "ol" (or none: a <div> sheet)');
  const ol = o.tag === 'ol';
  const row = (it, i) => {
    need(it && it.title && it.text, 'each item needs title and text');
    let head;
    if (o.marker === 'icon') {
      need(!it.tags, 'rows with marker "icon" carry a kicker, not tags');
      head = `<div class="steps-row-head">
  ${iconTile(it, o)}
  <div class="steps-row-title">${it.kicker ? `\n    <p class="steps-kicker">${it.kicker}</p>` : ''}
    <h3 class="steps-title">${it.title}</h3>
  </div>
</div>`;
    } else {
      need(!it.kicker && !it.icon, 'a kicker and an icon need marker: "icon"');
      head = `<div class="steps-row-head">
  <h3 class="steps-title">${it.title}</h3>${it.tags && it.tags.length ? `
  <div class="steps-tags">
${it.tags.map(t => `    <span class="steps-tag">${t}</span>`).join('\n')}
  </div>` : ''}
</div>`;
    }
    return `<${ol ? 'li' : 'div'} class="steps-row">
  <span class="steps-num"${ol ? ' aria-hidden="true"' : ''}>${pad2(i + 1)}</span>
${indent(head, '  ')}
  <p class="steps-text">${it.text}</p>
</${ol ? 'li' : 'div'}>`;
  };
  return `<div class="steps-frame rv">
  <${ol ? 'ol' : 'div'} class="steps-sheet"${ol ? ' role="list"' : ''}>
${indent(o.items.map(row).join('\n'), '    ')}
  </${ol ? 'ol' : 'div'}>
</div>`;
}

/* ── the foot ─────────────────────────────────────────────────────────────────── */
function foot(f) {
  const kinds = ['note', 'action', 'more', 'callout', 'media'].filter(k => f[k]);
  need(kinds.length === 1, 'foot: exactly one of note, action, more, callout, media');
  if (f.note) {
    const lines = [].concat(f.note.lines || []);
    need(lines.length >= 1 && lines.length <= 3, 'foot.note.lines: one to three');
    const line = l => (typeof l === 'string' ? `<p class="steps-note-line">${l}</p>` : `<p class="steps-note-line"${attr('data-tone', l.tone)}>${l.text}</p>`);
    lines.forEach(l => need(typeof l === 'string' || (l.text && (!l.tone || l.tone === 'strong')), 'foot.note.lines: a string, or { text, tone: "strong" }'));
    return `<div class="steps-note rv">
  <div class="steps-note-text">
${lines.map(l => '    ' + line(l)).join('\n')}
  </div>${f.note.action ? `
  <div class="steps-note-action">
${indent(action.button(f.note.action), '    ')}
  </div>` : ''}
</div>`;
  }
  if (f.action) return `<div class="steps-actions rv">
${indent(action.button(f.action), '  ')}
</div>`;
  if (f.more) {
    need(f.more.text && f.more.link && f.more.link.label && f.more.link.href, 'foot.more: { text, link: { label, href } }');
    return `<div class="steps-more rv">
  <p class="steps-more-text">${f.more.text}</p>
  <span class="steps-more-link"><a href="${f.more.link.href}"${rel(f.more.link.href)} class="section-link">${f.more.link.label}</a></span>
</div>`;
  }
  if (f.callout) {
    need(f.callout.text && f.callout.icon && f.callout.tone, 'foot.callout: { tone, icon, text }');
    return `<div class="steps-callout rv">
  ${tile.render({ tone: f.callout.tone, icon: f.callout.icon })}
  <p class="steps-callout-text">${f.callout.text}</p>
</div>`;
  }
  need(typeof f.media === 'string' && /^\s*<[a-z]/i.test(f.media), 'foot.media: the markup of the block (one root element)');
  need(!/^\s*<[a-z0-9]+[^>]*\sdata-slot=/i.test(f.media), 'foot.media: the template marks the slot itself');
  return f.media.trim().replace(/^<([a-z0-9]+)/i, '<$1 data-slot="media"');
}

/* ── the section ───────────────────────────────────────────────────────────── */
function section(o) {
  need(o && o.head && o.head.title, 'head: { title } is required');
  need(LAYOUTS.includes(o.layout), 'layout must be one of ' + LAYOUTS.join(', '));
  need(V.section['data-bg'].values.includes(o.bg), 'bg must be one of ' + V.section['data-bg'].values.join(', '));
  need(V.section['data-space'].values.includes(o.space), 'space must be lg or md');
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  const markers = C.markers[o.layout];
  need(o.layout === 'rows' ? !o.marker || markers.includes(o.marker) : markers.includes(o.marker), `layout ${o.layout}: marker must be one of ${markers.join(', ')}`);
  need(Array.isArray(o.items) && o.items.length >= 2, 'items: at least two steps');
  need(!o.glow || o.bg === 'aqua', 'glow goes with bg: aqua');
  const { introMeasure, measure, ...head } = o.head;
  need(introMeasure === undefined || V.intro['data-measure'].values.includes(String(introMeasure)), 'head.introMeasure must be one of ' + V.intro['data-measure'].values.join(', '));
  const parts = [sh.block({ ...head, measure, introMeasure })];
  parts.push(o.layout === 'rows' ? rows(o) : list(o));
  if (o.foot) parts.push(foot(o.foot));
  return `<section${attr('id', o.id)} data-component="steps" class="steps-section" data-layout="${o.layout}"${attr('data-marker', o.marker)} data-bg="${o.bg}" data-space="${o.space}"${attr('data-accent', o.accent)}>${o.glow ? `
  <div class="steps-bg">
    <div class="orb steps-glow"></div>
  </div>` : ''}
  <div class="steps-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section };
