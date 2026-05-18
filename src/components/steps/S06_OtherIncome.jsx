import { useRef, useState } from 'react'
import FrequencyInput from '../FrequencyInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'
import ConfusedLink from '../ConfusedLink.jsx'

export default function S06_OtherIncome({ data, update, goNext }) {
  const [error, setError] = useState('')
  const faqRef = useRef(null)

  function setYesNo(val) {
    update({ hasOtherIncome: val })
    setError('')
  }

  function handleContinue() {
    if (data.hasOtherIncome === null) {
      setError('Please answer Yes or No to continue.')
      return
    }
    if (data.hasOtherIncome === false) {
      update({ fdInterest: '', savingsInterest: '' })
    }
    setError('')
    goNext()
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">💵</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Other Income
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Did your bank pay you any interest this year?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Interest from Fixed Deposits (FD) and Savings accounts is added to your income and taxed.
          Many people forget this.{' '}
          <ConfusedLink faqRef={faqRef} label="What counts as interest income?" />
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ExplainerCard
          emoji="🏦"
          title="Fixed Deposit (FD)"
          body="Interest earned on money locked in an FD for 1–5 years. Banks often deduct 10% TDS once the interest crosses a threshold."
        />
        <ExplainerCard
          emoji="💳"
          title="Savings Account"
          body="The small interest your bank pays on the balance in your regular account — usually a few hundred to a few thousand rupees."
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          Did you earn any interest from FDs or savings accounts in FY 2025-26?
          <span className="text-red-500 ml-0.5">*</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Yes' },
            { val: false, label: 'No' },
          ].map((opt) => {
            const active = data.hasOtherIncome === opt.val
            return (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setYesNo(opt.val)}
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
      </div>

      {data.hasOtherIncome === true && (
        <div className="reveal space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <FrequencyInput
            id="fdInterest"
            label="Total FD interest earned this year"
            value={data.fdInterest}
            onChange={(v) => update({ fdInterest: v })}
            placeholder="e.g. 25,000"
            hint="Add all FDs together. Enter 0 if you have no FDs."
          />
          <FrequencyInput
            id="savingsInterest"
            label="Total savings account interest"
            value={data.savingsInterest}
            onChange={(v) => update({ savingsInterest: v })}
            placeholder="e.g. 2,500"
            hint="Usually a small amount. Check your annual bank statement. Enter 0 if negligible."
          />
          <p className="text-xs text-blue-700">
            Tip: open your bank app → Statements → search for "Interest Credit" entries.
          </p>
        </div>
      )}

      {data.hasOtherIncome === false && (
        <div className="reveal px-3 py-2 bg-gray-100 rounded-xl text-xs text-gray-600">
          Got it — we'll skip interest income for your calculation.
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Continue →
      </button>

      <CommonQuestions ref={faqRef} questions={OTHER_INCOME_FAQ} />
    </div>
  )
}

function ExplainerCard({ emoji, title, body }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{emoji}</span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
    </div>
  )
}

const OTHER_INCOME_FAQ = [
  {
    q: 'What counts as FD interest?',
    a: 'All interest earned across all your fixed deposits during the financial year. This includes FDs in regular accounts, tax-saver FDs, and FDs in different banks. Add them all up — your bank statement or Form 26AS shows the total.',
  },
  {
    q: 'Where do I find my savings account interest?',
    a: 'Check your bank statement for entries like "Interest Credit" or "Saving Account Interest" — usually paid quarterly. Many banks also show a yearly summary in net banking under "Interest Certificate" or "Annual Statement".',
  },
  {
    q: 'My bank deducted TDS on my FD — do I still need to enter the interest?',
    a: 'Yes. TDS is just an advance tax payment, not the final tax. Enter the gross FD interest here. We will account for the TDS separately on the TDS step so you can see your refund or remaining liability.',
  },
  {
    q: 'My spouse or parent owns the FD jointly with me — do I report it?',
    a: 'Report only the portion of interest you actually earned. If your name is first on a joint FD, the interest is usually treated as yours. Money from a minor child is clubbed with the higher-earning parent — but those are edge cases this calculator does not handle.',
  },
  {
    q: 'Is PPF interest taxable?',
    a: 'No — interest from PPF, EPF, Sukanya Samriddhi, and tax-free bonds is fully exempt. Do not include those amounts here. This step is only for taxable interest from FDs and regular savings accounts.',
  },
  {
    q: "I don't know the exact amount. Can I skip this step?",
    a: 'Better to enter your best estimate than skip. Even rough numbers will give you a more accurate tax estimate. If you genuinely have no FD or savings interest worth mentioning, pick "No" and move on.',
  },
]
