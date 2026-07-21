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

// ─ Dados de títulos (PT-BR + EN) ──────────────────────
// Títulos PT genéricos que despertam curiosidade — categoria "geral".
const CURATED_GERAL_PT = [
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

// ── Categorias (rótulos por idioma) ────────────────────
const TITLE_CATS = [
  { id:'geral',     pt:'Genérico',    en:'Generic',     emoji:'✨' },
  { id:'fitness',   pt:'Fitness',     en:'Fitness',     emoji:'💪' },
  { id:'prog',      pt:'Programação', en:'Programming', emoji:'💻' },
  { id:'gaming',    pt:'Gaming',      en:'Gaming',      emoji:'🎮' },
  { id:'culinaria', pt:'Culinária',   en:'Cooking',     emoji:'🍳' },
  { id:'financas',  pt:'Finanças',    en:'Finance',     emoji:'💰' },
  { id:'beleza',    pt:'Beleza',      en:'Beauty',      emoji:'💄' },
  { id:'tech',      pt:'Tecnologia',  en:'Tech',        emoji:'📱' },
  { id:'estudos',   pt:'Estudos',     en:'Study',       emoji:'📚' },
  { id:'negocios',  pt:'Negócios',    en:'Business',    emoji:'📈' },
  { id:'viagem',    pt:'Viagem',      en:'Travel',      emoji:'✈️' },
  { id:'auto',      pt:'Carros',      en:'Cars',        emoji:'🚗' },
  { id:'diy',       pt:'Casa & DIY',  en:'Home & DIY',  emoji:'🔨' },
];

// ── PT: tópicos e moldes ───────────────────────────────
const TITLE_TOPICS_PT = {
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

const TITLE_TEMPLATES_PT = [
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

// ── EN: título curado, tópicos e moldes (nativo, não tradução) ──
const CURATED_GERAL_EN = [
  'I TRIED it for 30 DAYS and the result SHOCKED me',
  'the BIGGEST mistake you make WITHOUT realizing it',
  'the TRUTH nobody tells you about this',
  'why is EVERYONE talking about this right now?',
  'I bought the CHEAPEST vs the MOST EXPENSIVE',
  '10 SECRETS that changed my life',
  'is this ENDING in 2026? (URGENT)',
  'I tried it for 7 days and WOW...',
  'NEVER do THIS with your money',
  'the recipe that went VIRAL everywhere',
  'he did NOT expect that reaction',
  'how I did it from ZERO in 24 HOURS',
  'the END of an era... time to say goodbye',
  'reacting to my OLDEST videos',
  'you are probably doing it ALL WRONG',
  'I spent $10,000 on this... was it worth it?',
  'the STRANGEST thing that ever happened to me',
  'nobody believed me until I showed THIS',
  'the SECRET the pros are hiding',
  'I made it at HOME and it beat the original',
  'I spent 24h doing this NON-STOP',
  'the DECISION that changed everything',
  'STOP doing this right now',
  '5 MISTAKES that are secretly sabotaging you',
  'the thing NOBODY warns you about',
  'watch until the END (you won\'t believe it)',
  'save this video — you WILL need it',
  'this is TOO GOOD to be true?',
  'the video I WISH I had seen sooner',
  'I did what they told me to NEVER do',
  'the trend that will DOMINATE this year',
  'what happens when you actually try THIS',
  'the most useful thing you\'ll see today',
  'I let a STRANGER decide for me',
  'this changed how I see EVERYTHING',
  '7 things I WISH I knew before',
  'the hidden side almost nobody knows',
  'they didn\'t want this video to exist',
  'how is this even POSSIBLE?!',
  'simple as that? I didn\'t believe it either',
];

const TITLE_TOPICS_EN = {
  geral:     ['productivity','discipline','motivation','focus','organization','habits','confidence','your mindset','a morning routine','time management'],
  fitness:   ['leg day','muscle growth','a cutting diet','intermittent fasting','building mass','fat loss','home workouts','creatine','abs','cardio','mobility','chest day'],
  prog:      ['Python','React','JavaScript','SQL','Docker','Git','algorithms','a dev career','coding interviews','clean code','REST APIs','databases'],
  gaming:    ['Elden Ring','Valorant','Minecraft','GTA','League of Legends','CS2','Fortnite','secret builds','ranked','speedruns','a gaming setup','FPS aim'],
  culinaria: ['carrot cake','homemade bread','fresh pasta','juicy chicken','meal prep','specialty coffee','BBQ','fluffy rice','perfect eggs','homemade pizza','easy desserts'],
  financas:  ['investing from zero','fixed income','stocks','dividends','getting out of debt','an emergency fund','index funds','REITs','compound interest','saving money','credit cards','financial planning'],
  beleza:    ['skincare','natural makeup','healthy hair','oily skin','sunscreen','doing your own makeup','beard care','a night routine','your nails'],
  tech:      ['the iPhone','Android phones','a cheap laptop','bluetooth earbuds','a work setup','phone cameras','phone battery','must-have apps','online privacy','a smart home'],
  estudos:   ['acing exams','the SAT','studying alone','memorization','standardized tests','a study schedule','study focus','taking notes','academic productivity'],
  negocios:  ['starting a business','selling more','digital marketing','paid ads','your first client','time management','pricing','networking','building from zero'],
  viagem:    ['traveling cheap','backpacking','cheap flights','carry-on packing','the perfect itinerary','international travel','cheap lodging'],
  auto:      ['a used car','saving fuel','car maintenance','an electric car','basic upkeep','your first car','tire care'],
  diy:       ['organizing your home','decorating on a budget','a cheap renovation','indoor plants','simple repairs','woodworking'],
};

const TITLE_TEMPLATES_EN = [
  'the TRUTH about {x} nobody tells you',
  'I tried {x} for 30 DAYS and the result SHOCKED me',
  'the BIGGEST mistake beginners make with {x}',
  'why EVERYONE is wrong about {x}',
  '{x}: what nobody teaches you at first',
  '5 {x} SECRETS that changed everything',
  'NEVER do THIS with {x}',
  'how to master {x} from ZERO',
  'I spent 7 days ONLY on {x}',
  'this will CHANGE how you see {x}',
  'the SECRET behind {x} few people know',
  '{x} in 10 minutes: the ULTIMATE guide',
  'I did {x} the WRONG way for YEARS',
  'the {x} trend about to BLOW UP in 2026',
  'I stopped failing at {x} when I found THIS',
  '7 things about {x} I WISH I knew sooner',
  'nobody tells you the REAL truth about {x}',
  '{x} done RIGHT (most people get it wrong)',
];

function _capFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Gera os títulos de um idioma: curados (geral) + combinações por categoria
function _buildTitles(curated, topics, tpls) {
  const out = curated.map(t => ({ t: _capFirst(t), cat: 'geral' }));
  Object.keys(topics).forEach(cat => {
    topics[cat].forEach(topic => {
      tpls.forEach(tpl => out.push({ t: _capFirst(tpl.replace(/\{x\}/g, topic)), cat }));
    });
  });
  return out;
}

const TITLES_PT = _buildTitles(CURATED_GERAL_PT, TITLE_TOPICS_PT, TITLE_TEMPLATES_PT);
const TITLES_EN = _buildTitles(CURATED_GERAL_EN, TITLE_TOPICS_EN, TITLE_TEMPLATES_EN);

// Idioma ativo dos títulos
let _titleLang = 'pt';
function activeTitles() { return _titleLang === 'en' ? TITLES_EN : TITLES_PT; }
function _catLabel(id) { const c = TITLE_CATS.find(c => c.id === id); return c ? c[_titleLang] : id; }
function _catEmoji(id) { const c = TITLE_CATS.find(c => c.id === id); return c ? c.emoji : ''; }

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
  const pool    = activeTitles().map(x => x.t);
  const titles  = _sampleN(pool, Math.min(n, pool.length));
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

// ─ Textos da UI por idioma ─────────────────────────────
const TL_UI = {
  pt: { all:'Todos', use:'Usar', search:'Buscar título…', hint:'clique 2x para usar', ideas:'ideias', none:'Nenhum título encontrado', suggested:'título sugerido', applied:'✅ Título aplicado' },
  en: { all:'All',   use:'Use',  search:'Search titles…',  hint:'double-click to use', ideas:'ideas', none:'No titles found',        suggested:'suggested title', applied:'✅ Title applied' },
};
function _ui() { return TL_UI[_titleLang]; }

// ─ Select de categoria da sugestão ────────────────────
function buildSuggestCatSelect() {
  const sel = document.getElementById('suggest-cat');
  if (!sel) return;
  const cur = sel.value || 'all';
  let html = `<option value="all">🏷️ ${_ui().all}</option>`;
  html += TITLE_CATS.map(c => `<option value="${c.id}">${c.emoji} ${c[_titleLang]}</option>`).join('');
  sel.innerHTML = html;
  sel.value = cur;
}

function onSuggestCatChange() { /* seleção guardada no próprio <select> */ }

// ─ Sugerir nome de vídeo ──────────────────────────────
// Sorteia só dentro da categoria (tag) escolhida no select, no idioma ativo.
function suggestVideoName() {
  const inp = document.getElementById('video-title');
  if (!inp) return;
  const cat  = document.getElementById('suggest-cat')?.value || 'all';
  const pool = (cat === 'all') ? activeTitles() : activeTitles().filter(x => x.cat === cat);
  if (!pool.length) return;
  let item = _rand(pool);
  for (let i = 0; i < 6 && item.t === inp.value; i++) item = _rand(pool);
  inp.value = item.t;
  onTitleInput();
  _toast(`💡 ${_catEmoji(item.cat)} ${_catLabel(item.cat)}: ${_ui().suggested}`);
}

// ─ Lista de títulos: idioma + filtro por categoria + busca fuzzy ─
let _tlFilter = 'all';
let _tlQuery  = '';

function setTitleLang(lang) {
  _titleLang = lang;
  document.querySelectorAll('#tl-lang .tl-lang-btn')
    .forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  buildSuggestCatSelect();
  renderTlFilters();
  renderTlList();
}

function openTitlesList() {
  const ov = document.getElementById('tl-overlay');
  if (!ov) return;
  const s = document.getElementById('tl-search');
  if (s) { s.value = _tlQuery; s.placeholder = _ui().search; }
  document.querySelectorAll('#tl-lang .tl-lang-btn')
    .forEach(b => b.classList.toggle('active', b.dataset.lang === _titleLang));
  renderTlFilters();
  renderTlList();
  ov.classList.add('open');
}

function renderTlFilters() {
  const wrap = document.getElementById('tl-filters');
  if (!wrap) return;
  const all = activeTitles();
  let chips = `<button class="tl-chip${_tlFilter === 'all' ? ' active' : ''}" onclick="setTlFilter('all')">${_ui().all} <span class="tl-chip-n">${all.length}</span></button>`;
  chips += TITLE_CATS.map(c => {
    const n = all.filter(x => x.cat === c.id).length;
    return `<button class="tl-chip${_tlFilter === c.id ? ' active' : ''}" onclick="setTlFilter('${c.id}')">${c.emoji} ${c[_titleLang]} <span class="tl-chip-n">${n}</span></button>`;
  }).join('');
  wrap.innerHTML = chips;
}

function setTlFilter(cat) {
  _tlFilter = cat;
  renderTlFilters();
  renderTlList();
}

function onTlSearch(v) {
  _tlQuery = v;
  renderTlList();
}

// Busca fuzzy: ignora acento/caixa; cada palavra precisa aparecer
// como substring OU subsequência dentro do título.
function _norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function _subseq(q, t) { let i = 0; for (let k = 0; k < t.length && i < q.length; k++) if (t[k] === q[i]) i++; return i >= q.length; }
function _fuzzy(query, text) {
  const q = _norm(query).trim();
  if (!q) return true;
  const t = _norm(text);
  return q.split(/\s+/).every(w => t.includes(w) || _subseq(w, t));
}

function renderTlList() {
  const list = document.getElementById('tl-list');
  if (!list) return;
  let items = (_tlFilter === 'all') ? activeTitles() : activeTitles().filter(x => x.cat === _tlFilter);
  if (_tlQuery.trim()) items = items.filter(x => _fuzzy(_tlQuery, x.t));
  const cnt = document.getElementById('tl-count');
  if (cnt) cnt.textContent = items.length;
  if (!items.length) { list.innerHTML = `<div class="tl-empty">${_ui().none}</div>`; return; }
  list.innerHTML = items.map(x => {
    const t = _esc(x.t);
    return `<div class="tl-item" title="${_ui().hint}" data-t="${t}"
        onclick="tlSelect(this)" ondblclick="useTitle(this.dataset.t)">
        <span class="tl-item-txt">${t}</span>
        ${_tlFilter === 'all' ? `<span class="tl-item-cat" title="${_esc(_catLabel(x.cat))}">${_catEmoji(x.cat)}</span>` : ''}
        <button class="tl-item-use" onclick="event.stopPropagation();useTitle(this.parentNode.dataset.t)">${_ui().use}</button>
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
  _toast(_ui().applied);
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

// Popula o select de categoria da sugestão ao carregar
document.addEventListener('DOMContentLoaded', buildSuggestCatSelect);

// Fechar com Escape
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('tl-overlay')?.classList.contains('open')) { closeTitlesList(); return; }
  if (document.getElementById('yt-overlay')?.classList.contains('open')) { closeYtPreview(); }
});
