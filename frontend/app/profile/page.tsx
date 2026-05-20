"use client";

import { Scale, Mail, User, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, withAuth } from "@/lib/auth-context";

function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-lg mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1B2D5B]">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900">
                Profil
              </h1>
              <p className="text-sm text-gray-500">Hesap bilgileriniz</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Ad Soyad</p>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.userName || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Kullanıcı ID
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {user?.userId || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-8 w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
