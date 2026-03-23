from fastapi import APIRouter, status
from src.repositories.database import get_db
from src.services import car_service
from src.schemas.car_schema import CarCreate, CarUpdate, CarResponse

router = APIRouter(prefix="/cars", tags=["cars"])


@router.get("/", response_model=list[CarResponse])
def list_cars(plate: str | None = None):
    with get_db() as db:
        return car_service.list_cars(db, plate)


@router.post("/", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(car_data: CarCreate):
    with get_db() as db:
        return car_service.create_car(db, car_data)


@router.get("/{plate}", response_model=CarResponse)
def search_car(plate: str):
    with get_db() as db:
        return car_service.search_car(db, plate)


@router.patch("/{plate}", response_model=CarResponse)
def update_car(plate: str, car_data: CarUpdate):
    with get_db() as db:
        return car_service.update_car(db, plate, car_data.model_dump(exclude_none=True))


@router.delete("/{plate}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(plate: str):
    with get_db() as db:
        return car_service.delete_car(db, plate)
