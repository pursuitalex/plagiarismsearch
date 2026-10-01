/* FAQ accordion. The answers are already in the HTML; this only opens and closes them,
   one list at a time — each [data-faq] is its own accordion.

   The question/answer id pairs (aria-controls → the answer's id) are written by the
   template. An editor who copies a .faq-item in the CMS copies its ids with it, or pastes
   one without any: so the pairs are repaired here, once, before anything is wired — an
   answer whose id is missing or already taken on the page gets a fresh one, and every
   button is pointed at its own answer. Nothing for an editor to keep in step by hand. */
PS.module('faq', () => {
  document.querySelectorAll('[data-faq]').forEach(list => {
    if (list.dataset.faqReady) return;
    list.dataset.faqReady = '1';

    const items = [...list.querySelectorAll('.faq-item')];
    const first = list.querySelector('.faq-a[id]');
    const base = ((first && first.id.match(/^(.*)-a\d+$/)) || [])[1] || 'faq';
    items.forEach((item, i) => {
      const q = item.querySelector('.faq-q'), a = item.querySelector('.faq-a');
      if (!q || !a) return;
      if (!a.id || document.querySelectorAll('[id="' + CSS.escape(a.id) + '"]')[0] !== a) {
        let id = base + '-a' + (i + 1), k = 1;
        while (document.getElementById(id)) id = base + '-a' + (i + 1) + '-' + (++k);
        a.id = id;
      }
      q.setAttribute('aria-controls', a.id);
      if (!q.hasAttribute('aria-expanded')) q.setAttribute('aria-expanded', String(item.classList.contains('open')));
    });

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
