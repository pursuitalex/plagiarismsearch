/* Hero — the validator's rules (contract: build/sections/hero.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per hero
   found (a section.hero):
     structure   the ground, the column, the blocks its layout holds, in order; exactly
                 one sealed object — the checker or the diagram
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, btn-press, group, icon-orb …); a Tailwind utility is named as such
     variants    data-layout required; every other data-* switch with an allowed value, on
                 the layout it belongs to
     content     an h1; text only in labels; title, lead and notes limited to the allowed
                 inline tags; at most one pen word; nothing empty
     sealed      [data-slot="checker"] and [data-slot="media"] are not inspected inside
                 (the checker only for what must stay in step: it holds the form, and its
                 button returns to the hero's anchor — a warning); <svg> icons neither
     repaired    a pen mark drawn for another word, a bare word in a rising title: the
                 scripts repair both on load, so they only warn */
const C = require('./hero.contract');
const { kids, texts, cls, has, walk, label, textOf, ID, rules } = require('./check-tools');

/* the pen mark is drawn 18 units a character (build/sections/hero.js); beyond a quarter
   off, 18-pen-mark.js redraws it on load */
const PEN_UNIT = 18;

function checkHero(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, requireAttrs, noText, filled, link, inlineOnly, svgIcon, seal } = R;
  R.at = el;
  if (el.tag !== 'section') E(el, `${label(el)}: the hero root is a <section>`);
  onlyClasses(el, C.classes.section);
  onlyAttrs(el, { id: ID, class: true, 'data-component': true, 'data-layout': true });
  requireAttrs(el, { 'data-component': 'hero' });
  variantsOf(el, C.variants.section);
  noText(el);
  const layout = el.attrs['data-layout'];
  if (!C.variants.section['data-layout'].values.includes(layout)) return;
  const center = layout === 'center', hub = layout === 'hub';

  const layer = (n, what, allowed, hooks) => {
    if (!n || !need(n, what, allowed, 'div')) { E(n || el, `${label(n || el)}: expected div.${allowed[0]} (${what}), copied as it is`); return; }
    mustHave(n, hooks); onlyAttrs(n, { class: true, 'aria-hidden': 'true' });
    if (n.children.some(c => c.tag !== '#text' || c.text.trim())) E(n, `${label(n)}: ${what} stays empty`);
  };

  /* ── the ground and the column ── */
  const k = kids(el);
  let inner;
  if (center) {
    if (k.length !== 2) E(el, `${label(el)}: the center hero holds div.hero-bg and div.hero-inner (found ${k.length} elements)`);
    const bg = k[0];
    if (!bg || !need(bg, 'the ground', C.classes.bg, 'div')) E(bg || el, `${label(el)}: first child is div.hero-bg, copied as it is`);
    else {
      onlyAttrs(bg, { class: true }); noText(bg);
      const [dots, cool, warm, ...rest] = kids(bg);
      layer(dots, 'the dot field', C.classes.dots, C.hooks.dots);
      layer(cool, 'the cool glow', C.classes.orbCool, C.hooks.glow);
      layer(warm, 'the warm glow', C.classes.orbWarm, C.hooks.glow);
      rest.forEach(r => E(r, `${label(r)}: the ground holds the dot field and the two glows, nothing else`));
    }
    inner = k[1];
  } else {
    if (k.length !== 4) E(el, `${label(el)}: the hero holds the dot field, the two glows and div.hero-inner (found ${k.length} elements)`);
    layer(k[0], 'the dot field', C.classes.dots, C.hooks.dots);
    layer(k[1], 'the cool glow', C.classes.glowCool, C.hooks.glow);
    layer(k[2], 'the warm glow', C.classes.glowWarm, C.hooks.glow);
    inner = k[3];
  }
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.hero-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  /* ── the sealed checker: the form is there, and its button returns to this hero ── */
  const checkerSlot = n => {
    if (!n || n.attrs['data-slot'] !== 'checker') { E(n || inner, `${label(n || inner)}: expected the checker — the block with data-slot="checker", copied as it is`); return; }
    seal(n);
    let form = null; const anchors = [];
    walk(n, x => { if (x.tag === 'form' && x.attrs && 'data-checker' in x.attrs) form = x; if (x.tag === 'a' && x.attrs.href && x.attrs.href[0] === '#') anchors.push(x); });
    if (!form) { E(n, `${label(n)}: the checker slot holds the quick-check form (form[data-checker]); copy the whole block from the snippet`); return; }
    if (el.attrs.id && anchors.length && !anchors.some(a => a.attrs.href === '#' + el.attrs.id))
      W(anchors[0], `${label(anchors[0])}: the checker's button goes to ${anchors[0].attrs.href}, the hero's anchor is #${el.attrs.id} — keep the two the same`);
  };
  const free = p => {
    if (!p || !need(p, 'the line under the checker', C.classes.free, 'p')) { E(p || inner, `${label(p || inner)}: p.hero-free (the line under the checker) follows the checker`); return; }
    onlyAttrs(p, { class: true });
    const [icon, ...rest] = kids(p);
    if (!icon || icon.tag !== 'svg' || !has(icon, 'hero-free-icon')) E(p, `${label(p)}: the line opens with its spark, <svg class="hero-free-icon">, copied as it is`);
    else svgIcon(icon, label(p), C.classes.freeIcon);
    if (rest.some(r => r.tag === 'svg')) E(p, `${label(p)}: one icon`);
    inlineOnly(p, C.inline.free, 'the line under the checker'); filled(p, 'the line under the checker');
  };

  /* ── the head ── */
  const head = h => {
    if (!h || !need(h, 'the head', center ? C.classes.head.filter(c => c !== 'rv') : C.classes.head, 'div')) { E(h || inner, `${label(h || inner)}: div.hero-head is required first`); return; }
    if (!center) mustHave(h, ['rv']);
    onlyAttrs(h, { class: true }); noText(h);
    const p = kids(h);
    let i = 0;
    if (p[i] && has(p[i], 'section-eyebrow')) {
      if (center) E(p[i], `${label(p[i])}: the center hero has no pill`);
      R.eyebrow(p[i++], C.classes);
    }
    const t = p[i++];
    if (!t || !has(t, 'hero-title')) { E(t || h, `${label(h)}: the h1.hero-title is required (after the optional pill)`); return; }
    title(t);
    let leads = 0;
    while (p[i] && has(p[i], 'hero-lead')) {
      const l = p[i++]; leads++;
      need(l, 'the lead', C.classes.lead, 'p');
      onlyAttrs(l, { class: true, 'data-measure': true, 'data-hero-support': '' }); variantsOf(l, C.variants.lead);
      if ('data-hero-support' in l.attrs && !center) E(l, `${label(l)}: data-hero-support belongs to the center hero (the rising title)`);
      inlineOnly(l, C.inline.lead, 'the lead'); filled(l, 'the lead');
    }
    if (!leads) E(h, `${label(h)}: a p.hero-lead follows the title`);
    if (leads > (hub ? 2 : 1)) E(h, `${label(h)}: ${hub ? 'two leads at most' : 'one lead beside the checker'} (found ${leads})`);
    if (p[i] && has(p[i], 'hero-actions')) {
      const a = p[i++];
      if (!hub) E(a, `${label(a)}: the actions belong to the hub layout — beside a checker the form is the action`);
      need(a, 'the actions', C.classes.actions, 'div'); onlyAttrs(a, { class: true }); noText(a);
      const [b, second, ...more] = kids(a);
      if (!b || !has(b, 'action-button')) E(b || a, `${label(a)}: the first action is the a.action-button`);
      else R.actionButton(b);
      if (second) { if (!has(second, 'action-link')) E(second, `${label(second)}: the button is followed only by the quiet link, a.action-link`); else R.actionLink(second); }
      more.forEach(x => E(x, `${label(x)}: the actions hold the button and at most the quiet link`));
    }
    if (p[i] && has(p[i], 'hero-note')) {
      const n = p[i++];
      if (!hub) E(n, `${label(n)}: the note belongs to the hub layout`);
      need(n, 'the note', C.classes.note, 'p'); onlyAttrs(n, { class: true, 'data-measure': true }); variantsOf(n, C.variants.note);
      inlineOnly(n, C.inline.note, 'the note'); filled(n, 'the note (remove it instead)');
    }
    p.slice(i).forEach(x => E(x, `${label(x)}: not part of the hero head (order: pill?, title, lead, actions?, note?)`));
  };

  function title(t) {
    need(t, 'the title', C.classes.title, 'h1');
    onlyAttrs(t, { class: true, id: ID, 'data-size': true, 'data-hero-title': '' }); variantsOf(t, C.variants.title);
    const rising = 'data-hero-title' in t.attrs;
    if (rising && !center) E(t, `${label(t)}: data-hero-title (the rising words) belongs to the center hero`);
    /* a word of a rising title: span.hw > span.hw-in > text */
    const word = w => {
      onlyClasses(w, C.classes.word); onlyAttrs(w, { class: true }); noText(w);
      const wk = kids(w);
      if (wk.length !== 1 || wk[0].tag !== 'span' || !has(wk[0], 'hw-in')) { E(w, `${label(w)}: a rising word is <span class="hw"><span class="hw-in">word</span></span>`); return; }
      onlyClasses(wk[0], C.classes.wordIn); onlyAttrs(wk[0], { class: true }); inlineOnly(wk[0], [], 'a word of the title');
      if (!rising) E(w, `${label(w)}: the word boxes (span.hw) go with data-hero-title on the h1`);
    };
    const bare = n => texts(n).some(x => x.text.trim());
    const pens = kids(t).filter(c => has(c, 'pen-word'));
    pens.forEach(pw => {
      if (pw.tag !== 'span') E(pw, `${label(pw)}: the pen word is a <span>`);
      onlyClasses(pw, C.classes.pen); onlyAttrs(pw, { class: true });
      const pk = kids(pw);
      const mark = pk[pk.length - 1];
      const last = pw.children.filter(c => c.tag !== '#text' || c.text.trim()).pop();
      if (!mark || mark.tag !== 'svg' || !has(mark, 'pen-mark')) { E(pw, `${label(pw)}: the pen word holds its text and then the line, <svg class="pen-mark">, copied as it is`); return; }
      svgIcon(mark, label(pw), C.classes.penMark);
      if (last !== mark) E(pw, `${label(pw)}: the line <svg> comes after the word`);
      pk.slice(0, -1).forEach(c => { if (c.tag === 'span' && has(c, 'hw')) word(c); else E(c, `${label(c)} is not allowed in the pen word (its text, then the line)`); });
      const w = textOf(pw).trim();
      if (!w) { E(pw, `${label(pw)}: the pen word is empty`); return; }
      const drawn = +((mark.attrs.viewbox || '').split(/\s+/)[2] || 0);
      const wanted = w.length * PEN_UNIT;
      if (drawn && (drawn < wanted * .75 || drawn > wanted * 1.25)) W(pw, `${label(pw)}: the line was drawn for a word of ${Math.round(drawn / PEN_UNIT)} characters, "${w}" has ${w.length} — the script redraws it on load`);
      if (rising && bare(pw)) W(pw, `${label(pw)}: a bare word in a rising title — the script wraps it on load`);
    });
    if (pens.length > 1) E(t, `${label(t)}: the title carries at most one pen word (found ${pens.length})`);
    kids(t).forEach(c => {
      if (pens.includes(c)) return;
      if (c.tag === 'span' && has(c, 'hw')) return word(c);
      if ((c.tag === 'br' || c.tag === 'wbr') && !cls(c).length) return onlyAttrs(c, {});
      E(c, `${label(c)} is not allowed in the title (allowed: text, one span.pen-word, br, wbr${center ? ', span.hw' : ''})`);
    });
    if (rising && bare(t)) W(t, `${label(t)}: a bare word in a rising title — the script wraps it on load`);
    filled(t, 'the title');
  }

  /* ── the aside: one of three blocks ── */
  const aside = a => {
    if (!need(a, 'the aside', C.classes.aside, 'div')) return;
    mustHave(a, ['rv']); onlyAttrs(a, { class: true }); noText(a);
    const [b, more, ...rest] = kids(a);
    if (!b) { E(a, `${label(a)}: the aside holds one block: ol.hero-path, div.hero-facts or div.hero-notice`); return; }
    if (has(b, 'hero-path')) {
      need(b, 'the path', C.classes.path, 'ol'); onlyAttrs(b, { class: true, 'aria-label': true }); noText(b);
      if (!(b.attrs['aria-label'] || '').trim()) W(b, `${label(b)}: aria-label names the path for a screen reader`);
      const steps = kids(b);
      if (steps.length < 2 || steps.length > 6) E(b, `${label(b)}: a path has 2–6 steps (found ${steps.length})`);
      let current = 0;
      steps.forEach((s, n) => {
        if (!need(s, 'a step', C.classes.pathStep, 'li')) return;
        onlyAttrs(s, { class: true }); noText(s);
        const [pill, arrow, ...x] = kids(s);
        const lastStep = n === steps.length - 1;
        if (!pill || !need(pill, 'the pill', C.classes.pathPill, 'span')) { E(s, `${label(s)}: a step holds span.hero-path-pill`); return; }
        onlyAttrs(pill, { class: true, 'data-state': true }); variantsOf(pill, C.variants.pathPill);
        const isCurrent = pill.attrs['data-state'] === 'current';
        if (isCurrent) current++;
        const pk = kids(pill);
        const dot = pk[0];
        if (isCurrent) {
          if (pk.length !== 1 || !has(dot, 'hero-path-dot')) E(pill, `${label(pill)}: the current pill opens with <span class="hero-path-dot"></span>, then its text`);
          else { need(dot, 'the dot', C.classes.pathDot, 'span'); onlyAttrs(dot, { class: true }); if (dot.children.length) E(dot, `${label(dot)}: the dot stays empty`); }
        } else pk.forEach(c => E(c, `${label(c)} is not allowed in a pill (text only; the dot goes with data-state="current")`));
        if (!textOf(pill).trim()) E(pill, `${label(pill)}: the pill is empty (remove the step instead)`);
        if (lastStep) { if (arrow) E(arrow, `${label(arrow)}: the last step has no arrow after it`); }
        else if (!arrow || arrow.tag !== 'svg' || !has(arrow, 'hero-path-arrow')) E(s, `${label(s)}: the pill is followed by the arrow, <svg class="hero-path-arrow">, copied as it is (every step but the last)`);
        else svgIcon(arrow, label(s), C.classes.pathArrow);
        x.forEach(y => E(y, `${label(y)}: a step holds its pill and the arrow`));
      });
      if (current > 1) E(b, `${label(b)}: one current step at most (found ${current})`);
      [more, ...rest].filter(Boolean).forEach(y => E(y, `${label(y)}: the path stands alone in the aside`));
    } else if (has(b, 'hero-facts')) {
      need(b, 'the facts card', C.classes.facts, 'div'); onlyAttrs(b, { class: true }); noText(b);
      const [figures, note, ...x] = kids(b);
      if (need(figures, 'the figures', C.classes.factsGrid, 'div') === false) E(b, `${label(b)}: first child is div.hero-facts-grid`);
      else {
        onlyAttrs(figures, { class: true }); noText(figures);
        const facts = kids(figures);
        if (facts.length !== 3) E(figures, `${label(figures)}: three figures (found ${facts.length})`);
        facts.forEach(f => {
          if (!need(f, 'a figure', C.classes.fact, 'div')) return;
          onlyAttrs(f, { class: true }); noText(f);
          const [v, l, ...y] = kids(f);
          if (!v || !need(v, 'the value', C.classes.factValue, 'p')) E(f, `${label(f)}: first child is p.hero-fact-value`);
          else { onlyAttrs(v, { class: true }); inlineOnly(v, [], 'the value'); filled(v, 'the value'); }
          if (!l || !need(l, 'the label', C.classes.factLabel, 'p')) E(f, `${label(f)}: second child is p.hero-fact-label`);
          else { onlyAttrs(l, { class: true }); inlineOnly(l, [], 'the label'); filled(l, 'the label'); }
          y.forEach(z => E(z, `${label(z)}: a figure holds its value and its label`));
        });
      }
      if (!note || !need(note, 'the sentence under the figures', C.classes.factsNote, 'p')) E(b, `${label(b)}: p.hero-facts-note follows the figures`);
      else { onlyAttrs(note, { class: true }); inlineOnly(note, C.inline.factsNote, 'the sentence under the figures'); filled(note, 'the sentence under the figures'); }
      x.forEach(y => E(y, `${label(y)}: the card holds the figures and one sentence`));
      if (more) {
        if (need(more, 'the link under the card', C.classes.asideMore, 'p')) {
          onlyAttrs(more, { class: true }); noText(more);
          const mk = kids(more);
          if (mk.length !== 1 || mk[0].tag !== 'a' || !has(mk[0], 'hero-aside-link')) E(more, `${label(more)}: holds exactly one a.hero-aside-link`);
          else {
            const a2 = mk[0];
            onlyClasses(a2, C.classes.asideLink); link(a2, { href: true, rel: true, target: true, class: true });
            kids(a2).forEach((c, j) => { if (c.tag === 'svg' && j === 0) svgIcon(c, label(a2), []); else E(c, `${label(c)}: the link holds its text and, first, an optional <svg> icon`); });
          }
        }
      }
      rest.forEach(y => E(y, `${label(y)}: the aside holds the facts card and at most one link under it`));
    } else if (has(b, 'hero-notice')) {
      need(b, 'the notice', C.classes.notice, 'div'); onlyAttrs(b, { class: true }); noText(b);
      const [t, p, ...x] = kids(b);
      if (!t || !has(t, 'icon-tile')) E(b, `${label(b)}: the notice opens with its span.icon-tile`); else R.iconTile(t);
      if (!p || !need(p, 'the notice text', C.classes.noticeText, 'p')) E(b, `${label(b)}: p.hero-notice-text follows the tile`);
      else { onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.noticeText, 'the notice text'); filled(p, 'the notice text'); }
      x.forEach(y => E(y, `${label(y)}: the notice holds its tile and one paragraph`));
      [more, ...rest].filter(Boolean).forEach(y => E(y, `${label(y)}: the notice stands alone in the aside`));
    } else E(b, `${label(b)}: the aside holds one of: ol.hero-path, div.hero-facts, div.hero-notice`);
  };

  /* ── the blocks, by layout ── */
  if (center) {
    const [h, slot, f, ...rest] = kids(inner);
    head(h); checkerSlot(slot); free(f);
    rest.forEach(x => E(x, `${label(x)}: the center hero holds the head, the checker and the line under it`));
    return;
  }
  const ik = kids(inner);
  const grid = ik[0];
  if (ik.length !== 1 || !need(grid, 'the grid', C.classes.grid, 'div')) { E(inner, `${label(inner)}: holds exactly one div.hero-grid`); return; }
  onlyAttrs(grid, { class: true }); noText(grid);
  const [h, media, a, ...rest] = kids(grid);
  head(h);
  if (!media || !need(media, 'the object column', hub ? C.classes.media : C.classes.media.filter(c => c !== 'rv'), 'div')) E(media || grid, `${label(grid)}: div.hero-media follows the head`);
  else {
    if (hub) mustHave(media, ['rv']);
    onlyAttrs(media, { class: true }); noText(media);
    const mk = kids(media);
    if (hub) {
      if (mk.length !== 1 || mk[0].attrs['data-slot'] !== 'media') E(media, `${label(media)}: the hub's object is one block with data-slot="media" (the diagram), copied as it is`);
      else seal(mk[0]);
    } else {
      let slot = mk[0];
      /* the form's own language, when the page's differs: a bare <div lang> around the checker */
      if (slot && slot.tag === 'div' && 'lang' in slot.attrs && !('data-slot' in slot.attrs)) {
        onlyAttrs(slot, { lang: /^[a-z]{2}(-[A-Za-z]{2})?$/ }); noText(slot);
        const sk = kids(slot);
        if (sk.length !== 1) E(slot, `${label(slot)}: the language wrapper holds the checker alone`);
        slot = sk[0];
      }
      checkerSlot(slot); free(mk[1]);
      mk.slice(2).forEach(x => E(x, `${label(x)}: the column holds the checker and the line under it`));
    }
  }
  if (layout === 'split-aside') { if (!a) E(grid, `${label(grid)}: data-layout="split-aside" holds a third block, div.hero-aside (without one the layout is "split")`); else aside(a); }
  else if (a) E(a, `${label(a)}: data-layout="${layout}" holds the head and the ${hub ? 'diagram' : 'checker'}; an aside needs data-layout="split-aside"`);
  rest.forEach(x => E(x, `${label(x)}: not part of the hero grid`));
}

