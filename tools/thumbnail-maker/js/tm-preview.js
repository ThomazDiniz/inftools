'use strict';
// ═══════════════════════════════════════════════════════
// VIDEO TITLE FIELD + YOUTUBE PREVIEW
// ═══════════════════════════════════════════════════════

let _ytView  = 'home';   // 'home' | 'sidebar' | 'mobile'
let _ytLight = false;    // false = dark (YouTube default), true = light

// ─ Title input ────────────────────────────────────────
function onTitleInput() {
  const inp = document.getElementById('video-title');
  const cnt = document.getElementById('title-count');
  if (!inp || !cnt) return;
  const n = inp.value.length;
  cnt.textContent = n;
  // YouTube truncates most titles around ~60 chars in feeds
  cnt.classList.toggle('warn', n > 60 && n <= 70);
  cnt.classList.toggle('over', n > 70);
}

function getVideoTitle() {
  const v = (document.getElementById('video-title')?.value || '').trim();
  return v || 'Título do seu vídeo aparece aqui';
}

// ─ Preview open / close ───────────────────────────────
async function openYtPreview() {
  const overlay = document.getElementById('yt-overlay');
  const body    = document.getElementById('yt-modal-body');
  overlay.classList.add('open');
  body.innerHTML = '<div class="yt-empty-note">Gerando prévia…</div>';
  try {
    _ytThumbUrl = await _renderYtThumb();
  } catch (e) {
    console.error(e);
    _ytThumbUrl = '';
  }
  renderYtPreview();
}

function closeYtPreview() {
  document.getElementById('yt-overlay').classList.remove('open');
}

function ytBackdropClick(e) {
  if (e.target === document.getElementById('yt-overlay')) closeYtPreview();
}

function setYtView(v) {
  _ytView = v;
  document.querySelectorAll('#yt-view-seg .yt-seg-btn')
    .forEach(b => b.classList.toggle('active', b.dataset.view === v));
  renderYtPreview();
}

function toggleYtTheme() {
  _ytLight = !_ytLight;
  document.getElementById('yt-theme-btn').textContent = _ytLight ? '☀️' : '🌙';
  renderYtPreview();
}

// ─ Render current thumbnail as a clean 1280×720 PNG ───
let _ytThumbUrl = '';
function _renderYtThumb() {
  const fmt = (typeof FORMATS !== 'undefined' && FORMATS.find(f => f.id === 'youtube'))
    || { id: 'youtube', w: 1280, h: 720 };
  return renderFormat(fmt);
}

// ─ Preview HTML builders ──────────────────────────────
function _thumbHtml(dur) {
  const img = _ytThumbUrl
    ? `<img src="${_ytThumbUrl}" alt="thumbnail">`
    : `<div class="yt-ghost-fill"></div>`;
  return `<div class="yt-thumb">${img}<span class="yt-dur">${dur || '10:24'}</span></div>`;
}

function _ghostCardHtml() {
  return `<div class="yt-card ghost">
    <div class="yt-thumb"><div class="yt-ghost-fill"></div></div>
    <div class="yt-row">
      <div class="yt-avatar"></div>
      <div class="yt-meta">
        <div class="yt-ghost-line" style="width:90%"></div>
        <div class="yt-ghost-line" style="width:55%"></div>
      </div>
    </div>
  </div>`;
}

function _ghostSideHtml() {
  return `<div class="yt-side-item ghost">
    <div class="yt-thumb"><div class="yt-ghost-fill"></div></div>
    <div class="yt-side-meta">
      <div class="yt-ghost-line" style="width:95%"></div>
      <div class="yt-ghost-line" style="width:70%"></div>
      <div class="yt-ghost-line" style="width:45%"></div>
    </div>
  </div>`;
}

function renderYtPreview() {
  const body = document.getElementById('yt-modal-body');
  if (!body) return;
  body.classList.toggle('light', _ytLight);

  const title = _esc(getVideoTitle());
  const chan  = 'Seu Canal';
  const views = '12 mil visualizações';
  const ago   = 'há 2 dias';
  let html = '';

  if (_ytView === 'home') {
    const card = `<div class="yt-card target">
      ${_thumbHtml()}
      <div class="yt-row">
        <div class="yt-avatar"></div>
        <div class="yt-meta">
          <div class="yt-title">${title}</div>
          <div class="yt-sub"><span class="yt-ch">${chan}</span>${views} · ${ago}</div>
        </div>
      </div>
    </div>`;
    html = `<div class="yt-home">${card}${_ghostCardHtml()}${_ghostCardHtml()}${_ghostCardHtml()}</div>`;

  } else if (_ytView === 'sidebar') {
    const item = `<div class="yt-side-item target">
      ${_thumbHtml()}
      <div class="yt-side-meta">
        <div class="yt-side-title">${title}</div>
        <div class="yt-side-sub">${chan}</div>
        <div class="yt-side-sub">${views} · ${ago}</div>
      </div>
    </div>`;
    html = `<div class="yt-sidebar">${_ghostSideHtml()}${item}${_ghostSideHtml()}${_ghostSideHtml()}</div>`;

  } else { // mobile
    html = `<div class="yt-mobile">
      ${_thumbHtml()}
      <div class="yt-mobile-foot">
        <div class="yt-avatar"></div>
        <div class="yt-meta">
          <div class="yt-mtitle">${title}</div>
          <div class="yt-msub">${chan} · ${views} · ${ago}</div>
        </div>
        <div class="yt-dots">⋮</div>
      </div>
    </div>`;
  }

  body.innerHTML = html;
}

function _esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('yt-overlay')?.classList.contains('open')) {
    closeYtPreview();
  }
});
