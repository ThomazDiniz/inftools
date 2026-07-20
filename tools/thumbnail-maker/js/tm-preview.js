'use strict';
// ═══════════════════════════════════════════════════════
// VIDEO TITLE FIELD + FULL-PAGE YOUTUBE PREVIEW
// ═══════════════════════════════════════════════════════

let _ytView  = 'home';   // 'home' | 'watch' | 'mobile'
let _ytLight = true;     // true = fundo branco (padrão), false = escuro
let _ytThumbUrl  = '';
let _ytNeighbors = [];   // vídeos aleatórios ao redor do seu
let _ytPos = { home: 5, watch: 2, mobile: 0 };  // posição (aleatória) do seu vídeo em cada tela
const NEIGHBOR_COUNT = 15;

// ─ Dados de títulos ───────────────────────────────────
// Títulos genéricos que despertam curiosidade — categoria "geral".
const CURATED_GERAL = [
  // Testes / experimentos
  'EU TESTEI por 30 DIAS e o resultado me CHOCOU',
  'Testei ISSO por 1 SEMANA e não esperava o final',
  'Passei 24 HORAS fazendo isso SEM PARAR',
  'Fiz ISSO todo dia por 1 MÊS — olha no que deu',
  'Tentei por 7 dias e o resultado foi SURREAL',
  'Testei o MÉTODO que TODO MUNDO recomenda (funciona?)',
  'Deixei os EXPERTS decidirem por mim durante 1 dia',
  'Segui esse RITUAL por 21 dias e mudou TUDO',
  'Vivi como RICO por 24 horas com R$ 50',
  'Troquei ISSO por AQUILO durante uma semana inteira',
  // Erros / avisos
  'O MAIOR ERRO que você comete SEM PERCEBER',
  'PARE de fazer ISSO agora mesmo',
  'NUNCA faça ISSO com o seu dinheiro',
  'Você provavelmente está fazendo TUDO ERRADO',
  '5 ERROS que estão te sabotando (e você nem sabe)',
  'Se você faz ISSO, PRECISA parar hoje',
  'O erro que 90% das pessoas cometem TODO DIA',
  'Isso pode estar ARRUINANDO seus resultados',
  'Ninguém te avisou sobre ISSO... até agora',
  'CUIDADO: quase ninguém percebe esse detalhe',
  // Verdade / segredos
  'A VERDADE que ninguém te conta sobre isso',
  'O SEGREDO que os profissionais ESCONDEM',
  'Descobri o que ninguém queria que eu soubesse',
  'A REAL por trás disso vai te SURPREENDER',
  'O que NINGUÉM te fala sobre esse assunto',
  'Eles não queriam que esse vídeo existisse',
  'O lado ESCONDIDO que quase ninguém conhece',
  'A verdade INCONVENIENTE sobre tudo isso',
  'O que acontece nos BASTIDORES (chocante)',
  'Revelando o SEGREDO que mudou o jogo',
  // Perguntas / curiosidade
  'Por que TODO MUNDO está falando disso agora?',
  'Por que ninguém faz ISSO ainda?',
  'O que acontece quando você faz ISSO?',
  'Será que VALE A PENA mesmo? (a verdade)',
  'Isso vai FUNCIONAR? Eu descobri na prática',
  'Você sabia DISSO? Aposto que não',
  'E se eu te dissesse que estava TUDO errado?',
  'Como isso é possível?! Eu fiquei chocado',
  'O que tem DENTRO disso vai te assustar',
  'Por que isso está DESAPARECENDO?',
  // Números / listas
  '10 SEGREDOS que mudaram a minha vida',
  '7 COISAS que eu queria saber ANTES',
  '5 truques SIMPLES que fazem TODA diferença',
  '3 SINAIS de que você está no caminho errado',
  '9 HÁBITOS que estão te segurando',
  '6 coisas que NINGUÉM te ensina',
  '4 erros que quase acabaram comigo',
  '15 minutos que vão MUDAR o seu dia',
  '8 verdades que demorei ANOS pra entender',
  '20 dicas em 10 minutos (salve esse vídeo)',
  // Comparações / versus
  'Comprei o MAIS BARATO vs o MAIS CARO',
  'BARATO x CARO: será que compensa?',
  'O ORIGINAL vs a IMITAÇÃO (surpreendente)',
  'Antes x DEPOIS: a transformação COMPLETA',
  'O melhor vs o PIOR — o resultado surpreende',
  'Fiz em CASA e ficou MELHOR que o comprado',
  'R$ 10 vs R$ 1.000 — dá pra notar a diferença?',
  'Novo vs USADO: qual realmente vale a pena?',
  'O jeito FÁCIL vs o jeito CERTO',
  'Testei os dois pra você não errar',
  // Transformação / história pessoal
  'Como eu FIZ isso do ZERO em 24 HORAS',
  'A DECISÃO que mudou tudo pra sempre',
  'De ZERO ao TOPO em tempo recorde',
  'Isso mudou COMPLETAMENTE a minha rotina',
  'A coisa MAIS ESTRANHA que já me aconteceu',
  'Ninguém acreditou quando eu mostrei ISSO',
  'Eu não esperava por essa REVIRAVOLTA',
  'O dia em que TUDO deu errado (e deu certo)',
  'Como saí do ZERO sem gastar quase nada',
  'A transformação que ninguém viu chegando',
  // Dinheiro / valor
  'Gastei R$ 10.000 nisso... valeu a pena?',
  'Quanto CUSTA de verdade? A conta CHOCOU',
  'Ganhei dinheiro fazendo ISSO (passo a passo)',
  'O investimento que TODO MUNDO ignora',
  'Fiz isso de GRAÇA e economizei uma FORTUNA',
  'O erro que me custou CARO demais',
  'Como economizar sem PERCEBER que economizou',
  'Isso paga por si só em POUCOS dias',
  // Urgência / novidade
  'ISSO vai ACABAR em 2026? (URGENTE)',
  'A novidade que ninguém está vendo AINDA',
  'Corre porque isso vai MUDAR tudo',
  'O FIM de uma era... chegou a hora do adeus',
  'Aconteceu o que ninguém esperava',
  'Isso mudou da noite pro dia (e você nem viu)',
  'A tendência que vai DOMINAR este ano',
  // Reações / desafios
  'Reagindo aos MEUS vídeos mais ANTIGOS',
  'Aceitei o desafio IMPOSSÍVEL (spoiler: caos)',
  'Deixei um ESTRANHO escolher por mim',
  'Tentando fazer isso com OS OLHOS FECHADOS',
  'Fiz o que me disseram pra NUNCA fazer',
  'A internet me DESAFIOU e eu aceitei',
  'Coloquei à prova a teoria mais LOUCA',
  'Recriando o VIRAL que travou a internet',
  // Genéricos fortes
  'Isso é BOM DEMAIS pra ser verdade?',
  'Você NUNCA mais vai ver isso do mesmo jeito',
  'Prepare-se: isso vai te SURPREENDER',
  'O vídeo que eu queria ter visto ANTES',
  'Assista até o FINAL (não acredita no que vem)',
  'A coisa mais útil que você vai ver hoje',
  'Simples assim? Eu também não acreditei',
  'Guarde esse vídeo, você vai PRECISAR dele',
];

