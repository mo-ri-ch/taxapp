import ProgressBar from './ProgressBar.jsx'
import TaxPreviewPanel from './TaxPreviewPanel.jsx'

export default function StepWrapper({
  children,
  goBack,
  reset,
  showProgress,
  progressStep,
  TOTAL_PROGRESS,
  step,
  stepName,
  showPreview = false,
  data,
}) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
            aria-label="Start over"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CalculatorIcon className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-900 tracking-tight leading-none">
                TaxClarity
              </div>
              <div className="text-[10px] text-gray-400 leading-none mt-0.5 hidden sm:block">
                India Tax Calculator
              </div>
            </div>
          </button>

          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {showProgress && (
            <div className="flex-1 min-w-0">
              <ProgressBar current={progressStep} total={TOTAL_PROGRESS} stepName={stepName} />
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 shrink-0 ml-auto">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="leading-none">
              <div className="text-[10px] font-semibold text-gray-600">100% Private</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Data stays in your browser</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-6">
        {showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <main className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 card-enter">
                {children}
              </div>
            </main>
            <aside className="hidden lg:block lg:col-span-5">
              <div className="sticky top-20">
                <TaxPreviewPanel data={data} />
              </div>
            </aside>
          </div>
        ) : (
          <main className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 card-enter">
              {children}
            </div>
          </main>
        )}
      </div>

      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-4">
        <p className="text-xs text-center text-gray-300">
          Salaried individuals · FY 2025-26 · No data saved
        </p>
      </footer>
    </div>
  )
}

function CalculatorIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path strokeLinecap="round" d="M9 7h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
    </svg>
  )
}
