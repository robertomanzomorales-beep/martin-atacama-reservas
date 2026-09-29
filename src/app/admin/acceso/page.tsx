import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/security';
import { LoginForm } from '@/components/login-form';
export const dynamic = 'force-dynamic';
export default async function AdminLogin() { if (await isAdmin()) redirect('/admin'); return <main className="login-page"><div className="login-card"><span className="eyebrow">MARTÍN ATACAMA TRANSFERS</span><h1>Panel de reservas</h1><p>Acceso privado para gestionar solicitudes y consultas.</p><LoginForm/></div></main>; }
