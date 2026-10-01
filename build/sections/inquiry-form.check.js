/* Inquiry form — the validator's rules (contract: build/sections/inquiry-form.contract.js).

   Run by build/check-library.js through the registry (build/sections/index.js). Per form
   section found (a section.inquiry):
     structure   section → .inquiry-inner → .inquiry-grid → the head column and the card;
                 in the card the form (the field grid, the optional consent, the submit)
                 and the optional hidden success state
     classes     only the contract's classes on each part, the behaviour hooks kept
     variants    data-bg present; the other switches with an allowed value
     fields      each .inquiry-field: one label.cf-label and one control.cf-field (input of
                 an allowed type, textarea or select), then an optional hint; a chip group:
                 legend + checkboxes, each with a name and a value
     a11y        the label for / field id pairs are the script's to repair
                 (36-inquiry-form.js), so a missing, mismatched or copied pair is a
                 warning, never an error; the button is type="submit"; the success state is
                 hidden and role="status"
     behaviour   data-inquiry-form on the form; onsubmit only as the prototype's inert
                 stub, "return false"
     sealed      <svg> icons are not inspected inside
   What it does NOT judge: which fields a form has and which are required — that is each
   page's brief and the backend binding. */
const C = require('./inquiry-form.contract');
const { kids, texts, cls, has, textOf, walk, inside, label, ID, rules } = require('./check-tools');

const CONTROL_ATTRS = { class: true, id: ID, type: true, name: true, placeholder: true, required: true, rows: true, autocomplete: true, inputmode: true, maxlength: true, minlength: true, min: true, max: true, pattern: true, value: true };

