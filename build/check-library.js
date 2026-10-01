/* Section Library validator — does this HTML keep the library's content contract?

   Today it knows one component: the FAQ (contract: build/sections/faq.contract.js). It
   reads a whole page or a bare fragment — the HTML an editor pastes into the CMS — finds
   every FAQ in it and checks the markup the editor may not change, so a broken paste
   fails here instead of on the live page.

   Usage
     node build/check-library.js                      every site/*.html + the catalogue's snippets
     node build/check-library.js <file.html> …        a page, or a fragment saved to a file
     node build/check-library.js --stdin              HTML piped in (a paste)
     require('./build/check-library').validate(html)  → { roots, errors, warnings }

   Exit 1 if any error. Warnings (e.g. an id that does not follow <ns>-aN) do not fail.

   What it checks, per FAQ found (a section.faq, a .faq-grid inside another component, or
   a .faq-frame on its own):
     structure   the fixed skeleton, part by part and in order
     classes     only the contract's classes on each part; a Tailwind utility is named as such
     variants    every data-* switch present where required, with an allowed value
     content     question text only; answers and intro limited to the allowed inline tags;
                 nothing empty
     a11y        each button type="button"; aria-expanded matches .open. The answer id /
                 aria-controls pairs are the script's to repair (50-faq.js), so a missing,
                 mismatched or copied pair is a warning, never an error
     behaviour   data-faq on the list; exactly the first item open (the no-JS state shows all)
     safety      no style="", no on* handlers, no <script>/<style>, no javascript: links,
                 target="_blank" only with rel="noopener"
     sealed      <svg> icons and a [data-slot] block are not inspected inside
   Plus, for the whole input: no FAQ part (data-faq, .faq-item …) outside a recognised FAQ. */
const fs = require('fs');
const path = require('path');
const C = require('./sections/faq.contract');

