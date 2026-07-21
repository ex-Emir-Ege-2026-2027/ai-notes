from app.database.supabase import supabase


def get_categories():
	response = supabase.table("categories").select("*").order("name").execute()
	return response.data


def get_category_by_id(category_id: str):
	response = (
		supabase.table("categories").select("*").eq("id", category_id).single().execute()
	)
	return response.data


def create_category(name: str, color: str, user_id: str):
	response = (
		supabase.table("categories")
		.insert({"name": name, "color": color, "user_id": user_id})
		.select()
		.single()
		.execute()
	)
	return response.data


def update_category(category_id: str, data: dict):
	response = (
		supabase.table("categories")
		.update(data)
		.eq("id", category_id)
		.select()
		.single()
		.execute()
	)
	return response.data


def delete_category(category_id: str):
	response = supabase.table("categories").delete().eq("id", category_id).execute()
	return response.data
