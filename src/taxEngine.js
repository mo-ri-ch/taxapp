import {
  STANDARD_DEDUCTION_NEW,
  STANDARD_DEDUCTION_OLD,
  PROF_TAX_CAP,
  EMPLOYER_NPS_PCT_OF_BASIC,
  CAP_80C,
  CAP_80CCD1B,
  CAP_80D_SELF_BELOW60,
  CAP_80D_SELF_ABOVE60,
  CAP_80D_PARENTS_BELOW60,
  CAP_80D_PARENTS_ABOVE60,
  CAP_24B,
  CAP_80TTA,
  CAP_80TTB,
  REBATE_87A_NEW_INCOME_LIMIT,
  REBATE_87A_NEW_MAX,
  MARGINAL_RELIEF_THRESHOLD,
  REBATE_87A_OLD_INCOME_LIMIT,
  REBATE_87A_OLD_MAX,
  CESS_RATE,
  HRA_METRO_PCT,
  HRA_NONMETRO_PCT,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS_BELOW60,
  OLD_REGIME_SLABS_SENIOR,
  OLD_REGIME_SLABS_SUPER_SENIOR,
} from './constants.js'
import { calc80CTotal } from './utils.js'

function n(val) {
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

export function applySlabs(income, slabs) {
  if (income <= 0) return 0
  let tax = 0
  let prev = 0
  for (const { upTo, rate } of slabs) {
    if (upTo === null) {
      tax += (income - prev) * rate
      break
    }
    if (income <= upTo) {
      tax += (income - prev) * rate
      break
    }
    tax += (upTo - prev) * rate
    prev = upTo
  }
  return Math.round(tax)
}

export function getOldSlabs(ageGroup) {
  if (ageGroup === 'superSenior') return OLD_REGIME_SLABS_SUPER_SENIOR
  if (ageGroup === 'senior') return OLD_REGIME_SLABS_SENIOR
  return OLD_REGIME_SLABS_BELOW60
}

export function calculateGrossIncome(data) {
  const annualSalary = n(data.takeHomeSalaryMonthly) * 12
  const bonus = data.hasBonus ? n(data.bonus) : 0
  const fdInterest = data.hasOtherIncome ? n(data.fdInterest) : 0
  const savingsInterest = data.hasOtherIncome ? n(data.savingsInterest) : 0
  return annualSalary + bonus + fdInterest + savingsInterest
}

export function calculateHRAExemption(data) {
  if (!data.paysRent || !data.hasHRA) return 0
  const hraMonthly = n(data.hraMonthly)
  if (hraMonthly <= 0) return 0
  const annualHRA = hraMonthly * 12
  const annualBasic = n(data.basicSalaryMonthly) * 12
  const annualRent = n(data.monthlyRent) * 12
  const hraPct = data.cityType === 'metro' ? HRA_METRO_PCT : HRA_NONMETRO_PCT
  const c1 = annualHRA
  const c2 = hraPct * annualBasic
  const c3 = annualRent - 0.10 * annualBasic
  return Math.max(0, Math.round(Math.min(c1, c2, c3)))
}

function calculateEmployerNPSDeduction(data) {
  if (!data.hasEmployerNPS) return 0
  const annualBasic = n(data.basicSalaryMonthly) * 12
  const contribution = n(data.employerNPS)
  const cap = annualBasic * EMPLOYER_NPS_PCT_OF_BASIC
  return Math.min(contribution, cap)
}

function calculate80D(data) {
  let total = 0
  if (data.hasSelfInsurance) {
    const isSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
    const cap = isSenior ? CAP_80D_SELF_ABOVE60 : CAP_80D_SELF_BELOW60
    total += Math.min(n(data.selfInsurancePremium), cap)
  }
  if (data.hasParentInsurance) {
    const cap = data.parentsAbove60 ? CAP_80D_PARENTS_ABOVE60 : CAP_80D_PARENTS_BELOW60
    total += Math.min(n(data.parentInsurancePremium), cap)
  }
  return total
}

function calculate80TTA_TTB(data) {
  if (!data.hasOtherIncome) return 0
  const savings = n(data.savingsInterest)
  const fd = n(data.fdInterest)
  const isSenior = data.ageGroup === 'senior' || data.ageGroup === 'superSenior'
  if (isSenior) {
    return Math.min(savings + fd, CAP_80TTB)
  }
  return Math.min(savings, CAP_80TTA)
}

function calculateHomeLoanInterest(data) {
  if (!data.hasHomeLoan) return 0
  if (data.loanOwnership === 'other') return 0
  if (data.loanOwnership !== 'own' && data.loanOwnership !== 'joint') return 0
  return Math.min(n(data.homeLoanInterest), CAP_24B)
}

export function calculateNewRegimeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const standardDeduction = STANDARD_DEDUCTION_NEW
  const employerNPSDeduction = calculateEmployerNPSDeduction(data)

  const taxableIncome = Math.max(0, grossIncome - standardDeduction - employerNPSDeduction)
  const slabTax = applySlabs(taxableIncome, NEW_REGIME_SLABS)

  let rebate = 0
  if (taxableIncome <= REBATE_87A_NEW_INCOME_LIMIT) {
    rebate = Math.min(slabTax, REBATE_87A_NEW_MAX)
  }

  let taxAfterRebate = Math.max(0, slabTax - rebate)
  let marginalRelief = 0
  if (taxableIncome > MARGINAL_RELIEF_THRESHOLD && rebate === 0) {
    const excess = taxableIncome - MARGINAL_RELIEF_THRESHOLD
    if (taxAfterRebate > excess) {
      marginalRelief = taxAfterRebate - excess
      taxAfterRebate = excess
    }
  }

  const cess = Math.round(taxAfterRebate * CESS_RATE)
  const totalTax = taxAfterRebate + cess

  return {
    grossIncome,
    taxableIncome,
    standardDeduction,
    professionalTaxDeduction: 0,
    hraExemption: 0,
    deduction80C: 0,
    deduction80D: 0,
    deductionPersonalNPS: 0,
    employerNPSDeduction,
    deductionHomeLoanInterest: 0,
    deduction80TTA_TTB: 0,
    slabTax,
    rebate,
    marginalRelief,
    cess,
    totalTax,
  }
}