function validate(root, ctx) {
  const R = rules('Hero', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'hero')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) { checkHero(r.el, R); r.note = r.el.attrs['data-layout'] || ''; }
  return { found, sealed: R.sealed };
}

/* the classes that are the hero's own (the Moodle guide's .hero-link-* is another block) */
const PARTS = new Set([...Object.values(C.classes).flat().filter(c => /^hero(-|$)/.test(c)), 'pen-mark']);

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'hero-split-path.html';
const FACTS = 'hero-split-facts.html', NOTICE = 'hero-split-notice.html', HUB = 'hero-hub.html', CENTER = 'hero-center.html';
const BAD = [
  ['a utility added to the title', h => h.replace('class="hero-title"', 'class="hero-title text-ink-900"')],
  ['an unknown layout', h => h.replace('data-layout="split-aside"', 'data-layout="wide"')],
  ['the layout removed', h => h.replace(' data-layout="split-aside"', '')],
  ['an <h2> for the title', h => h.replace('<h1 class="hero-title"', '<h2 class="hero-title"').replace('</h1>', '</h2>')],
  ['the dot field removed', h => h.replace(/\s*<div class="dot-field hero-dots" aria-hidden="true"><\/div>/, '')],
  ['a glow given an inline style', h => h.replace('class="orb orb-hero-teal"', 'class="orb orb-hero-teal" style="background:red"')],
  ['the checker removed', h => h.replace(/<div data-slot="checker"[\s\S]*?<\/form>\s*<\/div>/, '')],
  ['the checker pasted without its slot mark', h => h.replace('<div data-slot="checker" ', '<div ')],
  ['the checker slot emptied', h => h.replace(/(<div data-slot="checker"[^>]*>)[\s\S]*?<\/form>(\s*<\/div>)/, '$1$2')],
  ['two pen words', h => h.replace(/(<span class="pen-word">[^<]*<svg[\s\S]*?<\/svg><\/span>)/, '$1 $1')],
  ['the pen word without its line', h => h.replace(/(<span class="pen-word">[^<]*)<svg[\s\S]*?<\/svg>/, '$1')],
  ['a second lead beside the checker', h => h.replace(/(<p class="hero-lead">[^<]*<\/p>)/, '$1\n$1')],
  ['a button beside the checker', h => h.replace(/(<p class="hero-lead">[^<]*<\/p>)/, '$1\n<div class="hero-actions"><a href="#x" class="action-button btn-press group">Start<span class="action-button-orb icon-orb"><svg></svg></span></a></div>')],
  ['the aside removed from split-aside', h => h.replace(/\s*<div class="hero-aside rv">[\s\S]*?<\/ol>\s*<\/div>/, '')],
  ['markup in a path pill', h => h.replace(/(<span class="hero-path-pill">)([^<]*)/, '$1<b>$2</b>')],
  ['two current steps', h => h.replace(/<span class="hero-path-pill">([^<]*)/, '<span class="hero-path-pill" data-state="current"><span class="hero-path-dot"></span>$1')],
  ['the arrow after a pill removed', h => h.replace(/\s*<svg class="hero-path-arrow"[\s\S]*?<\/svg>/, '')],
  ['a <script> in the hero', h => h.replace('<div class="hero-inner">', '<div class="hero-inner"><script>alert(1)</script>')],
  ['facts: two figures', h => h.replace(/\s*<div class="hero-fact">[\s\S]*?<\/div>/, ''), FACTS],
  ['notice: an unknown tile tone', h => h.replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1blue"'), NOTICE],
  ['notice: the tile removed', h => h.replace(/\s*<span class="icon-tile"[\s\S]*?<\/span>/, ''), NOTICE],
  ['hub: the diagram without its slot mark', h => h.replace(' data-slot="media"', ''), HUB],
  ['hub: a light button', h => h.replace('class="action-button btn-press group"', 'class="action-button btn-press group" data-tone="light"'), HUB],
  ['hub: the button\'s behaviour hooks removed', h => h.replace('class="action-button btn-press group"', 'class="action-button"'), HUB],
  ['hub: a javascript: link', h => h.replace(/(<a href=")[^"]*(" class="action-link">)/, '$1javascript:void(0)$2'), HUB],
  ['hub: an aside', h => h.replace(/(\n    <\/div>\n  <\/div>\n<\/section>)/, '\n      <div class="hero-aside rv"><div class="hero-notice"><span class="icon-tile" data-tone="ink"><svg></svg></span><p class="hero-notice-text">Note.</p></div></div>$1'), HUB],
  ['hub: an unknown note measure', h => h.replace(/<p class="hero-note"[^>]*>/, '<p class="hero-note" data-measure="90">'), HUB],
  ['center: a pill', h => h.replace('<h1 class="hero-title"', '<div class="section-eyebrow">\n  <span class="section-eyebrow-dot"></span>\n  <span class="section-eyebrow-label">New</span>\n</div>\n<h1 class="hero-title"'), CENTER],
  ['center: the ground layer removed', h => h.replace(/\s*<div class="hero-bg">[\s\S]*?<\/div>\s*<\/div>/, ''), CENTER],
  ['center: the reveal class on the head', h => h.replace('class="hero-head"', 'class="hero-head rv"'), CENTER],
];
const GOOD = [
  ['a new title, lead and free line', h => h.replace(/(<h1 class="hero-title">)[^<]*/, '$1Originality Checker for ').replace(/(<p class="hero-lead">)[^<]*/, '$1A new lead with <strong>one strong phrase</strong>.').replace(/(<\/svg>\s*)[^<]*(<\/p>)/, '$1300 words free.\n$2')],
  ['another pen word (the script redraws the line)', h => h.replace(/(<span class="pen-word">)[^<]*/, '$1Universities and Colleges')],
  ['the pen word removed', h => h.replace(/<span class="pen-word">([^<]*)<svg[\s\S]*?<\/svg><\/span>/, '$1')],
  ['a pill added, the long title size, another measure', h => h.replace('<h1 class="hero-title">', '<div class="section-eyebrow">\n  <span class="section-eyebrow-dot"></span>\n  <span class="section-eyebrow-label">For students</span>\n</div>\n<h1 class="hero-title" data-size="long">').replace('<p class="hero-lead">', '<p class="hero-lead" data-measure="60">')],
  ['the section id changed with the checker\'s button', h => h.replace(/example-hero-path/g, 'essay-checker')],
  ['the section id changed alone (a warning)', h => h.replace('<section id="example-hero-path"', '<section id="essay-checker"')],
  ['a path step removed, the current step moved', h => h.replace(/\s*<li class="hero-path-step">\s*<span class="hero-path-pill">[^<]*<\/span>\s*<svg[\s\S]*?<\/svg>\s*<\/li>/, '').replace(' data-state="current"><span class="hero-path-dot"></span>', '>').replace(/<span class="hero-path-pill">([^<]*)<\/span>(\s*)<\/li>(\s*)<\/ol>/, '<span class="hero-path-pill" data-state="current"><span class="hero-path-dot"></span>$1</span>$2</li>$3</ol>')],
  ['facts: new figures, the link under the card removed', h => h.replace(/(<p class="hero-fact-value">)[^<]*/, '$15 MB').replace(/\s*<p class="hero-aside-more">[\s\S]*?<\/p>/, ''), FACTS],
  ['notice: another tone and text', h => h.replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1teal"').replace(/(<p class="hero-notice-text">)[^<]*/, '$1A new statement.'), NOTICE],
  ['hub: the quiet link and the note removed', h => h.replace(/\s*<a href="[^"]*" class="action-link">[^<]*<\/a>/, '').replace(/\s*<p class="hero-note"[^>]*>[\s\S]*?<\/p>/, ''), HUB],
  ['hub: the pill removed, a second lead, an external button link', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/(<p class="hero-lead"[^>]*>[^<]*<\/p>)(?![\s\S]*<p class="hero-lead")/, '$1\n<p class="hero-lead">A second paragraph.</p>').replace(/<a href="[^"]*" class="action-button btn-press group">/, '<a href="https://example.com/" target="_blank" rel="noopener" class="action-button btn-press group">'), HUB],
  ['center: a word typed bare into the rising title (a warning)', h => h.replace(/(<h1 class="hero-title" data-hero-title>)/, '$1Free '), CENTER],
];

module.exports = {
  name: 'hero', title: 'Hero', unit: '',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a hero part outside a complete hero (section.hero)',
  mentions: html => /class="hero"|\bhero-(?:inner|grid|head|title|lead|media|free)\b/.test(html),
  SNIPPET, BAD, GOOD,
};
