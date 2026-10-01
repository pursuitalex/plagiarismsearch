/* Sources — the validator's rules (contract: build/sections/sources.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.sources-section):
     structure   the head, and what its layout holds: two groups and the figure; the
                 input, the arrow and a group; a sheet of rows; a sheet of cells
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, rv-kids, cells); a Tailwind utility is named as such
     variants    data-layout, data-bg, data-space required; every other data-* switch with
                 an allowed value, on the layout it belongs to
     content     text only in names and labels; limited inline tags in the texts; nothing
                 empty; no control of any kind — the sources are shown as available
     sealed      [data-slot="media"] and <svg> icons are not inspected inside */
const C = require('./sources.contract');
const { kids, cls, has, walk, label, rules } = require('./check-tools');

function checkSources(el, R) {
  const { E, onlyClasses, need, mustHave, variantsOf, onlyAttrs, noText, filled, inlineOnly, svgIcon, seal } = R;
  R.at = el;
  R.sectionRoot(el, 'sources', C.classes.section, C.variants.section);
  const layout = el.attrs['data-layout'];
  if (!C.variants.section['data-layout'].values.includes(layout)) return;
  const labels = el.attrs['data-items'] === 'labels';
  if ('data-items' in el.attrs && layout !== 'groups') E(el, `${label(el)}: data-items belongs to layout "groups"`);

  /* shown as available, never as a control */
  walk(el, n => { if (['input', 'button', 'select', 'textarea'].includes(n.tag) || (n.attrs && n.attrs.role === 'switch')) E(n, `${label(n)}: the sources are shown as available — no switch, field or button here`); });

  const k = kids(el);
  const inner = k[0];
  if (k.length !== 1 || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: holds exactly one div.sources-inner`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);
  const parts = kids(inner);

  const text = (n, what, allowed, tag) => {
    if (!need(n, what, allowed, tag)) return false;
    onlyAttrs(n, { class: true }); inlineOnly(n, C.inline.text, what); filled(n, what);
    return true;
  };
  const plain = (n, what, allowed, tag) => {
    if (!need(n, what, allowed, tag)) return false;
    onlyAttrs(n, { class: true }); inlineOnly(n, C.inline.label, what); filled(n, what);
    return true;
  };
  const tile = t => R.iconTile(t, { variants: labels ? ['ring'] : [] });
  const empty = n => { if (n.children.some(c => c.tag !== '#text' || c.text.trim())) E(n, `${label(n)}: stays empty`); };

  /* a group of ticks */
  const group = g => {
    if (!need(g, 'a group', C.classes.group, 'div')) return;
    onlyAttrs(g, { class: true }); noText(g);
    const [gh, ul, ...x] = kids(g);
    if (!gh || !need(gh, 'the group\'s head', C.classes.groupHead, 'div')) E(g, `${label(g)}: the group opens with div.sources-group-head`);
    else {
      onlyAttrs(gh, { class: true }); noText(gh);
      const [t, kq, ...y] = kids(gh);
      if (!t || !has(t, 'icon-tile')) E(gh, `${label(gh)}: opens with its span.icon-tile`); else tile(t);
      if (!kq || !has(kq, 'sources-kicker')) E(gh, `${label(gh)}: span.sources-kicker (the group's name) follows the tile`); else plain(kq, 'the group\'s name', C.classes.kicker, 'span');
      y.forEach(z => E(z, `${label(z)}: the group's head holds the tile and the name`));
    }
    if (!ul || !need(ul, 'the list', C.classes.list, 'ul')) { E(g, `${label(g)}: ul.sources-list follows the head`); return; }
    onlyAttrs(ul, { class: true }); noText(ul);
    const items = kids(ul);
    if (items.length < 1 || items.length > 6) E(ul, `${label(ul)}: 1–6 items (found ${items.length})`);
    items.forEach(li => {
      if (!need(li, 'an item', C.classes.item, 'li')) return;
      onlyAttrs(li, { class: true }); noText(li);
      const [tick, body, ...y] = kids(li);
      if (!tick || tick.tag !== 'svg' || !has(tick, 'sources-tick')) E(li, `${label(li)}: an item opens with its tick, <svg class="sources-tick">, copied as it is`); else svgIcon(tick, label(li), C.classes.tick);
      if (labels) {
        if (!body || !has(body, 'sources-label')) E(li, `${label(li)}: with data-items="labels" the tick is followed by span.sources-label`); else plain(body, 'the label', C.classes.label, 'span');
      } else if (!body || !need(body, 'the item\'s body', C.classes.itemBody, 'span')) E(li, `${label(li)}: span.sources-item-body (the name and its text) follows the tick`);
      else {
        onlyAttrs(body, { class: true }); noText(body);
        const [a, b, ...z] = kids(body);
        if (!a || !has(a, 'sources-item-title')) E(body, `${label(body)}: opens with span.sources-item-title`); else plain(a, 'the item\'s name', C.classes.itemTitle, 'span');
        if (!b || !has(b, 'sources-item-text')) E(body, `${label(body)}: span.sources-item-text follows the name`); else text(b, 'the item\'s text', C.classes.itemText, 'span');
        z.forEach(q => E(q, `${label(q)}: an item holds its name and its text`));
      }
      y.forEach(z => E(z, `${label(z)}: an item holds its tick and its ${labels ? 'label' : 'body'}`));
    });
    x.forEach(z => E(z, `${label(z)}: a group holds its head and its list`));
  };
  const headBlock = h => {
    if (!h || !has(h, 'section-head')) { E(h || inner, `${label(inner)}: the head block, div.section-head, comes first`); return; }
    R.headBlock(h, { measures: C.variants.head['data-measure'].values, introMeasures: C.variants.intro['data-measure'].values, title: C.inline.title, intro: C.inline.intro });
  };
  const frame = f => {
    if (!f || !need(f, 'the frame', C.classes.frame, 'div')) { E(f || inner, `${label(f || inner)}: expected div.sources-frame`); return null; }
    mustHave(f, C.hooks.reveal); onlyAttrs(f, { class: true }); noText(f);
    const fk = kids(f);
    if (fk.length !== 1) { E(f, `${label(f)}: holds exactly one sheet`); return null; }
    return fk[0];
  };
  const termDesc = (dt, dd, host) => {
    if (!dt || !has(dt, 'sources-term')) E(host, `${label(host)}: dt.sources-term (the source's name) is required`); else plain(dt, 'the source\'s name', C.classes.term, 'dt');
    if (!dd || !has(dd, 'sources-desc')) E(host, `${label(host)}: dd.sources-desc follows the name`); else text(dd, 'the source\'s description', C.classes.desc, 'dd');
  };

  if (layout === 'groups') {
    const [h, grid2, notes, ...rest] = parts;
    headBlock(h);
    if (!grid2 || !need(grid2, 'the groups', C.classes.grid, 'div')) { E(grid2 || inner, `${label(inner)}: div.sources-grid follows the head`); return; }
    mustHave(grid2, C.hooks.grid); onlyAttrs(grid2, { class: true }); noText(grid2);
    const [g1, g2, stat, ...x] = kids(grid2);
    if (!g1 || !g2 || !has(g1, 'sources-group') || !has(g2, 'sources-group')) E(grid2, `${label(grid2)}: holds two div.sources-group and then div.sources-stat`);
    else { group(g1); group(g2); }
    if (!stat || !need(stat, 'the figure card', C.classes.stat, 'div')) E(grid2, `${label(grid2)}: div.sources-stat (the figure) closes the row`);
    else {
      onlyAttrs(stat, { class: true }); noText(stat);
      const [ic, v, t, ...y] = kids(stat);
      if (!ic || !need(ic, 'the figure\'s icon', C.classes.statIcon, 'span')) E(stat, `${label(stat)}: opens with span.sources-stat-icon`);
      else { onlyAttrs(ic, { class: true }); noText(ic); const s = kids(ic); if (s.length !== 1) E(ic, `${label(ic)}: holds only its <svg>`); svgIcon(s[0], label(ic), []); }
      if (!v || !has(v, 'sources-stat-value')) E(stat, `${label(stat)}: div.sources-stat-value follows the icon`); else plain(v, 'the figure', C.classes.statValue, 'div');
      if (!t || !has(t, 'sources-stat-text')) E(stat, `${label(stat)}: p.sources-stat-text follows the figure`); else text(t, 'the figure\'s sentence', C.classes.statText, 'p');
      y.forEach(z => E(z, `${label(z)}: the figure card holds its icon, the figure and one sentence`));
    }
    x.forEach(z => E(z, `${label(z)}: the row holds two groups and the figure card`));
    if (notes) {
      if (need(notes, 'the notes', C.classes.notes, 'div')) {
        mustHave(notes, C.hooks.reveal); onlyAttrs(notes, { class: true }); noText(notes);
        const nk = kids(notes);
        if (nk.length < 1 || nk.length > 2) E(notes, `${label(notes)}: one or two p.sources-note (found ${nk.length})`);
        nk.forEach(n => { if (need(n, 'a note', C.classes.note, 'p')) { onlyAttrs(n, { class: true, 'data-tone': true }); variantsOf(n, C.variants.note); inlineOnly(n, C.inline.text, 'a note'); filled(n, 'a note (remove it instead)'); } });
      }
    }
    rest.forEach(z => E(z, `${label(z)}: under the groups goes one div.sources-notes at most`));
  } else if (layout === 'flow') {
    const [h, fl, ...rest] = parts;
    headBlock(h);
    if (!fl || !need(fl, 'the flow', C.classes.flow, 'div')) { E(fl || inner, `${label(inner)}: div.sources-flow follows the head`); return; }
    mustHave(fl, C.hooks.reveal); onlyAttrs(fl, { class: true }); noText(fl);
    const [media, arrow, g, ...x] = kids(fl);
    if (!media || media.attrs['data-slot'] !== 'media') E(media || fl, `${label(fl)}: the flow opens with the input — one block with data-slot="media", copied as it is`); else seal(media);
    if (!arrow || !need(arrow, 'the arrow', C.classes.arrow, 'div')) E(fl, `${label(fl)}: div.sources-arrow follows the input, copied as it is`);
    else {
      onlyAttrs(arrow, { class: true, 'aria-hidden': 'true' }); noText(arrow);
      const [line, head2, ...y] = kids(arrow);
      if (!line || !need(line, 'the arrow\'s line', C.classes.arrowLine, 'span')) E(arrow, `${label(arrow)}: opens with span.sources-arrow-line`); else { onlyAttrs(line, { class: true }); empty(line); }
      if (!head2 || head2.tag !== 'svg' || !has(head2, 'sources-arrow-head')) E(arrow, `${label(arrow)}: ends with <svg class="sources-arrow-head">`); else svgIcon(head2, label(arrow), C.classes.arrowHead);
      y.forEach(z => E(z, `${label(z)}: the arrow holds its line and its head`));
    }
    if (!g || !has(g, 'sources-group')) E(fl, `${label(fl)}: div.sources-group closes the flow`); else group(g);
    x.forEach(z => E(z, `${label(z)}: the flow holds the input, the arrow and one group`));
    rest.forEach(z => E(z, `${label(z)}: nothing follows the flow`));
  } else if (layout === 'list') {
    const [split, ...rest] = parts;
    if (!split || !need(split, 'the split', C.classes.split, 'div')) { E(split || inner, `${label(inner)}: holds div.sources-split (the head beside the sheet)`); return; }
    onlyAttrs(split, { class: true }); noText(split);
    const [aside, f, ...x] = kids(split);
    if (!aside || !need(aside, 'the head column', C.classes.aside, 'div')) E(split, `${label(split)}: opens with div.sources-aside (the head)`);
    else {
      mustHave(aside, C.hooks.reveal); onlyAttrs(aside, { class: true }); noText(aside);
      const ak = kids(aside);
      ak.slice(R.headParts(ak, aside, { title: C.inline.title, intro: C.inline.intro })).forEach(z => E(z, `${label(z)}: not part of the head (order: eyebrow?, title, intro?)`));
    }
    const sheet = frame(f);
    if (sheet && need(sheet, 'the sheet', C.classes.sheet, 'div')) {
      onlyAttrs(sheet, { class: true }); noText(sheet);
      const [dl, foot, ...y] = kids(sheet);
      if (!dl || !need(dl, 'the rows', C.classes.rows, 'dl')) E(sheet, `${label(sheet)}: opens with dl.sources-rows`);
      else {
        onlyAttrs(dl, { class: true }); noText(dl);
        const rows = kids(dl);
        if (rows.length < 2 || rows.length > 8) E(dl, `${label(dl)}: 2–8 rows (found ${rows.length})`);
        rows.forEach(r => {
          if (!need(r, 'a row', C.classes.row, 'div')) return;
          onlyAttrs(r, { class: true }); noText(r);
          const [t, b, ...z] = kids(r);
          if (!t || !has(t, 'icon-tile')) E(r, `${label(r)}: a row opens with its span.icon-tile`); else tile(t);
          if (!b || !need(b, 'the row\'s body', C.classes.rowBody, 'div')) E(r, `${label(r)}: div.sources-row-body follows the tile`);
          else { onlyAttrs(b, { class: true }); noText(b); const bk = kids(b); termDesc(bk[0], bk[1], b); bk.slice(2).forEach(q => E(q, `${label(q)}: a row holds one name and one description`)); }
          z.forEach(q => E(q, `${label(q)}: a row holds its tile and its body`));
        });
      }
      if (foot) {
        if (need(foot, 'the sheet\'s last line', C.classes.foot, 'p')) {
          onlyAttrs(foot, { class: true }); noText(foot);
          const [ic, tx, ...z] = kids(foot);
          if (!ic || !need(ic, 'the line\'s icon', C.classes.footIcon, 'span')) E(foot, `${label(foot)}: opens with span.sources-foot-icon`);
          else { onlyAttrs(ic, { class: true }); noText(ic); const s = kids(ic); if (s.length !== 1) E(ic, `${label(ic)}: holds only its <svg>`); svgIcon(s[0], label(ic), []); }
          if (!tx || !has(tx, 'sources-foot-text')) E(foot, `${label(foot)}: span.sources-foot-text follows the icon`); else text(tx, 'the line', C.classes.footText, 'span');
          z.forEach(q => E(q, `${label(q)}: the line holds its icon and its text`));
        }
      }
      y.forEach(z => E(z, `${label(z)}: the sheet holds its rows and one optional last line`));
    }
    x.forEach(z => E(z, `${label(z)}: the split holds the head and the sheet`));
    rest.forEach(z => E(z, `${label(z)}: nothing follows the split`));
  } else {
    const [h, f, ...rest] = parts;
    headBlock(h);
    const dl = frame(f);
    if (dl && need(dl, 'the cells', C.classes.cells, 'dl')) {
      mustHave(dl, C.hooks.cells); onlyAttrs(dl, { class: true }); noText(dl);
      const ck = kids(dl);
      if (![2, 4].includes(ck.length)) E(dl, `${label(dl)}: two or four cells — the sheet is two across (found ${ck.length})`);
      ck.forEach(c => {
        if (!need(c, 'a cell', C.classes.cell, 'div')) return;
        onlyAttrs(c, { class: true }); noText(c);
        const [ch, dt, dd, ...z] = kids(c);
        if (!ch || !need(ch, 'the cell\'s head', C.classes.cellHead, 'div')) E(c, `${label(c)}: a cell opens with div.sources-cell-head`);
        else {
          onlyAttrs(ch, { class: true }); noText(ch);
          const [t, kq, ...q] = kids(ch);
          if (!t || !has(t, 'icon-tile')) E(ch, `${label(ch)}: opens with its span.icon-tile`); else tile(t);
          if (!kq || !has(kq, 'sources-kicker')) E(ch, `${label(ch)}: span.sources-kicker (the kind) follows the tile`); else plain(kq, 'the kind', C.classes.kicker, 'span');
          q.forEach(w => E(w, `${label(w)}: the cell's head holds the tile and the kind`));
        }
        termDesc(dt, dd, c);
        z.forEach(q => E(q, `${label(q)}: a cell holds its head, one name and one description`));
      });
    }
    rest.forEach(z => E(z, `${label(z)}: nothing follows the sheet`));
  }
}

