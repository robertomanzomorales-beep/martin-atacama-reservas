import { NextResponse } from 'next/server';
import { ensureSchema, findReservation, getDb } from '@/lib/db';
import { createFlowPayment, flowConfigured } from '@/lib/flow';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  let body: { reference?: string; token?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  if (!body.reference || !body.token || body.reference.length > 40 || body.token.length > 100) return NextResponse.json({ error: 'Enlace inválido.' }, { status: 400 });
  const r = await findReservation(body.reference);
  if (!r || r.access_token !== body.token) return NextResponse.json({ error: 'Enlace inválido.' }, { status: 404 });
  if (!flowConfigured()) return NextResponse.json({ error: 'El pago en línea aún no está disponible.' }, { status: 503 });
  if (!r.quoted_amount || !['cotizada', 'confirmada'].includes(r.status) || r.payment_status === 'pagado') return NextResponse.json({ error: 'Esta reserva no admite un nuevo pago.' }, { status: 409 });
  if (r.flow_url) return NextResponse.json({ url: r.flow_url });
  try {
    const payment = await createFlowPayment(r.reference, r.email, r.quoted_amount);
    await ensureSchema();
    await getDb().execute({ sql: 'UPDATE reservations SET flow_token = ?, flow_order = ?, flow_url = ?, payment_status = ?, updated_at = ? WHERE reference = ? AND flow_token IS NULL', args: [payment.token, payment.flowOrder, payment.url, 'pendiente', new Date().toISOString(), r.reference] });
    return NextResponse.json({ url: payment.url });
  } catch (error) { console.error('Error al crear pago Flow', error); return NextResponse.json({ error: 'No pudimos iniciar el pago. Contáctenos para revisar la reserva.' }, { status: 502 }); }
}
