/* The documentation navigation (Moodle Integration guide). Each [data-doc-nav] holds one
   or more navigations whose links carry data-spy="<section id>" — the rail from lg, the
   jump menu (details[data-jump]) under it. The spy marks the last navigated section
   whose top has passed the reading line, in every navigation at once, and writes its
   name into [data-jump-now]. Choosing a link, or Escape, closes the jump menu.
   The section ids are the page's anchors (the links' own hrefs), not script hooks. */
PS.module('doc-nav', () => {
  document.querySelectorAll('[data-doc-nav]').forEach(root => {
    if (root.dataset.docNavReady) return;
    root.dataset.docNavReady = '1';
    const links = [...root.querySelectorAll('[data-spy]')];
    const ids = [...new Set(links.map(a => a.dataset.spy))];
    const targets = ids.map(id => document.getElementById(id)).filter(Boolean);
    const now = root.querySelector('[data-jump-now]');
    const jump = root.querySelector('details[data-jump]');
    let current = null, ticking = false;
    const spy = () => {
      ticking = false;
      const line = innerWidth < 1024 ? 150 : 140;
      let hit = null;
      targets.forEach(t => { if (t.getBoundingClientRect().top <= line) hit = t.id; });
      if (hit === current) return;
      current = hit;
      links.forEach(a => {
        const on = a.dataset.spy === hit;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (now) { const a = links.find(x => x.dataset.spy === hit); now.textContent = a ? a.textContent : ''; }
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    addEventListener('resize', spy);
    spy();
    if (jump) {
      jump.addEventListener('click', e => { if (e.target.closest('a')) jump.open = false; });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') jump.open = false; });
    }
  });
});
