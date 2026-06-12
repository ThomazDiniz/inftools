'use strict';
// ═══════════════════════════════════════════════════════
// IMAGE LOADING · EFFECTS STATE
// ═══════════════════════════════════════════════════════

// ─ Drop zones & paste ─────────────────────────────────
function initDropZones() {
  const fileInput = el2('file-add');
  fileInput.addEventListener('change', e => {
    Array.from(e.target.files).forEach(f => {
      if (layers.length >= MAX_LAYERS) { toast('Máximo de 3 imagens atingido!'); return; }
      readFile(f, loadImage);
    });
    fileInput.value = '';
  });

  const wrap = el2('canvas-wrap');
  wrap.addEventListener('dragover', e => e.preventDefault());
  wrap.addEventListener('drop', e => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(f => {
      if (!f.type.startsWith('image/')) return;
      if (layers.length >= MAX_LAYERS) { toast('Máximo de 3 imagens atingido!'); return; }
      readFile(f, loadImage);
    });
  });
}

function initPaste() {
  document.addEventListener('paste', async e => {
    const obj = canvas.getActiveObject();
    if (obj && obj.isEditing) return;
    const imgItem = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
    if (!imgItem) return;
    e.preventDefault();
    if (layers.length >= MAX_LAYERS) { toast('Máximo de 3 imagens atingido!'); return; }
    readFile(imgItem.getAsFile(), loadImage);
    toast('Imagem colada!');
  });
}

function readFile(file, cb) {
  const r = new FileReader();
  r.onload = e => cb(e.target.result);
  r.readAsDataURL(file);
}

function loadImage(dataUrl) {
  if (layers.length >= MAX_LAYERS) { toast('Máximo de 3 imagens atingido!'); return; }
  const name = `Camada ${nextId++}`;
  fabric.Image.fromURL(dataUrl, img => {
    const scale = Math.min(DW / img.width, DH / img.height, 1);
    img.set({
      left: DW / 2, top: DH / 2,
      originX: 'center', originY: 'center',
      scaleX: scale, scaleY: scale,
      selectable: true, name: 'layer', crossOrigin: 'anonymous',
    });
    inMod = true; canvas.add(img); inMod = false;

    const ly = { id: nextId, name, obj: img, dataUrl, effectState: defaultFxState(), visible: true };
    layers.unshift(ly);
    rebuildZOrder();
    canvas.setActiveObject(img);
    renderLayerPanel();
    renderPropsPanel();
    switchTab('props');
    saveHist();
    canvas.renderAll();
  }, { crossOrigin: 'anonymous' });
}

// ─ Effect state ───────────────────────────────────────
function defaultFxState() {
  return {
    // Colour adjustments
    blur: 0, sharpen: 0, contrast: 0, saturation: 0, vibrance: 0, brightness: 0,
    bw: false, sepia: false, hdr: 0, pixelate: 0, posterize: 0, extreme_sharpen: false,
    // Overlays
    grain: 0, vignette: 0, vignette_c: false, vc_color: '#ff0000',
    scanlines: 0, warm: 0, crt: false, vhs: false,
    // Destaque (shadow / outline / glow / drop)
    shadow_type: 'none',   // 'none' | 'outline' | 'glow' | 'drop'
    shadow_size: 0, shadow_color: '#ffffff',
    shadow_ox: 5, shadow_oy: 5, shadow_blur: 10, shadow_dcolor: '#000000',
    // Motion
    motion_h: 0, motion_r: 0,
  };
}

