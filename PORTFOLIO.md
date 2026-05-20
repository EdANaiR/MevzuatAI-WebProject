# MevzuatAI — CV / Portfolyo Metinleri

Deploy sonrası `[]` içindeki linkleri kendi URL’lerinle değiştir.

---

## Kısa proje açıklaması (2–3 cümle)

MevzuatAI, kullanıcıların hukuki sorunlarını doğal dille anlatıp yapılandırılmış analiz, ilgili kanun maddeleri ve mahkeme dilekçesi taslağı üretebildiği full-stack bir web uygulamasıdır. Backend’de .NET 8 ile katmanlı mimari ve JWT kimlik doğrulama; frontend’de Next.js ile modern bir kullanıcı deneyimi sunulur.

---

## CV — Proje satırı (Türkçe)

**MevzuatAI** — AI Destekli Hukuk Asistanı | .NET 8, Next.js, PostgreSQL, JWT, Groq  
[Live Demo](https://YOUR-VERCEL-URL.vercel.app) · [GitHub](https://github.com/YOUR_USER/MevzuatAI)

---

## CV — Madde işaretleri (backend odaklı)

- ASP.NET Core Web API ile **Clean/Layered Architecture** (Domain, Application, Infrastructure, WebAPI)
- **Dependency Injection** ve repository pattern ile test edilebilir servis katmanı
- **JWT + BCrypt** ile güvenli kimlik doğrulama ve korumalı endpoint’ler
- **EF Core** + PostgreSQL; migration ve kullanıcı/dilekçe CRUD
- **Swagger** ile API dokümantasyonu ve entegrasyon testi
- Docker ile yerel PostgreSQL (pgvector) ortamı
- Frontend entegrasyonu: REST API, CORS, bearer token akışı

---

## CV — Madde işaretleri (full-stack)

- Next.js App Router, TypeScript, Tailwind CSS
- Server-side API routes ile Groq LLM entegrasyonu (analiz, dilekçe)
- mevzuat.gov.tr scraping/API ile canlı madde metni
- React Context ile auth state; korumalı dashboard
- html2pdf ile dilekçe PDF export
- Vercel + Railway/Render deploy

---

## LinkedIn “Projeler” kutusu

**MevzuatAI**  
Hukuki soru analizi, mevzuat referansı ve dilekçe üretimi sunan full-stack uygulama. Backend: .NET 8, EF Core, JWT. Frontend: Next.js, AI API entegrasyonu.  
🔗 Demo: https://YOUR-VERCEL-URL.vercel.app  
💻 Kod: https://github.com/YOUR_USER/MevzuatAI

---

## Mülakat — 30 saniye anlatım

“MevzuatAI’de kullanıcı hukuki sorununu yazıyor; sistem Groq ile yapılandırılmış analiz üretiyor, mevzuat.gov.tr’den madde metinlerini çekiyor ve dilekçe taslağı oluşturuyor. Backend’i .NET 8 ile katmanlı mimaride kurdum: controller’lar ince, iş kuralları servislerde, veri erişimi EF Core ve repository ile. JWT ile auth ve kullanıcıya özel dilekçe kayıtları PostgreSQL’de. Frontend Next.js; deploy Vercel ve Railway üzerinde.”

---

## README badge önerileri (isteğe bağlı)

```markdown
![.NET](https://img.shields.io/badge/.NET-8-512BD4)
![Next.js](https://img.shields.io/badge/Next.js-16-000000)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)
```

---

## Deploy checklist (CV’ye eklemeden önce)

- [ ] Live demo açılıyor
- [ ] Register/login çalışıyor
- [ ] En az 1 uçtan uca analiz + dilekçe akışı
- [ ] GitHub README dolu (bu repo)
- [ ] Repoda secret yok
- [ ] Ekran görüntüsü 2–3 adet (ana sayfa, analiz, dashboard)
