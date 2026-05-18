import { useState } from 'react'
import NumberInput from '../NumberInput.jsx'
import CommonQuestions from '../CommonQuestions.jsx'
import {
  CAP_80D_SELF_BELOW60,
  CAP_80D_SELF_ABOVE60,
  CAP_80D_PARENTS_BELOW60,
  CAP_80D_PARENTS_ABOVE60,
} from '../../constants.js'

export default function S10_HealthInsurance({ data, update, goNext }) {
  const [errors, setErrors] = useState({})

  const isSelfSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  const selfCap = isSelfSenior ? CAP_80D_SELF_ABOVE60 : CAP_80D_SELF_BELOW60
  const parentsCap = data.parentsAbove60 ? CAP_80D_PARENTS_ABOVE60 : CAP_80D_PARENTS_BELOW60

  function toggleSelf(val) {
    if (val === false) {
      update({ hasSelfInsurance: false, selfInsurancePremium: '' })
    } else {
      update({ hasSelfInsurance: true })
    }
    setErrors((prev) => ({
      ...prev,
      hasSelfInsurance: undefined,
      selfInsurancePremium: undefined,
    }))
  }

  function toggleParent(val) {
    if (val === false) {
      update({
        hasParentInsurance: false,
        parentInsurancePremium: '',
        parentsAbove60: null,
      })
    } else {
      update({ hasParentInsurance: true })
    }
    setErrors((prev) => ({
      ...prev,
      hasParentInsurance: undefined,
      parentInsurancePremium: undefined,
      parentsAbove60: undefined,
    }))
  }

  function setParentAge(val) {
    update({ parentsAbove60: val })
    setErrors((prev) => ({ ...prev, parentsAbove60: undefined }))
  }

  function handleContinue() {
    const next = {}
    if (data.hasSelfInsurance === null) next.hasSelfInsurance = 'Answer the first card.'
    if (data.hasParentInsurance === null) next.hasParentInsurance = 'Answer the second card.'
    if (data.hasSelfInsurance === true && !(Number(data.selfInsurancePremium) > 0)) {
      next.selfInsurancePremium = 'Enter your annual premium.'
    }
    if (data.hasParentInsurance === true) {
      if (data.parentsAbove60 === null) next.parentsAbove60 = "Tell us your parents' age group."
      if (!(Number(data.parentInsurancePremium) > 0)) {
        next.parentInsurancePremium = 'Enter the annual premium you pay.'
      }
    }
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    goNext()
  }

  const bothAnsweredNo =
    data.hasSelfInsurance === false && data.hasParentInsurance === false

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">🏥</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Health Insurance
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Do you pay for health insurance?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          There are <span className="font-semibold">two separate tax benefits</span> here — one for
          insuring yourself and one for insuring your parents. Answer both cards below.
        </p>
        <p className="text-xs text-gray-400 mt-1">Section 80D — old regime only.</p>
      </div>

      <InsuranceCard
        number="1"
        category="Your policy"
        title="For you, your spouse or children"
        subtitle="Any health insurance policy that covers you or your immediate family"
        cap={selfCap}
        checked={data.hasSelfInsurance}
        onToggle={toggleSelf}
        amount={data.selfInsurancePremium}
        onAmountChange={(v) => {
          update({ selfInsurancePremium: v })
          setErrors((prev) => ({ ...prev, selfInsurancePremium: undefined }))
        }}
        amountError={errors.selfInsurancePremium}
      />

      {errors.hasSelfInsurance && (
        <p role="alert" className="text-xs text-red-600">
          {errors.hasSelfInsurance}
        </p>
      )}

      <InsuranceCard
        number="2"
        category="Your parents' policy"
        title="For your mother or father"
        subtitle="A separate policy covering your own parents (not in-laws)"
        cap={parentsCap}
        checked={data.hasParentInsurance}
        onToggle={toggleParent}
        amount={data.parentInsurancePremium}
        onAmountChange={(v) => {
          update({ parentInsurancePremium: v })
          setErrors((prev) => ({ ...prev, parentInsurancePremium: undefined }))
        }}
        amountError={errors.parentInsurancePremium}
      >
        <div className="space-y-2 pt-3">
          <p className="text-xs font-medium text-gray-700">
            How old are your parents?
            <span className="text-red-500 ml-0.5">*</span>
          </p>
          <p className="text-[11px] text-gray-500">
            This changes the cap — ₹50,000 if above 60, ₹25,000 if below 60.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { val: true, label: 'Above 60' },
              { val: false, label: 'Below 60' },
            ].map((opt) => {
              const active = data.parentsAbove60 === opt.val
              return (
                <button
                  key={String(opt.val)}
                  type="button"
                  onClick={() => setParentAge(opt.val)}
                  className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    active
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          {errors.parentsAbove60 && (
            <p role="alert" className="text-xs text-red-600">
              {errors.parentsAbove60}
            </p>
          )}
        </div>
      </InsuranceCard>

      {errors.hasParentInsurance && (
        <p role="alert" className="text-xs text-red-600">
          {errors.hasParentInsurance}
        </p>
      )}

      {bothAnsweredNo && (
        <div className="reveal px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          No 80D deduction will be applied. If you do pay a premium that an employer covers as a
          group policy, that does not qualify — only your own out-of-pocket premium counts.
        </div>
      )}

      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Continue →
      </button>

      <CommonQuestions questions={INSURANCE_FAQ} />
    </div>
  )
}

function InsuranceCard({
  number,
  category,
  title,
  subtitle,
  cap,
  checked,
  onToggle,
  amount,
  onAmountChange,
  amountError,
  children,
}) {
  const headerBg = checked === true ? 'bg-indigo-50' : 'bg-gray-50'
  return (
    <div className="rounded-xl border-2 border-gray-200 overflow-hidden">
      <div className={`px-4 py-3 ${headerBg}`}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
            {number}
          </span>
          <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide">
            {category}
          </span>
        </div>
        <div className="mt-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <p className="text-xs font-medium text-gray-700">
          Do you personally pay a premium for this group?
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { val: true, label: 'Yes, I pay' },
            { val: false, label: 'No' },
          ].map((opt) => {
            const active = checked === opt.val
            return (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => onToggle(opt.val)}
                className={`py-2 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  active
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {checked === true && (
        <div className="px-4 pb-4 bg-indigo-50 border-t border-indigo-100 pt-3 space-y-2">
          <NumberInput
            id={`premium-${number}`}
            label="How much do you pay per year?"
            value={amount}
            onChange={onAmountChange}
            placeholder="e.g. 18,000"
            note={`Tax benefit capped at ₹${cap.toLocaleString('en-IN')} per year.`}
            required
            error={amountError}
          />
          {children}
        </div>
      )}
    </div>
  )
}

const INSURANCE_FAQ = [
  {
    q: 'My company pays for my group health insurance. Can I claim it?',
    a: "No. Section 80D only allows deduction for premiums YOU personally pay. If your employer pays the premium as a group cover, you can't claim it — but a top-up policy you bought yourself does count.",
  },
  {
    q: 'My father pays for my parents\' insurance. Can I claim it?',
    a: 'No. Whoever physically pays the premium gets the deduction. If your father pays, he can claim it on his own return. The premium must come from your pocket for you to claim it.',
  },
  {
    q: 'Does in-laws\' insurance count under "parents"?',
    a: 'No. Section 80D recognises only your own parents (biological or adoptive). In-laws are excluded by law. If your spouse pays for their own parents, they can claim it on their return.',
  },
  {
    q: "My parents are above 60 but I haven't insured them. Can I still claim?",
    a: 'No. The deduction applies only to actual premium paid. However, if you pay for their preventive health check-ups (capped at ₹5,000), that does qualify even without a policy. We do not capture this case here — talk to a CA if relevant.',
  },
  {
    q: 'I have no health insurance for anyone. Should I pick anything?',
    a: "Pick 'No' on both cards. You get no 80D deduction, and that's reflected in your tax estimate.",
  },
]
