/* Stat rail — the validator's rules (contract: build/sections/stat-rail.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per rail
   found (a section.stat-rail):
     structure   the column, the list, two to five items, each built the same way: the
                 line over the figure or its spacer, the figure's row, the label
     classes     only the contract's classes on each part, with the reveal hook kept on
                 the list; a Tailwind utility is named as such
     variants    data-tone, if present, with an allowed value
     content     text only — no markup, no links; a figure is short; nothing empty; a mark
                 is an image with a source, hidden from screen readers (its label names it) */
const C = require('./stat-rail.contract');
const { kids, cls, has, walk, label, textOf, rules } = require('./check-tools');

function checkRail(el, R) {
  const { E, W, need, mustHave, onlyAttrs, noText, filled, inlineOnly } = R;
  R.at = el;
  R.sectionRoot(el, 'stat-rail', C.classes.section, C.variants.section);
  const k = kids(el);
  const inner = k[0];
  k.slice(1).forEach(x => E(x, `${label(x)}: the rail holds div.stat-rail-inner alone`));
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.stat-rail-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);
  const ik = kids(inner);
  const list = ik[0];
  ik.slice(1).forEach(x => E(x, `${label(x)}: the column holds div.stat-rail-list alone (a rail has no heading and no button)`));
  if (!list || !need(list, 'the list', C.classes.list, 'div')) { E(list || inner, `${label(inner)}: div.stat-rail-list is missing`); return; }
  mustHave(list, C.hooks.list); onlyAttrs(list, { class: true }); noText(list);

  const items = kids(list);
  if (items.length < 2 || items.length > 5) E(list, `${label(list)}: two to five items (found ${items.length})`);
  const text = (n, what, allowed) => { onlyAttrs(n, { class: true }); inlineOnly(n, [], what); filled(n, what); };
  items.forEach(it => {
    if (!need(it, 'an item', C.classes.item, 'div')) return;
    onlyAttrs(it, { class: true }); noText(it);
    const [top, fig, lab, ...rest] = kids(it);
    if (top && has(top, 'stat-rail-lead')) { if (need(top, 'the line over the figure', C.classes.lead, 'div')) text(top, 'the line over the figure (use the empty div.stat-rail-gap instead)'); }
    else if (top && has(top, 'stat-rail-gap')) {
      if (need(top, 'the spacer', C.classes.gap, 'div')) { onlyAttrs(top, { class: true, 'aria-hidden': 'true' }); if (top.children.some(c => c.tag !== '#text' || c.text.trim())) E(top, `${label(top)}: the spacer stays empty — a line over the figure is <div class="stat-rail-lead">`); }
    } else E(top || it, `${label(it)}: an item opens with div.stat-rail-lead (a line over the figure) or the empty div.stat-rail-gap`);
    if (!fig || !need(fig, 'the figure\'s row', C.classes.figure, 'div')) E(fig || it, `${label(it)}: div.stat-rail-figure follows`);
    else {
      onlyAttrs(fig, { class: true }); noText(fig);
      const fk = kids(fig);
      const v = fk[0];
      if (fk.length !== 1) E(fig, `${label(fig)}: holds one div.stat-rail-value (a figure) or one img.stat-rail-mark (found ${fk.length} elements)`);
      else if (has(v, 'stat-rail-value')) {
        if (need(v, 'the figure', C.classes.value, 'div')) {
          text(v, 'the figure');
          const t = textOf(v).trim();
          if (t.length > 12) W(v, `${label(v)}: a figure is short ("${t.slice(0, 24)}…", ${t.length} characters) — the row is one line`);
          if (has(v, 'od-num') && !/\d/.test(t)) W(v, `${label(v)}: od-num rolls digits; "${t}" has none`);
        }
      } else if (has(v, 'stat-rail-mark')) {
        if (need(v, 'the mark', C.classes.mark, 'img')) {
          onlyAttrs(v, { class: true, src: true, alt: '', 'aria-hidden': 'true', loading: true, decoding: true, width: true, height: true });
          if (!(v.attrs.src || '').trim()) E(v, `${label(v)}: the mark needs its src`);
          else if (/^\s*javascript:/i.test(v.attrs.src)) E(v, `${label(v)}: javascript: is not a source`);
          if (!('alt' in v.attrs)) E(v, `${label(v)}: alt="" is required — the label under the mark names it`);
        }
      } else E(v, `${label(v)}: the figure's row holds div.stat-rail-value or img.stat-rail-mark`);
    }
    if (!lab || !need(lab, 'the label', C.classes.label, 'div')) E(lab || it, `${label(it)}: div.stat-rail-label closes the item`);
    else text(lab, 'the label');
    rest.forEach(z => E(z, `${label(z)}: an item holds the line or spacer, the figure's row and the label`));
  });
}

function validate(root, ctx) {
  const R = rules('Stat rail', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'stat-rail')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) {
    checkRail(r.el, R);
    let k = 0; walk(r.el, n => { if (has(n, 'stat-rail-item')) k++; });
    r.count = k; r.note = r.el.attrs['data-tone'] || '';
  }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'stat-rail.html';
