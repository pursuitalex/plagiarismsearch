/* Generate site/ua-plagiarism-check.html — the Ukrainian dedicated checker,
   /ua/plagiarism-check, to the 2026-09-16 brief. The first non-English page, and the
   master for AR-03: any locale whose transactional owner is /{locale}/plagiarism-check
   reuses this funnel and these devices — never this copy.

   Scope, as Olex set it on 2026-09-18: the site's controls are not translated. The
   header, the footer, the checker's own labels and the report's interface stay as the
   shell and the shared modules render them; what is Ukrainian is the content the brief
   supplies, verbatim. The English components carry lang="en" inside a lang="uk" page.

   The prototype is flat, so the file is ua-plagiarism-check.html and URLS.md maps it to
   /ua/plagiarism-check — a subfolder would need the shell to rewrite every relative
   path for one page.

   The funnel is the brief's, in its order: check now → what you get → (who uses it) →
   what is searched → how to read a match → what happens to the document → free and paid
   → reviews → AI is a different check → questions → back to the checker. It is not the
   homepage in Ukrainian: no proof rail, no features grid, no "3 easy steps", no pricing
   matrix. The two signature moments are the real checker and the real report.

   The university module is optional by contract. It is one self-contained section
   behind a flag; with UNIVERSITY_PROOF = false the report hands over to the controls
   with nothing to repair.

   Run:  node build/ua.js  →  node build/shell.js  →  node build/check-ua.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const OUT = 'ua-plagiarism-check.html';
const cta = require('./cta');
const banner = require('./banner');
const checker = require('./checker');
const { dots } = require('./dots');
const { REVIEWS, reviewCard } = require('./reviews');
const { CAB, cabLine, cabLegend, cabMetric, cabSource, NL14, NL16 } = require('./report');

const UNIVERSITY_PROOF = true;
const ANCHOR = '#checker';
/* the brief's destinations: the canonical UA pricing URL and /ua/ai-content-detector.
   Neither locale page exists in the prototype, so both go to the English owner. */
const PRICING = 'prices.html';
const AI_PAGE = 'ai-detector.html';

/* ─────────────────────────────────────────────────────────────────────────────
   APPROVED COPY — UA Dedicated Plagiarism Checker brief, 2026-09-16. Verbatim.
   ───────────────────────────────────────────────────────────────────────────── */
