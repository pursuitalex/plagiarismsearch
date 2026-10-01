/* The inquiry form (build/sections/inquiry-form.js) — its label / field pairs.

   Each field's label names its control by id (label for → the control's id), written by
   the template. An editor who copies an .inquiry-field in the CMS copies its id with it,
   or pastes one without any: so the pairs are repaired here, once — a control whose id is
   missing or already taken on the page gets a fresh one, and every label is pointed at
   its own control. Nothing for an editor to keep in step by hand.

   That is all this module does. Whether the form validates and where it submits are the
   binding's: in the prototype the form is inert by its own onsubmit="return false". */
PS.module('inquiry-form', () => {
  document.querySelectorAll('form[data-inquiry-form]').forEach(form => {
    if (form.dataset.inquiryFormReady) return;
    form.dataset.inquiryFormReady = '1';
    const host = form.closest('section[id]');
    const base = (host ? host.id : 'inquiry') + '-field';
    form.querySelectorAll('.inquiry-field').forEach((field, i) => {
      const label = field.querySelector('label');
      const control = field.querySelector('input, textarea, select');
      if (!label || !control) return;
      if (!control.id || document.querySelectorAll('[id="' + CSS.escape(control.id) + '"]')[0] !== control) {
        let id = base + '-' + (i + 1), k = 1;
        while (document.getElementById(id)) id = base + '-' + (i + 1) + '-' + (++k);
        control.id = id;
      }
      if (label.htmlFor !== control.id) label.htmlFor = control.id;
    });
  });
});
