"use client";

import {
  Scale,
  Menu,
  X,
  LogOut,
  User,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Kullanıcının baş harfleri
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <Scale className="h-5 w-5 text-primary" />
          <span className="font-serif text-xl font-semibold text-foreground tracking-wide">
            MevzuatAI
          </span>
        </button>

        {/* Orta linkler */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#nasil-calisir"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Nasıl Çalışır?
          </a>
          <a
            href="#sablonlar"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Şablonlar
          </a>
          <a
            href="#iletisim"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            İletişim
          </a>
        </div>

        {/* Sağ taraf — auth */}
        <div className="hidden md:block">
          {user ? (
            // ── Giriş yapılmış: Avatar + Dropdown ──
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-2 py-1.5 hover:bg-secondary transition-colors"
              >
                {/* Avatar */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {getInitials(user.userName)}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user.userName}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menü */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-background shadow-xl overflow-hidden">
                  {/* Kullanıcı bilgisi */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {user.userName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Üye
                    </p>
                  </div>

                  {/* Menü öğeleri */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Dilekçelerim
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profilim
                    </button>
                  </div>

                  {/* Çıkış */}
                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ── Giriş yapılmamış: Giriş Yap butonu ──
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/login")}
                className="rounded-full border border-border px-5 py-1.5 text-xs font-medium tracking-wide uppercase text-foreground hover:bg-secondary transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => router.push("/register")}
                className="rounded-full bg-primary px-5 py-1.5 text-xs font-medium tracking-wide uppercase text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Kayıt Ol
              </button>
            </div>
          )}
        </div>

        {/* Mobil menü butonu */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobil menü */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="#nasil-calisir"
              className="text-sm text-muted-foreground py-2"
            >
              Nasıl Çalışır?
            </a>
            <a href="#sablonlar" className="text-sm text-muted-foreground py-2">
              Şablonlar
            </a>
            <a href="#iletisim" className="text-sm text-muted-foreground py-2">
              İletişim
            </a>

            <div className="border-t border-border pt-3 mt-1">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {getInitials(user.userName)}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {user.userName}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/dashboard");
                    }}
                    className="text-left text-sm text-muted-foreground py-2"
                  >
                    Dilekçelerim
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="text-left text-sm text-red-600 py-2"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/login")}
                    className="rounded-full border border-border px-5 py-1.5 text-xs font-medium w-fit"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => router.push("/register")}
                    className="rounded-full bg-primary px-5 py-1.5 text-xs font-medium text-primary-foreground w-fit"
                  >
                    Kayıt Ol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
