"use client"; // Bu satır zorunlu! Çünkü kullanıcıyla etkileşime (tıklama, yazma) giriyoruz.

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ... önceki kodlar aynı ...

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Backend'e istek atıyoruz (Port numarasına dikkat et!)
      const response = await axios.post(
        "http://localhost:5023/api/Auth/login",
        {
          email: email,
          password: password,
        },
      );

      // 2. Eğer başarılıysa burası çalışır
      console.log("Giriş Başarılı!", response.data);

      // 3. Token'ı tarayıcının hafızasına (LocalStorage) kaydediyoruz
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      // 4. Kullanıcıyı Ana Sayfaya yönlendiriyoruz
      alert("Giriş Başarılı! Yönlendiriliyorsunuz...");
      router.push("/");
    } catch (err: any) {
      // 5. Hata varsa burası çalışır
      console.error(err);
      // Backend'den gelen özel hata mesajı var mı? Varsa onu göster, yoksa genel hata yaz.
      setError(
        err.response?.data?.message || "Giriş başarısız! Sunucu hatası.",
      );
    }
  };

  // ... return kısmı aynı ...

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        {/* Başlık */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          MevzuatAI'ye Giriş Yap
        </h2>

        {/* Hata Mesajı Kutusu */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Alanı */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              E-Posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="ornek@email.com"
              required
            />
          </div>

          {/* Şifre Alanı */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="******"
              required
            />
          </div>

          {/* Buton */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Giriş Yap
          </button>
        </form>

        {/* Alt Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Hesabın yok mu?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
}
