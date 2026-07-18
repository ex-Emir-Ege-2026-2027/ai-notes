"use client";

import { NoteForm } from "@/components/ui/note-form";
import { useCategories } from "@/lib/hooks/use-categories";
import { useNotes } from "@/lib/hooks/use-notes";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewNotePage() {
  const { createNote } = useNotes();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category_id: string | null;
  }) => {
    setLoading(true);
    const note = await createNote(data);
    setLoading(false);
    if (note) {
      router.push(`/notes/${note.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/notes"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Yeni Not</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Yeni bir not oluşturun
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <NoteForm
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={loading}
          submitLabel="Not Oluştur"
        />
      </div>
    </div>
  );
}
