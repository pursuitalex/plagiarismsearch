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
