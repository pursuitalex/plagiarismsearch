/* The payment page shows the order its address names (build/payment.js).

   A plan card's button leads here with the order in the address's fragment —
   #plan=standard&period=monthly&recurring=on (build/pricing.js: orderHref; 60-pricing.js
   keeps it in step with the card). In each [data-payment] section:

     script[data-pricing-data]     the plan data, the same island the cards carry
     script[data-payment-words]    the names: tiers, periods, and how the page is titled
     [data-pay="order"]            the plan and the period — "Standard Monthly"
     [data-pay="price"|"total"]    the subscription price, or the one-off `single` price
                                   when the order does not recur
     [data-pay="holds"]            what the plan holds (its first line)
     [data-pay="recurring"]        the "Recurring payments" line: shown for a subscription
     [data-pay="title"]            anywhere on the page: the page's name (h1, breadcrumb);
                                   the document title follows

   An order recurs only if the address says so AND the period has a one-off price to be
   the alternative: One-time never recurs. A fragment that names no known plan or period
   changes nothing — the page keeps the example order it was built with, as it does
   without this script. Only text is written, never markup. */
PS.module('payment', () => {
  document.querySelectorAll('[data-payment]').forEach(root => {
    if (root.dataset.paymentReady) return;
    const data = root.querySelector('script[type="application/json"][data-pricing-data]');
    const words = root.querySelector('script[type="application/json"][data-payment-words]');
    if (!data || !words) return;
    root.dataset.paymentReady = '1';
    const PLANS = JSON.parse(data.textContent);
    const W = JSON.parse(words.textContent);
    const set = (key, text, scope) => (scope || root).querySelectorAll('[data-pay="' + key + '"]').forEach(el => { el.textContent = text; });

    const show = () => {
      const q = new URLSearchParams(location.hash.replace(/^#/, ''));
      const period = PLANS[q.get('period')];
      const plan = period && W.tiers[q.get('plan')] && period[q.get('plan')];
      if (!plan || !W.periods[q.get('period')]) return;
      const recurs = q.get('recurring') === 'on' && !!plan.single;
      /* off on a period that can recur: the one-off price */
      const price = !recurs && plan.single ? plan.single.price : plan.price;
      const order = W.tiers[q.get('plan')] + ' ' + W.periods[q.get('period')];
      const title = (recurs ? W.subscription : W.once).replace('{order}', order);
      set('order', order);
      set('price', price);
      set('total', price);
      set('holds', plan.feats[0]);
      root.querySelectorAll('[data-pay="recurring"]').forEach(el => { el.hidden = !recurs; });
      set('title', title, document);
      document.title = title + (W.site || '');
    };
    window.addEventListener('hashchange', show);
    show();
  });
});
