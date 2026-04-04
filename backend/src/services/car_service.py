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
        )
    return Car(plate=row[0], brand=row[1], model=row[2], year=row[3], price=float(row[4]), photo=row[5], available=row[6] if len(row) > 6 else True)

def list_cars(conn, plate: str | None = None):
    if plate:
        conn.execute("SELECT plate, brand, model, year, price, photo, available FROM cars WHERE plate LIKE %s", (f"%{plate}%",))
    else:
        conn.execute("SELECT plate, brand, model, year, price, photo, available FROM cars")
    
    rows = conn.fetchall()
    return [parse_row(row) for row in rows]


def create_car(conn, car_data):
    try:
        existing = get_car_internal(conn, car_data.plate)
        if existing:
            raise ValueError(f"Carro com placa {car_data.plate} já existe")
        
        conn.execute(
            "INSERT INTO cars (plate, brand, model, year, price, photo, available) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (car_data.plate, car_data.brand, car_data.model, car_data.year, car_data.price, car_data.photo, car_data.available)
        )
        conn.commit()
        return car_data
    except Exception as e:
        conn.rollback()
        raise e

def get_car_internal(conn, plate: str):
    conn.execute("SELECT plate, brand, model, year, price, photo, available FROM cars WHERE plate = %s", (plate,))
    row = conn.fetchone()
    if row:
        return parse_row(row)
    return None

def search_car(conn, plate: str) -> list[Car]:
    conn.execute("SELECT plate, brand, model, year, price, photo, available FROM cars WHERE plate LIKE %s", (f"%{plate}%",))
    rows = conn.fetchall()
    return [parse_row(row) for row in rows]

def update_car(conn, plate: str, car_data: dict):
    if not car_data:
        return get_car_internal(conn, plate)
        
    try:
        db_car = get_car_internal(conn, plate)
        if not db_car:
            return None
        
        fields = []
        values = []
        for key, value in car_data.items():
            fields.append(f"{key} = %s")
            values.append(value)
            
        if not fields:
            return db_car
            
        values.append(plate)
        query = f"UPDATE cars SET {', '.join(fields)} WHERE plate = %s"
        conn.execute(query, tuple(values))
        conn.commit()
        
        return get_car_internal(conn, plate)
    except Exception as e:
        conn.rollback()
        raise e

def delete_car(conn, plate: str):
    try:
        conn.execute("DELETE FROM cars WHERE plate = %s", (plate,))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        raise e
