/* The news archive (Newsroom). In each [data-archive] the topic chips (.tp-btn with
   data-topic) FILTER the items (.news-item, data-topic) and the pager pages the filtered
   set, twenty to a page. Neither ever moves an item, so what you read is always the
   archive in its own order. A year (.yr-group) whose items are all hidden steps aside.

   The words are the page's, in attributes: a year count's data-all / data-of, the
   pager count's data-format, the page buttons' data-page-label, the empty note's
   data-empty-text. Behaviour verbatim from the page's former inline script. */
PS.module('news-archive', () => {
  document.querySelectorAll('[data-archive]').forEach(root => {
    if (root.dataset.archiveReady) return;
    const pager = root.querySelector('[data-pager]');
    if (!pager) return;
    root.dataset.archiveReady = '1';

    const PER_PAGE = 20;
    const tabs = [...root.querySelectorAll('.tp-btn[data-topic]')];
    const groups = [...root.querySelectorAll('.yr-group')];
    const all = [...root.querySelectorAll('.news-item')];
    const empty = root.querySelector('[data-archive-empty]');
    const pagerCount = pager.querySelector('[data-pager-count]');
    const pageNums = pager.querySelector('[data-pager-nums]');
    const prev = pager.querySelector('[data-pager-prev]');
    const next = pager.querySelector('[data-pager-next]');
    const fill = (tpl, o) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

    let topic = 'all';
    let page = 1;

    const numbers = (current, total) => {
      /* 1 … c-1 c c+1 … n, without ever printing a gap that hides a single page */
      const want = new Set([1, total, current, current - 1, current + 1]);
      if (current <= 3) [2, 3, 4].forEach(n => want.add(n));
      if (current >= total - 2) [total - 1, total - 2, total - 3].forEach(n => want.add(n));
      const list = [...want].filter(n => n >= 1 && n <= total).sort((x, y) => x - y);
      const out = [];
      list.forEach((n, i) => {
        if (i && n - list[i - 1] > 1) out.push(n - list[i - 1] === 2 ? list[i - 1] + 1 : null);
        out.push(n);
      });
      return out;
    };

    const render = scroll => {
      const set = all.filter(el => topic === 'all' || el.dataset.topic === topic);
      const total = Math.max(1, Math.ceil(set.length / PER_PAGE));
      if (page > total) page = total;
      const from = (page - 1) * PER_PAGE;
      const shown = set.slice(from, from + PER_PAGE);
      const on = new Set(shown);

      all.forEach(el => { el.hidden = !on.has(el); });

      groups.forEach(g => {
        const n = [...g.querySelectorAll('.news-item')].filter(el => !el.hidden).length;
        g.hidden = n === 0;
        const c = g.querySelector('.yr-count');
        if (c) {
          const t = c.dataset.total;
          c.textContent = n === +t ? fill(c.dataset.all, { total: t }) : fill(c.dataset.of, { n, total: t });
        }
      });

      tabs.forEach(t => {
        const active = t.dataset.topic === topic;
        t.classList.toggle('active', active);
        t.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      if (empty) {
        empty.hidden = set.length > 0;
        if (!set.length) empty.textContent = empty.dataset.emptyText;
      }

      pager.hidden = set.length <= PER_PAGE;
      pagerCount.textContent = set.length
        ? fill(pagerCount.dataset.format, { from: from + 1, to: from + shown.length, total: set.length })
        : '';
      prev.disabled = page === 1;
      next.disabled = page === total;

      pageNums.innerHTML = '';
      numbers(page, total).forEach(n => {
        if (n === null) {
          const s = document.createElement('span');
          s.className = 'pg-gap'; s.textContent = '…'; s.setAttribute('aria-hidden', 'true');
          pageNums.appendChild(s);
          return;
        }
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pg-num' + (n === page ? ' on' : '');
        b.textContent = n;
        b.setAttribute('aria-label', pageNums.dataset.pageLabel + ' ' + n);
        if (n === page) b.setAttribute('aria-current', 'page');
        b.addEventListener('click', () => { page = n; render(true); });
        pageNums.appendChild(b);
      });

      if (window.ScrollTrigger) ScrollTrigger.refresh();
      if (scroll) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    /* in the scrolling row of a phone the chosen chip is brought fully into view */
    tabs.forEach(t => t.addEventListener('click', () => { topic = t.dataset.topic; page = 1; render(false); t.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' }); }));
    prev.addEventListener('click', () => { if (page > 1) { page--; render(true); } });
    next.addEventListener('click', () => { page++; render(true); });
    render(false);
  });
});
