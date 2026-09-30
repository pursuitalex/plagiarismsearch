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

/* ── 26-count-up.js ── */
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

/* ── 46-marquee.js ── */
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

/* ── 48-show-more.js ── */
/* Show more (Reviews). In each [data-show-more="<n>"] the button [data-show-more-btn]
   shows the next n cards marked .more-later, in their own order, and steps aside when
   none are left. Focus moves to the first card it showed, so a keyboard reader lands
   on the new content rather than on a button that has just moved down the page. The
   cards are all in the HTML; CSS hides the later ones only while this can show them. */
PS.module('show-more', () => {
  document.querySelectorAll('[data-show-more]').forEach(root => {
    if (root.dataset.showMoreReady) return;
    const btn = root.querySelector('[data-show-more-btn]');
    if (!btn) return;
    root.dataset.showMoreReady = '1';
    const step = +root.dataset.showMore || 9;
    if (!root.querySelector('.more-later')) { btn.hidden = true; return; }

    btn.addEventListener('click', () => {
      const later = [...root.querySelectorAll('.more-later')];
      const batch = later.slice(0, step);
      batch.forEach(el => el.classList.remove('more-later'));
      if (batch[0]) {
        batch[0].setAttribute('tabindex', '-1');
        batch[0].focus({ preventScroll: true });
      }
      if (later.length <= step) btn.hidden = true;
    });
  });
});

/* ── 49-badges.js ── */
/* The originality-badge gallery. In each [data-badges]: the language pills (.badge-tab,
   data-lang) switch the panels (.badge-lang, data-lang); a badge (.badge-pick) opens the
   embed popup ([data-badge-modal]) with its plate, size and code, and the copy button
   copies the code. The popup closes on its backdrop, its button ([data-close]) and
   Escape, and gives focus back to the badge.

   The words are the page's, in attributes: the size line's data-unit ("pixels"), the copy
   label's data-copied ("Copied"). The embed code points at the live site, because a
   badge on someone else's page has to: a relative path would resolve against their
   domain. Behaviour verbatim from the page's former inline script. */
PS.module('badges', () => {
  document.querySelectorAll('[data-badges]').forEach(root => {
    if (root.dataset.badgesReady) return;
    const modal = root.querySelector('[data-badge-modal]');
    if (!modal) return;
    root.dataset.badgesReady = '1';

    const tabs = [...root.querySelectorAll('.badge-tab')];
    const panels = [...root.querySelectorAll('.badge-lang')];
    const mPlate = modal.querySelector('[data-badge-plate]');
    const mSize = modal.querySelector('[data-badge-size]');
    const mCode = modal.querySelector('[data-badge-code]');
    const mCopy = modal.querySelector('[data-badge-copy]');
    const mLabel = modal.querySelector('[data-badge-copy-label]');
    const copyText = mLabel.textContent;
    const HOST = 'https://plagiarismsearch.com';
    let opener = null;

    const closeModal = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };

    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => {
        const on = x === t;
        x.classList.toggle('bg-ink-900', on);
        x.classList.toggle('text-white', on);
        x.classList.toggle('bg-ink-100', !on);
        x.classList.toggle('text-ink-600', !on);
        x.classList.toggle('hover:bg-ink-200', !on);
      });
      panels.forEach(p => p.classList.toggle('hidden', p.dataset.lang !== t.dataset.lang));
      closeModal();
    }));

    const buildCode = d => {
      const href = d.lang === 'en' ? HOST + '/' : HOST + '/' + d.lang + '/';
      return '<a href="' + href + '"><img src="' + HOST + '/files/images/originality-badges/'
        + d.lang + '/' + d.file.split('/').pop() + '" alt="' + d.alt + '" title="' + d.title
        + '" width="' + d.w + '" height="' + d.h + '"></a>';
    };

    modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

    root.querySelectorAll('.badge-pick').forEach(b => b.addEventListener('click', () => {
      const d = b.dataset;
      opener = b;
      /* the badge keeps the plate it was shown on, or a white variant vanishes here too */
      mPlate.className = 'inline-flex items-center justify-center rounded-2xl px-6 py-5 ' +
        [...b.classList].filter(c => /^bg-|^ring/.test(c)).join(' ');
      mPlate.innerHTML = '';
      mPlate.appendChild(b.querySelector('img').cloneNode(true));
      mSize.textContent = d.w + ' × ' + d.h + ' ' + mSize.dataset.unit;
      mCode.value = buildCode(d);
      mLabel.textContent = copyText;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      mCopy.focus();
    }));

    mCopy.addEventListener('click', async () => {
      mCode.select();
      try { await navigator.clipboard.writeText(mCode.value); }
      catch { document.execCommand('copy'); }
      mLabel.textContent = mLabel.dataset.copied;
      setTimeout(() => { mLabel.textContent = copyText; }, 1800);
    });
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

