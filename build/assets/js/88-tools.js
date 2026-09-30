/* The free tools, computed in the browser. Behaviour and arithmetic verbatim from the
   pages' former inline scripts; the hooks are data-* (the form's outputs carry their old
   ids' names), and the words the scripts used to hold are attributes on the page.

   readability — form[data-readability]: Flesch reading ease and Flesch-Kincaid grade over
     the text in [data-rc="text"]; the level bands are the form's data-bands (JSON); the
     hint's data-empty / data-short / data-ok are its three messages.
   spell — form[data-spell]: counts and eight readability indices over [data-sp="text"]
     (an optional drop zone [data-sp-drop]; readability's is [data-rc-drop]);
     the word count's data-one / data-many, the reading times' data-unit.
   paper-analysis — form[data-paper]: the price of a paper from its pages, deadline, level
     and add-ons. The rate matrix is the form's JSON island ([data-pa-rates]), the same
     numbers section 05 prints; data-per-page and data-kb are the units.

   Syllables use the usual vowel-group heuristic, so grade-style figures are indicative. */
const syllables = w => {
  w = w.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
};
const readFile = (input, then) => input && input.addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => then(r.result);
  r.readAsText(f);
});
/* an optional drop zone (the v2 tool pages): a text file dropped on it is read and handed
   on; .is-over marks the zone while a file is over it */
const dropFile = (zone, then) => {
  if (!zone) return;
  ['dragenter', 'dragover'].forEach(t => zone.addEventListener(t, e => { e.preventDefault(); zone.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(t => zone.addEventListener(t, () => zone.classList.remove('is-over')));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    const f = e.dataTransfer && e.dataTransfer.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => then(r.result);
    r.readAsText(f);
  });
};

PS.module('readability', () => {
  document.querySelectorAll('form[data-readability]').forEach(form => {
    if (form.dataset.readabilityReady) return;
    form.dataset.readabilityReady = '1';
    const $ = k => form.querySelector('[data-rc="' + k + '"]');
    const area = $('text'), needle = $('needle'), hint = $('hint');
    const BANDS = JSON.parse(form.dataset.bands);

    const score = () => {
      const text = area.value.trim();
      const words = text ? text.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)) : [];
      const sentences = text ? text.split(/[.!?]+(?:\s|$)/).filter(s => /\S/.test(s)) : [];
      $('words').textContent = words.length.toLocaleString('en-US');
      $('sents').textContent = sentences.length.toLocaleString('en-US');

      /* below this the formulas are noise, not a reading, so refuse to show a number */
      if (words.length < 20 || sentences.length < 2) {
        $('score').innerHTML = '&mdash;';
        $('level').innerHTML = '&mdash;';
        $('grade').innerHTML = '&mdash;';
        $('asl').textContent = '0';
        needle.classList.add('hidden');
        hint.textContent = words.length ? hint.dataset.short : hint.dataset.empty;
        return;
      }
      const syl = words.reduce((n, w) => n + syllables(w), 0);
      const asl = words.length / sentences.length;
      const asw = syl / words.length;
      const ease = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));
      const grade = Math.max(0, 0.39 * asl + 11.8 * asw - 15.59);
      $('score').textContent = ease.toFixed(1);
      $('asl').textContent = asl.toFixed(1);
      $('grade').textContent = grade.toFixed(1);
      $('level').textContent = (BANDS.find(b => ease >= b[0]) || BANDS[BANDS.length - 1])[1];
      needle.classList.remove('hidden');
      needle.style.left = ease.toFixed(1) + '%';
      hint.textContent = hint.dataset.ok;
    };
    area.addEventListener('input', score);
    readFile($('file'), t => { area.value = t; score(); });
    dropFile(form.querySelector('[data-rc-drop]'), t => { area.value = t; score(); area.focus(); });
    score();
  });
});

