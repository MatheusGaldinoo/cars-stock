# Sistema da Concessionária Leal Car 🚗

Este é um projeto desenvolvido para a concessionária Leal Car.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1. **`backend/`**: API construída com **FastAPI** e **SQLite**.
2. **`frontend/`**: Interface web moderna construída com **React**, **Vite** e **TypeScript**.
---

## Como Rodar o Projeto

Para usar o sistema completo no seu computador ou disponibilizá-lo para outros dispositivos pela internet, unificamos a execução.

Criamos um script automático para Windows que compila o frontend recém atualizado e levanta o servidor inteiro de uma vez só.

Para acessar a Leal Car de outro dispositivo, usaremos o **Ngrok** para tunelamento temporário seguro na web que redireciona direto para o seu PC.

**Passo a passo:**
1. Crie uma conta em [ngrok.com](https://ngrok.com) e baixe o aplicativo.
2. Inicie o sistema usando o `start.bat` (deixe a janela preta aberta rodando).
3. Abra **outro** terminal e execute o ngrok apontando para a porta do nosso sistema:
```cmd
ngrok http 8000
```
4. O ngrok vai gerar uma tela com um link que se parece com isso: `https://abcd-123-456.ngrok-free.app` (Forwarding).
5. Copie esse link e abra em qualquer dispositivo.

---
*Para desenvolvimento tradicional ou edição separada de cada pasta, consulte o README de cada diretório individual (`backend` e `frontend`).*
