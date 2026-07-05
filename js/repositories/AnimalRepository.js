/**
 * ============================================================================
 * SIMPATINHAS — AnimalRepository
 * ============================================================================
 * 
 * PADRÃO DE PROJETO: REPOSITORY PATTERN (Padrão de Persistência / Acesso a Dados)
 * 
 * O QUE É O REPOSITORY PATTERN?
 * O Repository funciona como um mediador entre a lógica de negócio do sistema 
 * (Controllers) e o local onde os dados são salvos (Database/LocalStorage).
 * Ele expõe métodos simples de coleção (como buscarTodos, cadastrar, atualizar) 
 * escondendo a complexidade técnica de como a leitura ou gravação de fato ocorre.
 * 
 * POR QUE ISSO É IMPORTANTE PARA A APRESENTAÇÃO DE PADRÕES DE PROJETO?
 * 1. Desacoplamento Absoluto: Os Controllers não sabem que estamos usando 
 *    localStorage. Para eles, o Repository é apenas uma "lista na memória". 
 *    Se no futuro precisarmos migrar para o Supabase, MySQL ou Firebase, 
 *    mudamos apenas o código interno deste arquivo, mantendo TODAS as Views 
 *    e Controllers intactos!
 * 2. Facilidade de Testes: Facilita a simulação dos dados (mocking) para testes.
 * 
 * COMO FUNCIONA ESTE CÓDIGO (EXPLICAÇÃO DIDÁTICA PARA A BANCA):
 * - O construtor obtém a única conexão ativa com o banco pelo Singleton (`Database.getInstancia()`).
 * - Métodos como `buscarTodos()` leem a tabela completa e retornam a lista.
 * - Métodos como `cadastrar()` adicionam um novo objeto à lista e re-gravam no banco.
 * - Métodos como `atualizar()` localizam o item por ID na lista obtida, alteram seus campos e salvam novamente.
 * ============================================================================
 */

import { Database } from "../models/Database.js";

export class AnimalRepository {
  constructor() {
    // 1. Obtemos a instância única (Singleton) do banco de dados para acesso aos registros.
    this.db = Database.getInstancia();
    this.nomeTabela = "animais";
  }

  /**
   * Retorna a lista completa de animais cadastrados.
   */
  buscarTodos() {
    // Busca a lista bruta (array) do banco através do Singleton.
    return this.db.lerTabela(this.nomeTabela);
  }

  /**
   * Busca um único animal pelo seu identificador (ID).
   */
  buscarPorId(id) {
    const lista = this.buscarTodos();
    // Usa a função .find do JavaScript para localizar o item correspondente.
    return lista.find((animal) => animal.id === id) || null;
  }

  /**
   * Filtra e retorna apenas os animais disponíveis para adoção.
   */
  buscarDisponiveisParaAdocao(filtros = {}) {
    let lista = this.buscarTodos();
    
    // Filtra apenas os animais com status "disponivel"
    lista = lista.filter((animal) => animal.status_atual === "disponivel");

    // Aplica filtro opcional de espécie (Cão/Gato)
    if (filtros.especie && filtros.especie !== "todos") {
      lista = lista.filter((animal) => animal.especie === filtros.especie);
    }

    // Aplica filtro opcional de porte (Pequeno/Médio/Grande)
    if (filtros.porte && filtros.porte !== "todos") {
      lista = lista.filter((animal) => animal.porte === filtros.porte);
    }

    return lista;
  }

  /**
   * Insere um novo animal no banco de dados.
   */
  cadastrar(dadosAnimal) {
    const lista = this.buscarTodos();

    // Cria o novo registro com ID e timestamps gerados na hora.
    const novoAnimal = {
      id: "ani_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      nome: dadosAnimal.nome || "Sem Nome",
      especie: dadosAnimal.especie || "outro",
      raca: dadosAnimal.raca || "SRD",
      porte: dadosAnimal.porte || "medio",
      sexo: dadosAnimal.sexo || "indefinido",
      idade_estimada: dadosAnimal.idade_estimada || "Não informada",
      peso_kg: parseFloat(dadosAnimal.peso_kg) || 0,
      status_atual: dadosAnimal.status_atual || "em_tratamento",
      castrado: !!dadosAnimal.castrado,
      vacinado: !!dadosAnimal.vacinado,
      teste_zoonose: dadosAnimal.teste_zoonose || "pendente",
      observacoes: dadosAnimal.observacoes || "",
      foto_emoji: dadosAnimal.especie === "gato" ? "🐈" : "🐕",
      data_cadastro: new Date().toISOString(),
    };

    // Adiciona o novo animal ao final do array.
    lista.push(novoAnimal);

    // Salva a lista inteira atualizada no banco através do Singleton.
    this.db.salvarTabela(this.nomeTabela, lista);

    return novoAnimal;
  }

  /**
   * Atualiza as informações clínicas ou cadastrais de um animal existente.
   */
  atualizar(id, novosDados) {
    const lista = this.buscarTodos();
    
    // Localiza o índice do animal na lista.
    const indice = lista.findIndex((animal) => animal.id === id);

    if (indice !== -1) {
      // Mescla os dados antigos com as novas alterações.
      lista[indice] = {
        ...lista[indice],
        ...novosDados,
        data_atualizacao: new Date().toISOString()
      };

      // Grava novamente a tabela inteira atualizada no banco.
      this.db.salvarTabela(this.nomeTabela, lista);
      return true;
    }

    return false;
  }

  /**
   * Calcula e retorna métricas gerais sobre os animais para o dashboard.
   */
  obterMetricas() {
    const todos = this.buscarTodos();
    
    const castrados = todos.filter((a) => a.castrado).length;
    const vacinados = todos.filter((a) => a.vacinado).length;
    const zoonosesAtivas = todos.filter((a) => a.teste_zoonose === "positivo").length;
    const disponiveis = todos.filter((a) => a.status_atual === "disponivel").length;
    const emTratamento = todos.filter((a) => a.status_atual === "em_tratamento").length;
    const adotados = todos.filter((a) => a.status_atual === "adotado").length;

    return {
      total: todos.length,
      castrados,
      vacinados,
      zoonosesAtivas,
      disponiveis,
      emTratamento,
      adotados,
      caes: todos.filter((a) => a.especie === "cachorro").length,
      gatos: todos.filter((a) => a.especie === "gato").length,
      outros: todos.filter((a) => a.especie === "outro").length
    };
  }
}

export default AnimalRepository;
