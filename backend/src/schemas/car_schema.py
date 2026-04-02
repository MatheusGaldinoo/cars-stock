from pydantic import BaseModel, ConfigDict
from typing import Optional

class CarBase(BaseModel):
    plate: str
    brand: str
    model: str
    year: int
    price: float
    photo: Optional[str] = None
    available: Optional[bool] = True

class CarCreate(CarBase):
    pass

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    photo: Optional[str] = None
    available: Optional[bool] = None

class CarResponse(CarBase):
    model_config = ConfigDict(from_attributes=True)