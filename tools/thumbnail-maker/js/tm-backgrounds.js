'use strict';
// ═══════════════════════════════════════════════════════
// BACKGROUND PRESETS — gradients, solids e imagens
// ═══════════════════════════════════════════════════════

// ─ Gradient / solid presets ───────────────────────────
const BG_CATS = [
  { id: 'vanoss', presets: [
    { id: 'r1', name: 'Rainbow 1', type: 'linear', colors: ['#00ff44','#00eeff','#2244ff','#8800ff'], angle: 135 },
    { id: 'r2', name: 'Rainbow 2', type: 'linear', colors: ['#ffff00','#00ff44','#0044ff'], angle: 135 },
    { id: 'r3', name: 'Rainbow 3', type: 'linear', colors: ['#ff6600','#ff0099','#9900ff'], angle: 135 },
    { id: 'r4', name: 'Rainbow 4', type: 'linear', colors: ['#00ffff','#0033ff','#ff00ff'], angle: 135 },
    { id: 'r5', name: 'Rainbow 5', type: 'linear', colors: ['#00ff44','#ffff00','#ff0000'], angle: 135 },
    { id: 'r6', name: 'Rainbow 6', type: 'linear', colors: ['#0044ff','#8800ff','#ff0088'], angle: 135 },
    { id: 'r7', name: 'Rainbow 7', type: 'linear', colors: ['#aaff00','#00ffcc','#001166'], angle: 135 },
    { id: 'r8', name: 'Rainbow 8', type: 'linear', colors: ['#ff6600','#ff0000','#ff0088','#9900ff'], angle: 135 },
  ]},
  { id: 'gaming', presets: [
    { id: 'g1', name: 'Blue Energy',  type: 'radial', colors: ['#0055ff','#000033'] },
    { id: 'g2', name: 'Purple Neon',  type: 'radial', colors: ['#aa00ff','#1a0033'] },
    { id: 'g3', name: 'Toxic Green',  type: 'radial', colors: ['#00ff44','#001100'] },
    { id: 'g4', name: 'Cyber Cyan',   type: 'radial', colors: ['#00ffff','#001133'] },
    { id: 'g5', name: 'Deep Red',     type: 'radial', colors: ['#ff0022','#220000'] },
    { id: 'g6', name: 'Orange Fire',  type: 'radial', colors: ['#ff8800','#220800'] },
  ]},
  { id: 'reaction', presets: [
    { id: 'rc1', name: 'Shock Red',    type: 'radial', colors: ['#ff2200','#110000'] },
    { id: 'rc2', name: 'Drama Purple', type: 'radial', colors: ['#6600ff','#110022'] },
    { id: 'rc3', name: 'Chaos Green',  type: 'radial', colors: ['#00ff55','#002200'] },
    { id: 'rc4', name: 'Alert Yellow', type: 'radial', colors: ['#ffcc00','#332200'] },
    { id: 'rc5', name: 'Pink Energy',  type: 'radial', colors: ['#ff0088','#220011'] },
  ]},
  { id: 'cartoon', presets: [
    { id: 'ct1', name: 'Sky Blue',   type: 'linear', colors: ['#66ccff','#0088cc'], angle: 160 },
    { id: 'ct2', name: 'Candy Pink', type: 'linear', colors: ['#ff88cc','#ff44aa'], angle: 160 },
    { id: 'ct3', name: 'Lime Green', type: 'linear', colors: ['#88ff44','#44aa00'], angle: 160 },
    { id: 'ct4', name: 'Orange Pop', type: 'linear', colors: ['#ffaa00','#ff4400'], angle: 160 },
    { id: 'ct5', name: 'Purple Fun', type: 'linear', colors: ['#aa44ff','#6600cc'], angle: 160 },
  ]},
  { id: 'professional', presets: [
    { id: 'pr1', name: 'Dark Blue',   type: 'linear', colors: ['#001133','#003399'], angle: 160 },
    { id: 'pr2', name: 'Dark Purple', type: 'linear', colors: ['#110022','#440066'], angle: 160 },
    { id: 'pr3', name: 'Dark Red',    type: 'linear', colors: ['#220000','#660011'], angle: 160 },
    { id: 'pr4', name: 'Dark Green',  type: 'linear', colors: ['#001100','#004400'], angle: 160 },
    { id: 'pr5', name: 'Slate Gray',  type: 'linear', colors: ['#1a1a2e','#16213e'], angle: 160 },
  ]},
  { id: 'simple', presets: [
    { id: 's1', name: 'Black',  type: 'solid', colors: ['#000000'] },
    { id: 's2', name: 'White',  type: 'solid', colors: ['#ffffff'] },
    { id: 's3', name: 'Red',    type: 'solid', colors: ['#ff0000'] },
    { id: 's4', name: 'Blue',   type: 'solid', colors: ['#0044ff'] },
    { id: 's5', name: 'Green',  type: 'solid', colors: ['#00bb44'] },
    { id: 's6', name: 'Purple', type: 'solid', colors: ['#8800ff'] },
    { id: 's7', name: 'Orange', type: 'solid', colors: ['#ff6600'] },
    { id: 's8', name: 'Yellow', type: 'solid', colors: ['#ffcc00'] },
  ]},
];