/* ── 86-small-forms.js ── */
/* Three small form behaviours of the older pages.

   auth-tabs (Account): in a [data-auth], the tabs (.auth-tab, data-panel) and the
   "switch to the other form" links (data-goto) show one panel ([data-auth-panel]) and
   put the caret in its first field.

   stepper (VIP): in each .stepper, the − / + buttons (.step-btn, data-step) step the
   number field inside it, never below its min.

   word-count (the old checker): in a form[data-word-count], the .qc-count shows the
   words in the .qc-area, in data-over-color past the free 150. (The page's own script
   split on /s+/, the letter s, and so miscounted; it splits on white space here.)
   Behaviour otherwise verbatim from the pages' former inline scripts. */
PS.module('auth-tabs', () => {
  document.querySelectorAll('[data-auth]').forEach(root => {
    if (root.dataset.authReady) return;
    root.dataset.authReady = '1';
    const tabs = [...root.querySelectorAll('.auth-tab')];
    const panels = [...root.querySelectorAll('[data-auth-panel]')];
    const show = which => {
      tabs.forEach(t => {
        const on = t.dataset.panel === which;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(p => p.classList.toggle('hidden-panel', p.dataset.authPanel !== which));
      const panel = panels.find(p => p.dataset.authPanel === which);
      const first = panel && panel.querySelector('input');
      if (first && document.activeElement !== document.body) first.focus({ preventScroll: true });
    };
    tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.panel)));
    root.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => show(b.dataset.goto)));
  });
});

PS.module('stepper', () => {
  document.querySelectorAll('.stepper').forEach(st => {
    if (st.dataset.stepperReady) return;
    const input = st.querySelector('input');
    if (!input) return;
    st.dataset.stepperReady = '1';
    st.querySelectorAll('.step-btn[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const next = (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.step, 10);
      input.value = Math.max(parseInt(input.min, 10) || 1, next);
    }));
  });
});

PS.module('word-count', () => {
  document.querySelectorAll('form[data-word-count]').forEach(form => {
    if (form.dataset.wordCountReady) return;
    const area = form.querySelector('.qc-area');
    const out = form.querySelector('.qc-count');
    if (!area || !out) return;
    form.dataset.wordCountReady = '1';
    area.addEventListener('input', () => {
      const words = area.value.trim() ? area.value.trim().split(/\s+/).length : 0;
      out.textContent = words;
      out.style.color = words > 150 ? form.dataset.overColor : '';
    });
  });
});

/* ── 88-tools.js ── */
/* The free tools, computed in the browser. Behaviour and arithmetic verbatim from the
   pages' former inline scripts; the hooks are data-* (the form's outputs carry their old
   ids' names), and the words the scripts used to hold are attributes on the page.

   readability — form[data-readability]: Flesch reading ease and Flesch-Kincaid grade over
     the text in [data-rc="text"]; the level bands are the form's data-bands (JSON); the
     hint's data-empty / data-short / data-ok are its three messages.
   spell — form[data-spell]: counts and eight readability indices over [data-sp="text"];
     the word count's data-one / data-many, the reading times' data-unit.
   paper-analysis — form[data-paper]: the price of a paper from its pages, deadline, level
     and add-ons. The rate matrix is the form's JSON island ([data-pa-rates]), the same
     numbers section 05 prints; data-per-page and data-kb are the units.

   Syllables use the usual vowel-group heuristic, so grade-style figures are indicative. */
const syllables = w => {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
};
const readFile = (input, then) => input && input.addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => then(r.result);
  r.readAsText(f);
});

