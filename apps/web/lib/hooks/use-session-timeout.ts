"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  isSessionExpired,
  refreshLastActive,
  clearLastActive,
} from "@/lib/session-timeout";

/**
 * useSessionTimeout
 *
 * Dashboard layout'unda çağrılır. Uygulama her yüklendiğinde / mount
 * olduğunda son aktif zamanı kontrol eder:
 *  - Süre dolmuşsa → oturumu kapatır, localStorage'ı temizler, /login'e yönlendirir.
 *  - Dolmamışsa    → son aktif zamanı şu anki zaman damgasıyla günceller.
 */
export function useSessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function checkAndHandleTimeout() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Oturum yoksa zaten login sayfasına yönlendirilecek; burada iş yok.
      if (!session) return;

      if (isSessionExpired()) {
        // Zaman aşımı: oturumu kapat, yerel veriyi temizle, login'e yönlendir
        clearLastActive();
        await supabase.auth.signOut();
        router.replace("/login");
      } else {
        // Aktif kullanıcı: zaman damgasını yenile
        refreshLastActive();
      }
    }

    checkAndHandleTimeout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
