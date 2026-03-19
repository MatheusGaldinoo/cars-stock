from pydantic import BaseModel

class Car(BaseModel):
    placa: str
    marca: str
    modelo: str
    ano: int
    preco: float
    disponivel: bool = True
    foto: str