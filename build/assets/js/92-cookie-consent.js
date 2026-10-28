/* Cookie consent — the card in the lower left corner (build/shell/footer-v2.html).

   In [data-cookie-consent]:
     data-variant="full|simple"      which first view the card opens in
     [data-cc-view="…"]              shown in the listed views only: full, simple, settings
     [data-cc-action]                settings · reject · accept · save
     input[data-cc-category]         preferences, analytics (strictly necessary is always on)
     [data-cc-close]                 closes the card for this visit and records nothing

   When it shows: on the homepage, 3 s after load, with no stored choice, unless the card
   was closed earlier in this visit (Olex, 2026-10-28: the simple card, on the homepage
   only); and on any page whenever the address ends in #cookies (the card's own variant),
   #cookies=simple, #cookies=full or #cookies=settings — the way to see it again, and the
   way a "Cookie settings" link can open it.

   What a choice does here: it is kept in localStorage under ps_cookie_consent as
   { v, necessary, preferences, analytics, at }, put on window.PS_CONSENT and announced as
   a "ps:consent" event on window. The prototype runs no analytics; production binds the
   event (or reads the stored choice) to its tags. window.PSConsent.open(view) opens the
   card from anywhere. */
PS.module('cookie-consent', () => {
  const root = document.querySelector('[data-cookie-consent]');
  if (!root || root.dataset.ccReady) return;
  root.dataset.ccReady = '1';

  const KEY = 'ps_cookie_consent', SESSION = 'ps_cookie_closed', VERSION = 1;
  const store = {
    get(k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set(k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) { /* private mode: the choice lasts this page */ } },
  };
  const read = () => { try { const c = JSON.parse(store.get(KEY)); return c && c.v === VERSION ? c : null; } catch (e) { return null; } };
  const boxes = [...root.querySelectorAll('input[data-cc-category]')];
  const views = [...root.querySelectorAll('[data-cc-view]')];
  let current = null;

  const show = view => {
    current = view;
    views.forEach(el => { el.hidden = !el.dataset.ccView.split(' ').includes(view); });
    if (view === 'settings') {
      const c = read();
      boxes.forEach(b => { b.checked = !!(c && c[b.dataset.ccCategory]); });
    }
  };
  const open = (view, focus) => {
    show(view || root.dataset.variant || 'full');
    root.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-in')));
    if (focus) (root.querySelector(view === 'settings' ? 'input[data-cc-category]' : '[data-cc-action]:not([hidden])') || root).focus({ preventScroll: true });
  };
  const close = () => {
    root.classList.remove('is-in');
    root.hidden = true;
    current = null;
  };
  const decide = choice => {
    const c = { v: VERSION, necessary: true, preferences: !!choice.preferences, analytics: !!choice.analytics, at: new Date().toISOString() };
    store.set(KEY, JSON.stringify(c));
    window.PS_CONSENT = c;
    window.dispatchEvent(new CustomEvent('ps:consent', { detail: c }));
    close();
  };

  root.addEventListener('click', e => {
    if (e.target.closest('[data-cc-close]')) { store.set(SESSION, '1', true); close(); return; }
    const a = e.target.closest('[data-cc-action]');
    if (!a) return;
    const act = a.dataset.ccAction;
    if (act === 'settings') { show('settings'); const first = root.querySelector('input[data-cc-category]'); if (first) first.focus({ preventScroll: true }); }
    else if (act === 'accept') decide({ preferences: true, analytics: true });
    else if (act === 'reject') decide({ preferences: false, analytics: false });
    else if (act === 'save') decide(Object.fromEntries(boxes.map(b => [b.dataset.ccCategory, b.checked])));
  });
  root.addEventListener('keydown', e => { if (e.key === 'Escape' && current) { store.set(SESSION, '1', true); close(); } });

  /* #cookies, #cookies=simple, #cookies=full, #cookies=settings */
  const fromHash = () => {
    const m = location.hash.match(/^#cookies(?:=(simple|full|settings))?$/);
    if (!m) return false;
    open(m[1] || root.dataset.variant || 'full', true);
    return true;
  };
  window.addEventListener('hashchange', fromHash);
  window.PSConsent = { get: read, open: view => open(view, true) };

  const stored = read();
  if (stored) window.PS_CONSENT = stored;
  if (fromHash()) return;
  const home = /(^|\/)(index(\.html)?)?$/.test(location.pathname);
  if (home && !stored && !store.get(SESSION, true)) setTimeout(() => open(), 3000);
});
