from app.database.supabase import supabase


def get_notes():
    response = supabase.table("notes").select("*").order("created_at", desc=True).execute()
    return response.data


def get_note_by_id(note_id: str):
    response = supabase.table("notes").select("*").eq("id", note_id).execute()
    return response.data[0] if response.data else None


def create_note(title: str, content: str, user_id: str, category_id: str | None = None):
    payload = {
        "title": title,
        "content": content,
        "user_id": user_id,
        "category_id": category_id,
    }
    response = supabase.table("notes").insert(payload).select().execute()
    return response.data[0] if response.data else None


def update_note(note_id: str, data: dict):
    response = (
        supabase.table("notes")
        .update(data)
        .eq("id", note_id)
        .select()
        .execute()
    )
    return response.data[0] if response.data else None


def delete_note(note_id: str):
    response = supabase.table("notes").delete().eq("id", note_id).execute()
    return response.data