// ── Categorias ─────────────────────────────────────────
const TITLE_CATS = [
  { id:'geral',     label:'Genérico',    emoji:'✨' },
  { id:'fitness',   label:'Fitness',     emoji:'💪' },
  { id:'prog',      label:'Programação', emoji:'💻' },
  { id:'gaming',    label:'Gaming',      emoji:'🎮' },
  { id:'culinaria', label:'Culinária',   emoji:'🍳' },
  { id:'financas',  label:'Finanças',    emoji:'💰' },
  { id:'beleza',    label:'Beleza',      emoji:'💄' },
  { id:'tech',      label:'Tecnologia',  emoji:'📱' },
  { id:'estudos',   label:'Estudos',     emoji:'📚' },
  { id:'negocios',  label:'Negócios',    emoji:'📈' },
  { id:'viagem',    label:'Viagem',      emoji:'✈️' },
  { id:'auto',      label:'Carros',      emoji:'🚗' },
  { id:'diy',       label:'Casa & DIY',  emoji:'🔨' },
];

// Tópico (assunto) de cada nicho — usado pra gerar os títulos
const TITLE_TOPICS = {
  geral:     ['produtividade','disciplina','motivação','foco','organização','hábitos','autoconfiança','mentalidade','rotina matinal','gestão do tempo'],
  fitness:   ['treino de pernas','hipertrofia','dieta cutting','jejum intermitente','ganho de massa','perda de gordura','treino em casa','creatina','abdômen definido','cardio','mobilidade','treino de peito'],
  prog:      ['Python','React','JavaScript','SQL','Docker','Git','algoritmos','carreira dev','entrevista técnica','clean code','APIs REST','banco de dados'],
  gaming:    ['Elden Ring','Valorant','Minecraft','GTA','League of Legends','CS2','Fortnite','builds secretas','a ranqueada','speedrun','setup gamer','mira no FPS'],
  culinaria: ['bolo de cenoura','pão caseiro','massa fresca','frango suculento','marmita fit','café especial','churrasco','arroz soltinho','ovos perfeitos','pizza caseira','sobremesa fácil'],
  financas:  ['investir do zero','renda fixa','ações','dividendos','sair das dívidas','reserva de emergência','Tesouro Direto','fundos imobiliários','juros compostos','economizar dinheiro','cartão de crédito','planejamento financeiro'],
  beleza:    ['skincare','maquiagem natural','cabelo saudável','pele oleosa','protetor solar','automaquiagem','cuidados com a barba','rotina noturna','unhas'],
  tech:      ['iPhone','celular Android','notebook barato','fones bluetooth','setup de trabalho','câmera do celular','bateria do celular','apps essenciais','privacidade online','casa inteligente'],
  estudos:   ['passar no vestibular','o ENEM','estudar sozinho','memorização','concurso público','cronograma de estudos','foco nos estudos','fazer resumos','produtividade acadêmica'],
  negocios:  ['começar um negócio','vender mais','marketing digital','tráfego pago','o primeiro cliente','gestão de tempo','precificação','networking','empreender do zero'],
  viagem:    ['viajar barato','mochilão','passagem promocional','mala de mão','roteiro perfeito','viagem internacional','hospedagem barata'],
  auto:      ['carro usado','economizar combustível','revisão do carro','carro elétrico','manutenção básica','o primeiro carro','cuidar dos pneus'],
  diy:       ['organizar a casa','decorar gastando pouco','reforma barata','plantas em casa','reparos simples','marcenaria'],
};

