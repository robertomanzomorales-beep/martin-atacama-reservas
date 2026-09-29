type EmailField = { label: string; value: string };

export type BrandedEmail = {
  preview: string;
  eyebrow: string;
  title: string;
  greeting?: string;
  paragraphs: string[];
  reference?: string;
  status?: string;
  fields?: EmailField[];
  amount?: number | null;
  note?: string;
  action?: { label: string; url: string };
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char] || char);
const withBreaks = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br>');
const amountLabel = (value: number) => `$${new Intl.NumberFormat('es-CL').format(value)} CLP`;

export function renderBrandedEmail(email: BrandedEmail): { html: string; text: string } {
  const action = email.action && /^https:\/\//i.test(email.action.url) ? email.action : undefined;
  const fields = email.fields || [];
  const paragraphs = email.paragraphs.map(value => `<p style="margin:0 0 16px;color:#344b5c;font-size:15px;line-height:24px;">${withBreaks(value)}</p>`).join('');
  const rows = fields.map(({ label, value }, index) => `
    <tr><td valign="top" width="116" style="padding:${index ? '14px' : '0'} 10px 14px 0;border-bottom:1px solid #dfe6e9;color:#617788;font-size:12px;line-height:19px;font-weight:700;">${escapeHtml(label)}</td>
    <td valign="top" style="padding:${index ? '14px' : '0'} 0 14px;border-bottom:1px solid #dfe6e9;color:#152e40;font-size:14px;line-height:21px;font-weight:600;word-break:break-word;">${withBreaks(value)}</td></tr>`).join('');
  const details = (email.reference || fields.length || email.amount !== undefined && email.amount !== null) ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f7f8" style="margin:24px 0;background:#f4f7f8;border:1px solid #e6ecee;">
      <tr><td style="padding:23px 25px 24px;">
        ${email.reference ? `<p style="margin:0 0 18px;color:#8d6327;font-size:11px;line-height:17px;letter-spacing:1.4px;font-weight:700;text-transform:uppercase;">Referencia ${escapeHtml(email.reference)}</p>` : ''}
        ${fields.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>` : ''}
        ${email.amount !== undefined && email.amount !== null ? `<p style="margin:20px 0 4px;color:#617788;font-size:11px;line-height:17px;font-weight:700;letter-spacing:1px;">VALOR COTIZADO</p><p style="margin:0;color:#102c42;font-size:24px;line-height:30px;font-weight:700;">${amountLabel(email.amount)}</p>` : ''}
      </td></tr></table>` : '';
  const note = email.note ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fff8ea" style="background:#fff8ea;border-left:3px solid #cf9c4c;margin-top:24px;"><tr><td style="padding:14px 17px;color:#5c4e37;font-size:13px;line-height:21px;">${withBreaks(email.note)}</td></tr></table>` : '';
  const button = action ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;"><tr><td bgcolor="#153b54" style="background:#153b54;"><a href="${escapeHtml(action.url)}" style="display:inline-block;padding:14px 21px;color:#ffffff;text-decoration:none;font-size:14px;line-height:20px;font-weight:700;">${escapeHtml(action.label)} &rarr;</a></td></tr></table>` : '';

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(email.title)}</title></head>
<body style="margin:0;padding:0;background:#eef2f4;font-family:Arial,Helvetica,sans-serif;color:#152e40;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(email.preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eef2f4" style="background:#eef2f4;"><tr><td align="center" style="padding:26px 12px 34px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;">
      <tr><td bgcolor="#10344d" style="background:#10344d;border-top:4px solid #d9aa5a;padding:25px 32px 26px;">
        <p style="margin:0;color:#ffffff;font-size:21px;line-height:25px;font-weight:700;letter-spacing:1px;">MARTÍN</p>
        <p style="margin:3px 0 0;color:#e5c183;font-size:10px;line-height:15px;font-weight:700;letter-spacing:2px;">ATACAMA TRANSFERS</p>
      </td></tr>
      <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:33px 32px 36px;">
        <p style="margin:0 0 9px;color:#9a6e2c;font-size:11px;line-height:17px;letter-spacing:1.5px;font-weight:700;text-transform:uppercase;">${escapeHtml(email.eyebrow)}</p>
        <h1 style="margin:0 0 23px;color:#142e42;font-size:24px;line-height:30px;font-weight:700;">${escapeHtml(email.title)}</h1>
        ${email.greeting ? `<p style="margin:0 0 16px;color:#152e40;font-size:15px;line-height:24px;font-weight:700;">Hola ${escapeHtml(email.greeting)},</p>` : ''}
        ${paragraphs}
        ${email.status ? `<p style="margin:4px 0 0;color:#8d6327;font-size:12px;line-height:20px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">${escapeHtml(email.status)}</p>` : ''}
        ${details}${note}${button}
      </td></tr>
      <tr><td bgcolor="#f6f8f9" style="background:#f6f8f9;border-top:1px solid #e3e8eb;padding:23px 32px 27px;">
        <p style="margin:0 0 7px;color:#18374c;font-size:13px;line-height:20px;font-weight:700;">Martín Atacama Transfers</p>
        <p style="margin:0;color:#5c7282;font-size:12px;line-height:20px;">Calama · San Pedro de Atacama · Aeropuerto El Loa<br><a href="mailto:contacto@transferatacamachile.cl" style="color:#21547a;text-decoration:underline;">contacto@transferatacamachile.cl</a> &nbsp;·&nbsp; <a href="tel:+56997106497" style="color:#21547a;text-decoration:underline;">+56 9 9710 6497</a></p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  const text = [
    'MARTÍN ATACAMA TRANSFERS', email.title,
    email.greeting ? `Hola ${email.greeting},` : '',
    ...email.paragraphs, email.status || '',
    email.reference ? `Referencia: ${email.reference}` : '',
    ...fields.map(field => `${field.label}: ${field.value}`),
    email.amount !== undefined && email.amount !== null ? `Valor cotizado: ${amountLabel(email.amount)}` : '',
    email.note || '', action ? `${action.label}: ${action.url}` : '',
    'Martín Atacama Transfers · Calama',
    'contacto@transferatacamachile.cl · +56 9 9710 6497',
  ].filter(Boolean).join('\n\n');

  return { html, text };
}
