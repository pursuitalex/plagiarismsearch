/* The Section Library validator's toolkit: the HTML reader and the rules every
   component's check is built from.

   build/check-library.js runs the registry (build/sections/index.js); each component's
   check (build/sections/<name>.check.js) reads its contract (<name>.contract.js) and says
   what the contract means with these helpers, so every component reports a broken paste
   in the same words: only the contract's classes, only the contract's attributes, no stray
   text, limited inline markup, safe links, icons copied as they are. Nothing here knows a
   component by name.

   A node is what parse() produces: { tag, attrs, children, parent, line }, text nodes as
   { tag: '#text', text }. */

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
    /* a <script> or <style>: one raw node; `body` is its source (a JSON island is data a check may read) */
    if (m[1]) { cur.children.push({ tag: m[1].toLowerCase(), attrs: attrs(m[0].slice(1 + m[1].length, m[0].indexOf('>'))), children: [], parent: cur, line: lineAt(m.index), raw: true, body: m[0].slice(m[0].indexOf('>') + 1, m[0].lastIndexOf('</')) }); continue; }
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
const textOf = n => (n.tag === '#text' ? n.text : (n.children || []).map(textOf).join(''));
const walk = (n, f) => { f(n); (n.children || []).forEach(c => walk(c, f)); };
const inside = (n, c) => { for (let p = n.parent; p; p = p.parent) if (has(p, c)) return true; return false; };
const label = n => `<${n.tag}${n.attrs && n.attrs.class ? ` class="${n.attrs.class}"` : ''}> (line ${n.line})`;
const ID = /^[A-Za-z][\w-]*$/;

/* the utility grammar, to name a stray class for what it is */
const UTILITY = /^(?:[a-z]+:)*-?(?:p[trblxy]?|m[trblxy]?|w|h|min-w|max-w|min-h|max-h|gap(?:-[xy])?|space-[xy]|text|font|leading|tracking|bg|from|to|via|ring|shadow|rounded(?:-[trbl]{1,2})?|border(?:-[trblxy])?|divide(?:-[xy])?|decoration|underline-offset|grid-cols|grid-rows|col-span|col-start|row-span|row-start|top|right|bottom|left|inset(?:-[xy])?|z|opacity|order|basis|grow|shrink|translate-[xy]|scale|rotate|duration|ease|delay|transition|items|justify|self|place|content|overflow(?:-[xy])?|object|aspect|line-clamp|fill|stroke)(?:-.+)?$|^(?:[a-z]+:)*(?:flex|grid|block|inline|inline-flex|inline-block|hidden|relative|absolute|sticky|static|fixed|underline|uppercase|italic|truncate|sr-only|w-full|shrink-0|grow|container)$/;

/* the primitives components host (action.css, icon-tile.css): their classes and values */
const ACTION = { button: ['action-button', 'btn-press', 'group'], buttonHooks: ['btn-press', 'group'], orb: ['action-button-orb', 'icon-orb'], orbHooks: ['icon-orb'], link: ['action-link'] };
const TILE_TONES = ['teal', 'ink', 'orange', 'mint'];

