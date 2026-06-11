/**
 * main.js — estado da UI e handlers de eventos.
 *
 * Arquitetura simples: estado central + funções de render puras.
 * Sem framework. Sem build step.
 */

const App = (() => {

  // ── Estado ────────────────────────────────────────────────────────────────

  const state = {
    clientId:    localStorage.getItem('yt_client_id')    || '',
    connected:   false,
    channelName: null,

    videos: [],
    // cada vídeo: { id, file, title, size, status:'idle'|'uploading'|'done'|'error', progress, videoId, error }

    settings: {
      startDate:   Scheduler.today(),
      hourSlots:   JSON.parse(localStorage.getItem('yt_hour_slots') || '[8,18]'),
      timezone:    localStorage.getItem('yt_timezone')    || 'America/Sao_Paulo',
      categoryId:  localStorage.getItem('yt_category')   || '20',
      description: localStorage.getItem('yt_description')|| '',
    },

    uploading:  false,
    abortCtrl:  null
  };

  let _uid = 0;
  const uid = () => ++_uid;

  // ── Helpers ───────────────────────────────────────────────────────────────

  function fmtSize(bytes) {
    if (bytes < 1024)           return bytes + ' B';
    if (bytes < 1024 ** 2)      return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 ** 3)      return (bytes / 1024 ** 2).toFixed(1) + ' MB';
    return (bytes / 1024 ** 3).toFixed(2) + ' GB';
  }

  function titleFrom(filename) {
    return filename.replace(/\.[^.]+$/, '').replace(/_/g, ' ');
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function saveSettings() {
    const s = state.settings;
    localStorage.setItem('yt_hour_slots',   JSON.stringify(s.hourSlots));
    localStorage.setItem('yt_timezone',     s.timezone);
    localStorage.setItem('yt_category',     s.categoryId);
    localStorage.setItem('yt_description',  s.description);
  }

  function schedule() {
    return Scheduler.compute(
      state.videos.length,
      state.settings.startDate,
      state.settings.hourSlots,
      state.settings.timezone
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  function renderAuth({ channelName } = {}) {
    const dot  = document.getElementById('auth-dot');
    const name = document.getElementById('auth-name');
    const btn  = document.getElementById('btn-connect');
    if (!dot || !name || !btn) return;

    if (state.connected) {
      dot.className  = 'auth-dot connected';
      name.textContent = channelName || state.channelName || 'Conectado';
      btn.textContent  = 'Desconectar';
      btn.className    = 'btn btn-ghost btn-sm';
    } else {
      dot.className    = 'auth-dot';
      name.textContent = 'Desconectado';
      btn.textContent  = 'Conectar';
      btn.className    = 'btn btn-primary btn-sm';
    }
    renderUploadBtn();
  }

  function renderSlots() {
    const c = document.getElementById('slots-tags');
    if (!c) return;
    c.innerHTML = '';
    state.settings.hourSlots.forEach(h => {
      const tag = document.createElement('span');
      tag.className   = 'slot-tag';
      tag.innerHTML   = `${String(h).padStart(2,'0')}:00<button class="slot-rm" data-h="${h}" title="Remover">×</button>`;
      c.appendChild(tag);
    });
    c.querySelectorAll('.slot-rm').forEach(b => {
      b.addEventListener('click', () => {
        if (state.settings.hourSlots.length <= 1) return;
        state.settings.hourSlots = state.settings.hourSlots.filter(x => x !== +b.dataset.h);
        renderSlots();
        renderQueue();
        saveSettings();
      });
    });
  }

  function renderQueue() {
    const empty   = document.getElementById('view-empty');
    const queued  = document.getElementById('view-queue');
    if (!empty || !queued) return;

    if (state.videos.length === 0) {
      empty.classList.remove('hidden');
      queued.classList.add('hidden');
      return;
    }

    empty.classList.add('hidden');
    queued.classList.remove('hidden');

    const sched = schedule();
    const tbody = document.getElementById('queue-body');
    if (!tbody) return;

    // Atualiza linhas existentes ou reconstrói
    tbody.innerHTML = '';
    state.videos.forEach((v, i) => {
      const when = sched[i] ? Scheduler.display(sched[i], state.settings.timezone) : '—';
      const isPast = sched[i] && sched[i] < new Date();

      const statusHtml = {
        idle:      '',
        uploading: `<span class="s-uploading">${Math.round(v.progress * 100)}%</span>`,
        done:      '<span class="s-done">Enviado</span>',
        error:     `<span class="s-error" title="${esc(v.error || '')}">Erro</span>`
      }[v.status] || '';

      const progressHtml = v.status === 'uploading'
        ? `<div class="prog-bar"><div class="prog-fill" style="width:${Math.round(v.progress * 100)}%"></div></div>`
        : '';

      const tr = document.createElement('tr');
      tr.dataset.id = v.id;
      if (v.status === 'done')  tr.classList.add('row-done');
      if (v.status === 'error') tr.classList.add('row-error');

      tr.innerHTML = `
        <td class="td-order">${i + 1}</td>
        <td class="td-title">
          <input class="title-input" value="${esc(v.title)}" data-id="${v.id}" ${v.status !== 'idle' ? 'disabled' : ''}>
          ${progressHtml}
        </td>
        <td class="td-size">${fmtSize(v.size)}</td>
        <td class="td-when ${isPast ? 'past' : ''}">${when}</td>
        <td class="td-status">${statusHtml}</td>
        <td class="td-rm">${v.status === 'idle' ? `<button class="btn-rm" data-id="${v.id}">×</button>` : ''}</td>
      `;
      tbody.appendChild(tr);
    });

    // Bind title edits
    tbody.querySelectorAll('.title-input').forEach(inp => {
      inp.addEventListener('change', e => {
        const v = state.videos.find(x => x.id === +e.target.dataset.id);
        if (v) v.title = e.target.value;
      });
    });

    // Bind remove
    tbody.querySelectorAll('.btn-rm').forEach(b => {
      b.addEventListener('click', () => {
        state.videos = state.videos.filter(v => v.id !== +b.dataset.id);
        renderQueue();
        renderUploadBtn();
      });
    });

    const countEl = document.getElementById('queue-count');
    if (countEl) countEl.textContent = `${state.videos.length} vídeo${state.videos.length !== 1 ? 's' : ''}`;

    renderUploadBtn();
  }

  function renderUploadBtn() {
    const btn    = document.getElementById('btn-upload');
    const cancel = document.getElementById('btn-cancel');
    if (!btn || !cancel) return;

    const hasPending = state.videos.some(v => v.status === 'idle');

    btn.disabled    = !state.connected || !hasPending || state.uploading;
    btn.textContent = state.uploading ? 'Enviando...' : 'Enviar todos';

    cancel.classList.toggle('hidden', !state.uploading);
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  async function startUpload() {
    if (!state.connected || state.uploading) return;

    const token = Auth.getToken();
    if (!token) {
      alert('Token expirado. Clique em Reconectar.');
      return;
    }

    state.uploading = true;
    state.abortCtrl = new AbortController();
    renderUploadBtn();

    const sched   = schedule();
    const pending = state.videos.filter(v => v.status === 'idle');

    for (const v of pending) {
      const idx       = state.videos.indexOf(v);
      const publishAt = sched[idx];

      if (!publishAt) continue;

      // Avisa se a data já passou
      if (publishAt < new Date()) {
        const ok = confirm(`"${v.title}" está agendado para o passado (${Scheduler.display(publishAt, state.settings.timezone)}). Continuar mesmo assim?`);
        if (!ok) continue;
      }

      v.status   = 'uploading';
      v.progress = 0;
      renderQueue();

      try {
        const result = await Uploader.upload(
          v.file,
          {
            title:       v.title,
            description: state.settings.description,
            categoryId:  state.settings.categoryId,
            publishAt,
          },
          token,
          {
            onProgress: p => {
              v.progress = p;
              const row  = document.querySelector(`tr[data-id="${v.id}"]`);
              if (!row) return;
              const fill = row.querySelector('.prog-fill');
              const pct  = row.querySelector('.s-uploading');
              if (fill) fill.style.width = Math.round(p * 100) + '%';
              if (pct)  pct.textContent  = Math.round(p * 100) + '%';
            },
            signal: state.abortCtrl.signal
          }
        );

        v.status  = 'done';
        v.videoId = result?.id;
      } catch (err) {
        if (err.name === 'AbortError') {
          v.status = 'idle';
          break;
        }
        v.status = 'error';
        v.error  = err.message;
      }

      renderQueue();
    }

    state.uploading = false;
    state.abortCtrl = null;
    renderUploadBtn();
  }

  // ── Adicionar arquivos ────────────────────────────────────────────────────

  const VIDEO_EXT = /\.(mp4|mov|avi|mkv|flv|wmv|webm)$/i;

  function addFiles(files) {
    [...files]
      .filter(f => VIDEO_EXT.test(f.name))
      .forEach(file => {
        state.videos.push({
          id:       uid(),
          file,
          title:    titleFrom(file.name),
          size:     file.size,
          status:   'idle',
          progress: 0,
          videoId:  null,
          error:    null
        });
      });
    renderQueue();
    renderUploadBtn();
  }

  // ── Eventos ───────────────────────────────────────────────────────────────

  function bindEvents() {
    // Auth update callback
    Auth.onUpdate(({ ok, channelName }) => {
      state.connected  = ok;
      state.channelName = channelName || null;
      renderAuth({ channelName });
    });

    // Client ID
    const clientIdEl = document.getElementById('client-id-input');
    if (clientIdEl) {
      clientIdEl.value = state.clientId;
      clientIdEl.addEventListener('change', e => {
        state.clientId = e.target.value.trim();
        localStorage.setItem('yt_client_id', state.clientId);
        Auth.init(state.clientId);
      });
    }

    // Conectar / desconectar
    document.getElementById('btn-connect')?.addEventListener('click', () => {
      if (state.connected) {
        Auth.signOut();
      } else {
        if (!state.clientId) {
          document.getElementById('client-id-input')?.focus();
          return;
        }
        Auth.init(state.clientId);
        Auth.signIn();
      }
    });

    // Data de início
    document.getElementById('start-date')?.addEventListener('change', e => {
      state.settings.startDate = e.target.value;
      renderQueue();
      saveSettings();
    });

    // Adicionar horário
    document.getElementById('btn-add-slot')?.addEventListener('click', addSlot);
    document.getElementById('slot-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') addSlot();
    });

    function addSlot() {
      const inp = document.getElementById('slot-input');
      const val = parseInt(inp?.value ?? '');
      if (isNaN(val) || val < 0 || val > 23) return;
      if (!state.settings.hourSlots.includes(val)) {
        state.settings.hourSlots.push(val);
        state.settings.hourSlots.sort((a, b) => a - b);
        renderSlots();
        renderQueue();
        saveSettings();
      }
      if (inp) inp.value = '';
    }

    // Timezone
    document.getElementById('timezone-select')?.addEventListener('change', e => {
      state.settings.timezone = e.target.value;
      renderQueue();
      saveSettings();
    });

    // Categoria
    document.getElementById('category-select')?.addEventListener('change', e => {
      state.settings.categoryId = e.target.value;
      saveSettings();
    });

    // Descrição
    document.getElementById('description-input')?.addEventListener('change', e => {
      state.settings.description = e.target.value;
      saveSettings();
    });

    // Modal de tutorial
    const overlay  = document.getElementById('modal-overlay');
    document.getElementById('btn-help')?.addEventListener('click', () => {
      overlay?.classList.remove('hidden');
    });
    document.getElementById('btn-modal-close')?.addEventListener('click', () => {
      overlay?.classList.add('hidden');
    });
    overlay?.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') overlay?.classList.add('hidden');
    });

    // Drop zone
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if (dropZone) {
      dropZone.addEventListener('click',    () => fileInput?.click());
      dropZone.addEventListener('dragover', e  => { e.preventDefault(); dropZone.classList.add('over'); });
      dropZone.addEventListener('dragleave',    () => dropZone.classList.remove('over'));
      dropZone.addEventListener('drop',     e  => {
        e.preventDefault();
        dropZone.classList.remove('over');
        addFiles(e.dataTransfer.files);
      });
    }

    // Drag over main area quando já tem vídeos
    document.getElementById('view-queue')?.addEventListener('dragover', e => {
      e.preventDefault();
      e.currentTarget.classList.add('drag-target');
    });
    document.getElementById('view-queue')?.addEventListener('dragleave', e => {
      e.currentTarget.classList.remove('drag-target');
    });
    document.getElementById('view-queue')?.addEventListener('drop', e => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-target');
      addFiles(e.dataTransfer.files);
    });

    fileInput?.addEventListener('change', e => {
      addFiles(e.target.files);
      e.target.value = '';
    });

    // Botão "Adicionar mais"
    document.getElementById('btn-add-more')?.addEventListener('click', () => fileInput?.click());

    // Upload
    document.getElementById('btn-upload')?.addEventListener('click', startUpload);

    // Cancelar
    document.getElementById('btn-cancel')?.addEventListener('click', () => {
      state.abortCtrl?.abort();
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  function init() {
    // Preenche campos com valores salvos
    const el = id => document.getElementById(id);

    const startDate = el('start-date');
    if (startDate) startDate.value = state.settings.startDate;

    const tz = el('timezone-select');
    if (tz) tz.value = state.settings.timezone;

    const cat = el('category-select');
    if (cat) cat.value = state.settings.categoryId;

    const desc = el('description-input');
    if (desc) desc.value = state.settings.description;

    // Inicializa Auth se já tem client_id salvo
    if (state.clientId) Auth.init(state.clientId);

    bindEvents();
    renderAuth();
    renderSlots();
    renderQueue();
  }

  return { init };
})();

window.addEventListener('load', () => App.init());
