import { NextResponse } from 'next/server';
import { checkPassword, issueSession, sameOrigin } from '@/lib/security';

export const runtime = 'nodejs';
const attempts = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Solicitud no permitida.' }, { status: 403 });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const entry = attempts.get(ip);
  if (entry && entry.until > Date.now() && entry.count >= 5) return NextResponse.json({ error: 'Demasiados intentos. Espere diez minutos.' }, { status: 429 });
  let body: { password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  if (!checkPassword(body.password || '')) {
    const current = entry?.until && entry.until > Date.now() ? entry.count : 0;
    attempts.set(ip, { count: current + 1, until: Date.now() + 10 * 60 * 1000 });
    return NextResponse.json({ error: 'Clave incorrecta o acceso sin configurar.' }, { status: 401 });
  }
  attempts.delete(ip);
  await issueSession();
  return NextResponse.json({ ok: true });
}
