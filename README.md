# MevzuatAI

Türkiye hukuku odaklı AI destekli analiz ve dilekçe oluşturma platformu.

**Repo:** https://github.com/EdANaiR/MevzuatAI-WebProject

## Özellikler

- Hukuki soru analizi (yapılandırılmış JSON: konu, adımlar, mevzuat)
- mevzuat.gov.tr üzerinden madde metni çekme
- Dilekçe metni üretimi ve PDF indirme
- JWT ile kullanıcı kayıt/giriş
- Kullanıcıya özel dilekçe geçmişi (dashboard)

## Teknoloji

| Katman | Stack |
|--------|--------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind |
| Backend | .NET 8 Web API, Clean/Layered Architecture |
| Veritabanı | PostgreSQL 16 + pgvector |
| Auth | JWT + BCrypt |
| AI | Groq (frontend API routes), OpenRouter/Gemini (backend chat) |

## Proje yapısı

```
MevzuatAI/
├── backend/          # .NET solution (Domain, Application, Infrastructure, WebAPI)
├── frontend/         # Next.js App Router
├── docker-compose.yml
└── DEPLOYMENT.md
```

## Yerel çalıştırma

### 1) Veritabanı

```bash
docker compose up -d
```

### 2) Backend

```bash
cd backend/MevzuatAI.WebAPI
dotnet ef database update --project ../MevzuatAI.Infrastructure
dotnet run
```

API: `http://localhost:5023` — Swagger: `/swagger`

`appsettings.Development.json` içinde DB bağlantısı var.  
`Gemini:ApiKey` ve güçlü `Jwt:SecretKey` için User Secrets veya ortam değişkeni kullanın.

### 3) Frontend

```bash
cd frontend
cp .env.example .env.local
# GROQ_API_KEY ve NEXT_PUBLIC_API_URL doldur
npm install
npm run dev
```

Uygulama: `http://localhost:3000`

## Deploy

Adım adım rehber: [DEPLOYMENT.md](./DEPLOYMENT.md)

Önerilen kombinasyon:
- **Frontend:** Vercel
- **Backend:** Railway veya Render
- **DB:** Neon / Supabase / Railway PostgreSQL (pgvector destekli)

## CV / portfolyo

Hazır metin ve madde işaretleri: [PORTFOLIO.md](./PORTFOLIO.md)

## Güvenlik

- API anahtarlarını repoya commit etmeyin.
- `.env.local` ve production secret'ları sadece hosting panelinde tutun.
- Eski anahtarlar repoda göründüyse **rotate** edin (Groq, OpenRouter, JWT secret).

## Lisans

Kişisel / portfolyo projesi.
