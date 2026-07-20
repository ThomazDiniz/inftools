'use strict';
// ═══════════════════════════════════════════════════════
// VIDEO TITLE FIELD + FULL-PAGE YOUTUBE PREVIEW
// ═══════════════════════════════════════════════════════

let _ytView  = 'home';   // 'home' | 'watch' | 'mobile'
let _ytLight = true;     // true = fundo branco (padrão), false = escuro
let _ytThumbUrl  = '';
let _ytNeighbors = [];   // vídeos aleatórios ao redor do seu
const NEIGHBOR_COUNT = 15;

// ─ Dados aleatórios para os vídeos vizinhos ───────────
const RANDOM_TITLES = [
  'EU TESTEI por 30 DIAS e o resultado me CHOCOU',
  'O MAIOR ERRO que você comete SEM PERCEBER',
  'A VERDADE que ninguém te conta sobre isso',
  'Por que TODO MUNDO está falando disso agora?',
  'Comprei o MAIS BARATO vs o MAIS CARO',
  '10 SEGREDOS que mudaram a minha vida',
  'ISSO vai ACABAR em 2026? (URGENTE)',
  'Tentei por 7 dias e olha no que deu...',
  'NUNCA faça ISSO com o seu dinheiro',
  'A RECEITA que viralizou na internet inteira',
  'Ele NÃO esperava por essa reação',
  'Como eu FIZ isso do ZERO em 24 HORAS',
  'O FIM de uma era... chegou a hora do adeus',
  'Reagindo aos MEUS vídeos mais ANTIGOS',
  'Você provavelmente está fazendo TUDO ERRADO',
  'Gastei R$ 10.000 nisso... valeu a pena?',
  'A coisa MAIS ESTRANHA que já me aconteceu',
  'Ninguém acreditou quando eu mostrei ISSO',
  'O SEGREDO que os profissionais escondem',
  'Fiz em CASA e ficou MELHOR que o original',
  'Passei 24h fazendo ISSO sem parar',
  'A DECISÃO que mudou tudo pra sempre',
];

const RANDOM_CHANNELS = [
  'Canal do Pedro', 'Tech Brasil', 'Vida Simples', 'Mundo Curioso',
  'Play Games BR', 'Cozinha Fácil', 'Rotina Real', 'Nerd Total',
  'Foco Total', 'Diário de Bordo', 'Estúdio 22', 'Ana Explica',
  'Prático Já', 'Zoom News', 'Oficina do Zé', 'Manual do Mundo BR',
];
const RANDOM_VIEWS = ['1,2 mi', '342 mil', '89 mil', '23 mil', '1,8 mi', '567 mil', '4,3 mi', '76 mil', '210 mil', '15 mil', '932 mil', '48 mil'];
const RANDOM_AGO   = ['há 3 dias', 'há 1 semana', 'há 2 semanas', 'há 5 horas', 'há 1 mês', 'há 8 meses', 'há 1 dia', 'há 4 dias', 'há 6 meses'];
const RANDOM_DUR   = ['10:24', '8:15', '15:47', '22:03', '5:38', '1:02:14', '12:09', '3:47', '18:52', '7:21', '25:40', '9:03'];

