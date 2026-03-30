import { Pool } from "pg";

const pool = new Pool({
  host: "159.194.203.57",
  port: 5432,
  user: "12345678",
  password: "ТВОЙ_ПАРОЛЬ",
  database: "captrack",
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}