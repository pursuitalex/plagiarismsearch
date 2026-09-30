/* Figures that count up (Why Us, the tools' stats). A [data-count] element shows its
   final value in the HTML (data-count, data-suffix, data-decimals), so a reader without
   JS or motion sees the number. While motion runs, it is set to zero and counts up when
   scrolled to — 1.6s, as approved — with cached writes; a figure the page can never
   scroll to counts at the end (the motion module's rescue). */
PS.module('count-up', () => {
  if (!document.documentElement.classList.contains('js-motion') || !window.gsap || !window.ScrollTrigger) return;
  document.querySelectorAll('[data-count]').forEach(el => {
    if (el.dataset.countReady) return;
    el.dataset.countReady = '1';
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dp = parseInt(el.dataset.decimals, 10) || 0;   /* ratings need one decimal */
    const obj = { v: 0 };
    let lastText = '';
    el.textContent = (0).toFixed(dp) + suffix;
    const tween = gsap.to(obj, {
      v: target, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: () => {
        const text = obj.v.toFixed(dp) + suffix;
        if (text !== lastText) { lastText = text; el.textContent = text; }
      },
    });
    if (PS.track) PS.track(tween);
  });
});
