/* Banner — the validator's rules (contract: build/sections/banner.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per banner
   found (a section.banner):
     structure   section → .banner-inner → .banner-box → the glow and .banner-grid; the
                 text cell's parts in order; the right-hand cell its layout allows (a row:
                 the action; split: the aside with the schematic and the action)
     classes     only the contract's classes on each part, the behaviour hooks kept
     variants    data-glow present, data-layout and the measures with an allowed value
     content     label text only; title, lead, callout and detail limited to the allowed
                 inline tags; nothing empty; the schematic's two children
     a11y        data-surface="dark" on the box (the focus ring), aria-hidden on the schematic
     sealed      <svg> icons are not inspected inside */
const C = require('./banner.contract');
const { kids, texts, cls, has, walk, label, ID, rules } = require('./check-tools');

function checkBanner(el, R) {
  const { E, onlyClasses, need, mustHave, variantsOf, onlyAttrs, requireAttrs, noText, filled, link, inlineOnly, svgIcon } = R;
  R.at = el;
  if (el.tag !== 'section') E(el, `${label(el)}: the banner root is a <section>`);
  onlyClasses(el, C.classes.section);
  onlyAttrs(el, { id: ID, class: true, 'data-component': true, 'data-glow': true, 'data-layout': true });
  requireAttrs(el, { 'data-component': 'banner' });
  variantsOf(el, C.variants.section);
  noText(el);
  const split = el.attrs['data-layout'] === 'split';

  /* a wrapper: the one child of its parent, a <div> with its class */
  const only = (parent, what, allowed) => {
    const k = kids(parent);
    if (k.length !== 1 || !need(k[0], what, allowed, 'div')) { E(parent, `${label(parent)}: must hold exactly one div.${allowed[0]}`); return null; }
    return k[0];
  };
  const inner = only(el, 'the container', C.classes.inner);
  if (!inner) return;
  onlyAttrs(inner, { class: true }); noText(inner);
  const box = only(inner, 'the dark box', C.classes.box);
  if (!box) return;
  onlyAttrs(box, { class: true, 'data-surface': true }); requireAttrs(box, { 'data-surface': 'dark' }); noText(box);
  const [glow, grid, ...extra] = kids(box);
  if (!glow || !need(glow, 'the glow', C.classes.glow, 'div')) E(glow || box, `${label(box)}: first child is div.orb.banner-glow`);
  else { mustHave(glow, C.hooks.glow); onlyAttrs(glow, { class: true }); if (glow.children.some(c => c.tag !== '#text' || c.text.trim())) E(glow, `${label(glow)}: the glow stays empty`); }
  extra.forEach(x => E(x, `${label(x)}: the box holds the glow and div.banner-grid, nothing else`));
  /* (written without a "!" before the word grid: Tailwind reads this file for class names,
     and would compile that as an important utility) */
  if (grid === undefined || !need(grid, 'the grid', C.classes.grid, 'div')) { E(grid || box, `${label(box)}: div.banner-grid is missing`); return; }
  onlyAttrs(grid, { class: true }); noText(grid);
  const [text, right, ...more] = kids(grid);
  more.forEach(x => E(x, `${label(x)}: the grid holds the text cell and one right-hand cell`));

  /* the text cell */
  if (!text || !need(text, 'the text cell', C.classes.text, 'div')) E(text || grid, `${label(grid)}: first child is div.banner-text`);
  else {
    onlyAttrs(text, { class: true }); noText(text);
    const p = kids(text);
    let i = 0;
    if (p[i] && has(p[i], 'section-eyebrow')) R.eyebrow(p[i++], C.classes);
    const t = p[i++];
    if (!t || !has(t, 'banner-title')) E(t || text, `${label(text)}: the h2.banner-title is required (after the optional eyebrow)`);
    else { need(t, 'the title', C.classes.title, 'h2'); onlyAttrs(t, { class: true, id: ID }); inlineOnly(t, C.inline.title, 'the title'); filled(t, 'the title'); }
    const l = p[i++];
    if (!l || !has(l, 'banner-lead')) E(l || text, `${label(text)}: the p.banner-lead follows the title`);
    else { need(l, 'the lead', C.classes.lead, 'p'); onlyAttrs(l, { class: true, 'data-measure': true }); variantsOf(l, C.variants.lead); inlineOnly(l, C.inline.lead, 'the lead'); filled(l, 'the lead'); }
    if (p[i] && has(p[i], 'banner-pill')) {
      const x = p[i++];
      need(x, 'the pill', C.classes.pill, 'p'); onlyAttrs(x, { class: true }); filled(x, 'the pill (remove it instead)');
      const [dot, ...rest] = kids(x);
      if (!dot || !need(dot, 'the pill dot', C.classes.pillDot, 'span')) E(x, `${label(x)}: opens with span.banner-pill-dot`);
      else { onlyAttrs(dot, { class: true }); if (dot.children.length) E(dot, `${label(dot)}: the dot stays empty`); }
      rest.forEach(r => E(r, `${label(r)} is not allowed in the pill (text only)`));
    }
    if (p[i] && has(p[i], 'banner-callout')) {
      const x = p[i++];
      need(x, 'the callout', C.classes.callout, 'p'); onlyAttrs(x, { class: true }); filled(x, 'the callout (remove it instead)');
      const first = kids(x)[0];
      if (!first || first.tag !== 'svg' || !has(first, 'banner-callout-icon')) E(x, `${label(x)}: opens with its icon, <svg class="banner-callout-icon">, copied as it is`);
      else svgIcon(first, label(x), C.classes.calloutIcon);
      inlineOnly(x, C.inline.callout, 'the callout');
    }
    if (p[i] && has(p[i], 'banner-detail')) {
      const x = p[i++];
      need(x, 'the second paragraph', C.classes.detail, 'p'); onlyAttrs(x, { class: true, 'data-measure': true }); variantsOf(x, C.variants.detail);
      inlineOnly(x, C.inline.detail, 'the second paragraph'); filled(x, 'the second paragraph (remove it instead)');
    }
    p.slice(i).forEach(x => E(x, `${label(x)}: not part of the banner text (order: eyebrow?, title, lead, pill?, callout?, second paragraph?)`));
  }

  /* the action: the white button, alone or over a quiet link */
  const button = a => {
    if (!a || !need(a, 'the button', C.classes.button, 'a')) return;
    mustHave(a, C.hooks.button); link(a, { href: true, rel: true, target: true, class: true });
    const ak = kids(a);
    if (ak.length !== 1 || !need(ak[0], 'the arrow orb', C.classes.buttonOrb, 'span')) E(a, `${label(a)}: the button holds its text and span.banner-button-orb (the arrow), copied as it is`);
    else { const o = ak[0]; mustHave(o, C.hooks.buttonOrb); onlyAttrs(o, { class: true }); noText(o); const s = kids(o); if (s.length !== 1) E(o, `${label(o)}: holds only the arrow <svg>`); svgIcon(s[0], label(o), []); }
    if (!texts(a).some(t => t.text.trim())) E(a, `${label(a)}: the button needs its text`);
  };
  const action = (cell, allowLink) => {
    if (!cell || !need(cell, 'the action', C.classes.action, 'div')) { E(cell || grid, `${label(cell || grid)}: div.banner-action with the a.banner-button is required`); return; }
    onlyAttrs(cell, { class: true }); noText(cell);
    const k = kids(cell);
    if (k.length === 1 && has(k[0], 'banner-actions')) {
      const w = k[0];
      need(w, 'the button and link column', C.classes.actions, 'div'); onlyAttrs(w, { class: true }); noText(w);
      if (!allowLink) E(w, `${label(w)}: the quiet link belongs to the row layout; in split the action is the button alone`);
      const [b, a, ...rest] = kids(w);
      button(b);
      if (!a || !need(a, 'the quiet link', C.classes.link, 'a')) E(w, `${label(w)}: holds a.banner-button then a.banner-link`);
      else { link(a, { href: true, rel: true, target: true, class: true }); inlineOnly(a, C.inline.label, 'the quiet link'); }
      rest.forEach(r => E(r, `${label(r)}: one button and one link`));
    } else if (k.length === 1 && has(k[0], 'banner-button')) button(k[0]);
    else E(cell, `${label(cell)}: holds the a.banner-button, or div.banner-actions with the button and a.banner-link`);
  };

  if (!split) { action(right, true); return; }

  /* split: the aside with the schematic, the action under it */
  if (!right || !need(right, 'the aside', C.classes.aside, 'div')) { E(right || grid, `${label(grid)}: data-layout="split" needs div.banner-aside after the text cell`); return; }
  onlyAttrs(right, { class: true }); noText(right);
  const [br, act, ...rest] = kids(right);
  rest.forEach(x => E(x, `${label(x)}: the aside holds the schematic and the action`));
  if (!br || !need(br, 'the schematic', C.classes.branch, 'div')) E(br || right, `${label(right)}: first child is div.banner-branch`);
  else {
    onlyAttrs(br, { class: true, 'aria-hidden': true }); requireAttrs(br, { 'aria-hidden': 'true' }); noText(br);
    const [parent, children, ...x] = kids(br);
    x.forEach(n => E(n, `${label(n)}: the schematic holds its parent line and its two children`));
    if (!parent || !need(parent, 'the schematic\'s parent', C.classes.branchParent, 'p')) E(parent || br, `${label(br)}: first child is p.banner-branch-parent`);
    else {
      onlyAttrs(parent, { class: true }); filled(parent, 'the parent label');
      kids(parent).forEach((c, j) => { if (c.tag === 'svg' && j === 0) svgIcon(c, label(parent), C.classes.branchParentIcon); else E(c, `${label(c)}: the parent line holds its icon and its text`); });
    }
    if (!children || !need(children, 'the schematic\'s children', C.classes.branchChildren, 'div')) E(children || br, `${label(br)}: second child is div.banner-branch-children`);
    else {
      onlyAttrs(children, { class: true }); noText(children);
      const ck = kids(children);
      if (ck.length !== 2) E(children, `${label(children)}: the bracket is drawn for exactly two children (found ${ck.length})`);
      ck.forEach(c => {
        if (!need(c, 'a child', C.classes.branchChild, 'div')) return;
        onlyAttrs(c, { class: true }); noText(c);
        const [line, icon, lab, ...z] = kids(c);
        z.forEach(n => E(n, `${label(n)}: a child holds its line, its icon and its label`));
        if (!line || !need(line, 'the bracket line', C.classes.branchLine, 'span')) E(c, `${label(c)}: first child is the empty span.banner-branch-line`);
        else { onlyAttrs(line, { class: true }); if (line.children.length) E(line, `${label(line)}: the line stays empty`); }
        if (!icon || !need(icon, 'the icon', C.classes.branchIcon, 'span')) E(c, `${label(c)}: second child is span.banner-branch-icon with its <svg>`);
        else { onlyAttrs(icon, { class: true }); noText(icon); const s = kids(icon); if (s.length !== 1) E(icon, `${label(icon)}: holds only its <svg>`); svgIcon(s[0], label(icon), []); }
        if (!lab || !need(lab, 'the label', C.classes.branchLabel, 'span')) E(c, `${label(c)}: third child is span.banner-branch-label`);
        else { onlyAttrs(lab, { class: true }); inlineOnly(lab, C.inline.label, 'the label'); filled(lab, 'the label'); }
      });
    }
  }
  action(act, false);
}

