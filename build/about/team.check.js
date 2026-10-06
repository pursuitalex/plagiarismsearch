/* Team — the validator's rules (contract: build/about/team.contract.js).

   PAGE-SPECIFIC: run by build/check-about.js on site/about-us.html, not by the Section
   Library validator. Per Team found (a section.team, or a ul.team-grid on its own inside
   another component):
     structure   section → .team-inner → .team-head + ul.team-grid → li.team-card, and in
                 each card exactly: photo, name, role, bio, LinkedIn — in that order
     classes     only the contract's classes; a Tailwind utility is named as such
     variants    data-bg present, with an allowed value
     photo       the initials placeholder, or an <img> with src, alt and a 4:5 size
     LinkedIn    the inactive <span>, or an <a> to linkedin.com with rel="noopener" and an
                 aria-label — never href="#" or another network
     content     name and role text only; the bio limited to strong, em, br; nothing empty;
                 a bio outside 25–55 words is a warning (25, not the brief's 30: the correction pack of
                 2026-10-05 took a sentence from two bios and asked for nothing in its place)
     safety      no style="", no on* handlers, no <script>/<style>
   Plus, for the whole input: no Team part outside a recognised Team. */
const C = require('./team.contract');
const { LINKEDIN_URL } = require('./team');
const { kids, cls, has, textOf, walk, inside, label, words, rules } = require('./check-tools');

function checkCard(li, R) {
  if (!R.part(li, 'a profile', C.classes.card, 'li')) return;
  R.onlyAttrs(li, { class: true }); R.noText(li);
  const [photo, name, role, bio, social, ...rest] = kids(li);
  if (kids(li).length !== 5) R.E(li, `${label(li)}: a profile holds exactly five parts, in order: .team-photo, h3.team-name, p.team-role, p.team-bio, .team-linkedin (found ${kids(li).length})`);

  if (photo && R.part(photo, 'the photo plate', C.classes.photo, 'div')) {
    R.onlyAttrs(photo, { class: true }); R.noText(photo);
    const pk = kids(photo);
    if (pk.length !== 1) R.E(photo, `${label(photo)}: holds exactly one element — span.team-initials or img.team-photo-img`);
    else if (pk[0].tag === 'img') {
      const img = pk[0];
      R.part(img, 'the photo', C.classes.img, 'img');
      R.onlyAttrs(img, { class: true, src: true, alt: true, width: /^\d+$/, height: /^\d+$/, loading: /^(lazy|eager)$/, decoding: /^(async|auto|sync)$/, srcset: true, sizes: true });
      if (!(img.attrs.src || '').trim() || /^\s*javascript:/i.test(img.attrs.src)) R.E(img, `${label(img)}: the photo needs a src`);
      if (!(img.attrs.alt || '').trim()) R.E(img, `${label(img)}: the photo needs alt text — the person's name`);
      const w = +img.attrs.width, h = +img.attrs.height;
      if (!w || !h) R.E(img, `${label(img)}: width and height are required (they hold the 4:5 plate before the photo loads)`);
      else if (Math.abs(w / h - 0.8) > 0.02) R.W(img, `${label(img)}: ${w}×${h} is not 4:5 — the plate will crop the photo`);
    } else {
      const ini = pk[0];
      if (R.part(ini, 'the initials', C.classes.initials, 'span')) {
        R.onlyAttrs(ini, { class: true, 'aria-hidden': 'true' }); R.requireAttrs(ini, { 'aria-hidden': 'true' });
        R.inlineOnly(ini, [], 'the initials');
        const t = textOf(ini).trim();
        if (!t || t.length > 3) R.E(ini, `${label(ini)}: the initials are one to three letters`);
      }
    }
  }

  let person = '';
  if (name && R.part(name, 'the name', C.classes.name, 'h3')) {
    R.onlyAttrs(name, { class: true }); R.inlineOnly(name, C.inline.name, 'the name'); R.filled(name, 'the name');
    person = textOf(name).trim();
  }
  if (role && R.part(role, 'the role', C.classes.role, 'p')) {
    R.onlyAttrs(role, { class: true }); R.inlineOnly(role, C.inline.role, 'the role'); R.filled(role, 'the role');
  }
  if (bio && R.part(bio, 'the bio', C.classes.bio, 'p')) {
    R.onlyAttrs(bio, { class: true }); R.inlineOnly(bio, C.inline.bio, 'the bio'); R.filled(bio, 'the bio');
    const n = words(textOf(bio));
    if (n && (n < 25 || n > 55)) R.W(bio, `${label(bio)}: the bio is ${n} words — profiles are kept even at 25–55`);
  }

  if (social && has(social, 'team-linkedin')) {
    R.onlyClasses(social, C.classes.linkedin); R.noText(social);
    const sk = kids(social);
    if (sk.length !== 1) R.E(social, `${label(social)}: holds only the LinkedIn <svg>`);
    R.icon(sk[0], social);
    if (social.tag === 'span') {
      R.onlyAttrs(social, { class: true, 'aria-hidden': 'true' }); R.requireAttrs(social, { 'aria-hidden': 'true' });
    } else if (social.tag === 'a') {
      R.onlyAttrs(social, { class: true, href: true, rel: true, target: /^_blank$/, 'aria-label': true });
      R.link(social);
      if (social.attrs.href && !LINKEDIN_URL.test(social.attrs.href)) R.E(social, `${label(social)}: href="${social.attrs.href}" is not a LinkedIn address (https://www.linkedin.com/…). Without a real address, keep the inactive <span class="team-linkedin" aria-hidden="true">`);
      if (!/\bnoopener\b/.test(social.attrs.rel || '')) R.E(social, `${label(social)}: rel="noopener" is required on the LinkedIn link`);
      const al = (social.attrs['aria-label'] || '').trim();
      if (!al) R.E(social, `${label(social)}: aria-label is required — "LinkedIn profile of ${person || 'Name Surname'}"`);
      else if (person && !al.includes(person)) R.W(social, `${label(social)}: aria-label "${al}" does not name ${person}`);
    } else R.E(social, `${label(social)}: the LinkedIn mark is a <span> (inactive) or an <a> (the link)`);
  } else if (social) R.E(social, `${label(social)}: the fifth part is .team-linkedin`);

  rest.forEach(r => R.E(r, `${label(r)}: nothing else goes in a profile — every card carries the same five parts`));
}

