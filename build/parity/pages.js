/* Page-specific extras for the parity harness (build/parity/run.js), keyed by file.
   behaviour(page, width, { sleep }) → an object of results, run on both the approved
   and the migrated page and compared. reuse: false skips the section reuse test.
   byRef['<commit>']: acceptances that hold only against that baseline (the decisions
   taken when the page moved off it), so --ref=<commit> reproduces that comparison. */
module.exports = {
  'newsroom.html': {
    /* against 40f96a2, the newsroom before the static assets (on the CDN): */
    byRef: { '40f96a2': {
      accept: {
        burgerOpen: 'the phone menu opens: the approved page never loaded the burger script, the shared header module wires it',
      },
      /* the hero's dot field ends mid-pixel at 1440 (SVG <pattern> then, CSS background now):
         one row, 11/255 at most; geometry identical. Measured 2026-09-30. */
      acceptPixels: { 1440: { maxPx: 160, maxDelta: 11, reason: 'the dot field\'s last row, cut mid-pixel at the hero edge; geometry identical' } },
    } },
    /* the archive: a topic filters, the pager pages the filtered set */
    async behaviour(page, width, { sleep }) {
      const nav = 'nav[aria-label="Archive pages"]';
      if (!(await page.locator(nav).count())) return {};
      const read = () => page.evaluate(n => {
        const items = [...document.querySelectorAll('.news-item')];
        const shown = items.filter(i => !i.hidden).length;
        const years = [...document.querySelectorAll('.yr-group')].map(g => (g.hidden ? '-' : g.querySelector('.yr-count').textContent)).join('|');
        const p = document.querySelector(n);
        const tabs = [...document.querySelectorAll('.tp-btn')].map(t => +t.classList.contains('active') + (t.getAttribute('aria-pressed') || '')[0]).join('');
        const nums = [...p.querySelectorAll('.pg-num, .pg-gap')].map(b => b.textContent + (b.classList.contains('on') ? '*' : '')).join(' ');
        return [shown, years, tabs, p.hidden, p.querySelector('p').textContent, nums].join(' / ');
      }, nav);
      const r = { archiveStart: await read() };
      await page.locator(nav + ' button', { hasText: 'Next' }).click(); await sleep(900);
      r.archivePage2 = await read();
      await page.locator('.tp-btn').nth(1).click(); await sleep(400);
      r.archiveTopic = await read();
      return r;
    },
  },
  'plagiarism-and-ai-check-report.html': {
    /* against 40f96a2, the guide before the static assets (on the CDN): */
    byRef: { '40f96a2': {
      accept: {
        burgerOpen: 'the phone menu opens: the approved page never loaded the burger script, the shared header module wires it',
        focusRings: 'links on the dark footer take the light ring (data-surface="dark"), as on every other page; the approved page had no dark-ground rule',
      },
    } },
  },
  'design-system.html': {
    /* the spec sheet is not built from site sections, so there is nothing to reuse */
    reuse: false,
    /* against db7d735, the page approved with the checker states and the modal:
       The approved page drew the components with its own copies of their CSS, which had
       drifted from the site: no phone sizes for the field, checkbox, radio and chip (06),
       no tabular .nums, older transition timings on .btn-press and .icon-orb, the
       browser's focus ring. On the shared assets it shows them as every page does.
       Classified 2026-09-30; any other property that differs fails. */
    byRef: { db7d735: {
    acceptGeometry: {
      props: ['font-size', 'line-height', 'padding-left', 'padding-right', 'grid-template-rows', 'transition-duration', 'transition-property'],
      reason: 'the components now render with the site CSS (phone sizes, tabular numerals, current transitions)',
    },
    accept: {
      focusRings: 'the site focus ring (teal; light on dark grounds) replaces the browser default the approved page fell back to',
    },
    } },
  },
  'index.html': {
    /* against 04c8e24, the homepage before the static assets: */
    byRef: { '04c8e24': {
    /* Differences taken on purpose when the homepage moved to the shared components. The
       approved homepage had neither: its FAQ never set aria-expanded, and its links fell
       back to the browser's default focus ring. Every other page has both. */
    accept: {
      faqAria: 'the shared FAQ keeps aria-expanded in step with each answer (the approved homepage set none)',
      focusRings: 'the site focus ring (teal; light on dark grounds) replaces the browser default the approved homepage fell back to',
    },
    /* At 1440 the closing band ends on a fractional y (10841.6px), so its last row of dots
       is cut mid-pixel and the footer beneath it is rasterised off the pixel grid. The dot
       field is now a CSS background instead of an SVG <pattern>, and the two round that
       cut edge differently: 2/255 on the dot row, 8/255 on the footer's language chevron.
       Measured 2026-09-25 (build/parity/out/home-probe-*.png); geometry identical. */
    acceptPixels: {
      1440: { maxPx: 60, maxDelta: 8, reason: 'sub-pixel anti-aliasing where the closing band ends on a fractional y; geometry identical' },
    },
    } },
  },
  'prices.html': {
    /* the AI package selector: the chosen row fills and the button names it */
    async behaviour(page, width, { sleep }) {
      /* only where the selector is (a section served alone may be another one) */
      if (!(await page.evaluate(() => !!document.querySelector('[data-purchase-hook="ai-package"], #aiBuy')))) return {};
      const read = () => page.evaluate(() => {
        const go = document.querySelector('[data-purchase-hook="ai-package"]');
        return [...document.querySelectorAll('.ai-opt')].map(o => +o.classList.contains('on')).join('') + '|' +
          go.innerText.replace(/\s+/g, ' ').trim() + '|' + go.dataset.aiWords + '|' + go.dataset.aiBilling + '|' + go.dataset.aiPrice;
      });
      const r = { aiDefault: await read() };
      await page.locator('.ai-opt').nth(4).click(); await sleep(200);
      r.aiPicked = await read();
      return r;
    },
  },
  'ai-detector.html': {
    /* the AI checker flow: under 100 characters the field objects; at 100 the auth gate
       opens and takes focus; typing past 100 clears the objection */
    async behaviour(page, width, { sleep }) {
      const form = page.locator('form:has(button[type="submit"]):has(textarea)').first();
      if (!(await form.count())) return {};
      const state = () => page.evaluate(() => {
        const f = [...document.querySelectorAll('form')].find(x => x.querySelector('textarea') && x.querySelector('button[type="submit"]'));
        const t = f.querySelector('textarea');
        /* the approved page's ids, the migrated page's hooks */
        const short = f.querySelector('#stTooShort, [data-too-short]');
        const gate = f.querySelector('#authGate, [data-auth-gate]');
        const a = document.activeElement;
        return [short && !short.hidden ? 'short' : '-', gate && !gate.hidden ? 'gate' : '-', t.getAttribute('aria-invalid') || '-', a ? a.tagName.toLowerCase() : '-'].join('|');
      });
      const t = form.locator('textarea');
      await t.fill('too short'); await form.locator('button[type="submit"]').click(); await sleep(150);
      const r = { aiShort: await state() };
      await t.fill('x'.repeat(120)); await sleep(100);
      r.aiCleared = await state();
      await form.locator('button[type="submit"]').click(); await sleep(150);
      r.aiGate = await state();
      return r;
    },
  },
  'plagiarism-checker-for-organization.html': {
    /* every quote CTA lands on the inquiry form and puts the caret in its first field */
    async behaviour(page, width, { sleep }) {
      if (!(await page.locator('main a[href="#business-inquiry"]').count())) return {};
      const link = page.locator('main a[href="#business-inquiry"]').first();
      await link.click();
      await sleep(900);
      return { quoteFocus: await page.evaluate(() => document.activeElement && document.activeElement.id) };
    },
  },
};
