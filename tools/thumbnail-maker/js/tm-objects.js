'use strict';
// ═══════════════════════════════════════════════════════
// OBJECTS: SHAPES · EMOJIS · BADGES · CANVAS FX · FRAMES · TEXT
// ═══════════════════════════════════════════════════════

// ─ Objects panel builder ──────────────────────────────
function buildObjectsPanel() {
  // Emojis
  const eg = el2('emoji-grid');
  EMOJIS.slice(0, 9).forEach(em => {
    const b = document.createElement('button'); b.className = 'obj-btn';
    b.innerHTML = `<span class="ob-ic">${em}</span>`;
    b.onclick = () => addGiantEmoji(em);
    eg.appendChild(b);
  });

  // Rage faces
  const rg = el2('rage-grid');
  RAGE_FACES.forEach(rf => {
    const b = document.createElement('button'); b.className = 'obj-btn';
    b.innerHTML = `<span class="ob-ic">${rf.t}</span><span style="font-size:9px">${rf.l.split(' ')[1]}</span>`;
    b.onclick = () => addGiantEmoji(rf.t, 120);
    rg.appendChild(b);
  });


  // Canvas FX
  const cfx = el2('canvas-fx-grid');
  CANVAS_FX.forEach(fx => {
    const b = document.createElement('button'); b.className = 'obj-btn';
    b.innerHTML = `<span class="ob-ic" style="font-size:13px">✨</span><span style="font-size:9px">${fx.l}</span>`;
    b.onclick = () => window[fx.fn] && window[fx.fn]();
    cfx.appendChild(b);
  });

  // Frames — single button, editing in right panel
  const fr = el2('frame-grid');
  const fb = document.createElement('button'); fb.className = 'obj-btn';
  fb.style.gridColumn = '1/-1';
  fb.innerHTML = `<span class="ob-ic">🖼</span><span>Adicionar Moldura</span>`;
  fb.onclick = () => addFrame();
  fr.appendChild(fb);
}

// ─ Text ───────────────────────────────────────────────
function addText() {
  const t = new fabric.IText('SEU TEXTO', {
    left: DW / 2, top: DH / 2, originX: 'center', originY: 'center',
    fontFamily: 'Impact', fontWeight: 'normal', fontSize: 100,
    fill: '#ffffff', stroke: '#000000', strokeWidth: 4,
    shadow: new fabric.Shadow({ color: 'rgba(0,0,0,.8)', blur: 12, offsetX: 5, offsetY: 5 }),
    name: 'text',
  });
  canvas.add(t);
  canvas.bringToFront(t);
  canvas.setActiveObject(t);
  t.enterEditing(); t.selectAll();
  canvas.renderAll();
}

// ─ Shapes ─────────────────────────────────────────────
function addShape(type) {
  let obj;
  const cx = DW / 2, cy = DH / 2;
  const base = { left: cx, top: cy, originX: 'center', originY: 'center', name: 'shape' };
  switch (type) {
    case 'circle':
      obj = new fabric.Circle({ ...base, radius: 80, fill: 'transparent', stroke: '#ff0000', strokeWidth: 8 });
      break;
    case 'arrow':
      // Solid filled arrow pointing right — wide head for visibility
      obj = new fabric.Path('M -75 -16 L 5 -16 L 5 -52 L 75 0 L 5 52 L 5 16 L -75 16 Z', {
        ...base, fill: '#ff0000', stroke: 'none', strokeWidth: 0,
      });
      break;
    case 'arrowcurve':
      // Half-circle arc (outer r=65, inner r=42) with downward arrowhead at right end
      obj = new fabric.Path('M -65 0 C -65 -36 -36 -65 0 -65 C 36 -65 65 -36 65 0 L 80 0 L 65 38 L 50 0 C 50 -23 23 -42 0 -42 C -23 -42 -42 -23 -42 0 Z', {
        ...base, fill: '#ff0000', stroke: 'none', strokeWidth: 0,
      });
      break;
    case 'rect':
      obj = new fabric.Rect({ ...base, width: 240, height: 120, fill: 'rgba(255,0,0,0.15)', stroke: '#ff0000', strokeWidth: 6, rx: 8, ry: 8 });
      break;
    case 'line':
      obj = new fabric.Line([0, 0, 200, 0], { ...base, stroke: '#ff0000', strokeWidth: 6 });
      break;

  }
  if (obj) { canvas.add(obj); canvas.bringToFront(obj); canvas.setActiveObject(obj); canvas.renderAll(); saveHist(); }
}

