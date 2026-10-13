/* A button that copies a short text — a discount code (build/discounts.js).

     button[data-copy-text="15off"]     what is copied: the attribute's value, as written
       [data-copy-label]                the label inside it (optional; else the button's own
                                        text) — swapped for data-copied ("Copied" if the
                                        button names none) for a moment, then back

   The text is on the page beside the button and can be selected by hand, so a browser
   that refuses the clipboard, or a page without this script, loses a convenience and
   nothing else: the label then stays as it is. */
PS.module('copy-text', () => {
  document.querySelectorAll('[data-copy-text]').forEach(btn => {
    if (btn.dataset.copyReady) return;
    btn.dataset.copyReady = '1';
    const label = btn.querySelector('[data-copy-label]') || btn;
    const idle = label.textContent;
    let timer;
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copyText); } catch (e) { return; }
      label.textContent = btn.dataset.copied || 'Copied';
      clearTimeout(timer);
      timer = setTimeout(() => { label.textContent = idle; }, 1600);
    });
  });
});
