import { useState } from 'react'
import { fmt, toNum } from '../../utils.js'

function buildRows(results, data) {
  const rows = []
  const isSenior = data?.ageGroup === 'senior' || data?.ageGroup === 'superSenior'
  const o = results.oldRegime

  // Salary income (always)
  rows.push({
    what: 'Salary income',
    taxName: 'Income from Salary',
    treatment:
      'Taxable in both regimes — your annual take-home is treated as the salary base for this calculator.',
  })

  // HRA
  if (data?.hasHRA && toNum(data.hraMonthly) > 0) {
    if (data.paysRent) {
      rows.push({
        what: 'HRA from your company',
        taxName: 'Part of Salary / Section 10(13A)',
        treatment: `Partially exempt under old regime. Your exemption: ${fmt(o.hraExemption)}. Fully taxable under new regime.`,
      })
    } else {
      rows.push({
        what: 'HRA from your company',
        taxName: 'Part of Salary / Section 10(13A)',
        treatment:
          'Fully taxable in both regimes since no rent is paid. HRA only becomes partially tax-free when you actually pay rent and live in rented accommodation.',
      })
    }
  }

  // Bonus
  if (data?.hasBonus && toNum(data.bonus) > 0) {
    rows.push({
      what: 'Bonus / incentive',
      taxName: 'Income from Salary',
      treatment: 'Fully taxable in both regimes — bonuses are treated as regular salary income.',
    })
  }

  // FD interest
  if (data?.hasOtherIncome && toNum(data.fdInterest) > 0) {
    rows.push({
      what: 'FD interest',
      taxName: 'Income from Other Sources',
      treatment: isSenior
        ? `Included with savings interest under 80TTB (₹50,000 cap, old regime only). New regime offers no deduction. Bank TDS of 10% applies past ₹50,000.`
        : 'Added to your taxable income at slab rates. Below 60: no 80TTA/TTB deduction on FD interest. Bank TDS of 10% kicks in past ₹40,000.',
    })
  }

  // Savings interest
  if (data?.hasOtherIncome && toNum(data.savingsInterest) > 0) {
    rows.push({
      what: 'Savings account interest',
      taxName: isSenior ? 'Section 80TTB' : 'Section 80TTA',
      treatment: isSenior
        ? `Deductible up to ₹50,000 in old regime (combined with FD interest). Your deduction: ${fmt(o.deduction80TTA_TTB)}.`
        : `Deductible up to ₹10,000 in old regime. Your deduction: ${fmt(o.deduction80TTA_TTB)}. Not available in new regime.`,
    })
  }

  // Standard deduction (always)
  rows.push({
    what: 'Standard deduction',
    taxName: 'Section 16(ia)',
    treatment:
      'Auto-applied. ₹75,000 in new regime, ₹50,000 in old regime — no proofs needed, no action required from you.',
  })

  // Professional tax
  if (data?.hasProfTax && toNum(data.professionalTax) > 0) {
    rows.push({
      what: 'Professional tax',
      taxName: 'Section 16(iii)',
      treatment: `Old regime only. Deductible up to ₹2,500 per year. Your deduction: ${fmt(o.professionalTaxDeduction)}. New regime ignores professional tax entirely.`,
    })
  }

  // 80C investments
  if ((data?.has80CItems || []).length > 0) {
    const totalEntered = (data.has80CItems || []).reduce(
      (sum, key) => sum + toNum(data.investments80C?.[key]),
      0,
    )
    rows.push({
      what: 'EPF, LIC, PPF, ELSS, and other 80C investments',
      taxName: 'Section 80C',
      treatment:
        totalEntered > o.deduction80C
          ? `You entered ${fmt(totalEntered)}; the ₹1,50,000 cap was applied so your deduction is ${fmt(o.deduction80C)}. Old regime only.`
          : `Your deduction: ${fmt(o.deduction80C)} — within the ₹1,50,000 cap. Old regime only.`,
    })
  }

  // Personal NPS
  if (data?.hasPersonalNPS && toNum(data.personalNPS) > 0) {
    rows.push({
      what: 'Your personal NPS investment',
      taxName: 'Section 80CCD(1B)',
      treatment: `Old regime only. Your deduction: ${fmt(o.deductionPersonalNPS)}. This sits over and above the ₹1.5L 80C limit — capped at ₹50,000.`,
    })
  }

  // Employer NPS
  if (data?.hasEmployerNPS && toNum(data.employerNPS) > 0) {
    rows.push({
      what: "Employer's NPS contribution",
      taxName: 'Section 80CCD(2)',
      treatment: `Available in both regimes. Capped at 14% of basic salary. Your deduction: ${fmt(o.employerNPSDeduction)}.`,
    })
  }

  // Health insurance
  if (data?.hasSelfInsurance && toNum(data.selfInsurancePremium) > 0) {
    const selfDed = Math.min(toNum(data.selfInsurancePremium), isSenior ? 50000 : 25000)
    const parentDed =
      data?.hasParentInsurance && toNum(data.parentInsurancePremium) > 0
        ? Math.min(toNum(data.parentInsurancePremium), data.parentsAbove60 ? 50000 : 25000)
        : 0
    rows.push({
      what: 'Health insurance premium',
      taxName: 'Section 80D',
      treatment:
        parentDed > 0
          ? `Self: ${fmt(selfDed)}, Parents: ${fmt(parentDed)} (total ${fmt(o.deduction80D)}). Old regime only.`
          : `Self: ${fmt(selfDed)}. Old regime only — capped at ${fmt(isSenior ? 50000 : 25000)} for your age group.`,
    })
  } else if (data?.hasParentInsurance && toNum(data.parentInsurancePremium) > 0) {
    rows.push({
      what: "Parents' health insurance premium",
      taxName: 'Section 80D',
      treatment: `Your deduction: ${fmt(o.deduction80D)}. Old regime only — cap is ₹${data.parentsAbove60 ? '50,000' : '25,000'} based on parent age.`,
    })
  }

  // Home loan interest
  if (
    data?.hasHomeLoan &&
    data?.loanOwnership !== 'other' &&
    toNum(data.homeLoanInterest) > 0
  ) {
    rows.push({
      what: 'Home loan interest',
      taxName: 'Section 24(b)',
      treatment: `Capped at ₹2,00,000 for self-occupied property. Your deduction: ${fmt(o.deductionHomeLoanInterest)}. Old regime only.`,
    })
  }

  // 87A rebate (always)
  rows.push({
    what: 'Government tax rebate',
    taxName: 'Section 87A',
    treatment:
      'New regime: ₹60,000 if taxable income is up to ₹12 lakh. Old regime: ₹12,500 if taxable income is up to ₹5 lakh (not available for super seniors).',
  })

  // Cess (always)
  rows.push({
    what: '4% Health & Education Cess',
    taxName: 'Finance Act',
    treatment:
      'Applied to tax after rebate in both regimes. If your tax after rebate is zero, cess is also zero.',
  })

  return rows
}

export default function SectionD_Education({ results, data }) {
  const [open, setOpen] = useState(false)
  const rows = buildRows(results, data)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-700">How did we calculate this?</span>
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
        <div className="px-4 pb-4 reveal">
          <p className="text-xs text-gray-500 mt-3 mb-4">
            Only items that apply to you are shown here.
          </p>
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
                  <span className="text-sm font-semibold text-gray-800">{row.what}</span>
                  <span className="text-xs text-indigo-600 font-medium">{row.taxName}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed ml-3.5 mt-1">
                  {row.treatment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
