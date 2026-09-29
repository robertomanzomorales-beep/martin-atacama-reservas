import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { ensureSchema, getDb } from '@/lib/db';
import { notifyMessage } from '@/lib/email';
import { messageSchema } from '@/lib/validation';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Revise los datos.' }, { status: 400 });
  const m = parsed.data;
  try {
    await ensureSchema();
    await getDb().execute({ sql: 'INSERT INTO messages (id, name, email, phone, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', args: [randomUUID(), m.name, m.email, m.phone, m.subject, m.message, new Date().toISOString()] });
    await notifyMessage(m.name, m.email, m.phone, m.subject, m.message);
    return NextResponse.json({ message: 'Mensaje registrado. Nos comunicaremos con usted.' }, { status: 201 });
  } catch (error) { console.error('No se pudo registrar el mensaje', error); return NextResponse.json({ error: 'No pudimos registrar el mensaje.' }, { status: 500 }); }
}
