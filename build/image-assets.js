/* Turn generated renders into site assets, by IMAGES.md §8.
   usage: node build/image-assets.js <config.json>
   config: { out, photos: [{src, name, width}], sheet: {src, cols, rows, names: [...]} } */
const R = require('path').join(__dirname, '..') + '/';
const sharp = require(R + 'node_modules/sharp');
const fs = require('fs');
const path = require('path');
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
fs.mkdirSync(cfg.out, { recursive: true });

/* white → alpha, colour un-premultiplied against white: over a white plate the icon is
   pixel-identical to the render, over anything else it keeps clean edges */
async function whiteToAlpha(buf, w, h) {
  const px = Buffer.from(buf);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const a = 255 - Math.min(r, g, b);
    if (a <= 8) { px[i + 3] = 0; continue; }
    const k = 255 / a;
    px[i] = Math.max(0, Math.min(255, Math.round(255 - (255 - r) * k)));
    px[i + 1] = Math.max(0, Math.min(255, Math.round(255 - (255 - g) * k)));
    px[i + 2] = Math.max(0, Math.min(255, Math.round(255 - (255 - b) * k)));
    px[i + 3] = a;
  }
  return sharp(px, { raw: { width: w, height: h, channels: 4 } });
}

(async () => {
  for (const p of cfg.photos || []) {
    const out = path.join(cfg.out, p.name + '.webp');
    await sharp(p.src).resize(p.width).webp({ quality: 78 }).toFile(out);
    const m = await sharp(out).metadata();
    console.log('photo ' + p.name + '.webp ' + m.width + 'x' + m.height + ' ' + Math.round(fs.statSync(out).size / 1024) + ' KB');
  }
  if (cfg.sheet) {
    const S = cfg.sheet;
    const meta = await sharp(S.src).metadata();
    const cw = Math.floor(meta.width / S.cols), ch = Math.floor(meta.height / S.rows);
    const { data } = await sharp(S.src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let n = 0; n < S.names.length; n++) {
      const cx = (n % S.cols) * cw, cy = Math.floor(n / S.cols) * ch, inset = 6;
      /* glyph bounds: "paint" is any channel < 200 (ink, teal, coral — not faint grid lines) */
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      for (let y = cy + inset; y < cy + ch - inset; y++) for (let x = cx + inset; x < cx + cw - inset; x++) {
        const i = (y * meta.width + x) * 4;
        if (data[i] < 200 || data[i + 1] < 200 || data[i + 2] < 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      if (x1 < 0) throw new Error('empty cell ' + n);
      const pad = 4, left = Math.max(0, x0 - pad), top = Math.max(0, y0 - pad);
      const width = Math.min(meta.width - left, x1 - x0 + 1 + pad * 2), height = Math.min(meta.height - top, y1 - y0 + 1 + pad * 2);
      const cell = await sharp(S.src).extract({ left, top, width, height }).ensureAlpha().raw().toBuffer();
      /* one step to a square: contain on transparent (IMAGES.md, law of the square) */
      const img = await whiteToAlpha(cell, width, height);
      const out = path.join(cfg.out, S.names[n] + '.webp');
      await img.png().toBuffer().then(b => sharp(b).resize(288, 288, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 82, alphaQuality: 90 }).toFile(out));
      const m = await sharp(out).metadata();
      if (m.width !== m.height) throw new Error(out + ' not square');
      console.log('icon  ' + S.names[n] + '.webp ' + m.width + 'x' + m.height + ' glyph ' + width + 'x' + height + ' ' + Math.round(fs.statSync(out).size / 1024) + ' KB');
    }
  }
})().catch(e => { console.error(e.message); process.exit(1); });
