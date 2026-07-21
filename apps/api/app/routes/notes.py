from fastapi import APIRouter, Depends

from app.core.security import TokenClaims, get_current_user
from app.services.note_service import get_notes

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


@router.get("/")
def read_notes(_current_user: TokenClaims = Depends(get_current_user)):
    return get_notes()