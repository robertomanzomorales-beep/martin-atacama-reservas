import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/security';
import { listMessages, listReservations } from '@/lib/db';
import { flowConfigured } from '@/lib/flow';
import { AdminDashboard } from '@/components/admin-dashboard';
export const dynamic = 'force-dynamic';
export default async function AdminPage() { if (!await isAdmin()) redirect('/admin/acceso'); const [reservations, messages] = await Promise.all([listReservations(), listMessages()]); return <AdminDashboard initial={reservations} messages={messages} flowReady={flowConfigured()}/>; }
