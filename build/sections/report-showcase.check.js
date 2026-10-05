/* Report showcase — the validator's rules (contract: build/sections/report-showcase.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.report-showcase):
     structure   the ground its surface takes, the head (a block, or a row with the path),
                 the report, then the blocks its surface allows under it, in order
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, rv-kids, orb); a Tailwind utility is named as such
     variants    exactly one of data-surface="dark" / data-bg="white"; data-space required;
                 every other data-* switch with an allowed value, where it belongs
     content     text only in names and labels; limited inline tags in the texts; nothing
                 empty; exactly three points
     sealed      the report — [data-slot="report"] — is NOT inspected inside: it is the
                 product's screen, copied as it is. The rule here is only that it is
                 there and still is the report ([data-report] with its passages and
                 sources). [data-slot="media"] and <svg> icons are sealed too */
const C = require('./report-showcase.contract');
const { kids, cls, has, walk, label, textOf, rules } = require('./check-tools');

function checkReport(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, noText, filled, inlineOnly, svgIcon, seal, penWords } = R;
  R.at = el;
  R.sectionRoot(el, 'report-showcase', C.classes.section, C.variants.section);
  const dark = el.attrs['data-surface'] === 'dark', light = el.attrs['data-bg'] === 'white';
  if (dark === light) { E(el, `${label(el)}: the section carries exactly one of data-surface="dark" (the dark section) and data-bg="white" (the white one)`); return; }
  const quiet = el.attrs['data-tone'] === 'quiet';
  if ('data-tone' in el.attrs && !dark) E(el, `${label(el)}: data-tone belongs to the dark section`);

  const glow = (n, what, allowed) => {
    if (!n || !need(n, what, allowed, 'div')) { E(n || el, `${label(n || el)}: expected div.${allowed.slice().reverse().join('.')} (${what}), copied as it is`); return; }
    mustHave(n, C.hooks.glow); onlyAttrs(n, { class: true });
    if (n.children.some(c => c.tag !== '#text' || c.text.trim())) E(n, `${label(n)}: ${what} stays empty`);
  };

  /* ── the ground and the column ── */
  const k = kids(el);
  let inner;
  if (!dark) {
    if (k.length !== 1) E(el, `${label(el)}: the white section holds div.report-inner alone (found ${k.length} elements) — the glows belong to the dark section`);
    inner = k[0];
  } else if (quiet) {
    if (k.length !== 2) E(el, `${label(el)}: with data-tone="quiet" the section holds div.report-bg and div.report-inner (found ${k.length} elements)`);
    const bg = k[0];
    if (!bg || !need(bg, 'the ground', C.classes.bg, 'div')) E(bg || el, `${label(el)}: with data-tone="quiet" the first child is div.report-bg, copied as it is`);
    else {
      onlyAttrs(bg, { class: true }); noText(bg);
      const [cool, warm, ...rest] = kids(bg);
      glow(cool, 'the cool glow', C.classes.orbCool); glow(warm, 'the warm glow', C.classes.orbWarm);
      rest.forEach(r => E(r, `${label(r)}: the ground holds its two glows, nothing else`));
    }
    inner = k[1];
  } else {
    if (k.length !== 3) E(el, `${label(el)}: the dark section holds its two glows (div.orb.orb-dark-teal, div.orb.orb-dark-coral) and div.report-inner (found ${k.length} elements)`);
    glow(k[0], 'the cool glow', C.classes.glowCool); glow(k[1], 'the warm glow', C.classes.glowWarm);
    inner = k[2];
  }
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.report-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  const p = kids(inner);
  let i = 0;

  /* ── the head: a block, or a row with the path ── */
  const headOpts = { introMeasures: C.variants.intro['data-measure'].values, title: C.inline.title, intro: C.inline.intro, intros: 2 };
  const h = p[i++];
  if (h && has(h, 'section-head')) R.headBlock(h, { ...headOpts, measures: C.variants.head['data-measure'].values });
  else if (h && has(h, 'report-top')) {
    need(h, 'the head row', C.classes.top, 'div'); onlyAttrs(h, { class: true }); noText(h);
    if (!dark) E(h, `${label(h)}: the head beside a path belongs to the dark section`);
    const [hd, path, ...rest] = kids(h);
    if (!hd || !need(hd, 'the head column', C.classes.topHead, 'div')) E(hd || h, `${label(h)}: the row opens with div.report-top-head (the pill, the title, the intro)`);
    else {
      mustHave(hd, C.hooks.head); onlyAttrs(hd, { class: true }); noText(hd);
      const hk = kids(hd);
      hk.slice(R.headParts(hk, hd, headOpts)).forEach(x => E(x, `${label(x)}: not part of the head (order: pill?, title, intro?)`));
    }
    if (!path || !need(path, 'the path', C.classes.path, 'ol')) E(path || h, `${label(h)}: ol.report-path (the path in pills) follows the head column`);
    else {
      mustHave(path, C.hooks.block); onlyAttrs(path, { class: true, 'aria-label': true }); noText(path);
      if (!(path.attrs['aria-label'] || '').trim()) W(path, `${label(path)}: the path has no aria-label — name it for screen readers`);
      const steps = kids(path);
      if (steps.length < 2 || steps.length > 4) E(path, `${label(path)}: two to four steps (found ${steps.length})`);
      let current = 0;
      steps.forEach((li, n) => {
        if (!need(li, 'a step of the path', C.classes.pathStep, 'li')) return;
        onlyAttrs(li, { class: true }); noText(li);
        const [pill, arrow, ...x] = kids(li);
        if (!pill || !need(pill, 'the pill', C.classes.pathPill, 'span')) E(pill || li, `${label(li)}: a step opens with span.report-path-pill`);
        else {
          onlyAttrs(pill, { class: true, 'data-state': true }); variantsOf(pill, C.variants.pathPill);
          const cur = pill.attrs['data-state'] === 'current'; if (cur) current++;
          const pk = kids(pill);
          if (cur ? (pk.length !== 1 || !has(pk[0], 'report-path-dot')) : pk.length) E(pill, `${label(pill)}: ${cur ? 'the current pill opens with <span class="report-path-dot"></span>, then its text' : 'a pill holds its text only (the dot goes with data-state="current")'}`);
          else if (cur) { need(pk[0], 'the dot', C.classes.pathDot, 'span'); onlyAttrs(pk[0], { class: true }); if (pk[0].children.length) E(pk[0], `${label(pk[0])}: the dot stays empty`); }
          if (!pill.children.some(c => c.tag === '#text' && c.text.trim())) E(pill, `${label(pill)}: the pill needs its text`);
        }
        const last = n === steps.length - 1;
        if (last ? arrow : !arrow) E(li, `${label(li)}: ${last ? 'the last step has no arrow after it' : 'the arrow <svg class="report-path-arrow"> follows the pill'}`);
        else if (arrow) svgIcon(arrow, label(li), C.classes.pathArrow);
        x.forEach(z => E(z, `${label(z)}: a step holds its pill and its arrow`));
      });
      if (current > 1) E(path, `${label(path)}: one current pill at most (found ${current})`);
    }
    rest.forEach(x => E(x, `${label(x)}: the head row holds the head column and the path`));
  } else { E(h || inner, `${label(inner)}: the head comes first — div.section-head, or div.report-top (the head beside a path)`); if (h && h.attrs['data-slot']) i--; }

  /* ── the report: sealed. It is there, and it still is the report ── */
  const mock = p[i++];
  if (!mock || mock.attrs['data-slot'] !== 'report') {
    E(mock || inner, `${label(mock || inner)}: the report follows the head — the block with data-slot="report", copied as it is from a snippet`);
    if (mock && !mock.attrs['data-slot']) i--;
  } else {
    seal(mock);
    let root = 0, marks = 0, sources = 0;
    walk(mock, x => { if (x.attrs && 'data-report' in x.attrs) root++; if (has(x, 'cab-mark')) marks++; if (has(x, 'cab-src')) sources++; });
    if (root !== 1 || !marks || !sources) E(mock, `${label(mock)}: the report slot holds the report whole ([data-report] with its marked passages and its sources); copy the whole block from the snippet, it is not edited`);
  }

  /* ── the blocks under the report ── */
  const text = (n, what, allowed, tag = 'p') => {
    if (!need(n, what, allowed, tag)) return;
    onlyAttrs(n, { class: true }); inlineOnly(n, C.inline.text, what); filled(n, what);
  };
  const plain = (n, what, allowed, tag) => {
    if (!need(n, what, allowed, tag)) return;
    onlyAttrs(n, { class: true }); inlineOnly(n, C.inline.label, what); filled(n, what);
  };
  /* the teal callout; block: on its own under the report (it carries .rv) */
  const callout = (n, block) => {
    if (!need(n, 'the callout', block ? C.classes.callout : C.classes.callout.filter(c => c !== 'rv'), 'div')) return;
    if (block) mustHave(n, C.hooks.block);
    onlyAttrs(n, { class: true, 'data-tone': true });
    if ('data-tone' in n.attrs) E(n, `${label(n)}: data-tone="${n.attrs['data-tone']}" — the coloured callout belongs to the white section; on the dark one the callout carries no data-tone`);
    noText(n);
    const [ic, t, ...x] = kids(n);
    if (!ic || !need(ic, 'the callout\'s icon', C.classes.calloutIcon, 'span')) E(ic || n, `${label(n)}: the callout opens with span.report-callout-icon, copied as it is`);
    else { onlyAttrs(ic, { class: true }); noText(ic); const s = kids(ic); if (s.length !== 1) E(ic, `${label(ic)}: holds only its <svg> icon`); svgIcon(s[0], label(ic), []); }
    if (!t || !has(t, 'report-callout-text')) E(n, `${label(n)}: p.report-callout-text follows the icon`); else text(t, 'the callout text', C.classes.calloutText);
    x.forEach(z => E(z, `${label(z)}: the callout holds its icon and one paragraph`));
  };
  const points = (n, marker) => {
    const icon = marker === 'icon';
    const allowed = C.classes.points.filter(c => c !== (icon ? 'rv' : 'rv-kids'));
    if (!need(n, 'the points', allowed, icon ? 'ul' : 'ol')) return;
    mustHave(n, [icon ? 'rv-kids' : 'rv']);
    onlyAttrs(n, { class: true, 'data-marker': true }); variantsOf(n, C.variants.points); noText(n);
    if (n.attrs['data-marker'] !== marker) { E(n, `${label(n)}: on the ${icon ? 'white' : 'dark'} section the points carry data-marker="${marker}"`); return; }
    const items = kids(n);
    if (items.length !== 3) E(n, `${label(n)}: exactly three points (found ${items.length})`);
    items.forEach((li, j) => {
      if (!need(li, 'a point', C.classes.point, 'li')) return;
      onlyAttrs(li, { class: true }); noText(li);
      const q = kids(li);
      if (icon) {
        if (!q[0] || !has(q[0], 'icon-tile')) E(li, `${label(li)}: a point opens with its span.icon-tile`); else R.iconTile(q[0]);
        if (!q[1] || !has(q[1], 'report-point-name')) E(li, `${label(li)}: the h3.report-point-name follows the tile`); else plain(q[1], 'the point\'s name', C.classes.pointName, 'h3');
        if (!q[2] || !has(q[2], 'report-point-text')) E(li, `${label(li)}: p.report-point-text closes the point`); else text(q[2], 'the point\'s text', C.classes.pointText);
        q.slice(3).forEach(z => E(z, `${label(z)}: a point holds its tile, its name and its text`));
        return;
      }
      const [num, body, ...x] = q;
      if (!num || !need(num, 'the number', C.classes.pointNum, 'span')) E(num || li, `${label(li)}: a point opens with span.report-point-num`);
      else {
        onlyAttrs(num, { class: true }); inlineOnly(num, [], 'the number');
        const v = textOf(num).trim();
        if (!/^\d$/.test(v)) E(num, `${label(num)}: the number is a digit (found "${v.slice(0, 20)}")`);
        else if (v !== String(j + 1)) W(num, `${label(num)}: point ${j + 1} is numbered "${v}"`);
      }
      if (!body || !need(body, 'the point\'s text block', C.classes.pointBody, 'span')) E(body || li, `${label(li)}: span.report-point-body follows the number`);
      else {
        onlyAttrs(body, { class: true }); noText(body);
        const [nm, tx, ...y] = kids(body);
        if (!nm || !has(nm, 'report-point-name')) E(body, `${label(body)}: span.report-point-name comes first`); else plain(nm, 'the point\'s name', C.classes.pointName, 'span');
        if (!tx || !has(tx, 'report-point-text')) E(body, `${label(body)}: span.report-point-text follows the name`); else text(tx, 'the point\'s text', C.classes.pointText, 'span');
        y.forEach(z => E(z, `${label(z)}: a point holds its name and its text`));
      }
      x.forEach(z => E(z, `${label(z)}: a point holds its number and its text block`));
    });
  };
  const card = n => {
    if (has(n, 'report-callout')) return callout(n, false);
    if (has(n, 'report-aside')) return text(n, 'the text card', C.classes.aside);
    if (has(n, 'report-principle')) {
      need(n, 'the display card', C.classes.principle, 'div'); onlyAttrs(n, { class: true }); noText(n);
      const q = kids(n);
      let j = 0;
      if (q[j] && has(q[j], 'report-kicker')) plain(q[j++], 'the card\'s label', C.classes.kicker, 'p');
      const t = q[j];
      if (!t || !has(t, 'report-principle-title')) E(n, `${label(n)}: p.report-principle-title (the statement) is required`);
      else { j++; if (need(t, 'the statement', C.classes.principleTitle, 'p')) { onlyAttrs(t, { class: true }); penWords(t, 'the statement'); inlineOnly(t, C.inline.principleTitle, 'the statement'); filled(t, 'the statement'); } }
      if (q[j] && has(q[j], 'report-principle-text')) text(q[j++], 'the card\'s paragraph', C.classes.principleText);
      q.slice(j).forEach(z => E(z, `${label(z)}: the display card holds a label?, the statement and a paragraph?`));
      return;
    }
    if (has(n, 'report-statement')) {
      need(n, 'the statement card', C.classes.statement, 'div'); onlyAttrs(n, { class: true }); noText(n);
      const [t, s, ...x] = kids(n);
      if (!t || !has(t, 'icon-tile')) E(n, `${label(n)}: the card opens with its span.icon-tile`); else R.iconTile(t);
      if (!s || !has(s, 'report-statement-text')) E(n, `${label(n)}: p.report-statement-text follows the tile`); else text(s, 'the statement', C.classes.statementText);
      x.forEach(z => E(z, `${label(z)}: the card holds its tile and one paragraph`));
      return;
    }
    E(n, `${label(n)}: a card of the pair is one of div.report-principle, div.report-callout, p.report-aside, div.report-statement`);
  };

  if (!dark) {
    /* white: one foot — three points with icons beside the orange callout */
    const f = p[i];
    if (f && has(f, 'report-foot')) {
      i++;
      need(f, 'the foot', C.classes.foot, 'div'); onlyAttrs(f, { class: true }); noText(f);
      const [pts, co, ...x] = kids(f);
      if (!pts || !has(pts, 'report-points')) E(f, `${label(f)}: the foot opens with ul.report-points.rv-kids[data-marker="icon"]`); else points(pts, 'icon');
      if (!co || !need(co, 'the callout', C.classes.callout, 'div')) E(co || f, `${label(f)}: div.report-callout.rv[data-tone="orange"] follows the points`);
      else {
        mustHave(co, C.hooks.block); onlyAttrs(co, { class: true, 'data-tone': true }); noText(co);
        if (co.attrs['data-tone'] !== 'orange') E(co, `${label(co)}: on the white section the callout is data-tone="orange"`);
        const [t, tx, ...y] = kids(co);
        if (!t || !has(t, 'icon-tile')) E(co, `${label(co)}: the orange callout opens with its span.icon-tile`); else R.iconTile(t);
        if (!tx || !has(tx, 'report-callout-text')) E(co, `${label(co)}: p.report-callout-text follows the tile`); else text(tx, 'the callout text', C.classes.calloutText);
        y.forEach(z => E(z, `${label(z)}: the callout holds its tile and one paragraph`));
      }
      x.forEach(z => E(z, `${label(z)}: the foot holds the points and the callout`));
    }
    p.slice(i).forEach(x => E(x, `${label(x)}: under the report the white section holds one div.report-foot (the strip, the pair and the footnote belong to the dark section)`));
    return;
  }

  let strip = false;
  if (p[i] && has(p[i], 'report-points')) { strip = true; points(p[i++], 'number'); }
  if (p[i] && has(p[i], 'report-callout')) { strip = true; callout(p[i++], true); }
  if (p[i] && has(p[i], 'report-pair')) {
    const pr = p[i++];
    need(pr, 'the pair of cards', C.classes.pair, 'div'); mustHave(pr, C.hooks.block);
    onlyAttrs(pr, { class: true, 'data-split': true }); variantsOf(pr, C.variants.pair); noText(pr);
    if (strip) E(pr, `${label(pr)}: a pair of cards stands instead of the points strip and the callout, not after them`);
    const cards = kids(pr);
    if (cards.length !== 2) E(pr, `${label(pr)}: exactly two cards (found ${cards.length})`);
    cards.forEach(card);
  }
  if (p[i] && has(p[i], 'report-caveat')) {
    const c = p[i++];
    if (need(c, 'the footnote', C.classes.caveat, 'p')) {
      mustHave(c, C.hooks.block); onlyAttrs(c, { class: true });
      const ck = kids(c);
      if (!ck[0] || ck[0].tag !== 'svg' || !has(ck[0], 'report-caveat-icon')) E(c, `${label(c)}: the footnote opens with its icon, <svg class="report-caveat-icon">, copied as it is`);
      else svgIcon(ck[0], label(c), C.classes.caveatIcon);
      inlineOnly(c, C.inline.text, 'the footnote'); filled(c, 'the footnote (remove it instead)');
    }
  }
  if (p[i] && p[i].attrs['data-slot'] === 'media') seal(p[i++]);
  p.slice(i).forEach(x => E(x, `${label(x)}: not part of the section (under the report, in this order: ol.report-points, div.report-callout — or div.report-pair — then p.report-caveat, then a sealed [data-slot="media"])`));
}

