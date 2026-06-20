export const DOCUMENT_TYPES = [
  {
    id: 'invoice',
    label: 'Invoice',
    description: 'Bill clients for services or products delivered',
    icon: 'FileText',
    color: 'indigo',
    hasItems: true,
    sections: [
      {
        title: 'Your Details',
        fields: [
          { id: 'from_name', label: 'Company / Your Name', type: 'text', required: true, placeholder: 'Edithive Ltd.' },
          { id: 'from_address', label: 'Address', type: 'textarea', placeholder: '123 Main St, City, Country', rows: 2 },
          { id: 'from_email', label: 'Email', type: 'email', placeholder: 'hello@yourcompany.com' },
          { id: 'from_phone', label: 'Phone', type: 'text', placeholder: '+1 234 567 8900' },
        ],
      },
      {
        title: 'Bill To',
        fields: [
          { id: 'client_name', label: 'Client Name', type: 'text', required: true, placeholder: 'Client Company Inc.' },
          { id: 'client_address', label: 'Client Address', type: 'textarea', placeholder: '456 Client Ave, City', rows: 2 },
          { id: 'client_email', label: 'Client Email', type: 'email', placeholder: 'client@company.com' },
        ],
      },
      {
        title: 'Invoice Details',
        fields: [
          { id: 'invoice_number', label: 'Invoice Number', type: 'text', required: true, placeholder: 'INV-001' },
          { id: 'invoice_date', label: 'Invoice Date', type: 'date', required: true },
          { id: 'due_date', label: 'Due Date', type: 'date' },
          { id: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'CAD', 'AUD'], defaultValue: 'USD' },
        ],
      },
      {
        title: 'Additional',
        fields: [
          { id: 'tax_rate', label: 'Tax Rate (%)', type: 'number', placeholder: '0', defaultValue: '0' },
          { id: 'notes', label: 'Payment Terms (one per line)', type: 'textarea', placeholder: '60% upfront payment is required before work commences.\nRemaining 40% is payable upon project completion.', rows: 3 },
        ],
      },
      {
        title: 'Payment Details',
        fields: [
          { id: 'bank_name', label: 'Bank Name', type: 'text', placeholder: 'First Bank' },
          { id: 'bank_account_name', label: 'Account Name', type: 'text', placeholder: 'Edithive Ltd.' },
          { id: 'bank_account_number', label: 'Account Number', type: 'text', placeholder: '0123456789' },
          { id: 'bank_sort_code', label: 'Bank Branch / Sort Code', type: 'text', placeholder: '01-23-45' },
        ],
      },
    ],
  },
  {
    id: 'quotation',
    label: 'Quotation',
    description: 'Provide a formal price estimate for prospective clients',
    icon: 'ClipboardList',
    color: 'violet',
    hasItems: true,
    sections: [
      {
        title: 'Your Details',
        fields: [
          { id: 'from_name', label: 'Company / Your Name', type: 'text', required: true, placeholder: 'Edithive Ltd.' },
          { id: 'from_address', label: 'Address', type: 'textarea', placeholder: '123 Main St, City, Country', rows: 2 },
          { id: 'from_email', label: 'Email', type: 'email', placeholder: 'hello@yourcompany.com' },
          { id: 'from_phone', label: 'Phone', type: 'text', placeholder: '+1 234 567 8900' },
        ],
      },
      {
        title: 'Quote For',
        fields: [
          { id: 'client_name', label: 'Client Name', type: 'text', required: true, placeholder: 'Client Company Inc.' },
          { id: 'client_address', label: 'Client Address', type: 'textarea', placeholder: '456 Client Ave, City', rows: 2 },
          { id: 'client_email', label: 'Client Email', type: 'email', placeholder: 'client@company.com' },
        ],
      },
      {
        title: 'Quote Details',
        fields: [
          { id: 'quote_number', label: 'Quote Number', type: 'text', required: true, placeholder: 'QT-001' },
          { id: 'quote_date', label: 'Quote Date', type: 'date', required: true },
          { id: 'valid_until', label: 'Valid Until', type: 'date' },
          { id: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'CAD', 'AUD'], defaultValue: 'USD' },
        ],
      },
      {
        title: 'Additional',
        fields: [
          { id: 'discount_rate', label: 'Discount (%)', type: 'number', placeholder: '0', defaultValue: '0' },
          { id: 'notes', label: 'Terms & Conditions', type: 'textarea', placeholder: 'Validity, delivery terms, conditions...', rows: 3 },
        ],
      },
    ],
  },
  {
    id: 'client-contract',
    label: 'Client Contract',
    description: 'Formal agreement for services rendered to a client',
    icon: 'Briefcase',
    color: 'sky',
    hasItems: false,
    sections: [
      {
        title: 'Service Provider',
        fields: [
          { id: 'company_name', label: 'Company Name', type: 'text', required: true, placeholder: 'Edithive Ltd.' },
          { id: 'company_address', label: 'Company Address', type: 'textarea', placeholder: '123 Main St, City, Country', rows: 2 },
          { id: 'company_email', label: 'Company Email', type: 'email', placeholder: 'legal@yourcompany.com' },
        ],
      },
      {
        title: 'Client',
        fields: [
          { id: 'client_name', label: 'Client Name', type: 'text', required: true, placeholder: 'Client Company Inc.' },
          { id: 'client_address', label: 'Client Address', type: 'textarea', placeholder: '456 Client Ave, City', rows: 2 },
          { id: 'client_email', label: 'Client Email', type: 'email', placeholder: 'client@company.com' },
        ],
      },
      {
        title: 'Contract Details',
        fields: [
          { id: 'contract_date', label: 'Contract Date', type: 'date', required: true },
          { id: 'start_date', label: 'Start Date', type: 'date' },
          { id: 'end_date', label: 'End Date', type: 'date' },
          { id: 'service_title', label: 'Service Title', type: 'text', required: true, placeholder: 'Web Development Services' },
          { id: 'service_description', label: 'Scope of Services', type: 'textarea', placeholder: 'Describe the services to be provided...', rows: 4 },
          { id: 'contract_value', label: 'Contract Value', type: 'text', placeholder: '$5,000' },
          { id: 'payment_terms', label: 'Payment Terms', type: 'textarea', placeholder: '50% upfront, 50% on completion...', rows: 2 },
          { id: 'jurisdiction', label: 'Governing Law / Jurisdiction', type: 'text', placeholder: 'State of California, USA' },
        ],
      },
    ],
  },
  {
    id: 'employee-contract',
    label: 'Employee Contract',
    description: 'Employment agreement outlining terms and conditions',
    icon: 'Users',
    color: 'emerald',
    hasItems: false,
    sections: [
      {
        title: 'Employer',
        fields: [
          { id: 'company_name', label: 'Company Name', type: 'text', required: true, placeholder: 'Edithive Ltd.' },
          { id: 'company_address', label: 'Company Address', type: 'textarea', placeholder: '123 Main St, City, Country', rows: 2 },
        ],
      },
      {
        title: 'Employee',
        fields: [
          { id: 'employee_name', label: 'Employee Full Name', type: 'text', required: true, placeholder: 'Jane Smith' },
          { id: 'employee_address', label: 'Employee Address', type: 'textarea', placeholder: '789 Residential Rd, City', rows: 2 },
          { id: 'employee_email', label: 'Employee Email', type: 'email', placeholder: 'jane@email.com' },
        ],
      },
      {
        title: 'Employment Terms',
        fields: [
          { id: 'contract_date', label: 'Contract Date', type: 'date', required: true },
          { id: 'start_date', label: 'Start Date', type: 'date', required: true },
          { id: 'position', label: 'Job Title / Position', type: 'text', required: true, placeholder: 'Senior Developer' },
          { id: 'department', label: 'Department', type: 'text', placeholder: 'Engineering' },
          { id: 'work_location', label: 'Work Location', type: 'text', placeholder: 'Remote / New York Office' },
          { id: 'working_hours', label: 'Working Hours', type: 'text', placeholder: '40 hours/week, Mon–Fri' },
          { id: 'salary', label: 'Annual Salary / Compensation', type: 'text', required: true, placeholder: '$75,000 per year' },
          { id: 'payment_frequency', label: 'Payment Frequency', type: 'select', options: ['Monthly', 'Bi-weekly', 'Weekly', 'Semi-monthly'], defaultValue: 'Monthly' },
          { id: 'probation_period', label: 'Probation Period', type: 'text', placeholder: '3 months' },
        ],
      },
    ],
  },
  {
    id: 'nda',
    label: 'NDA',
    description: 'Non-disclosure agreement to protect confidential information',
    icon: 'Lock',
    color: 'rose',
    hasItems: false,
    sections: [
      {
        title: 'Disclosing Party',
        fields: [
          { id: 'party1_name', label: 'Full Name / Company', type: 'text', required: true, placeholder: 'Edithive Ltd.' },
          { id: 'party1_role', label: 'Role', type: 'text', placeholder: 'Disclosing Party' },
          { id: 'party1_address', label: 'Address', type: 'textarea', placeholder: '123 Main St, City, Country', rows: 2 },
        ],
      },
      {
        title: 'Receiving Party',
        fields: [
          { id: 'party2_name', label: 'Full Name / Company', type: 'text', required: true, placeholder: 'Recipient Corp.' },
          { id: 'party2_role', label: 'Role', type: 'text', placeholder: 'Receiving Party' },
          { id: 'party2_address', label: 'Address', type: 'textarea', placeholder: '456 Recipient Ave, City', rows: 2 },
        ],
      },
      {
        title: 'NDA Terms',
        fields: [
          { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
          { id: 'duration', label: 'Duration', type: 'text', placeholder: '2 years', required: true },
          { id: 'governing_state', label: 'Governing Law / State', type: 'text', placeholder: 'State of New York, USA' },
          { id: 'confidential_description', label: 'Description of Confidential Information', type: 'textarea', placeholder: 'Business plans, technical specifications, financial data, client lists...', rows: 4 },
          { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'Evaluation of a potential business partnership...', rows: 3 },
        ],
      },
    ],
  },
  {
    id: 'proposal',
    label: 'Proposal',
    description: 'Business proposal to pitch services or projects to clients',
    icon: 'Lightbulb',
    color: 'amber',
    hasItems: false,
    sections: [
      {
        title: 'Prepared By',
        fields: [
          { id: 'from_name', label: 'Company / Your Name', type: 'text', required: true, placeholder: 'Edithive Ltd.' },
          { id: 'from_address', label: 'Address', type: 'textarea', placeholder: '123 Main St, City, Country', rows: 2 },
          { id: 'from_email', label: 'Email', type: 'email', placeholder: 'hello@yourcompany.com' },
          { id: 'from_phone', label: 'Phone', type: 'text', placeholder: '+1 234 567 8900' },
        ],
      },
      {
        title: 'Prepared For',
        fields: [
          { id: 'client_name', label: 'Contact Name', type: 'text', required: true, placeholder: 'John Doe' },
          { id: 'client_company', label: 'Client Company', type: 'text', placeholder: 'Client Corp.' },
          { id: 'client_email', label: 'Client Email', type: 'email', placeholder: 'john@clientcorp.com' },
        ],
      },
      {
        title: 'Proposal Details',
        fields: [
          { id: 'proposal_title', label: 'Project / Proposal Title', type: 'text', required: true, placeholder: 'E-Commerce Platform Development' },
          { id: 'proposal_date', label: 'Proposal Date', type: 'date', required: true },
          { id: 'valid_until', label: 'Valid Until', type: 'date' },
          { id: 'project_overview', label: 'Project Overview / Executive Summary', type: 'textarea', placeholder: 'Brief overview of the project and our approach...', rows: 4 },
          { id: 'deliverables', label: 'Deliverables', type: 'textarea', placeholder: '1. Custom website design\n2. Backend API development\n3. Testing & deployment', rows: 4 },
          { id: 'timeline', label: 'Project Timeline', type: 'text', placeholder: '8 weeks (start to launch)' },
          { id: 'total_amount', label: 'Total Investment', type: 'text', required: true, placeholder: '$12,500' },
          { id: 'currency', label: 'Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'CAD', 'AUD'], defaultValue: 'USD' },
          { id: 'payment_terms', label: 'Payment Terms', type: 'textarea', placeholder: '50% on signing, 50% on delivery', rows: 2 },
          { id: 'notes', label: 'Additional Notes', type: 'textarea', placeholder: 'Any special terms, inclusions, or exclusions...', rows: 3 },
        ],
      },
    ],
  },
];

export const CURRENCY_SYMBOLS = {
  USD: '$', EUR: '€', GBP: '£', KES: 'KSh ', NGN: '₦', ZAR: 'R', CAD: 'C$', AUD: 'A$',
};

export const DOC_COLORS = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', accent: '#4f46e5' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', accent: '#7c3aed' },
  sky:    { bg: 'bg-sky-50',    text: 'text-sky-600',    border: 'border-sky-200',    badge: 'bg-sky-100 text-sky-700',    accent: '#0284c7' },
  emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700', accent: '#059669' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   border: 'border-rose-200',   badge: 'bg-rose-100 text-rose-700',   accent: '#e11d48' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700', accent: '#d97706' },
};
