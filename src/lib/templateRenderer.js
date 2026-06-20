import { CURRENCY_SYMBOLS } from './documentConfig.js';
import { invoiceTemplate }          from './templates/invoice.js';
import { quotationTemplate }        from './templates/quotation.js';
import { clientContractTemplate }   from './templates/clientContract.js';
import { employeeContractTemplate } from './templates/employeeContract.js';
import { ndaTemplate }              from './templates/nda.js';
import { proposalTemplate }         from './templates/proposal.js';
import { esc }                      from './templates/shared.js';

const TEMPLATES = {
  invoice:             invoiceTemplate,
  quotation:           quotationTemplate,
  'client-contract':   clientContractTemplate,
  'employee-contract': employeeContractTemplate,
  nda:                 ndaTemplate,
  proposal:            proposalTemplate,
};

export function renderDocument(docType, formData = {}, items = []) {
  const templateFn = TEMPLATES[docType];
  if (!templateFn) return errorPage(`Unknown document type: "${docType}"`);

  try {
    const currency       = formData.currency || 'USD';
    const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

    const validItems = (items || []).filter(item => item.description?.trim());

    const subtotal      = validItems.reduce((s, i) => s + (parseFloat(i.quantity || 0) * parseFloat(i.unit_price || 0)), 0);
    const taxRate       = parseFloat(formData.tax_rate || 0);
    const discountRate  = parseFloat(formData.discount_rate || 0);
    const taxAmount     = subtotal * (taxRate / 100);
    const discountAmt   = subtotal * (discountRate / 100);
    const total         = subtotal - discountAmt + taxAmount;

    /* Invoice-style items rows (#, description, amount) */
    const items_rows = validItems.length
      ? validItems.map((item, idx) => {
          const amount = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
          return `<tr>
            <td class="td-n">${idx + 1}</td>
            <td class="td-desc">${esc(item.description)}</td>
            <td class="td-r">${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
          </tr>`;
        }).join('')
      : '';

    const enriched = {
      ...formData,
      currency_symbol:   currencySymbol,
      items_rows,
      subtotal:          subtotal.toFixed(2),
      tax_amount:        taxAmount.toFixed(2),
      discount_amount:   discountAmt.toFixed(2),
      total:             total.toFixed(2),
      tax_rate:          taxRate,
      discount_rate:     discountRate,
      generated_date:    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    /* Use absolute URL so the logo resolves correctly inside the blob URL iframe */
    const logoSrc = typeof window !== 'undefined'
      ? `${window.location.origin}/edithive-logo.png`
      : '/edithive-logo.png';
    return templateFn(enriched, logoSrc);
  } catch (err) {
    return errorPage(`Render error: ${err.message}`);
  }
}

function errorPage(msg) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;color:#e11d48">
    <h2>Preview Error</h2><p>${msg}</p>
  </body></html>`;
}
