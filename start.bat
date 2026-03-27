@echo off
title Servidor Leal Car
color 0B

echo ===================================================
echo     INICIANDO GERENCIADOR DE ESTOQUE - LEAL CAR
echo ===================================================
echo.
echo [1/3] Compilando e gerando arquivos do Frontend...
cd frontend
call npm install
call npm run build
cd ..

echo.
echo [2/3] Preparando o Backend (Python)...
cd backend
IF NOT EXIST "venv\Scripts\activate.bat" GOTO erro_venv

call venv\Scripts\activate.bat
GOTO continuar

:erro_venv
echo [ERRO] Virtual environment (venv) nao encontrado!
echo Execute python -m venv venv e instale os requisitos.
pause
exit /b

:continuar

echo.
echo [3/3] Iniciando Servidor Principal...
echo O servidor estara rodando na porta 8000.
echo.
echo ===================================================
echo  ACESSO LOCAL: http://localhost:8000
echo  ACESSO WEB: Em outro terminal, execute:
echo              ngrok http 8000
echo ===================================================
echo.
echo Pressione CTRL+C para encerrar o servidor.
echo.

uvicorn src.main:app --host 0.0.0.0 --port 8000
