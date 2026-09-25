/* site.js — the shared behaviour, built by build/assets.js from build/assets/js/*.js.

   One file in production, one module per component in source. Each module registers an
   init; every init finds its own instances by a data-* hook and wires each one on its
   own, so a section works wherever it is pasted and two of the same on one page do not
   share state. Nothing here looks an element up by a page id.

   The inits run in file order, each in its own try/catch: one component failing leaves
   the others working. When all have run, PS_READY tells the boot snippet in <head> that
   the enhancements arrived — if it never hears that, it takes .js and .js-motion off
   <html> and the page falls back to its static, fully visible state. */
const PS = (window.PS = window.PS || {});
const queue = [];
PS.module = (name, init) => { queue.push([name, init]); };
PS.start = () => {
  for (const [name, init] of queue) {
    try { init(); }
    catch (err) {
      console.error('[site.js] ' + name + ' failed', err);
      /* a reveal that never runs must not leave content invisible */
      if (name === 'motion') document.documentElement.classList.remove('js-motion');
    }
  }
  window.PS_READY = true;
};
