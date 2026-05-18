import { useEffect, useRef, useState } from 'react'
import { computeTax } from '../../taxEngine.js'

const STEPS = [
  'Adding up all your income',
  'Applying your salary components',
  'Computing old regime with all deductions',
  'Computing new regime',
  'Comparing both regimes',
  'Finding the best option for you',
]

const STEP_INTERVAL = 380
const FINAL_BUFFER = 300
const HANDOFF_DELAY = 400

export default function S13_Calculating({ data, goNext, setResults }) {
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const timers = []
    for (let i = 0; i < STEPS.length; i++) {
      timers.push(
        setTimeout(() => {
          setActiveStep(i)
          if (i > 0) {
            setDoneSteps((prev) => [...prev, i - 1])
          }
        }, i * STEP_INTERVAL),
      )
    }

    const totalDelay = STEPS.length * STEP_INTERVAL + FINAL_BUFFER
    timers.push(
      setTimeout(() => {
        setDoneSteps(STEPS.map((_, i) => i))
        try {
          const results = computeTax(data)
          setResults(results)
        } catch (err) {
          console.error('Tax computation failed:', err)
        }
        timers.push(setTimeout(() => goNext(), HANDOFF_DELAY))
      }, totalDelay),
    )

    return () => timers.forEach(clearTimeout)
  }, [data, goNext, setResults])

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 bg-[#FAFAFA] font-sans">
      <div className="max-w-sm w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <h1 className="text-xl font-bold text-gray-900 mt-6">Crunching your numbers...</h1>
          <p className="text-sm text-gray-500 mt-1">This will take just a moment</p>
        </div>

        <ol className="space-y-3">
          {STEPS.map((label, i) => {
            const isDone = doneSteps.includes(i)
            const isActive = !isDone && activeStep === i
            const isUpcoming = !isDone && !isActive
            return (
              <li
                key={i}
                className={`flex items-center gap-3 ${
                  isUpcoming ? 'opacity-30' : ''
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-green-500'
                      : isActive
                        ? 'bg-indigo-600'
                        : 'bg-gray-200'
                  }`}
                >
                  {isDone ? (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  )}
                </span>
                <span
                  className={`text-sm ${
                    isDone
                      ? 'text-green-700 font-medium'
                      : isActive
                        ? 'text-indigo-700 font-medium'
                        : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
