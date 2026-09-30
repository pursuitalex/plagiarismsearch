/* Section Library — the copy-paste catalogue (site/section-library.html) and its snippets
   (build/sections/snippets/*.html).

   For the CMS: an editor copies a snippet into a page body and changes only what the
   contract (build/sections/faq.contract.js) lists as editable. Every snippet is rendered
   by the same template the pages use (build/sections/faq.js), with copy taken verbatim
   from the approved pages, so what is shown here is what the site already approved.
   build/check-library.js validates each snippet exactly as a paste would be validated.

   Run after the page generators (it reads their FAQ copy from site/):
     node build/section-library.js
   An internal review page like the prototype index: no site header or footer
   (build/shell.js skips it). */
const fs = require('fs');
const path = require('path');
const page = require('./page');
const faq = require('./sections/faq');
const C = require('./sections/faq.contract');
const { parse, walk, kids, has, textOf } = require('./check-library');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SNIP = path.join(__dirname, 'sections', 'snippets');

/* the approved copy of a page's FAQ: questions, answers (inner HTML), head */
function copyOf(file) {
  const html = fs.readFileSync(path.join(SITE, file), 'utf8');
  const { root } = parse(html);
  const raw = n => html.slice(n.innerStart, n.innerEnd).trim();
  let list = null, aside = null;
  walk(root, n => { if (!list && n.attrs && 'data-faq' in n.attrs) list = n; if (!aside && has(n, 'faq-aside')) aside = n; });
  if (!list) throw new Error('section-library: no FAQ in ' + file);
  const items = kids(list).map(it => {
    let q = null, body = null;
    walk(it, n => { if (has(n, 'faq-q-text')) q = raw(n); if (has(n, 'faq-a-body')) body = n; });
    if (body.tag === 'p') return { q, a: raw(body) };
    const ps = kids(body);
    const more = ps.find(p => has(p, 'faq-a-more'));
    const item = { q, paras: ps.filter(p => !has(p, 'faq-a-more')).map(raw) };
    if (more) {
      const a = kids(more)[0];
      const [l, ic] = kids(a);
      item.link = { label: l ? raw(l) : raw(a), href: a.attrs.href, target: a.attrs.target, rel: a.attrs.rel, icon: ic ? raw(ic) : '' };
    }
    return item;
  });
  const head = {};
  if (aside) for (const n of kids(aside)) {
    if (has(n, 'section-eyebrow')) head.eyebrow = textOf(kids(n)[1]).trim();
    if (has(n, 'section-title')) head.title = raw(n);
    if (has(n, 'section-intro')) head.intro = raw(n);
    if (has(n, 'section-more') || has(n, 'section-link')) {
      const a = n.tag === 'a' ? n : kids(n)[0];
      const svg = kids(a).find(k => k.tag === 'svg');
      head.more = { label: textOf(a).trim(), href: a.attrs.href, rel: a.attrs.rel, icon: svg ? html.slice(html.lastIndexOf('<svg', svg.innerStart), svg.innerEnd + 6) : '' };
    }
  }
  return { items, head };
}

/* ── the snippets: one per approved configuration ─────────────────────────────── */
const home = copyOf('index.html'), ai = copyOf('ai-detector.html'), prices = copyOf('prices.html');
const turnitin = copyOf('turnitin-checker-alternative.html'), ua = copyOf('ua-plagiarism-check.html');
const manuals = copyOf('user-manuals.html'), moodle = copyOf('integration-guide.html'), students = copyOf('plagiarism-checker-for-students.html');
const take = (items, n) => items.slice(0, n);

