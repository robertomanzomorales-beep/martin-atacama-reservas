import { randomBytes, randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { ensureSchema, findReservation, getDb } from '@/lib/db';
import { notifyReservation } from '@/lib/email';
import { reservationSchema } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Datos inválidos.' }, { status: 400 }); }
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Revise los datos.' }, { status: 400 });
  const r = parsed.data;
  const reference = `MAT-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${randomBytes(4).toString('hex').toUpperCase()}`;
  const id = randomUUID();
  const accessToken = randomBytes(24).toString('hex');
  const now = new Date().toISOString();
  try {
    await ensureSchema();
    await getDb().execute({
      sql: `INSERT INTO reservations (id, reference, access_token, service, origin, destination, travel_date, travel_time, passengers, passenger_name, email, phone, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, reference, accessToken, r.service, r.origin, r.destination, r.travelDate, r.travelTime, r.passengers, r.passengerName, r.email, r.phone, r.notes, now, now],
    });
    const saved = await findReservation(reference);
    if (saved) {
      try {
        const notification = await notifyReservation(saved);
        await getDb().execute({ sql: 'UPDATE reservations SET notification_status = ? WHERE id = ?', args: [notification, id] });
      } catch (notificationError) {
        // La solicitud ya existe: un problema de correo no debe invitar a crearla dos veces.
        console.error('La solicitud se guardó, pero falló la actualización de notificación', notificationError);
      }
    }
    return NextResponse.json({ reference, message: 'Solicitud registrada. El equipo confirmará su disponibilidad.' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('No se pudo registrar la solicitud', error);
    const configurationMissing = (process.env.VERCEL || process.env.NODE_ENV === 'production') &&
      !(process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL);
    return NextResponse.json({
      error: configurationMissing
        ? 'Las reservas en línea aún no están habilitadas. Comuníquese por WhatsApp para coordinar su viaje.'
        : 'No pudimos registrar la solicitud. Intente nuevamente.',
    }, { status: configurationMissing ? 503 : 500 });
  }
}
