/* True stroke thickness, not a row-scan proxy.

   IMAGES.md prescribes a row scan taking the median of ink runs. That works for the
   benchmark set, whose glyphs are circles and rounded rectangles: a horizontal scan
   crosses their strokes roughly at right angles, so a run IS the width. It breaks on any
   shape with long horizontal edges — a stack of panels returns 200px for an 8px stroke,
   because the scan is running ALONG the stroke, not across it.

   Here: for every ink pixel take the horizontal run and the vertical run through it and
   keep the smaller. Across a horizontal edge that is the vertical run, i.e. the width.
   Median over all ink pixels.

   Both sets are measured with this, so the comparison stands on one scale.

   sharp is not a dependency of this repo — the build is dependency-free on purpose.
   Run it from a scratch folder that has sharp installed:
     npm install sharp && node /path/to/build/thickness.js <file> [...]

   Usage: node thickness.js <file> [...]
*/
const sharp = require('sharp');

const INK = 120, ALPHA = 60;

async function thickness(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  const ink = new Uint8Array(w * h);
  for (let i = 0, p = 0; i < data.length; i += c, p++) {
    if (data[i + 3] > ALPHA && data[i] < INK && data[i + 1] < INK && data[i + 2] < INK) ink[p] = 1;
  }

  /* run length through each pixel, horizontally then vertically */
  const hRun = new Uint16Array(w * h);
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      if (!ink[y * w + x]) { x++; continue; }
      let e = x;
      while (e < w && ink[y * w + e]) e++;
      for (let i = x; i < e; i++) hRun[y * w + i] = e - x;
      x = e;
    }
  }
  const vRun = new Uint16Array(w * h);
  for (let x = 0; x < w; x++) {
    let y = 0;
    while (y < h) {
      if (!ink[y * w + x]) { y++; continue; }
      let e = y;
      while (e < h && ink[e * w + x]) e++;
      for (let i = y; i < e; i++) vRun[i * w + x] = e - y;
      y = e;
    }
  }

  const t = [];
  for (let p = 0; p < w * h; p++) if (ink[p]) t.push(Math.min(hRun[p], vRun[p]));
  if (!t.length) return { file, median: 0 };
  t.sort((a, b) => a - b);
  return {
    file: file.split(/[\\/]/).pop(),
    median: t[Math.floor(t.length / 2)],
    inkPixels: t.length,
    size: w + 'x' + h,
    square: w === h,
  };
}

(async () => {
  const files = process.argv.slice(2);
  const out = [];
  for (const f of files) out.push(await thickness(f));
  out.forEach(o => console.log('  ' + o.file.padEnd(24) + String(o.median).padStart(3) + 'px' +
    '   ink ' + String(o.inkPixels).padStart(6) + '   ' + o.size + (o.square ? '' : '  NOT SQUARE')));
  const v = out.map(o => o.median);
  const avg = v.reduce((a, b) => a + b, 0) / v.length;
  console.log('  ' + '-'.repeat(46));
  console.log('  average ' + avg.toFixed(2) + '   spread ' + (Math.max(...v) - Math.min(...v)));
})();
