from src.schemas.car_schema import CarResponse

def test_create_car(client):
    car_data = {
        "plate": "TST1234",
        "brand": "Toyota",
        "model": "Corolla",
        "year": 2023,
        "price": 150000.0,
        "disponibilidade": True
    }
    response = client.post("/cars/", json=car_data)
    assert response.status_code == 201
    assert response.json()["plate"] == "TST1234"

def test_list_cars(client):
    response = client.get("/cars/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_search_car(client):
    car_data = {
        "plate": "SEARCH1", "brand": "X", "model": "Y", "year": 2020, "price": 10.0
    }
    client.post("/cars/", json=car_data)
    
    response = client.get(f"/cars/{car_data['plate']}")
    assert response.status_code == 200
    assert response.json()["plate"] == car_data["plate"]

def test_search_car_not_found(client):
    response = client.get("/cars/NONEXISTENT")
    assert response.status_code == 404

def test_sell_car(client):
    car_data = {
        "plate": "SELL1", "brand": "X", "model": "Y", "year": 2020, "price": 10.0
    }
    client.post("/cars/", json=car_data)
    
    response = client.post(f"/cars/{car_data['plate']}/sell")
    assert response.status_code == 200
    assert response.json()["disponibilidade"] is False

def test_delete_car(client):
    car_data = {
        "plate": "DEL123", "brand": "X", "model": "Y", "year": 2020, "price": 10.0
    }
    client.post("/cars/", json=car_data)
    
    response = client.delete(f"/cars/{car_data['plate']}")
    assert response.status_code == 204
    
    # Verifica que sumiu
    search = client.get(f"/cars/{car_data['plate']}")
    assert search.status_code == 404
