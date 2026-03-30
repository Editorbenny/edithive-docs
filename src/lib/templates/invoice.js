import { baseStyles, brandMark, pageFooter } from './shared.js';

export const invoiceTemplate = (d) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
${baseStyles}
.accent { color: #4f46e5; }
.badge { background: #eef2ff; color: #4f46e5; }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <div>
      <div class="doc-type">INVOICE</div>
      <span class="doc-badge badge">Due: ${d.due_date || 'On Receipt'}</span>
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
      <div class="party-label">Bill To</div>
      <div class="party-name">${d.client_name || '—'}</div>
      <div class="party-detail">${(d.client_address || '').replace(/\n/g, '<br>')}</div>
      ${d.client_email ? `<div class="party-detail">${d.client_email}</div>` : ''}
    </div>
  </div>

  <div class="meta-strip">
    <div class="meta-item">
      <div class="meta-label">Invoice No.</div>
      <div class="meta-value">${d.invoice_number || '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Issue Date</div>
      <div class="meta-value">${d.invoice_date || '—'}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Due Date</div>
      <div class="meta-value">${d.due_date || 'On Receipt'}</div>
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
      ${parseFloat(d.tax_rate) > 0 ? `
      <div class="totals-row">
        <span>Tax (${d.tax_rate}%)</span>
        <span>${d.currency_symbol}${d.tax_amount}</span>
      </div>` : ''}
      <div class="totals-row total-row">
        <span>Total Due</span>
        <span>${d.currency_symbol}${d.total}</span>
      </div>
    </div>
  </div>

  ${d.notes ? `
  <div class="notes-block">
    <div class="notes-label">Notes &amp; Payment Instructions</div>
    <div class="notes-text">${d.notes.replace(/\n/g, '<br>')}</div>
  </div>` : ''}

  ${pageFooter(d.generated_date)}
</div>
</body>
</html>`;
