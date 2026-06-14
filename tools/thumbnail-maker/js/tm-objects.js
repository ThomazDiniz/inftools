'use strict';
// ═══════════════════════════════════════════════════════
// OBJECTS: SHAPES · EMOJIS · BADGES · CANVAS FX · FRAMES · TEXT
// ═══════════════════════════════════════════════════════

// ─ Canvas FX mini-preview renderer ────────────────────
function _makeCanvasFxPreview(fn) {
  const c=document.createElement('canvas'); c.width=72; c.height=40;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#1a1a28'; ctx.fillRect(0,0,72,40);
  switch(fn) {
    case 'addSpeedLines': {
      const cx=36,cy=20;
      for(let i=0;i<24;i++){
        const a=(i/24)*Math.PI*2, r0=7, r1=38+Math.random()*8;
        ctx.strokeStyle=`rgba(255,255,255,${(.25+Math.random()*.55).toFixed(2)})`;
        ctx.lineWidth=.5+Math.random()*1.5;
        ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0); ctx.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); ctx.stroke();
      }
      break;
    }
    case 'addImpactBurst': {
      const cx=36,cy=20;
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,28);
      g.addColorStop(0,'rgba(255,220,50,.9)'); g.addColorStop(.35,'rgba(255,120,0,.5)'); g.addColorStop(1,'rgba(255,50,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,72,40);
      for(let i=0;i<12;i++){
        const a=(i/12)*Math.PI*2, a2=a+.22;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*55,cy+Math.sin(a)*55); ctx.lineTo(cx+Math.cos(a2)*55,cy+Math.sin(a2)*55); ctx.closePath();
        ctx.fillStyle='rgba(255,200,0,.1)'; ctx.fill();
      }
      break;
    }
    case 'addLightBurst': {
      const g=ctx.createRadialGradient(36,20,0,36,20,34);
      g.addColorStop(0,'rgba(255,255,200,.95)'); g.addColorStop(.3,'rgba(255,255,80,.55)'); g.addColorStop(1,'rgba(255,255,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,72,40); break;
    }
    case 'addLateralLight': {
      const g=ctx.createLinearGradient(0,0,72,0);
      g.addColorStop(0,'rgba(255,220,100,.85)'); g.addColorStop(.4,'rgba(255,200,80,.25)'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,72,40); break;
    }
    case 'addRain':
      ctx.strokeStyle='rgba(150,210,255,.65)'; ctx.lineWidth=.8;
      for(let i=0;i<45;i++){ const x=Math.random()*72,y=Math.random()*40; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-4,y+11); ctx.stroke(); }
      break;
    case 'addParticles':
      for(let i=0;i<55;i++){
        const x=Math.random()*72,y=Math.random()*40,r=.8+Math.random()*2.5;
        ctx.fillStyle=`rgba(255,${140+Math.random()*115|0},50,${(.2+Math.random()*.7).toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      }
      break;
  }
  return c;
}

// ─ Objects panel builder ──────────────────────────────
function buildObjectsPanel() {
  const eg = el2('emoji-grid');
  eg.style.gridTemplateColumns = 'repeat(5,1fr)';
  eg.style.gap = '3px';
  EMOJIS.slice(0, 10).forEach(em => {
    const b = document.createElement('button'); b.className = 'obj-btn obj-btn-em';
    b.title = em; b.innerHTML = `<span class="ob-ic">${em}</span>`;
    b.onclick = () => addGiantEmoji(em); eg.appendChild(b);
  });

  const rg = el2('rage-grid');
  rg.style.gridTemplateColumns = 'repeat(5,1fr)'; rg.style.gap = '3px';
  RAGE_FACES.forEach(rf => {
    const b = document.createElement('button'); b.className = 'obj-btn obj-btn-em';
    b.title = rf.l; b.innerHTML = `<span class="ob-ic">${rf.t}</span>`;
    b.onclick = () => addGiantEmoji(rf.t, 120); rg.appendChild(b);
  });

  // Canvas FX — 2 per row, preview + label
  const cfx = el2('canvas-fx-grid');
  cfx.style.gridTemplateColumns = 'repeat(2,1fr)'; cfx.style.gap = '4px';
  CANVAS_FX.forEach(fx => {
    const b = document.createElement('button'); b.className = 'lfx-preview-btn'; b.title = fx.l;
    b.style.cssText = 'background:#1c1c1e;border:1px solid #3f3f46';
    const prev = _makeCanvasFxPreview(fx.fn);
    prev.style.cssText = 'width:100%;height:auto;display:block;border-radius:3px;pointer-events:none;background:#1a1a28';
    const lbl = document.createElement('span'); lbl.textContent = fx.l;
    lbl.style.cssText = 'font-size:9px;color:#e4e4e7;text-align:center;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block';
    b.appendChild(prev); b.appendChild(lbl);
    b.onclick = () => window[fx.fn] && window[fx.fn](); cfx.appendChild(b);
  });

  // Layer FX — icon-only, 4 per row
  const lfx = el2('layer-fx-grid');
  if (lfx) {
    lfx.style.display = 'grid';
    lfx.style.gridTemplateColumns = 'repeat(4,1fr)'; lfx.style.gap = '3px';
    LAYER_FX.forEach(fx => {
      const b = document.createElement('button'); b.className = 'obj-btn obj-btn-em';
      b.id = 'lfx-' + fx.key; b.title = fx.l;
      b.innerHTML = `<span class="ob-ic" style="font-size:18px">${fx.ic}</span>`;
      b.onclick = () => _toggleLayerFxSlider(fx.key); lfx.appendChild(b);
    });
  }
}

// ─ Text ───────────────────────────────────────────────
function addText() {
  const t = new fabric.IText('SEU TEXTO', {
    left: DW/2, top: DH/2, originX: 'center', originY: 'center',
    fontFamily: 'Impact', fontWeight: 'normal', fontSize: 100,
    fill: '#ffffff', stroke: '#000000', strokeWidth: 4,
    shadow: new fabric.Shadow({ color: 'rgba(0,0,0,.8)', blur: 12, offsetX: 5, offsetY: 5 }),
    name: 'text',
  });
  canvas.add(t); canvas.bringToFront(t); canvas.setActiveObject(t);
  t.enterEditing(); t.selectAll(); canvas.renderAll();
}

// ─ Shapes ─────────────────────────────────────────────
function addShape(type) {
  let obj;
  const cx = DW/2, cy = DH/2;
  const base = { left: cx, top: cy, originX: 'center', originY: 'center', name: 'shape' };
  switch (type) {
    case 'circle':
      obj = new fabric.Circle({ ...base, radius: 80, fill: 'transparent', stroke: '#ff0000', strokeWidth: 8 }); break;
    case 'arrow':
      obj = new fabric.Path('M -75 -16 L 5 -16 L 5 -52 L 75 0 L 5 52 L 5 16 L -75 16 Z',
        { ...base, fill: '#ff0000', stroke: 'none', strokeWidth: 0 }); break;
    case 'arrowcurve':
      obj = new fabric.Path('M -65 0 C -65 -36 -36 -65 0 -65 C 36 -65 65 -36 65 0 L 76 8 L 55 52 L 34 8 L 42 0 C 42 -23 23 -42 0 -42 C -23 -42 -42 -23 -42 0 Z',
        { ...base, fill: '#ff0000', stroke: 'none', strokeWidth: 0 }); break;
    case 'rect':
      obj = new fabric.Rect({ ...base, width: 240, height: 120, fill: 'rgba(255,0,0,0.15)', stroke: '#ff0000', strokeWidth: 6, rx: 8, ry: 8 }); break;
    case 'line':
      obj = new fabric.Line([0, 0, 200, 0], { ...base, stroke: '#ff0000', strokeWidth: 6 }); break;
  }
  if (obj) { canvas.add(obj); canvas.bringToFront(obj); canvas.setActiveObject(obj); canvas.renderAll(); saveHist(); }
}

function addGiantEmoji(emoji, size = 140) {
  const t = new fabric.IText(emoji, {
    left: DW/2, top: DH/2, originX: 'center', originY: 'center',
    fontSize: size, fontFamily: 'Arial', name: 'text',
  });
  canvas.add(t); canvas.bringToFront(t); canvas.setActiveObject(t); canvas.renderAll(); saveHist();
}

// ─ Canvas FX overlays ─────────────────────────────────
function _hexToRgb(hex) {
  let h = hex.replace('#','');
  if (h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n=parseInt(h,16); return [(n>>16)&255,(n>>8)&255,n&255];
}

function makeFxCanvas(drawFn, color) {
  color = color || '#ffffff';
  const oc = document.createElement('canvas'); oc.width=DW; oc.height=DH;
  drawFn(oc.getContext('2d'), color);
  fabric.Image.fromURL(oc.toDataURL(), img => {
    img.set({ left:DW/2,top:DH/2,originX:'center',originY:'center',selectable:true,name:'overlay',opacity:0.85 });
    img._drawFn=drawFn; img._fxColor=color;
    canvas.add(img); canvas.bringToFront(img); canvas.setActiveObject(img); canvas.renderAll(); saveHist();
  });
}

function reapplyFxCanvas(img, color) {
  if (!img._drawFn) return; img._fxColor=color;
  const oc=document.createElement('canvas'); oc.width=DW; oc.height=DH;
  img._drawFn(oc.getContext('2d'), color);
  img.setSrc(oc.toDataURL(), ()=>{ canvas.renderAll(); });
}

function addSpeedLines() {
  makeFxCanvas((ctx,color)=>{
    const [r,g,b]=_hexToRgb(color), cx=DW/2, cy=DH/2, n=90;
    for (let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2, r0=80+Math.random()*60, r1=700+Math.random()*300;
      ctx.strokeStyle=`rgba(${r},${g},${b},${(.2+Math.random()*.6).toFixed(2)})`;
      ctx.lineWidth=.5+Math.random()*2.5;
      ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);
      ctx.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1); ctx.stroke();
    }
  });
}

function addImpactBurst() {
  makeFxCanvas((ctx,color)=>{
    const [r,g,b]=_hexToRgb(color), cx=DW/2, cy=DH/2, n=24;
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,400);
    grad.addColorStop(0,`rgba(${r},${g},${b},0.9)`); grad.addColorStop(.3,`rgba(${r},${g},${b},0.4)`); grad.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grad; ctx.fillRect(0,0,DW,DH);
    for (let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2, a2=a+.15;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*800,cy+Math.sin(a)*800); ctx.lineTo(cx+Math.cos(a2)*800,cy+Math.sin(a2)*800); ctx.closePath();
      ctx.fillStyle=`rgba(${r},${g},${b},${(.05+Math.random()*.08).toFixed(2)})`; ctx.fill();
    }
  });
}

function addLightBurst() {
  makeFxCanvas((ctx,color)=>{
    const [r,g,b]=_hexToRgb(color), cx=DW/2, cy=DH/2;
    const grd=ctx.createRadialGradient(cx,cy,0,cx,cy,500);
    grd.addColorStop(0,`rgba(${r},${g},${b},0.95)`); grd.addColorStop(.15,`rgba(${r},${g},${b},0.6)`);
    grd.addColorStop(.4,`rgba(${r},${g},${b},0.2)`); grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd; ctx.fillRect(0,0,DW,DH);
  });
}

function addLateralLight() {
  makeFxCanvas((ctx,color)=>{
    const [r,g,b]=_hexToRgb(color);
    const grd=ctx.createLinearGradient(0,0,DW,0);
    grd.addColorStop(0,`rgba(${r},${g},${b},0.7)`); grd.addColorStop(.35,`rgba(${r},${g},${b},0.15)`); grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
    ctx.fillStyle=grd; ctx.fillRect(0,0,DW,DH);
  });
}

function addRain() {
  makeFxCanvas((ctx,color)=>{
    const [r,g,b]=_hexToRgb(color);
    ctx.strokeStyle=`rgba(${r},${g},${b},0.4)`; ctx.lineWidth=1;
    for (let i=0;i<300;i++){
      const x=Math.random()*DW, y=Math.random()*DH;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-10,y+30); ctx.stroke();
    }
  });
}

function addParticles() {
  makeFxCanvas((ctx,color)=>{
    const [r,g,b]=_hexToRgb(color);
    for (let i=0;i<200;i++){
      const x=Math.random()*DW, y=Math.random()*DH, rv=1+Math.random()*4;
      ctx.fillStyle=`rgba(${r},${g},${b},${(.1+Math.random()*.6).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(x,y,rv,0,Math.PI*2); ctx.fill();
    }
  });
}

