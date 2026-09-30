/* A tiny static server over site/ for the parity harness — no dependency, no caching.
   Root-relative paths (/assets/…) resolve against site/, as they will in production.

     /<file>                 the page as it is now, from site/
     /__base/<file>          the page as it was approved (build/parity/out/baseline/),
                             its relative asset paths falling through to site/
     virtual(path) → html    any other page the harness wants to serve without writing it
                             to site/ — the one-section reuse pages */
const http = require('http');
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..', '..', 'site');
const BASE = path.join(__dirname, 'out', 'baseline');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' };

function start(port = 4180, { virtual } = {}) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    const v = virtual && virtual(p);
    if (v) { res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' }); return res.end(v); }
    let root = SITE;
    if (p.startsWith('/__base/')) {
      p = p.slice('/__base'.length);
      if (fs.existsSync(path.join(BASE, p)) && fs.statSync(path.join(BASE, p)).isFile()) root = BASE;
    }
    if (p.endsWith('/')) p += 'index.html';
    let f = path.join(root, p);
    if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => server.listen(port, () => r(server)));
}
module.exports = { start };
if (require.main === module) start(+process.argv[2] || 4180).then(() => console.log('serving site/ on', +process.argv[2] || 4180));
