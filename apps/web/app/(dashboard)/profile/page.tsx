"use client";

import { StatsCard } from "@/components/ui/stats-card";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCategories } from "@/lib/hooks/use-categories";
import { useNotes } from "@/lib/hooks/use-notes";
import { Brain, FileText, LogOut, Tag, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { notes } = useNotes();
  const { categories } = useCategories();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Profilim</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Hesap bilgileriniz ve istatistikleriniz
        </p>
      </div>

      {/* Profile card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.49 0.24 264), oklch(0.55 0.22 285))",
          }}
        />

        <div className="relative flex items-center gap-5">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>

          <div>
            <h2 className="text-lg font-bold">{user?.email ?? "Kullanıcı"}</h2>
            <p className="text-xs text-muted-foreground">
              Üyelik: {memberSince}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-600">Aktif oturum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          İstatistikler
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            icon={FileText}
            label="Toplam Not"
            value={notes.length}
            color="text-primary"
          />
          <StatsCard
            icon={Tag}
            label="Kategori"
            value={categories.length}
            color="text-violet-500"
          />
          <StatsCard
            icon={Brain}
            label="AI Analiz"
            value="—"
            color="text-teal-500"
          />
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
        <h2 className="mb-1 text-sm font-semibold text-destructive">
          Oturumu Kapat
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Tüm cihazlarda oturumunuz sonlandırılacak.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/20 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
