import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import DocumentForm from './components/DocumentForm.jsx';
import PreviewPanel from './components/PreviewPanel.jsx';

const DEFAULT_ITEMS = [
  { description: '', quantity: '1', unit_price: '' },
];

export default function App() {
  const [activeDoc, setActiveDoc] = useState(null);
  const [formData, setFormData] = useState({});
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const handleSelectDoc = useCallback((doc) => {
    setActiveDoc(doc);
    setFormData({});
    setItems(DEFAULT_ITEMS);
  }, []);

  const handleFormChange = useCallback((fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setActiveDoc(null);
    setFormData({});
    setItems(DEFAULT_ITEMS);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeDoc={activeDoc} onBackToDashboard={handleBackToDashboard} />

      {!activeDoc ? (
        <main className="flex-1">
          <Dashboard onSelect={handleSelectDoc} />
        </main>
      ) : (
        <main className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
          {/* Left: Form panel */}
          <div className="w-[400px] shrink-0 flex flex-col border-r border-gray-100 bg-white overflow-y-auto scrollbar-thin">
            <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h2 className="text-base font-bold text-gray-900">{activeDoc.label}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{activeDoc.description}</p>
            </div>
            <div className="flex-1 p-5">
              <DocumentForm
                docType={activeDoc}
                formData={formData}
                onFormChange={handleFormChange}
                items={items}
                onItemsChange={setItems}
              />
            </div>
          </div>

          {/* Right: Preview panel */}
          <div className="flex-1 min-w-0 flex flex-col bg-gray-50">
            <PreviewPanel
              docType={activeDoc}
              formData={formData}
              items={items}
            />
          </div>
        </main>
      )}
    </div>
  );
}
