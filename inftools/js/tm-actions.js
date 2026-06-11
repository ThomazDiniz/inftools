'use strict';
// ═══════════════════════════════════════════════════════
// SNAP · KEYBOARD · HISTORY · EXPORT · CLEAR
// ═══════════════════════════════════════════════════════

// ─ Snapping ───────────────────────────────────────────
/**
 * Simpler, more reliable snap.
 * All objects use originX/Y='center', so obj.left/top IS the center
 * in design space (1280×720). We compute edges from center ± half-size.
 * obj.getScaledWidth/Height() return actual rendered size in design px.
 */
function initSnap() {
  canvas.on('object:moving', e => {
    const obj = e.target;
    if (obj === designBgRect) return;

    const cx = obj.left, cy = obj.top;
    const hw = obj.getScaledWidth()  / 2;
    const hh = obj.getScaledHeight() / 2;

    const l = cx - hw, r = cx + hw;
    const t = cy - hh, b = cy + hh;

    let dx = 0, dy = 0;

    if      (Math.abs(l)          < SNAP_D) dx = -l;
    else if (Math.abs(r - DW)     < SNAP_D) dx = DW - r;
    else if (Math.abs(cx - DW/2)  < SNAP_D) dx = DW/2 - cx;

    if      (Math.abs(t)          < SNAP_D) dy = -t;
    else if (Math.abs(b - DH)     < SNAP_D) dy = DH - b;
    else if (Math.abs(cy - DH/2)  < SNAP_D) dy = DH/2 - cy;

    if (dx !== 0 || dy !== 0) {
      obj.set({ left: cx + dx, top: cy + dy });
      obj.setCoords();
    }
  });

  // Rotation snap: 0 / 90 / 180 / 270
  canvas.on('object:rotating', e => {
    const obj = e.target;
    if (obj === designBgRect) return;
    const a = ((obj.angle % 360) + 360) % 360;
    for (const s of [0, 90, 180, 270]) {
      if (Math.abs(a - s) < SNAP_ROT) { obj.rotate(s); obj.setCoords(); break; }
    }
  });
}

// ─ Keyboard shortcuts ─────────────────────────────────
function initKeyboard() {
  document.addEventListener('keydown', e => {
    const obj = canvas.getActiveObject();
    const isT = obj && (obj.type === 'i-text' || obj.type === 'text');

    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      if (isT) { e.preventDefault(); obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold'); canvas.renderAll(); renderPropsPanel(); schedHist(); }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      if (isT) { e.preventDefault(); obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic'); canvas.renderAll(); renderPropsPanel(); schedHist(); }
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); duplicate(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && obj && !obj.isEditing) { e.preventDefault(); deleteSelected(); }
  });
}

function deleteSelected() {
  const obj = canvas.getActiveObject();
  if (!obj || obj === designBgRect) return;
  const li = layers.findIndex(l => l.obj === obj);
  if (li >= 0) { layers.splice(li, 1); renderLayerPanel(); }
  canvas.remove(obj);
  canvas.discardActiveObject();
  onDesel();
  canvas.renderAll();
  saveHist();
}

function duplicate() {
  const obj = canvas.getActiveObject();
  if (!obj) return;
  obj.clone(cl => {
    cl.set({ left: obj.left + 24, top: obj.top + 24 });
    canvas.add(cl); canvas.bringToFront(cl); canvas.setActiveObject(cl);
    canvas.renderAll(); saveHist();
  });
}

// ─ History ────────────────────────────────────────────
let _histT;
function schedHist() { clearTimeout(_histT); _histT = setTimeout(saveHist, 350); }

function saveHist() {
  const json = JSON.stringify({
    canvas: canvas.toJSON(['name', 'crossOrigin']),
    layers: layers.map(l => ({ id: l.id, name: l.name, dataUrl: l.dataUrl, effectState: l.effectState })),
  });
  history = history.slice(0, histIdx + 1);
  history.push(json);
  histIdx = history.length - 1;
  if (history.length > 30) { history.shift(); histIdx--; }
}

function undo() { if (histIdx > 0) { histIdx--; restoreHist(); } }
function redo() { if (histIdx < history.length - 1) { histIdx++; restoreHist(); } }

