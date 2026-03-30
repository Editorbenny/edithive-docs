import { baseStyles, brandMark, pageFooter } from './shared.js';

export const proposalTemplate = (d) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
${baseStyles}
.accent { color: #d97706; }
.badge { background: #fffbeb; color: #d97706; }
.cover-strip {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  color: white;
  border-radius: 12px;
  padding: 36px 40px;
  margin-bottom: 40px;
}
.cover-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #9ca3af; margin-bottom: 12px; }
.cover-title { font-size: 26px; font-weight: 800; color: white; letter-spacing: -0.5px; line-height: 1.3; margin-bottom: 20px; }
.cover-meta { display: flex; gap: 40px; flex-wrap: wrap; }
.cover-meta-item {}
.cover-meta-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
.cover-meta-value { font-size: 13px; font-weight: 600; color: #e5e7eb; }
.investment-box {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 10px;
  padding: 24px 28px;
  color: white;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.investment-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
.investment-amount { font-size: 28px; font-weight: 800; letter-spacing: -1px; }
.investment-terms { font-size: 12px; color: rgba(255,255,255,0.8); text-align: right; max-width: 200px; line-height: 1.6; }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:32px">PROJECT<br>PROPOSAL</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Valid Until: ${d.valid_until || '—'}</span>
    </div>
    ${brandMark}
  </div>

  <div class="cover-strip">
    <div class="cover-label">Proposal for</div>
    <div class="cover-title">${d.proposal_title || 'Project Title'}</div>
    <div class="cover-meta">
      <div class="cover-meta-item">
        <div class="cover-meta-label">Prepared For</div>
        <div class="cover-meta-value">${d.client_name || '—'}${d.client_company ? ` · ${d.client_company}` : ''}</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Prepared By</div>
        <div class="cover-meta-value">${d.from_name || '—'}</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Date</div>
        <div class="cover-meta-value">${d.proposal_date || '—'}</div>
      </div>
      ${d.timeline ? `<div class="cover-meta-item">
        <div class="cover-meta-label">Timeline</div>
        <div class="cover-meta-value">${d.timeline}</div>
      </div>` : ''}
    </div>
  </div>

  ${d.project_overview ? `
  <div class="legal-section">
    <div class="legal-heading">Executive Summary</div>
    <div class="legal-body">${d.project_overview.replace(/\n/g, '<br>')}</div>
  </div>` : ''}

  ${d.deliverables ? `
  <div class="legal-section">
    <div class="legal-heading">Scope of Work &amp; Deliverables</div>
    <div class="legal-body">${d.deliverables.replace(/\n/g, '<br>')}</div>
  </div>` : ''}

  <div class="investment-box">
    <div>
      <div class="investment-label">Total Investment</div>
      <div class="investment-amount">${d.total_amount || '—'}</div>
    </div>
    ${d.payment_terms ? `<div class="investment-terms">${d.payment_terms.replace(/\n/g, '<br>')}</div>` : ''}
  </div>

  ${d.notes ? `
  <div class="notes-block">
    <div class="notes-label">Additional Notes &amp; Terms</div>
    <div class="notes-text">${d.notes.replace(/\n/g, '<br>')}</div>
  </div>` : ''}

  <div class="legal-section" style="margin-top:36px">
    <div class="legal-heading">Next Steps</div>
    <div class="legal-body">
      To accept this proposal, please sign below and return a copy to <strong>${d.from_email || d.from_name || '[contact details]'}</strong>. This proposal is valid until <strong>${d.valid_until || '[Valid Until Date]'}</strong>.
    </div>
  </div>

  <div class="signature-section">
    <div class="sig-block">
      <div class="sig-label">Prepared By</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.from_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Client Acceptance</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.client_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
  </div>

  ${pageFooter(d.generated_date)}
</div>
</body>
</html>`;
