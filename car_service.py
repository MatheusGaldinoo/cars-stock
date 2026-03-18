from database import carregar_carros, salvar_carros

def create_car(novo_carro):
    cars = carregar_carros()
    if get_car_by_placa(novo_carro["placa"]):
        return {"erro": "Carro com esta placa já existe"}
    cars.append(novo_carro)
    salvar_carros(cars)
    return novo_carro

def get_all_cars():
    return carregar_carros()

def get_car_by_placa(placa):
    cars = carregar_carros()
    for carro in cars:
        if carro["placa"].upper() == placa.upper():
            return carro
    return None

def update_car(placa, dados):
    cars = carregar_carros()
    for carro in cars:
        if carro["placa"].upper() == placa.upper():
            carro.update(dados)
            salvar_carros(cars)
            return carro
    return None

def delete_car(placa):
    cars = carregar_carros()
    for carro in cars:
        if carro["placa"].upper() == placa.upper():
            cars.remove(carro)
            salvar_carros(cars)
            return True
    return False