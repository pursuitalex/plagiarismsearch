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
