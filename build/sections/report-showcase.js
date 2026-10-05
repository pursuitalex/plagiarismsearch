/* Report showcase — library component. One template for the section that shows the
   plagiarism report: a head, the report itself, and a few lines on how to read it.

   CSS  build/sections/report-showcase.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/40-report.js ([data-report]: select a passage), 42-report-pass.js
        (the homepage's scan), 20-motion.js (.rv, .rv-kids, .pen-word) — nothing of its own
   Contract + validator  build/sections/report-showcase.contract.js, report-showcase.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const report = require('./sections/report-showcase');
     report.section({
       id: 'pdf-report',                     // optional anchor
       surface: 'dark',                      // 'dark' | 'light'
       space: 'md',                          // the page's rhythm: 'md' | 'lg'
       accent: 'teal',                       // optional: the pill's dot (default orange)
       head: { eyebrow, title, intro, measure: '760', introMeasure: '72' },
       foot: { points: [[name, text] ×3], callout: '…' },
     })

   THE REPORT IS SEALED. It is the product's screen (build/report.js renders it, marked
   data-slot="report"): its document, figures, sources and category colours are the
   sample report's, never a page's copy. The template takes no content for it — only
   which approved rendition to draw:
     surface 'dark'            two white panels on the dark ground
     surface 'light'           the panels in a grey frame on a white section (Turnitin)
     tone 'quiet'              the homepage's dark act: its scan pass, one warm glow, a
                               quieter head
     mock: { lang: 'en' }      the report's own language, where the page's differs

   The head
     head: { eyebrow, title, intro, measure, introMeasure }   intro: one string, or two
     head.pen: 'evidence' (+ penWidth)     one word of the title underlined by the pen
     path: { label, steps: [..], current: 0 }   dark only: a path in pills beside the head
                                           (the Ukrainian page); the head takes no measure

   The foot — on the dark surface, in this order, each optional
     points: [[name, text] ×3]                  a strip of three numbered points
     callout: 'text' | { text, icon }           the teal callout
     pair: { split: 'tail', cards: [a, b] }     two cards side by side instead of the two
                                                above; a card is one of
         { principle: { kicker, title, pen, text } }   the white display card
         { callout: 'text' | { text, icon } }          the teal callout, as a card
         { aside: 'text' }                             a quiet text card
         { statement: { tone, icon, text } }           a white card: an icon tile and a statement
     caveat: { text, icon }                     a footnote line under the report
     media: '<div …>…</div>'                    a page's own block, sealed as [data-slot="media"]
   …and on the light one
     points: [{ name, text, icon, tone } ×3] + callout: { text, icon }   three points with
                                                icon tiles beside an orange callout

   icon: the inner markup of a 24×24 <svg>. The text is written as given: escape it first
   if it is not already HTML. */
const sh = require('./section-head');
const tile = require('./icon-tile');
const hero = require('./hero');
const reportMock = require('../report');

/* the variant values are the contract's */
const C = require('./report-showcase.contract');
const V = C.variants;

