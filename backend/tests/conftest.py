import pytest
import os
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

os.environ['SUPABASE_URL'] = 'http://test.supabase.co'
os.environ['SUPABASE_KEY'] = 'test-key'

from src.main import app

@pytest.fixture
def mock_conn():
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_cursor.fetchone.return_value = None
    
    conn = MagicMock()
    conn.cursor.return_value = conn
    conn.execute.return_value = None
    conn.fetchall.side_effect = lambda: mock_cursor.fetchall()
    conn.fetchone.side_effect = lambda: mock_cursor.fetchone()
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    
    # Store reference to internal cursor to allow tests to mock returned values
    conn._mock_cursor = mock_cursor
    return conn

@pytest.fixture
def client(mock_conn):
    with patch('src.controllers.car_controller.get_db', return_value=mock_conn):
        with TestClient(app) as c:
            yield c

@pytest.fixture
def fresh_db_session():
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_cursor.fetchone.return_value = None
    
    conn = MagicMock()
    conn.cursor.return_value = conn
    conn.fetchall.side_effect = lambda: mock_cursor.fetchall()
    conn.fetchone.side_effect = lambda: mock_cursor.fetchone()
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    
    conn._mock_cursor = mock_cursor
    return conn

@pytest.fixture
def db_session():
    mock_cursor = MagicMock()
    mock_cursor.fetchall.return_value = []
    mock_cursor.fetchone.return_value = None
    
    conn = MagicMock()
    conn.cursor.return_value = conn
    conn.fetchall.side_effect = lambda: mock_cursor.fetchall()
    conn.fetchone.side_effect = lambda: mock_cursor.fetchone()
    conn.__enter__ = lambda self: self
    conn.__exit__ = lambda self, *args: None
    
    conn._mock_cursor = mock_cursor
    return conn
