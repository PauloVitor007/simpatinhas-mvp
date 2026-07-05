/**
 * ============================================
 * SIMPATINHAS — Router (SPA Hash Router)
 * ============================================
 * 
 * Client-side router usando hash-based navigation.
 * Rotas: #/login, #/home, #/denuncia, #/adocao, #/admin, #/triagem
 * 
 * ============================================
 */

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this._guards = [];
  }

  /**
   * Registra uma rota.
   * @param {string} path - Ex: 'login', 'home', 'admin'
   * @param {Function} handler - Função que renderiza a view
   * @param {Object} options - { requireAuth, requireAdmin, requireCidadao }
   */
  register(path, handler, options = {}) {
    this.routes[path] = { handler, options };
  }

  /**
   * Registra um guard de autenticação.
   * @param {Function} guard - (route, options) => boolean | string (redirect path)
   */
  addGuard(guard) {
    this._guards.push(guard);
  }

  /**
   * Navega para uma rota.
   * @param {string} path
   */
  navigate(path) {
    window.location.hash = `#/${path}`;
  }

  /**
   * Inicia o router, escutando mudanças de hash.
   */
  start() {
    window.addEventListener('hashchange', () => this._handleRoute());
    
    // Trata rota inicial
    if (!window.location.hash || window.location.hash === '#/') {
      this.navigate('login');
    } else {
      this._handleRoute();
    }
  }

  /**
   * Retorna a rota atual.
   * @returns {string}
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /** @private */
  _handleRoute() {
    const hash = window.location.hash.replace('#/', '') || 'login';
    const route = this.routes[hash];

    if (!route) {
      console.warn(`[Router] Rota não encontrada: ${hash}`);
      this.navigate('login');
      return;
    }

    // Execute guards
    for (const guard of this._guards) {
      const result = guard(hash, route.options);
      if (result !== true) {
        // Guard returned a redirect path
        if (typeof result === 'string') {
          this.navigate(result);
        }
        return;
      }
    }

    this.currentRoute = hash;

    // Add page transition
    const app = document.getElementById('app');
    app.style.opacity = '0';
    app.style.transform = 'translateY(4px)';
    
    setTimeout(() => {
      route.handler();
      app.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';
      app.style.opacity = '1';
      app.style.transform = 'translateY(0)';
      
      // Scroll to top
      window.scrollTo({ top: 0 });
    }, 100);
  }
}

export default Router;
