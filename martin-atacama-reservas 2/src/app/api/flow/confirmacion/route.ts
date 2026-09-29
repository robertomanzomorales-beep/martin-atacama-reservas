import { NextResponse } from 'next/server';
import { syncFlow } from '@/lib/sync-flow';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const token = String(form.get('token') || '');
    await syncFlow(token);
    return new NextResponse('OK', { status: 200 });
  } catch (error) { console.error('No se pudo verificar confirmación Flow', error); return new NextResponse('Error', { status: 500 }); }
}
