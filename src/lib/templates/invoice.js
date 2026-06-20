import { baseCSS, accentBar, logoBlock, docFooter, sectionHead, nl, esc, LOGO_SRC } from './shared.js';

export const invoiceTemplate = (d, logoSrc = LOGO_SRC) => {
  const subtotal = parseFloat(d.subtotal || 0);
  const tax      = parseFloat(d.tax_amount || 0);
  const total    = parseFloat(d.total || 0);
  const upfront  = total * 0.6;
  const balance  = total * 0.4;
  const sym      = d.currency_symbol || '₦';
  const fmt      = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>${baseCSS}</style>
</head>
<body>
${accentBar}
<div class="page">

  <!-- ── HEADER ── -->
  <div class="doc-header">
    ${logoBlock(logoSrc)}
    <div class="title-block">
      <div class="doc-type">INVOICE</div>
      <div class="doc-meta">
        <div><span class="lbl">Invoice No: </span><strong>${esc(d.invoice_number) || '—'}</strong></div>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- ── FROM / BILL TO / META ── -->
  <div class="info-strip">
    <div class="info-col">
      <div class="info-lbl">From</div>
      <div class="info-name">${esc(d.from_name) || '—'}</div>
      ${d.from_address ? `<div class="info-line">${nl(esc(d.from_address))}</div>` : ''}
      ${d.from_email   ? `<div class="info-line">${esc(d.from_email)}</div>` : ''}
      ${d.from_phone   ? `<div class="info-line">${esc(d.from_phone)}</div>` : ''}
    </div>
    <div class="info-col">
      <div class="info-lbl">Bill To</div>
      <div class="info-name">${esc(d.client_name) || '—'}</div>
      ${d.client_address ? `<div class="info-line">${nl(esc(d.client_address))}</div>` : ''}
      ${d.client_email   ? `<div class="info-line">${esc(d.client_email)}</div>` : ''}
    </div>
    <div class="info-col">
      <div class="info-meta-row">
        <div class="info-meta-lbl">Invoice Date</div>
        <div class="info-meta-val">${esc(d.invoice_date) || '—'}</div>
      </div>
      <div class="info-meta-row">
        <div class="info-meta-lbl">Payment Due</div>
        <div class="info-meta-val">${esc(d.due_date) || 'Upon Receipt'}</div>
      </div>
      <div class="info-meta-row">
        <div class="info-meta-lbl">Invoice No.</div>
        <div class="info-meta-val"><strong>${esc(d.invoice_number) || '—'}</strong></div>
      </div>
      <div class="info-meta-row">
        <div class="info-meta-lbl">Currency</div>
        <div class="info-meta-val">${esc(d.currency) || 'USD'}</div>
      </div>
    </div>
  </div>

  <!-- ── SERVICES BREAKDOWN ── -->
  <div class="section">
    ${sectionHead('Services Breakdown')}
    <div class="section-body">
      <table class="inv-table">
        <thead>
          <tr>
            <th style="width:28px">#</th>
            <th>Description</th>
            <th class="r" style="width:160px">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${d.items_rows || '<tr><td class="td-n">—</td><td colspan="2" style="color:#9CA3AF;font-style:italic">No items added</td></tr>'}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals-wrap" style="border-top: 2px solid #E0E3EA; margin-top: 0;">
        ${subtotal !== total ? `
        <div class="tot-row">
          <span>Subtotal</span>
          <span>${sym}${fmt(subtotal)}</span>
        </div>` : ''}
        ${tax > 0 ? `
        <div class="tot-row">
          <span>Tax (${d.tax_rate}%)</span>
          <span>${sym}${fmt(tax)}</span>
        </div>` : ''}
        <div class="tot-row" style="font-weight:700">
          <span>Project Total</span>
          <span>${sym}${fmt(total)}</span>
        </div>
        <div class="tot-row" style="font-weight:700">
          <span>Upfront Payment (60%)</span>
          <span>${sym}${fmt(upfront)}</span>
        </div>
        <div class="tot-final">
          <span>Balance Due (40%)</span>
          <span>${sym}${fmt(balance)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── PAYMENT TERMS ── -->
  ${d.notes ? `
  <div class="section">
    ${sectionHead('Payment Terms')}
    <div class="section-body section-pad">
      <ol class="num-list">
        ${d.notes.split('\n').filter(l => l.trim()).map((line, i) =>
          `<li class="num-item"><span class="num-n">${i + 1}.</span><span>${esc(line.replace(/^\d+\.\s*/, ''))}</span></li>`
        ).join('')}
      </ol>
    </div>
  </div>` : ''}

  <!-- ── PAYMENT DETAILS ── -->
  <div class="section">
    ${sectionHead('Payment Details')}
    <div class="section-body">
      <div class="bank-row">
        <span class="bank-lbl">Bank Name:</span>
        <span class="bank-val">${esc(d.bank_name) || ''}</span>
      </div>
      <div class="bank-row">
        <span class="bank-lbl">Account Name:</span>
        <span class="bank-val">${esc(d.bank_account_name) || ''}</span>
      </div>
      <div class="bank-row">
        <span class="bank-lbl">Account Number:</span>
        <span class="bank-val">${esc(d.bank_account_number) || ''}</span>
      </div>
      <div class="bank-row">
        <span class="bank-lbl">Bank Branch / Sort Code:</span>
        <span class="bank-val">${esc(d.bank_sort_code) || ''}</span>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid #E0E3EA;">
    <p style="font-size:12px;color:#6B7280">
      Thank you for your business. For any queries regarding this invoice, please contact
      <strong style="color:#253570">${esc(d.from_email) || 'us'}</strong>
    </p>
  </div>

  ${docFooter(
    `${esc(d.from_name) || 'Edithive'} | Creative Production Studio`,
    `${esc(d.invoice_number) || ''}`
  )}
</div>
</body>
</html>`;
};
