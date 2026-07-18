from fastapi import FastAPI
from app.routes.notes import router as notes_router

app = FastAPI(
    title="AI Notes API",
    version="1.0.0"
)

app.include_router(notes_router)


@app.get("/")
def root():
    return {"message": "Backend çalışıyor!"}