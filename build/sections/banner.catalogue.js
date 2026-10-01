/* Banner — its catalogue entry (site/section-library.html, built by build/section-library.js).

   Every snippet is a banner the template (build/sections/banner.js) rendered for an
   approved page, read back from site/ (catalogue-tools.js). Run after the page generators. */
const { sectionOf } = require('./catalogue-tools');

const snippets = [
  { file: 'banner-row.html', name: 'Banner · ряд: текст і кнопка',
    about: 'Базовий банер між секціями: пігулка, заголовок, один абзац, біла кнопка праворуч. Світіння coral. Копія — Pricing (high volume).',
    uses: 'prices; ua-plagiarism-check (coral-soft, український текст)',
    html: sectionOf('prices.html', 'banner', 'example-banner') },
  { file: 'banner-row-detail.html', name: 'Banner · ряд із другим абзацом',
    about: 'Під вступом — тихіший другий абзац (p.banner-detail). Світіння teal, вступ data-measure="60". Копія — Moodle Integration (support).',
    uses: 'integration-guide',
    html: sectionOf('integration-guide.html', 'banner', 'example-banner-detail') },
  { file: 'banner-row-link.html', name: 'Banner · ряд: кнопка і тихе посилання',
    about: 'Дві дороги далі: кнопка і під нею тихе посилання (.banner-actions). Вступ ширший — data-measure="66". Копія — Business & Teams (plans & custom).',
    uses: 'plagiarism-checker-for-organization',
    html: sectionOf('plagiarism-checker-for-organization.html', 'banner', 'example-banner-link') },
  { file: 'banner-split.html', name: 'Banner · split: зі схемою, тезою-пігулкою і другим абзацом',
    about: 'data-layout="split": праворуч схема «одне → два» (.banner-branch), кнопка під нею; головна думка винесена в пігулку (p.banner-pill), під нею тихіший абзац. Світіння teal. Копія — AI Detector (API).',
    uses: 'ai-detector',
    html: sectionOf('ai-detector.html', 'banner', 'example-banner-split') },
  { file: 'banner-split-callout.html', name: 'Banner · split: зі схемою і застереженням',
    about: 'Те саме зі світінням violet і застереженням у рамці (p.banner-callout) замість пігулки. Копія — University (optional AI checking).',
    uses: 'university-plagiarism-checker',
    html: sectionOf('university-plagiarism-checker.html', 'banner', 'example-banner-callout') },
];

const pages = [
  ['prices.html', 'section', 'coral · ряд', 'пігулка; вступ; кнопка'],
  ['ua-plagiarism-check.html', 'section', 'coral-soft · ряд', 'пігулка; вступ; кнопка'],
  ['integration-guide.html', 'section', 'teal · ряд', 'пігулка; вступ 60; другий абзац; кнопка'],
  ['plagiarism-checker-for-organization.html', 'section', 'coral · ряд', 'пігулка; вступ 66; другий абзац; кнопка + тихе посилання'],
  ['ai-detector.html', 'section', 'teal · split', 'пігулка; вступ 54; теза-пігулка; другий абзац 58; схема; кнопка під схемою'],
  ['university-plagiarism-checker.html', 'section', 'violet · split', 'пігулка; вступ 60; застереження; схема; кнопка під схемою'],
];

module.exports = {
  lead: 'Компактний темний банер між секціями: каже одну річ про можливість, що живе на іншій сторінці, і веде туди. Це заголовковий блок, а не менший фінал: розміри заголовка й абзацу — як у темної акцентної картки. Не плутати із завершальною смугою (CTA band).',
  files: { template: 'build/sections/banner.js', css: 'build/sections/banner.css', js: '', contract: 'build/sections/banner.contract.js' },
  snippets, pages,
};
