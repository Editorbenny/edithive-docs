import { baseCSS, accentBar, logoBlock, docFooter, sectionHead, nl, esc, LOGO_SRC } from './shared.js';

export const employeeContractTemplate = (d, logoSrc = LOGO_SRC) => `<!DOCTYPE html>
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
      <div class="doc-type" style="font-size:48px;letter-spacing:-1.5px">EMPLOYMENT<br>AGREEMENT</div>
      <div class="doc-meta">
        <div><span class="lbl">Effective: </span><strong>${esc(d.start_date) || '—'}</strong></div>
        <div><span class="lbl">Dated: </span><strong>${esc(d.contract_date) || '—'}</strong></div>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- ── PARTIES ── -->
  <div class="party-row">
    <div class="party-col">
      <div class="party-lbl">Employer</div>
      <div class="party-body">
        <strong>${esc(d.company_name) || '—'}</strong><br>
        ${d.company_address ? nl(esc(d.company_address)) : ''}
      </div>
    </div>
    <div class="party-col">
      <div class="party-lbl">Employee</div>
      <div class="party-body">
        <strong>${esc(d.employee_name) || '—'}</strong><br>
        ${d.employee_address ? nl(esc(d.employee_address)) + '<br>' : ''}
        ${d.employee_email ? esc(d.employee_email) : ''}
      </div>
    </div>
  </div>

  <div class="legal-body" style="margin-bottom:20px">
    This Employment Agreement (the <strong>"Agreement"</strong>) is entered into as of
    <strong>${esc(d.contract_date) || '[Date]'}</strong>, between the parties listed above.
  </div>

  <!-- ── 1. POSITION ── -->
  <div class="section">
    ${sectionHead('1. Position & Duties')}
    <div class="section-body">
      <div class="kv-row">
        <div class="kv-key">Job Title</div>
        <div class="kv-val"><strong>${esc(d.position) || '—'}</strong></div>
      </div>
      ${d.department ? `<div class="kv-row">
        <div class="kv-key">Department</div>
        <div class="kv-val">${esc(d.department)}</div>
      </div>` : ''}
      <div class="kv-row">
        <div class="kv-key">Work Location</div>
        <div class="kv-val">${esc(d.work_location) || 'As directed by Employer'}</div>
      </div>
    </div>
  </div>

  <!-- ── 2. COMMENCEMENT ── -->
  <div class="section">
    ${sectionHead('2. Commencement & Probation')}
    <div class="section-body">
      <div class="kv-row">
        <div class="kv-key">Start Date</div>
        <div class="kv-val"><strong>${esc(d.start_date) || '—'}</strong></div>
      </div>
      ${d.probation_period ? `<div class="kv-row">
        <div class="kv-key">Probation Period</div>
        <div class="kv-val">${esc(d.probation_period)}</div>
      </div>` : ''}
    </div>
  </div>

  <!-- ── 3. COMPENSATION ── -->
  <div class="section">
    ${sectionHead('3. Compensation & Benefits')}
    <div class="section-body">
      <div class="kv-row">
        <div class="kv-key">Salary</div>
        <div class="kv-val"><strong>${esc(d.salary) || '—'}</strong></div>
      </div>
      <div class="kv-row">
        <div class="kv-key">Payment Frequency</div>
        <div class="kv-val">${esc(d.payment_frequency) || 'Monthly'}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">Working Hours</div>
        <div class="kv-val">${esc(d.working_hours) || '40 hours per week'}</div>
      </div>
    </div>
  </div>

  <!-- ── 4. CONFIDENTIALITY ── -->
  <div class="section">
    ${sectionHead('4. Confidentiality & Non-Disclosure')}
    <div class="section-body section-pad">
      <div class="legal-body">
        During and after the term of employment, the Employee shall keep confidential all proprietary
        information, trade secrets, client data, and business processes belonging to the Employer.
        This obligation survives termination of this Agreement indefinitely.
      </div>
    </div>
  </div>

  <!-- ── 5. TERMINATION ── -->
  <div class="section">
    ${sectionHead('5. Termination')}
    <div class="section-body section-pad">
      <div class="legal-body">
        Either party may terminate this Agreement by providing <strong>30 days</strong> written notice
        (or payment in lieu thereof). The Employer may terminate immediately for cause, including but
        not limited to: gross misconduct, material breach of this Agreement, or wilful failure to
        perform duties.
      </div>
    </div>
  </div>

  <!-- ── 6. GOVERNING LAW ── -->
  <div class="section">
    ${sectionHead('6. Governing Law')}
    <div class="section-body section-pad">
      <div class="legal-body">
        This Agreement is governed by applicable employment laws and regulations in the jurisdiction
        where work is performed. Any disputes shall be resolved through the relevant employment tribunal
        or court of competent jurisdiction.
      </div>
    </div>
  </div>

  <!-- ── SIGNATURES ── -->
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col">
      <div class="sig-lbl">Employer</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.company_name) || '___________________'}</div>
        <div class="sig-date">Authorised Signatory &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
    <div class="sig-col">
      <div class="sig-lbl">Employee</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.employee_name) || '___________________'}</div>
        <div class="sig-date">Employee Signature &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
  </div>

  ${docFooter(
    `${esc(d.company_name) || 'Edithive'} · Employment Agreement · ${esc(d.employee_name) || ''}`,
    ``
  )}
</div>
</body>
</html>`;
