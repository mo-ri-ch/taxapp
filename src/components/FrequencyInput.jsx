import { useState } from 'react'

export default function FrequencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = '0',
  hint,
  note,
  required = false,
  max,
  prefix = '₹',
  error,
  defaultFreq = 'annual',
}) {
  const [freq, setFreq] = useState(defaultFreq)

  const annualValue = value === '' || value === null || value === undefined ? '' : Number(value)
  const displayValue =
    freq === 'monthly' && annualValue !== ''
      ? Math.round(annualValue / 12)
      : annualValue

  function formatINR(val) {
    if (val === '' || val === null || val === undefined) return ''
    const num = Number(val)
    if (!num) return ''
    return num.toLocaleString('en-IN')
  }

  function handleInput(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') {
      onChange('')
      return
    }
    const num = Number(raw)
    const annual = freq === 'monthly' ? num * 12 : num
    if (max && annual > max) {
      onChange(max)
      return
    }
    onChange(annual)
  }

  const isValid =
    value !== '' && value !== null && value !== undefined && Number(value) > 0
  const hasPrefix = Boolean(prefix)
  const inputPadding = hasPrefix ? 'pl-8 pr-9' : 'px-3'
  const stateClasses = error
    ? 'border-red-300 bg-red-50/30'
    : isValid
      ? 'border-green-300 bg-green-50/30'
      : 'border-gray-200'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="flex rounded-full border border-gray-200 overflow-hidden bg-gray-50 p-0.5 gap-0.5 shrink-0">
          {[
            { val: 'monthly', label: 'Monthly' },
            { val: 'annual', label: 'Per year' },
          ].map((opt) => {
            const active = freq === opt.val
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFreq(opt.val)}
                className={`px-3 py-1 text-xs font-semibold transition-all rounded-full ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative rounded-xl">
        {hasPrefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm font-medium">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formatINR(displayValue)}
          onChange={handleInput}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-invalid={error ? 'true' : undefined}
          className={`block w-full rounded-xl border ${inputPadding} py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none placeholder:text-gray-400 ${stateClasses}`}
        />
        {isValid && !error && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
      </div>

      {freq === 'monthly' && Number(annualValue) > 0 && (
        <p className="text-xs text-indigo-600 font-medium reveal">
          = ₹{Number(annualValue).toLocaleString('en-IN')} per year (auto-calculated)
        </p>
      )}

      {note && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
          {note}
        </p>
      )}

      {hint && (
        <p id={`${id}-hint`} className="text-xs text-gray-400">
          {hint}
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
