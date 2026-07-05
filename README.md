# 🐾 SIMPATINHAS — Sistema Integrado de Monitoramento e Proteção Animal

> **MVP Web** projetado para mitigar a problemática do abandono de animais na Paraíba e prover dados estruturados ao Centro de Controle de Zoonoses (CCZ).

---

## 📋 Sobre o Projeto

O SIMPATINHAS é um sistema de monitoramento focado na integração de dois perfis de usuários:
1. **População (Cidadão)**: Pode cadastrar alertas/denúncias georreferenciadas ou de endereço sobre abandono/maus-tratos e visualizar a galeria de animais disponíveis para adoção, sabendo previamente o prontuário de saúde.
2. **Agentes do CCZ (Admin)**: Acessam o painel estatístico consolidado (total de resgates, índices de castração, e controle de zoonoses) e efetuam a triagem clínica (registro do peso, testes rápidos e controle de status do animal).

---

## 🚀 Como Rodar Localmente

O projeto foi construído usando **JavaScript Vanilla (ES Modules)**, o que exige um servidor HTTP local para contornar políticas de CORS do navegador.

### Passo 1: Iniciar Servidor Local
Navegue até a pasta do projeto e inicie o servidor:

```bash
# Utilizando o utilitário nativo npm
npx -y serve .
```

O projeto estará disponível no endereço: **http://localhost:3000**

### Passo 2: Credenciais de Acesso (Mock)
- **Perfil Cidadão**: `maria@email.com` / `maria123`
- **Agente CCZ (Admin)**: `agente@ccz.pb.gov.br` / `admin123`

*Dica: Na tela de login, basta clicar na caixa de demonstração inferior para preencher as credenciais de teste.*

---

## 🏛️ Padrões de Projeto Utilizados (Explicação Acadêmica)

Para a apresentação teórica de Padrões de Projeto (GoF), o código foi limpo e refatorado em duas estruturas fundamentais de banco de dados e persistência:

### 1. Singleton (Criacional)
**Classe Relacionada**: [Database.js](file:///C:/Users/Micro/.gemini/antigravity-ide/scratch/simpatinhas/js/models/Database.js)

O Singleton garante que o banco de dados local (gerenciado no `localStorage` do navegador) tenha **apenas uma única instância ativa** em toda a aplicação. 

```javascript
// js/models/Database.js

export class Database {
  // Atributo estático privado para guardar a instância na memória.
  static _instancia = null;

  constructor() {
    // PROTEÇÃO: Impede a instanciação com 'new Database()' caso já exista uma ativa.
    if (Database._instancia) {
      throw new Error("Use Database.getInstancia()");
    }
  }

  // PONTO DE ACESSO GLOBAL
  static getInstancia() {
    if (!Database._instancia) {
      Database._instancia = new Database();
    }
    return Database._instancia;
  }
}
```

### 2. Repository Pattern (Estrutural / Acesso a Dados)
**Classes Relacionadas**: [AnimalRepository.js](file:///C:/Users/Micro/.gemini/antigravity-ide/scratch/simpatinhas/js/repositories/AnimalRepository.js), [DenunciaRepository.js](file:///C:/Users/Micro/.gemini/antigravity-ide/scratch/simpatinhas/js/repositories/DenunciaRepository.js)

O Repository Pattern é utilizado para **abstrair e encapsular o acesso às tabelas** de Animais e Denúncias. 

Em vez de colocar código de banco de dados (`localStorage.setItem`, `JSON.parse`) dentro das views ou nos controladores, criamos métodos semânticos e orientados a coleções:

```javascript
// js/repositories/AnimalRepository.js

export class AnimalRepository {
  constructor() {
    // Obtém o ponto de acesso único através do Singleton
    this.db = Database.getInstancia();
    this.nomeTabela = "animais";
  }

  buscarTodos() {
    return this.db.lerTabela(this.nomeTabela);
  }

  cadastrar(dadosAnimal) {
    const lista = this.buscarTodos();
    lista.push(dadosAnimal);
    this.db.salvarTabela(this.nomeTabela, lista);
  }
}
```

**Por que o Repository é útil acadêmica e profissionalmente?**
Se no futuro o sistema migrar do `localStorage` para um banco real como Supabase, Postgres ou MySQL, **apenas as classes de Repository serão modificadas**. Todo o restante da aplicação (Views e Controllers) não sofrerá nenhuma linha de alteração.

---

## 📂 Arquitetura MVC Simplificada

A divisão de responsabilidades da aplicação segue a estrutura padrão MVC:

- **Model**: `Database.js` encapsula os dados e a lógica de armazenamento. Os `Repositories` atuam como intermediários da persistência.
- **View**: As classes dentro da pasta `views/` geram o template de HTML, monitoram eventos de tela dos usuários e apresentam feedback visual.
- **Controller**: Tratam a validação das regras de negócio e acionam os `Repositories` adequados para leitura ou escrita.
