import { randomBytes, createHash } from "node:crypto";

const SESSION_COOKIE_NAME = "captrack_session";

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
