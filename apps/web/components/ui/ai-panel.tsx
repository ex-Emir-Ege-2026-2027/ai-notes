"use client";

import { cn } from "@workspace/ui/lib/utils";
import { BookOpen, Brain, Gamepad2, Hash, MessageSquare } from "lucide-react";

interface AIPanelProps {
  noteId: string;
  noteContent: string;
}

export function AIPanel({ noteId, noteContent }: AIPanelProps) {
  const tabs = [
    { label: "Özetle", icon: BookOpen },
    { label: "Anahtar Kelimeler", icon: Hash },
    { label: "Soru Sor", icon: MessageSquare },
    { label: "Quiz Oluştur", icon: Gamepad2 },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
          <Brain className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Asistan</h2>
          <p className="text-xs text-muted-foreground">Analiz araçları</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground leading-relaxed">
        Yapay zeka analiz özellikleri şu anda backend API entegrasyonu tamamlanmadığı için devre dışıdır. API bağlantısı sağlandığında aktif edilecektir.
      </div>

      {/* Disabled Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            disabled
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background p-4 text-xs font-medium text-muted-foreground transition-opacity",
              "opacity-50 cursor-not-allowed"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
