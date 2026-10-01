/* Hero — library component. One template for the tinted hero that opens a page with its
   H1 and one object: the real checker, or a diagram.

   CSS  build/sections/hero.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/20-motion.js (.rv, the .pen-word mark), 22-hero-title.js (the
        rising words), 18-pen-mark.js (redraws the underline for an edited word),
        30-checker.js (the form in the slot) — nothing of its own
   Contract + validator  build/sections/hero.contract.js, hero.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const hero = require('./sections/hero');
     hero.section({
       id: 'student-checker',                // the anchor; the checker's button returns to it
       layout: 'split-aside',                // 'split-aside' | 'split' | 'hub' | 'center'
       eyebrow: '…',                         // optional pill (its dot is teal in a hero)
       title: 'Plagiarism Checker for Students',
       pen: 'Students',                      // the words the pen underlines (a fragment of the title)
       size: 'long',                         // optional: a sentence-long title steps down
       lead: '…',  measure: '62',            // one lead, or [lead, lead]; measure: its longest line
       checker: { copy, textId, lang },      // → the sealed checker slot (build/checker.js) + the free line
       aside: { path | facts | notice },     // split-aside only, one of the three (below)
     })

   Options by layout
     split-aside   checker + aside. aside: { path: { label, steps: [..], current: 1 } }
                   | { facts: { items: [[value, label] ×3], note, link: { label, href, icon } } }
                   | { notice: { tone, icon, text } }       icon: the inner markup of a 24×24 <svg>
     split         checker, no aside (the Ukrainian page). checker.lang: the form's own
                   language when the page's differs ('en')
     hub           media: '<div …>…</div>' — a diagram or a card, sealed as [data-slot="media"];
                   actions: { button: { label, href }, link: { label, href } };
                   note: '…', noteMeasure: '58'
     center        the homepage: checker under the centred head; rise: true — the title's
                   words rise one by one ([data-hero-title], 22-hero-title.js)

   checker: { copy, textId, lang } — copy is build/checker.js's (placeholder, formats,
   checkPlagiarism, checkAI, cta, free); the form's button returns to '#' + id.

   Every external href gets rel="noopener". The text is written as given: escape it first
   if it is not already HTML. */
const checkerForm = require('../checker');
const action = require('./action');
const tile = require('./icon-tile');

/* the variant values are the contract's */
const C = require('./hero.contract');
const LAYOUTS = C.variants.section['data-layout'].values;
const SIZES = C.variants.title['data-size'].values;
const MEASURES = C.variants.lead['data-measure'].values;
const NOTE_MEASURES = C.variants.note['data-measure'].values;

const SPARK = '<svg class="hero-free-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/></svg>';
const PATH_ARROW = '<svg class="hero-path-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

