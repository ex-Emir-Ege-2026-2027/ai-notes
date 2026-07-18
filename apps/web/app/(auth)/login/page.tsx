"use client";

import { createClient } from "@/lib/supabase/client";
import { Brain, Loader2, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "email" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep("otp");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    setLoading(false);
    if (error) {
      setError("Kod hatalı veya süresi dolmuş. Tekrar deneyin.");
    } else {
      router.push("/notes");
    }
  };

  return (
    <div className="relative flex min-h-svh overflow-hidden">
      {/* ── Left panel — Hero ── */}
      <div className="hidden flex-col justify-between bg-zinc-950 p-10 lg:flex lg:w-1/2">
        <div className="absolute inset-0 -z-10 lg:w-1/2 bg-zinc-950" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-bold text-white">AI Notes</span>
        </div>

        {/* Hero content */}
        <div className="space-y-6">
          <div className="animate-fade-up">
            <h2 className="text-4xl font-extrabold leading-tight text-white">
              Akıllı notlarla
              <br />
              <span className="text-primary">daha hızlı öğren.</span>
            </h2>
          </div>
          <p className="animate-fade-up delay-100 max-w-sm text-sm leading-relaxed text-white/60">
            Notlarını özetle, soru üret, quiz çöz. Yapay zeka ile öğrenme
            deneyimini bir üst seviyeye taşı.
          </p>

          {/* Feature bullets */}
          <div className="animate-fade-up delay-200 space-y-3">
            {[
              "🧠  Otomatik özet & anahtar kelimeler",
              "🎯  Kişiselleştirilmiş quiz soruları",
              "📂  PDF dosyası yükleme & analiz",
              "🔐  Güvenli e-posta ile giriş",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/80 backdrop-blur-sm"
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="text-xs text-white/30">
          © 2026 AI Notes · Tüm hakları saklıdır
        </p>
      </div>

      {/* ── Right panel — Auth form ── */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold">AI Notes</span>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Hoş Geldin
                </span>
              </div>
              <h1 className="text-xl font-bold">
                {step === "email" ? "Giriş Yap" : "Kodu Doğrula"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {step === "email"
                  ? "E-posta adresinize doğrulama kodu gönderilecek."
                  : `${email} adresine gönderilen 6 haneli kodu girin.`}
              </p>
            </div>

            {/* Email step */}
            {step === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    E-posta adresi
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      autoFocus
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <p className="animate-fade-up rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {loading ? "Gönderiliyor…" : "Kod Gönder"}
                </button>
              </form>
            )}

            {/* OTP step */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {success && (
                  <div className="animate-fade-up rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
                    ✅ Kod gönderildi! E-postanızı kontrol edin.
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-border bg-background py-3 text-center text-2xl font-bold tracking-[0.5em] placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {error && (
                  <p className="animate-fade-up rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {loading ? "Doğrulanıyor…" : "Oturum Aç →"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError(null);
                  }}
                  className="w-full text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Farklı e-posta ile dene
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Giriş yaparak{" "}
            <span className="text-primary">Kullanım Koşullarını</span> kabul
            etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}
