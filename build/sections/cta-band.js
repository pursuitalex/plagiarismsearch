/* CTA band — library component. One template for the closing band of every page.

   CSS  build/sections/cta-band.css (compiled into tailwind.css, see section-head.css);
        the recipe — dot field, two glows, one ring mark, the hero-scale heading — is
        written down there and in DESIGN.md § The closing CTA band
   JS   build/assets/js/20-motion.js — hooks .rv and .ring-word (nothing of its own)
   Contract + validator  build/sections/cta-band.contract.js, cta-band.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const cta = require('./sections/cta-band');
     cta.section({
       id: 'student-cta',                  // optional anchor
       title: 'Check your paper before you submit',
       ring: 'before you',                 // the words the ring loops; about ten characters
       lead: '…',  measure: '62',          // the lead and its longest line, in characters
       actions: {
         button: { label, href, icon: 'spark' },   // the one dark button; icon: 'spark' | 'code'
         link: { label, href },                    // + a quiet link beside it
       },
     })

   Options — the signature band
     width     'wide': the 920px column (the Ukrainian page)
     eyebrow   the pill above the title, with the pulsing dot (the homepage)
     kicker    a line ABOVE the title; such a band has no lead (the Affiliate page)
     title     required; ring: required, a fragment of the title
     lead      the line under the title; measure: its longest line, '46' … '62' characters or
               '560px' (the contract lists the values; default 58)
     actions   button: { label, href, icon }                      always
               layout: 'stack' + hint: 'text'       the line with the spark under the button
               layout: 'pair' + secondary: { label, href }   two buttons at the 48 / 56px size
               (no layout) + link: { label, href }  a quiet link beside the button
     note      a line under the actions: 'text' (emphatic), or
               { text, link: { label, href } } — the small grey one, with a link at its end

   Options — variant: 'plain' (the older hand-written pages)
     title, lead, measure (default 46), button: { label, href, tone: 'orange' }

   Every external href gets rel="noopener". The text is written as given: escape it first
   if it is not already HTML. */

const ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const SPARK_PATH = '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>';
const svg = (size, stroke, inner, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
/* the icon a button may open with */
const ICONS = {
  spark: svg(16, '#F58971', SPARK_PATH),
  code: svg(16, '#F58971', '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>'),
};
const HINT_ICON = svg(15, '#DC5A45', SPARK_PATH, 'cta-hint-icon');

/* the variant values are the contract's */
const C = require('./cta-band.contract');
const MEASURES = C.variants.lead['data-measure'].values;
const LAYOUTS = C.variants.actions['data-layout'].values;

const need = (cond, msg) => { if (!cond) throw new Error('cta-band: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

/* ── the ground: dot field under the two glows (the signature band) ─────────── */
const background = () => `<div class="cta-band-bg">
  <div class="dot-field cta-band-dots" aria-hidden="true"></div>
  <div class="orb cta-glow-warm"></div>
  <div class="orb cta-glow-cool"></div>
</div>`;

/* ── the ring mark ────────────────────────────────────────────────────────────
   Applied at render, never stored in the approved-copy object: the briefs freeze the
   heading as one plain string, and every page checker compares it with tags stripped.
   The loop is drawn for a word of about ten characters — "plagiarism" on the homepage.
   The SVG is sized in percentages of the span, so a much shorter or much longer phrase
   distorts the loop into an egg. Pick a fragment near that length. */
const RING = '<svg class="ring-mark" viewBox="0 0 230 100" fill="none" aria-hidden="true"><path class="ring-path" d="M30,62 C22,30 78,8 128,10 C182,12 216,32 212,58 C207,86 142,96 88,92 C44,88 18,76 26,50 C30,36 48,24 66,20" stroke="#F36F5A" stroke-opacity=".5" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ring = (text, phrase) => {
  need(phrase && text.includes(phrase), `ring: "${phrase}" is not in "${text}"`);
  return text.replace(phrase, `<span class="ring-word">${phrase}${RING}</span>`);
};

/* ── the parts ─────────────────────────────────────────────────────────────── */
const eyebrow = label => `<div class="section-eyebrow rv">
  <span class="section-eyebrow-dot pulse-dot"></span>
  <span class="section-eyebrow-label">${label}</span>
</div>`;

const measured = o => {
  if (o.measure === undefined) return '';
  need(MEASURES.includes(String(o.measure)), `measure must be one of ${MEASURES.join(', ')}: ${o.measure}`);
  return ` data-measure="${o.measure}"`;
};

/* the dark button with its arrow orb; `extra`: more classes (the plain band's .rv) */
const button = (b, extra = '') => {
  need(b && b.label && b.href, 'a button needs label and href');
  need(!b.icon || ICONS[b.icon], 'button icon must be one of ' + Object.keys(ICONS).join(', '));
  need(!b.tone || b.tone === 'orange', 'button tone must be orange (or none)');
  return `<a href="${b.href}"${rel(b.href)} class="cta-button btn-press group${extra}"${attr('data-tone', b.tone)}>${b.icon ? '\n  ' + ICONS[b.icon] : ''}
  ${b.label}
  <span class="cta-button-orb icon-orb">${ARROW}</span>
</a>`;
};

function actions(a) {
  need(a && a.button, 'actions.button is required');
  need(!a.layout || LAYOUTS.includes(a.layout), 'actions.layout must be one of ' + LAYOUTS.join(', '));
  need(!a.hint || a.layout === 'stack', 'actions.hint goes with layout: stack');
  need(!a.secondary === (a.layout !== 'pair'), 'actions.secondary goes with layout: pair, and a pair needs it');
  need(!a.link || !a.layout, 'actions.link goes with the row (no layout)');
  need(!a.button.tone, 'a button tone belongs to the plain band');
  const parts = [button(a.button)];
  if (a.link) parts.push(`<a href="${a.link.href}"${rel(a.link.href)} class="cta-link">${a.link.label}</a>`);
  if (a.hint) parts.push(`<p class="cta-hint">\n  ${HINT_ICON}\n  ${a.hint}\n</p>`);
  if (a.secondary) parts.push(`<a href="${a.secondary.href}"${rel(a.secondary.href)} class="cta-button-secondary btn-press">${a.secondary.label}</a>`);
  return `<div class="cta-actions rv"${attr('data-layout', a.layout)}>
${indent(parts.join('\n'), '  ')}
</div>`;
}

function note(n) {
  if (typeof n === 'string') return `<p class="cta-note rv">${n}</p>`;
  need(n.text && n.link && n.link.label && n.link.href, 'note: { text, link: { label, href } }');
  return `<p class="cta-note rv" data-tone="quiet">${n.text} <a href="${n.link.href}"${rel(n.link.href)} class="cta-note-link">${n.link.label}</a></p>`;
}

/* ── the section ───────────────────────────────────────────────────────────── */
function plain(o) {
  for (const k of ['width', 'eyebrow', 'kicker', 'ring', 'actions', 'note']) need(o[k] === undefined, `${k} does not belong to the plain band`);
  need(o.lead, 'the plain band needs a lead');
  return `<section${attr('id', o.id)} data-component="cta-band" class="cta-band" data-variant="plain">
  <div class="orb cta-orb-warm"></div>
  <div class="orb cta-orb-cool"></div>
  <div class="cta-band-inner">
    <h2 class="cta-title rv">${o.title}</h2>
    <p class="cta-lead rv"${measured(o)}>${o.lead}</p>
${indent(button(o.button, ' rv'), '    ')}
  </div>
</section>`;
}

function section(o) {
  need(o && o.title, 'a title is required');
  need(!o.variant || o.variant === 'plain', 'variant must be plain (or none)');
  if (o.variant === 'plain') return plain(o);
  need(o.button === undefined, 'the signature band takes actions: { button }, not button');
  need(!o.width || o.width === 'wide', 'width must be wide (or none)');
  need(!(o.kicker && o.lead), 'a band has a kicker above the title or a lead under it, not both');
  const parts = [];
  if (o.eyebrow) parts.push(eyebrow(o.eyebrow));
  if (o.kicker) parts.push(`<p class="cta-kicker rv">${o.kicker}</p>`);
  parts.push(`<h2 class="cta-title rv">${ring(o.title, o.ring)}</h2>`);
  if (o.lead) parts.push(`<p class="cta-lead rv"${measured(o)}>${o.lead}</p>`);
  else need(o.measure === undefined, 'measure without a lead');
  parts.push(actions(o.actions));
  if (o.note) parts.push(note(o.note));
  return `<section${attr('id', o.id)} data-component="cta-band" class="cta-band"${attr('data-width', o.width)}>
${indent(background(), '  ')}
  <div class="cta-band-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section, background, ring, button, ICONS };
