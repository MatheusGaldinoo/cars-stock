# Backend

## Pré-requisitos

- Python 3.10+

## Como executar

### 1. Clone/entre na pasta do projeto

```bash
git clone https://github.com/rafaelalm-Leal/gerenciador-estoque-carros.git
cd gerenciador-estoque-carros
```

### 2. Crie e ative o ambiente virtual

```bash
python -m venv venv
source venv/bin/activate   # Linux/macOS
# ou: .\venv\Scripts\Activate.ps1   # Windows
```

### 3. Instale as dependências

```bash
pip install -e ".[dev]"
```

### 4. Suba a API

Na raiz do projeto:

```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

- **Swagger:** http://localhost:5000/docs

### 5. Testes

```bash
pytest -v
```