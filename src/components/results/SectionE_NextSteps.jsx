import { fmt, toNum, calc80CTotal } from '../../utils.js'
import { CAP_80C } from '../../constants.js'

const ADVANCE_TAX_THRESHOLD = 10000

function buildSuggestions(results, data) {
  const { recommended, newRegime, oldRegime, tds } = results
  const suggestions = []

  // Always: file your return — primary suggestion
  suggestions.push({
    icon: '🏛️',
    title: `File your return under the ${recommended === 'new' ? 'new' : 'old'} regime`,
    body: 'Use incometax.gov.in. You can pick the regime at filing time — what we recommended is the cheaper one based on your numbers.',
  })

  // Refund expected
  if (tds.type === 'refund') {
    suggestions.push({
      icon: '💸',
      title: `Track your ${fmt(tds.amount)} refund after filing`,
      body: 'Refunds usually land in 30–90 days. Make sure your bank account is pre-validated on the e-filing portal and your PAN is linked to Aadhaar.',
    })
  }

  // Balance payable
  if (tds.type === 'payable') {
    suggestions.push({
      icon: '⚠️',
      title: `Pay ${fmt(tds.amount)} self-assessment tax before filing`,
      body: 'Generate a Challan 280 on incometax.gov.in and pay online. Without this payment your return cannot be filed as a "tax paid" return.',
    })
  }

  // Advance tax warning (FD income + payable)
  if (
    data?.hasOtherIncome &&
    toNum(data.fdInterest) > 0 &&
    tds.type === 'payable' &&
    tds.amount > ADVANCE_TAX_THRESHOLD
  ) {
    suggestions.push({
      icon: '📅',
      title: 'Plan advance tax in four instalments next year',
      body: 'When your total tax liability crosses ₹10,000 (after TDS), the IT Act expects you to pay in four instalments — 15 Jun, 15 Sep, 15 Dec, 15 Mar. Missing deadlines triggers small interest under Section 234B/234C.',
    })
  }

  // Old regime wins + 80C headroom
  if (recommended === 'old') {
    const total80C = calc80CTotal(data)
    const remaining = CAP_80C - Math.min(total80C, CAP_80C)
    if (remaining > 0) {
      suggestions.push({
        icon: '📈',
        title: `${fmt(remaining)} more in 80C could save you more next year`,
        body: 'PPF, ELSS, tax-saver FDs, or extra LIC premiums all qualify. ELSS has the shortest lock-in (3 years) and historically the best returns.',
      })
    }
  }

  // Old regime wins + no personal NPS
  if (recommended === 'old' && !data?.hasPersonalNPS) {
    suggestions.push({
      icon: '🏦',
      title: 'Consider personal NPS for an extra ₹50,000 deduction',
      body: 'Section 80CCD(1B) gives you ₹50,000 over and above the 80C cap. You can start with as little as ₹1,000/month via the NPS Tier-1 account.',
    })
  }

  // No self insurance at all (for any age below 60 — preventive)
  if (!data?.hasSelfInsurance) {
    suggestions.push({
      icon: '🏥',
      title: 'Health insurance pays for itself',
      body: 'A ₹15,000–₹25,000 annual premium gives you ₹25,000+ in 80D deduction (old regime) and removes the bigger risk of an out-of-pocket hospital bill.',
    })
  }

  // New regime zero tax
  if (recommended === 'new' && newRegime.totalTax === 0) {
    suggestions.push({
      icon: '✅',
      title: 'Nothing more needed for this year',
      body: 'You owe no tax. Still file your return on time so your bank reports and Form 26AS reconcile cleanly — and so any refund (if you had TDS) reaches you.',
    })
  }

  // Wait for Form 16 — always-ish reminder
  suggestions.push({
    icon: '📄',
    title: 'Wait for Form 16 before filing',
    body: 'Most employers issue Form 16 by 15 June. Cross-check the salary, TDS, and deductions on Form 16 against this calculator before submitting your return.',
  })

  // Keep proofs (old regime only)
  if (recommended === 'old' && oldRegime.totalTax > 0) {
    suggestions.push({
      icon: '📂',
      title: 'Keep deduction proofs for at least 6 years',
      body: 'Rent receipts, 80C investment statements, 80D premium receipts, and Section 24(b) interest certificates — the IT department may ask for them during scrutiny.',
    })
  }

  // Cap at 9
  return suggestions.slice(0, 9)
}

export default function SectionE_NextSteps({ results, data }) {
  const suggestions = buildSuggestions(results, data)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">
        Next steps
      </p>

      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 border ${
              i === 0
                ? 'bg-indigo-50 border-indigo-200'
                : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-lg leading-none mt-0.5" aria-hidden="true">
                {s.icon}
              </span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${i === 0 ? 'text-indigo-900' : 'text-gray-800'}`}>
                  {s.title}
                </p>
                <p className={`text-xs leading-relaxed mt-0.5 ${i === 0 ? 'text-indigo-700' : 'text-gray-600'}`}>
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed mt-3">
        These suggestions are general pointers based on your inputs — not personalised financial or
        tax advice. Every person's situation is different. Please consult a qualified Chartered
        Accountant or tax professional before making investment or filing decisions.
      </p>
    </div>
  )
}