// Moldes de título que incitam curiosidade ({x} = tópico)
const TITLE_TEMPLATES = [
  'a VERDADE sobre {x} que ninguém te conta',
  'eu testei {x} por 30 DIAS — o resultado me CHOCOU',
  'o MAIOR ERRO de quem começa com {x}',
  'por que TODO MUNDO está errado sobre {x}?',
  '{x}: o que ninguém te ensina no início',
  '5 SEGREDOS de {x} que mudaram tudo',
  'NUNCA faça ISSO com {x}',
  'como dominar {x} partindo do ZERO',
  'passei 7 dias focado SÓ em {x}',
  'isso vai MUDAR como você vê {x}',
  'o SEGREDO por trás de {x} que poucos conhecem',
  '{x} em 10 minutos: o guia DEFINITIVO',
  'fiz {x} do jeito ERRADO por ANOS',
  'a tendência de {x} que vai EXPLODIR em 2026',
  'parei de errar em {x} quando descobri ISSO',
  '7 coisas sobre {x} que eu queria saber ANTES',
  'ninguém te conta a REAL sobre {x}',
  '{x} do jeito CERTO (a maioria erra feio)',
];

function _capFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function _catLabel(id) { const c = TITLE_CATS.find(c => c.id === id); return c ? c.label : id; }
function _catEmoji(id) { const c = TITLE_CATS.find(c => c.id === id); return c ? c.emoji : ''; }

// Gera TODOS os títulos: curados (geral) + combinações por categoria
const TITLES = (function () {
  const out = CURATED_GERAL.map(t => ({ t, cat: 'geral' }));
  Object.keys(TITLE_TOPICS).forEach(cat => {
    TITLE_TOPICS[cat].forEach(topic => {
      TITLE_TEMPLATES.forEach(tpl => {
        out.push({ t: _capFirst(tpl.replace(/\{x\}/g, topic)), cat });
      });
    });
  });
  return out;
})();

// Lista plana (usada pelos vídeos vizinhos do preview e pela sugestão)
const RANDOM_TITLES = TITLES.map(x => x.t);

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
  // posição aleatória do SEU vídeo em cada tela
  _ytPos = {
    home:   Math.floor(Math.random() * 12),  // 0..11 (12 cards)
    watch:  Math.floor(Math.random() * 9),   // 0..8  (9 recomendados)
    mobile: Math.floor(Math.random() * 5),   // 0..4  (5 no feed)
  };
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

