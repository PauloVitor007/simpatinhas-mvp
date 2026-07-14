import { AnimalRepository } from "../repositories/AnimalRepository.js";

export class AnimalController {
  constructor() {
    this.animalRepo = new AnimalRepository();
  }

  async listarParaAdocao(filtros = {}) {
    return await this.animalRepo.buscarDisponiveisParaAdocao(filtros);
  }

  async listarTodos() {
    return await this.animalRepo.buscarTodos();
  }

  async buscarPorId(id) {
    return await this.animalRepo.buscarPorId(id);
  }

  async cadastrarAnimal(dados) {
    if (!dados.nome || !dados.especie) {
      return { success: false, error: "Nome e espécie são obrigatórios." };
    }
    const id = await this.animalRepo.cadastrar(dados);
    return { success: true, animal: { id, ...dados } };
  }

  async atualizarDadosClinicos(id, dadosClinicos) {
    const atualizou = await this.animalRepo.atualizar(id, dadosClinicos);
    if (atualizou) {
      return { success: true };
    }
    return { success: false, error: "Animal não encontrado." };
  }

  async buscar(termo) {
    const lista = await this.listarTodos();
    const termoMin = termo.toLowerCase();
    return lista.filter(
      (a) =>
        a.nome.toLowerCase().includes(termoMin) ||
        a.raca.toLowerCase().includes(termoMin) ||
        a.observacoes.toLowerCase().includes(termoMin)
    );
  }

  async obterMetricas() {
    return await this.animalRepo.obterMetricas();
  }
}

export default AnimalController;
