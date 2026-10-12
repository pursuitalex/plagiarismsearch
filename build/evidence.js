/* Evidence — the parts a page uses to show a real product screenshot as proof.

   Not a Section Library component (V1 is frozen): two page-level parts, first needed by
   the Canvas Integration page (new-tasks/new-page-7), written once so the next page that
   proves something with a screenshot does not draw them again.

     const ev = require('./evidence');

     ev.shot({ src, w, h, alt })               a screenshot as it is: <img>, sized, lazy
     ev.shot({ …, zoom: true })                the same inside a button that opens it
                                               enlarged (site.js, module zoom)
     ev.tabs({ ns, label, items })             a tab row and one panel a tab
       items: [{ tab: 'File Upload', panel: '<div>…</div>' }, …]

   CSS  build/assets/css/35-evidence.css      JS  build/assets/js/52-evidence.js

   WHAT A TAB DOES. It swaps one picture and its caption for another. It runs nothing,
   reads no form and changes no figure: every value on a screenshot is the screenshot's.

   WITHOUT SCRIPT every panel is shown, one under the other, and a screenshot is simply
   an image: the collapse and the enlarged view exist only under html.js.

   A screenshot is never redrawn here: src is the file as supplied, w and h are its own
   pixels (they reserve its place before it loads), and nothing is laid over its content
   — the "Enlarge" label sits on its corner and is not part of the picture. */

const need = (cond, msg) => { if (!cond) throw new Error('evidence: ' + msg); };
const esc = s => String(s).replace(/&(?![a-z]+;|#\d+;)/gi, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');

const ZOOM_ICON = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>';

/* a screenshot. eager: the first one on a page (the hero's) is not lazy */
function shot({ src, w, h, alt, zoom = false, eager = false, title, start }) {
  need(src && w && h, 'shot: { src, w, h } — the file and its own pixel size');
  need(alt, 'shot: alt — what the screenshot shows, as a sentence');
  need(!start || (zoom && start === 'end'), 'shot: start is "end" (or none), and goes with zoom');
  const img = `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
  if (!zoom) return img;
  /* title: the enlarged view's heading, the short name of the picture. start: 'end' —
     where the enlarged picture is wider than its view, it opens on its right-hand side */
  return `<button type="button" class="ev-zoom" data-zoom${title ? ` data-zoom-title="${esc(title)}"` : ''}${start ? ` data-zoom-start="${start}"` : ''}>
  ${img}
  <span class="ev-zoom-hint">${ZOOM_ICON}<span>Enlarge<span class="sr-only"> this screenshot</span></span></span>
</button>`;
}

/* the tab row and its panels. ns: the id namespace, unique on the page (as the FAQ's) */
function tabs({ ns, label, items }) {
  need(ns && label, 'tabs: { ns, label } — the id namespace and the row\'s name');
  need(Array.isArray(items) && items.length >= 2, 'tabs: at least two items');
  items.forEach(it => need(it && it.tab && typeof it.panel === 'string', 'tabs: each item is { tab, panel }'));
  return `<div class="ev-tabs" data-tabs>
  <div class="ev-tablist" role="tablist" aria-label="${esc(label)}">
${items.map((it, i) => `    <button type="button" role="tab" id="${ns}-tab-${i + 1}" aria-controls="${ns}-panel-${i + 1}" aria-selected="${i === 0}" class="ev-tab">${it.tab}</button>`).join('\n')}
  </div>
${items.map((it, i) => `  <div role="tabpanel" id="${ns}-panel-${i + 1}" aria-labelledby="${ns}-tab-${i + 1}" class="ev-panel${i === 0 ? ' is-active' : ''}">
${indent(it.panel.trim(), '    ')}
  </div>`).join('\n')}
</div>`;
}

module.exports = { shot, tabs };
