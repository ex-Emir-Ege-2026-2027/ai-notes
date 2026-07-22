from fastapi import Depends, FastAPI

from app.core.security import TokenClaims, get_current_user
from app.routes import categories, files, notes

app = FastAPI()

app.include_router(notes.router)
app.include_router(categories.router)
app.include_router(files.router)

@app.get("/")
def root():
    return {"message": "Backend çalışıyor"}

@app.get("/me")
def me(user: TokenClaims = Depends(get_current_user)):
    return {
        "user_id": user.sub,
        "role": user.role,
        "exp": user.exp,
    }