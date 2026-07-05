/**
 * ============================================================================
 * SIMPATINHAS — AnimalController
 * ============================================================================
 */

import { AnimalRepository } from "../repositories/AnimalRepository.js";

export class AnimalController {
  constructor() {
    this.animalRepo = new AnimalRepository();
  }

  /**
   * Retorna animais disponíveis para adoção baseados em filtros de busca.
   */
  listarParaAdocao(filtros = {}) {
    return this.animalRepo.buscarDisponiveisParaAdocao(filtros);
  }

  /**
   * Retorna a lista geral de animais.
   */
  listarTodos() {
    return this.animalRepo.buscarTodos();
  }

  /**
   * Busca um animal específico pelo ID.
   */
  buscarPorId(id) {
    return this.animalRepo.buscarPorId(id);
  }

  /**
   * Registra a entrada de um novo animal na triagem clínica.
   */
  cadastrarAnimal(dados) {
    if (!dados.nome || !dados.especie) {
      return { success: false, error: "Nome e espécie são obrigatórios." };
    }
    const animal = this.animalRepo.cadastrar(dados);
    return { success: true, animal };
  }

  /**
   * Atualiza dados de triagem clínica do animal resgatado.
   */
  atualizarDadosClinicos(id, dadosClinicos) {
    const atualizou = this.animalRepo.atualizar(id, dadosClinicos);
    if (atualizou) {
      return { success: true };
    }
    return { success: false, error: "Animal não encontrado." };
  }

  /**
   * Busca por nome ou observações (filtro de busca textual).
   */
  buscar(termo) {
    const lista = this.listarTodos();
    const termoMin = termo.toLowerCase();
    return lista.filter(
      (a) =>
        a.nome.toLowerCase().includes(termoMin) ||
        a.raca.toLowerCase().includes(termoMin) ||
        a.observacoes.toLowerCase().includes(termoMin)
    );
  }

  /**
   * Obtém métricas gerais de animais para o CCZ.
   */
  obterMetricas() {
    return this.animalRepo.obterMetricas();
  }
}

export default AnimalController;