function validate(root, ctx) {
  const R = rules('Sources', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'sources-section')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) { checkSources(r.el, R); r.note = r.el.attrs['data-layout'] || ''; }
  return { found, sealed: R.sealed };
}

const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^sources-/.test(c)));

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'sources-groups.html';
const LABELS = 'sources-groups-labels.html', FLOW = 'sources-flow.html', LIST = 'sources-list.html', CELLS = 'sources-cells.html';
const BAD = [
  ['a utility added to a group', h => h.replace('class="sources-group"', 'class="sources-group p-8"')],
  ['an unknown layout', h => h.replace('data-layout="groups"', 'data-layout="table"')],
  ['the background removed', h => h.replace(/ data-bg="[a-z]+"/, '')],
  ['a switch in an item', h => h.replace('<span class="sources-item-body">', '<input type="checkbox" checked><span class="sources-item-body">')],
  ['an item without its tick', h => h.replace(/\s*<svg class="sources-tick"[\s\S]*?<\/svg>/, '')],
  ['a label instead of a name and a text', h => h.replace(/<span class="sources-item-body">[\s\S]*?<\/span>\s*<\/span>/, '<span class="sources-label">Web</span>')],
  ['a third group', h => h.replace(/(<div class="sources-group">[\s\S]*?<\/ul>\s*<\/div>)/, '$1\n$1')],
  ['the figure card removed', h => h.replace(/\s*<div class="sources-stat">[\s\S]*?<\/p>\s*<\/div>/, '')],
  ['markup in the figure', h => h.replace(/(<div class="sources-stat-value">)([^<]*)/, '$1<b>$2</b>')],
  ['three notes', h => h.replace(/(<p class="sources-note">[\s\S]*?<\/p>)/, '$1\n$1')],
  ['an unknown note tone', h => h.replace('data-tone="warm"', 'data-tone="red"')],
  ['the reveal hook removed from the grid', h => h.replace('class="sources-grid rv-kids"', 'class="sources-grid"')],
  ['a style attribute on a group\'s name', h => h.replace('<span class="sources-kicker"', '<span class="sources-kicker" style="color:red"')],
  ['labels: a name and a text in the homepage groups', h => h.replace(/<span class="sources-label">([^<]*)<\/span>/, '<span class="sources-item-body"><span class="sources-item-title">$1</span><span class="sources-item-text">Text.</span></span>'), LABELS],
  ['labels: data-items on another layout', h => h.replace('data-layout="groups"', 'data-layout="cells"'), LABELS],
  ['flow: the input without its slot mark', h => h.replace(' data-slot="media"', ''), FLOW],
  ['flow: the arrow removed', h => h.replace(/\s*<div class="sources-arrow"[\s\S]*?<\/svg>\s*<\/div>/, ''), FLOW],
  ['flow: a second group', h => h.replace(/(<div class="sources-group">[\s\S]*?<\/ul>\s*<\/div>)/, '$1\n$1'), FLOW],
  ['list: a description without its name', h => h.replace(/\s*<dt class="sources-term">[^<]*<\/dt>/, ''), LIST],
  ['list: a head block above the split', h => h.replace('<div class="sources-split">', '<div class="section-head rv">\n<h2 class="section-title">Sources</h2>\n</div>\n<div class="sources-split">'), LIST],
  ['list: the reveal hook removed from the frame', h => h.replace('class="sources-frame rv"', 'class="sources-frame"'), LIST],
  ['cells: three cells', h => h.replace(/\s*<div class="sources-cell">[\s\S]*?<\/dd>\s*<\/div>/, ''), CELLS],
  ['cells: the hairline hook removed', h => h.replace('class="sources-cells cells"', 'class="sources-cells"'), CELLS],
  ['cells: a cell without its kind', h => h.replace(/\s*<span class="sources-kicker">[^<]*<\/span>/, ''), CELLS],
];
const GOOD = [
  ['new names and texts, a group\'s last item removed', h => {
    const o = h.replace(/(<span class="sources-item-title">)[^<]*/, '$1Web sources').replace(/(<span class="sources-item-text">)[^<]*/, '$1A new text with <strong>a strong phrase</strong>.');
    const end = o.indexOf('</ul>'), i = o.lastIndexOf('<li class="sources-item">', end);
    return o.slice(0, i) + o.slice(o.indexOf('</li>', i) + 5);
  }],
  ['another figure and sentence', h => h.replace(/(<div class="sources-stat-value">)[^<]*/, '$11 billion').replace(/(<p class="sources-stat-text">)[^<]*/, '$1A new sentence.')],
  ['one note',h => h.replace(/\s*<p class="sources-note" data-tone="warm">[\s\S]*?<\/p>/, '')],
  ['the notes removed', h => h.replace(/\s*<div class="sources-notes rv">[\s\S]*?<\/p>\s*<\/div>/, '')],
  ['another ground, rhythm, accent and tile tone, the id removed', h => h.replace(/data-bg="[a-z]+"/, 'data-bg="white"').replace(/data-space="[a-z]+"/, 'data-space="md"').replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1mint"').replace(/(<section) id="[^"]*"/, '$1')],
  ['labels: another label, an item added', h => h.replace(/(<span class="sources-label">)[^<]*/, '$1Internet').replace(/(<li class="sources-item">[\s\S]*?<\/li>)/, '$1\n$1'), LABELS],
  ['flow: new item texts', h => h.replace(/(<span class="sources-item-title">)[^<]*/, '$1Web'), FLOW],
  ['list: a row removed, the dark line removed', h => h.replace(/\s*<div class="sources-row">[\s\S]*?<\/dd>\s*<\/div>\s*<\/div>/, '').replace(/\s*<p class="sources-foot">[\s\S]*?<\/p>/, ''), LIST],
  ['cells: two cells, another kind', h => h.replace(/\s*<div class="sources-cell">[\s\S]*?<\/dd>\s*<\/div>/, '').replace(/\s*<div class="sources-cell">[\s\S]*?<\/dd>\s*<\/div>/, '').replace(/(<span class="sources-kicker">)[^<]*/, '$1Setting'), CELLS],
];

module.exports = {
  name: 'sources', title: 'Sources', unit: '',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Sources part outside a complete section (section.sources-section)',
  mentions: html => /class="sources-section"|\bsources-(?:group|list|rows|cells|frame)\b/.test(html),
  SNIPPET, BAD, GOOD,
};
