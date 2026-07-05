/**
 * ============================================================================
 * SIMPATINHAS — DenunciaController
 * ============================================================================
 */

import { DenunciaRepository } from "../repositories/DenunciaRepository.js";

export class DenunciaController {
  constructor() {
    this.denunciaRepo = new DenunciaRepository();
  }

  /**
   * Registra uma denúncia no banco através do Repository.
   */
  registrarDenuncia(dados) {
    if (!dados.tipo_denuncia) {
      return { success: false, error: "Selecione o tipo de denúncia." };
    }
    if (!dados.local_ocorrencia || dados.local_ocorrencia.trim().length < 5) {
      return { success: false, error: "Informe o local (mínimo de 5 caracteres)." };
    }

    const denuncia = this.denunciaRepo.registrar(dados);
    return { success: true, denuncia };
  }

  /**
   * Retorna a lista de denúncias de acordo com filtros de administração.
   */
  listarDenuncias(filtros = {}) {
    return this.denunciaRepo.buscarComFiltros(filtros);
  }

  /**
   * Atualiza o status de tratamento de uma denúncia.
   */
  atualizarStatus(id, novoStatus) {
    const atualizou = this.denunciaRepo.atualizarStatus(id, novoStatus);
    if (atualizou) {
      return { success: true };
    }
    return { success: false, error: "Denúncia não localizada." };
  }

  /**
   * Retorna quantidade de denúncias com status "pendente" (geração de badges).
   */
  obterQuantidadePendentes() {
    return this.denunciaRepo.obterMetricas().pendentes;
  }
}

export default DenunciaController;
