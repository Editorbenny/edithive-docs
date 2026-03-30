// Serverless-side templates (mirrors src/lib/templates but without ES module imports)
// These are self-contained so Netlify Functions can use them without bundling src/

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', KES: 'KSh ', NGN: '₦', ZAR: 'R', CAD: 'C$', AUD: 'A$',
};

const baseStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #111827; background: #ffffff;
  font-size: 13.5px; line-height: 1.6;
}
.page { max-width: 794px; margin: 0 auto; padding: 56px 64px; min-height: 1123px; position: relative; }
.doc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
.doc-type { font-size: 38px; font-weight: 800; letter-spacing: -1.5px; color: #111827; line-height: 1; margin-bottom: 10px; }
.doc-badge { display: inline-block; padding: 3px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.brand-block { text-align: right; }
.brand-name { font-size: 19px; font-weight: 800; letter-spacing: -0.5px; }
.brand-sub { font-size: 10px; color: #9ca3af; margin-top: 2px; letter-spacing: 0.5px; text-transform: uppercase; }
.parties-row { display: flex; gap: 48px; margin-bottom: 40px; }
.party { flex: 1; }
.party-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 8px; }
.party-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.party-detail { font-size: 12.5px; color: #6b7280; line-height: 1.7; }
.meta-strip { display: flex; background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 20px 24px; margin-bottom: 36px; flex-wrap: wrap; row-gap: 16px; }
.meta-item { flex: 1; min-width: 120px; }
.meta-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 4px; }
.meta-value { font-size: 13.5px; font-weight: 600; color: #111827; }
table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
thead th { padding: 10px 14px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; border-bottom: 2px solid #e5e7eb; }
thead th:first-child { text-align: left; }
.text-right { text-align: right; }
tbody tr { border-bottom: 1px solid #f3f4f6; }
tbody tr:last-child { border-bottom: none; }
tbody td { padding: 13px 14px; color: #374151; vertical-align: top; }
.item-desc { font-weight: 500; color: #111827; }
.empty-row { text-align: center; color: #d1d5db; font-style: italic; padding: 24px; }
.totals-section { display: flex; justify-content: flex-end; margin-bottom: 36px; }
.totals-box { width: 260px; }
.totals-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; color: #6b7280; border-bottom: 1px solid #f3f4f6; }
.totals-row:last-child { border-bottom: none; }
.total-row { padding: 12px 0 4px; font-size: 15px; font-weight: 800; color: #111827; border-top: 2px solid #111827; border-bottom: none; margin-top: 4px; }
.notes-block { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 20px 24px; margin-bottom: 48px; }
.notes-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 8px; }
.notes-text { font-size: 13px; color: #4b5563; line-height: 1.7; }
.signature-section { display: flex; gap: 48px; margin-top: 48px; padding-top: 36px; border-top: 1px solid #e5e7eb; }
.sig-block { flex: 1; }
.sig-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 40px; }
.sig-line { border-top: 1px solid #111827; padding-top: 8px; font-size: 12px; color: #6b7280; }
.legal-body { color: #4b5563; line-height: 1.8; margin-bottom: 28px; }
.legal-section { margin-bottom: 28px; }
.legal-heading { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #111827; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
.highlight-box { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: 20px 24px; margin-bottom: 28px; }
.doc-footer { position: absolute; bottom: 40px; left: 64px; right: 64px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f3f4f6; padding-top: 16px; }
.footer-brand { font-size: 12px; font-weight: 800; }
.footer-meta { font-size: 10.5px; color: #9ca3af; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
`;

const brandMark = `<div class="brand-block">
  <div class="brand-name"><span style="color:#4f46e5">edit</span>hive</div>
  <div class="brand-sub">Document Generation</div>
</div>`;

const pageFooter = (date) => `<div class="doc-footer">
  <div class="footer-brand"><span style="color:#4f46e5">edit</span>hive</div>
  <div class="footer-meta">Generated ${date || ''} · Edithive Docs</div>
</div>`;

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildItemsRows(items, currencySymbol) {
  if (!items || items.length === 0) {
    return '<tr><td colspan="4" class="empty-row">No items added</td></tr>';
  }
  return items.filter(i => i.description).map(item => {
    const amount = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
    return `<tr>
      <td class="item-desc">${escHtml(item.description)}</td>
      <td class="text-right">${escHtml(String(item.quantity || ''))}</td>
      <td class="text-right">${currencySymbol}${parseFloat(item.unit_price || 0).toFixed(2)}</td>
      <td class="text-right">${currencySymbol}${amount.toFixed(2)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" class="empty-row">No items added</td></tr>';
}

function enrichData(formData, items) {
  const currency = formData.currency || 'USD';
  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';
  const subtotal = (items || []).reduce((s, i) => s + parseFloat(i.quantity||0)*parseFloat(i.unit_price||0), 0);
  const taxRate = parseFloat(formData.tax_rate || 0);
  const discountRate = parseFloat(formData.discount_rate || 0);
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = subtotal * (discountRate / 100);
  const total = subtotal - discountAmount + taxAmount;
  const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return {
    ...formData,
    currency_symbol: currencySymbol,
    items_rows: buildItemsRows(items, currencySymbol),
    subtotal: subtotal.toFixed(2),
    tax_amount: taxAmount.toFixed(2),
    discount_amount: discountAmount.toFixed(2),
    total: total.toFixed(2),
    tax_rate: taxRate,
    discount_rate: discountRate,
    generated_date: generatedDate,
  };
}

function nl(str) { return (str || '').replace(/\n/g, '<br>'); }

const templates = {
  invoice: (formData, items) => {
    const d = enrichData(formData, items);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${baseStyles}.badge{background:#eef2ff;color:#4f46e5}</style></head><body>
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
      <div class="party-name">${d.from_name||'—'}</div>
      <div class="party-detail">${nl(d.from_address)}</div>
      ${d.from_email?`<div class="party-detail">${d.from_email}</div>`:''}
      ${d.from_phone?`<div class="party-detail">${d.from_phone}</div>`:''}
    </div>
    <div class="party">
      <div class="party-label">Bill To</div>
      <div class="party-name">${d.client_name||'—'}</div>
      <div class="party-detail">${nl(d.client_address)}</div>
      ${d.client_email?`<div class="party-detail">${d.client_email}</div>`:''}
    </div>
  </div>
  <div class="meta-strip">
    <div class="meta-item"><div class="meta-label">Invoice No.</div><div class="meta-value">${d.invoice_number||'—'}</div></div>
    <div class="meta-item"><div class="meta-label">Issue Date</div><div class="meta-value">${d.invoice_date||'—'}</div></div>
    <div class="meta-item"><div class="meta-label">Due Date</div><div class="meta-value">${d.due_date||'On Receipt'}</div></div>
    <div class="meta-item"><div class="meta-label">Currency</div><div class="meta-value">${d.currency||'USD'}</div></div>
  </div>
  <table>
    <thead><tr><th style="width:50%">Description</th><th class="text-right" style="width:12%">Qty</th><th class="text-right" style="width:18%">Unit Price</th><th class="text-right" style="width:20%">Amount</th></tr></thead>
    <tbody>${d.items_rows}</tbody>
  </table>
  <div class="totals-section"><div class="totals-box">
    <div class="totals-row"><span>Subtotal</span><span>${d.currency_symbol}${d.subtotal}</span></div>
    ${parseFloat(d.tax_rate)>0?`<div class="totals-row"><span>Tax (${d.tax_rate}%)</span><span>${d.currency_symbol}${d.tax_amount}</span></div>`:''}
    <div class="totals-row total-row"><span>Total Due</span><span>${d.currency_symbol}${d.total}</span></div>
  </div></div>
  ${d.notes?`<div class="notes-block"><div class="notes-label">Notes &amp; Payment Instructions</div><div class="notes-text">${nl(d.notes)}</div></div>`:''}
  ${pageFooter(d.generated_date)}
</div></body></html>`;
  },

  quotation: (formData, items) => {
    const d = enrichData(formData, items);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${baseStyles}.badge{background:#f5f3ff;color:#7c3aed}</style></head><body>
<div class="page">
  <div class="doc-header">
    <div>
      <div class="doc-type">QUOTATION</div>
      <span class="doc-badge badge">Valid Until: ${d.valid_until||'Negotiable'}</span>
    </div>
    ${brandMark}
  </div>
  <div class="parties-row">
    <div class="party">
      <div class="party-label">From</div>
      <div class="party-name">${d.from_name||'—'}</div>
      <div class="party-detail">${nl(d.from_address)}</div>
      ${d.from_email?`<div class="party-detail">${d.from_email}</div>`:''}
    </div>
    <div class="party">
      <div class="party-label">Quote For</div>
      <div class="party-name">${d.client_name||'—'}</div>
      <div class="party-detail">${nl(d.client_address)}</div>
      ${d.client_email?`<div class="party-detail">${d.client_email}</div>`:''}
    </div>
  </div>
  <div class="meta-strip">
    <div class="meta-item"><div class="meta-label">Quote No.</div><div class="meta-value">${d.quote_number||'—'}</div></div>
    <div class="meta-item"><div class="meta-label">Issue Date</div><div class="meta-value">${d.quote_date||'—'}</div></div>
    <div class="meta-item"><div class="meta-label">Valid Until</div><div class="meta-value">${d.valid_until||'—'}</div></div>
    <div class="meta-item"><div class="meta-label">Currency</div><div class="meta-value">${d.currency||'USD'}</div></div>
  </div>
  <table>
    <thead><tr><th style="width:50%">Description</th><th class="text-right" style="width:12%">Qty</th><th class="text-right" style="width:18%">Unit Price</th><th class="text-right" style="width:20%">Amount</th></tr></thead>
    <tbody>${d.items_rows}</tbody>
  </table>
  <div class="totals-section"><div class="totals-box">
    <div class="totals-row"><span>Subtotal</span><span>${d.currency_symbol}${d.subtotal}</span></div>
    ${parseFloat(d.discount_rate)>0?`<div class="totals-row"><span>Discount (${d.discount_rate}%)</span><span>−${d.currency_symbol}${d.discount_amount}</span></div>`:''}
    <div class="totals-row total-row"><span>Quoted Total</span><span>${d.currency_symbol}${d.total}</span></div>
  </div></div>
  ${d.notes?`<div class="notes-block"><div class="notes-label">Terms &amp; Conditions</div><div class="notes-text">${nl(d.notes)}</div></div>`:''}
  <div class="signature-section">
    <div class="sig-block"><div class="sig-label">Authorised By</div><div class="sig-line">${d.from_name||'___'} &nbsp; Date: ___________</div></div>
    <div class="sig-block"><div class="sig-label">Accepted By Client</div><div class="sig-line">${d.client_name||'___'} &nbsp; Date: ___________</div></div>
  </div>
  ${pageFooter(d.generated_date)}
</div></body></html>`;
  },

  'client-contract': (formData, items) => {
    const d = enrichData(formData, items);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${baseStyles}.badge{background:#f0f9ff;color:#0284c7}</style></head><body>
<div class="page">
  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:30px">CLIENT SERVICE<br>AGREEMENT</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Dated: ${d.contract_date||'—'}</span>
    </div>
    ${brandMark}
  </div>
  <div class="legal-body" style="margin-bottom:32px">This Client Service Agreement is entered into as of <strong>${d.contract_date||'[Date]'}</strong>, by and between:</div>
  <div class="highlight-box"><div style="display:flex;gap:48px">
    <div style="flex:1"><div class="party-label">Service Provider</div><div class="party-name">${d.company_name||'—'}</div><div class="party-detail">${nl(d.company_address)}</div>${d.company_email?`<div class="party-detail">${d.company_email}</div>`:''}</div>
    <div style="flex:1"><div class="party-label">Client</div><div class="party-name">${d.client_name||'—'}</div><div class="party-detail">${nl(d.client_address)}</div>${d.client_email?`<div class="party-detail">${d.client_email}</div>`:''}</div>
  </div></div>
  <div class="legal-section"><div class="legal-heading">1. Services</div><div class="legal-body"><strong>${d.service_title||'[Service Title]'}</strong><br><br>${nl(d.service_description||'[Description]')}</div></div>
  <div class="legal-section"><div class="legal-heading">2. Term</div><div class="legal-body">Commences <strong>${d.start_date||'[Start]'}</strong> and continues until <strong>${d.end_date||'[End]'}</strong>.</div></div>
  <div class="legal-section"><div class="legal-heading">3. Compensation</div><div class="legal-body">The Client agrees to pay <strong>${d.contract_value||'[Amount]'}</strong>.<br><br><strong>Payment Terms:</strong> ${nl(d.payment_terms||'[Terms]')}</div></div>
  <div class="legal-section"><div class="legal-heading">4. Confidentiality</div><div class="legal-body">Each party shall keep confidential all non-public information received from the other party and use it solely for purposes of this Agreement.</div></div>
  <div class="legal-section"><div class="legal-heading">5. Governing Law</div><div class="legal-body">This Agreement is governed by the laws of <strong>${d.jurisdiction||'[Jurisdiction]'}</strong>.</div></div>
  <div class="signature-section">
    <div class="sig-block"><div class="sig-label">Service Provider</div><div style="height:48px"></div><div class="sig-line">${d.company_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Name &amp; Title &nbsp;&nbsp; Date: ___________</div></div>
    <div class="sig-block"><div class="sig-label">Client</div><div style="height:48px"></div><div class="sig-line">${d.client_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Name &amp; Title &nbsp;&nbsp; Date: ___________</div></div>
  </div>
  ${pageFooter(d.generated_date)}
</div></body></html>`;
  },

  'employee-contract': (formData, items) => {
    const d = enrichData(formData, items);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${baseStyles}.badge{background:#ecfdf5;color:#059669}</style></head><body>
<div class="page">
  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:30px">EMPLOYMENT<br>AGREEMENT</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Effective: ${d.start_date||'—'}</span>
    </div>
    ${brandMark}
  </div>
  <div class="legal-body" style="margin-bottom:32px">This Employment Agreement is entered into as of <strong>${d.contract_date||'[Date]'}</strong>, between:</div>
  <div class="highlight-box"><div style="display:flex;gap:48px">
    <div style="flex:1"><div class="party-label">Employer</div><div class="party-name">${d.company_name||'—'}</div><div class="party-detail">${nl(d.company_address)}</div></div>
    <div style="flex:1"><div class="party-label">Employee</div><div class="party-name">${d.employee_name||'—'}</div><div class="party-detail">${nl(d.employee_address)}</div>${d.employee_email?`<div class="party-detail">${d.employee_email}</div>`:''}</div>
  </div></div>
  <div class="legal-section"><div class="legal-heading">1. Position &amp; Duties</div><div class="legal-body">The Employee is hired as <strong>${d.position||'[Title]'}</strong>${d.department?` in the <strong>${d.department}</strong> department`:''}.<br><br><strong>Work Location:</strong> ${d.work_location||'As directed'}</div></div>
  <div class="legal-section"><div class="legal-heading">2. Commencement</div><div class="legal-body">Employment commences on <strong>${d.start_date||'[Date]'}</strong>.${d.probation_period?` Probationary period: <strong>${d.probation_period}</strong>.`:''}</div></div>
  <div class="legal-section"><div class="legal-heading">3. Compensation</div><div class="legal-body"><strong>Salary:</strong> ${d.salary||'[Salary]'}, paid <strong>${d.payment_frequency||'Monthly'}</strong>.</div></div>
  <div class="legal-section"><div class="legal-heading">4. Working Hours</div><div class="legal-body">${d.working_hours||'40 hours per week'}</div></div>
  <div class="legal-section"><div class="legal-heading">5. Confidentiality</div><div class="legal-body">The Employee shall keep all proprietary information confidential during and after employment.</div></div>
  <div class="legal-section"><div class="legal-heading">6. Termination</div><div class="legal-body">Either party may terminate with 30 days written notice. Immediate termination may occur for cause.</div></div>
  <div class="signature-section">
    <div class="sig-block"><div class="sig-label">Employer</div><div style="height:48px"></div><div class="sig-line">${d.company_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Authorised Signatory &nbsp;&nbsp; Date: ___________</div></div>
    <div class="sig-block"><div class="sig-label">Employee</div><div style="height:48px"></div><div class="sig-line">${d.employee_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Employee Signature &nbsp;&nbsp; Date: ___________</div></div>
  </div>
  ${pageFooter(d.generated_date)}
</div></body></html>`;
  },

  nda: (formData, items) => {
    const d = enrichData(formData, items);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${baseStyles}.badge{background:#fff1f2;color:#e11d48}</style></head><body>
<div class="page">
  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:30px">NON-DISCLOSURE<br>AGREEMENT</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Effective: ${d.effective_date||'—'}</span>
    </div>
    ${brandMark}
  </div>
  <div class="legal-body" style="margin-bottom:32px">This Non-Disclosure Agreement is entered into as of <strong>${d.effective_date||'[Date]'}</strong>, by and between:</div>
  <div class="highlight-box"><div style="display:flex;gap:48px">
    <div style="flex:1"><div class="party-label">${d.party1_role||'Disclosing Party'}</div><div class="party-name">${d.party1_name||'—'}</div><div class="party-detail">${nl(d.party1_address)}</div></div>
    <div style="flex:1"><div class="party-label">${d.party2_role||'Receiving Party'}</div><div class="party-name">${d.party2_name||'—'}</div><div class="party-detail">${nl(d.party2_address)}</div></div>
  </div></div>
  <div class="legal-section"><div class="legal-heading">1. Purpose</div><div class="legal-body">${nl(d.purpose||'[Purpose of disclosure]')}</div></div>
  <div class="legal-section"><div class="legal-heading">2. Confidential Information</div><div class="legal-body">${nl(d.confidential_description||'Business plans, technical data, financial information, trade secrets, and other proprietary information.')}</div></div>
  <div class="legal-section"><div class="legal-heading">3. Obligations</div><div class="legal-body">The Receiving Party shall: (a) hold all Confidential Information in strict confidence; (b) not disclose it to third parties without written consent; (c) use it solely for the stated purpose; (d) apply no less than reasonable care to protect it.</div></div>
  <div class="legal-section"><div class="legal-heading">4. Term</div><div class="legal-body">This Agreement remains effective for <strong>${d.duration||'[Duration]'}</strong> from the Effective Date. Confidentiality obligations survive termination.</div></div>
  <div class="legal-section"><div class="legal-heading">5. Governing Law</div><div class="legal-body">Governed by the laws of <strong>${d.governing_state||'[Jurisdiction]'}</strong>.</div></div>
  <div class="signature-section">
    <div class="sig-block"><div class="sig-label">${d.party1_role||'Disclosing Party'}</div><div style="height:48px"></div><div class="sig-line">${d.party1_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp; Date: ___________</div></div>
    <div class="sig-block"><div class="sig-label">${d.party2_role||'Receiving Party'}</div><div style="height:48px"></div><div class="sig-line">${d.party2_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp; Date: ___________</div></div>
  </div>
  ${pageFooter(d.generated_date)}
</div></body></html>`;
  },

  proposal: (formData, items) => {
    const d = enrichData(formData, items);
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${baseStyles}
.badge{background:#fffbeb;color:#d97706}
.cover-strip{background:linear-gradient(135deg,#111827 0%,#1f2937 100%);color:white;border-radius:12px;padding:36px 40px;margin-bottom:40px}
.cover-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:12px}
.cover-title{font-size:26px;font-weight:800;color:white;letter-spacing:-0.5px;line-height:1.3;margin-bottom:20px}
.cover-meta{display:flex;gap:40px;flex-wrap:wrap}
.cover-meta-label{font-size:10px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px}
.cover-meta-value{font-size:13px;font-weight:600;color:#e5e7eb}
.investment-box{background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);border-radius:10px;padding:24px 28px;color:white;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center}
.investment-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.7);margin-bottom:6px}
.investment-amount{font-size:28px;font-weight:800;letter-spacing:-1px}
.investment-terms{font-size:12px;color:rgba(255,255,255,0.8);text-align:right;max-width:200px;line-height:1.6}
</style></head><body>
<div class="page">
  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:32px">PROJECT<br>PROPOSAL</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Valid Until: ${d.valid_until||'—'}</span>
    </div>
    ${brandMark}
  </div>
  <div class="cover-strip">
    <div class="cover-label">Proposal for</div>
    <div class="cover-title">${d.proposal_title||'Project Title'}</div>
    <div class="cover-meta">
      <div><div class="cover-meta-label">Prepared For</div><div class="cover-meta-value">${d.client_name||'—'}${d.client_company?` · ${d.client_company}`:''}</div></div>
      <div><div class="cover-meta-label">Prepared By</div><div class="cover-meta-value">${d.from_name||'—'}</div></div>
      <div><div class="cover-meta-label">Date</div><div class="cover-meta-value">${d.proposal_date||'—'}</div></div>
      ${d.timeline?`<div><div class="cover-meta-label">Timeline</div><div class="cover-meta-value">${d.timeline}</div></div>`:''}
    </div>
  </div>
  ${d.project_overview?`<div class="legal-section"><div class="legal-heading">Executive Summary</div><div class="legal-body">${nl(d.project_overview)}</div></div>`:''}
  ${d.deliverables?`<div class="legal-section"><div class="legal-heading">Scope of Work &amp; Deliverables</div><div class="legal-body">${nl(d.deliverables)}</div></div>`:''}
  <div class="investment-box">
    <div><div class="investment-label">Total Investment</div><div class="investment-amount">${d.total_amount||'—'}</div></div>
    ${d.payment_terms?`<div class="investment-terms">${nl(d.payment_terms)}</div>`:''}
  </div>
  ${d.notes?`<div class="notes-block"><div class="notes-label">Additional Notes</div><div class="notes-text">${nl(d.notes)}</div></div>`:''}
  <div class="legal-section" style="margin-top:36px"><div class="legal-heading">Next Steps</div><div class="legal-body">To accept, sign below and return to <strong>${d.from_email||d.from_name||'[contact]'}</strong>. Valid until <strong>${d.valid_until||'[date]'}</strong>.</div></div>
  <div class="signature-section">
    <div class="sig-block"><div class="sig-label">Prepared By</div><div style="height:48px"></div><div class="sig-line">${d.from_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp; Date: ___________</div></div>
    <div class="sig-block"><div class="sig-label">Client Acceptance</div><div style="height:48px"></div><div class="sig-line">${d.client_name||'___'}</div><div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp; Date: ___________</div></div>
  </div>
  ${pageFooter(d.generated_date)}
</div></body></html>`;
  },
};

module.exports = { templates };
