from fastapi import FastAPI

app = FastAPI(
    title="AI Notes API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "AI Notes Backend Çalışıyor 🚀"}