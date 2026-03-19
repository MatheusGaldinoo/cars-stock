import json

ARQUIVO = "cars.json"

def salvar_carros(cars):
    with open(ARQUIVO, "w") as arquivo:
            json.dump(cars, arquivo, indent=4)

def carregar_carros():
    try:
        with open(ARQUIVO, "r") as arquivo:
            return json.load(arquivo)
    except FileNotFoundError:
        return []