function checkInquiry(el, R) {
  const { E, W, onlyClasses, need, mustHave, variantsOf, onlyAttrs, requireAttrs, noText, filled, link, inlineOnly, svgIcon } = R;
  R.at = el;
  if (el.tag !== 'section') E(el, `${label(el)}: the inquiry form root is a <section>`);
  onlyClasses(el, C.classes.section);
  onlyAttrs(el, { id: ID, class: true, 'data-component': true, ...Object.fromEntries(Object.keys(C.variants.section).map(a => [a, true])) });
  requireAttrs(el, { 'data-component': 'inquiry-form' });
  variantsOf(el, C.variants.section);
  noText(el);

  const only = (parent, what, allowed) => {
    const k = kids(parent);
    if (k.length !== 1 || !need(k[0], what, allowed, 'div')) { E(parent, `${label(parent)}: must hold exactly one div.${allowed[0]}`); return null; }
    return k[0];
  };
  const inner = only(el, 'the container', C.classes.inner);
  if (!inner) return 0;
  onlyAttrs(inner, { class: true }); noText(inner);
  const grid = only(inner, 'the grid', C.classes.grid);
  if (grid === null) return 0;   /* (no "!" before the word grid: Tailwind reads this file for class names) */
  onlyAttrs(grid, { class: true }); noText(grid);
  const [aside, card, ...extra] = kids(grid);
  extra.forEach(x => E(x, `${label(x)}: the grid holds the head column and the card`));

  /* the head column: the Section Header, then the optional line under it */
  if (!aside || !need(aside, 'the head column', C.classes.aside, 'div')) E(aside || grid, `${label(grid)}: first child is div.inquiry-aside`);
  else {
    onlyAttrs(aside, { class: true }); noText(aside);
    const k = kids(aside);
    let i = 0;
    if (k[i] && has(k[i], 'section-eyebrow')) R.eyebrow(k[i++], C.classes);
    const t = k[i++];
    if (!t || !has(t, 'section-title')) E(t || aside, `${label(aside)}: the h2.section-title is required (after the optional eyebrow)`);
    else { need(t, 'the title', C.classes.title, 'h2'); onlyAttrs(t, { class: true, id: ID }); inlineOnly(t, C.inline.title, 'the title'); filled(t, 'the title'); }
    if (k[i] && has(k[i], 'section-intro')) {
      const p = k[i++];
      need(p, 'the intro', C.classes.intro, 'p'); onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.intro, 'the intro'); filled(p, 'the intro (remove it instead)');
    }
    if (k[i] && has(k[i], 'inquiry-alt')) {
      const p = k[i++];
      need(p, 'the line under the intro', C.classes.alt, 'p'); onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.alt, 'the line under the intro'); filled(p, 'the line under the intro (remove it instead)');
      if (kids(p).length !== 1) E(p, `${label(p)}: holds its text and exactly one a.inquiry-alt-link`);
    }
    k.slice(i).forEach(x => E(x, `${label(x)}: not part of the head column (order: eyebrow?, title, intro?, p.inquiry-alt?)`));
  }

  /* the card */
  if (!card || !need(card, 'the card', C.classes.card, 'div')) { E(card || grid, `${label(grid)}: second child is div.inquiry-card`); return 0; }
  onlyAttrs(card, { class: true }); noText(card);
  if (aside && has(aside, 'rv') !== has(card, 'rv')) W(grid, 'the head column and the card should both carry .rv, or neither (the reveal is designed as a pair)');
  const [form, success, ...more] = kids(card);
  more.forEach(x => E(x, `${label(x)}: the card holds the form and the success state`));
  let count = 0;
  if (!form || form.tag !== 'form') E(form || card, `${label(card)}: first child is the <form>`);
  else {
    onlyClasses(form, []);
    onlyAttrs(form, { 'data-inquiry-form': true, 'data-focus-first': /^\d+$/, onsubmit: 'return false', novalidate: true, action: true, method: true, name: true, id: ID, autocomplete: true });
    /* the prototype's inert stub, exactly; any other handler is refused */
    if (form.attrs.onsubmit === 'return false') R.exempt(form, 'onsubmit');
    requireAttrs(form, { 'data-inquiry-form': true });
    noText(form);
    const fk = kids(form);
    let j = 0;
    const fields = fk[j];
    if (!fields || !need(fields, 'the field grid', C.classes.fields, 'div')) E(fields || form, `${label(form)}: first child is div.inquiry-fields`);
    else { j++; onlyAttrs(fields, { class: true }); noText(fields); count = checkFields(fields); }
    if (fk[j] && has(fk[j], 'inquiry-consent')) checkConsent(fk[j++]);
    const sub = fk[j++];
    if (!sub || !need(sub, 'the submit row', C.classes.submit, 'div')) E(sub || form, `${label(form)}: div.inquiry-submit with the button is required after the fields`);
    else {
      onlyAttrs(sub, { class: true }); noText(sub);
      const [b, ...rest] = kids(sub);
      rest.forEach(x => E(x, `${label(x)}: the submit row holds the button alone`));
      if (!b || !need(b, 'the button', C.classes.button, 'button')) E(b || sub, `${label(sub)}: holds button.inquiry-button`);
      else {
        mustHave(b, C.hooks.button); onlyAttrs(b, { type: true, class: true, name: true, value: true });
        if (b.attrs.type !== 'submit') E(b, `${label(b)}: type="submit" is required`);
        const bk = kids(b);
        if (bk.length !== 1 || !need(bk[0], 'the arrow orb', C.classes.buttonOrb, 'span')) E(b, `${label(b)}: the button holds its text and span.inquiry-button-orb (the arrow), copied as it is`);
        else { const o = bk[0]; mustHave(o, C.hooks.buttonOrb); onlyAttrs(o, { class: true }); noText(o); const s = kids(o); if (s.length !== 1) E(o, `${label(o)}: holds only the arrow <svg>`); svgIcon(s[0], label(o), []); }
        if (!texts(b).some(t => t.text.trim())) E(b, `${label(b)}: the button needs its text`);
      }
    }
    fk.slice(j).forEach(x => E(x, `${label(x)}: not part of the form (order: div.inquiry-fields, label.inquiry-consent?, div.inquiry-submit)`));
  }
  if (success) {
    if (need(success, 'the success state', C.classes.success, 'div')) {
      onlyAttrs(success, { class: true, hidden: true, id: ID, role: true });
      requireAttrs(success, { hidden: true, role: 'status' }); noText(success);
      const [t, p, ...rest] = kids(success);
      rest.forEach(x => E(x, `${label(x)}: the success state holds its title and one paragraph`));
      if (!t || !has(t, 'inquiry-success-title') || !['h3', 'p'].includes(t.tag)) E(t || success, `${label(success)}: first child is the title, <h3 class="inquiry-success-title"> (or <p>)`);
      else { onlyClasses(t, C.classes.successTitle); onlyAttrs(t, { class: true }); inlineOnly(t, C.inline.success, 'the success title'); filled(t, 'the success title'); }
      if (p) { if (need(p, 'the success text', C.classes.successText, 'p')) { onlyAttrs(p, { class: true }); inlineOnly(p, C.inline.success, 'the success text'); filled(p, 'the success text (remove it instead)'); } }
    }
  }
  return count;

  /* the field grid: fields and chip groups, in the order the form's brief gives */
  function checkFields(fields) {
    const items = kids(fields);
    if (!items.length) E(fields, `${label(fields)}: at least one .inquiry-field`);
    items.forEach(f => {
      if (has(f, 'inquiry-choice')) return checkChoice(f);
      if (!need(f, 'a field', C.classes.field, 'div')) return;
      onlyAttrs(f, { class: true, 'data-span': true }); variantsOf(f, C.variants.field); noText(f);
      const [lab, ctl, help, ...rest] = kids(f);
      rest.forEach(x => E(x, `${label(x)}: a field holds its label, its control and one optional hint`));
      if (!lab || !need(lab, 'the label', C.classes.label, 'label')) E(lab || f, `${label(f)}: first child is label.cf-label`);
      else {
        onlyAttrs(lab, { class: true, for: true }); filled(lab, 'the label');
        for (const c of kids(lab)) {
          if (c.tag === 'i' && !cls(c).length) { onlyAttrs(c, {}); if (textOf(c).trim() !== '*') E(c, `${label(c)}: the required mark is <i>*</i>`); }
          else if (c.tag === 'span' && has(c, 'inquiry-optional')) { onlyClasses(c, C.classes.optional); onlyAttrs(c, { class: true }); inlineOnly(c, [], 'the Optional mark'); }
          else E(c, `${label(c)} is not allowed in a label (allowed: <i>*</i>, span.inquiry-optional)`);
        }
      }
      if (!ctl || !['input', 'textarea', 'select'].includes(ctl.tag) || !has(ctl, 'cf-field')) { E(ctl || f, `${label(f)}: second child is the control: input, textarea or select with class "cf-field"`); return; }
      onlyClasses(ctl, C.classes.control); onlyAttrs(ctl, CONTROL_ATTRS);
      if (ctl.tag === 'input' && !C.controls.input.includes(ctl.attrs.type || 'text')) E(ctl, `${label(ctl)}: type="${ctl.attrs.type}" is not a field type of the form (${C.controls.input.join(' | ')})`);
      if (ctl.tag === 'select') {
        R.seal(ctl);   /* its options are data */
        const opts = kids(ctl);
        if (opts.length < 2 || opts.some(o => o.tag !== 'option')) E(ctl, `${label(ctl)}: a select holds its <option>s: the empty first one and at least one choice`);
        opts.forEach(o => { for (const a of Object.keys(o.attrs)) if (!['value', 'selected', 'disabled'].includes(a)) E(o, `${label(o)}: attribute ${a} is not part of the Inquiry form contract`); });
      }
      if (ctl.tag === 'textarea' && textOf(ctl).trim()) E(ctl, `${label(ctl)}: a textarea starts empty (its hint is the placeholder)`);
      /* the pair is the script's to repair */
      if (lab && lab.attrs) {
        if (!ctl.attrs.id) W(ctl, `${label(ctl)}: no id — the script gives it one on load and points its label at it`);
        else if (lab.attrs.for !== ctl.attrs.id) W(lab, `${label(lab)}: for="${lab.attrs.for || ''}" does not name this field's id "${ctl.attrs.id}" — the script repairs the pair on load`);
      }
      if (help) {
        if (need(help, 'the hint', C.classes.help, 'p')) { onlyAttrs(help, { class: true }); inlineOnly(help, C.inline.help, 'the hint'); filled(help, 'the hint (remove it instead)'); }
      }
      count++;
    });
    return count;
  }

  function checkChoice(fs) {
    if (!need(fs, 'the chip group', C.classes.choice, 'fieldset')) return;
    onlyAttrs(fs, { class: true }); noText(fs);
    const [legend, chips, ...rest] = kids(fs);
    rest.forEach(x => E(x, `${label(x)}: a chip group holds its legend and its chips`));
    if (!legend || !need(legend, 'the legend', C.classes.label, 'legend')) E(legend || fs, `${label(fs)}: first child is legend.cf-label`);
    else { onlyAttrs(legend, { class: true }); inlineOnly(legend, [], 'the legend'); filled(legend, 'the legend'); }
    if (!chips || !need(chips, 'the chips', C.classes.chips, 'div')) { E(chips || fs, `${label(fs)}: second child is div.inquiry-chips`); return; }
    onlyAttrs(chips, { class: true }); noText(chips);
    const opts = kids(chips);
    if (opts.length < 2) E(chips, `${label(chips)}: at least two label.inquiry-option`);
    opts.forEach(o => {
      if (!need(o, 'a chip', C.classes.option, 'label')) return;
      onlyAttrs(o, { class: true }); noText(o);
      const [inp, chip, ...z] = kids(o);
      z.forEach(x => E(x, `${label(x)}: a chip holds its checkbox and span.inquiry-chip`));
      if (!inp || inp.tag !== 'input' || !has(inp, 'inquiry-option-input')) E(inp || o, `${label(o)}: first child is <input type="checkbox" class="inquiry-option-input">`);
      else {
        onlyClasses(inp, C.classes.optionInput); onlyAttrs(inp, { type: 'checkbox', name: true, value: true, class: true, checked: true, id: ID });
        requireAttrs(inp, { type: 'checkbox', name: true, value: true });
      }
      if (!chip || !need(chip, 'the chip', C.classes.chip, 'span')) { E(chip || o, `${label(o)}: second child is span.inquiry-chip`); return; }
      onlyAttrs(chip, { class: true }); filled(chip, 'the chip');
      const ck = kids(chip);
      if (ck.length !== 1 || ck[0].tag !== 'svg' || !has(ck[0], 'inquiry-chip-tick')) E(chip, `${label(chip)}: opens with the tick, <svg class="inquiry-chip-tick">, copied as it is, then its text`);
      else svgIcon(ck[0], label(chip), C.classes.chipTick);
      if (inp && inp.attrs && inp.attrs.value !== undefined && textOf(chip).trim() && inp.attrs.value !== textOf(chip).trim().replace(/&amp;/g, '&')) W(inp, `${label(inp)}: value="${inp.attrs.value}" differs from the chip's text "${textOf(chip).trim()}" — the form sends the value`);
    });
    count++;
  }

  function checkConsent(c) {
    if (!need(c, 'the consent line', C.classes.consent, 'label')) return;
    onlyAttrs(c, { class: true }); noText(c);
    const [box, text, ...rest] = kids(c);
    rest.forEach(x => E(x, `${label(x)}: the consent line holds its checkbox and its text`));
    if (!box || box.tag !== 'input' || !has(box, 'inquiry-consent-box')) E(box || c, `${label(c)}: first child is <input type="checkbox" class="inquiry-consent-box">`);
    else { onlyClasses(box, C.classes.consentBox); onlyAttrs(box, { type: 'checkbox', id: ID, name: true, value: true, required: true, class: true }); requireAttrs(box, { type: 'checkbox' }); }
    if (!text || !need(text, 'the consent text', C.classes.consentText, 'span')) E(text || c, `${label(c)}: second child is span.inquiry-consent-text`);
    else { onlyAttrs(text, { class: true }); inlineOnly(text, C.inline.consent, 'the consent text'); filled(text, 'the consent text'); }
  }
}

