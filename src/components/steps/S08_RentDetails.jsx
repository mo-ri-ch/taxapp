import { useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'

const CITY_OPTIONS = [
  {
    value: 'metro',
    label: 'Metro city',
    description: 'Delhi, Mumbai, Kolkata, or Chennai — 50% HRA exemption',
  },
  {
    value: 'nonMetro',
    label: 'Non-metro city',
    description: 'Every other city or town — 40% HRA exemption',
  },
]

export default function S08_RentDetails({ data, update, goNext }) {
  const [errors, setErrors] = useState({})

  function handleContinue() {
    const next = {}
    if (!data.monthlyRent) next.monthlyRent = 'Enter your monthly rent.'
    if (!data.cityType) next.cityType = 'Pick metro or non-metro.'
    if (data.hasHRAInSalary === null) next.hasHRAInSalary = 'Tell us whether HRA shows on your salary slip.'
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
            <span aria-hidden="true">🏠</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Rent Details
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Tell us about your rent
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Three quick details so we can calculate the HRA exemption you can actually claim.
        </p>
      </div>

      <NumberInput
        id="monthlyRent"
        label="How much rent do you pay per month?"
        value={data.monthlyRent}
        onChange={(v) => {
          update({ monthlyRent: v })
          setErrors((prev) => ({ ...prev, monthlyRent: undefined }))
        }}
        placeholder="e.g. 25,000"
        hint="The actual amount you pay each month, not what's on your salary slip."
        required
        error={errors.monthlyRent}
      />

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700">
          Which city do you rent in?
          <span className="text-red-500 ml-0.5">*</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CITY_OPTIONS.map((opt) => {
            const isSelected = data.cityType === opt.value
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
                  name="cityType"
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => {
                    update({ cityType: opt.value })
                    setErrors((prev) => ({ ...prev, cityType: undefined }))
                  }}
                  className="sr-only"
                />
                <div className="flex items-start gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                  </div>
                </div>
              </label>
            )
          })}
        </div>
        {errors.cityType && (
          <p role="alert" className="text-xs text-red-600">
            {errors.cityType}
          </p>
        )}
      </fieldset>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700">
          Does your salary slip show an HRA component?
          <span className="text-red-500 ml-0.5">*</span>
        </p>
        <p className="text-xs text-gray-500">
          HRA exemption needs both rent paid AND HRA received. If your salary has no HRA line,
          the exemption is ₹0 even if you pay rent.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Yes' },
            { val: false, label: 'No' },
          ].map((opt) => {
            const active = data.hasHRAInSalary === opt.val
            return (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => {
                  update({ hasHRAInSalary: opt.val })
                  setErrors((prev) => ({ ...prev, hasHRAInSalary: undefined }))
                }}
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
        {errors.hasHRAInSalary && (
          <p role="alert" className="text-xs text-red-600">
            {errors.hasHRAInSalary}
          </p>
        )}
        {data.hasHRAInSalary === false && (
          <div className="reveal px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            Without HRA in your salary, paying rent does not reduce your tax bill under either regime.
            We'll still capture your rent for completeness.
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

      <CommonQuestions questions={RENT_DETAILS_FAQ} />
    </div>
  )
}

const RENT_DETAILS_FAQ = [
  {
    q: 'Which cities count as "metro" for HRA?',
    a: 'Only four cities — Delhi, Mumbai, Kolkata, and Chennai — qualify as metros for HRA purposes. Bengaluru, Hyderabad, Pune, Gurgaon, and Noida are non-metros for this calculation even though they feel like big cities.',
  },
  {
    q: 'My rent changes during the year. What do I enter?',
    a: 'Use the average monthly rent. For example, if you paid ₹20,000 for 8 months and ₹25,000 for 4 months, enter ₹21,667. Or just total all 12 months and divide by 12.',
  },
  {
    q: 'How is HRA exemption actually calculated?',
    a: 'The exemption is the lowest of three numbers: (1) the HRA you actually received, (2) 50% (metro) or 40% (non-metro) of your annual basic, and (3) annual rent paid minus 10% of annual basic. Whichever is smallest is tax-free under the old regime.',
  },
  {
    q: 'What if my landlord refuses to give a PAN or receipts?',
    a: 'If your annual rent exceeds ₹1 lakh, employers normally require the landlord PAN to give you the HRA exemption. Without it, the exemption may be disallowed when your return is processed. Keep rent receipts and proof of payment (bank transfer, UPI) regardless of amount.',
  },
]
