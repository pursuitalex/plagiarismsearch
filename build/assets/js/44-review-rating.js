/* A review's rating (the library's Reviews, build/sections/reviews.js).

   The rating is written once, as data-rating on span.review-rating — the stylesheet
   lights the stars from it (reviews.css). Two things repeat it for a reader: the figure
   beside the stars and the stars' aria-label. An editor who copies a card in the CMS and
   changes the rating has three places to change; this keeps the other two in step with
   the attribute, so nothing has to be kept in step by hand. A card written correctly is
   left exactly as it was.

     span.review-rating[data-rating="4.5"]
       span.review-stars[role="img"][aria-label="4.5 out of 5"]
       span.review-rating-value          "4.5"

   The words stay in the HTML: only the number at the head of the label is replaced. */
PS.module('review-rating', () => {
  document.querySelectorAll('.review-rating[data-rating]').forEach(el => {
    const n = parseFloat(el.dataset.rating);
    if (!(n >= 0 && n <= 5)) return;
    const value = el.querySelector('.review-rating-value');
    if (value && parseFloat(value.textContent) !== n) value.textContent = n.toFixed(1);
    const stars = el.querySelector('.review-stars');
    if (!stars) return;
    const label = stars.getAttribute('aria-label') || '';
    const said = parseFloat(label);
    if (!label) stars.setAttribute('aria-label', n + ' / 5');
    else if (said !== n) stars.setAttribute('aria-label', isNaN(said) ? n + ' / 5' : label.replace(/^\s*\d+(?:[.,]\d+)?/, String(n)));
  });
});
