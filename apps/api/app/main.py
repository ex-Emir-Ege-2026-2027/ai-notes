from fastapi import FastAPI
from app.auth import get_current_user, TokenClaims
from fastapi import Depends

app = FastAPI()

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