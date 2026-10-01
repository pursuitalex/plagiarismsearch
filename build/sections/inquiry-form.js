/* Inquiry form — library component. One template for the qualified-inquiry section.

   CSS  build/sections/inquiry-form.css (compiled into tailwind.css, see section-head.css);
        the fields are the site's form recipe, .cf-label / .cf-field (14-forms.css)
   JS   build/assets/js/36-inquiry-form.js — hooks form[data-inquiry-form]: repairs the
        label / field id pairs at load; 35-form-arrive.js — data-focus-first
   Contract + validator  build/sections/inquiry-form.contract.js, inquiry-form.check.js
   Copy-paste catalogue  site/section-library.html (build/section-library.js)

     const inquiry = require('./sections/inquiry-form');
     inquiry.section({
       id: 'business-inquiry',
       bg: 'white',                        // 'white' | 'cool'; the pill takes the other ground itself
       layout: 'fluid-wide',               // optional: 0.9fr / 1.1fr (default 0.85fr / 1.15fr)
       accent: 'teal',                     // optional: the pill's dot (default orange)
       sticky: false,                      // optional: the head column does not follow the scroll
       head: { eyebrow, title, intro },    // the Section Header (build/sections/section-head.js)
       alt: { text: 'Prefer email? Contact us at', label, href },   // optional line under the intro
       ns: 'bq',                           // REQUIRED: the id namespace of the fields
       focusFirst: 500,                    // optional: a link to the form focuses its first field after <ms>
       fields: [ … ],                      // see below
       consent: { id, terms: 'terms-of-use.html', policy: 'policy.html' },   // optional
       submit: 'Request a business quote',
       success: { id, title, text, tag: 'h3' },   // the hidden success state; tag: 'h3' | 'p'
     })

   A field
     { label, type, id, required, native, optional, placeholder, help, wide, options, rows }
       type      'text' (default) | 'email' | 'tel' | 'textarea' | 'select'
       id        its id; default <ns>-<its number among the plain fields, from 0>
       required  the * after the label;  native: also the required attribute
       optional  the word "Optional" after the label
       wide      spans both columns
       options   (select) the choices, after an empty "Select an option"
     { choice: { legend, name, options: [..] } }   a multi-select of chips (checkboxes)

   WHAT THE TEMPLATE DOES NOT DECIDE. Which fields a form has, which are required, what it
   validates and where it submits are each page's approved brief and the backend's
   binding: the template renders what it is given. The form is inert in the prototype
   (onsubmit="return false", as every form of the site), and that stub is the binding's
   to replace.

   The text is written as given: escape it first if it is not already HTML. */
const sh = require('./section-head');
const C = require('./inquiry-form.contract');

const ARROW = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const TICK = '<svg class="inquiry-chip-tick" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const TYPES = ['text', 'email', 'tel', 'textarea', 'select'];

const need = (cond, msg) => { if (!cond) throw new Error('inquiry-form: ' + msg); };
const indent = (s, pad) => s.split('\n').map(l => (l ? pad + l : l)).join('\n');
const attr = (name, value) => (value !== undefined && value !== '' && value !== false ? ` ${name}="${value}"` : '');
const rel = href => (/^https?:/.test(href) ? ' rel="noopener"' : '');

function field(f, id) {
  const type = f.type || 'text';
  need(f.label, 'a field needs a label');
  need(TYPES.includes(type), 'field type must be one of ' + TYPES.join(', ') + ': ' + type);
  const req = f.native ? ' required' : '';
  const control = type === 'textarea'
    ? `<textarea class="cf-field" id="${id}" rows="${f.rows || 4}"${attr('placeholder', f.placeholder)}${req}></textarea>`
    : type === 'select'
      ? `<select class="cf-field" id="${id}"${req}>
  <option value="">Select an option</option>
${f.options.map(o => `  <option>${o}</option>`).join('\n')}
</select>`
      : `<input class="cf-field" id="${id}" type="${type}"${attr('placeholder', f.placeholder)}${req}>`;
  return `<div class="inquiry-field"${f.wide ? ' data-span="full"' : ''}>
  <label class="cf-label" for="${id}">${f.label}${f.required ? ' <i>*</i>' : ''}${f.optional ? ' <span class="inquiry-optional">Optional</span>' : ''}</label>
${indent(control, '  ')}${f.help ? `\n  <p class="inquiry-help">${f.help}</p>` : ''}
</div>`;
}

