/* Motion — the reveals, the pen mark, the ring mark. Carried over from the pages'
   inline scripts, unchanged in timing, easing and trigger points.

   It runs only while <html> has .js-motion (set by the boot snippet when motion is
   allowed). If GSAP did not arrive, it takes .js-motion away, and CSS shows every
   element in its final state — nothing waits on an animation that will never play.

   The end of the page. A trigger point the page can never scroll to — the last lines
   of a section that ends a page with no footer after it, or any reveal on a page too
   short to scroll at all — would leave that content hidden for good. So every
   scroll-triggered animation is tracked, and once the page is scrolled to its end (or
   cannot scroll), whatever has not played yet plays. Reachable triggers fire exactly
   where they always did; only the unreachable ones are rescued. Found by the parity
   harness's reuse test (a section served alone). */
PS.module('motion', () => {
  const root = document.documentElement;
  if (!root.classList.contains('js-motion')) return;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const pending = [];
  const track = anim => { if (anim && anim.scrollTrigger) pending.push(anim); return anim; };
  /* other motion modules (the odometer, the report pass) hand their scroll-triggered
     animations to the same end-of-page rescue */
  PS.track = track;

  /* A block approved with its own beat says so on an ancestor: data-rv-start (where a
     reveal below the fold fires) and data-rv-delay (a fixed delay in the first view
     instead of the top-down cascade). The article template (the report guide) uses both. */
  const tune = el => el.closest('[data-rv-start], [data-rv-delay]');
  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    const t = tune(el);
    const delay = t && t.dataset.rvDelay !== undefined ? +t.dataset.rvDelay
      : .1 + (el.getBoundingClientRect().top / innerHeight) * .3;
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', delay });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    const t = tune(el);
    track(gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: (t && t.dataset.rvStart) || 'top 70%' } }));
  });

  /* a group deals its children in one after another; data-stagger overrides the
     default where a page was approved with a different beat */
  gsap.utils.toArray('.rv-kids').forEach(group => {
    const stagger = group.dataset.stagger ? +group.dataset.stagger : .08;
    track(gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger,
      scrollTrigger: { trigger: group, start: 'top 80%' } }));
  });

  /* pen mark — the word turns coral and the line draws under it. A hero title that
     rises word by word ([data-hero-title]) draws its own, on its own beat */
  gsap.utils.toArray('.pen-word').filter(w => !w.closest('[data-hero-title]')).forEach(word => {
    const line = word.querySelector('.pen-underline');
    if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    const inFirstView = word.getBoundingClientRect().top < innerHeight * .9;
    const tl = track(gsap.timeline(inFirstView
      ? { delay: 1 }
      : { scrollTrigger: { trigger: word, start: 'top 80%', once: true } }));
    tl.to(word, { color: '#DC5A45', duration: .45, ease: 'power2.out' })
      .set(line, { opacity: 1 }, .35)
      .to(line, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, .35);
  });

  /* ring mark — the closing act loops a word instead of underlining it; it waits until
     the word is well inside the viewport */
  gsap.utils.toArray('.ring-word').forEach(word => {
    const path = word.querySelector('.ring-path');
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    track(gsap.timeline({ scrollTrigger: { trigger: word, start: 'top 75%', once: true } }))
      .to(word, { color: '#DC5A45', duration: .4, ease: 'power2.out' })
      .set(path, { opacity: 1 }, .15)
      .to(path, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, .15);
  });

  /* the end of the page: play whatever could not be reached */
  const atEnd = () => ScrollTrigger.maxScroll(window) - scrollY <= 2;
  const flush = () => {
    if (!atEnd()) return;
    for (const a of pending) if (a.progress() === 0 && !a.isActive()) a.play();
  };
  addEventListener('scroll', flush, { passive: true });
  ScrollTrigger.addEventListener('refresh', flush);
  addEventListener('load', flush);
  requestAnimationFrame(flush);
});
