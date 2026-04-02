import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db():
    return DatabaseConnection()

class DatabaseConnection:
    def __init__(self):
        self.conn = psycopg2.connect(DATABASE_URL)
        self._result = None
    
    def cursor(self):
        return self
    
    def execute(self, query, params=None):
        with self.conn.cursor() as cursor:
            cursor.execute(query, params)
            if query.strip().lower().startswith("select"):
                self._result = cursor.fetchall()
            else:
                self.conn.commit()
                self._result = None
    
    def fetchall(self):
        return self._result
    
    def fetchone(self):
        return self._result[0] if self._result else None
    
    def commit(self):
        self.conn.commit()
    
    def rollback(self):
        self.conn.rollback()
    
    def close(self):
        self.conn.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

def close_pool():
    pass
