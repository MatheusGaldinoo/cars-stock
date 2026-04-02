from unittest.mock import MagicMock, patch

def test_create_car(client, mock_conn):
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn.cursor.return_value = mock_cursor
    
    car_data = {
        "plate": "TST1234",
        "brand": "Toyota",
        "model": "Corolla",
        "year": 2023,
        "price": 150000.0,
        "available": True
    }
    response = client.post("/cars/", json=car_data)
    assert response.status_code == 201
    assert response.json()["plate"] == "TST1234"

def test_list_cars(client):
    response = client.get("/cars/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_search_car(client, mock_conn):
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = [("SEARCH1", "X", "Y", 2020, 10.0, None, True)]
    mock_cursor.fetchone.return_value = ("SEARCH1", "X", "Y", 2020, 10.0, None, True)
    mock_conn.cursor.return_value = mock_cursor
    
    response = client.get("/cars/SEARCH1")
    assert response.status_code == 200
    assert response.json()["plate"] == "SEARCH1"

def test_search_car_not_found(client, mock_conn):
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_cursor.fetchone.return_value = None
    mock_conn.cursor.return_value = mock_cursor
    
    response = client.get("/cars/NONEXISTENT")
    assert response.status_code == 404
    assert response.json()["detail"] == "Car not found"

def test_delete_car(client, mock_conn):
    mock_cursor = MagicMock()
    mock_cursor.fetchone.return_value = None
    mock_conn.cursor.return_value = mock_cursor
    
    car_data = {
        "plate": "DEL123", "brand": "X", "model": "Y", "year": 2020, "price": 10.0
    }
    client.post("/cars/", json=car_data)
    
    response = client.delete(f"/cars/{car_data['plate']}")
    assert response.status_code == 204
