import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def get_db():
    return SupabaseConnection()

class SupabaseConnection:
    def __init__(self):
        self.base_url = f"{SUPABASE_URL}/rest/v1"
    
    def cursor(self):
        return self
    
    def execute(self, query, params=None):
        query_lower = query.strip().lower()
        
        if query_lower.startswith("select"):
            return self._execute_select(query, params)
        elif query_lower.startswith("insert"):
            return self._execute_insert(query, params)
        elif query_lower.startswith("update"):
            return self._execute_update(query, params)
        elif query_lower.startswith("delete"):
            return self._execute_delete(query, params)
        else:
            raise ValueError(f"Unsupported query: {query}")
    
    def _execute_select(self, query, params=None):
        where_clause = ""
        if "where" in query.lower():
            if "like" in query.lower():
                column = query.lower().split("where")[1].split("like")[0].strip()
                if params:
                    value = params[0].replace("%", "")
                    where_clause = f'?{column}=ilike.*%{value}%*'
            elif "=" in query.lower():
                parts = query.lower().split("where")[1].split("=")
                column = parts[0].strip()
                if params:
                    where_clause = f'?{column}=eq.{params[0]}'
        
        if "from cars" in query.lower():
            table = "cars"
        else:
            table = "unknown"
        
        url = f"{self.base_url}/{table}{where_clause}"
        response = requests.get(url, headers=HEADERS)
        
        if response.status_code == 200:
            self._result = response.json()
        else:
            raise Exception(f"Query failed: {response.text}")
    
    def _execute_insert(self, query, params=None):
        table_match = query.lower().split("insert")[1].split("into")[1].split("(")[0].strip()
        table = table_match
        
        columns_match = query.lower().split("(")[1].split(")")[0]
        columns = [c.strip() for c in columns_match.split(",")]
        
        data = {}
        if params:
            for i, col in enumerate(columns):
                data[col] = params[i]
        
        response = requests.post(f"{self.base_url}/{table}", headers=HEADERS, json=data)
        
        if response.status_code not in (200, 201):
            raise Exception(f"Insert failed: {response.text}")
        
        self._result = None
    
    def _execute_update(self, query, params=None):
        table = query.lower().split("update")[1].split("set")[0].strip()
        set_part = query.lower().split("set")[1].split("where")[0].strip()
        where_part = query.lower().split("where")[1].strip()
        
        set_columns = [s.strip().split("=")[0].strip() for s in set_part.split(",")]
        
        where_column = where_part.split("=")[0].strip()
        where_value = params[-1] if params else None
        
        update_data = {}
        if params:
            for i, col in enumerate(set_columns):
                update_data[col] = params[i]
        
        url = f"{self.base_url}/{table}?{where_column}=eq.{where_value}"
        response = requests.patch(url, headers=HEADERS, json=update_data)
        
        if response.status_code not in (200, 201):
            raise Exception(f"Update failed: {response.text}")
        
        self._result = None
    
    def _execute_delete(self, query, params=None):
        table = query.lower().split("from")[1].split("where")[0].strip()
        where_part = query.lower().split("where")[1].strip()
        
        where_column = where_part.split("=")[0].strip()
        where_value = params[0] if params else None
        
        url = f"{self.base_url}/{table}?{where_column}=eq.{where_value}"
        response = requests.delete(url, headers=HEADERS)
        
        if response.status_code not in (200, 204):
            raise Exception(f"Delete failed: {response.text}")
        
        self._result = None
    
    def fetchall(self):
        return self._result
    
    def fetchone(self):
        return self._result[0] if self._result else None
    
    def commit(self):
        pass
    
    def rollback(self):
        pass
    
    def close(self):
        pass
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

def close_pool():
    pass
