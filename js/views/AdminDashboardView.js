/**
 * ============================================================================
 * SIMPATINHAS — AdminDashboardView
 * ============================================================================
 */

import { DashboardController } from "../controllers/DashboardController.js";
import { DenunciaController } from "../controllers/DenunciaController.js";
import { 
  formatDate, timeAgo, tipoDenunciaLabel, 
  statusDenunciaLabel, statusDenunciaBadgeClass,
  showToast, escapeHtml
} from "../utils/helpers.js";

export class AdminDashboardView {
  constructor() {
    this.dashCtrl = new DashboardController();
    this.denunciaCtrl = new DenunciaController();
  }

  /**
   * Renderiza a visão geral do dashboard do CCZ.
   */
  render(navigate) {
    const dadosPainel = this.dashCtrl.obterPainelGeral();
    const denunciasRecentes = this.dashCtrl.obterDenunciasRecentes(5);

    const content = document.getElementById("page-content");
    content.innerHTML = `
      <div class="fade-in">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <h1 class="page-title">Painel de Monitoramento CCZ</h1>
              <p class="page-subtitle">Indicadores consolidados e triagem de ocorrências - Paraíba</p>
            </div>
            <button class="btn btn-primary" id="btn-nova-triagem">
              Cadastrar Triagem Clínica
            </button>
          </div>
        </div>

        <!-- Cards de Métricas -->
        <div class="dashboard-metrics">
          ${dadosPainel.cards.map((card) => `
            <div class="metric-card">
              <div class="metric-icon ${card.classeIcone}">${card.iconeUnicode}</div>
              <div class="metric-info">
                <div class="metric-value">${card.valor}</div>
                <div class="metric-label">${card.titulo}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 1px;">${card.detalhe}</div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Conteúdo Principal -->
        <div class="dashboard-grid">
          <!-- Tabela de Ocorrências -->
          <div>
            <div class="section-header" style="margin-bottom: var(--space-3);">
              <h2 class="card-title">Denúncias e Alertas Recentes</h2>
              <select class="form-select" id="filter-status" style="width: auto; padding: 2px 28px 2px 8px; font-size: var(--text-xs); border-radius: var(--radius-sm);">
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendentes</option>
                <option value="em_andamento">Em Atendimento</option>
                <option value="resolvida">Resolvidas</option>
              </select>
            </div>
            
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Localidade</th>
                    <th>Registro</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody id="denuncias-tbody">
                  ${this._renderLinhasDenuncia(denunciasRecentes)}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Estatísticas Extras & Gráficos -->
          <div>
            <div class="card mb-4">
              <h3 class="card-title" style="margin-bottom: var(--space-1);">Ocorrências por Categoria</h3>
              <span class="text-muted" style="font-size: 10px;">Proporção de chamados</span>
              
              <div class="bar-chart">
                ${this._renderGraficoOcorrencias(dadosPainel.denuncias)}
              </div>
            </div>

            <div class="card">
              <h3 class="card-title" style="margin-bottom: var(--space-3);">Resumo do Plantão</h3>
              <div class="flex flex-col gap-2" style="font-size: var(--text-xs);">
                <div class="flex justify-between items-center">
                  <span>Animais no CCZ (Em Tratamento)</span>
                  <span class="badge badge-warning">${dadosPainel.animais.emTratamento}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Animais Disponibilizados</span>
                  <span class="badge badge-success">${dadosPainel.animais.disponiveis}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span>Zoonoses Confirmadas</span>
                  <span class="badge badge-danger">${dadosPainel.animais.zoonosesAtivas}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-nova-triagem")?.addEventListener("click", () => navigate("triagem"));

    document.getElementById("filter-status")?.addEventListener("change", (e) => {
      const status = e.target.value;
      const filtrados = this.denunciaCtrl.listarDenuncias({ status });
      document.getElementById("denuncias-tbody").innerHTML = this._renderLinhasDenuncia(filtrados);
      this._bindAcoesStatus();
    });

    this._bindAcoesStatus();
  }

