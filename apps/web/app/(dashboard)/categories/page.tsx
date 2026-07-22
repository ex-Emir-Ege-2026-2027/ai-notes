"use client";

import { useCategories } from "@/lib/hooks/use-categories";
import type { Category } from "@/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import {
  Check,
  Edit2,
  Loader2,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

const PRESET_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f97316", // orange
  "#64748b", // slate
];

const DEFAULT_CATEGORY_COLOR = PRESET_COLORS[0] ?? "#6366f1";

export default function CategoriesPage() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } =
    useCategories();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<string>(DEFAULT_CATEGORY_COLOR);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    await createCategory({ name: newName.trim(), color: newColor });
    setCreating(false);
    setNewName("");
    setNewColor(DEFAULT_CATEGORY_COLOR);
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const handleUpdate = async (id: string) => {
    await updateCategory(id, { name: editName, color: editColor });
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    await deleteCategory(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Kategoriler</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Notlarınızı düzenlemek için kategoriler oluşturun
        </p>
      </div>

      {/* Create form */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold">Yeni Kategori</h2>
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3">
          {/* Name input */}
          <div className="flex-1 min-w-48">
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Kategori adı
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Örn: Matematik"
              className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Renk
            </label>
            <div className="flex items-center gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-all hover:scale-110",
                    newColor === color ? "border-foreground scale-110" : "border-transparent",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Oluştur
          </button>
        </form>
      </div>

      {/* Categories list */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-12 text-center">
          <Tag className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Henüz kategori yok. İlk kategorini oluştur!
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group animate-fade-up flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
            >
              {editId === cat.id ? (
                /* Edit mode */
                <div className="flex flex-1 flex-col gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-sm focus:border-primary/50 focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={cn(
                          "h-5 w-5 rounded-full border-2 transition-all",
                          editColor === color
                            ? "border-foreground scale-110"
                            : "border-transparent",
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary/90"
                    >
                      <Check className="h-3 w-3" />
                      Kaydet
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-1 text-xs hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <div
                    className="h-9 w-9 shrink-0 rounded-xl shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${cat.color}80, ${cat.color}40)`,
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {cat.color}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(cat)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
