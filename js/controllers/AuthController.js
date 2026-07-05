/**
 * ============================================================================
 * SIMPATINHAS — AuthController
 * ============================================================================
 */

import { UsuarioRepository } from "../repositories/UsuarioRepository.js";

export class AuthController {
  constructor() {
    this.usuarioRepo = new UsuarioRepository();
    this._sessaoChave = "simpatinhas_sessao";
  }

  /**
   * Tenta fazer o login do usuário.
   */
  login(email, senha) {
    if (!email || !senha) {
      return { success: false, error: "Preencha o email e a senha." };
    }

    const usuario = this.usuarioRepo.autenticar(email, senha);

    if (!usuario) {
      return { success: false, error: "Credenciais incorretas. Tente novamente." };
    }

    // Grava na sessão do navegador
    sessionStorage.setItem(this._sessaoChave, JSON.stringify(usuario));
    return { success: true, user: usuario };
  }

  /**
   * Destrói a sessão atual.
   */
  logout() {
    sessionStorage.removeItem(this._sessaoChave);
  }

  /**
   * Obtém os dados do usuário atualmente logado.
   */
  obterUsuarioLogado() {
    const dados = sessionStorage.getItem(this._sessaoChave);
    return dados ? JSON.parse(dados) : null;
  }

  /**
   * Verifica se há um usuário ativo logado no sistema.
   */
  estaAutenticado() {
    return this.obterUsuarioLogado() !== null;
  }

  /**
   * Verifica se o usuário ativo é administrador (Agente do CCZ).
   */
  ehAdmin() {
    const u = this.obterUsuarioLogado();
    return u?.tipo_perfil === "admin";
  }

  /**
   * Gera as iniciais do nome do usuário.
   */
  obterIniciais() {
    const u = this.obterUsuarioLogado();
    if (!u) return "?";
    const partes = u.nome_completo.split(" ");
    return (partes[0]?.[0] || "") + (partes[partes.length - 1]?.[0] || "");
  }
}

export default AuthController;
