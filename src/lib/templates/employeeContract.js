import { baseStyles, brandMark, pageFooter } from './shared.js';

export const employeeContractTemplate = (d) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
${baseStyles}
.accent { color: #059669; }
.badge { background: #ecfdf5; color: #059669; }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:30px">EMPLOYMENT<br>AGREEMENT</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Effective: ${d.start_date || '—'}</span>
    </div>
    ${brandMark}
  </div>

  <div class="legal-body" style="margin-bottom:32px">
    This Employment Agreement (the <strong>"Agreement"</strong>) is entered into as of <strong>${d.contract_date || '[Date]'}</strong>, between:
  </div>

  <div class="highlight-box">
    <div style="display:flex;gap:48px">
      <div style="flex:1">
        <div class="party-label">Employer</div>
        <div class="party-name">${d.company_name || '—'}</div>
        <div class="party-detail">${(d.company_address || '').replace(/\n/g, '<br>')}</div>
      </div>
      <div style="flex:1">
        <div class="party-label">Employee</div>
        <div class="party-name">${d.employee_name || '—'}</div>
        <div class="party-detail">${(d.employee_address || '').replace(/\n/g, '<br>')}</div>
        ${d.employee_email ? `<div class="party-detail">${d.employee_email}</div>` : ''}
      </div>
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">1. Position &amp; Duties</div>
    <div class="legal-body">
      The Employee is hired for the position of <strong>${d.position || '[Job Title]'}</strong>${d.department ? ` within the <strong>${d.department}</strong> department` : ''}.
      The Employee shall perform all duties consistent with this position and any other duties reasonably assigned by the Employer.
      <br><br>
      <strong>Work Location:</strong> ${d.work_location || 'As directed by the Employer'}
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">2. Commencement &amp; Probation</div>
    <div class="legal-body">
      Employment shall commence on <strong>${d.start_date || '[Start Date]'}</strong>.
      ${d.probation_period ? `The Employee will serve a probationary period of <strong>${d.probation_period}</strong> from the commencement date, during which employment may be terminated by either party with one week's notice.` : ''}
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">3. Compensation &amp; Benefits</div>
    <div class="legal-body">
      <strong>Salary:</strong> ${d.salary || '[Salary]'}, paid <strong>${d.payment_frequency || 'Monthly'}</strong>.
      <br><br>
      The Employer may provide additional benefits as communicated separately. The Employer reserves the right to review and adjust compensation annually based on performance and business conditions.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">4. Working Hours</div>
    <div class="legal-body">
      Normal working hours are <strong>${d.working_hours || '40 hours per week'}</strong>. The Employee may be required to work additional hours as business needs demand, subject to applicable employment law.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">5. Confidentiality &amp; Non-Disclosure</div>
    <div class="legal-body">
      During and after employment, the Employee shall keep confidential all proprietary information, trade secrets, and business data belonging to the Employer. This obligation survives termination of employment.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">6. Termination</div>
    <div class="legal-body">
      Either party may terminate this Agreement by providing 30 days written notice (or payment in lieu). The Employer may terminate immediately for cause including misconduct, breach of this Agreement, or failure to perform duties.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">7. Governing Law</div>
    <div class="legal-body">
      This Agreement is governed by applicable employment laws and regulations in the jurisdiction where work is performed.
    </div>
  </div>

  <div class="signature-section">
    <div class="sig-block">
      <div class="sig-label">Employer</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.company_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Authorised Signatory &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">Employee</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.employee_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Employee Signature &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
  </div>

  ${pageFooter(d.generated_date)}
</div>
</body>
</html>`;
