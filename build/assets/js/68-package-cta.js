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
