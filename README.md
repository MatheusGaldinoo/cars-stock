# Sistema de Gerenciamento de Estoque de Carros

# Sistema da Concessionária Leal Car 🚗

Este é um projeto desenvolvido para a concessionária Leal Car, englobando um ecossistema completo (Backend API + Frontend Web).

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1. **`app/backend/`**: API construída com **FastAPI** e **SQLAlchemy** (SQLite).
2. **`app/frontend/`**: Interface web moderna construída com **React**, **Vite**, **TypeScript** e **Foundation CSS**.

---

## Como Rodar o Projeto

Para usar o sistema completo, você precisa rodar o servidor backend e o servidor frontend separadamente.

### 1. Rodando o Backend (API)
Abra um terminal, acesse a pasta `app/backend` e inicie o ambiente:

```bash
cd app/backend
# Se for a primeira vez e não tiver a venv, rode `python -m venv venv`
source venv/bin/activate
pip install -e "."

# Inicie o servidor FastAPI (a API rodará na porta 5000)
uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload
```
A API ficará disponível em: **http://localhost:5000**
Você pode acessar o Swagger da API em: **http://localhost:5000/docs**

---

### 2. Rodando o Frontend (Web)
Abra um **segundo terminal** (mantenha o backend rodando no primeiro), acesse a pasta `app/frontend` e inicie o Vite:

```bash
cd app/frontend

# Se for a primeira vez, instale as dependências:
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
A aplicação web ficará disponível em: **http://localhost:5173** (acesse pelo seu navegador!)

---

## Como Expor o Projeto na Internet (Usando Ngrok)

O [ngrok](https://ngrok.com/) permite que você crie URLs públicas seguras para servidores rodando na sua máquina local.

**Pré-requisitos:** Instale o ngrok e configure o seu token seguindo o painel deles (`ngrok config add-authtoken <TOKEN>`).

### 1. Expondo o Backend (API)
Abra um terminal e aponte o ngrok para a porta da API (5000):
```bash
```ngrok http 5000

O ngrok gerará uma URL pública (ex: `https://abcd-12-34.ngrok-free.app`). 
*(Importante: se você for hospedar o frontend remotamente ou em outra porta/domínio, precisará ir em `app/frontend/src/services/api.ts` e alterar a `baseURL` para essa URL pública gerada).*

### 2. Expondo o Frontend (React / Interface)
Para que outras pessoas possam ver a tela do sistema pelo celular ou outro PC, abra um **novo terminal** e aponte para a porta do Vite (5173):
```bash
ngrok http 5173
```
Pronto! Pegue a nova URL gerada pelo ngrok neste terminal e compartilhe com quem quiser. O sistema da concessionária Leal Car está online!