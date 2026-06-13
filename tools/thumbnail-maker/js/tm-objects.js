'use strict';
// ═══════════════════════════════════════════════════════
// OBJECTS: SHAPES · EMOJIS · BADGES · CANVAS FX · FRAMES · TEXT
// ═══════════════════════════════════════════════════════

// ─ Custom per-layer Fabric.js filters ─────────────────
(function() {
  fabric.Image.filters.MotionBlurLayer = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'MotionBlurLayer',
    applyTo2d: function(opts) {
      const src = new Uint8ClampedArray(opts.imageData.data);
      const d = opts.imageData.data, w = opts.imageData.width, h = opts.imageData.height, k = 9, hk = 4;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let r=0,g=0,b=0,a=0;
          for (let kx=-hk; kx<=hk; kx++) {
            const sx = Math.max(0, Math.min(w-1, x+kx)), i=(y*w+sx)*4;
            r+=src[i]; g+=src[i+1]; b+=src[i+2]; a+=src[i+3];
          }
          const i=(y*w+x)*4; d[i]=r/k|0; d[i+1]=g/k|0; d[i+2]=b/k|0; d[i+3]=a/k|0;
        }
      }
    },
    isNeutralState: function(){return false;},
    toObject: function(){return {type:this.type};}
  });
  fabric.Image.filters.MotionBlurLayer.fromObject = function(){return new fabric.Image.filters.MotionBlurLayer();};

  fabric.Image.filters.OldPaperLayer = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'OldPaperLayer',
    applyTo2d: function(opts) {
      const d = opts.imageData.data, w = opts.imageData.width, h = opts.imageData.height;
      for (let y=0; y<h; y++) {
        for (let x=0; x<w; x++) {
          const i=(y*w+x)*4, r=d[i], g=d[i+1], b=d[i+2], n=(Math.random()-.5)*50;
          d[i]  =Math.min(255,Math.max(0,r*.393+g*.769+b*.189+n));
          d[i+1]=Math.min(255,Math.max(0,r*.349+g*.686+b*.168+n));
          d[i+2]=Math.min(255,Math.max(0,r*.272+g*.534+b*.131+n));
        }
      }
    },
    isNeutralState: function(){return false;},
    toObject: function(){return {type:this.type};}
  });
  fabric.Image.filters.OldPaperLayer.fromObject = function(){return new fabric.Image.filters.OldPaperLayer();};

  fabric.Image.filters.ScanlineLayer = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'ScanlineLayer',
    applyTo2d: function(opts) {
      const d = opts.imageData.data, w = opts.imageData.width, h = opts.imageData.height;
      for (let y=0; y<h; y++) {
        if (y%4<2) continue;
        for (let x=0; x<w; x++) {
          const i=(y*w+x)*4; d[i]=d[i]*.45|0; d[i+1]=d[i+1]*.45|0; d[i+2]=d[i+2]*.45|0;
        }
      }
    },
    isNeutralState: function(){return false;},
    toObject: function(){return {type:this.type};}
  });
  fabric.Image.filters.ScanlineLayer.fromObject = function(){return new fabric.Image.filters.ScanlineLayer();};

  fabric.Image.filters.VignetteLayer = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'VignetteLayer',
    applyTo2d: function(opts) {
      const d = opts.imageData.data, w = opts.imageData.width, h = opts.imageData.height;
      const cx=w/2, cy=h/2, maxR2=cx*cx+cy*cy, thr=.55*.55;
      for (let y=0; y<h; y++) {
        const dy2=(y-cy)*(y-cy);
        for (let x=0; x<w; x++) {
          const r2=((x-cx)*(x-cx)+dy2)/maxR2;
          if (r2<=thr) continue;
          const r=Math.sqrt(r2), f=Math.max(0,1-Math.pow((r-.55)*2.22,1.8)*.9);
          const i=(y*w+x)*4; d[i]=d[i]*f|0; d[i+1]=d[i+1]*f|0; d[i+2]=d[i+2]*f|0;
        }
      }
    },
    isNeutralState: function(){return false;},
    toObject: function(){return {type:this.type};}
  });
  fabric.Image.filters.VignetteLayer.fromObject = function(){return new fabric.Image.filters.VignetteLayer();};
})();

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

  const cfx = el2('canvas-fx-grid');
  cfx.style.gridTemplateColumns = 'repeat(5,1fr)'; cfx.style.gap = '3px';
  CANVAS_FX.forEach(fx => {
    const b = document.createElement('button'); b.className = 'obj-btn obj-btn-em';
    b.title = fx.l; b.innerHTML = `<span class="ob-ic" style="font-size:16px">&#10024;</span>`;
    b.onclick = () => window[fx.fn] && window[fx.fn](); cfx.appendChild(b);
  });

  const lfx = el2('layer-fx-grid');
  if (lfx) {
    lfx.style.gridTemplateColumns = 'repeat(2,1fr)'; lfx.style.gap = '4px';
    LAYER_FX.forEach(fx => {
      const b = document.createElement('button');
      b.className = 'lfx-preview-btn'; b.id = 'lfx-' + fx.key; b.title = fx.l;
      const prev = _makeLfxPreview(fx.key);
      prev.style.cssText = 'width:100%;height:auto;display:block;border-radius:3px;pointer-events:none';
      const lbl = document.createElement('span'); lbl.textContent = fx.l;
      b.appendChild(prev); b.appendChild(lbl);
      b.onclick = () => window[fx.fn]?.(); lfx.appendChild(b);
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

// ─ Layer FX (apply Fabric.js filters per layer) ───────
const _layerFx = { motionblur:false, oldpaper:false, scanline:false, vignette:false };
const _LAYER_FX_TYPES = { motionblur:'MotionBlurLayer', oldpaper:'OldPaperLayer', scanline:'ScanlineLayer', vignette:'VignetteLayer' };

function _applyLayerFx(key, makeFilters) {
  const objs = canvas.getObjects().filter(o => o.name==='layer' && o.filters);
  if (!objs.length) { toast('Adicione camadas de imagem primeiro'); return; }
  const btn = document.getElementById('lfx-'+key);
  const isActive = !!_layerFx[key];
  const types = makeFilters().map(f => f.type);
  objs.forEach(obj => {
    if (isActive) { obj.filters = obj.filters.filter(f => !types.includes(f.type)); }
    else { obj.filters.push(...makeFilters()); }
    obj.applyFilters();
  });
  _layerFx[key] = !isActive;
  btn?.classList.toggle('lfx-active', !isActive);
  canvas.renderAll(); saveHist();
}

function syncLayerFxState() {
  const objs = canvas.getObjects().filter(o => o.name==='layer' && o.filters?.length);
  Object.entries(_LAYER_FX_TYPES).forEach(([key,ftype]) => {
    const active = objs.some(o => o.filters.some(f => f.type===ftype));
    _layerFx[key] = active;
    document.getElementById('lfx-'+key)?.classList.toggle('lfx-active', active);
  });
}

function toggleMotionBlur() { _applyLayerFx('motionblur', ()=>[new fabric.Image.filters.MotionBlurLayer()]); }
function toggleOldPaper()   { _applyLayerFx('oldpaper',   ()=>[new fabric.Image.filters.OldPaperLayer()]); }
function toggleScanlines()  { _applyLayerFx('scanline',   ()=>[new fabric.Image.filters.ScanlineLayer()]); }
function toggleVignette()   { _applyLayerFx('vignette',   ()=>[new fabric.Image.filters.VignetteLayer()]); }

// ─ Layer FX mini-preview renderer ─────────────────────
function _makeLfxPreview(key) {
  const c=document.createElement('canvas'); c.width=72; c.height=40;
  const ctx=c.getContext('2d');
  const bg=ctx.createLinearGradient(0,0,72,40);
  bg.addColorStop(0,'#2d2d3d'); bg.addColorStop(1,'#1a1a28');
  ctx.fillStyle=bg; ctx.fillRect(0,0,72,40);
  ctx.fillStyle='rgba(120,140,180,0.55)'; ctx.fillRect(14,8,44,24);
  switch(key) {
    case 'motionblur':
      for (let i=0;i<12;i++){
        const y=3+i*3.2, len=20+Math.random()*40, x=Math.random()*20, a=0.15+Math.random()*0.45;
        const g2=ctx.createLinearGradient(x,y,x+len,y);
        g2.addColorStop(0,'rgba(255,255,255,0)'); g2.addColorStop(0.5,`rgba(255,255,255,${a})`); g2.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle=g2; ctx.fillRect(x,y-1,len,2);
      }
      break;
    case 'oldpaper':
      ctx.fillStyle='rgba(175,138,55,0.55)'; ctx.fillRect(0,0,72,40);
      for (let i=0;i<300;i++){ ctx.fillStyle=`rgba(0,0,0,${Math.random()*.18})`; ctx.fillRect(Math.random()*72,Math.random()*40,1,1); }
      break;
    case 'scanline':
      for (let y=0;y<40;y+=4){ ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,y+2,72,2); }
      break;
    case 'vignette': {
      const vg=ctx.createRadialGradient(36,20,7,36,20,38);
      vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(0.55,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.88)');
      ctx.fillStyle=vg; ctx.fillRect(0,0,72,40); break;
    }
  }
  return c;
}

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
