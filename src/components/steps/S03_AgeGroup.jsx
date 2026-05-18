import { useState } from 'react'
import CommonQuestions from '../CommonQuestions.jsx'

const AGE_OPTIONS = [
  {
    value: 'below60',
    label: 'Below 60 years',
    tag: null,
    description: 'Basic exemption: ₹2,50,000 under old regime',
  },
  {
    value: 'senior',
    label: '60 to 79 years',
    tag: 'Senior Citizen',
    description: 'Basic exemption: ₹3,00,000 under old regime',
  },
  {
    value: 'superSenior',
    label: '80 years or above',
    tag: 'Super Senior Citizen',
    description: 'Basic exemption: ₹5,00,000 under old regime',
  },
]

export default function S03_AgeGroup({ data, update, goNext }) {
  const [error, setError] = useState('')
  const selected = data.ageGroup

  function handleSelect(value) {
    update({ ageGroup: value })
    setError('')
  }

  function handleContinue() {
    if (!selected) {
      setError('Please select your age group to continue.')
      return
    }
    goNext()
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span aria-hidden="true">🎂</span>
          </div>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
            About You
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          Which age group do you fall in?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tax slabs differ for senior citizens under the old regime.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">Age group</legend>
        {AGE_OPTIONS.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <label
              key={opt.value}
              className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="ageGroup"
                value={opt.value}
                checked={isSelected}
                onChange={() => handleSelect(opt.value)}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                    {opt.tag && (
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100 rounded-full px-2 py-0.5">
                        {opt.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                </div>
              </div>
            </label>
          )
        })}
      </fieldset>

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

      <CommonQuestions questions={AGE_FAQ} />
    </div>
  )
}

const AGE_FAQ = [
  {
    q: 'Why does age matter for tax calculation?',
    a: 'Under the old regime, the basic exemption limit goes up with age — ₹2.5 lakh for under-60, ₹3 lakh for senior citizens (60–79), and ₹5 lakh for super-senior citizens (80+). The new regime applies the same slabs to everyone regardless of age.',
  },
  {
    q: 'What age should I enter — my age now or at year-end?',
    a: 'Use your age as of 31 March 2026 (the end of FY 2025-26). If you turn 60 during the year, you qualify as a senior citizen for the entire financial year.',
  },
  {
    q: 'Does this apply to NRIs as well?',
    a: 'No. Senior and super-senior categories are for resident individuals only. NRIs follow the same slabs as under-60 residents and are out of scope for this calculator.',
  },
]
