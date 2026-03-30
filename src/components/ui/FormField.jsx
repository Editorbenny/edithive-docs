export default function FormField({ field, value, onChange }) {
  const base = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors';

  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <textarea
          value={value || ''}
          onChange={e => onChange(field.id, e.target.value)}
          placeholder={field.placeholder || ''}
          rows={field.rows || 3}
          required={field.required}
          className={`${base} resize-none`}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <select
          value={value || field.defaultValue || field.options[0]}
          onChange={e => onChange(field.id, e.target.value)}
          className={`${base} cursor-pointer`}
        >
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={field.type || 'text'}
        value={value || ''}
        onChange={e => onChange(field.id, e.target.value)}
        placeholder={field.placeholder || ''}
        required={field.required}
        className={base}
      />
    </div>
  );
}
