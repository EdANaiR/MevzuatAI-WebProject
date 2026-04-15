// app/api/analiz/route.ts
// Kullanıcının hukuki sorusunu Gemini'ye gönderir, yapılandırılmış JSON döndürür

import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `Sen bir Türk hukuku uzmanısın. Kullanıcının hukuki sorununu analiz edip SADECE aşağıdaki JSON formatında yanıt ver. Başka hiçbir şey yazma, sadece JSON.

{
  "konu": "Kısa konu başlığı (örn: Kiracı Tahliyesi)",
  "hukukAlanı": "İlgili hukuk alanı (örn: Kira Hukuku)",
  "ozet": "2-3 cümlelik durum özeti",
  "adimlar": [
    {
      "numara": "01",
      "baslik": "Adım başlığı",
      "aciklama": "Kısa açıklama",
      "detay": "Pratik detaylar, süre, maliyet gibi bilgiler",
      "etiket": "1. Adım",
      "renk": "amber"
    }
  ],
  "mevzuat": [
    {
      "kod": "TBK",
      "madde": "Madde 315",
      "maddeNo": "315",
      "baslik": "Madde başlığı",
      "ozet": "Maddenin kısa özeti",
      "apiParams": "?code=TBK&madde=315"
    }
  ],
  "uyari": "Varsa önemli bir uyarı mesajı, yoksa null"
}

Kurallar:
- adimlar dizisi 2-4 eleman içermeli
- mevzuat dizisi 2-4 eleman içermeli  
- renk değeri sadece şunlardan biri olabilir: amber, blue, emerald, red
- mevzuat kodları: TBK (6098), HMK (6100), TMK (4721), TCK (5237), İş Kanunu (4857)
- apiParams formatı: ?code=TBK&madde=315 (kod ve madde no)
- Türkçe yaz, resmi ama anlaşılır ol
- Sadece JSON döndür, markdown kod bloğu kullanma`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "GEMINI_API_KEY bulunamadı. .env.local dosyasını kontrol edin.",
      },
      { status: 500 },
    );
  }

  let body: { soru?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { soru } = body;

  if (!soru?.trim()) {
    return NextResponse.json({ error: "Soru boş olamaz" }, { status: 400 });
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nKullanıcının sorusu: ${soru}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3, // Düşük = tutarlı, hukuki doğruluk için
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API hatası:", err);
      return NextResponse.json(
        { error: "Gemini API yanıt vermedi", detail: err },
        { status: 502 },
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // JSON'u temizle (Gemini bazen ```json ``` ile sarar)
    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse hatası. Ham metin:", rawText);
      return NextResponse.json(
        { error: "AI yanıtı parse edilemedi", raw: rawText },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, analiz: parsed });
  } catch (err) {
    console.error("Analiz hatası:", err);
    return NextResponse.json(
      { error: "Analiz sırasında hata oluştu" },
      { status: 500 },
    );
  }
}
