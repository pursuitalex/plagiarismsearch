/* The quick-check form — one component, every checker-first page.

   It lived inside build/home-v2.js until the Students page needed it. The briefs for the
   audience and file-format pages (Students, PDF, later PowerPoint) each say the same
   thing: use the real production checker component, "not a fake form or screenshot", and
   "do not reimplement a separate simplified checker solely for this landing". A second
   copy of the markup would be exactly that. So the form lives here and the homepage
   renders through it, byte for byte what it rendered before.

   The markup is the homepage's, unchanged: field with its count in the corner, drop
   zone, input chips, the two checks beside the button under a rule, and the free line
   under the card. Inert — no action, submit returns false; a developer binds it to the
   production checker. What varies per page is copy (placeholder, formats, the two
   labels, the CTA, the free line) and the anchor the CTA scrolls to.

     const checker = require('./checker');
     checker.form(copy, '#checker')   // the card
     checker.free(copy)               // the sparkles line under it
     checker.style                    // .qc-* and .sw rules, once per page
     checker.script                   // word count + switches, inside a page script

   `copy` needs: placeholder, formats, inputs[{label, icon:'lucide'|'brand', path|file}],
   checkPlagiarism, checkAI, cta, free.

   STATIC MODE — form(copy, anchor, ids, { static: true }) — for pages on the shared
   production assets (build/assets.js). Same markup, same classes; only the hooks change:
   JS finds the form by [data-checker], [data-checker-text], [data-checker-count] and
   [data-switch] instead of by id, so two forms on one page cannot collide. The one id
   left is the label/textarea pair, which accessibility needs and the template writes —
   pass ids.text to namespace it per instance. Asset paths are root-relative. The
   default (no opts) is byte-for-byte what every other page renders today. */

const ICON = 'w-[14px] h-[14px] sm:w-4 sm:h-4';
const UPLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>';
const SPARKLES = '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>';

/* the four input methods */
const NL12 = String.fromCharCode(10) + '            ';
const chipGlyph = (i, root = '') => {
  const glyph = i.icon === 'brand'
    ? `<img src="${root}assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="${ICON} shrink-0">`
    : `<svg class="${ICON} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${i.path}</svg>`;
  return `<button type="button" class="qc-chip">${glyph}${i.label}</button>`;
};

