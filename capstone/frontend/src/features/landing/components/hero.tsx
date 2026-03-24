
export default function hero() {
  return (
    <section className="relative pt-32 pb-32 overflow-hidden mx-auto">
      <div className="max-w-[1440px] mx-auto px-12 grid grid-cols-12 gap-12 items-center">
        {/* Text */}
        <div className="col-span-12 lg:col-span-5">
          <h1 className="font-headline font-extrabold text-[4.5rem] leading-[1.1] text-primary mb-8 tracking-tighter">
            Your Wealth, <br />
            <span className="text-secondary italic">Perfectly</span> Deciphered.
          </h1>
          <p className="text-on-surface-variant text-xl mb-10 max-w-md leading-relaxed">
            The editorial-first financial ledger designed for small business
            leaders who demand clarity over clutter.
          </p>
          <div className="flex gap-4">
            <button className="cta-gradient text-on-primary px-10 py-4 rounded font-bold text-lg shadow-ambient hover:brightness-110 transition-all">
              Get Started
            </button>
            <button className="px-10 py-4 rounded font-bold text-lg text-primary bg-surface-container-high hover:bg-surface-container-highest transition-all">
              View Demo
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="col-span-12 lg:col-span-7 relative">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient border-outline-variant/15 border-[1px]">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
                  Total Revenue Portfolio
                </span>
                <div className="font-headline text-5xl font-extrabold text-primary mt-2">
                  $842,910.42
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-secondary font-bold bg-secondary-container px-3 py-1 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +12.4%
                </span>
              </div>
            </div>

            <div className="h-32 w-full bg-surface-container-low rounded-lg relative overflow-hidden mb-8">
              <div className="absolute inset-0 flex items-end">
                {/* Sparkline SVG omitted for brevity */}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Operating Margin
                </span>
                <div className="font-headline text-xl font-bold text-primary">
                  34.2%
                </div>
              </div>
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Cash Reserve
                </span>
                <div className="font-headline text-xl font-bold text-primary">
                  $124.5k
                </div>
              </div>
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Burn Rate
                </span>
                <div className="font-headline text-xl font-bold text-error">
                  $12.2k
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}