// ─ Rebuild Fabric filter chain ─────────────────────────
function rebuildFilters(ly) {
  const img = ly.obj;
  if (!img || img.type !== 'image') return;
  const s = ly.effectState;
  const F = [];

  if (s.brightness !== 0) F.push(new fabric.Image.filters.Brightness({ brightness: s.brightness }));
  if (s.contrast   !== 0) F.push(new fabric.Image.filters.Contrast({ contrast: s.contrast }));
  if (s.saturation !== 0) F.push(new fabric.Image.filters.Saturation({ saturation: s.saturation }));
  if (s.vibrance   !== 0 && fabric.Image.filters.Vibrance)
    F.push(new fabric.Image.filters.Vibrance({ vibrance: s.vibrance }));

  // HDR = contrast + saturation + slight brightness dip
  if (s.hdr > 0) {
    F.push(new fabric.Image.filters.Contrast({ contrast: s.hdr * 0.6 }));
    F.push(new fabric.Image.filters.Saturation({ saturation: s.hdr * 0.8 }));
    F.push(new fabric.Image.filters.Brightness({ brightness: -s.hdr * 0.08 }));
  }

  if (s.bw)    F.push(new fabric.Image.filters.Grayscale());
  if (s.sepia) F.push(new fabric.Image.filters.Sepia());
  if (s.warm > 0 && !s.bw) F.push(new fabric.Image.filters.WarmTone({ amount: s.warm }));

  if (s.blur > 0) F.push(new fabric.Image.filters.Blur({ blur: s.blur * 0.5 }));

  if (s.sharpen > 0 && !s.extreme_sharpen) {
    const v = s.sharpen * 3;
    F.push(new fabric.Image.filters.Convolute({ matrix: [0, -v, 0, -v, 1 + 4 * v, -v, 0, -v, 0] }));
  }
  if (s.extreme_sharpen) {
    F.push(new fabric.Image.filters.Convolute({ matrix: [-1, -2, -1, -2, 16, -2, -1, -2, -1] }));
  }

  if (s.motion_h > 0) F.push(new fabric.Image.filters.MotionBlurH({ amount: s.motion_h }));
  if (s.pixelate > 0) F.push(new fabric.Image.filters.Pixelate({ blocksize: Math.round(s.pixelate * 25) + 2 }));
  if (s.posterize > 0) F.push(new fabric.Image.filters.Posterize({ levels: Math.round((1 - s.posterize) * 5) + 2 }));
  if (s.grain > 0) F.push(new fabric.Image.filters.Grain({ amount: s.grain * 0.3 }));

  if (s.vignette > 0) {
    if (s.vignette_c) {
      const c = hexToRgb(s.vc_color || '#ff0000');
      F.push(new fabric.Image.filters.VignetteColor({ amount: s.vignette, color: c }));
    } else {
      F.push(new fabric.Image.filters.Vignette({ amount: s.vignette }));
    }
  }

  if (s.scanlines > 0) F.push(new fabric.Image.filters.Scanlines({ amount: s.scanlines * 0.7, spacing: 3 }));

  // CRT preset
  if (s.crt) {
    F.push(new fabric.Image.filters.Scanlines({ amount: 0.35, spacing: 2 }));
    F.push(new fabric.Image.filters.Grain({ amount: 0.05 }));
    F.push(new fabric.Image.filters.Saturation({ saturation: -0.2 }));
  }
  // VHS preset
  if (s.vhs) {
    F.push(new fabric.Image.filters.Grain({ amount: 0.12 }));
    F.push(new fabric.Image.filters.Saturation({ saturation: -0.35 }));
    F.push(new fabric.Image.filters.Contrast({ contrast: 0.15 }));
    F.push(new fabric.Image.filters.Scanlines({ amount: 0.2, spacing: 4 }));
  }

  img.filters = F;
  img.applyFilters();

  // Character highlight shadows
  if (s.shadow_type === 'outline' && s.shadow_size > 0) {
    img.set('shadow', new fabric.Shadow({ color: s.shadow_color, blur: s.shadow_size * 25, offsetX: 0, offsetY: 0 }));
  } else if (s.shadow_type === 'glow' && s.shadow_size > 0) {
    img.set('shadow', new fabric.Shadow({ color: s.shadow_color, blur: s.shadow_size * 40, offsetX: 0, offsetY: 0 }));
  } else if (s.shadow_type === 'drop') {
    img.set('shadow', new fabric.Shadow({ color: s.shadow_dcolor, blur: s.shadow_blur, offsetX: s.shadow_ox, offsetY: s.shadow_oy }));
  } else {
    img.set('shadow', null);
  }

  canvas.renderAll();
}

