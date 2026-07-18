"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { NoteCard, NoteCardSkeleton } from "@/components/ui/note-card";
import { useCategories } from "@/lib/hooks/use-categories";
import { useNotes } from "@/lib/hooks/use-notes";
import { cn } from "@workspace/ui/lib/utils";
import { BookOpen, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function NotesPage() {
  const { notes, loading, deleteNote } = useNotes();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchSearch =
        !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        !selectedCategory || n.category_id === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [notes, search, selectedCategory]);

  const handleDelete = async (id: string) => {
    if (confirm("Bu notu silmek istediğinize emin misiniz?")) {
      await deleteNote(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Notlarım{" "}
            {!loading && (
              <span className="text-base font-normal text-muted-foreground">
                ({notes.length})
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tüm notlarınızı buradan yönetin
          </p>
        </div>

        <Link
          href="/notes/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Yeni Not
        </Link>
      </div>

      {/* Search & filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Notlarda ara…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                !selectedCategory
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/20 hover:bg-primary/5",
              )}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id,
                  )
                }
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  selectedCategory === cat.id
                    ? "text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
                style={
                  selectedCategory === cat.id
                    ? {
                        backgroundColor: `${cat.color}18`,
                        borderColor: `${cat.color}50`,
                        color: cat.color,
                      }
                    : {}
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={
            search || selectedCategory
              ? "Sonuç bulunamadı"
              : "Henüz not yok"
          }
          description={
            search || selectedCategory
              ? "Arama kriterlerinizi değiştirin."
              : "İlk notunuzu oluşturmak için \"Yeni Not\" butonuna tıklayın."
          }
          action={
            !search && !selectedCategory ? (
              <Link
                href="/notes/new"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
              >
                İlk Notunu Oluştur
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note, i) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
