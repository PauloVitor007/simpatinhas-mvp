/**
 * ============================================================================
 * SIMPATINHAS — Database (Singleton Pattern)
 * ============================================================================
 * 
 * PADRÃO DE PROJETO: SINGLETON (GoF — Criacional)
 * 
 * O QUE É O SINGLETON?
 * É um padrão que garante que uma classe tenha apenas UMA única instância na 
 * memória durante todo o ciclo de vida da aplicação e fornece um ponto de 
 * acesso global a essa instância.
 * 
 * POR QUE ISSO É IMPORTANTE AQUI (CENTRO DE CONTROLE DE ZOONOSES)?
 * 1. Ponto de Verdade Único: Evita que diferentes partes do sistema acessem ou 
 *    salvem dados no localStorage de forma inconsistente.
 * 2. Controle de Conexão: Em um banco real (como MySQL, Postgres, Firebase), 
 *    criar múltiplas conexões consome memória e processamento. O Singleton 
 *    garante que usamos apenas uma conexão aberta.
 * 
 * COMO FUNCIONA ESTE CÓDIGO (EXPLICAÇÃO DIDÁTICA PARA A BANCA):
 * - A variável estática `_instancia` começa como `null`.
 * - O construtor (constructor) valida se alguém tentou fazer `new Database()`.
 *   Se já existir uma instância criada, ele impede lançando um erro.
 * - O método estático `getInstancia()` é o único caminho para obter o banco:
 *   -> Se a instância não existe ainda, ele a cria (`new Database()`).
 *   -> Se já existe, ele apenas retorna a instância que já estava na memória.
 * ============================================================================
 */

export class Database {
  // 1. Variável estática privada que guardará a ÚNICA instância da classe na memória.
  static _instancia = null;

  // Construtor executado ao instanciar a classe.
  constructor() {
    // 2. PROTEÇÃO DO SINGLETON: Se já houver uma instância na classe estática,
    // significa que alguém tentou usar "new Database()" de forma incorreta.
    if (Database._instancia) {
      throw new Error(
        "ERRO SINGLETON: Use Database.getInstancia() em vez de 'new Database()'. " +
        "Este padrão garante que tenhamos apenas uma conexão com o banco de dados."
      );
    }

    // 3. Inicializa nosso mecanismo de armazenamento (localStorage no navegador)
    this._prefixo = "simpatinhas_";
    this._inicializado = false;

    console.log("[Singleton Database] Instância única do Banco de Dados criada com sucesso.");
  }

  /**
   * 4. PONTO DE ACESSO GLOBAL: Método estático usado para obter a instância.
   * É este método que a aplicação inteira chamará para conversar com o banco.
   */
  static getInstancia() {
    // Se a instância ainda não existe, nós a criamos pela primeira e única vez.
    if (!Database._instancia) {
      Database._instancia = new Database();
    }
    // Retorna a instância única (existente ou recém-criada).
    return Database._instancia;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Métodos Simples de Acesso e Persistência (Sem complexidade de QueryBuilders)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Inicializa o banco de dados com dados padrão (se estiver vazio).
   */
  inicializar(dadosIniciais = {}) {
    if (this._inicializado) return;

    // Se não houver a flag de inicializado no localStorage, salvamos os dados iniciais
    if (!window.localStorage.getItem(this._prefixo + "inicializado")) {
      console.log("[Database] Populando banco de dados com dados de demonstração...");
      
      // Salva cada tabela padrão no localStorage
      for (const [tabela, registros] of Object.entries(dadosIniciais)) {
        this.salvarTabela(tabela, registros);
      }

      window.localStorage.setItem(this._prefixo + "inicializado", "true");
    }

    this._inicializado = true;
  }

  /**
   * Lê todos os registros de uma tabela específica.
   */
  lerTabela(nomeTabela) {
    const dadosBrutos = window.localStorage.getItem(this._prefixo + nomeTabela);
    return dadosBrutos ? JSON.parse(dadosBrutos) : [];
  }

  /**
   * Salva uma lista completa de registros em uma tabela específica.
   */
  salvarTabela(nomeTabela, registros) {
    window.localStorage.setItem(this._prefixo + nomeTabela, JSON.stringify(registros));
  }

  /**
   * Limpa completamente o banco de dados (reseta o localStorage).
   */
  resetar() {
    const chavesParaRemover = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const chave = window.localStorage.key(i);
      if (chave && chave.startsWith(this._prefixo)) {
        chavesParaRemover.push(chave);
      }
    }
    chavesParaRemover.forEach((chave) => window.localStorage.removeItem(chave));
    this._inicializado = false;
    console.log("[Database] Banco de dados resetado.");
  }
}

export default Database;
