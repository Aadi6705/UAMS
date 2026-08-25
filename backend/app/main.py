from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="University Academic Management System (UAMS)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.controllers import auth_controller

app.include_router(auth_controller.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to UAMS API"}
