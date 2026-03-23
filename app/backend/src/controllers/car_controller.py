from fastapi import APIRouter, Form, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from src.repositories.database import get_db
from src.services import car_service
from src.schemas.car_schema import CarCreate, CarUpdate, CarResponse

router = APIRouter(prefix="/cars", tags=["cars"])


@router.get("/", response_model=list[CarResponse])
def list_cars(placa: str | None = None, db=Depends(get_db)):
    return car_service.list_cars(db, placa)


@router.post("/", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(car_data: CarCreate, db=Depends(get_db)):
    return car_service.create_car(db, car_data)


@router.get("/{placa}", response_model=CarResponse)
def search_car(placa: str, db=Depends(get_db)):
    return car_service.search_car(db, placa)


@router.patch("/{placa}", response_model=CarResponse)
def update_car(placa: str, car_data: CarUpdate, db=Depends(get_db)):
    return car_service.update_car(db, placa, car_data.model_dump(exclude_none=True))


@router.delete("/{placa}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(placa: str, db=Depends(get_db)):
    return car_service.delete_car(db, placa)
