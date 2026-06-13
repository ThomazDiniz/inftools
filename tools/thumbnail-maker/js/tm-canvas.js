'use strict';
// ═══════════════════════════════════════════════════════
// CANVAS INIT · CAMERA · VIEWPORT · DESIGN BOUNDARY
// ═══════════════════════════════════════════════════════

function initCanvas() {
  canvas = new fabric.Canvas('c', {
    preserveObjectStacking: true,
    stopContextMenu: true,
  });
  // Free scaling by default; hold Shift to constrain aspect ratio
  canvas.uniformScaling = false;
  canvas.uniScaleKey    = 'shiftKey';

  // Force 2D filter backend — custom applyTo2d filters don't run in WebGL mode
  try {
    if (typeof fabric.Canvas2dFilterBackend !== 'undefined') {
      fabric.filterBackend = new fabric.Canvas2dFilterBackend();
    }
  } catch (e) { /* ignore */ }
  canvas.on('selection:created', () => onSel());
  canvas.on('selection:updated', () => onSel());
  canvas.on('selection:cleared', () => onDesel());
  canvas.on('object:modified', schedHist);
  canvas.on('object:added',   () => { if (!inMod) schedHist(); });
  canvas.on('object:removed', () => { if (!inMod) schedHist(); });
  canvas.on('text:changed',   () => renderPropsPanel());
  canvas.on('path:created',  (e)  => {
    const path = e.path;
    const outlineCb = document.getElementById('draw-outline');

    if (outlineCb?.checked) {
      const outlineColor = document.getElementById('draw-outline-color')?.value || '#000000';
      // Remove auto-added path before re-adding as group
      inMod = true; canvas.remove(path); inMod = false;

      path.clone(outlined => {
        outlined.set({
          stroke:          outlineColor,
          strokeWidth:     (path.strokeWidth || 12) + 8,
          strokeLineCap:   'round',
          strokeLineJoin:  'round',
          fill:            '',
        });
        const grp = new fabric.Group([outlined, path], { name: 'draw' });
        canvas.add(grp);
        canvas.bringToFront(grp);
        canvas.setActiveObject(grp);
        canvas.renderAll();
        schedHist();
      });
    } else {
      path.set({ name: 'draw' });
      schedHist();
    }
  });
  window.addEventListener('resize', () => resizeCv());
}

// ─ Camera ─────────────────────────────────────────────
function initCamera() {
  const wrap = document.getElementById('canvas-wrap');
  resizeCv();
  fitView();
  window.addEventListener('resize', () => { resizeCv(); fitView(); });

  // Scroll wheel → zoom to cursor
  wrap.addEventListener('wheel', e => {
    e.preventDefault();
    const rect   = canvas.getElement().getBoundingClientRect();
    const pt     = new fabric.Point(e.clientX - rect.left, e.clientY - rect.top);
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    canvas.zoomToPoint(pt, Math.min(Math.max(canvas.getZoom() * factor, 0.05), 8));
    updZoomLbl();
    updCrop();
  }, { passive: false });

  // Middle mouse → pan
  wrap.addEventListener('mousedown', e => {
    if (e.button !== 1) return;
    e.preventDefault();
    isPanning = true;
    panLast = { x: e.clientX, y: e.clientY };
    wrap.classList.add('panning');
  });
  window.addEventListener('mousemove', e => {
    if (!isPanning) return;
    const dx = e.clientX - panLast.x, dy = e.clientY - panLast.y;
    panLast = { x: e.clientX, y: e.clientY };
    const vpt = canvas.viewportTransform.slice();
    vpt[4] += dx; vpt[5] += dy;
    canvas.setViewportTransform(vpt);
    updCrop();
  });
  window.addEventListener('mouseup', e => {
    if (e.button === 1) {
      isPanning = false;
      document.getElementById('canvas-wrap').classList.remove('panning');
    }
  });
}

function resizeCv() {
  const wrap = document.getElementById('canvas-wrap');
  canvas.setWidth(wrap.clientWidth);
  canvas.setHeight(wrap.clientHeight);
}

function fitView() {
  const wrap = document.getElementById('canvas-wrap');
  const s  = Math.min((wrap.clientWidth - 40) / DW, (wrap.clientHeight - 40) / DH) * 0.94;
  const ox = (wrap.clientWidth  - DW * s) / 2;
  const oy = (wrap.clientHeight - DH * s) / 2;
  canvas.setViewportTransform([s, 0, 0, s, ox, oy]);
  updZoomLbl();
  updCrop();
}

function zoomBy(d) {
  const wrap = document.getElementById('canvas-wrap');
  const pt   = new fabric.Point(wrap.clientWidth / 2, wrap.clientHeight / 2);
  canvas.zoomToPoint(pt, Math.min(Math.max(canvas.getZoom() + d, 0.05), 8));
  updZoomLbl();
  updCrop();
}

function updZoomLbl() {
  const lbl = el2('zlbl');
  if (lbl) lbl.textContent = Math.round(canvas.getZoom() * 100) + '%';
}

