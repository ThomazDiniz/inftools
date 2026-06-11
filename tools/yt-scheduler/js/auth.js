/**
 * Auth — Google Identity Services OAuth
 *
 * Requer apenas client_id. Nenhum client_secret é usado ou necessário.
 * O access token fica em memória apenas — nunca é gravado em disco ou localStorage.
 *
 * Pré-requisito do usuário:
 *   - Criar credencial "Aplicativo da Web" no Google Cloud Console
 *   - Habilitar YouTube Data API v3
 *   - Adicionar o domínio do GitHub Pages como JavaScript origin autorizada
 */
const Auth = (() => {
  let _tokenClient = null;
  let _token       = null;
  let _expiry      = 0;
  let _onUpdate    = null;

  const SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtube.readonly'
  ].join(' ');

  function _gisReady() {
    return !!(window.google?.accounts?.oauth2);
  }

  function init(clientId) {
    if (!clientId) return;
    if (!_gisReady()) {
      setTimeout(() => init(clientId), 150);
      return;
    }
    _tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: async (resp) => {
        if (resp.error || !resp.access_token) {
          _token  = null;
          _expiry = 0;
          _onUpdate?.({ ok: false, error: resp.error || 'Sem token' });
          return;
        }
        _token  = resp.access_token;
        _expiry = Date.now() + (resp.expires_in - 60) * 1000; // 1 min de margem

        let channelName = null;
        try { channelName = await _fetchChannelName(_token); } catch {}
        _onUpdate?.({ ok: true, token: _token, channelName });
      }
    });
  }

  function signIn() {
    if (!_tokenClient) throw new Error('Chame init(clientId) antes.');
    _tokenClient.requestAccessToken({ prompt: _token ? '' : 'consent' });
  }

  function signOut() {
    if (_token) google.accounts.oauth2.revoke(_token, () => {});
    _token  = null;
    _expiry = 0;
    _onUpdate?.({ ok: false, error: null, channelName: null });
  }

  /** Retorna o token se ainda válido, null se expirado. */
  function getToken() {
    return (_token && Date.now() < _expiry) ? _token : null;
  }

  function onUpdate(cb) { _onUpdate = cb; }

  async function _fetchChannelName(token) {
    const r = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await r.json();
    return data.items?.[0]?.snippet?.title ?? null;
  }

  return { init, signIn, signOut, getToken, onUpdate };
})();
