/* The paper-analysis order form (Rate my paper). In each form[data-paper-form]:

   - the price per page is the academic level × the deadline, from the JSON island
     [data-pf-rates] ({ level: { days: price } }) — the live page's thirty prices. The
     two are chosen in two selects, [data-pf="levelSel"] and [data-pf="daysSel"], whose
     options print their price for the other's choice; the price stands beside them
     as a figure in [data-pf="rateNum"] ("6", "6.25");
   - pages come from [data-pf="pages"] (a stepper, [data-pf-step]), or from a dropped or
     chosen .txt file, whose words are counted at data-words-per-page a page; any other
     file shows its name and leaves the pages to the stepper;
   - [data-pf-service] checkboxes add their data-price once per order;
   - the sum is printed wherever the form has a place for it: [data-pf="rate"],
     "pagesOut", "base", "level", "deadline", "total";
   - "Apply" checks a discount code; a prototype knows none, so it answers with the live
     page's own message, data-error;
   - the description toggles with the live labels data-show / data-hide.

   Without JS the choices still work (plain selects) and the form shows
   the total for the defaults, which the page renders. */
PS.module('paper-form', () => {
  document.querySelectorAll('form[data-paper-form]').forEach(form => {
    if (form.dataset.paperFormReady) return;
    const island = form.querySelector('script[type="application/json"][data-pf-rates]');
    if (!island) return;
    form.dataset.paperFormReady = '1';
    const RATES = JSON.parse(island.textContent);
    const WPP = +form.dataset.wordsPerPage || 275;
    const $ = k => form.querySelector('[data-pf="' + k + '"]');
    const set = (k, v) => { const el = $(k); if (el) el.textContent = v; };
    const money = n => '$' + n.toFixed(2);
    const pages = $('pages');
    const clamp = v => Math.min(200, Math.max(1, parseInt(v, 10) || 1));

    /* the level and the deadline */
    const selLevel = $('levelSel'), selDays = $('daysSel');
    [selLevel, selDays].forEach(s => { if (s) [...s.options].forEach(o => { o.dataset.label = o.textContent; }); });
    const choice = () => {
      return { level: selLevel.value, days: selDays.value, levelLabel: selLevel.selectedOptions[0].dataset.label, dayLabel: selDays.selectedOptions[0].dataset.label };
    };

    const recalc = () => {
      const { level, days, levelLabel, dayLabel } = choice();
      const per = RATES[level][days];
      const n = clamp(pages.value);
      let extras = 0;
      form.querySelectorAll('[data-pf-service]:checked').forEach(c => { extras += +c.dataset.price; });
      set('rate', money(per));
      set('rateNum', Number.isInteger(per) ? String(per) : per.toFixed(2));
      set('level', levelLabel);
      set('deadline', dayLabel);
      set('pagesOut', n);
      set('base', money(per * n));
      set('total', money(per * n + extras));
      if (!form.dataset.wordsFromFile) set('words', (n * WPP).toLocaleString('en-US'));
      /* the selects: each option prints its price for the other select's choice */
      if (selLevel && selDays) {
        [...selLevel.options].forEach(o => { o.textContent = o.dataset.label + ' — ' + money(RATES[o.value][days]); });
        [...selDays.options].forEach(o => { o.textContent = o.dataset.label + ' — ' + money(RATES[level][o.value]); });
      }
    };

    form.addEventListener('change', recalc);
    pages.addEventListener('input', () => { delete form.dataset.wordsFromFile; recalc(); });
    pages.addEventListener('blur', () => { pages.value = clamp(pages.value); recalc(); });
    form.querySelectorAll('[data-pf-step]').forEach(b => b.addEventListener('click', () => {
      pages.value = clamp(+pages.value + +b.dataset.pfStep);
      delete form.dataset.wordsFromFile;
      recalc();
    }));

    /* the file: its card replaces the drop zone; a .txt file sets pages and words */
    const drop = $('drop'), doc = $('doc'), file = $('file'), hint = $('hint');
    const showFile = f => {
      if (!f) return;
      set('name', f.name);
      set('size', (f.size / 1024).toFixed(2) + 'Kb');
      drop.hidden = true;
      doc.hidden = false;
      if (hint) hint.hidden = true;
      if (/\.txt$/i.test(f.name) || /^text\//i.test(f.type)) {
        const r = new FileReader();
        r.onload = () => {
          const words = (String(r.result).trim().match(/\S+/g) || []).length;
          form.dataset.wordsFromFile = '1';
          set('words', words.toLocaleString('en-US'));
          pages.value = clamp(Math.ceil(words / WPP));
          recalc();
        };
        r.readAsText(f);
      }
    };
    file.addEventListener('change', () => showFile(file.files[0]));
    $('another').addEventListener('click', () => {
      file.value = '';
      doc.hidden = true;
      drop.hidden = false;
      if (hint) hint.hidden = false;
      delete form.dataset.wordsFromFile;
      recalc();
    });
    ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('is-over'); }));
    drop.addEventListener('drop', e => { const f = e.dataTransfer && e.dataTransfer.files[0]; if (f) { try { file.files = e.dataTransfer.files; } catch (_) { /* read-only in some browsers */ } showFile(f); } });

    /* the description, behind the live Show / Hide link */
    const toggle = $('descToggle'), desc = $('desc');
    if (toggle && desc) toggle.addEventListener('click', () => {
      desc.hidden = !desc.hidden;
      toggle.textContent = desc.hidden ? toggle.dataset.show : toggle.dataset.hide;
      toggle.setAttribute('aria-expanded', String(!desc.hidden));
      if (!desc.hidden) desc.focus();
    });

    /* the discount code: the prototype knows no codes, so it answers as the live page does */
    const apply = $('apply'), code = $('code'), msg = $('codeMsg');
    if (apply) apply.addEventListener('click', () => { msg.textContent = code.value.trim() ? msg.dataset.error : ''; msg.hidden = !code.value.trim(); });

    recalc();
  });
});
