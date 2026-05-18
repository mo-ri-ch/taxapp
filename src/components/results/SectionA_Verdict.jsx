import { fmt } from '../../utils.js'

function joinHumanList(arr) {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`
  return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`
}

function getVerdictSentence(results) {
  const { recommended, savings, newRegime, oldRegime } = results
  const winnerName = recommended === 'new' ? 'New Tax Regime' : 'Old Tax Regime'
  const otherName = recommended === 'new' ? 'old regime' : 'new regime'

  if (recommended === 'new' && newRegime.totalTax === 0) {
    return 'Your income falls under ₹12.75 lakh. Under the new regime you pay zero tax this year. No investments needed, no paperwork required.'
  }

  if (savings > 0 && savings < 5000) {
    return `It's close — just ${fmt(savings)} difference. ${winnerName} edges out. But if your deductions change next year, revisit this calculation.`
  }

  if (recommended === 'new') {
    const totalOldDeductions = Math.max(0, newRegime.grossIncome - oldRegime.taxableIncome)
    return `Even with ${fmt(totalOldDeductions)} in deductions under the old regime, the new regime's lower slab rates still save you more.`
  }

  const reasons = []
  if (oldRegime.hraExemption > 0) reasons.push(`an HRA exemption of ${fmt(oldRegime.hraExemption)}`)
  if (oldRegime.deduction80C > 0) reasons.push(`${fmt(oldRegime.deduction80C)} in 80C investments`)
  if (oldRegime.deduction80D > 0) reasons.push(`${fmt(oldRegime.deduction80D)} in health insurance premiums`)
  if (oldRegime.deductionPersonalNPS > 0)
    reasons.push(`${fmt(oldRegime.deductionPersonalNPS)} in personal NPS contributions`)
  if (oldRegime.deductionHomeLoanInterest > 0)
    reasons.push(`${fmt(oldRegime.deductionHomeLoanInterest)} in home-loan interest`)

  const reasonText =
    reasons.length > 0
      ? joinHumanList(reasons)
      : 'Your old-regime deductions'
  return `${reasonText} bring your taxable income down significantly. The deductions outweigh the ${otherName}'s lower rates in your case.`
}

export default function SectionA_Verdict({ results }) {
  const { recommended, savings, newRegime, oldRegime } = results
  const recommendedData = recommended === 'new' ? newRegime : oldRegime
  const isZeroTax = recommended === 'new' && newRegime.totalTax === 0

  const bgClass = recommended === 'new' ? 'bg-indigo-600' : 'bg-emerald-600'
  const badgeBg = recommended === 'new' ? 'bg-indigo-500 text-indigo-100' : 'bg-emerald-500 text-emerald-100'
  const innerBg = recommended === 'new' ? 'bg-indigo-700/60' : 'bg-emerald-700/60'
  const subtleText = recommended === 'new' ? 'text-indigo-200' : 'text-emerald-200'
  const verdictSentence = getVerdictSentence(results)

  return (
    <div className={`rounded-2xl p-4 ${bgClass} card-enter`}>
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 ${badgeBg}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recommended for you
      </div>

      <p className="text-xl font-bold text-white mt-3 mb-1">
        {recommended === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
      </p>

      <div className="mb-3">
        {isZeroTax ? (
          <>
            <p className="text-3xl font-black text-white">₹0 tax</p>
            <p className={`text-sm mt-1 ${subtleText}`}>You pay zero tax this year.</p>
          </>
        ) : savings > 0 ? (
          <>
            <p className={`text-sm ${subtleText}`}>You save</p>
            <p className="text-3xl font-black text-white">{fmt(savings)}</p>
            <p className={`text-sm mt-1 ${subtleText}`}>
              compared to the {recommended === 'new' ? 'old' : 'new'} regime.
            </p>
          </>
        ) : (
          <>
            <p className={`text-sm ${subtleText}`}>Your total tax</p>
            <p className="text-3xl font-black text-white">{fmt(recommendedData.totalTax)}</p>
            <p className={`text-sm mt-1 ${subtleText}`}>
              Both regimes give you the same number.
            </p>
          </>
        )}
      </div>

      <div className={`rounded-xl p-3 ${innerBg}`}>
        <p className="text-sm text-white leading-relaxed">{verdictSentence}</p>
      </div>
    </div>
  )
}
