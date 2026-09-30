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
