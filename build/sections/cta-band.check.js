/* CTA band — the validator's rules (contract: build/sections/cta-band.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per band
   found (a section.cta-band, signature or data-variant="plain"):
     structure   the fixed skeleton: the ground, the column, its parts in order; the
                 actions hold what their layout allows
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, btn-press, group, icon-orb …); a Tailwind utility is named as such
     variants    every data-* switch with an allowed value, on the look it belongs to
     content     label text only; title, lead and note limited to the allowed inline tags;
                 exactly one ring word in a signature title; nothing empty
     sealed      <svg> icons are not inspected inside */
const C = require('./cta-band.contract');
const { kids, texts, cls, has, walk, label, ID, rules } = require('./check-tools');

function checkBand(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, requireAttrs, noText, filled, link, inlineOnly, svgIcon } = R;
  R.at = el;
  if (el.tag !== 'section') E(el, `${label(el)}: the CTA band root is a <section>`);
  onlyClasses(el, C.classes.section);
  onlyAttrs(el, { id: ID, class: true, 'data-component': true, ...Object.fromEntries(Object.keys(C.variants.section).map(a => [a, true])) });
  requireAttrs(el, { 'data-component': 'cta-band' });
  variantsOf(el, C.variants.section);
  noText(el);
  const plain = el.attrs['data-variant'] === 'plain';
  if (plain && 'data-width' in el.attrs) E(el, `${label(el)}: data-width belongs to the signature band, not to the plain one`);

  const empty = (n, what) => { if (n.children.some(c => c.tag !== '#text' || c.text.trim())) E(n, `${label(n)}: ${what} stays empty`); };
  const layer = (n, what, allowed, hooks) => {
    if (!n || !need(n, what, allowed, 'div')) { E(n || el, `${label(n || el)}: expected div.${allowed[0]} (${what})`); return; }
    mustHave(n, hooks); onlyAttrs(n, { class: true, 'aria-hidden': 'true' }); empty(n, what);
  };

  /* the ground */
  const k = kids(el);
  let inner;
  if (plain) {
    if (k.length !== 3) E(el, `${label(el)}: the plain band holds its two glows (div.orb.cta-orb-warm, div.orb.cta-orb-cool) and div.cta-band-inner (found ${k.length} elements)`);
    layer(k[0], 'the warm glow', C.classes.orbWarm, C.hooks.glow);
    layer(k[1], 'the cool glow', C.classes.orbCool, C.hooks.glow);
    inner = k[2];
  } else {
    if (k.length !== 2) E(el, `${label(el)}: the band holds div.cta-band-bg and div.cta-band-inner (found ${k.length} elements)`);
    const bg = k[0];
    if (!bg || !need(bg, 'the ground', C.classes.bg, 'div')) E(bg || el, `${label(el)}: first child is div.cta-band-bg, copied as it is`);
    else {
      onlyAttrs(bg, { class: true }); noText(bg);
      const [dots, warm, cool, ...rest] = kids(bg);
      layer(dots, 'the dot field', C.classes.dots, C.hooks.dots);
      layer(warm, 'the warm glow', C.classes.glowWarm, C.hooks.glow);
      layer(cool, 'the cool glow', C.classes.glowCool, C.hooks.glow);
      rest.forEach(r => E(r, `${label(r)}: the ground holds the dot field and the two glows, nothing else`));
    }
    inner = k[1];
  }
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.cta-band-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  /* the parts shared by both looks */
  const title = (t, allowed) => {
    need(t, 'the title', C.classes.title, 'h2'); onlyAttrs(t, { class: true, id: ID });
    /* the ring word first: its loop is an icon, taken as it is */
    const rings = kids(t).filter(c => has(c, 'ring-word'));
    rings.forEach(r => {
      const rk = kids(r);
      const last = r.children.filter(c => c.tag !== '#text' || c.text.trim()).pop();
      if (rk.length !== 1 || rk[0].tag !== 'svg' || !has(rk[0], 'ring-mark')) E(r, `${label(r)}: the ring word holds its text and then the loop, <svg class="ring-mark">, copied as it is`);
      else { svgIcon(rk[0], label(r), C.classes.ringMark); if (last !== rk[0]) E(r, `${label(r)}: the loop <svg> comes after the word`); }
      const w = texts(r).map(x => x.text).join('').trim();
      if (!w) E(r, `${label(r)}: the ring word is empty`);
      else if (w.length < 4 || w.length > 18) W(r, `${label(r)}: the ring is drawn for about ten characters; "${w}" (${w.length}) will stretch it`);
    });
    inlineOnly(t, allowed, 'the title'); filled(t, 'the title');
    return rings.length;
  };
  const lead = p => {
    need(p, 'the lead', C.classes.lead, 'p'); onlyAttrs(p, { class: true, 'data-measure': true }); variantsOf(p, C.variants.lead);
    inlineOnly(p, C.inline.lead, 'the lead'); filled(p, 'the lead (remove it instead)');
  };
  const button = (a, { tone, rv }) => {
    if (!need(a, 'the button', rv ? C.classes.button : C.classes.button.filter(c => c !== 'rv'), 'a')) return;
    mustHave(a, C.hooks.button);
    link(a, { href: true, rel: true, target: true, class: true, 'data-tone': true });
    if (!tone && 'data-tone' in a.attrs) E(a, `${label(a)}: data-tone belongs to the plain band's button`);
    variantsOf(a, C.variants.button);
    const ak = kids(a);
    const orb = ak[ak.length - 1];
    if (!orb || !has(orb, 'cta-button-orb')) E(a, `${label(a)}: the button ends with span.cta-button-orb (the arrow), copied as it is`);
    else {
      need(orb, 'the arrow orb', C.classes.buttonOrb, 'span'); mustHave(orb, C.hooks.buttonOrb); onlyAttrs(orb, { class: true }); noText(orb);
      const s = kids(orb); if (s.length !== 1) E(orb, `${label(orb)}: holds only the arrow <svg>`); svgIcon(s[0], label(orb), []);
    }
    ak.slice(0, -1).forEach((c, j) => { if (c.tag === 'svg' && j === 0) svgIcon(c, label(a), []); else E(c, `${label(c)}: the button holds an optional <svg> icon first, its text, and the arrow orb`); });
    if (!texts(a).some(t => t.text.trim())) E(a, `${label(a)}: the button needs its text`);
  };

  const p = kids(inner);
  let i = 0;
  if (plain) {
    const t = p[i++];
    if (!t || !has(t, 'cta-title')) E(t || inner, `${label(inner)}: the h2.cta-title is required first`);
    else if (title(t, C.inline.titlePlain)) E(t, `${label(t)}: the plain band has no ring word`);
    const l = p[i++];
    if (!l || !has(l, 'cta-lead')) E(l || inner, `${label(inner)}: the p.cta-lead follows the title`);
    else lead(l);
    const b = p[i++];
    if (!b || !has(b, 'cta-button')) E(b || inner, `${label(inner)}: the a.cta-button follows the lead`);
    else button(b, { tone: true, rv: true });
    p.slice(i).forEach(x => E(x, `${label(x)}: the plain band holds a title, a lead and one button, nothing else`));
    return;
  }

  if (p[i] && has(p[i], 'section-eyebrow')) R.eyebrow(p[i++], C.classes);
  let kicker = null;
  if (p[i] && has(p[i], 'cta-kicker')) {
    kicker = p[i++];
    need(kicker, 'the line above the title', C.classes.kicker, 'p'); onlyAttrs(kicker, { class: true });
    inlineOnly(kicker, C.inline.kicker, 'the line above the title'); filled(kicker, 'the line above the title (remove it instead)');
  }
  const t = p[i++];
  if (!t || !has(t, 'cta-title')) { E(t || inner, `${label(inner)}: the h2.cta-title is required (after the optional eyebrow and line above)`); return; }
  const rings = title(t, C.inline.title);
  if (rings !== 1) E(t, `${label(t)}: the title carries exactly one ring word, <span class="ring-word">…<svg…></span> (found ${rings})`);
  if (p[i] && has(p[i], 'cta-lead')) {
    const l = p[i++];
    lead(l);
    if (kicker) E(l, `${label(l)}: a band has a line above the title or a lead under it, not both`);
  }
  const acts = p[i++];
  if (!acts || !has(acts, 'cta-actions')) { E(acts || inner, `${label(inner)}: div.cta-actions is required after the title and lead`); return; }
  need(acts, 'the actions', C.classes.actions, 'div'); onlyAttrs(acts, { class: true, 'data-layout': true }); variantsOf(acts, C.variants.actions); noText(acts);
  const layout = acts.attrs['data-layout'] || 'row';
  const [b, second, ...more] = kids(acts);
  if (!b || !has(b, 'cta-button')) E(b || acts, `${label(acts)}: the first action is the a.cta-button`);
  else button(b, { tone: false, rv: false });
  more.forEach(x => E(x, `${label(x)}: the actions hold the button and at most one more part`));
  if (layout === 'pair') {
    if (!second || !need(second, 'the second button', C.classes.secondary, 'a')) E(second || acts, `${label(acts)}: data-layout="pair" holds the button and a.cta-button-secondary`);
    else { mustHave(second, C.hooks.secondary); link(second, { href: true, rel: true, target: true, class: true }); inlineOnly(second, C.inline.label, 'the second button'); }
  } else if (layout === 'stack') {
    if (second) {
      if (!need(second, 'the line under the button', C.classes.hint, 'p')) E(second, `${label(second)}: in data-layout="stack" the button is followed only by p.cta-hint`);
      else {
        onlyAttrs(second, { class: true }); filled(second, 'the line under the button (remove it instead)');
        kids(second).forEach((c, j) => { if (c.tag === 'svg' && j === 0) { svgIcon(c, label(second), C.classes.hintIcon); } else E(c, `${label(c)}: the line holds its text and, first, the spark <svg class="cta-hint-icon">`); });
      }
    }
  } else if (second) {
    if (!need(second, 'the quiet link', C.classes.link, 'a')) E(second, `${label(second)}: in a row the button is followed only by a.cta-link (the spark line needs data-layout="stack", a second button data-layout="pair")`);
    else { link(second, { href: true, rel: true, target: true, class: true }); inlineOnly(second, C.inline.label, 'the quiet link'); }
  }
  if (p[i] && has(p[i], 'cta-note')) {
    const n = p[i++];
    need(n, 'the line under the actions', C.classes.note, 'p'); onlyAttrs(n, { class: true, 'data-tone': true }); variantsOf(n, C.variants.note);
    inlineOnly(n, C.inline.note, 'the line under the actions'); filled(n, 'the line under the actions (remove it instead)');
    if (kids(n).filter(c => c.tag === 'a').length > 1) E(n, `${label(n)}: one link at most`);
  }
  p.slice(i).forEach(x => E(x, `${label(x)}: not part of the band (order: eyebrow?, line above?, title, lead?, actions, line under?)`));
}

