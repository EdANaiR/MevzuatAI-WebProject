# MevzuatAI — Deploy Rehberi

Bu rehber, projeyi canlıya almak ve CV’de **Live Demo** linki koymak için minimum adımları listeler.

## Ön koşullar

- [x] Yerel git repo hazir (`git init` yapildi — push senin hesabinla)
- [ ] GitHub’da public/private repo
- [ ] Groq API key ([console.groq.com](https://console.groq.com))
- [ ] (Opsiyonel) OpenRouter key — backend Chat için
- [ ] PostgreSQL (pgvector gerekmez; mevcut migration’lar normal tablolar)

---

## 1) GitHub’a yükle

```bash
cd MevzuatAI
git init
git add .
git commit -m "MevzuatAI: initial portfolio release"
git branch -M main
git remote add origin https://github.com/KULLANICI/MevzuatAI.git
git push -u origin main
```

`.env.local` ve gerçek secret’lar commit edilmemeli (root `.gitignore` bunları kapsar).

---

## 2) Veritabanı (PostgreSQL)

Seçenekler:
- **Neon** (ücretsiz tier)
- **Supabase** Postgres
- **Railway** PostgreSQL plugin

Connection string örneği:

```
Host=xxx;Port=5432;Database=neondb;Username=xxx;Password=xxx;SSL Mode=Require
```

Migration’lar backend ilk açılışta `Program.cs` içinde `Database.Migrate()` ile uygulanır.

---

## 3) Backend deploy (Railway örneği)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Root directory: `backend` (veya Dockerfile path: `backend/Dockerfile`)
3. **Environment variables:**

| Değişken | Açıklama |
|----------|----------|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `Jwt__SecretKey` | En az 32 karakter, rastgele |
| `Jwt__Issuer` | `MevzuatAI` |
| `Jwt__Audience` | `MevzuatAIClient` |
| `Cors__AllowedOrigins` | `https://SENIN-VERCEL-URL.vercel.app` |
| `Gemini__ApiKey` | OpenRouter key (Chat kullanıyorsan) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

4. Deploy sonrası URL al: örn. `https://mevzuatai-api.up.railway.app`
5. Test: `GET /swagger` (Production’da Swagger kapalı; `POST /api/Auth/register` ile Postman test)

**Render** için benzer: Web Service + Docker veya `dotnet publish` build command.

---

## 4) Frontend deploy (Vercel)

1. [vercel.com](https://vercel.com) → Import Git Repository
2. Root Directory: `frontend`
3. Framework: Next.js (otomatik)
4. **Environment Variables:**

| Değişken | Değer |
|----------|--------|
| `GROQ_API_KEY` | Groq secret |
| `NEXT_PUBLIC_API_URL` | Backend URL (Railway), örn. `https://mevzuatai-api.up.railway.app` |

5. Deploy → `https://mevzuatai.vercel.app`

6. Backend’de `Cors__AllowedOrigins` değerini bu Vercel URL ile güncelle ve backend’i redeploy et.

---

## 5) Canlı smoke test

- [ ] Register / Login
- [ ] Ana sayfadan analiz akışı (`/islem` → `/analysis`)
- [ ] Dilekçe oluştur + PDF indir (`/create`)
- [ ] Dashboard’da dilekçe listesi (`/dashboard`)
- [ ] Swagger veya Postman ile `GET /api/Petitions` (Bearer token)

---

## 6) CV’de kullanılacak linkler

README ve LinkedIn’de şunları ekle:

- **Live Demo:** `https://....vercel.app`
- **API (opsiyonel):** `https://....railway.app`
- **GitHub:** `https://github.com/KULLANICI/MevzuatAI`

Metin önerileri: [PORTFOLIO.md](./PORTFOLIO.md)

---

## Sık hatalar

| Sorun | Çözüm |
|-------|--------|
| CORS hatası | `Cors__AllowedOrigins` = tam Vercel URL, `https` dahil |
| 401 Petitions | `Authorization: Bearer <token>` |
| DB bağlantı hatası | SSL Mode, firewall, connection string |
| Analiz çalışmıyor | Vercel’de `GROQ_API_KEY` tanımlı mı? |

---

## Sonraki iyileştirmeler (portfolyo+)

- PDF’i sunucuda saklama + dashboard’dan açma
- GitHub Actions CI (`dotnet build`, `npm run build`)
- Health check endpoint `/health`
- Custom domain + HTTPS
