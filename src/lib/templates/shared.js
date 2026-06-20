/* ─────────────────────────────────────────────
   EDITHIVE DOCS — Shared Design System
   Brand colours extracted from official reference documents
   ───────────────────────────────────────────── */

export const BRAND = {
  navy:    '#253570',
  orange:  '#F5921E',
  white:   '#FFFFFF',
  lightBg: '#F8F9FC',
  border:  '#E0E3EA',
  rowLine: '#F0F2F7',
  text:    '#1A1A2E',
  body:    '#374151',
  muted:   '#6B7280',
  faint:   '#9CA3AF',
};

/* Logo — served from Vite public folder (/edithive-logo.png)
   In the serverless function this is replaced with a data URL  */
export const LOGO_SRC = '/edithive-logo.png';

export const baseCSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: #fff; }
body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: #1A1A2E;
}
.page {
  max-width: 794px;
  margin: 0 auto;
  padding: 0 56px 80px;
  min-height: 1123px;
  background: #fff;
  position: relative;
}

/* ── Accent bar ── */
.accent-bar { height: 4px; background: #F5921E; width: 100%; display: block; }

/* ── Document header ── */
.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 0 24px;
}
.logo-block img { height: 46px; width: auto; display: block; }
.title-block { text-align: right; }
.doc-type {
  font-size: 62px;
  font-weight: 900;
  color: #253570;
  letter-spacing: -2.5px;
  line-height: 0.9;
  margin-bottom: 10px;
}
.doc-meta { font-size: 13px; line-height: 1.9; color: #1A1A2E; }
.doc-meta .lbl { color: #6B7280; }
.doc-meta strong { color: #1A1A2E; }

/* ── Dividers ── */
.divider {
  border: none;
  border-top: 2px solid #E0E3EA;
  margin: 0 0 26px;
}

/* ── Party columns (Prepared By / Bill To) ── */
.party-row { display: flex; gap: 64px; margin-bottom: 26px; }
.party-col { flex: 1; }
.party-lbl { font-size: 13px; font-weight: 700; color: #253570; margin-bottom: 6px; }
.party-body { font-size: 13px; color: #374151; line-height: 1.75; }

/* ── Section blocks (header + bordered body) ── */
.section { margin-bottom: 20px; }
.section-head {
  background: #253570;
  color: #fff;
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.section-body {
  border: 1px solid #E0E3EA;
  border-top: none;
}
.section-pad { padding: 18px 16px; font-size: 13px; color: #374151; line-height: 1.75; }

/* ── Three-column info strip (invoice) ── */
.info-strip { display: flex; gap: 0; margin-bottom: 24px; }
.info-col { flex: 1; }
.info-col + .info-col { padding-left: 32px; }
.info-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}
.info-name { font-size: 14px; font-weight: 700; color: #1A1A2E; margin-bottom: 2px; }
.info-line { font-size: 12.5px; color: #374151; line-height: 1.7; }
.info-meta-row { margin-bottom: 6px; }
.info-meta-lbl { font-size: 11px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 0.8px; }
.info-meta-val { font-size: 13px; color: #1A1A2E; margin-top: 1px; }
.info-meta-val strong { font-weight: 700; }

/* ── Standalone project bar ── */
.project-bar {
  background: #253570;
  color: #fff;
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

/* ── Key-value table rows (PROJECT DETAILS) ── */
.kv-row { display: flex; border-bottom: 1px solid #F0F2F7; }
.kv-row:last-child { border-bottom: none; }
.kv-key {
  flex: 0 0 200px;
  padding: 12px 16px;
  font-weight: 700;
  color: #253570;
  font-size: 13px;
  background: #F8F9FC;
  border-right: 1px solid #F0F2F7;
}
.kv-val { flex: 1; padding: 12px 16px; font-size: 13px; color: #374151; }

/* ── Check / cross list items ── */
.item-list-row {
  display: flex;
  gap: 14px;
  padding: 13px 16px;
  border-bottom: 1px solid #F0F2F7;
  align-items: flex-start;
}
.item-list-row:last-child { border-bottom: none; }
.item-icon {
  font-size: 14px;
  font-weight: 900;
  color: #F5921E;
  flex-shrink: 0;
  width: 18px;
  text-align: center;
  margin-top: 1px;
  line-height: 1.5;
}
.item-icon.x { color: #E84B4B; }
.item-title { font-size: 13px; font-weight: 700; color: #1A1A2E; margin-bottom: 3px; }
.item-desc { font-size: 12px; color: #6B7280; line-height: 1.6; }

/* ── Services / pricing table ── */
.inv-table { width: 100%; border-collapse: collapse; }
.inv-table thead th {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #253570;
  padding: 10px 14px;
  border-bottom: 2px solid #253570;
  text-align: left;
}
.inv-table thead th.r { text-align: right; }
.inv-table tbody tr { border-bottom: 1px solid #F0F2F7; }
.inv-table tbody tr:last-child { border-bottom: none; }
.inv-table tbody td { padding: 13px 14px; font-size: 13px; color: #374151; vertical-align: top; }
.td-n { color: #9CA3AF; width: 28px; }
.td-desc { font-weight: 500; color: #1A1A2E; }
.td-r { text-align: right; }

/* ── Totals rows ── */
.totals-wrap { margin-top: 0; }
.tot-row {
  display: flex;
  justify-content: space-between;
  padding: 9px 14px;
  border-bottom: 1px solid #F0F2F7;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A2E;
}
.tot-row:last-child { border-bottom: none; }
.tot-final {
  background: #253570;
  color: #fff;
  padding: 13px 14px;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}

/* ── Investment block ── */
.invest {
  background: #253570;
  color: #fff;
  text-align: center;
  padding: 32px 24px;
  margin-bottom: 20px;
}
.invest-lbl {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 10px;
}
.invest-amt {
  font-size: 46px;
  font-weight: 900;
  color: #F5921E;
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 6px;
}
.invest-sub { font-size: 13px; color: rgba(255,255,255,0.55); }

/* ── 60/40 Payment split boxes ── */
.pay-split { display: flex; border: 1px solid #E0E3EA; margin-bottom: 20px; }
.pay-box { flex: 1; text-align: center; padding: 28px 16px; }
.pay-box:first-child { border-right: 1px solid #E0E3EA; }
.pay-pct {
  font-size: 52px;
  font-weight: 900;
  color: #253570;
  line-height: 1;
  margin-bottom: 6px;
}
.pay-pct.org { color: #F5921E; }
.pay-title { font-size: 13px; font-weight: 700; color: #253570; margin-bottom: 4px; }
.pay-title.org { color: #F5921E; }
.pay-desc { font-size: 12px; color: #9CA3AF; }

/* ── Numbered list (terms & conditions) ── */
.num-list { list-style: none; }
.num-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #F0F2F7;
  font-size: 13px;
  color: #374151;
}
.num-item:last-child { border-bottom: none; }
.num-n { font-weight: 700; color: #F5921E; min-width: 18px; flex-shrink: 0; }

/* ── Bank detail rows ── */
.bank-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #F0F2F7;
}
.bank-row:last-child { border-bottom: none; }
.bank-lbl { font-size: 12px; color: #6B7280; min-width: 170px; }
.bank-val { font-size: 13px; font-weight: 600; color: #1A1A2E; flex: 1; border-bottom: 1px solid #9CA3AF; min-height: 16px; padding-bottom: 2px; }

/* ── Legal body (contracts) ── */
.legal-body { font-size: 13px; color: #374151; line-height: 1.85; margin-bottom: 20px; }
.legal-section { margin-bottom: 24px; }
.legal-head {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #253570;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #E0E3EA;
}

/* ── Signature row ── */
.sig-row { display: flex; gap: 48px; padding-top: 28px; border-top: 1px solid #E0E3EA; }
.sig-col { flex: 1; }
.sig-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #9CA3AF; margin-bottom: 36px; }
.sig-line { border-top: 1.5px solid #1A1A2E; padding-top: 8px; }
.sig-name { font-size: 12px; color: #6B7280; }
.sig-date { font-size: 11px; color: #9CA3AF; margin-top: 4px; }

/* ── Closing quote (quotation/proposal) ── */
.closing {
  text-align: center;
  padding: 24px 16px;
  border-top: 1px solid #E0E3EA;
  border-bottom: 1px solid #E0E3EA;
  margin-bottom: 0;
}
.closing-quote { font-style: italic; color: #374151; font-size: 14px; margin-bottom: 8px; }
.closing-email { font-weight: 700; color: #253570; font-size: 13px; }

/* ── Page footer ── */
.doc-footer {
  position: absolute;
  bottom: 28px;
  left: 56px;
  right: 56px;
  border-top: 1px solid #E0E3EA;
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.foot-l { font-size: 11px; color: #9CA3AF; }
.foot-r { font-size: 11px; color: #9CA3AF; }

@media print {
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page { padding: 0 48px 72px; }
}
`;

/* Shared HTML helpers */
export const accentBar = `<div class="accent-bar"></div>`;

export const logoBlock = (logoSrc = LOGO_SRC) =>
  `<div class="logo-block"><img src="${logoSrc}" alt="Edithive"></div>`;

export const docFooter = (left, right = '') =>
  `<div class="doc-footer"><span class="foot-l">${left}</span><span class="foot-r">${right}</span></div>`;

export const sectionHead = (title) =>
  `<div class="section-head">${title}</div>`;

export const nl = (s) => (s || '').replace(/\n/g, '<br>');
export const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
