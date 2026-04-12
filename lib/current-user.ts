import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { getSessionCookieName, hashSessionToken } from "@/lib/session";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const rawSessionToken = cookieStore.get(getSessionCookieName())?.value;

  if (!rawSessionToken) {
    return null;
  }

  const sessionTokenHash = hashSessionToken(rawSessionToken);

  const result = await pool.query<CurrentUser>(
    `
      SELECT u.id, u.name, u.email
      FROM user_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.session_token_hash = $1
        AND s.expires_at > NOW()
      LIMIT 1
    `,
    [sessionTokenHash]
  );

  return result.rows[0] ?? null;
}
