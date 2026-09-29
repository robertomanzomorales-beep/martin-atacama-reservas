import Link from 'next/link';
import { findReservation } from '@/lib/db';
import { SiteShell } from '@/components/site-shell';
export const dynamic = 'force-dynamic';
export default async function ResultPage({ searchParams }: { searchParams: Promise<{ ref?: string; t?: string }> }) {
  const { ref, t } = await searchParams;
  const reservation = typeof ref === 'string' && ref.length <= 40 && typeof t === 'string' && /^[a-f0-9]{48}$/.test(t)
    ? await findReservation(ref) : null;
  const verified = reservation?.access_token === t ? reservation : null;
  const message = verified?.payment_status === 'pagado' ? 'Su pago fue recibido.'
    : verified?.payment_status === 'pendiente' ? 'Su pago está pendiente de confirmación.'
      : verified?.payment_status === 'rechazado' ? 'El pago no se completó.'
        : 'No pudimos verificar el pago en este momento.';
  return <SiteShell><section className="payment-section"><div className="payment-card"><span className="eyebrow">ESTADO DE PAGO</span><h1>{message}</h1>{verified && <p>Referencia: {verified.reference}</p>}<p>Si necesita ayuda, comuníquese con nuestro equipo. La reserva se confirma por separado.</p><Link href="/" className="button button-dark">Volver al inicio</Link></div></section></SiteShell>;
}
