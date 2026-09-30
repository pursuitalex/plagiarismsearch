/* The hero title (homepage). In each [data-hero-title] the words (.hw > .hw-in) rise out
   of their clips one after another, the section's [data-hero-support] line follows them
   up, and the title's pen mark draws last — the mark you make after the words are
   written. Timings verbatim.

   from(), so the markup carries the finished heading: with no GSAP, a failed script or
   reduced motion (no .js-motion) the H1 is simply there. It is the page's H1; it does
   not get to depend on a script. */
PS.module('hero-title', () => {
  if (!document.documentElement.classList.contains('js-motion') || !window.gsap) return;
  document.querySelectorAll('[data-hero-title]').forEach(title => {
    if (title.dataset.heroTitleReady) return;
    title.dataset.heroTitleReady = '1';
    const words = [...title.querySelectorAll('.hw-in')];
    if (!words.length) return;
    const support = (title.closest('section') || document).querySelector('[data-hero-support]');
    const word = title.querySelector('.pen-word');
    const line = title.querySelector('.pen-underline');

    const tl = gsap.timeline({ delay: .15 });
    /* 128, not 115: yPercent is a share of the word, and the clip box is taller than the
       word by the descender padding — 1.30em of box against 1.08em of word */
    tl.from(words, { yPercent: 128, duration: 1, ease: 'power3.out', stagger: .09, clearProps: 'transform' }, 0);
    /* 14px, not 40: a support line under a heading moves on the in-block scale */
    if (support) tl.from(support, { opacity: 0, y: 14, duration: .7, ease: 'power2.out', clearProps: 'transform' }, .4);
    if (word && line) {
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(word, { color: '#DC5A45', duration: .45, ease: 'power2.out' }, 1.05)
        .set(line, { opacity: 1 }, 1.25)
        .to(line, { strokeDashoffset: 0, duration: .75, ease: 'power2.inOut' }, 1.25);
    }
  });
});
