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
git remote add origin https://github.com/EdANaiR/MevzuatAI-WebProject.git
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

**Render** için adimlar:

1. [render.com](https://render.com) → **New** → **Web Service** → GitHub repo `MevzuatAI-WebProject`
2. **Root Directory:** `backend`  ← **cok onemli**
3. **Runtime:** Docker
4. **Dockerfile Path:** `./Dockerfile` (root directory `backend` oldugu icin)
5. **Instance type:** Free
6. **Environment variables** (asagidaki tablo)
7. **Deploy**

> Hata `open Dockerfile: no such file or directory` → Root Directory bos birakilmis demektir.  
> Dockerfile repo kokunde degil, `backend/Dockerfile` icindedir.

Alternatif (repo kokunden):
- Root Directory: *(bos)*
- Dockerfile Path: `backend/Dockerfile`
- Docker build context da `backend` olmali (Render panelinde "Docker Context" varsa)

Veya repoda `render.yaml` var — **New > Blueprint** ile otomatik kurulur.

| Değişken | Açıklama |
|----------|----------|
| `ConnectionStrings__DefaultConnection` | Render PostgreSQL veya Neon connection string |
| `Jwt__SecretKey` | En az 32 karakter, rastgele |
| `Jwt__Issuer` | `MevzuatAI` |
| `Jwt__Audience` | `MevzuatAIClient` |
| `Cors__AllowedOrigins` | `https://SENIN-VERCEL-URL.vercel.app` |
| `Gemini__ApiKey` | OpenRouter key (opsiyonel) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

8. Deploy sonrasi URL: `https://mevzuatai-api.onrender.com` (ornek)
9. Test: `GET https://SENIN-URL/api/Health` → `{"status":"healthy",...}`

---

## 4) Frontend deploy (Vercel)

1. [vercel.com](https://vercel.com) → Import Git Repository
2. Root Directory: `frontend`
3. Framework: Next.js (otomatik)
4. **Environment Variables:**

| Değişken | Değer |
|----------|--------|
| `GROQ_API_KEY` | Groq secret |
| `NEXT_PUBLIC_API_URL` | Backend URL, örn. `https://mevzuatai-api.onrender.com` |
| `JWT_SECRET` | Backend `Jwt__SecretKey` ile **aynı** değer |
| `JWT_ISSUER` | `MevzuatAI` |
| `JWT_AUDIENCE` | `MevzuatAIClient` |

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
- **GitHub:** `https://github.com/EdANaiR/MevzuatAI-WebProject`

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
