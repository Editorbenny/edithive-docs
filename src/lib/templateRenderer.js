import { CURRENCY_SYMBOLS } from './documentConfig.js';
import { invoiceTemplate } from './templates/invoice.js';
import { quotationTemplate } from './templates/quotation.js';
import { clientContractTemplate } from './templates/clientContract.js';
import { employeeContractTemplate } from './templates/employeeContract.js';
import { ndaTemplate } from './templates/nda.js';
import { proposalTemplate } from './templates/proposal.js';

const TEMPLATES = {
  invoice: invoiceTemplate,
  quotation: quotationTemplate,
  'client-contract': clientContractTemplate,
  'employee-contract': employeeContractTemplate,
  nda: ndaTemplate,
  proposal: proposalTemplate,
};

export function renderDocument(docType, formData, items = []) {
  const templateFn = TEMPLATES[docType];
  if (!templateFn) return '<p>Template not found.</p>';

  const currencySymbol = CURRENCY_SYMBOLS[formData.currency] || '$';

  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
  }, 0);

  const taxRate = parseFloat(formData.tax_rate || 0);
  const discountRate = parseFloat(formData.discount_rate || 0);
  const taxAmount = subtotal * (taxRate / 100);
  const discountAmount = subtotal * (discountRate / 100);
  const total = subtotal - discountAmount + taxAmount;

  const itemsRows = items
    .filter(item => item.description)
    .map(item => {
      const amount = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
      return `<tr>
        <td class="item-desc">${escHtml(item.description)}</td>
        <td class="text-right">${escHtml(String(item.quantity || ''))}</td>
        <td class="text-right">${currencySymbol}${parseFloat(item.unit_price || 0).toFixed(2)}</td>
        <td class="text-right">${currencySymbol}${amount.toFixed(2)}</td>
      </tr>`;
    })
    .join('');

  const data = {
    ...formData,
    currency_symbol: currencySymbol,
    items_rows: itemsRows || '<tr><td colspan="4" class="empty-row">No items added</td></tr>',
    subtotal: subtotal.toFixed(2),
    tax_amount: taxAmount.toFixed(2),
    discount_amount: discountAmount.toFixed(2),
    total: total.toFixed(2),
    tax_rate: taxRate,
    discount_rate: discountRate,
    generated_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };

  return templateFn(data);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