const ROLL = 'stat-rail-roll.html';
const firstItem = /\s*<div class="stat-rail-item">[\s\S]*?\n      <\/div>/;
const BAD = [
  ['a utility added to a figure', h => h.replace('class="stat-rail-value"', 'class="stat-rail-value text-ink-900"')],
  ['an unknown tone', h => h.replace('class="stat-rail"', 'class="stat-rail" data-tone="dark"')],
  ['the reveal hook removed from the list', h => h.replace('class="stat-rail-list rv"', 'class="stat-rail-list"')],
  ['a heading added to the rail', h => h.replace('<div class="stat-rail-list rv">', '<h2 class="section-title">Trusted worldwide</h2>\n    <div class="stat-rail-list rv">')],
  ['a single item', h => { let o = h; for (let n = 0; n < 5 && (o.match(/<div class="stat-rail-item">/g) || []).length > 1; n++) o = o.replace(firstItem, ''); return o; }],
  ['six items', h => { const m = h.match(firstItem)[0]; return h.replace(firstItem, m + m + m + m); }],
  ['an item without its label', h => h.replace(/\s*<div class="stat-rail-label">[^<]*<\/div>/, '')],
  ['an empty label', h => h.replace(/(<div class="stat-rail-label">)[^<]*/, '$1')],
  ['an item without the spacer or a line over the figure', h => h.replace(/\s*<div class="stat-rail-gap" aria-hidden="true"><\/div>/, '')],
  ['text typed into the spacer', h => h.replace('<div class="stat-rail-gap" aria-hidden="true"></div>', '<div class="stat-rail-gap" aria-hidden="true">More than</div>')],
  ['a link in a label', h => h.replace(/(<div class="stat-rail-label">)([^<]*)/, '$1<a href="https://example.com/">$2</a>')],
  ['markup in a figure', h => h.replace(/(<div class="stat-rail-value">)([^<]*)/, '$1<strong>$2</strong>')],
  ['a figure outside its row', h => h.replace(/<div class="stat-rail-figure">(<div class="stat-rail-value">[^<]*<\/div>)<\/div>/, '$1')],
  ['two figures in one row', h => h.replace(/(<div class="stat-rail-value">[^<]*<\/div>)/, '$1$1')],
  ['the mark without its source', h => h.replace(/(<img class="stat-rail-mark") src="[^"]*"/, '$1')],
  ['the mark without alt', h => h.replace(/(<img class="stat-rail-mark"[^>]*) alt=""/, '$1')],
  ['an inline style on the mark', h => h.replace('<img class="stat-rail-mark"', '<img class="stat-rail-mark" style="height:120px"')],
  ['a button under the list', h => h.replace(/(\n    <\/div>)(\n  <\/div>\n<\/section>)/, '$1\n    <a href="#x" class="action-button btn-press group">Go<span class="action-button-orb icon-orb"><svg></svg></span></a>$2')],
];
const GOOD = [
  ['new figures and labels', h => h.replace(/(<div class="stat-rail-value">)[^<]*/, '$11M+').replace(/(<div class="stat-rail-label">)[^<]*/, '$1documents checked')],
  ['an item removed', h => h.replace(firstItem, '')],
  ['an item copied (four items)', h => { const m = h.match(firstItem)[0]; return h.replace(firstItem, m + m); }],
  ['a line over a figure instead of the spacer', h => h.replace('<div class="stat-rail-gap" aria-hidden="true"></div>', '<div class="stat-rail-lead">More than</div>')],
  ['the line over a figure replaced by the spacer', h => h.replace(/<div class="stat-rail-lead">[^<]*<\/div>/, '<div class="stat-rail-gap" aria-hidden="true"></div>')],
  ['the lighter labels, an id', h => h.replace('class="stat-rail"', 'class="stat-rail" data-tone="soft"').replace(/(<section) id="[^"]*"/, '$1 id="proof"')],
  ['the figures made to roll', h => h.replace(/class="stat-rail-value"/g, 'class="stat-rail-value od-num"')],
  ['another mark', h => h.replace(/(<img class="stat-rail-mark" src=")[^"]*"/, '$1/assets/svg/partners/g2.svg"')],
  ['a figure instead of the mark', h => h.replace(/<img class="stat-rail-mark"[^>]*>/, '<div class="stat-rail-value">A+</div>')],
  ['roll: the roll removed from one figure, the standard labels', h => h.replace('class="stat-rail-value od-num"', 'class="stat-rail-value"').replace(' data-tone="soft"', ''), ROLL],
];

const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^stat-rail/.test(c)));

module.exports = {
  name: 'stat-rail', title: 'Stat rail', unit: 'items',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Stat rail part outside a complete rail (section.stat-rail)',
  mentions: html => /\bstat-rail\b/.test(html),
  SNIPPET, BAD, GOOD,
};
