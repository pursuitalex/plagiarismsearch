/* Build the shared production assets — the static replacement for the Tailwind Play CDN
   and for the <style>/<script> blocks every page used to carry.

     site/assets/css/site.css        our CSS: build/assets/css/NN-*.css, in file order
     site/assets/css/tailwind.css    tailwindcss 3.4.17, compiled from tailwind.config.js
     site/assets/js/site.js          our JS: build/assets/js/NN-*.js, one module each
     site/assets/vendor/gsap/3.12.5/ gsap.min.js + ScrollTrigger.min.js, pinned, local

   The order pages link them in is part of the design (see head() below): site.css, then
   tailwind.css — the Play CDN appended its sheet last, so on equal specificity a
   utility has always won, and the static build keeps it that way.

   Source is modular, output is one file per kind: a page makes three requests for all of
   it, and nothing is duplicated between pages.

   Run:  node build/assets.js        (before the page builders that link the assets)
*/
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'assets');
const OUT = path.join(ROOT, 'site', 'assets');
const TW_VERSION = '3.4.17';
const GSAP_VERSION = '3.12.5';

/* Vendor prefixes. The Play CDN ran its output through autoprefixer; the CLI does not,
   so without this step the static sheet silently loses -webkit-backdrop-filter (the glass
   header in Safari), -webkit-text-decoration-* and the rest. These targets were chosen by
   comparing, rule by rule, the CSS the CDN generated for the approved pages with ours
   (build/parity/students.js, check 0): every declaration the CDN produced is present.
   A handful of extra, harmless prefixes come with it (-moz-column-gap, -o-object-fit,
   -o-tab-size, position:-webkit-sticky); modern browsers ignore them. remove:false keeps
   the prefixes Tailwind's own preflight writes (-moz-tab-size), as the CDN did. */
const PREFIX_TARGETS = ['> 0.2%', 'not dead', 'Safari >= 12', 'iOS >= 12', 'not op_mini all', 'not kaios > 0'];

const list = (dir, re) => fs.readdirSync(dir).filter(f => re.test(f)).sort();
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };

function build() {
  /* the pinned versions are the ones installed, or nothing is built */
  const twPkg = require(path.join(ROOT, 'node_modules', 'tailwindcss', 'package.json'));
  if (twPkg.version !== TW_VERSION) throw new Error('tailwindcss ' + twPkg.version + ' installed, ' + TW_VERSION + ' pinned');
  const gsapPkg = require(path.join(ROOT, 'node_modules', 'gsap', 'package.json'));
  if (gsapPkg.version !== GSAP_VERSION) throw new Error('gsap ' + gsapPkg.version + ' installed, ' + GSAP_VERSION + ' pinned');

  /* 1 · site.css — our rules, in the cascade order the pages had */
  const cssParts = list(path.join(SRC, 'css'), /^\d\d-.*\.css$/);
  write(path.join(OUT, 'css', 'site.css'),
    '/* site.css — built by build/assets.js from build/assets/css/. Do not edit here. */\n\n' +
    cssParts.map(f => fs.readFileSync(path.join(SRC, 'css', f), 'utf8').trim()).join('\n\n') + '\n');

  /* 2 · tailwind.css — the pinned CLI, the shared config, then the CDN's prefixes.
     NOT minified with the CLI's --minify: its colour minifier rewrites
     rgb(251 201 191 / .6) as hsla(10,88%,87%,.6), which a browser resolves to
     251,202,193 — a real colour change, caught by the parity run. A production minifier
     must be lossless on colours (or leave them alone). */
  const cli = path.join(ROOT, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
  const raw = path.join(OUT, 'css', 'tailwind.raw.css');
  fs.mkdirSync(path.dirname(raw), { recursive: true });
  execFileSync(process.execPath, [cli,
    '-c', path.join(ROOT, 'tailwind.config.js'),
    '-i', path.join(SRC, 'css', 'tailwind.src.css'),
    '-o', raw,
    ], { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] });
  const postcss = require('postcss');
  const autoprefixer = require('autoprefixer');
  const prefixed = postcss([autoprefixer({ overrideBrowserslist: PREFIX_TARGETS, remove: false })])
    .process(fs.readFileSync(raw, 'utf8'), { from: undefined }).css;
  fs.unlinkSync(raw);
  write(path.join(OUT, 'css', 'tailwind.css'),
    '/* tailwind.css — tailwindcss ' + TW_VERSION + ' + autoprefixer, built by build/assets.js from tailwind.config.js. Do not edit here. */\n' + prefixed);

  /* 3 · site.js — the modules, in file order, then start */
  const jsParts = list(path.join(SRC, 'js'), /^\d\d-.*\.js$/);
  write(path.join(OUT, 'js', 'site.js'),
    '/* site.js — built by build/assets.js from build/assets/js/. Do not edit here. */\n' +
    "(() => {\n'use strict';\n\n" +
    jsParts.map(f => '/* ── ' + f + ' ── */\n' + fs.readFileSync(path.join(SRC, 'js', f), 'utf8').trim()).join('\n\n') +
    '\n\nPS.start();\n})();\n');

  /* 4 · GSAP, local and pinned */
  for (const f of ['gsap.min.js', 'ScrollTrigger.min.js']) {
    const to = path.join(OUT, 'vendor', 'gsap', GSAP_VERSION, f);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'node_modules', 'gsap', 'dist', f), to);
  }

  const size = f => (fs.statSync(path.join(OUT, f)).size / 1024).toFixed(1) + ' KB';
  console.log('  site/assets/css/site.css      ' + size('css/site.css') + '  (' + cssParts.length + ' partials)');
  console.log('  site/assets/css/tailwind.css  ' + size('css/tailwind.css') + '  (tailwindcss ' + TW_VERSION + ')');
  console.log('  site/assets/js/site.js        ' + size('js/site.js') + '  (' + jsParts.length + ' modules)');
  console.log('  site/assets/vendor/gsap/' + GSAP_VERSION + '/  gsap.min.js, ScrollTrigger.min.js');
}

/* The boot snippet, inlined: comments stripped, whitespace collapsed. */
const boot = () => fs.readFileSync(path.join(SRC, 'js', 'boot.js'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s{2,}/g, ' ').trim();

/* What a page puts in <head> to use the system — the only CSS/JS it carries. */
const head = () => [
  '<link rel="stylesheet" href="/assets/css/site.css">',
  '<link rel="stylesheet" href="/assets/css/tailwind.css">',
  '<script>' + boot() + '</script>',
  '<script defer src="/assets/vendor/gsap/' + GSAP_VERSION + '/gsap.min.js"></script>',
  '<script defer src="/assets/vendor/gsap/' + GSAP_VERSION + '/ScrollTrigger.min.js"></script>',
  '<script defer src="/assets/js/site.js"></script>',
].join('\n');

module.exports = { build, head, boot, TW_VERSION, GSAP_VERSION, PREFIX_TARGETS };
if (require.main === module) build();
