import { useState } from 'react'
import { fmt } from '../../utils.js'
import { NEW_REGIME_SLABS } from '../../constants.js'
import { getOldSlabs } from '../../taxEngine.js'

function fmtN(n) {
  return Number(n || 0).toLocaleString('en-IN')
}

function fmtL(n) {
  if (n >= 100000) {
    return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`
  }
  return fmtN(n)
}

function slabLabel(prev, upTo) {
  if (prev === 0) return upTo === null ? 'All' : `0 – ${fmtL(upTo)}`
  return upTo === null ? `${fmtL(prev)}+` : `${fmtL(prev)} – ${fmtL(upTo)}`
}

function computeSlabRows(taxableIncome, slabs) {
  const rows = []
  let prev = 0
  for (const slab of slabs) {
    const upper = slab.upTo === null ? Infinity : slab.upTo
    const taxableInBand = Math.max(0, Math.min(taxableIncome, upper) - prev)
    const tax = Math.round(taxableInBand * slab.rate)
    const active = taxableInBand > 0 && slab.rate > 0
    rows.push({
      label: slabLabel(prev, slab.upTo),
      rate: slab.rate,
      tax,
      active,
    })
    prev = slab.upTo === null ? prev : slab.upTo
  }
  return rows
}

export default function SectionC_DetailedBreakdown({ results, data }) {
  const [open, setOpen] = useState(false)
  const n = results.newRegime
  const o = results.oldRegime
  const winner = results.recommended

  const newTaxAfterRebate = Math.max(0, n.slabTax - n.rebate - (n.marginalRelief || 0))
  const oldTaxAfterRebate = Math.max(0, o.slabTax - o.rebate)
  const newSlabRows = computeSlabRows(n.taxableIncome, NEW_REGIME_SLABS)
  const oldSlabRows = computeSlabRows(o.taxableIncome, getOldSlabs(data?.ageGroup))

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-700">See detailed comparison</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4">
          {/* Column headers */}
          <div className="flex mt-3 mb-1">
            <div className="flex-1 pl-7" />
            <div
              className={`w-[27%] text-right text-[11px] font-semibold ${
                winner === 'new' ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              New Regime
              {winner === 'new' && <CheckIcon />}
            </div>
            <div
              className={`w-[27%] text-right text-[11px] font-semibold ${
                winner === 'old' ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              Old Regime
              {winner === 'old' && <CheckIcon />}
            </div>
          </div>

          {/* Step 1 — Total income */}
          <SectionHeader step="1" label="Your total income" />
          <Row label="Gross income" newVal={fmt(n.grossIncome)} oldVal={fmt(o.grossIncome)} />

          {/* Step 2 — Deductions */}
          <SectionHeader step="2" label="Subtract deductions" />
          <Row
            label="Standard deduction"
            newVal={`− ${fmt(n.standardDeduction)}`}
            oldVal={`− ${fmt(o.standardDeduction)}`}
            deduction
          />
          {o.professionalTaxDeduction > 0 && (
            <Row
              label="Professional tax"
              newVal=""
              oldVal={`− ${fmt(o.professionalTaxDeduction)}`}
              deduction
              dimNew
            />
          )}
          <Row
            label="HRA exemption"
            newVal=""
            oldVal={o.hraExemption > 0 ? `− ${fmt(o.hraExemption)}` : '₹0'}
            deduction={o.hraExemption > 0}
            dimNew
          />
          <Row
            label="80C investments"
            newVal=""
            oldVal={o.deduction80C > 0 ? `− ${fmt(o.deduction80C)}` : '₹0'}
            deduction={o.deduction80C > 0}
            dimNew
          />
          {o.deduction80D > 0 && (
            <Row
              label="80D health insurance"
              newVal=""
              oldVal={`− ${fmt(o.deduction80D)}`}
              deduction
              dimNew
            />
          )}
          {o.deductionPersonalNPS > 0 && (
            <Row
              label="Personal NPS 80CCD(1B)"
              newVal=""
              oldVal={`− ${fmt(o.deductionPersonalNPS)}`}
              deduction
              dimNew
            />
          )}
          {(n.employerNPSDeduction > 0 || o.employerNPSDeduction > 0) && (
            <Row
              label="Employer NPS 80CCD(2)"
              newVal={n.employerNPSDeduction > 0 ? `− ${fmt(n.employerNPSDeduction)}` : '₹0'}
              oldVal={o.employerNPSDeduction > 0 ? `− ${fmt(o.employerNPSDeduction)}` : '₹0'}
              deduction
            />
          )}
          {o.deductionHomeLoanInterest > 0 && (
            <Row
              label="Home loan interest"
              newVal=""
              oldVal={`− ${fmt(o.deductionHomeLoanInterest)}`}
              deduction
              dimNew
            />
          )}
          {o.deduction80TTA_TTB > 0 && (
            <Row
              label="Savings interest 80TTA/TTB"
              newVal=""
              oldVal={`− ${fmt(o.deduction80TTA_TTB)}`}
              deduction
              dimNew
            />
          )}

          {/* Step 3 — Taxable income */}
          <SectionHeader step="3" label="Taxable income" />
          <ResultRow
            label="Taxable income"
            newVal={fmt(n.taxableIncome)}
            oldVal={fmt(o.taxableIncome)}
          />

          {/* Step 4 — Apply tax slabs */}
          <SectionHeader step="4" label="Apply tax slabs" />
          <div className="grid grid-cols-2 gap-2 mt-2 mb-3 pl-7">
            <SlabTable
              label="New Regime"
              slabRows={newSlabRows}
              totalTax={n.slabTax}
              isWinner={winner === 'new'}
            />
            <SlabTable
              label="Old Regime"
              slabRows={oldSlabRows}
              totalTax={o.slabTax}
              isWinner={winner === 'old'}
            />
          </div>

          <Row
            label="Section 87A rebate"
            newVal={n.rebate > 0 ? `− ${fmt(n.rebate)}` : '₹0'}
            oldVal={o.rebate > 0 ? `− ${fmt(o.rebate)}` : '₹0'}
            deduction={n.rebate > 0 || o.rebate > 0}
          />

          {n.marginalRelief > 0 && (
            <Row
              label="Marginal relief"
              newVal={`− ${fmt(n.marginalRelief)}`}
              oldVal=""
              deduction
              dimOld
            />
          )}

          {(n.rebate > 0 || o.rebate > 0) && (
            <div className="flex items-center pl-7">
              <div className="flex-1 py-1.5 pr-3 text-xs font-semibold text-gray-700">
                Tax after rebate
              </div>
              <TaxAfterRebateCell value={newTaxAfterRebate} />
              <TaxAfterRebateCell value={oldTaxAfterRebate} />
            </div>
          )}

          <Row
            label="4% Health & Education Cess"
            newVal={n.cess > 0 ? `+ ${fmt(n.cess)}` : '₹0'}
            oldVal={o.cess > 0 ? `+ ${fmt(o.cess)}` : '₹0'}
          />
          {(newTaxAfterRebate === 0 || oldTaxAfterRebate === 0) && (
            <p className="text-xs text-gray-400 italic pl-7 mt-1">
              Cess is 4% of tax after rebate — when tax is zero, cess is also zero.
            </p>
          )}

          {/* Final total */}
          <ResultRow
            label="Final tax payable"
            newVal={fmt(n.totalTax)}
            oldVal={fmt(o.totalTax)}
            isWinner={winner}
            final
          />

          <p className="text-xs text-gray-400 mt-3 leading-relaxed">
            Green amounts (−) reduce your taxable income. Deduction caps already applied. "——" =
            not available in that regime.
          </p>
        </div>
      )}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="inline-block w-3 h-3 ml-1 text-green-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function SectionHeader({ step, label }) {
  return (
    <div className="pt-4 pb-1 flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
        {step}
      </span>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  )
}

function Row({ label, newVal, oldVal, deduction, dimNew, dimOld }) {
  return (
    <div className="flex border-t border-gray-50">
      <div className="flex-1 py-1.5 pr-3 text-xs text-gray-600 pl-7">{label}</div>
      <div
        className={`w-[27%] shrink-0 py-1.5 px-2 text-xs text-right ${
          dimNew
            ? 'text-gray-300'
            : deduction
              ? 'text-green-700 font-medium'
              : 'text-gray-700'
        }`}
      >
        {dimNew ? '——' : newVal || '₹0'}
      </div>
      <div
        className={`w-[27%] shrink-0 py-1.5 pl-2 text-xs text-right ${
          dimOld
            ? 'text-gray-300'
            : deduction
              ? 'text-green-700 font-medium'
              : 'text-gray-700'
        }`}
      >
        {dimOld ? '——' : oldVal || '₹0'}
      </div>
    </div>
  )
}

function ResultRow({ label, newVal, oldVal, isWinner, final }) {
  const bg = final ? 'bg-gray-100' : 'bg-indigo-50'
  const winnerNew = final && isWinner === 'new'
  const winnerOld = final && isWinner === 'old'
  return (
    <div className="pt-2 pb-1">
      <div className={`rounded-lg py-2.5 flex items-center ${bg}`}>
        <div className="flex-1 pl-7 pr-3 text-xs font-semibold text-gray-800">= {label}</div>
        <div
          className={`w-[27%] shrink-0 px-2 text-right font-semibold ${
            winnerNew ? 'text-green-700 text-sm' : 'text-xs text-gray-700'
          }`}
        >
          {newVal}
        </div>
        <div
          className={`w-[27%] shrink-0 pl-2 text-right font-semibold ${
            winnerOld ? 'text-green-700 text-sm' : 'text-xs text-gray-700'
          }`}
        >
          {oldVal}
        </div>
      </div>
    </div>
  )
}

function TaxAfterRebateCell({ value }) {
  return (
    <div
      className={`w-[27%] shrink-0 px-2 text-right text-xs font-semibold ${
        value === 0 ? 'text-green-600' : 'text-gray-800'
      }`}
    >
      {value === 0 ? '₹0 — no tax' : fmt(value)}
    </div>
  )
}

function SlabTable({ label, slabRows, totalTax, isWinner }) {
  return (
    <div
      className={`rounded-lg border overflow-hidden flex flex-col ${
        isWinner ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200 bg-gray-50/50'
      }`}
    >
      <div className="px-2 py-1.5 border-b border-gray-100 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gray-700">{label}</span>
        {isWinner && <CheckIcon />}
      </div>
      <div className="divide-y divide-gray-100 flex-1">
        {slabRows.map((r, i) => (
          <div
            key={i}
            className={`flex items-center px-2 py-1 text-xs gap-1 ${
              r.active ? 'bg-indigo-50/60 text-indigo-700 font-medium' : 'text-gray-400'
            }`}
          >
            <span className="flex-1 whitespace-nowrap">{r.label}</span>
            <span className="w-8 text-center">{Math.round(r.rate * 100)}%</span>
            <span className="w-16 text-right">{fmt(r.tax)}</span>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-gray-200 px-2 py-1.5 flex items-center justify-between bg-white">
        <span className="text-[11px] font-bold text-gray-700">Slab tax</span>
        <span className="text-xs font-bold text-gray-900">{fmt(totalTax)}</span>
      </div>
    </div>
  )
}
