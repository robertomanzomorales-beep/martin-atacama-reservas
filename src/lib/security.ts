import 'server-only';
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE = 'martin_admin';
const TWELVE_HOURS = 12 * 60 * 60;

function secret() { return process.env.SESSION_SECRET || ''; }
function signature(value: string) { return createHmac('sha256', secret()).update(value).digest('hex'); }
function equal(a: string, b: string) {
  const first = Buffer.from(a), second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

export function checkPassword(candidate: string) {
  const [salt, hash] = (process.env.ADMIN_PASSWORD_HASH || '').split(':');
  if (!salt || !hash || !secret() || candidate.length > 256) return false;
  const computed = scryptSync(candidate, salt, 64).toString('hex');
  return equal(computed, hash);
}

export async function issueSession() {
  const expires = Math.floor(Date.now() / 1000) + TWELVE_HOURS;
  const value = `${expires}.${signature(String(expires))}`;
  (await cookies()).set(COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: TWELVE_HOURS });
}

export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function isAdmin() {
  if (!secret()) return false;
  const value = (await cookies()).get(COOKIE)?.value || '';
  const [expiry, mac] = value.split('.');
  if (!expiry || !mac || !/^\d{10}$/.test(expiry) || Number(expiry) <= Date.now() / 1000) return false;
  return equal(mac, signature(expiry));
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.APP_URL || new URL(request.url).origin;
  return Boolean(origin && origin === new URL(expected).origin);
}
