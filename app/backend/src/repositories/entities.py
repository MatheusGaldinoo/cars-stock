from dataclasses import dataclass

@dataclass
class Car:
    placa: str
    marca: str
    modelo: str
    ano: int
    preco: float
    foto: str | None = None
