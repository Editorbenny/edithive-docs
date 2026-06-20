import { baseCSS, accentBar, logoBlock, docFooter, sectionHead, nl, esc, LOGO_SRC } from './shared.js';

export const quotationTemplate = (d, logoSrc = LOGO_SRC) => {
  const sym = d.currency_symbol || '₦';
  const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const total = parseFloat(d.total || 0);

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
      <div class="doc-type">QUOTATION</div>
      <div class="doc-meta">
        <div><span class="lbl">Ref: </span><strong>${esc(d.quote_number) || '—'}</strong></div>
        <div><span class="lbl">Date: </span><strong>${esc(d.quote_date) || '—'}</strong></div>
        <div><span class="lbl">Valid Until: </span><strong>${esc(d.valid_until) || '—'}</strong></div>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- ── PREPARED BY / FOR ── -->
  <div class="party-row">
    <div class="party-col">
      <div class="party-lbl">Prepared By</div>
      <div class="party-body">
        ${esc(d.from_name) || '—'}<br>
        ${d.from_address ? nl(esc(d.from_address)) + '<br>' : ''}
        ${d.from_email ? esc(d.from_email) : ''}
        ${d.from_phone ? '<br>' + esc(d.from_phone) : ''}
      </div>
    </div>
    <div class="party-col">
      <div class="party-lbl">Prepared For</div>
      <div class="party-body">
        ${esc(d.client_name) || '—'}<br>
        ${d.client_address ? nl(esc(d.client_address)) + '<br>' : ''}
        ${d.client_email ? esc(d.client_email) : ''}
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
            <th class="r" style="width:180px">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${d.items_rows || '<tr><td class="td-n">—</td><td colspan="2" style="color:#9CA3AF;font-style:italic">No items added</td></tr>'}
        </tbody>
      </table>

      <div class="totals-wrap" style="border-top: 2px solid #E0E3EA;">
        ${parseFloat(d.discount_rate) > 0 ? `
        <div class="tot-row">
          <span>Subtotal</span>
          <span>${sym}${fmt(parseFloat(d.subtotal))}</span>
        </div>
        <div class="tot-row">
          <span>Discount (${d.discount_rate}%)</span>
          <span>−${sym}${fmt(parseFloat(d.discount_amount))}</span>
        </div>` : ''}
        <div class="tot-final">
          <span>Total</span>
          <span>${sym}${fmt(total)}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── PROJECT INVESTMENT ── -->
  <div class="invest">
    <div class="invest-lbl">Project Investment</div>
    <div class="invest-amt">${esc(d.currency) || ''} ${fmt(total)}</div>
    ${d.currency !== 'USD' ? `<div class="invest-sub">Subject to exchange rate at time of payment</div>` : ''}
  </div>

  <!-- ── PAYMENT TERMS ── -->
  <div class="section">
    ${sectionHead('Payment Terms')}
    <div class="section-body">
      <div class="pay-split" style="border:none;border-bottom:1px solid #E0E3EA">
        <div class="pay-box">
          <div class="pay-pct">60%</div>
          <div class="pay-title">Upfront Deposit</div>
          <div class="pay-desc">Due before project commences</div>
        </div>
        <div class="pay-box">
          <div class="pay-pct org">40%</div>
          <div class="pay-title org">Upon Completion</div>
          <div class="pay-desc">Due prior to final file delivery</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── NOTES / TERMS ── -->
  ${d.notes ? `
  <div class="section">
    ${sectionHead('Terms & Conditions')}
    <div class="section-body section-pad">
      <ol class="num-list">
        ${d.notes.split('\n').filter(l => l.trim()).map((line, i) =>
          `<li class="num-item"><span class="num-n">${i + 1}.</span><span>${esc(line.replace(/^\d+\.\s*/, ''))}</span></li>`
        ).join('')}
      </ol>
    </div>
  </div>` : `
  <div class="section">
    ${sectionHead('Terms & Conditions')}
    <div class="section-body section-pad">
      <ol class="num-list">
        <li class="num-item"><span class="num-n">1.</span><span>This quotation is valid for <strong>14 days</strong> from the date of issue.</span></li>
        <li class="num-item"><span class="num-n">2.</span><span>Project commences upon receipt of the <strong>60% upfront payment</strong>.</span></li>
        <li class="num-item"><span class="num-n">3.</span><span>Timeline starts only after all required assets are received in full.</span></li>
        <li class="num-item"><span class="num-n">4.</span><span>Remaining <strong>40% balance</strong> is due before final file delivery.</span></li>
        <li class="num-item"><span class="num-n">5.</span><span>An invoice will be issued upon acceptance of these terms.</span></li>
        <li class="num-item"><span class="num-n">6.</span><span>Edithive retains the right to showcase completed work in its portfolio.</span></li>
      </ol>
    </div>
  </div>`}

  <!-- ── CLOSING ── -->
  <div class="closing" style="margin-top:24px">
    <div class="closing-quote">Great work takes craft. We'll take good care of this one.</div>
    <div class="closing-email">${esc(d.from_email) || 'Benny@myedithive.com'}</div>
  </div>

  ${docFooter(
    `${esc(d.from_name) || 'Edithive'} · ${esc(d.from_email) || ''} · ${esc(d.quote_number) || ''}`,
    `1`
  )}
</div>
</body>
</html>`;
};
