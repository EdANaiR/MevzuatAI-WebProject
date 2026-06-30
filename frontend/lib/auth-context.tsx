"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ─── Tipler ───────────────────────────────────────────────────
type AuthUser = {
  userId: string;
  userName: string;
  token: string;
};

type AuthContextType = {
  user: AuthUser | null;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

// ─── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5023";

// ─── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sayfa yüklenince localStorage'dan user'ı geri yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mevzuat_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    redirectTo?: string,
  ) => {
    const res = await fetch(`${API_BASE}/api/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Giriş başarısız");
    }

    const data: AuthUser = await res.json();
    localStorage.setItem("mevzuat_user", JSON.stringify(data));
    setUser(data);
    router.push(redirectTo || "/");
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    const res = await fetch(`${API_BASE}/api/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Kayıt başarısız");
    }

    const data: AuthUser = await res.json();
    localStorage.setItem("mevzuat_user", JSON.stringify(data));
    setUser(data);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("mevzuat_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ─── Korumalı rota HOC ────────────────────────────────────────
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) router.push("/login");
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
