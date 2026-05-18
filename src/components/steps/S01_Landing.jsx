export default function S01_Landing({ goNext }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <HeroLeft goNext={goNext} />
          <HeroRight />
        </div>

        <FeatureCards />
        <BottomTrustStrip />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <CalculatorIcon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900 tracking-tight">TaxClarity</span>
      </div>
      <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-3 py-1">
        FY 2025-26
      </span>
    </header>
  )
}

function HeroLeft({ goNext }) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 w-fit mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        Know. Compare. Save.
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
        Find out{' '}
        <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-4">
          which tax regime
        </span>{' '}
        saves you more money this year.
      </h1>

      <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
        Answer a few simple questions about your salary and expenses. We'll compare both tax regimes
        and show you which one saves you more money — with a clear rupee-by-rupee estimate.
      </p>

      <div className="flex flex-wrap gap-4 mb-10">
        <TrustBullet icon="⏱" title="2 min" subtitle="Quick" />
        <TrustBullet icon="🔒" title="100% Free" subtitle="No sign-up" />
        <TrustBullet icon="🛡" title="Private" subtitle="No data stored" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 px-7 rounded-2xl text-sm transition-colors shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Start calculation
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium py-3.5 px-5 rounded-2xl text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 8l6 4-6 4V8z" />
          </svg>
          See how it works
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Built for salaried individuals only · FY 2025-26
      </p>
    </div>
  )
}

function TrustBullet({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  )
}

function HeroRight() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-indigo-100 rounded-3xl blur-3xl opacity-40 scale-95 translate-y-4"
      />
      <div className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/80 border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Your Tax Summary
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">FY 2025-26</p>
          </div>
          <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
            Sample
          </span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white mb-5">
          <p className="text-xs text-indigo-200 font-medium mb-1">You Save</p>
          <p className="text-3xl font-black tracking-tight">₹18,540</p>
          <p className="text-xs text-indigo-200 mt-1.5">
            New regime wins for your salary profile
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <RegimeMiniCard label="New Regime" tax="₹62,400" winner />
          <RegimeMiniCard label="Old Regime" tax="₹80,940" />
        </div>

        <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-500">
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Refund expected: ₹4,260
        </div>
      </div>
    </div>
  )
}

function RegimeMiniCard({ label, tax, winner }) {
  return (
    <div
      className={
        winner
          ? 'rounded-xl border-2 border-indigo-200 bg-indigo-50/60 p-3'
          : 'rounded-xl border border-gray-200 bg-gray-50 p-3'
      }
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        {winner && (
          <span className="text-[9px] font-bold text-green-700 bg-green-100 rounded-full px-1.5 py-0.5">
            Best
          </span>
        )}
      </div>
      <p className={`text-lg font-bold ${winner ? 'text-indigo-800' : 'text-gray-700'}`}>
        {tax}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5">total tax</p>
    </div>
  )
}

function FeatureCards() {
  const features = [
    {
      icon: '⚖️',
      title: 'Old vs New Regime Comparison',
      body: 'See both regimes side-by-side with every deduction laid out clearly.',
    },
    {
      icon: '💰',
      title: 'Exact Amount You Save',
      body: 'Rupee-by-rupee breakdown — no vague "about" or "approximately".',
    },
    {
      icon: '📥',
      title: 'Refund or Tax Due',
      body: 'Find out if you get money back or owe more, against your TDS.',
    },
    {
      icon: '🗣️',
      title: 'Plain English, No CA Jargon',
      body: 'Section 80C, 87A, marginal relief — all explained in normal words.',
    },
  ]

  return (
    <section className="mt-24 lg:mt-28">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
          What you get
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          A complete picture in 2 minutes
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl mb-3">
              <span aria-hidden="true">{f.icon}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 leading-snug">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function BottomTrustStrip() {
  return (
    <section className="mt-16 lg:mt-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center sm:text-left">
      <TrustItem
        icon={
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        }
        title="100% Private"
        subtitle="Data never leaves your browser"
      />
      <TrustItem
        icon={
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
        title="Instant results"
        subtitle="No backend, no waiting"
      />
      <TrustItem
        icon={
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="FY 2025-26 rules"
        subtitle="Based on latest tax slabs"
      />
    </section>
  )
}

function TrustItem({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <div className="leading-tight">
        <div className="text-sm font-semibold text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-6 text-center text-xs text-gray-400">
      Built for salaried individuals · FY 2025-26 · No data saved
    </footer>
  )
}

function CalculatorIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path strokeLinecap="round" d="M9 7h6M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />
    </svg>
  )
}
