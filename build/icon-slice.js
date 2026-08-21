/* Slice a 2x2 icon sheet into four square assets, per IMAGES.md §3.4.

   LAW OF THE SQUARE: the finished asset is exactly N x N and it is checked. A glyph in
   its cell is almost never square, and the layout sits it in a rigid box, so any drift
   from 1:1 squashes the drawing.

   One step: extract -> resize(fit: contain). Never .extend() — sharp runs a fixed
   pipeline order (extract, resize, extend), so .extend().resize() and .resize().extend()
   both resize first and destroy the proportions.

   Usage: node slice.js <sheet> <outdir> <name1,name2,name3,name4> [erode|dilate steps]
*/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [sheet, outdir, namesArg, morph, stepsArg] = process.argv.slice(2);
if (!sheet || !outdir || !namesArg) {
  console.log('usage: node slice.js <sheet> <outdir> <n1,n2,n3,n4> [erode|dilate <steps>]');
  process.exit(1);
}
const names = namesArg.split(',');
const steps = +(stepsArg || 0);

/* Grow or shrink INK only — the fills are left alone, or a teal disc creeps outward and
   the whole icon changes shape. Mark every ink pixel first: growing in place feeds on
   itself and one step becomes three. */
async function morphInk(buf, kind, n) {
  if (!n) return buf;
  let img = sharp(buf).ensureAlpha();
  for (let pass = 0; pass < n; pass++) {
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: ch } = info;
    const isInk = new Uint8Array(w * h);
    for (let i = 0, p = 0; i < data.length; i += ch, p++) {
      if (data[i + 3] > 60 && data[i] < 120 && data[i + 1] < 120 && data[i + 2] < 120) isInk[p] = 1;
    }
    const out = Buffer.from(data);
    /* plus-shaped kernel: dx^2 + dy^2 <= 1, about 2px on a finished 288px icon */
    const N = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        const neighbours = N.map(([dx, dy]) => {
          const nx = x + dx, ny = y + dy;
          return (nx < 0 || ny < 0 || nx >= w || ny >= h) ? 0 : isInk[ny * w + nx];
        });
        const i = p * ch;
        if (kind === 'dilate' && !isInk[p] && neighbours.some(Boolean)) {
          out[i] = 10; out[i + 1] = 14; out[i + 2] = 26; out[i + 3] = 255;
        }
        if (kind === 'erode' && isInk[p] && neighbours.some(v => !v)) {
          out[i] = 255; out[i + 1] = 255; out[i + 2] = 255; out[i + 3] = 255;
        }
      }
    }
    img = sharp(out, { raw: { width: w, height: h, channels: ch } });
  }
  return img.png().toBuffer();
}

(async () => {
  const meta = await sharp(sheet).metadata();
  const cw = Math.floor(meta.width / 2);
  const chh = Math.floor(meta.height / 2);
  fs.mkdirSync(outdir, { recursive: true });

  /* morphology on the SOURCE sheet, before slicing — after the downscale it looks coarse */
  let base = fs.readFileSync(sheet);
  if (steps) {
    base = await morphInk(base, morph, steps);
    console.log('  ' + morph + ' x' + steps + ' applied to the sheet');
  }

  const cells = [[0, 0], [cw, 0], [0, chh], [cw, chh]];
  for (let i = 0; i < 4; i++) {
    const [left, top] = cells[i];
    const out = path.join(outdir, names[i] + '.webp');
    /* Two passes on purpose. Sharp runs a fixed pipeline — trim comes BEFORE extract —
       so a single chain trims the whole sheet first, shrinks it, and every cell after the
       first extracts out of bounds. Same trap the guide records for .extend(). */
    const raw = await sharp(base)
      .extract({ left, top, width: cw, height: chh })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    /* Key white out, the way the benchmark set is built: corners AND enclosed interiors
       both transparent, so the tinted plate shows through instead of a white box.

       A RAMP, not a threshold. The first attempt cut hard at 246 and left a grey fringe
       of JPEG ringing around every line — visible the moment anyone zoomed in. Alpha
       from distance-to-white instead: pure white vanishes, ink and accents stay solid,
       and the compression noise in between becomes a smooth edge rather than speckle.
       This is why the sheet must carry no greys — a grey bar keys out along with the
       noise, since neither is far enough from white to survive.

       Done before the resize, so the downscale antialiases against transparency rather
       than against a white that is about to be removed. */
    const { data: px, info: ri } = raw;
    const FLOOR = 14;      /* below this the pixel is background: JPEG ringing, not art */
    const GAIN = 2.6;      /* ink and both accents saturate well before the ramp ends */
    for (let i = 0; i < px.length; i += ri.channels) {
      const dist = 255 - Math.min(px[i], px[i + 1], px[i + 2]);
      px[i + 3] = Math.max(0, Math.min(255, Math.round((dist - FLOOR) * GAIN)));
    }

    const keyed = await sharp(px, { raw: { width: ri.width, height: ri.height, channels: ri.channels } })
      .png()
      .toBuffer();

    await sharp(keyed)
      .trim({ threshold: 12 })
      .resize(288, 288, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88, alphaQuality: 100 })
      .toFile(out);
    const m = await sharp(out).metadata();
    if (m.width !== m.height) throw new Error(out + ' not square: ' + m.width + 'x' + m.height);
    console.log('  ok  ' + out + '  ' + m.width + 'x' + m.height);
  }
})();
