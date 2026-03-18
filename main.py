from fastapi import FastAPI
from schemas import car
from database import salvar_carros, carregar_carros
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Form

app = FastAPI()

#Cadastro do carro
cars = carregar_carros()

@app.post("/cars")
def criar_carro(
    placa: str = Form(...),
    modelo: str = Form(...),
    marca: str = Form(...),
    ano: int = Form(...),
    preco: float = Form(...),
    acesso: str = ""
):
    if acesso != "liberado":
        return {"erro": "Acesso negado"}
    
    novo_carro = {
        "placa": placa,
        "modelo": modelo,
        "marca": marca,
        "ano": ano,
        "preco": preco
    }
    cars.append(novo_carro)
    salvar_carros(cars)
    return {"mensagem": "Carro cadastrado com sucesso"}

#Buscar carro pela placa

@app.get("/cars/{placa}")
def buscar_carro(placa: str):
    cars = carregar_carros()
    placa_digitada = placa.upper()

    for carro in cars:
        if carro["placa"].upper() == placa_digitada:
            return carro
    return {"erro: Carro não encontrado"}

#Listando todos os carros

@app.get("/cars")
def listar_carros():
    return cars

#Editando o carro

@app.put("/cars/{placa}")
def atualizar_carro(placa: str, carro_atualizado: car):
    for i, carro in enumerate(cars):
        if carro["placa"].upper() == placa.upper():
            cars[i] = carro_atualizado
            salvar_carros(cars)
            return carro_atualizado
    return {"erro": "Carro não encontrado"}

#Deletando o carro

@app.delete("/cars/{placa}")
def deletar_carro(placa: str):
    for carro in cars:
        if carro["placa"].upper() == placa.upper():
            cars.remove(carro)
            return {"mensagem": "Carro removido"}
    return {"erro": "Carro não encontrado"}

#Configurar Templates
templates = Jinja2Templates(directory="templates")

#Rota da página
@app.get("/", response_class=HTMLResponse)
def pagina_inicial(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

#Rota de busca para o HTML
@app.get("/buscar", response_class=HTMLResponse)
def buscar_html(request: Request, placa: str):
    for carro in cars:
        if carro["placa"].upper == placa.upper():
            return templates.TemplateResponse(" resultado.html", {
             "request": request,
             "carro": carro
            })
    return HTMLResponse("Carro não encontrado")

#Rota de login para cadastro de carros

USUARIO = "admin"
SENHA = "1234"

@app.get("/login", response_class=HTMLResponse)
def tela_login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
def fazer_login(username: str = Form(...), password: str = Form(...)):
    if username == USUARIO and password == SENHA:
        return {"acesoo": "liberado"}
    else:
        return {"mensagem": "Senha ou usuário inválidos"}
    
#Página de cadastro de veículos

@app.get("/admin", response_class=HTMLResponse)
def tela_admin(request: Request, acesso: str = ""):
    if acesso != "liberado":
        return {"erro": "Acesso negado"}
    return templates.TemplateResponse("admin.html", {"request": request})