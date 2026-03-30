import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import FormField from './ui/FormField.jsx';
import LineItemsTable from './LineItemsTable.jsx';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && (
        <div className="p-4 grid grid-cols-1 gap-3.5 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DocumentForm({ docType, formData, onFormChange, items, onItemsChange }) {
  if (!docType) return null;

  return (
    <div className="space-y-3">
      {docType.sections.map((section, idx) => (
        <Section key={section.title} title={section.title} defaultOpen={idx === 0}>
          {section.fields.map(field => {
            if (field.type === 'items') {
              return (
                <div key={field.id}>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Line Items</label>
                  <LineItemsTable items={items} onChange={onItemsChange} />
                </div>
              );
            }
            return (
              <FormField
                key={field.id}
                field={field}
                value={formData[field.id] !== undefined ? formData[field.id] : (field.defaultValue || '')}
                onChange={onFormChange}
              />
            );
          })}
        </Section>
      ))}
    </div>
  );
}
