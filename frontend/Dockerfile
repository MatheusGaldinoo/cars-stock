## Dockerfile do Frontend

# Usaremos a versão oficial e leve do Node.js versão 20
FROM node:20-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos que listam as bibliotecas (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências do Node (npm install)
RUN npm install

# Copia o restante do código
COPY . .

# Libera a porta 5173 usada pelo Vite
EXPOSE 5173