PS.module('spell', () => {
  document.querySelectorAll('form[data-spell]').forEach(form => {
    if (form.dataset.spellReady) return;
    form.dataset.spellReady = '1';
    const $ = k => form.querySelector('[data-sp="' + k + '"]');
    const area = $('text');
    const DASH = '—';
    const set = (k, v) => { $(k).textContent = v; };
    const count = $('count');
    const unit = form.dataset.unit;
    const mins = n => (n < 1 ? '<1 ' + unit : Math.round(n) + ' ' + unit);

    const analyse = () => {
      const text = area.value;
      const trimmed = text.trim();
      const words = trimmed ? trimmed.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)) : [];
      const sentences = trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter(x => /\S/.test(x)) : [];
      const paras = trimmed ? trimmed.split(/\n\s*\n/).filter(x => /\S/.test(x)) : [];
      const letters = (text.match(/[a-z]/gi) || []).length;
      const spaces = (text.match(/ /g) || []).length;
      const syl = words.reduce((n, w) => n + syllables(w), 0);
      const poly = words.filter(w => syllables(w) >= 3).length;

      const n = v => v.toLocaleString('en-US');
      set('para', n(paras.length));
      set('sent', n(sentences.length));
      set('syl', n(syl));
      set('words', n(words.length));
      set('chars', n(text.length));
      set('spaces', n(spaces));
      count.textContent = n(words.length) + (words.length === 1 ? count.dataset.one : count.dataset.many);

      /* the indices need enough text to mean anything */
      const keys = ['read', 'speak', 'ari', 'cli', 'fre', 'fkg', 'smog', 'fog'];
      if (words.length < 20 || sentences.length < 2) { keys.forEach(k => set(k, DASH)); return; }

      const asl = words.length / sentences.length;      /* words per sentence */
      const asw = syl / words.length;                   /* syllables per word */
      const L = letters / words.length * 100;           /* letters per 100 words */
      const S = sentences.length / words.length * 100;  /* sentences per 100 words */

      set('read', mins(words.length / 225));             /* average silent reading pace */
      set('speak', mins(words.length / 150));            /* average speaking pace */
      set('ari', (4.71 * (letters / words.length) + 0.5 * asl - 21.43).toFixed(1));
      set('cli', (0.0588 * L - 0.296 * S - 15.8).toFixed(1));
      set('fre', Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw)).toFixed(1));
      set('fkg', Math.max(0, 0.39 * asl + 11.8 * asw - 15.59).toFixed(1));
      set('smog', (1.0430 * Math.sqrt(poly * 30 / sentences.length) + 3.1291).toFixed(1));
      set('fog', (0.4 * (asl + 100 * (poly / words.length))).toFixed(1));
    };
    area.addEventListener('input', analyse);
    readFile($('file'), t => { area.value = t; analyse(); });
    dropFile(form.querySelector('[data-sp-drop]'), t => { area.value = t; analyse(); area.focus(); });
    /* the result panel's Language row echoes the language picked (Spell v2) */
    const echo = form.querySelector('[data-sp-lang-echo]');
    if (echo && $('lang')) $('lang').addEventListener('change', () => { echo.textContent = $('lang').value; });
    analyse();
  });
});

PS.module('paper-analysis', () => {
  document.querySelectorAll('form[data-paper]').forEach(form => {
    if (form.dataset.paperReady) return;
    const island = form.querySelector('script[type="application/json"][data-pa-rates]');
    if (!island) return;
    form.dataset.paperReady = '1';
    const RATE = JSON.parse(island.textContent);
    const WORDS_PER_PAGE = 275;
    const $ = k => form.querySelector('[data-pa="' + k + '"]');
    const pages = $('pages'), total = $('total'), rate = $('rate'), words = $('words');
    const drop = $('drop'), doc = $('doc'), file = $('file');
    const money = n => '$' + n.toFixed(2);

    const recalc = () => {
      const n = Math.min(200, Math.max(1, parseInt(pages.value, 10) || 1));
      const dl = form.querySelector('input[name=paDl]:checked').value;
      const lv = form.querySelector('input[name=paLevel]:checked').value;
      const per = RATE[dl][lv];
      let sum = per * n;
      form.querySelectorAll('.ck:checked[data-price]').forEach(c => { sum += parseFloat(c.dataset.price); });
      total.textContent = money(sum);
      rate.textContent = money(per) + ' ' + rate.dataset.perPage;
      words.textContent = (n * WORDS_PER_PAGE).toLocaleString('en-US');
    };
    form.addEventListener('change', recalc);
    pages.addEventListener('input', recalc);
    form.querySelectorAll('.pa-step button').forEach(b => b.addEventListener('click', () => {
      pages.value = Math.min(200, Math.max(1, (parseInt(pages.value, 10) || 1) + Number(b.dataset.step)));
      recalc();
    }));
    pages.addEventListener('blur', () => {
      pages.value = Math.min(200, Math.max(1, parseInt(pages.value, 10) || 1));
      recalc();
    });

    /* drop zone and document card are alternate states — showing one hides the other */
    const showFile = f => {
      if (!f) return;
      $('name').textContent = f.name;
      $('size').textContent = (f.size / 1024).toFixed(2) + ' ' + $('size').dataset.kb;
      drop.classList.add('hidden');
      doc.classList.remove('hidden');
      doc.classList.add('flex');
    };
    const clearFile = () => {
      file.value = '';
      doc.classList.add('hidden');
      doc.classList.remove('flex');
      drop.classList.remove('hidden');
    };
    file.addEventListener('change', () => showFile(file.files[0]));
    $('clear').addEventListener('click', clearFile);
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
    drop.addEventListener('drop', e => {
      const f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) { file.files = e.dataTransfer.files; showFile(f); }
    });
    recalc();
  });
});
