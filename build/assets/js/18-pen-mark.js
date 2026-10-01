/* The pen mark of a library hero (build/sections/hero.js) — the line under one word of
   the title.

   The line is an <svg> drawn for the word's length: its viewBox is 18 units a character
   wide, and stretched over a word of another length it gets thicker and taller with it.
   An editor who changes the word in the CMS copies the old <svg> with it. So the line is
   redrawn here, once, when the word and the drawing are more than a quarter apart — by the
   template's own rule. A line that still fits is left exactly as it was written; nothing
   for an editor to keep in step by hand.

   Before the motion module (20), which measures the line it is about to draw. */
PS.module('pen-mark', () => {
  const UNIT = 18;
  document.querySelectorAll('.pen-word > svg.pen-mark').forEach(svg => {
    const chars = svg.parentElement.textContent.trim().length;
    const drawn = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal.width : 0;
    const w = Math.round(chars * UNIT);
    if (!chars || !drawn || (drawn >= w * .75 && drawn <= w * 1.25)) return;
    const line = svg.querySelector('.pen-underline');
    if (!line) return;
    svg.setAttribute('viewBox', '0 0 ' + w + ' 12');
    line.setAttribute('d', 'M3 9c' + Math.round(w * .25) + '-7 ' + Math.round(w * .67) + '-7 ' + (w - 6) + '-3');
  });
});
