"use client";

import { createClient } from "@/lib/supabase/client";
import type { Category, CategoryFormData } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories((data as Category[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kategoriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (
    formData: CategoryFormData,
  ): Promise<Category | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("categories")
      .insert({ ...formData, user_id: user.id })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }
    const cat = data as Category;
    setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)));
    return cat;
  };

  const updateCategory = async (
    id: string,
    formData: Partial<CategoryFormData>,
  ): Promise<Category | null> => {
    const { data, error } = await supabase
      .from("categories")
      .update(formData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setError(error.message);
      return null;
    }
    const updated = data as Category;
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return false;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
