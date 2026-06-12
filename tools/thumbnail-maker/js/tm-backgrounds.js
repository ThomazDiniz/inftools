'use strict';
// ═══════════════════════════════════════════════════════
// BACKGROUND PRESETS
// One-click gradient/solid backgrounds for thumbnails.
// ═══════════════════════════════════════════════════════

const BG_CATS = [
  { id: 'vanoss', label: 'Vanoss Style', presets: [
    { id: 'r1', name: 'Rainbow 1', type: 'linear', colors: ['#00ff44','#00eeff','#2244ff','#8800ff'], angle: 135 },
    { id: 'r2', name: 'Rainbow 2', type: 'linear', colors: ['#ffff00','#00ff44','#0044ff'], angle: 135 },
    { id: 'r3', name: 'Rainbow 3', type: 'linear', colors: ['#ff6600','#ff0099','#9900ff'], angle: 135 },
    { id: 'r4', name: 'Rainbow 4', type: 'linear', colors: ['#00ffff','#0033ff','#ff00ff'], angle: 135 },
    { id: 'r5', name: 'Rainbow 5', type: 'linear', colors: ['#00ff44','#ffff00','#ff0000'], angle: 135 },
    { id: 'r6', name: 'Rainbow 6', type: 'linear', colors: ['#0044ff','#8800ff','#ff0088'], angle: 135 },
    { id: 'r7', name: 'Rainbow 7', type: 'linear', colors: ['#aaff00','#00ffcc','#001166'], angle: 135 },
    { id: 'r8', name: 'Rainbow 8', type: 'linear', colors: ['#ff6600','#ff0000','#ff0088','#9900ff'], angle: 135 },
  ]},
  { id: 'gaming', label: 'Gaming', presets: [
    { id: 'g1', name: 'Blue Energy',  type: 'radial', colors: ['#0055ff','#000033'] },
    { id: 'g2', name: 'Purple Neon',  type: 'radial', colors: ['#aa00ff','#1a0033'] },
    { id: 'g3', name: 'Toxic Green',  type: 'radial', colors: ['#00ff44','#001100'] },
    { id: 'g4', name: 'Cyber Cyan',   type: 'radial', colors: ['#00ffff','#001133'] },
    { id: 'g5', name: 'Deep Red',     type: 'radial', colors: ['#ff0022','#220000'] },
    { id: 'g6', name: 'Orange Fire',  type: 'radial', colors: ['#ff8800','#220800'] },
  ]},
  { id: 'reaction', label: 'Reaction', presets: [
    { id: 'rc1', name: 'Shock Red',    type: 'radial', colors: ['#ff2200','#110000'] },
    { id: 'rc2', name: 'Drama Purple', type: 'radial', colors: ['#6600ff','#110022'] },
    { id: 'rc3', name: 'Chaos Green',  type: 'radial', colors: ['#00ff55','#002200'] },
    { id: 'rc4', name: 'Alert Yellow', type: 'radial', colors: ['#ffcc00','#332200'] },
    { id: 'rc5', name: 'Pink Energy',  type: 'radial', colors: ['#ff0088','#220011'] },
  ]},
  { id: 'cartoon', label: 'Cartoon', presets: [
    { id: 'ct1', name: 'Sky Blue',   type: 'linear', colors: ['#66ccff','#0088cc'], angle: 160 },
    { id: 'ct2', name: 'Candy Pink', type: 'linear', colors: ['#ff88cc','#ff44aa'], angle: 160 },
    { id: 'ct3', name: 'Lime Green', type: 'linear', colors: ['#88ff44','#44aa00'], angle: 160 },
    { id: 'ct4', name: 'Orange Pop', type: 'linear', colors: ['#ffaa00','#ff4400'], angle: 160 },
    { id: 'ct5', name: 'Purple Fun', type: 'linear', colors: ['#aa44ff','#6600cc'], angle: 160 },
  ]},
  { id: 'professional', label: 'Professional', presets: [
    { id: 'pr1', name: 'Dark Blue',   type: 'linear', colors: ['#001133','#003399'], angle: 160 },
    { id: 'pr2', name: 'Dark Purple', type: 'linear', colors: ['#110022','#440066'], angle: 160 },
    { id: 'pr3', name: 'Dark Red',    type: 'linear', colors: ['#220000','#660011'], angle: 160 },
    { id: 'pr4', name: 'Dark Green',  type: 'linear', colors: ['#001100','#004400'], angle: 160 },
    { id: 'pr5', name: 'Slate Gray',  type: 'linear', colors: ['#1a1a2e','#16213e'], angle: 160 },
  ]},
  { id: 'simple', label: 'Simple', presets: [
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

// Flat lookup map
const BG_BY_ID = {};
BG_CATS.forEach(cat => cat.presets.forEach(p => { p.catId = cat.id; BG_BY_ID[p.id] = p; }));

// ─ State ──────────────────────────────────────────────
let bgFavorites = new Set(JSON.parse(localStorage.getItem('bg_favs') || '[]'));
let activeBgId  = null;
let bgAdj       = { angle: 135, brightness: 0, saturation: 0, inverted: false };

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
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0)) / 6; break;
      case g: h = ((b-r)/d + 2) / 6; break;
      case b: h = ((r-g)/d + 4) / 6; break;
    }
  }
  return { h: h*360, s: s*100, l: l*100 };
}
function _bgFromHsl(h, s, l) {
  h/=360; s/=100; l/=100;
  const hue2 = (p,q,t) => {
    if (t<0) t+=1; if (t>1) t-=1;
    if (t<1/6) return p+(q-p)*6*t;
    if (t<1/2) return q;
    if (t<2/3) return p+(q-p)*(2/3-t)*6;
    return p;
  };
  if (s === 0) return _bgR2h(l*255,l*255,l*255);
  const q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
  return _bgR2h(hue2(p,q,h+1/3)*255, hue2(p,q,h)*255, hue2(p,q,h-1/3)*255);
}
function _bgAdjColor(hex, bright, sat) {
  const {h,s,l} = _bgToHsl(hex);
  return _bgFromHsl(h, Math.max(0,Math.min(100, s*(1+sat))), Math.max(0,Math.min(100, l+bright*50)));
}

