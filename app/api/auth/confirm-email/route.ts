import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { hashToken } from "@/lib/auth";

type ConfirmEmailBody = {
  token?: string;
};

export async function POST(request: Request) {
  let body: ConfirmEmailBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON." }, { status: 400 });
  }

  const rawToken = body.token?.trim() ?? "";

  if (!rawToken) {
    return NextResponse.json({ error: "Токен обязателен." }, { status: 400 });
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
      email_confirmed_at: string | null;
    }>(
      `
        SELECT
          t.id,
          t.user_id,
          t.used_at,
          t.expires_at,
          u.email_confirmed_at
        FROM auth_tokens t
        JOIN users u ON u.id = t.user_id
        WHERE t.token_hash = $1
          AND t.type = 'email_confirm'
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

      if (tokenRow.email_confirmed_at) {
        return NextResponse.json({ ok: true });
      }

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

    await client.query(
      `
        UPDATE users
        SET email_confirmed_at = NOW()
        WHERE id = $1
      `,
      [tokenRow.user_id]
    );

    await client.query(
      `
        UPDATE auth_tokens
        SET used_at = NOW()
        WHERE id = $1
      `,
      [tokenRow.id]
    );

    await client.query("COMMIT");

    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Confirm email error:", error);

    return NextResponse.json(
      { error: "Не удалось подтвердить почту." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
