export default function ConfusedLink({ faqRef, label = 'Not sure? See examples' }) {
  return (
    <button
      type="button"
      onClick={() => faqRef?.current?.openAndScroll()}
      className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 underline decoration-dotted underline-offset-2 transition-colors"
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
      </svg>
      {label}
    </button>
  )
}
