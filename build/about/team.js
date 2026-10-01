/* Team — the About page's profile card and the grid that holds it.

   PAGE-SPECIFIC: an About-page component, not a member of the Section Library (a library
   candidate after the pilot review). It is written in the library's manner — semantic
   classes, a content contract, a validator — so an editor can read and copy its markup,
   but it is not in the catalogue and build/check-library.js does not know it.

   CSS  build/about/team.css (compiled into tailwind.css, see sections/section-head.css)
   JS   none — the section is static; .rv is the shared reveal (build/assets/js/20-motion.js)
   Contract + validator  build/about/team.contract.js, build/about/team.check.js
                         (run by build/check-about.js)

   Two roots, one card:

     team.section(o)   the section          <section class="team" data-component="team" …>
     team.grid(o)      the grid alone       inside another component (authors, reviewers)

   Options
     id       the section's anchor id (section only)
     bg       'white' | 'tint'             (section) background; the photo plate and the
              eyebrow pill take the other one by themselves
     head     the Section Header (build/sections/section-head.js): eyebrow, title, intro
     people   [{ name, role, bio, photo, linkedin, initials }]
                name, role, bio   plain text (escaped here)
                photo             optional { src, alt, width, height } — a 4:5 portrait.
                                  Without it the plate shows the initials: an intentional
                                  placeholder, never a generated or stock face.
                linkedin          optional https://…linkedin.com/… address. Without it the
                                  icon is rendered inactive: a <span>, not a link.
                initials          optional override (default: first letters of the name)
     reveal   false: no .rv on the head and the cards

   Every card is the same size and carries the same parts in the same order — photo, name,
   role, bio, LinkedIn — so no profile outweighs another. The order is also what the phone
   and tablet layouts place by (team.css). */
const sh = require('../sections/section-head');

const need = (cond, msg) => { if (!cond) throw new Error('team: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => esc(s).replace(/"/g, '&quot;');

/* Lucide "linkedin", in the system's 24px box */
const LINKEDIN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>';
const LINKEDIN_URL = /^https:\/\/(?:[a-z0-9-]+\.)?linkedin\.com\/\S+$/i;

const initials = name => name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
const label = name => 'LinkedIn profile of ' + name;

/* the photo plate: the portrait, or the initials until there is one */
function photo(p) {
  if (!p.photo) return `<div class="team-photo"><span class="team-initials" aria-hidden="true">${esc(p.initials || initials(p.name))}</span></div>`;
  need(p.photo.src, 'a photo needs src: ' + p.name);
  return `<div class="team-photo"><img class="team-photo-img" src="${attr(p.photo.src)}" alt="${attr(p.photo.alt || p.name)}" width="${p.photo.width || 800}" height="${p.photo.height || 1000}" loading="lazy" decoding="async"></div>`;
}

/* the LinkedIn icon: a link when there is an address, an inactive mark when there is not */
function linkedin(p) {
  if (!p.linkedin) return `<span class="team-linkedin" aria-hidden="true">${LINKEDIN}</span>`;
  need(LINKEDIN_URL.test(p.linkedin), 'linkedin must be an https://…linkedin.com/… address: ' + p.linkedin);
  return `<a class="team-linkedin" href="${attr(p.linkedin)}" rel="noopener" aria-label="${attr(label(p.name))}">${LINKEDIN}</a>`;
}

function card(p, o = {}) {
  need(p && p.name && p.role && p.bio, 'a person needs name, role and bio: ' + JSON.stringify(p && p.name));
  return `<li class="team-card${o.reveal === false ? '' : ' rv'}">
  ${photo(p)}
  <h3 class="team-name">${esc(p.name)}</h3>
  <p class="team-role">${esc(p.role)}</p>
  <p class="team-bio">${esc(p.bio)}</p>
  ${linkedin(p)}
</li>`;
}

/* the grid alone, inside another component */
function grid(o) {
  need(Array.isArray(o.people) && o.people.length, 'people are required');
  return `<ul class="team-grid" role="list">
${o.people.map(p => indent(card(p, o), '  ')).join('\n')}
</ul>`;
}

/* the section */
function section(o) {
  need(['white', 'tint'].includes(o.bg), 'bg must be white or tint');
  need(o.head && o.head.title, 'head.title is required');
  return `<section${o.id ? ` id="${o.id}"` : ''} data-component="team" class="team" data-bg="${o.bg}">
  <div class="team-inner">
    <div class="team-head${o.reveal === false ? '' : ' rv'}">
${sh.render(o.head, '      ')}
    </div>
${indent(grid(o), '    ')}
  </div>
</section>`;
}

module.exports = { section, grid, card, initials, label, LINKEDIN, LINKEDIN_URL };
