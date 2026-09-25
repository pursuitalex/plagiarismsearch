/* Motion — the reveals, the pen mark, the ring mark. Carried over from the pages'
   inline scripts, unchanged in timing and easing.

   It runs only while <html> has .js-motion (set by the boot snippet when motion is
   allowed). If GSAP did not arrive, it takes .js-motion away, and CSS shows every
   element in its final state — nothing waits on an animation that will never play.

   Every scroll trigger is clamp()ed (GSAP 3.12): a trigger point the page can never
   scroll to — the last lines of a section that ends the page, with no footer after
   it — fires at the end of the scroll instead of never. Where the point is reachable,
   which is everywhere on the approved pages, nothing changes. Found by the reuse test:
   the CTA band pasted last into an empty page kept its button invisible. */
PS.module('motion', () => {
  const root = document.documentElement;
  if (!root.classList.contains('js-motion')) return;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove('js-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'clamp(top 70%)' } });
  });

  /* a group deals its children in one after another; data-stagger overrides the
     default where a page was approved with a different beat */
  gsap.utils.toArray('.rv-kids').forEach(group => {
    const stagger = group.dataset.stagger ? +group.dataset.stagger : .08;
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger,
      scrollTrigger: { trigger: group, start: 'clamp(top 80%)' } });
  });

  /* pen mark — the word turns coral and the line draws under it */
  gsap.utils.toArray('.pen-word').forEach(word => {
    const line = word.querySelector('.pen-underline');
    if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    const inFirstView = word.getBoundingClientRect().top < innerHeight * .9;
    const tl = gsap.timeline(inFirstView
      ? { delay: 1 }
      : { scrollTrigger: { trigger: word, start: 'clamp(top 80%)', once: true } });
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
    gsap.timeline({ scrollTrigger: { trigger: word, start: 'clamp(top 75%)', once: true } })
      .to(word, { color: '#DC5A45', duration: .4, ease: 'power2.out' })
      .set(path, { opacity: 1 }, .15)
      .to(path, { strokeDashoffset: 0, duration: .9, ease: 'power2.inOut' }, .15);
  });
});
