import { FileText } from 'lucide-react';

export default function Header({ activeDoc, onBackToDashboard }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <FileText size={14} className="text-white" />
          </div>
          <span className="text-base font-black tracking-tight">
            <span className="text-indigo-600">edit</span>
            <span className="text-gray-900">hive</span>
            <span className="text-gray-400 font-semibold ml-1.5 text-sm">Docs</span>
          </span>
        </button>

        {activeDoc && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Editing</span>
            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
              {activeDoc.label}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
