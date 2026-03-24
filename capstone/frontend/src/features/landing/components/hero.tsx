export default function Hero() {
  return (
    <section className="relative pt-32 pb-32 bg-sky-50 overflow-hidden mt-25">
      {/* Center content horizontally with max width */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-12 gap-12 items-center">
        
        {/* Text */}
        <div className="col-span-12 lg:col-span-5 text-center lg:text-left">
          <h1 className="font-headline font-extrabold text-5xl md:text-[4.5rem] leading-tight text-sky-900 mb-6 tracking-tight">
            Your Wealth, <br />
            <span className="text-sky-600 italic">Perfectly</span> Deciphered.
          </h1>
          <p className="text-sky-800 text-lg md:text-xl mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            The editorial-first financial ledger designed for small business
            leaders who demand clarity over clutter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button className="bg-sky-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow hover:bg-sky-700 transition-all">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-lg font-bold text-sky-700 bg-white border border-sky-300 hover:bg-sky-100 transition-all">
              View Demo
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="col-span-12 lg:col-span-7 relative">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="font-label text-xs uppercase tracking-widest text-sky-500 font-semibold">
                  Total Revenue Portfolio
                </span>
                <div className="font-headline text-4xl md:text-5xl font-extrabold text-sky-900 mt-2">
                  $842,910.42
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +12.4%
                </span>
              </div>
            </div>

            <div className="h-32 w-full bg-sky-100 rounded-lg relative overflow-hidden mb-6">
              <div className="absolute inset-0 flex items-end">
                {/* Sparkline SVG or mockup goes here */}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-sky-500">
                  Operating Margin
                </span>
                <div className="font-headline text-xl font-bold text-sky-900">
                  34.2%
                </div>
              </div>
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-sky-500">
                  Cash Reserve
                </span>
                <div className="font-headline text-xl font-bold text-sky-900">
                  $124.5k
                </div>
              </div>
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-red-500">
                  Burn Rate
                </span>
                <div className="font-headline text-xl font-bold text-red-700">
                  $12.2k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}