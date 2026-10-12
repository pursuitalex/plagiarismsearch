/* Tidy the demo data on the two Canvas screenshots — nothing of the Canvas interface.

   Each change is a small opaque patch (ground colour sampled from the file) with text set
   in the interface's own face (Lato, as Canvas uses), rendered by Chrome on a transparent
   sheet and composited over the ORIGINAL PNG with sharp: every pixel outside a patch is the
   developer's file, bit for bit.

   Calibration first: each patch is rendered with the ORIGINAL words and slid by fractions
   of a pixel until it lies on the original as closely as it can; only then are the words
   changed. So the new text sits where the old did, at its size and weight.

   usage: node build/canvas-tidy.js <folder with the source PNGs>   → site/assets/img/canvas/*-tidied.webp */
const R = require('path').join(__dirname, '..') + '/';
const { chromium } = require(R + 'node_modules/playwright-core');
const sharp = require(R + 'node_modules/sharp');
const fs = require('fs'), path = require('path');
/* the developer's PNGs are not in the repository (new-tasks/new-page-7 stays local): unzip the
   Canvas package and pass its assets folder; the working PNGs go to the OS temp folder */
if (!process.argv[2]) { console.error('usage: node build/canvas-tidy.js <folder with the four source PNGs>'); process.exit(1); }
const SRC = require('path').resolve(process.argv[2]) + '/', TMP = require('path').join(require('os').tmpdir(), 'canvas-tidy') + '/', OUT = R + 'site/assets/img/canvas/';
fs.mkdirSync(TMP, { recursive: true });

const INK = '#2D3B45';
/* a patch: cover = [x, y, w, h] painted with the ground; text at left x, first baseline y;
   was: the words the file has there now (to calibrate against); now: the new words */
const JOBS = [
  { file: 'canvas_speedgrader_file_upload_original.png', out: 'speedgrader-file-upload-tidied', crop: [1448, 223, 470, 404], cropOut: 'speedgrader-file-upload-panel-tidied',
    /* the app name's stray "2" (columns 1631-1639 of the title's first line, rows 310-339):
       no type is set — the rest of the line, from column 1640, moves 10px left over it, so
       every glyph is the file's own and "h" keeps the gap the "2" had before the dot */
    shift: [{ x0: 1640, x1: 1916, y0: 310, y1: 340, by: 10 }],
    patches: [
      /* the grade field is empty in the file: nothing to calibrate against, so it takes the
         place the Text Entry file gives "80" inside the same field (8.6px in, 23.7px down) */
      { id: 'grade', cover: null, x: 1480.9, y: 760, lh: 20, weight: 400, size: 16, was: null, now: '85' },
    ] },
  { file: 'canvas_speedgrader_text_entry_original.png', out: 'speedgrader-text-entry-tidied', crop: [1265, 210, 635, 390], cropOut: 'speedgrader-text-entry-panel-tidied',
    patches: [
      { id: 'comment1', cover: [1288, 838, 572, 30], x: 1298, y: 857.3, lh: 20, weight: 400, size: 16, was: 'test', now: 'Final draft attached. Sources are listed at the end.' },
      { id: 'comment2', cover: [1288, 903, 572, 40], x: 1298, y: 922.7, lh: 20, weight: 400, size: 16, was: null, now: 'Thank you for the feedback on my outline.' },
    ] },
];
/* Lato: ascender 1974, descender -426 of 2000 → content box 1.2em, baseline .987em down */
const topOf = (p, dy) => p.y + dy - ((p.lh - 1.2 * p.size) / 2 + 0.987 * p.size);
const html = (W, H, items) => `<div style="position:relative;width:${W}px;height:${H}px">${items.join('')}</div>`;
const textEl = (p, words, dx = 0, dy = 0) => `<div style="position:absolute;left:${p.x + dx}px;top:${topOf(p, dy)}px;font:${p.weight} ${p.size}px/${p.lh}px Lato;color:${INK};white-space:nowrap">${words}</div>`;

