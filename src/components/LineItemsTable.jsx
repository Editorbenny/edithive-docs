import { Plus, Trash2 } from 'lucide-react';

const EMPTY_ITEM = { description: '', quantity: '1', unit_price: '' };

export default function LineItemsTable({ items, onChange }) {
  const addRow = () => onChange([...items, { ...EMPTY_ITEM }]);

  const removeRow = (idx) => onChange(items.filter((_, i) => i !== idx));

  const updateRow = (idx, field, value) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    onChange(updated);
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
  }, 0);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 w-1/2">Description</th>
              <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 w-16">Qty</th>
              <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 w-28">Unit Price</th>
              <th className="text-right px-3 py-2.5 text-xs font-semibold text-gray-500 w-24">Amount</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const amount = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
              return (
                <tr key={idx} className="border-b border-gray-100 last:border-none group">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateRow(idx, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 focus:bg-indigo-50 rounded px-1 py-0.5 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateRow(idx, 'quantity', e.target.value)}
                      placeholder="1"
                      min="0"
                      className="w-full bg-transparent border-none outline-none text-sm text-gray-900 text-right placeholder-gray-400 focus:bg-indigo-50 rounded px-1 py-0.5 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={e => updateRow(idx, 'unit_price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full bg-transparent border-none outline-none text-sm text-gray-900 text-right placeholder-gray-400 focus:bg-indigo-50 rounded px-1 py-0.5 transition-colors"
                    />
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium text-gray-700">
                    {isNaN(amount) ? '—' : amount.toFixed(2)}
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => removeRow(idx)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all rounded p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          onClick={addRow}
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <Plus size={13} />
          Add row
        </button>
        <span className="text-xs text-gray-500">
          Subtotal: <span className="font-semibold text-gray-800">{subtotal.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
}
