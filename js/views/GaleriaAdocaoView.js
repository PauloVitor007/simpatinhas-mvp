/**
 * ============================================================================
 * SIMPATINHAS — GaleriaAdocaoView
 * ============================================================================
 */

import { AnimalController } from "../controllers/AnimalController.js";
import { 
  statusAnimalLabel, statusAnimalBadgeClass, 
  porteLabel, especieLabel, escapeHtml, showToast
} from "../utils/helpers.js";

export class GaleriaAdocaoView {
  constructor() {
    this.animalCtrl = new AnimalController();
    this.filtroAtual = { especie: "todos", porte: "todos" };
  }

  /**
   * Renderiza a galeria de adoções.
   */
  async render(navigate) {
    const content = document.getElementById("page-content");
    content.innerHTML = '<div class="fade-in"><div style="padding: 3rem; text-align: center; color: var(--text-muted);">Carregando dados da nuvem...</div></div>';

    const htmlAnimais = await this._renderAnimais();

    content.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <button class="btn btn-ghost btn-sm mb-2" id="btn-voltar">← Voltar</button>
          <h1 class="page-title">Adoção Responsável</h1>
          <p class="page-subtitle">Consulte animais resgatados aptos e saudáveis aguardando um novo lar na Paraíba.</p>
        </div>

        <!-- Filtros de Busca -->
        <div class="galeria-filters" id="galeria-filters">
          <span class="text-small text-muted" style="margin-right: var(--space-1);">Espécie:</span>
          <button class="filter-chip active" data-filter="especie" data-value="todos">Todos</button>
          <button class="filter-chip" data-filter="especie" data-value="cachorro">Cães</button>
          <button class="filter-chip" data-filter="especie" data-value="gato">Gatos</button>
          
          <span style="width: 1px; height: 16px; background-color: var(--border); margin: 0 var(--space-2);"></span>
          
          <span class="text-small text-muted" style="margin-right: var(--space-1);">Porte:</span>
          <button class="filter-chip active" data-filter="porte" data-value="todos">Todos</button>
          <button class="filter-chip" data-filter="porte" data-value="pequeno">Pequeno</button>
          <button class="filter-chip" data-filter="porte" data-value="medio">Médio</button>
          <button class="filter-chip" data-filter="porte" data-value="grande">Grande</button>
        </div>

        <!-- Grid de Animais -->
        <div class="grid grid-3" id="animais-grid">
          ${htmlAnimais}
        </div>
      </div>

      <!-- Container do Modal -->
      <div id="animal-modal-container"></div>
    `;

    document.getElementById("btn-voltar")?.addEventListener("click", () => navigate("home"));
    this._bindFiltros();
    this._bindAcoesCards();
  }

  async _renderAnimais() {
    const lista = await this.animalCtrl.listarParaAdocao(this.filtroAtual);

    if (lista.length === 0) {
      return `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: var(--space-8);">
          <div class="empty-state-title">Nenhum animal localizado</div>
          <div class="empty-state-text">Tente alterar os filtros de busca.</div>
        </div>
      `;
    }

    return lista.map((animal) => `
      <div class="animal-card" data-id="${animal.id}">
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
            ${especieLabel(animal.especie)} · ${porteLabel(animal.porte)} · ${escapeHtml(animal.idade_estimada)}
          </div>
          <div class="animal-card-badges">
            ${animal.castrado ? '<span class="badge badge-success">Castrado</span>' : '<span class="badge badge-neutral">Não Castrado</span>'}
            ${animal.vacinado ? '<span class="badge badge-success">Vacinado</span>' : '<span class="badge badge-neutral">Não Vacinado</span>'}
          </div>
        </div>
        <div class="animal-card-footer">
          <span class="badge ${statusAnimalBadgeClass(animal.status_atual)}">${statusAnimalLabel(animal.status_atual)}</span>
          <button class="btn btn-ghost btn-sm btn-detalhes" data-id="${animal.id}">Ver Ficha</button>
        </div>
      </div>
    `).join("");
  }

  _bindFiltros() {
    const areaFiltros = document.getElementById("galeria-filters");
    areaFiltros.addEventListener("click", async (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      const tipo = chip.dataset.filter;
      const valor = chip.dataset.value;

      // Altera o estado ativo visual dos chips daquele grupo
      const chipsGrupo = areaFiltros.querySelectorAll(`.filter-chip[data-filter="${tipo}"]`);
      chipsGrupo.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");

      // Atualiza o objeto de filtro
      this.filtroAtual[tipo] = valor;

      // Renderiza novamente a galeria
      document.getElementById("animais-grid").innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">Filtrando...</div>';
      document.getElementById("animais-grid").innerHTML = await this._renderAnimais();
      this._bindAcoesCards();
    });
  }

  _bindAcoesCards() {
    document.querySelectorAll(".animal-card, .btn-detalhes").forEach((item) => {
      item.addEventListener("click", async (e) => {
        // Evita abrir modal duas vezes pelo clique no botão e no card simultaneamente
        e.stopPropagation();
        
        const card = e.target.closest(".animal-card");
        const id = card?.dataset.id || e.target.dataset.id;
        if (id) await this._exibirFichaAnimal(id);
      });
    });
  }

  async _exibirFichaAnimal(id) {
    const animal = await this.animalCtrl.buscarPorId(id);
    if (!animal) return;

    const modalContainer = document.getElementById("animal-modal-container");
    modalContainer.innerHTML = `
      <div class="modal-backdrop" id="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Ficha Médica de ${escapeHtml(animal.nome)}</h3>
            <span class="modal-close" id="modal-close">✕</span>
          </div>
          <div class="modal-body">
            <div class="grid grid-2" style="gap: var(--space-3); margin-bottom: var(--space-4); font-size: var(--text-sm);">
              <div>
                <span class="text-muted" style="font-size: var(--text-xs);">Espécie</span>
                <div>${especieLabel(animal.especie)}</div>
              </div>
              <div>
                <span class="text-muted" style="font-size: var(--text-xs);">Raça</span>
                <div>${escapeHtml(animal.raca || "SRD")}</div>
              </div>
              <div>
                <span class="text-muted" style="font-size: var(--text-xs);">Porte</span>
                <div>${porteLabel(animal.porte)}</div>
              </div>
              <div>
                <span class="text-muted" style="font-size: var(--text-xs);">Peso Informado</span>
                <div>${animal.peso_kg ? animal.peso_kg + " kg" : "Não cadastrado"}</div>
              </div>
              <div>
                <span class="text-muted" style="font-size: var(--text-xs);">Idade Estimada</span>
                <div>${escapeHtml(animal.idade_estimada)}</div>
              </div>
              <div>
                <span class="text-muted" style="font-size: var(--text-xs);">Sexo</span>
                <div>${animal.sexo === "macho" ? "Macho" : animal.sexo === "femea" ? "Fêmea" : "Indefinido"}</div>
              </div>
            </div>

            <div class="flex gap-2 mb-4">
              ${animal.castrado ? '<span class="badge badge-success">Castrado</span>' : '<span class="badge badge-neutral">Não Castrado</span>'}
              ${animal.vacinado ? '<span class="badge badge-success">Vacinado</span>' : '<span class="badge badge-neutral">Não Vacinado</span>'}
              <span class="badge ${animal.teste_zoonose === "negativo" ? "badge-success" : animal.teste_zoonose === "positivo" ? "badge-danger" : "badge-neutral"}">
                Zoonose: ${animal.teste_zoonose === "positivo" ? "Positivo" : animal.teste_zoonose === "negativo" ? "Negativo" : "Pendente"}
              </span>
            </div>

            ${animal.observacoes ? `
            <div style="background-color: var(--bg-alt); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
              <span class="text-muted" style="font-size: var(--text-xs);">Relato Clínico / Observações</span>
              <div style="font-size: var(--text-xs); margin-top: 2px;">${escapeHtml(animal.observacoes)}</div>
            </div>
            ` : ""}
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" id="btn-fechar-modal">Fechar</button>
            <button class="btn btn-primary" id="btn-interesse">Manifestar Interesse na Adoção</button>
          </div>
        </div>
      </div>
    `;

    const fechar = () => { modalContainer.innerHTML = ""; };
    document.getElementById("modal-close")?.addEventListener("click", fechar);
    document.getElementById("btn-fechar-modal")?.addEventListener("click", fechar);
    document.getElementById("modal-backdrop")?.addEventListener("click", (e) => {
      if (e.target.id === "modal-backdrop") fechar();
    });
    document.getElementById("btn-interesse")?.addEventListener("click", () => {
      showToast("Solicitação de interesse enviada ao CCZ. Aguarde contato.", "success");
      fechar();
    });
  }
}

export default GaleriaAdocaoView;
