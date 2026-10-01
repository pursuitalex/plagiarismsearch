/* Steps — the validator's rules (contract: build/sections/steps.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.steps-section):
     structure   the head block, the list its layout holds, each step built the way its
                 marker says, at most one foot
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, rv-kids, btn-press …); a Tailwind utility is named as such
     variants    data-layout, data-bg, data-space required; the marker one of its
                 layout's; every other data-* switch with an allowed value, where it belongs
     content     text only in names and numbers; limited inline tags in the texts; nothing
                 empty; numbers in order (a warning)
     sealed      [data-slot="media"] and <svg> icons are not inspected inside */
const C = require('./steps.contract');
const { kids, cls, has, walk, label, textOf, rules } = require('./check-tools');

function checkSteps(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, noText, filled, link, inlineOnly, seal } = R;
  R.at = el;
  R.sectionRoot(el, 'steps', C.classes.section, C.variants.section);
  const layout = el.attrs['data-layout'], marker = el.attrs['data-marker'], bg = el.attrs['data-bg'];
  if (!C.markers[layout]) return;
  if (layout === 'rows' ? marker !== undefined && !C.markers.rows.includes(marker) : !C.markers[layout].includes(marker)) {
    E(el, `${label(el)}: data-layout="${layout}" takes data-marker="${C.markers[layout].join(' | ')}"${layout === 'rows' ? ' (or none)' : ''}, found ${marker === undefined ? 'none' : '"' + marker + '"'}`);
    return;
  }

  /* the ground and the column */
  const k = kids(el);
  let inner = k[0];
  if (inner && has(inner, 'steps-bg')) {
    const bgEl = inner; inner = k[1];
    need(bgEl, 'the ground', C.classes.bg, 'div'); onlyAttrs(bgEl, { class: true }); noText(bgEl);
    if (bg !== 'aqua') E(bgEl, `${label(bgEl)}: the glow goes with data-bg="aqua"`);
    const g = kids(bgEl);
    if (g.length !== 1 || !need(g[0], 'the glow', C.classes.glow, 'div')) E(bgEl, `${label(bgEl)}: holds one div.orb.steps-glow, copied as it is`);
    else { mustHave(g[0], C.hooks.glow); onlyAttrs(g[0], { class: true }); if (g[0].children.some(c => c.tag !== '#text' || c.text.trim())) E(g[0], `${label(g[0])}: the glow stays empty`); }
    k.slice(2).forEach(x => E(x, `${label(x)}: the section holds its ground and div.steps-inner`));
  } else k.slice(1).forEach(x => E(x, `${label(x)}: the section holds div.steps-inner (and, before it, an optional div.steps-bg)`));
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.steps-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  const [head, body, foot, ...rest] = kids(inner);
  if (!head || !has(head, 'section-head')) E(head || inner, `${label(inner)}: the head block, div.section-head, comes first`);
  else R.headBlock(head, { measures: C.variants.head['data-measure'].values, introMeasures: C.variants.intro['data-measure'].values, title: C.inline.title, intro: C.inline.intro });

  /* the parts of a step */
  const text = (p, what = 'the step\'s text') => {
    if (!need(p, what, C.classes.text, 'p')) return;
    onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.text, what); filled(p, what);
  };
  const title = (t, tag) => {
    if (!need(t, 'the step\'s name', C.classes.stepTitle, tag)) return;
    onlyAttrs(t, { class: true }); inlineOnly(t, C.inline.stepTitle, 'the step\'s name'); filled(t, 'the step\'s name');
  };
  const nums = [];
  const number = (n, allowed, what, padded) => {
    if (!need(n, what, allowed, 'span')) return;
    onlyAttrs(n, { class: true, 'aria-hidden': 'true' }); inlineOnly(n, [], what);
    const v = textOf(n).trim();
    if (!/^\d{1,2}$/.test(v)) E(n, `${label(n)}: ${what} is a number (found "${v.slice(0, 20)}")`);
    else nums.push({ n, v, padded });
  };
  const tile = t => R.iconTile(t, { variants: marker === 'icon-stack' ? ['ring'] : [] });
  const only = (parent, list, n, what) => list.slice(n).forEach(x => E(x, `${label(x)}: ${what}`));

  if (layout === 'rows') {
    /* ── rows: the frame, the sheet, a row a step ── */
    if (!body || !need(body, 'the frame', C.classes.frame, 'div')) { E(body || inner, `${label(inner)}: div.steps-frame follows the head`); return; }
    mustHave(body, C.hooks.frame); onlyAttrs(body, { class: true }); noText(body);
    const fk = kids(body);
    const sheet = fk[0];
    if (fk.length !== 1 || !has(sheet, 'steps-sheet') || !['ol', 'div'].includes(sheet.tag)) { E(body, `${label(body)}: holds exactly one .steps-sheet (an <ol> or a <div>)`); return; }
    onlyClasses(sheet, C.classes.sheet); onlyAttrs(sheet, { class: true, role: 'list' }); noText(sheet);
    const rowsEl = kids(sheet);
    if (rowsEl.length < 2 || rowsEl.length > 8) E(sheet, `${label(sheet)}: 2–8 steps (found ${rowsEl.length})`);
    rowsEl.forEach(r => {
      if (!need(r, 'a step', C.classes.row, sheet.tag === 'ol' ? 'li' : 'div')) return;
      onlyAttrs(r, { class: true }); noText(r);
      const [n, h, p, ...x] = kids(r);
      if (!n || !has(n, 'steps-num')) E(r, `${label(r)}: a row opens with its numeral, span.steps-num`); else number(n, C.classes.num, 'the numeral', true);
      if (!h || !need(h, 'the step\'s head', C.classes.rowHead, 'div')) E(h || r, `${label(r)}: div.steps-row-head follows the numeral`);
      else {
        onlyAttrs(h, { class: true }); noText(h);
        const hk = kids(h);
        if (marker === 'icon') {
          const [t, tw, ...y] = hk;
          if (!t || !has(t, 'icon-tile')) E(h, `${label(h)}: with data-marker="icon" the head opens with its span.icon-tile`); else tile(t);
          if (!tw || !need(tw, 'the name block', C.classes.rowTitle, 'div')) E(h, `${label(h)}: div.steps-row-title follows the tile`);
          else {
            onlyAttrs(tw, { class: true }); noText(tw);
            const tk = kids(tw);
            let j = 0;
            if (tk[j] && has(tk[j], 'steps-kicker')) { const kq = tk[j++]; need(kq, 'the label over the name', C.classes.kicker, 'p'); onlyAttrs(kq, { class: true }); inlineOnly(kq, C.inline.label, 'the label over the name'); filled(kq, 'the label over the name (remove it instead)'); }
            if (!tk[j] || !has(tk[j], 'steps-title')) E(tw, `${label(tw)}: the h3.steps-title is required`); else title(tk[j++], 'h3');
            only(tw, tk, j, 'the name block holds an optional p.steps-kicker and the h3.steps-title');
          }
          y.forEach(z => E(z, `${label(z)}: the head holds the tile and div.steps-row-title`));
        } else {
          const [t, tags, ...y] = hk;
          if (!t || !has(t, 'steps-title')) E(h, `${label(h)}: the head opens with the h3.steps-title (a tile and a label need data-marker="icon" on the section)`); else title(t, 'h3');
          if (tags) {
            if (need(tags, 'the tags', C.classes.tags, 'div')) {
              onlyAttrs(tags, { class: true }); noText(tags);
              const tg = kids(tags);
              if (!tg.length) E(tags, `${label(tags)}: at least one span.steps-tag (remove the block instead)`);
              tg.forEach(s => { if (need(s, 'a tag', C.classes.tag, 'span')) { onlyAttrs(s, { class: true }); inlineOnly(s, C.inline.label, 'a tag'); filled(s, 'a tag'); } });
            }
          }
          y.forEach(z => E(z, `${label(z)}: the head holds the name and one optional div.steps-tags`));
        }
      }
      if (!p || !has(p, 'steps-text')) E(r, `${label(r)}: p.steps-text closes the row`); else text(p);
      x.forEach(z => E(z, `${label(z)}: a row holds its numeral, its head and its text`));
    });
  } else {
    /* ── rail and cards: the list, a step by its marker ── */
    const rail = layout === 'rail';
    if (!body || !has(body, 'steps-list') || !(rail ? ['ol'] : ['ol', 'div']).includes(body.tag)) { E(body || inner, `${label(body || inner)}: the list, ${rail ? '<ol class="steps-list rv-kids">' : '.steps-list.rv-kids (an <ol>, or a <div> where approved)'}, follows the head`); return; }
    onlyClasses(body, C.classes.list); mustHave(body, C.hooks.list);
    onlyAttrs(body, { class: true, 'data-cols': true, 'data-link': true, 'data-last': true, 'data-stagger': true });
    variantsOf(body, { ...C.variants.list, 'data-cols': { ...C.variants.list['data-cols'], required: true } });
    noText(body);
    const linked = body.attrs['data-link'] === 'line';
    if ('data-link' in body.attrs && rail) E(body, `${label(body)}: data-link belongs to layout "cards"`);
    if ('data-last' in body.attrs && !rail) E(body, `${label(body)}: data-last belongs to layout "rail"`);
    let items = kids(body);
    if (rail) {
      const line = items[0];
      if (!line || !need(line, 'the rail', C.classes.line, 'span')) E(body, `${label(body)}: the rail list opens with <span class="steps-line" aria-hidden="true"></span>, copied as it is`);
      else { onlyAttrs(line, { class: true, 'aria-hidden': 'true' }); if (line.children.length) E(line, `${label(line)}: the rail stays empty`); items = items.slice(1); }
    }
    if (items.length < 2 || items.length > 6) E(body, `${label(body)}: 2–6 steps (found ${items.length})`);
    const li = body.tag === 'ol' ? 'li' : 'div';
    items.forEach((it, n) => {
      if (!need(it, 'a step', C.classes.item, li)) return;
      onlyAttrs(it, { class: true }); noText(it);
      let p = kids(it);
      if (p[0] && has(p[0], 'steps-link')) {
        const l = p[0]; p = p.slice(1);
        need(l, 'the connector', C.classes.link, 'span'); onlyAttrs(l, { class: true, 'aria-hidden': 'true' });
        if (l.children.length) E(l, `${label(l)}: the connector stays empty`);
        if (!linked) E(l, `${label(l)}: connectors go with data-link="line" on the list`);
        else if (n === items.length - 1) E(l, `${label(l)}: the last card has no connector after it`);
      } else if (linked && n < items.length - 1) E(it, `${label(it)}: with data-link="line" every card but the last opens with <span class="steps-link" aria-hidden="true"></span>`);
      const tileAndNum = m => {
        if (!need(m, 'the marker row', C.classes.marker, 'div')) return;
        onlyAttrs(m, { class: true }); noText(m);
        const [t, nu, ...x] = kids(m);
        if (!t || !has(t, 'icon-tile')) E(m, `${label(m)}: the marker row opens with span.icon-tile`); else tile(t);
        if (!nu || !has(nu, 'steps-num')) E(m, `${label(m)}: span.steps-num follows the tile`); else number(nu, C.classes.num, 'the number', true);
        x.forEach(z => E(z, `${label(z)}: the marker row holds the tile and the number`));
      };
      if (marker === 'icon') {
        if (!p[0] || !has(p[0], 'steps-marker')) E(it, `${label(it)}: data-marker="icon": the step opens with div.steps-marker (the tile and the number)`); else tileAndNum(p[0]);
        if (!p[1] || !has(p[1], 'steps-title')) E(it, `${label(it)}: the h3.steps-title follows the marker`); else title(p[1], 'h3');
        if (!p[2] || !has(p[2], 'steps-text')) E(it, `${label(it)}: p.steps-text closes the step`); else text(p[2]);
        only(it, p, 3, 'a step holds its marker, its name and its text');
      } else if (marker === 'icon-stack') {
        if (!p[0] || !has(p[0], 'icon-tile')) E(it, `${label(it)}: data-marker="icon-stack": the step opens with span.icon-tile`); else tile(p[0]);
        const h = p[1];
        if (!h || !need(h, 'the heading row', C.classes.heading, 'div')) E(it, `${label(it)}: div.steps-heading (the number and the name) follows the tile`);
        else {
          onlyAttrs(h, { class: true }); noText(h);
          const [nu, t, ...x] = kids(h);
          if (!nu || !has(nu, 'steps-num')) E(h, `${label(h)}: the heading row opens with span.steps-num`); else number(nu, C.classes.num, 'the number', true);
          if (!t || !has(t, 'steps-title')) E(h, `${label(h)}: p.steps-title follows the number`); else title(t, 'p');
          x.forEach(z => E(z, `${label(z)}: the heading row holds the number and the name`));
        }
        if (!p[2] || !has(p[2], 'steps-text')) E(it, `${label(it)}: p.steps-text closes the step`); else text(p[2]);
        only(it, p, 3, 'a step holds its tile, its heading row and its text');
      } else {
        /* badge, badge-sm, disc: one numbered mark, the name, the text */
        const m = p[0];
        if (marker === 'badge-sm') {
          if (!m || !need(m, 'the badge\'s holder', C.classes.marker, 'span')) E(it, `${label(it)}: data-marker="badge-sm": the step opens with span.steps-marker > span.steps-badge`);
          else {
            onlyAttrs(m, { class: true }); noText(m);
            const mk = kids(m);
            if (mk.length !== 1 || !has(mk[0], 'steps-badge')) E(m, `${label(m)}: holds exactly one span.steps-badge`); else number(mk[0], C.classes.badge, 'the badge', false);
          }
        } else {
          const want = marker === 'disc' ? 'steps-disc' : 'steps-badge';
          if (!m || !has(m, want)) E(it, `${label(it)}: data-marker="${marker}": the step opens with span.${want}`);
          else number(m, marker === 'disc' ? C.classes.disc : C.classes.badge, marker === 'disc' ? 'the disc' : 'the badge', false);
        }
        if (!p[1] || !has(p[1], 'steps-title')) E(it, `${label(it)}: the h3.steps-title follows the number`); else title(p[1], 'h3');
        if (!p[2] || !has(p[2], 'steps-text')) E(it, `${label(it)}: p.steps-text closes the step`); else text(p[2]);
        only(it, p, 3, 'a step holds its number, its name and its text');
      }
    });
    const cols = +body.attrs['data-cols'];
    if (cols && items.length !== cols && !(cols === 4 && items.length === 2)) W(body, `${label(body)}: data-cols="${cols}" with ${items.length} steps — the last row will not be full`);
  }
  /* numbers in order: 01, 02 … (or 1, 2 …) */
  nums.forEach((x, i) => { const want = x.padded ? String(i + 1).padStart(2, '0') : String(i + 1); if (x.v !== want) W(x.n, `${label(x.n)}: step ${i + 1} is numbered "${x.v}" (expected "${want}")`); });

  /* ── the foot: at most one ── */
  if (foot) {
    if (foot.attrs['data-slot'] === 'media') seal(foot);
    else if (has(foot, 'steps-note')) {
      need(foot, 'the note panel', C.classes.note, 'div'); mustHave(foot, C.hooks.foot); onlyAttrs(foot, { class: true }); noText(foot);
      const [t, a, ...x] = kids(foot);
      if (!t || !need(t, 'the note\'s text', C.classes.noteText, 'div')) E(foot, `${label(foot)}: the panel opens with div.steps-note-text`);
      else {
        onlyAttrs(t, { class: true }); noText(t);
        const lines = kids(t);
        if (lines.length < 1 || lines.length > 3) E(t, `${label(t)}: one to three p.steps-note-line (found ${lines.length})`);
        lines.forEach(l => { if (need(l, 'a line of the note', C.classes.noteLine, 'p')) { onlyAttrs(l, { class: true, 'data-tone': true }); variantsOf(l, C.variants.noteLine); inlineOnly(l, C.inline.noteLine, 'a line of the note'); filled(l, 'a line of the note (remove it instead)'); } });
      }
      if (a) {
        if (need(a, 'the note\'s action', C.classes.noteAction, 'div')) {
          onlyAttrs(a, { class: true }); noText(a);
          const ak = kids(a);
          if (ak.length !== 1 || !has(ak[0], 'action-button')) E(a, `${label(a)}: holds exactly one a.action-button`); else R.actionButton(ak[0], { tones: C.variants.button['data-tone'].values });
        }
      }
      x.forEach(z => E(z, `${label(z)}: the panel holds its text and one optional action`));
    } else if (has(foot, 'steps-actions')) {
      need(foot, 'the action', C.classes.actions, 'div'); mustHave(foot, C.hooks.foot); onlyAttrs(foot, { class: true }); noText(foot);
      const ak = kids(foot);
      if (ak.length !== 1 || !has(ak[0], 'action-button')) E(foot, `${label(foot)}: holds exactly one a.action-button`); else R.actionButton(ak[0], { tones: C.variants.button['data-tone'].values });
    } else if (has(foot, 'steps-more')) {
      need(foot, 'the line with a link', C.classes.more, 'div'); mustHave(foot, C.hooks.foot); onlyAttrs(foot, { class: true }); noText(foot);
      const [p, s, ...x] = kids(foot);
      if (!p || !need(p, 'the line', C.classes.moreText, 'p')) E(foot, `${label(foot)}: opens with p.steps-more-text`);
      else { onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.moreText, 'the line'); filled(p, 'the line'); }
      if (!s || !need(s, 'the link\'s holder', C.classes.moreLink, 'span')) E(foot, `${label(foot)}: span.steps-more-link (the quiet link) follows the line`);
      else {
        onlyAttrs(s, { class: true }); noText(s);
        const sk = kids(s);
        if (sk.length !== 1 || sk[0].tag !== 'a' || !has(sk[0], 'section-link')) E(s, `${label(s)}: holds exactly one a.section-link`);
        else { onlyClasses(sk[0], C.classes.sectionLink); link(sk[0], { href: true, rel: true, target: true, class: true }); inlineOnly(sk[0], [], 'the quiet link'); }
      }
      x.forEach(z => E(z, `${label(z)}: the line holds its text and its link`));
    } else if (has(foot, 'steps-callout')) {
      need(foot, 'the callout', C.classes.callout, 'div'); mustHave(foot, C.hooks.foot); onlyAttrs(foot, { class: true }); noText(foot);
      const [t, p, ...x] = kids(foot);
      if (!t || !has(t, 'icon-tile')) E(foot, `${label(foot)}: the callout opens with its span.icon-tile`); else R.iconTile(t);
      if (!p || !need(p, 'the callout text', C.classes.calloutText, 'p')) E(foot, `${label(foot)}: p.steps-callout-text follows the tile`);
      else { onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.calloutText, 'the callout text'); filled(p, 'the callout text'); }
      x.forEach(z => E(z, `${label(z)}: the callout holds its tile and one paragraph`));
    } else E(foot, `${label(foot)}: under the list goes one of: div.steps-note, div.steps-actions, div.steps-more, div.steps-callout, or a sealed [data-slot="media"]`);
  }
  rest.forEach(x => E(x, `${label(x)}: one block at most under the list`));
}

