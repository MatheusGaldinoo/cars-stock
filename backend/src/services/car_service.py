from src.repositories.entities import Car

def parse_row(row):
    if isinstance(row, dict):
        return Car(
            plate=row.get("plate"),
            brand=row.get("brand"),
            model=row.get("model"),
            year=row.get("year"),
            price=float(row.get("price", 0)),
            photo=row.get("photo"),
            available=row.get("available", True)
        )
    return Car(plate=row[0], brand=row[1], model=row[2], year=row[3], price=float(row[4]), photo=row[5], available=row[6] if len(row) > 6 else True)

def list_cars(conn, plate: str | None = None):
    cursor = conn.cursor()
    try:
        if plate:
            cursor.execute("SELECT plate, brand, model, year, price, photo, available FROM cars WHERE plate LIKE %s", (f"%{plate}%",))
        else:
            cursor.execute("SELECT plate, brand, model, year, price, photo, available FROM cars")
        
        rows = cursor.fetchall()
        return [parse_row(row) for row in rows]
    finally:
        cursor.close()

def create_car(conn, car_data):
    cursor = conn.cursor()
    try:
        existing = get_car_internal(conn, car_data.plate)
        if existing:
            raise ValueError(f"Carro com placa {car_data.plate} já existe")
        
        cursor.execute(
            "INSERT INTO cars (plate, brand, model, year, price, photo, available) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (car_data.plate, car_data.brand, car_data.model, car_data.year, car_data.price, car_data.photo, car_data.available)
        )
        conn.commit()
        return car_data
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def get_car_internal(conn, plate: str):
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT plate, brand, model, year, price, photo, available FROM cars WHERE plate = %s", (plate,))
        row = cursor.fetchone()
        if row:
            return parse_row(row)
        return None
    finally:
        cursor.close()

def search_car(conn, plate: str) -> list[Car]:
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT plate, brand, model, year, price, photo, available FROM cars WHERE plate LIKE %s", (f"%{plate}%",))
        rows = cursor.fetchall()
        return [parse_row(row) for row in rows]
    finally:
        cursor.close()

def update_car(conn, plate: str, car_data: dict):
    cursor = conn.cursor()
    try:
        db_car = get_car_internal(conn, plate)
        if not db_car:
            return None
        
        for key, value in car_data.items():
            if value is not None:
                cursor.execute(f"UPDATE cars SET {key} = %s WHERE plate = %s", (value, plate))
        
        conn.commit()
        return get_car_internal(conn, plate)
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def delete_car(conn, plate: str):
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM cars WHERE plate = %s", (plate,))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
