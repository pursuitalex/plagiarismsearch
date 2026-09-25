/* The section-reuse test page — the proof that a section can leave its page.

   Four sections are copied VERBATIM out of the Students POC (sliced from its <section>
   to its </section>, not re-rendered) into a page that has nothing else: no header, no
   footer, no grain, no page CSS, no page JS — only the shared production assets in
   <head> (build/assets.js head()) and the body tag every page has. If a section still
   looks and works the same here, it depends on nothing but the shared system.

   The sections keep their ids: the CTA band's button points at #student-checker, and
   landing on the hero here — and focusing its field — is part of the test.

   Run:  node build/students.js  →  node build/poc-sections.js
*/
const fs = require('fs');
const path = require('path');
const assets = require('./assets');

const SITE = path.join(__dirname, '..', 'site');
const SRC = 'plagiarism-checker-for-students-poc.html';
const OUT = 'poc-sections.html';
const PICK = ['hero-checker', 'report-dark', 'faq', 'cta-band'];

const src = fs.readFileSync(path.join(SITE, SRC), 'utf8');
const slice = name => {
  const at = src.indexOf('data-component="' + name + '"');
  if (at < 0) throw new Error('no section data-component="' + name + '" in ' + SRC);
  const a = src.lastIndexOf('<section', at);
  const b = src.indexOf('</section>', at) + '</section>'.length;
  return '  ' + src.slice(a, b);
};

/* the donor's font links, as they are */
const fonts = src.slice(src.indexOf('<link rel="preconnect" href="https://fonts.googleapis.com">'),
  src.indexOf('rel="stylesheet">', src.indexOf('fonts.googleapis.com/css2')) + 'rel="stylesheet">'.length);
const bodyTag = src.slice(src.indexOf('<body'), src.indexOf('>', src.indexOf('<body')) + 1);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>Section reuse test</title>
${fonts}
${assets.head()}
</head>
${bodyTag}
<main>
${PICK.map(slice).join('\n\n')}
</main>
</body>
</html>
`;

fs.writeFileSync(path.join(SITE, OUT), html);
console.log('  site/' + OUT + ' — ' + PICK.length + ' sections copied verbatim from ' + SRC + ' (' + html.length + ' bytes)');
