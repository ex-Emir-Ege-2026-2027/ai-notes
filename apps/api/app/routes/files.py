from fastapi import APIRouter, Depends, HTTPException

from app.core.security import TokenClaims, get_current_user
from app.services.file_service import (
	create_file_metadata,
	create_signed_url,
	get_user_file_by_path,
	list_files_by_user,
)

router = APIRouter(
	prefix="/files",
	tags=["Files"],
)


@router.get("/")
def read_files(current_user: TokenClaims = Depends(get_current_user)):
	return list_files_by_user(current_user.sub)


@router.post("/")
def create_file_metadata_route(
	payload: dict,
	current_user: TokenClaims = Depends(get_current_user),
):
	storage_path = payload.get("storage_path")
	name = payload.get("name")
	size = payload.get("size")
	mime_type = payload.get("mime_type")
	note_id = payload.get("note_id")

	if not storage_path or not name or size is None or not mime_type:
		raise HTTPException(
			status_code=400,
			detail="storage_path, name, size and mime_type are required",
		)

	record = create_file_metadata(
		user_id=current_user.sub,
		storage_path=storage_path,
		name=name,
		size=int(size),
		mime_type=mime_type,
		note_id=note_id,
	)
	return record


@router.post("/signed-url")
def create_signed_url_route(
	payload: dict,
	current_user: TokenClaims = Depends(get_current_user),
):
	storage_path = payload.get("storage_path")
	expires_in = int(payload.get("expires_in", 60))

	if not storage_path:
		raise HTTPException(status_code=400, detail="storage_path is required")

	file_record = get_user_file_by_path(
		user_id=current_user.sub,
		storage_path=storage_path,
	)
	if not file_record:
		raise HTTPException(status_code=404, detail="File not found")

	signed = create_signed_url(storage_path=storage_path, expires_in=expires_in)
	signed_url = getattr(signed, "signedURL", None) or getattr(signed, "signedUrl", None)

	return {
		"storage_path": storage_path,
		"expires_in": expires_in,
		"signed_url": signed_url,
	}