const BG_BY_ID = {};
BG_CATS.forEach(cat => cat.presets.forEach(p => { p.catId = cat.id; BG_BY_ID[p.id] = p; }));

// ─ Sample images ──────────────────────────────────────
const SAMPLE_FILES = [
  '1 - oKqJH3r.jpg','2 - t5dmy8u.jpg','3 - uC1VC8I.jpg','4 - DxcFNnH.jpg','5 - t0xxl67.jpg',
  '6 - Usyr3i3.jpg','7 - gcgLKjb.jpg','8 - nC8UC5z.jpg','9 - d63qvTa.jpg','10 - Wan5U64.jpg',
  '11 - AZTtlir.jpg','12 - uai6K6D.jpg','13 - EyTRTCM.jpg','14 - i18HU3B.jpg','15 - ZGnitAI.jpg',
  '16 - z3DZVH4.jpg','17 - IY1CFKQ.jpg','18 - osXmyie.jpg','19 - lgQxVbl.jpg','20 - quef2rp.jpg',
  '21 - jNM62jr.jpg','22 - eR0Vc20.jpg','23 - gYRGqBt.jpg','24 - hG08TYX.jpg','25 - a5KbTAk.jpg',
  '26 - eNWO3iX.jpg','27 - Nici7Mn.jpg','28 - GiDQ5Lc.jpg','29 - Py4jW3B.jpg','30 - GrnNaPA.jpg',
  '31 - 7cH1lVU.jpg','32 - hlHQ4cn.jpg','33 - qrAdk9U.jpg','34 - jAEMgT8.jpg','35 - HNm6JdB.jpg',
  '36 - edB2FYo.jpg','37 - UWcdGuR.jpg','38 - vFtYWSc.jpg','39 - 2FsQkNK.jpg','40 - wbOvjNk.jpg',
  '41 - 4ORh9O1.jpg','42 - irt5RIo.jpg','43 - 5T3rn5A.jpg','44 - 3CIyH4t.jpg','45 - BiaOOax.jpg',
  '46 - vExL265.jpg','47 - P7UkUbq.jpg','48 - d2JFXUX.jpg','49 - Oife76z.jpg','50 - nOlCsPs.jpg',
  '51 - QJg9HYk.jpg','52 - MYwhQfO.jpg','53 - U5D6iHd.jpg','54 - 57czJam.jpg','55 - nDp7mRu.jpg',
  '56 - xR2OLsl.jpg','57 - FeFakTM.jpg','58 - lgrpOty.jpg','59 - ArOfV9t.jpg','60 - QKb5WyY.jpg',
  '61 - xM733yp.jpg','62 - rBvrVqG.jpg','63 - VgWCjRg.jpg','64 - oeCGpuw.jpg','65 - Pe0xLZd.jpg',
  '66 - jjGcC5x.jpg','67 - zWPKQNC.jpg','68 - iFHHgxS.jpg','69 - kvDfyS6.jpg','70 - 0XFZAeR.jpg',
  '71 - rEePXkC.jpg','72 - phR8FqC.jpg','73 - AevMdZC.jpg','74 - RYM2YJ6.jpg','75 - PC8M78E.jpg',
  '76 - rHnKbQn.jpg','77 - C5BVHjh.jpg','78 - QMR9lkd.jpg','79 - wL7BDl1.jpg','80 - OxExK8q.jpg',
  '81 - VZM63qN.jpg','82 - u3uKeOr.jpg','83 - WaHYO3m.jpg','84 - iTHCAv1.jpg','85 - 6qGlAUC.jpg',
  '86 - QfSl17N.jpg','87 - gzEXEo8.jpg','88 - gsRY2gI.jpg','89 - WzUwUT6.jpg','90 - FYHlLyk.jpg',
  '91 - YBYbJ5t.jpg','92 - 06M37RZ.jpg','93 - JrTpNFY.jpg','94 - tj6xWD3.jpg','95 - uV43TbX.jpg',
  '96 - RDWH0j9.jpg','97 - LUDDBEn.jpg','98 - BrcsG9E.jpg','99 - K6NbAuW.jpg','100 - Z41Z4E9.jpg',
  '101 - yHstczN.jpg','102 - OmlnnH2.jpg',
];
function sampleUrl(file) { return `images/samples/${encodeURIComponent(file)}`; }

