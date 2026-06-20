import { baseCSS, accentBar, logoBlock, docFooter, sectionHead, nl, esc, LOGO_SRC } from './shared.js';

export const proposalTemplate = (d, logoSrc = LOGO_SRC) => {
  const total = parseFloat(d.total_amount?.replace(/[^0-9.]/g, '') || 0);

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
      <div class="doc-type" style="font-size:54px;letter-spacing:-2px">PROJECT<br>PROPOSAL</div>
      <div class="doc-meta">
        <div><span class="lbl">Date: </span><strong>${esc(d.proposal_date) || '—'}</strong></div>
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
        <strong>${esc(d.from_name) || '—'}</strong><br>
        ${d.from_address ? nl(esc(d.from_address)) + '<br>' : ''}
        ${d.from_email ? esc(d.from_email) : ''}
        ${d.from_phone ? '<br>' + esc(d.from_phone) : ''}
      </div>
    </div>
    <div class="party-col">
      <div class="party-lbl">Prepared For</div>
      <div class="party-body">
        <strong>${esc(d.client_name) || '—'}</strong><br>
        ${d.client_company ? esc(d.client_company) + '<br>' : ''}
        ${d.client_email ? esc(d.client_email) : ''}
      </div>
    </div>
  </div>

  <!-- ── PROJECT OVERVIEW ── -->
  ${d.project_overview ? `
  <div class="section">
    ${sectionHead('Project Overview')}
    <div class="section-body section-pad">
      <div style="font-size:15px;font-weight:700;color:#253570;margin-bottom:10px">${esc(d.proposal_title) || ''}</div>
      <div class="legal-body">${nl(esc(d.project_overview))}</div>
    </div>
  </div>` : `
  <div class="section">
    ${sectionHead('Project Overview')}
    <div class="section-body section-pad">
      <div style="font-size:15px;font-weight:700;color:#253570;margin-bottom:10px">${esc(d.proposal_title) || '[Project Title]'}</div>
      <div class="legal-body" style="color:#9CA3AF;font-style:italic">Project overview will appear here.</div>
    </div>
  </div>`}

  <!-- ── PROJECT DETAILS ── -->
  <div class="section">
    ${sectionHead('Project Details')}
    <div class="section-body">
      <div class="kv-row">
        <div class="kv-key">Project</div>
        <div class="kv-val"><strong>${esc(d.proposal_title) || '—'}</strong></div>
      </div>
      <div class="kv-row">
        <div class="kv-key">Client</div>
        <div class="kv-val">${esc(d.client_name) || '—'}${d.client_company ? ` — ${esc(d.client_company)}` : ''}</div>
      </div>
      ${d.timeline ? `<div class="kv-row">
        <div class="kv-key">Timeline</div>
        <div class="kv-val">${esc(d.timeline)}</div>
      </div>` : ''}
      <div class="kv-row">
        <div class="kv-key">Valid Until</div>
        <div class="kv-val">${esc(d.valid_until) || '—'}</div>
      </div>
    </div>
  </div>

  <!-- ── SCOPE OF WORK ── -->
  ${d.deliverables ? `
  <div class="section">
    ${sectionHead('Scope of Work & Deliverables')}
    <div class="section-body">
      ${d.deliverables.split('\n').filter(l => l.trim()).map(line => `
      <div class="item-list-row">
        <div class="item-icon">✓</div>
        <div>
          <div class="item-desc" style="color:#1A1A2E;font-size:13px">${esc(line.replace(/^[✓✗\-*•]\s*/, ''))}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  <!-- ── INVESTMENT ── -->
  <div class="invest">
    <div class="invest-lbl">Project Investment</div>
    <div class="invest-amt">${esc(d.total_amount) || '—'}</div>
    ${d.payment_terms ? `<div class="invest-sub">${esc(d.payment_terms.split('\n')[0])}</div>` : ''}
  </div>

  <!-- ── PAYMENT TERMS ── -->
  <div class="section">
    ${sectionHead('Payment Terms')}
    <div class="section-body">
      <div class="pay-split" style="border:none">
        <div class="pay-box">
          <div class="pay-pct">60%</div>
          <div class="pay-title">Upfront Deposit</div>
          <div class="pay-desc">Due before project commences</div>
        </div>
        <div class="pay-box">
          <div class="pay-pct org">40%</div>
          <div class="pay-title org">Upon Completion</div>
          <div class="pay-desc">Due prior to final delivery</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── NOTES ── -->
  ${d.notes ? `
  <div class="section">
    ${sectionHead('Additional Notes & Terms')}
    <div class="section-body section-pad">
      <div class="legal-body">${nl(esc(d.notes))}</div>
    </div>
  </div>` : ''}

  <!-- ── NEXT STEPS ── -->
  <div class="section">
    ${sectionHead('Next Steps')}
    <div class="section-body section-pad">
      <div class="legal-body">
        To accept this proposal, please sign below and return a copy to
        <strong style="color:#253570">${esc(d.from_email) || esc(d.from_name) || '[contact details]'}</strong>.
        This proposal is valid until <strong>${esc(d.valid_until) || '[Valid Until Date]'}</strong>.
      </div>
    </div>
  </div>

  <!-- ── CLOSING ── -->
  <div class="closing" style="margin-top:20px">
    <div class="closing-quote">Great work takes craft. We'll take good care of this one.</div>
    <div class="closing-email">${esc(d.from_email) || 'Benny@myedithive.com'}</div>
  </div>

  <!-- ── SIGNATURES ── -->
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col">
      <div class="sig-lbl">Prepared By</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.from_name) || '___________________'}</div>
        <div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
    <div class="sig-col">
      <div class="sig-lbl">Client Acceptance</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.client_name) || '___________________'}</div>
        <div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
  </div>

  ${docFooter(
    `${esc(d.from_name) || 'Edithive'} · ${esc(d.from_email) || ''}`,
    `1`
  )}
</div>
</body>
</html>`;
};
