import os
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
from contextlib import contextmanager

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/carros_db"
)

connection_pool = None

def init_pool():
    global connection_pool
    if connection_pool is None:
        connection_pool = pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=DATABASE_URL
        )

def get_connection():
    if connection_pool is None:
        init_pool()
    return connection_pool.getconn()

def release_connection(conn):
    if connection_pool and conn:
        connection_pool.putconn(conn)

@contextmanager
def get_db():
    conn = None
    try:
        conn = get_connection()
        yield conn
    finally:
        if conn:
            release_connection(conn)

def close_pool():
    global connection_pool
    if connection_pool:
        connection_pool.closeall()
        connection_pool = None