// ─ State ──────────────────────────────────────────────
let activeBgId       = null;
let activeBgSampleId = -1;
let bgImageObj       = null;
let bgAdj            = { angle: 135, brightness: 0, saturation: 0, inverted: false };

// ─ Color helpers ──────────────────────────────────────
function _bgH2r(hex) {
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}
function _bgR2h(r, g, b) {
  return '#' + [r,g,b].map(x => Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
}
function _bgToHsl(hex) {
  let {r,g,b} = _bgH2r(hex);
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if (max !== min) {
    const d=max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h=((g-b)/d+(g<b?6:0))/6; break;
      case g: h=((b-r)/d+2)/6; break;
      case b: h=((r-g)/d+4)/6; break;
    }
  }
  return { h:h*360, s:s*100, l:l*100 };
}
function _bgFromHsl(h, s, l) {
  h/=360; s/=100; l/=100;
  const hue2=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
  if(s===0) return _bgR2h(l*255,l*255,l*255);
  const q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
  return _bgR2h(hue2(p,q,h+1/3)*255, hue2(p,q,h)*255, hue2(p,q,h-1/3)*255);
}
function _bgAdjColor(hex, bright, sat) {
  const {h,s,l}=_bgToHsl(hex);
  return _bgFromHsl(h, Math.max(0,Math.min(100,s*(1+sat))), Math.max(0,Math.min(100,l+bright*50)));
}

// ─ CSS gradient for thumbnails ────────────────────────
function _presetCss(p) {
  if(p.type==='solid') return p.colors[0];
  if(p.type==='radial') return `radial-gradient(circle at center,${p.colors.join(',')})`;
  return `linear-gradient(${p.angle||135}deg,${p.colors.join(',')})`;
}

// ─ Clear background image layer ───────────────────────
function _bgClearImage() {
  if (bgImageObj) {
    inMod = true; canvas.remove(bgImageObj); inMod = false;
    bgImageObj = null;
  }
  activeBgSampleId = -1;
}

// ─ Apply gradient / solid preset ─────────────────────
function applyBgPreset(id) {
  const preset = BG_BY_ID[id];
  if (!preset || !designBgRect) return;

  _bgClearImage();
  activeBgId     = id;
  bgAdj.angle    = preset.angle || 135;
  bgAdj.inverted = false;

  _bgApplyNow(preset);
  _bgRenderAdj(preset);

  document.querySelectorAll('.bg-thumb[data-bg-id]').forEach(el => {
    el.classList.toggle('active', el.dataset.bgId === id);
  });
  saveHist();
}