/* ── a small HTML reader: enough for generated pages and pasted fragments ─────── */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null, line: 1 };
  const problems = [];
  const lineAt = i => html.slice(0, i).split('\n').length;
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/gi;
  let cur = root, last = 0, m;
  const text = (s, i) => { if (s) cur.children.push({ tag: '#text', text: s, parent: cur, line: lineAt(i) }); };
  while ((m = re.exec(html))) {
    text(html.slice(last, m.index), last);
    last = re.lastIndex;
    if (m[0].startsWith('<!')) continue;
    if (m[1]) { cur.children.push({ tag: m[1].toLowerCase(), attrs: attrs(m[0].slice(1 + m[1].length, m[0].indexOf('>'))), children: [], parent: cur, line: lineAt(m.index), raw: true }); continue; }
    if (m[2]) {
      const t = m[2].toLowerCase();
      let n = cur; while (n !== root && n.tag !== t) n = n.parent;
      if (n === root) { problems.push({ line: lineAt(m.index), msg: `</${t}> closes nothing` }); continue; }
      if (n !== cur) problems.push({ line: lineAt(m.index), msg: `<${cur.tag}> (line ${cur.line}) is not closed before </${t}>` });
      n.innerEnd = m.index;
      cur = n.parent; continue;
    }
    /* innerStart/innerEnd: the source of the element's content, for tools that reuse it */
    const el = { tag: m[3].toLowerCase(), attrs: attrs(m[4]), children: [], parent: cur, line: lineAt(m.index), innerStart: re.lastIndex };
    cur.children.push(el);
    if (!VOID.has(el.tag) && !m[5]) cur = el;
  }
  text(html.slice(last), last);
  for (let n = cur; n !== root; n = n.parent) problems.push({ line: n.line, msg: `<${n.tag}> is never closed` });
  return { root, problems };
}
function attrs(s) {
  const o = {};
  for (const a of (s || '').matchAll(/([^\s=/"'>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) o[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? '';
  return o;
}
const kids = n => n.children.filter(c => c.tag !== '#text');
const texts = n => n.children.filter(c => c.tag === '#text');
const cls = n => (n.attrs && n.attrs.class ? n.attrs.class.split(/\s+/).filter(Boolean) : []);
const has = (n, c) => cls(n).includes(c);
const textOf = n => n.tag === '#text' ? n.text : n.children.map(textOf).join('');
const walk = (n, f) => { f(n); (n.children || []).forEach(c => walk(c, f)); };
const label = n => `<${n.tag}${n.attrs && n.attrs.class ? ` class="${n.attrs.class}"` : ''}> (line ${n.line})`;
/* the utility grammar, to name a stray class for what it is */
const UTILITY = /^(?:[a-z]+:)*-?(?:p[trblxy]?|m[trblxy]?|w|h|min-w|max-w|min-h|max-h|gap(?:-[xy])?|space-[xy]|text|font|leading|tracking|bg|from|to|via|ring|shadow|rounded(?:-[trbl]{1,2})?|border(?:-[trblxy])?|divide(?:-[xy])?|decoration|underline-offset|grid-cols|grid-rows|col-span|row-span|top|right|bottom|left|inset(?:-[xy])?|z|opacity|order|basis|grow|shrink|translate-[xy]|scale|rotate|duration|ease|delay|transition|items|justify|self|place|content|overflow(?:-[xy])?|object|aspect|line-clamp|fill|stroke)(?:-.+)?$|^(?:[a-z]+:)*(?:flex|grid|block|inline|inline-flex|inline-block|hidden|relative|absolute|sticky|static|fixed|underline|uppercase|italic|truncate|sr-only|w-full|shrink-0|grow|container)$/;

/* ── the FAQ contract, part by part ─────────────────────────────────────────── */
function checkFaq(rootEl, kind, ctx) {
  const E = (n, msg) => ctx.errors.push({ line: n.line, msg });
  const W = (n, msg) => ctx.warnings.push({ line: n.line, msg });
  const sealed = new Set();

  const onlyClasses = (n, allowed, extra = () => false) => {
    for (const c of cls(n)) {
      if (allowed.includes(c) || extra(c)) continue;
      E(n, `${label(n)}: class "${c}" is not part of the FAQ contract` + (UTILITY.test(c) ? ' — a Tailwind utility; the library class already sets the style' : ''));
    }
  };
  const need = (n, part, allowed, tag) => {
    if (!n) return false;
    if (tag && n.tag !== tag) { E(n, `${label(n)}: expected <${tag}> for ${part}`); return false; }
    if (!has(n, allowed[0])) { E(n, `${label(n)}: expected class "${allowed[0]}" (${part})`); return false; }
    onlyClasses(n, allowed);
    return true;
  };
  const variantsOf = (n, set) => {
    for (const [a, spec] of Object.entries(set)) {
      const v = n.attrs[a];
      if (v === undefined) { if (spec.required) E(n, `${label(n)}: ${a} is required (${spec.values.join(' | ')})`); continue; }
      if (!spec.values.includes(v)) E(n, `${label(n)}: ${a}="${v}" is not a variant (${spec.values.join(' | ')})`);
    }
  };
  const onlyAttrs = (n, allowed) => {
    for (const a of Object.keys(n.attrs)) if (!allowed.includes(a)) E(n, `${label(n)}: attribute ${a} is not part of the FAQ contract`);
  };
  const noText = n => { if (texts(n).some(t => t.text.trim())) E(n, `${label(n)}: stray text "${texts(n).map(t => t.text.trim()).join(' ').slice(0, 40)}"`); };
  /* inline content: text plus the allowed tags (tag or tag.class) */
  const inlineOnly = (n, allowed, what) => {
    for (const c of kids(n)) {
      /* 'strong' allows <strong> without a class; 'a.faq-link' allows exactly that class */
      const key = [c.tag, ...cls(c)].join('.');
      const ok = cls(c).length ? allowed.includes(key) : allowed.includes(c.tag);
      if (!ok) { E(c, `${label(c)} is not allowed in ${what} (allowed: ${allowed.join(', ') || 'text only'})`); continue; }
      if (c.tag === 'a') link(c, ['href', 'rel', 'target', 'class']);
      else onlyAttrs(c, ['class']);
      /* no link inside a link */
      inlineOnly(c, allowed.filter(x => x.split('.')[0] !== 'a'), what);
    }
  };
  const link = (a, allowed) => {
    onlyAttrs(a, allowed);
    const href = a.attrs.href;
    if (!href || !href.trim()) E(a, `${label(a)}: a link needs an href`);
    else if (/^\s*javascript:/i.test(href)) E(a, `${label(a)}: javascript: links are not allowed`);
    if (a.attrs.target === '_blank' && !/\bnoopener\b/.test(a.attrs.rel || '')) E(a, `${label(a)}: target="_blank" needs rel="noopener"`);
    if (!textOf(a).trim()) E(a, `${label(a)}: a link needs text`);
  };
  const svgIcon = (n, where) => {
    if (!n || n.tag !== 'svg') { E(n || rootEl, `${where}: expected the <svg> icon, copied as it is`); return; }
    sealed.add(n);
  };

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
    if (!need(frame, 'the frame', C.classes.frame, 'div')) return sealed;
    onlyAttrs(frame, ['class', ...Object.keys(C.variants.frame)]); variantsOf(frame, C.variants.frame); noText(frame);
    const fk = kids(frame);
    if (fk.length !== 1 || !need(fk[0], 'the list', C.classes.list, 'div')) { E(frame, `${label(frame)}: must hold exactly one div.faq-list`); return sealed; }
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
  return sealed;
}

/* ── find every FAQ in the input and check it ───────────────────────────────── */
function validate(html) {
  const { root, problems } = parse(html);
  const ctx = { errors: problems.map(p => ({ line: p.line, msg: 'markup: ' + p.msg })), warnings: [] };
  const roots = [];
  const inside = (n, c) => { for (let p = n.parent; p; p = p.parent) if (has(p, c)) return true; return false; };
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root') return;
    if (has(n, 'faq') && !inside(n, 'faq')) roots.push({ el: n, kind: 'section' });
    else if (has(n, 'faq-grid') && !inside(n, 'faq')) roots.push({ el: n, kind: 'grid' });
    else if (has(n, 'faq-frame') && !inside(n, 'faq-grid')) roots.push({ el: n, kind: 'frame' });
  });
  const sealed = new Set();
  const covered = new Set();
  for (const r of roots) {
    checkFaq(r.el, r.kind, ctx).forEach(s => sealed.add(s));
    walk(r.el, n => covered.add(n));
  }
  /* everywhere: safety, and no FAQ part outside a recognised FAQ */
  const isSealed = n => { for (let p = n; p; p = p.parent) if (sealed.has(p)) return true; return false; };
  walk(root, n => {
    if (n.tag === '#text' || n.tag === '#root') return;
    const inFaq = covered.has(n);
    if (!inFaq && (('data-faq' in n.attrs) || cls(n).some(c => /^faq-/.test(c)))) ctx.errors.push({ line: n.line, msg: `${label(n)}: a FAQ part outside a complete FAQ (section.faq, .faq-grid or .faq-frame)` });
    if (!inFaq || isSealed(n)) return;
    if (n.tag === 'script' || n.tag === 'style') ctx.errors.push({ line: n.line, msg: `<${n.tag}> is not allowed inside a FAQ` });
    if ('style' in n.attrs) ctx.errors.push({ line: n.line, msg: `${label(n)}: style="" is not allowed — the look comes from the library classes` });
    for (const a of Object.keys(n.attrs)) if (/^on/.test(a)) ctx.errors.push({ line: n.line, msg: `${label(n)}: ${a} handlers are not allowed` });
  });
  /* ids unique in the whole input */
  const seen = new Map();
  walk(root, n => {
    if (!n.attrs || !n.attrs.id) return;
    /* a copied question brings its answer id with it: the script renumbers it on load */
    if (seen.has(n.attrs.id)) (has(n, 'faq-a') ? ctx.warnings : ctx.errors).push({ line: n.line, msg: `id "${n.attrs.id}" is used twice (also line ${seen.get(n.attrs.id)})` + (has(n, 'faq-a') ? ' — a copied answer; the script renumbers it on load' : '') });
    else seen.set(n.attrs.id, n.line);
  });
  /* a page (not a fragment): a section.faq sits at the top level of <main> */
  roots.filter(r => r.kind === 'section').forEach(r => {
    const p = r.el.parent;
    if (p && p.tag !== 'main' && p.tag !== '#root') ctx.warnings.push({ line: r.el.line, msg: `section.faq is inside <${p.tag}> — a FAQ section belongs at the top level of <main>` });
  });
  ctx.errors.sort((a, b) => a.line - b.line);
  return { roots: roots.map(r => ({ kind: r.kind, line: r.el.line, id: r.el.attrs.id || '', items: (() => { let k = 0; walk(r.el, n => { if (has(n, 'faq-item')) k++; }); return k; })() })), ...ctx };
}

/* ── command line ───────────────────────────────────────────────────────────── */
function report(name, html, { quiet = false } = {}) {
  const r = validate(html);
  const head = `${name}: ${r.roots.length} FAQ${r.roots.length === 1 ? '' : 's'}` + (r.roots.length ? ' (' + r.roots.map(x => `${x.kind}${x.id ? '#' + x.id : ''} ${x.items} q, line ${x.line}`).join('; ') + ')' : '');
  if (!r.errors.length && (quiet || !r.warnings.length)) { console.log('  ok    ' + head); return r; }
  console.log((r.errors.length ? '  FAIL  ' : '  ok    ') + head + (r.errors.length ? ` — ${r.errors.length} error(s)` : ''));
  r.errors.slice(0, 25).forEach(e => console.log(`          line ${e.line}: ${e.msg}`));
  if (r.errors.length > 25) console.log(`          … ${r.errors.length - 25} more`);
  if (!quiet) r.warnings.forEach(w => console.log(`          warn line ${w.line}: ${w.msg}`));
  return r;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let failed = 0;
  const run = (name, html, o) => { if (report(name, html, o).errors.length) failed++; };
  if (args.includes('--stdin')) {
    run('stdin', fs.readFileSync(0, 'utf8'));
  } else if (args.length) {
    for (const f of args) run(f, fs.readFileSync(f, 'utf8'));
  } else {
    const SITE = path.join(__dirname, '..', 'site');
    console.log('FAQ contract — every page');
    let n = 0;
    for (const f of fs.readdirSync(SITE).filter(x => x.endsWith('.html')).sort()) {
      const html = fs.readFileSync(path.join(SITE, f), 'utf8');
      if (!/\bfaq-|data-faq/.test(html)) continue;
      n++; run(f, html, { quiet: false });
    }
    console.log(`  (${n} pages with FAQ markup)`);
    /* the catalogue's copy-paste snippets, one by one, as a CMS paste would be */
    const LIB = path.join(__dirname, 'sections', 'snippets');
    if (fs.existsSync(LIB)) {
      console.log('\nFAQ contract — the catalogue snippets (as pasted)');
      for (const f of fs.readdirSync(LIB).filter(x => x.endsWith('.html')).sort()) run('snippets/' + f, fs.readFileSync(path.join(LIB, f), 'utf8'));
    }
    /* the validator must also say no: each known-bad paste has to fail */
    console.log('\nFAQ contract — the validator rejects known-bad pastes');
    const good = fs.existsSync(path.join(LIB, 'faq-fluid.html')) ? fs.readFileSync(path.join(LIB, 'faq-fluid.html'), 'utf8') : null;
    const GRID = fs.existsSync(path.join(LIB, 'faq-grid-embedded.html')) ? fs.readFileSync(path.join(LIB, 'faq-grid-embedded.html'), 'utf8') : null;
    if (good) {
      const BAD = [
        ['a utility added to an answer', h => h.replace('class="faq-a-body"', 'class="faq-a-body text-ink-900"')],
        ['an unknown variant value', h => h.replace('data-bg="tint"', 'data-bg="blue"')],
        ['a variant removed', h => h.replace(' data-space="lg"', '')],
        ['a pill given its own background', h => h.replace('<div class="section-eyebrow">', '<div class="section-eyebrow" data-bg="tint">')],
        ['an intro given a size', h => h.replace('<p class="section-intro">', '<p class="section-intro" data-size="small">')],
        ['a margin utility on an embedded grid', () => GRID && GRID.replace('<div class="faq-grid"', '<div class="faq-grid mt-12"')],
        ['aria-expanded out of step with .open', h => h.replace('aria-expanded="true"', 'aria-expanded="false"')],
        ['the inner <div> of an answer removed', h => h.replace(/<div class="faq-a" id="example-faq-a2"><div>([\s\S]*?)<\/div><\/div>/, '<div class="faq-a" id="example-faq-a2">$1</div>')],
        ['data-faq removed', h => h.replace(' data-faq', '')],
        ['a style attribute', h => h.replace('<h2 class="section-title"', '<h2 class="section-title" style="color:red"')],
        ['markup in a question', h => h.replace('<span class="faq-q-text">', '<span class="faq-q-text"><b>New</b> ')],
        ['a <div> left open', h => h.replace('<div class="faq-list" data-faq>', '<div class="faq-list" data-faq><div>')],
      ];
      for (const [what, mutate] of BAD) {
        const bad = mutate(good);
        const r = bad === good ? null : validate(bad);
        const pass = r && r.errors.length > 0;
        if (!pass) failed++;
        console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + 'rejects ' + what + (r ? (pass ? `  (${r.errors[0].msg.slice(0, 90)})` : '  — accepted!') : '  — mutation did not apply'));
      }
      /* …and yes to the edits the contract allows */
      console.log('\nFAQ contract — the validator accepts allowed edits');
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
      for (const [what, mutate] of GOOD) {
        const g = mutate(good);
        const r = g === good ? null : validate(g);
        const pass = r && !r.errors.length;
        if (!pass) failed++;
        console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + 'accepts ' + what + (r ? (pass ? '' : `  — rejected: ${r.errors[0].msg.slice(0, 110)}`) : '  — edit did not apply'));
      }
    }
  }
  console.log(failed ? `\n${failed} input(s) FAILED the library contract` : '\nall inputs keep the library contract');
  process.exit(failed ? 1 : 0);
}

module.exports = { validate, parse, walk, kids, cls, has, textOf };
