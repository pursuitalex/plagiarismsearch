/* Show more (Reviews). In each [data-show-more="<n>"] the button [data-show-more-btn]
   shows the next n cards marked .more-later, in their own order, and steps aside when
   none are left. Focus moves to the first card it showed, so a keyboard reader lands
   on the new content rather than on a button that has just moved down the page. The
   cards are all in the HTML; CSS hides the later ones only while this can show them. */
PS.module('show-more', () => {
  document.querySelectorAll('[data-show-more]').forEach(root => {
    if (root.dataset.showMoreReady) return;
    const btn = root.querySelector('[data-show-more-btn]');
    if (!btn) return;
    root.dataset.showMoreReady = '1';
    const step = +root.dataset.showMore || 9;
    if (!root.querySelector('.more-later')) { btn.hidden = true; return; }

    btn.addEventListener('click', () => {
      const later = [...root.querySelectorAll('.more-later')];
      const batch = later.slice(0, step);
      batch.forEach(el => el.classList.remove('more-later'));
      if (batch[0]) {
        batch[0].setAttribute('tabindex', '-1');
        batch[0].focus({ preventScroll: true });
      }
      if (later.length <= step) btn.hidden = true;
    });
  });
});
