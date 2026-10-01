/* Feature cards — the validator's rules (contract: build/sections/feature-cards.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.cards-section):
     structure   the head (a block, or the grid's first cell), the grid or the panel,
                 each card built of its tile, its name and its text, in that order
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, rv-kids, btn-press …); a Tailwind utility is named as such
     variants    data-layout, data-bg, data-space required; every other data-* switch with
                 an allowed value, on the layout it belongs to
     content     text only in names; limited inline tags in the texts; nothing empty
     sealed      <svg> icons are not inspected inside */
const C = require('./feature-cards.contract');
const { kids, cls, has, walk, label, rules } = require('./check-tools');

function checkCards(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, noText, filled, inlineOnly } = R;
  R.at = el;
  R.sectionRoot(el, 'feature-cards', C.classes.section, C.variants.section);
  const layout = el.attrs['data-layout'], size = el.attrs['data-size'];
  if (!C.variants.section['data-layout'].values.includes(layout)) return;
  if (size !== undefined && layout !== 'grid') E(el, `${label(el)}: data-size belongs to layout "grid"`);

  const k = kids(el);
  const inner = k[0];
  if (k.length !== 1 || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: holds exactly one div.cards-inner`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  let parts = kids(inner);
  let head = null;
  if (parts[0] && has(parts[0], 'section-head')) {
    head = parts[0]; parts = parts.slice(1);
    R.headBlock(head, { measures: C.variants.head['data-measure'].values, title: C.inline.sectionTitle, intro: C.inline.intro });
  }

  /* the parts of a card */
  const tile = t => R.iconTile(t, { variants: size === 'lead' ? ['ring'] : [] });
  const body = (node, what, lead) => {
    const [t, name, text, act, ...x] = kids(node);
    if (!t || !has(t, 'icon-tile')) E(node, `${label(node)}: ${what} opens with its span.icon-tile`); else tile(t);
    if (!name || !need(name, 'the name', C.classes.title, lead ? 'p' : 'h3')) E(name || node, `${label(node)}: the ${lead ? 'p' : 'h3'}.cards-title follows the tile`);
    else { onlyAttrs(name, { class: true }); inlineOnly(name, C.inline.title, 'the name'); filled(name, 'the name'); }
    if (!text || !need(text, 'the text', C.classes.text, 'p')) E(text || node, `${label(node)}: p.cards-text follows the name`);
    else { onlyAttrs(text, { class: true }); inlineOnly(text, C.inline.text, 'the text'); filled(text, 'the text'); }
    if (act) {
      if (!lead) E(act, `${label(act)}: ${what} holds its tile, its name and its text (a button in a card needs data-size="lead" on the section)`);
      else if (need(act, 'the card\'s action', C.classes.itemAction, 'div')) {
        onlyAttrs(act, { class: true }); noText(act);
        const ak = kids(act);
        if (ak.length !== 1 || !has(ak[0], 'action-button')) E(act, `${label(act)}: holds exactly one a.action-button`); else R.actionButton(ak[0], { tones: C.variants.button['data-tone'].values });
      }
    }
    x.forEach(z => E(z, `${label(z)}: ${what} holds its tile, its name and its text`));
  };

  if (layout === 'grid') {
    const [cardGrid, actions, ...rest] = parts;
    if (!cardGrid || !has(cardGrid, 'cards-grid') || cardGrid.tag !== 'div') { E(cardGrid || inner, `${label(cardGrid || inner)}: div.cards-grid follows the head`); return; }
    const inlineHead = cardGrid.attrs['data-head'] === 'inline';
    onlyClasses(cardGrid, inlineHead ? ['cards-grid', 'rv'] : ['cards-grid', 'rv-kids']);
    mustHave(cardGrid, inlineHead ? ['rv'] : ['rv-kids']);
    onlyAttrs(cardGrid, { class: true, 'data-cols': true, 'data-head': true });
    variantsOf(cardGrid, { ...C.variants.grid, 'data-cols': { ...C.variants.grid['data-cols'], required: !inlineHead } });
    noText(cardGrid);
    if (inlineHead && 'data-cols' in cardGrid.attrs) E(cardGrid, `${label(cardGrid)}: with data-head="inline" the grid sets its own columns — remove data-cols`);
    let items = kids(cardGrid);
    if (inlineHead) {
      const hc = items[0];
      if (head) E(head, `${label(head)}: with data-head="inline" the head is the grid's first cell, not a block above it`);
      if (!hc || !need(hc, 'the head cell', C.classes.headCell, 'div')) E(cardGrid, `${label(cardGrid)}: with data-head="inline" the grid opens with div.cards-head-cell (the h2 and the intro)`);
      else {
        onlyAttrs(hc, { class: true }); noText(hc);
        const hk = kids(hc);
        if (hk[0] && has(hk[0], 'section-eyebrow')) E(hk[0], `${label(hk[0])}: the head cell holds the title and the intro, no pill`);
        hk.slice(R.headParts(hk, hc, { title: C.inline.sectionTitle, intro: C.inline.intro })).forEach(x => E(x, `${label(x)}: not part of the head cell (title, intro?)`));
        items = items.slice(1);
      }
    } else if (!head) E(inner, `${label(inner)}: a grid needs its head — div.section-head before the grid`);
    if (items.length < 2 || items.length > 8) E(cardGrid, `${label(cardGrid)}: 2–8 cards (found ${items.length})`);
    let accents = 0;
    items.forEach(it => {
      if (!need(it, 'a card', C.classes.item, 'div')) return;
      onlyAttrs(it, { class: true, 'data-tone': true }); variantsOf(it, C.variants.item); noText(it);
      if (it.attrs['data-tone']) accents++;
      body(it, 'a card', size === 'lead');
    });
    if (accents > 1) E(cardGrid, `${label(cardGrid)}: one accent card at most (found ${accents})`);
    const cols = +cardGrid.attrs['data-cols'];
    if (cols && items.length % cols && !(cols === 4 && items.length === 2)) W(cardGrid, `${label(cardGrid)}: data-cols="${cols}" with ${items.length} cards — the last row will not be full`);
    if (actions) {
      if (need(actions, 'the action under the grid', C.classes.actions, 'div')) {
        mustHave(actions, C.hooks.actions); onlyAttrs(actions, { class: true }); noText(actions);
        const ak = kids(actions);
        if (ak.length !== 1 || !has(ak[0], 'action-button')) E(actions, `${label(actions)}: holds exactly one a.action-button`); else R.actionButton(ak[0], { tones: C.variants.button['data-tone'].values });
      }
    }
    rest.forEach(x => E(x, `${label(x)}: under the grid goes one div.cards-actions at most`));
    return;
  }

  /* ── panel ── */
  const [panel, ...rest] = parts;
  if (!panel || !need(panel, 'the panel', C.classes.panel, 'div')) { E(panel || inner, `${label(inner)}: div.cards-panel follows the head`); return; }
  mustHave(panel, C.hooks.panel); onlyAttrs(panel, { class: true }); noText(panel);
  if (!head && !(el.attrs['aria-label'] || '').trim()) W(el, `${label(el)}: a panel without a head — give the section an aria-label that names its cells`);
  const [cells, foot, ...x] = kids(panel);
  if (!cells || !need(cells, 'the cells', C.classes.cells, 'div')) E(panel, `${label(panel)}: the panel opens with div.cards-cells`);
  else {
    onlyAttrs(cells, { class: true }); noText(cells);
    const ck = kids(cells);
    if (ck.length < 2 || ck.length > 4) E(cells, `${label(cells)}: 2–4 cells (found ${ck.length})`);
    else if (ck.length !== 3) W(cells, `${label(cells)}: the sheet is drawn for three cells a row; ${ck.length} will not fill it`);
    ck.forEach(c => { if (need(c, 'a cell', C.classes.cell, 'div')) { onlyAttrs(c, { class: true }); noText(c); body(c, 'a cell', false); } });
  }
  if (foot) {
    if (need(foot, 'the sheet\'s last row', C.classes.panelFoot, 'div')) {
      onlyAttrs(foot, { class: true }); noText(foot);
      const [note, act, ...y] = kids(foot);
      if (!note || !need(note, 'the note', C.classes.panelNote, 'p')) E(foot, `${label(foot)}: opens with p.cards-panel-note`);
      else { onlyAttrs(note, { class: true }); inlineOnly(note, C.inline.note, 'the note'); filled(note, 'the note'); }
      if (act) {
        if (need(act, 'the action', C.classes.panelAction, 'span')) {
          onlyAttrs(act, { class: true }); noText(act);
          const ak = kids(act);
          if (ak.length !== 1 || !has(ak[0], 'action-button')) E(act, `${label(act)}: holds exactly one a.action-button`); else R.actionButton(ak[0], { tones: C.variants.button['data-tone'].values });
        }
      }
      y.forEach(z => E(z, `${label(z)}: the last row holds the note and one optional action`));
    }
  }
  x.forEach(z => E(z, `${label(z)}: the panel holds its cells and one optional last row`));
  rest.forEach(z => E(z, `${label(z)}: nothing follows the panel`));
}

