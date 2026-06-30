"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, redirectTo || undefined);
    } catch (err: any) {
      setError(err.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Sol panel — dekoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B2D5B] flex-col justify-between p-12 relative overflow-hidden">
        {/* Arka plan deseni */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-white">
            MevzuatAI
          </span>
        </div>

        {/* Alıntı */}
        <div className="relative">
          <div className="mb-6 text-5xl text-white/20 font-serif">"</div>
          <p className="text-xl font-serif text-white/90 leading-relaxed mb-4">
            Hukukun gücünü herkesin eline ulaştırmak için buradayız.
          </p>
          <p className="text-sm text-white/50 font-medium">
            Türkiye'nin AI destekli hukuk asistanı
          </p>

          {/* İstatistikler */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: "10K+", label: "Analiz" },
              { value: "6", label: "Kanun" },
              { value: "99%", label: "Doğruluk" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-white/10 p-4 text-center backdrop-blur"
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/30">
          © 2026 MevzuatAI. Tüm hakları saklıdır.
        </p>
      </div>

      {/* Sağ panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobil logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B2D5B]">
              <Scale className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-lg font-bold text-gray-900">
              MevzuatAI
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
              Hoş geldiniz
            </h1>
            <p className="text-sm text-gray-500">Hesabınıza giriş yapın</p>
          </div>

          {/* Hata */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
            >
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                E-Posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20 transition-all"
              />
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Giriş butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B2D5B] py-3 text-sm font-bold text-white shadow-lg shadow-[#1B2D5B]/20 hover:bg-[#243d7a] disabled:opacity-60 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Giriş
                  yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Alt link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#1B2D5B] hover:underline"
            >
              Ücretsiz kayıt olun
            </Link>
          </p>

          {/* Yasal uyarı */}
          <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed">
            Giriş yaparak{" "}
            <span className="underline cursor-pointer">Kullanım Koşulları</span>
            'nı ve{" "}
            <span className="underline cursor-pointer">
              Gizlilik Politikası
            </span>
            'nı kabul etmiş olursunuz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1B2D5B]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
