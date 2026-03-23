from src.repositories.entities import Car

def list_cars(conn, plate: str | None = None):
    cursor = conn.cursor()
    try:
        if plate:
            cursor.execute("SELECT plate, brand, model, year, price, photo FROM cars WHERE plate LIKE %s", (f"%{plate}%",))
        else:
            cursor.execute("SELECT plate, brand, model, year, price, photo FROM cars")
        
        rows = cursor.fetchall()
        return [Car(plate=row[0], brand=row[1], model=row[2], year=row[3], price=float(row[4]), photo=row[5]) for row in rows]
    finally:
        cursor.close()

def create_car(conn, car_data):
    cursor = conn.cursor()
    try:
        existing = get_car_internal(conn, car_data.placa)
        if existing:
            raise ValueError(f"Carro com placa {car_data.placa} já existe")
        
        cursor.execute(
            "INSERT INTO cars (placa, marca, modelo, ano, preco, foto) VALUES (%s, %s, %s, %s, %s, %s)",
            (car_data.placa, car_data.marca, car_data.modelo, car_data.ano, car_data.preco, car_data.foto)
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
        cursor.execute("SELECT plate, brand, model, year, price, photo FROM cars WHERE plate = %s", (plate,))
        row = cursor.fetchone()
        if row:
            return Car(plate=row[0], brand=row[1], model=row[2], year=row[3], price=float(row[4]), photo=row[5])
        return None
    finally:
        cursor.close()

def search_car(conn, placa: str) -> list[Car]:
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT placa, marca, modelo, ano, preco, foto FROM cars WHERE placa LIKE %s", (f"%{placa}%",))
        rows = cursor.fetchall()
        return [Car(placa=row[0], marca=row[1], modelo=row[2], ano=row[3], preco=float(row[4]), foto=row[5]) for row in rows]
    finally:
        cursor.close()

def update_car(conn, placa: str, car_data: dict):
    cursor = conn.cursor()
    try:
        db_car = get_car_internal(conn, placa)
        if not db_car:
            return None
        
        for key, value in car_data.items():
            if value is not None:
                cursor.execute(f"UPDATE cars SET {key} = %s WHERE placa = %s", (value, placa))
        
        conn.commit()
        return get_car_internal(conn, placa)
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()

def delete_car(conn, placa: str):
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM cars WHERE placa = %s", (placa,))
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
