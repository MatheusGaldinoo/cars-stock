from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.controllers import car_controller
from src.controllers import settings_controller
from fastapi.responses import JSONResponse

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

from fastapi.staticfiles import StaticFiles
import os

app.include_router(car_controller.router)
app.include_router(settings_controller.router)

dist_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="frontend")
else:
    print(f"Aviso: Pasta de produção do frontend não encontrada em {dist_path} (Rode npm run build no frontend)")
