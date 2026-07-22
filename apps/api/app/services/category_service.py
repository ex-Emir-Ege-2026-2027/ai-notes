from app.database.supabase import supabase


def get_categories():
	response = supabase.table("categories").select("*").order("name").execute()
	return response.data


def get_category_by_id(category_id: str):
	response = supabase.table("categories").select("*").eq("id", category_id).execute()
	return response.data[0] if response.data else None


def create_category(name: str, color: str, user_id: str):
	response = (
		supabase.table("categories")
		.insert({"name": name, "color": color, "user_id": user_id})
		.select()
		.execute()
	)
	return response.data[0] if response.data else None


def update_category(category_id: str, data: dict):
	response = (
		supabase.table("categories")
		.update(data)
		.eq("id", category_id)
		.select()
		.execute()
	)
	return response.data[0] if response.data else None


def delete_category(category_id: str):
	response = supabase.table("categories").delete().eq("id", category_id).execute()
	return response.data
