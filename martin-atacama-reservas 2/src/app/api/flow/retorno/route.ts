import { NextResponse } from 'next/server';
import { syncFlow } from '@/lib/sync-flow';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const result = await syncFlow(String(form.get('token') || ''));
    const url = new URL('/pago/resultado', process.env.APP_URL || request.url);
    url.searchParams.set('ref', result.reference);
    url.searchParams.set('estado', result.paymentStatus);
    return NextResponse.redirect(url, 303);
  } catch (error) { console.error('No se pudo verificar retorno Flow', error); return NextResponse.redirect(new URL('/pago/resultado?estado=error', process.env.APP_URL || request.url), 303); }
}
