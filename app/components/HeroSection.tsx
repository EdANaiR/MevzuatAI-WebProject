"use client";

import { ArrowRight, Sparkles, FileText, Scale, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Router'ı import ettik

const suggestions = [
  {
    label: "Kiracı Tahliyesi İçin İhtarname",
    icon: <FileText className="w-4 h-4" />,
  },
  { label: "Anlaşmalı Boşanma Protokolü", icon: <Scale className="w-4 h-4" /> },
  { label: "İcra Takibi Başlatma", icon: <Gavel className="w-4 h-4" /> },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter(); // 2. Router'ı tanımladık

  const handleAnalyze = () => {
    // Eğer kutu boşsa işlem yapma
    if (!query.trim()) return;

    console.log("Analiz başlatılıyor:", query);

    // 3. Loading sayfasına yönlendir (Query'i de yanına ekle)
    router.push(`/islem?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden bg-background pt-20">
      {/* Arka Plan Süslemeleri */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Hukuki Sorununuza <br className="hidden sm:block" />
              <span className="text-primary relative inline-block">
                Resmi Çözüm
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/20 -z-10"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              Bulun.
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl font-medium">
              Karmaşık kanun maddeleri arasında kaybolmayın. Derdinizi kendi
              cümlelerinizle anlatın, yapay zeka size yol göstersin ve gerekli
              dilekçeyi saniyeler içinde hazırlasın.
            </p>
          </motion.div>

          {/* INPUT ALANI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto max-w-3xl"
          >
            <div className="group relative rounded-2xl border border-border/60 bg-white/50 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 hover:border-primary/30 dark:bg-black/20">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Örneğin: Ev sahibim depozitomu geri vermiyor, 2 aydır oyalıyor. Elimde sözleşme var ama noter onaylı değil. Ne yapmam gerekiyor?"
                className="min-h-[180px] w-full resize-none rounded-xl bg-transparent px-6 py-5 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />

              <div className="flex items-center justify-between px-4 pb-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>AI Mevzuat Uzmanı Aktif</span>
                </div>

                <button
                  onClick={handleAnalyze}
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 cursor-pointer"
                >
                  Çözüm Üret
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Arka plan parlaması */}
            <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          </motion.div>

          {/* Öneriler */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <span className="text-sm font-medium text-muted-foreground py-2">
              Sık sorulanlar:
            </span>
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => setQuery(s.label)}
                className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary cursor-pointer"
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
