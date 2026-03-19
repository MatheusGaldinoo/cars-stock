import os
from fastapi import APIRouter, Form
from src.services import user_service as UserService
from src.models import user_schema as User

router = APIRouter()

USUARIO = "admin"
SENHA = "1234"

@router.get("/login")
def tela_login():
    return {"mensagem": "Por favor, faça login com POST /login enviando 'username' e 'password' via form-data."}

@router.post("/login")
def fazer_login(username: str = Form(...), password: str = Form(...)):
    if username == USUARIO and password == SENHA:
        return {"mensagem": "Login realizado com sucesso", "acesso": "liberado"}
    else:
        return {"mensagem": "Senha ou usuário inválidos"}

@router.get("/admin")
def tela_admin(acesso: str = ""):
    if acesso != "liberado":
        return {"erro": "Acesso negado"}

    return {"mensagem": "Bem-vindo à área administrativa"}