function _rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _sampleN(arr, n) {
  const pool = arr.slice(), out = [];
  for (let i = 0; i < n && pool.length; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

function buildYtNeighbors() {
  const n       = NEIGHBOR_COUNT;
  const files   = (typeof SAMPLE_FILES !== 'undefined') ? _sampleN(SAMPLE_FILES, n) : [];
  const titles  = _sampleN(RANDOM_TITLES, Math.min(n, RANDOM_TITLES.length));
  const chans   = _sampleN(RANDOM_CHANNELS, Math.min(n, RANDOM_CHANNELS.length));
  _ytNeighbors = [];
  for (let i = 0; i < n; i++) {
    _ytNeighbors.push({
      thumb:   files[i] ? 'images/samples/' + encodeURIComponent(files[i]) : '',
      title:   titles[i % titles.length],
      channel: chans[i % chans.length],
      views:   _rand(RANDOM_VIEWS),
      ago:     _rand(RANDOM_AGO),
      dur:     _rand(RANDOM_DUR),
    });
  }
}

function shuffleYtNeighbors() {
  buildYtNeighbors();
  renderYtPreview();
}

// ─ Campo de título ─────────────────────────────────────
function onTitleInput() {
  const inp = document.getElementById('video-title');
  const cnt = document.getElementById('title-count');
  if (!inp || !cnt) return;
  const nn = inp.value.length;
  cnt.textContent = nn;
  cnt.classList.toggle('warn', nn > 60 && nn <= 70);
  cnt.classList.toggle('over', nn > 70);
}

function getVideoTitle() {
  const v = (document.getElementById('video-title')?.value || '').trim();
  return v || 'Título do seu vídeo aparece aqui';
}

// ─ Abrir / fechar prévia ──────────────────────────────
async function openYtPreview() {
  const overlay = document.getElementById('yt-overlay');
  const body    = document.getElementById('yt-modal-body');
  overlay.classList.add('open');
  body.innerHTML = '<div class="yt-empty-note">Gerando prévia…</div>';
  buildYtNeighbors();
  try {
    _ytThumbUrl = await _renderYtThumb();
  } catch (e) {
    console.error(e);
    _ytThumbUrl = '';
  }
  const tb = document.getElementById('yt-theme-btn');
  if (tb) tb.textContent = _ytLight ? '☀️' : '🌙';
  renderYtPreview();
}

function closeYtPreview() {
  document.getElementById('yt-overlay').classList.remove('open');
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
  const app = document.getElementById('yt-app');
  if (app) app.classList.toggle('light', _ytLight);
}

// ─ Renderiza a thumbnail atual (1280×720 limpa) ───────
function _renderYtThumb() {
  const fmt = (typeof FORMATS !== 'undefined' && FORMATS.find(f => f.id === 'youtube'))
    || { id: 'youtube', w: 1280, h: 720 };
  return renderFormat(fmt);
}

// ─ Blocos ─────────────────────────────────────────────
// Objeto virtual do SEU vídeo (sem nenhum destaque visual)
function _me() {
  return {
    thumb:   _ytThumbUrl,
    title:   getVideoTitle(),
    channel: 'Seu Canal',
    views:   '12 mil',
    ago:     'há 2 dias',
    dur:     '10:24',
    subs:    '8,2 mil inscritos',
  };
}

function _thumbHtml(src, dur) {
  const img = src ? `<img src="${src}" alt="">` : `<div class="yt-ghost-fill"></div>`;
  return `<div class="yt-thumb">${img}<span class="yt-dur">${dur || '10:24'}</span></div>`;
}

function _cardHtml(v) {
  return `<div class="yt-card">
    ${_thumbHtml(v.thumb, v.dur)}
    <div class="yt-row">
      <div class="yt-avatar"></div>
      <div class="yt-meta">
        <div class="yt-title">${_esc(v.title)}</div>
        <div class="yt-sub"><span class="yt-ch">${_esc(v.channel)}</span>${_esc(v.views)} de visualizações · ${_esc(v.ago)}</div>
      </div>
    </div>
  </div>`;
}

function _sideItemHtml(v) {
  return `<div class="yt-side-item">
    ${_thumbHtml(v.thumb, v.dur)}
    <div class="yt-side-meta">
      <div class="yt-side-title">${_esc(v.title)}</div>
      <div class="yt-side-sub">${_esc(v.channel)}</div>
      <div class="yt-side-sub">${_esc(v.views)} de visualizações · ${_esc(v.ago)}</div>
    </div>
  </div>`;
}

const CHIPS = ['Tudo', 'Música', 'Jogos', 'Ao vivo', 'Notícias', 'Podcasts', 'Culinária', 'Mixes', 'Recentemente enviados', 'Assistidos'];

function renderYtPreview() {
  const body = document.getElementById('yt-modal-body');
  if (!body) return;
  const app = document.getElementById('yt-app');
  if (app) app.classList.toggle('light', _ytLight);

  const N  = _ytNeighbors;
  const me = _me();
  let html = '';

  if (_ytView === 'home') {
    // seu vídeo misturado entre os outros na página inicial
    const list = N.slice(0, 11);
    list.splice(5, 0, me);           // insere o seu no meio
    const chips = CHIPS.map((c, i) =>
      `<button class="ytx-chip${i === 0 ? ' active' : ''}">${c}</button>`).join('');
    const cards = list.map(_cardHtml).join('');
    html = `<div class="ytx-chips">${chips}</div><div class="ytx-grid">${cards}</div>`;

  } else if (_ytView === 'watch') {
    // página de vídeo: seu thumbnail aparece na lista de recomendados à direita
    const player = N[0];
    const recos  = N.slice(1, 9);
    recos.splice(2, 0, me);          // insere o seu na barra de recomendados
    html = `<div class="ytx-watch">
      <div class="ytx-watch-main">
        <div class="ytx-player">${player.thumb ? `<img src="${player.thumb}" alt="">` : '<div class="yt-ghost-fill"></div>'}<div class="ytx-playbtn"></div></div>
        <div class="ytx-watch-title">${_esc(player.title)}</div>
        <div class="ytx-watch-row">
          <div class="yt-avatar"></div>
          <div>
            <div class="ytx-ch-name">${_esc(player.channel)}</div>
            <div class="ytx-ch-subs">${_rand(RANDOM_VIEWS)} de inscritos</div>
          </div>
          <button class="ytx-sub-btn">Inscrever-se</button>
          <div class="ytx-actions">
            <span class="ytx-act">👍 12 mil</span>
            <span class="ytx-act">↪ Compartilhar</span>
            <span class="ytx-act">⋯</span>
          </div>
        </div>
        <div class="ytx-desc">
          <div class="m">${_esc(player.views)} de visualizações · ${_esc(player.ago)}</div>
          Deixe seu like e se inscreva no canal! Nesse vídeo eu mostro tudo o que você
          precisa saber sobre o assunto. Não esqueça de ativar o sininho 🔔
        </div>
      </div>
      <div class="ytx-watch-side">
        <div class="ytx-side-hdr">Próximos vídeos</div>
        ${recos.map(_sideItemHtml).join('')}
      </div>
    </div>`;

  } else { // mobile
    const list = [me, N[0], N[1], N[2], N[3]];
    const feed = list.map(v => `<div class="yt-mobile">
        ${_thumbHtml(v.thumb, v.dur)}
        <div class="yt-mobile-foot">
          <div class="yt-avatar"></div>
          <div class="yt-meta">
            <div class="yt-mtitle">${_esc(v.title)}</div>
            <div class="yt-msub">${_esc(v.channel)} · ${_esc(v.views)} · ${_esc(v.ago)}</div>
          </div>
          <div class="yt-dots">⋮</div>
        </div>
      </div>`).join('');
    html = `<div class="ytx-mobile-stage"><div class="ytx-phone">
      <div class="ytx-phone-top"><span class="ytx-play">▶</span> YouTube</div>
      <div class="yt-mobile-feed">${feed}</div>
    </div></div>`;
  }

  body.innerHTML = html;
}

function _esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Fechar com Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('yt-overlay')?.classList.contains('open')) {
    closeYtPreview();
  }
});
