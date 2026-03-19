from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src.controllers import car_controller
from src.repositories import database, entities
from fastapi.responses import JSONResponse

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

@app.exception_handler(ValueError)
async def value_error_handler(request, exc: ValueError):
    message = str(exc)
    status_code = 400
    if "não encontrado" in message.lower():
        status_code = 404
    return JSONResponse(status_code=status_code, content={"detail": message})

@app.exception_handler(PermissionError)
async def permission_error_handler(request, exc: PermissionError):
    return JSONResponse(status_code=403, content={"detail": str(exc)})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(car_controller.router)