// ─ Frame system ───────────────────────────────────────
function createFrameObject(style, color, thickness) {
  const t = Math.max(2, thickness || 24); let obj;
  if (style==='solid') {
    obj = new fabric.Rect({ left:DW/2,top:DH/2,originX:'center',originY:'center',width:DW,height:DH,fill:'transparent',stroke:color,strokeWidth:t,name:'frame' });
  } else if (style==='neon') {
    obj = new fabric.Rect({ left:DW/2,top:DH/2,originX:'center',originY:'center',width:DW,height:DH,fill:'transparent',stroke:color,strokeWidth:t,
      shadow:new fabric.Shadow({color,blur:t*2,offsetX:0,offsetY:0}),name:'frame' });
  } else if (style==='double') {
    const gap=t+8;
    const r1=new fabric.Rect({left:0,top:0,width:DW,height:DH,fill:'transparent',stroke:color,strokeWidth:t,originX:'center',originY:'center'});
    const r2=new fabric.Rect({left:0,top:0,width:DW-gap*2,height:DH-gap*2,fill:'transparent',stroke:color,strokeWidth:Math.max(2,Math.round(t/2)),originX:'center',originY:'center'});
    obj=new fabric.Group([r1,r2],{left:DW/2,top:DH/2,originX:'center',originY:'center',name:'frame'});
  }
  obj.frameStyle=style; obj.frameColor=color; obj.frameThickness=t; return obj;
}