const need = (cond, msg) => { if (!cond) throw new Error('report-showcase: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

const INFO = '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>';
const PATH_ARROW = '<svg class="report-path-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/* ── the head ─────────────────────────────────────────────────────────────────── */
function headParts(h) {
  need(h && h.title, 'head: { title } is required');
  need(h.introMeasure === undefined || V.intro['data-measure'].values.includes(String(h.introMeasure)), 'head.introMeasure must be one of ' + V.intro['data-measure'].values.join(', '));
  const intros = [].concat(h.intro || []);
  need(intros.length <= 2, 'head.intro: one paragraph, or two');
  const parts = [];
  if (h.eyebrow) parts.push(sh.eyebrow(h.eyebrow));
  parts.push(sh.title(hero.pen(h.title, h.pen, { width: h.penWidth })));
  intros.forEach(t => parts.push(sh.intro(t, h.introMeasure)));
  return parts.join('\n');
}

function head(o) {
  const h = o.head;
  if (!o.path) {
    need(h.measure === undefined || V.head['data-measure'].values.includes(String(h.measure)), 'head.measure must be one of ' + V.head['data-measure'].values.join(', ') + ' (or none: 820)');
    return `<div class="section-head rv"${attr('data-measure', h.measure)}>
${indent(headParts(h), '  ')}
</div>`;
  }
  const p = o.path;
  need(o.surface === 'dark', 'the path beside the head belongs to the dark surface');
  need(h.measure === undefined, 'with a path the head is a column of the row: it takes no measure');
  need(p.label && Array.isArray(p.steps) && p.steps.length >= 2 && p.steps.length <= 4, 'path: { label, steps: two to four, current }');
  return `<div class="report-top">
  <div class="report-top-head rv">
${indent(headParts(h), '    ')}
  </div>
  <ol class="report-path rv" aria-label="${p.label}">
${p.steps.map((s, i) => `    <li class="report-path-step">
      <span class="report-path-pill"${i === p.current ? ' data-state="current"' : ''}>${i === p.current ? '<span class="report-path-dot"></span>' : ''}${s}</span>${i < p.steps.length - 1 ? '\n      ' + PATH_ARROW : ''}
    </li>`).join('\n')}
  </ol>
</div>`;
}

/* ── the foot ─────────────────────────────────────────────────────────────────── */
const calloutOf = c => (typeof c === 'string' ? { text: c } : c);

/* the teal callout; `block`: a block of its own under the report (it reveals by itself) */
function callout(c, block) {
  c = calloutOf(c);
  need(c && c.text, 'callout: text, or { text, icon }');
  return `<div class="report-callout${block ? ' rv' : ''}">
  <span class="report-callout-icon">${tile.icon(c.icon || INFO)}</span>
  <p class="report-callout-text">${c.text}</p>
</div>`;
}

function points(list) {
  need(Array.isArray(list) && list.length === 3, 'points: exactly three');
  return `<ol class="report-points rv" data-marker="number">
${list.map(([name, text], i) => {
    need(name && text, 'a point: [name, text]');
    return `  <li class="report-point">
    <span class="report-point-num">${i + 1}</span>
    <span class="report-point-body">
      <span class="report-point-name">${name}</span>
      <span class="report-point-text">${text}</span>
    </span>
  </li>`;
  }).join('\n')}
</ol>`;
}

function card(c) {
  const kinds = ['principle', 'callout', 'aside', 'statement'].filter(k => c && c[k]);
  need(kinds.length === 1, 'pair: a card is exactly one of principle, callout, aside, statement');
  if (c.principle) {
    const p = c.principle;
    need(p.title, 'principle: { kicker, title, pen, text }');
    return `<div class="report-principle">${p.kicker ? `
  <p class="report-kicker">${p.kicker}</p>` : ''}
  <p class="report-principle-title">${hero.pen(p.title, p.pen, { width: p.penWidth })}</p>${p.text ? `
  <p class="report-principle-text">${p.text}</p>` : ''}
</div>`;
  }
  if (c.callout) return callout(c.callout, false);
  if (c.aside) return `<p class="report-aside">${c.aside}</p>`;
  const s = c.statement;
  need(s.text && s.icon && s.tone, 'statement: { tone, icon, text }');
  return `<div class="report-statement">
  ${tile.render({ tone: s.tone, icon: s.icon })}
  <p class="report-statement-text">${s.text}</p>
</div>`;
}

function darkFoot(f) {
  need(!f.pair || (!f.points && !f.callout), 'foot: a pair of cards stands instead of the points strip and the callout');
  const parts = [];
  if (f.points) parts.push(points(f.points));
  if (f.callout) parts.push(callout(f.callout, true));
  if (f.pair) {
    const p = f.pair;
    need(Array.isArray(p.cards) && p.cards.length === 2, 'pair: { cards: [a, b] }');
    need(!p.split || V.pair['data-split'].values.includes(p.split), 'pair.split must be tail (or none)');
    parts.push(`<div class="report-pair rv"${attr('data-split', p.split)}>
${indent(p.cards.map(card).join('\n'), '  ')}
</div>`);
  }
  if (f.caveat) {
    need(f.caveat.text && f.caveat.icon, 'caveat: { text, icon }');
    parts.push(`<p class="report-caveat rv">
  <svg class="report-caveat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${f.caveat.icon}</svg>
  ${f.caveat.text}
</p>`);
  }
  if (f.media) {
    need(typeof f.media === 'string' && /^\s*<[a-z]/i.test(f.media), 'foot.media: the markup of the block (one root element)');
    need(!/^\s*<[a-z0-9]+[^>]*\sdata-slot=/i.test(f.media), 'foot.media: the template marks the slot itself');
    parts.push(f.media.trim().replace(/^<([a-z0-9]+)/i, '<$1 data-slot="media"'));
  }
  return parts;
}

function lightFoot(f) {
  for (const k of ['pair', 'caveat', 'media']) need(f[k] === undefined, `foot.${k} belongs to the dark surface`);
  need(Array.isArray(f.points) && f.points.length === 3 && f.callout, 'light: foot is { points: three { name, text, icon, tone }, callout: { text, icon } }');
  const c = calloutOf(f.callout);
  return [`<div class="report-foot">
  <ul class="report-points rv-kids" data-marker="icon">
${f.points.map(p => {
    need(p.name && p.text && p.icon && p.tone, 'a point: { name, text, icon, tone }');
    return `    <li class="report-point">
      ${tile.render({ tone: p.tone, icon: p.icon })}
      <h3 class="report-point-name">${p.name}</h3>
      <p class="report-point-text">${p.text}</p>
    </li>`;
  }).join('\n')}
  </ul>
  <div class="report-callout rv" data-tone="orange">
    ${tile.render({ tone: 'orange', icon: c.icon || INFO })}
    <p class="report-callout-text">${c.text}</p>
  </div>
</div>`];
}

/* ── the section ───────────────────────────────────────────────────────────── */
function section(o) {
  need(o && ['dark', 'light'].includes(o.surface), 'surface must be dark or light');
  need(V.section['data-space'].values.includes(o.space), 'space must be lg or md');
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  const dark = o.surface === 'dark';
  need(!o.tone || (o.tone === 'quiet' && dark), 'tone must be quiet (or none), on the dark surface');
  const quiet = o.tone === 'quiet';
  const m = o.mock || {};
  need(!m.lang || !quiet, 'mock.lang: not with the homepage\'s rendition');
  const mock = reportMock.mock({ pass: quiet, frame: !dark, lang: m.lang });
  const parts = [head(o), mock];
  if (o.foot) parts.push(...(dark ? darkFoot(o.foot) : lightFoot(o.foot)));
  const ground = !dark ? '' : quiet ? `
  <div class="report-bg">
    <div class="orb report-orb-cool"></div>
    <div class="orb report-orb-warm"></div>
  </div>` : `
  <div class="orb orb-dark-teal"></div>
  <div class="orb orb-dark-coral"></div>`;
  return `<section${attr('id', o.id)} data-component="report-showcase" class="report-showcase" ${dark ? 'data-surface="dark"' : 'data-bg="white"'} data-space="${o.space}"${attr('data-accent', o.accent)}${attr('data-tone', o.tone)}>${ground}
  <div class="report-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section };
