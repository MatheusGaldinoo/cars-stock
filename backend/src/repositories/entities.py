from dataclasses import dataclass

@dataclass
class Car:
    plate: str
    brand: str
    model: str
    year: int
    price: float
    photo: str | None = None
    available: bool = True