function checkGrid(grid, R) {
  if (!R.part(grid, 'the grid', C.classes.grid, 'ul')) return 0;
  R.onlyAttrs(grid, { class: true, role: 'list' }); R.requireAttrs(grid, { role: 'list' }); R.noText(grid);
  const cards = kids(grid);
  if (!cards.length) R.E(grid, `${label(grid)}: at least one li.team-card`);
  cards.forEach(c => checkCard(c, R));
  return cards.length;
}

function checkSection(el, R) {
  if (el.tag !== 'section') R.E(el, `${label(el)}: the Team root is a <section>`);
  R.onlyClasses(el, C.classes.section);
  R.onlyAttrs(el, { id: /^[A-Za-z][\w-]*$/, class: true, 'data-component': 'team', 'data-bg': true });
  R.requireAttrs(el, { 'data-component': 'team' });
  R.variants(el, C.variants.section);
  R.noText(el);
  const k = kids(el);
  if (k.length !== 1 || !R.part(k[0], 'the container', C.classes.inner, 'div')) { R.E(el, `${label(el)}: must hold exactly one div.team-inner`); return 0; }
  const inner = k[0];
  R.onlyAttrs(inner, { class: true }); R.noText(inner);
  const [head, grid, ...rest] = kids(inner);
  if (!head || !R.part(head, 'the head', C.classes.head, 'div')) R.E(inner, `${label(inner)}: first child is div.team-head`);
  else { R.onlyAttrs(head, { class: true }); R.head(head); }
  rest.forEach(r => R.E(r, `${label(r)}: div.team-inner holds the head and the grid, nothing else`));
  if (!grid) { R.E(inner, `${label(inner)}: the ul.team-grid is missing`); return 0; }
  return checkGrid(grid, R);
}

