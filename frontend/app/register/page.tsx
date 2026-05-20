"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
    } catch (err: any) {
      setError(err.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: "Zayıf", color: "bg-red-400", width: "w-1/4" };
    if (p.length < 10)
      return { label: "Orta", color: "bg-amber-400", width: "w-2/4" };
    return { label: "Güçlü", color: "bg-emerald-500", width: "w-full" };
  };

  const strength = passwordStrength();

  const benefits = [
    "Sınırsız hukuki analiz",
    "Otomatik dilekçe oluşturma",
    "mevzuat.gov.tr entegrasyonu",
    "Kayıtlı dilekçe geçmişi",
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Sol panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B2D5B] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-white">
            MevzuatAI
          </span>
        </div>

        <div className="relative">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            Ücretsiz hesap açın
          </h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Türkiye'nin en gelişmiş AI destekli hukuk asistanına erişin.
          </p>

          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
                <span className="text-sm text-white/80">{b}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/30">
          © 2026 MevzuatAI. Tüm hakları saklıdır.
        </p>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
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
              Hesap oluştur
            </h1>
            <p className="text-sm text-gray-500">
              Birkaç saniyede ücretsiz kayıt olun
            </p>
          </div>

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
            {/* Ad Soyad */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Ad
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Adınız"
                  required
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Soyad
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Soyadınız"
                  required
                  className={inputCls}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                E-Posta
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ornek@email.com"
                required
                className={inputCls}
              />
            </div>

            {/* Şifre */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Şifre
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="En az 6 karakter"
                  required
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Şifre gücü */}
              {strength && (
                <div className="space-y-1">
                  <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Şifre gücü:{" "}
                    <span className="font-semibold">{strength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Şifre tekrar */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Şifre Tekrar
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Şifrenizi tekrar girin"
                required
                className={`${inputCls} ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : form.confirmPassword &&
                        form.password === form.confirmPassword
                      ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200"
                      : ""
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B2D5B] py-3 text-sm font-bold text-white shadow-lg shadow-[#1B2D5B]/20 hover:bg-[#243d7a] disabled:opacity-60 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Kayıt
                  oluşturuluyor...
                </>
              ) : (
                <>
                  Ücretsiz Kayıt Ol <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Zaten hesabınız var mı?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#1B2D5B] hover:underline"
            >
              Giriş yapın
            </Link>
          </p>

          <p className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
            Kayıt olarak{" "}
            <span className="underline cursor-pointer">Kullanım Koşulları</span>
            'nı kabul etmiş olursunuz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20 transition-all";
