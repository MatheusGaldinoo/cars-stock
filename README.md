# Sistema da Concessionária Leal Car 🚗

Este é um projeto de gerenciamento de estoque de veículos desenvolvido para a concessionária Leal Car.

## Estrutura do Projeto

O projeto é dividido em duas partes principais, sob o modelo Monorepo:

1. **`backend/`**: API construída com **FastAPI** (Python) conectando a um Banco de Dados **Supabase (PostgreSQL na Nuvem)**.
2. **`frontend/`**: Interface web moderna construída com **React**, **Vite**, **TypeScript** e **Tailwind CSS**.

---

## Como Rodar o Projeto (Jeito Recomendado 🐳)

A maneira mais fácil e moderna de executar todo o sistema é utilizando o **Docker**. Você não precisará ter o Python nem o Node instalados na sua máquina, e os containers se conectarão automaticamente ao seu Supabase.

**Passo a Passo:**
1. Instale o Docker (e o Docker Compose) no seu computador.
2. Abra o terminal na raiz do projeto (nesta mesma pasta) e digite:
```bash
docker compose up --build
```
*(Se necessário, use `sudo` no Linux).*

3. Aguarde o download e inicialização. Pronto!
   - Frontend: acesse [http://localhost:5173](http://localhost:5173)
   - Backend/API: acesse [http://localhost:8000](http://localhost:8000)

**Nota:** O Docker foi configurado com *hot-reload*. Se você editar arquivos de código, o site e o servidor farão auto-refresh sem precisar reiniciar!

---

## Como Rodar o Projeto Manualmente (Modo Clássico)

Se você preferir executar o código diretamente no seu computador e já possui Python e Node instalados, você tem duas opções:

### Opção A: Usando o Script Rápido
Temos scripts criados para facilitar a inicialização. No terminal da raiz, execute:
- **Windows:** Dê dois cliques em `start.bat` ou rode no terminal `start.bat`.
- **Linux/Mac:** Rode no terminal `./start.sh`.
*(O script irá gerar o build do frontend e ligar a API em seguida).*

### Opção B: Desenvolvimento Separado
Caso queira programar ativamente e utilizar os dois terminais abertos para ver alterações via hot-reload local:
Consulte a seção `Como executar` nos manuais individuais de cada pasta:
- [Instruções do Backend](./backend/README.md)
- [Instruções do Frontend](./frontend/README.md)

---

## Como Acessar Fora de Casa (Ngrok)
Se precisar que um cliente acesse pelo celular dele o sistema rodando na sua máquina:
1. Deixe o projeto rodando através do Docker ou do Script Rápido.
2. Em um novo terminal, certifique-se de ter o `ngrok` instalado e rode:
```bash
ngrok http 8000
```
3. Copie a URL `https://xxxx.ngrok-free.app` gerada e envie!
