import { fmt } from '../../utils.js'

const ADVANCE_TAX_THRESHOLD = 10000

export default function SectionB_TaxSummary({ results, data }) {
  const { newRegime, oldRegime, recommended, tds, tdsDeducted, employerTDS, bankTDS } = results
  const recommendedName = recommended === 'new' ? 'New' : 'Old'
  const showAdvanceTax =
    data?.hasOtherIncome &&
    Number(data?.fdInterest) > 0 &&
    tds.type === 'payable' &&
    tds.amount > ADVANCE_TAX_THRESHOLD

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          Tax Summary
        </p>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <RegimeCard
          label="New Regime"
          total={newRegime.totalTax}
          isWinner={recommended === 'new'}
        />
        <RegimeCard
          label="Old Regime"
          total={oldRegime.totalTax}
          isWinner={recommended === 'old'}
        />
      </div>

      <div className="px-4 pb-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Total TDS already paid</span>
          <span className="font-semibold text-gray-800">{fmt(tdsDeducted)}</span>
        </div>
        {employerTDS > 0 && bankTDS > 0 && (
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Employer TDS {fmt(employerTDS)} + Bank TDS {fmt(bankTDS)}
          </p>
        )}

        <TDSMessage tds={tds} />

        <p className="text-[11px] text-gray-400 leading-relaxed">
          Refund or balance due is calculated against the {recommendedName} Regime (the one we
          recommend for you).
        </p>

        {showAdvanceTax && (
          <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <svg
              className="w-4 h-4 text-amber-600 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              Heads up — when your balance due crosses ₹10,000, the IT Act expects
              <span className="font-semibold"> advance tax</span> paid in four instalments through
              the year (Section 234B/234C). Missing the deadlines triggers small interest charges
              when you file.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function RegimeCard({ label, total, isWinner }) {
  return (
    <div
      className={`rounded-xl p-3 border-2 ${
        isWinner ? 'border-indigo-300 bg-indigo-50/60' : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        {isWinner && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-white bg-green-600 rounded-full px-1.5 py-0.5">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.299.921-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.176 0L5.046 18.02c-.785.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L1.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
            Best for you
          </span>
        )}
      </div>
      <p className={`text-lg font-bold ${isWinner ? 'text-indigo-800' : 'text-gray-700'}`}>
        {fmt(total)}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5">total tax</p>
    </div>
  )
}

function TDSMessage({ tds }) {
  if (tds.type === 'refund') {
    return (
      <div className="rounded-lg px-3 py-2 bg-green-50 border border-green-100 flex items-start gap-2">
        <svg className="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p className="text-xs font-bold text-green-800">Refund expected: {fmt(tds.amount)}</p>
          <p className="text-[11px] text-green-700 mt-0.5">
            You paid more TDS than you owe. Claim the refund when you file.
          </p>
        </div>
      </div>
    )
  }
  if (tds.type === 'payable') {
    return (
      <div className="rounded-lg px-3 py-2 bg-amber-50 border border-amber-200 flex items-start gap-2">
        <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <div>
          <p className="text-xs font-bold text-amber-800">Balance due: {fmt(tds.amount)}</p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            Pay this as self-assessment tax before you file your return.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-lg px-3 py-2 bg-gray-50 border border-gray-200 text-xs text-gray-700">
      Your TDS exactly matches your tax — no refund, no balance due.
    </div>
  )
}
