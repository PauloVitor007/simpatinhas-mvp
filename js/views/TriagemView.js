/**
 * ============================================================================
 * SIMPATINHAS — TriagemView
 * ============================================================================
 */

import { AnimalController } from "../controllers/AnimalController.js";
import { 
  showToast, escapeHtml, porteLabel, especieLabel,
  statusAnimalLabel, statusAnimalBadgeClass
} from "../utils/helpers.js";

export class TriagemView {
  constructor() {
    this.animalCtrl = new AnimalController();
    this.animalEmEdicaoId = null;
  }

  /**
   * Renderiza a tela de Triagem Clínica dos Animais de forma assíncrona.
   */
  async render(navigate) {
    const content = document.getElementById("page-content");
    content.innerHTML = `
      <div class="fade-in">
        <div style="padding: 3rem; text-align: center; color: var(--text-muted);">
          Carregando dados do servidor...
        </div>
      </div>
    `;

    const animais = await this.animalCtrl.listarTodos();

    content.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <h1 class="page-title">Triagem Clínica Veterinária</h1>
          <p class="page-subtitle">Cadastro de entrada de animais resgatados e atualização do estado clínico no CCZ.</p>
        </div>

        <div class="triagem-grid">
          <!-- Formulário de Registro/Edição -->
          <div>
            <div class="triagem-form-section">
              <div class="triagem-section-title">
                <span id="form-title" style="font-weight: var(--font-semibold);">Cadastrar Novo Animal</span>
              </div>

              <form id="triagem-form" novalidate style="margin-top: var(--space-4);">
                <div class="grid grid-2" style="gap: var(--space-3);">
                  <div class="form-group">
                    <label class="form-label" for="animal-nome">Nome do Animal <span class="required">*</span></label>
                    <input type="text" id="animal-nome" class="form-input" placeholder="Ex: Thor" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="animal-especie">Espécie <span class="required">*</span></label>
                    <select id="animal-especie" class="form-select" required>
                      <option value="">Selecione</option>
                      <option value="cachorro">Cão</option>
                      <option value="gato">Gato</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-2" style="gap: var(--space-3);">
                  <div class="form-group">
                    <label class="form-label" for="animal-raca">Raça / Linhagem</label>
                    <input type="text" id="animal-raca" class="form-input" placeholder="Ex: SRD" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="animal-porte">Porte Estimado</label>
                    <select id="animal-porte" class="form-select">
                      <option value="pequeno">Pequeno</option>
                      <option value="medio" selected>Médio</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-2" style="gap: var(--space-3);">
                  <div class="form-group">
                    <label class="form-label" for="animal-sexo">Sexo</label>
                    <select id="animal-sexo" class="form-select">
                      <option value="indefinido">Indefinido</option>
                      <option value="macho">Macho</option>
                      <option value="femea">Fêmea</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="animal-idade">Idade Estimada</label>
                    <input type="text" id="animal-idade" class="form-input" placeholder="Ex: 2 anos" />
                  </div>
                </div>

                <!-- Dados Clínicos (CCZ) -->
                <div style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--border-light);">
                  <h3 class="triagem-section-title">Dados Clínicos / Laboratório</h3>

                  <div class="grid grid-2" style="gap: var(--space-3); margin-top: var(--space-3);">
                    <div class="form-group">
                      <label class="form-label" for="animal-peso">Peso (kg)</label>
                      <input type="number" id="animal-peso" class="form-input" placeholder="0.0" step="0.1" min="0" />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="animal-zoonose">Teste Rápido Zoonoses</label>
                      <select id="animal-zoonose" class="form-select">
                        <option value="pendente">Pendente</option>
                        <option value="negativo">Negativo</option>
                        <option value="positivo">Positivo</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="animal-status">Status de Encaminhamento</label>
                    <select id="animal-status" class="form-select">
                      <option value="em_tratamento">Em Tratamento Clínico</option>
                      <option value="disponivel">Apto para Adoção</option>
                      <option value="adotado">Adotado</option>
                    </select>
                  </div>

                  <div class="flex gap-4 mb-4" style="margin-top: var(--space-3);">
                    <label class="toggle-wrapper">
                      <div class="toggle">
                        <input type="checkbox" id="animal-castrado" />
                        <span class="toggle-slider"></span>
                      </div>
                      <span class="toggle-label">Castrado</span>
                    </label>
                    <label class="toggle-wrapper">
                      <div class="toggle">
                        <input type="checkbox" id="animal-vacinado" />
                        <span class="toggle-slider"></span>
                      </div>
                      <span class="toggle-label">Vacinado (Antirrábica/Múltipla)</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="animal-obs">Observações / Prontuário</label>
                  <textarea id="animal-obs" class="form-textarea" placeholder="Descreva sinais clínicos, lesões, tratamentos aplicados..."></textarea>
                </div>

                <div class="flex gap-2">
                  <button type="submit" id="btn-salvar" class="btn btn-primary">
                    Salvar Registro
                  </button>
                  <button type="button" id="btn-limpar" class="btn btn-outline">
                    Limpar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Listagem dos Animais para Seleção -->
          <div>
            <div class="triagem-form-section">
              <div class="triagem-section-title">
                <span>Animais no CCZ (${animais.length})</span>
              </div>

              <div class="form-group" style="margin-top: var(--space-3);">
                <input type="text" id="animal-busca" class="form-input" placeholder="Buscar animal por nome ou raça..." />
              </div>

              <div class="animals-list" id="animals-list" style="max-height: 500px; overflow-y: auto;">
                ${this._renderListaAnimais(animais)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this._bindFormulario(navigate);
    this._bindBusca();
    this._bindAcaoSelecaoItem();
  }