const need = (cond, msg) => { if (!cond) throw new Error('hero: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

/* ── the pen mark ─────────────────────────────────────────────────────────────
   One fragment of the title underlined by hand. The line is drawn for the fragment's
   length: 18 units a character (PEN_UNIT; 18-pen-mark.js redraws it by the same rule
   when an editor changes the word). `width` overrides it — the homepage's is 120. */
const PEN_UNIT = 18;
const chars = s => s.replace(/&[a-z]+;|&#\d+;/gi, 'x').replace(/<[^>]*>/g, '').length;
const penSvg = w => `<svg class="pen-mark" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg>`;
/* One word of a rising title inside a box that clips it, so the word can rise out of
   nothing on load (22-home.css, 22-hero-title.js). The box is a plain rectangle: a
   transform inside a rounded clip squares off its corners in Chrome, inside a square one
   it costs nothing. Padding carries the clip below the baseline so a g keeps its tail, and
   the negative margin hands that space straight back, so the line box is the same height
   it was. The boxes go INSIDE the pen word, never around it: the pen hangs its line below
   the word on an absolute, and a clip around the pair would cut the mark off. */
const hw = w => `<span class="hw"><span class="hw-in">${w}</span></span>`;
const words = (s, rise) => (rise ? s.split(' ').map(w => (w ? hw(w) : w)).join(' ') : s);
function pen(text, phrase, { width, rise } = {}) {
  if (!phrase) return words(text, rise);
  need(text.includes(phrase), `pen: "${phrase}" is not in "${text}"`);
  const [before, after] = [text.slice(0, text.indexOf(phrase)), text.slice(text.indexOf(phrase) + phrase.length)];
  return `${words(before, rise)}<span class="pen-word">${words(phrase, rise)}${penSvg(width || Math.round(chars(phrase) * PEN_UNIT))}</span>${words(after, rise)}`;
}

/* ── the head ─────────────────────────────────────────────────────────────────── */
const eyebrow = label => `<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">${label}</span>
</div>`;

function head(o) {
  const center = o.layout === 'center';
  need(!o.size || SIZES.includes(o.size), 'size must be one of ' + SIZES.join(', ') + ' (or none)');
  need(o.measure === undefined || MEASURES.includes(String(o.measure)), 'measure must be one of ' + MEASURES.join(', '));
  need(!o.rise || center, 'rise (the rising words) belongs to the center layout');
  const leads = [].concat(o.lead || []);
  need(leads.length >= 1 && leads.length <= 2, 'one lead, or two');
  const parts = [];
  if (o.eyebrow) parts.push(eyebrow(o.eyebrow));
  parts.push(`<h1 class="hero-title"${o.rise ? ' data-hero-title' : ''}${attr('data-size', o.size)}>${pen(o.title, o.pen, { width: o.penWidth, rise: o.rise })}</h1>`);
  leads.forEach(l => parts.push(`<p class="hero-lead"${o.rise ? ' data-hero-support' : ''}${attr('data-measure', o.measure)}>${l}</p>`));
  if (o.actions) {
    need(o.layout === 'hub', 'actions belong to the hub layout (beside a checker the form is the action)');
    need(o.actions.button, 'actions.button is required');
    const a = [action.button(o.actions.button)];
    if (o.actions.link) a.push(action.link(o.actions.link));
    parts.push(`<div class="hero-actions">\n${indent(a.join('\n'), '  ')}\n</div>`);
  }
  if (o.note) {
    need(o.layout === 'hub', 'the note belongs to the hub layout');
    need(o.noteMeasure === undefined || NOTE_MEASURES.includes(String(o.noteMeasure)), 'noteMeasure must be one of ' + NOTE_MEASURES.join(', '));
    parts.push(`<p class="hero-note"${attr('data-measure', o.noteMeasure)}>${o.note}</p>`);
  } else need(o.noteMeasure === undefined, 'noteMeasure without a note');
  return `<div class="hero-head${center ? '' : ' rv'}">
${indent(parts.join('\n'), '  ')}
</div>`;
}

/* ── the sealed slots ─────────────────────────────────────────────────────────
   The checker is the product's own form (build/checker.js), rendered here and marked
   data-slot="checker": copied as it is. Its button returns to the hero's own anchor. */
function checkerSlot(o) {
  const k = o.checker;
  need(k && k.copy && k.textId, 'checker: { copy, textId } is required');
  need(o.id, 'a hero with a checker needs an id: the form\'s button returns to it');
  const form = checkerForm.form(k.copy, '#' + o.id, { text: k.textId }, { static: true, slot: true })
    .split('\n').map(l => l.replace(/^ {6}/, '')).join('\n');
  return k.lang ? `<div lang="${k.lang}">\n${indent(form, '  ')}\n</div>` : form;
}
const free = text => `<p class="hero-free">
  ${SPARK}
  ${text}
</p>`;
function mediaSlot(html) {
  need(typeof html === 'string' && /^\s*<[a-z]/i.test(html), 'media: the markup of the diagram (one root element)');
  need(!/^\s*<[a-z0-9]+[^>]*\sdata-slot=/i.test(html), 'media: the template marks the slot itself');
  return html.trim().replace(/^<([a-z0-9]+)/i, '<$1 data-slot="media"');
}

/* ── the aside (split-aside) ──────────────────────────────────────────────────── */
function aside(a) {
  const kinds = ['path', 'facts', 'notice'].filter(k => a && a[k]);
  need(kinds.length === 1, 'aside: exactly one of path, facts, notice');
  let inner;
  if (a.path) {
    const p = a.path;
    need(p.label && Array.isArray(p.steps) && p.steps.length >= 2, 'aside.path: { label, steps: [..], current }');
    inner = `<ol class="hero-path" aria-label="${p.label}">
${p.steps.map((s, i) => `  <li class="hero-path-step">
    <span class="hero-path-pill"${i === p.current ? ' data-state="current"' : ''}>${i === p.current ? '<span class="hero-path-dot"></span>' : ''}${s}</span>${i < p.steps.length - 1 ? '\n    ' + PATH_ARROW : ''}
  </li>`).join('\n')}
</ol>`;
  } else if (a.facts) {
    const f = a.facts;
    need(Array.isArray(f.items) && f.items.length === 3 && f.note, 'aside.facts: { items: three [value, label], note }');
    inner = `<div class="hero-facts">
  <div class="hero-facts-grid">
${f.items.map(([v, l]) => `    <div class="hero-fact">
      <p class="hero-fact-value">${v}</p>
      <p class="hero-fact-label">${l}</p>
    </div>`).join('\n')}
  </div>
  <p class="hero-facts-note">${f.note}</p>
</div>`;
    if (f.link) {
      need(f.link.label && f.link.href, 'aside.facts.link: { label, href, icon }');
      inner += `\n<p class="hero-aside-more">
  <a href="${f.link.href}"${rel(f.link.href)} class="hero-aside-link">${f.link.icon ? tile.icon(f.link.icon, 15) : ''}${f.link.label}</a>
</p>`;
    }
  } else {
    const n = a.notice;
    need(n.text && n.icon && n.tone, 'aside.notice: { tone, icon, text }');
    inner = `<div class="hero-notice">
  ${tile.render({ tone: n.tone, icon: n.icon })}
  <p class="hero-notice-text">${n.text}</p>
</div>`;
  }
  return `<div class="hero-aside rv">
${indent(inner, '  ')}
</div>`;
}

/* ── the section ───────────────────────────────────────────────────────────── */
function section(o) {
  need(o && o.title, 'a title is required');
  need(LAYOUTS.includes(o.layout), 'layout must be one of ' + LAYOUTS.join(', '));
  const open = `<section${attr('id', o.id)} data-component="hero" class="hero" data-layout="${o.layout}">`;

  if (o.layout === 'center') {
    for (const k of ['eyebrow', 'size', 'actions', 'note', 'media', 'aside']) need(o[k] === undefined, `${k} does not belong to the center layout`);
    return `${open}
  <div class="hero-bg">
    <div class="dot-field hero-dots" aria-hidden="true"></div>
    <div class="orb hero-orb-cool"></div>
    <div class="orb hero-orb-warm"></div>
  </div>
  <div class="hero-inner">
${indent(head(o), '    ')}
${indent(checkerSlot(o), '    ')}
${indent(free(o.checker.copy.free), '    ')}
  </div>
</section>`;
  }

  const hub = o.layout === 'hub';
  need(hub ? o.media && !o.checker : o.checker && !o.media, hub ? 'the hub layout takes media (a diagram), not a checker' : 'this layout takes the checker, not media');
  need(!o.aside === (o.layout !== 'split-aside'), 'the aside goes with layout: split-aside, and that layout needs one');
  const media = hub
    ? `<div class="hero-media rv">
${indent(mediaSlot(o.media), '  ')}
</div>`
    : `<div class="hero-media">
${indent(checkerSlot(o), '  ')}
${indent(free(o.checker.copy.free), '  ')}
</div>`;
  const blocks = [head(o), media];
  if (o.aside) blocks.push(aside(o.aside));
  return `${open}
  <div class="dot-field hero-dots" aria-hidden="true"></div>
  <div class="orb orb-hero-teal"></div>
  <div class="orb orb-hero-coral"></div>
  <div class="hero-inner">
    <div class="hero-grid">
${indent(blocks.join('\n'), '      ')}
    </div>
  </div>
</section>`;
}

module.exports = { section, pen, PEN_UNIT };
