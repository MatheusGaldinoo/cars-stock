import pytest
from src.services import car_service
from src.schemas.car_schema import CarCreate

def test_service_create_car(db_session):
    car_data = CarCreate(
        plate="SERV1", brand="S", model="X", year=2021, price=100.0
    )
    result = car_service.create_car(db_session, car_data)
    assert result.plate == "SERV1"
    assert result.brand == "S"

def test_service_create_duplicate_plate(db_session):
    car_data = CarCreate(
        plate="DUP1", brand="D", model="X", year=2021, price=100.0
    )
    car_service.create_car(db_session, car_data)
    
    with pytest.raises(ValueError) as exc:
        car_service.create_car(db_session, car_data)
    
    assert "já existe" in str(exc.value)

def test_service_search_car(db_session):
    car_data = CarCreate(
        plate="SRCH1", brand="S", model="X", year=2021, price=100.0
    )
    car_service.create_car(db_session, car_data)
    
    result = car_service.search_car(db_session, "SRCH1")
    assert result.plate == "SRCH1"

def test_service_search_not_found(db_session):
    with pytest.raises(ValueError) as exc:
        car_service.search_car(db_session, "NONEXISTENT")
    assert "não encontrado" in str(exc.value)

def test_service_sell_car(db_session):
    car_data = CarCreate(
        plate="SELL_SRV", brand="S", model="X", year=2021, price=100.0, disponibilidade=True
    )
    car_service.create_car(db_session, car_data)
    
    result = car_service.sell_car(db_session, "SELL_SRV")
    assert result.disponibilidade is False