const SNIPPETS = [
  { file: 'faq-fluid.html', name: 'FAQ · fluid (базовий)',
    about: 'Продуктова сторінка: сіра секція, пігулка, заголовок, вступ і тихе посилання під ним; відповіді одним абзацом, у відповіді може бути посилання a.faq-link. Копія — Pricing FAQ.',
    uses: 'prices (так само, але без вступу/посилання: pdf, students, organization, university)',
    html: faq.section({ id: 'example-faq', ns: 'example-faq', bg: 'tint', space: 'lg', layout: 'fluid',
      head: { eyebrow: 'Questions', ...prices.head, more: { ...prices.head.more, icon: '' } },
      items: [prices.items[0], prices.items[1], prices.items[6]] }) },
  { file: 'faq-fluid-title-only.html', name: 'FAQ · fluid, лише заголовок',
    about: 'Той самий блок без вступу й посилання — найчастіша конфігурація. Копія — Students FAQ.',
    uses: 'students, pdf, organization, university',
    html: faq.section({ id: 'example-faq-title', ns: 'example-faq-title', bg: 'tint', space: 'lg', layout: 'fluid',
      head: { eyebrow: 'Questions', title: students.head.title }, items: take(students.items, 3) }) },
  { file: 'faq-fluid-small-intro.html', name: 'FAQ · fluid, білий фон, малий вступ',
    about: 'Біла секція; вступ data-size="small" (15px і на десктопі). Копія — AI Detector FAQ.',
    uses: 'ai-detector, api',
    html: faq.section({ id: 'example-faq-small', ns: 'example-faq-small', bg: 'white', space: 'lg', layout: 'fluid',
      head: { eyebrow: 'Questions', title: ai.head.title, intro: ai.head.intro, introSize: 'small', more: ai.head.more },
      items: take(ai.items, 3) }) },
  { file: 'faq-fluid-rich.html', name: 'FAQ · fluid, розгорнуті відповіді з посиланням на джерело',
    about: 'Біла секція з меншими відступами (data-space="md"), пігулка на тінті (data-bg="tint"); кожна відповідь — div.faq-a-body з абзацами, під відповіддю може стояти p.faq-a-more з посиланням. Копія — Turnitin Alternative FAQ.',
    uses: 'turnitin-checker-alternative; так само — багатоабзацні відповіді (scholarship після злиття)',
    html: faq.section({ id: 'example-faq-rich', ns: 'example-faq-rich', bg: 'white', space: 'md', layout: 'fluid', rich: true,
      head: { eyebrow: 'Questions', eyebrowBg: 'tint', title: turnitin.head.title }, items: take(turnitin.items, 3) }) },
  { file: 'faq-fluid-narrow.html', name: 'FAQ · fluid-narrow, без пігулки',
    about: 'Сітка 0.8fr/1.2fr, лише заголовок, менші відступи. Копія — UA FAQ.',
    uses: 'ua-plagiarism-check',
    html: faq.section({ id: 'example-faq-narrow', ns: 'example-faq-narrow', bg: 'tint', space: 'md', layout: 'fluid-narrow',
      head: { title: ua.head.title }, items: take(ua.items, 3) }) },
  { file: 'faq-fixed.html', name: 'FAQ · fixed (головна)',
    about: 'Ліва колонка фіксована 380px, свій ритм заголовка; посилання з іконкою стоїть без обгортки (a.section-more.section-link). Копія — Home FAQ.',
    uses: 'index (головна); user-manuals — як вбудований блок',
    html: faq.section({ id: 'example-faq-fixed', ns: 'example-faq-fixed', bg: 'white', space: 'md', layout: 'fixed',
      head: home.head, items: take(home.items, 3) }) },
  { file: 'faq-grid-embedded.html', name: 'FAQ усередині іншого компонента (без секції)',
    about: 'Лише сітка .faq-grid з data-layout — коли FAQ є частиною іншої секції. Відступ зверху — утиліти margin хоста (дозволено лише m*-). Без .rv, як затверджено на User Guide.',
    uses: 'user-manuals (всередині user-guide)',
    html: faq.grid({ ns: 'example-faq-grid', layout: 'fixed', reveal: false, hostClass: 'mt-12 sm:mt-16 lg:mt-20',
      head: manuals.head, items: take(manuals.items, 3) }) },
  { file: 'faq-frame-doc.html', name: 'Лише список у колонці документації (doc)',
    about: 'Тільки .faq-frame з data-variant="doc": компактні розміри на десктопі, текст ink-700, посилання в стилі гайду; кожне питання в <h3 class="faq-heading"> для структури документа. Заголовок дає сама секція гайду.',
    uses: 'integration-guide (Moodle)',
    html: faq.frame({ ns: 'example-faq-doc', variant: 'doc', heading: 'h3', reveal: false, rich: true, items: [moodle.items[0], moodle.items[3], moodle.items[4]] }) },
];

