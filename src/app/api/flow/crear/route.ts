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
  if (r.payment_status === 'rechazado') return NextResponse.json({ error: 'La orden anterior no se completó. Contacte al equipo para revisar la cotización.' }, { status: 409 });
  if (r.flow_url && r.payment_status === 'pendiente') return NextResponse.json({ url: r.flow_url });
  if (r.flow_token) return NextResponse.json({ error: 'La orden de pago requiere revisión.' }, { status: 409 });
  try {
    const payment = await createFlowPayment(r.reference, r.email, r.quoted_amount);
    await ensureSchema();
    const result = await getDb().execute({ sql: `UPDATE reservations SET flow_token = ?, flow_order = ?, flow_url = ?, payment_status = ?, updated_at = ?
      WHERE reference = ? AND flow_token IS NULL AND payment_status = 'no_solicitado' AND quoted_amount = ? AND status IN ('cotizada', 'confirmada')`,
    args: [payment.token, payment.flowOrder, payment.url, 'pendiente', new Date().toISOString(), r.reference, r.quoted_amount] });
    if (result.rowsAffected !== 1) {
      const current = await findReservation(r.reference);
      if (current?.flow_url && current.payment_status === 'pendiente') return NextResponse.json({ url: current.flow_url });
      return NextResponse.json({ error: 'La cotización cambió. Revise el enlace de pago actualizado.' }, { status: 409 });
    }
    return NextResponse.json({ url: payment.url });
  } catch (error) { console.error('Error al crear pago Flow', error); return NextResponse.json({ error: 'No pudimos iniciar el pago. Contáctenos para revisar la reserva.' }, { status: 502 }); }
}
