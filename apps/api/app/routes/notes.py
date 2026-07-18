from fastapi import APIRouter
from app.services.note_service import get_notes

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


@router.get("/")
def read_notes():
    return get_notes()