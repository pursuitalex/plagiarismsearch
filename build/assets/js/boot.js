/* The boot snippet — the one inline script a page carries, in <head>, before the first
   paint. It is inlined rather than linked because it must run before anything renders:
   a linked file would either block rendering or arrive after the content had already
   been painted in its final state and then hidden (a flash).

   .js        → scripts run: the FAQ may collapse, the report may select
   .js-motion → and the reader has not asked for reduced motion: reveals start hidden
   Fail-safe: if site.js has not reported in (PS_READY) within 3.5s — blocked, offline,
   an error before it finished — both classes come off and the page shows its static,
   complete state. build/assets.js inlines this file, minus comments. */
(function (h) {
  h.classList.add('js');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) h.classList.add('js-motion');
  setTimeout(function () { if (!window.PS_READY) h.classList.remove('js', 'js-motion'); }, 3500);
})(document.documentElement);