function validate(root, ctx) {
  const R = rules('Banner', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'banner')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) { checkBanner(r.el, R); r.note = [r.el.attrs['data-glow'], r.el.attrs['data-layout']].filter(Boolean).join(' '); }
  return { found, sealed: R.sealed };
}

/* [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'banner-row.html';
const SPLIT = 'banner-split.html';
const LINK = 'banner-row-link.html';
const BAD = [
  ['a utility added to the box', h => h.replace('class="banner-box rv"', 'class="banner-box rv text-white"')],
  ['an unknown glow', h => h.replace(/data-glow="[^"]*"/, 'data-glow="green"')],
  ['the glow removed', h => h.replace(/ data-glow="[^"]*"/, '')],
  ['a pill given its own dot colour', h => h.replace('class="section-eyebrow-dot"', 'class="section-eyebrow-dot bg-teal-400"')],
  ['data-surface removed from the box', h => h.replace(' data-surface="dark"', '')],
  ['the title turned into an h3', h => h.replace(/<h2 class="banner-title">([\s\S]*?)<\/h2>/, '<h3 class="banner-title">$1</h3>')],
  ['the lead removed', h => h.replace(/\s*<p class="banner-lead"[^>]*>[\s\S]*?<\/p>/, '')],
  ['an unknown measure', h => h.replace(/(<p class="banner-lead")[^>]*>/, '$1 data-measure="80">')],
  ['a second button', h => h.replace(/(<a [^>]*class="banner-button btn-press group">[\s\S]*?<\/a>)/, '$1$1')],
  ['the button without its arrow orb', h => h.replace(/\s*<span class="banner-button-orb icon-orb">[\s\S]*?<\/span>/, '')],
  ['a link in the pill label', h => h.replace(/(<span class="section-eyebrow-label">)([^<]*)/, '$1<a href="index.html">$2</a>')],
  ['an onclick handler', h => h.replace('class="banner-button btn-press group"', 'class="banner-button btn-press group" onclick="go()"')],
  ['split: a third child in the schematic', h => h.replace(/(<div class="banner-branch-child">[\s\S]*?<\/div>)/, '$1\n$1'), SPLIT],
  ['split: aria-hidden removed from the schematic', h => h.replace('<div class="banner-branch" aria-hidden="true">', '<div class="banner-branch">'), SPLIT],
  ['split: the schematic removed, the layout kept', h => h.replace(/\s*<div class="banner-branch"[\s\S]*<\/div>(\s*<div class="banner-action">)/, '$1'), SPLIT],
  ['split: the layout attribute removed', h => h.replace(' data-layout="split"', ''), SPLIT],
  ['row + link: the link without its column', h => h.replace('<div class="banner-actions">', '').replace(/<\/a><\/div><\/div>/, '</a></div>'), LINK],
];
const GOOD = [
  ['new title, lead and button text', h => h.replace(/(<h2 class="banner-title">)[^<]*/, '$1A new title').replace(/(<p class="banner-lead"[^>]*>)[^<]*/, '$1A new lead with <strong>weight</strong>.')],
  ['another glow, another measure, the id removed', h => h.replace(/data-glow="[^"]*"/, 'data-glow="violet"').replace(/(<p class="banner-lead")[^>]*>/, '$1 data-measure="54">').replace(/(<section) id="[^"]*"/, '$1')],
  ['the eyebrow pill removed', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '')],
  ['a second paragraph added', h => h.replace(/(<p class="banner-lead"[^>]*>[\s\S]*?<\/p>)/, '$1\n          <p class="banner-detail">A quieter line of detail.</p>')],
  ['a pill and a detail added under the lead', h => h.replace(/(<p class="banner-lead"[^>]*>[\s\S]*?<\/p>)/, '$1\n          <p class="banner-pill"><span class="banner-pill-dot"></span>One point.</p>\n          <p class="banner-detail" data-measure="58">A quieter line of detail.</p>')],
  ['an external button link with target and rel', h => h.replace(/<a href="[^"]*"( rel="[^"]*")? class="banner-button btn-press group">/, '<a href="https://example.com/" target="_blank" rel="noopener" class="banner-button btn-press group">')],
  ['split: new labels in the schematic', h => h.replace(/(<span class="banner-branch-label">)[^<]*/g, '$1A new label'), SPLIT],
  ['split: the pill and the detail removed', h => h.replace(/\s*<p class="banner-pill">[\s\S]*?<\/p>/, '').replace(/\s*<p class="banner-detail"[^>]*>[\s\S]*?<\/p>/, ''), SPLIT],
  ['row + link: new link text and address', h => h.replace(/<a href="[^"]*" class="banner-link">[^<]*/, '<a href="prices.html" class="banner-link">See the plans'), LINK],
];

module.exports = {
  name: 'banner', title: 'Banner', unit: '',
  validate,
  isPart: n => cls(n).some(c => /^banner-/.test(c)),
  outside: 'a banner part outside a complete banner (section.banner)',
  mentions: html => /\bbanner-|class="banner"/.test(html),
  SNIPPET, BAD, GOOD,
};
