/* The pricing periods. Each [data-pricing] section carries its plan data as a JSON island
   and its feature-line markup as a <template data-pricing-feat> (build/pricing.js); its
   cards already show the initial period, rendered from the same data and the same
   template. This only switches:
     .period-btn                 the tabs (data-period); aria-pressed kept in step if present
     [data-tier]                 a card: .js-price .js-term .js-rate .js-feats
     template[data-pricing-feat] in the card, else in the section: one feature line, {feat}
     [data-period-note]          optional: the period's note
     [data-period-only="…"]      optional: shown for that period only
     data-pricing-animate        on the section: the values fade up on a switch
     input[data-recurring]       optional: the "Recurring payments" switch. On, a card shows
                                 the subscription price; off, its one-off `single` price. A
                                 period with no `single` (One-time) cannot recur, so there
                                 the switch shows off and is disabled; the choice returns
                                 with the next recurring period.
   Values first, motion second — a price must never wait on an animation frame. */
PS.module('pricing', () => {
  document.querySelectorAll('[data-pricing]').forEach(root => {
    if (root.dataset.pricingReady) return;
    const island = root.querySelector('script[type="application/json"][data-pricing-data]');
    if (!island) return;
    root.dataset.pricingReady = '1';
    const PLANS = JSON.parse(island.textContent);
    const tabs = [...root.querySelectorAll('.period-btn')];
    const cards = [...root.querySelectorAll('[data-tier]')];
    const note = root.querySelector('[data-period-note]');
    const only = [...root.querySelectorAll('[data-period-only]')];
    const animate = root.hasAttribute('data-pricing-animate');
    const recur = root.querySelector('input[data-recurring]');
    let wantRecur = recur ? recur.hasAttribute('data-default-on') || recur.checked : true;
    let current = root.dataset.pricing || 'onetime';
    const lineOf = el => {
      const t = el.querySelector('template[data-pricing-feat]') || root.querySelector(':scope > template[data-pricing-feat], template[data-pricing-feat]');
      return t ? t.innerHTML : '{feat}';
    };
    if (!tabs.length || !cards.length) return;

    const render = (key, fade) => {
      const period = PLANS[key];
      if (!period) return;
      current = key;
      const canRecur = ['light', 'standard', 'premium'].some(t => period[t] && period[t].single);
      if (recur) { recur.disabled = !canRecur; recur.checked = canRecur && wantRecur; }
      const once = canRecur && recur && !wantRecur;
      tabs.forEach(b => {
        b.classList.toggle('active', b.dataset.period === key);
        if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(b.dataset.period === key));
      });
      if (note) note.textContent = period.note;
      only.forEach(el => { el.hidden = el.dataset.periodOnly !== key; });
      cards.forEach(card => {
        const tier = period[card.dataset.tier];
        if (!tier) return;
        const feats = card.querySelector('.js-feats');
        const line = lineOf(card);
        const shown = once && tier.single ? tier.single : tier;
        card.querySelector('.js-price').textContent = shown.price;
        card.querySelector('.js-term').textContent = period.term;
        card.querySelector('.js-rate').textContent = shown.rate;
        feats.innerHTML = tier.feats.map(f => line.split('{feat}').join(f)).join('');
        if (fade && animate && window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo([card.querySelector('.js-price'), card.querySelector('.js-rate'), feats],
            { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .28, ease: 'power2.out', overwrite: 'auto' });
        }
      });
    };
    tabs.forEach(b => b.addEventListener('click', () => render(b.dataset.period, true)));
    if (recur) recur.addEventListener('change', () => { wantRecur = recur.checked; render(current, true); });
    render(current, false);
  });
});
