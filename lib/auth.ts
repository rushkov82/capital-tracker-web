import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

const PASSWORD_KEYLEN = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, PASSWORD_KEYLEN).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, expectedHex] = storedHash.split(":");

  if (!salt || !expectedHex) {
    return false;
  }

  const actual = Buffer.from(
    scryptSync(password, salt, PASSWORD_KEYLEN).toString("hex"),
    "hex"
  );
  const expected = Buffer.from(expectedHex, "hex");

  if (actual.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actual, expected);
}

export function generateRawToken() {
  return randomBytes(32).toString("hex");
}

export function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}
