/* The AI package selector. In each [data-ai-package], the checked radio fills its row
   (.ai-opt.on) and names the allowance on the continuation button
   ([data-purchase-hook="ai-package"] .js-ai-words), stamping it on the button's data-ai-*
   attributes — the developer's binding point. The initial state is in the HTML already. */
PS.module('ai-package', () => {
  document.querySelectorAll('[data-ai-package]').forEach(root => {
    if (root.dataset.aiPackageReady) return;
    root.dataset.aiPackageReady = '1';
    const radios = [...root.querySelectorAll('input[type="radio"]')];
    const go = root.querySelector('[data-purchase-hook="ai-package"]');
    if (!radios.length || !go) return;
    const fmt = n => Number(n).toLocaleString('en-US');
    const sync = () => {
      const r = radios.find(x => x.checked) || radios[0];
      radios.forEach(x => x.closest('.ai-opt').classList.toggle('on', x === r));
      go.querySelector('.js-ai-words').textContent = fmt(r.value);
      go.dataset.aiWords = r.value;
      go.dataset.aiBilling = r.dataset.billing;
      go.dataset.aiPrice = r.dataset.price;
    };
    radios.forEach(x => x.addEventListener('change', sync));
    sync();
  });
});
