
from fastapi import APIRouter, Form
from src.services import car_service
from src.models import car_schema as Car

router = APIRouter(prefix="/cars")

@router.get("/")
def listar_carros():
    return car_service.get_all()

@router.post("/")
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

    result = car_service.create(car_data.dict())
    if "erro" in result:
        return result
    return {"mensagem": "Carro cadastrado com sucesso"}


@router.get("/{placa}")
def buscar_carro(placa: str):
    carro = car_service.get_by_placa(placa)
    if carro:
        return carro
    return {"erro": "Carro não encontrado"}


@router.patch("/{placa}")
def atualizar_carro(placa: str, dados: dict):
    carro = car_service.update(placa, dados)
    if carro:
        return carro
    return {"erro": "Carro não encontrado"}


@router.delete("/{placa}")
def deletar_carro(placa: str):
    if car_service.delete(placa):
        return {"mensagem": "Carro removido"}
    return {"erro": "Carro não encontrado"}

