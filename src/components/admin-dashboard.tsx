'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, CalendarDays, LogOut, Mail, Search } from 'lucide-react';
import type { ContactMessage, Reservation } from '@/lib/db';

const labels: Record<string, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  cotizada: 'Cotizada',
  confirmada: 'Confirmada',
  rechazada: 'Rechazada',
  no_solicitado: 'No solicitado',
  pagado: 'Pagado',
};

const date = (value: string) => new Date(value).toLocaleString('es-CL', {
  timeZone: 'America/Santiago', dateStyle: 'medium', timeStyle: 'short',
});
const tripDate = (value: string) => new Date(`${value}T12:00:00Z`).toLocaleDateString('es-CL', {
  timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric',
});

export function AdminDashboard({ initial, messages, flowReady }: {
  initial: Reservation[];
  messages: ContactMessage[];
  flowReady: boolean;
}) {
  const router = useRouter();
  const [reservations, setReservations] = useState(initial);
  const [selected, setSelected] = useState(initial[0]?.reference || '');
  const [tab, setTab] = useState<'reservas' | 'mensajes'>('reservas');
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const current = reservations.find(reservation => reservation.reference === selected);
  const filtered = reservations.filter(reservation =>
    `${reservation.reference} ${reservation.passenger_name} ${reservation.origin} ${reservation.destination}`
      .toLowerCase().includes(query.toLowerCase())
  );
  const pending = reservations.filter(reservation =>
    reservation.status === 'pendiente' || reservation.status === 'en_revision'
  ).length;

  async function update(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current) return;
    setSaving(true);
    setFeedback('');
    const data = new FormData(event.currentTarget);
    const raw = String(data.get('quotedAmount') || '').trim();

    try {
      const response = await fetch(`/api/admin/reservas/${encodeURIComponent(current.reference)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: data.get('status'), quotedAmount: raw ? Number(raw) : null }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setReservations(list => list.map(reservation =>
        reservation.reference === current.reference ? result.reservation : reservation
      ));
      setFeedback(result.notified
        ? 'Cambios guardados. Aviso enviado al pasajero.'
        : 'Cambios guardados. Revise la configuración del correo si esperaba un aviso.');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Ocurrió un error.');
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/acceso');
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <strong>MARTÍN</strong>
          <span>ATACAMA TRANSFERS</span>
        </div>
        <div className="admin-nav-label">OPERACIÓN</div>
        <nav aria-label="Navegación del panel">
          <button type="button" className={tab === 'reservas' ? 'active' : ''} aria-pressed={tab === 'reservas'} onClick={() => setTab('reservas')}>
            <CalendarDays size={18} strokeWidth={1.8} /><span>Reservas</span><small>{reservations.length}</small>
          </button>
          <button type="button" className={tab === 'mensajes' ? 'active' : ''} aria-pressed={tab === 'mensajes'} onClick={() => setTab('mensajes')}>
            <Mail size={18} strokeWidth={1.8} /><span>Mensajes</span><small>{messages.length}</small>
          </button>
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/" target="_blank" rel="noopener noreferrer"><ArrowUpRight size={17} /> Ver sitio web</Link>
          <button type="button" onClick={logout} className="logout"><LogOut size={17} strokeWidth={1.8} /> Cerrar sesión</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-heading">
          <div>
            <span className="admin-kicker">ESPACIO DE TRABAJO / {tab === 'reservas' ? 'RESERVAS' : 'MENSAJES'}</span>
            <h1>{tab === 'reservas' ? 'Solicitudes de reserva' : 'Mensajes recibidos'}</h1>
            <p>{tab === 'reservas'
              ? 'Revise y gestione los traslados solicitados.'
              : 'Consultas enviadas desde el formulario de contacto.'}</p>
          </div>
          <span className={`flow-state ${flowReady ? 'ready' : ''}`}>
            <span aria-hidden="true" /> Flow {flowReady ? 'configurado' : 'pendiente'}
          </span>
        </header>

        <div className="admin-overview" aria-label="Resumen">
          <div><span>Solicitudes</span><strong>{reservations.length}</strong></div>
          <div><span>Por revisar</span><strong>{pending}</strong></div>
          <div><span>Mensajes</span><strong>{messages.length}</strong></div>
        </div>

        {tab === 'reservas' ? (
          <div className="admin-columns">
            <section className="admin-list" aria-label="Lista de reservas">
              <div className="admin-list-heading"><h2>Reservas recibidas</h2><span>{filtered.length}</span></div>
              <label className="admin-search">
                <Search size={18} strokeWidth={1.8} />
                <span className="sr-only">Buscar pasajero o referencia</span>
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar pasajero o referencia" />
              </label>
              <div className="admin-items">
                {filtered.length === 0 && <p className="empty-state">No hay solicitudes para mostrar.</p>}
                {filtered.map(reservation => (
                  <button
                    type="button"
                    key={reservation.reference}
                    className={`admin-item ${selected === reservation.reference ? 'selected' : ''}`}
                    aria-pressed={selected === reservation.reference}
                    onClick={() => { setSelected(reservation.reference); setFeedback(''); }}
                  >
                    <span className="admin-item-title"><strong>{reservation.passenger_name}</strong><small>{reservation.reference}</small></span>
                    <span className={`status status-${reservation.status}`}>{labels[reservation.status] || reservation.status}</span>
                    <span className="item-route">{reservation.origin} → {reservation.destination}</span>
                    <span className="item-date">{tripDate(reservation.travel_date)} · {reservation.travel_time} h</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-detail" aria-label="Detalle de reserva">
              {current ? (
                <>
                  <div className="detail-top">
                    <span className="admin-kicker">DETALLE DE SOLICITUD</span>
                    <div className="detail-top-line"><h2>{current.reference}</h2><span className={`status status-${current.status}`}>{labels[current.status] || current.status}</span></div>
                    <p>Registrada el {date(current.created_at)}</p>
                  </div>
                  <div className="detail-grid">
                    <div>
                      <small>PASAJERO</small>
                      <strong>{current.passenger_name}</strong>
                      <a href={`mailto:${current.email}`}>{current.email}</a>
                      <a href={`tel:${current.phone}`}>{current.phone}</a>
                    </div>
                    <div>
                      <small>TRASLADO</small>
                      <strong>{current.origin} → {current.destination}</strong>
                      <span>{tripDate(current.travel_date)} · {current.travel_time} h · {current.passengers} pasajero(s)</span>
                      <span>{current.service}</span>
                    </div>
                  </div>
                  {current.notes && <div className="detail-notes"><small>INDICACIONES</small><p>{current.notes}</p></div>}
                  <div className="detail-notes">
                    <small>PAGO Y NOTIFICACIONES</small>
                    <p>Pago: <strong>{labels[current.payment_status] || current.payment_status}</strong> · Correo: <strong>{current.notification_status}</strong></p>
                  </div>
                  <form key={current.reference} onSubmit={update} className="admin-edit">
                    <h3>Gestionar solicitud</h3>
                    <div className="form-grid">
                      <label>Estado
                        <select name="status" defaultValue={current.status}>
                          <option value="pendiente">Pendiente</option>
                          <option value="en_revision">En revisión</option>
                          <option value="cotizada">Cotizada</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="rechazada">Rechazada</option>
                        </select>
                      </label>
                      <label>Valor cotizado (CLP)
                        <input name="quotedAmount" type="number" min={1000} max={100000000} defaultValue={current.quoted_amount || ''} placeholder="Sin cotizar" disabled={Boolean(current.flow_token)} />
                      </label>
                    </div>
                    <button className="admin-save" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
                    {feedback && <p className="admin-feedback" role="status">{feedback}</p>}
                  </form>
                </>
              ) : <p className="empty-state">Seleccione una reserva para revisar sus datos.</p>}
            </section>
          </div>
        ) : (
          <div className="messages-grid">
            {messages.length === 0 && <p className="empty-state">Todavía no hay mensajes.</p>}
            {messages.map(message => (
              <article className="message-card" key={message.id}>
                <small>{date(message.created_at)}</small>
                <h3>{message.subject}</h3>
                <strong>{message.name}</strong>
                <p>{message.message}</p>
                <a href={`mailto:${message.email}`}>{message.email}</a><span> · {message.phone}</span>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
