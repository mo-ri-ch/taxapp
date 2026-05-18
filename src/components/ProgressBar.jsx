export default function ProgressBar({ current, total, stepName }) {
  const dots = Array.from({ length: total }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-gray-700">
          Step {current} of {total}
        </span>
        {stepName && (
          <>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-xs text-gray-500 truncate max-w-[160px] hidden sm:inline">
              {stepName}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-1 justify-end">
        {dots.map((i) => {
          let dotClass
          if (i < current) dotClass = 'w-2 h-2 bg-indigo-600'
          else if (i === current) dotClass = 'w-2 h-2 bg-indigo-300'
          else dotClass = 'w-1.5 h-1.5 bg-gray-200'
          const valueNow = Math.round((Math.min(i, current) / total) * 100)
          return (
            <span
              key={i}
              role="progressbar"
              aria-valuenow={valueNow}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`rounded-full transition-all duration-300 ${dotClass}`}
            />
          )
        })}
      </div>
    </div>
  )
}
