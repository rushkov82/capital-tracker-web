import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { getSessionCookieName, hashSessionToken } from "@/lib/session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const rawSessionToken = cookieStore.get(getSessionCookieName())?.value;

    if (rawSessionToken) {
      const sessionTokenHash = hashSessionToken(rawSessionToken);

      await pool.query(
        `DELETE FROM user_sessions WHERE session_token_hash = $1`,
        [sessionTokenHash]
      );
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: getSessionCookieName(),
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { ok: false, error: "Не удалось выполнить выход." },
      { status: 500 }
    );
  }
}
