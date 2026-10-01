/* Start free — the validator's rules (contract: build/sections/start-free.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.start-free):
     structure   the text column (head, one or two paragraphs, the actions) and the two
                 figures — light, then dark; in a frame when the layout says so
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, rv-kids, btn-press …); a Tailwind utility is named as such
     variants    data-layout, data-bg="white", data-space required; data-tone on a figure
     content     text only in the figures; limited inline tags in the paragraphs; nothing
                 empty; no price in the section (a warning: the prices live on their page)
     sealed      <svg> icons are not inspected inside */
const C = require('./start-free.contract');
const { kids, cls, has, walk, label, textOf, rules } = require('./check-tools');

function checkStartFree(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, noText, filled, link, inlineOnly, svgIcon } = R;
  R.at = el;
  R.sectionRoot(el, 'start-free', C.classes.section, C.variants.section);
  const layout = el.attrs['data-layout'];
  if (!C.variants.section['data-layout'].values.includes(layout)) return;
  const framed = layout === 'framed';

  const k = kids(el);
  const inner = k[0];
  if (k.length !== 1 || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: holds exactly one div.start-free-inner`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  let grid2 = kids(inner)[0];
  if (kids(inner).length !== 1) E(inner, `${label(inner)}: holds exactly one block (${framed ? 'div.start-free-frame' : 'div.start-free-grid'})`);
  if (framed) {
    const frame = grid2;
    if (!frame || !need(frame, 'the frame', C.classes.frame, 'div')) { E(frame || inner, `${label(inner)}: data-layout="framed" holds div.start-free-frame`); return; }
    mustHave(frame, C.hooks.frame); onlyAttrs(frame, { class: true }); noText(frame);
    const fk = kids(frame);
    if (fk.length !== 1) { E(frame, `${label(frame)}: holds exactly one div.start-free-grid`); return; }
    grid2 = fk[0];
  }
  if (!grid2 || !need(grid2, 'the two columns', C.classes.grid, 'div')) { E(grid2 || inner, `${label(inner)}: div.start-free-grid is missing${framed ? '' : ' (a frame around it needs data-layout="framed")'}`); return; }
  onlyAttrs(grid2, { class: true }); noText(grid2);
  const [text, figures, ...rest] = kids(grid2);

  /* the text column */
  if (!text || !need(text, 'the text column', framed ? C.classes.text.filter(c => c !== 'rv') : C.classes.text, 'div')) E(text || grid2, `${label(grid2)}: opens with div.start-free-text`);
  else {
    if (!framed) mustHave(text, C.hooks.text);
    onlyAttrs(text, { class: true }); noText(text);
    const tk = kids(text);
    let i = R.headParts(tk, text, { title: C.inline.title, intro: C.inline.intro, intros: 2 });
    if (!tk.some(n => has(n, 'section-intro'))) E(text, `${label(text)}: a p.section-intro follows the title — the sentence that states the limits`);
    const acts = tk[i++];
    if (!acts || !need(acts, 'the actions', C.classes.actions, 'div')) E(acts || text, `${label(text)}: div.start-free-actions follows the paragraphs`);
    else {
      onlyAttrs(acts, { class: true }); noText(acts);
      const [b, l, ...x] = kids(acts);
      if (!b || !has(b, 'action-button')) E(acts, `${label(acts)}: the first action is the a.action-button`); else R.actionButton(b);
      if (l) {
        if (l.tag !== 'a' || !has(l, 'section-link')) E(l, `${label(l)}: the button is followed only by the quiet link, a.section-link`);
        else { onlyClasses(l, C.classes.sectionLink); link(l, { href: true, rel: true, target: true, class: true }); inlineOnly(l, [], 'the quiet link'); }
      }
      x.forEach(z => E(z, `${label(z)}: the actions hold the button and at most the quiet link`));
    }
    tk.slice(i).forEach(z => E(z, `${label(z)}: not part of the text column (order: eyebrow?, title, one or two paragraphs, actions)`));
  }

  /* the figures: the light one, then the dark one */
  if (!figures || !need(figures, 'the figures', framed ? C.classes.figures.filter(c => c !== 'rv-kids') : C.classes.figures, 'div')) E(figures || grid2, `${label(grid2)}: div.start-free-figures follows the text`);
  else {
    if (!framed) mustHave(figures, C.hooks.figures);
    onlyAttrs(figures, { class: true, 'data-stagger': true }); variantsOf(figures, C.variants.list); noText(figures);
    const [a, b, note, ...x] = kids(figures);
    const figure = (f, tone) => {
      if (!f || !need(f, 'a figure', C.classes.figure, 'div')) { E(f || figures, `${label(figures)}: two div.start-free-figure — the light one, then the dark one`); return; }
      onlyAttrs(f, { class: true, 'data-tone': true, 'data-surface': 'dark' }); variantsOf(f, C.variants.figure); noText(f);
      if (f.attrs['data-tone'] && f.attrs['data-tone'] !== tone) E(f, `${label(f)}: the ${tone === 'teal' ? 'first' : 'second'} figure is data-tone="${tone}"`);
      if ('data-surface' in f.attrs && tone !== 'dark') E(f, `${label(f)}: data-surface="dark" goes with the dark figure`);
      const [v, l, s, ...y] = kids(f);
      const part = (n, what, allowed) => { if (!n || !need(n, what, allowed, 'p')) E(n || f, `${label(f)}: a figure holds p.start-free-value, p.start-free-label, p.start-free-sub`); else { onlyAttrs(n, { class: true }); inlineOnly(n, C.inline.plain, what); filled(n, what); } };
      part(v, 'the figure', C.classes.value); part(l, 'the figure\'s label', C.classes.label); part(s, 'the figure\'s second line', C.classes.sub);
      y.forEach(z => E(z, `${label(z)}: a figure holds its value and two lines`));
    };
    figure(a, 'teal'); figure(b, 'dark');
    if (note) {
      if (!framed) E(note, `${label(note)}: the line under the figures belongs to data-layout="framed"`);
      else if (need(note, 'the line under the figures', C.classes.note, 'p')) {
        onlyAttrs(note, { class: true });
        kids(note).forEach((c, j) => { if (c.tag === 'svg' && j === 0) svgIcon(c, label(note), []); });
        inlineOnly(note, C.inline.note, 'the line under the figures'); filled(note, 'the line under the figures (remove it instead)');
      }
    }
    x.forEach(z => E(z, `${label(z)}: the figures column holds the two figures${framed ? ' and one line under them' : ''}`));
  }
  rest.forEach(z => E(z, `${label(z)}: the section holds the text and the figures`));

  if (/[$€£₴]\s?\d|\d\s?(?:USD|EUR|грн)\b/.test(textOf(el))) W(el, `${label(el)}: a price in the free entry — the prices live on their own page, behind the quiet link`);
}

function validate(root, ctx) {
  const R = rules('Start free', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'start-free')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) { checkStartFree(r.el, R); r.note = r.el.attrs['data-layout'] || ''; }
  return { found, sealed: R.sealed };
}

const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^start-free/.test(c)));

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'start-free-open.html';
const FRAMED = 'start-free-framed.html';
const BAD = [
  ['a utility added to a figure', h => h.replace('class="start-free-figure"', 'class="start-free-figure p-8"')],
  ['an unknown layout', h => h.replace('data-layout="open"', 'data-layout="banner"')],
  ['the background removed', h => h.replace(' data-bg="white"', '')],
  ['another background', h => h.replace('data-bg="white"', 'data-bg="cool"')],
  ['a figure removed', h => h.replace(/\s*<div class="start-free-figure" data-tone="dark"[\s\S]*?<\/p>\s*<\/div>/, '')],
  ['the dark figure first', h => h.replace('data-tone="teal"', 'data-tone="dark"')],
  ['markup in a figure', h => h.replace(/(<p class="start-free-value">)([^<]*)/, '$1<b>$2</b>')],
  ['a figure without its label', h => h.replace(/\s*<p class="start-free-label">[^<]*<\/p>/, '')],
  ['the paragraphs removed', h => h.replace(/\s*<p class="section-intro">[\s\S]*?<\/p>/g, '')],
  ['three paragraphs', h => h.replace(/(<p class="section-intro">[^<]*<\/p>)/, '$1\n$1\n$1')],
  ['the button removed', h => h.replace(/\s*<a href="[^"]*" class="action-button[\s\S]*?<\/a>/, '')],
  ['a second button in place of the quiet link', h => h.replace(/<a href="([^"]*)" class="section-link">([^<]*)<\/a>/, '<a href="$1" class="action-button btn-press group" data-tone="light">$2<span class="action-button-orb icon-orb"><svg></svg></span></a>')],
  ['the reveal hook removed from the figures', h => h.replace('class="start-free-figures rv-kids"', 'class="start-free-figures"')],
  ['a line under the figures in the open layout', h => h.replace(/(<\/div>)(\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, '$1\n<p class="start-free-note">One note.</p>$2')],
  ['a style attribute on the title', h => h.replace('<h2 class="section-title"', '<h2 class="section-title" style="color:red"')],
  ['framed: the frame removed', h => h.replace(/<div class="start-free-frame rv">/, '<div>'), FRAMED],
  ['framed: the reveal class on the text column', h => h.replace('class="start-free-text"', 'class="start-free-text rv"'), FRAMED],
];
const GOOD = [
  ['new title, paragraph and labels', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1Try it on a short text').replace(/(<p class="section-intro">)[^<]*/, '$1A new paragraph with <strong>a strong phrase</strong>.').replace(/(<p class="start-free-sub">)[^<]*/, '$1no account needed')],
  ['the second paragraph removed', h => { const i = h.lastIndexOf('<p class="section-intro">'); return h.indexOf('<p class="section-intro">') === i ? h + ' ' : h.slice(0, i) + h.slice(h.indexOf('</p>', i) + 4); }],
  ['the quiet link removed, the pill removed', h => h.replace(/\s*<a href="[^"]*" class="section-link">[^<]*<\/a>/, '').replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '')],
  ['another rhythm, the id removed', h => h.replace(/data-space="[a-z]+"/, 'data-space="md"').replace(/(<section) id="[^"]*"/, '$1')],
  ['the button pointed at another checker anchor', h => h.replace(/(<a href=")[^"]*(" class="action-button)/, '$1#essay-checker$2')],
  ['framed: the line under the figures removed', h => h.replace(/\s*<p class="start-free-note">[\s\S]*?<\/p>/, ''), FRAMED],
  ['framed: new figures', h => h.replace(/(<p class="start-free-value">)[^<]*/, '$1200'), FRAMED],
];

module.exports = {
  name: 'start-free', title: 'Start free', unit: '',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Start free part outside a complete section (section.start-free)',
  mentions: html => /class="start-free"|\bstart-free-(?:grid|text|figure)/.test(html),
  SNIPPET, BAD, GOOD,
};
