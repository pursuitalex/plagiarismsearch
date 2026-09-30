/* The reviews carousel (homepage). Each [data-carousel] holds a [data-carousel-track]
   (its cards are the track's children), [data-carousel-prev] / [data-carousel-next] and
   an empty [data-carousel-dots] whose data-dot-label names a page ("Reviews page" →
   "Reviews page 2"), so the words stay in the HTML.

   Pages are measured, not assumed: the card count is not ours to fix, and the number
   visible changes with the breakpoint. Geometry, not clientWidth — the rail is
   full-bleed, so its box is the whole viewport while a page is the content zone; card
   positions are the truth at every breakpoint, whatever the track is padded by. The
   controls hide themselves when there is nothing to scroll. */
PS.module('carousel', () => {
  document.querySelectorAll('[data-carousel]').forEach(root => {
    if (root.dataset.carouselReady) return;
    const track = root.querySelector('[data-carousel-track]');
    const dots = root.querySelector('[data-carousel-dots]');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    if (!track || !dots || !prev || !next) return;
    root.dataset.carouselReady = '1';
    const label = dots.dataset.dotLabel || 'Page';

    const pad = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const cards = () => [...track.children];
    const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const perView = () => {
      const c = cards();
      if (!c.length) return 1;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const w = c[0].getBoundingClientRect().width;
      const view = track.clientWidth - pad() * 2;
      return Math.max(1, Math.round((view + gap) / (w + gap)));
    };
    const pages = () => Math.max(1, Math.ceil(cards().length / perView()));

    /* where the rail must sit for card i to rest on the content edge */
    const restFor = i => {
      const c = cards();
      const el = c[Math.min(i, c.length - 1)];
      const x = el.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      return Math.min(Math.max(0, x - pad()), maxScroll());
    };
    const goTo = p => track.scrollTo({ left: restFor(p * perView()), behavior: 'smooth' });

    /* the page whose resting position the rail is nearest to — the last page often
       cannot scroll all the way, so nearest beats dividing */
    const page = () => {
      const n = pages(), pv = perView();
      let best = 0, bestD = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(track.scrollLeft - restFor(i * pv));
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    };

    const build = () => {
      const n = pages();
      const scrollable = track.scrollWidth > track.clientWidth + 1;
      prev.hidden = next.hidden = !scrollable;
      dots.innerHTML = scrollable
        ? Array.from({ length: n }, (_, i) =>
            '<button type="button" class="rev-dot' + (i === page() ? ' on' : '') +
            '" data-page="' + i + '" aria-label="' + label + ' ' + (i + 1) + '"></button>').join('')
        : '';
    };
    const mark = () => {
      const cur = page();
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === cur));
    };

    const go = dir => goTo(Math.min(pages() - 1, Math.max(0, page() + dir)));
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    dots.addEventListener('click', e => {
      const b = e.target.closest('.rev-dot');
      if (b) goTo(+b.dataset.page);
    });
    track.addEventListener('scroll', mark, { passive: true });
    addEventListener('resize', build);
    build();
  });
});
