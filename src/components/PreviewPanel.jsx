import { useEffect, useRef, useState } from 'react';
import { Download, RefreshCw, Eye } from 'lucide-react';
import Button from './ui/Button.jsx';
import { renderDocument } from '../lib/templateRenderer.js';

export default function PreviewPanel({ docType, formData, items }) {
  const iframeRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!docType) return;
    const html = renderDocument(docType.id, formData, items);
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }, [docType, formData, items]);

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const response = await fetch('/.netlify/functions/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType: docType.id, formData, items }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'PDF generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docType.id}-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!docType) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <Eye size={24} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">Live Preview</p>
        <p className="text-xs text-gray-400">Select a document type to see the preview here</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</span>
        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="sm"
          className="gap-1.5"
        >
          {downloading ? (
            <RefreshCw size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          {downloading ? 'Generating…' : 'Download PDF'}
        </Button>
      </div>

      {error && (
        <div className="mx-4 mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {/* iframe preview */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div className="w-full h-full min-h-[900px] bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Document Preview"
            className="w-full h-full border-none"
            style={{ minHeight: '900px' }}
          />
        </div>
      </div>
    </div>
  );
}
