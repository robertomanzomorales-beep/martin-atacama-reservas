import 'server-only';
import { ensureSchema, findReservation, getDb } from './db';
import { getFlowStatus } from './flow';
import { paymentStatusFromFlow } from './flow-status';

export async function syncFlow(token: string) {
  const status = await getFlowStatus(token);
  const r = await findReservation(status.commerceOrder);
  if (!r || r.flow_token !== token || Number(r.quoted_amount) !== Number(status.amount) || (r.flow_order && r.flow_order !== String(status.flowOrder))) throw new Error('La transacción no coincide con la reserva.');
  const paymentStatus = paymentStatusFromFlow(status.status);
  await ensureSchema();
  await getDb().execute({ sql: `UPDATE reservations SET payment_status = ?, updated_at = ? WHERE reference = ? AND payment_status != 'pagado'`, args: [paymentStatus, new Date().toISOString(), r.reference] });
  return { reference: r.reference, accessToken: r.access_token };
}
