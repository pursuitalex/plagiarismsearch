/* The originality-badge gallery. In each [data-badges]: the language pills (.badge-tab,
   data-lang) switch the panels (.badge-lang, data-lang); a badge (.badge-pick) opens the
   embed popup ([data-badge-modal]) with its plate, size and code, and the copy button
   copies the code. The popup closes on its backdrop, its button ([data-close]) and
   Escape, and gives focus back to the badge.

   The words are the page's, in attributes: the size line's data-unit ("pixels"), the copy
   label's data-copied ("Copied"). The embed code points at the live site, because a
   badge on someone else's page has to: a relative path would resolve against their
   domain. Behaviour verbatim from the page's former inline script. */
PS.module('badges', () => {
  document.querySelectorAll('[data-badges]').forEach(root => {
    if (root.dataset.badgesReady) return;
    const modal = root.querySelector('[data-badge-modal]');
    if (!modal) return;
    root.dataset.badgesReady = '1';

    const tabs = [...root.querySelectorAll('.badge-tab')];
    const panels = [...root.querySelectorAll('.badge-lang')];
    const mPlate = modal.querySelector('[data-badge-plate]');
    const mSize = modal.querySelector('[data-badge-size]');
    const mCode = modal.querySelector('[data-badge-code]');
    const mCopy = modal.querySelector('[data-badge-copy]');
    const mLabel = modal.querySelector('[data-badge-copy-label]');
    const copyText = mLabel.textContent;
    const HOST = 'https://plagiarismsearch.com';
    let opener = null;

    const closeModal = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };

    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => {
        const on = x === t;
        x.classList.toggle('bg-ink-900', on);
        x.classList.toggle('text-white', on);
        x.classList.toggle('bg-ink-100', !on);
        x.classList.toggle('text-ink-600', !on);
        x.classList.toggle('hover:bg-ink-200', !on);
      });
      panels.forEach(p => p.classList.toggle('hidden', p.dataset.lang !== t.dataset.lang));
      closeModal();
    }));

    const buildCode = d => {
      const href = d.lang === 'en' ? HOST + '/' : HOST + '/' + d.lang + '/';
      return '<a href="' + href + '"><img src="' + HOST + '/files/images/originality-badges/'
        + d.lang + '/' + d.file.split('/').pop() + '" alt="' + d.alt + '" title="' + d.title
        + '" width="' + d.w + '" height="' + d.h + '"></a>';
    };

    modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });

    root.querySelectorAll('.badge-pick').forEach(b => b.addEventListener('click', () => {
      const d = b.dataset;
      opener = b;
      /* the badge keeps the plate it was shown on, or a white variant vanishes here too */
      mPlate.className = 'inline-flex items-center justify-center rounded-2xl px-6 py-5 ' +
        [...b.classList].filter(c => /^bg-|^ring/.test(c)).join(' ');
      mPlate.innerHTML = '';
      mPlate.appendChild(b.querySelector('img').cloneNode(true));
      mSize.textContent = d.w + ' × ' + d.h + ' ' + mSize.dataset.unit;
      mCode.value = buildCode(d);
      mLabel.textContent = copyText;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      mCopy.focus();
    }));

    mCopy.addEventListener('click', async () => {
      mCode.select();
      try { await navigator.clipboard.writeText(mCode.value); }
      catch { document.execCommand('copy'); }
      mLabel.textContent = mLabel.dataset.copied;
      setTimeout(() => { mLabel.textContent = copyText; }, 1800);
    });
  });
});
