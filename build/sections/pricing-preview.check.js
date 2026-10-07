/* Pricing preview — the validator's rules (contract: build/sections/pricing-preview.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.pricing-preview):
     structure   the head its layout takes, the period switch, the plans, one optional
                 foot — in that order
     classes     only the contract's classes on each part outside the two sealed blocks,
                 with the behaviour hooks kept (rv, orb, btn-press …)
     variants    data-layout, data-bg, data-space required; data-pricing (the first period)
                 and data-pricing-animate kept
     content     the text around the cards: limited inline tags, nothing empty, NO PRICE
     THE FIGURES the two sealed blocks are not inspected for classes, but what they SAY is
                 held to the data, because a wrong number here is a wrong price:
                   · the JSON island is there, once, inside the plans block, and readable
                   · the island is the pricing data source's (build/pricing-data.js), key
                     for key — an edited price, quota or period is refused
                   · every card shows, on first paint, exactly what the island holds for
                     the section's first period: price, term, rate, each feature line
                   · the switch has one button per period of the data, the first period's
                     pressed
                   · the "Recurring payments" switch, where a centred section has one, is
                     the only one, under the tabs, and disabled on a first period the data
                     gives no one-off price
                   · the period's note (center) is the data's note */
const C = require('./pricing-preview.contract');
const { kids, cls, has, walk, label, textOf, rules } = require('./check-tools');

/* the single source of the figures; when the backend widget replaces it, this rule goes with it */
let SOURCE = null;
try { SOURCE = require('../pricing-data').PLANS; } catch (e) { SOURCE = null; }

const PRICE = /[$€£₴]\s?\d|\d\s?(?:USD|EUR|UAH)\b/;
const plainText = n => textOf(n).replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (m, d) => String.fromCharCode(+d)).replace(/\s+/g, ' ').trim();
const TIERS = ['light', 'standard', 'premium'];

