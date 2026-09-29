import 'server-only';
import { createHmac } from 'node:crypto';

export type FlowStatus = { commerceOrder: string; status: number; amount: number; flowOrder: number; };
export const flowConfigured = () => Boolean(process.env.FLOW_API_KEY && process.env.FLOW_SECRET_KEY && process.env.APP_URL);
function baseUrl() { return process.env.FLOW_ENV === 'production' ? 'https://www.flow.cl/api' : 'https://sandbox.flow.cl/api'; }
function signed(params: Record<string, string | number>) {
  const key = process.env.FLOW_SECRET_KEY;
  if (!key || !process.env.FLOW_API_KEY) throw new Error('Flow no está configurado');
  const values = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]));
  const input = Object.keys(values).sort().map(k => k + values[k]).join('');
  return { ...values, s: createHmac('sha256', key).update(input).digest('hex') };
}

export async function createFlowPayment(reference: string, email: string, amount: number) {
  if (!flowConfigured()) throw new Error('Flow no está configurado');
  const base = process.env.APP_URL!.replace(/\/$/, '');
  const params = signed({ apiKey: process.env.FLOW_API_KEY!, commerceOrder: reference, subject: `Traslado ${reference}`, currency: 'CLP', amount, email, urlConfirmation: `${base}/api/flow/confirmacion`, urlReturn: `${base}/api/flow/retorno` });
  const response = await fetch(`${baseUrl()}/payment/create`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params), cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Flow rechazó la creación de orden (${response.status})`);
  const result = await response.json() as { url: string; token: string; flowOrder: number };
  if (!result.url?.startsWith('https://') || !result.token) throw new Error('Respuesta inesperada de Flow');
  const url = new URL(result.url); url.searchParams.set('token', result.token);
  return { url: url.toString(), token: result.token, flowOrder: String(result.flowOrder) };
}

export async function getFlowStatus(token: string): Promise<FlowStatus> {
  if (!flowConfigured() || !token || token.length > 200) throw new Error('Token Flow inválido');
  const params = signed({ apiKey: process.env.FLOW_API_KEY!, token });
  const response = await fetch(`${baseUrl()}/payment/getStatus?${new URLSearchParams(params)}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`No se pudo consultar el pago (${response.status})`);
  return response.json() as Promise<FlowStatus>;
}
