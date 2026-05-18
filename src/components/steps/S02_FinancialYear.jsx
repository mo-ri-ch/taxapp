export default function S02_FinancialYear({ goNext }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">📅</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Financial Year
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Which financial year are you calculating tax for?
        </h2>
      </div>

      <div className="p-4 bg-indigo-50 border-2 border-indigo-600 rounded-xl flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-indigo-900">FY 2025-26</div>
          <div className="text-xs text-indigo-700 mt-0.5">April 2025 to March 2026</div>
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-indigo-600 bg-indigo-600 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-white" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
        <svg className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-blue-800 leading-relaxed">
          Tax slabs and rules change every year. This calculator uses the latest rules for{' '}
          <span className="font-semibold">FY 2025-26</span> (AY 2026-27).
        </p>
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Continue →
      </button>
    </div>
  )
}
