/* Marquee (Reviews v2). Without this script the rows in a [data-marquee] run by CSS
   alone (28-testimonials.css) and stop under the pointer. With it, the module drives
   them, so it can do what CSS cannot:

   - SLOW, not stop, under the pointer or focus (Olex, 2026-09-30): the speed eases down
     to a fifth and back up;
   - the pause button [data-marquee-toggle] stops every row (aria-pressed, two icons);
   - the full review as a popup ([data-marquee-pop]) zoomed out of the card: a clone of
     the card, whole, fixed over the row and following the card as it drifts. It opens on
     hover, on keyboard focus of a card, and on a tap; it closes when the pointer leaves
     both, on blur, on Escape and on a tap elsewhere. It is aria-hidden: the card it
     copies already holds the whole review in the HTML (only the clip is visual);
   - under reduced motion nothing moves (the CSS makes the rows scroll by hand) and the
     popup appears without the zoom.

   A row's track holds two equal groups, the real cards and an aria-hidden copy, so
   moving by exactly one group's width loops without a seam. Rows run only while the
   section is on screen. */
PS.module('marquee', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-marquee]').forEach(root => {
    if (root.dataset.marqueeReady) return;
    root.dataset.marqueeReady = '1';

    /* ── the rows ─────────────────────────────────────────────────────────────── */
    const SPEED = 40;                       /* px per second, the CSS rows' pace */
    const SLOW = 0.2;
    const rows = [...root.querySelectorAll('.mq')].map(mq => {
      const track = mq.querySelector('.mq-track');
      return { mq, track, right: track.classList.contains('is-right'), x: 0, half: 0, speed: 1, want: 1, hover: false };
    });
    let paused = false, visible = true, last = 0, raf = 0;
    const measure = () => rows.forEach(r => {
      const g = r.track.querySelector('.mq-group');
      r.half = g ? g.getBoundingClientRect().width : 0;
      if (r.right && r.x === 0) r.x = -r.half;
    });
    const place = r => { r.track.style.transform = 'translate3d(' + r.x.toFixed(2) + 'px,0,0)'; };

    const tick = t => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      rows.forEach(r => {
        r.want = paused ? 0 : (r.hover ? SLOW : 1);
        r.speed += (r.want - r.speed) * Math.min(1, dt * 6);        /* ease toward the target */
        if (!r.half) return;
        r.x += (r.right ? 1 : -1) * SPEED * r.speed * dt;
        if (!r.right && r.x <= -r.half) r.x += r.half;
        if (r.right && r.x >= 0) r.x -= r.half;
        place(r);
      });
      followPop();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const start = () => { if (!raf && !reduce.matches) { last = 0; raf = requestAnimationFrame(tick); } };

    if (!reduce.matches) {
      root.classList.add('is-driven');
      measure();
      rows.forEach(place);
      window.addEventListener('resize', () => { const old = rows.map(r => r.half); measure(); rows.forEach((r, i) => { if (old[i]) r.x = r.x / old[i] * r.half; }); });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) start(); }).observe(root);
      }
      start();
    }

    rows.forEach(r => {
      r.mq.addEventListener('mouseenter', () => { r.hover = true; });
      r.mq.addEventListener('mouseleave', e => { if (!(pop && pop.contains(e.relatedTarget))) r.hover = false; });
      /* only keyboard focus moves the row to the card: a tap focuses the card too, and
         moving it would slide it out from under the finger */
      r.mq.addEventListener('focusin', e => { r.hover = true; if (e.target.matches(':focus-visible')) bringIntoView(r, e.target); });
      r.mq.addEventListener('focusout', () => { r.hover = false; });
    });

    /* a focused card may sit outside the visible part of its row: move the row to it */
    const bringIntoView = (r, card) => {
      if (reduce.matches || !card.closest('.sc-card, [data-review]')) return;
      const box = r.mq.getBoundingClientRect(), c = card.getBoundingClientRect(), pad = 24;
      if (c.left < box.left + pad) r.x += (box.left + pad) - c.left;
      else if (c.right > box.right - pad) r.x -= c.right - (box.right - pad);
      place(r);
    };

    /* ── the pause button ─────────────────────────────────────────────────────── */
    const btn = root.querySelector('[data-marquee-toggle]');
    if (btn && !reduce.matches) {
      btn.hidden = false;
      btn.addEventListener('click', () => {
        paused = !paused;
        root.classList.toggle('is-paused', paused);
        btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        btn.querySelector('[data-icon="pause"]')?.toggleAttribute('hidden', paused);
        btn.querySelector('[data-icon="play"]')?.toggleAttribute('hidden', !paused);
      });
    }

    /* ── the popup ────────────────────────────────────────────────────────────── */
    const pop = root.querySelector('[data-marquee-pop]');
    if (!pop) return;
    let card = null, timer = 0, openedAt = 0;
    const cardOf = el => el && el.closest && el.closest('.mq .sc-card');

    const layout = () => {
      if (!card) return;
      const c = card.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
      const w = Math.min(Math.max(c.width * 1.22, 400), vw - 24);
      let left = c.left + c.width / 2 - w / 2;
      left = Math.max(12, Math.min(left, vw - w - 12));
      pop.style.width = w + 'px';
      let top = c.top - 16;
      const h = pop.offsetHeight;
      if (top + h > vh - 12) top = Math.max(12, vh - 12 - h);
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
      /* zoom out of the card: from the card's size, around the card's own place */
      pop.style.setProperty('--s0', (c.width / w).toFixed(3));
      pop.style.setProperty('--ox', (c.left + c.width / 2 - left) + 'px');
      pop.style.setProperty('--oy', (c.top - top) + 'px');
    };
    function followPop() { if (card && pop.classList.contains('is-open')) layout(); }

    const open = el => {
      if (card === el) return;
      card = el;
      openedAt = Date.now();
      const clone = el.cloneNode(true);
      clone.removeAttribute('tabindex');
      clone.removeAttribute('data-review');
      clone.removeAttribute('data-review-copy');
      clone.querySelectorAll('h3').forEach(h => { const p = document.createElement('p'); p.className = h.className; p.innerHTML = h.innerHTML; h.replaceWith(p); });
      pop.replaceChildren(clone);
      pop.classList.remove('is-open');
      pop.hidden = false;
      layout();
      requestAnimationFrame(() => requestAnimationFrame(() => { if (card === el) pop.classList.add('is-open'); }));
      rows.forEach(r => { if (r.mq.contains(el)) r.hover = true; });
    };
    const close = () => {
      clearTimeout(timer);
      if (!card) return;
      card = null;
      pop.classList.remove('is-open');
      rows.forEach(r => { if (!r.mq.matches(':hover') && !r.mq.contains(document.activeElement)) r.hover = false; });
      setTimeout(() => { if (!card) pop.hidden = true; }, 180);
    };

    root.addEventListener('mouseover', e => {
      const el = cardOf(e.target);
      if (!el || el === card) return;
      clearTimeout(timer);
      timer = setTimeout(() => open(el), 120);
    });
    root.addEventListener('mouseout', e => {
      const to = e.relatedTarget;
      if (cardOf(e.target) && !cardOf(to) && !(to && pop.contains(to))) { clearTimeout(timer); if (card && !pop.matches(':hover')) close(); }
    });
    pop.addEventListener('mouseleave', e => { if (cardOf(e.relatedTarget) !== card) close(); });
    root.addEventListener('focusin', e => { const el = cardOf(e.target); if (el && el.matches(':focus-visible')) open(el); });
    root.addEventListener('focusout', e => { if (!cardOf(e.relatedTarget)) close(); });
    /* a tap focuses the card first (which opens it) and clicks it right after: that click
       must not close what the focus just opened */
    root.addEventListener('click', e => {
      const el = cardOf(e.target);
      if (!el) return;
      if (card !== el) open(el);
      else if (Date.now() - openedAt > 400) close();
    });
    document.addEventListener('click', e => { if (card && !cardOf(e.target) && !pop.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    window.addEventListener('scroll', () => { if (card) layout(); }, { passive: true });
    rows.forEach(r => r.mq.addEventListener('scroll', close, { passive: true }));   /* reduced motion: rows scroll by hand */
  });
});
