import { useState } from 'react'
import { computeTax, getOldSlabs } from '../taxEngine.js'
import { NEW_REGIME_SLABS } from '../constants.js'

const EMPTY_REGIME = {
  grossIncome: 0,
  taxableIncome: 0,
  standardDeduction: 0,
  professionalTaxDeduction: 0,
  hraExemption: 0,
  deduction80C: 0,
  deduction80D: 0,
  deductionPersonalNPS: 0,
  employerNPSDeduction: 0,
  deductionHomeLoanInterest: 0,
  deduction80TTA_TTB: 0,
  slabTax: 0,
  rebate: 0,
  marginalRelief: 0,
  cess: 0,
  totalTax: 0,
}

function fmtN(num) {
  return Number(num || 0).toLocaleString('en-IN')
}
function fmt(num) {
  return `₹${fmtN(Math.round(num || 0))}`
}

function slabLabel(prev, upTo) {
  if (prev === 0 && upTo !== null) return `Up to ₹${fmtN(upTo)}`
  if (upTo === null) return `Above ₹${fmtN(prev)}`
  return `₹${fmtN(prev + 1)} – ₹${fmtN(upTo)}`
}

function computeSlabRows(taxableIncome, slabs) {
  const rows = []
  let prev = 0
  for (const slab of slabs) {
    const upper = slab.upTo === null ? Infinity : slab.upTo
    const incomeInBand = Math.max(0, Math.min(taxableIncome, upper) - prev)
    const tax = Math.round(incomeInBand * slab.rate)
    const active = incomeInBand > 0 && slab.rate > 0
    rows.push({
      label: slabLabel(prev, slab.upTo),
      rate: slab.rate,
      incomeInBand,
      tax,
      active,
    })
    prev = slab.upTo === null ? prev : slab.upTo
  }
  return rows
}

