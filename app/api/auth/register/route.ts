import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import {
  generateRawToken,
  hashPassword,
  hashToken,
} from "@/lib/auth";
import { sendMail } from "@/lib/mail";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!name) {
    return NextResponse.json({ error: "Имя обязательно." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email обязателен." }, { status: 400 });
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

  const normalizedEmail = normalizeEmail(email);
  const passwordHash = hashPassword(password);
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [normalizedEmail]
    );

    if ((existingUser.rowCount ?? 0) > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует." },
        { status: 409 }
      );
    }

    const createdUser = await client.query<{
      id: string;
      name: string;
      email: string;
    }>(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email
      `,
      [name, normalizedEmail, passwordHash]
    );

    const user = createdUser.rows[0];

    await client.query(
      `
        INSERT INTO auth_tokens (user_id, token_hash, type, expires_at)
        VALUES ($1, $2, 'email_confirm', NOW() + INTERVAL '24 hours')
      `,
      [user.id, tokenHash]
    );

    await client.query("COMMIT");

    const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    const confirmUrl = `${baseUrl}/auth/action?mode=confirm-email&token=${rawToken}`;

    await sendMail({
      to: user.email,
      subject: "Подтверждение почты — Capital Tracker",
      text:
        `Здравствуйте, ${user.name}!\n\n` +
        `Подтвердите почту по ссылке:\n${confirmUrl}\n\n` +
        `Если это были не вы, просто проигнорируйте письмо.`,
      html:
        `<p>Здравствуйте, ${user.name}!</p>` +
        `<p>Подтвердите почту, чтобы войти в аккаунт:</p>` +
        `<p><a href="${confirmUrl}">${confirmUrl}</a></p>` +
        `<p>Если это были не вы, просто проигнорируйте письмо.</p>`,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Register error:", error);

    return NextResponse.json(
      { error: "Не удалось зарегистрироваться." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
