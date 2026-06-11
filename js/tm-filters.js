'use strict';
// ═══════════════════════════════════════════════════════
// CUSTOM FABRIC.JS IMAGE FILTERS
// All extend fabric.Image.filters.BaseFilter and implement applyTo2d()
// ═══════════════════════════════════════════════════════

fabric.Image.filters.Vignette = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Vignette', amount: 0.5,
  applyTo2d(o) {
    const d = o.imageData.data, w = o.imageData.width, h = o.imageData.height;
    const cx = w / 2, cy = h / 2, md = Math.sqrt(cx * cx + cy * cy);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const di = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / md;
      const v = 1 - this.amount * di * di;
      d[i] *= v; d[i + 1] *= v; d[i + 2] *= v;
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { amount: this.amount }); },
});
fabric.Image.filters.Vignette.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.VignetteColor = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'VignetteColor', amount: 0.6, color: [0, 0, 0],
  applyTo2d(o) {
    const d = o.imageData.data, w = o.imageData.width, h = o.imageData.height;
    const cx = w / 2, cy = h / 2, md = Math.sqrt(cx * cx + cy * cy);
    const [r, g, b] = this.color;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const di = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / md;
      const t = this.amount * Math.pow(di, 1.6);
      d[i] = d[i] * (1 - t) + r * t;
      d[i + 1] = d[i + 1] * (1 - t) + g * t;
      d[i + 2] = d[i + 2] * (1 - t) + b * t;
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { amount: this.amount, color: this.color }); },
});
fabric.Image.filters.VignetteColor.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.Grain = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Grain', amount: 0.15,
  applyTo2d(o) {
    const d = o.imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * this.amount * 255 * 2;
      d[i]     = Math.min(255, Math.max(0, d[i]     + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { amount: this.amount }); },
});
fabric.Image.filters.Grain.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.Scanlines = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Scanlines', amount: 0.4, spacing: 3,
  applyTo2d(o) {
    const d = o.imageData.data, w = o.imageData.width, h = o.imageData.height;
    for (let y = 0; y < h; y++) {
      if (y % this.spacing !== 0) continue;
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        d[i] *= (1 - this.amount); d[i + 1] *= (1 - this.amount); d[i + 2] *= (1 - this.amount);
      }
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { amount: this.amount, spacing: this.spacing }); },
});
fabric.Image.filters.Scanlines.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.WarmTone = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'WarmTone', amount: 0.4,
  applyTo2d(o) {
    const d = o.imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      d[i]     = Math.min(255, d[i]     + this.amount * 30);
      d[i + 1] = Math.min(255, d[i + 1] + this.amount * 10);
      d[i + 2] = Math.max(0,   d[i + 2] - this.amount * 25);
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { amount: this.amount }); },
});
fabric.Image.filters.WarmTone.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.Posterize = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'Posterize', levels: 4,
  applyTo2d(o) {
    const d = o.imageData.data, step = 255 / this.levels;
    for (let i = 0; i < d.length; i += 4) {
      d[i]     = Math.round(d[i]     / step) * step;
      d[i + 1] = Math.round(d[i + 1] / step) * step;
      d[i + 2] = Math.round(d[i + 2] / step) * step;
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { levels: this.levels }); },
});
fabric.Image.filters.Posterize.fromObject = fabric.Image.filters.BaseFilter.fromObject;

fabric.Image.filters.MotionBlurH = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
  type: 'MotionBlurH', amount: 0.5,
  applyTo2d(o) {
    const src = new Uint8ClampedArray(o.imageData.data);
    const d = o.imageData.data, w = o.imageData.width, h = o.imageData.height;
    const r = Math.round(this.amount * 20);
    if (r < 1) return;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let rr = 0, g = 0, b = 0, cnt = 0;
        for (let dx = -r; dx <= r; dx++) {
          const sx = Math.min(Math.max(x + dx, 0), w - 1);
          const si = (y * w + sx) * 4;
          rr += src[si]; g += src[si + 1]; b += src[si + 2]; cnt++;
        }
        const i = (y * w + x) * 4;
        d[i] = rr / cnt; d[i + 1] = g / cnt; d[i + 2] = b / cnt;
      }
    }
  },
  toObject() { return fabric.util.object.extend(this.callSuper('toObject'), { amount: this.amount }); },
});
fabric.Image.filters.MotionBlurH.fromObject = fabric.Image.filters.BaseFilter.fromObject;
