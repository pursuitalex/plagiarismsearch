/* Action — the library primitive (build/sections/action.css).

   The in-section actions: the pill button with its arrow orb, and the quiet link beside
   it. Hosted by components — each host places them (a row, the foot of a card) and
   spaces them; its check validates them (check-tools.js: actionButton, actionLink).

     const action = require('./sections/action');
     action.button({ label, href, tone })   // tone: 'light' | 'ghost' | 'inverse' (none: dark)
     action.link({ label, href })           // the quiet link beside a button

   Every external href gets rel="noopener". The label is written as given. */

const TONES = ['light', 'ghost', 'inverse'];
const arrow = size => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

const need = (cond, msg) => { if (!cond) throw new Error('action: ' + msg); };
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

function button(b) {
  need(b && b.label && b.href, 'a button needs label and href');
  need(!b.tone || TONES.includes(b.tone), 'tone must be one of ' + TONES.join(', ') + ' (or none)');
  return `<a href="${b.href}"${rel(b.href)} class="action-button btn-press group"${b.tone ? ` data-tone="${b.tone}"` : ''}>
  ${b.label}
  <span class="action-button-orb icon-orb">${arrow(b.tone === 'ghost' || b.tone === 'inverse' ? 16 : 14)}</span>
</a>`;
}

function link(l) {
  need(l && l.label && l.href, 'a link needs label and href');
  return `<a href="${l.href}"${rel(l.href)} class="action-link">${l.label}</a>`;
}

module.exports = { button, link, TONES };