  _renderListaAnimais(animais) {
    if (animais.length === 0) {
      return `
        <div class="empty-state" style="padding: var(--space-4); text-align: center; font-size: var(--text-xs); color: var(--text-muted);">
          Nenhum animal cadastrado.
        </div>
      `;
    }

    return animais.map((a) => `
      <div class="animal-list-item" data-id="${a.id}">
        <div class="animal-list-avatar" style="font-weight: var(--font-semibold); color: var(--purple-dark); background-color: var(--purple-light); font-size: var(--text-sm); border: 1px solid var(--border-light);">${escapeHtml(a.nome[0].toUpperCase())}</div>
        <div class="animal-list-info">
          <div class="animal-list-name">${escapeHtml(a.nome)}</div>
          <div class="animal-list-detail">
            ${especieLabel(a.especie)} · ${porteLabel(a.porte)} · ${a.peso_kg ? a.peso_kg + "kg" : "S/P"}
          </div>
        </div>
        <span class="badge ${statusAnimalBadgeClass(a.status_atual)}" style="font-size: 10px;">${statusAnimalLabel(a.status_atual)}</span>
      </div>
    `).join("");
  }

  _bindFormulario(navigate) {
    const form = document.getElementById("triagem-form");
    const btnLimpar = document.getElementById("btn-limpar");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const dados = {
        nome: document.getElementById("animal-nome").value.trim(),
        especie: document.getElementById("animal-especie").value,
        raca: document.getElementById("animal-raca").value.trim(),
        porte: document.getElementById("animal-porte").value,
        sexo: document.getElementById("animal-sexo").value,
        idade_estimada: document.getElementById("animal-idade").value.trim() || "Não informada",
        peso_kg: parseFloat(document.getElementById("animal-peso").value) || 0,
        castrado: document.getElementById("animal-castrado").checked,
        vacinado: document.getElementById("animal-vacinado").checked,
        teste_zoonose: document.getElementById("animal-zoonose").value,
        status_atual: document.getElementById("animal-status").value,
        observacoes: document.getElementById("animal-obs").value.trim()
      };

      if (!dados.nome || !dados.especie) {
        showToast("Preencha nome e espécie.", "warning");
        return;
      }

      if (this.animalEmEdicaoId) {
        // Atualiza animal existente
        const resultado = await this.animalCtrl.atualizarDadosClinicos(this.animalEmEdicaoId, dados);
        // Atualiza também os dados não clínicos diretamente
        await this.animalCtrl.animalRepo.atualizar(this.animalEmEdicaoId, {
          nome: dados.nome,
          especie: dados.especie,
          raca: dados.raca,
          porte: dados.porte,
          sexo: dados.sexo,
          idade_estimada: dados.idade_estimada,
          foto_emoji: dados.especie === "gato" ? "🐈" : "🐕"
        });

        if (resultado.success) {
          showToast("Prontuário atualizado com sucesso.", "success");
          this.animalEmEdicaoId = null;
          this.render(navigate);
        } else {
          showToast(resultado.error, "error");
        }
      } else {
        // Cadastra novo animal
        const resultado = await this.animalCtrl.cadastrarAnimal(dados);
        if (resultado.success) {
          showToast("Animal cadastrado no CCZ.", "success");
          this.render(navigate);
        } else {
          showToast(resultado.error, "error");
        }
      }
    });

    btnLimpar.addEventListener("click", () => {
      form.reset();
      this.animalEmEdicaoId = null;
      document.getElementById("form-title").textContent = "Cadastrar Novo Animal";
      document.getElementById("btn-salvar").textContent = "Salvar Registro";
      document.querySelectorAll(".animal-list-item").forEach((i) => i.style.borderColor = "");
    });
  }

  _bindBusca() {
    const input = document.getElementById("animal-busca");
    input?.addEventListener("input", async (e) => {
      const termo = e.target.value.trim();
      const animais = termo ? await this.animalCtrl.buscar(termo) : await this.animalCtrl.listarTodos();
      document.getElementById("animals-list").innerHTML = this._renderListaAnimais(animais);
      this._bindAcaoSelecaoItem();
    });
  }

  _bindAcaoSelecaoItem() {
    document.querySelectorAll(".animal-list-item").forEach((item) => {
      item.addEventListener("click", async () => {
        const id = item.dataset.id;
        const animal = await this.animalCtrl.buscarPorId(id);
        if (!animal) return;

        this.animalEmEdicaoId = id;
        document.getElementById("form-title").textContent = `Atualizar: ${animal.nome}`;
        document.getElementById("btn-salvar").textContent = "Atualizar Registro";

        // Preenche formulário
        document.getElementById("animal-nome").value = animal.nome || "";
        document.getElementById("animal-especie").value = animal.especie || "";
        document.getElementById("animal-raca").value = animal.raca || "";
        document.getElementById("animal-porte").value = animal.porte || "medio";
        document.getElementById("animal-sexo").value = animal.sexo || "indefinido";
        document.getElementById("animal-idade").value = animal.idade_estimada || "";
        document.getElementById("animal-peso").value = animal.peso_kg || "";
        document.getElementById("animal-castrado").checked = !!animal.castrado;
        document.getElementById("animal-vacinado").checked = !!animal.vacinado;
        document.getElementById("animal-zoonose").value = animal.teste_zoonose || "pendente";
        document.getElementById("animal-status").value = animal.status_atual || "em_tratamento";
        document.getElementById("animal-obs").value = animal.observacoes || "";

        document.querySelectorAll(".animal-list-item").forEach((i) => i.style.borderColor = "");
        item.style.borderColor = "var(--purple)";
      });
    });
  }
}

export default TriagemView;
