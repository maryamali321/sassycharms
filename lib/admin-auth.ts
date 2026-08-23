import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE = 'sc_admin';
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

/**
 * A stateless session token: as long as ADMIN_PASSWORD doesn't change, this
 * value stays valid, so no session store is needed for a single-admin site.
 */
export function createSessionToken(): string | null {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return createHmac('sha256', secret).update('admin-session').digest('hex');
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expected = createSessionToken();
  if (!expected) return false;
  return safeEqual(token, expected);
}
