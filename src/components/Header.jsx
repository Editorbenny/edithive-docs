export default function Header({ activeDoc, onBackToDashboard }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo — clicks back to dashboard */}
        <button
          onClick={onBackToDashboard}
          className="flex items-center group focus:outline-none"
          title="Back to dashboard"
        >
          <img
            src="/edithive-logo.png"
            alt="Edithive"
            className="h-8 w-auto"
            style={{ maxWidth: '140px' }}
          />
        </button>

        {/* Active document indicator */}
        {activeDoc && (
          <div className="flex items-center gap-2.5">
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
