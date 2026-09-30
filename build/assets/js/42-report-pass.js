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
