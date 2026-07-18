"use client";

import type { Category, NoteFormData } from "@/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { CheckCircle, ChevronDown, Loader2, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NoteFormProps {
  initialData?: Partial<NoteFormData>;
  categories: Category[];
  onSubmit: (data: NoteFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function NoteForm({
  initialData,
  categories,
  onSubmit,
  isLoading,
  submitLabel = "Kaydet",
}: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [categoryId, setCategoryId] = useState<string | null>(
    initialData?.category_id ?? null,
  );
  const [catOpen, setCatOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({ title, content, category_id: categoryId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Başlık
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Not başlığı…"
          required
          className={cn(
            "rounded-xl border border-border bg-muted/30 px-4 py-3 text-lg font-semibold placeholder:text-muted-foreground/50",
            "focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
          )}
        />
      </div>

      {/* Category picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Kategori
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setCatOpen(!catOpen)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm",
              "focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
            )}
          >
            {selectedCategory ? (
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                {selectedCategory.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Kategori seçin…</span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                catOpen && "rotate-180",
              )}
            />
          </button>

          {catOpen && (
            <div className="animate-scale-in absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setCategoryId(null);
                  setCatOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50"
              >
                <span className="h-3 w-3 rounded-full border border-muted-foreground/30" />
                Kategorisiz
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(cat.id);
                    setCatOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/50"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          İçerik
        </label>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Notunuzu yazın…"
          rows={10}
          className={cn(
            "min-h-[240px] w-full resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/50",
            "focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
          )}
        />
        <p className="text-right text-[10px] text-muted-foreground">
          {content.length} karakter
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        className={cn(
          "flex w-fit items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          saved && "bg-emerald-500 hover:bg-emerald-500",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kaydediliyor…
          </>
        ) : saved ? (
          <>
            <CheckCircle className="h-4 w-4" />
            Kaydedildi!
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            {submitLabel}
          </>
        )}
      </button>
    </form>
  );
}