export function calculateOldRegimeTax(data) {
  const grossIncome = calculateGrossIncome(data)
  const standardDeduction = STANDARD_DEDUCTION_OLD

  const professionalTaxDeduction = data.hasProfTax
    ? Math.min(n(data.professionalTax), PROF_TAX_CAP)
    : 0

  const hraExemption = calculateHRAExemption(data)
  const deduction80C = Math.min(calc80CTotal(data), CAP_80C)
  const deduction80D = calculate80D(data)
  const deductionPersonalNPS = data.hasPersonalNPS
    ? Math.min(n(data.personalNPS), CAP_80CCD1B)
    : 0
  const employerNPSDeduction = calculateEmployerNPSDeduction(data)
  const deductionHomeLoanInterest = calculateHomeLoanInterest(data)
  const deduction80TTA_TTB = calculate80TTA_TTB(data)

  const totalDeductions =
    standardDeduction +
    professionalTaxDeduction +
    hraExemption +
    deduction80C +
    deduction80D +
    deductionPersonalNPS +
    employerNPSDeduction +
    deductionHomeLoanInterest +
    deduction80TTA_TTB

  const taxableIncome = Math.max(0, grossIncome - totalDeductions)
  const slabs = getOldSlabs(data.ageGroup)
  const slabTax = applySlabs(taxableIncome, slabs)

  let rebate = 0
  if (data.ageGroup !== 'superSenior' && taxableIncome <= REBATE_87A_OLD_INCOME_LIMIT) {
    rebate = Math.min(slabTax, REBATE_87A_OLD_MAX)
  }

  const taxAfterRebate = Math.max(0, slabTax - rebate)
  const cess = Math.round(taxAfterRebate * CESS_RATE)
  const totalTax = taxAfterRebate + cess

  return {
    grossIncome,
    taxableIncome,
    standardDeduction,
    professionalTaxDeduction,
    hraExemption,
    deduction80C,
    deduction80D,
    deductionPersonalNPS,
    employerNPSDeduction,
    deductionHomeLoanInterest,
    deduction80TTA_TTB,
    slabTax,
    rebate,
    marginalRelief: 0,
    cess,
    totalTax,
  }
}

export function compareRegimes(newResult, oldResult) {
  const recommended = newResult.totalTax <= oldResult.totalTax ? 'new' : 'old'
  const savings = Math.abs(newResult.totalTax - oldResult.totalTax)
  return { recommended, savings }
}

export function calculateTDSPosition(totalTax, tdsDeducted) {
  const tax = n(totalTax)
  const tds = n(tdsDeducted)
  if (tds > tax) return { type: 'refund', amount: tds - tax }
  if (tds < tax) return { type: 'payable', amount: tax - tds }
  return { type: 'settled', amount: 0 }
}

export function computeTax(data) {
  const newRegime = calculateNewRegimeTax(data)
  const oldRegime = calculateOldRegimeTax(data)
  const { recommended, savings } = compareRegimes(newRegime, oldRegime)

  const employerTDS = data.hasTDS ? n(data.tdsDeducted) : 0
  const bankTDS = n(data.bankTDS)
  const tdsDeducted = employerTDS + bankTDS
  const recommendedTotalTax = recommended === 'new' ? newRegime.totalTax : oldRegime.totalTax
  const tds = calculateTDSPosition(recommendedTotalTax, tdsDeducted)

  return {
    newRegime,
    oldRegime,
    recommended,
    savings,
    tds,
    tdsDeducted,
    employerTDS,
    bankTDS,
  }
}
