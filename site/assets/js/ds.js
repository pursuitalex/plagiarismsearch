/* ds.js — built by build/assets.js from build/assets/ds/ds.js. Do not edit here. */
/* ds.js — the design-system page's own tools, not part of the site. Loaded by
   site/design-system.html only, after site.js. The components the page shows are wired by
   site.js like on any page; this file is the spec sheet around them: the checker-state
   list and its demo forms, the rendered ramps, type scale, spacing, radii, icons and
   anti-patterns, copy-to-clipboard and the section nav. Verbatim from the page's former
   inline scripts, but for the renamed hooks (.ds-sw, [data-ds-toast], [data-ds-nav]). */

/* ── Checker states: the state list is a tab list — arrows move, Home/End jump, the hash
      opens a state; the demo forms' switches and word count work ── */
/* the state list: a tab list — arrows move, Home/End jump, the hash opens a state */
(function () {
  var root = document.getElementById('checker-states');
  if (!root) return;
  var tabs = [].slice.call(root.querySelectorAll('.qcx-tab'));
  function show(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      show(t);
      history.replaceState(null, '', '#' + t.getAttribute('aria-controls'));
    });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = i;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % tabs.length;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = tabs.length - 1;
      else return;
      e.preventDefault();
      show(tabs[j], true);
    });
  });
  var hit = location.hash && root.querySelector('.qcx-tab[aria-controls="' + location.hash.slice(1) + '"]');
  if (hit) { show(hit); root.scrollIntoView(); }
  /* the switches and the word count work, so a state can be poked at */
  root.querySelectorAll('.sw[data-for]').forEach(function (sw) {
    var input = document.getElementById(sw.dataset.for);
    if (input) input.addEventListener('change', function () { sw.classList.toggle('on', input.checked); });
  });
  root.querySelectorAll('.qc-area').forEach(function (ta) {
    var c = document.getElementById(ta.id.replace(/-text$/, '-count'));
    if (!c) return;
    ta.addEventListener('input', function () {
      var w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
      c.textContent = w;
      var box = c.parentNode;
      if (!box.classList.contains('qc-count')) { c.style.color = w > 150 ? '#B84431' : ''; return; }
      box.classList.toggle('is-near', w >= 135 && w <= 150);
      box.classList.toggle('is-over', w > 150);
    });
  });
})();