export default function TaxPreviewPanel({ data }) {
  const [userPickedRegime, setUserPickedRegime] = useState(null)

  const takeHomeSalary = (Number(data.takeHomeSalaryMonthly) || 0) * 12
  const bonus = data.hasBonus && Number(data.bonus) > 0 ? Number(data.bonus) : 0
  const fdInterest =
    data.hasOtherIncome && Number(data.fdInterest) > 0 ? Number(data.fdInterest) : 0
  const savingsInterest =
    data.hasOtherIncome && Number(data.savingsInterest) > 0 ? Number(data.savingsInterest) : 0
  const hasIncome = takeHomeSalary > 0

  let newRegimeData = { ...EMPTY_REGIME }
  let oldRegimeData = { ...EMPTY_REGIME }
  let computeSuccess = false
  if (hasIncome) {
    try {
      const results = computeTax(data)
      newRegimeData = results.newRegime
      oldRegimeData = results.oldRegime
      computeSuccess = true
    } catch {
      // incomplete data — use zeroes
    }
  }

  const newTotal = newRegimeData.totalTax || 0
  const oldTotal = oldRegimeData.totalTax || 0
  const savings = Math.abs(newTotal - oldTotal)
  const betterRegime = newTotal <= oldTotal ? 'new' : 'old'
  const regime =
    userPickedRegime !== null ? userPickedRegime : computeSuccess ? betterRegime : 'new'

  const activeData = regime === 'new' ? newRegimeData : oldRegimeData
  const slabs = regime === 'new' ? NEW_REGIME_SLABS : getOldSlabs(data.ageGroup)
  const slabRows = computeSuccess ? computeSlabRows(activeData.taxableIncome, slabs) : []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <p className="text-sm font-bold text-gray-900">Your Live Tax Estimate</p>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
          FY 2025-26
        </span>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between gap-2">
        <div className="flex rounded-full border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
          {[
            { val: 'new', label: 'New' },
            { val: 'old', label: 'Old' },
          ].map((opt) => {
            const isActive = regime === opt.val
            const isBest = computeSuccess && betterRegime === opt.val
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => setUserPickedRegime(opt.val)}
                className={`py-1.5 px-3 text-xs font-semibold transition-all rounded-full ${
                  isActive ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
                {isBest && (
                  <span className="ml-1 text-green-600 text-[10px] font-bold">Best</span>
                )}
              </button>
            )
          })}
        </div>
        {computeSuccess && (
          <button
            type="button"
            onClick={() => setUserPickedRegime(regime === 'new' ? 'old' : 'new')}
            className="text-[11px] text-indigo-500 hover:text-indigo-700 underline decoration-dotted underline-offset-2 shrink-0"
          >
            Compare {regime === 'new' ? 'Old' : 'New'} regime
          </button>
        )}
      </div>

      {!hasIncome ? (
        <div className="px-4 py-8 text-center flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path strokeLinecap="round" d="M9 7h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
            </svg>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
            {'Enter your salary to\nsee a live tax estimate'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {computeSuccess && (
            <div className="mx-4 mt-3 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-4 text-white">
              <p className="text-xs text-indigo-200 font-medium mb-1">Estimated Tax Payable</p>
              <p className="text-2xl font-black tracking-tight">{fmt(activeData.totalTax)}</p>
              <p className="text-xs text-indigo-300 mt-1">
                On annual income of {fmt(activeData.grossIncome)}
              </p>
            </div>
          )}

          <div className="px-4 pt-3 pb-1">
            <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Breakdown</p>
          </div>

          <div className="px-4 pb-2">
            <SectionLabel letter="A" text="Your Income" />
            <div className="space-y-0.5">
              <LineRow label="Annual salary (take-home)" amount={fmt(takeHomeSalary)} />
              {bonus > 0 && <LineRow label="Bonus / incentive" amount={fmt(bonus)} />}
              {fdInterest > 0 && <LineRow label="FD interest" amount={fmt(fdInterest)} />}
              {savingsInterest > 0 && (
                <LineRow label="Savings account interest" amount={fmt(savingsInterest)} />
              )}
            </div>
            <ResultBox label="Gross Income" amount={fmt(activeData.grossIncome || 0)} />
          </div>

          <div className="px-4 pb-2">
            <SectionLabel letter="B" text="Deductions (−)" />
            <div className="space-y-0.5">
              <LineRow
                label="Standard deduction"
                amount={`− ${fmt(activeData.standardDeduction || (regime === 'new' ? 75000 : 50000))}`}
                green
              />
              {activeData.professionalTaxDeduction > 0 && (
                <LineRow
                  label="Professional tax"
                  amount={`− ${fmt(activeData.professionalTaxDeduction)}`}
                  green
                />
              )}
              {activeData.employerNPSDeduction > 0 && (
                <LineRow
                  label="Employer NPS contribution"
                  amount={`− ${fmt(activeData.employerNPSDeduction)}`}
                  green
                />
              )}
              {regime === 'old' && activeData.hraExemption > 0 && (
                <LineRow
                  label="HRA exemption"
                  amount={`− ${fmt(activeData.hraExemption)}`}
                  green
                />
              )}
              {regime === 'old' && activeData.deduction80C > 0 && (
                <LineRow
                  label="80C investments"
                  amount={`− ${fmt(activeData.deduction80C)}`}
                  green
                />
              )}
              {regime === 'old' && activeData.deduction80D > 0 && (
                <LineRow
                  label="80D health insurance"
                  amount={`− ${fmt(activeData.deduction80D)}`}
                  green
                />
              )}
              {regime === 'old' && activeData.deductionPersonalNPS > 0 && (
                <LineRow
                  label="Personal NPS 80CCD(1B)"
                  amount={`− ${fmt(activeData.deductionPersonalNPS)}`}
                  green
                />
              )}
              {regime === 'old' && activeData.deductionHomeLoanInterest > 0 && (
                <LineRow
                  label="Home loan interest"
                  amount={`− ${fmt(activeData.deductionHomeLoanInterest)}`}
                  green
                />
              )}
              {regime === 'old' && activeData.deduction80TTA_TTB > 0 && (
                <LineRow
                  label="Savings interest 80TTA/TTB"
                  amount={`− ${fmt(activeData.deduction80TTA_TTB)}`}
                  green
                />
              )}
            </div>
            {regime === 'new' && activeData.employerNPSDeduction === 0 && (
              <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-gray-50 rounded-lg">
                <svg
                  className="w-3 h-3 text-gray-400 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
                </svg>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  New regime: only standard deduction applies.
                </p>
              </div>
            )}
            <ResultBox label="Taxable Income" amount={fmt(activeData.taxableIncome)} indigo />
          </div>

          <div className="px-4 pb-3">
            <SectionLabel letter="C" text="Tax on Slabs" />
            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-2">
              <div className="grid grid-cols-4 gap-1 px-2.5 py-2 border-b border-gray-200 bg-gray-100/50">
                <span className="text-[10px] font-semibold text-gray-500 uppercase">
                  Income Slab
                </span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase text-center">
                  Rate
                </span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase text-right">
                  Your Income
                </span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase text-right">
                  Tax
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {slabRows.length === 0 && (
                  <div className="px-2.5 py-2 text-[11px] text-gray-400 text-center">
                    Enter your salary to see the slab breakdown.
                  </div>
                )}
                {slabRows.map((r, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-4 gap-1 px-2.5 py-1.5 text-[11px] ${
                      r.active
                        ? 'bg-indigo-50/60 text-indigo-700 font-medium'
                        : 'text-gray-400'
                    }`}
                  >
                    <span className="truncate">{r.label}</span>
                    <span className="text-center">{Math.round(r.rate * 100)}%</span>
                    <span className="text-right">{fmt(r.incomeInBand)}</span>
                    <span className="text-right">{fmt(r.tax)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-0.5">
              {activeData.rebate > 0 && (
                <LineRow
                  label="Section 87A rebate"
                  amount={`− ${fmt(activeData.rebate)}`}
                  green
                />
              )}
              {activeData.marginalRelief > 0 && (
                <LineRow
                  label="Marginal relief"
                  amount={`− ${fmt(activeData.marginalRelief)}`}
                  green
                />
              )}
              <LineRow
                label="Health & Education Cess (4%)"
                amount={activeData.cess > 0 ? `+ ${fmt(activeData.cess)}` : '₹0'}
                muted={activeData.cess === 0}
              />
            </div>

            <div className="mt-2 flex justify-between items-center bg-indigo-600 rounded-xl px-3 py-2.5">
              <span className="text-xs font-bold text-indigo-200">Total Tax Payable</span>
              <span className="text-lg font-black text-white">{fmt(activeData.totalTax)}</span>
            </div>
          </div>

          {computeSuccess && savings > 0 && (
            <div className="mx-4 mb-3 flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
              <svg
                className="w-4 h-4 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-xs font-bold text-green-800">
                  {betterRegime === 'new' ? 'New' : 'Old'} Regime saves you {fmt(savings)}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  vs {betterRegime === 'new' ? 'Old' : 'New'} Regime (
                  {fmt(betterRegime === 'new' ? oldTotal : newTotal)})
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <svg
          className="w-3.5 h-3.5 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <p className="text-[11px] text-gray-400">
          100% Private & Secure · Data never leaves your browser
        </p>
      </div>
    </div>
  )
}

function SectionLabel({ letter, text }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
        {letter}
      </span>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{text}</span>
    </div>
  )
}

function LineRow({ label, amount, green, muted }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className={`text-xs ${muted ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <span
        className={`text-xs font-semibold ${
          green ? 'text-green-600' : muted ? 'text-gray-400' : 'text-gray-700'
        }`}
      >
        {amount}
      </span>
    </div>
  )
}

function ResultBox({ label, amount, indigo }) {
  return (
    <div
      className={`flex justify-between items-center rounded-lg px-3 py-2 mt-1.5 ${
        indigo ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-100 border border-gray-200'
      }`}
    >
      <span className={`text-xs font-medium ${indigo ? 'text-indigo-700' : 'text-gray-500'}`}>
        = {label}
      </span>
      <span
        className={`text-sm font-bold ${indigo ? 'text-indigo-800' : 'text-gray-800'}`}
      >
        {amount}
      </span>
    </div>
  )
}
