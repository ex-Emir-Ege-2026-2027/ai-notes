"use client";

import { AIPanel } from "@/components/ui/ai-panel";
import { CategoryBadge } from "@/components/ui/category-badge";
import { useNotes } from "@/lib/hooks/use-notes";
import type { Note } from "@/lib/types";
import { ArrowLeft, Clock, Edit, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const { getNote, deleteNote } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getNote(params.id).then((n) => {
      setNote(n);
      setLoading(false);
    });
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!note) return;
    if (!confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    const ok = await deleteNote(note.id);
    if (ok) router.push("/notes");
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
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground">Not bulunamadı.</p>
        <Link href="/notes" className="text-sm text-primary underline">
          Notlara dön
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(note.updated_at).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/notes"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight">{note.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <CategoryBadge category={note.category} size="md" />
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/notes/${note.id}/edit`}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
          >
            <Edit className="h-3.5 w-3.5" />
            Düzenle
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Sil
          </button>
        </div>
      </div>

      {/* Content + AI side panel */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Note content */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {note.content ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-wrap text-sm leading-loose text-foreground/90">
                {note.content}
              </p>
            </div>
          ) : (
            <p className="italic text-muted-foreground">
              Bu notun içeriği boş.
            </p>
          )}

          {/* Keywords */}
          {note.keywords && note.keywords.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Anahtar Kelimeler
              </p>
              <div className="flex flex-wrap gap-2">
                {note.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {note.summary && (
            <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Özet
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {note.summary}
              </p>
            </div>
          )}
        </div>

        {/* AI Panel */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <AIPanel noteId={note.id} noteContent={note.content} />
        </div>
      </div>
    </div>
  );
}
