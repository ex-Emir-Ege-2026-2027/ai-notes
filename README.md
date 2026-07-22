# AI Notes

## Backend JWT doğrulama

FastAPI backend, Supabase access token doğrulaması için `HTTPBearer` tabanlı bir dependency kullanır. Korunan endpoint'lere istek atılırken `Authorization: Bearer <token>` header'ı gerekir.

Gerekli environment değişkenleri:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `SUPABASE_JWT_SECRET` veya `SUPABASE_JWKS_URL`
- `SUPABASE_JWT_ALGORITHMS` (opsiyonel, varsayılan `HS256` ya da `RS256`)

Örnek backend bağımlılıkları `apps/api/requirements.txt` dosyasında yer alır.

Local çalıştırma örneği:

```bash
python -m uvicorn app.main:app --reload
```
