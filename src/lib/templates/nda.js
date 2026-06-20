import { baseCSS, accentBar, logoBlock, docFooter, sectionHead, nl, esc, LOGO_SRC } from './shared.js';

export const ndaTemplate = (d, logoSrc = LOGO_SRC) => `<!DOCTYPE html>
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
      <div class="doc-type" style="font-size:44px;letter-spacing:-1.5px">NON-DISCLOSURE<br>AGREEMENT</div>
      <div class="doc-meta">
        <div><span class="lbl">Effective Date: </span><strong>${esc(d.effective_date) || '—'}</strong></div>
      </div>
    </div>
  </div>

  <hr class="divider">

  <!-- ── PARTIES ── -->
  <div class="party-row">
    <div class="party-col">
      <div class="party-lbl">${esc(d.party1_role) || 'Disclosing Party'}</div>
      <div class="party-body">
        <strong>${esc(d.party1_name) || '—'}</strong><br>
        ${d.party1_address ? nl(esc(d.party1_address)) : ''}
      </div>
    </div>
    <div class="party-col">
      <div class="party-lbl">${esc(d.party2_role) || 'Receiving Party'}</div>
      <div class="party-body">
        <strong>${esc(d.party2_name) || '—'}</strong><br>
        ${d.party2_address ? nl(esc(d.party2_address)) : ''}
      </div>
    </div>
  </div>

  <div class="legal-body" style="margin-bottom:20px">
    This Non-Disclosure Agreement (the <strong>"Agreement"</strong>) is entered into as of
    <strong>${esc(d.effective_date) || '[Date]'}</strong>, by and between the parties listed above.
    The parties agree to the following terms:
  </div>

  <!-- ── 1. PURPOSE ── -->
  <div class="section">
    ${sectionHead('1. Purpose')}
    <div class="section-body section-pad">
      <div class="legal-body">
        ${nl(esc(d.purpose)) || 'The parties intend to engage in discussions and evaluations for a potential business relationship or transaction.'}
      </div>
    </div>
  </div>

  <!-- ── 2. CONFIDENTIAL INFO ── -->
  <div class="section">
    ${sectionHead('2. Confidential Information')}
    <div class="section-body section-pad">
      <div class="legal-body" style="margin-bottom:12px">
        <strong>"Confidential Information"</strong> means any non-public information disclosed by either
        party, including but not limited to:
      </div>
      <div class="legal-body">
        ${nl(esc(d.confidential_description)) || 'Business plans, technical specifications, financial data, client lists, trade secrets, and any other proprietary or sensitive information.'}
      </div>
      <div class="legal-body" style="margin-top:12px">
        Confidential Information does not include information that: (a) is or becomes publicly known
        through no breach of this Agreement; (b) was rightfully known prior to receipt; or
        (c) is independently developed without use of Confidential Information.
      </div>
    </div>
  </div>

  <!-- ── 3. OBLIGATIONS ── -->
  <div class="section">
    ${sectionHead('3. Obligations of the Receiving Party')}
    <div class="section-body">
      <div class="item-list-row">
        <div class="item-icon">✓</div>
        <div>
          <div class="item-title">Hold in Strict Confidence</div>
          <div class="item-desc">Use no less than the same degree of care applied to its own confidential information, but no less than reasonable care.</div>
        </div>
      </div>
      <div class="item-list-row">
        <div class="item-icon">✓</div>
        <div>
          <div class="item-title">No Unauthorised Disclosure</div>
          <div class="item-desc">Not disclose Confidential Information to any third party without prior written consent of the Disclosing Party.</div>
        </div>
      </div>
      <div class="item-list-row">
        <div class="item-icon">✓</div>
        <div>
          <div class="item-title">Permitted Use Only</div>
          <div class="item-desc">Use Confidential Information solely for the Purpose described in this Agreement.</div>
        </div>
      </div>
      <div class="item-list-row">
        <div class="item-icon">✓</div>
        <div>
          <div class="item-title">Limit Internal Access</div>
          <div class="item-desc">Restrict access to individuals who have a need to know and are bound by equivalent confidentiality obligations.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── 4. TERM ── -->
  <div class="section">
    ${sectionHead('4. Duration')}
    <div class="section-body section-pad">
      <div class="legal-body">
        This Agreement shall remain in effect for a period of <strong>${esc(d.duration) || '[Duration]'}</strong>
        from the Effective Date, unless earlier terminated by mutual written consent.
        Confidentiality obligations shall survive the termination of this Agreement.
      </div>
    </div>
  </div>

  <!-- ── 5. GOVERNING LAW ── -->
  <div class="section">
    ${sectionHead('5. Governing Law & Remedies')}
    <div class="section-body section-pad">
      <div class="legal-body">
        This Agreement shall be governed by the laws of <strong>${esc(d.governing_state) || '[Jurisdiction]'}</strong>.
        The parties acknowledge that a breach may cause irreparable harm for which monetary damages may be inadequate.
        The Disclosing Party shall be entitled to seek equitable relief in addition to all other remedies available at law.
      </div>
    </div>
  </div>

  <!-- ── SIGNATURES ── -->
  <div class="sig-row" style="margin-top:28px">
    <div class="sig-col">
      <div class="sig-lbl">${esc(d.party1_role) || 'Disclosing Party'}</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.party1_name) || '___________________'}</div>
        <div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
    <div class="sig-col">
      <div class="sig-lbl">${esc(d.party2_role) || 'Receiving Party'}</div>
      <div class="sig-line">
        <div class="sig-name">${esc(d.party2_name) || '___________________'}</div>
        <div class="sig-date">Signature &nbsp;&nbsp; Date: ___________</div>
      </div>
    </div>
  </div>

  ${docFooter(
    `Non-Disclosure Agreement · Effective ${esc(d.effective_date) || ''}`,
    ``
  )}
</div>
</body>
</html>`;
