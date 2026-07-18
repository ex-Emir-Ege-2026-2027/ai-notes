"use client";

import { createClient } from "@/lib/supabase/client";
import type { Note, NoteFormData } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*, category:categories(id, name, color)")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNotes((data as Note[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Notlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (formData: NoteFormData): Promise<Note | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("notes")
      .insert({ ...formData, user_id: user.id })
      .select("*, category:categories(id, name, color)")
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    const note = data as Note;
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const updateNote = async (
    id: string,
    formData: Partial<NoteFormData>,
  ): Promise<Note | null> => {
    const { data, error } = await supabase
      .from("notes")
      .update(formData)
      .eq("id", id)
      .select("*, category:categories(id, name, color)")
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    const updated = data as Note;
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    return updated;
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return false;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
    return true;
  };

  const getNote = async (id: string): Promise<Note | null> => {
    const { data, error } = await supabase
      .from("notes")
      .select("*, category:categories(id, name, color)")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as Note;
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
}
