import { useRef, useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'
import ConfusedLink from '../ConfusedLink.jsx'
import { CAP_80C, CAP_80CCD1B } from '../../constants.js'
import { calc80CTotal } from '../../utils.js'

const INVESTMENT_ITEMS = [
  {
    key: 'epf',
    label: 'EPF — money deducted from my salary every month',
    emoji: '💼',
    tag: '80C',
    description:
      'Employee Provident Fund. Your employer deducts ~12% of your basic pay every month — that share is yours and counts under 80C.',
  },
  {
    key: 'lic',
    label: 'LIC or other life insurance premiums',
    emoji: '🛡️',
    tag: '80C',
    description:
      'Premiums you personally pay for a term plan, endowment plan, or any life insurance policy.',
  },
  {
    key: 'ppf',
    label: 'PPF — Public Provident Fund',
    emoji: '📮',
    tag: '80C',
    description:
      'A government savings scheme with a 15-year lock-in. Annual contributions of up to ₹1.5 lakh qualify under 80C.',
  },
  {
    key: 'elss',
    label: 'ELSS — Tax saving mutual funds (SIP)',
    emoji: '📈',
    tag: '80C',
    description:
      'Equity Linked Savings Scheme. A type of mutual fund with a 3-year lock-in. Most people pay via monthly SIP.',
  },
  {
    key: 'tuition',
    label: "Children's school or college tuition fees",
    emoji: '🎓',
    tag: '80C',
    description:
      'Tuition fees you paid for up to 2 children at any school, college, or university in India.',
  },
  {
    key: 'homeLoanPrincipal',
    label: 'Home loan — principal repayment',
    emoji: '🏡',
    tag: '80C',
    description:
      'The principal portion of your home loan EMI (not interest). Your loan certificate shows the split.',
  },
  {
    key: 'nsc',
    label: 'NSC or Post Office time deposit',
    emoji: '📬',
    tag: '80C',
    description:
      'National Savings Certificate (NSC) or Post Office Fixed Deposits (5-year tenure).',
  },
]

const FREQ_DEFAULTS = {
  epf: 'monthly',
  elss: 'monthly',
  homeLoanPrincipal: 'monthly',
  ppf: 'annual',
  lic: 'annual',
}

function FreqToggle({ freq, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-indigo-200 overflow-hidden bg-indigo-50/50 p-0.5 gap-0.5">
      {[
        { val: 'monthly', label: 'Per month' },
        { val: 'annual', label: 'Per year' },
      ].map((opt) => {
        const active = freq === opt.val
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              active
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-indigo-400 hover:text-indigo-600'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function S09_TaxSavingInvestments({ data, update, goNext }) {
  const [errors, setErrors] = useState({})
  const faqRef = useRef(null)
  const [frequencies, setFrequencies] = useState(() => {
    const init = {}
    INVESTMENT_ITEMS.forEach(({ key }) => {
      init[key] = FREQ_DEFAULTS[key] || 'annual'
    })
    return init
  })
  const [npsFreq, setNpsFreq] = useState('annual')

  function toggleItem(key) {
    const current = data.has80CItems || []
    const has = current.includes(key)
    const nextItems = has ? current.filter((k) => k !== key) : [...current, key]
    const nextValues = { ...data.investments80C }
    if (has) nextValues[key] = ''
    update({ has80CItems: nextItems, investments80C: nextValues })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function setItemFreq(key, freq) {
    setFrequencies((prev) => ({ ...prev, [key]: freq }))
  }

  function displayVal(key) {
    const stored = Number(data.investments80C?.[key]) || 0
    if (!stored) return ''
    return frequencies[key] === 'monthly' ? Math.round(stored / 12) : stored
  }

  function handleItemChange(key, v) {
    const num = v === '' ? '' : Number(v)
    const annual = num === '' ? '' : frequencies[key] === 'monthly' ? num * 12 : num
    update({
      investments80C: { ...data.investments80C, [key]: annual },
    })
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function setNpsYesNo(val) {
    if (val === false) {
      update({ hasPersonalNPS: false, personalNPS: '' })
    } else {
      update({ hasPersonalNPS: true })
    }
    setErrors((prev) => ({ ...prev, hasPersonalNPS: undefined, personalNPS: undefined }))
  }

  function npsDisplayVal() {
    const stored = Number(data.personalNPS) || 0
    if (!stored) return ''
    return npsFreq === 'monthly' ? Math.round(stored / 12) : stored
  }

  function handleNpsChange(v) {
    const num = v === '' ? '' : Number(v)
    const annual = num === '' ? '' : npsFreq === 'monthly' ? num * 12 : num
    update({ personalNPS: annual })
    setErrors((prev) => ({ ...prev, personalNPS: undefined }))
  }

  function handleContinue() {
    const next = {}
    for (const it of INVESTMENT_ITEMS) {
      if ((data.has80CItems || []).includes(it.key)) {
        if (!(Number(data.investments80C?.[it.key]) > 0)) {
          next[it.key] = 'Enter an amount greater than ₹0.'
        }
      }
    }
    if (data.hasPersonalNPS === null) {
      next.hasPersonalNPS = 'Tell us whether you contribute to NPS personally.'
    }
    if (data.hasPersonalNPS === true && !(Number(data.personalNPS) > 0)) {
      next.personalNPS = 'Enter your annual personal NPS amount.'
    }
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    goNext()
  }

  const total80C = calc80CTotal(data)
  const cappedTotal = Math.min(total80C, CAP_80C)
  const remaining = Math.max(0, CAP_80C - cappedTotal)
  const hitCap = total80C >= CAP_80C
  const progressPct = Math.min(100, Math.round((cappedTotal / CAP_80C) * 100))
  const checkedKeys = data.has80CItems || []

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">📊</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Tax Saving Investments
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Do you make any of these investments?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          These reduce your tax under the old regime only. Tick all that apply.{' '}
          <ConfusedLink faqRef={faqRef} label="What are these?" />
        </p>
      </div>

      <div className="space-y-2">
        {INVESTMENT_ITEMS.map((c) => {
          const checked = checkedKeys.includes(c.key)
          const hasFreqToggle = Boolean(FREQ_DEFAULTS[c.key])
          const freq = frequencies[c.key]
          const value = displayVal(c.key)
          const error = errors[c.key]
          return (
            <div
              key={c.key}
              className={`rounded-xl border-2 overflow-hidden transition-all ${
                checked ? 'border-indigo-600' : 'border-gray-200'
              }`}
            >
              <label
                className={`flex items-start gap-3 px-3 py-3 cursor-pointer ${
                  checked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleItem(c.key)}
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
                <div className="px-3 pb-3 bg-indigo-50 border-t border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-3">
                    <span className="text-xs text-indigo-600 font-medium">
                      {hasFreqToggle ? 'How are you entering this?' : 'Enter the annual total.'}
                    </span>
                    {hasFreqToggle && (
                      <FreqToggle freq={freq} onChange={(f) => setItemFreq(c.key, f)} />
                    )}
                  </div>
                  <NumberInput
                    id={`inv-${c.key}`}
                    label={hasFreqToggle && freq === 'monthly' ? 'Amount per month' : 'Amount per year'}
                    value={value}
                    onChange={(v) => handleItemChange(c.key, v)}
                    placeholder="e.g. 5,000"
                    required
                    error={error}
                  />
                  {hasFreqToggle && freq === 'monthly' && Number(data.investments80C?.[c.key]) > 0 && (
                    <p className="text-xs text-indigo-600">
                      = ₹{Number(data.investments80C[c.key]).toLocaleString('en-IN')} per year
                      (what we use for tax calculation)
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {checkedKeys.length > 0 && (
        <div className="reveal p-4 bg-white border-2 border-gray-200 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Your 80C total</span>
            <span
              className={`text-sm font-bold ${
                hitCap ? 'text-green-600' : 'text-gray-900'
              }`}
            >
              ₹{cappedTotal.toLocaleString('en-IN')} / ₹1,50,000
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${hitCap ? 'bg-green-500' : 'bg-indigo-600'} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {hitCap ? (
            <p className="text-xs text-green-700 font-medium">
              You've hit the ₹1,50,000 cap — extra investments don't reduce tax further under 80C.
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              ₹{remaining.toLocaleString('en-IN')} more can still earn a tax benefit.
            </p>
          )}
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 space-y-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Do you personally invest in NPS?
            <span className="text-red-500 ml-0.5">*</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            NPS = National Pension System. A government retirement scheme — an extra ₹50,000 deduction
            under Section 80CCD(1B), over and above the ₹1.5L 80C cap.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { val: true, label: 'Yes' },
            { val: false, label: 'No' },
          ].map((opt) => {
            const active = data.hasPersonalNPS === opt.val
            return (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setNpsYesNo(opt.val)}
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
        {errors.hasPersonalNPS && (
          <p role="alert" className="text-xs text-red-600">
            {errors.hasPersonalNPS}
          </p>
        )}
        {data.hasPersonalNPS === true && (
          <div className="reveal space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-indigo-600 font-medium">
                How are you entering this?
              </span>
              <FreqToggle freq={npsFreq} onChange={setNpsFreq} />
            </div>
            <NumberInput
              id="personalNPS"
              label={npsFreq === 'monthly' ? 'Amount per month' : 'Amount per year'}
              value={npsDisplayVal()}
              onChange={handleNpsChange}
              placeholder="e.g. 4,000"
              note={`Capped at ₹${CAP_80CCD1B.toLocaleString('en-IN')} for deduction. Any extra doesn't reduce tax further.`}
              required
              error={errors.personalNPS}
            />
            {npsFreq === 'monthly' && Number(data.personalNPS) > 0 && (
              <p className="text-xs text-indigo-600">
                = ₹{Number(data.personalNPS).toLocaleString('en-IN')} per year (what we use for tax
                calculation)
              </p>
            )}
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

      <CommonQuestions ref={faqRef} questions={INVESTMENTS_FAQ} />
    </div>
  )
}

const INVESTMENTS_FAQ = [
  {
    q: 'What is the ₹1.5 lakh 80C limit?',
    a: 'All 80C investments combined — EPF + LIC + PPF + ELSS + tuition + home-loan principal + NSC — are capped at ₹1,50,000 per year. Anything beyond that does not reduce your taxable income further. The new regime ignores 80C entirely.',
  },
  {
    q: 'What part of my EPF counts under 80C?',
    a: "Only your own contribution (the deduction from your salary) — typically 12% of your basic pay. Your employer's matching contribution does not count under 80C for you (it's deducted under 80CCD(2) instead, and is available in both regimes).",
  },
  {
    q: 'How is personal NPS different from EPF?',
    a: 'EPF is mandatory and goes under 80C with the ₹1.5L cap shared with PPF, LIC, etc. Personal NPS (80CCD(1B)) is voluntary and gives you an ADDITIONAL ₹50,000 deduction on top of 80C. They are stacked, not exclusive.',
  },
  {
    q: 'For home loan, do I enter principal or interest here?',
    a: 'Principal repayment only. The interest portion is a separate deduction (Section 24(b), capped at ₹2 lakh) and shows up in the next-but-one step. Your bank\'s home loan interest certificate splits the year\'s EMI into principal and interest.',
  },
  {
    q: 'I invest more than ₹1.5L in 80C. Should I still enter the full amount?',
    a: 'Yes, enter the actual amount. The calculator will silently cap it at ₹1.5L when computing tax, but seeing your real total helps you decide where to redirect surplus contributions next year.',
  },
]
