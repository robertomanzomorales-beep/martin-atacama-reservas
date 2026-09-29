import 'server-only';
import nodemailer from 'nodemailer';
import type { Reservation } from './db';

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char);
export const mailConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);

async function send(to: string, subject: string, html: string) {
  if (!mailConfigured()) return false;
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', connectionTimeout: 7000, greetingTimeout: 7000, socketTimeout: 10000, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transport.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
  return true;
}

export async function notifyReservation(r: Reservation) {
  if (!mailConfigured()) return 'pendiente_configuracion';
  try {
    const details = `<p><strong>Referencia:</strong> ${escape(r.reference)}<br><strong>Ruta:</strong> ${escape(r.origin)} → ${escape(r.destination)}<br><strong>Salida:</strong> ${escape(r.travel_date)} a las ${escape(r.travel_time)}<br><strong>Pasajeros:</strong> ${r.passengers}</p>`;
    await send(process.env.BOOKING_EMAIL || 'contacto@transferatacamachile.cl', `Nueva solicitud ${r.reference}`, `<h2>Nueva solicitud de traslado</h2>${details}<p>${escape(r.passenger_name)} · ${escape(r.email)} · ${escape(r.phone)}</p><p>${escape(r.notes)}</p>`);
    await send(r.email, `Recibimos su solicitud ${r.reference}`, `<p>Hola ${escape(r.passenger_name)},</p><p>Recibimos su solicitud de traslado. Nuestro equipo revisará la disponibilidad y le confirmará los detalles. <strong>Este mensaje aún no confirma el viaje.</strong></p>${details}<p>Martín Atacama Transfers</p>`);
    return 'enviada';
  } catch (error) { console.error('Error de notificación de reserva', error); return 'fallida'; }
}

export async function notifyUpdate(r: Reservation, paymentLink?: string) {
  if (!mailConfigured()) return false;
  const intro = r.status === 'confirmada' ? 'Su traslado fue confirmado por nuestro equipo.' : r.status === 'rechazada' ? 'No podremos atender el traslado solicitado. Comuníquese con nosotros para evaluar alternativas.' : r.status === 'cotizada' ? 'Hemos preparado una cotización para su traslado.' : 'Su solicitud está en revisión.';
  const payment = paymentLink && r.quoted_amount ? `<p>Valor: <strong>$${r.quoted_amount.toLocaleString('es-CL')} CLP</strong></p><p><a href="${escape(paymentLink)}">Revisar cotización y pagar con Flow</a></p>` : '';
  try {
    await send(r.email, `Actualización de su solicitud ${r.reference}`, `<p>Hola ${escape(r.passenger_name)},</p><p>${intro}</p><p>Referencia: <strong>${escape(r.reference)}</strong></p>${payment}<p>Martín Atacama Transfers</p>`);
    return true;
  } catch (error) { console.error('Error de notificación de estado', error); return false; }
}

export async function notifyMessage(name: string, email: string, phone: string, subject: string, message: string) {
  try { return await send(process.env.BOOKING_EMAIL || 'contacto@transferatacamachile.cl', `Contacto web: ${subject}`, `<p><strong>${escape(name)}</strong> · ${escape(email)} · ${escape(phone)}</p><p>${escape(message)}</p>`); }
  catch (error) { console.error('Error de notificación de contacto', error); return false; }
}
