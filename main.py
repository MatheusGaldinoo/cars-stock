from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from schemas import car as CarSchema
from car_service import create_car, get_all_cars, update_car, delete_car, get_car_by_placa

app = FastAPI()

# Configurar Templates
templates = Jinja2Templates(directory="templates")

# =========================
# 🚗 API CRUD DE CARROS
# =========================

# Criar carro
@app.post("/cars")
def criar_carro(
    placa: str = Form(...),
    modelo: str = Form(...),
    marca: str = Form(...),
    ano: int = Form(...),
    preco: float = Form(...),
    disponibilidade: bool = Form(True),
    acesso: str = ""
):
    if acesso != "liberado":
        return {"erro": "Acesso negado"}
    
    car_data = CarSchema(
        placa=placa,
        modelo=modelo,
        marca=marca,
        ano=ano,
        preco=preco,
        disponibilidade=disponibilidade
    )

    result = create_car(car_data.dict())
    if "erro" in result:
        return result
    return {"mensagem": "Carro cadastrado com sucesso"}


# Buscar carro pela placa
@app.get("/cars/{placa}")
def buscar_carro(placa: str):
    carro = get_car_by_placa(placa)

    if carro:
        return carro

    return {"erro": "Carro não encontrado"}


# Listar todos os carros
@app.get("/cars")
def listar_carros():
    return get_all_cars()


# Atualizar carro (PATCH)
@app.patch("/cars/{placa}")
def atualizar_carro(placa: str, dados: dict):
    carro = update_car(placa, dados)

    if carro:
        return carro

    return {"erro": "Carro não encontrado"}


# Deletar carro
@app.delete("/cars/{placa}")
def deletar_carro(placa: str):
    if delete_car(placa):
        return {"mensagem": "Carro removido"}

    return {"erro": "Carro não encontrado"}


# =========================
# 🌐 FRONTEND ROUTES
# =========================

# Página inicial
@app.get("/", response_class=HTMLResponse)
def pagina_inicial(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# Busca pelo HTML
@app.get("/buscar", response_class=HTMLResponse)
def buscar_html(request: Request, placa: str):
    carro = get_car_by_placa(placa)

    if carro:
        return templates.TemplateResponse("resultado.html", {
            "request": request,
            "carro": carro
        })

    return templates.TemplateResponse("resultado.html", {
        "request": request,
        "carro": None,
        "erro": "Carro não encontrado"
    })


# =========================
# 🔐 AUTH ROUTES
# =========================

USUARIO = "admin"
SENHA = "1234"


@app.get("/login", response_class=HTMLResponse)
def tela_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login")
def fazer_login(username: str = Form(...), password: str = Form(...)):
    if username == USUARIO and password == SENHA:
        from fastapi.responses import RedirectResponse
        return RedirectResponse(url="/admin?acesso=liberado", status_code=302)
    else:
        return {"mensagem": "Senha ou usuário inválidos"}


# Página admin
@app.get("/admin", response_class=HTMLResponse)
def tela_admin(request: Request, acesso: str = ""):
    if acesso != "liberado":
        return {"erro": "Acesso negado"}

    return templates.TemplateResponse("admin.html", {"request": request})