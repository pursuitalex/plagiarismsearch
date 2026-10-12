/* Check site/404.html — the page for an address that leads nowhere (build/not-found.js).

   It is served AT the wrong address, at any depth, so the thing to hold is that nothing
   on it depends on where it is: a base in the head, every address resolving from the
   root, no in-page anchor. Then the page's own promise: one H1, a way home, the usual
   destinations, and no form, figure or product claim.

   Run: node build/check-not-found.js
*/
const fs = require('fs');
const path = require('path');
const N = require('./not-found');

const SITE = path.join(__dirname, '..', 'site');
const html = fs.readFileSync(path.join(SITE, N.OUT), 'utf8');
const head = html.slice(0, html.indexOf('<body'));
const body = html.slice(html.indexOf('<main>'), html.indexOf('</main>'));
const flat = s => s.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

let failed = 0;
const ok = (label, pass, detail = '') => {
  if (!pass) failed++;
  console.log('  ' + (pass ? 'ok    ' : 'FAIL  ') + label + (detail ? '  ' + detail : ''));
};

console.log('served at any address');
{
  ok('the head carries <base href="/">, before any address', /<head>\s*<base href="\/" \/>/.test(head));
  const refs = [...html.matchAll(/(?:^|[\s"'])(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  const local = refs.filter(r => !/^(https?:|mailto:|tel:|data:)/.test(r));
  ok('no in-page "#" link (a base would send it to the root)', !local.some(r => r.startsWith('#')), local.filter(r => r.startsWith('#')).join(' '));
  const missing = local.filter(r => !fs.existsSync(path.join(SITE, r.replace(/^\//, '').split('#')[0].split('?')[0])));
  ok(local.length + ' addresses resolve from the site root', !missing.length, missing.slice(0, 5).join(', '));
  ok('the file is 404.html at the root, where the host looks for it', N.OUT === '404.html' && fs.existsSync(path.join(SITE, '404.html')));
  ok('not indexed', /<meta name="robots" content="noindex/.test(head));
}

console.log('\nthe page');
{
  const h1s = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => flat(m[1]));
  ok('exactly one H1', h1s.length === 1 && h1s[0] === N.COPY.h1, h1s.join(' | '));
  ok('the title says what happened', (html.match(/<title>([^<]*)<\/title>/) || [])[1] === N.COPY.title);
  ok('one section, named', (body.match(/<section\b/g) || []).length === 1 && /data-component="not-found"/.test(body));
  const text = flat(body);
  ok('the copy is on the page', [N.COPY.eyebrow, N.COPY.lead, N.COPY.ways.label].every(s => text.includes(s)));
  const links = [...body.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(m => [flat(m[2]), m[1]]);
  const want = [N.COPY.primary, N.COPY.secondary, ...N.COPY.ways.links];
  ok('a way home, the Help Center and the five usual destinations — and nothing else', links.length === want.length && want.every(([l, h]) => links.some(x => x[0] === l && x[1] === h)), links.map(l => l.join(' → ')).join(', '));
  ok('the drawing is described once for a screen reader and its parts are hidden', (body.match(/role="img"/g) || []).length === 1 && body.includes('aria-label="' + N.COPY.drawing + '"') && (body.match(/aria-hidden="true"/g) || []).length >= 4);
  ok('no form, no figure, no CSS or JS of its own', !/<form\b|<input\b|<style\b|<script\b|\sstyle="/.test(body) && !/\d+\s?%|[$€£]\s?\d/.test(text));
  ok('the global header and footer are there', /<header\b[\s\S]*<\/header>/.test(html) && /<footer\b[\s\S]*<\/footer>/.test(html) && html.indexOf('<header') < html.indexOf('<main>'));
}

console.log('\n' + (failed ? failed + ' check(s) FAILED' : 'all ok') + '  (' + N.OUT + ')');
process.exit(failed ? 1 : 0);