/* the approved input methods, the homepage's — a page may pass its own */
const INPUTS = [
  { label: 'Attach file', icon: 'lucide', path: '<path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/>' },
  { label: 'Dropbox',     icon: 'brand',  file: 'dropbox.svg' },
  { label: 'OneDrive',    icon: 'brand',  file: 'onedrive.svg' },
  { label: 'By URL',      icon: 'lucide', path: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>' },
];

const form = (S, anchor = '#checker', ids = {}, opts = {}) => {
  const ta = ids.text || 'checkText', wc = ids.count || 'wordCount', plag = ids.plag || 'optPlag', ai = ids.ai || 'optAI';
  const st = !!opts.static;
  return `      <div class="rv max-w-[860px] mx-auto rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
        <form${st ? ' data-checker' : ''} class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6" onsubmit="return false">

          <label for="${ta}" class="sr-only">${S.placeholder}</label>
          <!-- the count belongs to the text, so it sits in the corner of the field
               rather than in a footer two rows away from what it counts -->
          <div class="relative mb-4">
            <textarea id="${ta}"${st ? ' data-checker-text' : ''} rows="4" class="qc-area block pr-24" placeholder="${S.placeholder}"></textarea>
            <span class="pointer-events-none absolute bottom-0 right-0 text-[12px] font-medium text-ink-400 nums"><span ${st ? 'data-checker-count' : `id="${wc}"`}>0</span> / 150 words</span>
          </div>

          <!-- Below 768 there is no pointer to drag with, so the drop zone goes and the
               formats line it carried reappears under the input chips instead. The two
               are exclusive — one display query, never both on screen — so the approved
               sentence still appears exactly once at any width. -->
          <div class="qc-drop hidden md:flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-3.5 mb-3">
            <span class="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-black/5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0991A8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${UPLOAD}</svg>
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-[13.5px] font-bold tracking-tight">Drag and drop a file here</span>
              <span class="block text-[12px] text-ink-500">${S.formats}</span>
            </span>
          </div>

          <div class="flex flex-wrap gap-2 mb-2 md:mb-4 lg:mb-5">
            ${(S.inputs || INPUTS).map(i => chipGlyph(i, st ? '/' : '')).join(NL12)}
          </div>
          <p class="md:hidden text-[11.5px] sm:text-[12px] leading-relaxed text-ink-500 mb-4">${S.formats}</p>

          <!-- The two checks sit beside the button they modify, not in a row of their own.
               The row itself never wraps: the button keeps the right edge at every width,
               and it is the checks that give — side by side where they fit, stacked below
               640 where the pair needs about 300px and the form only has 295. -->
          <div class="flex items-center justify-between gap-4 sm:gap-6 pt-4 mt-1 border-t border-ink-100">
            <div class="min-w-0 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-x-5 sm:gap-y-3">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox"${st ? '' : ` id="${plag}"`} checked class="sr-only peer">
                <span class="sw on" ${st ? 'data-switch' : `data-for="${plag}"`}></span>
                <span class="text-[13px] sm:text-[13.5px] font-semibold text-ink-900">${S.checkPlagiarism}</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox"${st ? '' : ` id="${ai}"`} class="sr-only peer">
                <span class="sw" ${st ? 'data-switch' : `data-for="${ai}"`}></span>
                <span class="text-[13px] sm:text-[13.5px] font-medium text-ink-600">${S.checkAI}</span>
              </label>
            </div>
            <a href="${anchor}" class="btn-press group shrink-0 flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
              ${S.cta}
              <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </span>
            </a>
          </div>
        </form>
      </div>`;
};

/* the free line under the card */
const free = S => `      <p class="mt-5 sm:mt-6 flex items-center justify-center gap-2 text-[13.5px] sm:text-[14.5px] font-semibold text-ink-700">
        <svg class="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC5A45" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SPARKLES}</svg>
        ${S.free}
      </p>`;

/* the rules the form needs; the page's own <style> includes them once */
const style = `  /* ---------- the quick-check form (build/checker.js) ---------- */
  .qc-area { width:100%; border:0; outline:none; background:transparent; resize:none;
    font-size:15px; line-height:1.6; font-weight:500; color:#111827; }
  .qc-area::placeholder { color:#9CA3AF; font-weight:400; }

  .qc-chip { display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 14px;
    border-radius:9999px; background:#F1F2F6; color:#4B5563; font-size:12.5px; font-weight:600;
    transition:background-color .2s ease, color .2s ease; }
  .qc-chip:hover { background:#E5E7EB; color:#111827; }
  .qc-drop { border:1.5px dashed #A7E3ED; border-radius:16px; background:#F8FDFE;
    transition:border-color .2s ease, background-color .2s ease; }
  .qc-drop:hover { border-color:#2CC3DB; background:#F0FAFC; }

  /* the two checks */
  .sw { width:38px; height:22px; border-radius:999px; background:rgba(16,24,40,.14);
        position:relative; transition:background .25s cubic-bezier(.32,.72,0,1); flex:none; }
  .sw::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px;
        border-radius:999px; background:#fff; box-shadow:0 1px 3px rgba(16,24,40,.3);
        transition:transform .25s cubic-bezier(.32,.72,0,1); }
  .sw.on { background:#0D9488; }
  .sw.on::after { transform:translateX(16px); }
  @media (prefers-reduced-motion: reduce) { .sw, .sw::after { transition:none; } }`;

/* the behaviour: the count, the switches, and every link to the form's anchor puts the
   caret in the field — "return/focus the real checker", not a second one */
const script = (anchor = '#checker', ids = {}) => `
  /* the quick-check form (build/checker.js) */
  [['${ids.text || 'checkText'}', '${ids.count || 'wordCount'}']].forEach(pair => {
    const ta = document.getElementById(pair[0]), wc = document.getElementById(pair[1]);
    if (!ta || !wc) return;
    ta.addEventListener('input', () => {
      const w = ta.value.trim() ? ta.value.trim().split(/\\s+/).length : 0;
      wc.textContent = w;
      wc.style.color = w > 150 ? '#B84431' : '';
    });
  });
  document.querySelectorAll('.sw[data-for]').forEach(sw => {
    const input = document.getElementById(sw.dataset.for);
    if (!input) return;
    input.addEventListener('change', () => sw.classList.toggle('on', input.checked));
  });
  document.querySelectorAll('a[href="${anchor}"]').forEach(a => {
    a.addEventListener('click', () => {
      const ta = document.getElementById('${ids.text || 'checkText'}');
      if (ta) setTimeout(() => ta.focus({ preventScroll: true }), 400);
    });
  });`;

/* The states the form can be in, drawn on the design-system page by
   build/design-system-checker.js. No page ships them yet: a developer binding the form to
   the production checker toggles these classes (is-focus / is-near / is-over / is-armed /
   is-over / is-disabled / is-reading / is-ready / is-error / is-busy). Every property a
   state changes lives here and not in a utility on the same element, so a state class
   never loses to a Tailwind utility loaded after it. */
const states = `  /* ---------- the quick-check form · states (build/checker.js) ---------- */
  /* focus: the field has no border of its own, so the card carries the ring */
  .qc-shell { outline:2px solid transparent; outline-offset:-1px; transition:outline-color .15s ease; }
  .qc-shell:has(.qc-area:focus), .qc-shell.is-focus { outline-color:#0CA9C3; }

  /* input chips */
  .qc-chip:focus-visible, .qc-chip.is-focus { outline:2px solid #0CA9C3; outline-offset:2px; }
  .qc-chip.is-active { background:#111827; color:#fff; }
  .qc-chip[aria-disabled="true"] { background:#F8F9FB; color:#C4C8CF; cursor:not-allowed; }
  .qc-chip[aria-disabled="true"] img { opacity:.4; filter:grayscale(1); }

  /* the word count: quiet, amber from 90% of the free limit, orange-700 past it */
  .qc-count { font-size:12px; font-weight:500; color:#9CA3AF; transition:color .2s ease; }
  .qc-count.is-near { color:#B45309; }
  .qc-count.is-over { color:#B84431; font-weight:700; }

  /* the drop zone: armed while a file is dragged anywhere over the page, over when it
     is dragged onto the zone, disabled when the batch is full */
  .qc-drop-icon { width:40px; height:40px; border-radius:12px; flex:none; display:flex; align-items:center;
    justify-content:center; background:#fff; color:#0991A8; box-shadow:0 0 0 1px rgba(0,0,0,.05);
    transition:transform .25s cubic-bezier(.32,.72,0,1), background-color .2s ease, color .2s ease; }
  .qc-drop-title { display:block; font-size:13.5px; font-weight:700; letter-spacing:-.01em; color:#111827; }
  .qc-drop-hint { display:block; font-size:12px; color:#6B7280; }
  .qc-drop.is-armed { border-color:#2CC3DB; background:#F0FAFC; }
  .qc-drop.is-over { border-style:solid; border-color:#0CA9C3; background:#E8F8FB; box-shadow:0 0 0 4px rgba(12,169,195,.14); }
  .qc-drop.is-over .qc-drop-icon { background:#0CA9C3; color:#fff; transform:translateY(-2px); }
  .qc-drop.is-disabled, .qc-drop.is-disabled:hover { border-color:#E5E7EB; background:#F8F9FB; cursor:not-allowed; }
  .qc-drop.is-disabled .qc-drop-icon { background:#F1F2F6; color:#9CA3AF; box-shadow:none; }
  .qc-drop.is-disabled .qc-drop-title { color:#6B7280; }
  .qc-drop:focus-visible { outline:2px solid #0CA9C3; outline-offset:2px; }

  /* files: one row per file, the state in the row, the error under the name */
  .qc-files { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
  .qc-files-head { display:flex; align-items:center; justify-content:space-between; gap:12px;
    font-size:12px; font-weight:600; color:#6B7280; font-variant-numeric:tabular-nums; }
  .qc-files-head button { font-weight:700; color:#374151; text-decoration:underline; text-decoration-color:#D1D5DB; text-underline-offset:3px; }
  .qc-files-head button:hover { color:#111827; }
  .qc-file { position:relative; overflow:hidden; display:flex; align-items:center; gap:12px; min-height:60px;
    padding:10px 10px 10px 12px; border-radius:14px; background:#F8F9FB; box-shadow:inset 0 0 0 1px rgba(17,24,39,.06); }
  .qc-file-type { flex:none; width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center;
    font-size:9px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; background:#fff; color:#374151;
    box-shadow:0 0 0 1px rgba(0,0,0,.06); }
  .qc-file-type[data-ext="pdf"] { background:#FEF4F1; color:#B84431; }
  .qc-file-type[data-ext="doc"], .qc-file-type[data-ext="docx"] { background:#E8F8FB; color:#06748A; }
  .qc-file-type[data-ext="ppt"], .qc-file-type[data-ext="pptx"] { background:#FFFBEB; color:#B45309; }
  .qc-file-type[data-ext="xls"], .qc-file-type[data-ext="xlsx"] { background:#EDFAF4; color:#1B7A50; }
  .qc-file-body { min-width:0; flex:1; }
  .qc-file-name { display:block; font-size:13.5px; font-weight:700; color:#111827; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .qc-file-meta { display:flex; align-items:center; gap:6px; margin-top:1px; font-size:12px; font-weight:500; color:#6B7280; font-variant-numeric:tabular-nums; }
  .qc-file-meta svg { flex:none; }
  .qc-file-msg { display:block; margin-top:2px; font-size:12px; font-weight:500; line-height:1.45; color:#B84431; }
  .qc-file-msg a { font-weight:700; text-decoration:underline; text-decoration-color:#F8A392; text-underline-offset:3px; }
  .qc-file-ok { color:#2AA46C; }
  .qc-file-act { flex:none; display:flex; gap:2px; }
  .qc-file-btn { width:32px; height:32px; border-radius:9999px; display:inline-flex; align-items:center; justify-content:center;
    color:#6B7280; transition:background-color .15s ease, color .15s ease; }
  .qc-file-btn:hover { background:#E5E7EB; color:#111827; }
  .qc-file-btn:focus-visible { outline:2px solid #0CA9C3; outline-offset:1px; }
  .qc-file-bar { position:absolute; left:0; right:0; bottom:0; height:3px; overflow:hidden; background:rgba(12,169,195,.14); }
  .qc-file-bar > i { display:block; height:100%; width:var(--p, 0%); background:#0CA9C3; border-radius:0 3px 3px 0; transition:width .3s ease; }
  .qc-file.is-reading .qc-file-bar > i { width:30%; animation:qc-indet 1.3s cubic-bezier(.4,0,.2,1) infinite; }
  .qc-file.is-error { background:#FEF4F1; box-shadow:inset 0 0 0 1px #FBC9BF; }
  .qc-file.is-error .qc-file-btn:hover { background:#FDE5E0; color:#8C2E1F; }

  /* messages: a note sits under what it is about; an alert speaks for the whole form */
  .qc-note { display:flex; align-items:flex-start; gap:8px; margin:-4px 0 14px; font-size:12.5px; font-weight:500; line-height:1.5; }
  .qc-note svg { flex:none; margin-top:2px; }
  .qc-note a { font-weight:700; text-decoration:underline; text-underline-offset:3px; }
  .qc-note.is-error { color:#B84431; }
  .qc-note.is-error a { text-decoration-color:#F8A392; }
  .qc-note.is-warn { color:#92400E; }
  .qc-note.is-warn a { text-decoration-color:#FCD34D; }
  .qc-note.is-info { color:#4B5563; }
  .qc-alert { display:flex; align-items:flex-start; gap:10px; margin-bottom:14px; padding:12px 12px 12px 14px;
    border-radius:14px; font-size:13px; line-height:1.55; }
  .qc-alert > svg { flex:none; margin-top:2px; }
  .qc-alert-body { min-width:0; flex:1; }
  .qc-alert-title { display:block; font-weight:700; }
  .qc-alert-actions { display:flex; flex-wrap:wrap; gap:4px 16px; margin-top:6px; }
  .qc-alert-actions a, .qc-alert-actions button { font-weight:700; text-decoration:underline; text-underline-offset:3px; }
  .qc-alert .qc-file-btn { margin:-6px -4px -6px 0; color:inherit; }
  .qc-alert .qc-file-btn:hover { background:rgba(17,24,39,.06); color:inherit; }
  .qc-alert.is-error { background:#FEF4F1; color:#8C2E1F; box-shadow:inset 0 0 0 1px #FBC9BF; }
  .qc-alert.is-error > svg { color:#B84431; }
  .qc-alert.is-warn { background:#FFFBEB; color:#78350F; box-shadow:inset 0 0 0 1px #FDE68A; }
  .qc-alert.is-warn > svg { color:#B45309; }
  .qc-alert.is-info { background:#E8F8FB; color:#045566; box-shadow:inset 0 0 0 1px #A7E3ED; }
  .qc-alert.is-info > svg { color:#0991A8; }
  .qc-alert.is-success { background:#EDFAF4; color:#1B7A50; box-shadow:inset 0 0 0 1px #B3E9D1; }
  .qc-alert.is-success > svg { color:#2AA46C; }

  /* the balance alert: a line per check, then the way on under a hairline */
  .qc-alert-lines { display:flex; flex-direction:column; gap:2px; }
  .qc-alert-lines b { font-weight:800; font-variant-numeric:tabular-nums; }
  .qc-alert-foot { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px 16px;
    margin-top:10px; padding-top:10px; border-top:1px solid rgba(140,46,31,.14); }
  .qc-alert-foot a:not(.qc-buy) { font-weight:700; text-decoration:underline; text-underline-offset:3px; }
  .qc-buy { flex:none; display:inline-flex; align-items:center; gap:10px; height:36px; padding:0 5px 0 14px; border-radius:9999px;
    background:#fff; color:#111827; font-size:13px; font-weight:600; box-shadow:0 0 0 1px #FBC9BF;
    transition:box-shadow .15s ease; }
  .qc-buy:hover { box-shadow:0 0 0 1px #F58971; }
  .qc-buy:focus-visible { outline:2px solid #0CA9C3; outline-offset:2px; }
  .qc-buy-price { display:inline-flex; align-items:center; height:26px; padding:0 9px; border-radius:9999px;
    background:#FEF4F1; color:#8C2E1F; font-size:12px; font-weight:700; font-variant-numeric:tabular-nums; }
  .qc-file-done { color:#1B7A50; font-weight:600; }
  .qc-cta[aria-disabled="true"]:not([aria-busy="true"]) { cursor:not-allowed; }

  /* by URL: the field opens under the chips */
  .qc-url { display:flex; align-items:center; gap:8px; height:48px; margin-bottom:12px; padding:0 5px 0 14px;
    border-radius:14px; border:1px solid #E5E7EB; background:#fff; transition:border-color .15s ease, box-shadow .15s ease; }
  .qc-url > svg { flex:none; color:#9CA3AF; }
  .qc-url input { min-width:0; flex:1; height:100%; border:0; outline:0; background:transparent; font:inherit;
    font-size:14px; font-weight:500; color:#111827; }
  .qc-url input::placeholder { color:#9CA3AF; font-weight:400; }
  .qc-url:focus-within, .qc-url.is-focus { border-color:#0CA9C3; box-shadow:0 0 0 1px #0CA9C3; }
  .qc-url.is-error { border-color:#F58971; box-shadow:0 0 0 1px #F58971; }
  .qc-url + .qc-note { margin-top:-6px; }
  .qc-url-btn { flex:none; display:inline-flex; align-items:center; gap:8px; height:38px; padding:0 16px; border-radius:10px;
    background:#111827; color:#fff; font-size:13px; font-weight:600; transition:background-color .15s ease; }
  .qc-url-btn:hover { background:#1F2937; }
  .qc-url-btn[aria-busy="true"] { background:#374151; cursor:progress; }

  /* busy: the check is starting — the form holds still, the button says so */
  .qc-spin { display:inline-block; flex:none; width:14px; height:14px; border-radius:9999px;
    border:2px solid currentColor; border-top-color:transparent; animation:qc-spin .8s linear infinite; }
  .qc-form.is-busy .qc-area, .qc-form.is-busy .qc-files, .qc-form.is-busy .qc-drop,
  .qc-form.is-busy .qc-chip, .qc-form.is-busy label { opacity:.5; pointer-events:none; transition:opacity .2s ease; }
  .qc-cta[aria-busy="true"] { cursor:progress; }
  .qc-status { display:flex; align-items:center; gap:10px; margin-top:16px; padding-top:16px; border-top:1px solid #F1F2F6;
    font-size:13px; font-weight:600; color:#374151; }
  .qc-status.is-done { color:#1B7A50; }
  .qc-status a { text-decoration:underline; text-underline-offset:3px; }

  @keyframes qc-spin { to { transform:rotate(360deg); } }
  @keyframes qc-indet { from { transform:translateX(-100%); } to { transform:translateX(340%); } }
  @media (prefers-reduced-motion: reduce) {
    .qc-spin { animation:none; border-top-color:currentColor; opacity:.5; }
    .qc-file.is-reading .qc-file-bar > i { animation:none; width:100%; opacity:.45; }
    .qc-shell, .qc-drop-icon, .qc-file-bar > i { transition:none; }
  }`;

module.exports = { form, free, style, script, states, INPUTS, ICON };

