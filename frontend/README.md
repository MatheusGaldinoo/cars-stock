# Frontend - Interface Web Leal Car 🚗

Aqui ficam todas as telas e painéis visuais usados pela concessionária para gerenciar o sistema.

> **⚠️ RECOMENDAÇÃO:** Caso queira subir o sistema completo de uma vez, vá para a pasta raiz `cars-stock` e execute o comando `docker compose up`.

## Pré-requisitos (Apenas para execução Manual)

- [Node.js](https://nodejs.org/) (versão de 18 a 20+ recomendada)
- Certifique-se de que a API (`backend`) já está online para que as fotos e o estoque carreguem.

## Como Executar no modo Desenvolvedor

Se for trabalhar criando componentes React ou alterando estilos, rodar manualmente através do terminal é a melhor forma.

### 1. Entre no diretório do frontend

```bash
cd frontend
```

### 2. Baixe as dependências

Este comando baixa tudo o que o React precisa para funcionar a partir do `package.json`.
```bash
npm install
```

### 3. Inicie o servidor Interativo (Hot-Reload)
```bash
npm run dev
```

### 4. Acesse a Aplicação
Abra o seu navegador e acesse a URL que ficará verde no terminal (geralmente [http://localhost:5173](http://localhost:5173)). Qualquer alteração salva no código atualizará essa página instantaneamente.

### (Opcional) Compilar para Produção
Caso queira gerar a versão final minificada do seu site (para enviar para a Vercel/Netlify, ou servir via script):
```bash
npm run build
```
O código final do seu site aparecerá dentro da nova pasta `dist/`.
