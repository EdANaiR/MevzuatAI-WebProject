import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

// 1. Lovable'daki "Inter" fontu (Düz metinler için)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// 2. Lovable'daki "Cormorant Garamond" fontu (Başlıklar için - O resmi havayı veren bu)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MevzuatAI",
  description: "Hukuki Asistanınız",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      {/* Font değişkenlerini buraya ekliyoruz */}
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
