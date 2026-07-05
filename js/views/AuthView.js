/**
 * ============================================================================
 * SIMPATINHAS — AuthView (Login)
 * ============================================================================
 */

import { escapeHtml } from "../utils/helpers.js";

export class AuthView {
  /**
   * Renderiza a tela de login corporativo do CCZ / SIMPATINHAS.
   */
  render(onLogin) {
    const container = document.getElementById("app");
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <div class="login-header">
            <h1 class="login-title">SIMPA<span>TINHAS</span></h1>
            <p class="login-subtitle">Sistema Integrado de Monitoramento e Proteção Animal</p>
          </div>

          <form id="login-form" class="login-form" novalidate>
            <div class="form-group" id="group-email">
              <label class="form-label" for="login-email">Email</label>
              <input 
                type="email" 
                id="login-email" 
                class="form-input" 
                placeholder="nome@exemplo.com"
                required
              />
              <span class="form-error">Insira um e-mail válido.</span>
            </div>

            <div class="form-group" id="group-senha">
              <label class="form-label" for="login-senha">Senha</label>
              <input 
                type="password" 
                id="login-senha" 
                class="form-input" 
                placeholder="Senha de acesso"
                required
              />
              <span class="form-error">Insira a senha.</span>
            </div>

            <div id="login-error" class="alert alert-danger hidden">
              <span id="login-error-msg"></span>
            </div>

            <div style="margin-top: var(--space-4);">
              <button type="submit" id="login-btn" class="btn btn-primary w-full">
                Acessar Sistema
              </button>
            </div>
          </form>

          <div class="login-demo-info">
            <div class="login-demo-title">Demonstração de Acesso (Clique para alternar)</div>
            <div class="login-demo-credentials" id="demo-credentials-info">
              <strong>Cidadão:</strong> <code>maria@email.com</code> / <code>maria123</code><br/>
              <strong>Agente CCZ (Admin):</strong> <code>agente@ccz.pb.gov.br</code> / <code>admin123</code>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");
    const errorMsg = document.getElementById("login-error-msg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const senha = document.getElementById("login-senha").value;

      errorDiv.classList.add("hidden");
      document.getElementById("group-email").classList.remove("has-error");
      document.getElementById("group-senha").classList.remove("has-error");

      let valido = true;
      if (!email) {
        document.getElementById("group-email").classList.add("has-error");
        valido = false;
      }
      if (!senha) {
        document.getElementById("group-senha").classList.add("has-error");
        valido = false;
      }

      if (!valido) return;

      onLogin(email, senha);
    });

    // Clique facilitado nas credenciais de demonstração
    let alternarCredencial = false;
    container.querySelector(".login-demo-info").addEventListener("click", () => {
      alternarCredencial = !alternarCredencial;
      if (alternarCredencial) {
        document.getElementById("login-email").value = "agente@ccz.pb.gov.br";
        document.getElementById("login-senha").value = "admin123";
      } else {
        document.getElementById("login-email").value = "maria@email.com";
        document.getElementById("login-senha").value = "maria123";
      }
    });
  }

  showError(mensagem) {
    const errorDiv = document.getElementById("login-error");
    const errorMsg = document.getElementById("login-error-msg");
    if (errorDiv && errorMsg) {
      errorMsg.textContent = mensagem;
      errorDiv.classList.remove("hidden");
    }
  }
}

export default AuthView;
