"use client";

import {
  ArrowRight,
  Sparkles,
  FileText,
  Scale,
  Gavel,
  Send,
  MessageSquare,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/client-auth";

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
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleAnalyze = () => {
    if (!query.trim()) return;
    const target = `/islem?q=${encodeURIComponent(query)}`;
    if (!getStoredToken()) {
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    router.push(target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
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
            <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
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

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl font-medium text-balance">
              Karmaşık kanun maddeleri arasında kaybolmayın. Derdinizi kendi
              cümlelerinizle anlatın, yapay zeka size yol göstersin ve gerekli
              dilekçeyi saniyeler içinde hazırlasın.
            </p>
          </motion.div>

          {/* MODERN AI INPUT ALANI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto max-w-3xl"
          >
            {/* Ana Input Konteyneri - Elegant Warm Design */}
            <div
              className={`
                relative overflow-hidden rounded-3xl 
                bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100
                border-2 transition-all duration-500 ease-out
                ${
                  isFocused
                    ? "border-primary shadow-[0_8px_60px_-12px] shadow-primary/25"
                    : "border-stone-200/80 shadow-xl shadow-stone-300/20 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px] hover:shadow-primary/15"
                }
              `}
            >
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.08),transparent_40%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(180,160,130,0.1),transparent_40%)]" />
              </div>

              {/* Üst Gradient Bar */}
              <div
                className={`
                h-1.5 w-full bg-gradient-to-r from-primary via-emerald-500 to-primary
                transition-all duration-500
                ${isFocused ? "opacity-100" : "opacity-60"}
              `}
              />

              {/* Input Header */}
              <div className="relative flex items-center gap-3 px-6 pt-5 pb-3">
                <div
                  className={`
                  flex items-center justify-center w-11 h-11 rounded-2xl 
                  bg-gradient-to-br from-primary/15 to-emerald-500/10
                  border border-primary/25
                  transition-all duration-300
                  ${isFocused ? "scale-110 border-primary/50 shadow-md shadow-primary/15" : ""}
                `}
                >
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-stone-800">
                    Hukuki Sorunuzu Anlatın
                  </h3>
                  <p className="text-xs text-stone-500">
                    Detaylı açıklama daha iyi sonuç verir
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                    bg-primary/10 text-primary border border-primary/25
                    ${isFocused ? "animate-pulse" : ""}
                  `}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    AI Hazır
                  </div>
                </div>
              </div>

              {/* Textarea Alanı */}
              <div className="relative px-6 pb-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Örneğin: Ev sahibim depozitomu geri vermiyor, 2 aydır oyalıyor. Elimde sözleşme var ama noter onaylı değil. Ne yapmam gerekiyor?"
                  className="
                    w-full min-h-[140px] resize-none 
                    bg-transparent 
                    text-base leading-relaxed text-stone-800 
                    placeholder:text-stone-400
                    focus:outline-none
                  "
                />
              </div>

              {/* Alt Action Bar */}
              <div className="relative flex items-center justify-between gap-4 px-6 py-4 bg-gradient-to-r from-stone-100/80 via-amber-50/50 to-stone-100/80 border-t border-stone-200/60">
                {/* Sol Kısım - Bilgi */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Yapay Zeka Destekli</span>
                  </div>
                  <div className="hidden sm:block h-4 w-px bg-stone-300" />
                  <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Anlık Analiz</span>
                  </div>
                </div>

                {/* Sağ Kısım - Buton */}
                <motion.button
                  onClick={handleAnalyze}
                  disabled={!query.trim()}
                  whileHover={{ scale: query.trim() ? 1.03 : 1 }}
                  whileTap={{ scale: query.trim() ? 0.97 : 1 }}
                  className={`
                    group relative flex items-center gap-2.5 
                    px-6 py-3 rounded-2xl
                    text-sm font-semibold
                    transition-all duration-300 cursor-pointer
                    ${
                      query.trim()
                        ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40"
                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                    }
                  `}
                >
                  <span>Çözüm Üret</span>
                  <div
                    className={`
                    flex items-center justify-center w-6 h-6 rounded-lg
                    transition-all duration-300
                    ${
                      query.trim()
                        ? "bg-white/20 group-hover:translate-x-0.5"
                        : "bg-stone-300/50"
                    }
                  `}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Floating Glow Effect */}
            <div
              className={`
              absolute -inset-4 -z-10 rounded-[2rem]
              bg-gradient-to-r from-primary/15 via-emerald-400/10 to-primary/15
              blur-3xl transition-opacity duration-700
              ${isFocused ? "opacity-100" : "opacity-40"}
            `}
            />

            {/* Decorative Corner Accents */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl -z-10" />
          </motion.div>

          {/* Öneriler */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <span className="text-sm font-medium text-muted-foreground py-2">
              Sık sorulanlar:
            </span>
            {suggestions.map((s) => (
              <motion.button
                key={s.label}
                onClick={() => setQuery(s.label)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="
                  flex items-center gap-2 
                  rounded-2xl border border-border/60 
                  bg-background/80 backdrop-blur-sm
                  px-4 py-2.5 text-sm font-medium text-foreground 
                  shadow-sm transition-all duration-300
                  hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:shadow-md
                  cursor-pointer
                "
              >
                <span className="text-primary/70">{s.icon}</span>
                {s.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
