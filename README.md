# SIMPATINHAS: Sistema Integrado de Monitoramento e Proteção Animal

MVP Web desenvolvido para auxiliar no controle do abandono de animais na Paraíba, fornecendo dados estruturados para o Centro de Controle de Zoonoses (CCZ).

## Sobre o Projeto

O sistema integra a população e o poder público através de dois perfis de uso:

* População: Permite o cadastro de alertas georreferenciados sobre animais em risco, abandono ou maus-tratos. Também exibe a lista de animais disponíveis para adoção com seus respectivos prontuários de saúde.
* Agentes do CCZ: Fornece acesso a um painel administrativo com estatísticas de resgate, castração e controle de zoonoses, além de ferramentas para registro de triagem clínica.

## Como Rodar Localmente

O frontend foi desenvolvido em JavaScript Vanilla (ES Modules). Para evitar problemas de CORS no navegador durante a execução local, é necessário rodar um servidor HTTP.

### 1. Iniciar o servidor

Na pasta raiz do projeto, execute o comando abaixo no terminal:

```bash
npx -y serve .

```

O sistema ficará disponível no endereço http://localhost:3000.

### 2. Credenciais de teste

* Cidadão: maria@email.com / maria123
* Agente CCZ: agente@ccz.pb.gov.br / admin123

Na tela de login, há uma funcionalidade de preenchimento automático para facilitar o acesso aos dados de demonstração.

## Padrões de Projeto Aplicados

A arquitetura do MVP foi estruturada para avaliação na disciplina de Padrões de Projeto (GoF), com foco na separação de responsabilidades e controle de estado no frontend.

### 1. Singleton (Criacional)

O padrão Singleton foi aplicado na classe Database.js para garantir que o gerenciamento do localStorage possua um ponto único de acesso. Isso evita múltiplas instâncias concorrentes manipulando o estado da aplicação simultaneamente.

```javascript
// js/models/Database.js

export class Database {
  static _instancia = null;

  constructor() {
    if (Database._instancia) {
      throw new Error("Use Database.getInstancia()");
    }
  }

  static getInstancia() {
    if (!Database._instancia) {
      Database._instancia = new Database();
    }
    return Database._instancia;
  }
}

```

### 2. Repository Pattern (Estrutural)

Aplicado nas classes AnimalRepository.js e DenunciaRepository.js. O padrão isola a lógica de persistência e acesso aos dados (neste escopo, o localStorage) do restante da aplicação.

```javascript
// js/repositories/AnimalRepository.js

export class AnimalRepository {
  constructor() {
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

O uso do Repository garante que, em um cenário de escalabilidade onde o armazenamento local seja substituído por um banco de dados real em nuvem, as modificações fiquem restritas a essas classes, sem impacto nas Views ou Controllers.

## Arquitetura MVC

A organização do código fonte segue o padrão arquitetural MVC:

* Model: Representado pelo Database.js e Repositories, responsáveis pela estrutura e persistência dos dados.
* View: Classes encarregadas da renderização do DOM, captura de eventos dos usuários e feedback visual na interface.
* Controller: Camada intermediária que processa as ações enviadas pela View, valida regras de negócio e requisita operações aos Repositories.
