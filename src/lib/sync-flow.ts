import 'server-only';
import { ensureSchema, findReservation, getDb } from './db';
import { getFlowStatus } from './flow';

export async function syncFlow(token: string) {
  const status = await getFlowStatus(token);
  const r = await findReservation(status.commerceOrder);
  if (!r || r.flow_token !== token || Number(r.quoted_amount) !== Number(status.amount) || (r.flow_order && r.flow_order !== String(status.flowOrder))) throw new Error('La transacción no coincide con la reserva.');
  const paymentStatus = status.status === 2 ? 'pagado' : status.status === 3 || status.status === 4 ? 'rechazado' : 'pendiente';
  await ensureSchema();
  await getDb().execute({ sql: `UPDATE reservations SET payment_status = ?, updated_at = ? WHERE reference = ? AND payment_status != 'pagado'`, args: [paymentStatus, new Date().toISOString(), r.reference] });
  return { reference: r.reference, paymentStatus };
}
