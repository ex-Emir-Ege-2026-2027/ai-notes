/**
 * Oturum Zaman Aşımı Yöneticisi
 *
 * Supabase Free plan oturum zaman aşımı kısıtlamasını frontend tarafında
 * yönetir. Belirli bir süre (INACTIVITY_LIMIT_MS) boyunca aktif olmayan
 * kullanıcıların oturumu güvenlik nedeniyle kapatılır.
 */

/** Maksimum inaktiflik süresi: 7 gün (milisaniye) */
export const INACTIVITY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000;

/** localStorage anahtarı */
const STORAGE_KEY = "ai_notes_last_active";

/**
 * Kullanıcının son aktif zamanını şu anki zaman damgasıyla günceller.
 */
export function refreshLastActive(): void {
  try {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    // localStorage erişilemiyorsa sessizce geç
  }
}

/**
 * Son aktif zaman damgasını localStorage'dan okur.
 * @returns Zaman damgası (ms) ya da null (kayıt yoksa)
 */
export function getLastActive(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Son aktif zaman damgasını localStorage'dan siler.
 */
export function clearLastActive(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessizce geç
  }
}

/**
 * Oturum zaman aşımına uğrayıp uğramadığını kontrol eder.
 * @returns true ise süre dolmuş → oturumu kapat; false ise devam et.
 */
export function isSessionExpired(): boolean {
  const lastActive = getLastActive();
  if (lastActive === null) {
    // İlk defa kontrol ediliyor; zaman damgasını kaydet ve devam et
    refreshLastActive();
    return false;
  }
  const elapsed = Date.now() - lastActive;
  return elapsed > INACTIVITY_LIMIT_MS;
}
