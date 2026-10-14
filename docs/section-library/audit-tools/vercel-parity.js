/* Does the Vercel deployment serve exactly the files of the repository's HEAD?
   For every file tracked under site/: its bytes at HEAD (git cat-file) against the bytes
   Vercel serves at the same path. Read-only: nothing in the repository is written.
   node vercel-parity.js  → prints a summary and writes vercel-parity.json next to it */
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const REPO = require('path').resolve(__dirname, '../../..');
const EV = require('path').resolve(__dirname, '../evidence');
const BASE = 'https://plagiarismsearch.vercel.app/';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const git = (...a) => execFileSync('git', a, { cwd: REPO, maxBuffer: 1 << 30 });

(async () => {
  const head = git('rev-parse', 'HEAD').toString().trim();
  const files = git('ls-files', 'site').toString().trim().split('\n');
  const out = { head, checkedAt: new Date().toISOString(), base: BASE, files: [] };
  let i = 0;
  const work = files.map(f => async () => {
    const local = git('cat-file', '-p', 'HEAD:' + f);
    const url = BASE + f.replace(/^site\//, '').split('/').map(encodeURIComponent).join('/');
    let status = 0, remote = null, headers = {};
    for (let attempt = 0; attempt < 3 && !remote; attempt++) {
      try { const r = await fetch(url, { redirect: 'follow' }); status = r.status; headers = { lm: r.headers.get('last-modified'), etag: r.headers.get('etag') }; if (r.ok) remote = Buffer.from(await r.arrayBuffer()); else break; } catch (e) { status = 'ERR ' + e.message; }
    }
    out.files.push({ file: f, url, status, same: !!remote && sha(remote) === sha(local), localBytes: local.length, remoteBytes: remote ? remote.length : null, ...headers });
    if (++i % 50 === 0) process.stdout.write(i + ' ');
  });
  /* eight at a time */
  const run = async () => { while (work.length) await work.shift()(); };
  await Promise.all(Array.from({ length: 8 }, run));
  out.files.sort((a, b) => a.file.localeCompare(b.file));
  fs.writeFileSync(EV + '/vercel-parity.json', JSON.stringify(out, null, 1));
  const same = out.files.filter(x => x.same).length, diff = out.files.filter(x => !x.same);
  const lm = [...new Set(out.files.map(x => x.lm).filter(Boolean))];
  console.log('\nHEAD ' + head + ' ; ' + files.length + ' tracked files under site/ ; identical on Vercel: ' + same + ' ; different or missing: ' + diff.length);
  diff.slice(0, 30).forEach(x => console.log('   ' + x.status + ' ' + x.file + ' (' + x.localBytes + ' → ' + x.remoteBytes + ')'));
  console.log('Last-Modified values served: ' + lm.slice(0, 5).join(' | ') + (lm.length > 5 ? ' … (' + lm.length + ')' : ''));
})();