PS.module('readability', () => {
  document.querySelectorAll('form[data-readability]').forEach(form => {
    if (form.dataset.readabilityReady) return;
    form.dataset.readabilityReady = '1';
    const $ = k => form.querySelector('[data-rc="' + k + '"]');
    const area = $('text'), needle = $('needle'), hint = $('hint');
    const BANDS = JSON.parse(form.dataset.bands);

    const score = () => {
      const text = area.value.trim();
      const words = text ? text.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)) : [];
      const sentences = text ? text.split(/[.!?]+(?:\s|$)/).filter(s => /\S/.test(s)) : [];
      $('words').textContent = words.length.toLocaleString('en-US');
      $('sents').textContent = sentences.length.toLocaleString('en-US');

      /* below this the formulas are noise, not a reading, so refuse to show a number */
      if (words.length < 20 || sentences.length < 2) {
        $('score').innerHTML = '&mdash;';
        $('level').innerHTML = '&mdash;';
        $('grade').innerHTML = '&mdash;';
        $('asl').textContent = '0';
        needle.classList.add('hidden');
        hint.textContent = words.length ? hint.dataset.short : hint.dataset.empty;
        return;
      }
      const syl = words.reduce((n, w) => n + syllables(w), 0);
      const asl = words.length / sentences.length;
      const asw = syl / words.length;
      const ease = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));
      const grade = Math.max(0, 0.39 * asl + 11.8 * asw - 15.59);
      $('score').textContent = ease.toFixed(1);
      $('asl').textContent = asl.toFixed(1);
      $('grade').textContent = grade.toFixed(1);
      $('level').textContent = (BANDS.find(b => ease >= b[0]) || BANDS[BANDS.length - 1])[1];
      needle.classList.remove('hidden');
      needle.style.left = ease.toFixed(1) + '%';
      hint.textContent = hint.dataset.ok;
    };
    area.addEventListener('input', score);
    readFile($('file'), t => { area.value = t; score(); });
    /* an optional drop zone ([data-rc-drop], Readability v2): a text file dropped on it is
       read into the box; .is-over marks the zone while a file is over it */
    const drop = form.querySelector('[data-rc-drop]');
    if (drop) {
      ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('is-over'); }));
      ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, () => drop.classList.remove('is-over')));
      drop.addEventListener('drop', e => {
        e.preventDefault();
        const f = e.dataTransfer && e.dataTransfer.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => { area.value = r.result; score(); area.focus(); };
        r.readAsText(f);
      });
    }
    score();
  });
});

PS.module('spell', () => {
  document.querySelectorAll('form[data-spell]').forEach(form => {
    if (form.dataset.spellReady) return;
    form.dataset.spellReady = '1';
    const $ = k => form.querySelector('[data-sp="' + k + '"]');
    const area = $('text');
    const DASH = '—';
    const set = (k, v) => { $(k).textContent = v; };
    const count = $('count');
    const unit = form.dataset.unit;
    const mins = n => (n < 1 ? '<1 ' + unit : Math.round(n) + ' ' + unit);

    const analyse = () => {
      const text = area.value;
      const trimmed = text.trim();
      const words = trimmed ? trimmed.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)) : [];
      const sentences = trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter(x => /\S/.test(x)) : [];
      const paras = trimmed ? trimmed.split(/\n\s*\n/).filter(x => /\S/.test(x)) : [];
      const letters = (text.match(/[a-z]/gi) || []).length;
      const spaces = (text.match(/ /g) || []).length;
      const syl = words.reduce((n, w) => n + syllables(w), 0);
      const poly = words.filter(w => syllables(w) >= 3).length;

      const n = v => v.toLocaleString('en-US');
      set('para', n(paras.length));
      set('sent', n(sentences.length));
      set('syl', n(syl));
      set('words', n(words.length));
      set('chars', n(text.length));
      set('spaces', n(spaces));
      count.textContent = n(words.length) + (words.length === 1 ? count.dataset.one : count.dataset.many);

      /* the indices need enough text to mean anything */
      const keys = ['read', 'speak', 'ari', 'cli', 'fre', 'fkg', 'smog', 'fog'];
      if (words.length < 20 || sentences.length < 2) { keys.forEach(k => set(k, DASH)); return; }

      const asl = words.length / sentences.length;      /* words per sentence */
      const asw = syl / words.length;                   /* syllables per word */
      const L = letters / words.length * 100;           /* letters per 100 words */
      const S = sentences.length / words.length * 100;  /* sentences per 100 words */

      set('read', mins(words.length / 225));             /* average silent reading pace */
      set('speak', mins(words.length / 150));            /* average speaking pace */
      set('ari', (4.71 * (letters / words.length) + 0.5 * asl - 21.43).toFixed(1));
      set('cli', (0.0588 * L - 0.296 * S - 15.8).toFixed(1));
      set('fre', Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw)).toFixed(1));
      set('fkg', Math.max(0, 0.39 * asl + 11.8 * asw - 15.59).toFixed(1));
      set('smog', (1.0430 * Math.sqrt(poly * 30 / sentences.length) + 3.1291).toFixed(1));
      set('fog', (0.4 * (asl + 100 * (poly / words.length))).toFixed(1));
    };
    area.addEventListener('input', analyse);
    readFile($('file'), t => { area.value = t; analyse(); });
    analyse();
  });
});

