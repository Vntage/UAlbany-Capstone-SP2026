import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const revenueData = [50000, 100000, 80000, 150000, 70000, 250000, 300000];
  const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | null>(null);

  // Measure container width after mount
  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setSvgWidth(containerRef.current.clientWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (svgWidth === null) {
    // Don't render SVG until width is measured
    return (
      <section className="relative pt-32 md:pt-40 lg:pt-48 pb-32 bg-sky-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 flex flex-col lg:flex-row items-center lg:items-center gap-y-20 lg:gap-y-0 lg:gap-x-32">
          {/* Left Text Section */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1">
            <h1 className="font-headline font-extrabold text-5xl md:text-[4.5rem] leading-tight text-sky-900 mb-12 tracking-tight">
              Your Wealth, <br />
              <span className="text-sky-600 italic">Perfectly</span> Deciphered.
            </h1>
            <p className="text-sky-800 text-lg md:text-xl mb-10 max-w-md leading-relaxed">
              Your business finances, organized and readable, so you can make decisions with confidence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/signup">
                <button className="bg-sky-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow hover:bg-sky-700 transition-all">
                  Get Started
                </button>
              </Link>
              <button className="px-8 py-4 rounded-lg font-bold text-sky-700 bg-white border border-sky-300 hover:bg-sky-100 transition-all">
                View Demo
              </button>
            </div>
          </div>

          {/* Right Dashboard Section placeholder */}
          <div ref={containerRef} className="flex justify-center lg:justify-end w-full lg:flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 w-full max-w-3xl h-48"></div>
          </div>
        </div>
      </section>
    );
  }

  // SVG calculations
  const svgHeight = 180;
  const padding = 30;
  const stepX = (svgWidth - 2 * padding) / (revenueData.length - 1);
  const maxY = Math.max(...revenueData);
  const points = revenueData
    .map((val, idx) => {
      const x = padding + idx * stepX;
      const y = svgHeight - padding - (val / maxY) * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");
  const pathD = `M${points.replace(/ /g, " L")}`;

  return (
    <section className="relative pt-32 md:pt-40 lg:pt-48 pb-32 bg-sky-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 flex flex-col lg:flex-row items-center lg:items-center gap-y-20 lg:gap-y-0 lg:gap-x-32">

        {/* Left Text Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:flex-1">
          <h1 className="font-headline font-extrabold text-5xl md:text-[4.5rem] leading-tight text-sky-900 mb-12 tracking-tight">
            Your Wealth, <br />
            <span className="text-sky-600 italic">Perfectly</span> Deciphered.
          </h1>
          <p className="text-sky-800 text-lg md:text-xl mb-10 max-w-md leading-relaxed">
            Your business finances, organized and readable, so you can make decisions with confidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link to="/signup">
              <button className="bg-sky-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow hover:bg-sky-700 transition-all">
                Get Started
              </button>
            </Link>
            <button className="px-8 py-4 rounded-lg font-bold text-sky-700 bg-white border border-sky-300 hover:bg-sky-100 transition-all">
              View Demo
            </button>
          </div>
        </div>

        {/* Right Dashboard Section */}
        <div className="flex justify-center lg:justify-end w-full lg:flex-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 w-full max-w-3xl">

            {/* Header */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="font-label text-xs uppercase tracking-widest text-sky-500 font-semibold">
                  Total Revenue Portfolio
                </span>
                <div className="font-headline text-4xl md:text-5xl font-extrabold text-sky-900 mt-2">
                  $842,910
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full text-sm">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +12.4%
                </span>
              </div>
            </div>

            {/* Revenue Line Chart */}
            <div className="h-48 w-full bg-sky-100 rounded-lg relative overflow-hidden mb-6 flex items-center justify-center">
              <svg width={svgWidth} height={svgHeight}>
                {/* X Axis */}
                <line
                  x1={padding}
                  y1={svgHeight - padding}
                  x2={svgWidth - padding}
                  y2={svgHeight - padding}
                  stroke="#94a3b8"
                  strokeWidth={1}
                />
                {/* X Labels */}
                {xLabels.map((label, idx) => {
                  const x = padding + idx * stepX;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={svgHeight - padding + 15}
                      fontSize="10"
                      textAnchor="middle"
                      fill="#64748b"
                    >
                      {label}
                    </text>
                  );
                })}
                {/* Revenue Line */}
                <path
                  ref={(el) => {
                    if (!el) return;
                    const length = el.getTotalLength();
                    el.style.strokeDasharray = length.toString();
                    el.style.strokeDashoffset = length.toString();
                    setTimeout(() => {
                      el.style.transition = "stroke-dashoffset 2s ease-in-out";
                      el.style.strokeDashoffset = "0";
                    }, 50);
                  }}
                  d={pathD}
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                {/* Data Points */}
                {revenueData.map((val, idx) => {
                  const x = padding + idx * stepX;
                  const y = svgHeight - padding - (val / maxY) * (svgHeight - 2 * padding);
                  return <circle key={idx} cx={x} cy={y} r={4} fill="#0ea5e9" />;
                })}
              </svg>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-sky-500">
                  Operating Margin
                </span>
                <div className="font-headline text-xl font-bold text-sky-900">34.2%</div>
              </div>
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-sky-500">
                  Cash Reserve
                </span>
                <div className="font-headline text-xl font-bold text-sky-900">$124.5k</div>
              </div>
              <div className="space-y-1">
                <span className="font-label text-[10px] uppercase tracking-widest text-red-500">
                  Burn Rate
                </span>
                <div className="font-headline text-xl font-bold text-red-700">$12.2k</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}