(async () => {
  const br = await chromium.launch({ channel: 'chrome', args: ['--disable-lcd-text', '--font-render-hinting=none'] });
  for (const job of JOBS) {
    const src = SRC + job.file;
    const meta = await sharp(src).metadata(); const W = meta.width, H = meta.height;
    const orig = await sharp(src).removeAlpha().raw().toBuffer();
    const px = (x, y) => { const i = (Math.round(y) * W + Math.round(x)) * 3; return [orig[i], orig[i + 1], orig[i + 2]]; };
    const page = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=block"><style>html,body{margin:0;background:transparent}*{-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}</style></head><body><div id="s"></div></body></html>`, { waitUntil: 'networkidle' });
    const fonts = await page.evaluate(async () => { await document.fonts.load('400 16px Lato'); await document.fonts.load('700 16px Lato'); return [document.fonts.check('400 16px Lato'), document.fonts.check('700 16px Lato'), [...document.fonts].filter(f => f.status === 'loaded').length]; });
    if (!fonts[0] || !fonts[1] || !fonts[2]) throw new Error('Lato did not load: ' + JSON.stringify(fonts));
    const shot = async items => { await page.evaluate(h => { document.getElementById('s').innerHTML = h; }, html(W, H, items)); return sharp(await page.screenshot({ omitBackground: true })).ensureAlpha().raw().toBuffer(); };

    const final = [];
    for (const p of job.patches) {
      let dx = 0, dy = 0, note = 'placed by the sibling file\'s geometry';
      if (p.was) {
        /* slide the original words over the original pixels; score inside the cover */
        const [cx, cy, cw, ch] = p.cover; let best = null;
        for (let ty = -1.5; ty <= 1.5; ty += 0.25) for (let tx = -1.5; tx <= 1.5; tx += 0.25) {
          const o = await shot([textEl(p, p.was, tx, ty)]);
          let err = 0;
          for (let y = cy; y < cy + ch; y++) for (let x = cx; x < cx + cw; x++) {
            const i = (y * W + x) * 4, a = o[i + 3] / 255, g = px(cx + 2, cy + 2);
            /* the patch over the sampled ground, against the file */
            for (let c = 0; c < 3; c++) err += Math.abs((o[i + c] * a + g[c] * (1 - a)) - orig[(y * W + x) * 3 + c]);
          }
          if (!best || err < best.err) best = { tx, ty, err };
        }
        dx = best.tx; dy = best.ty; note = 'calibrated on "' + p.was.replace(/<br>.*/, '…').slice(0, 28) + '": dx ' + dx + ', dy ' + dy + ', mean error ' + (best.err / (cw * ch * 3)).toFixed(2) + ' / 255';
      }
      const g = p.cover ? px(p.cover[0] + 2, p.cover[1] + 2) : null;
      if (p.cover) final.push(`<div style="position:absolute;left:${p.cover[0]}px;top:${p.cover[1]}px;width:${p.cover[2]}px;height:${p.cover[3]}px;background:rgb(${g.join(',')})"></div>`);
      final.push(textEl(p, p.now, dx, dy));
      console.log('  ' + job.out + ' · ' + p.id + ': ' + note + (g ? ' ; ground rgb(' + g.join(',') + ')' : ''));
    }
    await page.evaluate(h => { document.getElementById('s').innerHTML = h; }, html(W, H, final));
    const overlay = await page.screenshot({ omitBackground: true });
    await page.close();

    const png = TMP + job.out + '.png';
    const base = Buffer.from(orig);
    for (const m of job.shift || []) for (let y = m.y0; y < m.y1; y++) {
      for (let x = m.x0; x < m.x1; x++) for (let c = 0; c < 3; c++) base[(y * W + x - m.by) * 3 + c] = orig[(y * W + x) * 3 + c];
      for (let x = m.x1 - m.by; x < m.x1; x++) for (let c = 0; c < 3; c++) base[(y * W + x) * 3 + c] = orig[(y * W + m.x1 - 1) * 3 + c];
    }
    await sharp(base, { raw: { width: W, height: H, channels: 3 } }).composite([{ input: overlay, left: 0, top: 0 }]).png().toFile(png);
    /* outside the patches the file is untouched: count the pixels that differ */
    const made = await sharp(png).removeAlpha().raw().toBuffer();
    let diff = 0, outside = 0;
    const boxes = job.patches.map(p => p.cover || [Math.floor(p.x) - 2, Math.floor(p.y) - 18, 44, 26]).concat((job.shift || []).map(m => [m.x0 - m.by, m.y0, m.x1 - m.x0 + m.by, m.y1 - m.y0]));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 3; if (made[i] !== orig[i] || made[i + 1] !== orig[i + 1] || made[i + 2] !== orig[i + 2]) { diff++; if (!boxes.some(b => x >= b[0] && x < b[0] + b[2] && y >= b[1] && y < b[1] + b[3])) outside++; } }
    await sharp(png).webp({ quality: 92, effort: 6 }).toFile(OUT + job.out + '.webp');
    const [l, t, w, h] = job.crop;
    await sharp(png).extract({ left: l, top: t, width: w, height: h }).webp({ quality: 92, effort: 6 }).toFile(OUT + job.cropOut + '.webp');
    console.log(job.out + ': ' + W + 'x' + H + ', ' + diff + ' pixels changed (' + (diff / (W * H) * 100).toFixed(2) + '%), ' + outside + ' outside the patches; crop ' + w + 'x' + h + ' at ' + l + ',' + t);
    /* enlarged views of the patched places, to look at */
    for (const p of job.patches.concat((job.shift || []).map(m => ({ id: 'shift', cover: [m.x0 - 140, m.y0 - 10, 420, 60] })))) { const b = p.cover || [Math.floor(p.x) - 30, Math.floor(p.y) - 40, 300, 70]; const x0 = Math.max(0, b[0] - 60), y0 = Math.max(0, b[1] - 50), w0 = Math.min(W - x0, b[2] + 70), h0 = Math.min(H - y0, b[3] + 90);
      await sharp(png).extract({ left: x0, top: y0, width: w0, height: h0 }).resize(w0 * 2, h0 * 2, { kernel: 'nearest' }).png().toFile(TMP + 'look-' + job.out + '-' + p.id + '.png'); }
  }
  await br.close();
})();