function checkPricing(el, R) {
  const { E, W, need, mustHave, variantsOf, onlyAttrs, noText, filled, link, inlineOnly, svgIcon, seal } = R;
  R.at = el;
  R.sectionRoot(el, 'pricing-preview', C.classes.section, {
    ...C.variants.section,
    'data-pricing': { values: SOURCE ? Object.keys(SOURCE) : ['onetime', 'monthly', 'quarterly', 'yearly'], required: true },
    'data-pricing-animate': { values: [''], required: true },
  });
  const layout = el.attrs['data-layout'];
  if (!C.variants.section['data-layout'].values.includes(layout)) return;
  const center = layout === 'center';
  const initial = el.attrs['data-pricing'];
  const noPrice = (n, what) => { if (PRICE.test(plainText(n))) E(n, `${label(n)}: a price in ${what} — figures are shown by the plan cards only, from the pricing data (never typed into the text)`); };

  /* ── the ground and the column ── */
  const k = kids(el);
  let inner = k[0];
  if (center) {
    const g = k[0];
    if (!g || !has(g, 'pricing-glow')) E(g || el, `${label(el)}: data-layout="center": the section opens with <div class="orb pricing-glow"></div>, copied as it is`);
    else {
      inner = k[1];
      need(g, 'the glow', C.classes.glow, 'div'); mustHave(g, C.hooks.glow); onlyAttrs(g, { class: true });
      if (g.children.some(c => c.tag !== '#text' || c.text.trim())) E(g, `${label(g)}: the glow stays empty`);
    }
    k.slice(k.indexOf(inner) + 1).forEach(x => E(x, `${label(x)}: the section holds its glow and div.pricing-inner`));
  } else k.slice(1).forEach(x => E(x, `${label(x)}: the section holds div.pricing-inner alone`));
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.pricing-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  const p = kids(inner);
  let i = 0;

  /* ── the head ── */
  const head = p[i];
  const headOpts = { title: C.inline.title, intro: C.inline.intro, introMeasures: center ? [] : C.variants.intro['data-measure'].values };
  if (center) {
    if (!head || !has(head, 'section-head')) E(head || inner, `${label(inner)}: data-layout="center": the head block, div.section-head, comes first`);
    else { i++; R.headBlock(head, { ...headOpts, measures: [] }); noPrice(head, 'the head'); }
  } else if (!head || !has(head, 'pricing-top')) E(head || inner, `${label(inner)}: data-layout="split": div.pricing-top (the head beside the note card) comes first`);
  else {
    i++;
    need(head, 'the head row', C.classes.top, 'div'); onlyAttrs(head, { class: true }); noText(head);
    const [hd, aside, ...rest] = kids(head);
    if (!hd || !need(hd, 'the head column', C.classes.topHead, 'div')) E(hd || head, `${label(head)}: the row opens with div.pricing-top-head (the pill, the title, the intro)`);
    else {
      mustHave(hd, C.hooks.block); onlyAttrs(hd, { class: true }); noText(hd);
      const hk = kids(hd);
      hk.slice(R.headParts(hk, hd, headOpts)).forEach(x => E(x, `${label(x)}: not part of the head (order: pill?, title, intro?)`));
      noPrice(hd, 'the head');
    }
    if (aside) {
      if (need(aside, 'the note card', C.classes.aside, 'p')) {
        mustHave(aside, C.hooks.block); onlyAttrs(aside, { class: true }); noText(aside);
        const [ic, tx, ...x] = kids(aside);
        if (!ic || !need(ic, 'the note\'s icon', C.classes.asideIcon, 'span')) E(ic || aside, `${label(aside)}: the note opens with span.pricing-aside-icon, copied as it is`);
        else { onlyAttrs(ic, { class: true }); noText(ic); const s = kids(ic); if (s.length !== 1) E(ic, `${label(ic)}: holds only its <svg> icon`); svgIcon(s[0], label(ic), []); }
        if (!tx || !need(tx, 'the note\'s text', C.classes.asideText, 'span')) E(tx || aside, `${label(aside)}: span.pricing-aside-text follows the icon`);
        else { onlyAttrs(tx, { class: true }); inlineOnly(tx, C.inline.aside, 'the note'); filled(tx, 'the note (remove the card instead)'); noPrice(tx, 'the note'); }
        x.forEach(z => E(z, `${label(z)}: the note holds its icon and its text`));
      }
    }
    rest.forEach(x => E(x, `${label(x)}: the head row holds the head column and one optional note card`));
  }

  /* ── the two sealed blocks ── */
  const periods = p[i];
  if (!periods || periods.attrs['data-slot'] !== 'pricing-periods') E(periods || inner, `${label(periods || inner)}: the period switch follows the head — the block with data-slot="pricing-periods", copied as it is`);
  else { i++; seal(periods); }
  const plans = p[i];
  if (!plans || plans.attrs['data-slot'] !== 'pricing-plans') E(plans || inner, `${label(plans || inner)}: the plan cards follow the switch — the block with data-slot="pricing-plans", copied as it is (with its <template> and its data <script>)`);
  else { i++; seal(plans); }

  /* ── the figures: the island, then everything that shows a figure against it ── */
  const islands = []; walk(el, n => { if (n.tag === 'script' && n.attrs && 'data-pricing-data' in n.attrs) islands.push(n); });
  let DATA = null;
  if (!islands.length) E(plans || el, `${label(plans || el)}: the pricing data island is missing — <script type="application/json" data-pricing-data> inside the plans block. Without it the cards cannot change period; copy the whole block from the snippet`);
  else {
    if (islands.length > 1) E(islands[1], `${label(islands[1])}: one pricing data island per section (found ${islands.length})`);
    const isl = islands[0];
    if (isl.attrs.type !== 'application/json') E(isl, `${label(isl)}: the island is <script type="application/json" data-pricing-data>`);
    if (plans && plans.attrs['data-slot'] === 'pricing-plans') { let inside = false; walk(plans, n => { if (n === isl) inside = true; }); if (!inside) E(isl, `${label(isl)}: the pricing data island belongs inside the plans block ([data-slot="pricing-plans"]), so the two are copied together`); }
    try { DATA = JSON.parse(isl.body); } catch (e) { E(isl, `${label(isl)}: the pricing data island is not readable JSON (${String(e.message).slice(0, 60)}) — copy it again from the snippet`); }
    if (DATA && SOURCE && JSON.stringify(DATA) !== JSON.stringify(SOURCE)) {
      /* name the first figure that differs */
      let where = '';
      const walkDiff = (a, b, at) => { if (where) return; if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) where = `${at}: ${JSON.stringify(a)} — the data source says ${JSON.stringify(b)}`; return; } for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) walkDiff(a[key], b[key], at ? at + '.' + key : key); };
      walkDiff(DATA, SOURCE, '');
      E(isl, `${label(isl)}: the pricing data island is not the pricing data source's (build/pricing-data.js) — ${where.slice(0, 160)}. Prices, quotas and periods are never edited in a page`);
      /* what the cards show is then held to the source itself, not to the altered island */
      DATA = SOURCE;
    }
  }
  if (DATA) {
    const period = DATA[initial];
    if (!period) E(el, `${label(el)}: data-pricing="${initial}" is not a period of the pricing data (${Object.keys(DATA).join(' | ')})`);
    if (periods && periods.attrs['data-slot'] === 'pricing-periods') {
      const tabs = []; walk(periods, n => { if (has(n, 'period-btn')) tabs.push(n); });
      const keys = tabs.map(t => t.attrs['data-period']);
      const want = Object.keys(DATA);
      if (keys.join() !== want.join()) E(periods, `${label(periods)}: the switch has one button per period of the data, in its order (${want.join(', ')}); found ${keys.join(', ') || 'none'}`);
      const active = tabs.filter(t => has(t, 'active')).map(t => t.attrs['data-period']);
      if (active.length !== 1 || active[0] !== initial) E(periods, `${label(periods)}: the pressed button is the section's first period, "${initial}" (found ${active.join(', ') || 'none'})`);
      tabs.forEach(t => { if ('aria-pressed' in t.attrs && (t.attrs['aria-pressed'] === 'true') !== has(t, 'active')) W(t, `${label(t)}: aria-pressed does not match the pressed button`); });
    }
    if (period && plans && plans.attrs['data-slot'] === 'pricing-plans') {
      const cards = []; walk(plans, n => { if (n.attrs && 'data-tier' in n.attrs) cards.push(n); });
      const tiers = cards.map(c => c.attrs['data-tier']);
      if (tiers.join() !== TIERS.join()) E(plans, `${label(plans)}: the plans block holds the three cards of the data — ${TIERS.join(', ')} — each once, in that order (found ${tiers.join(', ') || 'none'})`);
      let templates = 0; walk(plans, n => { if (n.tag === 'template' && 'data-pricing-feat' in n.attrs) templates++; });
      if (!templates) E(plans, `${label(plans)}: the feature-line <template data-pricing-feat> is missing — the script draws a period's lines with it`);
      cards.forEach(card => {
        const tier = period[card.attrs['data-tier']];
        if (!tier) return;
        const find = c => { let hit = null; walk(card, n => { if (!hit && has(n, c)) hit = n; }); return hit; };
        const shows = (c, want, what) => {
          const n = find(c);
          if (!n) { E(card, `${label(card)}: the ${card.attrs['data-tier']} card has lost its ${what} (.${c})`); return; }
          const got = plainText(n);
          if (got !== want) E(n, `${label(n)}: the ${card.attrs['data-tier']} card shows ${what} "${got.slice(0, 40)}", the pricing data says "${want}" — a figure is never edited in the page`);
        };
        shows('js-price', tier.price, 'price'); shows('js-rate', tier.rate, 'rate'); shows('js-term', period.term, 'term');
        const list = find('js-feats');
        if (!list) E(card, `${label(card)}: the ${card.attrs['data-tier']} card has lost its feature list (.js-feats)`);
        else {
          const got = kids(list).filter(n => n.tag === 'li').map(plainText);
          if (got.join(' | ') !== tier.feats.join(' | ')) E(list, `${label(list)}: the ${card.attrs['data-tier']} card lists "${got.join(' | ').slice(0, 70)}", the pricing data says "${tier.feats.join(' | ').slice(0, 70)}"`);
        }
      });
    }
  }

  /* ── the "Recurring payments" switch: optional; one, under the tabs of a centred section ──
     60-pricing.js reads one input[data-recurring] per section and moves all three cards
     with it, so a second one would be dead; and the state it opens in is the data's — a
     first period with no one-off price cannot recur */
  const switches = []; walk(el, n => { if (n.attrs && 'data-recurring' in n.attrs) switches.push(n); });
  if (switches.length) {
    const sw = switches[0], box = sw.parent;
    let under = false; if (periods && periods.attrs['data-slot'] === 'pricing-periods') walk(periods, n => { if (n === sw) under = true; });
    if (switches.length > 1) E(switches[1], `${label(switches[1])}: one "Recurring payments" switch per section — it moves all three cards (found ${switches.length})`);
    if (!center) E(sw, `${label(sw)}: the "Recurring payments" switch belongs to data-layout="center"`);
    if (!under) E(sw, `${label(sw)}: the "Recurring payments" switch belongs inside the period switch's block ([data-slot="pricing-periods"]), under the tabs`);
    if (sw.tag !== 'input' || sw.attrs.type !== 'checkbox' || !('data-default-on' in sw.attrs)) E(sw, `${label(sw)}: the "Recurring payments" switch is <input type="checkbox" data-recurring data-default-on>, copied as it is`);
    if (!box || box.tag !== 'label' || !has(box, 'pr-switch')) E(sw, `${label(sw)}: the "Recurring payments" switch sits in its <label class="pr-switch …">, with the track and the label's text`);
    else { if (!plainText(box)) E(box, `${label(box)}: the "Recurring payments" switch has lost its text`); noPrice(box, 'the switch\'s label'); }
    if (DATA && DATA[initial]) {
      const canRecur = TIERS.some(t => DATA[initial][t] && DATA[initial][t].single);
      if (canRecur === ('disabled' in sw.attrs)) E(sw, `${label(sw)}: the pricing data gives the first period, "${initial}", ${canRecur ? 'a one-off price, so the "Recurring payments" switch opens enabled' : 'no one-off price, so the "Recurring payments" switch opens disabled (the script enables it on a period that can recur)'}`);
    }
  }

  /* ── the foot ── */
  const foot = p[i];
  if (foot && has(foot, 'pricing-foot')) {
    i++;
    need(foot, 'the line under the cards', C.classes.foot, 'div'); mustHave(foot, C.hooks.block); onlyAttrs(foot, { class: true }); noText(foot);
    if (!center) E(foot, `${label(foot)}: the line with the period's note belongs to data-layout="center" (split takes div.pricing-actions)`);
    const [note, dot, a, ...x] = kids(foot);
    if (!note || !need(note, 'the period\'s note', C.classes.note, 'span')) E(note || foot, `${label(foot)}: the line opens with <span class="pricing-note" data-period-note>`);
    else {
      onlyAttrs(note, { class: true, 'data-period-note': '' });
      if (!('data-period-note' in note.attrs)) E(note, `${label(note)}: data-period-note is required — the script writes each period's note here`);
      inlineOnly(note, [], 'the period\'s note');
      const want = DATA && DATA[initial] ? DATA[initial].note : undefined;
      if (want !== undefined && plainText(note) !== want) E(note, `${label(note)}: the note says "${plainText(note).slice(0, 50)}", the pricing data says "${want}" — it is the period's own line, not page copy`);
    }
    if (dot || a) {
      if (!dot || !need(dot, 'the separator', C.classes.footDot, 'span')) E(dot || foot, `${label(foot)}: <span class="pricing-foot-dot"></span> stands between the note and the link`);
      else { onlyAttrs(dot, { class: true }); if (dot.children.length) E(dot, `${label(dot)}: the separator stays empty`); }
      if (!a || !need(a, 'the quiet link', C.classes.link, 'a')) E(a || foot, `${label(foot)}: a.pricing-link follows the separator (remove both to drop the link)`);
      else { link(a, { href: true, rel: true, target: true, class: true }); inlineOnly(a, [], 'the quiet link'); noPrice(a, 'the link'); }
    }
    x.forEach(z => E(z, `${label(z)}: the line holds the note, the separator and one link`));
  } else if (foot && has(foot, 'pricing-actions')) {
    i++;
    need(foot, 'the action', C.classes.actions, 'div'); mustHave(foot, C.hooks.block); onlyAttrs(foot, { class: true }); noText(foot);
    if (center) E(foot, `${label(foot)}: a button under the cards belongs to data-layout="split" (in center the plans carry the buttons)`);
    const ak = kids(foot);
    if (ak.length !== 1 || !has(ak[0], 'action-button')) E(foot, `${label(foot)}: holds exactly one a.action-button`);
    else { R.actionButton(ak[0], { tones: ['light'] }); if (ak[0].attrs['data-tone'] !== 'light') E(ak[0], `${label(ak[0])}: the button under the cards is the light one, data-tone="light" (the dark buttons are the plans' own)`); noPrice(ak[0], 'the button'); }
  }
  p.slice(i).forEach(x => E(x, `${label(x)}: not part of the section (order: the head, the period switch, the plans, then one ${center ? 'div.pricing-foot' : 'div.pricing-actions'})`));
}