// ─ Format crop overlay ────────────────────────────────
function updCrop() {
  updBorderOverlay();
  const h = document.getElementById('canvas-holder');
  h.querySelectorAll('.crop-dim,.crop-line').forEach(e => e.remove());
  if (activeFmt.id === 'youtube') return;

  const vpt = canvas.viewportTransform;
  const s = vpt[0], tx = vpt[4], ty = vpt[5];
  const fill = Math.min(DW / activeFmt.w, DH / activeFmt.h);
  const cw = activeFmt.w * fill * s, ch = activeFmt.h * fill * s;
  // Centre on the design area (not the canvas element) so crop aligns with actual export
  const cx = tx + (DW * s - cw) / 2;
  const cy = ty + (DH * s - ch) / 2;

  const dim = (x, y, ww, hh) => {
    if (ww <= 0 || hh <= 0) return;
    const d = document.createElement('div');
    d.className = 'crop-dim';
    d.style.cssText = `left:${x}px;top:${y}px;width:${ww}px;height:${hh}px;position:absolute;`;
    h.appendChild(d);
  };
  dim(0, 0, canvas.getWidth(), cy);
  dim(0, cy + ch, canvas.getWidth(), canvas.getHeight() - cy - ch);
  dim(0, cy, cx, ch);
  dim(cx + cw, cy, canvas.getWidth() - cx - cw, ch);

  const brd = document.createElement('div');
  brd.className = 'crop-line';
  brd.style.cssText = `left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;position:absolute;`;
  h.appendChild(brd);
}

// ─ Design area boundary ───────────────────────────────
/**
 * Ensures a non-selectable Fabric Rect fills the 1280×720 design area
 * with a solid black background, so the outer checkerboard is distinct.
 */
function ensureDesignBg() {
  // Remove stale serialised copies (e.g. after history restore)
  canvas.getObjects()
    .filter(o => o.name === 'designbg' && o !== designBgRect)
    .forEach(o => { inMod = true; canvas.remove(o); inMod = false; });

  if (designBgRect && canvas.getObjects().includes(designBgRect)) {
    canvas.sendToBack(designBgRect);
    return;
  }

  designBgRect = new fabric.Rect({
    left: 0, top: 0, width: DW, height: DH,
    fill: '#000000',
    selectable: false, evented: false, hoverCursor: 'default',
    name: 'designbg',
  });
  inMod = true; canvas.add(designBgRect); inMod = false;
  canvas.sendToBack(designBgRect);
}

/** Creates the purple border overlay div and positions it over the design area. */
function initBorderOverlay() {
  let b = document.getElementById('design-border');
  if (!b) {
    b = document.createElement('div');
    b.id = 'design-border';
    b.style.cssText = [
      'position:absolute', 'pointer-events:none',
      'border:2px solid rgba(124,58,237,0.7)',
      'box-shadow:0 0 0 9999px rgba(0,0,0,0.55)',
      'z-index:10',
    ].join(';');
    document.getElementById('canvas-wrap').appendChild(b);
  }
  updBorderOverlay();
}

/** Repositions the border overlay to match the current viewport transform. */
function updBorderOverlay() {
  const b = document.getElementById('design-border');
  if (!b || !canvas) return;
  const vpt = canvas.viewportTransform;
  const s = vpt[0], tx = vpt[4], ty = vpt[5];
  b.style.left   = tx + 'px';
  b.style.top    = ty + 'px';
  b.style.width  = (DW * s) + 'px';
  b.style.height = (DH * s) + 'px';
}

// ─ Format tabs + export list ──────────────────────────
function _fmtAspect(w, h) {
  const g = (a, b) => b ? g(b, a % b) : a;
  const d = g(w, h);
  return `${w/d}:${h/d}`;
}

/** Group FORMATS by identical resolution (w×h). Returns array of groups. */
function _fmtGroups() {
  const map = new Map();
  FORMATS.forEach(f => {
    const key = `${f.w}x${f.h}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(f);
  });
  return [...map.entries()].map(([key, fmts]) => {
    const [w, h] = key.split('x').map(Number);
    return { key, w, h, fmts, aspect: _fmtAspect(w, h) };
  });
}

function buildFormatTabs() {
  const c = el2('fmt-tabs');
  FORMATS.forEach((f, i) => {
    const b = document.createElement('button');
    b.className = 'fmt-tab' + (i === 0 ? ' active' : '');
    b.dataset.id = f.id;
    b.style.lineHeight = '1.2';
    b.innerHTML = `<span>${f.name}</span><br><span style="font-size:9px;opacity:0.65">${f.w}×${f.h}</span>`;
    b.onclick = () => {
      activeFmt = f;
      document.querySelectorAll('.fmt-tab').forEach(t => t.classList.toggle('active', t.dataset.id === f.id));
      updCrop();
    };
    c.appendChild(b);
  });
}

function buildFormatList() {
  const el = el2('fmt-list');
  _fmtGroups().forEach(grp => {
    const names = grp.fmts.map(f => f.name).join(' / ');
    const anyOn = grp.fmts.some(f => f.on);
    const lbl = document.createElement('label');
    lbl.style.cssText = 'display:flex;align-items:center;gap:8px;padding:5px 4px;border-radius:5px;cursor:pointer;margin-bottom:2px';
    lbl.innerHTML = `
      <input type="checkbox" ${anyOn ? 'checked' : ''} style="accent-color:#7c3aed;flex-shrink:0">
      <div>
        <div style="font-size:12px;font-weight:500">${names}</div>
        <div style="font-size:10px;color:#71717a">${grp.w}×${grp.h} · ${grp.aspect}</div>
      </div>`;
    lbl.querySelector('input').onchange = e => { grp.fmts.forEach(f => { f.on = e.target.checked; }); };
    el.appendChild(lbl);
  });
}
