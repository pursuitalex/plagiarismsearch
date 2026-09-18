/* Check site/ua-plagiarism-check.html against the UA Dedicated Plagiarism Checker brief
   of 2026-09-16 — /ua/plagiarism-check, the AR-03 master.

   Copy verbatim, the funnel in the brief's order, the facts and the negative contract by
   pattern, and the two structural promises: the university module is removable, and the
   page is not the homepage translated. Scope decision (Olex, 2026-09-18): the shell, the
   checker's labels and the report UI are not translated — so English is expected there
   and only there.

   Run: node build/check-ua.js
*/
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..', 'site');
const FILE = 'ua-plagiarism-check.html';
const html = fs.readFileSync(path.join(SITE, FILE), 'utf8');
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, '’').replace(/\s+/g, ' ')
  .replace(/\s+([,.;:!?])(?=\s|$)/g, '$1').trim();
const text = flat(body);

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};
const has = s => text.includes(s);
function section(id) {
  const i = body.indexOf('id="' + id + '"');
  if (i < 0) return '';
  return body.slice(body.lastIndexOf('<section', i), body.indexOf('</section>', i) + 10);
}

/* ── page-level ─────────────────────────────────────────────────────────────── */
console.log('page-level');
{
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1: «Перевірка на плагіат онлайн»', h1s.length === 1 && h1s[0] === 'Перевірка на плагіат онлайн', h1s.join(' | '));
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('approved title', title === 'Перевірка на плагіат онлайн безкоштовно | PlagiarismSearch', title);
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  ok('approved meta description', desc === 'Перевірте текст або документ на плагіат онлайн. Переглядайте знайдені збіги та джерела у звіті. До 150 слів без реєстрації, 300 слів щодня для зареєстрованих користувачів.', desc.slice(0, 40) + '…');
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  ok('self-canonical to /ua/plagiarism-check', canon === 'https://plagiarismsearch.com/ua/plagiarism-check', canon);
  ok('the document language is Ukrainian', /<html[^>]*lang="uk"/.test(html));
  ok('no hreflang hardcoded to other locales\' checker routes', !/hreflang/.test(html));
  ok('metadata carries none of the banned words', !/100%|миттєво|за хвилину|мільярд|офіційна перевірка/i.test(title + ' ' + desc));
  ok('no H4+', !/<h[4-6]\b/.test(body));
}

/* ── the funnel ─────────────────────────────────────────────────────────────── */
console.log('\nfunnel');
{
  const ACTS = [
    ['checker',         null],
    ['report',          'Дивіться не лише відсоток — перевіряйте збіги та джерела'],
    ['ua-universities', 'PlagiarismSearch користуються студенти з університетів по всій Україні'],
    ['sources',         'Перевіряйте текст із потрібними джерелами та налаштуваннями'],
    ['how-to-read',     'Як правильно оцінити знайдений збіг'],
    ['your-document',   'Що відбувається з документом після перевірки'],
    ['start-free',      'Перевірте невеликий фрагмент без оплати'],
    ['reviews',         'Відгуки користувачів PlagiarismSearch'],
    ['ai-detector',     'Перевірка на плагіат і AI-детектор — це різні перевірки'],
    ['faq',             null],
    ['ua-cta',          'Перевірте текст і перегляньте знайдені джерела'],
  ];
  for (const [anchor, h] of ACTS) {
    if (!h) { ok('#' + anchor + ' present', !!section(anchor)); continue; }
    const found = flat((section(anchor).match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1]);
    ok('#' + anchor + ' H2', found === h, found || '(missing)');
  }
  const order = ACTS.map(([a]) => body.indexOf('id="' + a + '"'));
  ok('eleven acts in the brief\'s order', order.every((v, i) => v > 0 && (i === 0 || v > order[i - 1])));
  const EYEBROWS = ['Результат перевірки', 'Налаштування перевірки', 'Як читати результат', 'Ваш документ і звіт', 'Почніть безкоштовно', 'Інший тип аналізу'];
  ok('the six approved eyebrows', EYEBROWS.every(e => text.toLowerCase().includes(e.toLowerCase())), EYEBROWS.filter(e => !text.toLowerCase().includes(e.toLowerCase())).join(' · '));
}