function addFrame() {
  const obj=createFrameObject('solid','#ffffff',24);
  canvas.add(obj); canvas.bringToFront(obj); canvas.setActiveObject(obj); canvas.renderAll(); saveHist();
  switchTab('props');
}

function rebuildFrame(oldObj, style, color, thickness) {
  const newObj=createFrameObject(style,color,thickness);
  canvas.remove(oldObj); canvas.add(newObj); canvas.bringToFront(newObj); canvas.setActiveObject(newObj);
  canvas.renderAll(); saveHist(); renderPropsPanel();
}

// ─ Layer FX (toggle effectState sliders on all layers) ─
const _layerFx = { motionblur:false, oldpaper:false, scanline:false, vignette:false };
const _LFX_SLIDER = {
  motionblur: { key:'motion_h',  val:0.7 },
  oldpaper:   { key:'warm',      val:0.7 },
  scanline:   { key:'scanlines', val:0.7 },
  vignette:   { key:'vignette',  val:0.7 },
};

function _toggleLayerFxSlider(fxKey) {
  const cfg = _LFX_SLIDER[fxKey];
  if (!cfg) return;
  if (!layers.length) { toast('Adicione camadas primeiro'); return; }
  const btn = document.getElementById('lfx-'+fxKey);
  const isActive = !!_layerFx[fxKey];
  const newVal = isActive ? 0 : cfg.val;
  layers.forEach(layer => {
    if (!layer.effectState) return;
    layer.effectState[cfg.key] = newVal;
    rebuildFilters(layer);
  });
  _layerFx[fxKey] = !isActive;
  btn?.classList.toggle('lfx-active', !isActive);
  // Refresh right panel slider if a layer is selected
  const activeLy = layers.find(l => l.obj === canvas.getActiveObject());
  if (activeLy) renderFxPanel(activeLy);
  saveHist();
}

