from fastapi import APIRouter, Form, Request
from src.services import user_service as UserService
from src.models import user_schema as User
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="templates")

router = APIRouter(prefix="/users")

USUARIO = "admin"
SENHA = "1234"

@router.get("/login", response_class=HTMLResponse)
def tela_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
def fazer_login(username: str = Form(...), password: str = Form(...)):
    if username == USUARIO and password == SENHA:
        return RedirectResponse(url="/admin?acesso=liberado", status_code=302)
    else:
        return {"mensagem": "Senha ou usuário inválidos"}

@router.get("/admin", response_class=HTMLResponse)
def tela_admin(request: Request, acesso: str = ""):
    if acesso != "liberado":
        return {"erro": "Acesso negado"}

    return templates.TemplateResponse("admin.html", {"request": request})