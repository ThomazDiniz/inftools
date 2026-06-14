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
  buildObjectsPanel();
  renderBgPanel();

  initDropZones();
  initPaste();
  initKeyboard();

  // Export
  el2('btn-export').onclick        = exportAll;
  el2('btn-export-single').onclick = exportSingle;

  renderLayerPanel();
  saveHist();
}

// Boot
init();
initSnap();
