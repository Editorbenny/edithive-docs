import { baseCSS, accentBar, logoBlock, docFooter, sectionHead, nl, esc, LOGO_SRC } from './shared.js';

export const clientContractTemplate = (d, logoSrc = LOGO_SRC) => `<!DOCTYPE html>
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
      <div class="doc-type" style="font-size:48px;letter-spacing:-1.5px">CLIENT SERVICE<br>AGREEMENT</div>
      <div class="doc-meta">
        <div><span class="lbl">Dated: </span><strong>${esc(d.contract_date) || '—'}</strong></div>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- ── PARTIES ── -->
  <div class="party-row">
    <div class="party-col">
      <div class="party-lbl">Service Provider</div>
      <div class="party-body">
        <strong>${esc(d.company_name) || '—'}</strong><br>
        ${d.company_address ? nl(esc(d.company_address)) + '<br>' : ''}
        ${d.company_email ? esc(d.company_email) : ''}
      </div>
    </div>
    <div class="party-col">
      <div class="party-lbl">Client</div>
      <div class="party-body">
        <strong>${esc(d.client_name) || '—'}</strong><br>
        ${d.client_address ? nl(esc(d.client_address)) + '<br>' : ''}
        ${d.client_email ? esc(d.client_email) : ''}
      </div>
    </div>
  </div>

  <div class="legal-body" style="margin-bottom:20px">
    This Client Service Agreement (the <strong>"Agreement"</strong>) is entered into as of
    <strong>${esc(d.contract_date) || '[Date]'}</strong>, by and between the parties listed above.
  </div>

  <!-- ── 1. SERVICES ── -->
  <div class="section">
    ${sectionHead('1. Scope of Services')}
    <div class="section-body section-pad">
      <div class="legal-body" style="margin-bottom:8px">
        The Service Provider agrees to perform the following services (the <strong>"Services"</strong>):
      </div>
      <div style="font-weight:700;font-size:14px;color:#253570;margin-bottom:8px">
        ${esc(d.service_title) || '[Service Title]'}
      </div>
      <div class="legal-body">${nl(esc(d.service_description)) || '[Describe services here]'}</div>
    </div>
  </div>

  <!-- ── 2. TERM ── -->
  <div class="section">
    ${sectionHead('2. Term')}
    <div class="section-body">
      <div class="kv-row">
        <div class="kv-key">Start Date</div>
        <div class="kv-val">${esc(d.start_date) || '—'}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">End Date</div>
        <div class="kv-val">${esc(d.end_date) || '—'}</div>
      </div>
    </div>
  </div>

  <!-- ── 3. COMPENSATION ── -->
  <div class="section">
    ${sectionHead('3. Compensation & Payment')}
    <div class="section-body section-pad">
      <div class="legal-body" style="margin-bottom:8px">
        In consideration for the Services, the Client agrees to pay the Service Provider
        <strong>${esc(d.contract_value) || '[Amount]'}</strong>.
      </div>
      ${d.payment_terms ? `<div class="legal-body"><strong>Payment Terms:</strong> ${nl(esc(d.payment_terms))}</div>` : ''}
    </div>
  </div>

  <!-- ── 4. CONFIDENTIALITY ── -->
  <div class="section">
    ${sectionHead('4. Confidentiality')}
    <div class="section-body section-pad">
      <div class="legal-body">
        Each party agrees to keep confidential all non-public information received from the other party
        in connection with this Agreement and to use such information solely for the purpose of fulfilling
        obligations under this Agreement. This obligation survives termination.
      </div>
    </div>
  </div>

  <!-- ── 5. IP ── -->
  <div class="section">
    ${sectionHead('5. Intellectual Property')}
    <div class="section-body section-pad">
      <div class="legal-body">
        Upon full payment, all deliverables created specifically for the Client under this Agreement shall
        become the property of the Client. The Service Provider retains ownership of all pre-existing
        tools, methodologies, and intellectual property used in delivering the Services.
      </div>
    </div>
  </div>

  <!-- ── 6. TERMINATION ── -->
  <div class="section">
    ${sectionHead('6. Termination')}
    <div class="section-body section-pad">
      <div class="legal-body">
        Either party may terminate this Agreement with 30 days written notice. In the event of
        termination, the Client shall pay for all Services rendered up to the date of termination.
      </div>
    </div>
  </div>

  <!-- ── 7. GOVERNING LAW ── -->
  <div class="section">
    ${sectionHead('7. Governing Law')}
    <div class="section-body section-pad">
      <div class="legal-body">
        This Agreement shall be governed by and construed in accordance with the laws of
        <strong>${esc(d.jurisdiction) || '[Jurisdiction]'}</strong>.
      </div>
    </div>
  </div>

  <!-- ── SIGNATURES ── -->
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col">
      <div class="sig-lbl">Service Provider</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.company_name) || '___________________'}</div>
        <div class="sig-date">Name &amp; Title &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
    <div class="sig-col">
      <div class="sig-lbl">Client</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.client_name) || '___________________'}</div>
        <div class="sig-date">Name &amp; Title &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
  </div>

  ${docFooter(
    `${esc(d.company_name) || 'Edithive'} · Client Service Agreement · ${esc(d.contract_date) || ''}`,
    ``
  )}
</div>
</body>
</html>`;
