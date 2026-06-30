"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  User,
  Building2,
  MapPin,
  Hash,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  ChevronRight,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAuthHeaders } from "@/lib/client-auth";
import { useAuth, withAuth } from "@/lib/auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5023";

// ─── Tipler ───────────────────────────────────────────────────
type AnalizSonucu = {
  konu: string;
  hukukAlanı: string;
  ozet: string;
  adimlar: {
    numara: string;
    baslik: string;
    aciklama: string;
    detay: string;
  }[];
  mevzuat: {
    kod: string;
    madde: string;
    maddeNo: string;
    baslik: string;
    ozet: string;
    apiParams: string;
  }[];
  uyari: string | null;
  dilekceGerekli?: boolean;
};

type FormData = {
  mahkeme: string;
  davaci: string;
  tc: string;
  adres: string;
  davali: string;
  konu: string;
  aciklamalar: string;
  sonuc: string;
  tarih: string;
};

// ─── Sabit veriler ────────────────────────────────────────────
const MAHKEME_MAP: Record<string, string> = {
  "Kira Hukuku": "SULH HUKUK MAHKEMESİNE",
  "İş Hukuku": "İŞ MAHKEMESİNE",
  "İş ve Sosyal Güvenlik Hukuku": "İŞ MAHKEMESİNE",
  "Aile Hukuku": "AİLE MAHKEMESİNE",
  "Ceza Hukuku": "SAVCILIĞA",
  "Miras Hukuku": "SULH HUKUK MAHKEMESİNE",
  "Tüketici Hukuku": "TÜKETİCİ MAHKEMESİNE",
};

