# Backend

## Pré-requisitos

- Python 3.10+

## Como executar

### 1. Entre no diretório do backend

```bash
cd backend
```

### 2. Crie e ative o ambiente virtual

```bash
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
# ou: .\venv\Scripts\Activate.ps1   # Windows
```

### 3. Instale as dependências

```bash
pip install -e ".[dev]"
```

### 4. Suba a API

```bash
uvicorn src.main:app --reload
```

- **Swagger:** http://localhost:8000/docs

### 5. Testes

```bash
pytest -v
```