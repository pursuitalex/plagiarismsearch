/* Section Library — the copy-paste catalogue (site/section-library.html) and its snippets
   (build/sections/snippets/*.html).

   For the CMS: an editor copies a snippet into a page body and changes only what the
   component's contract (build/sections/<name>.contract.js) lists as editable. Every
   snippet comes from the same template the pages use, with copy taken verbatim from the
   approved pages, so what is shown here is what the site already approved.
   build/check-library.js validates each snippet exactly as a paste would be validated.

   One chapter per component of the registry (build/sections/index.js); what a chapter
   shows — its snippets, where the component is used — is the component's catalogue entry
   (build/sections/<name>.catalogue.js), its rules are its contract.

   Run after the page generators (the entries read the approved copy from site/):
     node build/section-library.js
   An internal review page like the prototype index: no site header or footer
   (build/shell.js skips it). */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const REGISTRY = require('./sections');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SNIP = path.join(__dirname, 'sections', 'snippets');

const COMPONENTS = REGISTRY.map(c => ({ ...c, C: c.contract, cat: require('./sections/' + c.name + '.catalogue') }));

/* ── the snippets: one file per approved configuration ────────────────────────── */
fs.mkdirSync(SNIP, { recursive: true });
const written = new Set();
for (const c of COMPONENTS) for (const s of c.cat.snippets) {
  if (written.has(s.file)) throw new Error('section-library: two snippets named ' + s.file);
  written.add(s.file);
  fs.writeFileSync(path.join(SNIP, s.file), s.html + '\n');
}
/* a snippet no entry writes any more is stale: the validator would still run it */
for (const f of fs.readdirSync(SNIP)) if (f.endsWith('.html') && !written.has(f)) fs.unlinkSync(path.join(SNIP, f));

/* ── the catalogue page ─────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const WRAP = 'max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10';
const H2 = 'text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tight';
const P = 'text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600';
const KICKER = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400';
const code = s => `<code class="font-mono text-[12.5px] text-ink-800 bg-ink-100 rounded px-1 py-0.5">${esc(s)}</code>`;

const table = (head, rows) => `<div class="overflow-x-auto rounded-xl ring-1 ring-black/5 bg-white">
      <table class="w-full text-left text-[13px] sm:text-[13.5px]">
        <thead class="bg-ink-50 text-ink-500"><tr>${head.map(h => `<th class="px-3 sm:px-4 py-2.5 font-semibold">${h}</th>`).join('')}</tr></thead>
        <tbody class="divide-y divide-ink-100">
${rows.map(r => `          <tr>${r.map((c, i) => `<td class="px-3 sm:px-4 py-2.5 align-top${i ? ' text-ink-600' : ' font-semibold text-ink-900'}">${c}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
    </div>`;

const total = COMPONENTS.reduce((n, c) => n + c.cat.snippets.length, 0);

const intro = `  <section class="${WRAP} pt-10 sm:pt-14 lg:pt-16 pb-8">
    <p class="${KICKER} mb-3">Section Library</p>
    <h1 class="text-[26px] sm:text-[32px] lg:text-[38px] font-extrabold tracking-tightest leading-[1.1] mb-4">Бібліотека секцій</h1>
    <div class="max-w-[76ch] space-y-3 ${P}">
      <p>Готовий HTML секцій для вставки в body сторінки CMS. Стилі й поведінка — у спільних ${code('site.css')} / ${code('tailwind.css')} / ${code('site.js')}; сторінка не несе власного CSS чи JS. Копіюйте фрагмент із поля під прикладом цілком, потім змінюйте лише те, що дозволено в таблиці компонента.</p>
      <p><strong class="font-semibold text-ink-900">Версія 1, зафіксована 5 жовтня 2026</strong> для поточного етапу дизайну: ${COMPONENTS.length} компонентів, ${total} фрагментів. Нові компоненти додаються лише під конкретну потребу нової сторінки.</p>
      <p>Перед публікацією перевірте вставку: збережіть HTML у файл і запустіть ${code('node build/check-library.js файл.html')} (або ${code('… --stdin')}). Валідатор назве рядок і причину, якщо щось зламано.</p>
    </div>
    <ul class="mt-6 flex flex-wrap gap-2.5">
${COMPONENTS.map(c => `      <li><a class="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-black/10 px-4 py-2 text-[13.5px] font-semibold text-ink-800 hover:ring-black/20" href="#lib-${c.name}">${esc(c.title)} <span class="text-ink-400 font-medium">${c.cat.snippets.length}</span></a></li>`).join('\n')}
    </ul>
  </section>`;

/* a chapter: the component's rules, then each snippet — its caption, the snippet itself
   at the top level of <main> (a section belongs there; a block that lives inside another
   component gets a plain container standing in for its host), and the same HTML in a
   read-only field to copy from */
