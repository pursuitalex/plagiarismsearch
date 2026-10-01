/* Section Header — the library primitive (build/sections/section-head.css).

   The eyebrow pill, the h2, the intro line and the quiet "more" link that open most
   sections. The parts are siblings inside the host's own column, not a wrapper of their
   own: the host decides where they sit (the FAQ puts them in its sticky aside).

     const sh = require('./sections/section-head');
     sh.render({
       eyebrow: 'Questions',                       // optional; its background follows the section's
       title: 'Pricing FAQ',                       // required, the h2 (inline HTML allowed)
       intro: 'Need help with an existing plan?',  // optional
       introMeasure: '72',                         // optional: the intro's longest line, in characters
       more: { label, href, rel, icon, bare },     // optional quiet link under the intro
     }, indent)

   more.bare: the link itself carries the spacing (the FAQ's fixed layout) instead of a
   <div class="section-more"> around it. more.icon: raw <svg> markup, copied as is.

     sh.block({ eyebrow, title, intro, measure })  // the head as a block of its own, above a
                                                   // section's content: <div class="section-head rv">
   measure: the block's width in px ('720' | '760' | '860'; none: 820). */

const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

const eyebrow = label =>
  `<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">${label}</span>
</div>`;

const title = (text, { tag = 'h2', id } = {}) => `<${tag}${attr('id', id)} class="section-title">${text}</${tag}>`;

const intro = (text, measure) => `<p class="section-intro"${attr('data-measure', measure)}>${text}</p>`;

const more = ({ label, href, rel, icon, bare }) => {
  const a = (cls, inner) => `<a href="${href}"${attr('rel', rel)} class="${cls}">${inner}</a>`;
  if (bare) return a('section-more section-link', icon ? `\n  ${icon}\n  ${label}\n` : label);
  return `<div class="section-more">${a('section-link', icon ? `${icon}${label}` : label)}</div>`;
};

/* every part, in order, each line indented by `pad` */
function render(h, pad = '') {
  if (!h || !h.title) throw new Error('section-head: a title is required');
  const parts = [];
  if (h.eyebrow) parts.push(eyebrow(h.eyebrow));
  parts.push(title(h.title, { tag: h.tag, id: h.titleId }));
  if (h.intro) parts.push(intro(h.intro, h.introMeasure));
  if (h.more) parts.push(more(h.more));
  return parts.join('\n').split('\n').map(l => (l ? pad + l : l)).join('\n');
}

/* the head as a block of its own: the parts in one column, with the gap to the content
   under it (.section-head, section-head.css) */
const MEASURES = ['720', '760', '860'];
function block(h) {
  if (h.measure !== undefined && !MEASURES.includes(String(h.measure))) throw new Error('section-head: measure must be one of ' + MEASURES.join(', ') + ' (or none: 820)');
  if (h.more) throw new Error('section-head: a head block has no more link (the host places its own foot)');
  return `<div class="section-head rv"${attr('data-measure', h.measure)}>
${render(h, '  ')}
</div>`;
}

module.exports = { render, block, eyebrow, title, intro, more, MEASURES };
