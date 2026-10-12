/* Evidence (build/evidence.js, 35-evidence.css): a product screenshot shown as proof.

   tabs — in each [data-tabs], the buttons with role="tab" show one panel each: the one a
   tab names in aria-controls. Click, or Left / Right / Home / End on the row; the tab in
   the tab order is the selected one. A tab swaps what is shown and nothing else — it runs
   no check and changes no value. The first selected tab in the HTML stays selected.
   Without this script every panel is visible (the collapse is under html.js).

   zoom — any button[data-zoom] opens the picture inside it in a <dialog>, at a size it
   can be read at: the screenshot's own width where the window allows, and on a narrower
   one a readable width that scrolls both ways. Escape, the close button and a click on
   the backdrop close it; focus returns to the button. One dialog a page, made on first
   use; its heading is the button's data-zoom-title. */
PS.module('tabs', () => {
  document.querySelectorAll('[data-tabs]').forEach(root => {
    if (root.dataset.tabsReady) return;
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    if (tabs.length < 2 || panels.some(p => !p)) return;
    root.dataset.tabsReady = '1';

    const select = (i, focus) => {
      tabs.forEach((t, n) => {
        const on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[n].classList.toggle('is-active', on);
      });
      if (focus) tabs[i].focus();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', e => {
        const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        select((to + tabs.length) % tabs.length, true);
      });
    });
    select(Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true')));
  });
});

PS.module('zoom', () => {
  if (document.documentElement.dataset.zoomReady || !window.HTMLDialogElement) return;
  document.documentElement.dataset.zoomReady = '1';

  let dialog = null;
  const build = () => {
    dialog = document.createElement('dialog');
    dialog.className = 'ev-dialog';
    dialog.innerHTML = '<div class="ev-dialog-bar"><p class="ev-dialog-title" id="ev-dialog-title"></p>' +
      '<button type="button" class="ev-dialog-close" aria-label="Close the enlarged screenshot">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '</button></div><div class="ev-dialog-scroll" tabindex="0"><img alt=""></div>';
    dialog.setAttribute('aria-labelledby', 'ev-dialog-title');
    document.body.appendChild(dialog);
    dialog.querySelector('.ev-dialog-close').addEventListener('click', () => dialog.close());
    /* a click on the backdrop lands on the dialog itself, never on a child */
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
  };

  document.addEventListener('click', e => {
    const btn = e.target.closest('button[data-zoom]');
    const img = btn && btn.querySelector('img');
    if (!img) return;
    if (!dialog) build();
    const big = dialog.querySelector('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    big.width = img.getAttribute('width');
    big.height = img.getAttribute('height');
    dialog.style.setProperty('--ev-w', img.getAttribute('width') + 'px');
    dialog.querySelector('.ev-dialog-title').textContent = btn.dataset.zoomTitle || img.alt;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    const scroll = dialog.querySelector('.ev-dialog-scroll');
    scroll.scrollTop = 0;
    /* where the picture is wider than the view, open on its right-hand side: on these
       screenshots that is where the report panel is */
    scroll.scrollLeft = btn.dataset.zoomStart === 'end' ? scroll.scrollWidth : 0;
  });
});
