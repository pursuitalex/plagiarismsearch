/* Three small form behaviours of the older pages.

   auth-tabs (Account): in a [data-auth], the tabs (.auth-tab, data-panel) and the
   "switch to the other form" links (data-goto) show one panel ([data-auth-panel]) and
   put the caret in its first field.

   stepper (VIP): in each .stepper, the − / + buttons (.step-btn, data-step) step the
   number field inside it, never below its min.

   word-count (the old checker): in a form[data-word-count], the .qc-count shows the
   words in the .qc-area, in data-over-color past the free 150. (The page's own script
   split on /s+/, the letter s, and so miscounted; it splits on white space here.)
   Behaviour otherwise verbatim from the pages' former inline scripts. */
PS.module('auth-tabs', () => {
  document.querySelectorAll('[data-auth]').forEach(root => {
    if (root.dataset.authReady) return;
    root.dataset.authReady = '1';
    const tabs = [...root.querySelectorAll('.auth-tab')];
    const panels = [...root.querySelectorAll('[data-auth-panel]')];
    const show = which => {
      tabs.forEach(t => {
        const on = t.dataset.panel === which;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(p => p.classList.toggle('hidden-panel', p.dataset.authPanel !== which));
      const panel = panels.find(p => p.dataset.authPanel === which);
      const first = panel && panel.querySelector('input');
      if (first && document.activeElement !== document.body) first.focus({ preventScroll: true });
    };
    tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.panel)));
    root.querySelectorAll('[data-goto]').forEach(b => b.addEventListener('click', () => show(b.dataset.goto)));
  });
});

PS.module('stepper', () => {
  document.querySelectorAll('.stepper').forEach(st => {
    if (st.dataset.stepperReady) return;
    const input = st.querySelector('input');
    if (!input) return;
    st.dataset.stepperReady = '1';
    st.querySelectorAll('.step-btn[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const next = (parseInt(input.value, 10) || 1) + parseInt(btn.dataset.step, 10);
      input.value = Math.max(parseInt(input.min, 10) || 1, next);
    }));
  });
});

PS.module('word-count', () => {
  document.querySelectorAll('form[data-word-count]').forEach(form => {
    if (form.dataset.wordCountReady) return;
    const area = form.querySelector('.qc-area');
    const out = form.querySelector('.qc-count');
    if (!area || !out) return;
    form.dataset.wordCountReady = '1';
    area.addEventListener('input', () => {
      const words = area.value.trim() ? area.value.trim().split(/\s+/).length : 0;
      out.textContent = words;
      out.style.color = words > 150 ? form.dataset.overColor : '';
    });
  });
});
