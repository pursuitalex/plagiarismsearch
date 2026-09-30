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
