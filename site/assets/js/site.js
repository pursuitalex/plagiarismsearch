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

/* ── 22-hero-title.js ── */
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

/* ── 24-odometer.js ── */
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

/* ── 35-form-arrive.js ── */
/* Arriving at a form. A form marked data-focus-first="<ms>" takes the caret into its
   first field when an in-page link lands on it (or on the section that holds it), once
   the scroll has had <ms> to settle. It follows the link's own target, so it works under
   any id. (The checker has its own, 30-checker.js.) */
PS.module('form-arrive', () => {
  if (!document.querySelector('form[data-focus-first]')) return;
  const FIELD = 'input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select';
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    const target = id && document.getElementById(id);
    if (!target) return;
    const form = target.matches('form[data-focus-first]') ? target : target.querySelector('form[data-focus-first]');
    const field = form && form.querySelector(FIELD);
    if (field) setTimeout(() => field.focus({ preventScroll: true }), +form.dataset.focusFirst || 0);
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

/* ── 42-report-pass.js ── */
/* The pass (homepage report). In a [data-report] that has a [data-report-doc], a
   [data-report-side] and a [data-report-scan] line, the report plays once when it
   arrives, not on a scrub: this report is a finished document, and scrubbing it
   backwards would un-find the matches. Timings verbatim.

   Every value is already correct in the markup — bar widths, percentages, highlight
   colours. The timeline animates FROM zero to what is there, so reduced motion, a
   failed script or JS off (no .js-motion) show the finished report, not an empty one.

   Nothing inside a rounded clip gets a transform: Chrome drops the rounded clip on a
   transformed layer and the corners square off. So the sidebar rungs fade without
   lifting; the panels themselves may lift (an element's own radius survives its own
   transform), and clearProps releases the layer when each lands. */
PS.module('report-pass', () => {
  if (!document.documentElement.classList.contains('js-motion') || !window.gsap || !window.ScrollTrigger) return;
  document.querySelectorAll('[data-report]').forEach(report => {
    if (report.dataset.reportPassReady) return;
    const doc = report.querySelector('[data-report-doc]');
    const side = report.querySelector('[data-report-side]');
    const line = report.querySelector('[data-report-scan]');
    if (!doc || !side || !line) return;
    report.dataset.reportPassReady = '1';

    const marks = [...report.querySelectorAll('.cab-mark')];
    const ins = [...side.querySelectorAll('.cab-in')];
    const bars = [...report.querySelectorAll('.cab-bar')];
    const figures = [...report.querySelectorAll('.cab-figure')];

    const SCAN = .55;                 // the pass starts once both panels are down
    const PASS = 1.8;                 // how long the line takes to cross
    const FILL = SCAN + .15;          // the sidebar starts filling just behind the line
    const STEP = .115;                // paced so the last rung lands as the line leaves

    const tl = gsap.timeline({ scrollTrigger: { trigger: doc, start: 'top 72%', once: true } });
    if (PS.track) PS.track(tl);

    tl.from(doc,  { opacity: 0, y: 24, duration: .8, ease: 'power2.out', clearProps: 'transform' }, 0)
      .from(side, { opacity: 0, y: 24, duration: .8, ease: 'power2.out', clearProps: 'transform' }, .16);

    /* the line crosses the page */
    tl.set(line, { opacity: 1 }, SCAN)
      .fromTo(line, { top: -80 }, { top: () => doc.offsetHeight + 20, duration: PASS, ease: 'none' }, SCAN)
      .to(line, { opacity: 0, duration: .3 }, SCAN + PASS - .2);

    /* highlights land behind it, spread across the pass */
    marks.forEach((m, i) => {
      tl.from(m, { backgroundSize: '0% 100%', duration: .45, ease: 'power2.out' }, SCAN + .35 + i * .28);
    });

    /* the sidebar fills top to bottom while the line is still crossing, one rung per
       element in the panel's own order */
    const step = el => FILL + Math.max(0, ins.indexOf(el)) * STEP;
    tl.from(ins, { opacity: 0, duration: .5, ease: 'power2.out', stagger: STEP }, FILL);

    /* each bar runs out and its figure counts up as that row arrives, not before */
    const at = el => step(el) + .12;
    bars.forEach(b => tl.from(b, { width: 0, duration: .8, ease: 'power2.out' }, at(b.closest('.cab-in'))));
    figures.forEach(f => {
      const target = parseFloat(f.dataset.to);
      const suffix = f.textContent.trim().endsWith('%') ? '%' : '';
      const dp = String(target).includes('.') ? 1 : 0;
      const o = { v: 0 };
      let last = null;
      tl.to(o, { v: target, duration: .8, ease: 'power2.out',
        onUpdate: () => {
          const t = o.v.toFixed(dp) + suffix;
          if (t !== last) { last = t; f.textContent = t; }
        } }, at(f.closest('.cab-in')));
    });
  });
});

/* ── 45-carousel.js ── */
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

/* ── 47-news-archive.js ── */
/* The news archive (Newsroom). In each [data-archive] the topic chips (.tp-btn with
   data-topic) FILTER the items (.news-item, data-topic) and the pager pages the filtered
   set, twenty to a page. Neither ever moves an item, so what you read is always the
   archive in its own order. A year (.yr-group) whose items are all hidden steps aside.

   The words are the page's, in attributes: a year count's data-all / data-of, the
   pager count's data-format, the page buttons' data-page-label, the empty note's
   data-empty-text. Behaviour verbatim from the page's former inline script. */
PS.module('news-archive', () => {
  document.querySelectorAll('[data-archive]').forEach(root => {
    if (root.dataset.archiveReady) return;
    const pager = root.querySelector('[data-pager]');
    if (!pager) return;
    root.dataset.archiveReady = '1';

    const PER_PAGE = 20;
    const tabs = [...root.querySelectorAll('.tp-btn[data-topic]')];
    const groups = [...root.querySelectorAll('.yr-group')];
    const all = [...root.querySelectorAll('.news-item')];
    const empty = root.querySelector('[data-archive-empty]');
    const pagerCount = pager.querySelector('[data-pager-count]');
    const pageNums = pager.querySelector('[data-pager-nums]');
    const prev = pager.querySelector('[data-pager-prev]');
    const next = pager.querySelector('[data-pager-next]');
    const fill = (tpl, o) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

    let topic = 'all';
    let page = 1;

    const numbers = (current, total) => {
      /* 1 … c-1 c c+1 … n, without ever printing a gap that hides a single page */
      const want = new Set([1, total, current, current - 1, current + 1]);
      if (current <= 3) [2, 3, 4].forEach(n => want.add(n));
      if (current >= total - 2) [total - 1, total - 2, total - 3].forEach(n => want.add(n));
      const list = [...want].filter(n => n >= 1 && n <= total).sort((x, y) => x - y);
      const out = [];
      list.forEach((n, i) => {
        if (i && n - list[i - 1] > 1) out.push(n - list[i - 1] === 2 ? list[i - 1] + 1 : null);
        out.push(n);
      });
      return out;
    };

    const render = scroll => {
      const set = all.filter(el => topic === 'all' || el.dataset.topic === topic);
      const total = Math.max(1, Math.ceil(set.length / PER_PAGE));
      if (page > total) page = total;
      const from = (page - 1) * PER_PAGE;
      const shown = set.slice(from, from + PER_PAGE);
      const on = new Set(shown);

      all.forEach(el => { el.hidden = !on.has(el); });

      groups.forEach(g => {
        const n = [...g.querySelectorAll('.news-item')].filter(el => !el.hidden).length;
        g.hidden = n === 0;
        const c = g.querySelector('.yr-count');
        if (c) {
          const t = c.dataset.total;
          c.textContent = n === +t ? fill(c.dataset.all, { total: t }) : fill(c.dataset.of, { n, total: t });
        }
      });

      tabs.forEach(t => {
        const active = t.dataset.topic === topic;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      if (empty) {
        empty.hidden = set.length > 0;
        if (!set.length) empty.textContent = empty.dataset.emptyText;
      }

      pager.hidden = set.length <= PER_PAGE;
      pagerCount.textContent = set.length
        ? fill(pagerCount.dataset.format, { from: from + 1, to: from + shown.length, total: set.length })
        : '';
      prev.disabled = page === 1;
      next.disabled = page === total;

      pageNums.innerHTML = '';
      numbers(page, total).forEach(n => {
        if (n === null) {
          const s = document.createElement('span');
          s.className = 'pg-gap'; s.textContent = '…'; s.setAttribute('aria-hidden', 'true');
          pageNums.appendChild(s);
          return;
        }
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pg-num' + (n === page ? ' on' : '');
        b.textContent = n;
        b.setAttribute('aria-label', pageNums.dataset.pageLabel + ' ' + n);
        if (n === page) b.setAttribute('aria-current', 'page');
        b.addEventListener('click', () => { page = n; render(true); });
        pageNums.appendChild(b);
      });

      if (window.ScrollTrigger) ScrollTrigger.refresh();
      if (scroll) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    tabs.forEach(t => t.addEventListener('click', () => { topic = t.dataset.topic; page = 1; render(false); }));
    prev.addEventListener('click', () => { if (page > 1) { page--; render(true); } });
    next.addEventListener('click', () => { page++; render(true); });
    render(false);
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

/* ── 60-pricing.js ── */
/* The pricing periods. Each [data-pricing] section carries its plan data as a JSON island
   and its feature-line markup as a <template data-pricing-feat> (build/pricing.js); its
   cards already show the initial period, rendered from the same data and the same
   template. This only switches:
     .period-btn                 the tabs (data-period); aria-pressed kept in step if present
     [data-tier]                 a card: .js-price .js-term .js-rate .js-feats
     template[data-pricing-feat] in the card, else in the section: one feature line, {feat}
     [data-period-note]          optional: the period's note
     [data-period-only="…"]      optional: shown for that period only
     data-pricing-animate        on the section: the values fade up on a switch
   Values first, motion second — a price must never wait on an animation frame. */
PS.module('pricing', () => {
  document.querySelectorAll('[data-pricing]').forEach(root => {
    if (root.dataset.pricingReady) return;
    const island = root.querySelector('script[type="application/json"][data-pricing-data]');
    if (!island) return;
    root.dataset.pricingReady = '1';
    const PLANS = JSON.parse(island.textContent);
    const tabs = [...root.querySelectorAll('.period-btn')];
    const cards = [...root.querySelectorAll('[data-tier]')];
    const note = root.querySelector('[data-period-note]');
    const only = [...root.querySelectorAll('[data-period-only]')];
    const animate = root.hasAttribute('data-pricing-animate');
    const lineOf = el => {
      const t = el.querySelector('template[data-pricing-feat]') || root.querySelector(':scope > template[data-pricing-feat], template[data-pricing-feat]');
      return t ? t.innerHTML : '{feat}';
    };
    if (!tabs.length || !cards.length) return;

    const render = (key, fade) => {
      const period = PLANS[key];
      if (!period) return;
      tabs.forEach(b => {
        b.classList.toggle('active', b.dataset.period === key);
        if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(b.dataset.period === key));
      });
      if (note) note.textContent = period.note;
      only.forEach(el => { el.hidden = el.dataset.periodOnly !== key; });
      cards.forEach(card => {
        const tier = period[card.dataset.tier];
        if (!tier) return;
        const feats = card.querySelector('.js-feats');
        const line = lineOf(card);
        card.querySelector('.js-price').textContent = tier.price;
        card.querySelector('.js-term').textContent = period.term;
        card.querySelector('.js-rate').textContent = tier.rate;
        feats.innerHTML = tier.feats.map(f => line.split('{feat}').join(f)).join('');
        if (fade && animate && window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo([card.querySelector('.js-price'), card.querySelector('.js-rate'), feats],
            { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .28, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    };
    tabs.forEach(b => b.addEventListener('click', () => render(b.dataset.period, true)));
    render(root.dataset.pricing || 'onetime', false);
  });
});

/* ── 65-ai-package.js ── */
/* The AI package selector. In each [data-ai-package], the checked radio fills its row
   (.ai-opt.on) and names the allowance on the continuation button
   ([data-purchase-hook="ai-package"] .js-ai-words), stamping it on the button's data-ai-*
   attributes — the developer's binding point. The initial state is in the HTML already. */
PS.module('ai-package', () => {
  document.querySelectorAll('[data-ai-package]').forEach(root => {
    if (root.dataset.aiPackageReady) return;
    root.dataset.aiPackageReady = '1';
    const radios = [...root.querySelectorAll('input[type="radio"]')];
    const go = root.querySelector('[data-purchase-hook="ai-package"]');
    if (!radios.length || !go) return;
    const fmt = n => Number(n).toLocaleString('en-US');
    const sync = () => {
      const r = radios.find(x => x.checked) || radios[0];
      radios.forEach(x => x.closest('.ai-opt').classList.toggle('on', x === r));
      go.querySelector('.js-ai-words').textContent = fmt(r.value);
      go.dataset.aiWords = r.value;
      go.dataset.aiBilling = r.dataset.billing;
      go.dataset.aiPrice = r.dataset.price;
    };
    radios.forEach(x => x.addEventListener('change', sync));
    sync();
  });
});

/* ── 68-package-cta.js ── */
/* Package groups whose button names the package it buys (AI Detector pricing). Each
   [data-group] keeps its [data-cta] label in step with the checked radio: the words
   around the number come from the button's own data-prefix / data-suffix, so the copy
   stays in one place. Radio semantics come from the markup; nothing here interferes. */
PS.module('package-cta', () => {
  document.querySelectorAll('[data-group]').forEach(group => {
    if (group.dataset.groupReady) return;
    const cta = group.querySelector('[data-cta]');
    if (!cta) return;
    group.dataset.groupReady = '1';
    group.addEventListener('change', () => {
      const on = group.querySelector('input:checked');
      if (!on) return;
      cta.textContent = [cta.dataset.prefix, on.dataset.words, cta.dataset.suffix].join(' ');
    });
  });
});

/* ── 70-code.js ── */
/* The code block. Within each [data-code]: the language tabs (.code-tab, data-tab) show
   one panel (.code-panel, data-panel) — all panels are in the HTML — and the Copy button
   ([data-copy]) copies the open panel's code. The label exception the brief grants:
   exactly "Copy", on success "Copied". */
PS.module('code', () => {
  document.querySelectorAll('[data-code]').forEach(root => {
    if (root.dataset.codeReady) return;
    root.dataset.codeReady = '1';
    const tabs = [...root.querySelectorAll('.code-tab')];
    const panels = [...root.querySelectorAll('.code-panel')];
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.toggle('on', t === tab);
          t.setAttribute('aria-current', String(t === tab));
        });
        panels.forEach(p => p.classList.toggle('on', p.dataset.panel === tab.dataset.tab));
      });
    });
    const copy = root.querySelector('[data-copy]');
    if (copy) {
      copy.addEventListener('click', async () => {
        const open = root.querySelector('.code-panel.on code');
        if (!open) return;
        try { await navigator.clipboard.writeText(open.textContent); } catch (e) { return; }
        copy.textContent = 'Copied';
        setTimeout(() => { copy.textContent = 'Copy'; }, 1600);
      });
    }
  });
});

/* ── 75-ai-check.js ── */
/* The AI checker flow, as far as a prototype can honestly show it (AI Detector).
   In each form[data-ai-check]: under 100 characters the field objects inline, where the
   text is ([data-too-short]); at or above it the auth gate opens ([data-auth-gate]) —
   this prototype has no session, and the approved behaviour for a visitor without one is
   exactly that. What is entered is preserved: the gate opens beneath the text. */
PS.module('ai-check', () => {
  document.querySelectorAll('form[data-ai-check]').forEach(form => {
    if (form.dataset.aiCheckReady) return;
    form.dataset.aiCheckReady = '1';
    const field = form.querySelector('textarea');
    const tooShort = form.querySelector('[data-too-short]');
    const gate = form.querySelector('[data-auth-gate]');
    if (!field || !tooShort || !gate) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const short = field.value.trim().length < 100;
      tooShort.hidden = !short;
      gate.hidden = short;
      field.setAttribute('aria-invalid', String(short));
      (short ? field : gate.querySelector('a')).focus();
    });
    /* clear the objection as soon as the reason for it is gone */
    field.addEventListener('input', () => {
      if (!tooShort.hidden && field.value.trim().length >= 100) {
        tooShort.hidden = true;
        field.setAttribute('aria-invalid', 'false');
      }
    });
  });
});

/* ── 80-doc-nav.js ── */
/* The documentation navigation (Moodle Integration guide). Each [data-doc-nav] holds one
   or more navigations whose links carry data-spy="<section id>" — the rail from lg, the
   jump menu (details[data-jump]) under it. The spy marks the last navigated section
   whose top has passed the reading line, in every navigation at once, and writes its
   name into [data-jump-now]. Choosing a link, or Escape, closes the jump menu.
   The section ids are the page's anchors (the links' own hrefs), not script hooks. */
PS.module('doc-nav', () => {
  document.querySelectorAll('[data-doc-nav]').forEach(root => {
    if (root.dataset.docNavReady) return;
    root.dataset.docNavReady = '1';
    const links = [...root.querySelectorAll('[data-spy]')];
    const ids = [...new Set(links.map(a => a.dataset.spy))];
    const targets = ids.map(id => document.getElementById(id)).filter(Boolean);
    const now = root.querySelector('[data-jump-now]');
    const jump = root.querySelector('details[data-jump]');
    let current = null, ticking = false;
    const spy = () => {
      ticking = false;
      const line = innerWidth < 1024 ? 150 : 140;
      let hit = null;
      targets.forEach(t => { if (t.getBoundingClientRect().top <= line) hit = t.id; });
      if (hit === current) return;
      current = hit;
      links.forEach(a => {
        const on = a.dataset.spy === hit;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (now) { const a = links.find(x => x.dataset.spy === hit); now.textContent = a ? a.textContent : ''; }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    addEventListener('resize', spy);
    spy();
    if (jump) {
      jump.addEventListener('click', e => { if (e.target.closest('a')) jump.open = false; });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') jump.open = false; });
    }
  });
});

/* ── 85-modal.js ── */
/* The modal (build/modal.js). Any [data-modal-open="<modal id>"] opens that .md; inside
   an open modal, any [data-close] closes it, and so do Escape and a click on the backdrop
   (which carries data-close). Tab stays inside the card; focus goes back to what opened
   it. The id is the pairing the template writes between an opener and its dialog
   (as aria-controls pairs a FAQ question with its answer), not a script hook.

   Listeners are delegated on the document, so a modal pasted anywhere works; they are
   added once. Behaviour verbatim from the design-system page's former inline script. */
PS.module('modal', () => {
  if (document.documentElement.dataset.modalReady) return;
  document.documentElement.dataset.modalReady = '1';

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';
  let opener = null, open = null;

  const show = (m, from) => {
    opener = from || document.activeElement; open = m;
    m.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    /* read a layout value so the closed styles apply first and the card animates in,
       then focus once .is-open has made it visible — a hidden element takes no focus */
    void m.offsetWidth;
    m.classList.add('is-open');
    (m.querySelector('[data-autofocus]') || m.querySelector(FOCUSABLE)).focus();
  };
  const hide = () => {
    if (!open) return;
    const m = open; open = null;
    m.classList.remove('is-open');
    m.hidden = true;
    document.documentElement.style.overflow = '';
    if (opener) { opener.focus(); opener = null; }
  };

  document.addEventListener('click', e => {
    const o = e.target.closest('[data-modal-open]');
    if (o) {
      const m = document.getElementById(o.getAttribute('data-modal-open'));
      if (m) { e.preventDefault(); show(m, o); }
      return;
    }
    if (open && e.target.closest('[data-close]') && open.contains(e.target)) hide();
  });
  document.addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') { hide(); return; }
    if (e.key !== 'Tab') return;
    const f = [...open.querySelectorAll(FOCUSABLE)].filter(x => x.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
});

PS.start();
})();
