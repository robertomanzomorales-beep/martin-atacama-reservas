import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { isAdmin } from '@/lib/security';
import { LoginForm } from '@/components/login-form';

export const dynamic = 'force-dynamic';

export default async function AdminLogin() {
  if (await isAdmin()) redirect('/admin');

  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-visual" aria-label="Paisaje de la ruta en Atacama">
          <div className="login-visual-content">
            <span>OPERACIÓN DE TRASLADOS</span>
            <p>Un lugar para mantener cada viaje en orden.</p>
            <small>CALAMA · SAN PEDRO DE ATACAMA</small>
          </div>
        </section>
        <section className="login-content">
          <div className="login-wordmark" aria-label="Martín Atacama Transfers">
            <strong>MARTÍN</strong>
            <span>ATACAMA TRANSFERS</span>
          </div>
          <div className="login-card">
            <span className="login-kicker"><ShieldCheck size={16} strokeWidth={1.8} /> ACCESO PRIVADO</span>
            <h1>Panel de reservas</h1>
            <p>Ingrese su contraseña para revisar solicitudes, responder consultas y gestionar traslados.</p>
            <LoginForm />
          </div>
          <Link className="login-back" href="/"><ArrowLeft size={15} strokeWidth={1.8} /> Volver al sitio web</Link>
        </section>
      </div>
    </main>
  );
}