function validate(root, ctx) {
  const R = rules('CTA band', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'cta-band')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) { checkBand(r.el, R); r.note = r.el.attrs['data-variant'] || ''; }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'cta-band-link.html';
const PLAIN = 'cta-band-plain.html';
const BAD = [
  ['a utility added to the title', h => h.replace('class="cta-title rv"', 'class="cta-title rv text-ink-900"')],
  ['an unknown measure', h => h.replace(/(<p class="cta-lead rv")[^>]*>/, '$1 data-measure="80">')],
  ['an unknown layout', h => h.replace('class="cta-actions rv"', 'class="cta-actions rv" data-layout="grid"')],
  ['the ground removed', h => h.replace(/\s*<div class="cta-band-bg">[\s\S]*?<\/div>\s*<\/div>/, '')],
  ['a glow given an inline style', h => h.replace('class="orb cta-glow-warm"', 'class="orb cta-glow-warm" style="background:red"')],
  ['the ring word removed from the title', h => h.replace(/<span class="ring-word">([^<]*)<svg[\s\S]*?<\/svg><\/span>/, '$1')],
  ['two ring words', h => h.replace(/(<span class="ring-word">[^<]*<svg[\s\S]*?<\/svg><\/span>)/, '$1 $1')],
  ['the button without its arrow orb', h => h.replace(/\s*<span class="cta-button-orb icon-orb">[\s\S]*?<\/span>/, '')],
  ['the button\'s behaviour hooks removed', h => h.replace('class="cta-button btn-press group"', 'class="cta-button"')],
  ['a button colour in the signature band', h => h.replace('class="cta-button btn-press group"', 'class="cta-button btn-press group" data-tone="orange"')],
  ['the spark line in a row', h => h.replace(/<a href="[^"]*" class="cta-link">[^<]*<\/a>/, '<p class="cta-hint">150 words free.</p>')],
  ['a second button without data-layout="pair"', h => h.replace(/<a href="([^"]*)" class="cta-link">([^<]*)<\/a>/, '<a href="$1" class="cta-button-secondary btn-press">$2</a>')],
  ['a line above the title together with a lead', h => h.replace('<h2 class="cta-title rv">', '<p class="cta-kicker rv">Before you go.</p>\n    <h2 class="cta-title rv">')],
  ['a javascript: link', h => h.replace(/(<a href=")[^"]*(" class="cta-link">)/, '$1javascript:void(0)$2')],
  ['a <script> in the band', h => h.replace('<div class="cta-band-inner">', '<div class="cta-band-inner"><script>alert(1)</script>')],
  ['plain: a ring word in the title', h => h.replace(/(<h2 class="cta-title rv">)([^<]*)/, '$1<span class="ring-word">$2</span>'), PLAIN],
  ['plain: the lead removed', h => h.replace(/\s*<p class="cta-lead rv"[^>]*>[\s\S]*?<\/p>/, ''), PLAIN],
  ['plain: an unknown button colour', h => h.replace(/(class="cta-button btn-press group rv")[^>]*>/, '$1 data-tone="blue">'), PLAIN],
  ['plain: the wide column', h => h.replace('data-variant="plain"', 'data-variant="plain" data-width="wide"'), PLAIN],
];
const GOOD = [
  ['new lead and link text', h => h.replace(/(<p class="cta-lead rv"[^>]*>)[^<]*/, '$1A new lead.').replace(/(class="cta-link">)[^<]*/, '$1Another link')],
  ['another ring word', h => h.replace(/(<span class="ring-word">)[^<]*/, '$1your essay')],
  ['the lead removed', h => h.replace(/\s*<p class="cta-lead rv"[^>]*>[\s\S]*?<\/p>/, '')],
  ['the quiet link removed', h => h.replace(/\s*<a href="[^"]*" class="cta-link">[^<]*<\/a>/, '')],
  ['the button\'s leading icon removed', h => h.replace(/(<a href="[^"]*" class="cta-button btn-press group">)\s*<svg[\s\S]*?<\/svg>/, '$1')],
  ['another measure, the wide column, the section id removed', h => h.replace(/(<p class="cta-lead rv")[^>]*>/, '$1 data-measure="62">').replace('class="cta-band"', 'class="cta-band" data-width="wide"').replace(/(<section) id="[^"]*"/, '$1')],
  ['an eyebrow pill added', h => h.replace('<h2 class="cta-title rv">', '<div class="section-eyebrow rv">\n      <span class="section-eyebrow-dot pulse-dot"></span>\n      <span class="section-eyebrow-label">Free check</span>\n    </div>\n    <h2 class="cta-title rv">')],
  ['a note with <strong> under the actions', h => h.replace(/(\n    <\/div>)(\n  <\/div>\n<\/section>)/, '$1\n    <p class="cta-note rv"><strong>150 words free</strong> — no registration required.</p>$2')],
  ['an external button link with target and rel', h => h.replace(/<a href="[^"]*" class="cta-button btn-press group">/, '<a href="https://example.com/" target="_blank" rel="noopener" class="cta-button btn-press group">')],
  ['plain: the orange button and another measure', h => h.replace(/(class="cta-button btn-press group rv")[^>]*>/, '$1 data-tone="orange">').replace(/(<p class="cta-lead rv")[^>]*>/, '$1 data-measure="54">'), PLAIN],
];

module.exports = {
  name: 'cta-band', title: 'CTA band', unit: '',
  validate,
  isPart: n => cls(n).some(c => /^cta-/.test(c) || c === 'ring-word' || c === 'ring-mark'),
  outside: 'a CTA band part outside a complete band (section.cta-band)',
  mentions: html => /\bcta-|ring-word/.test(html),
  SNIPPET, BAD, GOOD,
};
