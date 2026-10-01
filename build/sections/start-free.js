/* Start free — library component. One template for the free entry: the two free limits as
   figures beside the sentence that states them, a button back to the checker and a quiet
   link to the prices. Never a price or a matrix.

   CSS  build/sections/start-free.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/20-motion.js (.rv, .rv-kids); 30-checker.js — a link to the
        checker's anchor puts the caret in its field (nothing of its own)
   Contract + validator  build/sections/start-free.contract.js, start-free.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const startFree = require('./sections/start-free');
     startFree.section({
       id: 'start-free',                       // optional anchor
       layout: 'open',                         // 'open' | 'framed'
       space: 'lg',                            // 'lg' (lg:py-32) | 'md' (lg:py-28)
       head: { eyebrow, title, intro },        // intro: one paragraph, or [one, two]
       button: { label, href },                // back to the page's checker
       link: { label, href },                  // optional quiet link (the prices)
       figures: [{ value, label, sub }, { value, label, sub }],   // the light one, then the dark one
       note: { icon, text },                   // framed only: a line under the figures
       stagger: '.06',                         // open only: the figures' reveal beat (the Ukrainian page)
     })

   Every external href gets rel="noopener". The text is written as given: escape it first
   if it is not already HTML. */
const sh = require('./section-head');
const action = require('./action');

/* the variant values are the contract's */
const C = require('./start-free.contract');
const V = C.variants;

const need = (cond, msg) => { if (!cond) throw new Error('start-free: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

function section(o) {
  need(o && o.head && o.head.title, 'head: { title } is required');
  need(V.section['data-layout'].values.includes(o.layout), 'layout must be open or framed');
  need(V.section['data-space'].values.includes(o.space), 'space must be lg or md');
  const framed = o.layout === 'framed';
  const intros = [].concat(o.head.intro || []);
  need(intros.length >= 1 && intros.length <= 2, 'head.intro: one paragraph, or two');
  need(o.button && o.button.label && o.button.href, 'button: { label, href } is required');
  need(Array.isArray(o.figures) && o.figures.length === 2, 'figures: exactly two (the light one, then the dark one)');
  need(!o.note || framed, 'note goes with layout: framed');
  need(!o.stagger || (!framed && V.list['data-stagger'].values.includes(String(o.stagger))), 'stagger (.06) goes with layout: open');

  const head = [sh.render({ eyebrow: o.head.eyebrow, title: o.head.title })].concat(intros.map(p => sh.intro(p)));
  const acts = [action.button(o.button)];
  if (o.link) acts.push(`<a href="${o.link.href}"${rel(o.link.href)} class="section-link">${o.link.label}</a>`);
  const text = `<div class="start-free-text${framed ? '' : ' rv'}">
${indent(head.join('\n'), '  ')}
  <div class="start-free-actions">
${indent(acts.join('\n'), '    ')}
  </div>
</div>`;

  const figure = (f, i) => {
    need(f && f.value && f.label && f.sub, 'a figure: { value, label, sub }');
    return `<div class="start-free-figure" data-tone="${i ? 'dark' : 'teal'}"${i ? ' data-surface="dark"' : ''}>
  <p class="start-free-value">${f.value}</p>
  <p class="start-free-label">${f.label}</p>
  <p class="start-free-sub">${f.sub}</p>
</div>`;
  };
  const note = o.note ? `\n  <p class="start-free-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${o.note.icon}</svg>${o.note.text}</p>` : '';
  need(!o.note || (o.note.icon && o.note.text), 'note: { icon, text }');
  const figures = `<div${attr('data-stagger', o.stagger)} class="start-free-figures${framed ? '' : ' rv-kids'}">
${indent(o.figures.map(figure).join('\n'), '  ')}${note}
</div>`;

  const grid = `<div class="start-free-grid">
${indent(text + '\n' + figures, '  ')}
</div>`;
  return `<section${attr('id', o.id)} data-component="start-free" class="start-free" data-layout="${o.layout}" data-bg="white" data-space="${o.space}">
  <div class="start-free-inner">
${indent(framed ? `<div class="start-free-frame rv">\n${indent(grid, '  ')}\n</div>` : grid, '    ')}
  </div>
</section>`;
}

module.exports = { section };