function validate(root, ctx) {
  const R = rules('Report showcase', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'report-showcase')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) {
    checkReport(r.el, R);
    r.note = [r.el.attrs['data-surface'] === 'dark' ? 'dark' : 'white', r.el.attrs['data-tone']].filter(Boolean).join(' · ');
  }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'report-showcase-dark.html';
const PAIR = 'report-showcase-pair.html', PATH = 'report-showcase-path.html', QUIET = 'report-showcase-quiet.html', LIGHT = 'report-showcase-light.html';
/* the sealed report of a snippet: from its opening tag to the block that follows it */
const REPORT = /<div data-report data-slot="report"[\s\S]*?\n    <\/div>(?=\n    <(?:ol|div|p) class="report-)/;
const point = /\s*<li class="report-point">[\s\S]*?<\/li>/;
const BAD = [
  ['a utility added to the title', h => h.replace('class="section-title"', 'class="section-title text-white"')],
  ['the report removed', h => h.replace(REPORT, '')],
  ['the report pasted without its slot mark', h => h.replace('<div data-report data-slot="report"', '<div data-report')],
  ['the report slot emptied', h => h.replace(REPORT, '<div data-report data-slot="report"></div>')],
  ['the report\'s sources cut out of the slot', h => h.replace(/\s*<ul class="absolute inset-0[\s\S]*?<\/ul>/, '')],
  ['neither surface', h => h.replace(' data-surface="dark"', '')],
  ['both surfaces', h => h.replace(' data-surface="dark"', ' data-surface="dark" data-bg="white"')],
  ['the white ground on the dark section\'s markup', h => h.replace(' data-surface="dark"', ' data-bg="white"')],
  ['the rhythm removed', h => h.replace(/ data-space="[a-z]+"/, '')],
  ['an unknown rhythm', h => h.replace(/data-space="[a-z]+"/, 'data-space="xl"')],
  ['data-tone="quiet" on the two-glow ground', h => h.replace(' data-surface="dark"', ' data-surface="dark" data-tone="quiet"')],
  ['a glow removed', h => h.replace(/\s*<div class="orb orb-dark-coral"><\/div>/, '')],
  ['a glow given an inline style', h => h.replace('class="orb orb-dark-teal"', 'class="orb orb-dark-teal" style="background:red"')],
  ['the head removed', h => h.replace(/\s*<div class="section-head rv"[\s\S]*?\n    <\/div>/, '')],
  ['an unknown head width', h => h.replace(/(class="section-head rv")[^>]*>/, '$1 data-measure="900">')],
  ['a fourth point', h => h.replace(/(<li class="report-point">[\s\S]*?<\/li>)/, '$1\n$1')],
  ['two points', h => h.replace(point, '')],
  ['a word in a point\'s number', h => h.replace(/(<span class="report-point-num">)\d/, '$1One')],
  ['markup in a point\'s name', h => h.replace(/(<span class="report-point-name">)([^<]*)/, '$1<b>$2</b>')],
  ['the points with icons on the dark section', h => h.replace('data-marker="number"', 'data-marker="icon"')],
  ['the reveal hook removed from the points', h => h.replace('class="report-points rv"', 'class="report-points"')],
  ['the callout without its icon', h => h.replace(/\s*<span class="report-callout-icon">[\s\S]*?<\/span>/, '')],
  ['the orange callout on the dark section', h => h.replace('class="report-callout rv"', 'class="report-callout rv" data-tone="orange"')],
  ['a button under the report', h => h.replace(/(\n  <\/div>\n<\/section>)/, '\n    <a href="#x" class="action-button btn-press group">Go<span class="action-button-orb icon-orb"><svg></svg></span></a>$1')],
  ['a <script> in the section', h => h.replace('<div class="report-inner">', '<div class="report-inner"><script>alert(1)</script>')],
  ['pair: three cards', h => h.replace(/(<p class="report-aside">[\s\S]*?<\/p>)/, '$1\n$1'), PATH],
  ['pair: an unknown split', h => h.replace('data-split="tail"', 'data-split="even"'), PATH],
  ['pair: the points strip before the pair', h => h.replace('<div class="report-pair rv">', '<div class="report-callout rv"><span class="report-callout-icon"><svg></svg></span><p class="report-callout-text">A match is evidence.</p></div>\n    <div class="report-pair rv">'), PAIR],
  ['pair: two pen words in the statement', h => h.replace(/(<span class="pen-word">[^<]*<svg[\s\S]*?<\/svg><\/span>)/, '$1 $1'), PAIR],
  ['pair: the pen word without its line', h => h.replace(/(<span class="pen-word">[^<]*)<svg[\s\S]*?<\/svg>/, '$1'), PAIR],
  ['path: two current pills', h => h.replace('<span class="report-path-pill">', '<span class="report-path-pill" data-state="current"><span class="report-path-dot"></span>'), PATH],
  ['path: the arrow removed between two steps', h => h.replace(/\s*<svg class="report-path-arrow"[\s\S]*?<\/svg>/, ''), PATH],
  ['path: a single step', h => { let o = h; for (let n = 0; n < 4 && (o.match(/<li class="report-path-step">/g) || []).length > 1; n++) o = o.replace(/\s*<li class="report-path-step">[\s\S]*?<\/li>/, ''); return o; }, PATH],
  ['quiet: the ground removed', h => h.replace(/\s*<div class="report-bg">[\s\S]*?<\/div>\s*<\/div>/, ''), QUIET],
  ['quiet: the page\'s block without its slot mark', h => h.replace(' data-slot="media"', ''), QUIET],
  ['quiet: the footnote without its icon', h => h.replace(/\s*<svg class="report-caveat-icon"[\s\S]*?<\/svg>/, ''), QUIET],
  ['white: the dark section\'s glows', h => h.replace('<div class="report-inner">', '<div class="orb orb-dark-teal"></div>\n  <div class="orb orb-dark-coral"></div>\n  <div class="report-inner">'), LIGHT],
  ['white: data-tone on the section', h => h.replace(' data-bg="white"', ' data-bg="white" data-tone="quiet"'), LIGHT],
  ['white: the callout without its colour', h => h.replace('class="report-callout rv" data-tone="orange"', 'class="report-callout rv"'), LIGHT],
  ['white: the stagger hook removed from the points', h => h.replace('class="report-points rv-kids"', 'class="report-points"'), LIGHT],
  ['white: an unknown tile tone', h => h.replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1blue"'), LIGHT],
];
const GOOD = [
  ['new title, intro and point texts', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1How to read the report').replace(/(<p class="section-intro"[^>]*>)[^<]*/, '$1A new intro with <strong>one strong phrase</strong>.').replace(/(<span class="report-point-text">)[^<]*/, '$1New text.')],
  ['the pill removed, a second intro added', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/(<p class="section-intro"[^>]*>[\s\S]*?<\/p>)/, '$1\n      <p class="section-intro" data-measure="72">A second paragraph.</p>')],
  ['another head width, the intro\'s measure removed', h => h.replace(/(class="section-head rv")[^>]*>/, '$1 data-measure="860">').replace(/(<p class="section-intro") data-measure="\d+"/, '$1')],
  ['the other rhythm, the orange dot, the id removed', h => h.replace(/data-space="[a-z]+"/, 'data-space="lg"').replace(' data-accent="teal"', '').replace(/(<section) id="[^"]*"/, '$1')],
  ['the callout removed', h => h.replace(/\s*<div class="report-callout rv">[\s\S]*?<\/p>\s*<\/div>/, '')],
  ['the points removed', h => h.replace(/\s*<ol class="report-points rv"[\s\S]*?<\/ol>/, '')],
  ['nothing under the report', h => h.replace(/\s*<ol class="report-points rv"[\s\S]*?<\/ol>/, '').replace(/\s*<div class="report-callout rv">[\s\S]*?<\/p>\s*<\/div>/, '')],
  ['a pen word in the title', h => h.replace(/(<h2 class="section-title">)([^<]*)/, '$1<span class="pen-word">Review<svg class="pen-mark" viewBox="0 0 108 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c27-7 72-7 102-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/></svg></span> the evidence')],
  ['pair: another pen word, the label and the paragraph removed', h => h.replace(/(<span class="pen-word">)[^<]*/, '$1never').replace(/\s*<p class="report-kicker">[^<]*<\/p>/, '').replace(/\s*<p class="report-principle-text">[\s\S]*?<\/p>/, ''), PAIR],
  ['pair: the second card the wider one', h => h.replace('class="report-pair rv"', 'class="report-pair rv" data-split="tail"'), PAIR],
  ['path: the current pill moved, another tile tone', h => h.replace('<span class="report-path-pill" data-state="current"><span class="report-path-dot"></span>', '<span class="report-path-pill">').replace(/(<span class="report-path-pill">)(?![\s\S]*<span class="report-path-pill">)/, '<span class="report-path-pill" data-state="current"><span class="report-path-dot"></span>').replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1teal"'), PATH],
  ['path: a step removed (two left)', h => { const a = h.lastIndexOf('<li class="report-path-step">'); const b = h.indexOf('</li>', a) + 5; return (h.slice(0, a) + h.slice(b)).replace(/(\s*)<svg class="report-path-arrow"[^>]*>(?:(?!<\/svg>)[\s\S])*<\/svg>(\s*<\/li>\s*<\/ol>)/, '$2'); }, PATH],
  ['quiet: the footnote edited, the page\'s block removed', h => h.replace(/(<\/svg>\s*)[^<]+(<\/p>)/, '$1A report is evidence for review.\n    $2').replace(/\s*<div data-slot="media"[\s\S]*<\/div>(?=\n  <\/div>\n<\/section>)/, ''), QUIET],
  ['quiet: the footnote removed', h => h.replace(/\s*<p class="report-caveat rv">[\s\S]*?<\/p>/, ''), QUIET],
  ['white: new point names, another tile tone', h => h.replace(/(<h3 class="report-point-name">)[^<]*/, '$1Matches').replace(/(class="icon-tile" data-tone=")[a-z]+"/, '$1mint"'), LIGHT],
  ['white: the foot removed', h => h.replace(/\s*<div class="report-foot">[\s\S]*<\/div>(?=\n  <\/div>\n<\/section>)/, ''), LIGHT],
];

/* this component's own classes (the pen mark and the icon tile are hosted primitives) */
const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^report-/.test(c)));

module.exports = {
  name: 'report-showcase', title: 'Report showcase', unit: '',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Report showcase part outside a complete section (section.report-showcase)',
  mentions: html => /class="report-showcase"|\breport-(?:inner|points|callout|pair|foot)\b/.test(html),
  SNIPPET, BAD, GOOD,
};
