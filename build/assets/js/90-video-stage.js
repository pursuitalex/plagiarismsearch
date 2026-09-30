/* The video stage (Reviews v2). In each [data-video-stage] one video is on the stage
   ([data-stage], a facade link from the video module) and the playlist lists all of
   them as a[data-video-pick="<YouTube id>"] — links to YouTube without this script.
   With it, a pick plays that video on the stage: the stage takes the player, the
   caption ([data-caption-name], [data-caption-line]) takes the pick's own words from
   its data-name / data-line, and the pick is marked aria-current. */
PS.module('video-stage', () => {
  document.querySelectorAll('[data-video-stage]').forEach(root => {
    if (root.dataset.videoStageReady) return;
    const stage = root.querySelector('[data-stage]');
    const picks = [...root.querySelectorAll('a[data-video-pick]')];
    if (!stage || !picks.length) return;
    root.dataset.videoStageReady = '1';
    const name = root.querySelector('[data-caption-name]');
    const line = root.querySelector('[data-caption-line]');

    picks.forEach(pick => pick.addEventListener('click', e => {
      e.preventDefault();
      picks.forEach(p => p.setAttribute('aria-current', p === pick ? 'true' : 'false'));
      if (name) name.textContent = pick.dataset.name || '';
      if (line) line.textContent = pick.dataset.line || '';
      const f = PS.videoFrame(pick.dataset.videoPick, pick.dataset.videoTitle, 'absolute inset-0 h-full');
      stage.replaceChildren(f);
      f.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 1023px)').matches) stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }));
  });
});
