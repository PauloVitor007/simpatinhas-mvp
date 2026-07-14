/**
 * ============================================================================
 * SIMPATINHAS — DenunciaFormView
 * ============================================================================
 */

import { showToast, escapeHtml } from "../utils/helpers.js";

export class DenunciaFormView {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {
      tipo_denuncia: "",
      local_ocorrencia: "",
      lat: null,
      lng: null,
      descricao: "",
      foto_url: null
    };
  }

  /**
   * Renderiza o formulário multi-etapa.
   */
  render(onSubmit, navigate, currentUser) {
    this.currentStep = 1;
    this.formData = { tipo_denuncia: "", local_ocorrencia: "", lat: null, lng: null, descricao: "", foto_url: null };

    const content = document.getElementById("page-content");
    content.innerHTML = `
      <div class="fade-in" style="max-width: 600px; margin: 0 auto;">
        <div class="page-header">
          <button class="btn btn-ghost btn-sm mb-2" id="btn-voltar">← Voltar</button>
          <h1 class="page-title">Registrar Denúncia</h1>
          <p class="page-subtitle">Os dados fornecidos serão encaminhados de forma segura ao CCZ.</p>
        </div>

        <!-- Indicador de Etapa -->
        <div class="steps-indicator" id="steps-indicator">
          <div class="step-dot active" data-step="1"></div>
          <div class="step-connector"></div>
          <div class="step-dot" data-step="2"></div>
          <div class="step-connector"></div>
          <div class="step-dot" data-step="3"></div>
        </div>

        <!-- Conteúdo do Formulário -->
        <div class="card" id="step-content">
          ${this._renderStep1()}
        </div>

        <!-- Controle de Navegação -->
        <div class="flex justify-between mt-4" id="step-nav">
          <button class="btn btn-outline" id="btn-prev" style="visibility: hidden;">Anterior</button>
          <button class="btn btn-primary" id="btn-next">Próximo</button>
        </div>
      </div>
    `;

    document.getElementById("btn-voltar")?.addEventListener("click", () => navigate("home"));
    this._bindNavigation(onSubmit, navigate, currentUser);
  }

  _renderStep1() {
    return `
      <h3 class="mb-2" style="font-size: var(--text-base);">Selecione o Tipo da Ocorrência</h3>
      <p class="text-small text-muted mb-4">Escolha a categoria que melhor representa a denúncia.</p>
      
      <div class="flex flex-col gap-2" id="tipo-options">
        <label class="card card-clickable flex items-center gap-3" data-tipo="abandono" style="padding: var(--space-3);">
          <input type="radio" name="tipo" value="abandono" class="sr-only" ${this.formData.tipo_denuncia === "abandono" ? "checked" : ""}>
          <div style="font-weight: var(--font-semibold);">Abandono</div>
          <div class="text-small text-muted" style="margin-left: auto;">Animal deixado sem assistência</div>
        </label>
        <label class="card card-clickable flex items-center gap-3" data-tipo="maus_tratos" style="padding: var(--space-3);">
          <input type="radio" name="tipo" value="maus_tratos" class="sr-only" ${this.formData.tipo_denuncia === "maus_tratos" ? "checked" : ""}>
          <div style="font-weight: var(--font-semibold);">Maus-tratos</div>
          <div class="text-small text-muted" style="margin-left: auto;">Violência física ou restrição severa</div>
        </label>
        <label class="card card-clickable flex items-center gap-3" data-tipo="animal_ferido" style="padding: var(--space-3);">
          <input type="radio" name="tipo" value="animal_ferido" class="sr-only" ${this.formData.tipo_denuncia === "animal_ferido" ? "checked" : ""}>
          <div style="font-weight: var(--font-semibold);">Animal Ferido</div>
          <div class="text-small text-muted" style="margin-left: auto;">Animal debilitado ou acidentado</div>
        </label>
      </div>
      <span class="form-error" id="step1-error" style="display:none; margin-top: var(--space-2);">Por favor, selecione uma das opções.</span>
    `;
  }

  _renderStep2() {
    return `
      <h3 class="mb-2" style="font-size: var(--text-base);">Localização da Ocorrência</h3>
      <p class="text-small text-muted mb-4">Forneça o local exato para facilitar o resgate.</p>
      
      <div class="form-group" id="group-local">
        <label class="form-label" for="denuncia-local">Local / Endereço <span class="required">*</span></label>
        <div id="map" style="height: 250px; width: 100%; border-radius: 4px; margin-bottom: 8px; z-index: 1; border: 1px solid var(--border-color);"></div>
        <input 
          type="text" 
          id="denuncia-local" 
          class="form-input" 
          placeholder="Ex: Av. Epitácio Pessoa, 1500 (ou marque no mapa acima)"
          value="${escapeHtml(this.formData.local_ocorrencia)}"
        />
        <span class="form-error">Insira uma localização válida (mínimo de 5 caracteres).</span>
      </div>

      <div class="form-group">
        <label class="form-label" for="denuncia-descricao">Relato Detalhado</label>
        <textarea 
          id="denuncia-descricao" 
          class="form-textarea" 
          placeholder="Descreva detalhes como características do animal ou condição em que ele se encontra..."
        >${escapeHtml(this.formData.descricao)}</textarea>
      </div>
    `;
  }

  _renderStep3() {
    return `
      <h3 class="mb-2" style="font-size: var(--text-base);">Anexar Comprovação (Opcional)</h3>
      <p class="text-small text-muted mb-4">Caso possua foto da situação, anexe para agilizar a triagem do CCZ.</p>
      
      <div class="file-upload" id="file-upload-area">
        <div class="file-upload-text">Clique aqui para enviar imagem</div>
        <div class="file-upload-hint">Formatos suportados: JPG, PNG. Tamanho máximo: 5MB</div>
        <input type="file" id="denuncia-foto" accept="image/*" class="sr-only" />
        <div class="file-preview hidden" id="foto-preview" style="margin-top: var(--space-3);"></div>
      </div>

      <div class="card mt-4" style="background-color: var(--bg-alt);">
        <h4 style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: var(--space-2);">Dados da Denúncia</h4>
        <div style="font-size: var(--text-sm); line-height: 1.5;">
          <strong>Tipo:</strong> ${this._obterLabelTipo(this.formData.tipo_denuncia)}<br/>
          <strong>Local:</strong> ${escapeHtml(this.formData.local_ocorrencia) || (this.formData.lat ? "Coordenadas marcadas no mapa" : "—")}<br/>
          <strong>Relato:</strong> ${escapeHtml(this.formData.descricao) || "Nenhum relato fornecido"}
        </div>
      </div>
    `;
  }

  _bindNavigation(onSubmit, navigate, currentUser) {
    const prevBtn = document.getElementById("btn-prev");
    const nextBtn = document.getElementById("btn-next");

    nextBtn.addEventListener("click", () => {
      if (this._validarEtapa()) {
        this._salvarEtapa();

        if (this.currentStep < this.totalSteps) {
          this.currentStep++;
          this._atualizarEtapaUI();
        } else {
          // Finaliza e envia a denúncia
          nextBtn.classList.add("loading");
          nextBtn.disabled = true;

          onSubmit({
            ...this.formData,
            id_usuario: currentUser?.id || null
          }).then((resultado) => {
            if (resultado.success) {
              showToast("Denúncia cadastrada com sucesso.", "success");
              navigate("home");
            } else {
              showToast(resultado.error, "error");
              nextBtn.classList.remove("loading");
              nextBtn.disabled = false;
            }
          }).catch(err => {
            console.error(err);
            showToast("Erro ao processar denúncia.", "error");
            nextBtn.classList.remove("loading");
            nextBtn.disabled = false;
          });
        }
      }
    });

    prevBtn.addEventListener("click", () => {
      if (this.currentStep > 1) {
        this._salvarEtapa();
        this.currentStep--;
        this._atualizarEtapaUI();
      }
    });

    this._bindTipoSelecao();
  }

  _bindTipoSelecao() {
    const cards = document.querySelectorAll("#tipo-options .card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach((c) => c.style.borderColor = "");
        card.style.borderColor = "var(--purple)";
        const radio = card.querySelector('input[type="radio"]');
        radio.checked = true;
        this.formData.tipo_denuncia = radio.value;
        const error = document.getElementById("step1-error");
        if (error) error.style.display = "none";
      });
    });
  }

  _bindUpload() {
    const uploadArea = document.getElementById("file-upload-area");
    const input = document.getElementById("denuncia-foto");
    const preview = document.getElementById("foto-preview");

    if (!uploadArea) return;

    uploadArea.addEventListener("click", () => input.click());
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast("A imagem deve ter no máximo 5MB.", "warning");
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          this.formData.foto_url = ev.target.result;
          preview.innerHTML = `
            <img src="${ev.target.result}" alt="Preview" />
          `;
          preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  _validarEtapa() {
    if (this.currentStep === 1) {
      const checked = document.querySelector('input[name="tipo"]:checked');
      if (!checked && !this.formData.tipo_denuncia) {
        document.getElementById("step1-error").style.display = "block";
        return false;
      }
      if (checked) {
        this.formData.tipo_denuncia = checked.value;
      }
      return true;
    }

    if (this.currentStep === 2) {
      const local = document.getElementById("denuncia-local")?.value?.trim();
      if (!local || local.length < 5) {
        document.getElementById("group-local")?.classList.add("has-error");
        return false;
      }
      return true;
    }

    return true;
  }

  _salvarEtapa() {
    if (this.currentStep === 2) {
      this.formData.local_ocorrencia = document.getElementById("denuncia-local")?.value?.trim() || "";
      this.formData.descricao = document.getElementById("denuncia-descricao")?.value?.trim() || "";
    }
  }

  _atualizarEtapaUI() {
    const content = document.getElementById("step-content");
    const prevBtn = document.getElementById("btn-prev");
    const nextBtn = document.getElementById("btn-next");

    const dots = document.querySelectorAll(".step-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx + 1 === this.currentStep);
      dot.classList.toggle("completed", idx + 1 < this.currentStep);
    });

    const connectors = document.querySelectorAll(".step-connector");
    connectors.forEach((conn, idx) => {
      conn.classList.toggle("completed", idx + 1 < this.currentStep);
    });

    if (this.currentStep === 1) {
      content.innerHTML = this._renderStep1();
      this._bindTipoSelecao();
    } else if (this.currentStep === 2) {
      content.innerHTML = this._renderStep2();
      this._initMap();
    } else {
      content.innerHTML = this._renderStep3();
      this._bindUpload();
    }

    prevBtn.style.visibility = this.currentStep > 1 ? "visible" : "hidden";
    nextBtn.textContent = this.currentStep === this.totalSteps ? "Registrar Denúncia" : "Próximo";
  }

  _obterLabelTipo(tipo) {
    const labels = {
      abandono: "Abandono",
      maus_tratos: "Maus-tratos",
      animal_ferido: "Animal Ferido"
    };
    return labels[tipo] || "—";
  }

  _initMap() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer || typeof L === 'undefined') return;

    // Coordenadas centrais aproximadas de João Pessoa, PB
    const jpaCoords = [-7.11532, -34.86105];
    
    // Inicia o mapa
    const map = L.map('map').setView(this.formData.lat ? [this.formData.lat, this.formData.lng] : jpaCoords, 12);
    
    // TileLayer do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker = null;
    
    // Restaura marcador se já existia
    if (this.formData.lat && this.formData.lng) {
      marker = L.marker([this.formData.lat, this.formData.lng]).addTo(map);
    }

    // Adiciona evento de clique para marcar o local
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.formData.lat = lat;
      this.formData.lng = lng;
      
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      
      const inputLocal = document.getElementById("denuncia-local");
      if (inputLocal && !inputLocal.value.trim()) {
        inputLocal.value = "Localização marcada no mapa";
      }
      
      // Remove o estado de erro, se existir
      document.getElementById("group-local")?.classList.remove("has-error");
    });
    
    // Invalidate size para garantir que o Leaflet renderize corretamente os tiles em um display flex/block dinâmico
    setTimeout(() => { map.invalidateSize(); }, 100);
  }
}

export default DenunciaFormView;
