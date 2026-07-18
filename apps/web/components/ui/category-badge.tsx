import type { Category } from "@/lib/types";
import { cn } from "@workspace/ui/lib/utils";

interface CategoryBadgeProps {
  category?: Category | null;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({
  category,
  size = "sm",
  className,
}: CategoryBadgeProps) {
  if (!category) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 font-medium text-muted-foreground",
          size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
          className,
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
        Kategorisiz
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        className,
      )}
      style={{
        backgroundColor: `${category.color}18`,
        color: category.color,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: `${category.color}35`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  );
}
