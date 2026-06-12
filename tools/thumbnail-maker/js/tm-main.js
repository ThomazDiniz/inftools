'use strict';
// ═══════════════════════════════════════════════════════
// MAIN — wires everything together
// Load order in HTML must be: constants → state → helpers → filters
//   → canvas → layers → images → objects → panels → actions → main
// ═══════════════════════════════════════════════════════

function init() {
  initCanvas();
  initCamera();
  ensureDesignBg();
  initBorderOverlay();

  buildFormatTabs();
  buildFormatList();
  buildObjectsPanel();
  renderBgPanel();

  initDropZones();
  initPaste();
  initKeyboard();

  // Export + format settings
  el2('btn-export').onclick        = exportAll;
  el2('btn-export-single').onclick = exportSingle;
  el2('fmt-cfg-btn').onclick = e => {
    e.stopPropagation();
    el2('fmt-cfg-pop').classList.toggle('open');
  };
  document.addEventListener('click', e => {
    const pop = el2('fmt-cfg-pop');
    if (pop && !pop.contains(e.target) && e.target !== el2('fmt-cfg-btn')) {
      pop.classList.remove('open');
    }
  });

  renderLayerPanel();
  saveHist();
}

// Boot
init();
initSnap();
