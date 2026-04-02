import pytest
import os
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

os.environ['SUPABASE_URL'] = 'http://test.supabase.co'
os.environ['SUPABASE_KEY'] = 'test-key'

from src.main import app

@pytest.fixture
def mock_cursor():
    cursor = MagicMock()
    cursor.fetchall.return_value = []
    cursor.fetchone.return_value = None
    return cursor

@pytest.fixture
def mock_conn(mock_cursor):
    conn = MagicMock()
    conn.cursor.return_value = mock_cursor
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    return conn

@pytest.fixture
def client(mock_conn):
    with patch('src.controllers.car_controller.get_db', return_value=mock_conn):
        with TestClient(app) as c:
            yield c

@pytest.fixture
def fresh_db_session():
    cursor = MagicMock()
    cursor.fetchall.return_value = []
    cursor.fetchone.return_value = None
    conn = MagicMock()
    conn.cursor.return_value = cursor
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    return conn

@pytest.fixture
def db_session():
    cursor = MagicMock()
    cursor.fetchall.return_value = []
    cursor.fetchone.return_value = None
    conn = MagicMock()
    conn.cursor.return_value = cursor
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    return conn
