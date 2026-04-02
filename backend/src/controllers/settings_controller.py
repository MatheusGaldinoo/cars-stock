from fastapi import APIRouter

router = APIRouter(tags=["company"])

@router.get("/settings")
def get_settings():
    from src.repositories.database import get_db
    
    with get_db() as db:
        db.execute("SELECT id, name, logo_url, admin_password FROM company_settings LIMIT 1")
        result = db.fetchone()
        
        if result:
            return {
                "id": result[0],
                "name": result[1],
                "logo_url": result[2],
                "admin_password": result[3]
            }
        return {"name": "Estoque", "logo_url": None, "admin_password": None}