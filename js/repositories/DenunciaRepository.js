/**
 * ============================================================================
 * SIMPATINHAS — DenunciaRepository
 * ============================================================================
 * 
 * PADRÃO DE PROJETO: REPOSITORY PATTERN (Padrão de Persistência / Acesso a Dados)
 * 
 * O QUE É O REPOSITORY PATTERN?
 * O Repository encapsula a lógica de recuperação, filtragem e persistência 
 * das denúncias no banco. Ele impede que as regras de negócio dos Controllers 
 * precisem lidar diretamente com formatos de armazenamento (localStorage).
 * 
 * COMO FUNCIONA ESTE CÓDIGO (EXPLICAÇÃO DIDÁTICA PARA A BANCA):
 * - O construtor obtém o banco via Singleton (`Database.getInstancia()`).
 * - Métodos como `buscarTodas()` leem os dados e aplicam ordenação simples de data.
 * - Métodos como `registrar()` geram um novo registro com status inicial "pendente".
 * - Métodos como `atualizarStatus()` modificam apenas o status de uma denúncia.
 * ============================================================================
 */

import { Database } from "../models/Database.js";

export class DenunciaRepository {
  constructor() {
    // 1. Obtemos a instância única (Singleton) do banco de dados para acesso aos registros.
    this.db = Database.getInstancia();
    this.nomeTabela = "denuncias";
  }

  /**
   * Retorna todas as denúncias ordenadas por data (mais recentes primeiro).
   */
  buscarTodas() {
    const lista = this.db.lerTabela(this.nomeTabela);
    // Ordena do mais novo ao mais antigo.
    return lista.sort((a, b) => new Date(b.data_registro) - new Date(a.data_registro));
  }

  /**
   * Busca denúncias com base em filtros de status ou tipo.
   */
  buscarComFiltros(filtros = {}) {
    let lista = this.buscarTodas();

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
   * Registra uma nova denúncia feita pela população.
   */
  registrar(dadosDenuncia) {
    const lista = this.buscarTodas();

    const novaDenuncia = {
      id: "den_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      id_usuario: dadosDenuncia.id_usuario || null,
      tipo_denuncia: dadosDenuncia.tipo_denuncia,
      local_ocorrencia: dadosDenuncia.local_ocorrencia,
      lat: dadosDenuncia.lat || null,
      lng: dadosDenuncia.lng || null,
      descricao: dadosDenuncia.descricao || "",
      foto_url: dadosDenuncia.foto_url || null,
      status_denuncia: "pendente", // Toda nova denúncia inicia como pendente
      data_registro: new Date().toISOString()
    };

    lista.push(novaDenuncia);

    // Salva de volta no banco usando o Singleton
    this.db.salvarTabela(this.nomeTabela, lista);

    return novaDenuncia;
  }

  /**
   * Atualiza o status clínico/operacional de uma denúncia (ex: CCZ atendendo).
   */
  atualizarStatus(id, novoStatus) {
    const lista = this.buscarTodas();
    const indice = lista.findIndex((d) => d.id === id);

    if (indice !== -1) {
      lista[indice].status_denuncia = novoStatus;
      this.db.salvarTabela(this.nomeTabela, lista);
      return true;
    }

    return false;
  }

  /**
   * Retorna métricas consolidadas sobre as denúncias para o painel CCZ.
   */
  obterMetricas() {
    const todas = this.buscarTodas();
    
    return {
      total: todas.length,
      pendentes: todas.filter((d) => d.status_denuncia === "pendente").length,
      emAndamento: todas.filter((d) => d.status_denuncia === "em_andamento").length,
      resolvidas: todas.filter((d) => d.status_denuncia === "resolvida").length,
      abandono: todas.filter((d) => d.tipo_denuncia === "abandono").length,
      mausTratos: todas.filter((d) => d.tipo_denuncia === "maus_tratos").length,
      animalFerido: todas.filter((d) => d.tipo_denuncia === "animal_ferido").length
    };
  }
}

export default DenunciaRepository;