// ─── Ana Bileşen ──────────────────────────────────────────────
function CreatePetitionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const [analiz, setAnaliz] = useState<AnalizSonucu | null>(null);
  const [soru, setSoru] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [noPetitionNeeded, setNoPetitionNeeded] = useState(false);

  const [form, setForm] = useState<FormData>({
    mahkeme: "SULH HUKUK MAHKEMESİNE",
    davaci: "",
    tc: "",
    adres: "",
    davali: "",
    konu: "",
    aciklamalar: "",
    sonuc: "",
    tarih: new Date().toLocaleDateString("tr-TR"),
  });

  // sessionStorage'dan analiz yükle
  useEffect(() => {
    const saved = sessionStorage.getItem("analiz_sonucu");
    const savedSoru = sessionStorage.getItem("analiz_soru");
    if (saved) {
      try {
        const data: AnalizSonucu = JSON.parse(saved);
        setAnaliz(data);
        if (savedSoru) setSoru(savedSoru);

        // Mahkeme otomatik belirle
        const mahkeme =
          MAHKEME_MAP[data.hukukAlanı] || "SULH HUKUK MAHKEMESİNE";
        setForm((prev) => ({
          ...prev,
          mahkeme,
          konu: data.konu,
        }));

        // Dilekçe gerekip gerekmediğini kontrol et
        const gerekmiyor = checkNoPetition(data);
        setNoPetitionNeeded(gerekmiyor);
      } catch {}
    }
  }, []);

  // Dilekçe gereksiz mi? (SGK başvurusu, idari başvuru gibi durumlarda)
  function checkNoPetition(data: AnalizSonucu): boolean {
    const noLitigation = ["SGK", "İdari Başvuru", "Vergi", "Pasaport", "Nüfus"];
    return noLitigation.some(
      (k) => data.hukukAlanı?.includes(k) || data.konu?.includes(k),
    );
  }

  // Groq ile dilekçe metni oluştur (server-side API route üzerinden)
  const generatePetition = async () => {
    if (!analiz) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/dilekce", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          soru,
          konu: analiz.konu,
          hukukAlani: analiz.hukukAlanı,
          ozet: analiz.ozet,
          mevzuat: analiz.mevzuat,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setForm((prev) => ({
        ...prev,
        aciklamalar: data.aciklamalar || prev.aciklamalar,
        sonuc: data.sonuc || prev.sonuc,
      }));
      setGenerated(true);
    } catch (e) {
      console.error("Dilekçe oluşturma hatası:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("pdf-export-area");
    if (!element) return;

    // PDF oluşturma öncesi elementi geçici olarak görünür hale getir
    element.style.position = "static";
    element.style.left = "0";
    element.style.zIndex = "9999"; // Diğer elementlerin üzerinde görünmesini sağlamak için

    const filename = `dilekce-${form.konu || "mevzuatai"}.pdf`;

    const opt = {
      margin: 0,
      filename,
      image: { type: "jpeg" as const, quality: 1 },
      html2canvas: {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (doc: Document) => {
          const allElements = doc.querySelectorAll("*");
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const style = window.getComputedStyle(htmlEl);
            const color = style.color;
            const bg = style.backgroundColor;
            if (color?.includes("lab(")) htmlEl.style.color = "#000000";
            if (bg?.includes("lab("))
              htmlEl.style.backgroundColor = "transparent";
          });
        },
      },
      jsPDF: {
        unit: "mm" as const,
        format: "a4",
        orientation: "portrait" as const,
      },
    };

    try {
      await html2pdf().set(opt).from(element).save();

      // Backend'e kaydet + status güncelle
      if (user?.token && soru) {
        try {
          // 1. Dilekçeyi Draft olarak oluştur
          const createRes = await fetch(`${API_BASE}/api/Petitions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              userPrompt: soru,
              generatedPdfPath: filename,
            }),
          });

          if (createRes.ok) {
            const created = await createRes.json();

            // 2. PDF indirildi → Completed yap
            await fetch(`${API_BASE}/api/Petitions/${created.id}/complete`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
          }
        } catch (e) {
          console.error("Dilekçe kaydedilemedi:", e);
          // PDF zaten indi, sessizce geç
        }
      }
    } catch (error) {
      console.error("PDF oluşturma veya indirme hatası:", error);
    } finally {
      // İşlem bittikten sonra elementi tekrar gizle
      element.style.position = "fixed";
      element.style.left = "-99999px";
      element.style.zIndex = "-1";
    }
  };

  // ── Dilekçe gerekmiyorsa ──
  if (noPetitionNeeded && analiz) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">
            Bu Durumda Dilekçe Gerekmez
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            <strong className="text-gray-700">{analiz.konu}</strong> konusunda
            yapmanız gereken idari başvurudur. Mahkemeye dilekçe vermek yerine
            ilgili kuruma doğrudan başvurabilirsiniz.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-left">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                {analiz.adimlar[0]?.aciklama ||
                  "Analiz sonucundaki adımları takip edin."}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Geri Dön
            </button>
            <button
              onClick={() => setNoPetitionNeeded(false)}
              className="flex-1 rounded-xl bg-[#1B2D5B] py-2.5 text-sm font-semibold text-white hover:bg-[#243d7a] transition-colors"
            >
              Yine de Yaz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Print stili */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-area { display: block !important; position: fixed; top: 0; left: 0; width: 100%; }
          @page {
            margin: 0;
            size: A4;
          }
        }
        #print-area { display: none; }
        #pdf-export-area {
          position: fixed;
          left: -99999px;
          top: 0;
          width: 794px; /* A4 width at 96dpi */
          background: white;
          z-index: -1;
        }
      `}</style>

      {/* Gizli print alanı */}
      <div id="print-area">
        <PrintDocument form={form} analiz={analiz} />
      </div>
      {/* html2pdf için görünmez ama render edilen alan */}
      <div id="pdf-export-area">
        <PrintDocument form={form} analiz={analiz} />
      </div>

      <div className="flex h-screen flex-col bg-[#F7F8FA] lg:flex-row overflow-hidden">
        {/* ── SOL: FORM ── */}
        <div className="w-full lg:max-w-[420px] flex flex-col border-r border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => router.back()}
                className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-gray-500" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1B2D5B]">
                  <Scale className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-serif text-base font-bold text-gray-900">
                  Dilekçe Sihirbazı
                </span>
              </div>
            </div>

            {/* Konu etiketi */}
            {analiz && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-blue-700">
                  {analiz.konu}
                </span>
                <span className="ml-auto text-[10px] font-medium text-blue-500 bg-blue-100 rounded-full px-2 py-0.5">
                  {analiz.hukukAlanı}
                </span>
              </div>
            )}
          </div>

          {/* Form scroll alanı */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* AI Oluştur Butonu */}
            <div className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-4">
              <p className="text-xs text-blue-700 font-medium mb-3 leading-relaxed">
                Bilgileri girdikten sonra yapay zeka dilekçenizin açıklama ve
                sonuç bölümlerini otomatik oluşturabilir.
              </p>
              <button
                onClick={generatePetition}
                disabled={generating || !analiz}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#1B2D5B] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#243d7a] disabled:opacity-50 transition-all"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                    Oluşturuluyor...
                  </>
                ) : generated ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Yeniden Oluştur
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" /> AI ile Otomatik Doldur
                  </>
                )}
              </button>
            </div>

            {/* Mahkeme */}
            <FormField
              label="Mahkeme / Kurum"
              icon={<Building2 className="h-3.5 w-3.5" />}
            >
              <input
                name="mahkeme"
                value={form.mahkeme}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>

            {/* Davacı */}
            <div className="space-y-2">
              <FieldLabel
                icon={<User className="h-3.5 w-3.5" />}
                label="Davacı (Siz)"
              />
              <input
                name="davaci"
                placeholder="Adınız Soyadınız"
                value={form.davaci}
                onChange={handleChange}
                className={inputCls}
              />
              <div className="flex gap-2">
                <input
                  name="tc"
                  placeholder="T.C. Kimlik No"
                  value={form.tc}
                  onChange={handleChange}
                  className={`${inputCls} flex-1`}
                />
              </div>
              <textarea
                name="adres"
                placeholder="Tam Adresiniz"
                value={form.adres}
                onChange={handleChange}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Davalı */}
            <FormField
              label="Davalı / Karşı Taraf"
              icon={<User className="h-3.5 w-3.5" />}
            >
              <input
                name="davali"
                placeholder="Karşı Tarafın Adı Soyadı / Kurumu"
                value={form.davali}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>

            {/* Konu */}
            <FormField label="Konu" icon={<Hash className="h-3.5 w-3.5" />}>
              <input
                name="konu"
                value={form.konu}
                onChange={handleChange}
                className={inputCls}
              />
            </FormField>

            {/* Açıklamalar */}
            <div className="space-y-2">
              <FieldLabel
                icon={<FileText className="h-3.5 w-3.5" />}
                label="Açıklamalar"
              />
              <textarea
                name="aciklamalar"
                value={form.aciklamalar}
                onChange={handleChange}
                rows={7}
                placeholder="Olayın detaylarını buraya yazın veya AI ile otomatik oluşturun..."
                className={`${inputCls} resize-none leading-relaxed`}
              />
              {generated && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-semibold text-emerald-700">
                    AI tarafından oluşturuldu
                  </span>
                </div>
              )}
            </div>

            {/* Sonuç */}
            <div className="space-y-2 pb-6">
              <FieldLabel
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Sonuç ve İstem"
              />
              <textarea
                name="sonuc"
                value={form.sonuc}
                onChange={handleChange}
                rows={4}
                placeholder="Talebinizi buraya yazın..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* ── SAĞ: ÖNİZLEME ── */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-start bg-[#EAECF0] pt-8 pb-8 overflow-y-auto">
          {/* Araç çubuğu */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-gray-600">
                Canlı Önizleme
              </span>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Yazdır
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 rounded-full bg-[#1B2D5B] px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-[#243d7a] transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> PDF İndir
            </button>
          </div>

          {/* A4 kağıt */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-[595px] min-h-[842px] bg-white shadow-2xl"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
          >
            <div id="pdf-content">
              <A4Content form={form} analiz={analiz} />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ─── A4 İçerik — Gerçek TC Mahkeme Dilekçesi Formatı ──────────
function A4Content({
  form,
  analiz,
}: {
  form: FormData;
  analiz: AnalizSonucu | null;
}) {
  return (
    <div className="p-[52px] text-[10.5pt] font-serif leading-[1.8] text-black min-h-[842px]">
      {/* T.C. ibaresi */}
      <div className="text-center text-[11pt] font-bold tracking-[0.15em] mb-1">
        T.C.
      </div>

      {/* Mahkeme adı */}
      <div className="text-center text-[12.5pt] font-bold tracking-wide mb-6 uppercase">
        {form.mahkeme || "__________ MAHKEMESİNE"}
      </div>

      {/* Taraflar bloğu — standart TC format */}
      <table className="w-full mb-5 text-[10pt]">
        <tbody>
          <tr>
            <td className="w-[110px] font-bold align-top py-0.5">DAVACI</td>
            <td className="w-4 align-top py-0.5">:</td>
            <td className="align-top py-0.5 uppercase font-medium">
              {form.davaci || ".................................."}
              {form.tc ? ` - T.C. Kimlik No: ${form.tc}` : ""}
            </td>
          </tr>
          <tr>
            <td className="font-bold align-top py-0.5">ADRESİ</td>
            <td className="align-top py-0.5">:</td>
            <td className="align-top py-0.5">
              {form.adres || ".................................."}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="py-1" />
          </tr>
          <tr>
            <td className="font-bold align-top py-0.5">DAVALI</td>
            <td className="align-top py-0.5">:</td>
            <td className="align-top py-0.5 uppercase font-medium">
              {form.davali || ".................................."}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className="py-1" />
          </tr>
          <tr>
            <td className="font-bold align-top py-0.5">KONU</td>
            <td className="align-top py-0.5">:</td>
            <td className="align-top py-0.5 font-semibold">
              {form.konu || ".................................."}
            </td>
          </tr>
          {analiz && analiz.mevzuat.length > 0 && (
            <tr>
              <td className="font-bold align-top py-0.5">HUKUKİ SEBEP</td>
              <td className="align-top py-0.5">:</td>
              <td className="align-top py-0.5 text-[9.5pt]">
                {analiz.mevzuat.map((m) => `${m.kod} ${m.madde}`).join(", ")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Yatay çizgi */}
      <div className="border-t-2 border-black mb-5" />

      {/* AÇIKLAMALAR */}
      <div className="mb-1 text-[10pt] font-bold tracking-widest underline underline-offset-2">
        AÇIKLAMALAR
      </div>
      <div className="mb-5 whitespace-pre-wrap text-justify text-[10pt] leading-[1.85] min-h-[140px]">
        {form.aciklamalar || (
          <span className="text-gray-300 italic text-[9pt]">
            Açıklama metni buraya gelecek...
          </span>
        )}
      </div>

      {/* DELİLLER */}
      <div className="mb-1 text-[10pt] font-bold tracking-widest underline underline-offset-2">
        DELİLLER
      </div>
      <div className="mb-5 text-[10pt] leading-[1.85]">
        {getDeliller(analiz?.hukukAlanı || "", analiz?.konu || "").map(
          (d, i) => (
            <p key={i}>
              {i + 1}- {d}
            </p>
          ),
        )}
      </div>

      {/* HUKUKİ SEBEPLER */}
      {analiz && analiz.mevzuat.length > 0 && (
        <>
          <div className="mb-1 text-[10pt] font-bold tracking-widest underline underline-offset-2">
            HUKUKİ SEBEPLER
          </div>
          <div className="mb-5 text-[10pt] leading-[1.85]">
            {analiz.mevzuat.map((m, i) => (
              <p key={i}>
                {m.kod} {m.madde} — {m.baslik}
              </p>
            ))}
          </div>
        </>
      )}

      {/* SONUÇ VE İSTEM */}
      <div className="mb-1 text-[10pt] font-bold tracking-widest underline underline-offset-2">
        SONUÇ VE İSTEM
      </div>
      <div className="mb-6 text-justify text-[10pt] leading-[1.85] min-h-[60px]">
        {form.sonuc || (
          <span className="text-gray-300 italic text-[9pt]">
            Sonuç ve istem metni buraya gelecek...
          </span>
        )}
      </div>

      {/* Kapanış */}
      <div className="mb-10 text-[10pt]">Gereğini saygılarımla arz ederim.</div>

      {/* Tarih ve İmza */}
      <div className="flex justify-between items-end mt-8">
        <div className="text-[10pt]">
          <span className="font-bold">Tarih:</span> {form.tarih}
        </div>
        <div className="text-center min-w-[200px]">
          <div className="mb-10 text-[9pt] text-gray-600 font-semibold">
            Davacı
          </div>
          <div className="border-t border-black pt-2 text-[10pt] font-bold uppercase tracking-wide">
            {form.davaci || ".................................."}
          </div>
          {form.tc && (
            <div className="text-[8.5pt] text-gray-600 mt-0.5">
              T.C.: {form.tc}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Hukuk alanına göre delil listesi ────────────────────────
function getDeliller(hukukAlani: string, konu: string): string[] {
  const base = ["Nüfus cüzdanı sureti", "Her türlü yasal delil"];

  const map: Record<string, string[]> = {
    "Kira Hukuku": [
      "Kira sözleşmesi",
      "Kira ödeme makbuzları / banka dekontları",
      "Noter ihtarnamesi (varsa)",
      "Tapu senedi fotokopisi",
    ],
    "İş Hukuku": [
      "İş sözleşmesi",
      "Maaş bordroları",
      "SGK hizmet dökümü",
      "İşyeri yazışmaları / e-postalar",
      "Tanık beyanları",
    ],
    "İş ve Sosyal Güvenlik Hukuku": [
      "İş sözleşmesi",
      "SGK hizmet dökümü",
      "Maaş bordroları",
      "E-devlet sigorta kayıtları",
    ],
    "Aile Hukuku": [
      "Nüfus kayıt örneği",
      "Evlilik cüzdanı",
      "Mal varlığı belgeleri (varsa)",
      "Tanık beyanları",
    ],
    "Ceza Hukuku": [
      "Şikâyet dilekçesi",
      "Delil niteliğindeki belgeler / ekran görüntüleri",
      "Tanık bilgileri",
    ],
    "Tüketici Hukuku": [
      "Fatura / fiş",
      "Sözleşme veya sipariş belgesi",
      "Yazışmalar / e-postalar",
      "Fotoğraf / video (varsa)",
    ],
    "Miras Hukuku": [
      "Veraset ilamı",
      "Tapu ve taşınmaz belgeleri",
      "Vasiyetname (varsa)",
      "Nüfus kayıt örneği",
    ],
    "Borçlar Hukuku": [
      "Borç senedi / sözleşme",
      "Banka dekontları / ödeme kayıtları",
      "Fatura ve yazışmalar",
      "İhtarname (varsa)",
    ],
    "İcra Hukuku": [
      "Borç senedi / sözleşme / fatura",
      "Banka hesap dökümü / ödeme kayıtları",
      "İhtarname veya bildirim yazısı",
      "Kambiyo senedi (varsa — çek, senet, poliçe)",
    ],
    "Ticaret Hukuku": [
      "Ticari sözleşme",
      "Fatura ve irsaliyeler",
      "Banka dekontları",
      "Yazışmalar / e-postalar",
    ],
  };

  const specific = map[hukukAlani] ||
    map[konu] || ["İlgili belgeler ve yazışmalar", "Tanık beyanları"];

  return [...specific, ...base];
}
function TableRow({
  label,
  value,
  border,
  accent,
}: {
  label: string;
  value: string;
  border?: boolean;
  accent?: boolean;
}) {
  return (
    <tr className={border ? "border-t border-gray-100" : ""}>
      <td
        className={`w-[90px] py-2 pl-3 pr-2 text-[8.5pt] font-bold ${accent ? "text-[#1B2D5B]" : "text-gray-500"} align-top`}
      >
        {label}:
      </td>
      <td
        className={`py-2 pr-3 text-[9.5pt] ${accent ? "font-semibold text-[#1B2D5B]" : "text-gray-800"} align-top`}
      >
        {value}
      </td>
    </tr>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b-2 border-[#1B2D5B] pb-1">
      <span className="text-[9pt] font-bold tracking-widest text-[#1B2D5B]">
        {title}
      </span>
    </div>
  );
}

function FormField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel icon={icon} label={label} />
      {children}
    </div>
  );
}

function FieldLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
      <span className="text-gray-400">{icon}</span>
      {label}
    </label>
  );
}

function PrintDocument({
  form,
  analiz,
}: {
  form: FormData;
  analiz: AnalizSonucu | null;
}) {
  const deliller = getDeliller(analiz?.hukukAlanı || "", analiz?.konu || "");
  return (
    <div
      style={{
        padding: "52px 60px",
        fontFamily: "serif",
        fontSize: "11pt",
        lineHeight: 1.8,
        color: "#000",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "11pt",
          letterSpacing: "0.15em",
          marginBottom: "4px",
        }}
      >
        T.C.
      </div>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12.5pt",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        {form.mahkeme}
      </div>
      <table
        style={{
          width: "100%",
          marginBottom: "16px",
          fontSize: "10pt",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {[
            [
              "DAVACI",
              `${form.davaci}${form.tc ? ` - T.C. Kimlik No: ${form.tc}` : ""}`,
            ],
            ["ADRESİ", form.adres],
            ["", ""],
            ["DAVALI", form.davali],
            ["", ""],
            ["KONU", form.konu],
          ].map(([l, v], i) => (
            <tr key={i}>
              <td
                style={{
                  width: "110px",
                  fontWeight: l ? "bold" : "normal",
                  verticalAlign: "top",
                  padding: "2px 0",
                }}
              >
                {l}
              </td>
              <td
                style={{
                  width: "16px",
                  verticalAlign: "top",
                  padding: "2px 0",
                }}
              >
                {l ? ":" : ""}
              </td>
              <td style={{ verticalAlign: "top", padding: "2px 0" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ borderTop: "2px solid black", marginBottom: "16px" }} />
      <div
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          marginBottom: "6px",
          letterSpacing: "2px",
          fontSize: "10pt",
        }}
      >
        AÇIKLAMALAR
      </div>
      <div
        style={{
          marginBottom: "16px",
          textAlign: "justify",
          whiteSpace: "pre-wrap",
          minHeight: "120px",
        }}
      >
        {form.aciklamalar}
      </div>
      <div
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          marginBottom: "6px",
          letterSpacing: "2px",
          fontSize: "10pt",
        }}
      >
        DELİLLER
      </div>
      <div style={{ marginBottom: "16px" }}>
        {deliller.map((d, i) => (
          <div key={i}>
            {i + 1}- {d}
          </div>
        ))}
      </div>
      <div
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          marginBottom: "6px",
          letterSpacing: "2px",
          fontSize: "10pt",
        }}
      >
        SONUÇ VE İSTEM
      </div>
      <div style={{ marginBottom: "24px", textAlign: "justify" }}>
        {form.sonuc}
      </div>
      <div style={{ marginBottom: "32px" }}>
        Gereğini saygılarımla arz ederim.
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "32px",
        }}
      >
        <div>
          <strong>Tarih:</strong> {form.tarih}
        </div>
        <div style={{ textAlign: "center", minWidth: "200px" }}>
          <div style={{ marginBottom: "40px", fontSize: "9pt", color: "#555" }}>
            Davacı
          </div>
          <div
            style={{
              borderTop: "1px solid black",
              paddingTop: "6px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {form.davaci}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1B2D5B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B2D5B]/30 transition-all";

export default withAuth(CreatePetitionPage);
