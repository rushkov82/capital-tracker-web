import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashPassword, hashToken } from "@/lib/auth";

type ResetPasswordBody = {
  token?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: ResetPasswordBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON." }, { status: 400 });
  }

  const rawToken = body.token?.trim() ?? "";
  const password = body.password ?? "";

  if (!rawToken) {
    return NextResponse.json({ error: "Токен обязателен." }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Пароль обязателен." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Пароль должен быть не короче 6 символов." },
      { status: 400 }
    );
  }

  const tokenHash = hashToken(rawToken);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tokenResult = await client.query<{
      id: string;
      user_id: string;
      used_at: string | null;
      expires_at: string;
    }>(
      `
        SELECT id, user_id, used_at, expires_at
        FROM auth_tokens
        WHERE token_hash = $1
          AND type = 'password_reset'
        LIMIT 1
      `,
      [tokenHash]
    );

    const tokenRow = tokenResult.rows[0];

    if (!tokenRow) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Ссылка недействительна." },
        { status: 400 }
      );
    }

    if (tokenRow.used_at) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Ссылка уже была использована." },
        { status: 400 }
      );
    }

    const expiresAt = new Date(tokenRow.expires_at);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Ссылка устарела." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    await client.query(
      `
        UPDATE users
        SET password_hash = $2,
            updated_at = NOW()
        WHERE id = $1
      `,
      [tokenRow.user_id, passwordHash]
    );

    await client.query(
      `
        UPDATE auth_tokens
        SET used_at = NOW()
        WHERE id = $1
      `,
      [tokenRow.id]
    );

    await client.query(
      `
        DELETE FROM user_sessions
        WHERE user_id = $1
      `,
      [tokenRow.user_id]
    );

    await client.query("COMMIT");

    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Reset password error:", error);

    return NextResponse.json(
      { error: "Не удалось обновить пароль." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
