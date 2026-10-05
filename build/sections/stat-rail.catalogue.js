/* Stat rail — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a rail the template (build/sections/stat-rail.js) rendered for an
   approved page, read back from site/ as it stands there — the approved copy, the approved
   configuration — with only its anchor id set (catalogue-tools.js). Run after the page
   generators. */
const { sectionOf } = require('./catalogue-tools');

const railOf = (file, id) => sectionOf(file, 'stat-rail', id);

const snippets = [
  { file: 'stat-rail.html', name: 'Stat rail · дві цифри і знак',
    about: 'Вузька смуга доказів під hero: цифра або знак, під ними короткий підпис; над другою цифрою — рядок «Plagiarism checking in», в інших пунктах на його місці порожній проміжок. Підписи контрастні (ink-500). Копія — Students.',
    uses: 'plagiarism-checker-for-students',
    html: railOf('plagiarism-checker-for-students.html', 'example-stat-rail') },
  { file: 'stat-rail-roll.html', name: 'Stat rail · цифри «прокручуються», світліші підписи',
    about: 'Те саме з класом od-num на цифрах — вони набігають, як одометр, коли смуга з’являється, — і з data-tone="soft" (світліші підписи головної). Копія — головна.',
    uses: 'index (головна)',
    html: railOf('index.html', 'example-stat-rail-roll') },
];

const pages = [
  ['plagiarism-checker-for-students.html', 'section', '—', '3 пункти: дві цифри, знак BBB; один рядок над цифрою'],
  ['index.html', 'section', 'soft', '3 пункти: дві цифри з od-num, знак BBB; один рядок над цифрою'],
];

module.exports = {
  lead: 'Вузька смуга доказів одразу під hero: кілька цифр або знаків в один ряд, кожен із коротким підписом. Власного заголовка не має.',
  files: { template: 'build/sections/stat-rail.js', css: 'build/sections/stat-rail.css', js: 'build/assets/js/20-motion.js (поява .rv), 24-odometer.js (цифри з класом od-num)', contract: 'build/sections/stat-rail.contract.js' },
  snippets, pages,
};
