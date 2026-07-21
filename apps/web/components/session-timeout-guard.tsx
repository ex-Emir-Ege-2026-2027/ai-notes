"use client";

import { useSessionTimeout } from "@/lib/hooks/use-session-timeout";

/**
 * SessionTimeoutGuard
 *
 * Dashboard layout'una eklenen saf bir "effect" bileşeni.
 * Herhangi bir UI render etmez; yalnızca useSessionTimeout hook'unu
 * çalıştırarak oturum zaman aşımını denetler.
 */
export function SessionTimeoutGuard() {
  useSessionTimeout();
  return null;
}
