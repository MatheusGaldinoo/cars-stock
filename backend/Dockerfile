## Dockerfile do Backend

# Usaremos a versão oficial e leve do Python 3.10
FROM python:3.10-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Atualiza o gerenciador de pacotes do Python
RUN pip install --upgrade pip

# Copia os arquivos de configuração de bibliotecas do seu projeto
COPY pyproject.toml ./
COPY . .

# Instala as dependências de desenvolvedor (fastapi, uvicorn, pytest, etc)
RUN pip install .


# Libera a porta 8000 para acesso
EXPOSE 8000
