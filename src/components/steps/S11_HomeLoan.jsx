import { useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'
import { CAP_24B } from '../../constants.js'

const OWNERSHIP_OPTIONS = [
  { value: 'own', label: 'In my name only' },
  { value: 'joint', label: 'Joint with spouse or co-borrower' },
  { value: 'other', label: "In someone else's name" },
]

export default function S11_HomeLoan({ data, update, goNext }) {
  const [errors, setErrors] = useState({})

  function toggleHasLoan(val) {
    update({
      hasHomeLoan: val,
      loanOwnership: null,
      homeLoanInterest: '',
    })
    setErrors({})
  }

  function setOwnership(val) {
    update({ loanOwnership: val, homeLoanInterest: '' })
    setErrors({})
  }

  function handleContinue() {
    const next = {}
    if (data.hasHomeLoan === null) next.hasHomeLoan = 'Answer Yes or No to continue.'
    if (data.hasHomeLoan === true) {
      if (!data.loanOwnership) next.loanOwnership = 'Pick whose name the loan is in.'
      if (
        (data.loanOwnership === 'own' || data.loanOwnership === 'joint') &&
        !(Number(data.homeLoanInterest) > 0)
      ) {
        next.homeLoanInterest = 'Enter the annual interest you paid.'
      }
    }
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    goNext()
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">🏡</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Home Loan
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Do you have a home loan for a house you currently live in?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Home loan interest reduces taxable income under old regime only.
          <span className="text-xs text-gray-400 block mt-1">
            Section 24(b) — max ₹{CAP_24B.toLocaleString('en-IN')} for self-occupied property.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { val: true, label: 'Yes' },
          { val: false, label: 'No' },
        ].map((opt) => {
          const active = data.hasHomeLoan === opt.val
          return (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => toggleHasLoan(opt.val)}
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
      {errors.hasHomeLoan && (
        <p role="alert" className="text-xs text-red-600">
          {errors.hasHomeLoan}
        </p>
      )}

      {data.hasHomeLoan === true && (
        <div className="reveal space-y-5">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">
              Is this loan in your name?
              <span className="text-red-500 ml-0.5">*</span>
            </legend>
            <div className="space-y-2">
              {OWNERSHIP_OPTIONS.map((opt) => {
                const isSelected = data.loanOwnership === opt.value
                return (
                  <label
                    key={opt.value}
                    className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="loanOwnership"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setOwnership(opt.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                    </div>
                  </label>
                )
              })}
            </div>
            {errors.loanOwnership && (
              <p role="alert" className="text-xs text-red-600">
                {errors.loanOwnership}
              </p>
            )}
          </fieldset>

          {data.loanOwnership === 'other' && (
            <div className="reveal bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 space-y-1">
              <p className="text-xs font-semibold text-amber-800">
                You cannot claim this deduction.
              </p>
              <p className="text-xs text-amber-700">
                Section 24(b) is only for the borrower listed on the loan. If your spouse or parent
                is the sole borrower, only they can claim the interest deduction on their own
                return.
              </p>
            </div>
          )}

          {(data.loanOwnership === 'own' || data.loanOwnership === 'joint') && (
            <div className="reveal space-y-2">
              <NumberInput
                id="homeLoanInterest"
                label="How much interest did you pay on this home loan last year?"
                value={data.homeLoanInterest}
                onChange={(v) => {
                  update({ homeLoanInterest: v })
                  setErrors((prev) => ({ ...prev, homeLoanInterest: undefined }))
                }}
                placeholder="e.g. 1,80,000"
                note={`Cap: ₹${CAP_24B.toLocaleString('en-IN')}. Check your bank's home loan interest certificate.`}
                required
                error={errors.homeLoanInterest}
              />
              {data.loanOwnership === 'joint' && (
                <p className="text-xs text-gray-500">
                  Enter only your share — typically 50% of total interest. Each co-borrower can
                  claim up to ₹{CAP_24B.toLocaleString('en-IN')}.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Continue →
      </button>

      <CommonQuestions questions={HOME_LOAN_FAQ} />
    </div>
  )
}

const HOME_LOAN_FAQ = [
  {
    q: 'The loan is in my father\'s name but I make the EMI payments. Can I claim?',
    a: "No. Section 24(b) requires you to be the registered borrower on the loan. Paying the EMIs from your account doesn't change who the bank lists as the borrower. Your father can claim it on his return.",
  },
  {
    q: 'I have two home loans. What do I enter?',
    a: 'Self-occupied + let-out properties have different rules and we only support the self-occupied case. If both your loans are on self-occupied property, you can claim interest on only one of them — the other is treated as deemed let-out, which has separate rules out of scope here.',
  },
  {
    q: "What's the difference between principal and interest?",
    a: 'Each EMI is split between principal repayment (reduces the loan balance) and interest (pure cost of borrowing). Only interest gets the Section 24(b) deduction. Principal goes under 80C in the previous step. Your bank statement or interest certificate shows the split.',
  },
  {
    q: "My home is under construction. Can I claim interest?",
    a: 'Not yet. Pre-construction interest is deductible only after the property is completed — in 5 equal instalments starting the year you get possession. Until then, no current-year deduction. This calculator assumes a completed self-occupied house.',
  },
  {
    q: 'I pay rent AND have a home loan. Can I claim both HRA and Section 24(b)?',
    a: "Yes, if both are genuine. Common scenario: you bought a flat in your home city but live and work in a different city where you rent. The IT Act allows both — declare each truthfully and keep documentation.",
  },
]
