import { baseStyles, brandMark, pageFooter } from './shared.js';

export const quotationTemplate = (d) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
${baseStyles}
.accent { color: #7c3aed; }
.badge { background: #f5f3ff; color: #7c3aed; }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <div>
      <div class="doc-type">QUOTATION</div>
      <span class="doc-badge badge">Valid Until: ${d.valid_until || 'Negotiable'}</span>
    </div>
    ${brandMark}
  </div>

  <div class="parties-row">
    <div class="party">
      <div class="party-label">From</div>
      <div class="party-name">${d.from_name || '—'}</div>
      <div class="party-detail">${(d.from_address || '').replace(/\n/g, '<br>')}</div>
      ${d.from_email ? `<div class="party-detail">${d.from_email}</div>` : ''}
      ${d.from_phone ? `<div class="party-detail">${d.from_phone}</div>` : ''}
    </div>
    <div class="party">
      <div class="party-label">Quote For</div>
      <div class="party-name">${d.client_name || '—'}</div>
      <div class="party-detail">${(d.client_address || '').replace(/\n/g, '<br>')}</div>
      ${d.client_email ? `<div class="party-detail">${d.client_email}</div>` : ''}
    </div>
  </div>

  <div class="meta-strip">
    <div class="meta-item">
      <div class="meta-label">Quote No.</div>
      <div class="meta-value">${d.quote_number || '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Issue Date</div>
      <div class="meta-value">${d.quote_date || '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Valid Until</div>
      <div class="meta-value">${d.valid_until || '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Currency</div>
      <div class="meta-value">${d.currency || 'USD'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:50%">Description</th>
        <th class="text-right" style="width:12%">Qty</th>
        <th class="text-right" style="width:18%">Unit Price</th>
        <th class="text-right" style="width:20%">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${d.items_rows}
    </tbody>
  </table>

  <div class="totals-section">
    <div class="totals-box">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${d.currency_symbol}${d.subtotal}</span>
      </div>
      ${parseFloat(d.discount_rate) > 0 ? `
      <div class="totals-row">
        <span>Discount (${d.discount_rate}%)</span>
        <span>−${d.currency_symbol}${d.discount_amount}</span>
      </div>` : ''}
      <div class="totals-row total-row">
        <span>Quoted Total</span>
        <span>${d.currency_symbol}${d.total}</span>
      </div>
    </div>
  </div>

  ${d.notes ? `
  <div class="notes-block">
    <div class="notes-label">Terms &amp; Conditions</div>
    <div class="notes-text">${d.notes.replace(/\n/g, '<br>')}</div>
  </div>` : ''}

  <div class="signature-section">
    <div class="sig-block">
      <div class="sig-label">Authorised By</div>
      <div class="sig-line">${d.from_name || 'Company Name'} &nbsp; Date: ___________</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Accepted By Client</div>
      <div class="sig-line">${d.client_name || 'Client Name'} &nbsp; Date: ___________</div>
    </div>
  </div>

  ${pageFooter(d.generated_date)}
</div>
</body>
</html>`;