  _renderLinhasDenuncia(denuncias) {
    if (denuncias.length === 0) {
      return `
        <tr>
          <td colspan="5" class="text-center text-muted" style="padding: var(--space-6); font-size: var(--text-xs);">
            Nenhum registro localizado.
          </td>
        </tr>
      `;
    }

    return denuncias.map((d) => `
      <tr>
        <td>
          <span class="badge badge-neutral">${tipoDenunciaLabel(d.tipo_denuncia)}</span>
        </td>
        <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: var(--text-xs);">
          ${d.lat && d.lng ? 
            `<a href="https://www.openstreetmap.org/?mlat=${d.lat}&mlon=${d.lng}#map=15/${d.lat}/${d.lng}" target="_blank" style="color: var(--primary); text-decoration: underline;" title="${escapeHtml(d.local_ocorrencia)}">Lat: ${parseFloat(d.lat).toFixed(4)}, Lng: ${parseFloat(d.lng).toFixed(4)}</a>` 
            : escapeHtml(d.local_ocorrencia)
          }
        </td>
        <td style="white-space: nowrap; font-size: var(--text-xs);">
          ${timeAgo(d.data_registro)}
        </td>
        <td>
          <span class="badge ${statusDenunciaBadgeClass(d.status_denuncia)}">${statusDenunciaLabel(d.status_denuncia)}</span>
        </td>
        <td>
          <select class="form-select status-action" data-id="${d.id}" style="width: auto; padding: 2px 24px 2px 4px; font-size: 11px; border-radius: var(--radius-sm);">
            <option value="pendente" ${d.status_denuncia === "pendente" ? "selected" : ""}>Pendente</option>
            <option value="em_andamento" ${d.status_denuncia === "em_andamento" ? "selected" : ""}>Atendendo</option>
            <option value="resolvida" ${d.status_denuncia === "resolvida" ? "selected" : ""}>Resolvida</option>
          </select>
        </td>
      </tr>
    `).join("");
  }

  _renderGraficoOcorrencias(denuncias) {
    const total = denuncias.total || 1;
    const abdP = Math.round((denuncias.abandono / total) * 100);
    const mtP = Math.round((denuncias.mausTratos / total) * 100);
    const fP = Math.round((denuncias.animalFerido / total) * 100);

    return `
      <div class="bar-chart-item">
        <div class="bar-chart-value">${denuncias.abandono}</div>
        <div class="bar-chart-bar purple" style="height: ${Math.max(abdP, 4)}px;"></div>
        <div class="bar-chart-label">Abandono</div>
      </div>
      <div class="bar-chart-item">
        <div class="bar-chart-value">${denuncias.mausTratos}</div>
        <div class="bar-chart-bar info" style="height: ${Math.max(mtP, 4)}px;"></div>
        <div class="bar-chart-label">Maus-tratos</div>
      </div>
      <div class="bar-chart-item">
        <div class="bar-chart-value">${denuncias.animalFerido}</div>
        <div class="bar-chart-bar lime" style="height: ${Math.max(fP, 4)}px;"></div>
        <div class="bar-chart-label">Ferido</div>
      </div>
    `;
  }

  _bindAcoesStatus() {
    document.querySelectorAll(".status-action").forEach((select) => {
      select.addEventListener("change", (e) => {
        const id = e.target.dataset.id;
        const status = e.target.value;
        const result = this.denunciaCtrl.atualizarStatus(id, status);

        if (result.success) {
          showToast("Status da denúncia alterado.", "success");
          const row = e.target.closest("tr");
          const badge = row.querySelector("td:nth-child(4) .badge");
          if (badge) {
            badge.className = `badge ${statusDenunciaBadgeClass(status)}`;
            badge.textContent = statusDenunciaLabel(status);
          }
        }
      });
    });
  }
}

export default AdminDashboardView;
