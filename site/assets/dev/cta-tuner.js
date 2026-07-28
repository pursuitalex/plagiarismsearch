/* ============================================================================
   CTA tuner — dev-only. Loads solely on ?tune=cta, never in the shipped page.

   Drives the --cta-* custom properties on #cta live, keeps a separate value set
   per breakpoint, persists to localStorage, and exports paste-ready CSS.

   Breakpoints mirror the media queries in index.html:
     desktop  >= 1024px   (base — no media query)
     tablet   640-1023px  (max-width:1023px)
     mobile   < 640px     (max-width:639px)
   A breakpoint only stores what you actually changed there; everything else
   inherits from desktop, so the exported CSS stays small and honest.
============================================================================ */
(() => {
  'use strict';

  const SECTION = document.getElementById('cta');
  if (!SECTION) { console.warn('[cta-tuner] no #cta on this page'); return; }

  const STORE = 'ctaTuner.v1';

  const BP = [
    { id: 'desktop', label: 'Desktop', hint: '≥ 1024', min: 1024, query: null },
    { id: 'tablet',  label: 'Tablet',  hint: '640–1023', min: 640, query: '(max-width:1023px)' },
    { id: 'mobile',  label: 'Mobile',  hint: '< 640', min: 0, query: '(max-width:639px)' },
  ];

  /* ---- schema: every knob, in panel order ---------------------------------- */
  const FIELDS = [
    { group: 'Background' },
    { key: '--cta-bg',          label: 'Plate',        type: 'color' },
    { key: '--cta-wash-angle',  label: 'Wash angle',   type: 'range', min: 0, max: 360, step: 1, unit: 'deg' },
    { key: '--cta-wash-from',   label: 'Wash start',   type: 'rgba' },
    { key: '--cta-wash-mid',    label: 'Wash middle',  type: 'rgba' },
    { key: '--cta-wash-midpos', label: 'Middle at',    type: 'range', min: 0, max: 100, step: .5, unit: '%' },
    { key: '--cta-wash-to',     label: 'Wash end',     type: 'rgba' },

    { group: 'Glow 1 · warm' },
    { key: '--cta-o1-rgb',   label: 'Colour',  type: 'rgbtriplet' },
    { key: '--cta-o1-alpha', label: 'Opacity', type: 'range', min: 0, max: 1,    step: .01, unit: '' },
    { key: '--cta-o1-w',     label: 'Width',   type: 'range', min: 200, max: 2000, step: 2, unit: 'px' },
    { key: '--cta-o1-h',     label: 'Height',  type: 'range', min: 200, max: 2000, step: 2, unit: 'px' },
    { key: '--cta-o1-x',     label: 'X',       type: 'range', min: -80, max: 140, step: .1, unit: '%' },
    { key: '--cta-o1-y',     label: 'Y',       type: 'range', min: -900, max: 900, step: 2, unit: 'px' },
    { key: '--cta-o1-mid',   label: 'Falloff mid', type: 'range', min: 0, max: 100, step: .1, unit: '%' },
    { key: '--cta-o1-end',   label: 'Falloff end', type: 'range', min: 0, max: 100, step: .1, unit: '%' },

    { group: 'Glow 2 · cool' },
    { key: '--cta-o2-rgb',   label: 'Colour',  type: 'rgbtriplet' },
    { key: '--cta-o2-alpha', label: 'Opacity', type: 'range', min: 0, max: 1,    step: .01, unit: '' },
    { key: '--cta-o2-w',     label: 'Width',   type: 'range', min: 200, max: 2000, step: 2, unit: 'px' },
    { key: '--cta-o2-h',     label: 'Height',  type: 'range', min: 200, max: 2000, step: 2, unit: 'px' },
    { key: '--cta-o2-x',     label: 'X',       type: 'range', min: -80, max: 140, step: .1, unit: '%' },
    { key: '--cta-o2-y',     label: 'Y',       type: 'range', min: -900, max: 900, step: 2, unit: 'px' },
    { key: '--cta-o2-mid',   label: 'Falloff mid', type: 'range', min: 0, max: 100, step: .1, unit: '%' },
    { key: '--cta-o2-end',   label: 'Falloff end', type: 'range', min: 0, max: 100, step: .1, unit: '%' },
  ];
  const KEYS = FIELDS.filter(f => f.key).map(f => f.key);

  /* ---- defaults: read straight off the stylesheet before we override anything */
  const DEFAULTS = {};
  {
    // strip our own inline overrides first so we read the authored CSS, not a prior session
    const saved = SECTION.getAttribute('style');
    SECTION.removeAttribute('style');
    const cs = getComputedStyle(SECTION);
    KEYS.forEach(k => DEFAULTS[k] = cs.getPropertyValue(k).trim());
    if (saved) SECTION.setAttribute('style', saved);
  }

  /* ---- state --------------------------------------------------------------- */
  let state = { desktop: {}, tablet: {}, mobile: {} };
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) Object.assign(state, JSON.parse(raw));
  } catch (e) { /* corrupt or blocked storage — start clean */ }

  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} };

  const activeBp = () => BP.find(b => innerWidth >= b.min) || BP[BP.length - 1];
  let editing = activeBp().id;
  let followViewport = true;

  /* value for a breakpoint, walking up the inheritance chain to desktop */
  const chain = id => id === 'mobile' ? ['mobile', 'tablet', 'desktop']
                    : id === 'tablet' ? ['tablet', 'desktop'] : ['desktop'];
  const valueOf = (id, k) => {
    for (const step of chain(id)) if (state[step][k] != null) return state[step][k];
    return DEFAULTS[k];
  };
  const isOverridden = (id, k) => state[id][k] != null;

  /* ---- apply: inline vars on #cta reflect the CURRENTLY RENDERED breakpoint -- */
  function apply() {
    const live = activeBp().id;
    KEYS.forEach(k => {
      const v = valueOf(live, k);
      if (v !== DEFAULTS[k]) SECTION.style.setProperty(k, v);
      else SECTION.style.removeProperty(k);
    });
  }

  /* ---- CSS export ---------------------------------------------------------- */
  function exportCss() {
    const out = [];
    const block = (id, indent) => {
      const pad = ' '.repeat(indent);
      return KEYS.filter(k => state[id][k] != null && state[id][k] !== valueOf(
                 id === 'desktop' ? 'desktop' : chain(id)[1], k))
        .map(k => `${pad}  ${k}: ${state[id][k]};`);
    };
    const base = KEYS.filter(k => state.desktop[k] != null && state.desktop[k] !== DEFAULTS[k])
      .map(k => `    ${k}: ${state.desktop[k]};`);
    out.push('  /* ---- CTA · desktop base ---- */');
    out.push('  #cta {');
    out.push(base.length ? base.join('\n') : '    /* unchanged from the authored defaults */');
    out.push('  }');

    BP.filter(b => b.query).forEach(b => {
      const lines = block(b.id, 2);
      out.push('');
      out.push(`  /* ---- CTA · ${b.label.toLowerCase()} (${b.hint}) ---- */`);
      out.push(`  @media ${b.query} { #cta {`);
      out.push(lines.length ? lines.join('\n') : '    /* nothing overridden */');
      out.push('  } }');
    });
    return out.join('\n');
  }

  /* ---- panel --------------------------------------------------------------- */
  const css = `
  #ctaTuner { position:fixed; top:12px; right:12px; width:340px; max-height:calc(100vh - 24px);
    display:flex; flex-direction:column; z-index:2147483647;
    font:12px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace; color:#E7EAF0;
    background:#12151C; border:1px solid #2A303C; border-radius:14px;
    box-shadow:0 24px 60px rgba(0,0,0,.45); overflow:hidden; }
  #ctaTuner.min { max-height:44px; }
  #ctaTuner header { display:flex; align-items:center; gap:8px; padding:12px 12px;
    background:#171B24; border-bottom:1px solid #2A303C; cursor:pointer; flex:none; }
  #ctaTuner header b { font-size:12px; letter-spacing:.04em; }
  #ctaTuner .vw { margin-left:auto; color:#7E8899; font-size:11px; }
  #ctaTuner .body { overflow-y:auto; padding:12px; flex:1; }
  #ctaTuner.min .body, #ctaTuner.min .foot { display:none; }
  #ctaTuner .bps { display:flex; gap:6px; margin-bottom:6px; }
  #ctaTuner .bps button { flex:1; padding:7px 4px; border:1px solid #2A303C; border-radius:8px;
    background:#1B2029; color:#98A2B3; cursor:pointer; font:inherit; font-size:11px; }
  #ctaTuner .bps button.on { background:#2CC3DB; border-color:#2CC3DB; color:#0A0E1A; font-weight:700; }
  #ctaTuner .bps button.live::after { content:'●'; margin-left:5px; color:#4ADE80; font-size:9px; }
  #ctaTuner .bps button.on.live::after { color:#0A0E1A; }
  #ctaTuner .note { color:#7E8899; font-size:10.5px; margin:0 0 12px; line-height:1.5; }
  #ctaTuner .note b { color:#F3B45A; }
  #ctaTuner h4 { margin:16px 0 8px; font-size:10px; letter-spacing:.16em; text-transform:uppercase;
    color:#7E8899; border-top:1px solid #232935; padding-top:12px; }
  #ctaTuner h4:first-child { margin-top:0; border-top:0; padding-top:0; }
  #ctaTuner .row { margin-bottom:9px; }
  #ctaTuner .lab { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
  #ctaTuner .lab span { color:#B6BECC; }
  #ctaTuner .lab .ov { width:5px; height:5px; border-radius:50%; background:#F3B45A; flex:none; opacity:0; }
  #ctaTuner .row.ovr .lab .ov { opacity:1; }
  #ctaTuner .lab .rst { margin-left:auto; color:#5A6474; cursor:pointer; font-size:10px;
    background:none; border:0; padding:0 2px; }
  #ctaTuner .row.ovr .lab .rst { color:#F3B45A; }
  #ctaTuner .ctl { display:flex; align-items:center; gap:8px; }
  #ctaTuner input[type=range] { flex:1; min-width:0; accent-color:#2CC3DB; height:18px; }
  #ctaTuner input[type=text] { width:74px; flex:none; background:#0C0F15; border:1px solid #2A303C;
    color:#E7EAF0; border-radius:6px; padding:4px 6px; font:inherit; font-size:11px; text-align:right; }
  #ctaTuner input[type=color] { width:34px; height:26px; flex:none; padding:0; border:1px solid #2A303C;
    border-radius:6px; background:#0C0F15; cursor:pointer; }
  #ctaTuner .foot { flex:none; padding:10px 12px; border-top:1px solid #2A303C; background:#171B24;
    display:flex; gap:6px; }
  #ctaTuner .foot button { flex:1; padding:8px 4px; border-radius:8px; border:1px solid #2A303C;
    background:#1B2029; color:#D6DBE4; cursor:pointer; font:inherit; font-size:11px; }
  #ctaTuner .foot button.pri { background:#2CC3DB; border-color:#2CC3DB; color:#0A0E1A; font-weight:700; }
  #ctaTuner .foot button:hover { filter:brightness(1.15); }
  #ctaOut { position:fixed; inset:0; z-index:2147483646; background:rgba(6,8,12,.82);
    display:none; align-items:center; justify-content:center; padding:40px; }
  #ctaOut.on { display:flex; }
  #ctaOut textarea { width:min(760px,100%); height:min(560px,80vh); background:#0C0F15; color:#C8F5FD;
    border:1px solid #2A303C; border-radius:12px; padding:16px;
    font:12px/1.6 ui-monospace,Menlo,monospace; resize:none; }`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'ctaTuner';
  document.body.appendChild(panel);

  const out = document.createElement('div');
  out.id = 'ctaOut';
  out.innerHTML = '<textarea readonly spellcheck="false"></textarea>';
  out.addEventListener('click', e => { if (e.target === out) out.classList.remove('on'); });
  document.body.appendChild(out);

  /* --- value <-> control helpers ------------------------------------------- */
  const num = v => parseFloat(v);
  const hex = c => {
    const m = String(c).match(/^#?([0-9a-f]{6})$/i);
    if (m) return '#' + m[1];
    const r = String(c).match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
    if (!r) return '#000000';
    return '#' + [r[1], r[2], r[3]].map(n => (+n | 0).toString(16).padStart(2, '0')).join('');
  };
  const alphaOf = c => { const m = String(c).match(/rgba\([^)]*,\s*([\d.]+)\s*\)/i); return m ? +m[1] : 1; };
  const hexToTriplet = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255].join(','); };
  const tripletToHex = t => '#' + t.split(',').map(n => (+n.trim() | 0).toString(16).padStart(2, '0')).join('');

  function build() {
    const live = activeBp().id;
    let h = '<header><b>CTA tuner</b><span class="vw"></span></header><div class="body">';

    h += '<div class="bps">' + BP.map(b =>
      `<button data-bp="${b.id}" class="${b.id === editing ? 'on' : ''} ${b.id === live ? 'live' : ''}">${b.label}<br><span style="opacity:.7;font-size:10px">${b.hint}</span></button>`
    ).join('') + '</div>';
    h += '<p class="note" id="ctaNote"></p>';

    FIELDS.forEach((f, i) => {
      if (f.group) { h += `<h4>${f.group}</h4>`; return; }
      const v = valueOf(editing, f.key);
      const ovr = isOverridden(editing, f.key) ? ' ovr' : '';
      h += `<div class="row${ovr}" data-key="${f.key}">
        <div class="lab"><i class="ov"></i><span>${f.label}</span>
          <button class="rst" title="reset to inherited">reset</button></div>
        <div class="ctl">`;
      if (f.type === 'range') {
        h += `<input type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${num(v)}">
              <input type="text" value="${v}">`;
      } else if (f.type === 'color') {
        h += `<input type="color" value="${hex(v)}"><input type="text" value="${v}">`;
      } else if (f.type === 'rgbtriplet') {
        h += `<input type="color" value="${tripletToHex(v)}"><input type="text" value="${v}">`;
      } else if (f.type === 'rgba') {
        h += `<input type="color" value="${hex(v)}">
              <input type="range" min="0" max="1" step=".01" value="${alphaOf(v)}" data-alpha>
              <input type="text" value="${v}" style="width:112px">`;
      }
      h += '</div></div>';
    });

    h += '</div><div class="foot">'
       + '<button data-act="reset">Reset bp</button>'
       + '<button data-act="json">JSON</button>'
       + '<button data-act="css" class="pri">Copy CSS</button>'
       + '</div>';
    panel.innerHTML = h;
    refreshChrome();
  }

  function refreshChrome() {
    const live = activeBp().id;
    panel.querySelector('.vw').textContent = innerWidth + '×' + innerHeight;
    panel.querySelectorAll('.bps button').forEach(b => {
      b.classList.toggle('on', b.dataset.bp === editing);
      b.classList.toggle('live', b.dataset.bp === live);
    });
    const note = panel.querySelector('#ctaNote');
    if (!note) return;
    note.innerHTML = editing === live
      ? 'Editing <b>' + editing + '</b> — the breakpoint your window is actually rendering. Changes are visible immediately.'
      : 'Editing <b>' + editing + '</b> but the window renders <b>' + live + '</b>. Resize to ' +
        BP.find(b => b.id === editing).hint + 'px to see it. Values still save.';
  }

  /* --- events -------------------------------------------------------------- */
  panel.addEventListener('click', e => {
    const head = e.target.closest('header');
    if (head) { panel.classList.toggle('min'); return; }

    const bp = e.target.closest('[data-bp]');
    if (bp) { editing = bp.dataset.bp; followViewport = false; build(); return; }

    const rst = e.target.closest('.rst');
    if (rst) {
      const key = rst.closest('.row').dataset.key;
      delete state[editing][key];
      save(); apply(); build();
      return;
    }

    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'reset') {
      if (confirm(`Clear every override on "${editing}"?`)) { state[editing] = {}; save(); apply(); build(); }
    } else if (act.dataset.act === 'css') {
      const text = exportCss();
      out.querySelector('textarea').value = text;
      out.classList.add('on');
      out.querySelector('textarea').select();
      navigator.clipboard && navigator.clipboard.writeText(text).catch(() => {});
    } else if (act.dataset.act === 'json') {
      const text = JSON.stringify(state, null, 2);
      out.querySelector('textarea').value = text;
      out.classList.add('on');
      navigator.clipboard && navigator.clipboard.writeText(text).catch(() => {});
    }
  });

  panel.addEventListener('input', e => {
    const row = e.target.closest('.row');
    if (!row) return;
    const key = row.dataset.key;
    const f = FIELDS.find(x => x.key === key);
    const ctl = row.querySelector('.ctl');
    const [c0, c1, c2] = ctl.children;
    let v;

    if (f.type === 'range') {
      if (e.target.type === 'range') { v = e.target.value + f.unit; c1.value = v; }
      else { v = e.target.value; c0.value = num(v); }
    } else if (f.type === 'color') {
      if (e.target.type === 'color') { v = e.target.value; c1.value = v; }
      else { v = e.target.value; c0.value = hex(v); }
    } else if (f.type === 'rgbtriplet') {
      if (e.target.type === 'color') { v = hexToTriplet(e.target.value); c1.value = v; }
      else { v = e.target.value; c0.value = tripletToHex(v); }
    } else if (f.type === 'rgba') {
      if (e.target === c2) {
        v = e.target.value; c0.value = hex(v); c1.value = alphaOf(v);
      } else {
        const h = c0.value, a = c1.value;
        const n = parseInt(h.slice(1), 16);
        v = `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
        c2.value = v;
      }
    }

    state[editing][key] = v;
    row.classList.add('ovr');
    save(); apply();
  });

  addEventListener('keydown', e => { if (e.key === 'Escape') out.classList.remove('on'); });

  addEventListener('resize', () => {
    if (followViewport) editing = activeBp().id;
    apply(); refreshChrome();
    // rebuild only when the edited bucket changed, so sliders keep focus while dragging
    if (followViewport) build();
  });

  apply();
  build();
  console.info('[cta-tuner] ready · state in localStorage.' + STORE);
})();
