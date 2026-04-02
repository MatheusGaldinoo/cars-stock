# Sistema de Gerenciamento de Estoque de Carros 🚗

## Estrutura do Projeto

O projeto é dividido em duas partes principais, sob o modelo Monorepo:

1. **`backend/`**: API construída com **FastAPI (Python)** conectando a um Banco de Dados **Supabase (PostgreSQL na Nuvem)**.
2. **`frontend/`**: Interface web moderna construída com **React**, **Vite**, **TypeScript** e **Tailwind CSS**.

---

## Como Rodar o Projeto

A maneira mais fácil e moderna de executar todo o sistema é utilizando o **Docker**. Você não precisará ter o Python nem o Node instalados na sua máquina, e os containers se conectarão automaticamente ao seu Supabase.

**Passo a Passo:**
1. Instale o Docker (e o Docker Compose) no seu computador.
2. Abra o terminal na raiz do projeto (nesta mesma pasta) e digite:
```bash
docker compose up --build
```

3. Aguarde a inicialização.
   - Frontend: acesse [http://localhost:5173](http://localhost:5173)
   - Backend/API: acesso [http://localhost:8000](http://localhost:8000)


### Desenvolvimento Separado
Caso queira programar ativamente e utilizar os dois terminais abertos para ver alterações via hot-reload local:
Consulte a seção `Como executar` nos manuais individuais de cada pasta:
- [Instruções do Backend](./backend/README.md)
- [Instruções do Frontend](./frontend/README.md)

---

## Configuração de variáveis

O sistema utiliza o Supabase como banco de dados. Configure as variáveis de ambiente no arquivo `.env` do backend:
- `DATABASE_URL`: URL do seu projeto Supabase

No frontend, indique a API que a interface irá consumir. No nosso caso, a do Render:
- `BACKEND_URL`: URL do seu backend
