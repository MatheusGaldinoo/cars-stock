# Backend - API Leal Car 🐍

Esta é a API que fornece as informações e gerencia o banco de dados do estoque.

> **⚠️ RECOMENDAÇÃO:** Se você não for editar ativamente o backend, recomendamos fortemente que você inicie o projeto na raiz através do comando `docker compose up --build`. Lembre-se de configurar o seu arquivo `.env` para que o container do backend se conecte ao seu Supabase na nuvem.

## Pré-requisitos (Apenas para execução Manual)

- Python 3.10+
- Um banco de dados Supabase operante com credenciais configuradas no `.env`.

## Como executar no modo Desenvolvedor

### 1. Entre no diretório do backend

```bash
cd backend
```

### 2. Crie e ative o ambiente virtual isolado

```bash
python3 -m venv venv
```
Para ativar no Linux/macOS:
```bash
source venv/bin/activate
```
Para ativar no Windows:
```cmd
.\venv\Scripts\activate
```

### 3. Instale as dependências

Instale os pacotes principais e as ferramentas de desenvolvedor (como o pytest):
```bash
pip install -e ".[dev]"
```

### 4. Suba a API
Inicie o servidor localmente com atualização automática a cada salvamento:
```bash
uvicorn src.main:app --reload
```

- **Para testar a API (Swagger):** Abra [http://localhost:8000/docs](http://localhost:8000/docs)

### 5. Executar os Testes Automatizados

Caso tenha alterado lógicas e deseja garantir que nada foi quebrado:
```bash
pytest -v
```