function addGiantEmoji(emoji, size = 140) {
  const t = new fabric.IText(emoji, {
    left: DW / 2, top: DH / 2, originX: 'center', originY: 'center',
    fontSize: size, fontFamily: 'Arial', name: 'text',
  });
  canvas.add(t); canvas.bringToFront(t); canvas.setActiveObject(t); canvas.renderAll(); saveHist();
}



// ─ Canvas FX overlays ─────────────────────────────────
function _hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n = parseInt(h, 16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}

function makeFxCanvas(drawFn, color) {
  color = color || '#ffffff';
  const oc = document.createElement('canvas');
  oc.width = DW; oc.height = DH;
  drawFn(oc.getContext('2d'), color);
  fabric.Image.fromURL(oc.toDataURL(), img => {
    img.set({ left: DW / 2, top: DH / 2, originX: 'center', originY: 'center', selectable: true, name: 'overlay', opacity: 0.85 });
    img._drawFn  = drawFn;
    img._fxColor = color;
    canvas.add(img); canvas.bringToFront(img); canvas.setActiveObject(img); canvas.renderAll(); saveHist();
  });
}

function reapplyFxCanvas(img, color) {
  if (!img._drawFn) return;
  img._fxColor = color;
  const oc = document.createElement('canvas');
  oc.width = DW; oc.height = DH;
  img._drawFn(oc.getContext('2d'), color);
  img.setSrc(oc.toDataURL(), () => { canvas.renderAll(); });
}

function addSpeedLines() {
  makeFxCanvas((ctx, color) => {
    const [r,g,b] = _hexToRgb(color);
    const cx = DW / 2, cy = DH / 2, n = 90;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r0 = 80 + Math.random() * 60, r1 = 700 + Math.random() * 300;
      ctx.strokeStyle = `rgba(${r},${g},${b},${(.2 + Math.random() * .6).toFixed(2)})`;
      ctx.lineWidth = .5 + Math.random() * 2.5;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
    }
  });
}

function addImpactBurst() {
  makeFxCanvas((ctx, color) => {
    const [r,g,b] = _hexToRgb(color);
    const cx = DW / 2, cy = DH / 2, n = 24;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
    grad.addColorStop(.3, `rgba(${r},${g},${b},0.4)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, DW, DH);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, a2 = a + .15;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 800, cy + Math.sin(a) * 800); ctx.lineTo(cx + Math.cos(a2) * 800, cy + Math.sin(a2) * 800); ctx.closePath();
      ctx.fillStyle = `rgba(${r},${g},${b},${(.05 + Math.random() * .08).toFixed(2)})`; ctx.fill();
    }
  });
}

function addLightBurst() {
  makeFxCanvas((ctx, color) => {
    const [r,g,b] = _hexToRgb(color);
    const cx = DW / 2, cy = DH / 2;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 500);
    grd.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
    grd.addColorStop(.15, `rgba(${r},${g},${b},0.6)`);
    grd.addColorStop(.4, `rgba(${r},${g},${b},0.2)`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd; ctx.fillRect(0, 0, DW, DH);
  });
}

function addLateralLight() {
  makeFxCanvas((ctx, color) => {
    const [r,g,b] = _hexToRgb(color);
    const grd = ctx.createLinearGradient(0, 0, DW, 0);
    grd.addColorStop(0, `rgba(${r},${g},${b},0.7)`);
    grd.addColorStop(.35, `rgba(${r},${g},${b},0.15)`);
    grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.fillStyle = grd; ctx.fillRect(0, 0, DW, DH);
  });
}

function addRain() {
  makeFxCanvas((ctx, color) => {
    const [r,g,b] = _hexToRgb(color);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`; ctx.lineWidth = 1;
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * DW, y = Math.random() * DH;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 30); ctx.stroke();
    }
  });
}

