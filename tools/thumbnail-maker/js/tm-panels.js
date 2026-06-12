'use strict';
// ═══════════════════════════════════════════════════════
// RIGHT PANEL: PROPERTIES (single column, no tabs)
// For images: props + effects inline in one scrollable panel
// ═══════════════════════════════════════════════════════

// switchTab kept as stub so addFrame() call doesn't error
function switchTab() {}

function onSel()   { renderPropsPanel(); renderLayerPanel(); }
function onDesel() {
  el2('rp-panel').innerHTML = '<div class="no-sel"><span class="ni">✦</span>Selecione um elemento</div>';
  renderLayerPanel();
}

// ─ Properties panel ───────────────────────────────────
function renderPropsPanel() {
  const obj = canvas.getActiveObject();
  if (!obj) { onDesel(); return; }

  // ── Canvas FX Overlay (must precede isImg — overlays are fabric.Image) ──
  if (obj.name === 'overlay') {
    const op       = Math.round((obj.opacity ?? 1) * 100);
    const blends   = ['source-over','screen','multiply','overlay','soft-light','color-dodge','luminosity'];
    const curBlend = obj.globalCompositeOperation || 'source-over';
    const brightF  = obj.filters && obj.filters.find(f => f.type === 'Brightness');
    const bright   = brightF ? brightF.brightness.toFixed(2) : '0.00';
    const hasSh    = !!obj.shadow;
    const sh       = obj.shadow || {};
    const shC      = toHex(sh.color) || '#000000';
    const shB      = sh.blur ?? 10;
    const html = `
      <div class="pg"><div class="pl">Opacidade</div>
        <div class="sr"><input type="range" id="p-op" min="0" max="100" value="${op}"><span class="sv" id="p-op-v">${op}%</span></div>
      </div>
      <div class="pg"><div class="pl">Cor do efeito</div>
        <input type="color" class="pi" id="p-fx-color" value="${obj._fxColor || '#ffffff'}" style="height:30px;padding:2px 4px;cursor:pointer">
      </div>
      <div class="pg"><div class="pl">Blend mode</div>
        <select class="pi" id="p-blend">${blends.map(m => `<option value="${m}" ${curBlend===m?'selected':''}>${m}</option>`).join('')}</select>
      </div>
      <div class="pg"><div class="pl">Brilho</div>
        <div class="sr"><input type="range" id="p-bright" min="-1" max="1" step="0.01" value="${bright}"><span class="sv" id="p-bright-v">${bright}</span></div>
      </div>
      <div class="psep"></div>
      <div class="pg">
        <div class="trow"><span style="font-size:12px;color:#d4d4d8">Sombra</span>
          <label class="tgl"><input type="checkbox" id="p-sh-on" ${hasSh?'checked':''}><span class="tslider"></span></label>
        </div>
        <div id="sh-opts" style="${hasSh?'':'display:none'}">
          <div class="pin" style="gap:8px;margin-bottom:8px">
            <div style="flex:1"><div class="pl">Cor</div><input type="color" class="cb" id="p-sh-c" value="${shC}" style="width:100%;height:26px"></div>
            <div style="flex:2"><div class="pl">Blur</div><div class="sr"><input type="range" id="p-sh-bl" min="0" max="80" value="${shB}"><span class="sv" id="p-sh-bl-v">${shB}</span></div></div>
          </div>
        </div>
      </div>
      <div class="psep"></div>
      <button class="btn btn-d btn-sm" style="width:100%" onclick="deleteSelected()">🗑 Remover</button>`;
    el2('rp-panel').innerHTML = html;
    bindInput('p-op',    el => { obj.set('opacity', parseInt(el.value)/100); el2('p-op-v').textContent = el.value + '%'; canvas.renderAll(); });
    bindInput('p-blend', el => { obj.set('globalCompositeOperation', el.value); canvas.renderAll(); schedHist(); });
    bindInput('p-fx-color', el => { reapplyFxCanvas(obj, el.value); });
    bindInput('p-bright', el => {
      el2('p-bright-v').textContent = parseFloat(el.value).toFixed(2);
      obj.filters = [new fabric.Image.filters.Brightness({ brightness: parseFloat(el.value) })];
      obj.applyFilters(); canvas.renderAll();
    });
    const shOn = el2('p-sh-on');
    if (shOn) shOn.onchange = e => {
      el2('sh-opts').style.display = e.target.checked ? '' : 'none';
      obj.set('shadow', e.target.checked ? new fabric.Shadow({ color: '#000000', blur: 15, offsetX: 5, offsetY: 5 }) : null);
      canvas.renderAll();
    };
    bindInput('p-sh-c',  el => { if (obj.shadow) { obj.shadow.color = el.value; obj.set('dirty', true); canvas.renderAll(); } });
    bindInput('p-sh-bl', el => { el2('p-sh-bl-v').textContent = el.value; if (obj.shadow) { obj.shadow.blur = parseInt(el.value); obj.set('dirty', true); canvas.renderAll(); } });
    return;
  }

  const isImg = obj.type === 'image';
  const isTxt = obj.type === 'i-text' || obj.type === 'text';
  const ly    = layers.find(l => l.obj === obj);
  let html    = '';

  // ── Image ──
  if (isImg) {
    const op = Math.round((obj.opacity ?? 1) * 100);
    html = `
      <div class="pg"><div class="pl">Opacidade</div>
        <div class="sr"><input type="range" id="p-op" min="0" max="100" value="${op}"><span class="sv" id="p-op-v">${op}%</span></div>
      </div>
      <div class="psep"></div>
      <div id="rp-fx"></div>
      <div class="psep"></div>
      <button class="btn btn-d btn-sm" style="width:100%" onclick="deleteSelected()">🗑 Remover imagem</button>`;
    el2('rp-panel').innerHTML = html;
    _bindPropsPanel(obj, isImg, isTxt, ly);
    if (ly) renderFxPanel(ly);
    return;
  }

  // ── Text ──
  if (isTxt) {
    const sh = obj.shadow || {};
    const hasSh = !!obj.shadow;
    const shC = toHex(sh.color) || '#000000';
    const shB = sh.blur ?? 10, shOx = sh.offsetX ?? 5, shOy = sh.offsetY ?? 5;
    const sw = obj.strokeWidth || 0;
    html = `
      <div class="pg"><div class="pl">Fonte</div>
        <select class="pi" id="p-font">${FONTS.map(f => `<option value="${f}" ${obj.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
      </div>
      <div class="pg"><div class="pl">Tamanho</div>
        <div class="sr"><input type="range" id="p-sz" min="10" max="400" value="${Math.round(obj.fontSize)}"><span class="sv" id="p-sz-v">${Math.round(obj.fontSize)}</span></div>
      </div>
      <div class="pg"><div class="pl">Cor do texto</div>
        <input type="color" class="pi" id="p-fc" value="${toHex(obj.fill) || '#ffffff'}" style="height:30px;padding:2px 4px;cursor:pointer">
      </div>
      <div class="pg" style="font-size:10px;color:#52525b;font-style:italic"><kbd>Ctrl+B</kbd> negrito &nbsp; <kbd>Ctrl+I</kbd> itálico</div>
      <div class="psep"></div>
      <div class="pg"><div class="pl">Outline</div>
        <div class="pin" style="gap:8px">
          <div class="sr" style="flex:1"><input type="range" id="p-sw" min="0" max="30" value="${sw}"><span class="sv" id="p-sw-v">${sw}px</span></div>
          <input type="color" class="cb" id="p-sc" value="${toHex(obj.stroke) || '#000000'}">
        </div>
      </div>
      <div class="psep"></div>
      <div class="pg">
        <div class="trow"><span style="font-size:12px;color:#d4d4d8">Sombra</span>
          <label class="tgl"><input type="checkbox" id="p-sh-on" ${hasSh ? 'checked' : ''}><span class="tslider"></span></label>
        </div>
        <div id="sh-opts" style="${hasSh ? '' : 'display:none'}">
          <div class="pin" style="gap:8px;margin-bottom:8px">
            <div style="flex:1"><div class="pl">Cor</div><input type="color" class="cb" id="p-sh-c" value="${shC}" style="width:100%;height:26px"></div>
            <div style="flex:2"><div class="pl">Blur</div><div class="sr"><input type="range" id="p-sh-bl" min="0" max="60" value="${shB}"><span class="sv" id="p-sh-bl-v">${shB}</span></div></div>
          </div>
          <div class="pl">Posição</div>
          <div class="shpick" id="shpick"><div class="shdot" id="shdot" style="left:50%;top:50%"></div></div>
        </div>
      </div>
      <div class="psep"></div>
      <button class="btn btn-d btn-sm" style="width:100%" onclick="deleteSelected()">🗑 Remover texto</button>`;
  }

  // ── Frame ──
  else if (obj.name === 'frame') {
    const fstyle = obj.frameStyle || 'solid';
    const fcolor = obj.frameColor || '#ffffff';
    const fthick = obj.frameThickness || 24;
    const op = Math.round((obj.opacity ?? 1) * 100);
    html = `
      <div class="pg"><div class="pl">Estilo</div>
        <div class="ef-seg">
          <div class="ef-seg-btn${fstyle === 'solid'  ? ' sel' : ''}" data-fstyle="solid">Sólida</div>
          <div class="ef-seg-btn${fstyle === 'neon'   ? ' sel' : ''}" data-fstyle="neon">Neon</div>
          <div class="ef-seg-btn${fstyle === 'double' ? ' sel' : ''}" data-fstyle="double">Dupla</div>
        </div>
      </div>
      <div class="pg"><div class="pl">Cor</div>
        <input type="color" class="pi" id="p-frame-c" value="${fcolor}" style="height:30px;padding:2px 4px;cursor:pointer">
      </div>
      <div class="pg"><div class="pl">Espessura</div>
        <div class="sr"><input type="range" id="p-frame-t" min="2" max="80" value="${fthick}"><span class="sv" id="p-frame-tv">${fthick}px</span></div>
      </div>
      <div class="pg"><div class="pl">Opacidade</div>
        <div class="sr"><input type="range" id="p-op" min="0" max="100" value="${op}"><span class="sv" id="p-op-v">${op}%</span></div>
      </div>
      <div class="psep"></div>
      <button class="btn btn-d btn-sm" style="width:100%" onclick="deleteSelected()">🗑 Remover moldura</button>`;
  }

  // ── Shape (Path / Circle / Rect / Line with name='shape') ──
  else if (obj.name === 'shape') {
    const op  = Math.round((obj.opacity ?? 1) * 100);
    const sw  = obj.strokeWidth || 0;
    const fillC  = _safeHex(obj.fill,   '#ff0000');
    const strkC  = _safeHex(obj.stroke, '#000000');
    const isFilled = !(!obj.fill || obj.fill === 'transparent' || obj.fill === 'rgba(0,0,0,0)');
    const hasSh  = !!obj.shadow;
    const sh     = obj.shadow || {};
    const shC    = toHex(sh.color) || '#000000';
    const shB    = sh.blur ?? 10;
    html = `
      <div class="pg">
        <div class="trow"><span style="font-size:12px;color:#d4d4d8">Preenchimento</span>
          <label class="tgl"><input type="checkbox" id="p-fill-on" ${isFilled?'checked':''}><span class="tslider"></span></label>
        </div>
        <div id="p-fill-row" style="${isFilled?'':'display:none'}">
          <input type="color" class="pi" id="p-fill" value="${fillC}" style="height:30px;padding:2px 4px;cursor:pointer;margin-top:6px">
        </div>
      </div>
      <div class="pg"><div class="pl">Contorno</div>
        <div class="pin" style="gap:8px">
          <div class="sr" style="flex:1"><input type="range" id="p-sw" min="0" max="50" value="${sw}"><span class="sv" id="p-sw-v">${sw}px</span></div>
          <input type="color" class="cb" id="p-sc" value="${strkC}">
        </div>
      </div>
      <div class="pg"><div class="pl">Opacidade</div>
        <div class="sr"><input type="range" id="p-op" min="0" max="100" value="${op}"><span class="sv" id="p-op-v">${op}%</span></div>
      </div>
      <div class="psep"></div>
      <div class="pg">
        <div class="trow"><span style="font-size:12px;color:#d4d4d8">Sombra</span>
          <label class="tgl"><input type="checkbox" id="p-sh-on" ${hasSh ? 'checked' : ''}><span class="tslider"></span></label>
        </div>
        <div id="sh-opts" style="${hasSh ? '' : 'display:none'}">
          <div class="pin" style="gap:8px;margin-bottom:8px">
            <div style="flex:1"><div class="pl">Cor</div><input type="color" class="cb" id="p-sh-c" value="${shC}" style="width:100%;height:26px"></div>
            <div style="flex:2"><div class="pl">Blur</div><div class="sr"><input type="range" id="p-sh-bl" min="0" max="60" value="${shB}"><span class="sv" id="p-sh-bl-v">${shB}</span></div></div>
          </div>
          <div class="pl">Posição</div>
          <div class="shpick" id="shpick"><div class="shdot" id="shdot" style="left:50%;top:50%"></div></div>
        </div>
      </div>
      <div class="psep"></div>
      <button class="btn btn-d btn-sm" style="width:100%" onclick="deleteSelected()">🗑 Remover</button>`;
  }

  // ── Other (badge / overlay / group) ──
  else {
    const op = Math.round((obj.opacity ?? 1) * 100);
    html = `
      <div class="pg"><div class="pl">Opacidade</div>
        <div class="sr"><input type="range" id="p-op" min="0" max="100" value="${op}"><span class="sv" id="p-op-v">${op}%</span></div>
      </div>
      <div class="psep"></div>
      <button class="btn btn-d btn-sm" style="width:100%" onclick="deleteSelected()">🗑 Remover</button>`;
  }

  el2('rp-panel').innerHTML = html;
  _bindPropsPanel(obj, isImg, isTxt, ly);
}

/** Returns a safe hex color string, or fallback if input is unparseable. */
function _safeHex(c, fallback) {
  if (!c || c === 'transparent' || c === '') return fallback;
  const h = toHex(c);
  return (h && h.length >= 4) ? h : fallback;
}

function _bindPropsPanel(obj, isImg, isTxt, ly) {
  if (isImg) {
    bindInput('p-op', el => { obj.set('opacity', parseInt(el.value) / 100); el2('p-op-v').textContent = el.value + '%'; canvas.renderAll(); });
  }

  if (obj.name === 'shape') {
    const fillOn = el2('p-fill-on');
    if (fillOn) fillOn.onchange = e => {
      const row = el2('p-fill-row');
      if (row) row.style.display = e.target.checked ? '' : 'none';
      obj.set('fill', e.target.checked ? (el2('p-fill')?.value || '#ff0000') : 'transparent');
      canvas.renderAll(); schedHist();
    };
    bindInput('p-fill', el => { obj.set('fill', el.value); canvas.renderAll(); schedHist(); });
    bindInput('p-sc',   el => { obj.set('stroke', el.value); canvas.renderAll(); });
    bindInput('p-sw',   el => {
      obj.set('strokeWidth', parseInt(el.value));
      el2('p-sw-v').textContent = el.value + 'px';
      canvas.renderAll();
    });
    bindInput('p-op',   el => { obj.set('opacity', parseInt(el.value) / 100); el2('p-op-v').textContent = el.value + '%'; canvas.renderAll(); });

    const shOn = el2('p-sh-on');
    if (shOn) {
      shOn.onchange = e => {
        el2('sh-opts').style.display = e.target.checked ? '' : 'none';
        if (e.target.checked) applyShadowText(obj); else { obj.set('shadow', null); canvas.renderAll(); }
      };
    }
    bindInput('p-sh-c',  () => applyShadowText(obj));
    bindInput('p-sh-bl', el => { el2('p-sh-bl-v').textContent = el.value; applyShadowText(obj); });
    if (obj.shadow) requestAnimationFrame(() => initShPicker(obj));
    return;
  }

  if (obj.name === 'frame') {
    document.querySelectorAll('[data-fstyle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nc = el2('p-frame-c')?.value || obj.frameColor || '#ffffff';
        const nt = parseInt(el2('p-frame-t')?.value) || obj.frameThickness || 24;
        rebuildFrame(obj, btn.dataset.fstyle, nc, nt);
      });
    });
    bindInput('p-frame-c', el => {
      const nt = parseInt(el2('p-frame-t')?.value) || obj.frameThickness || 24;
      rebuildFrame(obj, obj.frameStyle || 'solid', el.value, nt);
    });
    bindInput('p-frame-t', el => {
      el2('p-frame-tv').textContent = el.value + 'px';
      if (obj.frameStyle === 'solid' || obj.frameStyle === 'neon') {
        const t = parseInt(el.value);
        obj.set('strokeWidth', t); obj.frameThickness = t;
        if (obj.frameStyle === 'neon' && obj.shadow) { obj.shadow.blur = t * 2; obj.set('dirty', true); }
        canvas.renderAll();
      }
    });
    el2('p-frame-t')?.addEventListener('change', () => {
      const nc = el2('p-frame-c')?.value || obj.frameColor || '#ffffff';
      rebuildFrame(obj, obj.frameStyle || 'solid', nc, parseInt(el2('p-frame-t')?.value) || 24);
    });
    bindInput('p-op', el => { obj.set('opacity', parseInt(el.value) / 100); el2('p-op-v').textContent = el.value + '%'; canvas.renderAll(); });
  }

  if (isTxt) {
    bindInput('p-font', el => { obj.set('fontFamily', el.value); canvas.renderAll(); });
    bindInput('p-sz',   el => { obj.set('fontSize', parseInt(el.value) || 40); el2('p-sz-v').textContent = el.value; canvas.renderAll(); });
    bindInput('p-fc',   el => { obj.set('fill', el.value); canvas.renderAll(); });
    bindInput('p-sw',   el => { obj.set('strokeWidth', parseInt(el.value)); el2('p-sw-v').textContent = el.value + 'px'; canvas.renderAll(); });
    bindInput('p-sc',   el => { obj.set('stroke', el.value); canvas.renderAll(); });

    const shOn = el2('p-sh-on');
    if (shOn) {
      shOn.onchange = e => {
        el2('sh-opts').style.display = e.target.checked ? '' : 'none';
        if (e.target.checked) applyShadowText(obj); else { obj.set('shadow', null); canvas.renderAll(); }
      };
    }
    bindInput('p-sh-c',  () => applyShadowText(obj));
    bindInput('p-sh-bl', el => { el2('p-sh-bl-v').textContent = el.value; applyShadowText(obj); });
    if (obj.shadow) requestAnimationFrame(() => initShPicker(obj));
  }

  if (!isImg && !isTxt && obj.name !== 'frame' && obj.name !== 'shape') {
    bindInput('p-op', el => { obj.set('opacity', parseInt(el.value) / 100); el2('p-op-v').textContent = el.value + '%'; canvas.renderAll(); });
  }
}

// ─ Text shadow helpers ────────────────────────────────
function applyShadowText(obj) {
  const color = el2('p-sh-c')?.value || '#000000';
  const blur  = parseInt(el2('p-sh-bl')?.value) || 10;
  const dot = el2('shdot'), pick = el2('shpick');
  let ox = 5, oy = 5;
  if (dot && pick) {
    ox = Math.round((parseFloat(dot.style.left) / 100) * 2 * SH_RANGE - SH_RANGE);
    oy = Math.round((parseFloat(dot.style.top)  / 100) * 2 * SH_RANGE - SH_RANGE);
  } else if (obj.shadow) {
    ox = obj.shadow.offsetX; oy = obj.shadow.offsetY;
  }
  obj.set('shadow', new fabric.Shadow({ color, blur, offsetX: ox, offsetY: oy }));
  canvas.renderAll();
}

function initShPicker(obj) {
  const pick = el2('shpick'), dot = el2('shdot');
  if (!pick || !dot) return;
  const sh = obj.shadow || {};
  dot.style.left = ((sh.offsetX ?? 5 + SH_RANGE) / (2 * SH_RANGE) * 100).toFixed(1) + '%';
  dot.style.top  = ((sh.offsetY ?? 5 + SH_RANGE) / (2 * SH_RANGE) * 100).toFixed(1) + '%';
  let drag = false;
  const mv = e => {
    const r  = pick.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const x  = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    const y  = Math.max(0, Math.min(1, (cy - r.top)  / r.height));
    dot.style.left = (x * 100) + '%'; dot.style.top = (y * 100) + '%';
    const ox = Math.round(x * 2 * SH_RANGE - SH_RANGE);
    const oy = Math.round(y * 2 * SH_RANGE - SH_RANGE);
    if (!obj.shadow) obj.set('shadow', new fabric.Shadow({ color: '#000000', blur: 10, offsetX: ox, offsetY: oy }));
    else { obj.shadow.offsetX = ox; obj.shadow.offsetY = oy; obj.set('dirty', true); }
    canvas.renderAll();
  };
  pick.onmousedown = e => { drag = true; mv(e); e.preventDefault(); };
  document.addEventListener('mousemove', e => { if (drag) mv(e); });
  document.addEventListener('mouseup',   e => { if (drag) { drag = false; schedHist(); } });
}

// ─ Effects panel (renders into #rp-fx, inline below image props) ──
function renderFxPanel(ly) {
  const s    = ly.effectState;
  const fxEl = el2('rp-fx');
  if (!fxEl) return;

  const mk = (label, key, min, max, step = 0.01) => `
    <div class="ef-row">
      <span class="ef-lbl">${label}</span>
      <div class="ef-sr">
        <input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${s[key] ?? 0}">
        <span class="ef-sv" id="efv-${key}">${fmtFx(s[key] ?? 0)}</span>
      </div>
    </div>`;

  const mkChk = (label, key) => `
    <div class="ef-cb">
      <input type="checkbox" data-key="${key}" id="efck-${key}" ${s[key] ? 'checked' : ''}>
      <label for="efck-${key}">${label}</label>
    </div>`;

  const shadowSeg = () => ['none', 'outline', 'glow', 'drop'].map(t =>
    `<div class="ef-seg-btn ${s.shadow_type === t ? 'sel' : ''}" data-stype="${t}">${{ none: 'Nenhuma', outline: 'Contorno', glow: 'Glow', drop: 'Sombra' }[t]}</div>`
  ).join('');

  fxEl.innerHTML = `
    <div class="sub-ttl" style="margin-top:0">Ajustes de cor</div>
    ${mk('Brilho',      'brightness', -1, 1)}
    ${mk('Contraste',   'contrast',   -1, 1)}
    ${mk('Saturação',   'saturation', -1, 1)}
    ${mk('Vibrance',    'vibrance',   -1, 1)}
    ${mkChk('Preto & Branco','bw')}
    ${mkChk('Sépia','sepia')}

    <div class="psep"></div>
    <div class="sub-ttl">Nitidez / Desfoque</div>
    ${mk('Blur',             'blur',    0, 1)}
    ${mk('Sharpen',          'sharpen', 0, 1)}
    ${mk('HDR',              'hdr',     0, 1)}
    ${mkChk('Nitidez extrema','extreme_sharpen')}
    ${mk('Pixelização',  'pixelate',  0, 1)}
    ${mk('Posterização', 'posterize', 0, 1)}

    <div class="psep"></div>
    <div class="sub-ttl">Destaque / Contorno</div>
    <div class="pl" style="margin-bottom:4px">Tipo</div>
    <div class="ef-seg" id="shadow-seg">${shadowSeg()}</div>
    <div id="shadow-sub">${_shadowSubHtml(s)}</div>

    <div class="psep"></div>
    <div class="sub-ttl">Sobreposições</div>
    ${mk('Grain / Ruído',    'grain',    0, 1)}
    ${mk('Escurecimento cantos', 'vignette', 0, 1)}
    ${mkChk('Cor nos cantos','vignette_c')}
    <div id="vc-color-row" style="${s.vignette_c ? '' : 'display:none'}" class="ef-row">
      <span class="ef-lbl">Cor vinheta</span>
      <input type="color" class="ef-clr" data-key="vc_color" value="${s.vc_color || '#ff0000'}">
    </div>
    ${mk('Scanlines',    'scanlines', 0, 1)}
    ${mk('Papel antigo', 'warm',      0, 1)}
    ${mk('Motion blur',  'motion_h',  0, 1)}
    ${mkChk('CRT','crt')}
    ${mkChk('VHS','vhs')}`;

  fxEl.querySelectorAll('input[type=range][data-key]').forEach(el => {
    el.addEventListener('input', () => {
      s[el.dataset.key] = parseFloat(el.value);
      const sv = document.getElementById('efv-' + el.dataset.key);
      if (sv) sv.textContent = fmtFx(s[el.dataset.key]);
      rebuildFilters(ly);
      if (el.dataset.key === 'vignette') renderFxVignetteColor(s);
    });
  });

  fxEl.querySelectorAll('input[type=checkbox][data-key]').forEach(el => {
    el.addEventListener('change', () => {
      s[el.dataset.key] = el.checked;
      if (el.dataset.key === 'vignette_c') renderFxVignetteColor(s);
      rebuildFilters(ly);
    });
  });

  fxEl.querySelectorAll('input[type=color][data-key]').forEach(el => {
    el.addEventListener('input', () => { s[el.dataset.key] = el.value; rebuildFilters(ly); });
  });

  fxEl.querySelectorAll('[data-stype]').forEach(btn => {
    btn.addEventListener('click', () => {
        s.shadow_type = btn.dataset.stype;
      fxEl.querySelectorAll('[data-stype]').forEach(b => b.classList.toggle('sel', b.dataset.stype === s.shadow_type));
      rebuildFilters(ly);
      renderFxShadowSub(ly);
    });
  });

  if (s.shadow_type === 'drop') requestAnimationFrame(() => initFxShPicker(ly));
}

function _shadowSubHtml(s) {
  const mk = (label, key, min, max) => `
    <div class="ef-row"><span class="ef-lbl">${label}</span>
    <div class="ef-sr"><input type="range" data-key="${key}" min="${min}" max="${max}" step="0.01" value="${s[key] ?? 0}">
    <span class="ef-sv" id="efv-${key}">${fmtFx(s[key] ?? 0)}</span></div></div>`;
  if (s.shadow_type === 'outline' || s.shadow_type === 'glow') {
    return mk('Tamanho', 'shadow_size', 0, 1) +
      `<div class="ef-row"><span class="ef-lbl">Cor</span><input type="color" class="ef-clr" data-key="shadow_color" value="${s.shadow_color || '#ffffff'}"></div>`;
  } else if (s.shadow_type === 'drop') {
    return mk('Blur', 'shadow_blur', 0, 50) +
      `<div class="ef-row"><span class="ef-lbl">Cor</span><input type="color" class="ef-clr" data-key="shadow_dcolor" value="${s.shadow_dcolor || '#000000'}"></div>
       <div class="pl" style="margin-top:6px">Posição</div>
       <div class="shpick" id="fxshpick"><div class="shdot" id="fxshdot"></div></div>`;
  }
  return '<div class="ef-note">Nenhum efeito de destaque ativo</div>';
}

function renderFxVignetteColor(s) {
  const r = el2('vc-color-row');
  if (r) r.style.display = s.vignette_c ? '' : 'none';
}

function renderFxShadowSub(ly) {
  const s   = ly.effectState;
  const sub = el2('shadow-sub');
  if (!sub) return;
  sub.innerHTML = _shadowSubHtml(s);
  sub.querySelectorAll('input[type=range][data-key]').forEach(el => {
    el.addEventListener('input', () => {
      s[el.dataset.key] = parseFloat(el.value);
      const sv = document.getElementById('efv-' + el.dataset.key);
      if (sv) sv.textContent = fmtFx(s[el.dataset.key]);
      rebuildFilters(ly);
    });
  });
  sub.querySelectorAll('input[type=color][data-key]').forEach(el => {
    el.addEventListener('input', () => { s[el.dataset.key] = el.value; rebuildFilters(ly); });
  });
  if (s.shadow_type === 'drop') requestAnimationFrame(() => initFxShPicker(ly));
}

function initFxShPicker(ly) {
  const s    = ly.effectState;
  const pick = el2('fxshpick'), dot = el2('fxshdot');
  if (!pick || !dot) return;
  dot.style.left = ((s.shadow_ox ?? 5 + SH_RANGE) / (2 * SH_RANGE) * 100).toFixed(1) + '%';
  dot.style.top  = ((s.shadow_oy ?? 5 + SH_RANGE) / (2 * SH_RANGE) * 100).toFixed(1) + '%';
  let drag = false;
  const mv = e => {
    const r = pick.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const y = Math.max(0, Math.min(1, (e.clientY - r.top)  / r.height));
    dot.style.left = (x * 100) + '%'; dot.style.top = (y * 100) + '%';
    s.shadow_ox = Math.round(x * 2 * SH_RANGE - SH_RANGE);
    s.shadow_oy = Math.round(y * 2 * SH_RANGE - SH_RANGE);
    rebuildFilters(ly);
  };
  pick.onmousedown = e => { drag = true; mv(e); e.preventDefault(); };
  document.addEventListener('mousemove', e => { if (drag) mv(e); });
  document.addEventListener('mouseup',   () => { if (drag) { drag = false; schedHist(); } });
}

function toggleEc(hdr) {
  hdr.classList.toggle('open');
  hdr.nextElementSibling.classList.toggle('open');
}

function fmtFx(v) { return typeof v === 'number' ? v.toFixed(2) : v; }
