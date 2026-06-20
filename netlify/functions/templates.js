/**
 * EDITHIVE DOCS — Serverless Templates
 * Self-contained CommonJS module — no external imports.
 * Matches the design system defined in src/lib/templates/shared.js
 */

'use strict';

/* ── Brand tokens ── */
const N = '#253570';   // Navy primary
const O = '#F5921E';   // Orange accent
const W = '#FFFFFF';

const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', KES: 'KSh ', NGN: '₦', ZAR: 'R', CAD: 'C$', AUD: 'A$',
};

/* ── Shared CSS (mirrors shared.js baseCSS) ── */
const CSS = `
* { margin:0;padding:0;box-sizing:border-box; }
html,body { background:#fff; }
body {
  font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
  font-size:13px; line-height:1.6; color:#1A1A2E;
}
.page {
  max-width:794px; margin:0 auto; padding:0 56px 80px;
  min-height:1123px; background:#fff; position:relative;
}
.accent-bar { height:4px; background:${O}; width:100%; display:block; }
.doc-header { display:flex; justify-content:space-between; align-items:flex-start; padding:28px 0 24px; }
.logo-block img { height:46px; width:auto; display:block; }
.title-block { text-align:right; }
.doc-type { font-size:62px; font-weight:900; color:${N}; letter-spacing:-2.5px; line-height:0.9; margin-bottom:10px; }
.doc-meta { font-size:13px; line-height:1.9; color:#1A1A2E; }
.doc-meta .lbl { color:#6B7280; }
.divider { border:none; border-top:2px solid #E0E3EA; margin:0 0 26px; }
.party-row { display:flex; gap:64px; margin-bottom:26px; }
.party-col { flex:1; }
.party-lbl { font-size:13px; font-weight:700; color:${N}; margin-bottom:6px; }
.party-body { font-size:13px; color:#374151; line-height:1.75; }
.section { margin-bottom:20px; }
.section-head { background:${N}; color:#fff; padding:10px 16px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
.section-body { border:1px solid #E0E3EA; border-top:none; }
.section-pad { padding:18px 16px; font-size:13px; color:#374151; line-height:1.75; }
.info-strip { display:flex; gap:0; margin-bottom:24px; }
.info-col { flex:1; }
.info-col + .info-col { padding-left:32px; }
.info-lbl { font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
.info-name { font-size:14px; font-weight:700; color:#1A1A2E; margin-bottom:2px; }
.info-line { font-size:12.5px; color:#374151; line-height:1.7; }
.info-meta-row { margin-bottom:6px; }
.info-meta-lbl { font-size:11px; font-weight:700; color:#6B7280; text-transform:uppercase; letter-spacing:0.8px; }
.info-meta-val { font-size:13px; color:#1A1A2E; margin-top:1px; }
.kv-row { display:flex; border-bottom:1px solid #F0F2F7; }
.kv-row:last-child { border-bottom:none; }
.kv-key { flex:0 0 200px; padding:12px 16px; font-weight:700; color:${N}; font-size:13px; background:#F8F9FC; border-right:1px solid #F0F2F7; }
.kv-val { flex:1; padding:12px 16px; font-size:13px; color:#374151; }
.item-list-row { display:flex; gap:14px; padding:13px 16px; border-bottom:1px solid #F0F2F7; align-items:flex-start; }
.item-list-row:last-child { border-bottom:none; }
.item-icon { font-size:14px; font-weight:900; color:${O}; flex-shrink:0; width:18px; text-align:center; margin-top:1px; line-height:1.5; }
.item-icon.x { color:#E84B4B; }
.item-title { font-size:13px; font-weight:700; color:#1A1A2E; margin-bottom:3px; }
.item-desc { font-size:12px; color:#6B7280; line-height:1.6; }
.inv-table { width:100%; border-collapse:collapse; }
.inv-table thead th { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:${N}; padding:10px 14px; border-bottom:2px solid ${N}; text-align:left; }
.inv-table thead th.r { text-align:right; }
.inv-table tbody tr { border-bottom:1px solid #F0F2F7; }
.inv-table tbody tr:last-child { border-bottom:none; }
.inv-table tbody td { padding:13px 14px; font-size:13px; color:#374151; vertical-align:top; }
.td-n { color:#9CA3AF; width:28px; }
.td-desc { font-weight:500; color:#1A1A2E; }
.td-r { text-align:right; }
.totals-wrap { margin-top:0; }
.tot-row { display:flex; justify-content:space-between; padding:9px 14px; border-bottom:1px solid #F0F2F7; font-size:14px; font-weight:600; color:#1A1A2E; }
.tot-row:last-child { border-bottom:none; }
.tot-final { background:${N}; color:#fff; padding:13px 14px; font-size:15px; font-weight:800; display:flex; justify-content:space-between; margin-top:2px; }
.invest { background:${N}; color:#fff; text-align:center; padding:32px 24px; margin-bottom:20px; }
.invest-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:rgba(255,255,255,0.6); margin-bottom:10px; }
.invest-amt { font-size:46px; font-weight:900; color:${O}; letter-spacing:-2px; line-height:1; margin-bottom:6px; }
.invest-sub { font-size:13px; color:rgba(255,255,255,0.55); }
.pay-split { display:flex; border:1px solid #E0E3EA; margin-bottom:20px; }
.pay-box { flex:1; text-align:center; padding:28px 16px; }
.pay-box:first-child { border-right:1px solid #E0E3EA; }
.pay-pct { font-size:52px; font-weight:900; color:${N}; line-height:1; margin-bottom:6px; }
.pay-pct.org { color:${O}; }
.pay-title { font-size:13px; font-weight:700; color:${N}; margin-bottom:4px; }
.pay-title.org { color:${O}; }
.pay-desc { font-size:12px; color:#9CA3AF; }
.num-list { list-style:none; }
.num-item { display:flex; gap:12px; padding:8px 0; border-bottom:1px solid #F0F2F7; font-size:13px; color:#374151; }
.num-item:last-child { border-bottom:none; }
.num-n { font-weight:700; color:${O}; min-width:18px; flex-shrink:0; }
.bank-row { display:flex; align-items:center; gap:12px; padding:10px 16px; border-bottom:1px solid #F0F2F7; }
.bank-row:last-child { border-bottom:none; }
.bank-lbl { font-size:12px; color:#6B7280; min-width:170px; }
.bank-val { font-size:13px; font-weight:600; color:#1A1A2E; flex:1; border-bottom:1px solid #9CA3AF; min-height:16px; padding-bottom:2px; }
.legal-body { font-size:13px; color:#374151; line-height:1.85; margin-bottom:20px; }
.sig-row { display:flex; gap:48px; padding-top:28px; border-top:1px solid #E0E3EA; }
.sig-col { flex:1; }
.sig-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#9CA3AF; margin-bottom:36px; }
.sig-line { border-top:1.5px solid #1A1A2E; padding-top:8px; }
.sig-name { font-size:12px; color:#6B7280; }
.sig-date { font-size:11px; color:#9CA3AF; margin-top:4px; }
.closing { text-align:center; padding:24px 16px; border-top:1px solid #E0E3EA; border-bottom:1px solid #E0E3EA; }
.closing-quote { font-style:italic; color:#374151; font-size:14px; margin-bottom:8px; }
.closing-email { font-weight:700; color:${N}; font-size:13px; }
.doc-footer { position:absolute; bottom:28px; left:56px; right:56px; border-top:1px solid #E0E3EA; padding-top:12px; display:flex; justify-content:space-between; }
.foot-l,.foot-r { font-size:11px; color:#9CA3AF; }
@media print { body{-webkit-print-color-adjust:exact;print-color-adjust:exact;} }
`;

