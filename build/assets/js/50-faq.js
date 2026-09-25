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