const choice = c => {
  need(c.legend && c.name && Array.isArray(c.options) && c.options.length, 'choice: { legend, name, options }');
  return `<fieldset class="inquiry-choice">
  <legend class="cf-label">${c.legend}</legend>
  <div class="inquiry-chips">
${c.options.map(o => `    <label class="inquiry-option">
      <input type="checkbox" name="${c.name}" value="${o}" class="inquiry-option-input">
      <span class="inquiry-chip">
        ${TICK}${o}
      </span>
    </label>`).join('\n')}
  </div>
</fieldset>`;
};

const consent = c => `<label class="inquiry-consent">
  <input type="checkbox"${attr('id', c.id)} class="inquiry-consent-box">
  <span class="inquiry-consent-text">I agree to the <a href="${c.terms}" class="inquiry-link">Terms of Use</a> and <a href="${c.policy}" class="inquiry-link">Privacy Policy</a>. <i class="inquiry-required">*</i></span>
</label>`;

function success(s) {
  const tag = s.tag || 'h3';
  need(['h3', 'p'].includes(tag), 'success.tag must be h3 or p');
  need(s.title, 'success.title is required');
  return `<div class="inquiry-success" hidden${attr('id', s.id)} role="status">
  <${tag} class="inquiry-success-title">${s.title}</${tag}>${s.text ? `\n  <p class="inquiry-success-text">${s.text}</p>` : ''}
</div>`;
}

function section(o) {
  need(o && o.head && o.head.title, 'head.title is required');
  need(C.variants.section['data-bg'].values.includes(o.bg), 'bg must be one of ' + C.variants.section['data-bg'].values.join(', '));
  need(!o.layout || o.layout === 'fluid-wide', 'layout must be fluid-wide (or none)');
  need(!o.accent || o.accent === 'teal', 'accent must be teal (or none)');
  need(o.ns && /^[a-z][a-z0-9-]*$/.test(o.ns), 'ns (the id namespace of the fields) is required: a-z, 0-9 and hyphens');
  need(Array.isArray(o.fields) && o.fields.length, 'fields are required');
  need(o.submit, 'submit (the button label) is required');
  need(o.head.more === undefined, 'the head takes eyebrow, title and intro; the line under the intro is alt');
  let n = 0;
  const fields = o.fields.map(f => (f.choice ? choice(f.choice) : field(f, f.id || `${o.ns}-${n++}`)));
  const aside = [sh.render(o.head)];
  if (o.alt) aside.push(`<p class="inquiry-alt">${o.alt.text} <a href="${o.alt.href}"${rel(o.alt.href)} class="inquiry-alt-link">${o.alt.label}</a>.</p>`);
  const form = [`<div class="inquiry-fields">
${indent(fields.join('\n'), '  ')}
</div>`];
  if (o.consent) form.push(consent(o.consent));
  form.push(`<div class="inquiry-submit">
  <button type="submit" class="inquiry-button btn-press group">
    ${o.submit}
    <span class="inquiry-button-orb icon-orb">${ARROW}</span>
  </button>
</div>`);
  return `<section${attr('id', o.id)} data-component="inquiry-form" class="inquiry" data-bg="${o.bg}"${attr('data-layout', o.layout)}${attr('data-accent', o.accent)}${o.sticky === false ? ' data-sticky="off"' : ''}>
  <div class="inquiry-inner">
    <div class="inquiry-grid">
      <div class="inquiry-aside rv">
${indent(aside.join('\n'), '        ')}
      </div>
      <div class="inquiry-card rv">
        <form data-inquiry-form${attr('data-focus-first', o.focusFirst)} onsubmit="return false" novalidate>
${indent(form.join('\n'), '          ')}
        </form>${o.success ? '\n' + indent(success(o.success), '        ') : ''}
      </div>
    </div>
  </div>
</section>`;
}

module.exports = { section };
