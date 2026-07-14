import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Professor, aqui estamos aplicando o Padrão de Projeto Singleton.
// A classe Database gerencia uma única instância de conexão com o banco de dados.
// Nesta refatoração, passamos a inicializar a conexão com a nuvem do Firebase Cloud Firestore.
// Mantemos os métodos do localStorage legados para garantir compatibilidade com os outros repositórios.

export class Database {
  static _instancia = null;

  constructor() {
    if (Database._instancia) {
      throw new Error("Erro Singleton: Use Database.getInstancia()");
    }

    // Configurações do Firebase fornecidas
    const firebaseConfig = {
      apiKey: "AIzaSyBgfM-skVLDPy8DnHfwqy9BCy6mFXPwQSQ",
      authDomain: "conecta-impacto-9a1fb.firebaseapp.com",
      projectId: "conecta-impacto-9a1fb",
      storageBucket: "conecta-impacto-9a1fb.firebasestorage.app",
      messagingSenderId: "40059584226",
      appId: "1:40059584226:web:85ebdf610285cff6c8e8bb"
    };

    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    console.log("[Singleton] Conectado ao Firebase Cloud Firestore com sucesso!");

    this._prefixo = "simpatinhas_";
    this._inicializado = false;
  }

  static getInstancia() {
    if (!Database._instancia) {
      Database._instancia = new Database();
    }
    return Database._instancia;
  }

  getConexao() {
    return this.db;
  }

  // =========================================================================
  // Métodos mantidos para retrocompatibilidade com localStorage (Animais e Usuários)
  // =========================================================================

  inicializar(dadosIniciais = {}) {
    if (this._inicializado) return;

    if (!window.localStorage.getItem(this._prefixo + "inicializado")) {
      console.log("[Database] Populando localStorage com dados de demonstração...");
      for (const [tabela, registros] of Object.entries(dadosIniciais)) {
        this.salvarTabela(tabela, registros);
      }
      window.localStorage.setItem(this._prefixo + "inicializado", "true");
    }

    this._inicializado = true;
  }

  lerTabela(nomeTabela) {
    const dadosBrutos = window.localStorage.getItem(this._prefixo + nomeTabela);
    return dadosBrutos ? JSON.parse(dadosBrutos) : [];
  }

  salvarTabela(nomeTabela, registros) {
    window.localStorage.setItem(this._prefixo + nomeTabela, JSON.stringify(registros));
  }

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
    console.log("[Database] Banco de dados local resetado.");
  }
}

export default Database;
