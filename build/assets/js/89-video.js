/* The video facade (Reviews). An a[data-video="<YouTube id>"] is a link to the video
   on YouTube — which is what it stays without this script. With it, a click swaps the
   link for the player, from youtube-nocookie.com, playing; the frame takes its title
   from data-video-title. Nothing is requested from YouTube until someone asks.
   PS.videoFrame is shared with the video stage (90-video-stage.js). */
PS.videoFrame = (id, title, extraClass) => {
  const f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
  f.title = title || '';
  f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
  f.allowFullscreen = true;
  f.className = 'vf-frame' + (extraClass ? ' ' + extraClass : '');
  return f;
};

PS.module('video', () => {
  document.querySelectorAll('a[data-video]').forEach(a => {
    if (a.dataset.videoReady) return;
    a.dataset.videoReady = '1';
    a.addEventListener('click', e => {
      e.preventDefault();
      const f = PS.videoFrame(a.dataset.video, a.dataset.videoTitle, a.dataset.videoFrameClass);
      a.replaceWith(f);
      f.focus();
    });
  });
});
