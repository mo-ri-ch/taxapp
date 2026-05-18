import { useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'

const EXPLAINER_STEPS = [
  'Your employer estimates how much tax you owe for the year.',
  'They split that amount across all 12 months.',
  'A bit is deducted from each monthly salary and sent to the government.',
  'At year-end, you compare TDS already paid against your actual tax — refund or balance due.',
]

export default function S12_TDS({ data, update, goNext }) {
  const [errors, setErrors] = useState({})

  function toggleTDS(val) {
    if (val === false) {
      update({ hasTDS: false, tdsDeducted: '' })
    } else {
      update({ hasTDS: true })
    }
    setErrors({})
  }

  function handleContinue() {
    const next = {}
    if (data.hasTDS === null) next.hasTDS = 'Answer Yes or No to continue.'
    if (data.hasTDS === true && !(Number(data.tdsDeducted) > 0)) {
      next.tdsDeducted = 'Enter the total TDS your employer deducted.'
    }
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    goNext()
  }

  const showBankTDS = data.hasOtherIncome && Number(data.fdInterest) > 0

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">🧾</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Almost done
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Does your employer deduct income tax from your salary every month?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          This is called TDS — Tax Deducted at Source.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
          How TDS works
        </p>
        <ol className="space-y-1.5">
          {EXPLAINER_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-blue-800">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { val: true, label: 'Yes, TDS is deducted' },
          { val: false, label: "No, it isn't" },
        ].map((opt) => {
          const active = data.hasTDS === opt.val
          return (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => toggleTDS(opt.val)}
              className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                active
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {errors.hasTDS && (
        <p role="alert" className="text-xs text-red-600">
          {errors.hasTDS}
        </p>
      )}

      {data.hasTDS === true && (
        <div className="reveal p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <NumberInput
            id="tdsDeducted"
            label="How much total TDS did your employer deduct this year?"
            value={data.tdsDeducted}
            onChange={(v) => {
              update({ tdsDeducted: v })
              setErrors((prev) => ({ ...prev, tdsDeducted: undefined }))
            }}
            placeholder="e.g. 60,000"
            hint="Add up the TDS line from all 12 monthly slips, or check Form 16 / Form 26AS."
            required
            error={errors.tdsDeducted}
          />
        </div>
      )}

      {data.hasTDS === false && (
        <div className="reveal px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
          If no TDS has been deducted, the full tax amount becomes payable when you file your
          return. Worth double-checking with your salary slip or Form 26AS — most salaried jobs
          have at least some TDS.
        </div>
      )}

      {showBankTDS && (
        <div className="reveal bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <span aria-hidden="true">🏦</span>
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Did your bank deduct tax (TDS) on your FD interest?
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Banks deduct 10% TDS on FD interest once it crosses ₹40,000 in a year (₹50,000 for
                senior citizens). Form 26AS or the bank's TDS certificate shows the exact amount.
                Leave blank if no TDS was deducted.
              </p>
            </div>
          </div>
          <NumberInput
            id="bankTDS"
            label="Bank TDS on FD interest (optional)"
            value={data.bankTDS}
            onChange={(v) => update({ bankTDS: v })}
            placeholder="e.g. 4,000"
            hint="Leave blank or enter 0 if your bank did not deduct any TDS."
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Calculate My Tax →
      </button>

      <CommonQuestions questions={TDS_FAQ} />
    </div>
  )
}

const TDS_FAQ = [
  {
    q: 'Where do I find the exact TDS my employer deducted?',
    a: 'Three reliable places: (1) Form 16 — issued by your employer in May/June each year, (2) Form 26AS — your personal tax statement on incometax.gov.in, or (3) the TDS line on your monthly salary slips, totalled across 12 months.',
  },
  {
    q: 'My employer deducted more TDS than I owe. What happens?',
    a: "You get a refund when you file your tax return. The IT department transfers the excess back to your bank account, usually within 30–90 days of filing. Make sure your bank account is pre-validated on the e-filing portal.",
  },
  {
    q: 'My employer deducted less than I owe. What happens?',
    a: 'You pay the difference as self-assessment tax before filing your return. If the shortfall is large and arose because you have other income (FD, freelance), advance tax rules under Section 234B/234C may apply — small interest charges might be added.',
  },
  {
    q: 'I switched jobs mid-year. Whose TDS do I enter?',
    a: 'Add TDS from BOTH employers. Both will issue Form 16. Important: notify your second employer about your previous salary so they deduct correct TDS for the rest of the year — otherwise you usually end up owing extra tax at filing time.',
  },
  {
    q: 'What is Form 26AS and how is it different from Form 16?',
    a: "Form 16 is what your employer gives you. Form 26AS is the government's record of ALL tax credits against your PAN — employer TDS, bank TDS, advance tax you paid yourself, everything. Treat Form 26AS as the source of truth; download it from incometax.gov.in.",
  },
  {
    q: 'Do I need to enter TDS on FD interest separately?',
    a: 'Yes, if your bank deducted any. We ask for it in the second box above (only shown when you reported FD interest earlier). Bank TDS is just an advance against your tax bill, like employer TDS — both are added together when calculating refund or balance due.',
  },
  {
    q: 'I declared investments to my employer mid-year. Will TDS already reflect them?',
    a: 'Your employer recalculates TDS each month based on the latest declarations. So yes, TDS in your last few months should be lower if you declared investments. The number you enter here is your total YEAR-END deducted TDS, which already accounts for those adjustments.',
  },
]
