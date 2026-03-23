import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE cars RENAME COLUMN placa TO plate")
    cursor.execute("ALTER TABLE cars RENAME COLUMN marca TO brand")
    cursor.execute("ALTER TABLE cars RENAME COLUMN modelo TO model")
    cursor.execute("ALTER TABLE cars RENAME COLUMN ano TO year")
    cursor.execute("ALTER TABLE cars RENAME COLUMN preco TO price")
    cursor.execute("ALTER TABLE cars RENAME COLUMN foto TO photo")
    conn.commit()
    print("Colunas renomeadas com sucesso!")
except Exception as e:
    print(f"Erro: {e}")
    conn.rollback()
finally:
    cursor.close()
    conn.close()
