/* Timeline — the validator's rules (contract: build/about/timeline.contract.js).

   PAGE-SPECIFIC: run by build/check-about.js on site/about-us.html, not by the Section
   Library validator. Per Timeline found (a section.timeline):
     structure   section → .timeline-inner → .timeline-head + ol.timeline-list →
                 li.timeline-item, and in each item exactly: year, title, text
     classes     only the contract's classes; a Tailwind utility is named as such
     variants    data-bg present, with an allowed value
     content     year and title text only; the text limited to strong, em, br; nothing
                 empty; years out of chronological order are a warning
     safety      no style="", no on* handlers, no <script>/<style>
   Plus, for the whole input: no Timeline part outside a recognised Timeline. */
const C = require('./timeline.contract');
const { kids, cls, has, textOf, walk, label, rules } = require('./check-tools');

function checkItem(li, R) {
  if (!R.part(li, 'a milestone', C.classes.item, 'li')) return null;
  R.onlyAttrs(li, { class: true }); R.noText(li);
  const [year, title, text, ...rest] = kids(li);
  if (kids(li).length !== 3) R.E(li, `${label(li)}: a milestone holds exactly three parts, in order: p.timeline-year, h3.timeline-title, p.timeline-text (found ${kids(li).length})`);
  let y = null;
  if (year && R.part(year, 'the year', C.classes.year, 'p')) {
    R.onlyAttrs(year, { class: true }); R.inlineOnly(year, C.inline.year, 'the year'); R.filled(year, 'the year');
    y = textOf(year).trim();
  }
  if (title && R.part(title, 'the title', C.classes.title, 'h3')) {
    R.onlyAttrs(title, { class: true }); R.inlineOnly(title, C.inline.title, 'the title'); R.filled(title, 'the title');
  }
  if (text && R.part(text, 'the text', C.classes.text, 'p')) {
    R.onlyAttrs(text, { class: true }); R.inlineOnly(text, C.inline.text, 'the text'); R.filled(text, 'the text');
  }
  rest.forEach(r => R.E(r, `${label(r)}: nothing else goes in a milestone`));
  return y;
}

function checkSection(el, R) {
  if (el.tag !== 'section') R.E(el, `${label(el)}: the Timeline root is a <section>`);
  R.onlyClasses(el, C.classes.section);
  R.onlyAttrs(el, { id: /^[A-Za-z][\w-]*$/, class: true, 'data-component': 'timeline', 'data-bg': true });
  R.requireAttrs(el, { 'data-component': 'timeline' });
  R.variants(el, C.variants.section);
  R.noText(el);
  const k = kids(el);
  if (k.length !== 1 || !R.part(k[0], 'the container', C.classes.inner, 'div')) { R.E(el, `${label(el)}: must hold exactly one div.timeline-inner`); return 0; }
  const inner = k[0];
  R.onlyAttrs(inner, { class: true }); R.noText(inner);
  const [head, list, ...rest] = kids(inner);
  if (!head || !R.part(head, 'the head', C.classes.head, 'div')) R.E(inner, `${label(inner)}: first child is div.timeline-head`);
  else { R.onlyAttrs(head, { class: true }); R.head(head); }
  rest.forEach(r => R.E(r, `${label(r)}: div.timeline-inner holds the head and the list, nothing else`));
  if (!list || !R.part(list, 'the list', C.classes.list, 'ol')) { R.E(inner, `${label(inner)}: the ol.timeline-list is missing`); return 0; }
  R.onlyAttrs(list, { class: true, role: 'list' }); R.requireAttrs(list, { role: 'list' }); R.noText(list);
  const items = kids(list);
  if (items.length < 2) R.E(list, `${label(list)}: at least two li.timeline-item`);
  const years = items.map(i => checkItem(i, R)).filter(y => /^\d{4}$/.test(y || '')).map(Number);
  if (years.some((y, i) => i && y < years[i - 1])) R.W(list, `${label(list)}: the years are not in chronological order (${years.join(', ')})`);
  return items.length;
}

function validate(root, ctx) {
  const R = rules('Timeline', ctx);
  const roots = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'timeline')) roots.push(n); });
  const covered = new Set();
  const found = roots.map(el => {
    const count = checkSection(el, R);
    R.safety(el);
    walk(el, n => covered.add(n));
    return { component: 'timeline', kind: 'section', line: el.line, id: (el.attrs && el.attrs.id) || '', count, unit: 'milestones' };
  });
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root' || covered.has(n)) return;
    if (cls(n).some(c => /^timeline(-|$)/.test(c))) ctx.errors.push({ line: n.line, msg: `${label(n)}: a Timeline part outside a complete Timeline (section.timeline)` });
  });
  return found;
}

/* edits of the page's own Timeline, run by build/check-about.js: BAD must be rejected,
   GOOD accepted */
const BAD = [
  ['a utility added to a milestone', h => h.replace('class="timeline-item rv"', 'class="timeline-item rv pt-10"')],
  ['an unknown background', h => h.replace('data-bg="tint"', 'data-bg="dark"')],
  ['the background removed', h => h.replace(' data-bg="tint"', '')],
  ['the list turned into a <ul>', h => h.replace('<ol class="timeline-list" role="list">', '<ul class="timeline-list" role="list">').replace('</ol>', '</ul>')],
  ['a milestone without its title', h => h.replace(/\s*<h3 class="timeline-title">[^<]*<\/h3>/, '')],
  ['a link in a milestone', h => h.replace(/(<p class="timeline-text">)/, '$1<a href="index.html">Check now</a> ')],
  ['a style attribute', h => h.replace('<p class="timeline-year">', '<p class="timeline-year" style="color:red">')],
];
const GOOD = [
  ['new year, title and text', h => h.replace(/(<p class="timeline-year">)[^<]*/, '$12008').replace(/(<h3 class="timeline-title">)[^<]*/, '$1Example').replace(/(<p class="timeline-text">)[^<]*/, '$1An example milestone.')],
  ['a milestone removed', h => h.replace(/\s*<li class="timeline-item rv">[\s\S]*?<\/li>/, '')],
  /* the page's own Timeline has no intro since the correction pack of 2026-10-05; the head may still take one */
  ['an intro added', h => h.replace(/(<h2 class="section-title"[^>]*>[\s\S]*?<\/h2>)/, '$1\n<p class="section-intro">An example introduction.</p>')],
  ['the other background', h => h.replace('data-bg="tint"', 'data-bg="white"')],
];

module.exports = { name: 'timeline', title: 'Timeline', validate, BAD, GOOD };