/* ── the approved baseline, verbatim ────────────────────────────────────────── */
console.log('\napproved copy');
{
  const COPY = [
    'Вставте текст або завантажте документ. PlagiarismSearch знаходить текстові збіги з доступними джерелами та показує їх у звіті, щоб ви могли перевірити контекст і за потреби доопрацювати текст.',
    'До 150 слів без реєстрації · 300 слів щодня для зареєстрованих користувачів',
    'Звіт пов’язує знайдені фрагменти з відповідними джерелами, щоб ви могли побачити, де саме виникла схожість і перевірити її в контексті.',
    'Відкрийте конкретний збіг, перегляньте джерело й порівняйте фрагменти. Залежно від контексту текст може потребувати цитування, посилання, перефразування або взагалі не вимагати змін.',
    'Знайдений текстовий збіг сам по собі не означає плагіат. PlagiarismSearch показує збіги та джерела для перевірки; остаточна оцінка залежить від контексту та правил, які застосовуються до вашого тексту.',
    'Серед користувачів сервісу є студенти цих та інших українських закладів вищої освіти.',
    'Логотипи наведені для ідентифікації закладів, студенти яких користувалися PlagiarismSearch. Це не означає партнерство, офіційне схвалення або інституційну співпрацю з цими університетами.',
    'Залежно від доступних у вашому акаунті налаштувань перевірка може включати вебджерела, академічну базу та ваші сховища. Перед запуском можна керувати окремими параметрами аналізу.',
    'Шукайте схожі фрагменти серед доступних вебджерел.',
    'Академічна база PlagiarismSearch містить понад 500 млн проіндексованих текстів. Доступність цього джерела залежить від налаштувань перевірки.',
    'За наявності відповідного доступу можна виконувати пошук у персональному або організаційному сховищі.',
    'Налаштування дозволяють окремо керувати виключенням списку літератури та внутрішньотекстових цитат.',
    'Один загальний показник не пояснює, чому система позначила конкретний фрагмент. Переглядайте результат на рівні тексту й джерела.',
    'Подивіться, який саме фрагмент вашого тексту має відповідність у знайденому джерелі.',
    'Порівняйте формулювання та переконайтеся, чи є це цитатою, коректно оформленим запозиченням, загальним формулюванням або фрагментом, що потребує уваги.',
    'За потреби додайте посилання, уточніть цитату або перепишіть фрагмент власними словами, зберігаючи коректну атрибуцію джерела.',
    'PlagiarismSearch не виносить автоматичний академічний чи юридичний висновок про плагіат. Звіт надає дані для перевірки й рішення людиною.',
    'Перевірка, звіт і функція Storage — це різні етапи. Важливо не змішувати їх в одну дію.',
    'Завантажений текст використовується для виконання запущеної вами перевірки.',
    'Вихідний документ не зберігається як окремий документ після звичайної перевірки. Зберігання результату не означає автоматичне додавання документа до бази для майбутніх порівнянь.',
    'Згенеровані звіти можуть зберігатися у вашому акаунті для повторного перегляду. Користувач може видалити звіт зі свого акаунта.',
    'Додавання документа до персонального або організаційного сховища відбувається окремо, коли користувач сам використовує відповідну функцію.',
    'Без реєстрації можна перевірити до 150 слів. Зареєстрованим користувачам доступно 300 слів для перевірки на плагіат щодня. Якщо потрібно перевіряти більші тексти або більше документів, перегляньте актуальні тарифні плани.',
    'Перевірка на плагіат шукає текстові збіги з джерелами. AI-детектор окремо оцінює ознаки машинно згенерованого тексту. Результат одного аналізу не замінює результат іншого.',
    'Почніть із безкоштовного ліміту або увійдіть в акаунт, щоб скористатися доступним вам обсягом перевірки.',
  ];
  const missing = COPY.filter(c => !has(c));
  ok(COPY.length + ' approved strings present verbatim', !missing.length, missing.map(m => '«' + m.slice(0, 40) + '…»').join(' '));
  const HEADS = ['Вебджерела', 'Академічна база', 'Ваші сховища', 'Цитати та список джерел', 'Відкрийте збіг', 'Перевірте джерело й контекст', 'Вирішіть, чи потрібна зміна', 'Обробка', 'Вихідний документ', 'Звіт', 'Storage'];
  ok('cell, step and stage headings', HEADS.every(has), HEADS.filter(h => !has(h)).join(' · '));
}