function _bgApplyNow(preset) {
  if (!designBgRect) return;
  const cols  = bgAdj.inverted ? [...preset.colors].reverse() : [...preset.colors];
  const adj   = cols.map(c => _bgAdjColor(c, bgAdj.brightness, bgAdj.saturation));
  const stops = adj.map((c,i) => ({ offset: i/Math.max(adj.length-1,1), color: c }));

  if (preset.type === 'solid') {
    designBgRect.set('fill', adj[0]);
  } else if (preset.type === 'radial') {
    designBgRect.set('fill', new fabric.Gradient({
      type: 'radial', gradientUnits: 'percentage',
      coords: { x1:0.5, y1:0.5, r1:0, x2:0.5, y2:0.5, r2:1.0 },
      colorStops: stops,
    }));
  } else {
    const rad = (bgAdj.angle * Math.PI) / 180;
    designBgRect.set('fill', new fabric.Gradient({
      type: 'linear', gradientUnits: 'percentage',
      coords: {
        x1: 0.5+0.5*Math.sin(rad+Math.PI), y1: 0.5-0.5*Math.cos(rad+Math.PI),
        x2: 0.5+0.5*Math.sin(rad),         y2: 0.5-0.5*Math.cos(rad),
      },
      colorStops: stops,
    }));
  }
  canvas.renderAll();
}

// ─ Apply sample image as background ──────────────────
function applyBgSample(idx) {
  const file = SAMPLE_FILES[idx];
  if (!file || !designBgRect) return;
  showLoad('Carregando…');
  _bgClearImage();
  activeBgId = null;
  designBgRect.set('fill', '#111114');
  canvas.renderAll();
  fabric.Image.fromURL(sampleUrl(file), (img, isError) => {
    hideLoad();
    if (!img || isError) { toast('❌ Erro ao carregar imagem'); return; }
    const scale = Math.max(DW / img.width, DH / img.height);
    img.set({
      left: DW/2, top: DH/2,
      originX: 'center', originY: 'center',
      scaleX: scale, scaleY: scale,
      selectable: false, evented: false,
      hoverCursor: 'default',
      name: 'bgimage',
    });
    bgImageObj = img;
    activeBgSampleId = idx;
    inMod = true; canvas.add(img); inMod = false;
    canvas.sendToBack(img);
    canvas.sendToBack(designBgRect);
    document.querySelectorAll('.bg-thumb[data-si]').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.si) === idx);
    });
    const adj = el2('bg-adj-panel');
    if (adj) adj.style.display = 'none';
    canvas.renderAll();
    saveHist();
  }, { crossOrigin: 'anonymous' });
}

// ─ Render panel (right panel when nothing selected) ───
function renderBgPanel() {
  const panel = el2('rp-panel');
  if (!panel) return;

  const allPresets = BG_CATS.flatMap(c => c.presets);

  panel.innerHTML = `
    <div class="sub-ttl" style="margin-top:0;margin-bottom:8px">Background</div>
    <button class="btn btn-g btn-sm" style="width:100%;margin-bottom:8px" onclick="randomBg()">Random</button>

    <div class="bg-grid">${allPresets.map(p => _bgGradThumbHtml(p)).join('')}</div>

    <div id="bg-adj-panel" style="display:none">
      <div class="psep" style="margin:8px 0 6px"></div>
      <div class="sub-ttl">Ajustes</div>
      <div id="bg-adj-inner"></div>
    </div>

    <div class="psep" style="margin:10px 0 6px"></div>
    <div class="sub-ttl" style="margin-bottom:6px">
      Exemplos reais
      <span style="font-size:9px;font-weight:400;color:#52525b;text-transform:none;margin-left:4px">${SAMPLE_FILES.length} thumbnails</span>
    </div>
    <div class="bg-samples-wrap">
      <div class="bg-samples-grid">
        ${SAMPLE_FILES.map((f,i) => `
          <div class="bg-thumb bg-sample-thumb${activeBgSampleId===i?' active':''}" data-si="${i}" title="Exemplo ${i+1}">
            <img class="bg-thumb-inner" src="${sampleUrl(f)}" loading="lazy" alt="Exemplo ${i+1}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block">
            <button class="bg-sample-eye" onclick="event.stopPropagation();openLightbox(${i})" title="Ver maior">⤢</button>
          </div>`).join('')}
      </div>
    </div>`;

  panel.querySelectorAll('.bg-thumb[data-bg-id]').forEach(el => {
    el.addEventListener('click', () => applyBgPreset(el.dataset.bgId));
  });
  panel.querySelectorAll('.bg-sample-thumb').forEach(el => {
    el.addEventListener('click', () => applyBgSample(parseInt(el.dataset.si)));
  });

  if (activeBgId) {
    panel.querySelector(`.bg-thumb[data-bg-id="${activeBgId}"]`)?.classList.add('active');
    const preset = BG_BY_ID[activeBgId];
    if (preset) _bgRenderAdj(preset);
  }
}

