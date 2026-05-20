import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="iletisim"
      className="border-t border-border bg-background py-12 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className="font-serif text-lg font-semibold text-foreground">
            MevzuatAI
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
          MevzuatAI bir bilgilendirme aracıdır ve hukuki danışmanlık yerine
          geçmez. Önemli kararlarınızda bir avukata danışmanızı öneririz.
        </p>
        <p className="text-xs text-muted-foreground">
          © 2026 MevzuatAI. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