function validate(root, ctx) {
  const R = rules('Inquiry form', ctx);
  const found = [];
  walk(root, n => { if (n.tag !== '#text' && n.tag !== '#root' && has(n, 'inquiry')) found.push({ el: n, kind: 'section' }); });
  for (const r of found) r.count = checkInquiry(r.el, R);
  return { found, sealed: R.sealed };
}

/* [what, edit, snippet (default SNIPPET)] */
const SNIPPET = 'inquiry-form-select.html';
const CHIPS = 'inquiry-form-chips.html';
const BAD = [
  ['a utility added to the card', h => h.replace('class="inquiry-card rv"', 'class="inquiry-card rv text-ink-900"')],
  ['an unknown background', h => h.replace(/data-bg="[^"]*"/, 'data-bg="dark"')],
  ['the background removed', h => h.replace(/ data-bg="[^"]*"/, '')],
  ['a pill given its own background', h => h.replace('<div class="section-eyebrow">', '<div class="section-eyebrow" data-bg="tint">')],
  ['data-inquiry-form removed from the form', h => h.replace('<form data-inquiry-form', '<form')],
  ['another inline handler on the form', h => h.replace('onsubmit="return false"', 'onsubmit="send(this)"')],
  ['a field without its label', h => h.replace(/\s*<label class="cf-label" for="[^"]*">[\s\S]*?<\/label>/, '')],
  ['a control without the field class', h => h.replace('<input class="cf-field"', '<input class="field"')],
  ['a checkbox as a plain field', h => h.replace(/(<input class="cf-field" id="[^"]*" type=")text(")/, '$1checkbox$2')],
  ['a style attribute on a field', h => h.replace('<input class="cf-field"', '<input style="width:50%" class="cf-field"')],
  ['an unknown field width', h => h.replace('data-span="full"', 'data-span="half"')],
  ['the submit button turned into a link', h => h.replace(/<button type="submit" class="inquiry-button btn-press group">([\s\S]*?)<\/button>/, '<a href="#" class="inquiry-button btn-press group">$1</a>')],
  ['the button made type="button"', h => h.replace('<button type="submit"', '<button type="button"')],
  ['the success state shown', h => h.replace('<div class="inquiry-success" hidden', '<div class="inquiry-success"')],
  ['a <script> in the form', h => h.replace('<div class="inquiry-fields">', '<script>track()</script><div class="inquiry-fields">')],
  ['chips: a chip without its checkbox', h => h.replace(/\s*<input type="checkbox" name="[^"]*" value="[^"]*" class="inquiry-option-input">/, ''), CHIPS],
  ['chips: a chip without a value', h => h.replace(/(<input type="checkbox" name="[^"]*") value="[^"]*"/, '$1'), CHIPS],
];
const GOOD = [
  ['new head, label, placeholder and button text', h => h.replace(/(<h2 class="section-title">)[^<]*/, '$1A new title').replace(/(<label class="cf-label" for="[^"]*">)[^<]*/, '$1Full name ').replace(/placeholder="[^"]*"/, 'placeholder="Alex Doe"').replace(/(<button type="submit" class="inquiry-button btn-press group">\s*)[^<]*/, '$1Send the request\n            ')],
  ['other variants: cool ground, wider head column, teal dot, no sticky', h => h.replace(/data-bg="[^"]*"/, 'data-bg="cool" data-layout="fluid-wide" data-accent="teal" data-sticky="off"')],
  ['the eyebrow, the intro and the line under it removed', h => h.replace(/\s*<div class="section-eyebrow">[\s\S]*?<\/div>/, '').replace(/\s*<p class="section-intro">[\s\S]*?<\/p>/, '').replace(/\s*<p class="inquiry-alt">[\s\S]*?<\/p>/, '')],
  ['a hint added under a field, a field made full width', h => h.replace(/(<input class="cf-field" id="[^"]*" type="text"[^>]*>)/, '$1\n                <p class="inquiry-help">As it appears on your badge.</p>').replace('<div class="inquiry-field">', '<div class="inquiry-field" data-span="full">')],
  ['a field copied as it is, id and all (the script repairs the pair)', h => h.replace(/(<div class="inquiry-field">[\s\S]*?<\/div>)/, '$1\n$1')],
  ['a field pasted without its id pair', h => h.replace(/(<label class="cf-label") for="[^"]*"/, '$1').replace(/(<input class="cf-field") id="[^"]*"/, '$1')],
  ['the consent line removed', h => h.replace(/\s*<label class="inquiry-consent">[\s\S]*?<\/label>/, '')],
  ['the success state removed', h => h.replace(/\s*<div class="inquiry-success"[\s\S]*?<\/div>/, '')],
  ['the prototype stub removed from the form (the backend binding takes over)', h => h.replace(' onsubmit="return false"', ' action="/inquiry" method="post"')],
  ['chips: new chip text and value, one chip removed', h => h.replace(/(<input type="checkbox" name="[^"]*") value="[^"]*"( class="inquiry-option-input">\s*<span class="inquiry-chip">\s*<svg[\s\S]*?<\/svg>)[^<]*/, '$1 value="Something else"$2Something else').replace(/\s*<label class="inquiry-option">(?:(?!<label)[\s\S])*?<\/label>(\s*<\/div>\s*<\/fieldset>)/, '$1'), CHIPS],
];

module.exports = {
  name: 'inquiry-form', title: 'Inquiry form', unit: 'fields',
  validate,
  isPart: n => ('data-inquiry-form' in n.attrs) || cls(n).some(c => /^inquiry-/.test(c)),
  outside: 'an inquiry form part outside a complete form section (section.inquiry)',
  /* a copied field brings its id with it: the script gives the copy a fresh one */
  repaired: n => has(n, 'cf-field') && inside(n, 'inquiry-field'),
  repairedNote: 'a copied field; the script gives it a fresh id on load',
  mentions: html => /\binquiry-|data-inquiry-form|class="inquiry"/.test(html),
  SNIPPET, BAD, GOOD,
};
