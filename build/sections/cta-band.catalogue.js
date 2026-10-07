/* CTA band — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a band the template (build/sections/cta-band.js) rendered for an
   approved page, read back from site/ as it stands there — the approved copy, the approved
   configuration — with only its anchor id renamed (catalogue-tools.js). Run after the
   page generators. */
const { sectionOf } = require('./catalogue-tools');

/* the band of a page, under an example id */
const bandOf = (file, id) => sectionOf(file, 'cta-band', id);

const snippets = [
  { file: 'cta-band-link.html', name: 'CTA band · кнопка і тихе посилання',
    about: 'Фірмова смуга: заголовок з обведеним словом, вступ, темна кнопка (з іконкою-іскрою на початку — її можна прибрати) і тихе посилання поруч. Копія — AI Detector.',
    uses: 'ai-detector, api (іконка «код»), plagiarism-checker-for-organization, university-plagiarism-checker (без іконки)',
    html: bandOf('ai-detector.html', 'example-cta') },
  { file: 'cta-band-button.html', name: 'CTA band · одна кнопка',
    about: 'Те саме без посилання: одна дія. Копія — Pricing.',
    uses: 'prices; paper-analysis (без іконки)',
    html: bandOf('prices.html', 'example-cta-button') },
  { file: 'cta-band-stack.html', name: 'CTA band · кнопка і рядок з іскрою (stack)',
    about: 'data-layout="stack": під кнопкою — рядок-запевнення з іскрою (p.cta-hint). Копія — Students.',
    uses: 'plagiarism-checker-for-students, pdf-plagiarism-checker, turnitin-checker-alternative',
    html: bandOf('plagiarism-checker-for-students.html', 'example-cta-stack') },
  { file: 'cta-band-eyebrow.html', name: 'CTA band · з пігулкою і рядком під кнопкою',
    about: 'Над заголовком — пігулка з крапкою, що пульсує; під діями — виразний рядок (p.cta-note). Вступ вужчий: data-measure="52". Копія — головна.',
    uses: 'index (головна)',
    html: bandOf('index.html', 'example-cta-eyebrow') },
  { file: 'cta-band-kicker.html', name: 'CTA band · рядок над заголовком',
    about: 'Замість вступу під заголовком — рядок над ним (p.cta-kicker); заголовок одразу перед кнопкою. Копія — Affiliate Program.',
    uses: 'affiliate-program-at-plagiarismsearch, affiliate-program-at-plagiarismsearch-v2',
    html: bandOf('affiliate-program-at-plagiarismsearch.html', 'example-cta-kicker') },
  { file: 'cta-band-pair.html', name: 'CTA band · дві кнопки і тиха примітка (pair)',
    about: 'data-layout="pair": дві рівноправні дії розміру 48/56px — темна і світла; під ними тиха примітка з посиланням (p.cta-note data-tone="quiet"). Копія — About us.',
    uses: 'about-us',
    html: bandOf('about-us.html', 'example-cta-pair') },
  { file: 'cta-band-wide.html', name: 'CTA band · ширша колонка (wide)',
    about: 'data-width="wide": колонка 920px для довшого заголовка; дії стовпчиком без рядка з іскрою. Копія — українська сторінка.',
    uses: 'ua-plagiarism-check',
    html: bandOf('ua-plagiarism-check.html', 'example-cta-wide') },
  { file: 'cta-band-plain.html', name: 'CTA band · plain (старі сторінки)',
    about: 'data-variant="plain": спрощена смуга — м’яка пляма замість крапкового поля, заголовок розміру секції без обведення, одна бірюзова кнопка 48/56px. Копія — Help Center.',
    uses: 'help-center, mission, contact-us, chat-bot, plagiarism-check',
    html: bandOf('help-center.html', 'example-cta-plain') },
];

const pages = [
  ['index.html', 'section', 'ряд', 'пігулка; вступ 52; кнопка з іскрою; рядок під діями'],
  ['ai-detector.html', 'section', 'ряд', 'вступ 56; кнопка з іскрою + тихе посилання'],
  ['api.html', 'section', 'ряд', 'кнопка з іконкою «код» + тихе посилання'],
  ['prices.html', 'section', 'ряд', 'кнопка з іскрою'],
  ['plagiarism-checker-for-organization.html', 'section', 'ряд', 'вступ 62; кнопка + тихе посилання'],
  ['university-plagiarism-checker.html', 'section', 'ряд', 'вступ 62; кнопка + тихе посилання'],
  ['paper-analysis.html', 'section', 'ряд', 'вступ 56; кнопка'],
  ['affiliate-program-at-plagiarismsearch.html (і -v2)', 'section', 'ряд', 'рядок над заголовком; кнопка'],
  ['plagiarism-checker-for-students.html', 'section', 'stack', 'кнопка + рядок з іскрою'],
  ['pdf-plagiarism-checker.html', 'section', 'stack', 'кнопка + рядок з іскрою'],
  ['turnitin-checker-alternative.html', 'section', 'stack', 'вступ 62; кнопка + рядок з іскрою'],
  ['ua-plagiarism-check.html', 'section', 'wide · stack', 'кнопка'],
  ['about-us.html', 'section', 'pair', 'вступ 560px; дві кнопки; тиха примітка з посиланням'],
  ['help-center.html, mission.html, contact-us.html, chat-bot.html, plagiarism-check.html', 'section', 'plain', 'бірюзова кнопка'],
];

module.exports = {
  lead: 'Завершальна смуга перед футером — останнє, що каже сторінка: заголовок, один рядок і одна дія. Два затверджені вигляди: фірмова смуга (крапкове поле, два світіння, обведене слово) і спрощена plain на старих сторінках.',
  files: { template: 'build/sections/cta-band.js', css: 'build/sections/cta-band.css', js: 'build/assets/js/20-motion.js (поява .rv, обведення .ring-word)', contract: 'build/sections/cta-band.contract.js' },
  snippets, pages,
};