PS.module('paper-analysis', () => {
  document.querySelectorAll('form[data-paper]').forEach(form => {
    if (form.dataset.paperReady) return;
    const island = form.querySelector('script[type="application/json"][data-pa-rates]');
    if (!island) return;
    form.dataset.paperReady = '1';
    const RATE = JSON.parse(island.textContent);
    const WORDS_PER_PAGE = 275;
    const $ = k => form.querySelector('[data-pa="' + k + '"]');
    const pages = $('pages'), total = $('total'), rate = $('rate'), words = $('words');
    const drop = $('drop'), doc = $('doc'), file = $('file');
    const money = n => '$' + n.toFixed(2);

    const recalc = () => {
      const n = Math.min(200, Math.max(1, parseInt(pages.value, 10) || 1));
      const dl = form.querySelector('input[name=paDl]:checked').value;
      const lv = form.querySelector('input[name=paLevel]:checked').value;
      const per = RATE[dl][lv];
      let sum = per * n;
      form.querySelectorAll('.ck:checked[data-price]').forEach(c => { sum += parseFloat(c.dataset.price); });
      total.textContent = money(sum);
      rate.textContent = money(per) + ' ' + rate.dataset.perPage;
      words.textContent = (n * WORDS_PER_PAGE).toLocaleString('en-US');
    };
    form.addEventListener('change', recalc);
    pages.addEventListener('input', recalc);
    form.querySelectorAll('.pa-step button').forEach(b => b.addEventListener('click', () => {
      pages.value = Math.min(200, Math.max(1, (parseInt(pages.value, 10) || 1) + Number(b.dataset.step)));
      recalc();
    }));
    pages.addEventListener('blur', () => {
      pages.value = Math.min(200, Math.max(1, parseInt(pages.value, 10) || 1));
      recalc();
    });

    /* drop zone and document card are alternate states — showing one hides the other */
    const showFile = f => {
      if (!f) return;
      $('name').textContent = f.name;
      $('size').textContent = (f.size / 1024).toFixed(2) + ' ' + $('size').dataset.kb;
      drop.classList.add('hidden');
      doc.classList.remove('hidden');
      doc.classList.add('flex');
    };
    const clearFile = () => {
      file.value = '';
      doc.classList.add('hidden');
      doc.classList.remove('flex');
      drop.classList.remove('hidden');
    };
    file.addEventListener('change', () => showFile(file.files[0]));
    $('clear').addEventListener('click', clearFile);
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => {
      const f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) { file.files = e.dataTransfer.files; showFile(f); }
    });
    recalc();
  });
});

/* ── 89-video.js ── */
/* The video facade (Reviews). An a[data-video="<YouTube id>"] is a link to the video
   on YouTube — which is what it stays without this script. With it, a click swaps the
   link for the player, from youtube-nocookie.com, playing; the frame takes its title
   from data-video-title. Nothing is requested from YouTube until someone asks.
   PS.videoFrame is shared with the video stage (90-video-stage.js). */
PS.videoFrame = (id, title, extraClass) => {
  const f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
  f.title = title || '';
  f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  f.className = 'vf-frame' + (extraClass ? ' ' + extraClass : '');
  return f;
};

PS.module('video', () => {
  document.querySelectorAll('a[data-video]').forEach(a => {
    if (a.dataset.videoReady) return;
    a.dataset.videoReady = '1';
    a.addEventListener('click', e => {
      e.preventDefault();
      const f = PS.videoFrame(a.dataset.video, a.dataset.videoTitle, a.dataset.videoFrameClass);
      a.replaceWith(f);
      f.focus();
    });
  });
});

/* ── 90-video-stage.js ── */
/* The video stage (Reviews v2). In each [data-video-stage] one video is on the stage
   ([data-stage], a facade link from the video module) and the playlist lists all of
   them as a[data-video-pick="<YouTube id>"] — links to YouTube without this script.
   With it, a pick plays that video on the stage: the stage takes the player, the
   caption ([data-caption-name], [data-caption-line]) takes the pick's own words from
   its data-name / data-line, and the pick is marked aria-current. */
PS.module('video-stage', () => {
  document.querySelectorAll('[data-video-stage]').forEach(root => {
    if (root.dataset.videoStageReady) return;
    const stage = root.querySelector('[data-stage]');
    const picks = [...root.querySelectorAll('a[data-video-pick]')];
    if (!stage || !picks.length) return;
    root.dataset.videoStageReady = '1';
    const name = root.querySelector('[data-caption-name]');
    const line = root.querySelector('[data-caption-line]');

    picks.forEach(pick => pick.addEventListener('click', e => {
      e.preventDefault();
      picks.forEach(p => p.setAttribute('aria-current', p === pick ? 'true' : 'false'));
      if (name) name.textContent = pick.dataset.name || '';
      if (line) line.textContent = pick.dataset.line || '';
      const f = PS.videoFrame(pick.dataset.videoPick, pick.dataset.videoTitle, 'absolute inset-0 h-full');
      stage.replaceChildren(f);
      f.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 1023px)').matches) stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }));
  });
});

PS.start();
})();
