/**
 * ============================================
 * SIMPATINHAS — Utility Helpers
 * ============================================
 */

/**
 * Formata uma data ISO para formato brasileiro.
 * @param {string} isoDate 
 * @returns {string} Ex: "28/06/2025 09:15"
 */
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formata uma data ISO para formato relativo ("há 2 horas").
 * @param {string} isoDate
 * @returns {string}
 */
export function timeAgo(isoDate) {
  if (!isoDate) return '—';
  const now = new Date();
  const date = new Date(isoDate);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'ano', seconds: 31536000 },
    { label: 'mês', seconds: 2592000 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      const plural = count > 1;
      let label = interval.label;
      if (plural) {
        if (label === 'mês') label = 'meses';
        else label += 's';
      }
      return `há ${count} ${label}`;
    }
  }

  return 'agora mesmo';
}

/**
 * Retorna o label legível para tipo de denúncia.
 * @param {string} tipo
 * @returns {string}
 */
export function tipoDenunciaLabel(tipo) {
  const labels = {
    abandono: 'Abandono',
    maus_tratos: 'Maus-tratos',
    animal_ferido: 'Animal Ferido',
  };
  return labels[tipo] || tipo;
}

/**
 * Retorna o label legível para status de denúncia.
 * @param {string} status
 * @returns {string}
 */
export function statusDenunciaLabel(status) {
  const labels = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    resolvida: 'Resolvida',
  };
  return labels[status] || status;
}

/**
 * Retorna a classe CSS do badge para status de denúncia.
 * @param {string} status
 * @returns {string}
 */
export function statusDenunciaBadgeClass(status) {
  const classes = {
    pendente: 'badge-warning',
    em_andamento: 'badge-info',
    resolvida: 'badge-success',
  };
  return classes[status] || 'badge-neutral';
}

/**
 * Retorna label para status do animal.
 * @param {string} status
 * @returns {string}
 */
export function statusAnimalLabel(status) {
  const labels = {
    disponivel: 'Disponível',
    em_tratamento: 'Em tratamento',
    adotado: 'Adotado',
  };
  return labels[status] || status;
}

/**
 * Retorna a classe do badge para status do animal.
 * @param {string} status
 * @returns {string}
 */
export function statusAnimalBadgeClass(status) {
  const classes = {
    disponivel: 'badge-success',
    em_tratamento: 'badge-warning',
    adotado: 'badge-purple',
  };
  return classes[status] || 'badge-neutral';
}

/**
 * Retorna label para porte.
 * @param {string} porte
 * @returns {string}
 */
export function porteLabel(porte) {
  const labels = {
    pequeno: 'Pequeno',
    medio: 'Médio',
    grande: 'Grande',
  };
  return labels[porte] || porte;
}

/**
 * Retorna label para espécie.
 * @param {string} especie
 * @returns {string}
 */
export function especieLabel(especie) {
  const labels = {
    cachorro: 'Cachorro',
    gato: 'Gato',
    outro: 'Outro',
  };
  return labels[especie] || especie;
}

/**
 * Mostra um toast de notificação.
 * @param {string} message
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {number} duration - ms
 */
export function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  const toast = document.createElement('div');
  toast.className = `toast alert-${type === 'error' ? 'danger' : type}`;
  toast.innerHTML = `
    <span class="alert-icon">${icons[type]}</span>
    <span>${message}</span>
    <span class="alert-close" onclick="this.parentElement.remove()">✕</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

/**
 * Escapa HTML para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Debounce — atrasa execução de uma função.
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
