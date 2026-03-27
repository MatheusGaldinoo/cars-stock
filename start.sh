#!/usr/bin/env bash
set -e

echo "==================================================="
echo "    INICIANDO GERENCIADOR DE ESTOQUE - LEAL CAR"
echo "==================================================="
echo

echo "[1/3] Compilando e gerando arquivos do Frontend..."
cd frontend
npm install
npm run build
cd ..

echo
echo "[2/3] Preparando o Backend (Python)..."
cd backend

if [ ! -f "venv/bin/activate" ]; then
    echo "[ERRO] Virtual environment (venv) não encontrado!"
    echo "Execute: python3 -m venv venv && source venv/bin/activate && pip install -e '.[dev]'"
    exit 1
fi

source venv/bin/activate

echo
echo "[3/3] Iniciando Servidor Principal..."
echo "O servidor estará rodando na porta 8000."
echo
echo "==================================================="
echo " ACESSO LOCAL: http://localhost:8000"
echo " ACESSO WEB: Em outro terminal, execute:"
echo "              ngrok http 8000"
echo "==================================================="
echo
echo "Pressione CTRL+C para encerrar o servidor."
echo

uvicorn src.main:app --host 0.0.0.0 --port 8000
