import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureSchema, findReservation, getDb } from '@/lib/db';
import { notifyUpdate } from '@/lib/email';
import { flowConfigured } from '@/lib/flow';
import { isAdmin, sameOrigin } from '@/lib/security';

export const runtime = 'nodejs';
const updateSchema = z.object({
  status: z.enum(['pendiente', 'en_revision', 'cotizada', 'confirmada', 'rechazada']),
  quotedAmount: z.union([z.number().int().min(1000).max(100000000), z.null()]),
});

export async function PATCH(request: Request, context: { params: Promise<{ reference: string }> }) {
  if (!sameOrigin(request) || !await isAdmin()) return NextResponse.json({ error: 'No autorizado.' }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Estado o valor inválido.' }, { status: 400 });
  const { reference } = await context.params;
  const previous = await findReservation(reference);
  if (!previous) return NextResponse.json({ error: 'Solicitud no encontrada.' }, { status: 404 });
  const { status, quotedAmount } = parsed.data;
  if (previous.flow_token && quotedAmount !== previous.quoted_amount) return NextResponse.json({ error: 'El valor no puede cambiar después de crear la orden de pago.' }, { status: 409 });
  if (previous.payment_status === 'pagado' && status === 'rechazada') return NextResponse.json({ error: 'Esta solicitud tiene un pago. Revise el reembolso antes de rechazarla.' }, { status: 409 });
  if (status === 'cotizada' && quotedAmount === null) return NextResponse.json({ error: 'Ingrese un valor para cotizar.' }, { status: 400 });
  await ensureSchema();
  await getDb().execute({ sql: 'UPDATE reservations SET status = ?, quoted_amount = ?, updated_at = ? WHERE reference = ?', args: [status, quotedAmount, new Date().toISOString(), reference] });
  const updated = await findReservation(reference);
  let notified = false;
  if (updated && (status !== previous.status || quotedAmount !== previous.quoted_amount)) {
    const paymentLink = flowConfigured() && quotedAmount && status === 'cotizada' ? `${process.env.APP_URL!.replace(/\/$/, '')}/pago/${reference}?t=${updated.access_token}` : undefined;
    notified = await notifyUpdate(updated, paymentLink);
  }
  return NextResponse.json({ reservation: updated, notified });
}
