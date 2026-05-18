import { useState } from 'react'
import S01_Landing from './components/steps/S01_Landing.jsx'
import S02_FinancialYear from './components/steps/S02_FinancialYear.jsx'
import S03_AgeGroup from './components/steps/S03_AgeGroup.jsx'
import S04_SalaryDetails from './components/steps/S04_SalaryDetails.jsx'
import S05_SalaryComponents from './components/steps/S05_SalaryComponents.jsx'
import S06_OtherIncome from './components/steps/S06_OtherIncome.jsx'
import S07_PaysRent from './components/steps/S07_PaysRent.jsx'
import S08_RentDetails from './components/steps/S08_RentDetails.jsx'
import S09_TaxSavingInvestments from './components/steps/S09_TaxSavingInvestments.jsx'
import S10_HealthInsurance from './components/steps/S10_HealthInsurance.jsx'
import S11_HomeLoan from './components/steps/S11_HomeLoan.jsx'
import S12_TDS from './components/steps/S12_TDS.jsx'
import S13_Calculating from './components/steps/S13_Calculating.jsx'
import S14_Results from './components/steps/S14_Results.jsx'
import StepWrapper from './components/StepWrapper.jsx'

export const INITIAL_STATE = {
  fy: '2025-26',
  ageGroup: null,
  basicSalaryMonthly: '',
  takeHomeSalaryMonthly: '',
  hasBonus: null,
  bonus: '',
  hasHRA: false,
  hraMonthly: '',
  hasProfTax: false,
  professionalTax: '',
  hasEmployerNPS: false,
  employerNPS: '',
  hasOtherIncome: null,
  fdInterest: '',
  savingsInterest: '',
  paysRent: null,
  monthlyRent: '',
  cityType: null,
  hasHRAInSalary: null,
  investments80C: {
    epf: '',
    lic: '',
    ppf: '',
    elss: '',
    tuition: '',
    homeLoanPrincipal: '',
    nsc: '',
  },
  has80CItems: [],
  hasPersonalNPS: null,
  personalNPS: '',
  hasSelfInsurance: null,
  selfInsurancePremium: '',
  hasParentInsurance: null,
  parentInsurancePremium: '',
  parentsAbove60: null,
  hasHomeLoan: null,
  loanOwnership: null,
  homeLoanInterest: '',
  hasTDS: null,
  tdsDeducted: '',
  bankTDS: '',
}

const PROGRESS_STEPS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const TOTAL_PROGRESS = 10

const STEP_NAMES = {
  2: 'Financial Year',
  3: 'Your Age Group',
  4: 'Salary Details',
  5: 'Salary Components',
  6: 'Other Income',
  7: 'Housing',
  8: 'Rent Details',
  9: 'Investments',
  10: 'Health Insurance',
  11: 'Home Loan',
  12: 'TDS Deducted',
}

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INITIAL_STATE)
  const [results, setResults] = useState(null)

  function update(fields) {
    setData((prev) => ({ ...prev, ...fields }))
  }
  function goNext() {
    setStep((s) => s + 1)
  }
  function goBack() {
    setStep((s) => Math.max(1, s - 1))
  }
  function skipTo(targetStep) {
    setStep(targetStep)
  }
  function reset() {
    setData(INITIAL_STATE)
    setResults(null)
    setStep(1)
  }

  const showProgress = PROGRESS_STEPS.includes(step)
  const progressStep = PROGRESS_STEPS.indexOf(step) + 1
  const stepName = STEP_NAMES[step]

  function stepAwareGoBack() {
    if (step === 9 && !data.paysRent) {
      skipTo(7)
      return
    }
    goBack()
  }

  const sharedProps = {
    data,
    update,
    goNext,
    goBack,
    skipTo,
    step,
    progressStep,
    showProgress,
    TOTAL_PROGRESS,
    reset,
  }

  if (step === 1) {
    return <S01_Landing goNext={goNext} />
  }

  if (step === 13) {
    return <S13_Calculating data={data} goNext={goNext} setResults={setResults} />
  }

  if (step === 14) {
    return <S14_Results results={results} data={data} reset={reset} skipTo={skipTo} />
  }

  return (
    <StepWrapper
      goBack={stepAwareGoBack}
      reset={reset}
      showProgress={showProgress}
      progressStep={progressStep}
      TOTAL_PROGRESS={TOTAL_PROGRESS}
      step={step}
      stepName={stepName}
      showPreview
      data={data}
    >
      {step === 2 && <S02_FinancialYear {...sharedProps} />}
      {step === 3 && <S03_AgeGroup {...sharedProps} />}
      {step === 4 && <S04_SalaryDetails {...sharedProps} />}
      {step === 5 && <S05_SalaryComponents {...sharedProps} />}
      {step === 6 && <S06_OtherIncome {...sharedProps} />}
      {step === 7 && <S07_PaysRent {...sharedProps} />}
      {step === 8 && <S08_RentDetails {...sharedProps} />}
      {step === 9 && <S09_TaxSavingInvestments {...sharedProps} />}
      {step === 10 && <S10_HealthInsurance {...sharedProps} />}
      {step === 11 && <S11_HomeLoan {...sharedProps} />}
      {step === 12 && <S12_TDS {...sharedProps} />}
    </StepWrapper>
  )
}