let n = 0;
const chapter = c => {
  const variantRows = [];
  for (const [part, set] of Object.entries(c.C.variants)) for (const [a, spec] of Object.entries(set)) {
    variantRows.push([`${part}`, code(a), spec.values.map(code).join(' '), (spec.required ? 'обов’язковий. ' : 'необов’язковий. ') + esc(spec.uk)]);
  }
  const f = c.cat.files;
  const rules = `  <section id="lib-${c.name}" class="bg-white border-t border-ink-200/60">
    <div class="${WRAP} pt-10 sm:pt-12 pb-10 space-y-8">
      <div>
        <p class="${KICKER} mb-3">Компонент</p>
        <h2 class="text-[26px] sm:text-[32px] lg:text-[38px] font-extrabold tracking-tightest leading-[1.1] mb-3">${esc(c.title)}</h2>
        <div class="max-w-[76ch] space-y-3 ${P}">
          <p>${esc(c.cat.lead)}</p>
          <p>Шаблон: ${code(f.template)} · CSS: ${code(f.css)}${f.js ? ` · JS: ${code(f.js)}` : ''} · контракт: ${code(f.contract)} · фрагменти: ${code('build/sections/snippets/' + c.name + '-*.html')}</p>
        </div>
      </div>
      <div>
        <h3 class="${H2} mb-3">Що редактор може змінювати</h3>
        ${table(['Поле', 'Де в HTML', 'Правило'], c.C.editable.map(e => [esc(e.field), code(e.where), esc(e.rule)]))}
      </div>
      <div>
        <h3 class="${H2} mb-3">Що не змінюється</h3>
        <ul class="list-disc pl-5 space-y-1.5 ${P}">
${c.C.locked.map(l => `          <li>${esc(l)}</li>`).join('\n')}
        </ul>
      </div>
      <div>
        <h3 class="${H2} mb-3">Варіанти</h3>
        ${table(['Де', 'Атрибут', 'Значення', 'Що робить'], variantRows)}
      </div>
      <div>
        <h3 class="${H2} mb-3">Де що використано зараз</h3>
        ${table(['Сторінка', 'Корінь', 'Варіанти', 'Склад'], c.cat.pages.map(([file, root, v, what]) => [/^[\w.-]+\.html$/.test(file) ? `<a class="underline decoration-ink-300 underline-offset-4" href="${file}">${file}</a>` : esc(file), code(root), esc(v), esc(what)]))}
      </div>
    </div>
  </section>`;
  const demos = c.cat.snippets.map((s, i) => {
    n++;
    return `  <!-- ── ${c.name} · ${i + 1} · ${s.file} ── -->
  <div class="border-t border-ink-200/60">
    <div class="${WRAP} pt-10 sm:pt-12 pb-6">
      <p class="${KICKER} mb-2">${esc(c.title)} · варіант ${i + 1}</p>
      <h3 class="${H2} mb-2">${esc(s.name)}</h3>
      <p class="${P} max-w-[76ch]">${esc(s.about)}</p>
      <p class="${P} max-w-[76ch] mt-1">Сторінки: ${esc(s.uses)} · файл: ${code('build/sections/snippets/' + s.file)}</p>
    </div>
  </div>

${/^<section/.test(s.html) ? s.html : `<div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pb-4">\n${s.html}\n</div>`}

  <div class="${WRAP} pt-6 pb-10">
    <label class="block text-[12.5px] font-semibold text-ink-500 mb-2" for="snippet-${n}">HTML для копіювання</label>
    <textarea id="snippet-${n}" readonly rows="14" spellcheck="false" class="w-full font-mono text-[12px] leading-relaxed text-ink-800 bg-white rounded-xl ring-1 ring-black/10 p-3 sm:p-4">${esc(s.html)}</textarea>
  </div>`;
  });
  return [rules, ...demos];
};

fs.writeFileSync(path.join(SITE, 'section-library.html'), page.render({
  title: 'Section Library | PlagiarismSearch (internal)', lang: 'uk', chrome: false,
  mainClass: 'min-h-screen bg-[#F7F9FA]',
  sections: [intro, ...COMPONENTS.flatMap(chapter)],
}));
console.log(`  site/section-library.html  ${COMPONENTS.map(c => `${c.title} ${c.cat.snippets.length}`).join(' · ')} · build/sections/snippets/ ${total} files`);
