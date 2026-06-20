import { useEffect, useRef, useState, useCallback } from 'react';
import { Download, RefreshCw, Eye } from 'lucide-react';
import Button from './ui/Button.jsx';
import { renderDocument } from '../lib/templateRenderer.js';

export default function PreviewPanel({ docType, formData, items }) {
  const iframeRef   = useRef(null);
  const blobUrlRef  = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState('');

  /* ── Blob-URL preview (avoids all cross-origin / doc.write issues) ── */
  useEffect(() => {
    if (!docType || !iframeRef.current) return;

    const html = renderDocument(docType.id, formData, items);

    /* Revoke previous blob URL to avoid memory leaks */
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    blobUrlRef.current = url;
    iframeRef.current.src = url;
  }, [docType, formData, items]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const handleDownload = useCallback(async () => {
    if (!docType) return;
    setDownloading(true);
    setError('');

    try {
      const response = await fetch('/.netlify/functions/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docType: docType.id, formData, items }),
      });

      if (!response.ok) {
        let msg = `Server error (${response.status})`;
        try { const j = await response.json(); msg = j.error || msg; } catch {}
        throw new Error(msg);
      }

      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `edithive-${docType.id}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [docType, formData, items]);

  /* ── Empty state ── */
  if (!docType) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50">
        <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <Eye size={22} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">Live Preview</p>
        <p className="text-xs text-gray-400">Select a document type to see a live preview here</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 shrink-0">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</span>
        <Button onClick={handleDownload} disabled={downloading} size="sm">
          {downloading
            ? <><RefreshCw size={12} className="animate-spin" /> Generating…</>
            : <><Download size={12} /> Download PDF</>}
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium shrink-0">
          ⚠ {error}
        </div>
      )}

      {/* iframe */}
      <div className="flex-1 overflow-auto p-5">
        <div className="w-full bg-white rounded-lg shadow-xl overflow-hidden" style={{ minHeight: '980px' }}>
          <iframe
            ref={iframeRef}
            title="Document Preview"
            className="w-full border-none"
            style={{ height: '100%', minHeight: '980px', display: 'block' }}
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
