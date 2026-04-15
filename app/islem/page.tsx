"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  FileText,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";

const loadingSteps = [
  { text: "Hukuki sorun analiz ediliyor...", icon: BrainCircuit },
  { text: "İlgili kanun maddeleri taranıyor...", icon: Scale },
  { text: "Yargıtay emsal kararları inceleniyor...", icon: FileText },
  { text: "Size özel çözüm haritası oluşturuluyor...", icon: ShieldCheck },
  { text: "İşlem tamamlanıyor...", icon: CheckCircle2 },
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = searchParams.get("q") || "";

    // Adım animasyonu
    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev,
      );
    }, 800);

    // Gemini API'ye gönder
    const runAnaliz = async () => {
      try {
        const res = await fetch("/api/analiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ soru: query }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Analiz başarısız");
        }

        // Sonucu sessionStorage'a kaydet — analysis sayfası okuyacak
        sessionStorage.setItem("analiz_sonucu", JSON.stringify(data.analiz));
        sessionStorage.setItem("analiz_soru", query);

        // Minimum 3 saniye bekle (animasyon için)
        setTimeout(() => {
          clearInterval(interval);
          router.push("/analysis");
        }, 3000);
      } catch (err) {
        clearInterval(interval);
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    };

    runAnaliz();

    return () => clearInterval(interval);
  }, [router, searchParams]);

  const CurrentIcon = loadingSteps[currentStep].icon;

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 border border-red-200">
            <Scale className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
            Bir sorun oluştu
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-xl"
        >
          <div className="relative">
            <Scale className="h-12 w-12 text-primary" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-primary"></span>
            </span>
          </div>
        </motion.div>

        <div className="min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5"
            >
              <CurrentIcon className="h-10 w-10 text-muted-foreground/60" />
              <h2 className="font-serif text-2xl font-bold text-foreground">
                {loadingSteps[currentStep].text}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-muted border border-border">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
          />
        </div>

        <p className="mt-4 text-xs font-medium text-muted-foreground animate-pulse">
          Yapay zeka veritabanını tarıyor...
        </p>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          Yükleniyor...
        </div>
      }
    >
      <LoadingContent />
    </Suspense>
  );
}