/* ── Helpers ── */
function e(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function nl(s) { return (s||'').replace(/\n/g,'<br>'); }
function fmt(n) { return Number(n||0).toLocaleString('en-US',{minimumFractionDigits:2}); }

function secHead(t) { return `<div class="section-head">${t}</div>`; }
function footer(l,r) { return `<div class="doc-footer"><span class="foot-l">${l}</span><span class="foot-r">${r||''}</span></div>`; }

function accentBar() { return `<div class="accent-bar"></div>`; }
function logoImg(src) { return `<div class="logo-block"><img src="${src}" alt="Edithive"></div>`; }

function enrichData(formData, items) {
  const currency = formData.currency || 'USD';
  const sym      = CURRENCY_SYMBOLS[currency] || '$';
  const valid    = (items||[]).filter(i => (i.description||'').trim());
  const subtotal = valid.reduce((s,i) => s + parseFloat(i.quantity||0)*parseFloat(i.unit_price||0), 0);
  const taxRate  = parseFloat(formData.tax_rate||0);
  const discRate = parseFloat(formData.discount_rate||0);
  const taxAmt   = subtotal*(taxRate/100);
  const discAmt  = subtotal*(discRate/100);
  const total    = subtotal - discAmt + taxAmt;

  const items_rows = valid.map((item,idx) => {
    const amt = parseFloat(item.quantity||0)*parseFloat(item.unit_price||0);
    return `<tr>
      <td class="td-n">${idx+1}</td>
      <td class="td-desc">${e(item.description)}</td>
      <td class="td-r">${sym}${fmt(amt)}</td>
    </tr>`;
  }).join('');

  return {
    ...formData,
    currency_symbol: sym,
    items_rows,
    subtotal: subtotal.toFixed(2),
    tax_amount: taxAmt.toFixed(2),
    discount_amount: discAmt.toFixed(2),
    total: total.toFixed(2),
    tax_rate: taxRate,
    discount_rate: discRate,
  };
}

/* ═══════════════════════════════════════════════
   INVOICE
═══════════════════════════════════════════════ */
function invoice(formData, items, logoSrc) {
  const d      = enrichData(formData, items);
  const sym    = d.currency_symbol;
  const total  = parseFloat(d.total);
  const upfront = total * 0.6;
  const balance = total * 0.4;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>${CSS}</style></head><body>
${accentBar()}
<div class="page">
  <div class="doc-header">
    ${logoImg(logoSrc)}
    <div class="title-block">
      <div class="doc-type">INVOICE</div>
      <div class="doc-meta"><div><span class="lbl">Invoice No: </span><strong>${e(d.invoice_number)||'—'}</strong></div></div>
    </div>
  </div>
  <hr class="divider">
  <div class="info-strip">
    <div class="info-col">
      <div class="info-lbl">From</div>
      <div class="info-name">${e(d.from_name)||'—'}</div>
      ${d.from_address?`<div class="info-line">${nl(e(d.from_address))}</div>`:''}
      ${d.from_email?`<div class="info-line">${e(d.from_email)}</div>`:''}
      ${d.from_phone?`<div class="info-line">${e(d.from_phone)}</div>`:''}
    </div>
    <div class="info-col">
      <div class="info-lbl">Bill To</div>
      <div class="info-name">${e(d.client_name)||'—'}</div>
      ${d.client_address?`<div class="info-line">${nl(e(d.client_address))}</div>`:''}
      ${d.client_email?`<div class="info-line">${e(d.client_email)}</div>`:''}
    </div>
    <div class="info-col">
      <div class="info-meta-row"><div class="info-meta-lbl">Invoice Date</div><div class="info-meta-val">${e(d.invoice_date)||'—'}</div></div>
      <div class="info-meta-row"><div class="info-meta-lbl">Payment Due</div><div class="info-meta-val">${e(d.due_date)||'Upon Receipt'}</div></div>
      <div class="info-meta-row"><div class="info-meta-lbl">Invoice No.</div><div class="info-meta-val"><strong>${e(d.invoice_number)||'—'}</strong></div></div>
      <div class="info-meta-row"><div class="info-meta-lbl">Currency</div><div class="info-meta-val">${e(d.currency)||'USD'}</div></div>
    </div>
  </div>
  <div class="section">
    ${secHead('Services Breakdown')}
    <div class="section-body">
      <table class="inv-table">
        <thead><tr><th style="width:28px">#</th><th>Description</th><th class="r" style="width:160px">Amount</th></tr></thead>
        <tbody>${d.items_rows||'<tr><td class="td-n">—</td><td colspan="2" style="color:#9CA3AF;font-style:italic">No items added</td></tr>'}</tbody>
      </table>
      <div class="totals-wrap" style="border-top:2px solid #E0E3EA">
        ${parseFloat(d.subtotal)!==total?`<div class="tot-row"><span>Subtotal</span><span>${sym}${fmt(d.subtotal)}</span></div>`:''}
        ${parseFloat(d.tax_rate)>0?`<div class="tot-row"><span>Tax (${d.tax_rate}%)</span><span>${sym}${fmt(d.tax_amount)}</span></div>`:''}
        <div class="tot-row" style="font-weight:700"><span>Project Total</span><span>${sym}${fmt(total)}</span></div>
        <div class="tot-row" style="font-weight:700"><span>Upfront Payment (60%)</span><span>${sym}${fmt(upfront)}</span></div>
        <div class="tot-final"><span>Balance Due (40%)</span><span>${sym}${fmt(balance)}</span></div>
      </div>
    </div>
  </div>
  ${d.notes?`
  <div class="section">${secHead('Payment Terms')}
    <div class="section-body section-pad"><ol class="num-list">
      ${d.notes.split('\n').filter(l=>l.trim()).map((line,i)=>
        `<li class="num-item"><span class="num-n">${i+1}.</span><span>${e(line.replace(/^\d+\.\s*/,''))}</span></li>`
      ).join('')}
    </ol></div>
  </div>`:''}
  <div class="section">
    ${secHead('Payment Details')}
    <div class="section-body">
      <div class="bank-row"><span class="bank-lbl">Bank Name:</span><span class="bank-val">${e(d.bank_name)||''}</span></div>
      <div class="bank-row"><span class="bank-lbl">Account Name:</span><span class="bank-val">${e(d.bank_account_name)||''}</span></div>
      <div class="bank-row"><span class="bank-lbl">Account Number:</span><span class="bank-val">${e(d.bank_account_number)||''}</span></div>
      <div class="bank-row"><span class="bank-lbl">Bank Branch / Sort Code:</span><span class="bank-val">${e(d.bank_sort_code)||''}</span></div>
    </div>
  </div>
  <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid #E0E3EA">
    <p style="font-size:12px;color:#6B7280">Thank you for your business. For any queries, please contact <strong style="color:${N}">${e(d.from_email)||'us'}</strong></p>
  </div>
  ${footer(`${e(d.from_name)||'Edithive'} | Creative Production Studio`, e(d.invoice_number)||'')}
</div></body></html>`;
}

/* ═══════════════════════════════════════════════
   QUOTATION
═══════════════════════════════════════════════ */
function quotation(formData, items, logoSrc) {
  const d   = enrichData(formData, items);
  const sym = d.currency_symbol;
  const tot = parseFloat(d.total);

  const defaultTerms = [
    'This quotation is valid for <strong>14 days</strong> from the date of issue.',
    'Project commences upon receipt of the <strong>60% upfront payment</strong>.',
    'Timeline starts only after all required assets are received in full.',
    'Remaining <strong>40% balance</strong> is due before final file delivery.',
    'An invoice will be issued upon acceptance of these terms.',
    'Edithive retains the right to showcase completed work in its portfolio.',
  ];

  const termsHtml = d.notes
    ? d.notes.split('\n').filter(l=>l.trim()).map((line,i)=>
        `<li class="num-item"><span class="num-n">${i+1}.</span><span>${e(line.replace(/^\d+\.\s*/,''))}</span></li>`
      ).join('')
    : defaultTerms.map((t,i)=>
        `<li class="num-item"><span class="num-n">${i+1}.</span><span>${t}</span></li>`
      ).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>${CSS}</style></head><body>
${accentBar()}
<div class="page">
  <div class="doc-header">
    ${logoImg(logoSrc)}
    <div class="title-block">
      <div class="doc-type">QUOTATION</div>
      <div class="doc-meta">
        <div><span class="lbl">Ref: </span><strong>${e(d.quote_number)||'—'}</strong></div>
        <div><span class="lbl">Date: </span><strong>${e(d.quote_date)||'—'}</strong></div>
        <div><span class="lbl">Valid Until: </span><strong>${e(d.valid_until)||'—'}</strong></div>
      </div>
    </div>
  </div>
  <hr class="divider">
  <div class="party-row">
    <div class="party-col">
      <div class="party-lbl">Prepared By</div>
      <div class="party-body">${e(d.from_name)||'—'}<br>${d.from_address?nl(e(d.from_address))+'<br>':''}${d.from_email?e(d.from_email):''}</div>
    </div>
    <div class="party-col">
      <div class="party-lbl">Prepared For</div>
      <div class="party-body">${e(d.client_name)||'—'}<br>${d.client_address?nl(e(d.client_address))+'<br>':''}${d.client_email?e(d.client_email):''}</div>
    </div>
  </div>
  <div class="section">
    ${secHead('Services Breakdown')}
    <div class="section-body">
      <table class="inv-table">
        <thead><tr><th style="width:28px">#</th><th>Description</th><th class="r" style="width:180px">Amount</th></tr></thead>
        <tbody>${d.items_rows||'<tr><td class="td-n">—</td><td colspan="2" style="color:#9CA3AF;font-style:italic">No items added</td></tr>'}</tbody>
      </table>
      <div class="totals-wrap" style="border-top:2px solid #E0E3EA">
        ${parseFloat(d.discount_rate)>0?`
          <div class="tot-row"><span>Subtotal</span><span>${sym}${fmt(d.subtotal)}</span></div>
          <div class="tot-row"><span>Discount (${d.discount_rate}%)</span><span>−${sym}${fmt(d.discount_amount)}</span></div>`:''}
        <div class="tot-final"><span>Total</span><span>${sym}${fmt(tot)}</span></div>
      </div>
    </div>
  </div>
  <div class="invest">
    <div class="invest-lbl">Project Investment</div>
    <div class="invest-amt">${e(d.currency)||''} ${fmt(tot)}</div>
  </div>
  <div class="section">
    ${secHead('Payment Terms')}
    <div class="section-body">
      <div class="pay-split" style="border:none">
        <div class="pay-box"><div class="pay-pct">60%</div><div class="pay-title">Upfront Deposit</div><div class="pay-desc">Due before project commences</div></div>
        <div class="pay-box"><div class="pay-pct org">40%</div><div class="pay-title org">Upon Completion</div><div class="pay-desc">Due prior to final file delivery</div></div>
      </div>
    </div>
  </div>
  <div class="section">
    ${secHead('Terms & Conditions')}
    <div class="section-body section-pad"><ol class="num-list">${termsHtml}</ol></div>
  </div>
  <div class="closing" style="margin-top:24px">
    <div class="closing-quote">Great work takes craft. We'll take good care of this one.</div>
    <div class="closing-email">${e(d.from_email)||'Benny@myedithive.com'}</div>
  </div>
  ${footer(`${e(d.from_name)||'Edithive'} · ${e(d.from_email)||''} · ${e(d.quote_number)||''}`, '1')}
</div></body></html>`;
}

/* ═══════════════════════════════════════════════
   CLIENT CONTRACT
═══════════════════════════════════════════════ */
function clientContract(formData, _items, logoSrc) {
  const d = enrichData(formData, []);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>${CSS}</style></head><body>
${accentBar()}
<div class="page">
  <div class="doc-header">
    ${logoImg(logoSrc)}
    <div class="title-block">
      <div class="doc-type" style="font-size:48px;letter-spacing:-1.5px">CLIENT SERVICE<br>AGREEMENT</div>
      <div class="doc-meta"><div><span class="lbl">Dated: </span><strong>${e(d.contract_date)||'—'}</strong></div></div>
    </div>
  </div>
  <hr class="divider">
  <div class="party-row">
    <div class="party-col">
      <div class="party-lbl">Service Provider</div>
      <div class="party-body"><strong>${e(d.company_name)||'—'}</strong><br>${d.company_address?nl(e(d.company_address))+'<br>':''}${d.company_email?e(d.company_email):''}</div>
    </div>
    <div class="party-col">
      <div class="party-lbl">Client</div>
      <div class="party-body"><strong>${e(d.client_name)||'—'}</strong><br>${d.client_address?nl(e(d.client_address))+'<br>':''}${d.client_email?e(d.client_email):''}</div>
    </div>
  </div>
  <div class="legal-body">This Client Service Agreement is entered into as of <strong>${e(d.contract_date)||'[Date]'}</strong>, by and between the parties listed above.</div>
  <div class="section">${secHead('1. Scope of Services')}
    <div class="section-body section-pad">
      <div style="font-weight:700;font-size:14px;color:${N};margin-bottom:8px">${e(d.service_title)||'[Service Title]'}</div>
      <div class="legal-body">${nl(e(d.service_description))||'[Describe services here]'}</div>
    </div>
  </div>
  <div class="section">${secHead('2. Term')}
    <div class="section-body">
      <div class="kv-row"><div class="kv-key">Start Date</div><div class="kv-val">${e(d.start_date)||'—'}</div></div>
      <div class="kv-row"><div class="kv-key">End Date</div><div class="kv-val">${e(d.end_date)||'—'}</div></div>
    </div>
  </div>
  <div class="section">${secHead('3. Compensation & Payment')}
    <div class="section-body section-pad">
      <div class="legal-body">In consideration for the Services, the Client agrees to pay <strong>${e(d.contract_value)||'[Amount]'}</strong>.</div>
      ${d.payment_terms?`<div class="legal-body"><strong>Payment Terms:</strong> ${nl(e(d.payment_terms))}</div>`:''}
    </div>
  </div>
  <div class="section">${secHead('4. Confidentiality')}
    <div class="section-body section-pad"><div class="legal-body">Each party shall keep confidential all non-public information received from the other party and use it solely for purposes of this Agreement. This obligation survives termination.</div></div>
  </div>
  <div class="section">${secHead('5. Intellectual Property')}
    <div class="section-body section-pad"><div class="legal-body">Upon full payment, all deliverables created for the Client shall become the Client's property. The Service Provider retains all pre-existing tools and methodologies.</div></div>
  </div>
  <div class="section">${secHead('6. Termination')}
    <div class="section-body section-pad"><div class="legal-body">Either party may terminate with 30 days written notice. The Client shall pay for all Services rendered up to the termination date.</div></div>
  </div>
  <div class="section">${secHead('7. Governing Law')}
    <div class="section-body section-pad"><div class="legal-body">This Agreement is governed by the laws of <strong>${e(d.jurisdiction)||'[Jurisdiction]'}</strong>.</div></div>
  </div>
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col"><div class="sig-lbl">Service Provider</div><div class="sig-line"><div class="sig-name">${e(d.company_name)||'___'}</div><div class="sig-date">Name &amp; Title &nbsp;&nbsp; Date: ___________</div></div></div>
    <div class="sig-col"><div class="sig-lbl">Client</div><div class="sig-line"><div class="sig-name">${e(d.client_name)||'___'}</div><div class="sig-date">Name &amp; Title &nbsp;&nbsp; Date: ___________</div></div></div>
  </div>
  ${footer(`${e(d.company_name)||'Edithive'} · Client Service Agreement · ${e(d.contract_date)||''}`,'')}
</div></body></html>`;
}

/* ═══════════════════════════════════════════════
   EMPLOYEE CONTRACT
═══════════════════════════════════════════════ */
function employeeContract(formData, _items, logoSrc) {
  const d = enrichData(formData, []);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>${CSS}</style></head><body>
${accentBar()}
<div class="page">
  <div class="doc-header">
    ${logoImg(logoSrc)}
    <div class="title-block">
      <div class="doc-type" style="font-size:48px;letter-spacing:-1.5px">EMPLOYMENT<br>AGREEMENT</div>
      <div class="doc-meta">
        <div><span class="lbl">Effective: </span><strong>${e(d.start_date)||'—'}</strong></div>
        <div><span class="lbl">Dated: </span><strong>${e(d.contract_date)||'—'}</strong></div>
      </div>
    </div>
  </div>
  <hr class="divider">
  <div class="party-row">
    <div class="party-col"><div class="party-lbl">Employer</div><div class="party-body"><strong>${e(d.company_name)||'—'}</strong><br>${d.company_address?nl(e(d.company_address)):''}</div></div>
    <div class="party-col"><div class="party-lbl">Employee</div><div class="party-body"><strong>${e(d.employee_name)||'—'}</strong><br>${d.employee_address?nl(e(d.employee_address))+'<br>':''}${d.employee_email?e(d.employee_email):''}</div></div>
  </div>
  <div class="legal-body">This Employment Agreement is entered into as of <strong>${e(d.contract_date)||'[Date]'}</strong>, between the parties listed above.</div>
  <div class="section">${secHead('1. Position & Duties')}
    <div class="section-body">
      <div class="kv-row"><div class="kv-key">Job Title</div><div class="kv-val"><strong>${e(d.position)||'—'}</strong></div></div>
      ${d.department?`<div class="kv-row"><div class="kv-key">Department</div><div class="kv-val">${e(d.department)}</div></div>`:''}
      <div class="kv-row"><div class="kv-key">Work Location</div><div class="kv-val">${e(d.work_location)||'As directed'}</div></div>
    </div>
  </div>
  <div class="section">${secHead('2. Commencement & Probation')}
    <div class="section-body">
      <div class="kv-row"><div class="kv-key">Start Date</div><div class="kv-val"><strong>${e(d.start_date)||'—'}</strong></div></div>
      ${d.probation_period?`<div class="kv-row"><div class="kv-key">Probation Period</div><div class="kv-val">${e(d.probation_period)}</div></div>`:''}
    </div>
  </div>
  <div class="section">${secHead('3. Compensation & Benefits')}
    <div class="section-body">
      <div class="kv-row"><div class="kv-key">Salary</div><div class="kv-val"><strong>${e(d.salary)||'—'}</strong></div></div>
      <div class="kv-row"><div class="kv-key">Payment Frequency</div><div class="kv-val">${e(d.payment_frequency)||'Monthly'}</div></div>
      <div class="kv-row"><div class="kv-key">Working Hours</div><div class="kv-val">${e(d.working_hours)||'40 hours/week'}</div></div>
    </div>
  </div>
  <div class="section">${secHead('4. Confidentiality')}
    <div class="section-body section-pad"><div class="legal-body">The Employee shall keep all proprietary information, trade secrets, and client data confidential during and after employment.</div></div>
  </div>
  <div class="section">${secHead('5. Termination')}
    <div class="section-body section-pad"><div class="legal-body">Either party may terminate with <strong>30 days</strong> written notice. Immediate termination may occur for cause including gross misconduct or material breach.</div></div>
  </div>
  <div class="section">${secHead('6. Governing Law')}
    <div class="section-body section-pad"><div class="legal-body">Governed by applicable employment laws in the jurisdiction where work is performed.</div></div>
  </div>
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col"><div class="sig-lbl">Employer</div><div class="sig-line"><div class="sig-name">${e(d.company_name)||'___'}</div><div class="sig-date">Authorised Signatory &nbsp;&nbsp; Date: ___________</div></div></div>
    <div class="sig-col"><div class="sig-lbl">Employee</div><div class="sig-line"><div class="sig-name">${e(d.employee_name)||'___'}</div><div class="sig-date">Employee Signature &nbsp;&nbsp; Date: ___________</div></div></div>
  </div>
  ${footer(`${e(d.company_name)||'Edithive'} · Employment Agreement · ${e(d.employee_name)||''}`,'')}
</div></body></html>`;
}

/* ═══════════════════════════════════════════════
   NDA
═══════════════════════════════════════════════ */
function nda(formData, _items, logoSrc) {
  const d = enrichData(formData, []);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>${CSS}</style></head><body>
${accentBar()}
<div class="page">
  <div class="doc-header">
    ${logoImg(logoSrc)}
    <div class="title-block">
      <div class="doc-type" style="font-size:44px;letter-spacing:-1.5px">NON-DISCLOSURE<br>AGREEMENT</div>
      <div class="doc-meta"><div><span class="lbl">Effective Date: </span><strong>${e(d.effective_date)||'—'}</strong></div></div>
    </div>
  </div>
  <hr class="divider">
  <div class="party-row">
    <div class="party-col"><div class="party-lbl">${e(d.party1_role)||'Disclosing Party'}</div><div class="party-body"><strong>${e(d.party1_name)||'—'}</strong><br>${d.party1_address?nl(e(d.party1_address)):''}</div></div>
    <div class="party-col"><div class="party-lbl">${e(d.party2_role)||'Receiving Party'}</div><div class="party-body"><strong>${e(d.party2_name)||'—'}</strong><br>${d.party2_address?nl(e(d.party2_address)):''}</div></div>
  </div>
  <div class="legal-body">This Non-Disclosure Agreement is entered into as of <strong>${e(d.effective_date)||'[Date]'}</strong>, by and between the parties listed above.</div>
  <div class="section">${secHead('1. Purpose')}
    <div class="section-body section-pad"><div class="legal-body">${nl(e(d.purpose))||'Evaluation of a potential business relationship or transaction.'}</div></div>
  </div>
  <div class="section">${secHead('2. Confidential Information')}
    <div class="section-body section-pad">
      <div class="legal-body" style="margin-bottom:10px"><strong>"Confidential Information"</strong> includes but is not limited to:</div>
      <div class="legal-body">${nl(e(d.confidential_description))||'Business plans, technical specifications, financial data, client lists, trade secrets, and other proprietary information.'}</div>
    </div>
  </div>
  <div class="section">${secHead('3. Obligations of the Receiving Party')}
    <div class="section-body">
      <div class="item-list-row"><div class="item-icon">✓</div><div><div class="item-title">Hold in Strict Confidence</div><div class="item-desc">Apply no less care than to its own confidential information.</div></div></div>
      <div class="item-list-row"><div class="item-icon">✓</div><div><div class="item-title">No Unauthorised Disclosure</div><div class="item-desc">Not disclose to any third party without prior written consent.</div></div></div>
      <div class="item-list-row"><div class="item-icon">✓</div><div><div class="item-title">Permitted Use Only</div><div class="item-desc">Use solely for the stated Purpose in this Agreement.</div></div></div>
    </div>
  </div>
  <div class="section">${secHead('4. Duration')}
    <div class="section-body section-pad"><div class="legal-body">This Agreement remains in effect for <strong>${e(d.duration)||'[Duration]'}</strong> from the Effective Date. Confidentiality obligations survive termination.</div></div>
  </div>
  <div class="section">${secHead('5. Governing Law')}
    <div class="section-body section-pad"><div class="legal-body">Governed by the laws of <strong>${e(d.governing_state)||'[Jurisdiction]'}</strong>. Breaches may entitle the Disclosing Party to seek equitable relief.</div></div>
  </div>
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col"><div class="sig-lbl">${e(d.party1_role)||'Disclosing Party'}</div><div class="sig-line"><div class="sig-name">${e(d.party1_name)||'___'}</div><div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div></div></div>
    <div class="sig-col"><div class="sig-lbl">${e(d.party2_role)||'Receiving Party'}</div><div class="sig-line"><div class="sig-name">${e(d.party2_name)||'___'}</div><div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div></div></div>
  </div>
  ${footer(`Non-Disclosure Agreement · Effective ${e(d.effective_date)||''}`,'')}
</div></body></html>`;
}

/* ═══════════════════════════════════════════════
   PROPOSAL
═══════════════════════════════════════════════ */
function proposal(formData, _items, logoSrc) {
  const d        = enrichData(formData, []);
  const delLines = (d.deliverables||'').split('\n').filter(l=>l.trim());

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<style>${CSS}</style></head><body>
${accentBar()}
<div class="page">
  <div class="doc-header">
    ${logoImg(logoSrc)}
    <div class="title-block">
      <div class="doc-type" style="font-size:54px;letter-spacing:-2px">PROJECT<br>PROPOSAL</div>
      <div class="doc-meta">
        <div><span class="lbl">Date: </span><strong>${e(d.proposal_date)||'—'}</strong></div>
        <div><span class="lbl">Valid Until: </span><strong>${e(d.valid_until)||'—'}</strong></div>
      </div>
    </div>
  </div>
  <hr class="divider">
  <div class="party-row">
    <div class="party-col"><div class="party-lbl">Prepared By</div><div class="party-body"><strong>${e(d.from_name)||'—'}</strong><br>${d.from_address?nl(e(d.from_address))+'<br>':''}${d.from_email?e(d.from_email):''}</div></div>
    <div class="party-col"><div class="party-lbl">Prepared For</div><div class="party-body"><strong>${e(d.client_name)||'—'}</strong><br>${d.client_company?e(d.client_company)+'<br>':''}${d.client_email?e(d.client_email):''}</div></div>
  </div>
  <div class="section">${secHead('Project Overview')}
    <div class="section-body section-pad">
      <div style="font-size:15px;font-weight:700;color:${N};margin-bottom:10px">${e(d.proposal_title)||'[Project Title]'}</div>
      <div class="legal-body">${nl(e(d.project_overview))||'<span style="color:#9CA3AF;font-style:italic">Project overview will appear here.</span>'}</div>
    </div>
  </div>
  <div class="section">${secHead('Project Details')}
    <div class="section-body">
      <div class="kv-row"><div class="kv-key">Project</div><div class="kv-val"><strong>${e(d.proposal_title)||'—'}</strong></div></div>
      <div class="kv-row"><div class="kv-key">Client</div><div class="kv-val">${e(d.client_name)||'—'}${d.client_company?` — ${e(d.client_company)}`:''}</div></div>
      ${d.timeline?`<div class="kv-row"><div class="kv-key">Timeline</div><div class="kv-val">${e(d.timeline)}</div></div>`:''}
      <div class="kv-row"><div class="kv-key">Valid Until</div><div class="kv-val">${e(d.valid_until)||'—'}</div></div>
    </div>
  </div>
  ${delLines.length?`<div class="section">${secHead('Scope of Work & Deliverables')}
    <div class="section-body">${delLines.map(l=>`
      <div class="item-list-row"><div class="item-icon">✓</div><div><div class="item-desc" style="color:#1A1A2E;font-size:13px">${e(l.replace(/^[✓✗\-*•]\s*/,''))}</div></div></div>`).join('')}
    </div>
  </div>`:''}
  <div class="invest"><div class="invest-lbl">Project Investment</div><div class="invest-amt">${e(d.total_amount)||'—'}</div>${d.payment_terms?`<div class="invest-sub">${e(d.payment_terms.split('\n')[0])}</div>`:''}</div>
  <div class="section">${secHead('Payment Terms')}
    <div class="section-body">
      <div class="pay-split" style="border:none">
        <div class="pay-box"><div class="pay-pct">60%</div><div class="pay-title">Upfront Deposit</div><div class="pay-desc">Due before project commences</div></div>
        <div class="pay-box"><div class="pay-pct org">40%</div><div class="pay-title org">Upon Completion</div><div class="pay-desc">Due prior to final delivery</div></div>
      </div>
    </div>
  </div>
  ${d.notes?`<div class="section">${secHead('Additional Notes')}
    <div class="section-body section-pad"><div class="legal-body">${nl(e(d.notes))}</div></div>
  </div>`:''}
  <div class="section">${secHead('Next Steps')}
    <div class="section-body section-pad"><div class="legal-body">To accept this proposal, please sign below and return to <strong style="color:${N}">${e(d.from_email)||e(d.from_name)||'[contact]'}</strong>. Valid until <strong>${e(d.valid_until)||'[date]'}</strong>.</div></div>
  </div>
  <div class="closing" style="margin-top:20px">
    <div class="closing-quote">Great work takes craft. We'll take good care of this one.</div>
    <div class="closing-email">${e(d.from_email)||'Benny@myedithive.com'}</div>
  </div>
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col"><div class="sig-lbl">Prepared By</div><div class="sig-line"><div class="sig-name">${e(d.from_name)||'___'}</div><div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div></div></div>
    <div class="sig-col"><div class="sig-lbl">Client Acceptance</div><div class="sig-line"><div class="sig-name">${e(d.client_name)||'___'}</div><div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div></div></div>
  </div>
  ${footer(`${e(d.from_name)||'Edithive'} · ${e(d.from_email)||''}`,'1')}
</div></body></html>`;
}

/* ── Export ── */
module.exports = {
  templates: {
    invoice,
    quotation,
    'client-contract':   clientContract,
    'employee-contract': employeeContract,
    nda,
    proposal,
  },
};
