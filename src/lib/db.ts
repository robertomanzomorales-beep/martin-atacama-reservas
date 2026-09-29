import 'server-only';
import { createClient, type Client } from '@libsql/client';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type Reservation = {
  id: string;
  reference: string;
  access_token: string;
  service: string;
  origin: string;
  destination: string;
  travel_date: string;
  travel_time: string;
  passengers: number;
  passenger_name: string;
  email: string;
  phone: string;
  notes: string;
  status: 'pendiente' | 'en_revision' | 'cotizada' | 'confirmada' | 'rechazada';
  quoted_amount: number | null;
  payment_status: 'no_solicitado' | 'pendiente' | 'pagado' | 'rechazado';
  flow_token: string | null;
  flow_order: string | null;
  flow_url: string | null;
  notification_status: string;
  created_at: string;
  updated_at: string;
};

let client: Client | undefined;
let schemaReady: Promise<void> | undefined;

export function getDb() {
  if (!client) {
    const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./data/reservas.db';
    if (url.startsWith('file:')) {
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
        throw new Error('Las reservas necesitan DATABASE_URL y DATABASE_AUTH_TOKEN de una base libSQL remota en Vercel.');
      }
      mkdirSync(join(process.cwd(), 'data'), { recursive: true });
    } else if (!/^(libsql|https|wss?):\/\//.test(url)) {
      throw new Error('DATABASE_URL debe ser la URL de una base libSQL compatible.');
    }
    client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN });
  }
  return client;
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getDb();
      await db.executeMultiple(`
        CREATE TABLE IF NOT EXISTS reservations (
          id TEXT PRIMARY KEY,
          reference TEXT NOT NULL UNIQUE,
          access_token TEXT NOT NULL,
          service TEXT NOT NULL,
          origin TEXT NOT NULL,
          destination TEXT NOT NULL,
          travel_date TEXT NOT NULL,
          travel_time TEXT NOT NULL,
          passengers INTEGER NOT NULL,
          passenger_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          notes TEXT NOT NULL DEFAULT '',
          status TEXT NOT NULL DEFAULT 'pendiente',
          quoted_amount INTEGER,
          payment_status TEXT NOT NULL DEFAULT 'no_solicitado',
          flow_token TEXT,
          flow_order TEXT,
          flow_url TEXT,
          notification_status TEXT NOT NULL DEFAULT 'pendiente_configuracion',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS reservations_date_idx ON reservations(travel_date);
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    })().catch(error => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

export async function findReservation(reference: string): Promise<Reservation | null> {
  await ensureSchema();
  const result = await getDb().execute({ sql: 'SELECT * FROM reservations WHERE reference = ?', args: [reference] });
  return (result.rows[0] as unknown as Reservation) || null;
}

export async function listReservations(): Promise<Reservation[]> {
  await ensureSchema();
  const result = await getDb().execute('SELECT * FROM reservations ORDER BY created_at DESC LIMIT 250');
  return result.rows as unknown as Reservation[];
}

export type ContactMessage = { id: string; name: string; email: string; phone: string; subject: string; message: string; created_at: string };
export async function listMessages(): Promise<ContactMessage[]> {
  await ensureSchema();
  const result = await getDb().execute('SELECT * FROM messages ORDER BY created_at DESC LIMIT 100');
  return result.rows as unknown as ContactMessage[];
}
