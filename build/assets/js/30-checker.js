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
