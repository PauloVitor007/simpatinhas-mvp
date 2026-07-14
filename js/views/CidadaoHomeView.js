/**
 * ============================================================================
 * SIMPATINHAS — CidadaoHomeView
 * ============================================================================
 */

import { AnimalController } from "../controllers/AnimalController.js";
import { statusAnimalLabel, statusAnimalBadgeClass, escapeHtml } from "../utils/helpers.js";

export class CidadaoHomeView {
  constructor() {
    this.animalCtrl = new AnimalController();
  }

  /**
   * Renderiza a página inicial do perfil cidadão.
   */
  async render(navigate) {
    const content = document.getElementById("page-content");
    content.innerHTML = '<div class="fade-in"><div style="padding: 3rem; text-align: center; color: var(--text-muted);">Carregando dados da nuvem...</div></div>';

    const animais = await this.animalCtrl.listarParaAdocao();
    const metricas = await this.animalCtrl.obterMetricas();
    const animaisDestaque = animais.slice(0, 3);

    content.innerHTML = `
      <div class="fade-in">
        <!-- Banner Principal -->
        <section class="hero-section">
          <h1 class="hero-title">Sistema de Monitoramento e Proteção Animal</h1>
          <p class="hero-text">
            O SIMPATINHAS é o canal oficial de integração entre a população da Paraíba 
            e o Centro de Controle de Zoonoses (CCZ) para denúncias de abandono, 
            maus-tratos e facilitação de adoção responsável.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" id="btn-denunciar">
              Registrar Denúncia / Alerta
            </button>
            <button class="btn btn-secondary btn-lg" id="btn-adotar">
              Consultar Animais Disponíveis
            </button>
          </div>
        </section>

        <!-- Indicadores Públicos -->
        <section class="public-stats">
          <div class="stat-item">
            <div class="stat-number">${metricas.total}</div>
            <div class="stat-label">Animais Resgatados</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${metricas.disponiveis}</div>
            <div class="stat-label">Disponíveis para Adoção</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${metricas.adotados}</div>
            <div class="stat-label">Animais Adotados</div>
          </div>
        </section>

        <!-- Galeria de Destaques -->
        ${animaisDestaque.length > 0 ? `
        <section style="margin-top: var(--space-6);">
          <div class="section-header">
            <h2 class="section-title">Animais Recém-Resgatados Disponíveis</h2>
            <button class="btn btn-outline btn-sm" id="btn-ver-todos">Ver Lista Completa</button>
          </div>
          <div class="grid grid-3">
            ${animaisDestaque.map((animal) => this._renderAnimalCard(animal)).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Pilares de Atuação -->
        <section style="margin-top: var(--space-8);">
          <h2 class="section-title" style="margin-bottom: var(--space-4);">Canais de Atendimento</h2>
          <div class="grid grid-3">
            <div class="card">
              <h3 style="font-size: var(--text-base); margin-bottom: var(--space-2); color: var(--purple-dark);">Denúncias Anônimas</h3>
              <p style="font-size: var(--text-xs); margin-bottom: 0;">
                Ferramenta para reportar maus-tratos ou abandonos na Paraíba. O CCZ analisa cada chamado presencialmente.
              </p>
            </div>
            <div class="card">
              <h3 style="font-size: var(--text-base); margin-bottom: var(--space-2); color: var(--purple-dark);">Adoção Responsável</h3>
              <p style="font-size: var(--text-xs); margin-bottom: 0;">
                Veja a ficha médica completa de animais aptos para adoção, contendo status de castração, peso e vacinação.
              </p>
            </div>
            <div class="card">
              <h3 style="font-size: var(--text-base); margin-bottom: var(--space-2); color: var(--purple-dark);">Integração CCZ</h3>
              <p style="font-size: var(--text-xs); margin-bottom: 0;">
                Dados consolidados que auxiliam os agentes no monitoramento de focos de zoonoses no estado.
              </p>
            </div>
          </div>
        </section>
      </div>
    `;

    document.getElementById("btn-denunciar")?.addEventListener("click", () => navigate("denuncia"));
    document.getElementById("btn-adotar")?.addEventListener("click", () => navigate("adocao"));
    document.getElementById("btn-ver-todos")?.addEventListener("click", () => navigate("adocao"));
  }

  _renderAnimalCard(animal) {
    return `
      <div class="animal-card">
        <div class="animal-card-image">
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <div class="animal-card-body">
          <div class="animal-card-name">${escapeHtml(animal.nome)}</div>
          <div class="animal-card-info">
            ${escapeHtml(animal.especie === "cachorro" ? "Cão" : "Gato")} · ${escapeHtml(animal.porte)} · ${escapeHtml(animal.idade_estimada)}
          </div>
          <div class="animal-card-badges">
            ${animal.castrado ? '<span class="badge badge-success">Castrado</span>' : '<span class="badge badge-neutral">Não Castrado</span>'}
            ${animal.vacinado ? '<span class="badge badge-success">Vacinado</span>' : '<span class="badge badge-neutral">Não Vacinado</span>'}
          </div>
        </div>
        <div class="animal-card-footer">
          <span class="badge ${statusAnimalBadgeClass(animal.status_atual)}">${statusAnimalLabel(animal.status_atual)}</span>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('btn-adotar').click()">Visualizar</button>
        </div>
      </div>
    `;
  }
}

export default CidadaoHomeView;
