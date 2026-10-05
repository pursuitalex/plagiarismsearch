/* Reviews — the validator's rules (contract: build/sections/reviews.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per
   section found (a section.reviews-section):
     structure   the ground and the head its layout takes; the rail (track, two arrows, the
                 dots' holder) or the grid; every card whole — source, quote, author
     classes     only the contract's classes on each part, with the behaviour hooks kept
                 (rv, rv-kids, the data-carousel-* hooks); a Tailwind utility is named as such
     variants    data-layout and data-space required; the surface its layout takes; a
                 rating one of the nine values
     content     a quote is text (line breaks only), a name and a source are text; nothing
                 empty. A rating's figure and label that disagree with data-rating only
                 warn — the script repairs them at load (44-review-rating.js)
     sealed      <svg> icons (the stars, the arrows) are not inspected inside

   What it cannot check: that a quote is a real review, quoted word for word. That is the
   contract's first rule, and the page's own check holds it against the data. */
const C = require('./reviews.contract');
const { kids, cls, has, walk, label, textOf, rules } = require('./check-tools');

function checkReviews(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, noText, filled, link, inlineOnly, svgIcon } = R;
  R.at = el;
  R.sectionRoot(el, 'reviews', C.classes.section, { ...C.variants.section, 'data-carousel': { values: [''], required: false } });
  const layout = el.attrs['data-layout'];
  if (!C.variants.section['data-layout'].values.includes(layout)) return;
  const carousel = layout === 'carousel';
  const dark = el.attrs['data-surface'] === 'dark', tint = el.attrs['data-bg'] === 'tint';
  if (carousel ? !dark || tint : !tint || dark) E(el, `${label(el)}: data-layout="${layout}" stands on ${carousel ? 'the dark section — data-surface="dark", no data-bg' : 'the tint section — data-bg="tint", no data-surface'}`);
  if (carousel && !('data-carousel' in el.attrs)) E(el, `${label(el)}: data-carousel is required on the section — the script that pages the rail starts from it`);
  if (!carousel && 'data-carousel' in el.attrs) E(el, `${label(el)}: data-carousel belongs to data-layout="carousel"`);
  if ('data-tone' in el.attrs && !carousel) E(el, `${label(el)}: data-tone belongs to the dark section`);

  /* ── the ground and the column ── */
  const k = kids(el);
  let inner = k[0];
  if (carousel) {
    const bg = k[0];
    if (!bg || !has(bg, 'reviews-bg')) E(bg || el, `${label(el)}: the dark section opens with div.reviews-bg, copied as it is`);
    else {
      inner = k[1];
      need(bg, 'the ground', C.classes.bg, 'div'); onlyAttrs(bg, { class: true }); noText(bg);
      const g = kids(bg);
      if (g.length !== 1 || !need(g[0], 'the glow', C.classes.glow, 'div')) E(bg, `${label(bg)}: holds one div.orb.reviews-glow, copied as it is`);
      else { mustHave(g[0], C.hooks.glow); onlyAttrs(g[0], { class: true }); if (g[0].children.some(c => c.tag !== '#text' || c.text.trim())) E(g[0], `${label(g[0])}: the glow stays empty`); }
    }
    k.slice(k.indexOf(inner) + 1).forEach(x => E(x, `${label(x)}: the section holds its ground and div.reviews-inner`));
  } else k.slice(1).forEach(x => E(x, `${label(x)}: the section holds div.reviews-inner alone`));
  if (!inner || !need(inner, 'the column', C.classes.inner, 'div')) { E(inner || el, `${label(el)}: div.reviews-inner is missing`); return; }
  onlyAttrs(inner, { class: true }); noText(inner);

  /* ── a card ── */
  const plain = (n, what, allowed, tag) => {
    if (!need(n, what, allowed, tag)) return;
    onlyAttrs(n, { class: true }); inlineOnly(n, C.inline.label, what); filled(n, what);
  };
  const rating = r => {
    if (!need(r, 'the rating', C.classes.rating, 'span')) return;
    onlyAttrs(r, { class: true, 'data-rating': true }); variantsOf(r, C.variants.rating); noText(r);
    const want = parseFloat(r.attrs['data-rating']);
    const [stars, value, ...x] = kids(r);
    if (!stars || !need(stars, 'the stars', C.classes.stars, 'span')) E(stars || r, `${label(r)}: the rating opens with span.review-stars, copied as it is`);
    else {
      onlyAttrs(stars, { class: true, role: 'img', 'aria-label': true }); noText(stars);
      const lab = stars.attrs['aria-label'] || '';
      if (!lab.trim()) W(stars, `${label(stars)}: the stars have no aria-label ("${r.attrs['data-rating']} out of 5") — the script writes one at load`);
      else if (!isNaN(want) && parseFloat(lab) !== want) W(stars, `${label(stars)}: aria-label says "${lab}", data-rating is ${r.attrs['data-rating']} — the script repairs the label at load; write the same number`);
      /* two rows of five stars: the base, and the lit row in its clip */
      const [base, lit, ...y] = kids(stars);
      const row = (n, what) => { const s = kids(n); if (s.length !== 5 || s.some(v => v.tag !== 'svg')) E(n, `${label(n)}: ${what} holds its five star <svg>, copied as they are`); s.filter(v => v.tag === 'svg').forEach(v => svgIcon(v, label(n), [])); };
      if (!base || !need(base, 'the stars\' base row', ['review-stars-base'], 'span')) E(base || stars, `${label(stars)}: copy the stars whole — span.review-stars-base comes first`);
      else { onlyAttrs(base, { class: true }); noText(base); row(base, 'the base row'); }
      if (!lit || !need(lit, 'the lit stars', ['review-stars-lit'], 'span')) E(lit || stars, `${label(stars)}: copy the stars whole — span.review-stars-lit follows the base row`);
      else {
        onlyAttrs(lit, { class: true }); noText(lit);
        const lk = kids(lit);
        if (lk.length !== 1 || !need(lk[0], 'the lit row', ['review-stars-row'], 'span')) E(lit, `${label(lit)}: holds one span.review-stars-row`);
        else { onlyAttrs(lk[0], { class: true }); noText(lk[0]); row(lk[0], 'the lit row'); }
      }
      y.forEach(z => E(z, `${label(z)}: the stars are two rows, nothing else`));
    }
    if (!value || !need(value, 'the rating\'s figure', C.classes.ratingValue, 'span')) E(value || r, `${label(r)}: span.review-rating-value (the figure) follows the stars`);
    else {
      onlyAttrs(value, { class: true }); inlineOnly(value, [], 'the rating\'s figure');
      const v = textOf(value).trim();
      if (!/^\d(?:\.\d)?$/.test(v)) E(value, `${label(value)}: the figure is the rating as a number ("4.5"), found "${v.slice(0, 20)}"`);
      else if (!isNaN(want) && parseFloat(v) !== want) W(value, `${label(value)}: the figure says ${v}, data-rating is ${r.attrs['data-rating']} — the script repairs the figure at load; write the same number`);
    }
    x.forEach(z => E(z, `${label(z)}: the rating holds its stars and its figure`));
  };
  const card = it => {
    if (!need(it, 'a review', C.classes.item, 'div')) return;
    onlyAttrs(it, { class: true }); noText(it);
    const ik = kids(it);
    const fig = ik[0];
    if (ik.length !== 1 || !fig || fig.tag !== 'figure' || !has(fig, 'review-card')) { E(it, `${label(it)}: holds exactly one <figure class="review-card">`); return; }
    onlyClasses(fig, C.classes.card); onlyAttrs(fig, { class: true }); noText(fig);
    const [src, quote, by, ...rest] = kids(fig);
    if (!src || !need(src, 'the review\'s source', C.classes.source, 'div')) E(src || fig, `${label(fig)}: a card opens with div.review-source (the platform, and the rating)`);
    else {
      onlyAttrs(src, { class: true }); noText(src);
      const s = kids(src);
      let j = 0;
      if (s[j] && has(s[j], 'review-source-mark')) {
        const m = s[j++];
        if (need(m, 'the platform\'s mark', C.classes.mark, 'img')) {
          onlyAttrs(m, { class: true, src: true, alt: '', 'aria-hidden': 'true', loading: true, decoding: true, width: true, height: true });
          if (!(m.attrs.src || '').trim()) E(m, `${label(m)}: the mark needs its src`);
          else if (/^\s*javascript:/i.test(m.attrs.src)) E(m, `${label(m)}: javascript: is not a source`);
        }
      }
      if (!s[j] || !has(s[j], 'review-source-name')) E(src, `${label(src)}: span.review-source-name (the platform) is required`); else plain(s[j++], 'the platform\'s name', C.classes.sourceName, 'span');
      if (s[j] && has(s[j], 'review-rating')) rating(s[j++]);
      s.slice(j).forEach(z => E(z, `${label(z)}: the source row holds the mark?, the platform's name and the rating?`));
    }
    if (!quote || !need(quote, 'the quote', C.classes.quote, 'blockquote')) E(quote || fig, `${label(fig)}: <blockquote class="review-quote"> follows the source`);
    else { onlyAttrs(quote, { class: true, cite: true, lang: true }); inlineOnly(quote, C.inline.quote, 'the quote'); filled(quote, 'the quote (remove the whole card instead)'); }
    if (!by || !need(by, 'the author\'s line', C.classes.by, 'figcaption')) E(by || fig, `${label(fig)}: <figcaption class="review-by"> closes the card`);
    else {
      onlyAttrs(by, { class: true }); noText(by);
      const [au, a, ...x] = kids(by);
      if (!au || !has(au, 'review-author')) E(by, `${label(by)}: span.review-author (the name the platform prints) is required`); else plain(au, 'the author', C.classes.author, 'span');
      if (a) { if (need(a, 'the link to the source', C.classes.link, 'a')) { link(a, { href: true, rel: true, target: true, class: true }); inlineOnly(a, [], 'the link to the source'); } }
      x.forEach(z => E(z, `${label(z)}: the author's line holds the name and one optional link`));
    }
    rest.forEach(z => E(z, `${label(z)}: a card holds its source, its quote and its author's line`));
  };
  const cards = (list, n) => {
    const items = kids(list);
    items.forEach(card);
    if (items.length < 2) E(list, `${label(list)}: at least two reviews (found ${items.length})`);
    else if (carousel ? items.length > 12 : items.length % 3) W(list, `${label(list)}: ${items.length} reviews — ${carousel ? 'a rail of more than twelve is long to page through' : 'the grid is three across: the last row will not be full'}`);
    return items.length;
  };

  const p = kids(inner);
  let i = 0;
  const headOpts = { measures: C.variants.head['data-measure'].values, title: C.inline.title, intro: C.inline.intro };
  if (!carousel) {
    const h = p[i];
    if (!h || !has(h, 'section-head')) E(h || inner, `${label(inner)}: the head block, div.section-head, comes first`); else { i++; R.headBlock(h, headOpts); }
    const g = p[i];
    if (!g || !need(g, 'the grid', C.classes.grid, 'div')) { E(g || inner, `${label(inner)}: div.reviews-grid follows the head`); return; }
    i++;
    mustHave(g, C.hooks.grid); onlyAttrs(g, { class: true, 'data-stagger': true, lang: /^[a-z]{2}(-[A-Za-z]{2})?$/ }); variantsOf(g, C.variants.list); noText(g);
    cards(g);
    p.slice(i).forEach(x => E(x, `${label(x)}: the grid section holds its head and div.reviews-grid (a button under the cards belongs to the carousel)`));
    return;
  }

  /* carousel: the top row with the head, the rail, the dots, one optional button */
  const top = p[i];
  if (!top || !need(top, 'the top row', C.classes.top, 'div')) E(top || inner, `${label(inner)}: div.reviews-top (the row that holds the head) comes first`);
  else {
    i++;
    mustHave(top, C.hooks.top); onlyAttrs(top, { class: true }); noText(top);
    const tk = kids(top);
    if (tk.length !== 1 || !has(tk[0], 'section-head')) E(top, `${label(top)}: holds the head block, div.section-head, alone`);
    else R.headBlock(tk[0], { ...headOpts, reveal: false });
  }
  const rail = p[i];
  if (!rail || !need(rail, 'the rail', C.classes.rail, 'div')) { E(rail || inner, `${label(inner)}: div.reviews-rail follows the head`); return; }
  i++;
  mustHave(rail, C.hooks.rail); onlyAttrs(rail, { class: true }); noText(rail);
  const [track, prev, next, ...rx] = kids(rail);
  if (!track || !need(track, 'the track', C.classes.track, 'div')) E(track || rail, `${label(rail)}: the rail opens with <div data-carousel-track class="reviews-track">`);
  else {
    onlyAttrs(track, { class: true, 'data-carousel-track': '', lang: /^[a-z]{2}(-[A-Za-z]{2})?$/ }); noText(track);
    if (!('data-carousel-track' in track.attrs)) E(track, `${label(track)}: data-carousel-track is required — the script pages this element`);
    cards(track);
  }
  const arrow = (b, hook, what) => {
    if (!b || !need(b, what, C.classes.nav, 'button')) { E(b || rail, `${label(rail)}: ${what} — <button type="button" ${hook} class="reviews-nav"> — is missing; copy both arrows as they are`); return; }
    onlyAttrs(b, { class: true, type: 'button', 'aria-label': true, [hook]: '' }); noText(b);
    if (!(hook in b.attrs)) E(b, `${label(b)}: ${hook} is required on ${what}`);
    if (!(b.attrs['aria-label'] || '').trim()) E(b, `${label(b)}: ${what} needs an aria-label (it holds only an icon)`);
    const s = kids(b); if (s.length !== 1) E(b, `${label(b)}: holds only its <svg> arrow`); svgIcon(s[0], label(b), []);
  };
  arrow(prev, 'data-carousel-prev', 'the "previous" arrow'); arrow(next, 'data-carousel-next', 'the "next" arrow');
  rx.forEach(x => E(x, `${label(x)}: the rail holds the track and its two arrows`));
  const dots = p[i];
  if (!dots || !need(dots, 'the dots\' holder', C.classes.dots, 'div')) E(dots || inner, `${label(inner)}: <div data-carousel-dots data-dot-label="…" class="reviews-dots"></div> follows the rail — the script draws the page dots in it`);
  else {
    i++;
    onlyAttrs(dots, { class: true, 'data-carousel-dots': '', 'data-dot-label': true });
    if (!('data-carousel-dots' in dots.attrs)) E(dots, `${label(dots)}: data-carousel-dots is required`);
    if (!(dots.attrs['data-dot-label'] || '').trim()) W(dots, `${label(dots)}: data-dot-label names a page for screen readers ("Reviews page") — without it the dots say "Page 2"`);
    if (dots.children.some(c => c.tag !== '#text' || c.text.trim())) E(dots, `${label(dots)}: the holder stays empty — the script draws the dots`);
  }
  if (p[i] && has(p[i], 'reviews-actions')) {
    const a = p[i++];
    need(a, 'the action', C.classes.actions, 'div'); mustHave(a, C.hooks.actions); onlyAttrs(a, { class: true }); noText(a);
    const ak = kids(a);
    if (ak.length !== 1 || !has(ak[0], 'action-button')) E(a, `${label(a)}: holds exactly one a.action-button`);
    else { R.actionButton(ak[0], { tones: ['inverse'] }); if (ak[0].attrs['data-tone'] !== 'inverse') E(ak[0], `${label(ak[0])}: on the dark section the button is the white one, data-tone="inverse"`); }
  }
  p.slice(i).forEach(x => E(x, `${label(x)}: not part of the section (order: the head's row, the rail, the dots' holder, one optional div.reviews-actions)`));
}