const COPY = {
  title: 'Перевірка на плагіат онлайн безкоштовно | PlagiarismSearch',
  meta: 'Перевірте текст або документ на плагіат онлайн. Переглядайте знайдені збіги та джерела у звіті. До 150 слів без реєстрації, 300 слів щодня для зареєстрованих користувачів.',
  canonical: 'https://plagiarismsearch.com/ua/plagiarism-check',

  hero: {
    h1: 'Перевірка на плагіат онлайн',
    support: 'Вставте текст або завантажте документ. PlagiarismSearch знаходить текстові збіги з доступними джерелами та показує їх у звіті, щоб ви могли перевірити контекст і за потреби доопрацювати текст.',
    free: 'До 150 слів без реєстрації · 300 слів щодня для зареєстрованих користувачів',
    /* the checker's own interface — not translated (see the note at the top) */
    placeholder: 'Paste or type your text here',
    formats: 'Supports DOC/DOCX, PDF, TXT, PPT/PPTX, XLS/XLSX and other file formats.',
    checkPlagiarism: 'Check for plagiarism',
    checkAI: 'Check for AI writing',
    cta: 'Check for plagiarism',
  },

  report: {
    eyebrow: 'Результат перевірки',
    h2: 'Дивіться не лише відсоток — перевіряйте збіги та джерела',
    intro: 'Звіт пов’язує знайдені фрагменти з відповідними джерелами, щоб ви могли побачити, де саме виникла схожість і перевірити її в контексті.',
    support: 'Відкрийте конкретний збіг, перегляньте джерело й порівняйте фрагменти. Залежно від контексту текст може потребувати цитування, посилання, перефразування або взагалі не вимагати змін.',
    callout: 'Знайдений текстовий збіг сам по собі не означає плагіат. PlagiarismSearch показує збіги та джерела для перевірки; остаточна оцінка залежить від контексту та правил, які застосовуються до вашого тексту.',
    /* "visually emphasize fragment → source → context" — the three words, as a path */
    path: ['Фрагмент', 'Джерело', 'Контекст'],
  },

  uni: {
    h2: 'PlagiarismSearch користуються студенти з університетів по всій Україні',
    support: 'Серед користувачів сервісу є студенти цих та інших українських закладів вищої освіти.',
    note: 'Логотипи наведені для ідентифікації закладів, студенти яких користувалися PlagiarismSearch. Це не означає партнерство, офіційне схвалення або інституційну співпрацю з цими університетами.',
    /* local copies of the approved source assets, fetched unchanged on 2026-09-18 from
       plagiarismsearch.com/files/2019/images/pages/plagiarism-checker/universites-ua/ */
    base: 'assets/img/universities-ua/',
    /* Component-6 (the former НАУ mark) is omitted: the institution is now НУ «Київський
       авіаційний інститут» and no current approved logo was supplied. */
    logos: [
      ['Component-2.png', 'Київський столичний університет імені Бориса Грінченка'],
      ['Component-3.png', 'Національний університет «Острозька академія»'],
      ['Component-4.png', 'Національний університет біоресурсів і природокористування України'],
      ['Component-5.png', 'Прикарпатський національний університет імені Василя Стефаника'],
      ['Component-7.png', 'Черкаський національний університет імені Богдана Хмельницького'],
      ['Component-8.png', 'Ужгородський національний університет'],
      ['Component-9.png', 'Національний університет водного господарства та природокористування'],
      ['Component-10.png', 'Український державний університет імені Михайла Драгоманова'],
      ['Component-11.png', 'Національний університет «Львівська політехніка»'],
      ['Component-12.png', 'НТУУ «КПІ імені Ігоря Сікорського»'],
    ],
  },

  controls: {
    eyebrow: 'Налаштування перевірки',
    h2: 'Перевіряйте текст із потрібними джерелами та налаштуваннями',
    intro: 'Залежно від доступних у вашому акаунті налаштувань перевірка може включати вебджерела, академічну базу та ваші сховища. Перед запуском можна керувати окремими параметрами аналізу.',
    cells: [
      ['Вебджерела', 'Шукайте схожі фрагменти серед доступних вебджерел.'],
      ['Академічна база', 'Академічна база PlagiarismSearch містить понад 500 млн проіндексованих текстів. Доступність цього джерела залежить від налаштувань перевірки.'],
      ['Ваші сховища', 'За наявності відповідного доступу можна виконувати пошук у персональному або організаційному сховищі.'],
      ['Цитати та список джерел', 'Налаштування дозволяють окремо керувати виключенням списку літератури та внутрішньотекстових цитат.'],
    ],
  },

  read: {
    eyebrow: 'Як читати результат',
    h2: 'Як правильно оцінити знайдений збіг',
    intro: 'Один загальний показник не пояснює, чому система позначила конкретний фрагмент. Переглядайте результат на рівні тексту й джерела.',
    steps: [
      ['Відкрийте збіг', 'Подивіться, який саме фрагмент вашого тексту має відповідність у знайденому джерелі.'],
      ['Перевірте джерело й контекст', 'Порівняйте формулювання та переконайтеся, чи є це цитатою, коректно оформленим запозиченням, загальним формулюванням або фрагментом, що потребує уваги.'],
      ['Вирішіть, чи потрібна зміна', 'За потреби додайте посилання, уточніть цитату або перепишіть фрагмент власними словами, зберігаючи коректну атрибуцію джерела.'],
    ],
    callout: 'PlagiarismSearch не виносить автоматичний академічний чи юридичний висновок про плагіат. Звіт надає дані для перевірки й рішення людиною.',
  },

  life: {
    eyebrow: 'Ваш документ і звіт',
    h2: 'Що відбувається з документом після перевірки',
    intro: 'Перевірка, звіт і функція Storage — це різні етапи. Важливо не змішувати їх в одну дію.',
    stages: [
      ['Обробка', 'Завантажений текст використовується для виконання запущеної вами перевірки.'],
      ['Вихідний документ', 'Вихідний документ не зберігається як окремий документ після звичайної перевірки. Зберігання результату не означає автоматичне додавання документа до бази для майбутніх порівнянь.'],
      ['Звіт', 'Згенеровані звіти можуть зберігатися у вашому акаунті для повторного перегляду. Користувач може видалити звіт зі свого акаунта.'],
      ['Storage', 'Додавання документа до персонального або організаційного сховища відбувається окремо, коли користувач сам використовує відповідну функцію.'],
    ],
  },

  free: {
    eyebrow: 'Почніть безкоштовно',
    h2: 'Перевірте невеликий фрагмент без оплати',
    p: 'Без реєстрації можна перевірити до 150 слів. Зареєстрованим користувачам доступно 300 слів для перевірки на плагіат щодня. Якщо потрібно перевіряти більші тексти або більше документів, перегляньте актуальні тарифні плани.',
    primary: 'Перевірити текст',
    secondary: 'Переглянути тарифи',
    /* the two figures' captions — phrases from the approved sentence */
    caps: [['слів', 'без реєстрації'], ['слів щодня', 'зареєстрованим користувачам']],
  },

  reviews: { h2: 'Відгуки користувачів PlagiarismSearch' },

  ai: {
    eyebrow: 'Інший тип аналізу',
    h2: 'Перевірка на плагіат і AI-детектор — це різні перевірки',
    p: 'Перевірка на плагіат шукає текстові збіги з джерелами. AI-детектор окремо оцінює ознаки машинно згенерованого тексту. Результат одного аналізу не замінює результат іншого.',
    cta: 'Перевірити текст на ШІ',
  },

  faq: {
    /* the brief supplies the nine items and no heading for them */
    h2: 'Поширені запитання',
    items: [
      ['Скільки тексту можна перевірити на плагіат безкоштовно?', 'Без реєстрації можна перевірити до 150 слів. Для зареєстрованих користувачів доступно 300 слів для перевірки на плагіат щодня. Для більших обсягів можна скористатися платним тарифом.'],
      ['Що показує звіт PlagiarismSearch?', 'Звіт показує знайдені текстові збіги, відповідні джерела та пов’язані з ними фрагменти документа. Ви можете перейти від позначеного тексту до джерела й самостійно перевірити контекст.'],
      ['Чи означає знайдений збіг, що в тексті є плагіат?', 'Ні. Текстовий збіг сам по собі не є автоматичним висновком про плагіат. Важливо перевірити джерело, контекст, цитування й правила, за якими оцінюється конкретний текст.'],
      ['Чи можна перевірити PDF на плагіат?', 'Так, PlagiarismSearch може аналізувати PDF, якщо файл містить машинозчитуваний текстовий шар. Сервіс не виконує OCR: текст, який існує лише всередині сканованого зображення, не буде розпізнано. У змішаному PDF аналізується текст із тих сторінок, де він доступний як текст.'],
      ['Який максимальний розмір файлу?', 'Для гостей максимальний розмір підтримуваного файла становить 2 МБ, для користувачів, які увійшли в акаунт, — 24 МБ. За одну операцію можна додати до 10 файлів.'],
      ['З якими джерелами може порівнюватися текст?', 'Залежно від доступних налаштувань перевірка може використовувати вебджерела, академічну базу, а також персональне чи організаційне сховище. Не всі джерела обов’язково використовуються в кожній перевірці.'],
      ['Чи зберігається мій документ після перевірки?', 'Завантажений вихідний документ не зберігається як окремий документ після звичайної перевірки. Згенерований звіт може залишатися у вашому акаунті для повторного перегляду, і його можна видалити. Додавання документа до Storage є окремою керованою дією.'],
      ['Чи можна використати звіт PlagiarismSearch як офіційний звіт для університету?', 'Вимоги різних університетів відрізняються. Звіт PlagiarismSearch можна використовувати для самоперевірки й роботи зі знайденими збігами, але чи приймає конкретний заклад такий звіт як офіційний документ, потрібно уточнювати безпосередньо в університеті.'],
      ['Чим перевірка на плагіат відрізняється від AI-детектора?', 'Перевірка на плагіат шукає схожість між вашим текстом і доступними джерелами. AI-детектор оцінює інші ознаки — наскільки текст схожий на машинно згенерований. Це різні сигнали, і один не підтверджує інший.'],
    ],
  },

  close: {
    h2: 'Перевірте текст і перегляньте знайдені джерела',
    support: 'Почніть із безкоштовного ліміту або увійдіть в акаунт, щоб скористатися доступним вам обсягом перевірки.',
    primary: 'Перевірити на плагіат',
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Visual vocabulary — the system's.
   ───────────────────────────────────────────────────────────────────────────── */
const LABEL = 'text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.22em]';
const eyebrow = (dot, label, ground = 'white') => `        <div class="inline-flex items-center gap-2 rounded-full ${ground === 'white' ? 'bg-white' : 'bg-ink-50'} ring-1 ring-black/5 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="${LABEL} text-ink-700">${label}</span>
        </div>`;
const eyebrowDark = (dot, label) => `        <div class="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3.5 py-1.5 mb-4 sm:mb-5 lg:mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-${dot}"></span>
          <span class="${LABEL} text-white/80">${label}</span>
        </div>`;

const H2 = 'text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold tracking-tightest leading-[1.08]';
const INTRO = 'mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600';
const BODY = 'text-[13.5px] sm:text-[14.5px] leading-relaxed';
const arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

const btnDark = (label, href) => `<a href="${href}" class="btn-press group inline-flex items-center gap-2.5 rounded-full bg-ink-900 hover:bg-ink-800 transition-colors duration-300 text-white text-[13.5px] sm:text-[14.5px] font-semibold px-5 sm:pl-6 sm:pr-2 py-2">
            ${label}
            <span class="icon-orb hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center">${arrow}</span>
          </a>`;
const linkQuiet = (label, href) => `<a href="${href}" class="inline-flex items-center gap-2 text-[13px] sm:text-[13.5px] font-semibold text-ink-500 hover:text-ink-900 decoration-ink-300 underline underline-offset-4 transition-colors duration-300">${label}</a>`;

const penMark = (text, phrase) => {
  const w = Math.round(phrase.length * 18);
  const svg = `<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 ${w} 12" fill="none" aria-hidden="true"><path class="pen-underline" d="M3 9c${Math.round(w * .25)}-7 ${Math.round(w * .67)}-7 ${w - 6}-3" stroke="#F36F5A" stroke-opacity=".5" stroke-width="4" stroke-linecap="round" opacity="0"/></svg>`;
  return text.replace(phrase, `<span class="pen-word relative inline-block">${phrase}${svg}</span>`);
};

const ico = (paths, stroke, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
const TINT = { teal: ['bg-teal-100', '#06748A'], ink: ['bg-ink-100', '#374151'], orange: ['bg-orange-100', '#B84431'], mint: ['bg-mint-100', '#1B7A50'] };
const chip = (tint, paths) => `<span class="inline-flex w-11 h-11 rounded-xl sm:rounded-[14px] lg:rounded-2xl ${TINT[tint][0]} items-center justify-center shrink-0">${ico(paths, TINT[tint][1])}</span>`;
const I = {
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  archive:  '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  quote:    '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
  upload:   '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  file:     '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  report:   '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 17v-3"/><path d="M12 17v-6"/><path d="M16 17v-4"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  sparkles: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/>',
};

/* ═══════════════ 01 · THE CHECKER ═══════════════ */
const section1 = () => `  <!-- ================= 01 · CHECKER-FIRST HERO =================
       The shared form (build/checker.js) on the right, the page's name and its one
       paragraph on the left; the approved free line sits under the form, where the limit
       applies. The form's own labels are the product's interface and stay as they are.
       DOM order H1 → form, so a phone opens on the checker. No second CTA beside it. -->
  <section id="checker" class="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-[#F2FCFC] overflow-hidden">
    ${dots('heroDots')}
    <div class="orb absolute" style="width:860px;height:800px;left:-16%;top:-400px;background:rgba(44,195,219,.22)"></div>
    <div class="orb absolute" style="width:700px;height:680px;right:-14%;top:-200px;background:rgba(243,111,90,.13)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[.9fr_1.1fr] gap-x-14 gap-y-8 items-center">
        <div class="rv min-w-0">
          <h1 class="text-[clamp(2.4rem,5.2vw,3.85rem)] font-extrabold tracking-tightest leading-[1.04] mb-5 lg:mb-6">${penMark(COPY.hero.h1, 'онлайн')}</h1>
          <p class="text-[15.5px] sm:text-[16px] lg:text-[16.5px] leading-relaxed text-ink-600 max-w-[52ch]">${COPY.hero.support}</p>
        </div>
        <div class="min-w-0">
          <div lang="en">
${checker.form(COPY.hero, ANCHOR)}
          </div>
${checker.free(COPY.hero).replace('flex items-center justify-center gap-2', 'flex items-start sm:items-center justify-center gap-2 text-center')}
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 02 · THE REPORT ═══════════════ */
const section2 = () => `  <!-- ================= 02 · SIGNATURE · WHAT YOU GET =================
       The dark act. The approved report (build/report.js) — the product's real interface,
       untouched and untranslated — and beside the words, the path the brief asks the eye
       to follow: fragment → source → context. The interpretation callout closes the act
       at full width; it is the sentence the whole page leans on. -->
  <section id="report" class="relative py-16 sm:py-24 lg:py-28 bg-ink-950 text-white overflow-hidden">
    <div class="orb absolute" style="width:620px;height:620px;left:-13%;top:40px;background:rgba(13,168,194,.12)"></div>
    <div class="orb absolute" style="width:520px;height:520px;right:-10%;bottom:-120px;background:rgba(243,111,90,.10)"></div>

    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1.15fr_.85fr] gap-6 lg:gap-14 items-end mb-8 sm:mb-10 lg:mb-12">
        <div class="rv min-w-0">
${eyebrowDark('teal-400', COPY.report.eyebrow)}
          <h2 class="${H2}">${COPY.report.h2}</h2>
          <p class="mt-4 lg:mt-5 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/70 max-w-[64ch]">${COPY.report.intro}</p>
        </div>
        <ol class="rv flex flex-wrap items-center gap-y-2 lg:justify-end" aria-label="${COPY.report.path.join(' → ')}">
${COPY.report.path.map((p, i) => `          <li class="flex items-center">
            <span class="inline-flex items-center gap-2 rounded-full ${i === 0 ? 'bg-orange-500/15 ring-1 ring-orange-400/40 text-white' : 'bg-white/[.06] ring-1 ring-white/10 text-white/85'} px-4 py-2 text-[13px] sm:text-[13.5px] font-semibold">${i === 0 ? '<span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>' : ''}${p}</span>${i < 2 ? `
            <svg class="mx-2 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>` : ''}
          </li>`).join('\n')}
        </ol>
      </div>

      <div class="rv grid lg:grid-cols-[1fr_360px] gap-4 sm:gap-5 lg:gap-6 items-stretch" lang="en">
        <div id="cabDoc" class="relative min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden shadow-diffuse-lg">
          <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 sm:px-6 lg:px-7 py-3.5 sm:py-4 lg:py-5 border-b border-ink-100">
            <span class="text-[13.5px] sm:text-[14.5px] font-bold tracking-tight tabular-nums">${CAB.id}</span>
            <span class="flex items-center gap-5 text-[12px] sm:text-[12.5px] text-ink-600">
              <span>Words: <b class="font-bold text-ink-800 tabular-nums">${CAB.words}</b></span>
              <span>Uploaded at: <b class="font-bold text-ink-800">${CAB.uploaded}</b></span>
            </span>
          </div>
          <div class="px-5 sm:px-6 lg:px-7 py-5 sm:py-6 lg:py-7 space-y-3.5">
            ${CAB.doc.map(cabLine).join(NL14)}
          </div>
          <div class="cab-foot flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-2 px-5 py-3.5 sm:py-4 lg:py-5 border-t border-ink-100 bg-ink-50">
            ${CAB.legend.map(cabLegend).join(NL14)}
          </div>
        </div>

        <div id="cabSide" class="flex flex-col min-w-0 rounded-2xl sm:rounded-[20px] lg:rounded-3xl bg-white text-ink-900 overflow-hidden shadow-diffuse-lg">
          <div class="shrink-0 px-5 sm:px-6 py-5 sm:py-6">
            <p class="text-[17px] sm:text-[18px] font-bold tracking-tight mb-5">Report information</p>
            ${CAB.metrics.map(cabMetric).join(NL14)}
          </div>
          <div class="shrink-0 flex items-center gap-6 px-5 sm:px-6 border-b border-ink-200 bg-ink-100 text-[13.5px] font-semibold">
            <span class="cab-tab on pt-3">Plagiarism</span>
            <span class="cab-tab pt-3">AI</span>
          </div>
          <div class="cab-sources relative flex-1 min-h-[140px] overflow-hidden">
            <ul class="absolute inset-0 divide-y divide-ink-100">
              ${CAB.sources.map(cabSource).join(NL16)}
            </ul>
          </div>
        </div>
      </div>

      <div class="rv mt-6 sm:mt-8 grid lg:grid-cols-[.85fr_1.15fr] gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <p class="rounded-3xl sm:rounded-4xl bg-white/[.05] ring-1 ring-white/10 p-6 sm:p-7 lg:p-8 text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-white/75 flex items-center">${COPY.report.support}</p>
        <div class="rounded-3xl sm:rounded-4xl bg-white text-ink-900 p-6 sm:p-7 lg:p-8 flex items-start gap-4 sm:gap-5">
          ${chip('orange', I.info)}
          <p class="text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed font-semibold tracking-tight">${COPY.report.callout}</p>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 03 · OPTIONAL · UA UNIVERSITY-USER PROOF ═══════════════ */
const section3 = () => `  <!-- ================= 03 · OPTIONAL · WHO USES IT HERE =================
       Removable (UNIVERSITY_PROOF in build/ua.js) and built to be: its own section, its
       own padding, nothing before or after it leans on it. Lighter than the product
       evidence on either side — a quiet two-row field of marks in one tone, not a client
       wall — with the deconfusion note set at reading size, because it is the condition
       under which the marks may be shown at all. The files are local copies of the approved
       source assets; nothing is redrawn, only desaturated in CSS. -->
  <section id="ua-universities" class="relative py-12 sm:py-16 lg:py-20 bg-white border-b border-ink-100">
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[780px] mb-8 sm:mb-10">
        <h2 class="text-[clamp(1.35rem,2.2vw,1.85rem)] font-extrabold tracking-tightest leading-[1.15]">${COPY.uni.h2}</h2>
        <p class="mt-3 ${BODY} text-ink-600">${COPY.uni.support}</p>
      </div>
      <ul class="uni rv-kids grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 max-w-[1145px]">
${COPY.uni.logos.map(([file, name]) => `        <li><img src="${COPY.uni.base}${file}" alt="${name}" title="${name}" width="213" height="90" loading="lazy" decoding="async"></li>`).join('\n')}
      </ul>
      <p class="rv mt-7 sm:mt-8 flex items-start gap-3 max-w-[860px] text-[13px] sm:text-[13.5px] leading-relaxed text-ink-600">
        <span class="mt-0.5 shrink-0">${ico(I.info, '#6B7280', 16)}</span>
        <span>${COPY.uni.note}</span>
      </p>
    </div>
  </section>`;

/* ═══════════════ 04 · SOURCES & CONTROLS ═══════════════ */
const section4 = () => `  <!-- ================= 04 · SOURCES AND SCAN CONTROLS =================
       One sheet, four cells — three things that can be searched and one thing that can be
       set — shown as what is available, not as switches that are on: each cell carries a
       kind tag and no state. The 500 млн figure stays inside its sentence so it cannot be
       read as "every check searches all of it". -->
  <section id="sources" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[860px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.controls.eyebrow)}
        <h2 class="${H2}">${COPY.controls.h2}</h2>
        <p class="${INTRO} max-w-[72ch]">${COPY.controls.intro}</p>
      </div>
      <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
        <dl class="cells rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl overflow-hidden grid md:grid-cols-2">
${COPY.controls.cells.map(([head, body], i) => `          <div class="p-5 sm:p-6 lg:p-8">
            <div class="flex items-center justify-between gap-3 mb-4">
              ${chip(['teal', 'orange', 'ink', 'mint'][i], [I.globe, I.database, I.archive, I.quote][i])}
              <span class="${LABEL} text-ink-400">${i < 3 ? 'Джерело' : 'Параметр'}</span>
            </div>
            <dt class="text-[16.5px] sm:text-[18px] font-bold tracking-tight">${head}</dt>
            <dd class="${BODY} text-ink-600 mt-1.5 max-w-[52ch]">${body}</dd>
          </div>`).join('\n')}
        </dl>
      </div>
    </div>
  </section>`;

/* ═══════════════ 05 · HOW TO READ A MATCH ═══════════════ */
const section5 = () => `  <!-- ================= 05 · INTERPRETATION =================
       Three steps on one line — open, compare, decide — numbered large because the order
       is the content. The callout under them says who decides: a person. -->
  <section id="how-to-read" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[860px] mb-10 sm:mb-12 lg:mb-14">
${eyebrow('orange-500', COPY.read.eyebrow, 'ink')}
        <h2 class="${H2}">${COPY.read.h2}</h2>
        <p class="${INTRO} max-w-[72ch]">${COPY.read.intro}</p>
      </div>

      <ol class="rv-kids relative grid md:grid-cols-3 gap-8 md:gap-8 lg:gap-12">
        <span class="hidden md:block absolute left-0 right-0 top-[27px] h-px bg-ink-200" aria-hidden="true"></span>
${COPY.read.steps.map(([head, body], i) => `        <li class="relative">
          <span class="relative z-[1] inline-flex items-center justify-center w-[54px] h-[54px] rounded-full ${i === 2 ? 'bg-ink-900 text-white' : 'bg-teal-100 text-teal-800'} ring-[6px] ring-white text-[19px] font-extrabold tracking-tight nums">${i + 1}</span>
          <h3 class="text-[17px] sm:text-[18px] lg:text-[19px] font-bold tracking-tight mt-5 mb-2">${head}</h3>
          <p class="${BODY} text-ink-600 max-w-[44ch]">${body}</p>
        </li>`).join('\n')}
      </ol>

      <div class="rv mt-10 sm:mt-12 flex items-start gap-4 rounded-2xl sm:rounded-3xl bg-orange-50 ring-1 ring-orange-200 p-5 sm:p-6 lg:p-7">
        ${chip('orange', I.info)}
        <p class="text-[14.5px] sm:text-[15.5px] lg:text-[16px] leading-relaxed text-ink-900 font-semibold max-w-[88ch]">${COPY.read.callout}</p>
      </div>
    </div>
  </section>`;

/* ═══════════════ 06 · DOCUMENT AND REPORT LIFECYCLE ═══════════════ */
const section6 = () => `  <!-- ================= 06 · WHAT HAPPENS TO THE DOCUMENT =================
       Three stations on a rail and a fourth that is off it: processing, the source
       document and the report are what a check does; Storage is a separate act, so its
       station is drawn dashed and the rail stops before it. No absolutes either way. -->
  <section id="your-document" class="relative py-16 sm:py-24 lg:py-28 bg-[#F7FAFC]">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[860px] mb-10 sm:mb-12">
${eyebrow('teal-400', COPY.life.eyebrow)}
        <h2 class="${H2}">${COPY.life.h2}</h2>
        <p class="${INTRO} max-w-[72ch]">${COPY.life.intro}</p>
      </div>

      <ol class="rv-kids relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
        <span class="hidden lg:block absolute left-[6%] top-[22px] h-px bg-ink-200" style="right:31%" aria-hidden="true"></span>
${COPY.life.stages.map(([head, body], i) => `        <li class="relative ${i === 3 ? 'rounded-2xl sm:rounded-3xl border border-dashed border-ink-300 bg-white/70 p-5 lg:-m-5 lg:p-5' : ''}">
          <div class="flex items-center gap-3 mb-4">
            ${chip(['teal', 'ink', 'orange', 'mint'][i], [I.upload, I.file, I.report, I.archive][i]).replace('inline-flex', 'relative z-[1] inline-flex' + (i === 3 ? '' : ' ring-4 ring-[#F7FAFC]'))}
            <span class="relative z-[1] ${i === 3 ? '' : 'bg-[#F7FAFC] pr-3 '}text-[11px] font-bold tracking-[0.2em] text-ink-400 nums">0${i + 1}</span>
          </div>
          <h3 class="text-[16px] sm:text-[17px] font-bold tracking-tight mb-1.5">${head}</h3>
          <p class="${BODY} text-ink-600">${body}</p>
        </li>`).join('\n')}
      </ol>
    </div>
  </section>`;

/* ═══════════════ 07 · FREE → PAID ═══════════════ */
const section7 = () => `  <!-- ================= 07 · START FREE =================
       The two confirmed limits as two figures, the approved paragraph beside them and the
       two ways on: back to the checker, or to the pricing owner. No matrix, no prices. -->
  <section id="start-free" class="relative py-16 sm:py-24 lg:py-28 bg-white">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-14 items-center">
        <div class="rv min-w-0">
${eyebrow('teal-400', COPY.free.eyebrow, 'ink')}
          <h2 class="${H2}">${COPY.free.h2}</h2>
          <p class="${INTRO}">${COPY.free.p}</p>
          <div class="flex flex-wrap items-center gap-3 sm:gap-5 mt-7 lg:mt-8">
            ${btnDark(COPY.free.primary, ANCHOR)}
            ${linkQuiet(COPY.free.secondary, PRICING)}
          </div>
        </div>
        <div class="rv-kids grid sm:grid-cols-2 gap-4 sm:gap-5">
          <div class="rounded-3xl sm:rounded-4xl bg-teal-50 ring-1 ring-teal-600/10 p-6 sm:p-7 lg:p-8">
            <p class="text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-tightest nums leading-none text-teal-800">150</p>
            <p class="${LABEL} text-teal-700 mt-3">${COPY.free.caps[0][0]}</p>
            <p class="${BODY} text-ink-600 mt-3">${COPY.free.caps[0][1]}</p>
          </div>
          <div class="rounded-3xl sm:rounded-4xl bg-ink-950 text-white p-6 sm:p-7 lg:p-8">
            <p class="text-[clamp(2.4rem,5vw,4rem)] font-extrabold tracking-tightest nums leading-none">300</p>
            <p class="${LABEL} text-white/60 mt-3">${COPY.free.caps[1][0]}</p>
            <p class="${BODY} text-white/60 mt-3">${COPY.free.caps[1][1]}</p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 08 · REVIEWS ═══════════════ */
const PICK = [0, 2, 3];   /* one each from Trustpilot, SmartCustomer, Google Workspace Marketplace */
const section8 = () => `  <!-- ================= 08 · REVIEWS =================
       Three of the homepage's verified reviews (build/reviews.js), one per platform, as
       their authors wrote them — in English, marked as such, not translated: a translated
       quote is a different quote under a real name. No aggregate score, no "customers". -->
  <section id="reviews" class="relative py-16 sm:py-24 lg:py-28 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="rv max-w-[860px] mb-8 sm:mb-10 lg:mb-12">
        <h2 class="${H2}">${COPY.reviews.h2}</h2>
      </div>
      <div class="rv-kids grid md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch" lang="en">
${PICK.map(i => `        <div class="flex">${reviewCard(REVIEWS[i], false)}</div>`).join('\n')}
      </div>
    </div>
  </section>`;

/* ═══════════════ 09 · AI IS A DIFFERENT CHECK ═══════════════ */
const section9 = () => banner({
  id: 'ai-detector',
  orb: 'rgba(243,111,90,.16)',
  eyebrow: ['orange-400', COPY.ai.eyebrow],
  h2: COPY.ai.h2,
  lead: COPY.ai.p,
  leadMax: '62ch',
  action: banner.btn(COPY.ai.cta, AI_PAGE),
});

/* ═══════════════ 10 · FAQ ═══════════════ */
const section10 = () => `  <!-- ================= 10 · FAQ =================
       Nine questions, full answers in the HTML, the accordion the site uses. -->
  <section id="faq" class="relative py-16 sm:py-24 lg:py-28 bg-ink-50">
    <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-14 items-start">
        <div class="rv lg:sticky lg:top-28">
          <h2 class="${H2}">${COPY.faq.h2}</h2>
        </div>
        <div class="rv rounded-3xl sm:rounded-[28px] lg:rounded-4xl bg-black/[.02] ring-1 ring-black/5 p-1.5 sm:p-2 shadow-diffuse">
          <div class="rounded-[18px] sm:rounded-[20px] lg:rounded-[calc(2rem-0.5rem)] bg-white shadow-inner-hl divide-y divide-ink-100 overflow-hidden">
${COPY.faq.items.map(([q, a], i) => `            <div class="faq-item${i === 0 ? ' open' : ''}">
              <button type="button" aria-expanded="${i === 0 ? 'true' : 'false'}" class="faq-q w-full flex items-center justify-between gap-4 sm:gap-5 lg:gap-6 text-left px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6">
                <span class="text-[15.5px] font-bold tracking-tight">${q}</span>
                <span class="faq-chev shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
              <div class="faq-a"><div><p class="px-4 sm:px-5 lg:px-6 pb-5 sm:pb-6 lg:pb-7 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink-600 max-w-[72ch]">${a}</p></div></div>
            </div>`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`;

/* ═══════════════ 11 · FINAL CTA ═══════════════ */
const section11 = () => `  <!-- ================= 11 · FINAL CTA =================
       The closing band (build/cta.js). One action, back to the one real checker with the
       caret in the field — never to registration while a guest can still start. -->
  <section id="ua-cta" class="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
${cta.background('ua-cta')}

    <div class="relative max-w-[920px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
      <h2 class="rv ${cta.HEADING} mb-5 sm:mb-6 lg:mb-7">${cta.ringMark(COPY.close.h2, 'джерела')}</h2>
      <p class="rv text-[14.5px] sm:text-[15px] lg:text-[15.5px] leading-relaxed text-ink-600 max-w-[58ch] mx-auto mb-8 sm:mb-10 lg:mb-11">${COPY.close.support}</p>
      <div class="rv flex flex-col items-center gap-4">
        <a href="${ANCHOR}" class="btn-press group flex items-center gap-3 rounded-full bg-ink-900 hover:bg-ink-800 text-white text-[15px] sm:text-[16px] font-semibold pl-6 sm:pl-7 lg:pl-8 pr-2.5 py-3.5 transition-colors duration-300">
          ${COPY.close.primary}
          <span class="icon-orb w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </a>
      </div>
    </div>
  </section>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page-local styles. The .cab-* rules are the report component's contract, carried
   verbatim; the form's rules come from build/checker.js.
   ───────────────────────────────────────────────────────────────────────────── */
const STYLE = `
<style>
  [hidden] { display: none !important; }
  section[id] { scroll-margin-top: 100px; }

  a:focus-visible, button:focus-visible, select:focus-visible,
  [tabindex]:focus-visible, input:focus-visible, textarea:focus-visible {
    outline: 2px solid #0CA9C3; outline-offset: 3px; border-radius: 4px; }
  .bg-ink-950 a:focus-visible, .bg-ink-950 button:focus-visible { outline-color: #6ED7E8; }

  .rv-kids > * { opacity:0; transform:translateY(40px); }
  .no-motion .rv-kids > * { opacity:1 !important; transform:none !important; }

${checker.style}

  /* ---------- the university marks ----------
     The approved assets are 213×90 plates that already carry their own light ground, so
     the plate IS the tile: no second box around it, never scaled above its own size, and
     one quiet tone until it is pointed at. */
  .uni li { display:flex; align-items:center; justify-content:center; }
  .uni img { display:block; width:100%; max-width:213px; height:auto; aspect-ratio:213/90; border-radius:14px;
    filter:grayscale(1); opacity:.85; transition:filter .3s ease, opacity .3s ease; }
  .uni li:hover img { filter:none; opacity:1; }
  @media (prefers-reduced-motion: reduce) { .uni img { transition:none; } }

  /* ---------- the four source cells share one sheet ---------- */
  .cells > div { border-top:1px solid #EEF0F3; }
  .cells > div:first-child { border-top:0; }
  @media (min-width:768px) {
    .cells > div:nth-child(2) { border-top:0; }
    .cells > div:nth-child(even) { border-left:1px solid #EEF0F3; }
  }

  /* ---------- the shared report component ---------- */
  .cab-mark { cursor:pointer; transition:background-color .25s ease, box-shadow .25s ease;
    border-radius:.3rem; padding:.08em .16em; margin:-.08em -.16em;
    box-shadow:inset 0 -2px 0 currentColor;
    background-image:linear-gradient(var(--wash), var(--wash));
    background-repeat:no-repeat; background-position:left center; background-size:100% 100%; }
  .cab-plag { --wash:rgba(243,111,90,.18); color:rgba(243,111,90,.85); }
  .cab-ai   { --wash:rgba(168,85,247,.15); color:rgba(168,85,247,.75); }
  .cab-plag.on { --wash:rgba(243,111,90,.4); }
  .cab-ai.on   { --wash:rgba(168,85,247,.34); }
  .cab-mark > span { color:#111827; }
  .cab-src.on { background:#F8F9FB; }
  .cab-tab { padding-bottom:10px; border-bottom:2px solid transparent; color:#4B5563; }
  .cab-tab.on { color:#06748A; border-bottom-color:#0991A8; }
  .cab-sources, .cab-foot { border-bottom-left-radius:1rem; border-bottom-right-radius:1rem; }
  @media (min-width:640px) {
    .cab-sources, .cab-foot { border-bottom-left-radius:20px; border-bottom-right-radius:20px; }
  }
  @media (min-width:1024px) {
    .cab-sources, .cab-foot { border-bottom-left-radius:1.5rem; border-bottom-right-radius:1.5rem; }
  }
  .cab-sources::after { content:""; position:absolute; left:0; right:0; bottom:0; height:64px;
    pointer-events:none; background:linear-gradient(to bottom, rgba(255,255,255,0), #fff 88%); }
  @media (prefers-reduced-motion: reduce) { .cab-mark { transition:none; } }

  .no-motion .pen-word { color:#DC5A45; }
  .no-motion .pen-underline { opacity:1; }
${cta.style('ua-cta')}
</style>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Behaviour — the form's own, the report's own, the accordion, the burger.
   ───────────────────────────────────────────────────────────────────────────── */
const SCRIPT = `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script>
(() => {
  'use strict';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap) { document.documentElement.classList.add('no-motion'); return; }

  gsap.registerPlugin(ScrollTrigger);

  const rvs = gsap.utils.toArray('.rv');
  const inView = rvs.filter(el => el.getBoundingClientRect().top < innerHeight * .9);
  inView.forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      delay: .1 + (el.getBoundingClientRect().top / innerHeight) * .3 });
  });
  rvs.filter(el => !inView.includes(el)).forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 70%' } });
  });

  gsap.utils.toArray('.rv-kids').forEach(group => {
    gsap.to(group.children, { opacity: 1, y: 0, duration: .7, ease: 'power2.out', stagger: .06,
      scrollTrigger: { trigger: group, start: 'top 80%' } });
  });

  gsap.utils.toArray('.pen-word').forEach(word => {
    const line = word.querySelector('.pen-underline');
    if (!line) return;
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
    const inFirstView = word.getBoundingClientRect().top < innerHeight * .9;
    const tl = gsap.timeline(inFirstView
      ? { delay: 1 }
      : { scrollTrigger: { trigger: word, start: 'top 80%', once: true } });
    tl.to(word, { color: '#DC5A45', duration: .45, ease: 'power2.out' })
      .set(line, { opacity: 1 }, .35)
      .to(line, { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, .35);
  });
${cta.script}
})();
</script>
<script>
(() => {
  'use strict';
${checker.script(ANCHOR)}

  /* the report: selecting a passage highlights it and its source */
  const marks = [...document.querySelectorAll('.cab-mark')];
  const sources = [...document.querySelectorAll('.cab-src')];
  const pick = i => {
    marks.forEach(m => m.classList.toggle('on', m.dataset.match === String(i)));
    sources.forEach(s => s.classList.toggle('on', s.dataset.src === String(i)));
  };
  marks.forEach(m => {
    m.addEventListener('click', () => pick(m.dataset.match));
    m.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(m.dataset.match); }
    });
  });
  if (marks.length) pick(marks[0].dataset.match);

  /* FAQ: answers are already in the DOM; this only opens and closes them */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      const list = item.parentElement;
      list.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
      list.querySelectorAll('.faq-q').forEach(b =>
        b.setAttribute('aria-expanded', String(b.closest('.faq-item').classList.contains('open'))));
    });
  });
})();
</script>
<script>
(() => {
  'use strict';
  const btn = document.getElementById('navBurger');
  const panel = document.getElementById('navPanel');
  if (!btn || !panel) return;
  const setOpen = on => {
    btn.setAttribute('aria-expanded', String(on));
    panel.classList.toggle('open', on);
    btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  addEventListener('resize', () => { if (innerWidth >= 1024) setOpen(false); });
})();
</script>`;

/* ─────────────────────────────────────────────────────────────────────────────
   Assemble
   ───────────────────────────────────────────────────────────────────────────── */
const donor = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
let head = donor.slice(0, donor.indexOf('<body'));
head = head.replace(/<html([^>]*)\blang="[^"]*"/, '<html$1lang="uk"');
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + COPY.title + '</title>');
if (/name="description"/.test(head)) {
  head = head.replace(/<meta name="description"[^>]*>/,
    '<meta name="description" content="' + COPY.meta + '" />');
} else {
  head = head.replace('<title>',
    '<meta name="description" content="' + COPY.meta + '" />\n<title>');
}
head = head.replace('<title>', '<link rel="canonical" href="' + COPY.canonical + '" />\n<title>');

const bodyTag = donor.slice(donor.indexOf('<body'), donor.indexOf('>', donor.indexOf('<body')) + 1);

const sections = [section1, section2, UNIVERSITY_PROOF && section3, section4, section5, section6,
  section7, section8, section9, section10, section11].filter(Boolean);

const html = head + STYLE + '\n' + bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${sections.map(f => f()).join('\n\n')}
</main>

<footer></footer>

${SCRIPT}
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);

const count = re => (html.match(re) || []).length;
console.log('  site/' + OUT + ' — ' + html.length + ' bytes');
console.log('  ' + count(/<section\b/g) + ' sections, ' + count(/<h1\b/g) + ' h1, ' +
            count(/<h2\b/g) + ' h2, ' + count(/<h3\b/g) + ' h3, ' + count(/class="faq-item/g) + ' faq items, ' +
            count(/<form\b/g) + ' form, ' + count(/universities-ua\//g) + ' university marks');
