from fastapi import APIRouter, Depends, HTTPException

from app.core.security import TokenClaims, get_current_user
from app.services.note_service import (
    create_note,
    delete_note,
    get_note_by_id,
    get_notes,
    update_note,
)

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


@router.get("/")
def read_notes():
    return get_notes()


@router.get("/{note_id}")
def read_note(note_id: str):
    note = get_note_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.post("/")
def create_note_route(
    payload: dict,
    current_user: TokenClaims = Depends(get_current_user),
):
    title = payload.get("title")
    content = payload.get("content", "")
    category_id = payload.get("category_id")

    if not title:
        raise HTTPException(status_code=400, detail="title is required")

    return create_note(
        title=title,
        content=content,
        user_id=current_user.sub,
        category_id=category_id,
    )


@router.put("/{note_id}")
def update_note_route(
    note_id: str,
    payload: dict,
    _current_user: TokenClaims = Depends(get_current_user),
):
    if not payload:
        raise HTTPException(status_code=400, detail="Update payload cannot be empty")
    return update_note(note_id=note_id, data=payload)


@router.delete("/{note_id}")
def delete_note_route(
    note_id: str,
    _current_user: TokenClaims = Depends(get_current_user),
):
    return delete_note(note_id)