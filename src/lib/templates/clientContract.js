import { baseStyles, brandMark, pageFooter } from './shared.js';

export const clientContractTemplate = (d) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
${baseStyles}
.accent { color: #0284c7; }
.badge { background: #f0f9ff; color: #0284c7; }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:30px">CLIENT SERVICE<br>AGREEMENT</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Dated: ${d.contract_date || '—'}</span>
    </div>
    ${brandMark}
  </div>

  <div class="legal-body" style="margin-bottom:32px">
    This Client Service Agreement (the <strong>"Agreement"</strong>) is entered into as of <strong>${d.contract_date || '[Date]'}</strong>, by and between:
  </div>

  <div class="highlight-box" style="margin-bottom:28px">
    <div style="display:flex;gap:48px">
      <div style="flex:1">
        <div class="party-label">Service Provider</div>
        <div class="party-name">${d.company_name || '—'}</div>
        <div class="party-detail">${(d.company_address || '').replace(/\n/g, '<br>')}</div>
        ${d.company_email ? `<div class="party-detail">${d.company_email}</div>` : ''}
      </div>
      <div style="flex:1">
        <div class="party-label">Client</div>
        <div class="party-name">${d.client_name || '—'}</div>
        <div class="party-detail">${(d.client_address || '').replace(/\n/g, '<br>')}</div>
        ${d.client_email ? `<div class="party-detail">${d.client_email}</div>` : ''}
      </div>
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">1. Services</div>
    <div class="legal-body">
      The Service Provider agrees to perform the following services (the <strong>"Services"</strong>):
      <br><br>
      <strong>${d.service_title || '[Service Title]'}</strong>
      <br><br>
      ${(d.service_description || '[Service description to be detailed here]').replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">2. Term</div>
    <div class="legal-body">
      This Agreement shall commence on <strong>${d.start_date || '[Start Date]'}</strong> and continue until <strong>${d.end_date || '[End Date]'}</strong>, unless earlier terminated in accordance with this Agreement.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">3. Compensation</div>
    <div class="legal-body">
      In consideration for the Services, the Client agrees to pay the Service Provider <strong>${d.contract_value || '[Amount]'}</strong>.
      <br><br>
      <strong>Payment Terms:</strong> ${(d.payment_terms || '[Payment terms to be specified]').replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">4. Confidentiality</div>
    <div class="legal-body">
      Each party agrees to keep confidential all non-public information received from the other party in connection with this Agreement and to use such information solely for the purpose of fulfilling obligations under this Agreement.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">5. Intellectual Property</div>
    <div class="legal-body">
      Upon full payment of all fees, all work product and deliverables created specifically for the Client under this Agreement shall become the property of the Client. The Service Provider retains ownership of all pre-existing tools, methodologies, and intellectual property.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">6. Termination</div>
    <div class="legal-body">
      Either party may terminate this Agreement with 30 days written notice. In the event of termination, the Client shall pay for all Services rendered up to the date of termination.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">7. Governing Law</div>
    <div class="legal-body">
      This Agreement shall be governed by and construed in accordance with the laws of <strong>${d.jurisdiction || '[Jurisdiction]'}</strong>.
    </div>
  </div>

  <div class="signature-section">
    <div class="sig-block">
      <div class="sig-label">Service Provider</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.company_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Name &amp; Title &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Client</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.client_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Name &amp; Title &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
  </div>

  ${pageFooter(d.generated_date)}
</div>
</body>
</html>`;