/* ── checker and report ─────────────────────────────────────────────────────── */
console.log('\nchecker / report');
{
  const hero = section('checker');
  ok('the hero is the first section and carries the shared form', body.indexOf('<section') === body.indexOf('<section id="checker"') && /<textarea id="checkText"/.test(hero));
  ok('exactly one form on the page', (body.match(/<form\b/g) || []).length === 1);
  ok('plagiarism is the checked control; AI is not', /id="optPlag" checked/.test(hero) && !/id="optAI" checked/.test(hero));
  ok('no CTA in the hero besides the form\'s own action', (hero.match(/class="btn-press/g) || []).length === 1);
  ok('on a phone the order is H1 → form', hero.indexOf('<h1') < hero.indexOf('<textarea'));
  ok('the free line sits with the form', hero.indexOf('<textarea') < hero.indexOf('До 150 слів без реєстрації'));
  ok('the hero carries the dot field under its orbs', /id="heroDots"/.test(hero) && hero.indexOf('heroDots') < hero.indexOf('class="orb'));
  const rep = section('report');
  ok('the shared report is rendered once, interactive', (body.match(/id="cabDoc"/g) || []).length === 1 && /cab-mark/.test(rep) && /cab-src/.test(rep));
  ok('fragment → source → context is drawn', /Фрагмент[\s\S]*Джерело[\s\S]*Контекст/.test(flat(rep)));
  ok('the report never says "Plagiarism detected"', !/plagiarism detected/i.test(rep));
  ok('untranslated product UI is marked lang="en" (form, report, reviews)', (body.match(/lang="en"/g) || []).length === 3);
}

/* ── the optional university module ─────────────────────────────────────────── */
console.log('\nuniversity proof');
{
  const uni = section('ua-universities');
  const files = [...uni.matchAll(/universities-ua\/(Component-\d+\.png)"/g)].map(m => m[1]);
  ok('ten approved marks, Component-6 (legacy НАУ) omitted', files.length === 10 && !files.includes('Component-6.png') && new Set(files).size === 10, files.join(' '));
  ok('every mark is a local copy that exists in the repo', [...uni.matchAll(/<img[^>]*src="([^"]+)"/g)].every(m => m[1].startsWith('assets/img/universities-ua/') && fs.existsSync(path.join(SITE, m[1]))));
  ok('every mark names its institution (alt), none is called a partner or client', [...uni.matchAll(/alt="([^"]*)"/g)].every(m => m[1].length > 10) && !/партнер(?!ство)|клієнт|співпрацю(ють|ємо)/i.test(flat(uni).replace('Це не означає партнерство, офіційне схвалення або інституційну співпрацю', '')));
  ok('НАУ is not named anywhere', !/авіаційн/i.test(html));
  ok('the deconfusion note is inside the module', /Це не означає партнерство/.test(flat(uni)));
  ok('marks are never scaled above their own size and are not redrawn', /\.uni img \{[^}]*max-width:213px/.test(html));
  ok('placed after the report, before the controls', body.indexOf('id="report"') < body.indexOf('id="ua-universities"') && body.indexOf('id="ua-universities"') < body.indexOf('id="sources"'));
  const src = fs.readFileSync(path.join(__dirname, 'ua.js'), 'utf8');
  ok('removable: one flag, one self-contained section', /const UNIVERSITY_PROOF = true;/.test(src) && /UNIVERSITY_PROOF && section3/.test(src));
}

/* ── facts ──────────────────────────────────────────────────────────────────── */
console.log('\nfacts');
{
  ok('free limits are 150 and 300 wherever a limit is stated', !/\b(100|200|250|500) слів/.test(text));
  ok('upload limits: 2 МБ, 24 МБ, 10 файлів', has('2 МБ') && has('24 МБ') && has('до 10 файлів'));
  ok('PDF: text layer, no OCR', has('Сервіс не виконує OCR'));
  ok('sources are shown as available, not as switches that are on', !/<input|class="sw\b|role="switch"/.test(section('sources')));
  ok('Storage is drawn as a separate act (dashed station)', /border-dashed[\s\S]{0,900}Storage/.test(section('your-document')));
  ok('pricing handoff is a link, not a matrix', /href="prices\.html"[^>]*>Переглянути тарифи/.test(section('start-free')) && !/\$\d|₴|грн/.test(text));
  ok('free-act primary returns to the checker', /href="#checker"[^>]*>\s*Перевірити текст/.test(section('start-free')));
  ok('AI is one compact banner with one link to the AI owner', (body.match(/href="ai-detector\.html"/g) || []).length === 1 && /Перевірити текст на ШІ/.test(section('ai-detector')));
  const close = section('ua-cta');
  ok('the closing CTA returns to the checker, never to registration', /href="#checker"[^>]*>\s*Перевірити на плагіат/.test(close) && !/account\.html|signup|register/i.test(close));
}

/* ── reviews ────────────────────────────────────────────────────────────────── */
console.log('\nreviews');
{
  const rev = section('reviews');
  const { REVIEWS } = require('./reviews');
  const quotes = [...rev.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g)].map(m => m[1]);
  ok('three reviews, each one of the homepage\'s verified set, unaltered', quotes.length === 3 && quotes.every(q => REVIEWS.some(r => r.quote === q)));
  ok('no invented aggregate score and no "customers"', !/aggregateRating|клієнт|customers/i.test(rev));
  ok('no review schema copied onto the page', !/"@type"\s*:\s*"Review"/.test(html));
}

/* ── FAQ ────────────────────────────────────────────────────────────────────── */
console.log('\nFAQ');
{
  const faq = section('faq');
  const QA = [
    ['Скільки тексту можна перевірити на плагіат безкоштовно?', 'Без реєстрації можна перевірити до 150 слів. Для зареєстрованих користувачів доступно 300 слів для перевірки на плагіат щодня. Для більших обсягів можна скористатися платним тарифом.'],
    ['Що показує звіт PlagiarismSearch?', 'Звіт показує знайдені текстові збіги, відповідні джерела та пов’язані з ними фрагменти документа. Ви можете перейти від позначеного тексту до джерела й самостійно перевірити контекст.'],
    ['Чи означає знайдений збіг, що в тексті є плагіат?', 'Ні. Текстовий збіг сам по собі не є автоматичним висновком про плагіат. Важливо перевірити джерело, контекст, цитування й правила, за якими оцінюється конкретний текст.'],
    ['Чи можна перевірити PDF на плагіат?', 'Так, PlagiarismSearch може аналізувати PDF, якщо файл містить машинозчитуваний текстовий шар. Сервіс не виконує OCR: текст, який існує лише всередині сканованого зображення, не буде розпізнано. У змішаному PDF аналізується текст із тих сторінок, де він доступний як текст.'],
    ['Який максимальний розмір файлу?', 'Для гостей максимальний розмір підтримуваного файла становить 2 МБ, для користувачів, які увійшли в акаунт, — 24 МБ. За одну операцію можна додати до 10 файлів.'],
    ['З якими джерелами може порівнюватися текст?', 'Залежно від доступних налаштувань перевірка може використовувати вебджерела, академічну базу, а також персональне чи організаційне сховище. Не всі джерела обов’язково використовуються в кожній перевірці.'],
    ['Чи зберігається мій документ після перевірки?', 'Завантажений вихідний документ не зберігається як окремий документ після звичайної перевірки. Згенерований звіт може залишатися у вашому акаунті для повторного перегляду, і його можна видалити. Додавання документа до Storage є окремою керованою дією.'],
    ['Чи можна використати звіт PlagiarismSearch як офіційний звіт для університету?', 'Вимоги різних університетів відрізняються. Звіт PlagiarismSearch можна використовувати для самоперевірки й роботи зі знайденими збігами, але чи приймає конкретний заклад такий звіт як офіційний документ, потрібно уточнювати безпосередньо в університеті.'],
    ['Чим перевірка на плагіат відрізняється від AI-детектора?', 'Перевірка на плагіат шукає схожість між вашим текстом і доступними джерелами. AI-детектор оцінює інші ознаки — наскільки текст схожий на машинно згенерований. Це різні сигнали, і один не підтверджує інший.'],
  ];
  const f = flat(faq);
  const bad = QA.filter(([q, a]) => !f.includes(q) || !f.includes(a)).map(([q]) => q.slice(0, 26));
  ok('nine questions and answers verbatim, answers in the HTML', (faq.match(/class="faq-item/g) || []).length === 9 && !bad.length, bad.join(' · '));
  ok('every question is a button with aria-expanded', (faq.match(/<button type="button" aria-expanded="(true|false)"/g) || []).length === 9);
}

/* ── the negative contract ──────────────────────────────────────────────────── */
console.log('\nnegative contract');
{
  /* Ukrainian content only: the English reviews are other people's words */
  const ua = flat(body.replace(section('reviews'), ''));
  const BAN = [
    [/100\s?%|\bточн(о|ий|а|ість)\b/i, 'accuracy / 100%'], [/мільярд/i, 'billions'], [/хвилин|миттєв|секунд/i, 'processing time'],
    [/\d+\+?\s*мов\b|100\+/i, 'language count'], [/відсоток плагіату/i, '«відсоток плагіату»'], [/унікальн/i, 'uniqueness'],
    [/без обмежень/i, 'unlimited volume'], [/файл зберігається у вашому акаунті/i, 'file stored in account'],
    [/університети співпрацюють|офіційн(ий|а) партнер/i, 'institutional endorsement'], [/анонімізован/i, 'anonymized-data claim'],
    [/повністю безкоштовно/i, 'fully free'], [/чи ви плагіатор|доказ плагіату/i, 'verdict language'],
    [/курсов|дипломн|реферат/i, 'academic-only framing'], [/3 (прост|легк)их крок/i, 'generic 3 steps'],
    [/ніколи не зберіга|видаляється одразу|не потрапля/i, 'storage absolute'],
  ];
  const hit = BAN.filter(([re]) => re.test(ua)).map(([, l]) => l);
  ok(BAN.length + ' banned patterns absent from the Ukrainian content', !hit.length, hit.join(' · '));
  ok('not the homepage translated: no proof rail, no features grid, no pricing cards, no partner logos', !/data-tier=|id="periodTabs"|partners\/(moodle|canvas)|BBB/i.test(body));
  ok('two dark blocks only — the report act and the AI banner', (body.match(/bg-ink-950 (text-white )?overflow-hidden/g) || []).length === 2);
}

/* ── hygiene ────────────────────────────────────────────────────────────────── */
console.log('\nhygiene');
{
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const dead = [...new Set([...body.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))].filter(a => !ids.has(a));
  ok('every in-page anchor resolves', !dead.length, dead.join(', '));
  const local = [...new Set([...body.matchAll(/href="([a-z0-9-]+\.html)(#[^"]*)?"/g)].map(m => m[1]))];
  ok('every local page link exists', local.every(f => fs.existsSync(path.join(SITE, f))), local.filter(f => !fs.existsSync(path.join(SITE, f))).join(', '));
  ok('header and footer were injected by build/shell.js', /<header[^>]*>\s*\S/.test(html) && /<footer[^>]*>\s*\S/.test(html));
  ok('reduced motion is respected', /prefers-reduced-motion/.test(html));
}

console.log('\ngates — open items, not defects');
console.log('  G1    Shell, checker labels and report UI are English by decision (Olex, 2026-09-18); production binds the real UA widget.');
console.log('  G2    University marks are local copies of the approved production assets (site/assets/img/universities-ua/), unchanged.');
console.log('  G3    Component-6 omitted until an approved current КАІ logo is supplied.');
console.log('  G4    "Переглянути тарифи" → prices.html and "Перевірити текст на ШІ" → ai-detector.html: the UA pricing and /ua/ai-content-detector pages do not exist in the prototype.');
console.log('  G5    Reviews are three of the homepage\'s verified English reviews, untranslated; the brief asks for centrally verified UA-facing review data before launch.');
console.log('  G6    Ours, not the brief\'s: the FAQ H2 «Поширені запитання», the tags «Джерело»/«Параметр», the path «Фрагмент → Джерело → Контекст», the figure captions under 150/300.');
console.log('  G7    Flat file ua-plagiarism-check.html in the prototype; production path /ua/plagiarism-check, self-canonical, UA nav target.');

console.log(failed ? '\n' + failed + ' check(s) FAILED' : '\nall checks passed');
process.exit(failed ? 1 : 0);
