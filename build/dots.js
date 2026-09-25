/* The dot field — the texture under the hero tint and the closing CTA band.

   One SVG <pattern>: a 22px cell with a 2×2 rounded square in #DAE7ED. It is what keeps
   a tinted section from reading as an empty coloured rectangle — the hero is mostly
   air, and the dots give that air a texture to sit on. A <pattern> rather than a
   repeating background-image so it stays crisp at any zoom and costs one rasterisation.
   It must sit UNDER the orbs: dots over glow read as dirt on glass.

   The homepage hero had it (build/home-v2.js) and the other heroes on the same tint did
   not — the same block, minus its texture. So the helper lives here and every hero on
   #F2FCFC calls it:

     const { dots } = require('./dots');
     <section class="relative … bg-[#F2FCFC] overflow-hidden">
       ${dots('heroDots')}      ← first child, before the orbs
       <div class="orb …"></div>

   `id` scopes the pattern so two fields on one page (hero + closing band) cannot collide
   over the same fragment reference. */

const DOT = { size: 2, radius: .65, grid: 22, colour: '#DAE7ED' };

const dots = id => `<svg class="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="${id}" width="${DOT.grid}" height="${DOT.grid}" patternUnits="userSpaceOnUse">
            <rect width="${DOT.size}" height="${DOT.size}" rx="${DOT.radius}" fill="${DOT.colour}"></rect>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#${id})"></rect>
      </svg>`;

/* STATIC MODE — the same field as a CSS background (.dot-field in build/assets/css/
   01-base.css): no <pattern>, so no id, so a section can be pasted twice on one page. */
const dotField = () => `<div class="dot-field absolute inset-0" aria-hidden="true"></div>`;

module.exports = { dots, dotField, DOT };