function validate(root, ctx) {
  const R = rules('Reviews', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'reviews-section')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) {
    checkReviews(r.el, R);
    let k = 0; walk(r.el, n => { if (has(n, 'review-card')) k++; });
    r.count = k; r.note = r.el.attrs['data-layout'] || '';
  }
  return { found, sealed: R.sealed };
}

/* the catalogue snippets the self-test edits: [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'reviews-carousel.html';
const GRID = 'reviews-grid.html';
const firstCard = /\s*<div class="reviews-item">[\s\S]*?<\/figure>\s*<\/div>/;
const BAD = [
  ['a utility added to a quote', h => h.replace('class="review-quote"', 'class="review-quote text-white"')],
  ['an unknown layout', h => h.replace('data-layout="carousel"', 'data-layout="masonry"')],
  ['the carousel on the tint section', h => h.replace(' data-surface="dark"', ' data-bg="tint"')],
  ['the carousel\'s hook removed from the section', h => h.replace(/ data-carousel>/, '>')],
  ['the track\'s hook removed', h => h.replace('<div data-carousel-track class="reviews-track"', '<div class="reviews-track"')],
  ['an arrow removed', h => h.replace(/\s*<button type="button" data-carousel-next[\s\S]*?<\/button>/, '')],
  ['an arrow without its label', h => h.replace(/(<button type="button" data-carousel-prev) aria-label="[^"]*"/, '$1')],
  ['the dots\' holder removed', h => h.replace(/\s*<div data-carousel-dots[^>]*><\/div>/, '')],
  ['dots written by hand', h => h.replace(/(<div data-carousel-dots[^>]*>)(<\/div>)/, '$1<button type="button" class="rev-dot on"></button>$2')],
  ['the ground removed', h => h.replace(/\s*<div class="reviews-bg">[\s\S]*?<\/div>\s*<\/div>/, '')],
  ['a card without its quote', h => h.replace(/\s*<blockquote class="review-quote">[\s\S]*?<\/blockquote>/, '')],
  ['an empty quote', h => h.replace(/(<blockquote class="review-quote">)[\s\S]*?(<\/blockquote>)/, '$1$2')],
  ['a card without its author', h => h.replace(/\s*<span class="review-author">[^<]*<\/span>/, '')],
  ['a card without its platform', h => h.replace(/\s*<span class="review-source-name">[^<]*<\/span>/, '')],
  ['emphasis added inside a quote', h => h.replace(/(<blockquote class="review-quote">)([^<.]*)/, '$1<strong>$2</strong>')],
  ['a link inside a quote', h => h.replace(/(<blockquote class="review-quote">)([^<.]*)/, '$1<a href="https://example.com/">$2</a>')],
  ['a rating that is not a review\'s (4.7)', h => h.replace(/data-rating="[\d.]+"/, 'data-rating="4.7"')],
  ['a rating without its value', h => h.replace(/(<span class="review-rating") data-rating="[\d.]+"/, '$1')],
  ['a word as the rating\'s figure', h => h.replace(/(<span class="review-rating-value">)[^<]*/, '$1Excellent')],
  ['the stars lit by an inline style', h => h.replace('<span class="review-stars-lit">', '<span class="review-stars-lit" style="width:100%">')],
  ['four stars in a row', h => h.replace(/(<span class="review-stars-base">)<svg[\s\S]*?<\/svg>/, '$1')],
  ['the stars removed from a rating', h => h.replace(/\s*<span class="review-stars"[\s\S]*?<\/span>\s*<\/span>\s*<\/span>/, '')],
  ['a card outside its item', h => h.replace(/<div class="reviews-item">\s*(<figure class="review-card">[\s\S]*?<\/figure>)\s*<\/div>/, '$1')],
  ['a heading inside a card', h => h.replace(/(<blockquote class="review-quote">)/, '<h3>Great tool</h3>\n$1')],
  ['a javascript: link to the source', h => h.replace(/(<a href=")[^"]*(" rel="nofollow noopener" class="review-link">)/, '$1javascript:void(0)$2')],
  ['a single review', h => { let o = h; for (let n = 0; n < 14 && (o.match(/<div class="reviews-item">/g) || []).length > 1; n++) o = o.replace(firstCard, ''); return o; }],
  ['the dark button under the rail', h => h.replace(/(class="action-button btn-press group") data-tone="inverse"/, '$1')],
  ['a <script> in the section', h => h.replace('<div class="reviews-inner">', '<div class="reviews-inner"><script>alert(1)</script>')],
  ['grid: on the dark section', h => h.replace(' data-bg="tint"', ' data-surface="dark"'), GRID],
  ['grid: the stagger hook removed', h => h.replace('class="reviews-grid rv-kids"', 'class="reviews-grid"'), GRID],
  ['grid: a button under the cards', h => h.replace(/(\n  <\/div>\n<\/section>)/, '\n    <div class="reviews-actions rv"><a href="#x" class="action-button btn-press group" data-tone="inverse">More<span class="action-button-orb icon-orb"><svg></svg></span></a></div>$1'), GRID],
  ['grid: an unknown language code', h => h.replace(' lang="en"', ' lang="english"'), GRID],
  ['grid: the head removed', h => h.replace(/\s*<div class="section-head rv"[\s\S]*?\n    <\/div>/, ''), GRID],
];
const GOOD = [
  ['a new title, the pill removed', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1What our users say').replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '')],
  ['a review removed', h => h.replace(firstCard, '')],
  ['a review copied', h => { const m = h.match(firstCard)[0]; return h.replace(firstCard, m + m); }],
  ['another real review in a card: quote, name, rating, all in step', h => h.replace(/(<blockquote class="review-quote">)[^<]*/, '$1It is very helpful in-depth research for bloggers and content writers.').replace(/(<span class="review-author">)[^<]*/, '$1Sukhpreet K.').replace(/data-rating="[\d.]+"/, 'data-rating="4.5"').replace(/aria-label="[\d.]+ out of 5"/, 'aria-label="4.5 out of 5"').replace(/(<span class="review-rating-value">)[^<]*/, '$14.5')],
  ['a rating changed in data-rating alone (a warning: the script repairs the rest)', h => h.replace(/data-rating="[\d.]+"/, 'data-rating="3.5"')],
  ['a review without a rating', h => h.replace(/\s*<span class="review-rating"[\s\S]*?<span class="review-rating-value">[^<]*<\/span>\s*<\/span>/, '')],
  ['a review without the platform\'s mark and without its link', h => h.replace(/\s*<img class="review-source-mark"[^>]*>/, '').replace(/\s*<a href="[^"]*" rel="nofollow noopener" class="review-link">[^<]*<\/a>/, '')],
  ['the link to the source edited', h => h.replace(/<a href="[^"]*" rel="nofollow noopener" class="review-link">[^<]*/, '<a href="https://www.trustpilot.com/reviews/abc" target="_blank" rel="nofollow noopener" class="review-link">Read the review')],
  ['the quotes\' language marked, the words of the rail translated', h => h.replace('<div data-carousel-track class="reviews-track"', '<div data-carousel-track class="reviews-track" lang="en"').replace(/aria-label="Previous reviews"/, 'aria-label="Попередні відгуки"').replace(/data-dot-label="[^"]*"/, 'data-dot-label="Сторінка відгуків"')],
  ['the button under the rail removed, the standard dark head, an id', h => h.replace(/\s*<div class="reviews-actions rv">[\s\S]*?<\/a>\s*<\/div>/, '').replace(' data-tone="quiet"', '').replace(/(<section) id="[^"]*"/, '$1 id="reviews"')],
  ['a line break in a quote', h => h.replace(/(<blockquote class="review-quote">[^<.]*\.)/, '$1<br>')],
  ['grid: six reviews, the reveal beat removed', h => { const m = h.match(/(\s*<div class="reviews-item">[\s\S]*<\/figure>\s*<\/div>)(?=\n    <\/div>\n  <\/div>\n<\/section>)/)[1]; return h.replace(m, m + m).replace(' data-stagger=".06"', ''); }, GRID],
  ['grid: a pill and an intro added, another head width', h => h.replace(/(<div class="section-head rv")[^>]*>/, '$1 data-measure="760">\n      <div class="section-eyebrow">\n        <span class="section-eyebrow-dot"></span>\n        <span class="section-eyebrow-label">Reviews</span>\n      </div>').replace(/(<\/h2>)/, '$1\n      <p class="section-intro">Quoted as their authors published them.</p>'), GRID],
  ['grid: four reviews (a warning: the last row is not full)', h => { const m = h.match(firstCard)[0]; return h.replace(firstCard, m + m); }, GRID],
];

const PARTS = new Set([...Object.values(C.classes).flat().filter(c => /^reviews?-/.test(c)), 'review-stars-base', 'review-stars-lit', 'review-stars-row']);

module.exports = {
  name: 'reviews', title: 'Reviews', unit: 'reviews',
  validate,
  isPart: n => cls(n).some(c => PARTS.has(c)),
  outside: 'a Reviews part outside a complete section (section.reviews-section)',
  mentions: html => /class="reviews-section"|\breview-card\b/.test(html),
  SNIPPET, BAD, GOOD,
};