fs.mkdirSync(SNIP, { recursive: true });
for (const s of SNIPPETS) fs.writeFileSync(path.join(SNIP, s.file), s.html + '\n');

/* ── the catalogue page ─────────────────────────────────────────────────────────── */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const WRAP = 'max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10';
const H2 = 'text-[18px] sm:text-[20px] lg:text-[22px] font-extrabold tracking-tight';
const P = 'text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600';
const code = s => `<code class="font-mono text-[12.5px] text-ink-800 bg-ink-100 rounded px-1 py-0.5">${esc(s)}</code>`;

const PAGES = [
  ['index.html', 'section', 'white · md · fixed', 'пігулка; вступ; посилання з іконкою (без обгортки)'],
  ['ai-detector.html', 'section', 'white · lg · fluid', 'пігулка; вступ small; посилання'],
  ['api.html', 'section', 'white · lg · fluid', 'пігулка; вступ small; посилання'],
  ['prices.html', 'section', 'tint · lg · fluid', 'пігулка; вступ; посилання; a.faq-link у відповіді 7'],
  ['plagiarism-checker-for-organization.html', 'section', 'tint · lg · fluid', 'пігулка; a.faq-link у відповідях'],
  ['university-plagiarism-checker.html', 'section', 'tint · lg · fluid', 'пігулка «QUESTIONS»; a.faq-link у відповідях'],
  ['pdf-plagiarism-checker.html', 'section', 'tint · lg · fluid', 'пігулка'],
  ['plagiarism-checker-for-students.html', 'section', 'tint · lg · fluid', 'пігулка'],
  ['turnitin-checker-alternative.html', 'section', 'white · md · fluid', 'пігулка tint; розгорнуті відповіді; посилання на джерело'],
  ['ua-plagiarism-check.html', 'section', 'tint · md · fluid-narrow', 'без пігулки'],
  ['user-manuals.html', 'grid', 'fixed', 'усередині user-guide; без .rv; margin хоста'],
  ['integration-guide.html', 'frame', 'doc', 'усередині гайду; h3; без .rv'],
];

