import { useState } from 'react'
import CommonQuestions from '../CommonQuestions.jsx'

export default function S07_PaysRent({ data, update, goNext, skipTo }) {
  const [error, setError] = useState('')

  function setYesNo(val) {
    update({ paysRent: val })
    setError('')
  }

  function handleContinue() {
    if (data.paysRent === null) {
      setError('Please answer Yes or No to continue.')
      return
    }
    setError('')
    if (data.paysRent === false) {
      skipTo(9)
    } else {
      goNext()
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">🏠</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            Housing
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Do you live in a rented house and personally pay the rent?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Rent affects HRA exemption — a tax benefit available only under the old regime.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {[
          { val: true, label: 'Yes, I pay rent' },
          { val: false, label: 'No' },
        ].map((opt) => {
          const active = data.paysRent === opt.val
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

      {data.paysRent === false && (
        <div className="reveal px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            We'll skip the HRA exemption section. If you own a home with a loan or your parents pay rent on your behalf,
            you may have other deductions later — we'll cover those.
          </p>
        </div>
      )}

      {data.paysRent === true && (
        <div className="reveal px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
          Next we'll ask a couple of details about your rent so we can calculate your HRA exemption correctly.
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

      <CommonQuestions questions={PAYS_RENT_FAQ} />
    </div>
  )
}

const PAYS_RENT_FAQ = [
  {
    q: 'I live with my parents and pay them rent. Does that count?',
    a: 'Yes, if you actually transfer rent to them and they declare it as income, it counts for HRA exemption. The rent must be reasonable for the area, and ideally documented via a rent agreement and bank transfers. Cash arrangements without paperwork are risky if your employer or the IT department asks for proof.',
  },
  {
    q: 'My spouse pays the rent. Should I say yes?',
    a: "Pick 'No' unless you personally pay or jointly split the rent. HRA exemption applies only to the person actually paying rent from their own income.",
  },
  {
    q: 'I own my house. What should I pick?',
    a: "Pick 'No'. HRA exemption is only for people living in rented accommodation. If you have a home loan on a self-occupied house, you can still claim interest deduction under Section 24(b) — we'll ask about that later.",
  },
]
