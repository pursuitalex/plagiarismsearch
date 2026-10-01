/* FAQ — the validator's rules (contract: build/sections/faq.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per FAQ
   found (a section.faq, a .faq-grid inside another component, or a .faq-frame on its own):
     structure   the fixed skeleton, part by part and in order
     classes     only the contract's classes on each part; a Tailwind utility is named as such
     variants    every data-* switch present where required, with an allowed value
     content     question text only; answers and intro limited to the allowed inline tags;
                 nothing empty
     a11y        each button type="button"; aria-expanded matches .open. The answer id /
                 aria-controls pairs are the script's to repair (50-faq.js), so a missing,
                 mismatched or copied pair is a warning, never an error
     behaviour   data-faq on the list; exactly the first item open (the no-JS state shows all)
     sealed      <svg> icons and a [data-slot] block are not inspected inside */
const C = require('./faq.contract');
const { kids, texts, cls, has, textOf, walk, inside, label, rules } = require('./check-tools');

/* ── the FAQ contract, part by part ─────────────────────────────────────────── */
function checkFaq(rootEl, kind, R) {
  const { E, W, sealed, onlyClasses, need, variantsOf, onlyAttrs, noText, inlineOnly, link, svgIcon } = R;
  R.at = rootEl;

  /* section → inner → grid */
  let grid = null, frame = null;
  if (kind === 'section') {
    if (rootEl.tag !== 'section') E(rootEl, `${label(rootEl)}: the FAQ root is a <section>`);
    onlyClasses(rootEl, C.classes.section);
    onlyAttrs(rootEl, ['id', 'class', 'data-component', ...Object.keys(C.variants.section)]);
    if (rootEl.attrs['data-component'] !== 'faq') E(rootEl, `${label(rootEl)}: data-component="faq" is required (the page's component hook)`);
    variantsOf(rootEl, C.variants.section);
    if (rootEl.attrs.id !== undefined && !/^[A-Za-z][\w-]*$/.test(rootEl.attrs.id)) E(rootEl, `${label(rootEl)}: id "${rootEl.attrs.id}" — letters, digits, - and _ only`);
    noText(rootEl);
    const k = kids(rootEl);
    if (k.length !== 1 || !need(k[0], 'the container', C.classes.inner, 'div')) E(rootEl, `${label(rootEl)}: must hold exactly one div.faq-inner`);
    else {
      onlyAttrs(k[0], ['class']); noText(k[0]);
      const g = kids(k[0]);
      if (g.length !== 1 || !need(g[0], 'the grid', C.classes.grid, 'div')) E(k[0], `${label(k[0])}: must hold exactly one div.faq-grid`);
      else { grid = g[0]; onlyAttrs(grid, ['class']); }
    }
  } else if (kind === 'grid') {
    grid = rootEl;
    if (rootEl.tag !== 'div') E(rootEl, `${label(rootEl)}: the grid is a <div>`);
    /* no utilities on the grid, margins included: the host component spaces it */
    onlyClasses(rootEl, C.classes.grid);
    onlyAttrs(rootEl, ['class', ...Object.keys(C.variants.grid)]);
    variantsOf(rootEl, C.variants.grid);
  } else frame = rootEl;

  if (grid) {
    noText(grid);
    const g = kids(grid);
    if (g.length !== 2) E(grid, `${label(grid)}: must hold div.faq-aside then div.faq-frame (found ${g.length} elements)`);
    const aside = g[0], fr = g[1];
    if (aside && need(aside, 'the head column', C.classes.aside, 'div')) { onlyAttrs(aside, ['class']); checkAside(aside); }
    if (fr) frame = fr;
    if (aside && fr && has(aside, 'rv') !== has(fr, 'rv')) W(grid, 'the aside and the frame should both carry .rv, or neither (the reveal is designed as a pair)');
  }

  function checkAside(aside) {
    noText(aside);
    const k = kids(aside);
    let i = 0;
    if (k[i] && has(k[i], 'section-eyebrow')) {
      const e = k[i++];
      need(e, 'the eyebrow', C.classes.eyebrow, 'div'); onlyAttrs(e, ['class', ...Object.keys(C.variants.eyebrow)]); variantsOf(e, C.variants.eyebrow); noText(e);
      const [dot, lab, ...rest] = kids(e);
      if (!dot || !need(dot, 'the eyebrow dot', C.classes.eyebrowDot, 'span')) E(e, `${label(e)}: first child is span.section-eyebrow-dot`);
      else { onlyAttrs(dot, ['class']); if (dot.children.length) E(dot, `${label(dot)}: the dot stays empty`); }
      if (!lab || !need(lab, 'the eyebrow label', C.classes.eyebrowLabel, 'span')) E(e, `${label(e)}: second child is span.section-eyebrow-label`);
      else { onlyAttrs(lab, ['class']); inlineOnly(lab, [], 'the eyebrow label'); if (!textOf(lab).trim()) E(lab, 'the eyebrow label is empty (remove the whole eyebrow instead)'); }
      rest.forEach(r => E(r, `${label(r)}: nothing else goes in the eyebrow`));
    }
    const t = k[i++];
    if (!t || !has(t, 'section-title')) E(t || aside, `${label(aside)}: the h2.section-title is required (after the optional eyebrow)`);
    else {
      need(t, 'the title', C.classes.title, 'h2'); onlyAttrs(t, ['class', 'id']);
      inlineOnly(t, C.inline.title, 'the title'); if (!textOf(t).trim()) E(t, 'the title is empty');
    }
    if (k[i] && has(k[i], 'section-intro')) {
      const p = k[i++];
      need(p, 'the intro', C.classes.intro, 'p'); onlyAttrs(p, ['class', ...Object.keys(C.variants.intro)]); variantsOf(p, C.variants.intro);
      inlineOnly(p, C.inline.intro, 'the intro'); if (!textOf(p).trim()) E(p, 'the intro is empty (remove it instead)');
    }
    if (k[i] && (has(k[i], 'section-more') || has(k[i], 'section-link'))) {
      const m = k[i++];
      let a = m;
      if (m.tag === 'div') {
        need(m, 'the more link wrapper', C.classes.moreWrap, 'div'); onlyAttrs(m, ['class']); noText(m);
        const mk = kids(m);
        if (mk.length !== 1 || mk[0].tag !== 'a' || !has(mk[0], 'section-link')) { E(m, `${label(m)}: holds exactly one a.section-link`); a = null; }
        else { a = mk[0]; onlyClasses(a, ['section-link']); }
      } else if (m.tag === 'a') {
        if (!has(m, 'section-more') || !has(m, 'section-link')) E(m, `${label(m)}: a bare more link carries both classes: section-more section-link`);
        onlyClasses(m, C.classes.moreLink);
      } else { E(m, `${label(m)}: the more link is div.section-more > a.section-link, or a.section-more.section-link`); a = null; }
      if (a) {
        link(a, ['href', 'rel', 'target', 'class']);
        kids(a).forEach((c, j) => { if (c.tag === 'svg' && j === 0) sealed.add(c); else E(c, `${label(c)}: the more link holds its text and, first, an optional <svg> icon`); });
      }
    }
    while (k[i]) {
      const x = k[i++];
      if (x.attrs['data-slot'] === 'aside') { sealed.add(x); W(x, `${label(x)}: an aside slot — validated by its own component's contract, not here`); continue; }
      E(x, `${label(x)}: not part of the FAQ head (order: eyebrow?, title, intro?, more link?, [data-slot="aside"]?)`);
    }
  }

  /* frame → list → items */
  if (frame) {
    if (!need(frame, 'the frame', C.classes.frame, 'div')) return;
    onlyAttrs(frame, ['class', ...Object.keys(C.variants.frame)]); variantsOf(frame, C.variants.frame); noText(frame);
    const fk = kids(frame);
    if (fk.length !== 1 || !need(fk[0], 'the list', C.classes.list, 'div')) { E(frame, `${label(frame)}: must hold exactly one div.faq-list`); return; }
    const list = fk[0];
    onlyAttrs(list, ['class', 'data-faq']); noText(list);
    if (!('data-faq' in list.attrs)) E(list, `${label(list)}: data-faq is required (the accordion's JS hook)`);
    const items = kids(list);
    if (!items.length) E(list, `${label(list)}: at least one .faq-item`);
    const ids = [];
    items.forEach((it, n) => {
      if (!need(it, 'a question', C.classes.item, 'div')) return;
      onlyAttrs(it, ['class']); noText(it);
      const open = has(it, 'open');
      if (n === 0 && !open) E(it, `${label(it)}: the first question renders open: class="faq-item open"`);
      if (n > 0 && open) E(it, `${label(it)}: only the first question renders open`);
      const ik = kids(it);
      if (ik.length !== 2) E(it, `${label(it)}: holds the question button (or its heading) and div.faq-a (found ${ik.length} elements)`);
      let btn = ik[0];
      if (btn && /^h[2-6]$/.test(btn.tag)) {
        need(btn, 'the question heading', C.classes.heading); onlyAttrs(btn, ['class']); noText(btn);
        const hk = kids(btn); btn = hk.length === 1 ? hk[0] : null;
        if (!btn) E(ik[0], `${label(ik[0])}: holds exactly the button`);
      }
      const ans = ik[1];
      if (btn && need(btn, 'the question button', C.classes.q, 'button')) {
        onlyAttrs(btn, ['type', 'class', 'aria-controls', 'aria-expanded']); noText(btn);
        if (btn.attrs.type !== 'button') E(btn, `${label(btn)}: type="button" is required`);
        if (btn.attrs['aria-expanded'] !== String(open)) E(btn, `${label(btn)}: aria-expanded="${btn.attrs['aria-expanded']}" but the item is ${open ? 'open' : 'closed'} — it must be "${open}"`);
        const [qt, ch, ...rest] = kids(btn);
        if (!qt || !need(qt, 'the question text', C.classes.qText, 'span')) E(btn, `${label(btn)}: first child is span.faq-q-text`);
        else { onlyAttrs(qt, ['class']); inlineOnly(qt, C.inline.question, 'the question'); if (!textOf(qt).trim()) E(qt, 'the question is empty'); }
        if (!ch || !need(ch, 'the chevron', C.classes.chev, 'span')) E(btn, `${label(btn)}: second child is span.faq-chev with its <svg>`);
        else { onlyAttrs(ch, ['class']); noText(ch); const s = kids(ch); if (s.length !== 1) E(ch, `${label(ch)}: holds only the chevron <svg>`); svgIcon(s[0], label(ch)); }
        rest.forEach(r => E(r, `${label(r)}: nothing else goes in the button`));
        if (ans && ans.attrs && btn.attrs['aria-controls'] !== ans.attrs.id) W(btn, `${label(btn)}: aria-controls="${btn.attrs['aria-controls'] || ''}" does not name this item's answer id "${ans.attrs.id || ''}" — the script repairs the pair on load`);
      } else if (!btn) E(it, `${label(it)}: the question is a button.faq-q`);
      if (ans && need(ans, 'the answer', C.classes.a, 'div')) {
        onlyAttrs(ans, ['class', 'id']); noText(ans);
        if (!ans.attrs.id) W(ans, `${label(ans)}: no id — the script gives it one on load`);
        else ids.push({ id: ans.attrs.id, n: n + 1, el: ans });
        const ak = kids(ans);
        if (ak.length !== 1 || ak[0].tag !== 'div' || Object.keys(ak[0].attrs).length) E(ans, `${label(ans)}: holds exactly one plain <div> (it clips the answer while it opens)`);
        else {
          noText(ak[0]);
          const bk = kids(ak[0]);
          if (bk.length !== 1 || !has(bk[0], 'faq-a-body')) E(ak[0], `${label(ak[0])}: holds exactly one .faq-a-body`);
          else body(bk[0]);
        }
      } else if (!ans) E(it, `${label(it)}: the answer div.faq-a is missing`);
    });
    /* ids: <ns>-a1 … <ns>-aN, one namespace per list */
    const ns = ids.map(x => (x.id.match(/^(.*)-a(\d+)$/) || [])[1]);
    ids.forEach((x, j) => {
      const m = x.id.match(/^(.*)-a(\d+)$/);
      if (!m || +m[2] !== x.n) W(x.el, `id "${x.id}": the convention is <namespace>-a${x.n}`);
      else if (ns[j] !== ns[0]) W(x.el, `id "${x.id}": one namespace per FAQ ("${ns[0]}")`);
    });
  }

  function body(b) {
    onlyAttrs(b, ['class']);
    if (b.tag === 'p') {
      onlyClasses(b, C.classes.body);
      inlineOnly(b, C.inline.answer, 'an answer');
      if (!textOf(b).trim()) E(b, 'the answer is empty');
      return;
    }
    if (b.tag !== 'div') { E(b, `${label(b)}: the answer is p.faq-a-body or div.faq-a-body`); return; }
    onlyClasses(b, C.classes.body); noText(b);
    const ps = kids(b);
    if (!ps.length) E(b, `${label(b)}: a rich answer holds at least one <p>`);
    ps.forEach((p, j) => {
      if (p.tag !== 'p') { E(p, `${label(p)}: a rich answer holds only <p> paragraphs`); return; }
      if (has(p, 'faq-a-more')) {
        onlyClasses(p, C.classes.more); onlyAttrs(p, ['class']); noText(p);
        if (j !== ps.length - 1) E(p, `${label(p)}: the follow-up link paragraph comes last`);
        const [a, ...rest] = kids(p);
        if (!a || a.tag !== 'a' || !has(a, 'faq-a-link')) { E(p, `${label(p)}: holds one a.faq-a-link`); return; }
        onlyClasses(a, C.classes.aLink); link(a, ['href', 'rel', 'target', 'class']);
        rest.forEach(r => E(r, `${label(r)}: one link per follow-up paragraph`));
        const ak = kids(a);
        if (ak.length) {
          /* <span>label</span><span class="faq-a-link-icon"><svg…></span> */
          const [l, ic, ...more] = ak;
          if (l.tag !== 'span' || cls(l).length) E(l, `${label(l)}: with an icon, the label is a plain <span>`);
          else inlineOnly(l, [], 'the link label');
          if (!ic || !need(ic, 'the link icon', C.classes.aLinkIcon, 'span')) E(a, `${label(a)}: the icon sits in span.faq-a-link-icon`);
          else { onlyAttrs(ic, ['class']); const s = kids(ic); if (s.length !== 1) E(ic, `${label(ic)}: holds only the <svg>`); svgIcon(s[0], label(ic)); }
          more.forEach(r => E(r, `${label(r)}: nothing else in the link`));
          if (texts(a).some(t => t.text.trim())) E(a, `${label(a)}: with an icon, the label goes inside the first <span>`);
        }
        return;
      }
      onlyAttrs(p, []);
      if (cls(p).length) E(p, `${label(p)}: paragraphs of a rich answer carry no class`);
      inlineOnly(p, C.inline.answer, 'an answer');
      if (!textOf(p).trim()) E(p, 'an empty paragraph');
    });
  }
}

