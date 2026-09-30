/* The code block. Within each [data-code]: the language tabs (.code-tab, data-tab) show
   one panel (.code-panel, data-panel) — all panels are in the HTML — and the Copy button
   ([data-copy]) copies the open panel's code. The label exception the brief grants:
   exactly "Copy", on success "Copied". */
PS.module('code', () => {
  document.querySelectorAll('[data-code]').forEach(root => {
    if (root.dataset.codeReady) return;
    root.dataset.codeReady = '1';
    const tabs = [...root.querySelectorAll('.code-tab')];
    const panels = [...root.querySelectorAll('.code-panel')];
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.toggle('on', t === tab);
          t.setAttribute('aria-current', String(t === tab));
        });
        panels.forEach(p => p.classList.toggle('on', p.dataset.panel === tab.dataset.tab));
      });
    });
    const copy = root.querySelector('[data-copy]');
    if (copy) {
      copy.addEventListener('click', async () => {
        const open = root.querySelector('.code-panel.on code');
        if (!open) return;
        try { await navigator.clipboard.writeText(open.textContent); } catch (e) { return; }
        copy.textContent = 'Copied';
        setTimeout(() => { copy.textContent = 'Copy'; }, 1600);
      });
    }
  });
});