/* ── the spec sheet ── */
(function () {
  'use strict';

  /* ---------- palette ---------- */
  var RAMPS = [
    { name:'orange', label:'Brand — Orange', note:'500 is brand-locked', shades:{50:'#FEF4F1',100:'#FDE5E0',200:'#FBC9BF',300:'#F8A392',400:'#F58971',500:'#F36F5A',600:'#DC5A45',700:'#B84431',800:'#8C2E1F',900:'#5D1E13'} },
    { name:'teal',   label:'Brand — Teal',   note:'500 is brand-locked', shades:{50:'#E8F8FB',100:'#D3F1F6',200:'#A7E3ED',300:'#6ED7E8',400:'#2CC3DB',500:'#0CA9C3',600:'#0991A8',700:'#06748A',800:'#045566',900:'#023744'} },
    { name:'mint',   label:'Success — Mint', note:'originality, passed states', shades:{50:'#EDFAF4',100:'#DCF5EA',200:'#B3E9D1',400:'#5ED2A0',500:'#3AC184',600:'#2AA46C',700:'#1B7A50'} },
    { name:'ink',    label:'Neutral — Ink',  note:'text, surfaces, borders', shades:{0:'#FFFFFF',50:'#F8F9FB',100:'#F1F2F6',200:'#E5E7EB',300:'#D1D5DB',400:'#9CA3AF',500:'#6B7280',600:'#4B5563',700:'#374151',800:'#1F2937',900:'#111827',950:'#0A0E1A'} }
  ];

  /* Relative luminance → decide whether the shade label sits light or dark. */
  function lum(hex) {
    var c = [1,3,5].map(function (i) {
      var v = parseInt(hex.substr(i,2),16) / 255;
      return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4);
    });
    return .2126*c[0] + .7152*c[1] + .0722*c[2];
  }

  var ramps = document.getElementById('ramps');
  RAMPS.forEach(function (r) {
    var keys = Object.keys(r.shades);
    var head = '<div class="flex items-baseline gap-3 mb-3">' +
               '<h3 class="text-[17px] font-bold tracking-tightest">' + r.label + '</h3>' +
               '<span class="text-[12.5px] text-ink-400">' + r.note + '</span></div>';
    var cells = keys.map(function (k) {
      var hex = r.shades[k];
      var dark = lum(hex) < .45;
      return '<button class="ds-sw text-left" data-copy="' + hex + '">' +
             '<div class="ds-sw-chip flex items-end p-2" style="background:' + hex + '">' +
             '<span class="text-[10.5px] font-bold ' + (dark ? 'text-white/80' : 'text-ink-900/55') + '">' + k + '</span></div>' +
             '<div class="mt-1.5 text-[10.5px] font-semibold text-ink-500 uppercase">' + hex + '</div></button>';
    }).join('');
    ramps.insertAdjacentHTML('beforeend',
      '<div>' + head + '<div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-2">' + cells + '</div></div>');
  });

  /* ---------- type scale ---------- */
  var SCALE = [
    { n:'display/xl', d:72, t:56, m:40, w:800, ls:'-.03em',  s:'Plagiarism + AI' },
    { n:'display/lg', d:64, t:48, m:36, w:800, ls:'-.028em', s:'Detection in one' },
    { n:'heading/h1', d:56, t:40, m:32, w:800, ls:'-.02em',  s:'Every source, checked' },
    { n:'heading/h2', d:40, t:32, m:28, w:700, ls:'-.015em', s:'How the scan works' },
    { n:'heading/h3', d:28, t:24, m:22, w:700, ls:'-.01em',  s:'Institution plans' },
    { n:'body/lg',    d:18, t:17, m:16, w:400, ls:'0',       s:'We compare your text against 14 billion indexed pages and flag AI-written passages in the same pass.' },
    { n:'body/md',    d:16, t:15, m:15, w:400, ls:'0',       s:'Plans start at $9.95 with no subscription required.' },
    { n:'ui/md',      d:15, t:14, m:14, w:600, ls:'0',       s:'Check my text' },
    { n:'ui/caps',    d:12, t:12, m:11, w:800, ls:'.08em',   s:'Plagiarism + AI detection', up:true }
  ];
  var ts = document.getElementById('typeScale');
  SCALE.forEach(function (t) {
    ts.insertAdjacentHTML('beforeend',
      '<div class="grid lg:grid-cols-[180px_minmax(0,1fr)] gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-2 items-baseline pb-4 sm:pb-5 lg:pb-6 border-b border-ink-100">' +
        '<div><div class="text-[12.5px] font-bold text-ink-900">' + t.n + '</div>' +
        '<div class="text-[11.5px] text-ink-400 nums">' + t.d + ' / ' + t.t + ' / ' + t.m + ' px</div></div>' +
        '<div style="font-size:' + t.d + 'px; font-weight:' + t.w + '; letter-spacing:' + t.ls +
        '; line-height:' + (t.d > 30 ? '1.02' : '1.5') + (t.up ? '; text-transform:uppercase' : '') +
        '" class="text-ink-900 break-words">' + t.s + '</div>' +
      '</div>');
  });

  /* ---------- spacing ---------- */
  var BANDS = [
    { label:'Micro · fixed across breakpoints', note:'component internals — icon gaps, chip padding', vals:[2,4,6,8,10,12] },
    { label:'Component · ~80% tablet, 65% mobile', note:'card padding, stack gaps', vals:[16,20,24,28,32,36,40] },
    { label:'Layout · ~75% tablet, 55% mobile', note:'section rhythm', vals:[48,64,80,96,128] }
  ];
  var sp = document.getElementById('spacing');
  BANDS.forEach(function (b) {
    var bars = b.vals.map(function (v) {
      return '<button class="ds-sw text-left" data-copy="' + v + 'px">' +
             '<div class="rounded bg-orange-300" style="width:' + Math.min(v, 128) + 'px;height:14px"></div>' +
             '<div class="mt-1.5 text-[11px] font-semibold text-ink-500 nums">' + v + '</div></button>';
    }).join('');
    sp.insertAdjacentHTML('beforeend',
      '<div><div class="text-[13.5px] font-bold mb-1">' + b.label + '</div>' +
      '<div class="text-[12.5px] text-ink-400 mb-4">' + b.note + '</div>' +
      '<div class="flex flex-wrap items-end gap-x-4 lg:gap-x-5 gap-y-3">' + bars + '</div></div>');
  });

  /* ---------- radii ---------- */
  var RADII = [
    ['none',0],['xs',2],['sm',4],['md',8],['lg',12],['xl',16],['2xl',20],['3xl',24],['full',999]
  ];
  var rd = document.getElementById('radii');
  RADII.forEach(function (r) {
    var isDefault = r[0] === 'lg';
    rd.insertAdjacentHTML('beforeend',
      '<button class="ds-sw text-left" data-copy="' + r[1] + 'px">' +
      '<div class="w-20 h-20 bg-ink-100 border border-ink-200" style="border-radius:' + r[1] + 'px"></div>' +
      '<div class="mt-2 text-[12px] font-bold">' + r[0] + '</div>' +
      '<div class="text-[11px] text-ink-400 nums">' + (r[1] === 999 ? '999' : r[1] + 'px') +
      (isDefault ? ' · default' : '') + '</div></button>');
  });

  /* ---------- icons (Lucide, 24×24 / 2px stroke) ---------- */
  var ICONS = {
    'arrow-right':'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>',
    'menu':'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    'x':'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'search':'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'check':'<path d="M20 6 9 17l-5-5"/>',
    'check-circle':'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'info':'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'alert-circle':'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    'mail':'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'globe':'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    'lock':'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'shield-check':'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'file-text':'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'upload':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    'download':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    'external-link':'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'play':'<polygon points="6 3 20 12 6 21 6 3"/>',
    'sparkles':'<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 3.28a2 2 0 0 0 1.872 1.36h3.443a1 1 0 0 1 .607 1.79l-2.785 2.13a2 2 0 0 0-.715 2.2l1.05 3.28a1 1 0 0 1-1.59 1.12l-2.785-2.13a2 2 0 0 0-2.302 0l-2.785 2.13a1 1 0 0 1-1.59-1.12l1.05-3.28a2 2 0 0 0-.715-2.2L3.04 9.244a1 1 0 0 1 .608-1.79h3.443a2 2 0 0 0 1.872-1.36z"/>',
    'copy':'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'eye':'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'zap':'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
  };
  var ig = document.getElementById('iconGrid');
  Object.keys(ICONS).forEach(function (n) {
    ig.insertAdjacentHTML('beforeend',
      '<button class="ds-sw flex flex-col items-center justify-center gap-2.5 rounded-xl sm:rounded-[14px] lg:rounded-2xl border border-ink-100 py-4 lg:py-5 hover:border-ink-300 hover:bg-ink-50" data-copy="icon/' + n + '">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[n] + '</svg>' +
      '<span class="text-[10.5px] font-semibold text-ink-500 text-center leading-tight px-1">' + n + '</span></button>');
  });

  /* ---------- anti-patterns ---------- */
  var ANTI = ['Stock photos','3 evenly-stacked feature columns','Gradient on H1 text','Pure-orange background',
              'Live chat widget','Carousel hero','12-tier pricing','Solid or emoji icons',
              'Linear / Vercel / Stripe carbon copy'];
  var al = document.getElementById('antiList');
  ANTI.forEach(function (a) {
    al.insertAdjacentHTML('beforeend',
      '<li class="flex items-center gap-3 rounded-xl border border-ink-100 px-4 py-3.5">' +
      '<svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC4444" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
      '<span class="text-[13.5px] font-medium text-ink-600">' + a + '</span></li>');
  });

  /* ---------- copy to clipboard ---------- */
  var toast = document.querySelector('[data-ds-toast]'), toastTimer;
  function flash(msg) {
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 8px)';
    }, 1400);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-copy]');
    if (!el) return;
    var val = el.getAttribute('data-copy');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val).then(function () { flash('Copied ' + val); },
                                             function () { flash(val); });
    } else {
      flash(val);
    }
  });

  /* ---------- nav highlighting ---------- */
  var links = [].slice.call(document.querySelectorAll('[data-ds-nav] a'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-88px 0px -70% 0px', threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }
})();
