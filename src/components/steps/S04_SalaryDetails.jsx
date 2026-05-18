import { useRef, useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import FrequencyInput from '../FrequencyInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'
import ConfusedLink from '../ConfusedLink.jsx'

const SURCHARGE_ANNUAL_THRESHOLD = 50_00_000

export default function S04_SalaryDetails({ data, update, goNext }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  const takeHomeMonthly = Number(data.takeHomeSalaryMonthly) || 0
  const basicMonthly = Number(data.basicSalaryMonthly) || 0
  const annualTakeHome = takeHomeMonthly * 12
  const annualBonus = Number(data.bonus) || 0
  const combinedAnnual = annualTakeHome + annualBonus

  const basicExceedsTakeHome = basicMonthly > 0 && takeHomeMonthly > 0 && basicMonthly > takeHomeMonthly
  const surchargeWarning = annualTakeHome > SURCHARGE_ANNUAL_THRESHOLD

  function handleContinue() {
    const next = {}
    if (!data.takeHomeSalaryMonthly) next.takeHomeSalaryMonthly = 'Enter your monthly take-home salary.'
    if (!data.basicSalaryMonthly) next.basicSalaryMonthly = 'Enter your monthly basic pay.'
    if (data.hasBonus === null) next.hasBonus = 'Tell us whether you receive a bonus.'
    if (data.hasBonus === true && !data.bonus) next.bonus = 'Enter your bonus amount.'

    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    goNext()
  }

  function setBonusYes(val) {
    if (val === data.hasBonus) return
    if (val === false) {
      update({ hasBonus: false, bonus: '' })
    } else {
      update({ hasBonus: true })
    }
    setErrors((prev) => ({ ...prev, hasBonus: undefined, bonus: undefined }))
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">💰</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Your Salary
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          What does your salary look like?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Two numbers from your monthly salary slip — that's all we need to start.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          id="takeHomeSalaryMonthly"
          label="Take-home salary (per month)"
          value={data.takeHomeSalaryMonthly}
          onChange={(v) => {
            update({ takeHomeSalaryMonthly: v })
            setErrors((prev) => ({ ...prev, takeHomeSalaryMonthly: undefined }))
          }}
          placeholder="e.g. 75,000"
          hint="The amount credited to your bank account each month — not your CTC or gross salary."
          required
          error={errors.takeHomeSalaryMonthly}
        />

        <div className="space-y-1.5">
          <NumberInput
            id="basicSalaryMonthly"
            label="Basic pay (per month)"
            value={data.basicSalaryMonthly}
            onChange={(v) => {
              update({ basicSalaryMonthly: v })
              setErrors((prev) => ({ ...prev, basicSalaryMonthly: undefined }))
            }}
            placeholder="e.g. 30,000"
            hint="Listed as 'Basic' or 'Basic Pay' on your salary slip."
            required
            error={errors.basicSalaryMonthly}
          />
          <ConfusedLink faqRef={faqRef} label="What is basic pay?" />
        </div>
      </div>

      {takeHomeMonthly > 0 && (
        <div className="reveal px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-700">
            Annual take-home salary
          </span>
          <span className="text-sm font-bold text-indigo-900">
            ₹{annualTakeHome.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {basicExceedsTakeHome && (
        <div className="reveal px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            Basic pay should always be <span className="font-semibold">lower</span> than take-home —
            basic is one piece of what reaches your bank. Re-check your salary slip and try again.
          </p>
        </div>
      )}

      {surchargeWarning && (
        <div className="reveal px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            Incomes above ₹50 lakh may attract <span className="font-semibold">surcharge</span>,
            which this calculator does not cover. Consider consulting a tax professional for an exact figure.
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Do you get any extra money apart from your fixed monthly salary?
            <span className="text-red-500 ml-0.5">*</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Annual bonus, performance incentive, joining bonus, festival bonus, etc.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Yes, I get extra' },
            { val: false, label: 'No, only fixed salary' },
          ].map((opt) => {
            const active = data.hasBonus === opt.val
            return (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setBonusYes(opt.val)}
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

        {errors.hasBonus && (
          <p role="alert" className="text-xs text-red-600">
            {errors.hasBonus}
          </p>
        )}

        {data.hasBonus === true && (
          <div className="reveal p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
            <FrequencyInput
              id="bonus"
              label="How much extra do you receive?"
              value={data.bonus}
              onChange={(v) => {
                update({ bonus: v })
                setErrors((prev) => ({ ...prev, bonus: undefined }))
              }}
              placeholder="e.g. 1,00,000"
              hint="If you don't know the exact figure, use last year's bonus as a rough estimate."
              required
              error={errors.bonus}
            />
            <div className="bg-white rounded-lg p-3 text-xs text-blue-800 leading-relaxed border border-blue-100">
              <p className="font-semibold mb-1">Not sure of the exact amount?</p>
              <p>
                Check your bank statements for any annual transfers from your employer beyond
                your fixed monthly salary.
              </p>
              <p className="mt-1.5 text-blue-700">
                <span className="font-semibold">Don't include:</span> your fixed monthly salary,
                reimbursements, or amounts deducted before they reach your account.
              </p>
            </div>
          </div>
        )}

        {data.hasBonus === false && (
          <div className="reveal px-3 py-2 bg-gray-100 rounded-xl text-xs text-gray-600">
            Got it — we'll use only your fixed monthly salary.
          </div>
        )}

        {data.hasBonus === true && annualBonus > 0 && annualTakeHome > 0 && (
          <div className="reveal px-4 py-2.5 bg-green-50 border border-green-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-medium text-green-800">
              Combined annual income
            </span>
            <span className="text-sm font-bold text-green-900">
              ₹{combinedAnnual.toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Continue →
      </button>

      <CommonQuestions ref={faqRef} questions={SALARY_FAQ} />
    </div>
  )
}

const SALARY_FAQ = [
  {
    q: "What's the difference between take-home, gross, and CTC?",
    a: 'CTC is the total cost your employer reports, including their PF contribution, gratuity, and benefits you may never see as cash. Gross salary is what shows on your slip before deductions. Take-home is what actually lands in your bank account each month — that\'s the number we want here.',
  },
  {
    q: 'What is basic pay and how do I find it?',
    a: 'Basic pay is the foundation salary on your slip — listed as "Basic" or "Basic Pay" under Earnings. Many allowances (HRA, PF, gratuity) are calculated as a percentage of basic. It is usually 30–50% of your gross salary.',
  },
  {
    q: 'My salary changed mid-year. What do I enter?',
    a: 'Use a weighted average. For example, if you earned ₹60,000/month for 6 months and ₹75,000/month for 6 months, enter ₹67,500/month. Better yet, total all 12 months from your bank statements and divide by 12.',
  },
  {
    q: 'Should I include my employer\'s PF contribution?',
    a: 'No. Your employer\'s PF goes directly into your EPF account — it never appears in your take-home and it isn\'t taxable as salary income. Only enter what actually credits your bank.',
  },
  {
    q: 'What counts as a bonus for tax purposes?',
    a: 'Any cash payment from your employer that is not part of your fixed monthly salary — annual performance bonus, joining bonus, retention bonus, festival bonus, sales incentives. All are fully taxable in both regimes.',
  },
]
