/* Section Header — the library primitive (build/sections/section-head.css).

   The eyebrow pill, the h2, the intro line and the quiet "more" link that open most
   sections. The parts are siblings inside the host's own column, not a wrapper of their
   own: the host decides where they sit (the FAQ puts them in its sticky aside).

     const sh = require('./sections/section-head');
     sh.render({
       eyebrow: 'Questions',                       // optional; its background follows the section's
       title: 'Pricing FAQ',                       // required, the h2 (inline HTML allowed)
       intro: 'Need help with an existing plan?',  // optional
       more: { label, href, rel, icon, bare },     // optional quiet link under the intro
     }, indent)

   more.bare: the link itself carries the spacing (the FAQ's fixed layout) instead of a
   <div class="section-more"> around it. more.icon: raw <svg> markup, copied as is. */

const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

const eyebrow = label =>
  `<div class="section-eyebrow">
  <span class="section-eyebrow-dot"></span>
  <span class="section-eyebrow-label">${label}</span>
</div>`;

const title = (text, { tag = 'h2', id } = {}) => `<${tag}${attr('id', id)} class="section-title">${text}</${tag}>`;

const intro = text => `<p class="section-intro">${text}</p>`;

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
  if (h.intro) parts.push(intro(h.intro));
  if (h.more) parts.push(more(h.more));
  return parts.join('\n').split('\n').map(l => (l ? pad + l : l)).join('\n');
}

module.exports = { render, eyebrow, title, intro, more };
