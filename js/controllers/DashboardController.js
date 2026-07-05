/**
 * ============================================================================
 * SIMPATINHAS — DashboardController
 * ============================================================================
 */

import { AnimalRepository } from "../repositories/AnimalRepository.js";
import { DenunciaRepository } from "../repositories/DenunciaRepository.js";

export class DashboardController {
  constructor() {
    this.animalRepo = new AnimalRepository();
    this.denunciaRepo = new DenunciaRepository();
  }

  /**
   * Prepara o consolidado de dados para o painel de administração do CCZ.
   */
  obterPainelGeral() {
    const animalM = this.animalRepo.obterMetricas();
    const denunciaM = this.denunciaRepo.obterMetricas();

    return {
      // 4 cards de topo exigidos no MVP (Visual e Funcional)
      cards: [
        {
          titulo: "Total de Animais",
          valor: animalM.total,
          detalhe: `${animalM.disponiveis} disponíveis para adoção`,
          classeIcone: "purple",
          iconeUnicode: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
        },
        {
          titulo: "Animais Castrados",
          valor: animalM.castrados,
          detalhe: `${animalM.total > 0 ? Math.round((animalM.castrados / animalM.total) * 100) : 0}% do total resgatado`,
          classeIcone: "lime",
          iconeUnicode: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`
        },
        {
          titulo: "Casos de Zoonoses Ativos",
          valor: animalM.zoonosesAtivas,
          detalhe: "Testes rápidos positivos no CCZ",
          classeIcone: "danger",
          iconeUnicode: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
        },
        {
          titulo: "Denúncias Pendentes",
          valor: denunciaM.pendentes,
          detalhe: `${denunciaM.total} denúncias registradas no total`,
          classeIcone: "info",
          iconeUnicode: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
        }
      ],
      // Dados auxiliares para gráficos e listas
      denuncias: denunciaM,
      animais: animalM
    };
  }

  /**
   * Obtém a lista de denúncias recentes (exibidas na tabela principal do dashboard).
   */
  obterDenunciasRecentes(limite = 5) {
    const todas = this.denunciaRepo.buscarTodas();
    return todas.slice(0, limite);
  }
}

export default DashboardController;
