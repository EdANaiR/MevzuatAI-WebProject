<img width="1219" height="849" alt="Ekran görüntüsü 2026-03-14 122218" src="https://github.com/user-attachments/assets/48ec1239-66a5-441f-bdfb-060491c815d8" />

<img width="1902" height="940" alt="Ekran görüntüsü 2026-05-20 205539" src="https://github.com/user-attachments/assets/eb0aa4ca-26e2-4a47-ab51-15c425251e0e" />

<img width="1546" height="940" alt="Ekran görüntüsü 2026-05-20 224232" src="https://github.com/user-attachments/assets/c23f9f3b-fca1-49de-ac2e-a6a1dc60046d" />

<img width="1810" height="944" alt="Ekran görüntüsü 2026-05-20 224246" src="https://github.com/user-attachments/assets/6d85d199-3169-4b02-bd26-cd3bca3ece54" />

<img width="1149" height="861" alt="Ekran görüntüsü 2026-05-20 205713" src="https://github.com/user-attachments/assets/673a7054-cceb-4207-b2f3-26e70e6d8c6f" />


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
# GROQ_API_KEY, NEXT_PUBLIC_API_URL ve JWT_SECRET doldur
# JWT_SECRET, backend appsettings.Development.json icindeki Jwt:SecretKey ile ayni olmali
npm install
npm run dev
```

Uygulama: `http://localhost:3000`![Uploading Ekran görüntüsü 2026-03-14 122218.png…]()


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
