export type FlowStatus = {
  commerceOrder: string;
  flowOrder: number;
  status: 1 | 2 | 3 | 4;
  currency: 'CLP';
  amount: number;
};

export function parseFlowStatus(value: unknown): FlowStatus {
  if (!value || typeof value !== 'object') throw new Error('Respuesta de Flow inválida');
  const result = value as Record<string, unknown>;
  if (typeof result.commerceOrder !== 'string' || !result.commerceOrder ||
      !Number.isSafeInteger(result.flowOrder) || Number(result.flowOrder) <= 0 ||
      typeof result.status !== 'number' || ![1, 2, 3, 4].includes(result.status) ||
      result.currency !== 'CLP' ||
      !Number.isSafeInteger(result.amount) || Number(result.amount) <= 0) {
    throw new Error('Los datos de la orden de Flow son inválidos');
  }
  return result as FlowStatus;
}

export function paymentStatusFromFlow(status: FlowStatus['status']): 'pendiente' | 'pagado' | 'rechazado' {
  return status === 2 ? 'pagado' : status === 1 ? 'pendiente' : 'rechazado';
}
