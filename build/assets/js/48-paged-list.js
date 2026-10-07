/* A list shown a page at a time (Video Tutorials). In each [data-paged-list="<n>"] the
   items ([data-paged-item]) are shown n to a page and the pager ([data-pager], the
   Newsroom's own parts and classes — 27-news.css) walks through them:

     [data-pager-count]   "{from}–{to} of {total} …", its words in data-format
     [data-pager-prev] / [data-pager-next]
     [data-pager-nums]    the page buttons (.pg-num, .pg-gap), named by data-page-label

   The whole list is in the delivered HTML and the pager is hidden there: without this
   script every item shows and nothing is lost. With it, a list no longer than one page
   keeps its pager hidden; a longer one pages. Turning a page brings the top of the list
   back into view and keeps the keyboard where it was — on the pager.

   The Newsroom's archive has a pager of its own (news-archive), which also filters by
   topic; this one only pages. The rule for which numbers to print is the same there. */
PS.module('paged-list', () => {
  document.querySelectorAll('[data-paged-list]').forEach(root => {
    if (root.dataset.pagedListReady) return;
    const pager = root.querySelector('[data-pager]');
    const items = [...root.querySelectorAll('[data-paged-item]')];
    if (!pager || !items.length) return;
    root.dataset.pagedListReady = '1';

    const PER_PAGE = Math.max(1, parseInt(root.dataset.pagedList, 10) || items.length);
    const count = pager.querySelector('[data-pager-count]');
    const nums = pager.querySelector('[data-pager-nums]');
    const prev = pager.querySelector('[data-pager-prev]');
    const next = pager.querySelector('[data-pager-next]');
    const fill = (tpl, o) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const total = Math.max(1, Math.ceil(items.length / PER_PAGE));
    let page = 1;

    /* 1 … c-1 c c+1 … n, without ever printing a gap that hides a single page */
    const numbers = current => {
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

    const render = turned => {
      const from = (page - 1) * PER_PAGE;
      items.forEach((el, i) => { el.hidden = i < from || i >= from + PER_PAGE; });

      pager.hidden = items.length <= PER_PAGE;
      if (count) count.textContent = fill(count.dataset.format || '{from}–{to} of {total}', { from: from + 1, to: Math.min(from + PER_PAGE, items.length), total: items.length });
      if (prev) prev.disabled = page === 1;
      if (next) next.disabled = page === total;

      const hadFocus = nums.contains(document.activeElement);
      nums.innerHTML = '';
      numbers(page).forEach(n => {
        if (n === null) {
          const s = document.createElement('span');
          s.className = 'pg-gap'; s.textContent = '…'; s.setAttribute('aria-hidden', 'true');
          nums.appendChild(s);
          return;
        }
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pg-num' + (n === page ? ' on' : '');
        b.textContent = n;
        b.setAttribute('aria-label', (nums.dataset.pageLabel || 'Page') + ' ' + n);
        if (n === page) b.setAttribute('aria-current', 'page');
        b.addEventListener('click', () => { if (n !== page) { page = n; render(true); } });
        nums.appendChild(b);
      });
      /* the page buttons are redrawn: the one for this page takes the focus its
         predecessor had, and a step button that has just gone dead hands it on */
      const on = nums.querySelector('.pg-num.on');
      if (on && (hadFocus || document.activeElement === document.body || (document.activeElement && document.activeElement.disabled))) { if (turned) on.focus({ preventScroll: true }); }

      if (window.ScrollTrigger) ScrollTrigger.refresh();
      if (turned) root.scrollIntoView({ block: 'start', behavior: calm.matches ? 'auto' : 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => { if (page > 1) { page--; render(true); } });
    if (next) next.addEventListener('click', () => { if (page < total) { page++; render(true); } });
    render(false);
  });
});
