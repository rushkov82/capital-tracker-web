import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import {
  generateSessionToken,
  getSessionCookieName,
  hashSessionToken,
} from "@/lib/session";

type LoginBody = {
  email?: string;
  password?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email обязателен." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Пароль обязателен." }, { status: 400 });
  }

  const client = await pool.connect();

  try {
    const foundUser = await client.query<{
      id: string;
      name: string;
      email: string;
      password_hash: string;
      email_confirmed_at: string | null;
    }>(
      `
        SELECT id, name, email, password_hash, email_confirmed_at
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [normalizeEmail(email)]
    );

    const user = foundUser.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль." },
        { status: 401 }
      );
    }

    const passwordOk = verifyPassword(password, user.password_hash);

    if (!passwordOk) {
      return NextResponse.json(
        { error: "Неверный email или пароль." },
        { status: 401 }
      );
    }

    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Подтвердите email перед входом." },
        { status: 403 }
      );
    }

    const rawSessionToken = generateSessionToken();
    const sessionTokenHash = hashSessionToken(rawSessionToken);

    await client.query(
      `
        INSERT INTO user_sessions (user_id, session_token_hash, expires_at)
        VALUES ($1, $2, NOW() + INTERVAL '14 days')
      `,
      [user.id, sessionTokenHash]
    );

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set({
      name: getSessionCookieName(),
      value: rawSessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Не удалось выполнить вход." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
