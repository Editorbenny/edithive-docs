export const baseStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #111827;
  background: #ffffff;
  font-size: 13.5px;
  line-height: 1.6;
}
.page {
  max-width: 794px;
  margin: 0 auto;
  padding: 56px 64px;
  min-height: 1123px;
  position: relative;
}

/* ── Document header ── */
.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
}
.doc-type {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: #111827;
  line-height: 1;
  margin-bottom: 10px;
}
.doc-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.brand-block { text-align: right; }
.brand-name {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.brand-name .brand-dot { color: #111827; }
.brand-sub {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* ── Parties ── */
.parties-row {
  display: flex;
  gap: 48px;
  margin-bottom: 40px;
}
.party { flex: 1; }
.party-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  margin-bottom: 8px;
}
.party-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}
.party-detail {
  font-size: 12.5px;
  color: #6b7280;
  line-height: 1.7;
}

/* ── Meta strip ── */
.meta-strip {
  display: flex;
  gap: 0;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 36px;
  flex-wrap: wrap;
  row-gap: 16px;
}
.meta-item { flex: 1; min-width: 120px; }
.meta-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  margin-bottom: 4px;
}
.meta-value {
  font-size: 13.5px;
  font-weight: 600;
  color: #111827;
}

/* ── Table ── */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}
thead th {
  padding: 10px 14px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  border-bottom: 2px solid #e5e7eb;
}
thead th:first-child { text-align: left; }
.text-right { text-align: right; }
tbody tr { border-bottom: 1px solid #f3f4f6; }
tbody tr:last-child { border-bottom: none; }
tbody td { padding: 13px 14px; color: #374151; vertical-align: top; }
.item-desc { font-weight: 500; color: #111827; }
.empty-row { text-align: center; color: #d1d5db; font-style: italic; padding: 24px; }

/* ── Totals ── */
.totals-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 36px;
}
.totals-box { width: 260px; }
.totals-row {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  font-size: 13px;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
}
.totals-row:last-child { border-bottom: none; }
.total-row {
  padding: 12px 0 4px;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  border-top: 2px solid #111827;
  border-bottom: none;
  margin-top: 4px;
}

/* ── Notes ── */
.notes-block {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 48px;
}
.notes-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  margin-bottom: 8px;
}
.notes-text { font-size: 13px; color: #4b5563; line-height: 1.7; }

/* ── Signature block ── */
.signature-section {
  display: flex;
  gap: 48px;
  margin-top: 48px;
  padding-top: 36px;
  border-top: 1px solid #e5e7eb;
}
.sig-block { flex: 1; }
.sig-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
  margin-bottom: 40px;
}
.sig-line {
  border-top: 1px solid #111827;
  padding-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

/* ── Legal body text ── */
.legal-body { color: #4b5563; line-height: 1.8; margin-bottom: 28px; }
.legal-section { margin-bottom: 28px; }
.legal-heading {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #111827;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
}
.highlight-box {
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 28px;
}

/* ── Footer ── */
.doc-footer {
  position: absolute;
  bottom: 40px;
  left: 64px;
  right: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
}
.footer-brand { font-size: 12px; font-weight: 800; }
.footer-meta { font-size: 10.5px; color: #9ca3af; }

@media print {
  .page { padding: 40px 48px; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

export const brandMark = `
<div class="brand-block">
  <div class="brand-name"><span style="color:#4f46e5">edit</span><span class="brand-dot">hive</span></div>
  <div class="brand-sub">Document Generation</div>
</div>`;

export const pageFooter = (date) => `
<div class="doc-footer">
  <div class="footer-brand"><span style="color:#4f46e5">edit</span>hive</div>
  <div class="footer-meta">Generated ${date || ''} · Edithive Docs</div>
</div>`;
