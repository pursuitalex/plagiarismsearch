/* Timeline — the About page's run of dated milestones, in order.

   PAGE-SPECIFIC: an About-page component, not a member of the Section Library (a library
   candidate after the pilot review). Written in the library's manner — semantic classes,
   a content contract, a validator — but not in the catalogue, and build/check-library.js
   does not know it.

   CSS  build/about/timeline.css (compiled into tailwind.css, see sections/section-head.css)
   JS   none — the section is static; .rv is the shared reveal
   Contract + validator  build/about/timeline.contract.js, build/about/timeline.check.js
                         (run by build/check-about.js)

     timeline.section(o)   <section class="timeline" data-component="timeline" …>

   Options
     id       the section's anchor id
     bg       'white' | 'tint'      background; the eyebrow pill takes the other one itself
     head     the Section Header (build/sections/section-head.js): eyebrow, title, intro
     items    [{ year, title, text }]   plain text (escaped here), in chronological order
     reveal   false: no .rv on the head and the items

   An ordered list: one column down a rail on a phone, three across from 640, all in one
   row from 1280 (the row is drawn for about six milestones). It never scrolls sideways. */
const sh = require('../sections/section-head');

const need = (cond, msg) => { if (!cond) throw new Error('timeline: ' + msg); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function item(it, o = {}) {
  need(it && it.year && it.title && it.text, 'a milestone needs year, title and text: ' + JSON.stringify(it));
  return `<li class="timeline-item${o.reveal === false ? '' : ' rv'}">
  <p class="timeline-year">${esc(it.year)}</p>
  <h3 class="timeline-title">${esc(it.title)}</h3>
  <p class="timeline-text">${esc(it.text)}</p>
</li>`;
}

function section(o) {
  need(['white', 'tint'].includes(o.bg), 'bg must be white or tint');
  need(o.head && o.head.title, 'head.title is required');
  need(Array.isArray(o.items) && o.items.length >= 2, 'at least two milestones');
  return `<section${o.id ? ` id="${o.id}"` : ''} data-component="timeline" class="timeline" data-bg="${o.bg}">
  <div class="timeline-inner">
    <div class="timeline-head${o.reveal === false ? '' : ' rv'}">
${sh.render(o.head, '      ')}
    </div>
    <ol class="timeline-list" role="list">
${o.items.map(it => item(it, o).split('\n').map(l => '      ' + l).join('\n')).join('\n')}
    </ol>
  </div>
</section>`;
}

module.exports = { section, item };
