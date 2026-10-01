/* The validator's toolkit for the About page's two components (team, timeline).

   PAGE-SPECIFIC. These components are not members of the Section Library (the library
   pilot is under review; nothing new enters it until that is done). They are validated
   from build/check-about.js, never from build/check-library.js.

   check-about.js parses the page (with the parser build/check-library.js exports, used
   read-only) and hands each component's check (build/about/<name>.check.js) the tree; the
   check builds its rules from these helpers. They say the same things the FAQ's rules
   say (only the contract's classes, only the contract's attributes, no stray text,
   limited inline markup, safe links) and they also check the Section Header a component
   hosts. Nothing here knows a component by name.

   A node is what parse() produces: { tag, attrs, children, parent, line }, text nodes as
   { tag: '#text', text }. */
const kids = n => n.children.filter(c => c.tag !== '#text');
const texts = n => n.children.filter(c => c.tag === '#text');
const cls = n => (n.attrs && n.attrs.class ? n.attrs.class.split(/\s+/).filter(Boolean) : []);
const has = (n, c) => cls(n).includes(c);
const textOf = n => (n.tag === '#text' ? n.text : (n.children || []).map(textOf).join(''));
const walk = (n, f) => { f(n); (n.children || []).forEach(c => walk(c, f)); };
const inside = (n, c) => { for (let p = n.parent; p; p = p.parent) if (has(p, c)) return true; return false; };
const label = n => `<${n.tag}${n.attrs && n.attrs.class ? ` class="${n.attrs.class}"` : ''}> (line ${n.line})`;
const words = s => s.trim().split(/\s+/).filter(Boolean).length;

/* the utility grammar, to name a stray class for what it is */
const UTILITY = /^(?:[a-z]+:)*-?(?:p[trblxy]?|m[trblxy]?|w|h|min-w|max-w|min-h|max-h|gap(?:-[xy])?|space-[xy]|text|font|leading|tracking|bg|ring|shadow|rounded(?:-[trbl]{1,2})?|border(?:-[trblxy])?|divide(?:-[xy])?|grid-cols|grid-rows|col-span|col-start|row-span|row-start|top|right|bottom|left|inset(?:-[xy])?|z|opacity|order|items|justify|self|place|content|overflow(?:-[xy])?|object|aspect)(?:-.+)?$|^(?:[a-z]+:)*(?:flex|grid|block|inline|inline-flex|inline-block|hidden|relative|absolute|sticky|static|fixed|underline|uppercase|italic|truncate|sr-only)$/;

