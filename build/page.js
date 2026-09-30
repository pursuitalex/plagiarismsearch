/* One page shell for every page on the shared production assets.

   Every master generator used to assemble its own page: the donor's <head> (with the
   Play CDN, its config and the base <style>), then its own <style>, then its own
   <script> blocks after the footer. On the shared assets all of that is the same for
   every page, so it lives here once:

     const page = require('./page');
     fs.writeFileSync(path.join(SITE, OUT), page.render({
       title, meta, canonical,          // the page's own
       lang: 'uk',                      // optional, default 'en'
       sections: [ '<section …>…</section>', … ],
     }));

   The <head> keeps the donor's meta lines as they are (robots, viewport, fonts) and
   swaps the CDN, its config and the base <style> for build/assets.js head(). The body is
   the grain, the header and footer placeholders build/shell.js fills, and <main>. No
   page carries CSS or JS of its own. */
const fs = require('fs');
const path = require('path');
const assets = require('./assets');

const SITE = path.join(__dirname, '..', 'site');
const esc = s => String(s).replace(/"/g, '&quot;');

/* the page head: build/shell/head.html (meta, title, fonts) with the shared assets in
   place of {{ASSETS}} — the one head every page shares */
function donor(ds) {
  const d = fs.readFileSync(path.join(__dirname, 'shell', 'head.html'), 'utf8');
  if (!d.includes('{{ASSETS}}')) throw new Error('page.js: build/shell/head.html has no {{ASSETS}}');
  const head = d.slice(0, d.indexOf('<body')).replace('{{ASSETS}}', assets.head({ ds }));
  const bodyTag = d.slice(d.indexOf('<body'), d.indexOf('>', d.indexOf('<body')) + 1);
  return { head, bodyTag };
}

/* chrome: false — an internal review page (the prototype index): no grain, no site header
   or footer. ds: 'css' — it also links ds.css, the internal pages' own CSS (not ds.js). */
function render({ title, meta, canonical, lang = 'en', sections, chrome = true, ds = false, mainClass = '' }) {
  if (!title || !sections || !sections.length) throw new Error('page.render: title and sections are required');
  const d = donor(ds);
  let head = d.head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + title + '</title>');
  if (lang !== 'en') head = head.replace(/<html([^>]*)\blang="[^"]*"/, '<html$1lang="' + lang + '"');
  if (meta) {
    head = /name="description"/.test(head)
      ? head.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="' + esc(meta) + '" />')
      : head.replace('<title>', '<meta name="description" content="' + esc(meta) + '" />\n<title>');
  }
  if (canonical) head = head.replace('<title>', '<link rel="canonical" href="' + canonical + '" />\n<title>');
  const main = mainClass ? `<main class="${mainClass}">` : '<main>';
  if (!chrome) return head + d.bodyTag + `
${main}
${sections.join('\n\n')}
</main>
</body>
</html>
`;
  return head + d.bodyTag + `
<div class="grain"></div>

<header></header>

<main>
${sections.join('\n\n')}
</main>

<footer></footer>
</body>
</html>
`;
}

module.exports = { render };
