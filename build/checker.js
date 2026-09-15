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
   checkPlagiarism, checkAI, cta, free. */

const ICON = 'w-[14px] h-[14px] sm:w-4 sm:h-4';
const UPLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>';
const SPARKLES = '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>';

/* the four input methods */
const NL12 = String.fromCharCode(10) + '            ';
const chipGlyph = i => {
  const glyph = i.icon === 'brand'
    ? `<img src="assets/svg/partners/${i.file}" alt="" aria-hidden="true" class="${ICON} shrink-0">`
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

const form = (S, anchor = '#checker', ids = {}) => {
  const ta = ids.text || 'checkText', wc = ids.count || 'wordCount', plag = ids.plag || 'optPlag', ai = ids.ai || 'optAI';
  return `      <div class="rv max-w-[860px] mx-auto rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.025] ring-1 ring-black/[.12] p-1.5 sm:p-2 shadow-diffuse">
        <form class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl p-4 sm:p-5 lg:p-6" onsubmit="return false">

          <label for="${ta}" class="sr-only">${S.placeholder}</label>
          <!-- the count belongs to the text, so it sits in the corner of the field
               rather than in a footer two rows away from what it counts -->
          <div class="relative mb-4">
            <textarea id="${ta}" rows="4" class="qc-area block pr-24" placeholder="${S.placeholder}"></textarea>
            <span class="pointer-events-none absolute bottom-0 right-0 text-[12px] font-medium text-ink-400 nums"><span id="${wc}">0</span> / 150 words</span>
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
            ${(S.inputs || INPUTS).map(chipGlyph).join(NL12)}
          </div>
          <p class="md:hidden text-[11.5px] sm:text-[12px] leading-relaxed text-ink-500 mb-4">${S.formats}</p>

          <!-- The two checks sit beside the button they modify, not in a row of their own.
               The row itself never wraps: the button keeps the right edge at every width,
               and it is the checks that give — side by side where they fit, stacked below
               640 where the pair needs about 300px and the form only has 295. -->
          <div class="flex items-center justify-between gap-4 sm:gap-6 pt-4 mt-1 border-t border-ink-100">
            <div class="min-w-0 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-x-5 sm:gap-y-3">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" id="${plag}" checked class="sr-only peer">
                <span class="sw on" data-for="${plag}"></span>
                <span class="text-[13px] sm:text-[13.5px] font-semibold text-ink-900">${S.checkPlagiarism}</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" id="${ai}" class="sr-only peer">
                <span class="sw" data-for="${ai}"></span>
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

module.exports = { form, free, style, script, INPUTS, ICON };
