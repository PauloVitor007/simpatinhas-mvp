/**
 * ============================================================================
 * SIMPATINHAS — App Bootstrap (Controlador Geral da Aplicação SPA)
 * ============================================================================
 */

import { Database } from "./models/Database.js";
import { SEED_DATA } from "./seeds/seedData.js";
import { Router } from "./router.js";
import { AuthController } from "./controllers/AuthController.js";
import { DenunciaController } from "./controllers/DenunciaController.js";
import { AuthView } from "./views/AuthView.js";
import { CidadaoHomeView } from "./views/CidadaoHomeView.js";
import { DenunciaFormView } from "./views/DenunciaFormView.js";
import { GaleriaAdocaoView } from "./views/GaleriaAdocaoView.js";
import { AdminDashboardView } from "./views/AdminDashboardView.js";
import { TriagemView } from "./views/TriagemView.js";
import { showToast } from "./utils/helpers.js";

class App {
  constructor() {
    // 1. Inicializa o Database Singleton
    this.db = Database.getInstancia();
    this.db.inicializar(SEED_DATA);

    // 2. Controladores
    this.authCtrl = new AuthController();
    this.denunciaCtrl = new DenunciaController();

    // 3. Componentes de Visualização (Views)
    this.authView = new AuthView();
    this.cidadaoHomeView = new CidadaoHomeView();
    this.denunciaFormView = new DenunciaFormView();
    this.galeriaAdocaoView = new GaleriaAdocaoView();
    this.adminDashboardView = new AdminDashboardView();
    this.triagemView = new TriagemView();

    // 4. Roteamento SPA
    this.router = new Router();
    this._configurarRotas();
    this._configurarGuards();
  }

  /**
   * Inicializa o roteador do sistema.
   */
  start() {
    this.router.start();
  }

  /**
   * Configuração das rotas SPA.
   */
  _configurarRotas() {
    const nav = (caminho) => this.router.navigate(caminho);

    // Login
    this.router.register("login", () => {
      this.authView.render((email, senha) => {
        const resultado = this.authCtrl.login(email, senha);
        if (resultado.success) {
          if (resultado.user.tipo_perfil === "admin") {
            nav("admin");
          } else {
            nav("home");
          }
        } else {
          this.authView.showError(resultado.error);
        }
      });
    }, { public: true });

    // Home Cidadão
    this.router.register("home", async () => {
      await this._renderizarLayoutBase("cidadao");
      this.cidadaoHomeView.render(nav);
    }, { requireAuth: true });

    // Enviar Denúncia
    this.router.register("denuncia", async () => {
      await this._renderizarLayoutBase("cidadao");
      const usuarioLogado = this.authCtrl.obterUsuarioLogado();
      this.denunciaFormView.render(
        (dados) => this.denunciaCtrl.registrarDenuncia(dados),
        nav,
        usuarioLogado
      );
    }, { requireAuth: true });

    // Galeria de Adoção
    this.router.register("adocao", async () => {
      await this._renderizarLayoutBase("cidadao");
      this.galeriaAdocaoView.render(nav);
    }, { requireAuth: true });

    // Dashboard Admin CCZ
    this.router.register("admin", async () => {
      await this._renderizarLayoutBase("admin");
      await this.adminDashboardView.render(nav);
    }, { requireAuth: true, requireAdmin: true });

    // Triagem Clínica
    this.router.register("triagem", async () => {
      await this._renderizarLayoutBase("admin");
      this.triagemView.render(nav);
    }, { requireAuth: true, requireAdmin: true });
  }

  /**
   * Configuração de segurança das rotas (Guards).
   */
  _configurarGuards() {
    this.router.addGuard((rota, opcoes) => {
      if (opcoes.public) return true;

      // Restrição de autenticação
      if (opcoes.requireAuth && !this.authCtrl.estaAutenticado()) {
        showToast("Necessário realizar o login.", "warning");
        return "login";
      }

      // Restrição de perfil administrativo
      if (opcoes.requireAdmin && !this.authCtrl.ehAdmin()) {
        showToast("Acesso permitido apenas para Agentes do CCZ.", "error");
        return "home";
      }

      return true;
    });
  }