const table = (head, rows) => `<div class="overflow-x-auto rounded-xl ring-1 ring-black/5 bg-white">
      <table class="w-full text-left text-[13px] sm:text-[13.5px]">
        <thead class="bg-ink-50 text-ink-500"><tr>${head.map(h => `<th class="px-3 sm:px-4 py-2.5 font-semibold">${h}</th>`).join('')}</tr></thead>
        <tbody class="divide-y divide-ink-100">
${rows.map(r => `          <tr>${r.map((c, i) => `<td class="px-3 sm:px-4 py-2.5 align-top${i ? ' text-ink-600' : ' font-semibold text-ink-900'}">${c}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
    </div>`;

const variantRows = [];
for (const [part, set] of Object.entries(C.variants)) for (const [a, spec] of Object.entries(set)) {
  variantRows.push([`${part}`, code(a), spec.values.map(code).join(' '), (spec.required ? 'обов’язковий. ' : 'необов’язковий. ') + esc(spec.uk)]);
}

const intro = `  <section class="${WRAP} pt-10 sm:pt-14 lg:pt-16 pb-8">
    <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-3">Section Library · пілот</p>
    <h1 class="text-[26px] sm:text-[32px] lg:text-[38px] font-extrabold tracking-tightest leading-[1.1] mb-4">FAQ</h1>
    <div class="max-w-[76ch] space-y-3 ${P}">
      <p>Готовий HTML секції FAQ для вставки в body сторінки CMS. Стилі й поведінка — у спільних ${code('site.css')} / ${code('tailwind.css')} / ${code('site.js')}; сторінка не несе власного CSS чи JS. Копіюйте фрагмент із поля під прикладом цілком, потім змінюйте лише те, що дозволено в таблиці нижче.</p>
      <p>Перед публікацією перевірте вставку: збережіть HTML у файл і запустіть ${code('node build/check-library.js файл.html')} (або ${code('… --stdin')}). Валідатор назве рядок і причину, якщо щось зламано.</p>
      <p>Шаблон: ${code('build/sections/faq.js')} · CSS: ${code('build/sections/faq.css')}, ${code('build/sections/section-head.css')} · контракт: ${code('build/sections/faq.contract.js')} · фрагменти: ${code('build/sections/snippets/')}</p>
    </div>
  </section>

  <section class="${WRAP} pb-10 space-y-8">
    <div>
      <h2 class="${H2} mb-3">Що редактор може змінювати</h2>
      ${table(['Поле', 'Де в HTML', 'Правило'], C.editable.map(e => [esc(e.field), code(e.where), esc(e.rule)]))}
    </div>
    <div>
      <h2 class="${H2} mb-3">Що не змінюється</h2>
      <ul class="list-disc pl-5 space-y-1.5 ${P}">
${C.locked.map(l => `        <li>${esc(l)}</li>`).join('\n')}
      </ul>
    </div>
    <div>
      <h2 class="${H2} mb-3">Варіанти</h2>
      ${table(['Де', 'Атрибут', 'Значення', 'Що робить'], variantRows)}
    </div>
    <div>
      <h2 class="${H2} mb-3">Де що використано зараз</h2>
      ${table(['Сторінка', 'Корінь', 'Варіанти', 'Склад'], PAGES.map(([f, root, v, what]) => [`<a class="underline decoration-ink-300 underline-offset-4" href="${f}">${f}</a>`, code(root), esc(v), esc(what)]))}
    </div>
  </section>`;

/* each demo: its caption, the snippet itself at the top level of <main> (a section.faq
   belongs there; a grid or a frame gets a plain container standing in for its host), and
   the same HTML in a read-only field to copy from */
const demos = SNIPPETS.map((s, i) => `  <!-- ── ${i + 1} · ${s.file} ── -->
  <div class="border-t border-ink-200/60">
    <div class="${WRAP} pt-10 sm:pt-12 pb-6">
      <p class="text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ink-400 mb-2">Варіант ${i + 1}</p>
      <h2 class="${H2} mb-2">${esc(s.name)}</h2>
      <p class="${P} max-w-[76ch]">${esc(s.about)}</p>
      <p class="${P} max-w-[76ch] mt-1">Сторінки: ${esc(s.uses)} · файл: ${code('build/sections/snippets/' + s.file)}</p>
    </div>
  </div>

${/^<section/.test(s.html) ? s.html : `<div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 pb-4">\n${s.html}\n</div>`}

  <div class="${WRAP} pt-6 pb-10">
    <label class="block text-[12.5px] font-semibold text-ink-500 mb-2" for="snippet-${i + 1}">HTML для копіювання</label>
    <textarea id="snippet-${i + 1}" readonly rows="14" spellcheck="false" class="w-full font-mono text-[12px] leading-relaxed text-ink-800 bg-white rounded-xl ring-1 ring-black/10 p-3 sm:p-4">${esc(s.html)}</textarea>
  </div>`);

fs.writeFileSync(path.join(SITE, 'section-library.html'), page.render({
  title: 'Section Library — FAQ | PlagiarismSearch (internal)', lang: 'uk', chrome: false,
  mainClass: 'min-h-screen bg-[#F7F9FA]',
  sections: [intro, ...demos],
}));
console.log(`  site/section-library.html  ${SNIPPETS.length} FAQ variants · build/sections/snippets/ ${SNIPPETS.length} files`);
