from app.database.supabase import supabase


def get_notes():
    response = supabase.table("notes").select("*").execute()
    return response.data