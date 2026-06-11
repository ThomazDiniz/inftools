'use strict';
// ═══════════════════════════════════════════════════════
// LAYER MANAGEMENT
// layers[0] = frontmost, layers[last] = backmost
// ═══════════════════════════════════════════════════════

let _dragFromIdx = null;

function renderLayerPanel() {
  const list = el2('layer-list');
  list.innerHTML = '';

  // Render in display order (frontmost first = layers[0])
  [...layers].reverse().forEach((ly, ri) => {
    const i = layers.length - 1 - ri; // actual index in layers[]
    const isActive = canvas.getActiveObject() === ly.obj;
    const slot = document.createElement('div');
    slot.className = 'layer-slot' + (isActive ? ' active' : '') + (ly.visible === false ? ' empty' : '');
    slot.draggable = true;
    slot.dataset.idx = i;
    slot.innerHTML = `
      ${ly.dataUrl
        ? `<img class="layer-thumb" src="${ly.dataUrl}" draggable="false">`
        : `<div class="layer-thumb-empty">🖼</div>`}
      <div class="layer-info">
        <div class="layer-name">${ly.name}</div>
        <div class="layer-sub">Arraste para reordenar</div>
      </div>
      <div class="layer-btns">
        <button class="layer-btn" title="Remover" onclick="removeLayer(${i})" style="color:#f87171">✕</button>
      </div>`;

    // Select on click
    if (ly.obj) {
      slot.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') return;
        canvas.setActiveObject(ly.obj);
        canvas.renderAll();
        renderLayerPanel();
        renderPropsPanel();
      });
    }

    // Drag-and-drop reorder
    slot.addEventListener('dragstart', e => {
      _dragFromIdx = i;
      slot.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    slot.addEventListener('dragend', () => {
      _dragFromIdx = null;
      document.querySelectorAll('.layer-slot').forEach(s => s.classList.remove('dragging', 'drag-over'));
    });
    slot.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.layer-slot').forEach(s => s.classList.remove('drag-over'));
      slot.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      const toIdx = parseInt(slot.dataset.idx);
      if (_dragFromIdx === null || _dragFromIdx === toIdx) return;
      // Reorder: remove from source, insert at target
      const [moved] = layers.splice(_dragFromIdx, 1);
      layers.splice(toIdx, 0, moved);
      rebuildZOrder();
      renderLayerPanel();
      saveHist();
    });

    list.appendChild(slot);
  });

  // Show/hide "Adicionar Imagem" button
  el2('add-img-btn').style.display = layers.length >= MAX_LAYERS ? 'none' : 'flex';
}

function moveLayer(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= layers.length) return;
  [layers[i], layers[j]] = [layers[j], layers[i]];
  rebuildZOrder();
  renderLayerPanel();
  saveHist();
}

/**
 * Re-stacks all Fabric objects to match the layers[] order.
 * layers[0] = front, layers[last] = back.
 * Non-layer objects (text, shapes) always stay on top.
 * designBgRect always stays at the very back.
 */
function rebuildZOrder() {
  const textAndShapes = canvas.getObjects()
    .filter(o => !layers.find(l => l.obj === o) && o !== designBgRect);

  inMod = true;
  layers.forEach(l => { if (l.obj) canvas.remove(l.obj); });
  [...layers].reverse().forEach(l => { if (l.obj) canvas.add(l.obj); });
  textAndShapes.forEach(o => canvas.bringToFront(o));
  inMod = false;

  ensureDesignBg();
  canvas.renderAll();
}

function removeLayer(i) {
  const ly = layers[i];
  if (!ly) return;
  if (ly.obj) canvas.remove(ly.obj);
  layers.splice(i, 1);
  renderLayerPanel();
  renderPropsPanel();
  saveHist();
}
