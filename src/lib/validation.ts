import { z } from 'zod';

const plain = (max: number) => z.string().trim().min(2).max(max);
export const reservationSchema = z.object({
  service: z.enum(['aeropuerto', 'san-pedro', 'empresa', 'otro']),
  origin: plain(120),
  destination: plain(120),
  travelDate: z.iso.date(),
  travelTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  passengers: z.coerce.number<number>().int().min(1).max(30),
  passengerName: plain(100),
  email: z.email().max(160),
  phone: z.string().trim().min(8).max(30).regex(/^[+\d\s()-]+$/),
  notes: z.string().trim().max(1000).default(''),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
}).refine(data => data.origin.toLocaleLowerCase('es') !== data.destination.toLocaleLowerCase('es'), {
  message: 'El origen y el destino deben ser distintos.', path: ['destination'],
}).refine(data => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const max = new Date(); max.setUTCDate(max.getUTCDate() + 365);
  return data.travelDate >= today && data.travelDate <= max.toISOString().slice(0, 10);
}, { message: 'Seleccione una fecha entre hoy y los próximos 12 meses.', path: ['travelDate'] });

export const messageSchema = z.object({
  name: plain(100), email: z.email().max(160),
  phone: z.string().trim().min(8).max(30).regex(/^[+\d\s()-]+$/),
  subject: plain(120), message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});
