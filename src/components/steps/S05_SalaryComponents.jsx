import { useRef, useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import FrequencyInput from '../FrequencyInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'
import ConfusedLink from '../ConfusedLink.jsx'

const COMPONENTS = [
  {
    key: 'hasHRA',
    amountKey: 'hraMonthly',
    label: 'HRA — House Rent Allowance',
    tag: 'Section 10(13A)',
    emoji: '🏠',
    description:
      'A part of your salary meant for rent. Can be partially tax-free if you pay rent.',
  },
  {
    key: 'hasProfTax',
    amountKey: 'professionalTax',
    label: 'Professional Tax',
    tag: 'Section 16(iii)',
    emoji: '🏛️',
    description:
      'State govt tax deducted monthly from your salary. Usually ₹200/month (max ₹2,400/year).',
  },
  {
    key: 'hasEmployerNPS',
    amountKey: 'employerNPS',
    label: 'Employer NPS contribution',
    tag: 'Section 80CCD(2)',
    emoji: '🏦',
    description:
      "Your company puts money into your NPS retirement account as part of your pay package.",
  },
]

export default function S05_SalaryComponents({ data, update, goNext }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)

  function toggleComponent(key, amountKey) {
    const next = !data[key]
    const patch = { [key]: next }
    if (!next) patch[amountKey] = ''
    update(patch)
    setErrors((prev) => ({ ...prev, [amountKey]: undefined }))
  }

  function handleContinue() {
    const next = {}
    for (const c of COMPONENTS) {
      if (data[c.key] && !(Number(data[c.amountKey]) > 0)) {
        next[c.amountKey] = 'Enter an amount greater than ₹0.'
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
            <span aria-hidden="true">📋</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Salary Components
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Does your salary slip show any of these?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tick all that appear on your slip. Leave the rest blank.{' '}
          <ConfusedLink faqRef={faqRef} label="What are these?" />
        </p>
      </div>

      <div className="space-y-3">
        {COMPONENTS.map((c) => {
          const checked = Boolean(data[c.key])
          return (
            <div
              key={c.key}
              className={`rounded-xl border-2 overflow-hidden transition-all ${
                checked ? 'border-indigo-600' : 'border-gray-200'
              }`}
            >
              <label
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer ${
                  checked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleComponent(c.key, c.amountKey)}
                  className="sr-only"
                />
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    checked ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'
                  }`}
                >
                  {checked && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span aria-hidden="true">{c.emoji}</span>
                    <span className="text-sm font-semibold text-gray-900">{c.label}</span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 rounded-full px-2 py-0.5">
                      {c.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
                </div>
              </label>

              {checked && (
                <div className="px-4 pb-4 bg-indigo-50 border-t border-indigo-100">
                  <div className="pt-3">
                    {c.key === 'hasHRA' && (
                      <NumberInput
                        id="hraMonthly"
                        label="How much HRA do you receive per month?"
                        value={data.hraMonthly}
                        onChange={(v) => {
                          update({ hraMonthly: v })
                          setErrors((prev) => ({ ...prev, hraMonthly: undefined }))
                        }}
                        placeholder="e.g. 15,000"
                        hint="Find it on your salary slip under Earnings."
                        required
                        error={errors.hraMonthly}
                      />
                    )}
                    {c.key === 'hasProfTax' && (
                      <FrequencyInput
                        id="professionalTax"
                        label="How much Professional Tax is deducted?"
                        value={data.professionalTax}
                        onChange={(v) => {
                          update({ professionalTax: v })
                          setErrors((prev) => ({ ...prev, professionalTax: undefined }))
                        }}
                        placeholder="200"
                        note="Usually ₹200/month = ₹2,400/year. Maximum is ₹2,500 per year."
                        required
                        defaultFreq="monthly"
                        error={errors.professionalTax}
                      />
                    )}
                    {c.key === 'hasEmployerNPS' && (
                      <FrequencyInput
                        id="employerNPS"
                        label="How much does your employer contribute to NPS?"
                        value={data.employerNPS}
                        onChange={(v) => {
                          update({ employerNPS: v })
                          setErrors((prev) => ({ ...prev, employerNPS: undefined }))
                        }}
                        placeholder="0"
                        hint="Check your CTC breakdown or salary slip. This is your employer's contribution, not yours."
                        required
                        error={errors.employerNPS}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        If none of these appear on your slip, leave them all unticked and continue.
      </p>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Continue →
      </button>

      <CommonQuestions ref={faqRef} questions={COMPONENTS_FAQ} />
    </div>
  )
}

const COMPONENTS_FAQ = [
  {
    q: 'What is HRA exactly?',
    a: 'HRA (House Rent Allowance) is a salary component meant to help cover rent. If you actually pay rent and your employer pays you HRA, a portion is tax-free under the old regime. Under the new regime HRA is fully taxable.',
  },
  {
    q: 'What is Professional Tax?',
    a: 'A state government tax (not central) deducted directly from your salary. Most states cap it at ₹2,500 per year. It appears under Deductions on your slip. Only deductible under the old regime.',
  },
  {
    q: 'What is Employer NPS contribution and how is it different from my own NPS?',
    a: "Section 80CCD(2) covers contributions your employer puts into your NPS account on top of your salary. This is deductible in BOTH old and new regimes — one of the few deductions available in the new regime. It's separate from any NPS investments you make yourself.",
  },
  {
    q: "I get HRA but don't pay rent. What do I do?",
    a: 'Tick HRA and enter the amount — HRA always appears in your salary. The tax-free portion needs both HRA AND rent paid, so without rent you simply pay tax on the full HRA. The calculator handles this automatically.',
  },
  {
    q: "What about EPF — should I tick it here?",
    a: 'No. Your own EPF contribution is a tax-saving investment under Section 80C and gets entered later, in the Investments step. This step is only for HRA, Professional Tax, and Employer NPS.',
  },
]
