// app/api/mevzuat/route.ts
//
// mevzuat.gov.tr'den madde içeriklerini çeken Next.js API Route
//
// Kullanım:
//   GET /api/mevzuat?no=6098&tur=1&tertip=5&madde=315
//
// Parametreler:
//   no      : Mevzuat numarası  (TBK = 6098, HMK = 6100)
//   tur     : Mevzuat türü      (1 = Kanun)
//   tertip  : Tertip            (TBK/HMK için 5)
//   madde   : Aranan madde no   (315, 352, 18 vs.)

import { NextRequest, NextResponse } from "next/server";

// Bilinen kanunların parametreleri — gerekirse genişletilebilir
const KNOWN_LAWS: Record<
  string,
  { no: string; tur: number; tertip: string; name: string }
> = {
  TBK: { no: "6098", tur: 1, tertip: "5", name: "Türk Borçlar Kanunu" },
  HMK: { no: "6100", tur: 1, tertip: "5", name: "Hukuk Muhakemeleri Kanunu" },
  TMK: { no: "4721", tur: 1, tertip: "5", name: "Türk Medeni Kanunu" },
  TCK: { no: "5237", tur: 1, tertip: "5", name: "Türk Ceza Kanunu" },
};

// mevzuat.gov.tr iframe URL'i — Python kodundaki get_content_from_html metodundan alındı
function buildIframeUrl(no: string, tur: number, tertip: string): string {
  return `https://www.mevzuat.gov.tr/anasayfa/MevzuatFihristDetayIframe?MevzuatTur=${tur}&MevzuatNo=${no}&MevzuatTertip=${tertip}`;
}

// HTML içinden belirli bir maddeyi bul ve temizle
function extractArticle(html: string, maddeNo: string): string | null {
  // Madde başlığını ara: "Madde 315", "MADDE 315", "Md. 315" vb.
  const patterns = [
    new RegExp(
      `Madde\\s+${maddeNo}[\\s\\-—–]([\\s\\S]{50,3000}?)(?=Madde\\s+\\d|$)`,
      "i",
    ),
    new RegExp(
      `MADDE\\s+${maddeNo}[\\s\\-—–]([\\s\\S]{50,3000}?)(?=MADDE\\s+\\d|$)`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[0]
        .replace(/<[^>]*>/g, " ") // HTML taglerini kaldır
        .replace(/\s+/g, " ") // Fazla boşlukları temizle
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
    }
  }

  return null;
}

// Madde metnini temizle — bir sonraki maddenin başlığı sızmasın
function cleanArticleText(text: string): string {
  return (
    text
      // Bir sonraki madde başlığında kes: "MADDE 316" veya "II. Başlık" veya "III." gibi
      .replace(
        /\s+(MADDE\s+\d+[-–—][\s\S]*|[IVX]+\.\s+[A-ZÇĞİÖŞÜa-zçğışöşü].*)$/i,
        "",
      )
      // Baştaki "MADDE 315-" veya "MADDE 315 -" formatını normalize et
      .replace(/^MADDE\s+\d+[-–—\s]+/i, "")
      .trim()
  );
}

// HTML'den tüm metin içeriğini düzgünce çıkar
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Kod ile arama: ?code=TBK&madde=315
  const code = searchParams.get("code")?.toUpperCase();
  const maddeNo = searchParams.get("madde");

  // Ya da direkt parametrelerle: ?no=6098&tur=1&tertip=5&madde=315
  let no = searchParams.get("no");
  let tur = parseInt(searchParams.get("tur") || "1");
  let tertip = searchParams.get("tertip") || "5";
  let lawName = "";

  // Kod varsa parametreleri otomatik doldur
  if (code && KNOWN_LAWS[code]) {
    const law = KNOWN_LAWS[code];
    no = law.no;
    tur = law.tur;
    tertip = law.tertip;
    lawName = law.name;
  }

  if (!no) {
    return NextResponse.json(
      {
        error:
          "Mevzuat numarası gerekli. ?code=TBK&madde=315 veya ?no=6098&madde=315",
      },
      { status: 400 },
    );
  }

  try {
    const iframeUrl = buildIframeUrl(no, tur, tertip);

    // mevzuat.gov.tr'ye istek at — tarayıcı gibi görün
    const response = await fetch(iframeUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9",
        Referer: "https://www.mevzuat.gov.tr/",
      },
      // Next.js cache — 1 saat cache'le (mevzuat sık değişmez)
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `mevzuat.gov.tr yanıt vermedi: ${response.status}` },
        { status: 502 },
      );
    }

    const html = await response.text();
    const fullText = stripHtml(html);

    // Belirli madde isteniyorsa sadece onu çıkar
    if (maddeNo) {
      const articleText = extractArticle(html, maddeNo);

      if (articleText) {
        return NextResponse.json({
          success: true,
          source: "mevzuat.gov.tr",
          law: lawName || `Kanun No: ${no}`,
          article: `Madde ${maddeNo}`,
          content: cleanArticleText(articleText),
          url: `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${no}&MevzuatTur=${tur}&MevzuatTertip=${tertip}`,
          fetchedAt: new Date().toISOString(),
        });
      }

      // Madde bulunamadı — tüm metni döndür, frontend filtrelesin
      return NextResponse.json({
        success: false,
        source: "mevzuat.gov.tr",
        law: lawName || `Kanun No: ${no}`,
        article: `Madde ${maddeNo}`,
        content: null,
        fullText: fullText.substring(0, 5000), // İlk 5000 karakter
        error: `Madde ${maddeNo} metni otomatik olarak bulunamadı. Tam metin döndürüldü.`,
        url: `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${no}&MevzuatTur=${tur}&MevzuatTertip=${tertip}`,
        fetchedAt: new Date().toISOString(),
      });
    }

    // Madde no verilmemişse tüm kanun metnini döndür
    return NextResponse.json({
      success: true,
      source: "mevzuat.gov.tr",
      law: lawName || `Kanun No: ${no}`,
      content: fullText.substring(0, 10000),
      url: `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${no}&MevzuatTur=${tur}&MevzuatTertip=${tertip}`,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[mevzuat API] Hata:", err);
    return NextResponse.json(
      {
        error: "mevzuat.gov.tr erişim hatası",
        detail: err instanceof Error ? err.message : "Bilinmeyen hata",
      },
      { status: 500 },
    );
  }
}
