/* A box that scrolls inside the page ([data-scroll-fade="y" | "x"], 32-scroll-fade.css).
   Marks the box with .can-more while there is content past its far edge and .can-back
   while there is content before its near edge; the CSS fades the content out on those
   edges. Re-read on scroll, on resize of the box and of its content. */
PS.module('scroll-fade', () => {
  const boxes = [...document.querySelectorAll('[data-scroll-fade]')];
  if (!boxes.length) return;
  const update = el => {
    const x = el.dataset.scrollFade === 'x';
    const pos = Math.abs(x ? el.scrollLeft : el.scrollTop);
    const max = x ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    el.classList.toggle('can-back', pos > 1);
    el.classList.toggle('can-more', pos < max - 1);
  };
  const ro = 'ResizeObserver' in window ? new ResizeObserver(entries => entries.forEach(e => update(e.target.closest('[data-scroll-fade]')))) : null;
  boxes.forEach(el => {
    if (el.dataset.scrollFadeReady) return;
    el.dataset.scrollFadeReady = '1';
    el.addEventListener('scroll', () => update(el), { passive: true });
    if (ro) { ro.observe(el); [...el.children].forEach(c => ro.observe(c)); }
    update(el);
  });
  window.addEventListener('load', () => boxes.forEach(update));
});
