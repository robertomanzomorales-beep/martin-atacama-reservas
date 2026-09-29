import { NextResponse } from 'next/server';
import { clearSession, isAdmin, sameOrigin } from '@/lib/security';

export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  await clearSession();
  return NextResponse.json({ ok: true });
}
