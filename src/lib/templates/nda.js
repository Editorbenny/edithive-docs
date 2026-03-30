import { baseStyles, brandMark, pageFooter } from './shared.js';

export const ndaTemplate = (d) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
${baseStyles}
.accent { color: #e11d48; }
.badge { background: #fff1f2; color: #e11d48; }
</style>
</head>
<body>
<div class="page">

  <div class="doc-header">
    <div>
      <div class="doc-type" style="font-size:30px">NON-DISCLOSURE<br>AGREEMENT</div>
      <span class="doc-badge badge" style="margin-top:10px;display:inline-block">Effective: ${d.effective_date || '—'}</span>
    </div>
    ${brandMark}
  </div>

  <div class="legal-body" style="margin-bottom:32px">
    This Non-Disclosure Agreement (the <strong>"Agreement"</strong>) is entered into as of <strong>${d.effective_date || '[Effective Date]'}</strong>, by and between the following parties:
  </div>

  <div class="highlight-box">
    <div style="display:flex;gap:48px">
      <div style="flex:1">
        <div class="party-label">${d.party1_role || 'Disclosing Party'}</div>
        <div class="party-name">${d.party1_name || '—'}</div>
        <div class="party-detail">${(d.party1_address || '').replace(/\n/g, '<br>')}</div>
      </div>
      <div style="flex:1">
        <div class="party-label">${d.party2_role || 'Receiving Party'}</div>
        <div class="party-name">${d.party2_name || '—'}</div>
        <div class="party-detail">${(d.party2_address || '').replace(/\n/g, '<br>')}</div>
      </div>
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">1. Purpose</div>
    <div class="legal-body">
      The parties intend to engage in discussions and evaluations for the following purpose:
      <br><br>
      ${(d.purpose || '[Purpose of disclosure]').replace(/\n/g, '<br>')}
      <br><br>
      In connection with this purpose, each party may disclose certain Confidential Information to the other party.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">2. Definition of Confidential Information</div>
    <div class="legal-body">
      <strong>"Confidential Information"</strong> means any non-public information disclosed by one party to the other, either directly or indirectly, in writing, orally, or by inspection of tangible objects, including but not limited to:
      <br><br>
      ${(d.confidential_description || 'Business plans, technical specifications, financial data, client lists, trade secrets, and any other proprietary information').replace(/\n/g, '<br>')}
      <br><br>
      Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was rightfully known before receipt from the disclosing party; or (c) is independently developed without use of Confidential Information.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">3. Obligations of the Receiving Party</div>
    <div class="legal-body">
      The Receiving Party agrees to:
      <br><br>
      (a) Hold all Confidential Information in strict confidence using at least the same degree of care used to protect its own confidential information, but no less than reasonable care;<br><br>
      (b) Not disclose Confidential Information to any third party without prior written consent of the Disclosing Party;<br><br>
      (c) Use Confidential Information solely for the Purpose described in this Agreement;<br><br>
      (d) Limit access to Confidential Information to employees, agents, or contractors who have a need to know and are bound by confidentiality obligations no less restrictive than this Agreement.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">4. Term</div>
    <div class="legal-body">
      This Agreement shall remain in effect for a period of <strong>${d.duration || '[Duration]'}</strong> from the Effective Date, unless earlier terminated by mutual written agreement. The confidentiality obligations shall survive termination of this Agreement.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">5. Remedies</div>
    <div class="legal-body">
      The parties acknowledge that a breach of this Agreement may cause irreparable harm for which monetary damages may be inadequate. Accordingly, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law.
    </div>
  </div>

  <div class="legal-section">
    <div class="legal-heading">6. Governing Law</div>
    <div class="legal-body">
      This Agreement shall be governed by and construed in accordance with the laws of <strong>${d.governing_state || '[Jurisdiction]'}</strong>, without regard to its conflict of law provisions.
    </div>
  </div>

  <div class="signature-section">
    <div class="sig-block">
      <div class="sig-label">${d.party1_role || 'Disclosing Party'}</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.party1_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
    <div class="sig-block">
      <div class="sig-label">${d.party2_role || 'Receiving Party'}</div>
      <div style="margin-bottom:32px;height:48px"></div>
      <div class="sig-line">${d.party2_name || '___________________'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:4px">Signature &nbsp;&nbsp;&nbsp; Date: ___________</div>
    </div>
  </div>

  ${pageFooter(d.generated_date)}
</div>
</body>
</html>`;
