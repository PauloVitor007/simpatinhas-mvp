import { DenunciaRepository } from "../repositories/DenunciaRepository.js";

// Professor, este é o DenunciaController na arquitetura MVC.
// Ajustamos os seus métodos para serem assíncronos (async/await), visto que as chamadas
// ao repositório agora consultam dados na internet (Firebase Cloud Firestore).

export class DenunciaController {
  constructor() {
    this.denunciaRepo = new DenunciaRepository();
  }

  /**
   * Registra uma denúncia no banco através do Repository de forma assíncrona.
   */
  async registrarDenuncia(dados) {
    if (!dados.tipo_denuncia) {
      return { success: false, error: "Selecione o tipo de denúncia." };
    }
    if (!dados.local_ocorrencia || dados.local_ocorrencia.trim().length < 5) {
      return { success: false, error: "Informe o local (mínimo de 5 caracteres)." };
    }

    const denuncia = {
      id_usuario: dados.id_usuario || null,
      tipo_denuncia: dados.tipo_denuncia,
      local_ocorrencia: dados.local_ocorrencia,
      lat: dados.lat || null,
      lng: dados.lng || null,
      descricao: dados.descricao || "",
      foto_url: dados.foto_url || null,
      status_denuncia: "pendente",
      data_registro: new Date().toISOString()
    };

    // Chamada assíncrona com await
    const id = await this.denunciaRepo.salvar(denuncia);
    return { success: true, denuncia: { id, ...denuncia } };
  }

  /**
   * Retorna a lista de denúncias de acordo com filtros de administração.
   */
  async listarDenuncias(filtros = {}) {
    let lista = await this.denunciaRepo.buscarTodas();

    // Filtra por status (pendente, em_andamento, resolvida)
    if (filtros.status && filtros.status !== "todos") {
      lista = lista.filter((d) => d.status_denuncia === filtros.status);
    }

    // Filtra por tipo (abandono, maus_tratos, animal_ferido)
    if (filtros.tipo && filtros.tipo !== "todos") {
      lista = lista.filter((d) => d.tipo_denuncia === filtros.tipo);
    }

    // Filtra por termo de busca no local da ocorrência
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase();
      lista = lista.filter((d) => d.local_ocorrencia.toLowerCase().includes(termo));
    }

    return lista;
  }

  /**
   * Atualiza o status de tratamento de uma denúncia.
   */
  async atualizarStatus(id, novoStatus) {
    const atualizou = await this.denunciaRepo.atualizarStatus(id, novoStatus);
    if (atualizou) {
      return { success: true };
    }
    return { success: false, error: "Denúncia não localizada." };
  }

  /**
   * Retorna quantidade de denúncias com status "pendente" (geração de badges).
   */
  async obterQuantidadePendentes() {
    const metricas = await this.denunciaRepo.obterMetricas();
    return metricas.pendentes;
  }
}

export default DenunciaController;