  /**
   * Renderiza a moldura do sistema (Header, Sidebar e containers principais).
   */
  async _renderizarLayoutBase(tipoLayout) {
    const appContainer = document.getElementById("app");
    const usuario = this.authCtrl.obterUsuarioLogado();
    const iniciais = this.authCtrl.obterIniciais();
    const nav = (caminho) => this.router.navigate(caminho);
    const rotaAtiva = this.router.getCurrentRoute();
    const quantidadePendentes = await this.denunciaCtrl.obterQuantidadePendentes();

    if (tipoLayout === "admin") {
      appContainer.innerHTML = `
        <header class="header">
          <div class="header-inner">
            <div class="header-left">
              <button class="header-menu-toggle" id="menu-toggle">☰</button>
              <a class="header-logo" href="#/admin">
                <div class="header-logo-text">SIMPA<span>TINHAS</span></div>
              </a>
            </div>
            <div class="header-right">
              <div class="header-user">
                <div>
                  <div class="header-user-name">${usuario?.nome_completo || "Agente"}</div>
                  <div class="header-user-role">Centro de Controle de Zoonoses</div>
                </div>
                <div class="header-avatar">${iniciais}</div>
              </div>
              <button class="btn btn-ghost btn-sm" id="btn-logout" title="Sair do Sistema">Sair</button>
            </div>
          </div>
        </header>
        <div class="app-layout">
          <aside class="sidebar" id="sidebar">
            <div class="sidebar-section">
              <div class="sidebar-section-title">CCZ João Pessoa</div>
              <a class="sidebar-link ${rotaAtiva === "admin" ? "active" : ""}" data-route="admin">
                Painel Principal
              </a>
              <a class="sidebar-link ${rotaAtiva === "triagem" ? "active" : ""}" data-route="triagem">
                Triagem Clínica
              </a>
            </div>
            <div class="sidebar-section">
              <div class="sidebar-section-title">Ocorrências</div>
              <a class="sidebar-link" data-route="admin">
                Chamados Registrados
                ${quantidadePendentes > 0 ? `<span class="sidebar-link-badge">${quantidadePendentes}</span>` : ""}
              </a>
            </div>
            <div class="sidebar-section">
              <div class="sidebar-section-title">Banco de Dados</div>
              <a class="sidebar-link" id="btn-reset-db">
                Resetar Dados Demo
              </a>
            </div>
          </aside>
          <div class="mobile-overlay" id="mobile-overlay"></div>
          <main class="app-main">
            <div class="app-content" id="page-content"></div>
          </main>
        </div>
      `;

      // Eventos de navegação da barra lateral
      document.querySelectorAll(".sidebar-link[data-route]").forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          nav(link.dataset.route);
        });
      });

      // Menu hambúrguer em dispositivos móveis
      document.getElementById("menu-toggle")?.addEventListener("click", () => {
        document.getElementById("sidebar")?.classList.toggle("open");
        document.getElementById("mobile-overlay")?.classList.toggle("show");
      });

      document.getElementById("mobile-overlay")?.addEventListener("click", () => {
        document.getElementById("sidebar")?.classList.remove("open");
        document.getElementById("mobile-overlay")?.classList.remove("show");
      });

      // Ação de resetar banco
      document.getElementById("btn-reset-db")?.addEventListener("click", () => {
        if (confirm("Deseja resetar o banco de dados local para os dados padrão?")) {
          this.db.resetar();
          this.db.inicializar(SEED_DATA);
          showToast("Banco de dados resetado com sucesso.", "success");
          nav("admin");
        }
      });
    } else {
      // Perfil Cidadão
      appContainer.innerHTML = `
        <header class="header">
          <div class="header-inner">
            <div class="header-left">
              <a class="header-logo" href="#/home">
                <div class="header-logo-text">SIMPA<span>TINHAS</span></div>
              </a>
              <nav class="header-nav">
                <a class="header-nav-link ${rotaAtiva === "home" ? "active" : ""}" href="#/home">Início</a>
                <a class="header-nav-link ${rotaAtiva === "denuncia" ? "active" : ""}" href="#/denuncia">Registrar Denúncia</a>
                <a class="header-nav-link ${rotaAtiva === "adocao" ? "active" : ""}" href="#/adocao">Adoção</a>
              </nav>
            </div>
            <div class="header-right">
              <div class="header-user">
                <div>
                  <div class="header-user-name">${usuario?.nome_completo || "Cidadão"}</div>
                  <div class="header-user-role">Cidadão da Paraíba</div>
                </div>
                <div class="header-avatar">${iniciais}</div>
              </div>
              <button class="btn btn-ghost btn-sm" id="btn-logout">Sair</button>
            </div>
          </div>
        </header>
        <main class="app-main">
          <div class="app-content" id="page-content"></div>
        </main>
      `;
    }

    // Ação de Logout
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      this.authCtrl.logout();
      nav("login");
      showToast("Sessão encerrada com sucesso.", "info");
    });
  }
}

// Inicializa a aplicação
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.start();
});