function _toast(msg) {
  if (typeof toast === 'function') toast(msg);
}

// ─ Sugerir nome de vídeo ──────────────────────────────
// Se houver um filtro de categoria ativo na lista, respeita ele.
function suggestVideoName() {
  const inp = document.getElementById('video-title');
  if (!inp) return;
  const pool = (_tlFilter === 'all') ? TITLES : TITLES.filter(x => x.cat === _tlFilter);
  let item = _rand(pool);
  for (let i = 0; i < 6 && item.t === inp.value; i++) item = _rand(pool);
  inp.value = item.t;
  onTitleInput();
  _toast(`💡 ${_catEmoji(item.cat)} ${_catLabel(item.cat)}: título sugerido`);
}

// ─ Lista completa de títulos (com filtro por categoria) ─
let _tlFilter = 'all';

function openTitlesList() {
  const ov = document.getElementById('tl-overlay');
  if (!ov) return;
  renderTlFilters();
  renderTlList();
  ov.classList.add('open');
}

function renderTlFilters() {
  const wrap = document.getElementById('tl-filters');
  if (!wrap) return;
  let chips = `<button class="tl-chip${_tlFilter === 'all' ? ' active' : ''}" onclick="setTlFilter('all')">Todos <span class="tl-chip-n">${TITLES.length}</span></button>`;
  chips += TITLE_CATS.map(c => {
    const n = TITLES.filter(x => x.cat === c.id).length;
    return `<button class="tl-chip${_tlFilter === c.id ? ' active' : ''}" onclick="setTlFilter('${c.id}')">${c.emoji} ${c.label} <span class="tl-chip-n">${n}</span></button>`;
  }).join('');
  wrap.innerHTML = chips;
}

function setTlFilter(cat) {
  _tlFilter = cat;
  renderTlFilters();
  renderTlList();
}

function renderTlList() {
  const list = document.getElementById('tl-list');
  if (!list) return;
  const items = (_tlFilter === 'all') ? TITLES : TITLES.filter(x => x.cat === _tlFilter);
  const cnt = document.getElementById('tl-count');
  if (cnt) cnt.textContent = items.length;
  // ondblclick usa o título; o botão "Usar" (clique único) também usa
  list.innerHTML = items.map(x => {
    const t = _esc(x.t);
    return `<div class="tl-item" title="Clique 2x para usar" data-t="${t}"
        onclick="tlSelect(this)" ondblclick="useTitle(this.dataset.t)">
        <span class="tl-item-txt">${t}</span>
        ${_tlFilter === 'all' ? `<span class="tl-item-cat">${_catEmoji(x.cat)}</span>` : ''}
        <button class="tl-item-use" onclick="event.stopPropagation();useTitle(this.parentNode.dataset.t)">Usar</button>
      </div>`;
  }).join('');
}

function tlSelect(el) {
  document.querySelectorAll('.tl-item.sel').forEach(e => e.classList.remove('sel'));
  el.classList.add('sel');
}

function closeTitlesList() {
  document.getElementById('tl-overlay')?.classList.remove('open');
}

function tlBackdropClick(e) {
  if (e.target === document.getElementById('tl-overlay')) closeTitlesList();
}

function useTitle(t) {
  const inp = document.getElementById('video-title');
  if (inp) { inp.value = t; onTitleInput(); }
  closeTitlesList();
  _toast('✅ Título aplicado');
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
    list.splice(_ytPos.home, 0, me);           // posição aleatória
    const chips = CHIPS.map((c, i) =>
      `<button class="ytx-chip${i === 0 ? ' active' : ''}">${c}</button>`).join('');
    const cards = list.map(_cardHtml).join('');
    html = `<div class="ytx-chips">${chips}</div><div class="ytx-grid">${cards}</div>`;

  } else if (_ytView === 'watch') {
    // página de vídeo: seu thumbnail aparece na lista de recomendados à direita
    const player = N[0];
    const recos  = N.slice(1, 9);
    recos.splice(_ytPos.watch, 0, me);          // posição aleatória na barra de recomendados
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
    const list = [N[0], N[1], N[2], N[3]];
    list.splice(_ytPos.mobile, 0, me);          // posição aleatória no feed
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
  if (e.key !== 'Escape') return;
  if (document.getElementById('tl-overlay')?.classList.contains('open')) { closeTitlesList(); return; }
  if (document.getElementById('yt-overlay')?.classList.contains('open')) { closeYtPreview(); }
});
