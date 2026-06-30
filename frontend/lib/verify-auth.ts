import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const ISSUER = process.env.JWT_ISSUER ?? "MevzuatAI";
const AUDIENCE = process.env.JWT_AUDIENCE ?? "MevzuatAIClient";

export type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

/** Next.js API route'larinda JWT dogrulama (backend ile ayni secret) */
export async function requireAuth(req: NextRequest): Promise<AuthResult> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Giriş yapmanız gerekiyor." },
        { status: 401 },
      ),
    };
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET tanimli degil");
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Sunucu yapılandırması eksik." },
        { status: 500 },
      ),
    };
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      {
        issuer: ISSUER,
        audience: AUDIENCE,
      },
    );

    const userId = payload.sub;
    if (!userId) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Geçersiz oturum." },
          { status: 401 },
        ),
      };
    }

    return { ok: true, userId: String(userId) };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Oturum süresi dolmuş veya geçersiz. Lütfen tekrar giriş yapın." },
        { status: 401 },
      ),
    };
  }
}