/* every FAQ in the tree, each checked; → { found, sealed } */
function validate(root, ctx) {
  const R = rules('FAQ', ctx);
  const found = [];
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root') return;
    if (has(n, 'faq') && !inside(n, 'faq')) found.push({ el: n, kind: 'section' });
    else if (has(n, 'faq-grid') && !inside(n, 'faq')) found.push({ el: n, kind: 'grid' });
    else if (has(n, 'faq-frame') && !inside(n, 'faq-grid')) found.push({ el: n, kind: 'frame' });
  });
  for (const r of found) {
    checkFaq(r.el, r.kind, R);
    let k = 0; walk(r.el, n => { if (has(n, 'faq-item')) k++; });
    r.count = k;
  }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits */
const SNIPPET = 'faq-fluid.html';
const GRID = 'faq-grid-embedded.html';

/* known-bad pastes: each must be rejected. [what, edit, snippet (default SNIPPET)] */
const BAD = [
  ['a utility added to an answer', h => h.replace('class="faq-a-body"', 'class="faq-a-body text-ink-900"')],
  ['an unknown variant value', h => h.replace('data-bg="tint"', 'data-bg="blue"')],
  ['a variant removed', h => h.replace(' data-space="lg"', '')],
  ['a pill given its own background', h => h.replace('<div class="section-eyebrow">', '<div class="section-eyebrow" data-bg="tint">')],
  ['an intro given a size', h => h.replace('<p class="section-intro">', '<p class="section-intro" data-size="small">')],
  ['a margin utility on an embedded grid', h => h.replace('<div class="faq-grid"', '<div class="faq-grid mt-12"'), GRID],
  ['aria-expanded out of step with .open', h => h.replace('aria-expanded="true"', 'aria-expanded="false"')],
  ['the inner <div> of an answer removed', h => h.replace(/<div class="faq-a" id="example-faq-a2"><div>([\s\S]*?)<\/div><\/div>/, '<div class="faq-a" id="example-faq-a2">$1</div>')],
  ['data-faq removed', h => h.replace(' data-faq', '')],
  ['a style attribute', h => h.replace('<h2 class="section-title"', '<h2 class="section-title" style="color:red"')],
  ['markup in a question', h => h.replace('<span class="faq-q-text">', '<span class="faq-q-text"><b>New</b> ')],
  ['a <div> left open', h => h.replace('<div class="faq-list" data-faq>', '<div class="faq-list" data-faq><div>')],
];
/* …and the edits the contract allows: each must be accepted */
const GOOD = [
  ['new question and answer text', h => h.replace(/(<span class="faq-q-text">)[^<]*/, '$1A new question?').replace(/(<p class="faq-a-body">)[^<]*/, '$1A new answer.')],
  ['a rich answer: two paragraphs with <strong>', h => h.replace(/<p class="faq-a-body">([^<]*)<\/p>/, '<div class="faq-a-body">\n<p><strong>Short answer.</strong> $1</p>\n<p>$1</p>\n</div>')],
  ['the last question removed', h => h.replace(/\s*<div class="faq-item">(?:(?!<div class="faq-item)[\s\S])*?<\/div><\/div>\s*<\/div>(\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, '$1')],
  ['the intro and the more link removed', h => h.replace(/\s*<p class="section-intro">[\s\S]*?<\/p>/, '').replace(/\s*<div class="section-more">[\s\S]*?<\/div>/, '')],
  ['other variant values', h => h.replace('data-bg="tint"', 'data-bg="white"').replace('data-space="lg"', 'data-space="md"').replace('data-layout="fluid"', 'data-layout="fluid-narrow"')],
  ['a question copied as it is, ids and all (the script renumbers)', h => h.replace(/(<div class="faq-item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/, '$1\n$1')],
  ['a question pasted without its id pair', h => h.replace(' aria-controls="example-faq-a2"', '').replace(' id="example-faq-a2"', '')],
  ['aria-controls left pointing at another answer', h => h.replace('aria-controls="example-faq-a2"', 'aria-controls="example-faq-a9"')],
  ['an aside slot for another block (a contact card)', h => h.replace(/(\s*<\/div>\s*<div class="faq-frame)/, '\n<div data-slot="aside"><p class="anything">card</p></div>$1')],
];

module.exports = {
  name: 'faq', title: 'FAQ', unit: 'q',
  validate,
  /* a FAQ part: it belongs inside a complete FAQ */
  isPart: n => ('data-faq' in n.attrs) || cls(n).some(c => /^faq-/.test(c)),
  outside: 'a FAQ part outside a complete FAQ (section.faq, .faq-grid or .faq-frame)',
  /* an id the script renumbers at load: a copy of it is a warning, not an error */
  repaired: n => has(n, 'faq-a'),
  repairedNote: 'a copied answer; the script renumbers it on load',
  /* the page filter of the default run */
  mentions: html => /\bfaq-|data-faq/.test(html),
  SNIPPET, BAD, GOOD,
};
