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
  const paragraphs = email.paragraphs.map(value =>
    `<p style="margin:0 0 15px;color:#4b5852;font-size:15px;line-height:24px;">${withBreaks(value)}</p>`
  ).join('');
  const rows = fields.map(({ label, value }, index) => `
    <tr>
      <td width="112" valign="top" style="padding:${index ? '13px' : '0'} 12px 13px 0;border-bottom:1px solid #e6e7e1;color:#748078;font-size:12px;line-height:19px;font-weight:600;">${escapeHtml(label)}</td>
      <td valign="top" style="padding:${index ? '13px' : '0'} 0 13px;border-bottom:1px solid #e6e7e1;color:#29362f;font-size:14px;line-height:20px;font-weight:600;word-break:break-word;">${withBreaks(value)}</td>
    </tr>`
  ).join('');
  const hasDetails = Boolean(email.reference || fields.length || email.amount !== undefined && email.amount !== null);
  const details = hasDetails ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafaf7" style="margin:25px 0 0;border:1px solid #e6e7e1;background:#fafaf7;">
      <tr><td style="padding:20px 22px 22px;">
        ${email.reference ? `<p style="margin:0 0 16px;color:#7e6e57;font-size:10px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">REFERENCIA &nbsp; ${escapeHtml(email.reference)}</p>` : ''}
        ${fields.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>` : ''}
        ${email.amount !== undefined && email.amount !== null ? `<p style="margin:21px 0 4px;color:#748078;font-size:10px;line-height:16px;font-weight:700;letter-spacing:1px;">VALOR COTIZADO</p><p style="margin:0;color:#29362f;font-size:24px;line-height:30px;font-weight:700;">${amountLabel(email.amount)}</p>` : ''}
      </td></tr>
    </table>` : '';
  const note = email.note ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f7f5ef" style="margin:22px 0 0;border-left:2px solid #a68b68;background:#f7f5ef;">
      <tr><td style="padding:14px 17px;color:#655f50;font-size:13px;line-height:21px;">${withBreaks(email.note)}</td></tr>
    </table>` : '';
  const button = action ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
      <tr><td bgcolor="#293a32" style="background:#293a32;">
        <a href="${escapeHtml(action.url)}" style="display:inline-block;padding:14px 21px;color:#ffffff;text-decoration:none;font-size:14px;line-height:20px;font-weight:700;">${escapeHtml(action.label)} &nbsp;→</a>
      </td></tr>
    </table>` : '';

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(email.title)}</title></head>
<body style="margin:0;padding:0;background:#f1f1ec;font-family:Arial,Helvetica,sans-serif;color:#29362f;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(email.preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f1f1ec" style="background:#f1f1ec;">
    <tr><td align="center" style="padding:30px 12px 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:610px;border:1px solid #e3e4dd;background:#ffffff;">
        <tr><td style="height:3px;font-size:0;line-height:0;background:#a78a68;">&nbsp;</td></tr>
        <tr><td bgcolor="#ffffff" style="padding:25px 33px 22px;border-bottom:1px solid #e9eae4;background:#ffffff;">
          <p style="margin:0;color:#29362f;font-size:19px;line-height:23px;font-weight:700;letter-spacing:2px;">MARTÍN</p>
          <p style="margin:2px 0 0;color:#8c7659;font-size:9px;line-height:14px;font-weight:700;letter-spacing:2px;">ATACAMA TRANSFERS</p>
        </td></tr>
        <tr><td bgcolor="#ffffff" style="padding:31px 33px 34px;background:#ffffff;">
          <p style="margin:0 0 9px;color:#88745b;font-size:10px;line-height:16px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;">${escapeHtml(email.eyebrow)}</p>
          <h1 style="margin:0 0 21px;color:#29362f;font-size:25px;line-height:31px;font-weight:700;letter-spacing:-.4px;">${escapeHtml(email.title)}</h1>
          ${email.greeting ? `<p style="margin:0 0 15px;color:#29362f;font-size:15px;line-height:23px;font-weight:700;">Hola ${escapeHtml(email.greeting)},</p>` : ''}
          ${paragraphs}
          ${email.status ? `<p style="display:inline-block;margin:3px 0 0;padding:7px 10px;border:1px solid #e5e4da;background:#f8f7f2;color:#645d4f;font-size:11px;line-height:16px;font-weight:700;">${escapeHtml(email.status)}</p>` : ''}
          ${details}${note}${button}
        </td></tr>
        <tr><td bgcolor="#fbfbf8" style="padding:23px 33px 27px;border-top:1px solid #e9eae4;background:#fbfbf8;">
          <p style="margin:0 0 6px;color:#29362f;font-size:13px;line-height:19px;font-weight:700;">Martín Atacama Transfers</p>
          <p style="margin:0 0 9px;color:#69766d;font-size:12px;line-height:19px;">Calama · San Pedro de Atacama · Aeropuerto El Loa</p>
          <p style="margin:0;color:#69766d;font-size:12px;line-height:19px;">
            <a href="mailto:contacto@transferatacamachile.cl" style="color:#405b51;text-decoration:underline;">contacto@transferatacamachile.cl</a><br>
            <a href="tel:+56997106497" style="color:#405b51;text-decoration:underline;">+56 9 9710 6497</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
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
