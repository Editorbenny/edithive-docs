import { FileText, ClipboardList, Briefcase, Users, Lock, Lightbulb, ArrowRight } from 'lucide-react';
import { DOCUMENT_TYPES, DOC_COLORS } from '../lib/documentConfig.js';

const ICONS = { FileText, ClipboardList, Briefcase, Users, Lock, Lightbulb };

export default function Dashboard({ onSelect }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
          What would you like to generate?
        </h1>
        <p className="text-gray-500 text-base">
          Choose a document type to get started. Fill in the details and download a professional PDF instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOCUMENT_TYPES.map(doc => {
          const Icon = ICONS[doc.icon] || FileText;
          const colors = DOC_COLORS[doc.color];
          return (
            <button
              key={doc.id}
              onClick={() => onSelect(doc)}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 text-left hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div className={`w-11 h-11 ${colors.bg} rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110`}>
                <Icon size={20} className={colors.text} />
              </div>

              <div className="pr-6">
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{doc.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{doc.description}</p>
              </div>

              <div className={`absolute top-6 right-6 w-7 h-7 rounded-full ${colors.bg} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0`}>
                <ArrowRight size={13} className={colors.text} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Powered by <span className="font-bold text-indigo-500">edithive</span>
        </p>
        <p className="text-xs text-gray-400">Professional document generation</p>
      </div>
    </div>
  );
}
