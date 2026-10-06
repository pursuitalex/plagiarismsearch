/* The preview of a long review (build/review-clip.js). Each [data-review-clip] holds the
   review's text (.rc-text, capped by CSS at about nine lines) and a hidden button
   [data-review-more]. A text that runs well past the cap gets the fade and the button
   ("Read more" opens it in place, "Show less" closes it); a text that would lose only a
   line or two is shown whole instead. Cards behind "Show more" are measured when they
   appear, and every text again when its width changes. */
PS.module('review-clip', () => {
  const SLACK = 52;   /* px: about two lines — not worth a button */
  const measure = clip => {
    if (!clip || clip.classList.contains('is-open')) return;
    const text = clip.querySelector('.rc-text'), btn = clip.querySelector('[data-review-more]');
    if (!text || !btn) return;
    clip.classList.remove('is-fit');
    if (!text.clientHeight) return;   /* not shown yet */
    const over = text.scrollHeight - text.clientHeight;
    const long = over > SLACK;
    clip.classList.toggle('is-long', long);
    clip.classList.toggle('is-fit', !long && over > 0);
    btn.hidden = !long;
  };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(entries => entries.forEach(e => measure(e.target.closest('[data-review-clip]')))) : null;

  const clips = [...document.querySelectorAll('[data-review-clip]')];
  clips.forEach(clip => {
    if (clip.dataset.reviewClipReady) return;
    const text = clip.querySelector('.rc-text'), btn = clip.querySelector('[data-review-more]');
    if (!text || !btn) return;
    clip.dataset.reviewClipReady = '1';
    btn.addEventListener('click', () => {
      const open = clip.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? btn.dataset.less : btn.dataset.more;
      if (!open) measure(clip);
    });
    if (ro) ro.observe(text); else measure(clip);
  });
  if (clips.length) window.addEventListener('load', () => clips.forEach(measure));
});
