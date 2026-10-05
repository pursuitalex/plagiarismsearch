/* FAQ — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is rendered by the template the pages use (build/sections/faq.js), with
   copy taken verbatim from the approved pages in site/, so what the catalogue shows is
   what the site already approved. Run after the page generators. */
const fs = require('fs');
const path = require('path');
const faq = require('./faq');
const { parse, walk, kids, has, textOf } = require('./check-tools');

const SITE = path.join(__dirname, '..', '..', 'site');

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

const snippets = [
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
  { file: 'faq-fluid-white.html', name: 'FAQ · fluid, білий фон',
    about: 'Біла секція: пігулка сама стає сірою — її фон ніде не задається, він протилежний фону секції. Вступ і посилання під ним. Копія — AI Detector FAQ.',
    uses: 'ai-detector, api',
    html: faq.section({ id: 'example-faq-white', ns: 'example-faq-white', bg: 'white', space: 'lg', layout: 'fluid',
      head: { eyebrow: 'Questions', title: ai.head.title, intro: ai.head.intro, more: ai.head.more },
      items: take(ai.items, 3) }) },
  { file: 'faq-fluid-rich.html', name: 'FAQ · fluid, розгорнуті відповіді з посиланням на джерело',
    about: 'Біла секція з меншими відступами (data-space="md"); кожна відповідь — div.faq-a-body з абзацами, під відповіддю може стояти p.faq-a-more з посиланням. Копія — Turnitin Alternative FAQ.',
    uses: 'turnitin-checker-alternative; так само — багатоабзацні відповіді: affiliate-program-at-plagiarismsearch і scholarship (обидві — v1 і v2, на lg, без пігулки)',
    html: faq.section({ id: 'example-faq-rich', ns: 'example-faq-rich', bg: 'white', space: 'md', layout: 'fluid', rich: true,
      head: { eyebrow: 'Questions', title: turnitin.head.title }, items: take(turnitin.items, 3) }) },
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
    about: 'Лише сітка .faq-grid з data-layout — коли FAQ є частиною іншої секції. Сам блок не має жодних утиліт: відступ над ним дає компонент-хост (своєю обгорткою). Без .rv, як затверджено на User Guide.',
    uses: 'user-manuals (всередині user-guide)',
    html: faq.grid({ ns: 'example-faq-grid', layout: 'fixed', reveal: false,
      head: manuals.head, items: take(manuals.items, 3) }) },
  { file: 'faq-frame-doc.html', name: 'Лише список у колонці документації (doc)',
    about: 'Тільки .faq-frame з data-variant="doc": компактні розміри на десктопі, текст ink-700, посилання в стилі гайду; кожне питання в <h3 class="faq-heading"> для структури документа. Заголовок дає сама секція гайду.',
    uses: 'integration-guide (Moodle)',
    html: faq.frame({ ns: 'example-faq-doc', variant: 'doc', heading: 'h3', reveal: false, rich: true, items: [moodle.items[0], moodle.items[3], moodle.items[4]] }) },
];

/* where the component is used now: [page, root, variants, what it holds] */
const pages = [
  ['index.html', 'section', 'white · md · fixed', 'пігулка; вступ; посилання з іконкою (без обгортки)'],
  ['ai-detector.html', 'section', 'white · lg · fluid', 'пігулка; вступ; посилання'],
  ['api.html', 'section', 'white · lg · fluid', 'пігулка; вступ; посилання'],
  ['prices.html', 'section', 'tint · lg · fluid', 'пігулка; вступ; посилання; a.faq-link у відповіді 7'],
  ['plagiarism-checker-for-organization.html', 'section', 'tint · lg · fluid', 'пігулка; a.faq-link у відповідях'],
  ['university-plagiarism-checker.html', 'section', 'tint · lg · fluid', 'пігулка «QUESTIONS»; a.faq-link у відповідях'],
  ['pdf-plagiarism-checker.html', 'section', 'tint · lg · fluid', 'пігулка'],
  ['plagiarism-checker-for-students.html', 'section', 'tint · lg · fluid', 'пігулка'],
  ['turnitin-checker-alternative.html', 'section', 'white · md · fluid', 'пігулка; розгорнуті відповіді; посилання на джерело'],
  ['ua-plagiarism-check.html', 'section', 'tint · md · fluid-narrow', 'без пігулки'],
  ['affiliate-program-at-plagiarismsearch.html (і -v2)', 'section', 'white · lg · fluid', 'без пігулки; вступ; під вступом — блок сторінки [data-slot="aside"] (картка «Contact Us»); розгорнуті відповіді'],
  ['scholarship.html', 'section', 'tint · lg · fluid', 'без пігулки й вступу — лише заголовок; розгорнуті відповіді'],
  ['scholarship-v2.html', 'section', 'white · lg · fluid', 'без пігулки й вступу — лише заголовок; розгорнуті відповіді'],
  ['user-manuals.html', 'grid', 'fixed', 'усередині user-guide; без .rv; відступ дає хост'],
  ['integration-guide.html', 'frame', 'doc', 'усередині гайду; h3; без .rv'],
];

module.exports = {
  lead: 'Секція запитань і відповідей: ліва колонка із заголовком (Section Header), права — акордеон. Перша відповідь відкрита; без JS видно всі.',
  files: { template: 'build/sections/faq.js', css: 'build/sections/faq.css, build/sections/section-head.css', js: 'build/assets/js/50-faq.js', contract: 'build/sections/faq.contract.js' },
  snippets, pages,
};