function _bgGradThumbHtml(p) {
  return `<div class="bg-thumb${activeBgId===p.id?' active':''}" data-bg-id="${p.id}" title="${p.name}">
    <div class="bg-thumb-inner" style="background:${_presetCss(p)}"></div>
    <div class="bg-thumb-lbl">${p.name}</div>
  </div>`;
}

// ─ Adjustments panel ──────────────────────────────────
function _bgRenderAdj(preset) {
  const panel = el2('bg-adj-panel');
  const inner = el2('bg-adj-inner');
  if (!panel || !inner) return;
  panel.style.display = '';

  const isLinear = (preset.type === 'linear' || preset.type === 'multicolor');
  inner.innerHTML = `
    ${isLinear ? `
    <div class="ef-row">
      <span class="ef-lbl">Ângulo</span>
      <div class="ef-sr">
        <input type="range" id="bg-angle" min="0" max="360" value="${Math.round(bgAdj.angle)}">
        <span class="ef-sv" id="bg-angle-v">${Math.round(bgAdj.angle)}°</span>
      </div>
    </div>` : ''}
    <div class="ef-row">
      <span class="ef-lbl">Brilho</span>
      <div class="ef-sr">
        <input type="range" id="bg-bright" min="-1" max="1" step="0.01" value="${bgAdj.brightness.toFixed(2)}">
        <span class="ef-sv" id="bg-bright-v">${bgAdj.brightness.toFixed(2)}</span>
      </div>
    </div>
    <div class="ef-row">
      <span class="ef-lbl">Saturação</span>
      <div class="ef-sr">
        <input type="range" id="bg-sat" min="-1" max="1" step="0.01" value="${bgAdj.saturation.toFixed(2)}">
        <span class="ef-sv" id="bg-sat-v">${bgAdj.saturation.toFixed(2)}</span>
      </div>
    </div>
    <button class="btn btn-g btn-sm" style="width:100%;margin-top:4px" onclick="_bgInvert()">
      ${bgAdj.inverted ? '↩ Desfazer inversão' : '↕ Inverter gradiente'}
    </button>`;

  if (isLinear) {
    bindInput('bg-angle', el => {
      bgAdj.angle = parseInt(el.value);
      el2('bg-angle-v').textContent = bgAdj.angle + '°';
      _bgApplyNow(BG_BY_ID[activeBgId]); schedHist();
    });
  }
  bindInput('bg-bright', el => {
    bgAdj.brightness = parseFloat(el.value);
    el2('bg-bright-v').textContent = bgAdj.brightness.toFixed(2);
    _bgApplyNow(BG_BY_ID[activeBgId]); schedHist();
  });
  bindInput('bg-sat', el => {
    bgAdj.saturation = parseFloat(el.value);
    el2('bg-sat-v').textContent = bgAdj.saturation.toFixed(2);
    _bgApplyNow(BG_BY_ID[activeBgId]); schedHist();
  });
}

function _bgInvert() {
  bgAdj.inverted = !bgAdj.inverted;
  if (activeBgId) { _bgApplyNow(BG_BY_ID[activeBgId]); _bgRenderAdj(BG_BY_ID[activeBgId]); schedHist(); }
}

// ─ Random ─────────────────────────────────────────────
function randomBg(catId) {
  let pool;
  if (!catId) {
    pool = Object.values(BG_BY_ID);
  } else {
    const cat = BG_CATS.find(c => c.id === catId);
    pool = cat ? cat.presets : Object.values(BG_BY_ID);
  }
  const p = pool[Math.floor(Math.random() * pool.length)];
  if (p) {
    bgAdj.brightness = 0; bgAdj.saturation = 0; bgAdj.inverted = false;
    applyBgPreset(p.id);
  }
}