function restoreHist() {
  const snap = JSON.parse(history[histIdx]);
  inMod = true;
  canvas.loadFromJSON(snap.canvas, () => {
    layers = [];
    snap.layers.forEach(sl => {
      const obj = canvas.getObjects().find(o => o.name === 'layer' && !layers.find(l => l.obj === o));
      if (obj) layers.push({ id: sl.id, name: sl.name, obj, dataUrl: sl.dataUrl, effectState: sl.effectState || defaultFxState(), visible: true });
    });
    designBgRect = null;
    ensureDesignBg();
    canvas.renderAll();
    renderLayerPanel(); onDesel();
    inMod = false;
  });
}

// ─ Export ─────────────────────────────────────────────
async function exportAll() {
  // Deduplicate: skip formats that share an identical resolution with one already queued
  const seen = new Set();
  const fmts = FORMATS.filter(f => {
    if (!f.on) return false;
    const key = `${f.w}x${f.h}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
  if (!fmts.length) { toast('Selecione pelo menos um formato!'); return; }
  showLoad(`Gerando ${fmts.length} variação${fmts.length > 1 ? 's' : ''}…`);
  try {
    const zip = new JSZip();
    for (const fmt of fmts) {
      const du = await renderFormat(fmt);
      zip.file(`thumbnail_${fmt.id}_${fmt.w}x${fmt.h}.png`, du.split(',')[1], { base64: true });
    }
    saveAs(await zip.generateAsync({ type: 'blob' }), 'thumbnails.zip');
    toast(`✅ ${fmts.length} formatos exportados!`);
  } catch (e) {
    console.error(e); toast('❌ Erro ao exportar.');
  } finally {
    hideLoad();
  }
}

function renderFormat(fmt) {
  return new Promise(res => {
    const sx = fmt.w / DW, sy = fmt.h / DH, sm = Math.min(sx, sy);
    const json = JSON.parse(JSON.stringify(canvas.toJSON(['name', 'crossOrigin'])));
    json.background = canvas.backgroundColor;

    json.objects.forEach(o => {
      if (o.name === 'designbg') return; // skip design bg rect
      if (o.name === 'layer') {
        o.left *= sx; o.top *= sy;
        o.scaleX *= sm; o.scaleY *= sm;
      } else if (o.type === 'i-text' || o.type === 'text') {
        o.left *= sx; o.top *= sy; o.fontSize *= sm; o.strokeWidth = (o.strokeWidth || 0) * sm;
        if (o.shadow) { o.shadow.blur = (o.shadow.blur || 0) * sm; o.shadow.offsetX = (o.shadow.offsetX || 0) * sm; o.shadow.offsetY = (o.shadow.offsetY || 0) * sm; }
      } else {
        o.left *= sx; o.top *= sy; o.scaleX *= sm; o.scaleY *= sm;
      }
    });

    const tmp = new fabric.StaticCanvas(null, { width: fmt.w, height: fmt.h, backgroundColor: '#000000' });
    tmp.loadFromJSON(json, () => { tmp.renderAll(); res(tmp.toDataURL({ format: 'png', multiplier: 1 })); });
  });
}

// ─ Export single (active format) ────────────────────────
async function exportSingle() {
  showLoad(`Gerando ${activeFmt.name}…`);
  try {
    const du  = await renderFormat(activeFmt);
    const b64 = du.split(',')[1];
    const raw = atob(b64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    saveAs(new Blob([arr], { type: 'image/png' }), `thumbnail_${activeFmt.id}_${activeFmt.w}x${activeFmt.h}.png`);
    toast(`✅ ${activeFmt.name} exportado!`);
  } catch (e) {
    console.error(e); toast('❌ Erro ao exportar.');
  } finally {
    hideLoad();
  }
}

// ─ Clear all ──────────────────────────────────────────
function clearAll() {
  if (!confirm('Limpar tudo?')) return;
  canvas.clear();
  designBgRect = null;
  layers = [];
  renderLayerPanel(); onDesel();
  ensureDesignBg();
  canvas.renderAll();
  history = []; histIdx = -1; saveHist();
}