function addParticles() {
  makeFxCanvas((ctx, color) => {
    const [r,g,b] = _hexToRgb(color);
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * DW, y = Math.random() * DH, rv = 1 + Math.random() * 4;
      ctx.fillStyle = `rgba(${r},${g},${b},${(.1 + Math.random() * .6).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(x, y, rv, 0, Math.PI * 2); ctx.fill();
    }
  });
}

// ─ Frame system ───────────────────────────────────────
function createFrameObject(style, color, thickness) {
  const t = Math.max(2, thickness || 24);
  let obj;

  if (style === 'solid') {
    obj = new fabric.Rect({
      left: DW / 2, top: DH / 2, originX: 'center', originY: 'center',
      width: DW, height: DH, fill: 'transparent', stroke: color, strokeWidth: t,
      name: 'frame',
    });
  } else if (style === 'neon') {
    obj = new fabric.Rect({
      left: DW / 2, top: DH / 2, originX: 'center', originY: 'center',
      width: DW, height: DH, fill: 'transparent', stroke: color, strokeWidth: t,
      shadow: new fabric.Shadow({ color, blur: t * 2, offsetX: 0, offsetY: 0 }),
      name: 'frame',
    });
  } else if (style === 'double') {
    const gap = t + 8;
    const r1 = new fabric.Rect({ left: 0, top: 0, width: DW, height: DH, fill: 'transparent', stroke: color, strokeWidth: t, originX: 'center', originY: 'center' });
    const r2 = new fabric.Rect({ left: 0, top: 0, width: DW - gap * 2, height: DH - gap * 2, fill: 'transparent', stroke: color, strokeWidth: Math.max(2, Math.round(t / 2)), originX: 'center', originY: 'center' });
    obj = new fabric.Group([r1, r2], { left: DW / 2, top: DH / 2, originX: 'center', originY: 'center', name: 'frame' });
  }

  obj.frameStyle     = style;
  obj.frameColor     = color;
  obj.frameThickness = t;
  return obj;
}

function addFrame() {
  const obj = createFrameObject('solid', '#ffffff', 24);
  canvas.add(obj); canvas.bringToFront(obj); canvas.setActiveObject(obj); canvas.renderAll(); saveHist();
  switchTab('props');
}

function rebuildFrame(oldObj, style, color, thickness) {
  const newObj = createFrameObject(style, color, thickness);
  canvas.remove(oldObj);
  canvas.add(newObj); canvas.bringToFront(newObj); canvas.setActiveObject(newObj);
  canvas.renderAll(); saveHist();
  renderPropsPanel();
}

// ─ Freehand drawing ───────────────────────────────────
let _drawActive = false;

function toggleDrawMode() {
  _drawActive = !_drawActive;
  canvas.isDrawingMode = _drawActive;

  const btn   = document.getElementById('draw-toggle-btn');
  const icon  = document.getElementById('draw-icon');
  const label = document.getElementById('draw-label');
  const ctrl  = document.getElementById('draw-controls');

  if (_drawActive) {
    btn.style.background  = 'rgba(124,58,237,.18)';
    btn.style.borderColor = '#7c3aed';
    btn.style.color       = '#c4b5fd';
    icon.textContent      = '⏹';
    label.textContent     = 'Parar pincel';
    ctrl.style.display    = 'block';
    updateBrush();
    canvas.discardActiveObject();
    canvas.renderAll();
  } else {
    btn.style.background  = '';
    btn.style.borderColor = '';
    btn.style.color       = '';
    icon.textContent      = '✏';
    label.textContent     = 'Pincel livre';
    ctrl.style.display    = 'none';
  }
}

function updateBrush() {
  if (!canvas.freeDrawingBrush) return;
  canvas.freeDrawingBrush.color = document.getElementById('draw-color')?.value || '#ff0000';
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('draw-size')?.value || 12);
}

function exitDrawMode() {
  if (_drawActive) toggleDrawMode();
}
