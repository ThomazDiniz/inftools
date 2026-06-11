/**
 * Uploader — upload resumível direto do browser para o YouTube Data API v3.
 *
 * Não passa por servidor. O vídeo vai do disco do usuário direto para o YouTube.
 * Chunks de 8 MB (padrão recomendado pelo Google para uploads resumíveis).
 */
const Uploader = (() => {
  const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MB

  /**
   * Inicia o upload resumível e retorna a URL de upload.
   * Essa URL é temporária e específica para este arquivo.
   */
  async function _initResumable(file, metadata, token) {
    const res = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method:  'POST',
        headers: {
          'Authorization':          `Bearer ${token}`,
          'Content-Type':           'application/json; charset=UTF-8',
          'X-Upload-Content-Type':  file.type || 'video/mp4',
          'X-Upload-Content-Length': String(file.size)
        },
        body: JSON.stringify(metadata)
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Erro ao iniciar upload: HTTP ${res.status}`);
    }

    const location = res.headers.get('location') || res.headers.get('Location');
    if (!location) throw new Error('YouTube não retornou a URL de upload');
    return location;
  }

  /**
   * Envia o arquivo em chunks para a URL de upload resumível.
   * - status 308: chunk recebido, continua
   * - status 200/201: upload completo
   */
  async function _sendChunks(uploadUrl, file, { onProgress, signal } = {}) {
    let offset = 0;

    while (offset < file.size) {
      if (signal?.aborted) throw new DOMException('Cancelado', 'AbortError');

      const end   = Math.min(offset + CHUNK_SIZE, file.size);
      const chunk = file.slice(offset, end);

      const res = await fetch(uploadUrl, {
        method:  'PUT',
        headers: {
          'Content-Range': `bytes ${offset}-${end - 1}/${file.size}`,
          'Content-Type':  file.type || 'video/mp4'
        },
        body:   chunk,
        signal
      });

      if (res.status === 308) {
        // Incompleto — avança para o próximo chunk
        const range = res.headers.get('range') || res.headers.get('Range');
        offset = range ? parseInt(range.split('-')[1]) + 1 : end;
        onProgress?.(offset / file.size);
      } else if (res.status === 200 || res.status === 201) {
        onProgress?.(1);
        return await res.json();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Upload falhou: HTTP ${res.status}`);
      }
    }
  }

  /**
   * Upload completo de um vídeo com agendamento.
   *
   * @param {File}   file
   * @param {object} opts  - title, description, categoryId, publishAt (Date), tags
   * @param {string} token - access token OAuth
   * @param {object} hooks - onProgress(0-1), signal (AbortController.signal)
   * @returns {object} resposta da API com id do vídeo
   */
  async function upload(file, { title, description, categoryId, publishAt, tags }, token, hooks = {}) {
    const metadata = {
      snippet: {
        title:       (title || file.name.replace(/\.[^.]+$/, '')).slice(0, 100),
        description: description || '',
        categoryId:  categoryId  || '20',
        ...(tags?.length ? { tags } : {})
      },
      status: {
        privacyStatus:              'private',
        publishAt:                  publishAt.toISOString(),
        selfDeclaredMadeForKids:    false
      }
    };

    const uploadUrl = await _initResumable(file, metadata, token);
    return await _sendChunks(uploadUrl, file, hooks);
  }

  return { upload };
})();
