import pytest
from unittest.mock import MagicMock
from src.services import car_service
from src.schemas.car_schema import CarCreate

@pytest.fixture
def fresh_db_session():
    cursor = MagicMock()
    cursor.fetchall.return_value = []
    cursor.fetchone.return_value = None
    conn = MagicMock()
    conn.cursor.return_value = cursor
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    return conn

def test_service_create_car(fresh_db_session):
    cursor = fresh_db_session.cursor()
    cursor.fetchone.return_value = None
    
    car_data = CarCreate(
        plate="SERV1", brand="S", model="X", year=2021, price=100.0
    )
    result = car_service.create_car(fresh_db_session, car_data)
    assert result.plate == "SERV1"
    assert result.brand == "S"

def test_service_create_duplicate_plate(fresh_db_session):
    cursor = fresh_db_session.cursor()
    cursor.fetchone.return_value = ("DUP1", "D", "X", 2021, 100.0, None, True)
    
    car_data = CarCreate(
        plate="DUP1", brand="D", model="X", year=2021, price=100.0
    )
    
    with pytest.raises(ValueError) as exc:
        car_service.create_car(fresh_db_session, car_data)
    
    assert "já existe" in str(exc.value)

def test_service_search_car(fresh_db_session):
    cursor = fresh_db_session.cursor()
    cursor.fetchall.return_value = [("SRCH1", "S", "X", 2021, 100.0, None, True)]
    
    car_data = CarCreate(
        plate="SRCH1", brand="S", model="X", year=2021, price=100.0
    )
    car_service.create_car(fresh_db_session, car_data)
    
    result = car_service.search_car(fresh_db_session, "SRCH1")
    assert len(result) > 0
    assert result[0].plate == "SRCH1"

def test_service_search_not_found(fresh_db_session):
    cursor = fresh_db_session.cursor()
    cursor.fetchall.return_value = []
    
    result = car_service.search_car(fresh_db_session, "NONEXISTENT")
    assert result == []
