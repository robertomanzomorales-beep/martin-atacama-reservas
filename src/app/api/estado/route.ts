import { NextResponse } from 'next/server';
import { ensureSchema } from '@/lib/db';
import { mailConfigured } from '@/lib/email';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await ensureSchema();
    return NextResponse.json({
      reservas: 'operativas',
      correo: mailConfigured() ? 'configurado_sin_prueba_de_envio' : 'pendiente',
      pagos: 'pendientes_de_credenciales_flow',
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('La base de reservas no responde', error);
    return NextResponse.json({
      reservas: 'no_disponibles',
      correo: mailConfigured() ? 'configurado_sin_prueba_de_envio' : 'pendiente',
      pagos: 'pendientes_de_credenciales_flow',
    }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