/* find every Team in the input and check it; returns what was found */
function validate(root, ctx) {
  const R = rules('Team', ctx);
  const roots = [];
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root') return;
    if (has(n, 'team')) roots.push({ el: n, kind: 'section' });
    else if (has(n, 'team-grid') && !inside(n, 'team')) roots.push({ el: n, kind: 'grid' });
  });
  const covered = new Set();
  const found = roots.map(r => {
    const count = r.kind === 'section' ? checkSection(r.el, R) : checkGrid(r.el, R);
    R.safety(r.el);
    walk(r.el, n => covered.add(n));
    return { component: 'team', kind: r.kind, line: r.el.line, id: (r.el.attrs && r.el.attrs.id) || '', count, unit: 'profiles' };
  });
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root' || covered.has(n)) return;
    if (cls(n).some(c => /^team(-|$)/.test(c))) ctx.errors.push({ line: n.line, msg: `${label(n)}: a Team part outside a complete Team (section.team or ul.team-grid)` });
  });
  return found;
}

/* ── the validator must also say no (and yes) ──────────────────────────────────────
   Each entry edits the page's own Team section the way a CMS paste might; build/
   check-about.js runs them: every BAD edit has to be rejected, every GOOD one accepted. */
const FIRST_SPAN = /<span class="team-linkedin" aria-hidden="true">(<svg[\s\S]*?<\/svg>)<\/span>/;
const BAD = [
  ['a utility added to one card (a card made bigger)', h => h.replace('class="team-card rv"', 'class="team-card rv md:col-span-2"')],
  ['an unknown background', h => h.replace('data-bg="white"', 'data-bg="blue"')],
  ['the background removed', h => h.replace(' data-bg="white"', '')],
  ['a placeholder link, href="#"', h => h.replace(FIRST_SPAN, '<a class="team-linkedin" href="#" rel="noopener" aria-label="LinkedIn profile of Example">$1</a>')],
  ['a LinkedIn link with no accessible label', h => h.replace(FIRST_SPAN, '<a class="team-linkedin" href="https://www.linkedin.com/in/example" rel="noopener">$1</a>')],
  ['a link to another network in the LinkedIn slot', h => h.replace(FIRST_SPAN, '<a class="team-linkedin" href="https://x.com/example" rel="noopener" aria-label="X profile of Example">$1</a>')],
  ['a second social icon in a card', h => h.replace(FIRST_SPAN, m => m + '\n' + m)],
  ['the bio moved above the name', h => h.replace(/(<h3 class="team-name">[\s\S]*?<\/h3>\s*<p class="team-role">[\s\S]*?<\/p>\s*)(<p class="team-bio">[\s\S]*?<\/p>\s*)/, '$2$1')],
  ['a photo with no alt text', h => h.replace(/<span class="team-initials" aria-hidden="true">[^<]*<\/span>/, '<img class="team-photo-img" src="/assets/img/team/example.webp" width="800" height="1000" loading="lazy" decoding="async">')],
  ['markup in a name', h => h.replace('<h3 class="team-name">', '<h3 class="team-name"><b>Dr.</b> ')],
  ['a style attribute', h => h.replace('<p class="team-role">', '<p class="team-role" style="color:red">')],
  ['role="list" removed from the grid', h => h.replace(' role="list"', '')],
  ['a card left open', h => h.replace(/<\/li>/, '')],
];
const GOOD = [
  ['a real photo in place of the initials', h => h.replace(/<span class="team-initials" aria-hidden="true">[^<]*<\/span>/, '<img class="team-photo-img" src="/assets/img/team/example.webp" alt="Example Person" width="800" height="1000" loading="lazy" decoding="async">')],
  ['a LinkedIn address in place of the inactive icon', h => h.replace(/(<h3 class="team-name">)[^<]*/, '$1Example Person').replace(FIRST_SPAN, '<a class="team-linkedin" href="https://www.linkedin.com/in/example-person" rel="noopener" aria-label="LinkedIn profile of Example Person">$1</a>')],
  ['new name, role and bio text', h => h.replace(/(<h3 class="team-name">)[^<]*/, '$1Example Person').replace(/(<p class="team-role">)[^<]*/, '$1Example Role').replace(/(<p class="team-bio">)[^<]*/, '$1' + Array(36).fill('word').join(' ') + '.')],
  ['a person removed', h => h.replace(/\s*<li class="team-card rv">[\s\S]*?<\/li>/, '')],
  ['the eyebrow and the intro removed', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/\s*<p class="section-intro">[\s\S]*?<\/p>/, '')],
  ['the other background', h => h.replace('data-bg="white"', 'data-bg="tint"')],
];

module.exports = { name: 'team', title: 'Team', validate, BAD, GOOD };
