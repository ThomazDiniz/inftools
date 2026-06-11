/**
 * Scheduler — calcula timestamps de publicação para cada vídeo.
 *
 * Lógica idêntica ao youtube_bulk_scheduler.py:
 *   - hour_slots: múltiplos horários por dia (ex: [8, 18] = 2 vídeos/dia)
 *   - start_date: data inicial
 *   - timezone: converte corretamente incluindo DST
 */
const Scheduler = (() => {

  /**
   * Converte data local (dateStr, hour) em timezone para um Date UTC.
   * Usa Intl.DateTimeFormat para lidar com DST corretamente.
   */
  function localToUTC(dateStr, hour, timezone) {
    const [year, month, day] = dateStr.split('-').map(Number);

    // Candidato inicial: trata `hour` como UTC
    let candidate = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));

    // Verifica que hora esse UTC corresponde no timezone alvo
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      day: 'numeric',
      hour: 'numeric',
      hour12: false
    });
    const parts = fmt.formatToParts(candidate);
    const tzHour = parseInt(parts.find(p => p.type === 'hour').value) % 24;
    const tzDay  = parseInt(parts.find(p => p.type === 'day').value);

    // Ajusta pela diferença de horas
    let diff = hour - tzHour;
    if (tzDay < day && diff > 12)  diff -= 24;
    if (tzDay > day && diff < -12) diff += 24;

    return new Date(candidate.getTime() + diff * 3_600_000);
  }

  /**
   * Computa `count` timestamps de publicação.
   * Retorna array de Date (UTC).
   */
  function compute(count, startDateStr, hourSlots, timezone) {
    const slots = [...new Set(hourSlots)].sort((a, b) => a - b);
    if (!slots.length) slots.push(8);

    const [y, m, d] = startDateStr.split('-').map(Number);
    const result = [];

    for (let i = 0; i < count; i++) {
      const dayOffset = Math.floor(i / slots.length);
      const hour      = slots[i % slots.length];

      // Data base + offset de dias
      const base    = new Date(Date.UTC(y, m - 1, d + dayOffset));
      const dateStr = base.toISOString().split('T')[0];

      result.push(localToUTC(dateStr, hour, timezone));
    }

    return result;
  }

  /** Formata um Date UTC para exibição no timezone escolhido. */
  function display(utcDate, timezone) {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: timezone,
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit'
    }).format(utcDate);
  }

  function today() {
    return new Date().toISOString().split('T')[0];
  }

  return { compute, display, today };
})();
