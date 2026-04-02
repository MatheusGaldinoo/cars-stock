import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

from src.main import app
from src.repositories.database import get_db

@pytest.fixture(scope="function")
def mock_conn():
    mock_connection = MagicMock()
    return mock_connection

@pytest.fixture(scope="function")
def client(mock_conn):
    with patch('src.repositories.database.get_db', return_value=mock_conn):
        with TestClient(app) as c:
            yield c

@pytest.fixture(scope="function")
def mock_cursor(mock_conn):
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value = mock_cursor
    return mock_cursor

@pytest.fixture(scope="function")
def db_session(mock_conn, mock_cursor):
    return mock_conn