function validate(root, ctx) {
  const R = rules('Steps', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'steps-section')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) {
    checkSteps(r.el, R);
    r.note = [r.el.attrs['data-layout'], r.el.attrs['data-marker']].filter(Boolean).join(' · ');
    let k = 0; walk(r.el, n => { if (has(n, 'steps-item') || has(n, 'steps-row')) k++; });
    r.count = k;
  }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'steps-rail.html';
const CARDS = 'steps-cards-linked.html', BADGE = 'steps-cards-badge.html', STACK = 'steps-cards-stack.html', ROWS = 'steps-rows.html', ROWS_ICON = 'steps-rows-icon.html', DISC = 'steps-rail-disc.html', MORE = 'steps-cards-compact.html';
const firstStep = /\s*<li class="steps-item">[\s\S]*?<\/li>/;
const BAD = [
  ['a utility added to a step\'s name', h => h.replace('class="steps-title"', 'class="steps-title text-ink-900"')],
  ['an unknown layout', h => h.replace('data-layout="rail"', 'data-layout="timeline"')],
  ['a marker of another layout', h => h.replace('data-marker="icon"', 'data-marker="badge"')],
  ['the background removed', h => h.replace(/ data-bg="[a-z]+"/, '')],
  ['an unknown rhythm', h => h.replace(/data-space="[a-z]+"/, 'data-space="xl"')],
  ['the rail removed from the list', h => h.replace(/\s*<span class="steps-line" aria-hidden="true"><\/span>/, '')],
  ['the reveal hook removed from the list', h => h.replace('class="steps-list rv-kids"', 'class="steps-list"')],
  ['the column count removed', h => h.replace(/ data-cols="\d"/, '')],
  ['a step without its icon tile', h => h.replace(/\s*<span class="icon-tile"[\s\S]*?<\/span>/, '')],
  ['an unknown tile tone', h => h.replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1blue"')],
  ['markup in a step\'s name', h => h.replace(/(<h3 class="steps-title">)([^<]*)/, '$1<b>$2</b>')],
  ['a step\'s text removed', h => h.replace(/\s*<p class="steps-text">[\s\S]*?<\/p>/, '')],
  ['a single step', h => { let o = h; for (let i = 0; i < 6 && (o.match(/<li class="steps-item">/g) || []).length > 1; i++) o = o.replace(firstStep, ''); return o; }],
  ['a link in the middle of a step, as a button', h => h.replace(/(<p class="steps-text">[^<]*<\/p>)/, '$1\n<a href="#x" class="action-button btn-press group">Go<span class="action-button-orb icon-orb"><svg></svg></span></a>')],
  ['two blocks under the list', h => h.replace(/(\n  <\/div>\n<\/section>)/, '\n    <div class="steps-actions rv"><a href="#x" class="action-button btn-press group" data-tone="light">Go<span class="action-button-orb icon-orb"><svg></svg></span></a></div>\n    <div class="steps-actions rv"><a href="#x" class="action-button btn-press group" data-tone="light">Go<span class="action-button-orb icon-orb"><svg></svg></span></a></div>$1').replace(/\s*<div class="steps-note rv">[\s\S]*?\n    <\/div>(?=\s*<div class="steps-actions)/, '')],
  ['a style attribute on the section title', h => h.replace('<h2 class="section-title"', '<h2 class="section-title" style="color:red"')],
  ['cards: connectors without data-link', h => h.replace(' data-link="line"', ''), CARDS],
  ['cards: the last card given a connector', h => h.replace(/(<li class="steps-item">)(?![\s\S]*<li class="steps-item">)/, '$1\n<span class="steps-link" aria-hidden="true"></span>'), CARDS],
  ['cards: data-last on a card list', h => h.replace('data-link="line"', 'data-link="line" data-last="apart"'), CARDS],
  ['badge: a word in the badge', h => h.replace(/(<span class="steps-badge">)\d+/, '$1One'), BADGE],
  ['badge: the sealed block without its slot mark', h => h.replace(' data-slot="media"', ''), BADGE],
  ['stack: the ring tile outside its marker', h => h.replace('data-marker="icon-stack"', 'data-marker="icon"'), STACK],
  ['stack: an unknown button tone', h => h.replace(/(class="action-button btn-press group") data-tone="[a-z]+"/, '$1 data-tone="blue"'), STACK],
  ['rows: a tile without data-marker="icon"', h => h.replace(/(<div class="steps-row-head">)/, '$1\n<span class="icon-tile" data-tone="teal"><svg></svg></span>'), ROWS],
  ['rows: an empty tags block', h => h.replace(/(<div class="steps-tags">)[\s\S]*?(<\/div>)/, '$1$2'), ROWS],
  ['rows: the reveal hook removed from the frame', h => h.replace('class="steps-frame rv"', 'class="steps-frame"'), ROWS],
  ['rows, icon: tags instead of the label', h => h.replace(/(<h3 class="steps-title">[^<]*<\/h3>)/, '$1\n<div class="steps-tags"><span class="steps-tag">New</span></div>'), ROWS_ICON],
];
const GOOD = [
  ['new step names and texts', h => h.replace(/(<h3 class="steps-title">)[^<]*/, '$1Upload').replace(/(<p class="steps-text">)[^<]*/, '$1A new text with <strong>one strong phrase</strong>.')],
  ['a step removed (a warning: the row is not full, the numbers)', h => h.replace(firstStep, '')],
  ['another tone for a tile, another icon', h => h.replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1mint"')],
  ['the pill and the intro removed, another head width', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/\s*<p class="section-intro"[^>]*>[\s\S]*?<\/p>/, '').replace('class="section-head rv"', 'class="section-head rv" data-measure="760"')],
  ['another ground, rhythm and accent, the id removed', h => h.replace(/data-bg="[a-z]+"/, 'data-bg="cool"').replace(/data-space="[a-z]+"/, 'data-space="md" data-accent="teal"').replace(/(<section) id="[^"]*"/, '$1')],
  ['the note panel without its button, one line', h => h.replace(/\s*<div class="steps-note-action">[\s\S]*?<\/a>\s*<\/div>/, '').replace(/\s*<p class="steps-note-line" data-tone="strong">[\s\S]*?<\/p>/, '')],
  ['the foot removed', h => h.replace(/\s*<div class="steps-note rv">[\s\S]*?\n    <\/div>(?=\n  <\/div>\n<\/section>)/, '')],
  ['cards: a new text, the intro given <em>', h => h.replace(/(<p class="steps-text">)[^<]*/, '$1New.').replace(/(<p class="section-intro">)/, '$1<em>Note:</em> '), CARDS],
  ['badge: another title', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1How the workflow runs'), BADGE],
  ['compact: the line with a link edited, an external link', h => h.replace(/(<p class="steps-more-text">)[^<]*/, '$1More about data.').replace(/<a href="[^"]*" class="section-link">/, '<a href="https://example.com/" target="_blank" rel="noopener" class="section-link">'), MORE],
  ['disc: the callout removed', h => h.replace(/\s*<div class="steps-callout rv">[\s\S]*?<\/p>\s*<\/div>/, ''), DISC],
  ['rows: a tag removed, the tags of the last step removed', h => { const o = h.replace(/\s*<span class="steps-tag">[^<]*<\/span>/, ''); const i = o.lastIndexOf('<div class="steps-tags">'); return o.slice(0, i) + o.slice(o.indexOf('</div>', i) + 6); }, ROWS],
  ['rows, icon: the label over a name removed', h => h.replace(/\s*<p class="steps-kicker">[^<]*<\/p>/, ''), ROWS_ICON],
];

/* the classes that are this component's own (the Moodle guide's ol.steps, .steps-n and
   .steps-tight — 21-docs.css — are another block; that is why the root is .steps-section) */
const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^steps-/.test(c)));

module.exports = {
  name: 'steps', title: 'Steps', unit: 'steps',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Steps part outside a complete section (section.steps-section)',
  mentions: html => /class="steps-section"|\bsteps-(?:list|item|row|sheet)\b/.test(html),
  SNIPPET, BAD, GOOD,
};
