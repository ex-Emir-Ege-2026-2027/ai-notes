from fastapi import APIRouter, Depends, HTTPException

from app.core.security import TokenClaims, get_current_user
from app.services.category_service import (
	create_category,
	delete_category,
	get_categories,
	get_category_by_id,
	update_category,
)

router = APIRouter(
	prefix="/categories",
	tags=["Categories"],
)


@router.get("/")
def read_categories():
	return get_categories()


@router.get("/{category_id}")
def read_category(category_id: str):
	category = get_category_by_id(category_id)
	if not category:
		raise HTTPException(status_code=404, detail="Category not found")
	return category


@router.post("/")
def create_category_route(
	payload: dict,
	current_user: TokenClaims = Depends(get_current_user),
):
	name = payload.get("name")
	color = payload.get("color")

	if not name or not color:
		raise HTTPException(status_code=400, detail="name and color are required")

	return create_category(name=name, color=color, user_id=current_user.sub)


@router.put("/{category_id}")
def update_category_route(
	category_id: str,
	payload: dict,
	_current_user: TokenClaims = Depends(get_current_user),
):
	if not payload:
		raise HTTPException(status_code=400, detail="Update payload cannot be empty")
	return update_category(category_id=category_id, data=payload)


@router.delete("/{category_id}")
def delete_category_route(
	category_id: str,
	_current_user: TokenClaims = Depends(get_current_user),
):
	return delete_category(category_id)
