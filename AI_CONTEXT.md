# Mapeamento e Contexto do Projeto (Instruções para a IA)

> **Instrução Especial para a IA / Assistente:** 
> SEMPRE leia este arquivo antes de propor mudanças arquiteturais profundas ou refatorações para entender o ecossistema, o design system, o modelo de banco de dados e as tecnologias envolvidas. A cada nova feature ou mudança estrutural importante neste projeto, certifique-se de **atualizar** e refletir as alterações neste arquivo.

## 1. Visão Geral do Projeto
- **Nome:** Gerenciador de Estoque de Carros - Leal Car (cars-stock)
- **Objetivo:** Sistema de gerenciamento de estoque, contendo backend para regras de negócio e CRUD de veículos e frontend consumindo essa API para interface do usuário.
- **Arquitetura:** Monorepo (Frontend e Backend isolados na raiz do projeto).
- **Implantação / Infraestrutura:** Aplicação containerizada usando Docker e Docker Compose, com CI/CD implementado via GitHub Actions.

## 2. Tecnologias Utilizadas
### 2.1 Backend (API)
- **Linguagem:** Python 3.10+
- **Framework Principal:** FastAPI (com uvicorn)
- **Validação e Tipagem:** Pydantic (Apenas para Schemas de Request/Response)
- **Testes:** Pytest (Configurados nos extra requirements `[dev]`)
- **Banco de Dados:** Supabase / PostgreSQL em nuvem (adaptador psycopg2) (Atenção: Os dados são manipulados via repositório/classes puras, usando Dataclasses) e credenciais lidas via `.env`.

### 2.2 Frontend (UI)
- **Linguagem:** TypeScript + React 19
- **Bundler:** Vite
- **Cliente HTTP:** Axios
- **Design System / Estilização:** 
  - TailwindCSS 4
  - Foundation Sites
  - Sass (SCSS)
- **Linters/Testes:** ESLint + TypeScript Compiler

### 2.3 Orquestração (Docker)
- `docker-compose.yml` raiz orquestrando `backend` e `frontend` (conectando externamente ao Supabase via credenciais locais).
- Uso de "hot-reload" local através de Volumes (`./backend:/app` e `./frontend:/app`).

## 3. Estrutura de Diretórios
```text
/cars-stock (Raiz do Monorepo)
├── AI_CONTEXT.md         # (ESTE ARQUIVO) Referência mestre e estado atual da aplicação
├── docker-compose.yml    # Orquestração local de multi-containers
├── .github/workflows/    # Esteiras de CI/CD 
├── start.sh / start.bat  # Scripts auxiliares de inicialização manual
├── backend/              # Serviço da API (Porta local: 8000)
│   ├── pyproject.toml    # Dependências do Python e scripts
│   ├── Dockerfile
│   ├── tests/            # Suite de testes
│   └── src/
│       ├── main.py             # Ponto de entrada FastAPI/Uvicorn
│       ├── controllers/        # Definição e agrupamento de Rotas/Endpoints do FastAPI
│       ├── services/           # Regras de Negócio e validações aprofundadas
│       ├── repositories/       # Conexão crua ao banco de dados e manipulação SQL (Padrão Repository)
│       └── schemas/            # Definição dos contratos HTTP via Pydantic (Inputs/Outputs)
└── frontend/             # Serviço da Web UI (Porta local: 5173)
    ├── package.json      # Dependências do Node e scripts Vite/TS/Lint
    ├── Dockerfile
    ├── vite.config.ts    
    └── src/
        ├── App.tsx             # Roteador Principal
        ├── main.tsx            # Ponto de inicialização do React DOM
        ├── pages/              # Telas inteiras da aplicação
        ├── components/         # Blocos de montar visuais reaproveitáveis (Cards, Botões)
        ├── services/           # Chamadas HTTP ao backend via Axios (Integração de APIs)
        └── styles/             # Definição do Design System, Tokens e entrypoints do SCSS
```

## 4. Regras de Negócio Principais (Domínio Padrão)
### Entidade Base Atual: `Car` (Carro/Veículo)
Atualmente o banco de dados armazena um inventário de carros e lida com a chave primária que é a placa do carro (`plate`).
* **Propriedades (Schema):**
  - `plate` (Placa do veículo, ex: ABC-1234 - string - **Chave Primária/Identificador único**)
  - `brand` (Marca - string)
  - `model` (Modelo - string)
  - `year` (Ano de Fabricação - inteiro)
  - `price` (Preço / Valor monetário - float)
  - `photo` (URL/caminho da foto para visualização na UI - string opcional)

### Fluxos Gerais
- Validações de criação rejeitam carros com a mesma placa (`plate`) que já existam.
- Os retornos são feitos usando formatação estrita do Pydantic (`CarResponse`).
- O sistema visualiza, adiciona, atualiza e remove veículos com base na placa. 

## 5. Padrões de Código Exigidos para a Assistência com IA
- **Manutenção do Monorepo:** Qualquer alteração que diga respeito unicamente ao cliente (`frontend`) NUNCA deve alterar arquivos de setup soltos na raiz, deve operar estritamente dentro de `/frontend/`. O mesmo vale pro backend.
- **Não crie classes ORM (Ex: SQLAlchemy) por conta própria**: Atualmente as entidades puras estão no repositório (`entities.py` - usando `dataclass`).  
- **Estilização Compartilhada:** Não use TailwindCSS de forma "espalhada" se a empresa usa tokens e mixins no SCSS/Foundation Sites. Combine ambos estrategicamente de acordo com o padrão que já existe dentro dos componentes React da aplicação.
- Ao atualizar ou escrever código Python, tipar os argumentos e as variáveis de retorno adequadamente.

> **Log de Alterações do Contexto:**
> - v1.0.0 (01/Abr/26): Criação do mapeamento de contexto, registro do Docker Compose e stack base FastAPI/React.
