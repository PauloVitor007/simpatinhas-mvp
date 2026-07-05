/**
 * ============================================================================
 * SIMPATINHAS — UsuarioRepository
 * ============================================================================
 * 
 * Repository responsável pela leitura e autenticação de usuários do sistema.
 * ============================================================================
 */

import { Database } from "../models/Database.js";

export class UsuarioRepository {
  constructor() {
    this.db = Database.getInstancia();
    this.nomeTabela = "usuarios";
  }

  /**
   * Retorna a lista completa de usuários.
   */
  buscarTodos() {
    return this.db.lerTabela(this.nomeTabela);
  }

  /**
   * Busca um usuário pelo email.
   */
  buscarPorEmail(email) {
    const lista = this.buscarTodos();
    return lista.find((u) => u.email === email) || null;
  }

  /**
   * Valida as credenciais de login e retorna o perfil do usuário caso correto.
   */
  autenticar(email, senha) {
    const usuario = this.buscarPorEmail(email);
    
    // Simula validação clássica (em produção usaria bcrypt hash)
    if (usuario && usuario.senha_hash === senha) {
      // Retorna os dados do usuário ocultando a senha por segurança
      const { senha_hash, ...dadosSeguros } = usuario;
      return dadosSeguros;
    }

    return null;
  }
}

export default UsuarioRepository;
