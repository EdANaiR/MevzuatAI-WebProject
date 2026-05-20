"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  Scale,
  Search,
  AlertTriangle,
  Loader2,
  Calendar,
  Eye,
  X,
  FileDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, withAuth } from "@/lib/auth-context";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5023";

type Petition = {
  id: string;
  userPrompt: string;
  generatedPdfPath: string;
  status: number;
  statusLabel: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
};

function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Petition | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchPetitions();
  }, []);

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/Petitions`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Dilekçeler yüklenemedi");
      const data = await res.json();
      setPetitions(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePetition = async (id: string) => {
    if (!confirm("Bu dilekçeyi silmek istediğinizden emin misiniz?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/Petitions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Silinemedi");
      setPetitions((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert("Silme işlemi başarısız: " + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const openPetition = async (petition: Petition) => {
    setSelected(petition);
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Petitions/${petition.id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSelected(data);
      }
    } catch {
      /* listeden goster */
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = petitions.filter((p) =>
    p.userPrompt.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: petitions.length,
    completed: petitions.filter((p) => p.status === 1).length,
    draft: petitions.filter((p) => p.status === 0).length,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2D5B] text-lg font-bold text-white">
                {user ? getInitials(user.userName) : "?"}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">
                  Hoş geldiniz, {user?.userName.split(" ")[0]}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Dilekçelerinizi buradan yönetebilirsiniz
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-xl bg-[#1B2D5B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#243d7a] transition-colors shadow-lg shadow-[#1B2D5B]/20"
            >
              <Plus className="h-4 w-4" />
              Yeni Analiz
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Toplam Dilekçe",
              value: stats.total,
              icon: FileText,
              color: "bg-blue-50 text-blue-600 border-blue-100",
            },
            {
              label: "Tamamlanan",
              value: stats.completed,
              icon: CheckCircle2,
              color: "bg-emerald-50 text-emerald-600 border-emerald-100",
            },
            {
              label: "Taslak",
              value: stats.draft,
              icon: Clock,
              color: "bg-amber-50 text-amber-600 border-amber-100",
            },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">{s.label}</p>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border ${s.color}`}
                >
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Arama */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Dilekçe ara..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1B2D5B] focus:outline-none focus:ring-2 focus:ring-[#1B2D5B]/20 transition-all"
            />
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#1B2D5B]" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600">{error}</p>
              <button
                onClick={fetchPetitions}
                className="mt-3 text-sm font-semibold text-[#1B2D5B] hover:underline"
              >
                Tekrar dene
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
              {search ? "Sonuç bulunamadı" : "Henüz dilekçeniz yok"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              {search
                ? "Farklı bir arama terimi deneyin."
                : "Ana sayfadan hukuki sorununuzu analiz ettirip ilk dilekçenizi oluşturun."}
            </p>
            {!search && (
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 rounded-xl bg-[#1B2D5B] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#243d7a] transition-colors"
              >
                <Plus className="h-4 w-4" />
                İlk Dilekçemi Oluştur
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((petition, i) => (
                <motion.div
                  key={petition.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPetition(petition)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && openPetition(petition)
                  }
                  className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* İkon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        petition.status === 1 ? "bg-emerald-50" : "bg-amber-50"
                      }`}
                    >
                      {petition.status === 1 ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            petition.status === 1
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {petition.statusLabel}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {petition.userPrompt}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatDate(petition.createdDate)}
                        </span>
                      </div>
                    </div>

                    {/* Aksiyonlar */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPetition(petition);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Detay"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePetition(petition.id);
                        }}
                        disabled={deletingId === petition.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {deletingId === petition.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detay modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-serif text-lg font-bold text-gray-900">
                  Dilekçe Detayı
                </h2>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-1.5 hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {detailLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1B2D5B]" />
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Konu
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {selected.userPrompt}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          selected.status === 1
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {selected.statusLabel}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(selected.createdDate)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        PDF dosya adı
                      </p>
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <FileDown className="h-4 w-4 shrink-0" />
                        {selected.generatedPdfPath || "—"}
                      </p>
                      <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                        PDF dosyası cihazınıza indirilmiştir. Sunucuda saklama
                        henüz aktif değil; yeniden indirmek için dilekçe
                        oluşturma sayfasını kullanın.
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono break-all">
                      ID: {selected.id}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default withAuth(DashboardPage);
