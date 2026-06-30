// app/api/dilekce/route.ts
// Analiz sonucuna göre dilekçe metni oluşturur

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/verify-auth";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY bulunamadı" },
      { status: 500 },
    );
  }

  const body = await req.json();
  const { soru, konu, hukukAlani, ozet, mevzuat } = body;

  const mevzuatStr = (mevzuat || [])
    .map(
      (m: { kod: string; madde: string; baslik: string }) =>
        `${m.kod} ${m.madde} (${m.baslik})`,
    )
    .join(", ");

  const prompt = `Sen bir Türk hukuku uzmanı avukatsın. Aşağıdaki bilgilere göre resmi mahkeme dilekçesi metni hazırla.

Kullanıcının durumu: ${soru}
Hukuk alanı: ${hukukAlani}
Konu: ${konu}
Özet: ${ozet}
Dayanak mevzuat (SADECE bunları kullan, başka kanun atıfı yapma): ${mevzuatStr}

KURALLAR:
- Yukarıda verilen mevzuat dışında HİÇBİR kanun numarası veya madde atfı yapma
- Uydurma kanun numarası veya madde adı yazma
- "Sayın Mahkeme" ile başla
- Resmi, ağırbaşlı Türkçe kullan
- 4-6 cümle yeterli

SADECE JSON döndür:
{
  "aciklamalar": "Sayın Mahkeme, ...",
  "sonuc": "Yukarıda arz edilen nedenlerle ..."
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content || "";
    const cleaned = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI yanıtı parse edilemedi", raw },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, ...parsed });
  } catch (err) {
    return NextResponse.json(
      { error: "Dilekçe oluşturma hatası", detail: String(err) },
      { status: 500 },
    );
  }
}