// ─ CSS gradient (for thumbnails) ──────────────────────
function _presetCss(preset, adj) {
  const cols = (adj && adj.inverted) ? [...preset.colors].reverse() : preset.colors;
  const adjCols = adj
    ? cols.map(c => _bgAdjColor(c, adj.brightness, adj.saturation))
    : cols;
  if (preset.type === 'solid') return adjCols[0];
  if (preset.type === 'radial') return `radial-gradient(circle at center, ${adjCols.join(',')})`;
  const angle = (adj && adj.angle != null) ? adj.angle : (preset.angle || 135);
  return `linear-gradient(${angle}deg, ${adjCols.join(',')})`;
}

// ─ Apply to canvas background ─────────────────────────
function applyBgPreset(id) {
  const preset = BG_BY_ID[id];
  if (!preset || !designBgRect) return;

  activeBgId    = id;
  bgAdj.angle   = preset.angle || 135;
  bgAdj.inverted = false;

  _bgApplyNow(preset);
  _bgRenderAdj(preset);

  // Highlight active thumbnail
  document.querySelectorAll('.bg-thumb').forEach(el => {
    el.classList.toggle('active', el.dataset.bgId === id);
  });

  saveHist();
}

function _bgApplyNow(preset) {
  if (!designBgRect) return;
  const colors = bgAdj.inverted ? [...preset.colors].reverse() : [...preset.colors];
  const adj    = colors.map(c => _bgAdjColor(c, bgAdj.brightness, bgAdj.saturation));
  const stops  = adj.map((c, i) => ({ offset: i / Math.max(adj.length-1, 1), color: c }));

  if (preset.type === 'solid') {
    designBgRect.set('fill', adj[0]);
  } else if (preset.type === 'radial') {
    designBgRect.set('fill', new fabric.Gradient({
      type: 'radial',
      gradientUnits: 'percentage',
      coords: { x1: 0.5, y1: 0.5, r1: 0, x2: 0.5, y2: 0.5, r2: 1.0 },
      colorStops: stops,
    }));
  } else {
    // linear / multicolor / softglow
    const angle = bgAdj.angle;
    const rad   = (angle * Math.PI) / 180;
    const x1 = 0.5 + 0.5 * Math.sin(rad + Math.PI);
    const y1 = 0.5 - 0.5 * Math.cos(rad + Math.PI);
    const x2 = 0.5 + 0.5 * Math.sin(rad);
    const y2 = 0.5 - 0.5 * Math.cos(rad);
    designBgRect.set('fill', new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'percentage',
      coords: { x1, y1, x2, y2 },
      colorStops: stops,
    }));
  }

  canvas.renderAll();
}

