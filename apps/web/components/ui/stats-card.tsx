import { cn } from "@workspace/ui/lib/utils";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: string;
  trend?: string;
  className?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  color = "text-primary",
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className={cn("h-4.5 w-4.5", color)} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
