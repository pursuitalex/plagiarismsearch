/* The statistics roll like odometers (homepage): every digit of an .od-num spins up from
   zero and they land left to right into the figure.

   The reels are built here. The page ships plain text — approved copy that has to
   survive as a sentence for a crawler and a screen reader — an sr-only span keeps that
   sentence while the reels exist, and the plain text goes back the moment the roll
   lands, so the DOM ends exactly as served. Reels exist only while motion runs
   (.js-motion and GSAP): no script, no reels, the figure as written.

   Each reel is two cycles and rests one full cycle down, on a zero, so every reel
   travels at least a whole turn and a roll that never fires reads 000,000+ — pointing
   at the bug instead of passing for a working roll. In the first view the roll waits
   out the hero title (2s); below the fold it rolls when its section comes in. */
PS.module('odometer', () => {
  if (!document.documentElement.classList.contains('js-motion') || !window.gsap || !window.ScrollTrigger) return;
  const CELLS = 20, STEP = 100 / CELLS;
  const digitAt = (d, i) => ((d - i) % 10 + 10) % 10;
  const reelFor = d => Array.from({ length: CELLS }, (_, i) => '<span class="od-d">' + digitAt(d, i) + '</span>').join('');

  gsap.utils.toArray('.od-num').forEach(el => {
    if (el.dataset.odReady) return;
    const text = el.textContent.trim();
    if (!/\d/.test(text)) return;
    el.dataset.odReady = '1';

    const chars = [...text].map(ch => /\d/.test(ch)
      ? '<span class="od" data-d="' + ch + '"><span class="od-r">' + reelFor(+ch) + '</span></span>'
      : '<span class="od-s">' + ch + '</span>').join('');
    el.innerHTML = '<span class="sr-only">' + text + '</span><span aria-hidden="true">' + chars + '</span>';

    const reels = [...el.querySelectorAll('.od-r')];
    gsap.set(reels, { yPercent: (i, t) => -(10 + +t.parentElement.dataset.d) * STEP });

    let rolled = false;
    const roll = () => {
      if (rolled) return;
      rolled = true;
      gsap.to(reels, { yPercent: 0, duration: .9, ease: 'power2.out', stagger: .08,
        onComplete: () => { el.textContent = text; } });
    };

    if (el.getBoundingClientRect().top < innerHeight * .95) gsap.delayedCall(2, roll);
    else {
      const st = ScrollTrigger.create({ trigger: el.closest('section') || el, start: 'top 85%', once: true, onEnter: roll });
      /* a figure on a page too short to reach its trigger still rolls at the end */
      if (PS.track) PS.track({ scrollTrigger: st, progress: () => (rolled ? 1 : 0), isActive: () => false, play: roll });
    }
  });
});