function validate(root, ctx) {
  const R = rules('Pricing preview', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'pricing-preview')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) { checkPricing(r.el, R); r.note = r.el.attrs['data-layout'] || ''; }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'pricing-preview-center.html';
const SPLIT = 'pricing-preview-split.html';
const ISLAND = /\s*<script type="application\/json" data-pricing-data>[\s\S]*?<\/script>/;
const BAD = [
  ['a price edited in a card', h => h.replace(/(js-price">)\$9\.95/, '$1$7.95')],
  ['a price edited in the island', h => h.replace('"price":"$17.95"', '"price":"$15.95"')],
  ['a price edited in the card AND in the island (the two agree, the data source does not)', h => h.replace(/(js-price">)\$9\.95/, '$1$7.95').replace('"light":{"price":"$9.95"', '"light":{"price":"$7.95"')],
  ['a yearly price edited in the island (not on screen at first paint)', h => h.replace('"price":"$259.95"', '"price":"$199.95"')],
  ['a quota edited in a card', h => h.replace('10 plagiarism checks</li>', '100 plagiarism checks</li>')],
  ['a feature line added to a card', h => h.replace(/(<ul class="[^"]*js-feats">)/, '$1<li class="flex gap-3">Unlimited checks</li>')],
  ['the rate edited in a card', h => h.replace(/(<span class="js-rate">)\$1\.00/, '$1$0.50')],
  ['the term edited in a card', h => h.replace(/(js-term">)\/ one-time/, '$1/ month')],
  ['the island removed', h => h.replace(ISLAND, '')],
  ['the island emptied', h => h.replace(/(<script type="application\/json" data-pricing-data>)[\s\S]*?(<\/script>)/, '$1$2')],
  ['the island broken (not JSON)', h => h.replace(/(<script type="application\/json" data-pricing-data>)\{/, '$1{,')],
  /* (a function as the replacement: the island holds "$1.00", which a replacement string would read as a group) */
  ['the island moved out of the plans block', h => { const m = h.match(ISLAND); return h.replace(ISLAND, '').replace(/\n<\/section>/, all => m[0] + all); }],
  ['a second island', h => { const m = h.match(ISLAND); return h.replace(/\n<\/section>/, all => m[0] + all); }],
  ['a period removed from the island', h => h.replace(/,"yearly":\{[\s\S]*?\}\}\}(?=<\/script>)/, '}')],
  ['a period button removed from the switch', h => h.replace(/\s*<button type="button" data-period="yearly"[^>]*>[^<]*<\/button>/, '')],
  ['another period pressed without its figures', h => h.replace('data-pricing="onetime"', 'data-pricing="monthly"')],
  ['a plan card removed', h => h.replace(/\s*<div data-tier="premium"[\s\S]*?\n      <\/div>(?=\n\s*(?:<template|<script))/, '')],
  ['a plan card given another tier name', h => h.replace('data-tier="premium"', 'data-tier="enterprise"')],
  ['the feature-line templates removed', h => h.replace(/\s*<template data-pricing-feat>[\s\S]*?<\/template>/g, '')],
  ['the plans pasted without their slot mark', h => h.replace('<div data-slot="pricing-plans" ', '<div ')],
  ['the switch pasted without its slot mark', h => h.replace('<div data-slot="pricing-periods" ', '<div ')],
  ['the switch removed', h => h.replace(/\s*<div data-slot="pricing-periods"[\s\S]*?\n    <\/div>(?=\n    <div data-slot="pricing-plans")/, '')],
  ['the "Recurring payments" switch enabled on One-time, which cannot recur', h => h.replace(' data-recurring data-default-on disabled>', ' data-recurring data-default-on>')],
  ['a second "Recurring payments" switch', h => h.replace(/(\s*<label class="pr-switch[\s\S]*?<\/label>)/, '$1$1')],
  ['the "Recurring payments" switch moved under the cards', h => { const m = h.match(/\s*<label class="pr-switch[\s\S]*?<\/label>/); return m ? h.replace(m[0], '').replace(/(\n    <div class="pricing-foot rv">)/, all => m[0] + all) : h; }],
  ['the first period removed from the section', h => h.replace(' data-pricing="onetime"', '')],
  ['the period\'s note rewritten', h => h.replace(/(data-period-note>)[^<]*/, '$1Cancel anytime · no hidden fees')],
  ['the period\'s note without its hook', h => h.replace(' data-period-note', '')],
  ['a price typed into the intro', h => h.replace(/(<p class="section-intro">)/, '$1Plans from $9.95. ')],
  ['a price typed into the title', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1Plans from $9.95')],
  ['a utility added to the title', h => h.replace('class="section-title"', 'class="section-title text-ink-900"')],
  ['an unknown layout', h => h.replace('data-layout="center"', 'data-layout="wide"')],
  ['another ground', h => h.replace('data-bg="tint"', 'data-bg="white"')],
  ['the glow removed', h => h.replace(/\s*<div class="orb pricing-glow"><\/div>/, '')],
  ['a javascript: link', h => h.replace(/(<a href=")[^"]*(" class="pricing-link">)/, '$1javascript:void(0)$2')],
  ['center: a button under the cards', h => h.replace(/\s*<div class="pricing-foot rv">[\s\S]*?\n    <\/div>(?=\n  <\/div>\n<\/section>)/, '\n    <div class="pricing-actions rv"><a href="#x" class="action-button btn-press group" data-tone="light">All plans<span class="action-button-orb icon-orb"><svg></svg></span></a></div>')],
  ['split: a price typed into the note card', h => h.replace(/(<span class="pricing-aside-text">)/, '$1Only $9.95. '), SPLIT],
  ['split: the dark button under the cards', h => h.replace(/(class="action-button btn-press group") data-tone="light"/, '$1'), SPLIT],
  ['split: the note card without its icon', h => h.replace(/\s*<span class="pricing-aside-icon">[\s\S]*?<\/span>/, ''), SPLIT],
  ['split: a price edited in a card', h => h.replace(/(js-price">)\$41\.95/, '$1$39.95'), SPLIT],
  ['split: the island removed', h => h.replace(ISLAND, ''), SPLIT],
];
const GOOD = [
  ['new title, intro and pill text', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1Pick the plan that fits').replace(/(<p class="section-intro">)[^<]*/, '$1Compare <strong>one-time</strong> and subscription options.').replace(/(<span class="section-eyebrow-label">)[^<]*/, '$1Pricing')],
  ['the pill and the intro removed', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/\s*<p class="section-intro">[\s\S]*?<\/p>/, '')],
  ['the other rhythm, the teal dot, an id of the page\'s own', h => h.replace(/data-space="[a-z]+"/, 'data-space="lg" data-accent="teal"').replace(/(<section) id="[^"]*"/, '$1 id="plans"')],
  ['the quiet link\'s text and address', h => h.replace(/<a href="[^"]*" class="pricing-link">[^<]*/, '<a href="https://example.com/pricing" target="_blank" rel="noopener" class="pricing-link">All plans and packages')],
  ['the quiet link removed with its separator', h => h.replace(/\s*<span class="pricing-foot-dot"><\/span>\s*<a href="[^"]*" class="pricing-link">[^<]*<\/a>/, '')],
  ['the line under the cards removed', h => h.replace(/\s*<div class="pricing-foot rv">[\s\S]*?\n    <\/div>(?=\n  <\/div>\n<\/section>)/, '')],
  ['split: the note card\'s text, the intro\'s measure', h => h.replace(/(<span class="pricing-aside-text">)[^<]*/, '$1The free check needs no registration.').replace(/(<p class="section-intro") data-measure="\d+"/, '$1 data-measure="72"'), SPLIT],
  ['split: the note card removed', h => h.replace(/\s*<p class="pricing-aside rv">[\s\S]*?<\/p>/, ''), SPLIT],
  ['split: the button\'s label and address', h => h.replace(/<a href="[^"]*" class="action-button btn-press group" data-tone="light">\s*[^<]*/, '<a href="prices.html#plans" class="action-button btn-press group" data-tone="light">\n        Compare all plans\n        '), SPLIT],
  ['split: the button removed', h => h.replace(/\s*<div class="pricing-actions rv">[\s\S]*?<\/a>\s*<\/div>/, ''), SPLIT],
];

const PARTS = new Set(Object.values(C.classes).flat().filter(c => /^pricing-/.test(c)));

module.exports = {
  name: 'pricing-preview', title: 'Pricing preview', unit: '',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)) || (!!n.attrs && /^pricing-/.test(n.attrs['data-slot'] || '')),
  outside: 'a Pricing preview part outside a complete section (section.pricing-preview)',
  mentions: html => /class="pricing-preview"|data-slot="pricing-/.test(html),
  SNIPPET, BAD, GOOD,
};
