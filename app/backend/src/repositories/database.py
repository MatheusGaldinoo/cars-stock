import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARQUIVO = os.path.join(BASE_DIR, "cars.json")

def salvar_carros(cars):
    with open(ARQUIVO, "w") as arquivo:
            json.dump(cars, arquivo, indent=4)

def carregar_carros():
    try:
        with open(ARQUIVO, "r") as arquivo:
            return json.load(arquivo)
    except (FileNotFoundError, json.JSONDecodeError):
        return []