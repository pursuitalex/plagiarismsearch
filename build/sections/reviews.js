/* Reviews — library component. One template for the section that quotes customers:
   a head and a set of review cards, as a rail that pages or as a grid.

   CSS  build/sections/reviews.css (compiled into tailwind.css, see section-head.css)
   JS   build/assets/js/45-carousel.js ([data-carousel]: the rail's arrows and dots),
        44-review-rating.js (keeps a rating's figure and its label in step with
        data-rating), 20-motion.js (.rv, .rv-kids)
   Contract + validator  build/sections/reviews.contract.js, reviews.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const reviews = require('./sections/reviews');
     reviews.section({
       id: 'reviews',                          // optional anchor
       layout: 'grid',                         // 'carousel' (dark) | 'grid' (tint)
       space: 'md',                            // the page's rhythm: 'md' | 'lg'
       head: { eyebrow, title, intro, measure: '860' },
       lang: 'en',                             // the quotes' language, where the page's differs
       items: [{ quote, author, rating, source: { name, mark, url, linkLabel } }],
     })

   A REVIEW IS A QUOTATION. The quote, the author and the rating are a real person's, word
   for word (build/reviews.js holds the ones read off the platforms; card() there turns an
   entry into an item). The template writes them as given and never composes one.

   Layouts
     carousel   the homepage: a rail of cards on the dark section, paged by arrows and dots.
                tone: 'quiet' (the homepage's dark act); action: { label, href } — the
                white button under the rail; words: { prev, next, page } — the labels a
                screen reader hears (defaults in English)
     grid       the Ukrainian page: three cards across on the tint section.
                stagger: '.06' — the cards' reveal beat

   rating: a number from 1 to 5 in halves, or none (the card then has no stars).
   Every external href gets rel="nofollow noopener" in a card (the platforms' own pages)
   and rel="noopener" on the button. The text is written as given: escape it first if it
   is not already HTML. */
const sh = require('./section-head');
const action = require('./action');

/* the variant values are the contract's */
const C = require('./reviews.contract');
const V = C.variants;

const need = (cond, msg) => { if (!cond) throw new Error('reviews: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value ? ` ${name}="${value}"` : '');

const STAR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 2.9 6.26 6.6.83-4.9 4.6 1.3 6.31L12 16.9 6.1 20l1.3-6.31L2.5 9.09l6.6-.83z"/></svg>';
const CHEVRON = d => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

/* ── the rating: one attribute lights the stars; the figure and the label repeat it ── */
function rating(value) {
  const key = String(value);
  need(C.RATINGS.includes(key), `rating must be one of ${C.RATINGS.join(', ')} (or none): ${value}`);
  return `<span class="review-rating" data-rating="${key}">
  <span class="review-stars" role="img" aria-label="${key} out of 5">
    <span class="review-stars-base">${STAR.repeat(5)}</span>
    <span class="review-stars-lit"><span class="review-stars-row">${STAR.repeat(5)}</span></span>
  </span>
  <span class="review-rating-value">${Number(value).toFixed(1)}</span>
</span>`;
}

/* ── a card ───────────────────────────────────────────────────────────────────── */
function card(r) {
  need(r && r.quote && r.author, 'each review needs quote and author');
  const s = r.source;
  need(s && s.name, 'each review names its source: { name, mark, url, linkLabel }');
  need(!s.url || s.linkLabel, 'a source with a url needs linkLabel');
  const head = [];
  if (s.mark) head.push(`<img class="review-source-mark" src="${s.mark}" alt="" aria-hidden="true">`);
  head.push(`<span class="review-source-name">${s.name}</span>`);
  if (r.rating != null) head.push(rating(r.rating));
  return `<div class="reviews-item">
  <figure class="review-card">
    <div class="review-source">
${indent(head.join('\n'), '      ')}
    </div>
    <blockquote class="review-quote">${r.quote}</blockquote>
    <figcaption class="review-by">
      <span class="review-author">${r.author}</span>${s.url ? `
      <a href="${s.url}" rel="nofollow noopener" class="review-link">${s.linkLabel}</a>` : ''}
    </figcaption>
  </figure>
</div>`;
}

/* ── the section ───────────────────────────────────────────────────────────── */
function section(o) {
  need(o && o.head && o.head.title, 'head: { title } is required');
  need(V.section['data-layout'].values.includes(o.layout), 'layout must be one of ' + V.section['data-layout'].values.join(', '));
  need(V.section['data-space'].values.includes(o.space), 'space must be lg or md');
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  const carousel = o.layout === 'carousel';
  need(!o.tone || (o.tone === 'quiet' && carousel), 'tone must be quiet (or none), on the carousel');
  need(Array.isArray(o.items) && o.items.length >= 3, 'items: at least three reviews');
  need(carousel ? o.items.length <= 12 : [3, 6].includes(o.items.length), carousel ? 'carousel: twelve reviews at most' : 'grid: three reviews, or six');
  const { measure, ...h } = o.head;
  need(measure === undefined || V.head['data-measure'].values.includes(String(measure)), 'head.measure must be one of ' + V.head['data-measure'].values.join(', ') + ' (or none: 820)');
  const cards = o.items.map(card).join('\n');
  const parts = [];

  if (!carousel) {
    for (const k of ['action', 'words']) need(o[k] === undefined, `${k} belongs to layout: carousel`);
    need(!o.stagger || V.list['data-stagger'].values.includes(String(o.stagger)), 'stagger must be one of ' + V.list['data-stagger'].values.join(', '));
    parts.push(sh.block({ ...h, measure }));
    parts.push(`<div${attr('data-stagger', o.stagger)} class="reviews-grid rv-kids"${attr('lang', o.lang)}>
${indent(cards, '  ')}
</div>`);
    return `<section${attr('id', o.id)} data-component="reviews" class="reviews-section" data-layout="grid" data-bg="tint" data-space="${o.space}"${attr('data-accent', o.accent)}>
  <div class="reviews-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
  }

  need(o.stagger === undefined, 'stagger belongs to layout: grid');
  const w = { prev: 'Previous reviews', next: 'More reviews', page: 'Reviews page', ...(o.words || {}) };
  /* the head sits in the rail's top row: the row reveals, the head is its first column */
  parts.push(`<div class="reviews-top rv">
  <div class="section-head"${attr('data-measure', measure)}>
${sh.render(h, '    ')}
  </div>
</div>`);
  parts.push(`<div class="reviews-rail rv">
  <div data-carousel-track class="reviews-track"${attr('lang', o.lang)}>
${indent(cards, '    ')}
  </div>
  <button type="button" data-carousel-prev aria-label="${w.prev}" class="reviews-nav">
    ${CHEVRON('m15 18-6-6 6-6')}
  </button>
  <button type="button" data-carousel-next aria-label="${w.next}" class="reviews-nav">
    ${CHEVRON('m9 18 6-6-6-6')}
  </button>
</div>`);
  parts.push(`<div data-carousel-dots data-dot-label="${w.page}" class="reviews-dots"></div>`);
  if (o.action) parts.push(`<div class="reviews-actions rv">
${indent(action.button({ ...o.action, tone: 'inverse' }), '  ')}
</div>`);
  return `<section${attr('id', o.id)} data-component="reviews" class="reviews-section" data-layout="carousel" data-surface="dark" data-space="${o.space}"${attr('data-accent', o.accent)}${attr('data-tone', o.tone)} data-carousel>
  <div class="reviews-bg">
    <div class="orb reviews-glow"></div>
  </div>
  <div class="reviews-inner">
${indent(parts.join('\n'), '    ')}
  </div>
</section>`;
}

module.exports = { section, card };
