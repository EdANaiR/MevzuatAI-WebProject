"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Printer, Save, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// BURASI ÇOK ÖNEMLİ: "export default" olmak zorunda
export default function CreatePetitionPage() {
  const router = useRouter();

  // Form Verilerini Tutan State
  const [formData, setFormData] = useState({
    mahkeme: "NÖBETÇİ SULH HUKUK MAHKEMESİNE",
    davaci: "",
    tc: "",
    adres: "",
    davali: "",
    konu: "Kiralananın Tahliyesi İstemi",
    aciklamalar: "Mülkiyeti şahsıma ait olan...",
    sonuc: "Yukarıda arz ve izah edilen nedenlerle...",
    tarih: new Date().toLocaleDateString("tr-TR"),
  });

  // Input değişimlerini yakalayan fonksiyon
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row overflow-hidden">
      {/* --- SOL TARAF: FORM ALANI --- */}
      <div className="w-full flex-1 overflow-y-auto border-r border-border bg-background p-6 lg:max-w-md lg:p-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Dilekçe Sihirbazı
            </h1>
            <p className="text-xs text-muted-foreground">
              Bilgileri doldurun, dilekçeniz hazırlansın.
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Mahkeme / Kurum
            </label>
            <input
              name="mahkeme"
              value={formData.mahkeme}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Davacı (Siz)
            </label>
            <input
              name="davaci"
              placeholder="Adınız Soyadınız"
              value={formData.davaci}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              name="tc"
              placeholder="T.C. Kimlik No"
              value={formData.tc}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              name="adres"
              placeholder="Tam Adresiniz"
              value={formData.adres}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Davalı (Karşı Taraf)
            </label>
            <input
              name="davali"
              placeholder="Karşı Tarafın Adı Soyadı"
              value={formData.davali}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Konu Özeti
            </label>
            <input
              name="konu"
              value={formData.konu}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Olayın Detayları (Açıklamalar)
            </label>
            <textarea
              name="aciklamalar"
              value={formData.aciklamalar}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            <p className="text-[10px] text-muted-foreground">
              Yapay zeka burayı sizin yerinize optimize edebilir.
            </p>
          </div>
        </div>

        {/* Action Buttons (Mobile) */}
        <div className="mt-8 lg:hidden pb-10">
          <button className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg">
            Dilekçeyi İndir (PDF)
          </button>
        </div>
      </div>

      {/* --- SAĞ TARAF: CANLI ÖNİZLEME (A4 Kağıdı) --- */}
      <div className="hidden flex-1 flex-col items-center justify-center bg-muted/40 p-8 lg:flex">
        {/* Toolbar */}
        <div className="mb-6 flex gap-3">
          <button className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors cursor-pointer">
            <Printer className="h-3.5 w-3.5" /> Yazdır
          </button>
          <button className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-all cursor-pointer">
            <Download className="h-3.5 w-3.5" /> PDF İndir
          </button>
        </div>

        {/* A4 Paper Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[842px] w-[595px] origin-top scale-[0.85] overflow-hidden bg-white shadow-2xl ring-1 ring-black/5"
        >
          <div className="h-full w-full p-[60px] text-[11pt] font-serif leading-[1.6] text-black">
            {/* MAHKEME BAŞLIĞI */}
            <div className="mb-12 text-center font-bold tracking-wide">
              {formData.mahkeme.toLocaleUpperCase("tr-TR") ||
                "__________ MAHKEMESİNE"}
            </div>

            {/* TARAFLAR */}
            <div className="mb-6 grid grid-cols-[100px_1fr] gap-y-3">
              <div className="font-bold">DAVACI:</div>
              <div className="uppercase">
                {formData.davaci || "__________________"}
                {formData.tc && ` (TC: ${formData.tc})`}
              </div>

              <div className="font-bold">ADRES:</div>
              <div>{formData.adres || "__________________"}</div>

              <div className="font-bold">DAVALI:</div>
              <div className="uppercase">
                {formData.davali || "__________________"}
              </div>

              <div className="font-bold">KONU:</div>
              <div>{formData.konu}</div>
            </div>

            {/* AÇIKLAMALAR */}
            <div className="mt-8 mb-4 border-b border-black pb-1 font-bold">
              AÇIKLAMALAR
            </div>
            <div className="mb-6 min-h-[150px] whitespace-pre-wrap text-justify">
              {formData.aciklamalar}
            </div>

            {/* SONUÇ VE İSTEM */}
            <div className="mb-4 border-b border-black pb-1 font-bold">
              SONUÇ VE İSTEM
            </div>
            <div className="mb-8 text-justify">{formData.sonuc}</div>

            {/* İMZA */}
            <div className="mt-16 flex justify-end px-10">
              <div className="text-center">
                <div className="mb-2">{formData.tarih}</div>
                <div className="font-bold uppercase">
                  {formData.davaci || "İmza"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
