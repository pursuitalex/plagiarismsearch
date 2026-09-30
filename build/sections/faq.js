/* FAQ — library component. One template for every FAQ on the site.

   CSS  build/sections/faq.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/50-faq.js — hooks [data-faq], .faq-item, .faq-q, .open
   Contract + validator  build/sections/faq.contract.js, build/check-library.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

   Three roots, one markup:

     faq.section(o)   the section            <section class="faq" data-component="faq" …>
     faq.grid(o)      the head + list grid   inside another component (the user guide)
     faq.frame(o)     the list alone         inside a guide's reading column (Moodle)

   Options
     id        the section's anchor id (section only)
     ns        REQUIRED: the accessibility namespace. Answer n gets id="<ns>-a<n>" and its
               button aria-controls="<ns>-a<n>", written here, never by script. Unique per page.
     bg        'white' | 'tint'                          (section) background
     space     'lg' (lg:py-32) | 'md' (lg:py-28)          (section) vertical padding
     layout    'fluid' (0.85fr/1.15fr) | 'fluid-narrow' (0.8fr/1.2fr) | 'fixed' (380px/1fr)
     head      the Section Header (build/sections/section-head.js): eyebrow, eyebrowBg,
               title, intro, introSize, more. In the fixed layout the more link is bare.
     aside     optional extra markup under the head (another library block, e.g. a contact card)
     items     [{ q, a }]           a one-paragraph answer (inline HTML: a.faq-link, strong, em, br)
               [{ q, paras: [..] }] a rich answer: several paragraphs
               link: { label, href, target, rel, icon }   a follow-up link under the answer
     rich      true: every answer is written as a rich answer (a <div> of paragraphs), as
               the Turnitin and Moodle pages were approved; false: one-paragraph answers
               are a single <p class="faq-a-body">
     heading   'h3': each question button sits in <h3 class="faq-heading"> (the guide's outline)
     variant   'doc' (frame only): the guide's compact sizes, body colour and link
     reveal    false: no .rv on the aside and the frame (the user guide carries none)
     hostClass (grid only) the host's spacing utilities on the grid root — margins only

   The first answer renders open (class "open", aria-expanded="true"); the rest closed.
   Without JS every answer is visible: the collapse exists only under html.js (faq.css). */
const sh = require('./section-head');

const LAYOUTS = ['fluid', 'fluid-narrow', 'fixed'];
const CHEVRON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

const need = (cond, msg) => { if (!cond) throw new Error('faq: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');

function answerLink(l) {
  const inner = l.icon ? `<span>${l.label}</span><span class="faq-a-link-icon">${l.icon}</span>` : l.label;
  return `<p class="faq-a-more"><a href="${l.href}"${l.target ? ` target="${l.target}"` : ''}${l.rel ? ` rel="${l.rel}"` : ''} class="faq-a-link">${inner}</a></p>`;
}

function answer(item, rich) {
  const paras = item.paras || [item.a];
  need(paras.length && paras.every(p => typeof p === 'string' && p.trim()), 'an answer needs text: ' + item.q);
  if (!rich && paras.length === 1 && !item.link) return `<p class="faq-a-body">${paras[0]}</p>`;
  return `<div class="faq-a-body">
  ${paras.map(p => `<p>${p}</p>`).join('\n  ')}${item.link ? '\n  ' + answerLink(item.link) : ''}
</div>`;
}

function item(it, i, o) {
  const id = `${o.ns}-a${i + 1}`;
  const open = i === 0;
  const button = `<button type="button" aria-controls="${id}" aria-expanded="${open}" class="faq-q">
  <span class="faq-q-text">${it.q}</span>
  <span class="faq-chev">${CHEVRON}</span>
</button>`;
  return `<div class="faq-item${open ? ' open' : ''}">
${indent(o.heading ? `<${o.heading} class="faq-heading">${button}</${o.heading}>` : button, '  ')}
  <div class="faq-a" id="${id}"><div>${answer(it, o.rich).split('\n').map((l, k) => (k ? '  ' + l : l)).join('\n')}</div></div>
</div>`;
}

/* the list in its frame — the part every root shares */
function frame(o) {
  need(o.ns && /^[a-z][a-z0-9-]*$/.test(o.ns), 'ns (the id namespace) is required: a-z, 0-9 and hyphens: ' + o.ns);
  need(Array.isArray(o.items) && o.items.length, 'items are required');
  need(!o.variant || o.variant === 'doc', 'unknown frame variant ' + o.variant);
  need(!o.heading || /^h[2-6]$/.test(o.heading), 'heading must be h2–h6');
  const cls = 'faq-frame' + (o.reveal === false ? '' : ' rv');
  return `<div class="${cls}"${o.variant ? ` data-variant="${o.variant}"` : ''}>
  <div class="faq-list" data-faq>
${o.items.map((it, i) => indent(item(it, i, o), '    ')).join('\n')}
  </div>
</div>`;
}

function aside(o) {
  const head = { ...o.head };
  if (head.more) head.more = { ...head.more, bare: o.layout === 'fixed' };
  return `<div class="faq-aside${o.reveal === false ? '' : ' rv'}">
${sh.render(head, '  ')}${o.aside ? '\n' + indent(o.aside, '  ') : ''}
</div>`;
}

function body(o) {
  return `${aside(o)}
${frame(o)}`;
}

/* the head + list grid, inside another component */
function grid(o) {
  need(LAYOUTS.includes(o.layout), 'layout must be one of ' + LAYOUTS.join(', '));
  need(!o.hostClass || o.hostClass.split(/\s+/).every(c => /^(?:(?:sm|md|lg|xl):)?-?m[tbyxlr]?-/.test(c)), 'hostClass: margins only');
  return `<div class="faq-grid${o.hostClass ? ' ' + o.hostClass : ''}" data-layout="${o.layout}">
${indent(body(o), '  ')}
</div>`;
}

/* the section */
function section(o) {
  need(['white', 'tint'].includes(o.bg), 'bg must be white or tint');
  need(['lg', 'md'].includes(o.space), 'space must be lg or md');
  need(LAYOUTS.includes(o.layout), 'layout must be one of ' + LAYOUTS.join(', '));
  return `<section${o.id ? ` id="${o.id}"` : ''} data-component="faq" class="faq" data-bg="${o.bg}" data-space="${o.space}" data-layout="${o.layout}">
  <div class="faq-inner">
    <div class="faq-grid">
${indent(body(o), '      ')}
    </div>
  </div>
</section>`;
}

module.exports = { section, grid, frame, CHEVRON };