/* the rules, bound to one component (its name goes into every message) and one result */
function rules(name, ctx) {
  const E = (n, msg) => ctx.errors.push({ line: n.line, msg });
  const W = (n, msg) => ctx.warnings.push({ line: n.line, msg });
  const sealed = new Set();   /* <svg> icons and slots: copied as they are, not inspected inside */

  const onlyClasses = (n, allowed, extra = () => false) => {
    for (const c of cls(n)) {
      if (allowed.includes(c) || extra(c)) continue;
      E(n, `${label(n)}: class "${c}" is not part of the ${name} contract` + (UTILITY.test(c) ? ' — a Tailwind utility; the library class already sets the style' : ''));
    }
  };
  /* a part: the right tag, its class present, and nothing but the contract's classes */
  const need = (n, part, allowed, tag) => {
    if (!n) return false;
    if (tag && n.tag !== tag) { E(n, `${label(n)}: expected <${tag}> for ${part}`); return false; }
    if (!has(n, allowed[0])) { E(n, `${label(n)}: expected class "${allowed[0]}" (${part})`); return false; }
    onlyClasses(n, allowed);
    return true;
  };
  /* the classes a part must carry besides its own (a behaviour hook: .rv, .btn-press …) */
  const mustHave = (n, required) => {
    for (const c of required) if (!has(n, c)) E(n, `${label(n)}: class "${c}" is required here (a behaviour hook)`);
  };
  const variantsOf = (n, set) => {
    for (const [a, spec] of Object.entries(set)) {
      const v = n.attrs[a];
      if (v === undefined) { if (spec.required) E(n, `${label(n)}: ${a} is required (${spec.values.join(' | ')})`); continue; }
      if (!spec.values.includes(v)) E(n, `${label(n)}: ${a}="${v}" is not a variant (${spec.values.join(' | ')})`);
    }
  };
  /* allowed: a list of names, or { name: true (any value) | 'exact value' | RegExp |
     fn(value) → error text or '' } */
  const onlyAttrs = (n, allowed) => {
    const list = Array.isArray(allowed) ? allowed : Object.keys(allowed);
    for (const [a, v] of Object.entries(n.attrs)) {
      if (!list.includes(a)) { E(n, `${label(n)}: attribute ${a} is not part of the ${name} contract`); continue; }
      const rule = Array.isArray(allowed) ? true : allowed[a];
      if (rule === true) continue;
      if (typeof rule === 'string' && v !== rule) E(n, `${label(n)}: ${a}="${v}" must be ${a}="${rule}"`);
      if (rule instanceof RegExp && !rule.test(v)) E(n, `${label(n)}: ${a}="${v}" is not an allowed value`);
      if (typeof rule === 'function') { const m = rule(v); if (m) E(n, `${label(n)}: ${m}`); }
    }
  };
  const requireAttrs = (n, required) => {
    for (const [a, v] of Object.entries(required)) {
      if (!(a in n.attrs)) E(n, `${label(n)}: ${a}${typeof v === 'string' ? `="${v}"` : ''} is required`);
      else if (typeof v === 'string' && n.attrs[a] !== v) E(n, `${label(n)}: ${a}="${n.attrs[a]}" must be ${a}="${v}"`);
    }
  };
  const noText = n => { if (texts(n).some(t => t.text.trim())) E(n, `${label(n)}: stray text "${texts(n).map(t => t.text.trim()).join(' ').slice(0, 40)}"`); };
  const filled = (n, what) => { if (!textOf(n).trim()) E(n, `${label(n)}: ${what} is empty`); };
  const link = (a, allowed) => {
    if (allowed) onlyAttrs(a, allowed);
    const href = a.attrs.href;
    if (!href || !href.trim()) E(a, `${label(a)}: a link needs an href`);
    else if (/^\s*javascript:/i.test(href)) E(a, `${label(a)}: javascript: links are not allowed`);
    if (a.attrs.target === '_blank' && !/\bnoopener\b/.test(a.attrs.rel || '')) E(a, `${label(a)}: target="_blank" needs rel="noopener"`);
    if (!textOf(a).trim()) E(a, `${label(a)}: a link needs text`);
  };
  /* inline content: text plus the allowed tags — 'strong' allows <strong> without a class,
     'a.faq-link' allows exactly that tag with exactly that class */
  const inlineOnly = (n, allowed, what) => {
    for (const c of kids(n)) {
      if (sealed.has(c)) continue;   /* an icon the component has already taken as it is */
      const key = [c.tag, ...cls(c)].join('.');
      const ok = cls(c).length ? allowed.includes(key) : allowed.includes(c.tag);
      if (!ok) { E(c, `${label(c)} is not allowed in ${what} (allowed: ${allowed.join(', ') || 'text only'})`); continue; }
      if (c.tag === 'a') link(c, ['href', 'rel', 'target', 'class']);
      else onlyAttrs(c, ['class']);
      /* no link inside a link */
      inlineOnly(c, allowed.filter(x => x.split('.')[0] !== 'a'), what);
    }
  };
  /* an icon: an <svg> copied as it is; `allowed`: the classes it may carry. A missing
     icon is reported at the component's root (api.at, set by the check). */
  const svgIcon = (n, where, allowed) => {
    if (!n || n.tag !== 'svg') { E(n || api.at || { line: 1 }, `${where}: expected the <svg> icon, copied as it is`); return false; }
    if (allowed) onlyClasses(n, allowed);
    sealed.add(n);
    return true;
  };
  const seal = n => { sealed.add(n); };
  /* an on* attribute a component's contract names (the generic safety rule refuses the rest) */
  const exempt = (n, a) => { if (ctx.exempt) ctx.exempt.set(n, [...(ctx.exempt.get(n) || []), a]); };

  /* The Section Header's eyebrow pill, as a component hosts it: div > an empty dot + a
     text-only label. `c`: the host contract's classes ({ eyebrow, eyebrowDot, eyebrowLabel }) —
     a host may allow a hook on the pill or its dot (.rv, .pulse-dot); the pill itself
     carries no switch: its look comes from its host. */
  const eyebrow = (e, c) => {
    need(e, 'the eyebrow', c.eyebrow, 'div'); onlyAttrs(e, ['class']); noText(e);
    const [dot, lab, ...rest] = kids(e);
    if (!dot || !need(dot, 'the eyebrow dot', c.eyebrowDot, 'span')) E(e, `${label(e)}: first child is span.section-eyebrow-dot`);
    else { onlyAttrs(dot, ['class']); if (dot.children.length) E(dot, `${label(dot)}: the dot stays empty`); }
    if (!lab || !need(lab, 'the eyebrow label', c.eyebrowLabel, 'span')) E(e, `${label(e)}: second child is span.section-eyebrow-label`);
    else { onlyAttrs(lab, ['class']); inlineOnly(lab, [], 'the eyebrow label'); filled(lab, 'the eyebrow label (remove the whole eyebrow instead)'); }
    rest.forEach(r => E(r, `${label(r)}: nothing else goes in the eyebrow`));
  };

  /* The Action primitive (action.css), as a component hosts it: the pill button with its
     arrow orb. `tones`: the data-tone values this host uses (none: the dark button only). */
  const actionButton = (a, { tones = [] } = {}) => {
    if (!need(a, 'the button', ACTION.button, 'a')) return false;
    mustHave(a, ACTION.buttonHooks);
    link(a, { href: true, rel: true, target: true, class: true, 'data-tone': true });
    const tone = a.attrs['data-tone'];
    if (tone !== undefined && !tones.includes(tone)) E(a, `${label(a)}: data-tone="${tone}" is not a button of the ${name} (${tones.length ? tones.join(' | ') + ', or none: the dark button' : 'the dark button, without data-tone'})`);
    const ak = kids(a);
    const orb = ak[0];
    if (ak.length !== 1 || !has(orb, 'action-button-orb')) E(a, `${label(a)}: the button holds its text and then span.action-button-orb (the arrow), copied as it is`);
    else {
      need(orb, 'the arrow orb', ACTION.orb, 'span'); mustHave(orb, ACTION.orbHooks); onlyAttrs(orb, { class: true }); noText(orb);
      const s = kids(orb); if (s.length !== 1) E(orb, `${label(orb)}: holds only the arrow <svg>`); svgIcon(s[0], label(orb), []);
    }
    if (!texts(a).some(t => t.text.trim())) E(a, `${label(a)}: the button needs its text`);
    return true;
  };
  /* …and the quiet link beside it */
  const actionLink = a => {
    if (!need(a, 'the quiet link', ACTION.link, 'a')) return false;
    link(a, { href: true, rel: true, target: true, class: true }); inlineOnly(a, [], 'the quiet link');
    return true;
  };

  /* The Icon tile primitive (icon-tile.css): span.icon-tile[data-tone] > one <svg>, taken as
     it is. `variants`: the data-variant values this host uses (none: the plain tile). */
  const iconTile = (t, { variants = [] } = {}) => {
    if (!need(t, 'the icon tile', ['icon-tile'], 'span')) return false;
    onlyAttrs(t, { class: true, 'data-tone': true, 'data-variant': true });
    variantsOf(t, { 'data-tone': { values: TILE_TONES, required: true } });
    const v = t.attrs['data-variant'];
    if (v !== undefined && !variants.includes(v)) E(t, `${label(t)}: data-variant="${v}" is not a tile of this ${name} (${variants.length ? variants.join(' | ') + ', or none' : 'the plain tile, without data-variant'})`);
    noText(t);
    const s = kids(t);
    if (s.length !== 1) E(t, `${label(t)}: the tile holds only its <svg> icon`);
    svgIcon(s[0], label(t), []);
    return true;
  };

  /* The pen mark (hero.css: .pen-word, .pen-mark; 18-pen-mark.js redraws the line for an
     edited word): <span class="pen-word">word<svg class="pen-mark">…</svg></span>, at most
     one in the text part `t`. The line is an icon, taken as it is — call this before
     inlineOnly(t, […, 'span.pen-word']). Returns how many it found. */
  const penWords = (t, what) => {
    const pens = kids(t).filter(c => has(c, 'pen-word'));
    pens.forEach(pw => {
      if (pw.tag !== 'span') E(pw, `${label(pw)}: the pen word is a <span>`);
      onlyClasses(pw, ['pen-word']); onlyAttrs(pw, { class: true });
      const pk = kids(pw);
      const last = pw.children.filter(c => c.tag !== '#text' || c.text.trim()).pop();
      if (pk.length !== 1 || pk[0].tag !== 'svg' || !has(pk[0], 'pen-mark')) E(pw, `${label(pw)}: the pen word holds its text and then the line, <svg class="pen-mark">, copied as it is`);
      else { svgIcon(pk[0], label(pw), ['pen-mark']); if (last !== pk[0]) E(pw, `${label(pw)}: the line <svg> comes after the word`); }
      if (!texts(pw).some(x => x.text.trim())) E(pw, `${label(pw)}: the pen word is empty`);
    });
    if (pens.length > 1) E(t, `${label(t)}: one pen word at most in ${what} (found ${pens.length})`);
    return pens.length;
  };

  /* The root of a section-level component: <section class="…" data-component="…"> with an
     optional id and the component's own switches, and no stray text. */
  const sectionRoot = (el, component, classes, variants) => {
    if (el.tag !== 'section') E(el, `${label(el)}: the ${name} root is a <section>`);
    onlyClasses(el, classes);
    onlyAttrs(el, { id: ID, class: true, 'data-component': true, 'aria-label': true, ...Object.fromEntries(Object.keys(variants).map(a => [a, true])) });
    requireAttrs(el, { 'data-component': component });
    variantsOf(el, variants);
    noText(el);
  };

  /* The Section Header as a block of its own (section-head.css): div.section-head.rv holding
     [the eyebrow pill?, h2.section-title, p.section-intro?]. `measures`, `introMeasures`:
     the data-measure values the host allows on the block and on the intro. */
  const HEAD = { eyebrow: ['section-eyebrow'], eyebrowDot: ['section-eyebrow-dot'], eyebrowLabel: ['section-eyebrow-label'] };
  const headBlock = (h, { measures = [], introMeasures = [], title = ['br', 'em', 'strong'], intro = ['strong', 'em', 'br'], reveal = true, intros = 1 } = {}) => {
    if (!need(h, 'the head', reveal ? ['section-head', 'rv'] : ['section-head'], 'div')) return false;
    if (reveal) mustHave(h, ['rv']);
    onlyAttrs(h, { class: true, 'data-measure': true }); variantsOf(h, { 'data-measure': { values: measures } }); noText(h);
    const k = kids(h);
    k.slice(headParts(k, h, { introMeasures, title, intro, intros })).forEach(x => E(x, `${label(x)}: not part of the section head (order: eyebrow?, title, intro?)`));
    return true;
  };
  /* …and its parts, wherever a host holds them (a block, a column of its own). `intros`:
     how many intro paragraphs the host allows. Returns how many nodes the head took, so
     the host checks what follows. */
  const headParts = (k, host, { introMeasures = [], title = ['br', 'em', 'strong'], intro = ['strong', 'em', 'br'], intros = 1 } = {}) => {
    let i = 0, seen = 0;
    if (k[i] && has(k[i], 'section-eyebrow')) eyebrow(k[i++], HEAD);
    const t = k[i];
    if (!t || !has(t, 'section-title')) E(t || host, `${label(host)}: the h2.section-title is required (after the optional eyebrow)`);
    else { i++; need(t, 'the title', ['section-title'], 'h2'); onlyAttrs(t, { class: true, id: ID }); if (title.includes('span.pen-word')) penWords(t, 'the title'); inlineOnly(t, title, 'the title'); filled(t, 'the title'); }
    while (k[i] && has(k[i], 'section-intro') && seen < intros) {
      const p = k[i++]; seen++;
      need(p, 'the intro', ['section-intro'], 'p'); onlyAttrs(p, { class: true, 'data-measure': true }); variantsOf(p, { 'data-measure': { values: introMeasures } });
      inlineOnly(p, intro, 'the intro'); filled(p, 'the intro (remove it instead)');
    }
    return i;
  };

  const api = { E, W, sealed, seal, exempt, at: null, onlyClasses, need, mustHave, variantsOf, onlyAttrs, requireAttrs, noText, filled, link, inlineOnly, svgIcon, eyebrow, penWords, actionButton, actionLink, iconTile, sectionRoot, headBlock, headParts };
  return api;
}

module.exports = { parse, kids, texts, cls, has, textOf, walk, inside, label, ID, UTILITY, rules };
