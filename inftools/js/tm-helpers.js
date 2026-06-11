'use strict';
// ═══════════════════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════════════════

function el2(id) { return document.getElementById(id); }

function bindInput(id, fn) {
  const el = el2(id);
  if (el) el.addEventListener('input', () => fn(el));
}

/** Converts any CSS color string to #rrggbb hex */
function toHex(c) {
  if (!c) return '#000000';
  if (c.startsWith('#')) return c;
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return '#000000';
  return '#' + [m[1], m[2], m[3]].map(n => (+n).toString(16).padStart(2, '0')).join('');
}

function hexToRgb(h) {
  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return [r, g, b];
}

function duToBlob(du) {
  const [h, b] = du.split(',');
  const mime = h.match(/:(.*?);/)[1];
  const bin = atob(b);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function blobToDu(b) {
  return new Promise((r, j) => {
    const fr = new FileReader();
    fr.onload = e => r(e.target.result);
    fr.onerror = j;
    fr.readAsDataURL(b);
  });
}

let _toastTimer;
function toast(msg, ms = 3200) {
  const t = el2('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

function showLoad(msg) {
  el2('lov-txt').textContent = msg;
  el2('lov').classList.add('on');
}

function hideLoad() {
  el2('lov').classList.remove('on');
}
