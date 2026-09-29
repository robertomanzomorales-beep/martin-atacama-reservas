import 'server-only';
import nodemailer from 'nodemailer';
import type { Reservation } from './db';
import { renderBrandedEmail, type BrandedEmail } from './email-template';

export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);

const dateLabel = (date: string) => new Intl.DateTimeFormat('es-CL', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T12:00:00Z`));

const tripFields = (r: Reservation) => [
  { label: 'Origen', value: r.origin },
  { label: 'Destino', value: r.destination },
  { label: 'Fecha y hora', value: `${dateLabel(r.travel_date)} · ${r.travel_time} h` },
  { label: 'Pasajeros', value: String(r.passengers) },
];

async function send(to: string, subject: string, email: BrandedEmail, replyTo?: string) {
  if (!mailConfigured()) return false;
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', connectionTimeout: 7000, greetingTimeout: 7000, socketTimeout: 10000, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  const { html, text } = renderBrandedEmail(email);
  await transport.sendMail({ from: { name: 'Martín Atacama Transfers', address: process.env.SMTP_FROM! }, to, replyTo, subject, html, text });
  return true;
}

export async function notifyReservation(r: Reservation) {
  if (!mailConfigured()) return 'pendiente_configuracion';
  try {
    await send(process.env.BOOKING_EMAIL || 'contacto@transferatacamachile.cl', `Nueva solicitud ${r.reference}`, {
      preview: `Nueva solicitud de ${r.passenger_name} · ${r.origin} a ${r.destination}`,
      eyebrow: 'Aviso de nueva reserva', title: 'Nueva solicitud de traslado',
      paragraphs: ['Se registró una nueva solicitud de traslado. Revise los datos y confirme la disponibilidad con el pasajero.'],
      reference: r.reference, status: 'Pendiente de gestión',
      fields: [...tripFields(r), { label: 'Pasajero', value: r.passenger_name }, { label: 'Correo', value: r.email }, { label: 'Teléfono', value: r.phone }, ...(r.notes ? [{ label: 'Indicaciones', value: r.notes }] : [])],
      note: 'Esta solicitud todavía no constituye una reserva confirmada.',
    }, r.email);
    await send(r.email, `Recibimos su solicitud ${r.reference}`, {
      preview: `Recibimos su solicitud de traslado · Referencia ${r.reference}`,
      eyebrow: 'Solicitud recibida', title: 'Ya recibimos su solicitud', greeting: r.passenger_name,
      paragraphs: ['Gracias por contactarnos. Nuestro equipo revisará la disponibilidad y se comunicará con usted para coordinar el viaje.'],
      reference: r.reference, status: 'Pendiente de confirmación', fields: tripFields(r),
      note: 'Este mensaje confirma la recepción de su solicitud, pero aún no confirma el traslado. Si necesita corregir algún dato, responda este correo e indique su referencia.',
    });
    return 'enviada';
  } catch (error) { console.error('Error de notificación de reserva', error); return 'fallida'; }
}

export async function notifyUpdate(r: Reservation, paymentLink?: string) {
  if (!mailConfigured()) return false;
  const content = r.status === 'confirmada'
    ? { title: 'Su traslado está confirmado', body: 'Nuestro equipo confirmó su traslado. Si necesita ajustar algún dato, responda a este correo.', status: 'Traslado confirmado' }
    : r.status === 'rechazada'
      ? { title: 'Actualización de su solicitud', body: 'Por el momento no podremos atender el traslado solicitado. Si desea revisar otras alternativas, responda a este correo.', status: 'Solicitud no disponible' }
      : r.status === 'cotizada'
        ? { title: 'Cotización de su traslado', body: 'Preparamos una cotización para el traslado que solicitó. Puede revisar el valor y los datos del viaje a continuación.', status: 'Cotización preparada' }
        : { title: 'Estamos revisando su solicitud', body: 'Nuestro equipo está revisando los datos y la disponibilidad de su traslado. Le avisaremos cuando tengamos una actualización.', status: 'En revisión' };
  try {
    await send(r.email, `${content.title} ${r.reference}`, {
      preview: r.status === 'cotizada' && r.quoted_amount !== null
        ? `Valor cotizado: $${new Intl.NumberFormat('es-CL').format(r.quoted_amount)} CLP · ${r.reference}`
        : `${content.title} · ${r.reference}`,
      eyebrow: 'Actualización de reserva', title: content.title, greeting: r.passenger_name,
      paragraphs: [content.body], reference: r.reference, status: content.status, fields: tripFields(r),
      amount: r.status === 'cotizada' || r.status === 'confirmada' ? r.quoted_amount : null,
      note: r.status === 'cotizada'
        ? 'La cotización no confirma el viaje. Responda a este correo para coordinar los siguientes pasos.'
        : r.status === 'confirmada' ? 'Conserve esta referencia para cualquier consulta sobre su traslado.' : undefined,
      action: r.status === 'cotizada' && paymentLink ? { label: 'Revisar y pagar con Flow', url: paymentLink } : undefined,
    });
    return true;
  } catch (error) { console.error('Error de notificación de estado', error); return false; }
}

export async function notifyMessage(name: string, email: string, phone: string, subject: string, message: string) {
  try {
    return await send(process.env.BOOKING_EMAIL || 'contacto@transferatacamachile.cl', `Contacto web: ${subject}`, {
      preview: `Consulta de ${name}: ${subject}`, eyebrow: 'Formulario de contacto', title: 'Nueva consulta desde el sitio',
      paragraphs: ['Recibió un nuevo mensaje desde el formulario de contacto.'],
      fields: [{ label: 'Asunto', value: subject }, { label: 'Nombre', value: name }, { label: 'Correo', value: email }, { label: 'Teléfono', value: phone }, { label: 'Mensaje', value: message }],
    }, email);
  }
  catch (error) { console.error('Error de notificación de contacto', error); return false; }
}
