"use client";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Scale className="h-5 w-5 text-primary" />
          <span className="font-serif text-xl font-semibold text-foreground tracking-wide">
            MevzuatAI
          </span>
        </div>

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

        <div className="hidden md:block">
          <button className="rounded-full border border-border px-5 py-1.5 text-xs font-medium tracking-wide uppercase text-foreground hover:bg-secondary transition-colors">
            Giriş Yap
          </button>
        </div>

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
            <button className="rounded-full border border-border px-5 py-1.5 text-xs font-medium w-fit">
              Giriş Yap
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
