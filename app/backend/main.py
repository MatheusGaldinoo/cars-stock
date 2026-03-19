from fastapi import FastAPI
from src.controllers import car_controller, user_controller

app = FastAPI()

app.include_router(car_controller.router)
app.include_router(user_controller.router)