/* the rules, bound to one component (its name goes into every message) and one result */
function rules(name, ctx) {
  const E = (n, msg) => ctx.errors.push({ line: n.line, msg });
  const W = (n, msg) => ctx.warnings.push({ line: n.line, msg });
  const sealed = new Set();   /* <svg> icons: copied as they are, not inspected inside */

  const onlyClasses = (n, allowed) => {
    for (const c of cls(n)) {
      if (allowed.includes(c)) continue;
      E(n, `${label(n)}: class "${c}" is not part of the ${name} contract` + (UTILITY.test(c) ? ' — a Tailwind utility; the library class already sets the style' : ''));
    }
  };
  /* attrs: { name: true (any value) | 'exact value' | RegExp | fn(value) → error text or '' } */
  const onlyAttrs = (n, allowed) => {
    for (const [a, v] of Object.entries(n.attrs)) {
      if (!(a in allowed)) { E(n, `${label(n)}: attribute ${a} is not part of the ${name} contract`); continue; }
      const rule = allowed[a];
      if (rule === true) continue;
      if (typeof rule === 'string' && v !== rule) E(n, `${label(n)}: ${a}="${v}" must be ${a}="${rule}"`);
      if (rule instanceof RegExp && !rule.test(v)) E(n, `${label(n)}: ${a}="${v}" is not an allowed value`);
      if (typeof rule === 'function') { const m = rule(v); if (m) E(n, `${label(n)}: ${m}`); }
    }
  };
  const requireAttrs = (n, required) => {
    for (const [a, v] of Object.entries(required)) {
      if (!(a in n.attrs)) E(n, `${label(n)}: ${a}${typeof v === 'string' ? `="${v}"` : ''} is required`);
    }
  };
  const noText = n => { if (texts(n).some(t => t.text.trim())) E(n, `${label(n)}: stray text "${texts(n).map(t => t.text.trim()).join(' ').slice(0, 40)}"`); };
  /* a part: the right tag, its class first, and nothing but the contract's classes */
  const part = (n, what, allowed, tag) => {
    if (!n) return false;
    if (tag && n.tag !== tag) { E(n, `${label(n)}: expected <${tag}> for ${what}`); return false; }
    if (!has(n, allowed[0])) { E(n, `${label(n)}: expected class "${allowed[0]}" (${what})`); return false; }
    onlyClasses(n, allowed);
    return true;
  };
  /* inline content: text plus the allowed tags, none of them carrying anything */
  const inlineOnly = (n, allowed, what) => {
    for (const c of kids(n)) {
      if (!allowed.includes(c.tag) || cls(c).length) { E(c, `${label(c)} is not allowed in ${what} (allowed: ${allowed.join(', ') || 'text only'})`); continue; }
      onlyAttrs(c, {});
      inlineOnly(c, allowed, what);
    }
  };
  const filled = (n, what) => { if (!textOf(n).trim()) E(n, `${label(n)}: ${what} is empty`); };
  const variants = (n, set) => {
    for (const [a, spec] of Object.entries(set)) {
      const v = n.attrs[a];
      if (v === undefined) { if (spec.required) E(n, `${label(n)}: ${a} is required (${spec.values.join(' | ')})`); continue; }
      if (!spec.values.includes(v)) E(n, `${label(n)}: ${a}="${v}" is not a variant (${spec.values.join(' | ')})`);
    }
  };
  const icon = (n, where) => {
    if (!n || n.tag !== 'svg') { E(n || where, `${label(where)}: expected the <svg> icon, copied as it is`); return; }
    sealed.add(n);
  };
  const link = a => {
    const href = a.attrs.href;
    if (!href || !href.trim()) E(a, `${label(a)}: a link needs an href`);
    else if (/^\s*javascript:/i.test(href)) E(a, `${label(a)}: javascript: links are not allowed`);
    if (a.attrs.target === '_blank' && !/\bnoopener\b/.test(a.attrs.rel || '')) E(a, `${label(a)}: target="_blank" needs rel="noopener"`);
  };

  /* The Section Header a component hosts (build/sections/section-head.js): the optional
     eyebrow pill, the required h2, the optional intro, the optional quiet link. The pill
     and the intro carry no switches of their own. */
  const head = host => {
    noText(host);
    const k = kids(host);
    let i = 0;
    if (k[i] && has(k[i], 'section-eyebrow')) {
      const e = k[i++];
      part(e, 'the eyebrow', ['section-eyebrow'], 'div'); onlyAttrs(e, { class: true }); noText(e);
      const [dot, lab, ...rest] = kids(e);
      if (!dot || !part(dot, 'the eyebrow dot', ['section-eyebrow-dot'], 'span')) E(e, `${label(e)}: first child is span.section-eyebrow-dot`);
      else { onlyAttrs(dot, { class: true }); if (dot.children.length) E(dot, `${label(dot)}: the dot stays empty`); }
      if (!lab || !part(lab, 'the eyebrow label', ['section-eyebrow-label'], 'span')) E(e, `${label(e)}: second child is span.section-eyebrow-label`);
      else { onlyAttrs(lab, { class: true }); inlineOnly(lab, [], 'the eyebrow label'); filled(lab, 'the eyebrow label (remove the whole eyebrow instead)'); }
      rest.forEach(r => E(r, `${label(r)}: nothing else goes in the eyebrow`));
    }
    const t = k[i++];
    if (!t || !has(t, 'section-title')) E(t || host, `${label(host)}: the h2.section-title is required (after the optional eyebrow)`);
    else {
      part(t, 'the title', ['section-title'], 'h2'); onlyAttrs(t, { class: true, id: /^[A-Za-z][\w-]*$/ });
      inlineOnly(t, ['br', 'em', 'strong'], 'the title'); filled(t, 'the title');
    }
    if (k[i] && has(k[i], 'section-intro')) {
      const p = k[i++];
      part(p, 'the intro', ['section-intro'], 'p'); onlyAttrs(p, { class: true });
      inlineOnly(p, ['strong', 'em', 'br'], 'the intro'); filled(p, 'the intro (remove it instead)');
    }
    if (k[i] && has(k[i], 'section-more')) {
      const m = k[i++];
      part(m, 'the more link wrapper', ['section-more'], 'div'); onlyAttrs(m, { class: true }); noText(m);
      const mk = kids(m);
      if (mk.length !== 1 || mk[0].tag !== 'a' || !has(mk[0], 'section-link')) E(m, `${label(m)}: holds exactly one a.section-link`);
      else {
        const a = mk[0];
        onlyClasses(a, ['section-link']); onlyAttrs(a, { class: true, href: true, rel: true, target: true }); link(a); filled(a, 'the link');
        kids(a).forEach((c, j) => { if (c.tag === 'svg' && j === 0) sealed.add(c); else E(c, `${label(c)}: the more link holds its text and, first, an optional <svg> icon`); });
      }
    }
    while (k[i]) { const x = k[i++]; E(x, `${label(x)}: not part of the section head (order: eyebrow?, title, intro?, more link?)`); }
  };

  /* safety, everywhere inside a root except inside its sealed icons */
  const safety = rootEl => {
    const isSealed = n => { for (let p = n; p; p = p.parent) if (sealed.has(p)) return true; return false; };
    walk(rootEl, n => {
      if (n.tag === '#text' || isSealed(n)) return;
      if (n.tag === 'script' || n.tag === 'style') E(n, `<${n.tag}> is not allowed inside a ${name}`);
      if ('style' in n.attrs) E(n, `${label(n)}: style="" is not allowed — the look comes from the library classes`);
      for (const a of Object.keys(n.attrs)) if (/^on/.test(a)) E(n, `${label(n)}: ${a} handlers are not allowed`);
    });
  };

  return { E, W, onlyClasses, onlyAttrs, requireAttrs, noText, part, inlineOnly, filled, variants, icon, link, head, safety };
}

module.exports = { kids, texts, cls, has, textOf, walk, inside, label, words, rules };
