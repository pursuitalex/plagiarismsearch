/* The site header (docking on phones, the burger panel) and the back-to-top button.
   Shell, not sections: one each per page, found by data-* hooks. Behaviour carried over
   from the header's and footer's inline scripts and the page's burger script, unchanged. */
PS.module('header', () => {
  /* dock the phone header once the page scrolls */
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const dock = () => header.classList.toggle('is-docked', scrollY > 8);
    addEventListener('scroll', dock, { passive: true });
    dock();
  }

  /* the burger and its panel */
  const btn = document.querySelector('[data-nav-burger]');
  const panel = document.querySelector('[data-nav-panel]');
  if (btn && panel) {
    const setOpen = on => {
      btn.setAttribute('aria-expanded', String(on));
      panel.classList.toggle('open', on);
      btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
    panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    });
    addEventListener('resize', () => { if (innerWidth >= 1024) setOpen(false); });
  }

  /* back to top — shows once a screenful and a bit is behind you */
  const top = document.querySelector('[data-to-top]');
  if (top) {
    let ticking = false;
    const mark = () => {
      const past = scrollY > innerHeight * 1.2;
      top.classList.toggle('opacity-0', !past);
      top.classList.toggle('translate-y-3', !past);
      top.classList.toggle('pointer-events-none', !past);
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(mark); }
    }, { passive: true });
    addEventListener('resize', mark, { passive: true });
    mark();
    top.addEventListener('click', () => {
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
      /* send the keyboard back with the page, or the next Tab resumes at the footer */
      const first = document.querySelector('header a, header button');
      if (first) first.focus({ preventScroll: true });
    });
  }
});
