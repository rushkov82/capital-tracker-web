import { Pool } from "pg";

export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "alexey",
  password: "12345678",
  database: "captrack",
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}
