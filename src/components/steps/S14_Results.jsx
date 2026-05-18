import SectionA_Verdict from '../results/SectionA_Verdict.jsx'
import SectionB_TaxSummary from '../results/SectionB_TaxSummary.jsx'
import SectionC_DetailedBreakdown from '../results/SectionC_DetailedBreakdown.jsx'
import SectionD_Education from '../results/SectionD_Education.jsx'
import SectionE_NextSteps from '../results/SectionE_NextSteps.jsx'

export default function S14_Results({ results, data, reset, skipTo }) {
  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4 font-sans">
        <p className="text-sm text-gray-500">No results to show yet.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={reset}
              className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Start over"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path strokeLinecap="round" d="M9 7h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
              </svg>
            </button>
            <div className="leading-none">
              <div className="text-sm font-bold text-gray-900 tracking-tight">Your Tax Result</div>
              <div className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
                TaxClarity · FY 2025-26
              </div>
            </div>
          </div>
          <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1">
            FY 2025-26
          </span>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-4">
            <SectionA_Verdict results={results} data={data} />
            <SectionE_NextSteps results={results} data={data} />
            <SectionD_Education results={results} data={data} />
            <Disclaimer />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => skipTo(4)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors border-2 border-indigo-200 rounded-xl px-5 py-3 hover:bg-indigo-50"
              >
                Go back and edit my inputs
              </button>
              <button
                type="button"
                onClick={reset}
                className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors border border-gray-300 rounded-xl px-5 py-3 hover:bg-gray-100"
              >
                Start Over
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-16 space-y-4">
              <SectionB_TaxSummary results={results} data={data} />
              <SectionC_DetailedBreakdown results={results} data={data} />
              <TrustStrip />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 text-center text-xs text-gray-300">
        TaxClarity · Salaried individuals · FY 2025-26 · No data saved
      </footer>
    </div>
  )
}

function Disclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="text-xs font-semibold text-amber-900">
          Important disclaimer: This is an estimate based on the information you provided — not
          exact tax advice.
        </p>
      </div>
      <ul className="text-xs text-amber-800 leading-relaxed list-disc pl-5 space-y-0.5">
        <li>Surcharge (incomes above ₹50 lakh) is not included.</li>
        <li>Capital gains, rental income, and other income sources are out of scope.</li>
        <li>
          Verify with a CA or on{' '}
          <span className="font-semibold underline">incometax.gov.in</span> before filing.
        </li>
      </ul>
    </div>
  )
}

function TrustStrip() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2.5">
      <TrustRow
        icon={
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
        title="FY 2025-26 Rules"
        subtitle="Based on latest tax slabs"
      />
      <TrustRow
        icon={
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        }
        title="Your data is private"
        subtitle="We don't store your data"
      />
      <TrustRow
        icon={
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Takes 3-5 minutes"
        subtitle="Quick & easy process"
      />
    </div>
  )
}

function TrustRow({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-2.5">
      {icon}
      <div className="leading-tight">
        <div className="text-xs font-semibold text-gray-700">{title}</div>
        <div className="text-[11px] text-gray-500">{subtitle}</div>
      </div>
    </div>
  )
}
