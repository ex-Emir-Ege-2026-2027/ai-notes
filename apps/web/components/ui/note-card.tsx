import { CategoryBadge } from "@/components/ui/category-badge";
import type { Note } from "@/lib/types";
import { cn } from "@workspace/ui/lib/utils";
import { Clock, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Dün";
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`;
  } else {
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
    });
  }
}

function getPreview(content: string, maxLen = 120): string {
  const stripped = content.replace(/\s+/g, " ").trim();
  if (stripped.length <= maxLen) return stripped;
  return stripped.slice(0, maxLen) + "…";
}

export function NoteCard({ note, onDelete, className, style }: NoteCardProps) {
  return (
    <article
      className={cn(
        "note-card-hover group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
      style={style}
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
          aria-label="Notu sil"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      <Link href={`/notes/${note.id}`} className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start gap-2 pr-6">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
            {note.title}
          </h3>
        </div>

        {/* Preview */}
        {note.content && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {getPreview(note.content)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={note.category} />
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
            <Clock className="h-3 w-3" />
            {formatDate(note.updated_at)}
          </div>
        </div>

        {/* Keywords */}
        {note.keywords && note.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.keywords.slice(0, 4).map((kw) => (
              <span
                key={kw}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}

// Loading skeleton
export function NoteCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-2">
        <div className="shimmer h-7 w-7 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <div className="shimmer h-3.5 w-3/4 rounded" />
          <div className="shimmer h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="shimmer h-2.5 w-full rounded" />
        <div className="shimmer h-2.5 w-5/6 rounded" />
        <div className="shimmer h-2.5 w-4/6 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="shimmer h-4 w-16 rounded-full" />
        <div className="shimmer h-3 w-12 rounded" />
      </div>
    </div>
  );
}
