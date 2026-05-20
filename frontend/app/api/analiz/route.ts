// app/api/analiz/route.ts

import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `Sen bir Türk hukuku uzmanısın. Kullanıcının hukuki sorununu analiz edip SADECE JSON formatında yanıt ver.

KANUN KODLARI VE KAPSAM (Bu 6 kanun dışında başka kanun kodu YAZMA):
TBK (6098) => kira, sözleşme, borç, tazminat, alacak, trafik kazası
HMK (6100) => dava usulü, arabuluculuk, yargılama
TMK (4721) => miras, velayet, boşanma, aile, evlilik
TCK (5237) => suç, ceza, dolandırıcılık, hakaret, hırsızlık
ISK  (4857) => işçi-işveren, kıdem tazminatı, ihbar, ücret
SSGSSK (5510) => SGK, sigorta primi, emeklilik, sağlık sigortası

KONU → DOĞRU MADDE (Sadece bu eşleştirmeleri kullan, tahmin yapma):
kira ödemiyor          => TBK 315
tahliye                => TBK 352
trafik kazası tazminat => TBK 49, TBK 51
genel tazminat         => TBK 49
sözleşme ihlali        => TBK 112
alacak davası          => TBK 72
işten çıkarma tazminat => ISK 17, ISK 14
iş kazası              => ISK 77, SSGSSK 13
SGK prim eksik         => SSGSSK 86
boşanma                => TMK 166
velayet                => TMK 182
miras                  => TMK 495
dolandırıcılık         => TCK 157
hakaret                => TCK 125
dava açmak             => HMK 119

KURAL: Kullanıcının konusuyla DOĞRUDAN eşleşen maddeleri seç. Eşleşme yoksa en yakın olanı seç ama yanlış kanun verme.

JSON FORMATI:
{
  "konu": "Kısa konu başlığı",
  "hukukAlanı": "İlgili hukuk alanı",
  "ozet": "2-3 cümlelik durum özeti",
  "adimlar": [
    {
      "numara": "01",
      "baslik": "Adım başlığı",
      "aciklama": "Kısa açıklama",
      "detay": "Pratik detaylar",
      "etiket": "1. Adım",
      "renk": "amber"
    }
  ],
  "mevzuat": [
    {
      "kod": "TBK",
      "madde": "Madde 49",
      "maddeNo": "49",
      "baslik": "Haksız fiil sorumluluğu",
      "ozet": "Bu maddenin konuyla ilgili özeti",
      "apiParams": "?code=TBK&madde=49"
    }
  ],
  "uyari": null
}

SADECE JSON döndür. adimlar: 2-4 eleman. mevzuat: 2-3 eleman. renk: amber|blue|emerald|red`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY bulunamadi. .env.local dosyasini kontrol edin." },
      { status: 500 },
    );
  }

  let body: { soru?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Gecersiz istek" }, { status: 400 });
  }

  const { soru } = body;

  if (!soru?.trim()) {
    return NextResponse.json({ error: "Soru bos olamaz" }, { status: 400 });
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Kullanicinin hukuki sorunu: ${soru}` },
        ],
        temperature: 0.2,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API hatasi:", err);
      return NextResponse.json(
        { error: "Groq API yanit vermedi", detail: err },
        { status: 502 },
      );
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content || "";

    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse hatasi. Ham metin:", rawText);
      return NextResponse.json(
        { error: "AI yaniti parse edilemedi", raw: rawText },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, analiz: parsed });
  } catch (err) {
    console.error("Analiz hatasi:", err);
    return NextResponse.json(
      { error: "Analiz sirasinda hata olustu" },
      { status: 500 },
    );
  }
}
