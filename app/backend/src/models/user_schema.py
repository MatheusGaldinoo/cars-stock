from pydantic import BaseModel

class User(BaseModel):
    nome: str
    email: str
    senha: str