// ─ Render the full panel ──────────────────────────────
function renderBgPanel() {
  const panel = el2('rp-panel');
  if (!panel) return;

  // Flat list of all presets in definition order
  const allPresets = BG_CATS.flatMap(cat => cat.presets);

  // Favorites row (if any)
  const favIds = [...bgFavorites].filter(id => BG_BY_ID[id]);
  const favRow = favIds.length > 0
    ? `<div class="sub-ttl" style="margin-top:0">⭐ Favoritos</div>
       <div class="bg-grid">${favIds.map(id => _bgThumbHtml(BG_BY_ID[id])).join('')}</div>
       <div class="psep" style="margin:6px 0"></div>`
    : '';

  panel.innerHTML = `
    <div class="sub-ttl" style="margin-top:0;margin-bottom:6px">Background</div>
    <div class="bg-rand-row">
      <button class="btn btn-g btn-sm" style="flex:1" onclick="randomBg()">🎲 Random</button>
      <button class="btn btn-g btn-sm" style="flex:1" onclick="randomBg('vanoss')">🌈 Vanoss</button>
      <button class="btn btn-g btn-sm" style="flex:1" onclick="randomBg('gaming')">🎮 Gaming</button>
    </div>
    <div class="bg-rand-row" style="margin-top:4px;margin-bottom:8px">
      <button class="btn btn-g btn-sm" style="flex:1" onclick="randomBg('reaction')">😱 Reaction</button>
      <button class="btn btn-g btn-sm" style="flex:1" onclick="randomBg('cartoon')">🎨 Cartoon</button>
    </div>
    ${favRow}
    <div class="bg-grid">${allPresets.map(p => _bgThumbHtml(p)).join('')}</div>
    <div id="bg-adj-panel" style="display:none">
      <div class="psep" style="margin:8px 0 6px"></div>
      <div class="sub-ttl">Ajustes</div>
      <div id="bg-adj-inner"></div>
    </div>`;

  panel.querySelectorAll('.bg-thumb').forEach(el => {
    el.addEventListener('click', () => applyBgPreset(el.dataset.bgId));
  });
  panel.querySelectorAll('.bg-fav-btn').forEach(el => {
    el.addEventListener('click', e => { e.stopPropagation(); _bgToggleFav(el.dataset.bgId); });
  });

  if (activeBgId) {
    panel.querySelector(`.bg-thumb[data-bg-id="${activeBgId}"]`)?.classList.add('active');
    const preset = BG_BY_ID[activeBgId];
    if (preset) _bgRenderAdj(preset);
  }
}

function _bgThumbHtml(p) {
  const css   = _presetCss(p);
  const isFav = bgFavorites.has(p.id);
  const isAct = activeBgId === p.id;
  return `<div class="bg-thumb${isAct?' active':''}" data-bg-id="${p.id}" title="${p.name}">
    <div class="bg-thumb-inner" style="background:${css}"></div>
    <div class="bg-thumb-lbl">${p.name}</div>
    <div class="bg-fav-btn${isFav?' fav':''}" data-bg-id="${p.id}" title="Favoritar">★</div>
  </div>`;
}

// ─ Adjustments panel ──────────────────────────────────
function _bgRenderAdj(preset) {
  const panel = el2('bg-adj-panel');
  const inner = el2('bg-adj-inner');
  if (!panel || !inner) return;
  panel.style.display = '';

  const isLinear = (preset.type === 'linear' || preset.type === 'multicolor');
  const bright   = bgAdj.brightness.toFixed(2);
  const sat      = bgAdj.saturation.toFixed(2);

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
        <input type="range" id="bg-bright" min="-1" max="1" step="0.01" value="${bright}">
        <span class="ef-sv" id="bg-bright-v">${bright}</span>
      </div>
    </div>
    <div class="ef-row">
      <span class="ef-lbl">Saturação</span>
      <div class="ef-sr">
        <input type="range" id="bg-sat" min="-1" max="1" step="0.01" value="${sat}">
        <span class="ef-sv" id="bg-sat-v">${sat}</span>
      </div>
    </div>
    <button class="btn btn-g btn-sm" style="width:100%;margin-top:4px" onclick="_bgInvert()">
      ${bgAdj.inverted ? '↩ Desfazer inversão' : '↕ Inverter gradiente'}
    </button>`;

  if (isLinear) {
    bindInput('bg-angle', el => {
      bgAdj.angle = parseInt(el.value);
      el2('bg-angle-v').textContent = bgAdj.angle + '°';
      _bgApplyNow(BG_BY_ID[activeBgId]);
      schedHist();
    });
  }
  bindInput('bg-bright', el => {
    bgAdj.brightness = parseFloat(el.value);
    el2('bg-bright-v').textContent = bgAdj.brightness.toFixed(2);
    _bgApplyNow(BG_BY_ID[activeBgId]);
    schedHist();
  });
  bindInput('bg-sat', el => {
    bgAdj.saturation = parseFloat(el.value);
    el2('bg-sat-v').textContent = bgAdj.saturation.toFixed(2);
    _bgApplyNow(BG_BY_ID[activeBgId]);
    schedHist();
  });
}

function _bgInvert() {
  bgAdj.inverted = !bgAdj.inverted;
  if (activeBgId) {
    _bgApplyNow(BG_BY_ID[activeBgId]);
    _bgRenderAdj(BG_BY_ID[activeBgId]);
    schedHist();
  }
}

// ─ Favorites ──────────────────────────────────────────
function _bgToggleFav(id) {
  if (bgFavorites.has(id)) bgFavorites.delete(id);
  else bgFavorites.add(id);
  localStorage.setItem('bg_favs', JSON.stringify([...bgFavorites]));
  renderBgPanel();
  if (activeBgId && BG_BY_ID[activeBgId]) _bgRenderAdj(BG_BY_ID[activeBgId]);
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
    // Reset adjustments for a clean random pick
    bgAdj.brightness = 0;
    bgAdj.saturation = 0;
    bgAdj.inverted   = false;
    applyBgPreset(p.id);
  }
}
