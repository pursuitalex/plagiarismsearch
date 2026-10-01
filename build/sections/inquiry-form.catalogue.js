/* Inquiry form — its catalogue entry (site/section-library.html, built by
   build/section-library.js).

   Every snippet is a form section the template (build/sections/inquiry-form.js) rendered
   for an approved page, read back from site/ (catalogue-tools.js). Run after the page
   generators. */
const { sectionOf } = require('./catalogue-tools');

const snippets = [
  { file: 'inquiry-form-select.html', name: 'Inquiry form · поля, список вибору, згода',
    about: 'Біла секція: ліва колонка (пігулка, заголовок, вступ, рядок з e-mail), картка з формою — текстові поля, список <select>, textarea, згода з двома посиланнями, кнопка; прихований стан успіху під формою. Копія — University.',
    uses: 'university-plagiarism-checker',
    html: sectionOf('university-plagiarism-checker.html', 'inquiry', 'example-inquiry') },
  { file: 'inquiry-form-chips.html', name: 'Inquiry form · з чипами множинного вибору',
    about: 'Те саме з групою чипів (fieldset.inquiry-choice) — «What do you need?»; поля з атрибутом required; форма з data-focus-first: посилання на секцію ставить курсор у перше поле. Копія — Business & Teams.',
    uses: 'plagiarism-checker-for-organization',
    html: sectionOf('plagiarism-checker-for-organization.html', 'inquiry', 'example-inquiry-chips') },
  { file: 'inquiry-form-cool.html', name: 'Inquiry form · холодний фон, без згоди',
    about: 'data-bg="cool": пігулка сама стає білою; data-layout="fluid-wide" — ширша ліва колонка; data-accent="teal" — бірюзова крапка; data-sticky="off" — ліва колонка не їде за прокруткою. Без рядка згоди; слово Optional біля підпису. Копія — API.',
    uses: 'api',
    html: sectionOf('api.html', 'inquiry', 'example-inquiry-cool') },
];

const pages = [
  ['plagiarism-checker-for-organization.html', 'section', 'white', '8 полів + чипи (6); згода; data-focus-first; успіх одним рядком'],
  ['university-plagiarism-checker.html', 'section', 'white', '8 полів, серед них select; рядок з e-mail; згода; успіх із заголовком'],
  ['api.html', 'section', 'cool · fluid-wide · teal · sticky off', '6 полів; рядок з e-mail; без згоди; успіх із заголовком'],
];

module.exports = {
  lead: 'Секція кваліфікованого запиту: ліва колонка каже, що надіслати, права — картка з формою. Поля — спільний рецепт форм сайту (cf-label / cf-field). Форма в прототипі нічого не відправляє: підключення до бекенду робить розробник, і склад полів змінюється лише разом із ним.',
  files: { template: 'build/sections/inquiry-form.js', css: 'build/sections/inquiry-form.css (поля — build/assets/css/14-forms.css)', js: 'build/assets/js/36-inquiry-form.js, 35-form-arrive.js', contract: 'build/sections/inquiry-form.contract.js' },
  snippets, pages,
};