function validate(root, ctx) {
  const R = rules('Feature cards', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'cards-section')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) {
    checkCards(r.el, R);
    r.note = [r.el.attrs['data-layout'], r.el.attrs['data-size']].filter(Boolean).join(' · ');
    let k = 0; walk(r.el, n => { if (has(n, 'cards-item') || has(n, 'cards-cell')) k++; });
    r.count = k;
  }
  return { found, sealed: R.sealed };
}

const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^cards-/.test(c)));

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'feature-cards-grid.html';
const INLINE = 'feature-cards-inline-head.html', COMPACT = 'feature-cards-compact.html', LEAD = 'feature-cards-lead.html', PANEL = 'feature-cards-panel.html', BARE = 'feature-cards-panel-bare.html';
const firstCard = /\s*<div class="cards-item">[\s\S]*?<\/p>\s*<\/div>/;
const BAD = [
  ['a utility added to a card', h => h.replace('class="cards-item"', 'class="cards-item p-8"')],
  ['an unknown layout', h => h.replace('data-layout="grid"', 'data-layout="bento"')],
  ['the rhythm removed', h => h.replace(/ data-space="[a-z]+"/, '')],
  ['the column count removed', h => h.replace(/ data-cols="\d"/, '')],
  ['the reveal hook removed from the grid', h => h.replace('class="cards-grid rv-kids"', 'class="cards-grid"')],
  ['the head removed from a grid', h => h.replace(/\s*<div class="section-head rv"[^>]*>[\s\S]*?\n    <\/div>/, '')],
  ['a card without its tile', h => h.replace(/\s*<span class="icon-tile"[\s\S]*?<\/span>/, '')],
  ['a card\'s name as a paragraph', h => h.replace(/<h3 class="cards-title">([^<]*)<\/h3>/, '<p class="cards-title">$1</p>')],
  ['markup in a card\'s name', h => h.replace(/(<h3 class="cards-title">)([^<]*)/, '$1<em>$2</em>')],
  ['a card\'s text removed', h => h.replace(/\s*<p class="cards-text">[\s\S]*?<\/p>/, '')],
  ['two accent cards', h => h.replace('<div class="cards-item">', '<div class="cards-item" data-tone="teal">')],
  ['an unknown accent', h => h.replace('<div class="cards-item" data-tone="teal">', '<div class="cards-item" data-tone="coral">')],
  ['a button inside a card of the plain size', h => h.replace(/(<p class="cards-text">[^<]*<\/p>)/, '$1\n<div class="cards-item-action"><a href="#x" class="action-button btn-press group" data-tone="ghost">Go<span class="action-button-orb icon-orb"><svg></svg></span></a></div>')],
  ['a javascript: link under the grid', h => h.replace(/(<a href=")[^"]*(" class="action-button)/, '$1javascript:void(0)$2')],
  ['a single card', h => { let o = h; for (let i = 0; i < 8 && (o.match(/<div class="cards-item"/g) || []).length > 1; i++) o = o.replace(/\s*<div class="cards-item"[^>]*>[\s\S]*?<\/p>\s*<\/div>/, ''); return o; }],
  ['inline head: a head block above the grid as well', h => h.replace('<div class="cards-grid rv"', '<div class="section-head rv">\n<h2 class="section-title">Why</h2>\n</div>\n<div class="cards-grid rv"'), INLINE],
  ['inline head: the head cell removed', h => h.replace(/\s*<div class="cards-head-cell">[\s\S]*?<\/div>/, ''), INLINE],
  ['inline head: an unsafe link in a card\'s text', h => h.replace(/<a href="[^"]*"([^>]*)class="cards-link">/, '<a href="javascript:alert(1)"$1class="cards-link">'), INLINE],
  ['compact: the ring tile of another size', h => h.replace('class="icon-tile"', 'class="icon-tile" data-variant="ring"'), COMPACT],
  ['lead: an unknown button tone', h => h.replace(/(class="action-button btn-press group") data-tone="[a-z]+"/, '$1 data-tone="dark"'), LEAD],
  ['lead: a card\'s name as a heading', h => h.replace(/<p class="cards-title">([^<]*)<\/p>/, '<h3 class="cards-title">$1</h3>'), LEAD],
  ['panel: data-size on a panel', h => h.replace('data-layout="panel"', 'data-layout="panel" data-size="compact"'), PANEL],
  ['panel: five cells', h => h.replace(/(<div class="cards-cell">[\s\S]*?<\/p>\s*<\/div>)/, '$1\n$1\n$1'), PANEL],
  ['panel: the reveal hook removed', h => h.replace('class="cards-panel rv"', 'class="cards-panel"'), PANEL],
  ['panel: a card of the grid inside the sheet', h => h.replace('<div class="cards-cell">', '<div class="cards-item">'), PANEL],
];
const GOOD = [
  ['new names and texts, a link in a text', h => h.replace(/(<h3 class="cards-title">)[^<]*/, '$1Your file').replace(/(<p class="cards-text">)[^<]*/, '$1A new text with <a href="policy.html" class="cards-link">a link</a> and <strong>a strong phrase</strong>.')],
  ['a card removed (a warning: the row is not full)', h => h.replace(firstCard, '')],
  ['the accent removed, another tile tone', h => h.replace('<div class="cards-item" data-tone="teal">', '<div class="cards-item">').replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1mint"')],
  ['the button under the grid removed', h => h.replace(/\s*<div class="cards-actions rv">[\s\S]*?<\/a>\s*<\/div>/, '')],
  ['the pill and the intro removed, another ground and rhythm, three columns', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/\s*<p class="section-intro"[^>]*>[\s\S]*?<\/p>/, '').replace(/data-bg="[a-z]+"/, 'data-bg="white"').replace(/data-space="[a-z]+"/, 'data-space="md"').replace(/data-cols="\d"/, 'data-cols="3"')],
  ['inline head: the intro removed, a card removed', h => h.replace(/\s*<p class="section-intro"[^>]*>[\s\S]*?<\/p>/, '').replace(firstCard, ''), INLINE],
  ['compact: another tone', h => h.replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1teal"'), COMPACT],
  ['lead: a card without its button', h => h.replace(/\s*<div class="cards-item-action">[\s\S]*?<\/a>\s*<\/div>/, ''), LEAD],
  ['panel: the last row without its button',h => h.replace(/\s*<span class="cards-panel-action">[\s\S]*?<\/a>\s*<\/span>/, ''), PANEL],
  ['panel: the last row removed', h => h.replace(/\s*<div class="cards-panel-foot">[\s\S]*?<\/span>\s*<\/div>/, ''), PANEL],
  ['bare panel: another label and text', h => h.replace(/aria-label="[^"]*"/, 'aria-label="Three tools"').replace(/(<p class="cards-text">)[^<]*/, '$1New.'), BARE],
];

module.exports = {
  name: 'feature-cards', title: 'Feature cards', unit: 'cards',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Feature cards part outside a complete section (section.cards-section)',
  mentions: html => /class="cards-section"|\bcards-(?:grid|item|panel|cell)\b/.test(html),
  SNIPPET, BAD, GOOD,
};