function syncLayerFxState() {
  Object.entries(_LFX_SLIDER).forEach(([key, cfg]) => {
    const active = layers.some(l => l.effectState && (l.effectState[cfg.key] || 0) > 0.05);
    _layerFx[key] = active;
    document.getElementById('lfx-'+key)?.classList.toggle('lfx-active', active);
  });
}

function toggleMotionBlur() { _toggleLayerFxSlider('motionblur'); }
function toggleOldPaper()   { _toggleLayerFxSlider('oldpaper'); }
function toggleScanlines()  { _toggleLayerFxSlider('scanline'); }
function toggleVignette()   { _toggleLayerFxSlider('vignette'); }

// ─ Freehand drawing ───────────────────────────────────
let _drawActive = false;

function toggleDrawMode() {
  _drawActive = !_drawActive;
  canvas.isDrawingMode = _drawActive;
  const btn=document.getElementById('draw-toggle-btn'), icon=document.getElementById('draw-icon'), ctrl=document.getElementById('draw-controls');
  if (_drawActive) {
    btn.style.background='rgba(124,58,237,.18)'; btn.style.borderColor='#7c3aed'; btn.style.color='#c4b5fd';
    btn.title='Parar pincel'; icon.textContent='⏹'; ctrl.style.display='block';
    updateBrush(); canvas.discardActiveObject(); canvas.renderAll();
  } else {
    btn.style.background=''; btn.style.borderColor=''; btn.style.color='';
    btn.title='Pincel'; icon.textContent='✏'; ctrl.style.display='none';
  }
}

function updateBrush() {
  if (!canvas.freeDrawingBrush) return;
  canvas.freeDrawingBrush.color = document.getElementById('draw-color')?.value || '#ff0000';
  canvas.freeDrawingBrush.width = parseInt(document.getElementById('draw-size')?.value || 12);
}

function exitDrawMode() { if (_drawActive) toggleDrawMode(); }
