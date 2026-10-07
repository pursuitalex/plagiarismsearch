/* The dropdown (15-dropdown.css): every select.dd-select gets the site's own list — and
   every select.cf-field, the field recipe's select (14-forms.css), so a form built from
   the recipe or from the library's Inquiry form needs no class added to it.

   The select stays in the page and stays the control — its value is the form's, a change
   fires its own input and change events (so a module that listens to the select or its
   form needs to know nothing about this), and a label still names it. What this module
   adds round it: a button that looks like the field and shows the chosen option, and a
   list (role="listbox") appended to <body>, placed under the button or over it where
   there is no room below.

   Mouse: a click opens and chooses; the option under the pointer is lit; the wheel
   scrolls the list and never the page behind it. Keys, on the button: ↓ ↑ Enter Space
   open; ↓ ↑ Home End PageUp PageDown move; Enter or Space chooses; Esc and Tab close;
   typing letters jumps to the option that starts with them, open or closed.

   The select may change under it — options rewritten (the paper form prints a price in
   each), the value set by a script, the form reset: the button and an open list follow. */
PS.module('dropdown', () => {
  const HOOK = 'select.dd-select, select.cf-field';
  const selects = [...document.querySelectorAll(HOOK)];
  if (!selects.length) return;
  let uid = 0, open = null;                       /* one list open at a time */
  const calm = matchMedia('(prefers-reduced-motion: reduce)');

  const close = (focus) => {
    if (!open) return;
    const d = open; open = null;
    d.list.remove();
    d.button.setAttribute('aria-expanded', 'false');
    d.button.removeAttribute('aria-activedescendant');
    if (focus) d.button.focus();
  };
  document.addEventListener('pointerdown', e => { if (open && !open.list.contains(e.target) && !open.box.contains(e.target)) close(); });
  window.addEventListener('blur', () => close());
  const replace = () => { if (open) open.place(); };
  window.addEventListener('resize', replace);
  document.addEventListener('scroll', e => { if (open && e.target !== open.list) open.place(); }, { capture: true, passive: true });

  selects.forEach(select => {
    if (select.dataset.ddReady || select.multiple) return;
    select.dataset.ddReady = '1';
    const id = 'dd-' + (++uid);

    /* is the field sized by its place (a form field, a grid cell), or by its longest
       option? Ask it: let the width go for a moment and see whether it changes. */
    const given = select.offsetWidth;
    select.style.width = 'auto';
    const block = Math.abs(select.offsetWidth - given) > 1;
    select.style.width = '';

    const box = document.createElement('span');
    box.className = 'dd' + (block ? ' dd-block' : '');
    select.before(box);
    box.append(select);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = [...select.classList].filter(c => c !== 'dd-select').concat('dd-button').join(' ');
    select.classList.add('dd-select');
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    const name = document.createElement('span');
    name.className = 'sr-only';
    const value = document.createElement('span');
    value.className = 'dd-value';
    button.append(name, value);
    box.append(button);

    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const list = document.createElement('ul');
    list.className = 'dd-list';
    list.id = id;
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;

    const d = { box, button, list };
    const options = () => [...select.options];
    const labelText = () => select.getAttribute('aria-label') || [...(select.labels || [])].map(l => l.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' ');
    let active = -1;

    /* the button says what the select holds */
    const sync = () => {
      const o = select.selectedOptions[0] || select.options[0];
      value.textContent = o ? o.textContent : '';
      const n = labelText();
      name.textContent = n ? n + ': ' : '';
      button.disabled = select.disabled;
      if (open === d) render();
    };

    const setActive = (i, scroll) => {
      const items = [...list.children];
      if (!items.length) return;
      active = Math.max(0, Math.min(items.length - 1, i));
      items.forEach((li, k) => li.classList.toggle('is-active', k === active));
      button.setAttribute('aria-activedescendant', items[active].id);
      if (scroll) items[active].scrollIntoView({ block: 'nearest' });
    };

    function render() {
      list.textContent = '';
      options().forEach((o, i) => {
        const li = document.createElement('li');
        li.className = 'dd-option';
        li.id = id + '-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(o.selected));
        if (o.disabled) li.setAttribute('aria-disabled', 'true');
        li.textContent = o.textContent;
        list.append(li);
      });
      setActive(Math.max(0, select.selectedIndex), false);
    }

    /* under the button; over it where the page has more room above than below */
    d.place = () => {
      const r = button.getBoundingClientRect();
      const cs = getComputedStyle(list);
      const gap = parseFloat(cs.getPropertyValue('--dd-gap')) || 6;
      const max = parseFloat(cs.getPropertyValue('--dd-max')) || 280;
      const below = innerHeight - r.bottom - gap - 12, above = r.top - gap - 12;
      list.style.maxHeight = '';
      const natural = Math.min(list.scrollHeight + 2, max);
      const up = below < Math.min(natural, 160) && above > below;
      const h = Math.max(120, Math.min(max, up ? above : below));
      list.style.maxHeight = h + 'px';
      list.style.minWidth = r.width + 'px';
      list.style.maxWidth = Math.max(r.width, Math.min(420, innerWidth - 24)) + 'px';
      list.dataset.side = up ? 'top' : 'bottom';
      const shown = Math.min(list.scrollHeight, h);
      const left = Math.max(12, Math.min(r.left, innerWidth - list.offsetWidth - 12));
      list.style.left = left + scrollX + 'px';
      list.style.top = (up ? r.top - gap - shown : r.bottom + gap) + scrollY + 'px';
    };

    const show = () => {
      if (select.disabled) return;
      close();
      document.body.append(list);
      open = d;
      render();
      d.place();
      button.setAttribute('aria-expanded', 'true');
      setActive(active, true);
    };

    const choose = i => {
      const o = select.options[i];
      if (!o || o.disabled) return;
      const changed = select.selectedIndex !== i;
      select.selectedIndex = i;
      button.classList.remove('is-invalid');
      sync();
      close(true);
      if (changed) {
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };
    /* a closed field takes the arrows and the letters the way a select does: at once */
    const step = i => {
      const o = select.options[i];
      if (!o || o.disabled || select.selectedIndex === i) return;
      select.selectedIndex = i;
      sync();
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };

    button.addEventListener('click', () => (open === d ? close(true) : show()));
    list.addEventListener('pointermove', e => { const li = e.target.closest('.dd-option'); if (li) setActive([...list.children].indexOf(li), false); });
    list.addEventListener('click', e => { const li = e.target.closest('.dd-option'); if (li) choose([...list.children].indexOf(li)); });
    /* the list is never focused: the pointer must not take the focus off the button */
    list.addEventListener('pointerdown', e => e.preventDefault());

    let typed = '', typedAt = 0;
    button.addEventListener('keydown', e => {
      const isOpen = open === d, last = select.options.length - 1, k = e.key;
      if (k === 'Escape') { if (isOpen) { e.preventDefault(); close(true); } return; }
      if (k === 'Tab') { if (isOpen) close(); return; }
      if (k === 'Enter' || k === ' ') { e.preventDefault(); isOpen ? choose(active) : show(); return; }
      const jump = { ArrowDown: 1, ArrowUp: -1, PageDown: 8, PageUp: -8 }[k];
      if (jump || k === 'Home' || k === 'End') {
        e.preventDefault();
        if (!isOpen && (k === 'ArrowDown' || k === 'ArrowUp') && !e.altKey) { show(); return; }
        if (!isOpen) { show(); }
        setActive(k === 'Home' ? 0 : k === 'End' ? last : active + jump, true);
        return;
      }
      if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const now = Date.now();
        typed = (now - typedAt > 700 ? '' : typed) + k.toLowerCase();
        typedAt = now;
        const from = isOpen ? active : select.selectedIndex;
        const all = options();
        const order = all.map((o, i) => i).slice(typed.length === 1 ? from + 1 : from).concat(all.map((o, i) => i).slice(0, typed.length === 1 ? from + 1 : from));
        const hit = order.find(i => !all[i].disabled && all[i].textContent.trim().toLowerCase().startsWith(typed));
        if (hit != null) { e.preventDefault(); isOpen ? setActive(hit, true) : step(hit); }
      }
    });

    /* a label, a script or the browser that reaches for the select gets the button */
    select.addEventListener('focus', () => button.focus());
    select.addEventListener('invalid', () => { button.classList.add('is-invalid'); button.focus(); });
    select.addEventListener('change', sync);
    if (select.form) select.form.addEventListener('reset', () => setTimeout(sync));
    new MutationObserver(sync).observe(select, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'selected', 'label'] });

    sync();
  });
});
