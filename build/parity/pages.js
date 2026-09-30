/* Page-specific extras for the parity harness (build/parity/run.js), keyed by file.
   behaviour(page, width, { sleep }) → an object of results, run on both the approved
   and the migrated page and compared. reuse: false skips the section reuse test.
   byRef['<commit>']: acceptances that hold only against that baseline (the decisions
   taken when the page moved off it), so --ref=<commit> reproduces that comparison. */
module.exports = {
  '*': {
    /* against cd26f9c, where the remaining pages were still on the CDN with their own
       copies of the chrome's behaviour: */
    byRef: { cd26f9c: {
      accept: {
        burgerOpen: 'the phone menu opens: these pages never loaded the burger script, the shared header module wires it',
        focusRings: 'the site focus ring (teal; light on dark grounds) replaces the browser default these pages fell back to',
        faqAria: 'the shared FAQ keeps aria-expanded in step with each answer (these pages set none)',
      },
      /* these pages carried their own .btn-press (transform .2s); the site's is .25s with
         the shadow — one press for every button. Nothing but the transition may differ. */
      acceptGeometry: {
        props: ['transition-duration', 'transition-property'],
        reason: 'the site\'s .btn-press transition replaces these pages\' own copy',
      },
    } },
  },
  'contact-us.html': {
    byRef: { cd26f9c: {
      /* the contact form is the site's form (14-forms, as Business): its label and field
         sizes hold on a phone too (12px / 15px instead of 11.5px / 14px, the page 18px
         taller at 375), and the required mark takes the contrast-corrected #B84431 */
      acceptGeometry: {
        props: ['font-size', 'line-height', 'letter-spacing', 'color', 'grid-template-rows', 'transition-duration', 'transition-property'],
        reason: 'the contact form is the shared form component (as on Business); the required mark #B84431',
      },
    } },
  },
  'user-manuals.html': {
    /* its FAQ is the shared accordion now: the site's timing and chevron grey */
    byRef: { cd26f9c: { acceptGeometry: {
      props: ['transition-duration', 'transition-property', 'color', 'stroke'],
      reason: 'the FAQ is the shared accordion: .45s / .5s instead of .32s, chevron #4B5563 instead of #6B7280',
    } } },
  },
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
  'readability-check.html': {
    /* too little text, then a real passage: the counts, score, level, grade and needle */
    async behaviour(page, width, { sleep }) {
      const area = page.locator('#rcText, [data-rc="text"]');
      if (!(await area.count())) return {};
      const read = () => page.evaluate(() => ['score', 'level', 'words', 'sents', 'asl', 'grade', 'hint']
        .map(k => (document.querySelector('#rc' + k[0].toUpperCase() + k.slice(1) + ', [data-rc="' + k + '"]') || {}).textContent).join(' | ') + ' | needle ' +
        (el => el.className.includes('hidden') + ' ' + el.style.left)(document.querySelector('#rcNeedle, [data-rc="needle"]')));
      const r = { rcEmpty: await read() };
      await area.fill('Short text.'); await sleep(100);
      r.rcShort = await read();
      await area.fill('The report lists every source it found. Each match links to the passage and the page it came from. Short sentences read faster than long ones, and simple words help too. A reader can then decide what to cite, quote or rewrite.');
      await sleep(100);
      r.rcFull = await read();
      return r;
    },
  },
  'spell-check.html': {
    async behaviour(page, width, { sleep }) {
      const area = page.locator('#spText, [data-sp="text"]');
      if (!(await area.count())) return {};
      const keys = ['count', 'para', 'sent', 'syl', 'words', 'chars', 'spaces', 'read', 'speak', 'ari', 'cli', 'fre', 'fkg', 'smog', 'fog'];
      const read = () => page.evaluate(ks => ks.map(k => (document.querySelector('#sp' + k[0].toUpperCase() + k.slice(1) + ', [data-sp="' + k + '"]') || {}).textContent).join(' | '), keys);
      const r = { spEmpty: await read() };
      await area.fill('One word.'); await sleep(100);
      r.spOne = await read();
      await area.fill('The report lists every source it found. Each match links to the passage and the page it came from.\n\nShort sentences read faster than long ones, and simple words help too. A reader can then decide what to cite, quote or rewrite.');
      await sleep(100);
      r.spFull = await read();
      return r;
    },
  },
  'paper-analysis.html': {
    async behaviour(page, width, { sleep }) {
      if (!(await page.locator('input[name=paLevel]').count())) return {};
      const read = () => page.evaluate(() => ['total', 'rate', 'words'].map(k => (document.querySelector('#pa' + k[0].toUpperCase() + k.slice(1) + ', [data-pa="' + k + '"]') || {}).textContent).join(' | ') +
        ' | pages ' + document.querySelector('#paPages, [data-pa="pages"]').value);
      const r = { paStart: await read() };
      await page.locator('.pa-step button').last().click(); await sleep(100);
      r.paStep = await read();
      /* the radios are visually hidden (their labels are the targets): pick them in the DOM */
      await page.evaluate(() => {
        for (const sel of ['input[name=paLevel]', 'input[name=paDl]']) {
          const all = [...document.querySelectorAll(sel)];
          const r = sel.includes('Level') ? all[all.length - 1] : all[0];
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      await sleep(150);
      r.paLevel = await read();
      return r;
    },
  },
  'account.html': {
    byRef: { cd26f9c: {
      acceptGeometry: {
        props: ['font-size', 'line-height', 'letter-spacing', 'color', 'grid-template-rows', 'transition-duration', 'transition-property'],
        reason: 'the sign-in forms are the shared form component (as on Business); the required mark #B84431',
      },
    } },
    async behaviour(page, width, { sleep }) {
      if (!(await page.locator('.auth-tab').count())) return {};
      const read = () => page.evaluate(() => [...document.querySelectorAll('.auth-tab')].map(t => +t.classList.contains('active') + t.getAttribute('aria-selected')[0]).join('') + ' | ' +
        [...document.querySelectorAll('#panelLogin, #panelSignup, [data-auth-panel]')].map(p => +p.classList.contains('hidden-panel')).join(''));
      const r = { authStart: await read() };
      await page.locator('.auth-tab').nth(1).click(); await sleep(350);
      r.authSwitch = await read();
      return r;
    },
  },
  'vip.html': {
    async behaviour(page, width, { sleep }) {
      if (!(await page.locator('.step-btn').count())) return {};
      const read = () => page.evaluate(() => [...document.querySelectorAll('.stepper input')].map(i => i.value).join(','));
      const r = { stepStart: await read() };
      await page.locator('.step-btn').nth(1).click(); await page.locator('.step-btn').nth(2).click(); await sleep(100);
      r.stepMoved = await read();
      return r;
    },
  },
  'plagiarism-check.html': {
    /* the page's own counter split on /s+/ (the letter s); the module splits on white space */
    byRef: { cd26f9c: {
      accept: {
        count: 'the word count splits on white space; the approved page split on the letter s',
        overColour: 'the word count splits on white space; the approved page split on the letter s',
      },
      /* its field and chips are the quick-check form's (08-checker, after the phone sizes on
         purpose): on a phone they keep their size, as on every page with the form — 15px text,
         38px chips — and the form grows 15px at 375; the count takes the form's transition */
      acceptGeometry: {
        props: ['font-size', 'line-height', 'padding-left', 'padding-right', 'grid-template-rows', 'transition-duration', 'transition-property'],
        reason: 'the old checker\'s field and chips are the quick-check form\'s: its phone sizes, as on every page',
      },
    } },
  },
  'pages.html': {
    /* the prototype index is a review tool, not built from site sections */
    reuse: false,
  },
  'originality-badges.html': {
    /* the gallery: a language pill switches the panels; a badge opens the embed popup */
    async behaviour(page, width, { sleep }) {
      if (!(await page.locator('.badge-pick').count())) return {};
      const read = () => page.evaluate(() => {
        const m = document.querySelector('#badgeModal, [data-badge-modal]');
        const shown = [...document.querySelectorAll('.badge-lang')].map(p => +!p.classList.contains('hidden')).join('');
        const code = document.querySelector('#modalCode, [data-badge-code]');
        const size = document.querySelector('#modalSize, [data-badge-size]');
        return [shown, m.className.includes('hidden') ? 'closed' : 'open', size.textContent, code.value.slice(0, 90), document.activeElement && document.activeElement.tagName].join(' / ');
      });
      const r = { badgesStart: await read() };
      await page.locator('.badge-tab').nth(1).click(); await sleep(200);
      r.badgesLang = await read();
      await page.locator('.badge-lang:not(.hidden) .badge-pick').first().click(); await sleep(300);
      r.badgesOpen = await read();
      await page.keyboard.press('Escape'); await sleep(200);
      r.badgesClosed = await read();
      return r;
    },
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
    /* against 04c8e24, the homepage before the static assets; against cd26f9c, before the
       pulsing dot stopped for readers who ask for less motion (it was a moving layer then,
       a still one now: 13 px at 1/255 round it) */
    byRef: {
    cd26f9c: { acceptPixels: { 1440: { maxPx: 20, maxDelta: 1, reason: 'the pulsing dot is still under reduced motion; 1/255 round it' } } },
    '04c8e24': {
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
