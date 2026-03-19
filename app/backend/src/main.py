from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.controllers import car_controller, user_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(car_controller.router)
app.include_router(user_controller.router)
