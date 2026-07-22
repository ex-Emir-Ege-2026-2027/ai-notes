from app.database.supabase import supabase


FILE_BUCKET = "note-files"


def list_files_by_user(user_id: str):
	response = (
		supabase.table("files")
		.select("*")
		.eq("user_id", user_id)
		.order("created_at", desc=True)
		.execute()
	)
	return response.data


def create_file_metadata(
	*,
	user_id: str,
	storage_path: str,
	name: str,
	size: int,
	mime_type: str,
	note_id: str | None = None,
):
	payload = {
		"user_id": user_id,
		"note_id": note_id,
		"name": name,
		"size": size,
		"mime_type": mime_type,
		"storage_path": storage_path,
	}

	response = supabase.table("files").insert(payload).select().execute()
	return response.data[0] if response.data else None


def get_user_file_by_path(*, user_id: str, storage_path: str):
	response = (
		supabase.table("files")
		.select("*")
		.eq("user_id", user_id)
		.eq("storage_path", storage_path)
		.limit(1)
		.execute()
	)
	return response.data[0] if response.data else None


def create_signed_url(storage_path: str, expires_in: int = 60):
	return supabase.storage.from_(FILE_BUCKET).create_signed_url(storage_path, expires_in)

