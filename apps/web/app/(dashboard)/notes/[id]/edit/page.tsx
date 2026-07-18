"use client";

import { NoteForm } from "@/components/ui/note-form";
import { useCategories } from "@/lib/hooks/use-categories";
import { useNotes } from "@/lib/hooks/use-notes";
import type { Note } from "@/lib/types";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const { getNote, updateNote } = useNotes();
  const { categories } = useCategories();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getNote(params.id).then((n) => {
      setNote(n);
      setLoading(false);
    });
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (data: {
    title: string;
    content: string;
    category_id: string | null;
  }) => {
    setSaving(true);
    await updateNote(params.id, data);
    setSaving(false);
    router.push(`/notes/${params.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Not bulunamadı.</p>
        <Link href="/notes" className="text-sm text-primary underline">
          Notlara dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/notes/${note.id}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Edit className="h-4 w-4 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold">Notu Düzenle</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Değişiklikleriniz otomatik olarak kaydedilecek
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <NoteForm
          initialData={{
            title: note.title,
            content: note.content,
            category_id: note.category_id,
          }}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={saving}
          submitLabel="Değişiklikleri Kaydet"
        />
      </div>
    </div>
  );
}
