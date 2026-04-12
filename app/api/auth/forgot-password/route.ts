import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { generateRawToken, hashToken } from "@/lib/auth";
import { sendMail } from "@/lib/mail";

type ForgotPasswordBody = {
  email?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  let body: ForgotPasswordBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email обязателен." }, { status: 400 });
  }

  try {
    const userResult = await pool.query<{
      id: string;
      name: string;
      email: string;
      email_confirmed_at: string | null;
    }>(
      `
        SELECT id, name, email, email_confirmed_at
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [normalizeEmail(email)]
    );

    const user = userResult.rows[0];

    if (!user || !user.email_confirmed_at) {
      return NextResponse.json({ ok: true });
    }

    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);

    await pool.query(
      `
        INSERT INTO auth_tokens (user_id, token_hash, type, expires_at)
        VALUES ($1, $2, 'password_reset', NOW() + INTERVAL '1 hour')
      `,
      [user.id, tokenHash]
    );

    const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/action?mode=reset&token=${rawToken}`;

    await sendMail({
      to: user.email,
      subject: "Сброс пароля — Capital Tracker",
      text:
        `Здравствуйте, ${user.name}!\n\n` +
        `Чтобы задать новый пароль, перейдите по ссылке:\n${resetUrl}\n\n` +
        `Если вы не запрашивали сброс, просто проигнорируйте письмо.`,
      html:
        `<p>Здравствуйте, ${user.name}!</p>` +
        `<p>Чтобы задать новый пароль, перейдите по ссылке:</p>` +
        `<p><a href="${resetUrl}">${resetUrl}</a></p>` +
        `<p>Если вы не запрашивали сброс, просто проигнорируйте письмо.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Не удалось создать ссылку для восстановления." },
      { status: 500 }
    );
  }
}
