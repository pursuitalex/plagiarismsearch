/* site.js — built by build/assets.js from build/assets/js/. Do not edit here. */
(() => {
'use strict';

/* ── 00-core.js ── */
/* site.js — the shared behaviour, built by build/assets.js from build/assets/js/*.js.

   One file in production, one module per component in source. Each module registers an
   init; every init finds its own instances by a data-* hook and wires each one on its
   own, so a section works wherever it is pasted and two of the same on one page do not
   share state. Nothing here looks an element up by a page id.

   The inits run in file order, each in its own try/catch: one component failing leaves
   the others working. When all have run, PS_READY tells the boot snippet in <head> that
   the enhancements arrived — if it never hears that, it takes .js and .js-motion off
   <html> and the page falls back to its static, fully visible state. */
const PS = (window.PS = window.PS || {});
const queue = [];
PS.module = (name, init) => { queue.push([name, init]); };
PS.start = () => {
  for (const [name, init] of queue) {
    try { init(); }
    catch (err) {
      console.error('[site.js] ' + name + ' failed', err);
      /* a reveal that never runs must not leave content invisible */
      if (name === 'motion') document.documentElement.classList.remove('js-motion');
    }
  }
  window.PS_READY = true;
};

/* ── 10-header.js ── */
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

/* ── 20-motion.js ── */
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

/* ── 30-checker.js ── */
/* The quick-check form. Each [data-checker] is wired on its own: its word count, its two
   switches. Hooks, not ids — [data-checker-text], [data-checker-count], [data-switch] —
   so two forms on one page never read each other's field. The label/textarea id pair is
   written by the template (build/checker.js), namespaced per instance, and JS does not
   touch it. */
PS.module('checker', () => {
  document.querySelectorAll('[data-checker]').forEach(form => {
    if (form.dataset.checkerReady) return;
    form.dataset.checkerReady = '1';

    const ta = form.querySelector('[data-checker-text]');
    const wc = form.querySelector('[data-checker-count]');
    if (ta && wc) {
      ta.addEventListener('input', () => {
        const w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
        wc.textContent = w;
        wc.style.color = w > 150 ? '#B84431' : '';
      });
    }

    /* each switch drives the checkbox in its own label */
    form.querySelectorAll('[data-switch]').forEach(sw => {
      const input = sw.closest('label') && sw.closest('label').querySelector('input');
      if (!input) return;
      input.addEventListener('change', () => sw.classList.toggle('on', input.checked));
    });
  });

  /* "Return to / focus the real checker": any in-page link whose target is, or holds, a
     checker puts the caret in that checker's field once the scroll has landed. It follows
     the link's own target, so it works for whatever id the section carries. */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    const target = id && document.getElementById(id);
    if (!target) return;
    const form = target.matches('[data-checker]') ? target : target.querySelector('[data-checker]');
    const ta = form && form.querySelector('[data-checker-text]');
    if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 400);
  });
});

/* ── 40-report.js ── */
/* The report. Selecting a passage highlights it and its source — within one
   [data-report] only, so two reports on a page select independently. */
PS.module('report', () => {
  document.querySelectorAll('[data-report]').forEach(report => {
    if (report.dataset.reportReady) return;
    report.dataset.reportReady = '1';

    const marks = [...report.querySelectorAll('.cab-mark')];
    const sources = [...report.querySelectorAll('.cab-src')];
    const pick = i => {
      marks.forEach(m => m.classList.toggle('on', m.dataset.match === String(i)));
      sources.forEach(s => s.classList.toggle('on', s.dataset.src === String(i)));
    };
    marks.forEach(m => {
      m.addEventListener('click', () => pick(m.dataset.match));
      m.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(m.dataset.match); }
      });
    });
    if (marks.length) pick(marks[0].dataset.match);
  });
});

/* ── 50-faq.js ── */
/* FAQ accordion. The answers are already in the HTML; this only opens and closes them,
   one list at a time — each [data-faq] is its own accordion. The question/answer id
   pairs (aria-controls) are written by the template, not here. */
PS.module('faq', () => {
  document.querySelectorAll('[data-faq]').forEach(list => {
    if (list.dataset.faqReady) return;
    list.dataset.faqReady = '1';

    list.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        list.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
        list.querySelectorAll('.faq-q').forEach(b =>
          b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open'))));
      });
    });
  });
});

PS.start();
})();
