/* Icon tile — the library primitive (build/sections/icon-tile.css).

   The 44px rounded tile with a Lucide icon in it, in one of four tones. The tone sets
   both the tile's wash and the icon's ink (the CSS sets the stroke), so the icon is
   written with stroke="currentColor" and an editor changes one attribute.

     const tile = require('./sections/icon-tile');
     tile.render({ tone: 'teal', icon: '<path d="…"/>' })   // icon: the inner markup of a 24×24 <svg>
     tile.render({ tone, icon, size: 19 })                  // the icon's size (default 20)
     tile.render({ tone, icon, variant: 'ring' })           // the homepage's tile: a hairline in the tone

   Hosted by components: a host may restyle the tile from its own side (the rail's ring
   in the section ground's colour). */

const TONES = ['teal', 'ink', 'orange', 'mint'];
const VARIANTS = ['ring'];

const need = (cond, msg) => { if (!cond) throw new Error('icon-tile: ' + msg); };

const icon = (paths, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

function render(t) {
  need(t && TONES.includes(t.tone), 'tone must be one of ' + TONES.join(', '));
  need(t.icon, 'an icon (the inner markup of a 24×24 svg) is required');
  need(!t.variant || VARIANTS.includes(t.variant), 'variant must be one of ' + VARIANTS.join(', ') + ' (or none)');
  return `<span class="icon-tile" data-tone="${t.tone}"${t.variant ? ` data-variant="${t.variant}"` : ''}>${icon(t.icon, t.size)}</span>`;
}

module.exports = { render, icon, TONES, VARIANTS };
